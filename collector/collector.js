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
    this.parent = parent || "body";
    this.selectors = [];
    this.ele = noSelectEle("div", ["selectorFamily"]);
    // Generates the selectors array with Selectors from ele to parent (ignoring document.body)
    // Order is from most senior element to provided ele
    var sel;
    options = options || {};
    // if a select is given, swap ele to be the first option
    if ( ele.tagName === "SELECT" && ele.childElementCount > 0 ) {
        ele = ele.children[0];
    }
    while ( ele !== null && ele.tagName !== "BODY" ) {
        // ignore element if it isn't allowed
        if ( options.ignore && !allowedElement(ele.tagName) ) {
            ele = ele.parentElement;
            continue;
        }

        sel = new EleSelector(ele, this);
        if ( this.parent && sel.matches(this.parent)) {
            break;
        }
        this.selectors.push(sel);
        ele = ele.parentElement;
    }
    // reverse selectors so 0-index is selector closest to body
    this.selectors.reverse();
    for ( var i=0, len=this.selectors.length; i<len; i++ ) {
        sel = this.selectors[i];
        this.ele.appendChild(sel.ele);
        sel.index = i;
    }
    this.selectors[this.selectors.length-1].setAll();

    this.holder = holder;
    this.text = text;
    this.updateFunction = fn;
    // clear out holder, then attach SelectorFamily.ele
    this.holder.innerHTML = "";
    this.holder.appendChild(this.ele);
}

SelectorFamily.prototype = {
    // "Private" methods
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
        if ( this.holder ) {
            this.holder.innerHTML = "";    
        }
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
        //this.selector.family.update();
    }
};

/********************
    FRAGMENT
********************/
function Fragment(name, selector, on){
    this.selector = selector;
    this.name = name;
    var classes = ["toggleable", "realselector"];
    if ( !on ) {
        classes.push("off");
    }
    this.ele = noSelectEle("span", classes);
    this.ele.textContent = this.name;

    //Events
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
function NthFragment(selector, on){
    this.selector = selector;
    var classes = ["toggleable"];
    // explicit false
    if ( on === false ) {
        classes.push("off");
    }
    
    this.ele = noSelectEle("span", classes);
    this.beforeText = document.createTextNode(":nth-of-type(");
    this.afterText = document.createTextNode(")");
    this.input = noSelectEle("input", ["childtoggle"]);
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
function EleSelector(ele, family){
    this.family = family;
    this.tag = new Fragment(ele.tagName.toLowerCase(), this);
    this.id = ele.hasAttribute('id') ? new Fragment('#' + ele.getAttribute('id'), this) : undefined;
    this.classes = [];
    this.ele = noSelectEle("div", ["selectorSchema"]);
    this.ele.appendChild(this.tag.ele);
    if ( this.id ) {
        this.ele.appendChild(this.id.ele);
    }

    var curr, deltog, frag;
    for ( var i=0, len=ele.classList.length; i<len; i++ ) {
        curr = ele.classList[i];
        // classes used collect.js, not native to page 
        if ( curr === "collectHighlight" || curr === "queryCheck" || curr === "savedPreview" ) {
            continue;
        }
        frag = new Fragment('.' + curr, this);
        this.classes.push(frag);
        this.ele.appendChild(frag.ele);
    }

    this.nthtypeCreator = selectorSpan("+t", ["nthtype", "noSelect"], "add the nth-of-type pseudo selector"),
    this.ele.appendChild(this.nthtypeCreator);
    this.nthtypeCreator.addEventListener('click', createNthofType.bind(this), false);

    deltog = selectorSpan("x", ["deltog", "noSelect"]);
    this.ele.appendChild(deltog);
    deltog.addEventListener('click', removeSelectorSchema.bind(this), false);

    this.ele.addEventListener("click", cleanSelector.bind(this), false);
}

function cleanSelector(event){
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
}

EleSelector.prototype = {
    addNthofType: function(){
        if ( this.nthoftype ) {
            return;
        }
        // if the current string for selector is empty, turn on the tag
        // needs to be called before nthoftype is created
        if ( this.toString() === "") {
            this.tag.turnOn();
        }
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

function createNthofType(event){
    event.stopPropagation();
    this.addNthofType();
}

function removeSelectorSchema(event){
    // get rid of the html element
    this.ele.parentElement.removeChild(this.ele);
    this.family.removeSelector(this.index);
}

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

// Source: src/rule.js
/********************
        SCHEMA
********************/
function Schema(name, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {
        "default": new Page("default")
    };
    this.pageOptions;
    this.pages["default"].parentSchema = this;
    this.htmlElements = {};
}

Schema.prototype.object = function(){
    var data = {
        name: this.name,
        urls: this.urls,
        pages: {}
    },
        pageObject;

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
    var data = {
        name: this.name,
        urls: Object.keys(this.urls)
    },
        pages = {},
        followSets = {},
        currPage,
        pageName, setName,
        pageObject,
        set, followPages;

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
    var holder = noSelectElement("div"),
        nametag = noSelectElement("h3"),
        pages = noSelectElement("ul");

    holder.classList.add("schema");
    nametag.textContent = this.name + " schema";
    appendChildren(holder, [nametag, pages]);

    for ( var key in this.pages ) {
        pages.appendChild(this.pages[key].html());
    }

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.pages = pages;

    return holder;
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

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
    if ( this.htmlElements.holder) {
        var ele = page.html();
        this.htmlElements.pages.appendChild(ele);
    }
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
    var page, pageName, setName;
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
    var page, selectorSet, selector,
        pageName, setName, selectorName, ruleName;
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
function Page(name, index, next){
    this.name = name,
    this.index = index || false;
    this.next = next;
    this.sets = {
        "default": new SelectorSet("default")
    };
    this.sets["default"].parentPage = this;
    this.htmlElements = {};
    // added when a schema calls addPage
    this.parentSchema;
}

Page.prototype.object = function(){
    var data = {
        name: this.name,
        index: this.index,
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
index: whether or not the page is an index page (based on if there is a next)
    probably not necessary, look to remove after tree is working
sets: dict containing non-empty (ie, has 1+ rules) selector sets
next: string for next selector (if index = true)
***/
Page.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        index: this.index,
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
    var holder = noSelectElement("li"),
        nametag = noSelectElement("h4"),
        sets = noSelectElement("ul");

    holder.classList.add("page");
    nametag.textContent = this.name + " page";
    appendChildren(holder, [nametag, sets]);

    for ( var key in this.sets ) {
        sets.appendChild(this.sets[key].html());
    }

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.sets = sets;

    return holder;
};

Page.prototype.addOption = function(select){
    if ( !select ) {
        return;
    }
    var option = noSelectElement("option");

    option.setAttribute("value", this.name);
    option.textContent = this.name;

    select.appendChild(option);
    this.htmlElements.option = option;
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
    if ( this.htmlElements.holder ) {
        var ele = selectorSet.html();
        this.htmlElements.sets.appendChild(ele);
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

Page.prototype.removeNext = function(){
    this.next = undefined;
    this.index = false;
};

/***
iterate over sets in the page, returning an object mapping selector set's name to a list of pages that
follow it
***/
Page.prototype.followedSets = function(){
    var following = {},
        set, followed;
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
    var oldName = this.name;
    this.name = name;
    if ( this.parentSchema ) {
        this.parentSchema.pages[name] = this;
        delete this.parentSchema.pages[oldName];
    }

    if ( this.htmlElements.option ) {
        this.htmlElements.option.setAttribute("value", this.name);
        this.htmlElements.option.textContent = this.name;
    }
    if ( this.htmlElements.nametag ) {
        this.htmlElements.nametag.textContent = this.name + " page";
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
function SelectorSet(name, parent){
    this.name = name;
    this.parent = parent;
    this.selectors = {};
    this.htmlElements = {};
    // added when a page calls addSet
    this.parentPage;
}

SelectorSet.prototype.object = function(){
    var data = {
        name: this.name,
        selectors: {}
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
    var holder = noSelectElement("li"),
        nametag = noSelectElement("h5"),
        ul = noSelectElement("ul");
        
    holder.classList.add("set");
    nametag.textContent = this.name + " selector set";
    appendChildren(holder, [nametag, ul]);

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.selectors = ul;

    return holder;
};

SelectorSet.prototype.addOption = function(select){
    if ( !select ) {
        return;
    }
    var option = noSelectElement("option");

    option.setAttribute("value", this.name);
    option.textContent = this.name;

    select.appendChild(option);
    this.htmlElements.option = option;
};

SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
};

SelectorSet.prototype.addSelector = function(selector, events){
    this.selectors[selector.selector] = selector;
    if ( this.htmlElements.selectors) {
        var ele = selector.html.apply(selector, events);
        this.htmlElements.selectors.appendChild(ele);
    }
    selector.parentSet = this;
};

SelectorSet.prototype.removeSelector = function(name){
    var selector = this.selectors[name];
    if ( selector ) {
        selector.remove();
        delete this.selectors[name];
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
    this.selector = selector;
    this.rules = rules || {};
    this.htmlElements = {};
}

Selector.prototype.object = function(){
    var data = {
        selector: this.selector,
        rules: {}
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

Selector.prototype.addRule = function(rule, events, select){
    this.rules[rule.name] = rule;
    rule.parentSelector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Schema)
    // add a new Page to the schema with the name of the Rule
    if ( rule.follow && this.parentSet && this.parentSet.parentPage && this.parentSet.parentPage.parentSchema ) {
        var page = new Page(rule.name);
        page.addOption(select);
        this.parentSet.parentPage.parentSchema.addPage(page);
    }

    // if Selector html exists, also create html for rule
    if ( this.htmlElements.rules ) {
        var ele = rule.html.apply(rule, events);
        this.htmlElements.rules.appendChild(ele);
    }
};

Selector.prototype.removeRule = function(name){
    delete this.rules[name];
};

Selector.prototype.updateSelector = function(newSelector){
    var oldSelector = this.selector;
    this.selector = newSelector;
    if ( this.htmlElements.nametag ) {
        this.htmlElements.nametag.textContent = newSelector;
    }

    if ( this.parentSet ) {
        this.parentSet.selectors[newSelector] = this;
        delete this.parentSet.selectors[oldSelector];
    }
};

Selector.prototype.html = function(newRuleEvent, editEvent, deleteEvent){
    var holder = noSelectElement("li"),
        identifier = document.createTextNode("Selector: "),
        nametag = noSelectElement("span"),
        editSelector = noSelectElement("button"),
        newRule = noSelectElement("button"),
        remove = noSelectElement("button"),
        rules = noSelectElement("ul");

    holder.classList.add("selector");
    nametag.textContent = this.selector;

    newRule.textContent = "add rule";
    editSelector.textContent = "edit";
    remove.textContent = "×";

    newRule.addEventListener("click", newRuleEvent.bind(this), false);
    editSelector.addEventListener("click", editEvent.bind(this), false);
    remove.addEventListener("click", deleteEvent.bind(this), false);

    appendChildren(holder, [identifier, nametag, editSelector, newRule, remove, rules]);

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.newRule = newRule;
    this.htmlElements.editSelector = editSelector;
    this.htmlElements.remove = remove;
    this.htmlElements.rules = rules;

    return holder;
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
    var value = "",
        element = dom.querySelector(this.selector);
    for ( var key in this.rules ) {
        value += this.rules[key].preview(element);
    }
    return value;
};

/********************
        RULE
********************/
function Rule(name, capture, follow){
    this.name = name;
    this.capture = capture;
    this.follow = follow || false;
    this.htmlElements = {};
    // added when a SelectorSet calls addRule
    this.parentSelector;
}

Rule.prototype.object = function(){
    var data = {
        name: this.name,
        capture: this.capture
    };

    if ( this.follow ) {
        data.follow = this.follow;
    }

    return data;
};

Rule.prototype.html = function(selectorViewEvent, unselectorViewEvent, editEvent, deleteEvent){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        capturetag = noSelectElement("span"),
        edit = noSelectElement("button"),
        deltog = noSelectElement("button");

    holder.classList.add("rule");
    nametag.textContent = this.name;
    nametag.classList.add("savedRuleName");
    capturetag.textContent = "(" + this.capture + ")";
    edit.classList.add("editRule");
    edit.textContent = "edit";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, capturetag, edit, deltog]);

    holder.addEventListener("mouseenter", selectorViewEvent.bind(this), false);
    holder.addEventListener("mouseleave", unselectorViewEvent.bind(this), false);
    edit.addEventListener("click", editEvent.bind(this), false);
    deltog.addEventListener("click", deleteEvent.bind(this), false);
    
    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.capturetag = capturetag;
    this.htmlElements.edit = edit;
    this.htmlElements.deltog = deltog;

    return holder;
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object, select){
    var oldName = this.name,
        newName = object.name;
    if ( oldName !== newName ) {
        // update nametag if html has been generated
        if ( this.htmlElements.nametag ) {
            this.htmlElements.nametag.textContent = newName;
        }
        if ( this.parentSelector ) {
            this.parentSelector.rules[newName] = this;
            delete this.parentSelector.rules[oldName];
        }
    }
    var oldCapture = this.capture,
        newCapture = object.capture;
    if ( oldCapture !== newCapture && this.htmlElements.capturetag ) {
        this.htmlElements.capturetag.textContent = "(" + newCapture + ")";
    }

    var oldFollow = this.follow,
        newFollow = object.follow || false;
    if ( this.hasSchema() ) {
        var schema = this.getSchema();
        if ( oldFollow && !newFollow ) {
            // remove based on oldName in case that was also changed
            schema.removePage(oldName);
        } else if ( newFollow && !oldFollow ) {
            // create the follow page
            var page = new Page(newName);
            schema.addPage(page);
            if ( select ) {
                page.addOption(select);
            }
        } else if ( oldFollow && newFollow && oldName !== newName) {
            // update the name of the follow page
            schema.pages[oldName].updateName(newName);
        }
    }
    this.name = newName;
    this.capture = newCapture;
    this.follow = newFollow;
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
    var holder = this.htmlElements.holder,
        option = this.htmlElements.option;
    if ( option && option.parentElement ) {
        option.parentElement.removeChild(option);
    }
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}

// Source: src/cycle.js
var Cycle = (function(){
    function Cycle(holder, interactive){
        this.index = 0;
        this.elements = [];
        this.interactive = interactive || false;
        this.holder = holder;
        this.generateHTML();
    }

    Cycle.prototype.setElements = function(elements){
        this.holder.style.display = "block";
        this.elements = elements;
        this.preview();
    };

    Cycle.prototype.reset = function(){
        this.elements = [];
        this.index = 0;
        this.htmlElements.preview.textContent = "";
        this.htmlElements.index.textContent = "";
        this.holder.style.display = "none";
    };

    Cycle.prototype.generateHTML = function(){
        var previousButton = noSelectElement("button"),
            index = noSelectElement("span"),
            nextButton = noSelectElement("button"),
            preview = noSelectElement("span");

        previousButton.textContent = "<<";
        nextButton.textContent = ">>";

        previousButton.addEventListener("click", this.previous.bind(this), false);
        nextButton.addEventListener("click", this.next.bind(this), false);

        this.htmlElements = {
            previous: previousButton,
            index: index,
            next: nextButton,
            preview: preview
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
        var element = this.elements[this.index],
            negative = this.index - this.elements.length;
        this.htmlElements.index.textContent = (this.idex === 0) ? "" : this.index + " / " + negative;
        this.htmlElements.preview.innerHTML = "";

        var clone = cleanElement(element.cloneNode(true)),
            html = clone.outerHTML,
            attrs = clone.attributes,
            curr, text, splitHTML, firstHalf, secondHalf, captureEle;
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
        ele.classList.remove('queryCheck');
        ele.classList.remove('collectHighlight');
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

// Source: src/collector_with_html.js
var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemasTab\" data-for=\"schemasView\">Schema</div><div class=\"tab\" id=\"selectorTab\" data-for=\"selectorView\">Selector</div><div class=\"tab\" id=\"ruleTab\" data-for=\"ruleView\">Rule</div><div class=\"tab\" id=\"previewTab\" data-for=\"previewView\">Preview</div><div class=\"tab\" id=\"optionsTab\" data-for=\"optionsView\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Schema: <select id=\"schemaSelect\"></select><button id=\"createSchema\" title=\"create a new schema\">+</button><button id=\"deleteSchema\" title=\"delete current schema\">&times;</button><div id=\"indexMarker\" class=\"info\">Initial URL<input type=\"checkbox\" id=\"indexToggle\" /></div></div><div>Page: <select id=\"pageSelect\"></select><button id=\"deletePage\" title=\"delete current page\">&times;</button><div id=\"nextHolder\" class=\"info\">Next:<span id=\"nextSelectorView\"></span><button id=\"removeNext\">&times;</button></div></div><div>Selector Set: <select id=\"selectorSetSelect\"></select><button id=\"createSelectorSet\" title=\"create a new selector set\">+</button><button id=\"deleteSelectorSet\" title=\"delete current selector set\">&times;</button><div id=\"currentParent\" class=\"info\">Parent:<span id=\"parentSelectorView\"></span><span id=\"parentRangeView\"></span><button id=\"removeParent\">&times;</button></div></div><button id=\"uploadRules\">Upload Schema</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemasView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div><h3>Type:</h3><p><label for=\"selectorRadio\">Selector</label><input type=\"radio\" id=\"selectorRadio\" name=\"selector\" value=\"selector\" checked/></p><p><label for=\"parentRadio\">Parent</label><input type=\"radio\" id=\"parentRadio\" name=\"selector\" value=\"parent\" /></p><p><label for=\"nextRadio\">Next</label><input type=\"radio\" id=\"nextRadio\" name=\"selector\" value=\"next\" /></p></div><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label for=\"parentHigh\">High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"clearSelector\">Clear</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
