"use strict";

var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = {{src/collector.html}};
    document.body.appendChild(div);
    addNoSelect(div.querySelectorAll("*"));

    // some some margin at the bottom of the page
    var currentMargin = parseInt(document.body.style.marginBottom, 10);
    if ( isNaN(currentMargin) ) {
        marginBottom = 0;
    } else {
        marginBottom = currentMargin;
    }
    document.body.style.marginBottom = (marginBottom + 500) + "px";
})();

/*********************************
            GLOBALS
*********************************/
/*
Object that stores information related to elements that match the current selector
(and how to select them)
*/
var Collect = {
    one: function(selector, prefix){
        return document.querySelector(Collect.not(selector, prefix));
    },
    all: function(selector, prefix){
        return document.querySelectorAll(Collect.not(selector, prefix));
    },
    not: function(selector, prefix){
        selector += ":not(.noSelect)";
        prefix = prefix || "body";
        return prefix ? prefix + " " + selector : selector;
    },
    /*
    matches elements in a page based on selector
    if Collect.parent is defined, limit selected elements to children of elements matching Collect.parent.selector
    if Collect.parent.high/low are defined, only use Collect.parent.selector elements within that range
    */
    matchedElements: function(selector){
        var allElements = [];
        if ( UI.activeSelector === "selector" && this.parent ) {
            var low = this.parent.low || 0,
                high = this.parent.high || 0;
            if ( low !== 0 || high !== 0 ) {
                // if either high or low is defined, 
                // iterate over all child elements of elements matched by parent selector
                var parents = document.querySelectorAll(this.parent.selector),
                    // add high because it is negative
                    end = parents.length + high,
                    currElements;
                for ( ; low<end; low++ ) {
                    currElements = parents[low].querySelectorAll(this.not(selector));
                    allElements = allElements.concat(Array.prototype.slice.call(currElements));
                }
            } else {
                allElements = this.all(selector, this.parent.selector);
            }
        } else {
            // don't care about parent when choosing next selector or a new parent selector
            allElements = this.all(selector, "body");
        }
        return Array.prototype.slice.call(allElements);
    },
    options: {},
    elements: [],
    current: {
        schema: undefined,
        page: undefined,
        set: undefined,
        selector: undefined
    },
    // parent.selector is set when Collect.current.set index=true
    parent: {},
    // currently loaded Schema
    schema: undefined
};

/*
Object that controls the functionality of the interface
*/
var UI = {
    activeForm: "rule",
    activeSelector: "selector",
    editing: {},
    tabs: {
        tab: document.querySelector(".tab.active"),
        view: document.querySelector(".view.active")
    },
    preview: {
        dirty: true
    },
    setup: function(){        
        loadOptions();
        setupHostname();
        this.events();

        setupSelectorView();
        setupRulesView();
    },
    /*
    adds events listeners based on whether or not Collect.parent.elector is set
    if it is, only add them to children of that element, otherwise add them to all elements
    that don't have the noSelect class
    store elements with eventlisteners in this.elements
    */
    turnSelectorsOn: function(){
        var curr;
        this.turnSelectorsOff();
        Collect.elements = Collect.matchedElements("*");

        for ( var i=0, len=Collect.elements.length; i<len; i++ ) {
            curr = Collect.elements[i];
            curr.addEventListener('click', Family.create, false);
            curr.addEventListener('mouseenter', highlightElement, false);
            curr.addEventListener('mouseleave', unhighlightElement, false);
        }
        clearSelectorClasses();
    },
    /*
    removes event listeners from elements in this.elements
    */
    turnSelectorsOff: function(){
        var curr;
        for ( var i=0, len=Collect.elements.length; i<len; i++ ) {
            curr = Collect.elements[i];
            curr.removeEventListener('click', Family.create);
            curr.removeEventListener('mouseenter', highlightElement);
            curr.removeEventListener('mouseleave', unhighlightElement);
            
        }
        Collect.elements = [];
    },
    events: function(){
        // tabs
        tabEvents();

        //views
        selectorViewEvents();
        ruleViewEvents();
        optionsViewEvents();
        permanentBarEvents();
    }
};

// save commonly referenced to elements
var HTML = {
    // elements in the selector view
    selector: {
        family: document.getElementById("selectorHolder"),
        selector: document.getElementById("currentSelector"),
        count: document.getElementById("currentCount"),
        parent: {
            holder: document.getElementById("parentRange"),
            low: document.getElementById("parentLow"),
            high: document.getElementById("parentHigh")
        },
        radio: {
            selector: document.getElementById("selectorRadio"),
            parent: document.getElementById("parentRadio"),
            next: document.getElementById("nextRadio")
        }
    },
    // elements in the rule view
    rule: {
        selector: document.getElementById("ruleSelector"),
        form: document.getElementById("ruleForm"),
        name: document.getElementById("ruleName"),
        capture: document.getElementById("ruleAttr"),
        follow: document.getElementById("ruleFollow"),
        followHolder: document.querySelector("#ruleItems .follow")
    },
    // elements in the the permament bar
    perm: {
        schema: {
            select: document.getElementById("schemaSelect"),
            holder: document.getElementById("schemaHolder"),
            index: {
                holder: document.getElementById("indexMarker"),
                checkbox: document.getElementById("indexToggle")
            }
        },
        page: {
            select: document.getElementById("pageSelect"),
            next: {
                holder: document.getElementById("nextHolder"),
                selector: document.getElementById("nextSelectorView")
            }
        },
        set: {
            select: document.getElementById("selectorSetSelect")
        },
        parent: {
            holder: document.getElementById("currentParent"),
            selector: document.getElementById("parentSelectorView"),
            range: document.getElementById("parentRangeView")
        },
        alert: document.getElementById("collectAlert"),
    },
    ui: document.querySelector(".collectjs"),
    preview: {
        contents: document.getElementById("previewContents")
    },
    tabs: {
        selector: document.getElementById("selectorTab"),
        rule: document.getElementById("ruleTab"),
        schema: document.getElementById("schemasTab"),
        preview: document.getElementById("previewTab"),
        options: document.getElementById("optionsTab")
    }
};

// Family derived from clicked element in the page
var Family = {
    family: undefined,
    create: function(event){
        event.stopPropagation();
        event.preventDefault();

        Family.family = new SelectorFamily(this,
            Collect.parent.selector,
            HTML.selector.family,
            HTML.selector.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family.update();
        showTab(HTML.tabs.selector);
    },
    edit: function(selector){
        var eles = Collect.matchedElements(selector);
        if ( !eles.length ) {
            return;
        }
        Family.family = new SelectorFamily(eles[0],
            Collect.parent.selector,
            HTML.selector.family,
            HTML.selector.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family.update();
        showTab(HTML.tabs.selector);  
    },
    remove: function(){
        if ( this.family ) {
            this.family.remove();
            this.family = undefined;
        }
    },
    // create a SelectorFamily given a css selector string
    fromSelector: function(selector){
        var prefix = Collect.parent.selector ? Collect.parent.selector: "body",
            element = Collect.one(selector, prefix);
        if ( element ) {
            this.family = new SelectorFamily(element,
                Collect.parent.selector,
                HTML.selector.family,
                HTML.selector.selector,
                Family.test.bind(Family),
                Collect.options
            );
            this.family.match(selector);
        }    
    },
    // returns a string representing the current selector or if none, an empty string
    selector: function(){
        if ( this.family ) {
            return this.family.toString();
        } else {
            return "";
        }
    },
    // uses current SelectorFamily's computed selector to match elements in the page
    // uses Collect.parent to limit matches
    elements: function(){
        var selector = this.selector();
        if ( selector === "") {
            return [];
        }
        return Collect.matchedElements(selector);
    },
    /*
    sets Collect.matchedElements to elements matching the current selector
    */
    match: function(){
        Collect.elements = this.elements();
    },
    /*
    add queryCheck class to all elements matching selector
    set the count based on number of matching elements
    set the preview
    */
    test: function(){
        clearClass("queryCheck");
        clearClass("collectHighlight");
        var elements = this.elements(),
            totalCount;
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        totalCount = elements.length ? elements.length : "";

        HTML.selector.count.textContent = elementCount(totalCount, Collect.parentCount);
        this.match();
        UI.selectorCycle.setElements(Collect.elements);
    },
    /*
    only select elements that fall between low/elements.length + high (because high is negative)
    applies a range to the elements selected by the current selector
    */
    range: function(low, high){
        Family.match();
        var len = Collect.elements.length;
        Collect.elements = Array.prototype.slice.call(Collect.elements).slice(low, len + high);
        UI.selectorCycle.setElements(Collect.elements);
    }
};

UI.setup();

/*
reset state of interface
especially useful for when cancelling creating or editing a selector or rule
*/
function resetInterface(){
    UI.editing = {};
    if ( Collect.parent.selector ) {
        addParentSchema(Collect.parent);
    }
    clearSelectorClasses();
    resetSelectorView();
    resetRulesView();
}

function clearSelectorClasses(){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    clearClass("savedPreview");
}

function resetSelectorView(){
    Family.remove();

    UI.activeSelector = "selector";
    UI.selectorCycle.reset();

    HTML.selector.radio.selector.checked = true;
    HTML.selector.radio.parent.disabled = false;
    HTML.selector.radio.next.disabled = false;
    HTML.selector.parent.holder.style.display = "none";
    HTML.selector.parent.low.value = "";
    HTML.selector.parent.high.value = "";
    HTML.selector.count.textContent = "";
}

function resetRulesView(){
    Family.remove();

    UI.ruleCycle.reset();
    HTML.rule.selector.textContent = "";

    // reset rule form
    HTML.rule.name.value = "";
    HTML.rule.capture.textContent = "";
    HTML.rule.follow.checked = false;
    HTML.rule.follow.disabled = true;
    HTML.rule.followHolder.style.display = "none";
}

/******************
    EVENTS
******************/

// encapsulate event activeTabEvent to keep track of current tab/view
function tabEvents(){
    idEvent("closeCollect", "click", function removeInterface(event){
        event.stopPropagation();
        event.preventDefault();
        UI.turnSelectorsOff();
        clearSelectorClasses();
        clearClass("parentSchema");
        HTML.ui.parentElement.removeChild(HTML.ui);
        document.body.style.marginBottom = marginBottom + "px";
    });

    // querySelectorAll because getElementsByClassName could overlap with native elements
    var tabs = document.querySelectorAll(".tabHolder .tab");
    for ( var key in HTML.tabs ) {
        HTML.tabs[key].addEventListener("click", showTabEvent, false);
    }

    function showTabEvent(event){
        resetInterface();
        showTab(this);
    }
}

function setupSelectorView(){
    UI.selectorCycle = new Cycle(document.getElementById("selectorCycleHolder"));
}

function setupRulesView() {
    UI.ruleCycle = new Cycle(document.getElementById("ruleCycleHolder"), true);   
}

function selectorViewEvents(){
    idEvent("saveSelector", "click", saveSelectorEvent);
    idEvent("clearSelector", "click", clearSelectorEvent);
    idEvent("selectorRadio", "change", updateRadioEvent);
    idEvent("parentRadio", "change", updateRadioEvent);
    idEvent("nextRadio", "change", updateRadioEvent);
}

function ruleViewEvents(){
    idEvent("saveRule", "click", saveRuleEvent);
    idEvent("cancelRule", "click", cancelRuleEvent);

    idEvent("parentLow", "blur", verifyAndApplyParentRange);
    idEvent("parentHigh", "blur", verifyAndApplyParentRange);
}

function optionsViewEvents(){
    idEvent("ignore", "change", function toggleTabOption(event){
        // if option exists, toggle it, otherwise set based on whether or not html element is checked
        if ( Collect.options.ignore ) {
            Collect.options.ignore = !Collect.options.ignore;
        } else {
            Collect.options.ignore = document.getElementById("ignore").checked;
        }
        setOptions(Collect.options);
    });
}

function permanentBarEvents(){
    // schema events
    idEvent("schemaSelect", "change", function loadSchemaEvent(event){
        event.preventDefault();
        loadSchema(this);
    });

    idEvent("createSchema", "click", function newSchemaEvent(event){
        event.preventDefault();
        createSchema();
    });

    idEvent("deleteSchema", "click", function deleteSchemaEvent(event){
        event.preventDefault();
        deleteSchema();
    });

    // page events
    idEvent("pageSelect", "change", function loadPageEvent(event){
        event.preventDefault();
        loadPage(this);
    });

    idEvent("deletePage", "click", function deletePageEvent(event){
        event.preventDefault();
        deletePage();
    });

    // don't need to create a page, those are automatically made when creating a rule that captures
    // attr-href and follow=true

    // rule set events
    idEvent("createSelectorSet", "click", function newSelectorSetEvent(event){
        event.preventDefault();
        createSelectorSet();
    });

    idEvent("selectorSetSelect", "change", function loadSetEvent(event){
        event.preventDefault();
        loadSet(this);
    });

    idEvent("deleteSelectorSet", "click", function deleteSelectorSetEvent(event){
        event.preventDefault();
        deleteSelectorSet();
    });

    idEvent("removeParent", "click", deleteParentEvent);
    idEvent("removeNext", "click", deleteNextEvent);

    // upload events
    idEvent("uploadRules", "click", function uploadEvent(event){
        event.preventDefault();
        uploadSchema();
    });

    // index events
    idEvent("indexToggle", "change", toggleURLEvent);
}

// add .collectHighlight to an element on mouseenter
function highlightElement(event){
    this.classList.add("collectHighlight");
}

// remove .collectHighlight from an element on mouseleave
function unhighlightElement(event){
    this.classList.remove("collectHighlight");
}

function cancelRuleEvent(event){
    event.stopPropagation();
    event.preventDefault();
    resetInterface();
    showTab(HTML.tabs.schema);
}

function verifyAndApplyParentRange(event){
    var lowVal = HTML.selector.parent.low.value,
        highVal = HTML.selector.parent.high.value,
        low = parseInt(lowVal, 10),
        high = parseInt(highVal, 10),
        error = false;

    if ( lowVal !== "" ) {
        if ( isNaN(low) || low <= 0 ) {
            HTML.selector.parent.low.value = "";
            alertMessage("Low must be positive integer greater than 0");    
            error = true;
        }
    } else { 
        low = 0;
    }

    if ( highVal !== "" ) {
        if ( isNaN(high) || high > 0 ) {
            HTML.selector.parent.high.value = "";
            alertMessage("High must be negative integer");    
            error = true;
        }
    } else {
        high = 0;
    }

    if ( error ) {
        return;
    }

    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.elements);
    
    HTML.selector.count.textContent = elementCount(Collect.elements.length, Collect.parentCount);
}

/*
if the .capture element clicked does not have the .selected class, set attribute to capture
otherwise, clear the attribute to capture
toggle .selected class
*/
function capturePreview(event){
    var capture = HTML.rule.capture,
        follow = HTML.rule.follow,
        followHolder = HTML.rule.followHolder;

    if ( !this.classList.contains("selected") ){
        clearClass("selected");
        var elements = Family.elements(),
            captureVal = this.dataset.capture;
        capture.textContent = captureVal;
        this.classList.add("selected");

        // toggle follow based on if capture is attr-href or something else
        if ( captureVal === "attr-href" && allLinks(Collect.elements) ){
            followHolder.style.display = "block";
            follow.removeAttribute("disabled");
            follow.setAttribute("title", "Follow link to get data for more rules");
        } else {
            followHolder.style.display = "none";
            follow.checked = false;
            follow.setAttribute("disabled", "true");
            follow.setAttribute("title", "Can only follow rules that get href attribute from links");
        }
    } else {
        capture.textContent = "";
        follow.disabled = true;
        followHolder.style.display = "none";
        this.classList.remove("selected");
    }   
}
/******************
    SELECTOR EVENTS
******************/
function saveSelectorEvent(event){
    event.preventDefault();
    clearErrors();
    var selector = HTML.selector.selector.textContent;
    if ( emptyErrorCheck(selector, HTML.selector.selector, "No CSS selector selected") ) {
        return;
    }

    switch(UI.activeSelector){
    case "selector":
        saveSelector(selector);
        break;
    case "parent":
        saveParent(selector);
        break;
    case "next":
        saveNext(selector);
        break;
    }
    resetInterface();
}

function saveSelector(selector){
    var sel = new Selector(selector);
    // if editing just update the selector, otherwise add it to the current set
    if ( UI.editing.selector ) {
        UI.editing.selector.updateSelector(selector);
        showTab(HTML.tabs.schema);
    } else {
        addSelector(sel, Collect.current.set);
    }
    saveSchema();
}

function saveParent(selector){
    var low = parseInt(HTML.selector.parent.low.value, 10),
        high = parseInt(HTML.selector.parent.high.value, 10),
        parent = {
            selector: selector
        };

    Collect.parentCount = Collect.elements.length;

    if ( !isNaN(low) ) {
        parent.low = low;
    }
    if ( !isNaN(high) ) {
        parent.high = high;
    }


    Collect.parent = parent;
    showParent();

    addParentSchema(parent);

    // attach the parent to the current set and save
    Collect.current.set.addParent(parent);
    saveSchema();
}

function saveNext(selector){
    var match = document.querySelector(selector),
        name = Collect.current.page.name;

    if ( errorCheck( (name !== "default" ), HTML.selector.selector,
            ("Cannot add next selector to '" + name + "' page, only to default")) || 
        errorCheck(!match.hasAttribute("href"), HTML.selector.selector,
            "selector must select element with href attribute") ) {
        return;
    }

    HTML.perm.page.next.selector.textContent = selector;
    HTML.perm.page.next.holder.style.display = "inline-block";

    Collect.current.page.index = true;
    Collect.current.page.next = selector;

    saveSchema();
}

function clearSelectorEvent(event){
    event.preventDefault();
    resetInterface();
}

function updateRadioEvent(event){
    UI.activeSelector = this.value;
    switch(this.value) {
    case "selector":
        if ( Collect.parent.selector ) {
            addParentSchema(Collect.parent);
        }
        HTML.selector.parent.holder.style.display = "none";
        break;
    case "parent":
        // don't show the current parent if you want to set a new one
        clearClass("parentSchema");
        HTML.selector.parent.holder.style.display = "block";
        break;
    case "next":
        // don't rely on parent when setting next
        clearClass("parentSchema");
        HTML.selector.parent.holder.style.display = "none";
        break;
    }
    // reset elements
    UI.turnSelectorsOn();
}

function removeSelectorEvent(event){
    event.preventDefault();
    this.remove();
    saveSchema();
}

function newRuleEvent(event){
    event.preventDefault();
    Collect.current.selector = this;

    setupRuleForm(this.selector);
    showTab(HTML.tabs.rule);
}

function editSelectorEvent(event){
    event.preventDefault();
    UI.editing.selector = this;
    Family.fromSelector(this.selector);
    Family.match();

    HTML.selector.radio.parent.disabled = true;
    HTML.selector.radio.next.disabled = true;

    showTab(HTML.tabs.selector);
}

/******************
    RULE EVENTS
******************/
function saveRuleEvent(event){
    event.preventDefault();
    var name = HTML.rule.name.value,
        capture = HTML.rule.capture.textContent,
        follow = HTML.rule.follow.checked,
        rule = {
            name: name,
            capture: capture
        };

    // error checking
    clearErrors();
    if ( emptyErrorCheck(name, HTML.rule.name, "Name needs to be filled in") ||
        emptyErrorCheck(capture, HTML.rule.capture, "No attribute selected") || 
        reservedWordErrorCheck(rule.name, HTML.rule.name, "Cannot use " + rule.name + 
            " because it is a reserved word") ) {
        return;
    }

    if ( follow ) {
        rule.follow = true;
    }

    if ( UI.editing.rule ) {
        UI.editing.rule.update(rule, HTML.perm.page.select);
        delete UI.editing.rule;
    } else {
        if ( !Collect.current.schema.uniqueRuleName(name) ) {
            // some markup to signify you need to change the rule's name
            alertMessage("Rule name is not unique");
            HTML.rule.name.classList.add("error");
            return;
        }
        var selector = Collect.current.selector;
        addRule(rule, selector);
    }

    saveSchema();
    resetInterface();
    showTab(HTML.tabs.schema);
}

function deleteParentEvent(event){
    event.preventDefault();
    delete Collect.parentCount;
    Collect.parent = {};
    hideParent();
    Collect.current.set.removeParent();
    saveSchema();
    clearClass("parentSchema");
}

function deleteNextEvent(event){
    event.preventDefault();
    delete Collect.next;
    HTML.perm.page.next.holder.style.display = "none";
    HTML.perm.page.next.selector.textContent = "";
    Collect.current.page.removeNext();
    saveSchema();
}

/*
toggle whether the current page is an index page
if toggled off and the current page has a next selector, remove it
*/
function toggleURLEvent(event){
    var on = Collect.current.schema.toggleURL(window.location.href);
    if ( !on && Collect.current.page.next ) {
        delete Collect.current.page.next;
    }
    saveSchema();
}

/************************
    SAVED RULE EVENTS
************************/
function selectorViewRule(event){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    var elements = Collect.matchedElements(this.parentSelector.selector);
    addClass("savedPreview", elements);
}

function unselectorViewRule(event){
    clearClass("savedPreview");
}

function editSavedRule(event){
    UI.editing.rule = this;

    // setup the form
    HTML.rule.name.value = this.name;
    HTML.rule.selector.textContent = this.parentSelector.selector;
    HTML.rule.capture.textContent = this.capture;
    if ( this.capture === "attr-href" ) {
        HTML.rule.follow.checked = this.follow;
        HTML.rule.follow.disabled = false;
        HTML.rule.followHolder.style.display = "block";
    } else {
        HTML.rule.follow.checked = false;
        HTML.rule.follow.disabled = true;
        HTML.rule.followHolder.style.display = "none";
    }

    setupRuleForm(this.parentSelector.selector);
    showTab(HTML.tabs.rule);
}

function deleteRuleEvent(event){
    clearClass("savedPreview");
    // also need to remove rule from set
    if ( this.follow ) {
        var pageOption = HTML.perm.page.select.querySelector("option[value=" + this.name + "]");
        pageOption.parentElement.removeChild(pageOption);
    }
    this.remove();
    saveSchema();
}

/***********************
    EVENT HELPERS
***********************/

function showTab(tab){
    var target = tab.dataset.for,
        view = document.getElementById(target);
    // fail if either data-for or related element is undefined
    if ( !target || !view || tab === UI.tabs.tab) {
        return;
    }
    UI.tabs.tab.classList.remove("active");
    UI.tabs.view.classList.remove("active");

    UI.tabs.tab = tab;
    UI.tabs.view = view;
    UI.tabs.tab.classList.add("active");
    UI.tabs.view.classList.add("active");

    switch(target){
    case "selectorView":
        UI.activeSelector = "selector";
        UI.turnSelectorsOn();
        break;
    case "previewView":
        generatePreview();
        UI.turnSelectorsOff();
        break;
    default:
        UI.turnSelectorsOff();
    }
    clearSelectorClasses();
}


function generatePreview(){
    // only regen preview when something in the schema has changed
    if (  UI.preview.dirty ) {
        HTML.preview.contents.innerHTML = Collect.current.page.preview();
    }
    UI.preview.dirty = false;
}

/*
add the message to #ruleAlert
*/
function alertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    HTML.perm.alert.appendChild(p);
    setTimeout(function(){
        HTML.perm.alert.removeChild(p);
    }, 2000);
}

function errorCheck(condition, ele, msg){
    if ( condition ) {
        ele.classList.add("error");
        alertMessage(msg);
        return true;
    }
    return false;
}

function reservedWordErrorCheck(word, ele, msg){
    var reservedWords = ["default", "url"],
        reserved = false;
    for ( var i=0, len=reservedWords.length; i<len; i++ ) {
        if ( word === reservedWords[i] ) {
            reserved = true;
            break;
        }
    }
    return errorCheck(reserved, ele, msg);
}

function emptyErrorCheck(attr, ele, msg){
    return errorCheck((attr === ""), ele, msg);
}

function clearErrors(){
    // doing this instead of clearClass("error") in case the native page also uses the error class
    var errors = HTML.ui.getElementsByClassName("error");
    for ( var i=0, errorLen = errors.length; i<errorLen; i++ ) {
        errors[i].classList.remove("error");
    }
}

/***************
    rule object shortcuts
***************/

function addPage(page, schema){
    page.addOption(HTML.perm.page.select);
    schema.addPage(page);
}

function addSelectorSet(set, page){
    set.addOption(HTML.perm.set.select);
    page.addSet(set);
}

function addSelector(selector, set){
    set.addSelector(selector,
        [newRuleEvent, editSelectorEvent, removeSelectorEvent]);
}

/*
rule is a JSON object representing a rule
selector a a Selector object to attach the rule to
*/
function addRule(rule, selector){
    var ruleObject = new Rule(
        rule.name,
        rule.capture,
        rule.follow || false,
        Collect.parent.selector
    );

    selector.addRule(ruleObject,
        [selectorViewRule, unselectorViewRule, editSavedRule, deleteRuleEvent],
        HTML.perm.page.select);
}

/*
add .parentSchema to all elements matching parent selector and in range
*/
function addParentSchema(parent){
    var selector = parent.selector,
        low = parent.low || 0,
        high = parent.high || 0;
    var elements = Collect.all(selector),
        end = elements.length + high;
        // add high because it is negative
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentSchema");
    }
}

function showParent(){
    if ( !Collect.parent ) {
        return;
    }
    HTML.perm.parent.holder.style.display = "inline-block";
    HTML.perm.parent.selector.textContent = Collect.parent.selector;
    HTML.perm.parent.range.textContent = createRangeString(Collect.parent.low, Collect.parent.high);
}

function hideParent(){
    HTML.perm.parent.holder.style.display = "none";
    HTML.perm.parent.selector.textContent = "";
    HTML.perm.parent.range.textContent = "";
}

function setupRuleForm(selector){
    HTML.rule.selector.textContent = selector;
    var elements = Collect.matchedElements(selector);
    UI.ruleCycle.setElements(elements);
    addClass("queryCheck", elements);
    // set global for allLinks (fix?)
    Collect.elements = elements;
}

function createRangeString(low, high){
    var rangeString = "Range: ";
    rangeString += (low !== 0 && !isNaN(low)) ? low : "start";
    rangeString += " to ";
    rangeString += (high !== 0 && !isNaN(high)) ? high : "end";
    return rangeString;
}

function elementCount(count, parentCount){
    if ( parentCount ) {
        return parseInt(count/parentCount) + " per parent group";
    } else {
        return count + " total";
    }
}

/***********************
    UTILITY FUNCTIONS
general helper functions
***********************/
function isLink(element, index, array){
    return element.tagName === "A";
}

function allLinks(elements){
    elements = Array.prototype.slice.call(elements);
    return elements.every(isLink);
}

/***********************
        STORAGE
***********************/
/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        schemas:
            <name>:
                name: <name>,
                pages: {},
                urls: {}

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
function setupHostname(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            schema,
            key;
        // default setup if page hasn't been visited before
        if ( !site ) {
            schema = newSchema("default");
            storage.sites[host] = {
                site: host,
                schemas: {
                    "default": schema
                }
            };
            chrome.storage.local.set({'sites': storage.sites});
        } else {
            options(Object.keys(site.schemas), HTML.perm.schema.select);
            schema = site.schemas['default'];
        }
        loadSchemaObject(schema);
    });
}

function uploadSchema(){
    var data = {
        schema: Collect.current.schema.uploadObject(),
        site: window.location.host
    };
    chrome.runtime.sendMessage({type: 'upload', data: data});
}

/***********************
    SCHEMA STORAGE
***********************/

function createSchema(){
    var name = prompt("Schema Name");
    // null when cancelling prompt
    if ( name === null ) {
        return;
    }
    // make sure name isn't empty string or string that can't be used in a filename
    else if ( name === "" || !legalFilename(name)) {
        alertMessage("\'" + name + "\' is not a valid schema name");
        return;
    }
    
    chrome.storage.local.get("sites", function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            schema;

        if ( !uniqueSchemaName(name, site.schemas)){
            alertMessage("a schema named \"" + name + "\" already exists");
            return;
        }

        schema = newSchema(name);
        storage.sites[host].schemas[name] = schema;

        chrome.storage.local.set({'sites': storage.sites});
        loadSchemaObject(schema);
    });
}

function loadSchema(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    chrome.storage.local.get('sites', function loadSchemasChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            schema = site.schemas[name];
        resetInterface();
        loadSchemaObject(schema);
    });
}

/*
saving function for all things schema related
*/
function saveSchema(){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            schema = Collect.current.schema.object();
        storage.sites[host].schemas[schema.name] = schema;
        chrome.storage.local.set({"sites": storage.sites});
        UI.preview.dirty = true;
    });
}

/*
deletes the schema currently selected, and removes its associated option from #allSchemas
if the current schema is "default", delete the rules for the schema but don't delete the schema
*/
function deleteSchema(){
    var defaultSchema = (Collect.current.schema.name === "default"),
        confirmed;
    if ( defaultSchema ) {
        confirmed = confirm("Cannot delete \"default\" schema. Do you want to clear out all of its pages instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this schema and all of its related pages?");    
    }
    if ( !confirmed ) {
        return;
    }
    chrome.storage.local.get("sites", function deleteSchemaChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            currOption = HTML.perm.schema.select.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultSchema ) {
            site.schemas["default"] = newSchema("default");
        } else {
            delete site.schemas[Collect.current.schema.name];
            currOption.parentElement.removeChild(currOption);
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        resetInterface();
        loadSchemaObject(site.schemas["default"]);
    });
}

/***********************
    PAGE STORAGE
***********************/

function loadPage(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    resetInterface();
    loadPageObject(Collect.current.schema.pages[name]);
}

function deletePage(){
    var defaultPage = (Collect.current.page.name === "default"),
        confirmed;
    if ( defaultPage ) {
        confirmed = confirm("Cannot delete \"default\" page. Do you want to clear out all of its rule sets instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this page and all of its related rule sets?");    
    }
    if ( !confirmed ) {
        return;
    }

    var page;
    // just delete all of the rules for "default" option
    if ( defaultPage ) {
        page = new Page("default");
        addPage(page, Collect.current.schema);
    } else {
        Collect.current.schema.removePage(Collect.current.page.name);
        page = Collect.current.schema.pages["default"];
        page.htmlElements.option.selected = true;
    }
    saveSchema();
    resetInterface();
    loadPageObject(page);
}

/***********************
    SELECTOR SET STORAGE
***********************/

function loadSet(ele){
    var option = ele.querySelector("option:checked"),
        name = option.value;
    resetInterface();
    loadSetObject(Collect.current.page.sets[name]);
}

function createSelectorSet(){
    var name = prompt("Selector Set Name");
    if ( name === null ) {
        return;
    }
    else if ( name === "" ) {
        alertMessage("selector set name cannot be blank");
        return;
    }
    
    if ( !Collect.current.schema.uniqueSelectorSetName(name) ) {
        alertMessage("a selector set named \"" + name + "\" already exists");
        return;
    }
    var set = new SelectorSet(name);
    addSelectorSet(set, Collect.current.page);
    saveSchema();

    resetInterface();
    loadSetObject(set);
}

function deleteSelectorSet(){
    var defaultSet = (Collect.current.set.name === "default"),
        question = defaultSet ?
            "Cannot delete \"default\" rule set. Do you want to clear out all of its rules instead?" :
            "Are you sure you want to delete this selector set and all of its related selectors and rules?";
    if ( !confirm(question) ) {
        return;
    }

    var set;
    // handle setting new current SelectorSet
    if ( defaultSet ) {
        Collect.current.page.removeSet("default");
        set = new SelectorSet("default");
        addSelectorSet(set, Collect.current.page);
    } else {
        Collect.current.set.remove();
        Collect.current.set = undefined;
        set = Collect.current.page.sets["default"];
        set.htmlElements.option.selected = true;
    }

    saveSchema();
    resetInterface();
    loadSetObject(set);
}

/***********************
    OPTIONS STORAGE
***********************/

function loadOptions(){
    chrome.storage.local.get("options", function(storage){
        var input;
        Collect.options = storage.options;
        for ( var key in storage.options ) {
            if ( storage.options[key] ) {
                input = document.getElementById(key);
                if ( input ) {
                    input.checked = true;
                }
            }
        }
    });
}

// override current options with passed in options
function setOptions(options){
    chrome.storage.local.set({"options": options});
}

/***********************
    STORAGE HELPERS
***********************/

// creates an empty schema object
function newSchema(name){
    HTML.perm.schema.select.appendChild(newOption(name));
    return {
        name: name,
        pages: {
            "default": {
                name: "default",
                index: false,
                sets: {
                    "default": {
                        name: "default",
                        selectors: {}
                    }
                }
            }
        },
        urls: {}
    };
}

function uniqueSchemaName(name, schemas){
    for ( var key in schemas ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
}

/*
a schema's name will be the name of the file when it is uploaded, so make sure that any characters in the name will be legal to use
rejects if name contains characters not allowed in filename: <, >, :, ", \, /, |, ?, *
*/
function legalFilename(name){
    if ( name === null ) {
        return false;
    }
    var badCharacters = /[<>:"\/\\\|\?\*]/,
        match = name.match(badCharacters);
    return ( match === null );
}

/*
given JSON representing a schema, create that Schema's object and all associated 
Page/SelectorSet/Selector/Rule objects
also setup relevant HTML data associated with the Schema
*/
function loadSchemaObject(schema){
    HTML.perm.schema.select.querySelector("option[value=" + schema.name + "]").selected = true;

    var url = window.location.href;
    HTML.perm.schema.index.checkbox.checked = (schema.urls[url] !== undefined );

    // clear out current page options
    HTML.perm.page.select.innerHTML = "";
    var schemaObject,
        page, pageObject, pageName,
        set, setObject, setName,
        selector, selectorObject, selectorName,
        rule, ruleObject, ruleName;

    schemaObject = new Schema(schema.name, schema.urls);
    // clear out previous schema
    HTML.perm.schema.holder.innerHTML = "";
    HTML.perm.schema.holder.appendChild(schemaObject.html());

    Collect.current.schema = schemaObject;    
    // create all pages and child objects for the schema
    for ( pageName in schema.pages ) {
        page = schema.pages[pageName];

        pageObject = new Page(page.name, page.index, page.next);
        addPage(pageObject, schemaObject);
        for ( setName in page.sets ) {
            set = page.sets[setName];
            setObject = new SelectorSet(set.name, set.parent);
            addSelectorSet(setObject, pageObject);
            
            for ( selectorName in set.selectors ) {
                selector = set.selectors[selectorName];
                selectorObject = new Selector(selector.selector);
                addSelector(selectorObject, setObject);
                
                for ( ruleName in selector.rules ) {
                    rule = selector.rules[ruleName];
                    addRule(rule, selectorObject);
                }
            }
        }
    }
    loadPageObject(Collect.current.schema.pages["default"]);
}

function loadPageObject(page){
    Collect.current.page = page;
    // clear out preview when loading a new page
    // and auto-generate if currently on preview tab
    UI.preview.dirty = true;
    HTML.preview.contents.innerHTML = "";
    if ( UI.tabs.view.id === "previewView") {
        generatePreview();
    }
    if ( page.name === "default" ) {
        HTML.perm.schema.index.holder.style.display = "inline-block";
        
        HTML.selector.radio.next.disabled = false;
        // handle whether or not next has already been set
        if ( page.next ) {
            Collect.next = page.next;
            HTML.perm.page.next.holder.style.display = "inline-block";
            HTML.perm.page.next.selector.textContent = page.next;
        } else {
            delete Collect.next;
            HTML.perm.page.next.holder.style.display = "none";
            HTML.perm.page.next.selector.textContent = "";
        }
    } else {
        HTML.perm.schema.index.holder.style.display = "none";
        HTML.perm.page.next.holder.style.display = "none";
        HTML.selector.radio.next.disabled = true;
    }

    options(Object.keys(page.sets), HTML.perm.set.select);

    loadSetObject(page.sets["default"]);
}

function loadSetObject(set){
    Collect.parent = set.parent || {};
    Collect.current.set = set;

    if ( set.parent ) {
        showParent();
        addParentSchema(set.parent);
        Collect.parentCount = Collect.all(set.parent.selector).length;
    } else {
        hideParent();
        clearClass("parentSchema");
        delete Collect.parentCount;
    }
}
