"use strict";

var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemasTab\" data-for=\"schemasView\">Schema</div><div class=\"tab\" id=\"selectorTab\" data-for=\"selectorView\">Selector</div><div class=\"tab\" id=\"ruleTab\" data-for=\"ruleView\">Rule</div><div class=\"tab\" id=\"previewTab\" data-for=\"previewView\">Preview</div><div class=\"tab\" id=\"optionsTab\" data-for=\"optionsView\">Options</div><div class=\"tab\" id=\"refreshCollect\">&#8635;</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Schema: <select id=\"schemaSelect\"></select><button id=\"createSchema\" title=\"create a new schema\">+</button><button id=\"deleteSchema\" title=\"delete current schema\">&times;</button><div id=\"indexMarker\" class=\"info\">Initial URL<input type=\"checkbox\" id=\"indexToggle\" /></div><div id=\"nextHolder\" class=\"info\">Next:<span id=\"nextSelectorView\"></span><button id=\"removeNext\">&times;</button></div></div><div>Page: <select id=\"pageSelect\"></select><button id=\"deletePage\" title=\"delete current page\">&times;</button></div><div>Selector Set: <select id=\"selectorSetSelect\"></select><button id=\"createSelectorSet\" title=\"create a new selector set\">+</button><button id=\"deleteSelectorSet\" title=\"delete current selector set\">&times;</button><div id=\"currentParent\" class=\"info\">Parent:<span id=\"parentSelectorView\"></span><span id=\"parentRangeView\"></span><button id=\"removeParent\">&times;</button></div></div><button id=\"uploadRules\">Upload Schema</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemasView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div><h3>Type:</h3><p><label for=\"selectorRadio\">Selector</label><input type=\"radio\" id=\"selectorRadio\" name=\"selector\" value=\"selector\" checked/></p><p><label for=\"parentRadio\">Parent</label><input type=\"radio\" id=\"parentRadio\" name=\"selector\" value=\"parent\" /></p><p><label for=\"nextRadio\">Next</label><input type=\"radio\" id=\"nextRadio\" name=\"selector\" value=\"next\" /></p></div><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label for=\"parentHigh\">High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"clearSelector\">Clear</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><form id=\"editForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"editName\" name=\"editName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"editAttr\"></span></div><div class=\"rule editFollow\"><label for=\"editFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"editFollow\" name=\"editFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveEdit\">Save Edited Rule</button><button id=\"cancelEdit\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><p>Name: <span id=\"previewName\" class=\"name\"></span>Selector: <span id=\"previewSelector\" class=\"name\"></span>Capture: <span id=\"previewCapture\" class=\"name\"></span><button id=\"previewClear\">Clear</button></p><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
var Interface = {
    activeForm: "rule",
    activeSelector: "selector",
    editing: {

    },
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
        HTML.perm.schema.select.querySelector("option[value=" + Collect.current.schema.name + "]").selected = true;
        HTML.perm.page.select.querySelector("option[value=" + Collect.current.page.name + "]").selected = true;
        HTML.perm.set.select.querySelector("option[value=" + Collect.current.set.name + "]").selected = true;
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
        selector: document.getElementById("ruleSelector"),
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
            follow: document.getElementById("editFollow"),
            followHolder: document.querySelector("#ruleItems .editFollow")  
        }
    },
    // elements in the the permament bar
    perm: {
        schema: {
            select: document.getElementById("schemaSelect"),
            holder: document.getElementById("schemaHolder"),
            index: document.getElementById("indexMarker"),
            indexToggle: document.getElementById("indexToggle")
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
    },
    interface: document.querySelector(".collectjs"),
    // elements in the preview view
    preview: {
        contents: document.getElementById("previewContents"),
        clear: document.getElementById("previewClear")
    },
    tabs: {
        selector: document.getElementById("selectorTab"),
        rule: document.getElementById("ruleTab"),
        schema: document.getElementById("schemasTab"),
        preview: document.getElementById("previewTab")
    }
};

// Family derived from clicked element in the page
var Family = {
    family: undefined,
    create: function(event){
        event.stopPropagation();
        event.preventDefault();

        resetInterface(); 
        if ( Interface.editing.rule ) {
            // preserve name when switching selector while editing
            HTML.rule.edit.name.value = Interface.editing.rule.name;
        }
        
        var sf = new SelectorFamily(this,
            Collect.parent.selector,
            HTML.selector.family,
            HTML.selector.selector,
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
            HTML.selector.family,
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
    fromSelector: function(selector, text){
        var prefix = Collect.parent.selector ? Collect.parent.selector: "body",
            element = Collect.one(selector, prefix);
        text = text || HTML.selector.selector;
        if ( element ) {
            var sf = new SelectorFamily(element,
                Collect.parent.selector,
                HTML.selector.family,
                text,
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
            totalCount;
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        totalCount = elements.length ? elements.length : "";

        HTML.selector.count.textContent = elementCount(totalCount, Collect.parentCount);
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
    resetSelectorView();
    resetRulesView();
    resetPreviewView();
}

function resetSelectorView(){
    Family.remove();

    clearClass("queryCheck");
    clearClass("collectHighlight");
    clearClass("savedPreview");

    Interface.activeSelector = "selector";
    Interface.selectorCycle.reset();

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

    Interface.ruleCycle.reset();
    HTML.rule.selector.textContent = "";

    // reset rule form
    HTML.rule.rule.name.value = "";
    HTML.rule.rule.capture.textContent = "";
    HTML.rule.rule.follow.checked = false;
    HTML.rule.rule.follow.disabled = true;
    HTML.rule.rule.followHolder.style.display = "none";

    // reset edit form
    HTML.rule.edit.name.value = "";
    HTML.rule.edit.capture.textContent = "";
    HTML.rule.edit.follow.checked = false;
    HTML.rule.edit.follow.disabled = true;
    HTML.rule.edit.followHolder.style.display = "none";
}

function resetPreviewView(){
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
        clearClass('parentSchema');
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
    idEvent("clearSelector", "click", clearSelectorEvent);
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

// 
function refreshElements(){
    resetInterface();
    Interface.turnOn();
}

function cancelRuleEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();
    showTab(HTML.tabs.schema);
}

function cancelEditEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();
    showTab(HTML.tabs.schema);
}

function verifyAndApplyParentLow(event){
    var low = parseInt(HTML.selector.parent.low.value, 10),
        high = parseInt(HTML.selector.parent.high.value, 10) || 0;
    if ( HTML.selector.parent.low.value === "" ) {
        low = 0;
    } else if ( isNaN(low) || low <= 0 ) {
        HTML.selector.parent.low.value = "";
        alertMessage("Low must be positive integer greater than 0");
        return;
    }

    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.selector.count.textContent = elementCount(Collect.matchedElements.length, Collect.parentCount);
}

function verifyAndApplyParentHigh(event){
    var low = parseInt(HTML.selector.parent.low.value, 10) || 0,
        high = parseInt(HTML.selector.parent.high.value, 10);

    if ( HTML.selector.parent.high.value === "" ) {
        high = 0;
    } else if ( isNaN(high) || high > 0 ) {
        HTML.selector.parent.high.value = "";
        alertMessage("High must be a negative integer");
        return;
    }
    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.selector.count.textContent = elementCount(Collect.matchedElements.length, Collect.parentCount);
}

/*
if the .capture element clicked does not have the .selected class, set attribute to capture
otherwise, clear the attribute to capture
toggle .selected class
*/
function capturePreview(event){
    var capture, follow, followHolder;
    switch(Interface.activeForm){
    case "rule":
        capture = HTML.rule.rule.capture;
        follow = HTML.rule.rule.follow;
        followHolder = HTML.rule.rule.followHolder;
        break;
    case "edit":
        capture = HTML.rule.edit.capture;
        follow = HTML.rule.edit.follow;
        followHolder = HTML.rule.edit.followHolder;
        break;
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
    baseCancel();
}

function saveSelector(selector){
    var sel = new Selector(selector);
    // if editing just update the selector, otherwise add it to the current set
    if ( Interface.editing.selector ) {
        Interface.editing.selector.updateSelector(selector);
        showTab(HTML.tabs.schema);
    } else {
        Collect.current.set.addSelector(sel, [newRuleEvent, editSelectorEvent, removeSelectorEvent]);
    }

    saveSchema();
}

function saveParent(selector){
    var low = parseInt(HTML.selector.parent.low.value, 10),
        high = parseInt(HTML.selector.parent.high.value, 10),
        parent = {
            selector: selector
        };

    Collect.parentCount = Collect.matchedElements.length;

    if ( !isNaN(low) ) {
        parent.low = low;
    }
    if ( !isNaN(high) ) {
        parent.high = high;
    }


    Collect.parent = parent;
    HTML.perm.parent.holder.style.display = "inline-block";
    HTML.perm.parent.selector.textContent = selector;
    HTML.perm.parent.range.textContent = createRangeString(low, high);
    addParentSchema(selector, parent.low, parent.high);

    // attach the parent to the current set and save
    Collect.current.set.addParent(parent);
    saveSchema();
    refreshElements();
}

function saveNext(selector){
    var match = document.querySelector(selector),
        name = Collect.current.page.name;

    if ( name !== "default" ) {
        alertMessage("Cannot add next selector to '" + name + "' page, only to default");
        return;
    }
    if ( errorCheck(!match.hasAttribute("href"), HTML.selector.selector, "selector must select element with href attribute") ) {
        return;
    }

    HTML.perm.next.selector.textContent = selector;

    Collect.current.page.index = true;
    Collect.current.page.next = selector;
    saveSchema();

    showRuleForm();
    if ( Collect.parent.selector ) {
        addParentSchema(Collect.parent.selector, Collect.parent.low, Collect.parent.high);
    }

    refreshElements();
}

function clearSelectorEvent(event){
    event.preventDefault();
    resetSelectorView();
}

function updateRadioEvent(event){
    Interface.activeSelector = this.value;
    HTML.selector.parent.holder.style.display = (Interface.activeSelector === "parent") ? "block": "none";
}

function removeSelectorEvent(event){
    event.preventDefault();
    this.remove();
    saveSchema();
}

/******************
    RULE EVENTS
******************/
function newRuleEvent(event){
    event.preventDefault();
    Collect.current.selector = this;

    setupRuleForm(this.selector);
    showTab(HTML.tabs.rule);
}

function editSelectorEvent(event){
    event.preventDefault();
    Interface.editing.selector = this;
    Family.fromSelector(this.selector);
    Family.match();

    HTML.selector.radio.parent.disabled = true;
    HTML.selector.radio.next.disabled = true;

    showTab(HTML.tabs.selector);
}

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
    else if ( !Collect.current.schema.uniqueRuleName(name) ) {
        // some markup to signify you need to change the rule's name
        alertMessage("Rule name is not unique");
        HTML.rule.rule.name.classList.add("error");
        return;
    }

    if ( follow ) {
        rule.follow = true;
    }
    var selector = Collect.current.selector;
    addRule(rule, selector);
    saveSchema();
    resetInterface();
    showTab(HTML.tabs.schema);
}

function saveEditEvent(event){
    event.preventDefault();
    var name = HTML.rule.edit.name.value,
        capture = HTML.rule.edit.capture.textContent,
        follow = HTML.rule.edit.follow.checked,
        rule = {
            name: name,
            capture: capture
        };

    clearErrors();
    if ( emptyErrorCheck(name, HTML.rule.edit.name, "Name needs to be filled in") ||
        emptyErrorCheck(capture, HTML.rule.edit.capture, "No attribute selected") ) {
        return;
    }

    var select;
    if ( follow ) {
        rule.follow = true;
        select = HTML.perm.page.select;
    }

    // include select for follow page
    Interface.editing.rule.update(rule, select);
    saveSchema();

    delete Interface.editing.rule;
    showRuleForm();
    resetInterface();
    showTab(HTML.tabs.schema);
}

function deleteParentEvent(event){
    event.preventDefault();
    delete Collect.parentCount;
    Collect.parent = {};
    HTML.perm.parent.holder.style.display = "none";
    HTML.perm.parent.selector.textContent = "";
    HTML.perm.parent.range.textContent = "";
    Collect.current.set.removeParent();
    saveSchema();
    clearClass("parentSchema");
    showRuleForm();
    Interface.turnOn();
}

function deleteNextEvent(event){
    event.preventDefault();
    delete Collect.next;
    HTML.perm.next.holder.style.display = "none";
    HTML.perm.next.selector.textContent = "";
    Collect.current.page.removeNext();
    saveSchema();
    Interface.turnOn();
}

function toggleURLEvent(event){
    Collect.current.schema.toggleURL(window.location.href);
    saveSchema();
}

/************************
    SAVED RULE EVENTS
************************/
function selectorViewRule(event){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    var elements = parentElements(this.parentSelector.selector);
    addClass("savedPreview", elements);
}

function unselectorViewRule(event){
    clearClass("savedPreview");
}

function editSavedRule(event){
    Interface.editing.rule = this;

    // setup the form
    HTML.rule.edit.name.value = this.name;
    HTML.rule.selector.textContent = this.parentSelector.selector;
    HTML.rule.edit.capture.textContent = this.capture;
    if ( this.follow || this.capture === "attr-href" ) {
        HTML.rule.edit.follow.checked = this.follow;
        HTML.rule.edit.follow.disabled = false;
        HTML.rule.edit.followHolder.style.display = "block";
    } else {
        HTML.rule.edit.follow.checked = false;
        HTML.rule.edit.follow.disabled = true;
        HTML.rule.edit.followHolder.style.display = "none";
    }

    // show edit form after setting values, but before calling setupRuleForm
    // because Interface.activeForm needs to equal "edit"
    showEditForm();
    setupRuleForm(this.parentSelector.selector);
    showTab(HTML.tabs.rule);
}

/*
function previewSavedRule(event){
    //HTML.preview.contents;
    var elements = parentElements(this.parentSelector.selector);
    generatePreviewElements(this.capture, elements);
    showTab(HTML.tabs.preview);
}
*/

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

    // if rule follow=true, add an option for it
    /*
    if ( rule.follow ) {
        Collect.current.group.pages[rule.name].addOption(HTML.perm.page.select);
    }
    */
}

/*
add .parentSchema to all elements matching parent selector and in range
*/
function addParentSchema(selector, low,  high){
    low = low || 0;
    high = high || 0;
    var elements = Collect.all(selector),
        end = elements.length + high;
        // add high because it is negative
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentSchema");
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

function setupRuleForm(selector){
    HTML.rule.selector.textContent = selector;
    var elements = parentElements(selector);
    Interface.ruleCycle.setElements(elements);
    addClass("queryCheck", elements);
    // set global for allLinks (fix?)
    Collect.matchedElements = elements;
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
    Interface.editing = {};
    resetInterface();
    showRuleForm();
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
        baseCancel();
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
        baseCancel();
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
    baseCancel();
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
        page.addOption(HTML.perm.page.select);
        Collect.current.schema.addPage(page);
    } else {
        Collect.current.schema.removePage(Collect.current.page.name);
        page = Collect.current.schema.pages["default"];
        page.htmlElements.option.selected = true;
    }
    saveSchema();
    baseCancel();
    loadPageObject(page);
}

/***********************
    SELECTOR SET STORAGE
***********************/

function loadSet(ele){
    var option = ele.querySelector("option:checked"),
        name = option.value;
    baseCancel();
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
    set.addOption(HTML.perm.set.select);
    Collect.current.page.addSet(set);
    saveSchema();

    baseCancel();
    loadSetObject(set);
}

function deleteSelectorSet(){
    var defaultSet = (Collect.current.set.name === "default"),
        confirmed;
    if ( defaultSet ) {
        confirmed = confirm("Cannot delete \"default\" rule set. Do you want to clear out all of its rules instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this rule set and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }

    var set;
    // handle setting new current SelectorSet
    if ( defaultSet ) {
        Collect.current.page.removeSet("default");
        set = new SelectorSet("default");
        set.addOption(HTML.perm.set.select);
        Collect.current.page.addSet(set);
    } else {
        Collect.current.set.remove();
        Collect.current.set = undefined;
        set = Collect.current.page.sets["default"];
        set.htmlElements.option.selected = true;
    }

    saveSchema();
    baseCancel();
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
    HTML.perm.schema.indexToggle.checked = schema.urls[url] !== undefined;

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
        pageObject.addOption(HTML.perm.page.select);

        schemaObject.addPage(pageObject);
        for ( setName in page.sets ) {
            set = page.sets[setName];

            setObject = new SelectorSet(set.name, set.parent);
            setObject.addOption(HTML.perm.set.select);

            pageObject.addSet(setObject);
            for ( selectorName in set.selectors ) {
                selector = set.selectors[selectorName];
                selectorObject = new Selector(selector.selector);
                setObject.addSelector(selectorObject, [newRuleEvent, editSelectorEvent, removeSelectorEvent]);
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
    if ( page.name === "default" ) {
        HTML.perm.schema.index.style.display = "inline-block";
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
        HTML.perm.schema.index.style.display = "none";
        HTML.perm.next.holder.style.display = "none";
    }

    options(Object.keys(page.sets), HTML.perm.set.select);

    loadSetObject(page.sets["default"]);
}

function loadSetObject(set){
    Collect.parent = set.parent || {};
    Collect.current.set = set;

    if ( set.parent ) {
        HTML.perm.parent.holder.style.display = "inline-block";
        HTML.perm.parent.selector.textContent = set.parent.selector;
        addParentSchema(set.parent.selector, set.parent.low, set.parent.high);
        HTML.perm.parent.range.textContent = createRangeString(set.parent.low, set.parent.high);
        Collect.parentCount = Collect.all(set.parent.selector).length;
    } else {
        HTML.perm.parent.holder.style.display = "none";
        HTML.perm.parent.selector.textContent = "";
        HTML.perm.parent.range.textContent = "";
        clearClass("parentSchema");
        delete Collect.parentCount;
    }

    // don't call these in loadSchemaObject or loadPageObject because we want to know if there is a
    // parent selector
    Interface.turnOn();
    Interface.update();
}
