"use strict";

// create interface and return a function to remove the collectorjs interface
var removeInterface = (function(){
    var marginBottom = 0,
        element = noSelectElement("div");

    element.classList.add("collectjs");
    element.innerHTML = {{src/collector.html}};
    document.body.appendChild(element);
    addNoSelect(element.querySelectorAll("*"));    

    // some some margin at the bottom of the page
    var currentMargin = parseInt(document.body.style.marginBottom, 10);
    marginBottom = isNaN(currentMargin) ? 0 : currentMargin;
    document.body.style.marginBottom = (marginBottom + 500) + "px";

    return function(){
        element.parentElement.removeChild(element);
        document.body.style.marginBottom = marginBottom + "px";
    };
})();


/*********************************
            GLOBALS
*********************************/
/*
Object that stores information related to elements that match the current selector
(and how to select them)
*/
var Collect = {
    options: {},
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
        
        // tabs
        tabEvents();

        //views
        selectorViewEvents();
        ruleViewEvents();
        optionsViewEvents();

        setupSelectorView();
        setupRulesView();
    }
};

// save commonly referenced to elements
var HTML = {
    schema: {
        info: document.getElementById("schemaInfo"),
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

/*
brute force to find parent element of the passed in element argument that matches the parentSelector
O(n^2), so not ideal but works for the time being
*/
function nearestParent(element, parentSelector){
    var parents = Fetch.all(parentSelector),
        elementParents = [],
        curr = element;
    // get all parent elements of element up to BODY
    while ( curr !== null && curr.tagName !== "BODY" ) {
        curr = curr.parentElement;
        elementParents.push(curr);
    }
    for ( var i=0, iLen=elementParents.length; i<iLen; i++ ) {
        var par = elementParents[i];
        for ( var j=0, jLen=parents.length; j<jLen; j++ ) {
            if ( par === parents[j] ) {
                return par;
            }
        }
    }
    return;
}

// Family derived from clicked element in the page
var Family = {
    family: undefined,
    elements: [],
    selectableElements: [],
    create: function(event){
        event.stopPropagation();
        event.preventDefault();
        if ( event.currentTarget !== event.target ) {
            return;
        }

        var parent = Collect.parent.selector ?
            nearestParent(this, Collect.parent.selector) : document.body;

        Family.family = new SelectorFamily(this,
            parent,
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
        this.elements = [];
    },
    // create a SelectorFamily given a css selector string
    fromSelector: function(selector){
        var prefix = Collect.parent.selector ? Collect.parent.selector: "body",
            element = Fetch.one(selector, prefix);
        if ( element ) {

            var parent = Collect.parent.selector ?
                nearestParent(element, Collect.parent.selector) : document.body;

            this.family = new SelectorFamily(element,
                parent,
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
        return Fetch.matchedElements(selector, parent);
    },
    /*
    add queryCheck class to all elements matching selector
    set the count based on number of matching elements
    set the preview
    */
    test: function(){
        clearClass("queryCheck");
        clearClass("collectHighlight");

        var elements = this.selectorElements();
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        this.elements = elements;
        HTML.selector.count.textContent = elementCount(elements.length, Collect.parentCount);
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
        this.selectableElements = Fetch.matchedElements("*", parent);
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
    idEvent("closeCollect", "click", function(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface();
        clearClass("parentSchema");
        removeInterface();
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
    // restrict to range
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
    Collect.site.current.selector = undefined;
    Collect.site.saveCurrent();
    showSchemaView();
}

/***********************
    EVENT HELPERS
***********************/
function showSelectorView(){
    HTML.selector.type.textContent = UI.selectorType;
    switch(UI.selectorType){
    case "selector":
        HTML.selector.parent.holder.style.display = "none";
        break;
    case "parent":
        HTML.selector.parent.holder.style.display = "block";
        break;
    case "next":
        delete Collect.parentCount;
        HTML.selector.parent.holder.style.display = "none";
        clearClass("parentSchema");
        break;
    }

    setCurrentView(HTML.views.selector, HTML.tabs.schema);
    Family.turnOn();
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
    var errors = document.querySelectorAll(".collectjs .error");
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
    var elements = Fetch.all(selector),
        end = elements.length + high;
    Collect.parentCount = 0;
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentSchema");
        Collect.parentCount++;
    }
}

function setupRuleForm(selector, rule){
    // setup based on (optional) rule
    if ( rule ) {
        HTML.rule.name.value = rule.name;
        HTML.rule.capture.textContent = rule.capture;
        if ( rule.capture === "attr-href" ) {
            HTML.rule.follow.checked = rule.follow;
            HTML.rule.follow.disabled = false;
            HTML.rule.followHolder.style.display = "block";
        } else {
            HTML.rule.follow.checked = false;
            HTML.rule.follow.disabled = true;
            HTML.rule.followHolder.style.display = "none";
        }
    }

    // setup based on selector
    HTML.rule.selector.textContent = selector;
    var parent = Collect.site.current.set.parent,
        elements = Fetch.matchedElements(selector, parent);
    UI.ruleCycle.setElements(elements);
    addClass("savedPreview", elements);
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
            siteObject = storage.sites[host];
        // default setup if page hasn't been visited before
        if ( !siteObject ) {
            Collect.site = new Site(host);
            // save it right away
            Collect.site.save();
        } else {
            Collect.site = new Site(host, siteObject.schemas);
        }
        var siteHTML = Collect.site.html();
        HTML.schema.info.appendChild(siteHTML.topbar);
        HTML.schema.holder.appendChild(siteHTML.schema);
        Collect.site.loadSchema("default");
    });
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
