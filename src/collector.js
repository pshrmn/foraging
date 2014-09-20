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
    document.body.style.marginBottom = (marginBottom + 300) + "px";
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
        return prefix ? prefix + " " + selector : selector;
    },
    options: {},
    allElements: [],
    indexPage: false,
    current: {
        group: undefined,
        page: undefined,
        set: undefined
    },
    // parent.selector is set when Collect.current.set index=true
    parent: {},
    // currently loaded Group
    group: undefined
};

/*
Object that controls the functionality of the interface
*/
var Interface = {
    activeForm: "rule",
    activeSelector: "selector",
    tabs: {
        tab: document.querySelector(".tab.active"),
        view: document.querySelector(".view.active")
    },
    setup: function(){        
        loadOptions();
        setupHostname();
        this.events();

        setupSelectorTab();
        setupRulesTab();
    },
    /*
    adds events listeners based on whether or not Collect.parent.elector is set
    if it is, only add them to children of that element, otherwise add them to all elements
    that don't have the noSelect class
    store elements with eventlisteners in this.ele
    */
    turnOn: function(){
        var curr;

        this.turnOff();
        Collect.allElements = parentElements("*");

        for ( var i=0, len=Collect.allElements.length; i<len; i++ ) {
            curr = Collect.allElements[i];
            curr.addEventListener('click', Family.create, false);
            curr.addEventListener('mouseenter', highlightElement, false);
            curr.addEventListener('mouseleave', unhighlightElement, false);
        }
        clearClass("queryCheck");
        clearClass("collectHighlight");
    },
    /*
    removes event listeners from elements in this.ele
    */
    turnOff: function(){
        var curr;
        for ( var i=0, len=Collect.allElements.length; i<len; i++ ) {
            curr = Collect.allElements[i];
            curr.removeEventListener('click', Family.create);
            curr.removeEventListener('mouseenter', highlightElement);
            curr.removeEventListener('mouseleave', unhighlightElement);
            
        }
        Collect.allElements = [];
    },
    events: function(){
        // tabs
        tabEvents();

        //views
        selectorViewEvents();
        ruleViewEvents();
        optionsViewEvents();
        previewViewEvents();
        permanentBarEvents();
    },
    update: function(){
        HTML.perm.group.select.querySelector("option[value=" + Collect.current.group + "]").selected = true;
        HTML.perm.page.select.querySelector("option[value=" + Collect.current.page + "]").selected = true;
        HTML.perm.set.select.querySelector("option[value=" + Collect.current.set + "]").selected = true;
    }
};

// save commonly referenced to elements
var HTML = {
    // elements in the selector view
    selector: {
        family: document.getElementById("selectorHolder"),
        selector: document.getElementById("currentSelector"),
        count: document.getElementById("currentCount"),
        save: document.getElementById("saveSelector"),
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
        rule: {
            form: document.getElementById("ruleForm"),
            name: document.getElementById("ruleName"),
            capture: document.getElementById("ruleAttr"),
            follow: document.getElementById("ruleFollow"),
            followHolder: document.querySelector("#ruleItems .follow")
        },
        edit: {
            form: document.getElementById("editForm"),
            name: document.getElementById("editName"),
            capture: document.getElementById("editAttr"),
            selector: document.getElementById("editSelector"),
            follow: document.getElementById("editFollow"),
            followHolder: document.querySelector("#ruleItems .editFollow")  
        }
    },
    // elements in the the permament bar
    perm: {
        group: {
            select: document.getElementById("groupSelect"),
            holder: document.getElementById("groupHolder"),
        },
        page: {
            select: document.getElementById("pageSelect"),
        },
        set: {
            select: document.getElementById("selectorSetSelect")
        },
        parent: {
            holder: document.getElementById("currentParent"),
            selector: document.getElementById("parentSelectorView"),
            range: document.getElementById("parentRangeView")
        },
        next: {
            holder: document.getElementById("nextHolder"),
            selector: document.getElementById("nextSelectorView")
        }
    },
    info: {
        alert: document.getElementById("collectAlert"),
        index: document.getElementById("indexMarker"),
        indexToggle: document.getElementById("indexToggle"),
    },
    interface: document.querySelector(".collectjs"),
    // elements in the preview view
    preview: {
        name: document.getElementById("previewName"),
        selector: document.getElementById("previewSelector"),
        capture: document.getElementById("previewCapture"),
        contents: document.getElementById("previewContents"),
        clear: document.getElementById("previewClear")
    },
    tabs: {
        selector: document.getElementById("selectorTab"),
        rule: document.getElementById("ruleTab"),
        groups: document.getElementById("groupsTab"),
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

        resetInterface(); 
        if ( Interface.editing ) {
            // preserve name when switching selector while editing
            HTML.rule.edit.name.value = Interface.editing.name;
        }
        
        //redo
        var selectorElement = HTML.selector.selector;

        var sf = new SelectorFamily(this,
            Collect.parent.selector,
            HTML.selector.family,
            selectorElement,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
        showTab(HTML.tabs.selector);
    },
    edit: function(selector){
        var eles = parentElements(selector);
        if ( !eles.length ) {
            return;
        }
        var sf = new SelectorFamily(eles[0],
            Collect.parent.selector,
            HTML.family,
            HTML.selector.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
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
            var sf = new SelectorFamily(element,
                Collect.parent.selector,
                HTML.family,
                HTML.selector.selector,
                Family.test.bind(Family),
                Collect.options
            );
            this.family = sf;
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
        return parentElements(selector);
    },
    /*
    sets Collect.matchedElements to elements matching the current selector
    */
    match: function(){
        Collect.matchedElements = this.elements();
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
            count;
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        count = elements.length ? elements.length : "";
        HTML.selector.count.textContent = count;
        this.match();
        Interface.selectorCycle.setElements(Collect.matchedElements);
    },
    /*
    only select elements that fall between low/elements.length + high (because high is negative)
    applies a range to the elements selected by the current selector
    */
    range: function(low, high){
        Family.match();
        var len = Collect.matchedElements.length;
        Collect.matchedElements = Array.prototype.slice.call(Collect.matchedElements).slice(low, len + high);
        Interface.selectorCycle.setElements(Collect.matchedElements);
    }
};

Interface.setup();


function resetInterface(){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    clearClass("savedPreview");
    resetRulesView();
    resetPreviewView();
}

function resetSelectorView(){
    Family.remove();
    Interface.activeSelector = "selector";
    HTML.selector.radio.selector.checked = true;
    HTML.selector.parent.holder.style.display = "none";
    HTML.selector.parent.low.value = "";
    HTML.selector.parent.high.value = "";
    HTML.selector.count.textContent = "";
}

function resetRulesView(){
    // reset rule form
    HTML.rule.rule.name.value = "";
    HTML.rule.rule.capture.textContent = "";
    HTML.rule.rule.follow.checked = false;
    HTML.rule.rule.follow.disabled = true;
    HTML.rule.rule.followHolder.style.display = "none";

    // reset edit form
    HTML.rule.edit.name.value = "";
    HTML.rule.edit.capture.textContent = "";
    HTML.rule.edit.selector.textContent = "";
    HTML.rule.edit.follow.checked = false;
    HTML.rule.edit.follow.disabled = true;
    HTML.rule.edit.followHolder.style.display = "none";
}

function resetPreviewView(){
    HTML.preview.name.textContent = "";
    HTML.preview.selector.textContent = "";
    HTML.preview.capture.textContent = "";
    HTML.preview.contents.innerHTML = "";
}

/******************
    EVENTS
******************/

// encapsulate event activeTabEvent to keep track of current tab/view
function tabEvents(){
    idEvent("refreshCollect", "click", refreshElements);
    idEvent("closeCollect", "click", function removeInterface(event){
        event.stopPropagation();
        event.preventDefault();
        Interface.turnOff();
        clearClass('queryCheck');
        clearClass('collectHighlight');
        clearClass('parentGroup');
        clearClass("savedPreview");
        HTML.interface.parentElement.removeChild(HTML.interface);
        document.body.style.marginBottom = marginBottom + "px";
    });

    // querySelectorAll because getElementsByClassName could overlap with native elements
    var tabs = document.querySelectorAll(".tabHolder .tab");
    for ( var i=0, len=tabs.length; i<len; i++ ) {
        tabs[i].addEventListener("click", showTabEvent, false);
    }

    function showTabEvent(event){
        showTab(this);
    }
}

function setupSelectorTab(){
    Interface.selectorCycle = new Cycle(document.getElementById("selectorCycleHolder"));
}

function setupRulesTab() {
    Interface.ruleCycle = new Cycle(document.getElementById("ruleCycleHolder"), true);   
}

function selectorViewEvents(){
    idEvent("saveSelector", "click", saveSelectorEvent);
    idEvent("selectorRadio", "change", updateRadioEvent);
    idEvent("parentRadio", "change", updateRadioEvent);
    idEvent("nextRadio", "change", updateRadioEvent);
}

function ruleViewEvents(){
    idEvent("saveRule", "click", saveRuleEvent);
    idEvent("saveEdit", "click", saveEditEvent);

    idEvent("cancelRule", "click", cancelRuleEvent);
    idEvent("cancelEdit", "click", cancelEditEvent);

    idEvent("parentLow", "blur", verifyAndApplyParentLow);
    idEvent("parentHigh", "blur", verifyAndApplyParentHigh);
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

function previewViewEvents(){
    idEvent("previewClear", "click", function(event){
        event.preventDefault();
        resetPreviewView();
    });
}

function permanentBarEvents(){
    // group events
    idEvent("groupSelect", "change", function loadGroupEvent(event){
        event.preventDefault();
        loadGroup(this);
    });

    idEvent("createGroup", "click", function newGroupEvent(event){
        event.preventDefault();
        createGroup();
    });

    idEvent("deleteGroup", "click", function deleteGroupEvent(event){
        event.preventDefault();
        deleteGroup();
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
        uploadGroup();
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

// 
function refreshElements(){
    resetInterface();
    Interface.turnOn();
}

function cancelRuleEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();
}

function cancelEditEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();   
}

function verifyAndApplyParentLow(event){
    var low = parseInt(HTML.selector.parent.low.value, 10),
        high = parseInt(HTML.selector.parent.high.value, 10) || 0;

    if ( isNaN(low) || low <= 0 ) {
        HTML.selector.parent.low.value = "";
        alertMessage("Low must be positive integer greater than 0");
        return;
    }

    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.selector.count.textContent = Collect.matchedElements.length;   
}

function verifyAndApplyParentHigh(event){
    var low = parseInt(HTML.selector.parent.low.value, 10) || 0,
        high = parseInt(HTML.selector.parent.high.value, 10);

    if ( isNaN(high) || high > 0 ) {
        HTML.selector.parent.high.value = "";
        alertMessage("High must be a negative integer");
        return;
    }
    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.selector.count.textContent = Collect.matchedElements.length;   
}

/*
if the .capture element clicked does not have the .selected class, set attribute to capture
otherwise, clear the attribute to capture
toggle .selected class
*/
function capturePreview(event){
    var capture, follow, followHolder;
    if ( Interface.activeForm === "rule" ) {
        capture = HTML.rule.rule.capture;
        follow = HTML.rule.rule.follow;
        followHolder = HTML.rule.rule.followHolder;
    } else if ( Interface.activeForm === "edit" ) {
        capture = HTML.rule.edit.capture;
        follow = HTML.rule.edit.follow;
        followHolder = HTML.rule.edit.followHolder;
    }

    if ( !this.classList.contains("selected") ){
        clearClass("selected");
        var elements = Family.elements(),
            captureVal = this.dataset.capture;
        capture.textContent = captureVal;
        this.classList.add("selected");

        // toggle follow based on if capture is attr-href or something else
        if ( captureVal === "attr-href" && allLinks(Collect.matchedElements) ){
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
        capture.textContent ="";
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

    switch(Interface.activeSelector){
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
    resetSelectorView();
}

function saveSelector(selector){
    var sel = new Selector(selector),
        group = Collect.current.group,
        page = Collect.current.page,
        set = Collect.current.set;
    Collect.group.pages[page].sets[set].addSelector(sel);
    saveGroup();
}

function saveParent(selector){
    var low = parseInt(HTML.selector.parent.low.value, 10),
        high = parseInt(HTML.selector.parent.high.value, 10),
        parent = {
            selector: selector
        };
    if ( !isNaN(low) ) {
        parent.low = low;
    }
    if ( !isNaN(high) ) {
        parent.high = high;
    }


    Collect.parent = parent;
    HTML.perm.parent.holder.style.display = "inline-block";
    HTML.perm.parent.selector.textContent = selector;
    HTML.perm.parent.range.textContent = setRangeString(low, high);
    addParentGroup(selector, parent.low, parent.high);

    // attach the parent to the current set and save
    Collect.group.pages[Collect.current.page].sets[Collect.current.set].parent = parent;
    saveGroup();
    //test
    refreshElements();
}

function saveNext(selector){
    var match = document.querySelector(selector),
        page = Collect.group.pages[Collect.current.page];

    if ( page.name !== "default" ) {
        alertMessage("Cannot add next selector to '" + page.name + "' page, only to default");
        return;
    }
    if ( errorCheck(!match.hasAttribute("href"), HTML.selector.selector, "selector must select element with href attribute") ) {
        return;
    }

    HTML.perm.next.selector.textContent = selector;

    page.index = true;
    page.next = selector;

    Collect.group.pages[Collect.current.page] = page;
    saveGroup();

    showRuleForm();
    if ( Collect.parent.selector ) {
        addParentGroup(Collect.parent.selector, Collect.parent.low, Collect.parent.high);
    }

    refreshElements();
}

function updateRadioEvent(event){
    Interface.activeSelector = this.value;
    HTML.selector.parent.holder.style.display = (Interface.activeSelector === "parent") ? "block": "none";
}

/******************
    RULE EVENTS
******************/
function saveRuleEvent(event){
    event.preventDefault();
    var name = HTML.rule.rule.name.value,
        capture = HTML.rule.rule.capture.textContent,
        follow = HTML.rule.rule.follow.checked,
        rule = {
            name: name,
            capture: capture,
            selector: selector
        };

    // error checking
    clearErrors();
    if ( emptyErrorCheck(name, HTML.rule.rule.name, "Name needs to be filled in") ||
        emptyErrorCheck(capture, HTML.rule.rule.capture, "No attribute selected") || 
        reservedWordErrorCheck(rule.name, HTML.rule.rule.name, "Cannot use " + rule.name + 
            " because it is a reserved word") ) {
        return;
    }
    else if ( !Collect.group.uniqueRuleName(name) ) {
        // some markup to signify you need to change the rule's name
        alertMessage("Rule name is not unique");
        HTML.rule.rule.name.classList.add("error");
        return;
    }

    if ( follow ) {
        rule.follow = true;
        // page will be created when rule is added to set, but add option now
        HTML.perm.page.select.appendChild(newOption(rule.name));
    }
    var curr = Collect.current;
    var selector = Collect.group.pages[curr.page].sets[curr.set].selector[curr.selector];
    addRule(rule, selector);
    saveGroup();
    resetInterface();
}

function saveEditEvent(event){
    event.preventDefault();
    var name = HTML.rule.edit.name.value,
        selector = HTML.rule.edit.selector.textContent,
        capture = HTML.rule.edit.capture.textContent,
        follow = HTML.rule.edit.follow.checked,
        rule = {
            name: name,
            capture: capture,
            selector: selector
        };

    clearErrors();
    if ( emptyErrorCheck(name, HTML.rule.edit.name, "Name needs to be filled in") ||
        emptyErrorCheck(selector, HTML.rule.edit.selector, "No CSS selector selected") ||
        emptyErrorCheck(capture, HTML.rule.edit.capture, "No attribute selected") ) {
        return;
    }

    if ( follow ) {
        rule.follow = true;
    }
    var oldName = Interface.editing.name,
        set = Interface.editing.set;
    Interface.editing.update(rule);
    Collect.group.pages[set.page.name].sets[set.name] = set;
    saveGroup();

    deleteEditing();
    showRuleForm();
    resetInterface();
}

function deleteParentEvent(event){
    event.preventDefault();
    deleteEditing();
    Collect.parent = {};
    HTML.perm.parent.holder.style.display = "none";
    HTML.perm.parent.selector.textContent = "";
    HTML.perm.parent.range.textContent = "";
    Collect.group.pages[Collect.current.page].sets[Collect.current.set].parent = undefined;
    saveGroup();
    clearClass("parentGroup");
    showRuleForm();
    Interface.turnOn();
}

function deleteNextEvent(event){
    event.preventDefault();
    deleteEditing();
    delete Collect.next;
    HTML.perm.next.holder.style.display = "none";
    HTML.perm.next.selector.textContent = "";
    Collect.group.pages[Collect.current.page].removeNext();
    saveGroup();
    Interface.turnOn();
}

function toggleURLEvent(event){
    var group = Collect.group,
        url = window.location.href;
    if ( group.urls[url] ) {
        delete group.urls[url];
    } else {
        group.urls[url] = true;
    }

    saveGroup();
}

/************************
    SAVED RULE EVENTS
************************/
function selectorViewRule(event){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    var elements = parentElements(this.selector);
    addClass("savedPreview", elements);
}

function unselectorViewRule(event){
    clearClass("savedPreview");
}

function editSavedRule(event){
    deleteEditing();

    Interface.editing = this;
    Family.edit(this.selector);

    // setup the form
    HTML.rule.edit.name.value = this.name;
    HTML.rule.edit.selector.textContent = this.selector;
    HTML.rule.edit.capture.textContent = this.capture;
    if ( this.follow ) {
        HTML.rule.edit.follow.checked = this.follow;
        HTML.rule.edit.follow.disabled = false;
        HTML.rule.edit.followHolder.style.display = "block";
    }

    showTab(HTML.tabs.rule);
    showEditForm();
}

function previewSavedRule(event){
    HTML.preview.name.textContent = this.name;
    HTML.preview.selector.textContent = this.selector;
    HTML.preview.capture.textContent = this.capture;
    //HTML.preview.contents;
    var elements = parentElements(this.selector);
    generatePreviewElements(this.capture, elements);
    showTab(HTML.tabs.preview);
}

function deleteRuleEvent(event){
    clearClass("savedPreview");
    // also need to remove rule from set
    if ( this.follow ) {
        var pageOption = HTML.perm.page.select.querySelector("option[value=" + this.name + "]");
        pageOption.parentElement.removeChild(pageOption);
    }
    this.remove();
    saveGroup();
}

/***********************
    EVENT HELPERS
***********************/

function showTab(tab){
    var target = tab.dataset.for,
        view = document.getElementById(target);
    // fail if either data-for or related element is undefined
    if ( !target || !view || tab === Interface.tabs.tab) {
        return;
    }
    Interface.tabs.tab.classList.remove("active");
    Interface.tabs.view.classList.remove("active");

    Interface.tabs.tab = tab;
    Interface.tabs.view = view;
    Interface.tabs.tab.classList.add("active");
    Interface.tabs.view.classList.add("active");
}

//generate paragraphs html for the captured attribute on all of the elements and attach them to #rulePreview
//update
function generatePreviewElements(capture, elements) {
    if ( capture === "" ) {
        return;
    }
    var fn = captureFunction(capture),
        previewHTML = "";
    for ( var i=0, len=elements.length; i<len; i++ ) {
        previewHTML += "<p class=\"noSelect\">" + fn(elements[i]) + "</p>";
    }
    if ( previewHTML === "" ) {
        previewHTML = "No selector/attribute to capture selected";
    }
    HTML.preview.contents.innerHTML = previewHTML;
}


function captureFunction(capture){
    if (capture==="text") { 
        return function(ele){
            return ele.textContent;
        };
    } else if (capture.indexOf("attr-")===0) {
        // return substring after first hyphen so that it works with data- attributes
        var attribute = capture.slice(capture.indexOf("-")+1);
        return function(ele){
            return ele.getAttribute(attribute);
        };
    }
}

/*
add the message to #ruleAlert
*/
function alertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    HTML.info.alert.appendChild(p);
    setTimeout(function(){
        HTML.info.alert.removeChild(p);
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
    var errors = HTML.interface.getElementsByClassName("error");
    for ( var i=0, errorLen = errors.length; i<errorLen; i++ ) {
        errors[i].classList.remove("error");
    }
}

/*
add's a rule element to it's respective location in #ruleGroup
*/
function addRule(rule, selector){
    var ruleObject = new Rule(
        rule.name,
        rule.capture,
        rule.follow || false,
        Collect.parent.selector
    );

    selector.addRule(ruleObject,
        [selectorViewRule, unselectorViewRule, editSavedRule, previewSavedRule, deleteRuleEvent]);
}

/*
add .parentGroup to all elements matching parent selector and in range
*/
function addParentGroup(selector, low,  high){
    low = low || 0;
    high = high || 0;
    var elements = Collect.all(selector),
        end = elements.length + high;
        // add high because it is negative
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentGroup");
    }
}

/*
uses Collect.parent to limit selected elements to children of elements matching Collect.parent.selector
if Collect.parent.high/low are defined, only use Collect.parent.selector elements within that range
*/
function parentElements(selector){
    var low = Collect.parent.low || 0,
        high = Collect.parent.high || 0,
        allElements = [];

    // don't restrict to Collect.parent.selector when setting next selector
    if ( low !== 0 || high !== 0 ) {
        var elements = document.querySelectorAll(Collect.parent.selector),
            // add high because it is negative
            end = elements.length + high,
            currElements;
        for ( ; low<end; low++ ) {
            currElements = elements[low].querySelectorAll(Collect.not(selector));
            allElements = allElements.concat(Array.prototype.slice.call(currElements));
        }
        return allElements;
    } else {
        var prefix = Collect.parent.selector ? Collect.parent.selector : "body";
        allElements = Array.prototype.slice.call(Collect.all(selector, prefix));
    }
    return allElements;
}

function showRuleForm(){
    Interface.activeForm = "rule";
    HTML.rule.rule.form.style.display = "inline-block";
    HTML.rule.edit.form.style.display = "none";
}

function showEditForm(){
    Interface.activeForm = "edit";
    HTML.rule.edit.form.style.display = "inline-block";
    HTML.rule.rule.form.style.display = "none";
}

function baseCancel(){
    deleteEditing();
    resetInterface();
    showRuleForm();
}

function setRangeString(low, high){
    var rangeString = "Range: ";
    rangeString += (low !== 0 && !isNaN(low)) ? low : "beginning";
    rangeString += " to ";
    rangeString += (high !== 0 && !isNaN(high)) ? high : "end";
    return rangeString;
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
        groups:
            <name>:
                name: <name>,
                pages: {},
                urls: {}

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
function setupHostname(){
    // never should be editing before this is loaded
    deleteEditing();
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group,
            key;
        // default setup if page hasn't been visited before
        if ( !site ) {
            group = newGroup("default");
            storage.sites[host] = {
                site: host,
                groups: {
                    "default": group
                }
            };
            chrome.storage.local.set({'sites': storage.sites});

            HTML.perm.group.select.appendChild(newOption("default"));

        } else {
            options(Object.keys(site.groups), HTML.perm.group.select);
            group = site.groups['default'];
        }
        loadGroupObject(group);
    });
}

function uploadGroup(){
    var data = {
        group: Collect.group.uploadObject(),
        site: window.location.host
    };

    chrome.runtime.sendMessage({type: 'upload', data: data});
}

/***********************
    GROUP STORAGE
***********************/

function createGroup(){
    var name = prompt("Group Name");
    // null when cancelling prompt
    if ( name === null ) {
        return;
    }
    // make sure name isn't empty string or string that can't be used in a filename
    else if ( name === "" || !legalFilename(name)) {
        alertMessage("\'" + name + "\' is not a valid group name");
        return;
    }
    
    chrome.storage.local.get("sites", function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group;

        if ( !uniqueGroupName(name, site.groups)){
            alertMessage("a group named \"" + name + "\" already exists");
            return;
        }

        HTML.perm.group.select.appendChild(newOption(name));
        group = newGroup(name);
        storage.sites[host].groups[name] = group;

        chrome.storage.local.set({'sites': storage.sites});
        deleteEditing();
        loadGroupObject(group);
    });
}

function loadGroup(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[name];
        resetInterface();
        deleteEditing();
        loadGroupObject(group);
    });
}

/*
saving function for all things group related
*/
function saveGroup(){
    chrome.storage.local.get('sites', function saveGroupChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.group.object();
        storage.sites[host].groups[group.name] = group;
        chrome.storage.local.set({"sites": storage.sites});
    });
}

/*
deletes the group currently selected, and removes its associated option from #allGroups
if the current group is "default", delete the rules for the group but don't delete the group
*/
function deleteGroup(){
    var defaultGroup = (Collect.current.group === "default"),
        confirmed;
    if ( defaultGroup ) {
        confirmed = confirm("Cannot delete \"default\" group. Do you want to clear out all of its pages instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this group and all of its related pages?");    
    }
    if ( !confirmed ) {
        return;
    }
    chrome.storage.local.get("sites", function deleteGroupChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            currOption = HTML.perm.group.select.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultGroup ) {
            site.groups["default"] = newGroup("default");
        } else {
            delete site.groups[Collect.current.group];
            currOption.parentElement.removeChild(currOption);
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        deleteEditing();
        loadGroupObject(site.groups["default"]);
    });
}

/***********************
    PAGE STORAGE
***********************/

function loadPage(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value,
        page = Collect.group.pages[name];
    Collect.current.page = name;
    resetInterface();
    deleteEditing();
    loadPageObject(page);
}

function deletePage(){
    var defaultPage = (Collect.current.page === "default"),
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
        Collect.group.addPage(page);
    } else {
        Collect.group.removePage(Collect.current.page);
        var currOption = HTML.perm.page.select.querySelector("option:checked");
        currOption.parentElement.removeChild(currOption);
        HTML.perm.page.select.querySelector("option[value=default]").selected = true;
        page = Collect.group.pages["default"];
    }
    saveGroup();

    resetInterface();
    deleteEditing();
    loadPageObject(page);
}

/***********************
    SELECTOR SET STORAGE
***********************/

function loadSet(ele){
    var option = ele.querySelector("option:checked"),
        name = option.value;
    Collect.current.set = name;

    deleteEditing();
    resetInterface();
    loadSetObject(Collect.group.pages[Collect.current.page].sets[name]);
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
    
    if ( !Collect.group.uniqueSelectorSetName(name) ) {
        alertMessage("a selector set named \"" + name + "\" already exists");
        return;
    }
    HTML.perm.set.select.appendChild(newOption(name));
    var page = Collect.group.pages[Collect.current.page],
        set = new SelectorSet(name);
    page.addSet(set);
    saveGroup();

    deleteEditing();
    loadSetObject(set);
}

function deleteSelectorSet(){
    var defaultSet = (Collect.current.set === "default"),
        confirmed;
    if ( defaultSet ) {
        confirmed = confirm("Cannot delete \"default\" rule set. Do you want to clear out all of its rules instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this rule set and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }

    var page = Collect.group.pages[Collect.current.page],
        set;
    page.removeSet(Collect.current.set);

    // handle setting new current SelectorSet
    if ( defaultSet ) {
        set = new SelectorSet("default");
        page.addSet(set);
    } else {
        var currOption = HTML.perm.set.select.querySelector("option:checked");
        currOption.parentElement.removeChild(currOption);
        Collect.current.set = "default";
        set = page.sets["default"];
        HTML.perm.set.select.querySelector("option[value=default]").selected = true;
    }

    saveGroup();
    deleteEditing();    
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

// creates an empty group object
function newGroup(name){
    return {
        name: name,
        pages: {"default": newPage("default", false)},
        urls: {}
    };
}

// creates an empty page object
function newPage(name, index){
    index = index || false;
    return {
        name: name,
        index: index,
        sets: {"default": newSet("default")}
    };
}

// creates an empty selectorSet object
function newSet(name){
    return {
        name: name,
        selectors: {}
    };
}

function uniqueGroupName(name, groups){
    for ( var key in groups ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
}

/*
a group's name will be the name of the file when it is uploaded, so make sure that any characters in the name will be legal to use
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
given JSON representing a group, create that Group's object and all associated 
Page/SelectorSet/Selector/Rule objects
also setup relevant HTML data associated with the Group
*/
function loadGroupObject(group){
    HTML.perm.group.select.querySelector("option[value=" + group.name + "]").selected = true;

    var url = window.location.href;
    HTML.info.indexToggle.checked = group.urls[url] !== undefined;

    // clear out current options and populate with current group's pages
    HTML.perm.page.select.innerHTML = "";
    options(Object.keys(group.pages), HTML.perm.page.select);
    var groupObject,
        page, pageObject, pageName,
        set, setObject, setName,
        selector, selectorObject, selectorName,
        rule, ruleObject, ruleName;

    groupObject = new Group(group.name, group.urls);
    // clear out previous group
    HTML.perm.group.holder.innerHTML = "";
    HTML.perm.group.holder.appendChild(groupObject.html());
    Collect.group = groupObject;
    Collect.current.group = group.name;
    
    // create all pages and child objects for the group
    for ( pageName in group.pages ) {
        page = group.pages[pageName];
        pageObject = new Page(page.name, page.index, page.next);
        groupObject.addPage(pageObject);
        for ( setName in page.sets ) {
            set = page.sets[setName];
            setObject = new SelectorSet(set.name, set.parent);
            pageObject.addSet(setObject);
            for ( selectorName in set.selectors ) {
                selector = set.selectors[selectorName];
                selectorObject = new Selector(selector.selector);
                setObject.addSelector(selectorObject);
                for ( ruleName in selector.rules ) {
                    rule = selector.rules[ruleName];
                    addRule(rule, selectorObject);
                }
            }
        }
    }
    loadPageObject(Collect.group.pages["default"]);
}

function loadPageObject(page){
    Collect.current.page = page.name;
    if ( page.name === "default" ) {
        HTML.info.index.style.display = "inline-block";
        HTML.perm.next.holder.style.display = "inline-block";
        // handle whether or not next has already been set
        if ( page.next ) {
            Collect.next = page.next;
            HTML.perm.next.selector.textContent = page.next;
        } else {
            delete Collect.next;
            HTML.perm.next.selector.textContent = "";
        }
    } else {
        HTML.info.index.style.display = "none";
        HTML.perm.next.holder.style.display = "none";
    }

    options(Object.keys(page.sets), HTML.perm.set.select);

    loadSetObject(page.sets["default"]);
}

function loadSetObject(set){
    Collect.parent = set.parent || {};
    Collect.current.set = set.name;

    if ( set.parent ) {
        HTML.perm.parent.holder.style.display = "inline-block";
        HTML.perm.parent.selector.textContent = set.parent.selector;
        addParentGroup(set.parent.selector, set.parent.low, set.parent.high);
        setRangeString(set.parent.low, set.parent.high);
    } else {
        HTML.perm.parent.holder.style.display = "none";
        HTML.perm.parent.selector.textContent = "";
        HTML.perm.parent.range.textContent = "";
        clearClass("parentGroup");
    }

    // don't call these in loadGroupObject or loadPageObject because we want to know if there is a
    // parent selector
    Interface.turnOn();
    Interface.update();
}

function deleteEditing(){
    delete Interface.editing;
}
