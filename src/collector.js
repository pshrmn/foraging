"use strict";

/****************************************************************************************
            GLOBALS
    Fetch:      used to select elements
    Parent:     used to limit selections to children element of parent selector
    HTML:       cache of various HTML elements that are referred to
    UI:         used to inter
****************************************************************************************/
var CollectOptions = {};

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

        var parent = Parent.element(this, UI.selectorType);
        Family.family = new SelectorFamily(this,
            parent,
            HTML.selector.family,
            HTML.selector.selector,
            Family.test.bind(Family),
            CollectOptions
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
    fromSelector: function(selector, prefix){
        // default to using provided prefix, then check Parent, lastly use "body"
        prefix = prefix ? prefix : Parent.selector(UI.selectorType);
        var element = Fetch.one(selector, prefix);
        // clear out existing SelectorFamily
        this.family = undefined;
        if ( element ) {
            var parent = Parent.element(element, UI.selectorType);
            this.family = new SelectorFamily(element,
                parent,
                HTML.selector.family,
                HTML.selector.selector,
                Family.test.bind(Family),
                CollectOptions
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
    // uses Parent to limit matches
    selectorElements: function(){
        var selector = this.selector(),
            parent = Parent.object(UI.selectorType);
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
        var parentCount = UI.selectorType === "selector" ? Parent.count : undefined;
        HTML.selector.count.textContent = elementCount(elements.length, parentCount);
        UI.selectorCycle.setElements(elements);
    },
    selectorsOn: false,
    /*
    match all child elements of parent selector (or "body" if no parent selector is provided)
        and save in Family.elements
    selectable elements are restricted by :not(.noSelect)
    add event listeners to all of those elements
    */
    turnOn: function(){
        var curr;
        if ( this.selectorsOn ) {
            this.turnOff();
        }
        var parent = Parent.object(UI.selectorType);
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

// control the selector view
var SelectorView = {
    reset: function(){
        Family.remove();
        UI.selectorType = "selector";
        UI.selectorCycle.reset();

        HTML.selector.parent.holder.style.display = "none";
        HTML.selector.parent.low.value = "";
        HTML.selector.parent.high.value = "";
        HTML.selector.count.textContent = "";
    },
    setup: function(){
        UI.selectorCycle = new Cycle(document.getElementById("selectorCycleHolder"));
        idEvent("saveSelector", "click", this.saveEvent);
        idEvent("cancelSelector", "click", this.cancelEvent);
    },
    // type is the type of selector that is being created
    // selector is a pre-existing selector to be edited
    show: function(type, selector){
        HTML.selector.type.textContent = type;
        UI.selectorType = type;
        switch(type){
        case "selector":
            HTML.selector.parent.holder.style.display = "none";
            if ( selector ) {
                HTML.selector.selector.textContent = selector.selector;
            }
            break;
        case "parent":
            HTML.selector.parent.holder.style.display = "block";
            Parent.hide();
            if ( selector ) {
                HTML.selector.parent.low.value = selector.low || "";
                HTML.selector.parent.high.value = selector.high || "";
                HTML.selector.selector.textContent = selector.selector;
            }
            break;
        case "next":
            HTML.selector.parent.holder.style.display = "none";
            Parent.hide();
            break;
        }

        setCurrentView(HTML.views.selector, HTML.tabs.schema);
        Family.turnOn();
    },
    saveEvent: function(event){
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
    },
    cancelEvent: function(event){
        event.preventDefault();
        resetInterface();
        showSchemaView();
    }
};

// control the rule view
var RuleView = {
    reset: function(){
        UI.ruleCycle.reset();
        HTML.rule.selector.textContent = "";

        // reset rule form
        HTML.rule.name.value = "";
        HTML.rule.capture.textContent = "";
        HTML.rule.follow.checked = false;
        HTML.rule.follow.disabled = true;
        HTML.rule.followHolder.style.display = "none";
    },
    setup: function(){
        UI.ruleCycle = new Cycle(document.getElementById("ruleCycleHolder"), true);   

        idEvent("saveRule", "click", this.saveEvent);
        idEvent("cancelRule", "click", this.cancelEvent);

        idEvent("parentLow", "blur", this.rangeEvent);
        idEvent("parentHigh", "blur", this.rangeEvent);
    },
    show: function(selector, rule){
        //test
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
        var parent = Parent.parent,
            elements = Fetch.matchedElements(selector, parent);
        UI.ruleCycle.setElements(elements);
        addClass("savedPreview", elements);

        setCurrentView(HTML.views.rule, HTML.tabs.schema);
    },
    saveEvent: function(event){
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

        if ( UI.editing ) {
            UI.editingObject.update({
                name: name,
                capture: capture,
                follow: follow
            });
            delete UI.editingObject;
        } else {
            if ( !CurrentSite.current.schema.uniqueRuleName(name) ) {
                // some markup to signify you need to change the rule's name
                alertMessage("Rule name is not unique");
                HTML.rule.name.classList.add("error");
                return;
            }
            var rule = new Rule(name, capture, follow);
            CurrentSite.current.selector.addRule(rule);
        }
        CurrentSite.current.selector = undefined;
        CurrentSite.saveCurrent();
        showSchemaView();
    },
    cancelEvent: function(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface();
        showSchemaView();
    },
    rangeEvent: function(event){
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
        clearClass("queryCheck");
        addClass("queryCheck", elements);
        UI.selectorCycle.setElements(elements);
        var parentCount = UI.selectorType === "selector" ? Parent.count : undefined;
        HTML.selector.count.textContent = elementCount(elements.length, parentCount);
    }
};

(function(){
    chromeLoadOptions();
    chromeSetupHostname();
    
    // tabs
    tabEvents();

    //views
    SelectorView.setup();
    RuleView.setup();
    optionsViewEvents();
})();

/*
reset state of interface
especially useful for when cancelling creating or editing a selector or rule
*/
function resetInterface(){
    UI.editing = false;
    delete UI.editingObject;

    Family.turnOff();
    if ( Parent.exists ){
        Parent.show();
    }
    clearSelectorClasses();
    SelectorView.reset();
    RuleView.reset();
}

/*
clear classes from all elements with matching classes
*/
function clearSelectorClasses(){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    clearClass("savedPreview");
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
        Parent.remove();
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

function optionsViewEvents(){
    idEvent("ignore", "change", function toggleTabOption(event){
        // if option exists, toggle it, otherwise set based on whether or not html element is checked
        if ( CollectOptions.ignore ) {
            CollectOptions.ignore = !CollectOptions.ignore;
        } else {
            CollectOptions.ignore = document.getElementById("ignore").checked;
        }
        chromeSetOptions(CollectOptions);
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

/******************
    SAVE SELECTOR
******************/

//update
function saveSelector(selector){
    var sel = new Selector(selector);
    // if editing just update the selector, otherwise add it to the current set
    if ( UI.editing ) {
        UI.editingObject.updateSelector(selector);
    } else {
        CurrentSite.current.set.addSelector(sel);
    }
    
    CurrentSite.saveCurrent();
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
    Parent.set(parent);

    // attach the parent to the current set and save
    CurrentSite.current.set.addParent(parent);
    CurrentSite.saveCurrent();
    return true;
}

function saveNext(selector){
    var match = document.querySelector(selector),
        name = CurrentSite.current.page.name;

    if ( errorCheck( (name !== "default" ), HTML.selector.selector,
            ("Cannot add next selector to '" + name + "' page, only to default")) || 
        errorCheck(!match.hasAttribute("href"), HTML.selector.selector,
            "selector must select element with href attribute") ) {
        return false;
    }

    CurrentSite.current.page.addNext(selector);
    CurrentSite.saveCurrent();
    return true;
}

/***********************
    EVENT HELPERS
***********************/

// setup the selector form to edit the parent. selectorSet is passed in because parent is part of it
function editParent(selectorSet){
    UI.editing = true;
    UI.editingObject = selectorSet;
    var selector = selectorSet.parent.selector,
        low = selectorSet.parent.low || "",
        high = selectorSet.parent.high || "";
    Family.fromSelector(selectorSet.parent.selector, "body");
    SelectorView.show("parent", selectorSet.object().parent);
}

// setup the selector form to edit the selector
function editSelector(selector){
    UI.editing = true;
    UI.editingObject = selector;
    Family.fromSelector(selector.selector);
    SelectorView.show("selector", selector.object());
}

// setup the rule form to edit the rule
function editRule(rule){
    UI.editing = true;
    UI.editingObject = rule;
    RuleView.show(rule.parentSelector.selector, rule.object());
}

function showSchemaView(){
    setCurrentView(HTML.views.schema, HTML.tabs.schema);
    if ( Parent.exists ) {
        Parent.show();
    }
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
    if (  UI.previewDirty ) {
        HTML.preview.innerHTML = CurrentSite.current.page.preview();
    }
    UI.previewDirty = false;
}

/*
add the message to #ruleAlert
*/
function alertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    HTML.alert.appendChild(p);
    setTimeout(function(){
        HTML.alert.removeChild(p);
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

// setup the rule form using the selector
// if a rule is passed in, preset values based on the rule
function setupRuleForm(selector, rule){
    //test2
}

function elementCount(count, parentCount){
    if ( parentCount ) {
        return parseInt(count/parentCount) + " per parent group";
    } else {
        return count + " total";
    }
}
