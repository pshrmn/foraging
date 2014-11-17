'use strict';
// Source: src/utility.js
// creates a new element with tagName of type that has class noSelect
function noSelectElement(type){
    var ele = document.createElement(type);
    ele.classList.add("noSelect");
    return ele;
}

// purge a classname from all elements with it
function clearClass(name){
    var eles = document.getElementsByClassName(name),
        len = eles.length;
    // iterate from length to 0 because its a NodeList
    while ( len-- ){
        eles[len].classList.remove(name);
    }
}

function clearClasses(names){
    names.forEach(function(d){
        clearClass(d);
    });
}

// iterate over array (or converted nodelist) and add a class to each element
function addClass(name, eles){
    eles = Array.prototype.slice.call(eles);
    var len = eles.length;
    for ( var i=0; i<len; i++ ) {
        eles[i].classList.add(name);
    }
}

// utility function to swap two classes
function swapClasses(ele, oldClass, newClass){
    ele.classList.remove(oldClass);
    ele.classList.add(newClass);
}

// add an EventListener to a an element, given the id of the element
function idEvent(id, type, fn){
    document.getElementById(id).addEventListener(type, fn, false);
}

// add the .noSelect class to eles array, so that collect.js doesn't try to select them
function addNoSelect(eles){
    var len = eles.length;
    for( var i=0; i<len; i++ ) {
        eles[i].classList.add('noSelect');
    }
}

function options(keys, holder){
    // clear out any existing options when adding multiple new options
    holder.innerHTML = "";
    for ( var i=0, len=keys.length; i<len; i++ ){
        holder.appendChild(newOption(keys[i]));
    }
}

function newOption(name){
    var option = noSelectElement("option");
    option.setAttribute("value", name);
    option.textContent = name;
    return option;
}

// append all of the elements in children to the parent element
function appendChildren(parent, children){
    if ( parent === null ) {
        return;
    }
    for ( var i=0, len=children.length; i<len; i++ ) {
        parent.appendChild(children[i]);
    }
}

/*
a schema's name will be the name of the file when it is uploaded, so make sure that any characters in the name will be legal to use
rejects if name contains characters not allowed in filename: <, >, :, ", \, /, |, ?, *
*/
function legalSchemaName(name){
    if ( name === null ) {
        return false;
    }
    var badCharacters = /[<>:"\/\\\|\?\*]/,
        match = name.match(badCharacters);
    return ( match === null );
}

function createRangeString(low, high){
    low             = parseInt(low, 10);
    high            = parseInt(high, 10);
    var lowString   = low !== 0 && !isNaN(low) ? low : "start";
    var highString  = high !== 0 && !isNaN(high) ? high : "end";
    return "(" + lowString + " to " + highString + ")";
}

function elementCount(count, parentCount){
    if ( parentCount ) {
        return parseInt(count/parentCount) + " per parent group";
    } else {
        return count + " total";
    }
}


// Source: src/selector.js
/********************
    SELECTORFAMILY
********************/
/*
ele is the child element you want to build a selector from
parent is the selector for the most senior element you want to build a selector up to
    or "body" if parent is undefined or an empty string
text is an element whose textContent will be set based on SelectorFamily.toString in update
fn is a callback for when SelectorFamily.update is called
options are optional
*/
function SelectorFamily(ele, parent, holder, text, fn, options){
    this.selectors      = [];
    this.ele            = noSelectEle("div", ["selectorFamily"]);
    this.text           = text;
    this.updateFunction = fn;
    this.options        = options || {};

    // clear out holder, then attach SelectorFamily.ele
    holder.innerHTML = "";
    holder.appendChild(this.ele);

    this._makeSelectors(ele, parent);
}

SelectorFamily.prototype = {
    // "Private" methods
    /***
    given the element, its parent element, and selector options, iterate from the element (inclusive)
    to the parent (exclusive) and create an ToggleableElement for each element
    ***/
    _makeSelectors: function(ele, parent){
        // Generates the selectors array with Selectors from ele to parent (ignoring document.body)
        // Order is from most senior element to provided ele
        // if a select is given, swap ele to be the first option
        if ( ele.tagName === "SELECT" && ele.childElementCount > 0 ) {
            ele = ele.children[0];
        }
        while ( ele !== null && ele !== parent ) {
            if ( !this.filter(ele) ) {
                ele = ele.parentElement;
                continue;
            }
            this.selectors.push(new ToggleableElement(ele, this));
            ele = ele.parentElement;
        }
        // reverse selectors so 0-index is selector closest to body
        this.selectors.reverse();
        var curr;
        for ( var i=0, len=this.selectors.length; i<len; i++ ) {
            curr = this.selectors[i];
            this.ele.appendChild(curr.ele);
            curr.index = i;
        }
        this.selectors[this.selectors.length-1].setAll();
    },
    /***
    only include an element if it meets requirements (determined by options)
    ***/
    filter: function(ele){
        if ( this.options.ignore && !allowedElement(ele.tagName) ) {
            return false;
        }
        return true;
    },
    removeSelector: function(index){
        this.selectors.splice(index, 1);
        // reset index values after splice
        for ( var i=0, len=this.selectors.length; i<len; i++ ) {
            this.selectors[i].index = i;
        }
        this.update();
    },
    // "Public" methods
    remove: function(){
        this.ele.parentElement.removeChild(this.ele);
        if ( this.text ) {
            this.text.textContent = "";
        }
    },
    // called when something changes with the selectors/fragments
    update: function(){
        if ( this.text ) {
            this.text.textContent = this.toString();
        }
        if ( this.updateFunction ) {
            this.updateFunction();
        }
    },
    // Turn on Fragments that match
    match: function(selector){
        var copy = this.selectors.slice(0, this.selectors.length),
            selectorParts = selector.split(' '),
            currSelector, currPart;

        currSelector = copy.pop();
        currPart = selectorParts.pop();

        while ( currSelector !== undefined && currPart !== undefined) {
            if ( currSelector.matches(currPart) ) {
                currPart = selectorParts.pop();
            }
            currSelector = copy.pop();
        }
        this.update();
    },
    toString: function(){
        var selectors = [],
            selectorString;
        for ( var i=0, len=this.selectors.length; i<len; i++ ) {
            selectorString = this.selectors[i].toString();
            if ( selectorString !== "" ) {
                selectors.push(selectorString);
            }
        }
        return selectors.join(' ');
    }
};

function allowedElement(tag){
    // make sure that these are capitalized
    var illegal = ["CENTER", "TBODY", "THEAD", "TFOOT", "COLGROUP"],
        allowed = true;
    for ( var i=0, len=illegal.length; i<len; i++){
        if ( tag === illegal[i] ) {
            allowed = false;
            break;
        }
    }
    return allowed;
}

/***************************
Functions shared by Fragment and NthFragment
***************************/
var fragments = {
    on: function(){
        return !this.ele.classList.contains("off");
    },
    turnOn: function(){
        this.ele.classList.remove("off");
    },
    turnOff: function(){
        this.ele.classList.add("off");
    },
    toggleOff: function(event){
        this.ele.classList.toggle("off");
    }
};

/********************
    FRAGMENT
********************/
function Fragment(name, selector){
    this.selector   = selector;
    this.name       = name;
    this.ele        = noSelectEle("span", ["toggleable", "realselector", "off"]);

    this.ele.textContent = this.name;
    this.ele.addEventListener("click", fragments.toggleOff.bind(this), false);
}

Fragment.prototype = {
    on: fragments.on,
    turnOn: fragments.turnOn,
    turnOff: fragments.turnOff,
    matches: function(name){
        return name === this.name;
    }
};

/********************
    NTHFRAGMENT
a fragment representing an nth-ot-type css pseudoselector
********************/
function NthFragment(selector){
    this.selector   = selector;
    this.ele        = noSelectEle("span", ["toggleable"]);   
    this.beforeText = document.createTextNode(":nth-of-type(");
    this.afterText  = document.createTextNode(")");
    this.input      = noSelectEle("input", ["childtoggle"]);


    this.input.setAttribute("type", "text");
    this.input.value = 1;
    this.input.setAttribute("title", "options: an+b (a & b are integers), a positive integer (1,2,3...), odd, even");

    this.ele.appendChild(this.beforeText);
    this.ele.appendChild(this.input);
    this.ele.appendChild(this.afterText);

    //Events
    this.ele.addEventListener("click", fragments.toggleOff.bind(this), false);
    this.input.addEventListener("click", function(event){
        // don't toggle .off when clicking/focusing the input element
        event.stopPropagation();
    });
    this.input.addEventListener("blur", (function(event){
        this.selector.family.update();
    }).bind(this));
}

NthFragment.prototype = {
    on: fragments.on,
    turnOn: fragments.turnOn,
    turnOff: fragments.turnOff,
    matches: function(name){
        return this.text() === name;
    },
    text: function(){
        return this.beforeText.textContent + this.input.value + this.afterText.textContent;
    }
};

/********************
    SELECTOR
********************/
/***
ele is an element to create an ToggleableElement for
family is the SelectorFamily the ToggleableElement belongs to
***/
function ToggleableElement(ele, family){
    this.family         = family;
    this.tag            = new Fragment(ele.tagName.toLowerCase(), this);
    this.id             = ele.hasAttribute('id') ?
                            new Fragment('#' + ele.getAttribute('id'), this) : undefined;
    this.classes        = [];
    this.ele            = noSelectEle("div", ["selectorSchema"]);
    this.nthtypeCreator = selectorSpan("+t", ["nthtype", "noSelect"], "add the nth-of-type pseudo selector"),

    this.ele.appendChild(this.tag.ele);
    if ( this.id ) {
        this.ele.appendChild(this.id.ele);
    }

    var curr, deltog, frag;
    // generate a fragment for all of the element's classes
    for ( var i=0, len=ele.classList.length; i<len; i++ ) {
        curr = ele.classList[i];
        // classes used collect.js, not native to page 
        if ( curr === "collectHighlight" || curr === "queryCheck" ||
            curr === "savedPreview" || curr === "parentSchema" ) {
            continue;
        }
        frag = new Fragment('.' + curr, this);
        this.classes.push(frag);
        this.ele.appendChild(frag.ele);
    }

    this.ele.addEventListener("click", this.events.cleanSelector.bind(this), false);
    
    this.nthtypeCreator.addEventListener('click', this.events.createNthofType.bind(this), false);
    this.ele.appendChild(this.nthtypeCreator);

    deltog = selectorSpan("x", ["deltog", "noSelect"]);
    deltog.addEventListener('click', this.events.removeSelector.bind(this), false);
    this.ele.appendChild(deltog);

}

ToggleableElement.prototype = {
    events: {
        cleanSelector: function(event){
            if ( !event.target.classList.contains("toggleable") ) {
                return;
            }

            // only care if nthoftype exists
            if ( this.nthoftype && this.nthoftype.on() ) {
                // lxml requires a tag when using :nth-of-type
                // if turning on nthoftype, turn on tag as well
                if ( event.target === this.nthoftype.ele ) {
                    this.tag.turnOn();
                }
                // if turning off tag, turn off nthoftype as well
                else if ( event.target === this.tag.ele && !this.tag.on() ) {
                    this.nthoftype.turnOff();
                }
            }
            this.family.update();
        },
        removeSelector: function(event){
            // get rid of the html element
            this.ele.parentElement.removeChild(this.ele);
            this.family.removeSelector(this.index);
        },
        createNthofType: function(event){
            event.stopPropagation();
            this.addNthofType();
        }
    },
    addNthofType: function(){
        if ( this.nthoftype ) {
            return;
        }
        // lxml requires a tag to be used alongside :nth-of-type, so make sure that that is on
        this.tag.turnOn();
        
        this.nthoftype = new NthFragment(this);
        this.ele.removeChild(this.nthtypeCreator);
        this.nthtypeCreator = undefined;
        

        var selectors = this.ele.getElementsByClassName("realselector"),
            len = selectors.length;

        var sibling = selectors[len-1].nextSibling;
        this.ele.insertBefore(this.nthoftype.ele, sibling);
    },
    /* turn on (remove .off) from all toggleable parts of a selector if bool is undefined or true
    turn off (add .off) to all toggleable parts if bool is false */
    setAll: function(bool){
        var fn = (bool === true || bool === undefined ) ? "remove": "add";
        this.tag.ele.classList[fn]("off");
        if ( this.id ) {
            this.id.ele.classList[fn]("off");
        }
        for ( var i=0, len=this.classes.length; i<len; i++ ) {
            this.classes[i].ele.classList[fn]("off");
        }
        if ( this.nthoftype ) {
            this.nthoftype.classList[fn]("off");
        }
    },
    /*
    Given a selector string, return true if the Selector has attributes matching the query string
    If returning true, also turn on the matching Fragments
    */
    matches: function(selector){
        var tag, id, classes, nthoftype,
            onlist = [];
        // element tag
        tag = selector.match(/^[a-z][\w0-9-]*/i);
        if ( tag !== null) {
            if ( this.tag.matches(tag[0]) ){
                onlist.push(this.tag);
            } else {
                return false;
            }
        }

        // element id
        id = selector.match(/#(?:[a-z][\w0-9-]*)/i);
        if ( id !== null ) {
            if ( this.id === undefined || !this.id.matches(id[0])) {
                return false;
            } else {
                onlist.push(this.id);
            }
        }

        // element classes
        classes = selector.match(/(\.[a-z][\w0-9-]*)/ig);
        if ( classes !== null ) {
            // if the provided selector has more classes than the selector, know it doesn't match
            if ( classes.length > this.classes.length ) {
                return false;
            }
            var thisClass, matchClass, found;
            for ( var j=0, matchLen=classes.length; j<matchLen; j++ ) {
                matchClass = classes[j];
                found = false;
                for ( var i=0, thisLen=this.classes.length; i<thisLen; i++ ) {    
                    thisClass = this.classes[i];
                    if ( thisClass.matches(matchClass) ) {
                        onlist.push(thisClass);
                        found = true;
                        continue;
                    }
                }
                if ( !found ) {
                    return false;
                }
            }
        }

        // nth-of-type element
        nthoftype = selector.match(/:nth-of-type\((?:odd|even|-?\d+n(?:\s*(?:\+|-)\s*\d+)?|\d+)\)/i);
        if ( nthoftype !== null ) {
            if ( this.nthoftype === undefined || !this.nthoftype.matches(nthoftype[0]) ){
                return false;
            } else {
                onlist.push(this.nthoftype);
            }
        }

        // everything matches, turn framents on and return true
        for ( var k=0, len=onlist.length; k<len; k++ ) {
            onlist[k].turnOn();
        }
        return true;
    },
    toString: function(){
        var selector = "",
            curr;
        if ( this.tag.on() ) {
            selector += this.tag.name;
        }
        if ( this.id && this.id.on() ) {
            selector += this.id.name;
        }
        if ( this.classes.length ) {
            for ( var i=0, len=this.classes.length; i<len; i++ ) {
                curr = this.classes[i];
                if ( curr.on() ) {
                    selector += curr.name;
                }
            }
        }
        if ( this.nthoftype && this.nthoftype.on() ) {
            selector += this.nthoftype.text();
        }
        return selector;
    }
};

/*********************************
            Helpers
*********************************/
function selectorSpan(text, classes, title){
    var span = document.createElement("span");
    span.textContent = text;
    if ( classes ) {
        for ( var i=0, len=classes.length; i<len; i++ ) {
            span.classList.add(classes[i]);
        }    
    }
    if ( title ) {
        span.setAttribute("title", title);
    }
    return span;
}

function noSelectEle(tag, otherClasses){
    var ele = document.createElement(tag);
    ele.classList.add("noSelect");
    for ( var i=0, len=otherClasses.length; i<len; i++ ) {
        ele.classList.add(otherClasses[i]);
    }
    return ele;
}

// Source: src/interface_with_html.js
// create interface and return a function to remove the collectorjs interface
var removeInterface = (function(){
    var marginBottom    = 0;
    var element         = noSelectElement("div");

    element.classList.add("collectjs");
    element.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemaTab\">Schema</div><div class=\"tab\" id=\"previewTab\">Preview</div><div class=\"tab\" id=\"optionsTab\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div id=\"schemaInfo\"></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemaView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><h3>Type:<span id=\"selectorType\">Selector</span></h3><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label>High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"cancelSelector\">Cancel</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\" id=\"ruleFollowHolder\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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

// save commonly referenced to elements
var HTML = {
    // elements in the selector view
    selector: {
        family:     document.getElementById("selectorHolder"),
        selector:   document.getElementById("currentSelector"),
        count:      document.getElementById("currentCount"),
    },
    // elements in the rule view
    rule: {
        capture:        document.getElementById("ruleAttr"),
        follow:         document.getElementById("ruleFollow"),
        followHolder:   document.getElementById("ruleFollowHolder")
    }
};

/*
Object that controls the functionality of the interface
*/
var UI = (function(){
    var tabs        = {
        schema:     document.getElementById("schemaTab"),
        preview:    document.getElementById("previewTab"),
        options:    document.getElementById("optionsTab")
    };
    var views       = {
        schema:     document.getElementById("schemaView"),
        selector:   document.getElementById("selectorView"),
        rule:       document.getElementById("ruleView"),
        preview:    document.getElementById("previewView"),
        options:    document.getElementById("optionsView")
    };
    var current     = {
        view: views.schema,
        tab: tabs.schema
    };
    var preview     = document.getElementById("previewContents");

    function setCurrentView(view, tab){
        hideCurrentView();
        current.view = view;
        current.tab = tab;
        view.classList.add("active");
        tab.classList.add("active");
    }

    function hideCurrentView(){
        // turn selectors off when leaving selector view
        if ( current.view.id === "selectorView" && Family ) {
            Family.turnOff();
        }
        current.view.classList.remove("active");
        current.tab.classList.remove("active");
    }    

    function generatePreview(){
        // only regen preview when something in the schema has changed
        if (  ui.dirty ) {
            preview.innerHTML = CurrentSite.current.page.preview();
        }
        ui.dirty = false;
    }

    var ui = {
        editing:        false,
        dirty:          true,
        selectorType:   "selector",
        showSelectorView: function(){
            setCurrentView(views.selector, tabs.schema);
        },
        showRuleView: function(){
            setCurrentView(views.rule, tabs.schema);
        },
        showSchemaView: function(){
            setCurrentView(views.schema, tabs.schema);
            if ( Parent && Parent.exists ) {
                Parent.show();
            }
        },
        showPreviewView: function(){
            generatePreview();
            setCurrentView(views.preview, tabs.preview);
        },
        showOptionsView: function(){
            setCurrentView(views.options, tabs.options);
        }
    };
    return ui;
})();

var error = (function(){
    var alert = document.getElementById("collectAlert");

    return {
        alertMessage: function(msg){
            var p = noSelectElement("p");
            p.textContent = msg;
            alert.appendChild(p);
            setTimeout(function(){
                alert.removeChild(p);
            }, 2000);
        },
        check: function(condition, ele, msg){
            if ( condition ) {
                ele.classList.add("error");
                this.alertMessage(msg);
                return true;
            }
            return false;
        },
        reservedWord: function(word, ele, msg){
            var reservedWords   = ["default", "url"];
            var reserved        = false;
            for ( var i=0, len=reservedWords.length; i<len; i++ ) {
                if ( word === reservedWords[i] ) {
                    reserved = true;
                    break;
                }
            }
            return this.check(reserved, ele, msg);
        },
        empty: function(attr, ele, msg){
            return this.check((attr === ""), ele, msg);
        },
        clear: function(){
            var errors = document.querySelectorAll(".collectjs .error");
            for ( var i=0, errorLen = errors.length; i<errorLen; i++ ) {
                errors[i].classList.remove("error");
            }        
        }
    };
})();

// Source: src/fetch.js
/*
functions to get elements in the page
*/
var Fetch = {
    /***
    select the first element in the page to match the selector
    if prefix is provided, append that in front of the selector
    ***/
    one: function(selector, prefix){
        return document.querySelector(this.not(selector, prefix));
    },
    /***
    select all elements in the page that match the selector
    ***/
    all: function(selector, prefix){
        return document.querySelectorAll(this.not(selector, prefix));
    },
    /***
    returns a string for a css selector suffixed by :not(.noSelect)
    in order to ignore elements that are part of the collectorjs interface
    default prefix is "body"
    ***/
    not: function(selector, prefix){
        prefix = prefix || "body";
        selector += ":not(.noSelect)";
        return prefix + " " + selector;
    },
    /*
    uses selector to match elements in the page
    parent is an optional object containing a selector and a low/high range to limit matched elements
    if parent.high/low are defined, only use parent.selector elements within that range
    */
    matchedElements: function(selector, parent){
        var allElements = parent ? this.matchedParentElements(selector, parent)
            : this.all(selector, "body");
        return Array.prototype.slice.call(allElements);
    },
    matchedParentElements: function(selector, parent){
        var allElements     = [];
        var low             = parent.low || 0;
        var high            = parent.high || 0;
        var end;
        var parents;
        var currElements;
        var notSelector;
        // if either high or low is defined, 
        // iterate over all child elements of elements matched by parent selector
        if ( low !== 0 || high !== 0 ) {
            parents         = document.querySelectorAll(parent.selector);
            end             = parents.length + high; // add high because it is negative
            notSelector     = this.not(selector);
            // select elements within parent that match the selector, then merge into allElements
            for ( ; low<end; low++ ) {
                currElements = parents[low].querySelectorAll(notSelector);
                allElements = allElements.concat(Array.prototype.slice.call(currElements));
            }
        } else {
            allElements = this.all(selector, parent.selector);
        }
        return allElements;
    }
};

// Source: src/parent.js
/* requires fetch.js and utility.js */
var Parent = {
    exists:     false,
    count:      0,
    hidden:     false,
    html:       false,
    type:       "selector",
    // set the parent object
    set: function(obj){
        this.parent     = obj;
        this.exists     = true;
        this.addMarkup();
    },
    // remove the parent object
    remove: function(){
        this.exists     = false;
        this.count      = 0;
        this.clearMarkup();
        delete this.parent;
    },
    // add .parentSchema class to all elements that match the parent selector and are in range
    addMarkup: function(){
        var elements    = Fetch.all(this.parent.selector);
        var low         = this.parent.low || 0;
        var high        = this.parent.high || 0;
        var end         = elements.length + high;
        this.count      = 0;
        this.hidden     = false;
        this.html       = true;
        for ( ; low<end ; low++ ){
            elements[low].classList.add("parentSchema");
            this.count++;
        }
    },
    clearMarkup: function(){
        this.hidden     = false;
        this.html       = false;
        clearClass("parentSchema");
    },
    show: function(){
        // add the markup first if it doesn't exist
        if ( !this.html ) {
            this.addMarkup();
        }

        if ( !this.hidden ) {
            return;
        }

        this.hidden     = false;
        var elements    = document.getElementsByClassName("parentSchema");
        for ( var i=elements.length-1; i>0; i-- ) {
            elements[i].classList.remove("hidden");
        }
    },
    hide: function(){
        this.hidden     = true;
        var elements    = document.getElementsByClassName("parentSchema");
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("hidden");
        }
    },
    // returns the parent selector
    // if type !== "selector", always return "body". Then check if there is a parent selector
    // and if there is use that, defaulting to "body" if there is none
    selector: function(){
        var parent;
        switch(this.type){
            case "selector":
                parent = this.exists ? this.parent.selector : "body";
                break;
            default:
                parent = "body";
        }
        return parent;
    },
    /*
    brute force to find parent element of the passed in element argument that matches the parentSelector
    O(n^2), so not ideal but works for the time being
    */
    nearest: function(element, parentSelector){
        var parents         = Fetch.all(parentSelector);
        var elementParents  = [];
        var curr            = element;
        var parent;
        // get all parent elements of element up to BODY
        while ( curr !== null && curr.tagName !== "BODY" ) {
            curr = curr.parentElement;
            elementParents.push(curr);
        }
        for ( var i=0, iLen=elementParents.length; i<iLen; i++ ) {
            parent = elementParents[i];
            for ( var j=0, jLen=parents.length; j<jLen; j++ ) {
                if ( parent === parents[j] ) {
                    return parent;
                }
            }
        }
        return;
    },
    // returns nearest parent element (as determined by the parent selector) to the passed in element
    // defaults to the body if there is no parent or the current ype !== "selector"
    element: function(ele){
        var parent;
        switch(this.type){
            case "selector":
                parent = this.exists ? this.nearest(ele, this.parent.selector) : document.body;
                break;
            default:
                parent = document.body;
        }
        return parent;
    },
    object: function(){
        var parent;
        switch(this.type){
            case "selector":
                parent = this.parent;
                break;
        }
        return parent;
    },
    getCount: function(){
        return this.type === "selector" ? this.count : undefined;
    }
};

// Source: src/rule.js
// this exists in a separate file for ease of use
// but has dependencies on variables in collector.js and thus is not modular

/* requires parent.js, fetch.js, and utility.js */

var CurrentSite;

/********************
        SITE
********************/
/*
name is the hostname of the site
schemas is an object containing the various schemas in the page
selects are select elements used to switch between different schemas, different pages, and
different sets
*/
function Site(name, schemas){
    this.name       = name;
    this.schemas    = {};
    // relies on the fact that default schema/page/selector set needs to exist
    this.current    = {
        schema:     undefined,
        page:       undefined,
        set:        undefined,
        selector:   undefined
    };
    this.hasHTML    = false;
    this.eles       = {};

    // create Schemas
    if ( schemas ) {
        var schemaObj, schema;
        for ( var key in schemas ) {
            schemaObj = schemas[key];
            schema = new Schema(schemaObj.name, schemaObj.pages, schemaObj.urls);
            schema.parentSite = this;
            this.schemas[key] = schema;
        }
        
    } else {
        this.schemas["default"] = new Schema("default");
        this.schemas["default"].parentSite = this;
    }

}

Site.prototype.html = function(){
    /*
    <div> // topbar
        Schema: <select>...</select>
            <button>+Schema</button>
            <button>×</button>
            <button>Upload</button>
        Page: <select>...</select>
        Selector Set: <select>...</select>
        <button>Upload</button>
    </div>
    <div>...</div> // schemas
    */

    var topbar          = noSelectElement("div");
    var schemaText      = document.createTextNode("Schema: ");
    var schemaSelect    = noSelectElement("select");
    var createSchema    = noSelectElement("button");
    var removeSchema    = noSelectElement("button");
    var upload          = noSelectElement("button");
    var pageText        = document.createTextNode("Page: ");
    var pageSelect      = noSelectElement("div");
    var selectorText    = document.createTextNode("Selector Set: ");
    var setSelect       = noSelectElement("div");

    var schemas         = noSelectElement("div");

    this.hasHTML    = true;
    this.eles       = {
        schemas:    schemas,
        select:     schemaSelect,
        bar: {
            schema: schemaSelect,
            page: pageSelect,
            set: setSelect
        }
    };

    createSchema.textContent = "+Schema";
    createSchema.setAttribute("title", "create a new schema");
    createSchema.addEventListener("click", this.events.createSchemaEvent.bind(this), false);

    removeSchema.innerHTML = "&times;";
    removeSchema.setAttribute("title", "delete current schema");
    removeSchema.addEventListener("click", this.events.removeSchemaEvent.bind(this), false);

    upload.textContent = "Upload";
    upload.addEventListener("click", this.events.uploadEvent.bind(this), false);

    appendChildren(topbar, [schemaText, schemaSelect, createSchema, removeSchema,
        pageText, pageSelect, selectorText, setSelect, upload]);

    // create html for all schemas, but only show the default one
    for ( var key in this.schemas ) {
        this.schemas[key].html();
        // only show the default schema when first generating html
        if ( key === "default") {
            this.schemas[key].eles.holder.classList.add("active");
        }
    }

    schemaSelect.addEventListener("change", this.events.loadSchemaEvent.bind(this), false);

    return {
        schema: schemas,
        topbar: topbar
    };
};

Site.prototype.events = {
    loadSchemaEvent: function(event){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        this.loadSchema(name);    
        resetInterface();
    },
    createSchemaEvent: function(event){
        event.preventDefault();
        var name = prompt("Schema Name");
        var schema;
        // null when cancelling prompt
        if ( name === null ) {
            return;
        }
        // make sure name isn't empty string or string that can't be used in a filename
        else if ( name === "" || !legalSchemaName(name)) {
            error.alertMessage("\'" + name + "\' is not a valid schema name");
            return;
        }
        else if ( !this.uniqueSchemaName(name)){
            error.alertMessage("a schema named \"" + name + "\" already exists");
            return;
        }
        
        schema = new Schema(name);
        this.addSchema(schema);
        this.save(name);
    },
    removeSchemaEvent: function(event){
        event.preventDefault();
        var schema = this.current.schema;
        this.removeSchema(schema.name);
    },
    uploadEvent: function(event){
        event.preventDefault();
        this.upload();
    }
};

/*
if name is provided, only save that schema, otherwise save all
*/
Site.prototype.save = function(schemaName){
    var obj = schemaName ? this.schemas[schemaName].object() : this.object();
    chromeSave(obj, this.name, schemaName);
    resetInterface();
};

Site.prototype.upload = function(){
    chromeUpload({
        schema: this.current.schema.uploadObject(),
        site: this.name
    });
};

Site.prototype.object = function(){
    var data = {
        site: this.name,
        schemas: {}
    };
    for ( var key in this.schemas ) {
        data.schemas[key] = this.schemas[key].object();
    }
    return data;
};

Site.prototype.saveCurrent = function(){
    this.save(this.current.schema.name);
};

Site.prototype.addSchema = function(schema){
    schema.parentSite = this;
    this.schemas[schema.name] = schema;
    if ( this.hasHTML ) {
        schema.html();
        this.loadSchema(schema.name);
    }
    this.current.schema = schema;
};

/*
set schema to site.current.schema
hide currently active schema's html and show new current schema's html
*/
Site.prototype.loadSchema = function(name){
    // reset before loading schmea
    if ( CurrentSite.current.schema ) {
        CurrentSite.current.schema.eles.holder.classList.remove("active");
    }
    CurrentSite.current = {
        schema:     undefined,
        page:       undefined,
        set:        undefined,
        selector:   undefined
    };
    var schema = this.schemas[name],
        prevSchema = this.current.schema;
    // if schema doesn't exist, do nothing
    if ( !schema ) {
        return;
    }

    this.current.schema = schema;
    if ( this.hasHTML ) {
        // select the schema's option
        if ( schema.eles.option ) {
            schema.eles.option.selected = true;
        }
        // load in the select for the schema's pages
        this.eles.bar.page.innerHTML = "";
        this.eles.bar.page.appendChild(schema.eles.select);
        if ( schema.eles.holder ) {
            schema.eles.holder.classList.add("active");
        }
    }

    // load the default page for the schema
    schema.loadPage("default");
};

Site.prototype.removeSchema = function(name){
    var defaultSchema = (name === "default"),
        confirmed;
    if ( defaultSchema ) {
        confirmed = confirm("Cannot delete \"default\" schema. Do you want to clear out all of its pages instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this schema and all of its related pages?");    
    }
    if ( !confirmed ) {
        return;
    }

    if ( defaultSchema ) {
        this.schemas["default"].reset();
    } else {
        this.loadSchema("default");
        this.schemas[name].remove();
    }
    this.save();
};

Site.prototype.removeCurrentSchema = function(){
    this.removeSchema(this.current.schema.name);
};

Site.prototype.uniqueSchemaName = function(name){
    for ( var key in this.schemas ) {
        if ( key === name ) {
            return false;
        }
    }
    return true;
};

/********************
        SCHEMA
********************/
function Schema(name, pages, urls){
    this.name           = name;
    this.urls           = urls || {};
    this.pages          = {};
    this.hasHTML        = false;
    this.eles           = {};
    this.parentSite;    
    var pageObj;
    var page;
    // create Pages
    if ( pages ) {
        for ( var key in pages ) {
            pageObj = pages[key];
            page = new Page(pageObj.name, pageObj.sets, pageObj.next);
            page.parentSchema = this;
            this.pages[key] = page;
        }
    } else {
        this.pages["default"] = new Page("default");
        this.pages["default"].parentSchema = this;
    }

}

Schema.prototype.object = function(){
    var data = {
        name:   this.name,
        urls:   this.urls,
        pages:  {}
    };
    var pageObject; 

    for ( var key in this.pages ) {
        data.pages[key] = this.pages[key].object();
    }

    return data;
};

/***
rearrange the schema's JSON into proper format for Collector
name: the name of the schema
urls: converted from an object to a list of urls
pages: a tree with root node of the "default" page. Each 
***/
Schema.prototype.uploadObject = function(){
    var data        = {
        name: this.name,
        urls: Object.keys(this.urls)
    };
    var pages       = {};
    var followSets  = {};
    var currPage;
    var pageName;
    var setName;
    var pageObject;
    var set;
    var followPages;

    // iterate over all pages and generate their upload json
    for ( pageName in this.pages ) {
        currPage = this.pages[pageName];
        pageObject = currPage.uploadObject();
        if ( pageObject ) {
            pages[pageName] = pageObject;
            followSets[pageName] = currPage.followedSets();
        }
    }

    // iterate over followSets to build tree
    for ( pageName in followSets ) {
        set = followSets[pageName];
        for ( setName in set ) {
            followPages = set[setName];
            for ( var i=0, len=followPages.length; i<len; i++ ) {
                var currPageName = followPages[i];

                // make sure the page actually exists before appending
                if ( pages[currPageName] ) {
                    pages[pageName].sets[setName].pages[currPageName] = pages[currPageName];
                }
            }
        }
    }

    // once all of the following pages have been attached to their set, set data.page
    data.page = pages.default;

    return data;  
};

Schema.prototype.html = function(){
    var holder          = noSelectElement("div");
    var nametag         = noSelectElement("span");
    //var rename          = noSelectElement("button"),
    var pages           = noSelectElement("ul");
    var option          = noSelectElement("option");
    var select          = noSelectElement("select");
    var indexHolder     = noSelectElement("div");
    var indexText       = document.createTextNode("Initial URL: ");
    var indexCheckbox   = noSelectElement("input");


    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        pages: pages,
        option: option,
        select: select,
        index: {
            holder: indexHolder,
            checkbox: indexCheckbox
        }
    };

    // schema tab
    holder.classList.add("schema");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Schema");
    nametag.classList.add("nametag");
    //rename.textContent = "rename";
    //rename.addEventListener("click", this.events.renameEvent.bind(this), false);
    //appendChildren(holder, [nametag, rename, pages]);

    var url = window.location.href;
    indexCheckbox.setAttribute("type", "checkbox");
    indexCheckbox.addEventListener("change", this.events.toggleURLEvent.bind(this), false);
    if ( this.urls[url] ) {
        indexCheckbox.checked = true;
    }

    appendChildren(indexHolder, [indexText, indexCheckbox]);
    appendChildren(holder, [nametag, indexHolder, pages]);

    for ( var key in this.pages ) {
        this.pages[key].html();
    }

    // Schema option and Page select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    select.addEventListener("change", this.events.loadPageEvent.bind(this), false);

    // automatically append to parent site's schema holder and schema select
    if ( this.parentSite && this.parentSite.hasHTML ) {
        this.parentSite.eles.schemas.appendChild(holder);
        this.parentSite.eles.select.appendChild(option);
    }
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

Schema.prototype.events = {
    renameEvent: function(event){
        // do nothing for now
        event.preventDefault();
    },
    loadPageEvent: function(evenT){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        resetInterface();
        this.loadPage(name);
    },
    toggleURLEvent: function(event){
        var on              = this.toggleURL(window.location.href);
        var defaultPage     = this.pages["default"];
        
        if ( !on && defaultPage.next ) {
            defaultPage.removeNext();
        }
        CurrentSite.saveCurrent();
    }
};

Schema.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.pages ) {
        this.removePage(key);
    }

    if ( this.parentSite ) {
        delete this.parentSite.schemas[this.name];
    }
};

// remove all pages, then create default page
Schema.prototype.reset = function(){
    for ( var key in this.pages ) {
        this.removePage(key);
    }
    // reset current values
    if ( this.parentSite ) {
        this.parentSite.current.schema = this;
        this.parentSite.current.page = undefined;
        this.parentSite.current.set = undefined;
    }
    var page = new Page("default");
    this.addPage(page);
    this.loadPage(page.name);
};

Schema.prototype.rename = function(newName){
    var oldName = this.name;
    // always need a default group, so if renaming default, create a new default as well
    if ( oldName === "default" ) {
        var def = new Schema("default");
    }

    this.name = newName;
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newName;
    }

    // will need to change select option once that is tied to the Schema object
};

Schema.prototype.toggleURL = function(url){
    if ( this.urls[url] ) {
        delete this.urls[url];
        return false;
    } else {
        this.urls[url] = true;
        return true;
    }
};

Schema.prototype.addPage = function(page){
    var name = page.name;
    if ( this.pages[name] ) {
        this.removePage(name);
    }
    this.pages[name] = page;
    page.parentSchema = this;
    // if html for schema exists, also generate html for page
    if ( this.eles.pages) {
        page.html();
    }
};

Schema.prototype.loadPage = function(name){
    var page        = this.pages[name];
    var prevPage    = this.parentSite.current.page;
    // if page doesn't exist or is the same as the current one, do nothing
    if ( !page || page === prevPage ) {
        return;
    }
    if ( this.hasHTML ) {
        // select the option for the page
        if ( page.eles.option ) {
            page.eles.option.selected = true;
        }
        // show the select for the page's selector set
        var site = this.parentSite;
        site.eles.bar.set.innerHTML = "";
        site.eles.bar.set.appendChild(page.eles.select);
    }
    CurrentSite.current.page = page;
    page.loadSet("default");
};

Schema.prototype.removePage = function(name){
    var page = this.pages[name];
    if ( page ) {
        page.remove();
        delete this.pages[name];
    }
};

Schema.prototype.uniquePageName = function(name){
    for ( var key in this.pages ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
};

Schema.prototype.uniqueSelectorSetName = function(name){
    var page;
    var pageName;
    var setName;
    for ( pageName in this.pages ){
        page = this.pages[pageName];
        for ( setName in page.sets ) {
            if ( name === setName ) {
                return false;
            }
        }
    }
    return true;
};

Schema.prototype.uniqueRuleName = function(name){
    var page;
    var selectorSet;
    var selector;
    var pageName;
    var setName;
    var selectorName;
    var ruleName;
    for ( pageName in this.pages ){
        page = this.pages[pageName];
        for ( setName in page.sets ) {
            selectorSet = page.sets[setName];
            for ( selectorName in selectorSet.selectors ) {
                selector = selectorSet.selectors[selectorName];
                for ( ruleName in selector.rules ) {
                    if ( name === ruleName ) {
                        return false;
                    }
                }
            }
        }
    }
    return true;  
};

/********************
        PAGE
********************/
function Page(name, sets, next){
    this.name       = name,
    this.next       = next;
    this.sets       = {};
    this.hasHTML    = false;
    this.eles       = {};
    // added when a schema calls addPage
    this.parentSchema;

    if ( sets ) {
        var setObject, set;
        for ( var key in sets ) {
            setObject = sets[key];
            set = new SelectorSet(setObject.name, setObject.selectors, setObject.parent);
            set.parentPage = this;
            this.sets[key] = set;
        }
    } else {
        this.sets["default"] = new SelectorSet("default");
        this.sets["default"].parentPage = this;
    }
}

Page.prototype.object = function(){
    var data = {
        name: this.name,
        sets: {}
    };

    if ( this.next ) {
        data.next = this.next;
    }

    for ( var key in this.sets ) {
        data.sets[key] = this.sets[key].object();
    }

    return data;
};

/***
returns an object representing a page for upload
name: name of the page
sets: dict containing non-empty (ie, has 1+ rules) selector sets
next: string for next selector
***/
Page.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        sets: {}
    };

    // only add next if it exists
    if ( this.next){
        data.next = this.next;
    }

    var set;
    for ( var key in this.sets ) {
        set = this.sets[key].uploadObject();
        if ( set ) {
            data.sets[key] = set;
        }
    }

    // return undefined if all sets were empty
    if ( Object.keys(data.sets).length === 0 ) {
        return;
    }

    return data;  
};

Page.prototype.html = function(){
    var holder          = noSelectElement("li");
    var nametag         = noSelectElement("span");
    var createSet       = noSelectElement("button");
    var resetPage       = noSelectElement("button");
    var sets            = noSelectElement("ul");
    var option          = noSelectElement("option");
    var setSelect       = noSelectElement("select");
    var nextHolder      = noSelectElement("div");
    var nextText        = document.createTextNode("Next: ");
    var nextSelector    = noSelectElement("span");
    var nextAdd         = noSelectElement("button");
    var nextRemove      = noSelectElement("button");
    this.hasHTML        = true;
    // elements that need to be interacted with
    this.eles           = {
        holder:     holder,
        nametag:    nametag,
        option:     option,
        sets:       sets,
        select:     setSelect,
        next: {
            holder:     nextHolder,
            selector:   nextSelector,
            add:        nextAdd,
            remove:     nextRemove
        }
    };

    // Schema tab html
    holder.classList.add("page");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Page");
    nametag.classList.add("nametag");
    createSet.textContent = "+Set";
    createSet.classList.add("pos");
    createSet.addEventListener("click", this.events.createSetEvent.bind(this), false);

    resetPage.innerHTML = "&times;";
    resetPage.addEventListener("click", this.events.resetEvent.bind(this), false);

    // Next
    nextAdd.textContent = "+Next";
    nextAdd.addEventListener("click", this.events.addNextEvent.bind(this), false);
    nextRemove.innerHTML = "&times;";
    nextRemove.addEventListener("click", this.events.removeNextEvent.bind(this), false);
    nextHolder.classList.add("next");
    if ( this.next ) {
        nextSelector.textContent = this.next;
        nextAdd.classList.add("hidden");
    } else {
        nextSelector.textContent = "";
        nextRemove.classList.add("hidden");
    }

    appendChildren(nextHolder, [nextText, nextSelector, nextAdd, nextRemove]);
    appendChildren(holder, [nametag, createSet, resetPage, nextHolder, sets]);

    for ( var key in this.sets ) {
        this.sets[key].html();
    }


    // Page option, SelectorSet select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    setSelect.addEventListener("change", this.events.loadSetEvent.bind(this), false);

    // automatically append to parent schema's html elements
    if ( this.parentSchema && this.parentSchema.hasHTML ) {
        this.parentSchema.eles.pages.appendChild(holder);
        this.parentSchema.eles.select.appendChild(option);
    }
};

Page.prototype.events = {
    createSetEvent: function(event){
        event.preventDefault();
        var name = prompt("Selector Set Name");
        var set;
        if ( name === null ) {
            return;
        }
        else if ( name === "" ) {
            error.alertMessage("selector set name cannot be blank");
            return;
        }
        
        if ( !this.parentSchema.uniqueSelectorSetName(name) ) {
            error.alertMessage("a selector set named \"" + name + "\" already exists");
            return;
        }
        set = new SelectorSet(name);
        this.addSet(set);
        CurrentSite.saveCurrent();
    },
    resetEvent: function(event){
        var confirmed = confirm("Clear out all selector sets, selectors, and rules from the page?");
        if ( !confirmed ) {
            return;
        }
        this.reset();
        CurrentSite.saveCurrent();
    },
    loadSetEvent: function(event){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        resetInterface();
        this.loadSet(name);
    },
    addNextEvent: function(event){
        event.preventDefault();
        SelectorView.show("next");
    },
    removeNextEvent: function(event){
        event.preventDefault();
        this.removeNext();
    }
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(selectorSet){
    var name = selectorSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = selectorSet;
    selectorSet.parentPage = this;
    // if html for page exists, also create html for SelectorSet
    if ( this.eles.holder ) {
        selectorSet.html();
    }
    // automatically load the set
    this.loadSet(name);
};

Page.prototype.loadSet = function(name){
    var set         = this.sets[name];
    var prevSet     = CurrentSite.current.set;
    // if set doesn't exist or is the same as the current one, do nothing
    // need to make sure the page's name is also different since pages can have the same selector
    // set names. Might be a bug look into this
    // !!!!!!!!!!!!!!
    if ( !set || prevSet === set ) {
        return;
    }
    CurrentSite.current.set = set;

    // show the selector set's parent if it exists
    // clear out the previous set's parentSchema
    clearClass("parentSchema");
    if ( set.parent ) {
        Parent.set(set.parent);
    } else {
        Parent.remove();
    }

    if ( this.hasHTML ) {
        // select the option for the page
        if ( set.eles.option ) {
            set.eles.option.selected = true;
        }
        if ( prevSet ) {
            prevSet.eles.holder.classList.remove("active");
        }
        set.eles.holder.classList.add("active");
    }
};

/*
get rid of selector sets, selectors, and rules in the page
*/
Page.prototype.reset = function(){
    for ( var key in this.sets ) {
        this.removeSet(key);
    }
    var defaultSet = new SelectorSet("default");
    this.addSet(defaultSet);
    if ( this.next ) {
        this.removeNext();
    }
};

Page.prototype.removeSet = function(name){
    var set = this.sets[name];
    if ( set ) {
        set.remove();
        delete this.sets[name];
    }
};

Page.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.sets ) {
        this.removeSet(key);
    }
    if ( this.parentSchema ) {
        delete this.parentSchema.pages[this.name];
    }
};

Page.prototype.addNext = function(selector){
    this.next = selector;
    if ( this.hasHTML ) {
        this.eles.next.add.classList.add("hidden");
        this.eles.next.remove.classList.remove("hidden");
        this.eles.next.selector.textContent = selector;
    }
};

Page.prototype.removeNext = function(){
    this.next = undefined;
    if ( this.hasHTML ) {
        this.eles.next.add.classList.remove("hidden");
        this.eles.next.remove.classList.add("hidden");
        this.eles.next.selector.textContent = "";
    }
};

/***
iterate over sets in the page, returning an object mapping selector set's name to a list of pages that
follow it
***/
Page.prototype.followedSets = function(){
    var following = {};
    var set;
    var followed;
    for ( var key in this.sets ) {
        set = this.sets[key];
        followed = set.followedRules();
        if ( followed.length ) {
            following[key] = followed;
        }
    }
    return following;
};

Page.prototype.updateName = function(name){
    if ( name === this.name ) {
        return;
    }
    var oldName     = this.name;
    this.name       = name;
    if ( this.parentSchema ) {
        this.parentSchema.pages[name] = this;
        delete this.parentSchema.pages[oldName];
    }

    if ( this.eles.option ) {
        this.eles.option.setAttribute("value", this.name);
        this.eles.option.textContent = this.name;
    }
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = this.name;
    }
};

Page.prototype.preview = function(){
    var value = "";
    for ( var key in this.sets ) {
        value += this.sets[key].preview();
    }
    return value;
};

/********************
        SelectorSet
*********************
name: name of the selector set
parent: selector/range for selecting a selector set's parent element
********************/
function SelectorSet(name, selectors, parent){
    this.name           = name;
    this.parent         = parent;
    this.selectors      = {};
    this.hasHTML        = false;
    this.eles           = {};
    this.parentPage;
    var selectorObj;
    var selector;
    for ( var key in selectors ) {
        selectorObj = selectors[key];
        selector = new Selector(selectorObj.selector, selectorObj.rules);
        selector.parentSet = this;
        this.selectors[key] = selector;
    }
}

SelectorSet.prototype.object = function(){
    var data = {
        name:       this.name,
        selectors:  {}
    };

    if ( this.parent ) {
        data.parent = this.parent;
    }

    for ( var key in this.selectors ) {
        data.selectors[key] = this.selectors[key].object();
    }

    return data;
};

/***
    name: name of selector set
    selectors: dict mapping name of selectors to selectors
    pages: any pages that should be crawled based on a "follow"ed rule
***/
SelectorSet.prototype.uploadObject = function(){
    if ( Object.keys(this.selectors).length === 0 ) {
        return;
    }

    // use base object created by SelectorSet.object
    var data = this.object();

    for ( var key in this.selectors ) {
        data.selectors[key] = this.selectors[key].uploadObject();
    }

    data.pages = {};

    // only upload low/high if their values are not 0
    if ( data.parent ) {
        if ( data.parent.low === 0 ) {
            delete data.parent.low;
        }

        if ( data.parent.high === 0 ) {
            delete data.parent.high;
        }
    }

    return data;
};

SelectorSet.prototype.html = function(){
    var holder          = noSelectElement("li");
    var nametag         = noSelectElement("span");
    var remove          = noSelectElement("button");
    var addSelector     = noSelectElement("button");
    var parentHolder    = noSelectElement("div");
    var parentText      = document.createTextNode("Parent: ");
    var parentSelector  = noSelectElement("span");
    var parentRange     = noSelectElement("span");
    var addParent       = noSelectElement("button");
    var editParent      = noSelectElement("button");
    var removeParent    = noSelectElement("button");
    var selectors       = noSelectElement("ul");
    var option          = noSelectElement("option");

    this.hasHTML = true;
    this.eles = {
        holder:     holder,
        nametag:    nametag,
        selectors:  selectors,
        option:     option,
        parent: {
            holder:     parentHolder,
            selector:   parentSelector,
            range:      parentRange,
            add:        addParent,
            edit:       editParent,
            remove:     removeParent
        }
    };

    // Schema tab html        
    holder.classList.add("set");
    holder.addEventListener("click", this.events.activateEvent.bind(this), false);
    nametag.textContent = this.name;
    nametag.classList.add("nametag");
    nametag.setAttribute("title", "Selector Set");
    addSelector.textContent = "+Selector";
    addSelector.classList.add("pos");
    addSelector.addEventListener("click", this.events.addSelectorEvent.bind(this), false);
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    remove.addEventListener("click", this.events.removeEvent.bind(this), false);


    // Selector Set Parent
    parentHolder.classList.add("parent");
    if ( this.parent ) {
        parentSelector.textContent = this.parent.selector;
        parentRange.textContent = createRangeString(this.parent.low, this.parent.high);
        addParent.classList.add("hidden");
    } else {
        editParent.classList.add("hidden");
        removeParent.classList.add("hidden");
    }
    addParent.textContent = "+Parent";
    addParent.classList.add("pos");
    addParent.addEventListener("click", this.events.addParentEvent.bind(this), false);
    editParent.textContent = "edit";
    editParent.classList.add("pos");
    editParent.addEventListener("click", this.events.editParentEvent.bind(this), false);
    removeParent.innerHTML = "&times;";
    removeParent.classList.add("neg");
    removeParent.addEventListener("click", this.events.removeParentEvent.bind(this), false);

    appendChildren(parentHolder, [parentText, parentSelector, parentRange,
        addParent, editParent, removeParent]);
    appendChildren(holder, [nametag, addSelector, remove, parentHolder, selectors]);

    for ( var key in this.selectors ) {
        this.selectors[key].html();
    }

    // SelectorSet option
    option.textContent = this.name;
    option.setAttribute("value", this.name);

    if ( this.parentPage && this.parentPage.hasHTML ) {
        this.parentPage.eles.sets.appendChild(holder);
        this.parentPage.eles.select.appendChild(option);
    }
};

// don't use this quite yet
SelectorSet.prototype.events = {
    activateEvent: function(event){
        this.activate();
        this.eles.holder.scrollIntoViewIfNeeded();
    },
    addSelectorEvent: function(event){
        event.preventDefault();
        // make sure current.page is the selector set's parent page
        this.activate();
        SelectorView.show("selector");
    },
    removeEvent: function(event){
        event.preventDefault();
        var defaultSet = (this.name === "default"),
            question = defaultSet ?
                "Cannot delete \"default\" selector set. Do you want to reset it instead?" :
                "Are you sure you want to delete this selector set and all of its related selectors and rules?";
        if ( !confirm(question) ) {
            return;
        }

        var site = this.parentPage.parentSchema.parentSite;
        // handle setting new current SelectorSet
        if ( defaultSet ) {
            this.reset();
        } else {
            // load the default set, then delete this
            this.parentPage.loadSet("default");
            this.remove();
        }
        site.saveCurrent();
    },
    addParentEvent: function(event){
        event.preventDefault();
        SelectorView.show("parent");
    },
    editParentEvent: function(event){
        event.preventDefault();
        editParent(this);
    },
    removeParentEvent: function(event){
        event.preventDefault();
        this.removeParent();
        CurrentSite.saveCurrent();
        Parent.remove();
    }
};


SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

// make the selector set the current one
SelectorSet.prototype.activate = function(){
    var page = this.parentPage;
    if ( page !== CurrentSite.current.page ) {
        CurrentSite.current.schema.loadPage(page.name);
    }
    if ( this !== CurrentSite.current.set ) {
        CurrentSite.current.page.loadSet(this.name);
    }
};

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
    if ( this.hasHTML ) {
        this.eles.parent.add.classList.add("hidden");
        this.eles.parent.edit.classList.remove("hidden");
        this.eles.parent.remove.classList.remove("hidden");
        this.eles.parent.selector.textContent = parent.selector;
        this.eles.parent.range.textContent = createRangeString(parent.low, parent.high);
    }
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
    if ( this.hasHTML ) {
        this.eles.parent.add.classList.remove("hidden");
        this.eles.parent.edit.classList.add("hidden");
        this.eles.parent.remove.classList.add("hidden");
        this.eles.parent.selector.textContent = "";
        this.eles.parent.range.textContent = "";
    }
};

SelectorSet.prototype.addSelector = function(selector){
    // don't override an existing selector
    if ( this.selectors[selector.selector]) {
        return;
    }

    this.selectors[selector.selector] = selector;
    selector.parentSet = this;
    if ( this.hasHTML ) {
        selector.html();
    }
};

SelectorSet.prototype.removeSelector = function(name){
    var selector = this.selectors[name];
    if ( selector ) {
        selector.remove();
        delete this.selectors[name];
    }
};

SelectorSet.prototype.reset = function(){
    for ( var key in this.selectors ) {
        this.removeSelector(key);
    }
    if ( this.parent ) {
        this.removeParent();
        clearClass("parentSchema");
    }
};

SelectorSet.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.selectors ) {
        this.removeSelector(key);
    }
    if ( this.parentPage ) {
        delete this.parentPage.sets[this.name];
    }
};

/***
iterate over rules in the set and returns an array containg names of rules where follow = true
***/
SelectorSet.prototype.followedRules = function(){
    var following = [],
        selector;
    for ( var key in this.selectors ) {
        selector = this.selectors[key];
        for ( var ruleName in selector.rules ) {
            following.push(ruleName);
        }
    }
    return following;
};

SelectorSet.prototype.preview = function(){
    var value = "",
        key;
    if ( this.parent ) {
        var parentElements = document.querySelectorAll(this.parent.selector),
            len = parentElements.length,
            low = this.parent.low || 0,
            high = this.parent.high || 0,
            elements = Array.prototype.slice.call(parentElements).slice(low, len + high);
        for ( var i=0, eLen = elements.length; i<eLen; i++ ) {
            value += "<div class=\"previewSet noSelect\">";
            for ( key in this.selectors ) {
                value += this.selectors[key].preview(elements[i]);
            }
            value +=  "</div>";
        }
    } else {
        for ( key in this.selectors ) {
            value += this.selectors[key].preview(document.body);
        }
    }
    return value;
};

/********************
        SELECTOR
********************/
function Selector(selector, rules){
    this.selector   = selector;
    this.rules      = {};
    this.hasHTML    = false;
    this.eles       = {};
    this.parentSet;
    var ruleObj;
    var rule;
    for ( var key in rules ) {
        ruleObj = rules[key];
        rule = new Rule(ruleObj.name, ruleObj.capture, ruleObj.follow);
        rule.parentSelector = this;
        this.rules[key] = rule;
    }
}

Selector.prototype.object = function(){
    var data = {
        selector:   this.selector,
        rules:      {}
    };

    for ( var key in this.rules ) {
        data.rules[key] = this.rules[key].object();
    }

    return data;
};

/*
only include the selector if it has rules
*/
Selector.prototype.uploadObject = function(){
    if ( Object.keys(this.rules).length === 0 ) {
        return;
    }

    return this.object();
};

Selector.prototype.addRule = function(rule){
    this.rules[rule.name] = rule;
    rule.parentSelector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Schema)
    // add a new Page to the schema with the name of the Rule
    // only add page if it doesn't already exist
    if ( rule.follow ) {
        var schema = this.getSchema();
        if ( schema ) {
            var page = new Page(rule.name);
            schema.addPage(page);
        }
    }

    // if Selector html exists, also create html for rule
    if ( this.hasHTML ) {
        rule.html();
    }
};

// uggggggggly
Selector.prototype.getSchema = function(){
    if ( this.parentSet && this.parentSet.parentPage && this.parentSet.parentPage.parentSchema ) {
        return this.parentSet.parentPage.parentSchema;
    }
};

Selector.prototype.removeRule = function(name){
    var rule = this.rules[name];
    if ( rule ) {
        rule.remove();
        delete this.rules[name];
    }
};

Selector.prototype.updateSelector = function(newSelector){
    var oldSelector     = this.selector;
    this.selector       = newSelector;
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newSelector;
    }

    if ( this.parentSet ) {
        this.parentSet.selectors[newSelector] = this;
        delete this.parentSet.selectors[oldSelector];
    }
};

Selector.prototype.html = function(){
    var holder          = noSelectElement("li");
    var identifier      = document.createTextNode("Selector: ");
    var nametag         = noSelectElement("span");
    var editSelector    = noSelectElement("button");
    var newRule         = noSelectElement("button");
    var remove          = noSelectElement("button");
    var rules           = noSelectElement("ul");

    this.hasHTML = true;
    this.eles = {
        holder:     holder,
        nametag:    nametag,
        rules:      rules
    };

    holder.classList.add("selector");
    nametag.textContent = this.selector;
    nametag.classList.add("nametag");
    newRule.textContent = "+Rule";
    newRule.classList.add("pos");
    editSelector.textContent = "edit";
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    holder.addEventListener("mouseenter", this.events.previewEvent.bind(this), false);
    holder.addEventListener("mouseleave", this.events.unpreviewEvent.bind(this), false);
    newRule.addEventListener("click", this.events.newRuleEvent.bind(this), false);
    editSelector.addEventListener("click", this.events.editEvent.bind(this), false);
    remove.addEventListener("click", this.events.removeEvent.bind(this), false);

    appendChildren(holder, [identifier, nametag, editSelector, newRule, remove, rules]);

    // iterate over rules and add them
    for ( var key in this.rules ) {
        this.rules[key].html();
    }

    if ( this.parentSet && this.parentSet.hasHTML ) {
        this.parentSet.eles.selectors.appendChild(holder);
    }
};

Selector.prototype.events = {
    previewEvent: function(event){
        var parent      = this.parentSet ? this.parentSet.parent : undefined;
        var elements    = Fetch.matchedElements(this.selector, parent);
        addClass("savedPreview", elements);
    },
    unpreviewEvent: function(event){
        clearClass("savedPreview");
    },
    removeEvent: function(event){
        event.preventDefault();
        this.remove();
        CurrentSite.saveCurrent();
    },
    newRuleEvent: function(event){
        event.preventDefault();
        CurrentSite.current.selector = this;
        RuleView.show(this.selector);
    },
    editEvent: function(event){
        event.preventDefault();
        editSelector(this);
    }
};

Selector.prototype.deleteHTML = prototypeDeleteHTML;

Selector.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.rules ) {
        this.removeRule(key);
    }

    if ( this.parentSet ) {
        delete this.parentSet.selectors[this.selector];
    }
};

Selector.prototype.preview = function(dom){
    var value       = "";
    var element     = dom.querySelector(this.selector);
    if ( !element ) {
        return "";
    }
    for ( var key in this.rules ) {
        value += this.rules[key].preview(element);
    }
    return value;
};

/********************
        RULE
********************/
function Rule(name, capture, follow){
    this.name       = name;
    this.capture    = capture;
    this.follow     = follow || false;
    this.hasHTML    = false;
    this.eles       = {};
    // added when a SelectorSet calls addRule
    this.parentSelector;
}

Rule.prototype.object = function(){
    var data = {
        name:       this.name,
        capture:    this.capture
    };

    if ( this.follow ) {
        data.follow = this.follow;
    }

    return data;
};

Rule.prototype.html = function(){
    var holder      = noSelectElement("li");
    var nametag     = noSelectElement("span");
    var capturetag  = noSelectElement("span");
    var edit        = noSelectElement("button");
    var deltog      = noSelectElement("button");
    this.hasHTML    = true;
    this.eles       = {
        holder:         holder,
        nametag:        nametag,
        capturetag:     capturetag
    };

    holder.classList.add("rule");
    nametag.textContent = this.name;
    nametag.classList.add("nametag");
    capturetag.textContent = "(" + this.capture + ")";
    capturetag.classList.add("nametag");
    edit.classList.add("editRule");
    edit.textContent = "edit";
    deltog.innerHTML = "&times;";
    deltog.classList.add("neg");
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, capturetag, edit, deltog]);

    edit.addEventListener("click", this.events.editEvent.bind(this), false);
    deltog.addEventListener("click", this.events.removeEvent.bind(this), false);
    
    // automatically append to parent selector's rule holder
    if ( this.parentSelector && this.parentSelector.hasHTML ) {
        this.parentSelector.eles.rules.appendChild(holder);
    }
};

Rule.prototype.events = {
    editEvent: function(event){
        editRule(this);
    },
    removeEvent: function(event){
        clearClass("savedPreview");
        this.remove();
        CurrentSite.saveCurrent();
    }
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName     = this.name;
    var newName     = object.name;
    var oldCapture  = this.capture;
    var newCapture  = object.capture;
    var oldFollow   = this.follow;
    var newFollow   = object.follow || false;

    if ( oldName !== newName ) {
        // update nametag if html has been generated
        if ( this.eles.nametag ) {
            this.eles.nametag.textContent = newName;
        }
        if ( this.parentSelector ) {
            this.parentSelector.rules[newName] = this;
            delete this.parentSelector.rules[oldName];
        }
    }
    
    if ( oldCapture !== newCapture && this.eles.capturetag ) {
        this.eles.capturetag.textContent = "(" + newCapture + ")";
    }

    if ( oldFollow && !newFollow ) {
        // remove based on oldName in case that was also changed
        if ( CurrentSite.current.schema ) {
            CurrentSite.current.schema.removePage(oldName);
        }
    } else if ( newFollow && !oldFollow ) {
        // create the follow page
        var page = new Page(newName);
        CurrentSite.current.schema.addPage(page);
    } else if ( oldFollow && newFollow && oldName !== newName) {
        // update the name of the follow page
        CurrentSite.current.schema.pages[oldName].updateName(newName);
    }
    this.name       = newName;
    this.capture    = newCapture;
    this.follow     = newFollow;
};

/***
delete rule's html
is rule.follow, remove the page associated with the rule
remove rule from parent selector
***/
Rule.prototype.remove = function(){
    this.deleteHTML();
    // remove associated page if rule.follow = true
    if ( this.follow && this.hasSchema() ) {
        this.getSchema().removePage(this.name);
    }

    if ( this.parentSelector ) {
        delete this.parentSelector.rules[this.name];
    }
};

// some convenience functions
Rule.prototype.hasSelector = function(){
    return this.parentSelector !== undefined;
};

Rule.prototype.hasSet = function(){
    return this.hasSelector() && this.parentSelector.parentSet !== undefined;
};

Rule.prototype.hasPage = function(){
    return this.hasSet() && this.parentSelector.parentSet.parentPage !== undefined;
};

Rule.prototype.hasSchema = function(){
    return this.hasPage() && this.parentSelector.parentSet.parentPage.parentSchema !== undefined;
};

Rule.prototype.getSchema = function(){
    if ( this.hasSchema() ) {
        return this.parentSelector.parentSet.parentPage.parentSchema;
    }
};

Rule.prototype.preview = function(element){
    var cap;
    if ( this.capture.indexOf("attr-") !== -1 ) {
        var attr = this.capture.slice(5);
        cap = element.getAttribute(attr);
    } else {
        cap = element.textContent;
    }
    return "<p class=\"noSelect\">" + this.name + ": " + cap + "</p>";
};

// shared delete function
function prototypeDeleteHTML(){
    var holder  = this.eles.holder;
    var option  = this.eles.option;
    if ( option && option.parentElement ) {
        option.parentElement.removeChild(option);
    }
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}

// Source: src/chrome.js
/* functions that are related to the extension */
/* requires UI, rules.js, HTML, and CollectOptions */

var CollectOptions = {};

// takes an object to save, the name of the site, and an optional schemaName
// if schemaName is provided, obj is a schema object to be saved
// otherwise obj is a site object
function chromeSave(obj, siteName, schemaName){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        if ( schemaName ) {
            storage.sites[siteName].schemas[schemaName] = obj;
        } else {
            storage.sites[siteName] = obj;
        }
        chrome.storage.local.set({"sites": storage.sites});
        // mark as dirty so that preview will be regenerated
        UI.dirty = true;
    });
}

// takes a data object to be uploaded and passes it to the background page to handle
function chromeUpload(data){
    chrome.runtime.sendMessage({type: 'upload', data: data});
}

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
function chromeSetupHostname(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            siteObject = storage.sites[host];
        // default setup if page hasn't been visited before
        if ( !siteObject ) {
            CurrentSite = new Site(host);
            // save it right away
            CurrentSite.save();
        } else {
            CurrentSite = new Site(host, siteObject.schemas);
        }
        var siteHTML = CurrentSite.html();
        document.getElementById("schemaInfo").appendChild(siteHTML.topbar);
        document.getElementById("schemaHolder").appendChild(siteHTML.schema);
        CurrentSite.loadSchema("default");
    });
}

/***********************
    OPTIONS STORAGE
***********************/

function chromeLoadOptions(){
    chrome.storage.local.get("options", function loadOptionsChrome(storage){
        var input;
        CollectOptions = storage.options;
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
function chromeSetOptions(options){
    chrome.storage.local.set({"options": options});
}

// Source: src/cycle.js
var Cycle = (function(){
    // used to 
    var canFollow = false;
    function Cycle(holder, interactive){
        this.index          = 0;
        this.elements       = [];
        this.interactive    = interactive || false;
        this.holder         = holder;
        this.generateHTML();
    }

    Cycle.prototype.setElements = function(elements){
        this.holder.style.display = "block";
        this.elements = elements;
        canFollow = allLinks(elements);
        this.preview();
    };

    Cycle.prototype.reset = function(){
        this.elements = [];
        canFollow = false;
        this.index = 0;
        this.htmlElements.preview.textContent = "";
        this.htmlElements.index.textContent = "";
        this.holder.style.display = "none";
    };

    Cycle.prototype.generateHTML = function(){
        var previousButton  = noSelectElement("button");
        var index           = noSelectElement("span");
        var nextButton      = noSelectElement("button");
        var preview         = noSelectElement("span");

        previousButton.textContent = "<<";
        nextButton.textContent = ">>";

        previousButton.addEventListener("click", this.previous.bind(this), false);
        nextButton.addEventListener("click", this.next.bind(this), false);

        this.htmlElements = {
            previous:   previousButton,
            index:      index,
            next:       nextButton,
            preview:    preview
        };
        // hide until elements are added
        this.holder.style.display = "none";
        appendChildren(this.holder, [previousButton, index, nextButton, preview]);
    };

    Cycle.prototype.previous = function(event){
        event.preventDefault();
        this.index = ( this.index === 0 ) ? this.elements.length-1 : this.index - 1;
        this.preview();
    };

    Cycle.prototype.next = function(event){
        event.preventDefault();
        this.index = ( this.index === this.elements.length - 1) ? 0 : this.index + 1;
        this.preview();
    };

    Cycle.prototype.preview = function(){
        var element     = this.elements[this.index];
        var negative    = this.index - this.elements.length;
        this.htmlElements.index.textContent = (this.idex === 0) ? "" : this.index + " / " + negative;
        this.htmlElements.preview.innerHTML = "";

        // return if element doesn't exist
        if ( !element ) {
            return;
        }

        var clone   = cleanElement(element.cloneNode(true));
        var html    = clone.outerHTML;
        var attrs   = clone.attributes;
        var curr;
        var text;
        var splitHTML;
        var firstHalf;
        var secondHalf;
        var captureEle;
        if ( this.interactive ) {
            for ( var i=0, len =attrs.length; i<len; i++ ) {
                curr = attrs[i];
                text = attributeText(curr);

                splitHTML = html.split(text);
                firstHalf = splitHTML[0];
                secondHalf = splitHTML[1];

                this.htmlElements.preview.appendChild(document.createTextNode(firstHalf));
                captureEle = captureAttribute(text, 'attr-'+curr.name);
                if ( captureEle) {
                    this.htmlElements.preview.appendChild(captureEle);
                }
                html = secondHalf;
            }

            if ( clone.textContent !== "" ) {
                text = clone.textContent;
                splitHTML = html.split(text);
                firstHalf = splitHTML[0];
                secondHalf = splitHTML[1];

                this.htmlElements.preview.appendChild(document.createTextNode(firstHalf));
                captureEle = captureAttribute(text, 'text');
                if ( captureEle) {
                    this.htmlElements.preview.appendChild(captureEle);
                }

                html = secondHalf;
            }
        } else {
            // get rid of empty class string
            if (html.indexOf(" class=\"\"") !== -1 ) {
                html = html.replace(" class=\"\"", "");
            }
        }

        // append remaining text
        this.htmlElements.preview.appendChild(document.createTextNode(html));
        markCapture();
    };

    /*
    takes an element and remove collectjs related classes and shorten text, then returns outerHTML
    */
    function cleanElement(ele){
        ele.classList.remove("queryCheck");
        ele.classList.remove("collectHighlight");
        ele.classList.remove("savedPreview");
        if ( ele.hasAttribute('src') ) {
            var value = ele.getAttribute('src'),
                query = value.indexOf('?');
            if ( query !== -1 ) {
                value = value.slice(0, query);
            }
            ele.setAttribute('src', value);
        }
        if ( ele.textContent !== "" ) {
            var innerText = ele.textContent.replace(/(\s{2,}|[\n\t]+)/g, ' ');
            if ( innerText.length > 100 ){
                innerText = innerText.slice(0, 25) + "..." + innerText.slice(-25);
            }
            ele.innerHTML = innerText;
        }
        return ele;
    }

    function attributeText(attr) {
        // encode ampersand
        attr.value = attr.value.replace("&", "&amp;");
        return attr.name + "=\"" + attr.value + "\"";
    }

    //wrap an attribute or the text of an html string 
    //(used in #selector_text div)
    function captureAttribute(text, type){
        // don't include empty properties
        if ( text.indexOf('=""') !== -1 ) {
            return;
        }
        var span = noSelectElement("span");
        span.classList.add("capture");
        span.setAttribute("title", "click to capture " + type + " property");
        span.dataset.capture = type;
        span.textContent = text;
        span.addEventListener("click", capturePreview, false);
        return span;
    }


    /*
    if the .capture element clicked does not have the .selected class, set attribute to capture
    otherwise, clear the attribute to capture
    toggle .selected class
    */
    function capturePreview(event){
        var capture         = HTML.rule.capture;
        var follow          = HTML.rule.follow;
        var followHolder    = HTML.rule.followHolder;
        var captureVal;
        if ( !this.classList.contains("selected") ){
            clearClass("selected");
            captureVal = this.dataset.capture;
            capture.textContent = captureVal;
            this.classList.add("selected");

            // toggle follow based on if capture is attr-href or something else
            if ( captureVal === "attr-href" && canFollow ){
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

    function isLink(element, index, array){
        return element.tagName === "A";
    }

    /*
    iterate over elements and if each is an anchor element, return true
    */
    function allLinks(elements){
        return Array.prototype.slice.call(elements).every(isLink);
    }

    /*
    if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
    */
    function markCapture(){
        var capture = HTML.rule.capture.textContent;
        if ( capture !== "") {
            var selector = ".capture[data-capture='" + capture + "']";
            document.querySelector(selector).classList.add("selected");
        }
    }

    return Cycle;
})();

// Source: src/views.js
// requires Family, Cycle, Parent, UI

// control the selector view
var SelectorView = (function(){
    var html    = {
        family:     document.getElementById("selectorHolder"),
        selector:   document.getElementById("currentSelector"),
        count:      document.getElementById("currentCount"),
        parent: {
            holder: document.getElementById("parentRange"),
            low:    document.getElementById("parentLow"),
            high:   document.getElementById("parentHigh")
        },
        type:       document.getElementById("selectorType")
    };
    var cycle   = new Cycle(document.getElementById("selectorCycleHolder"));
    var sv      = {
        editing:    false,
        type:       "selector",
        reset: function(){
            Family.remove();
            Parent.type = "selector";
            this.editing = false;
            delete this.editingObject;
            cycle.reset();

            html.parent.holder.style.display = "none";
            html.parent.low.value = "";
            html.parent.high.value = "";
            html.count.textContent = "";
        },
        setElements: function(elements){
            cycle.setElements(elements);
        },
        // type is the type of selector that is being created
        // selector is a pre-existing selector to be edited
        show: function(type, selector){
            html.type.textContent = this.type;
            switch(this.type){
            case "selector":
                html.parent.holder.style.display = "none";
                if ( selector ) {
                    html.selector.textContent = selector.selector;
                }
                break;
            case "parent":
                html.parent.holder.style.display = "block";
                Parent.hide();
                if ( selector ) {
                    html.parent.low.value = selector.low || "";
                    html.parent.high.value = selector.high || "";
                    html.selector.textContent = selector.selector;
                }
                break;
            case "next":
                html.parent.holder.style.display = "none";
                Parent.hide();
                break;
            }
            UI.showSelectorView();
            Family.turnOn();
        }
    };


    /***************
        EVENTS
    ***************/
    idEvent("saveSelector", "click", saveEvent);
    idEvent("cancelSelector", "click", cancelEvent);

    idEvent("parentLow", "blur", rangeEvent);
    idEvent("parentHigh", "blur", rangeEvent);

    function saveEvent(event){
        event.preventDefault();
        error.clear();
        var selector = html.selector.textContent;
        var success;

        if ( error.empty(selector, html.selector, "No CSS selector selected") ) {
            return;
        }
        switch(sv.type){
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
            UI.showSchemaView();
        }
    }

    function saveSelector(selector){
        var sel = new Selector(selector);
        // if editing just update the selector, otherwise add it to the current set
        if ( sv.editing ) {
            sv.editingObject.updateSelector(selector);
        } else {
            CurrentSite.current.set.addSelector(sel);
        }
        
        CurrentSite.saveCurrent();
        return true;
    }

    function saveParent(selector){
        var low     = parseInt(html.parent.low.value, 10);
        var high    = parseInt(html.parent.high.value, 10);
        var parent  = {
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
        var match           = document.querySelector(selector);
        var name            = CurrentSite.current.page.name;
        var defaultError    = "Cannot add next selector to '" + name + "' page, only to default";
        var hrefError       = "selector must select element with href attribute";

        if ( error.check( (name !== "default" ), html.selector, defaultError) || 
            error.check(!match.hasAttribute("href"), html.selector, hrefError) ) {
            return false;
        }

        CurrentSite.current.page.addNext(selector);
        CurrentSite.saveCurrent();
        return true;
    }


    function cancelEvent(event){
        event.preventDefault();
        resetInterface();
        UI.showSchemaView();
    }

    function rangeEvent(event){
        var lowVal      = html.parent.low.value;
        var highVal     = html.parent.high.value;
        var low         = parseInt(lowVal, 10);
        var high        = parseInt(highVal, 10);
        var errorBool   = false;
        var lowMsg      = "Low must be positive integer greater than 0";
        var highMsg     = "High must be negative integer";

        if ( lowVal !== "" ) {
            if ( error.check(( isNaN(low) || low <= 0 ), html.parent.low, lowMsg) ) {
                html.parent.low.value = "";
                errorBool = true;
            }
        } else { 
            low = 0;
        }

        if ( highVal !== "" ) {
            if ( error.check( (isNaN(high) || high > 0 ), html.parent.high, highMsg )) {
                html.parent.high.value = "";
                errorBool = true;
            }
        } else {
            high = 0;
        }

        if ( errorBool ) {
            return;
        }

        var elements    = Family.selectorElements();
        // restrict to range
        elements = Array.prototype.slice.call(elements).slice(low, elements.length + high);
        clearClass("queryCheck");
        addClass("queryCheck", elements);
        cycle.setElements(elements);
        html.count.textContent = elementCount(elements.length, Parent.getCount() );
    }

    return sv;

})();

var RuleView = (function(){
    var html    = {
        selector:       document.getElementById("ruleSelector"),
        form:           document.getElementById("ruleForm"),
        name:           document.getElementById("ruleName"),
        capture:        document.getElementById("ruleAttr"),
        follow:         document.getElementById("ruleFollow"),
        followHolder:   document.getElementById("ruleFollowHolder")
    };
    var cycle   = new Cycle(document.getElementById("ruleCycleHolder"), true);
    var rv      = {
        editing: false,
        reset: function(){
            this.editing = false;
            delete this.editingObject;
            cycle.reset();
            // reset rule form
            html.selector.textContent           = "";
            html.name.value                     = "";
            html.capture.textContent            = "";
            html.follow.checked                 = false;
            html.follow.disabled                = true;
            html.followHolder.style.display     = "none";
        },
        show: function(selector, rule){
            // setup based on (optional) rule
            if ( rule ) {
                html.name.value = rule.name;
                html.capture.textContent = rule.capture;
                if ( rule.capture === "attr-href" ) {
                    html.follow.checked = rule.follow;
                    html.follow.disabled = false;
                    html.followHolder.style.display = "block";
                } else {
                    html.follow.checked = false;
                    html.follow.disabled = true;
                    html.followHolder.style.display = "none";
                }
            }

            // setup based on selector
            html.selector.textContent = selector;
            var elements = Fetch.matchedElements(selector, Parent.parent);
            cycle.setElements(elements);
            addClass("savedPreview", elements);
            UI.showRuleView();
        }
    };

    /***************
        EVENTS
    ***************/

    idEvent("saveRule", "click", saveEvent);
    idEvent("cancelRule", "click", cancelEvent);

    function saveEvent(event){
        event.preventDefault();
        var name            = html.name.value;
        var capture         = html.capture.textContent;
        var follow          = html.follow.checked;
        var emptyName       = "Name needs to be filled in";
        var emptyAttr       = "No attribute selected";
        var reservedName    = "Cannot use " + name + " because it is a reserved word";
        var notUnique       = "Rule name is not unique";
        // error checking
        error.clear();
        if ( error.empty(name, html.name, emptyName) ||
            error.empty(capture, html.capture, emptyAttr) || 
            error.reservedWord(name, html.name, reservedName) ) {
            return;
        }

        if ( rv.editing ) {
            rv.editingObject.update({
                name: name,
                capture: capture,
                follow: follow
            });
            delete rv.editingObject;
        } else {
            if ( error.check(!CurrentSite.current.schema.uniqueRuleName(name), html.name, notUnique) ) {
                return;
            }
            var rule = new Rule(name, capture, follow);
            CurrentSite.current.selector.addRule(rule);
        }
        CurrentSite.current.selector = undefined;
        CurrentSite.saveCurrent();
        UI.showSchemaView();
    }

    function cancelEvent(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface();
        UI.showSchemaView();
    }

    return rv;

})();

// Source: src/collector.js
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
