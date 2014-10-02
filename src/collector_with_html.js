"use strict";

var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemaTab\">Schema</div><div class=\"tab\" id=\"previewTab\">Preview</div><div class=\"tab\" id=\"optionsTab\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Schema: <div id=\"schemaSelect\"></div><div id=\"schemaButtons\"></div></div><div>Page: <div id=\"pageSelect\"></div></div><div>Selector Set: <div id=\"selectorSetSelect\"></div><!--<button id=\"createSelectorSet\" title=\"create a new selector set\">+</button><button id=\"deleteSelectorSet\" title=\"delete current selector set\">&times;</button>--></div><button id=\"uploadRules\">Upload Schema</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemaView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div><h3>Type:<span id=\"selectorType\">Selector</span></h3></div><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label for=\"parentHigh\">High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"clearSelector\">Clear</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
    uses selector to match elements in the page
    parent is an optional object containing a selector and a low/high range to limit matched elements
    if parent.high/low are defined, only use parent.selector elements within that range
    */
    matchedElements: function(selector, parent){
        var allElements = [];
        if ( parent ) {
            var low = parent.low || 0,
                high = parent.high || 0;
            if ( low !== 0 || high !== 0 ) {
                // if either high or low is defined, 
                // iterate over all child elements of elements matched by parent selector
                var parents = document.querySelectorAll(parent.selector),
                    // add high because it is negative
                    end = parents.length + high,
                    currElements;
                for ( ; low<end; low++ ) {
                    currElements = parents[low].querySelectorAll(this.not(selector));
                    allElements = allElements.concat(Array.prototype.slice.call(currElements));
                }
            } else {
                allElements = this.all(selector, parent.selector);
            }
        } else {
            // don't care about parent when choosing next selector or a new parent selector
            allElements = this.all(selector, "body");
        }
        return Array.prototype.slice.call(allElements);
    },
    options: {},
    ruleElements: [],
    parent: {},
    site: undefined
};

/*
Object that controls the functionality of the interface
*/
var UI = {
    selectorType: "selector",
    editing: {},
    view: {
        view: undefined,
        tab: undefined
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
    schema: {
        holder: document.getElementById("schemaHolder")
    },
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
        type: document.getElementById("selectorType")
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
            buttons: document.getElementById("schemaButtons")
        },
        page: {
            select: document.getElementById("pageSelect"),
        },
        set: {
            select: document.getElementById("selectorSetSelect")
        },
        alert: document.getElementById("collectAlert"),
    },
    ui: document.querySelector(".collectjs"),
    preview: {
        contents: document.getElementById("previewContents")
    },
    tabs: {
        schema: document.getElementById("schemaTab"),
        preview: document.getElementById("previewTab"),
        options: document.getElementById("optionsTab")
    },
    views: {
        schema: document.getElementById("schemaView"),
        selector: document.getElementById("selectorView"),
        rule: document.getElementById("ruleView"),
        preview: document.getElementById("previewView"),
        options: document.getElementById("optionsView")
    }
};

// Family derived from clicked element in the page
var Family = {
    family: undefined,
    elements: [],
    selectableElements: [],
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
    selectorElements: function(){
        var selector = this.selector(),
            parent = Collect.site.current.set.parent;
        if ( selector === "") {
            return [];
        }
        return Collect.matchedElements(selector, parent);
    },
    /*
    add queryCheck class to all elements matching selector
    set the count based on number of matching elements
    set the preview
    */
    test: function(){
        clearClass("queryCheck");
        clearClass("collectHighlight");
        //Family.match();

        var elements = this.selectorElements(),
            totalCount  = elements.length ? elements.length : "";
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        this.elements = elements;
        HTML.selector.count.textContent = elementCount(totalCount, Collect.parentCount);
        UI.selectorCycle.setElements(elements);
    },
    selectorsOn: false,
    /*
    match all child elements of parent selector (or "body" if no parent seletor is provided)
        and save in Family.elements
    selectable elements are restricted by :not(.noSelect)
    add event listeners to all of those elements
    */
    turnOn: function(){
        var curr;
        if ( this.selectorsOn ) {
            this.turnOff();
        }
        var parent = UI.selectorType === "selector" ? Collect.parent: undefined;
        this.selectableElements = Collect.matchedElements("*", parent);
        for ( var i=0, len=this.selectableElements.length; i<len; i++ ) {
            curr = this.selectableElements[i];
            curr.addEventListener('click', this.create, false);
            curr.addEventListener('mouseenter', highlightElement, false);
            curr.addEventListener('mouseleave', unhighlightElement, false);
        }
        this.selectorsOn = true;
    },
    /*
    remove events from all elements in Family.elements
    clear out any classes that would be set by events on the elements
    */
    turnOff: function(){
        clearSelectorClasses();
        var curr;
        for ( var i=0, len=this.selectableElements.length; i<len; i++ ) {
            curr = this.selectableElements[i];
            curr.removeEventListener('click', this.create);
            curr.removeEventListener('mouseenter', highlightElement);
            curr.removeEventListener('mouseleave', unhighlightElement);
            
        }
        this.selectableElements = [];
        this.selectorsOn = true;
        this.elements = [];
    },
};

UI.setup();

/*
reset state of interface
especially useful for when cancelling creating or editing a selector or rule
*/
function resetInterface(){
    UI.editing = {};
    Family.turnOff();
    if ( Collect.parent ) {
        addParentSchema(Collect.parent);
    }
    clearSelectorClasses();
    resetSelectorView();
    resetRulesView();
}

/*
clear classes from all elements with matching classes
*/
function clearSelectorClasses(){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    clearClass("savedPreview");
}

function resetSelectorView(){
    Family.remove();

    UI.selectorType = "selector";
    UI.selectorCycle.reset();

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
        resetInterface();
        clearClass("parentSchema");
        HTML.ui.parentElement.removeChild(HTML.ui);
        document.body.style.marginBottom = marginBottom + "px";
    });

    // set default view/tab for UI
    UI.view.view = HTML.views.schema;
    UI.view.tab = HTML.tabs.schema;
    idEvent("schemaTab", "click", function(event){
        showSchemaView();
    });

    idEvent("previewTab", "click", function(event){
        showPreviewView();
    });

    idEvent("optionsTab", "click", function(event){
        showOptionsView();
    });
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
    // upload events
    idEvent("uploadRules", "click", function uploadEvent(event){
        event.preventDefault();
        uploadSchema();
    });
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
    showSchemaView();
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

    var elements = Family.selectorElements(),
        len = elements.length;
    elements = Array.prototype.slice.call(elements).slice(low, len + high);
    addClass("queryCheck", elements);
    UI.selectorCycle.setElements(elements);
    HTML.selector.count.textContent = elementCount(elements.length, Collect.parentCount);
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
    var success;
    switch(UI.selectorType){
    case "selector":
        success = saveSelector(selector);
        break;
    case "parent":
        success = saveParent(selector);
        break;
    case "next":
        success = saveNext(selector);
        break;
    default:
        success = true;
    }
    if ( success ) {
        resetInterface();
        showSchemaView();
    }
}

//update
function saveSelector(selector){
    var sel = new Selector(selector);
    // if editing just update the selector, otherwise add it to the current set
    if ( UI.editing.selector ) {
        UI.editing.selector.updateSelector(selector);
    } else {
        Collect.site.current.set.addSelector(sel);
    }
    
    Collect.site.saveCurrent();
    return true;
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
    addParentSchema(parent);

    // attach the parent to the current set and save
    Collect.site.current.set.addParent(parent);
    Collect.site.saveCurrent();
    return true;
}

function saveNext(selector){
    var match = document.querySelector(selector),
        name = Collect.site.current.page.name;

    if ( errorCheck( (name !== "default" ), HTML.selector.selector,
            ("Cannot add next selector to '" + name + "' page, only to default")) || 
        errorCheck(!match.hasAttribute("href"), HTML.selector.selector,
            "selector must select element with href attribute") ) {
        return false;
    }

    Collect.site.current.page.addNext(selector);
    Collect.site.saveCurrent();
    return true;
}

function clearSelectorEvent(event){
    event.preventDefault();
    resetInterface();
    showSchemaView();
}


/******************
    RULE EVENTS
******************/
//update
function saveRuleEvent(event){
    event.preventDefault();
    var name = HTML.rule.name.value,
        capture = HTML.rule.capture.textContent,
        follow = HTML.rule.follow.checked;

    // error checking
    clearErrors();
    if ( emptyErrorCheck(name, HTML.rule.name, "Name needs to be filled in") ||
        emptyErrorCheck(capture, HTML.rule.capture, "No attribute selected") || 
        reservedWordErrorCheck(name, HTML.rule.name, "Cannot use " + name + 
            " because it is a reserved word") ) {
        return;
    }

    if ( UI.editing.rule ) {
        UI.editing.rule.update({
            name: name,
            capture: capture,
            follow: follow
        });
        delete UI.editing.rule;
    } else {
        if ( !Collect.site.current.schema.uniqueRuleName(name) ) {
            // some markup to signify you need to change the rule's name
            alertMessage("Rule name is not unique");
            HTML.rule.name.classList.add("error");
            return;
        }
        var rule = new Rule(name, capture, follow);
        Collect.site.current.selector.addRule(rule);
    }
    Collect.ruleElements = [];
    Collect.site.current.selector = undefined;
    Collect.site.saveCurrent();
    showSchemaView();
}

/***********************
    EVENT HELPERS
***********************/
function showSelectorView(){
    HTML.selector.type.textContent = UI.selectorType;
    if ( UI.selectorType === "parent" ) {
        HTML.selector.parent.holder.style.display = "block";
    } else {
        HTML.selector.parent.holder.style.display = "none";
    }
    Family.turnOn();
    setCurrentView(HTML.views.selector, HTML.tabs.schema);
}

function showSchemaView(){
    setCurrentView(HTML.views.schema, HTML.tabs.schema);
}

function showRuleView(){
    setCurrentView(HTML.views.rule, HTML.tabs.schema);
}

function showPreviewView(){
    generatePreview();
    setCurrentView(HTML.views.preview, HTML.tabs.preview);
}

function showOptionsView(){
    setCurrentView(HTML.views.options, HTML.tabs.options);
}

function setCurrentView(view, tab){
    hideCurrentView();
    UI.view.view = view;
    UI.view.tab = tab;
    view.classList.add("active");
    tab.classList.add("active");
}

function hideCurrentView(){
    // turn selectors off when leaving selector view
    if ( UI.view.view.id === "selectorView" ) {
        Family.turnOff();
    }
    UI.view.view.classList.remove("active");
    UI.view.tab.classList.remove("active");
}

function generatePreview(){
    // only regen preview when something in the schema has changed
    if (  UI.preview.dirty ) {
        HTML.preview.contents.innerHTML = Collect.site.current.page.preview();
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
    Collect.parentCount = 0;
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentSchema");
        Collect.parentCount++;
    }
}

function setupRuleForm(selector){
    HTML.rule.selector.textContent = selector;

    var parent = Collect.site.current.set.parent,
        elements = Collect.matchedElements(selector, parent);
    UI.ruleCycle.setElements(elements);
    addClass("savedPreview", elements);
    // elements matching the selector for the current rule
    Collect.ruleElements = elements;
}

function elementCount(count, parentCount){
    if ( parentCount ) {
        return parseInt(count/parentCount) + " per parent group";
    } else {
        return count + " total";
    }
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
            siteObject = storage.sites[host],
            site,
            key;
        // default setup if page hasn't been visited before
        if ( !siteObject ) {
            site = new Site(host);
            // save it right away
            site.save();
        } else {
            site = new Site(host, siteObject.schemas);
        }
        Collect.site = site;
        var siteHTML = site.html();
        HTML.schema.holder.appendChild(siteHTML);
        site.loadSchema("default");
    });
}

function uploadSchema(){
    var data = {
        schema: Collect.site.current.schema.uploadObject(),
        site: window.location.host
    };
    chrome.runtime.sendMessage({type: 'upload', data: data});
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
