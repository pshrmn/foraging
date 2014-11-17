"use strict";

/****************************************************************************************
            GLOBALS
    Fetch:              used to select elements
    Parent:             used to limit selections to children element of parent selector
    HTML:               cache of various HTML elements that are referred to
    UI:                 used to interact with the CollectorJS user interface
    CollectOptions:     stores user options for how CollectorJS works
    SelectorView:       interactions with the selector view
    RuleView:           interactions with the rule view
****************************************************************************************/

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

        var parent = Parent.element(this);
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
        prefix = prefix ? prefix : Parent.selector();
        var element = Fetch.one(selector, prefix);
        // clear out existing SelectorFamily
        this.family = undefined;
        if ( element ) {
            var parent = Parent.element(element);
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
            parent = Parent.object();
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
        HTML.selector.count.textContent = elementCount(elements.length, Parent.getCount() );
        SelectorView.setElements(elements);
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
        var parent = Parent.object();
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
        clearClasses(["queryCheck", "collectHighlight", "savedPreview"]);
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

(function runCollectorJS(){
    chromeLoadOptions();
    chromeSetupHostname();
    
    // tabs
    tabEvents();

    //views
    optionsViewEvents();
})();

/*
reset state of interface
especially useful for when cancelling creating or editing a selector or rule
*/
function resetInterface(){
    Family.turnOff();
    if ( Parent.exists ){
        Parent.show();
    }
    clearClasses(["queryCheck", "collectHighlight", "savedPreview"]);
    SelectorView.reset();
    RuleView.reset();
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
    
    idEvent("schemaTab", "click", function(event){
        UI.showSchemaView();
    });

    idEvent("previewTab", "click", function(event){
        UI.showPreviewView();
    });

    idEvent("optionsTab", "click", function(event){
        UI.showOptionsView();
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

/***********************
    EVENT HELPERS
***********************/

// setup the selector form to edit the parent. selectorSet is passed in because parent is part of it
function editParent(selectorSet){
    Parent.type = "parent";
    SelectorView.editing = true;
    SelectorView.editingObject = selectorSet;
    var selector = selectorSet.parent.selector,
        low = selectorSet.parent.low || "",
        high = selectorSet.parent.high || "";
    Family.fromSelector(selectorSet.parent.selector, "body");
    SelectorView.show("parent", selectorSet.object().parent);
}

// setup the selector form to edit the selector
function editSelector(selector){
    Parent.type = "selector";
    SelectorView.editing = true;
    SelectorView.editingObject = selector;
    Family.fromSelector(selector.selector);
    SelectorView.show("selector", selector.object());
}

// setup the rule form to edit the rule
function editRule(rule){
    RuleView.editing = true;
    RuleView.editingObject = rule;
    RuleView.show(rule.parentSelector.selector, rule.object());
}
