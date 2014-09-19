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

// Source: src/selector.js
/********************
    SELECTORFAMILY
********************/
/*
ele is the child element you want to build a selector from
parent is the selector for the most senior element you want to build a selector up to
    or "body" if parent is undefined or an empty string
text is an element whose textContent will be set based on SelectorFamily.toString in update
fn is a function to be called when SelectorFamily.update is called
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

        sel = new Selector(ele, this);
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
function Selector(ele, family){
    this.family = family;
    this.tag = new Fragment(ele.tagName.toLowerCase(), this);
    this.id = ele.hasAttribute('id') ? new Fragment('#' + ele.getAttribute('id'), this) : undefined;
    this.classes = [];
    this.ele = noSelectEle("div", ["selectorGroup"]);
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
    deltog.addEventListener('click', removeSelectorGroup.bind(this), false);

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

Selector.prototype = {
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

function removeSelectorGroup(event){
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
        GROUP
********************/
function Group(name, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {
        "default": new Page("default")
    };
    this.pages["default"].group = this;
    this.elements = {};
}

Group.prototype.object = function(){
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
rearrange the group's JSON into proper format for Collector
name: the name of the group
urls: converted from an object to a list of urls
pages: a tree with root node of the "default" page. Each 
***/
Group.prototype.uploadObject = function(){
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

Group.prototype.html = function(){
    var holder = noSelectElement("div"),
        nametag = noSelectElement("h3"),
        pages = noSelectElement("ul");

    holder.classList.add("group");
    nametag.textContent = "Group: " + this.name;
    appendChildren(holder, [nametag, pages]);

    for ( var key in this.pages ) {
        pages.appendChild(this.pages[key].html());
    }

    this.elements = {
        holder: holder,
        nametag: nametag,
        pages: pages
    };

    return holder;
};

Group.prototype.deleteHTML = prototypeDeleteHTML;

Group.prototype.addPage = function(page){
    var name = page.name;
    if ( this.pages[name] ) {
        this.removePage(name);
    }
    this.pages[name] = page;
    page.group = this;
    // if html for group exists, also generate html for page
    if ( this.elements.holder) {
        var ele = page.html();
        this.elements.pages.appendChild(ele);
    }
};

Group.prototype.removePage = function(name){
    var page = this.pages[name];
    if ( page ) {
        this.pages[name].deleteHTML();
        delete this.pages[name];
    }
};

Group.prototype.uniquePageName = function(name){
    for ( var key in this.pages ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
};

Group.prototype.uniqueSelectorSetName = function(name){
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

Group.prototype.uniqueRuleName = function(name){
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
    this.sets["default"].page = this;
    this.elements = {};
    // added when a group calls addPage
    this.group;
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
    nametag.textContent = "Page: " + this.name;
    appendChildren(holder, [nametag, sets]);

    for ( var key in this.sets ) {
        sets.appendChild(this.sets[key].html());
    }

    this.elements = {
        holder: holder,
        nametag: nametag,
        sets: sets
    };

    return holder;
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(selectorSet){
    var name = selectorSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = selectorSet;
    selectorSet.page = this;
    // if html for page exists, also create html for SelectorSet
    if ( this.elements.holder ) {
        var ele = selectorSet.html();
        this.elements.sets.appendChild(ele);
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
    if ( this.group ) {
        delete this.group.pages[this.name];
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
    this.elements = {};
    // added when a page calls addSet
    this.page;
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
        
    holder.classList.add("SelectorSet");
    nametag.textContent = "Selector Set: " + this.name;
    appendChildren(holder, [nametag, ul]);

    this.elements = {
        holder: holder,
        nametag: nametag,
        selectors: ul
    };

    return holder;
};

SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

SelectorSet.prototype.addSelector = function(selector){
    this.selectors[selector.selector] = selector;
    if ( this.elements.selectors) {
        this.elements.selectors.appendChild(selector.html())
    }
    selector.set = this;
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
    if ( this.page ) {
        delete this.page.sets[this.name];
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

/********************
        SELECTOR
********************/
function Selector(selector, rules){
    this.selector = selector;
    this.rules = rules || {};
    this.elements = {};
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
}

/*
only include the selector if it has rules
*/
Selector.prototype.uploadObject = function(){
    if ( Object.keys(this.rules).length === 0 ) {
        return;
    }

    return this.object();
}

Selector.prototype.addRule = function(rule, events){
    this.rules[rule.name] = rule;
    rule.selector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Group)
    // add a new Page to the group with the name of the Rule
    if ( rule.follow && this.set && this.set.page && this.set.page.group ) {
        var page = new Page(rule.name);
        this.set.page.group.addPage(page);
    }

    // if Selector html exists, also create html for rule
    if ( this.elements.rules ) {
        var ele = rule.html.apply(rule, events);
        this.elements.rules.appendChild(ele);
    }
};

Selector.prototype.removeRule = function(name){
    delete this.rules[name];
};

Selector.prototype.updateSelector = function(newSelector){
    var oldSelector = this.selector;
    this.selector = newSelector
    if ( this.elements.nametag ) {
        this.elements.nametag.textContent = newSelector;
    }

    if ( this.set ) {
        this.set.selectors[newSelector] = this;
        delete this.set.selectors[oldSelector];
    }
};

Selector.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        rules = noSelectElement("ul");

    holder.classList.add("savedSelector");
    nametag.textContent = this.selector;

    appendChildren(holder, [nametag, rules]);

    this.elements = {
        holder: holder,
        nametag: nametag,
        rules: rules
    };

    return holder;
};

Selector.prototype.deleteHTML = prototypeDeleteHTML;

Selector.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.rules ) {
        this.removeRule(key);
    }

    if ( this.set ) {
        delete this.set.selectors[this.name];
    }
};

/********************
        RULE
********************/
function Rule(name, capture, multiple, follow){
    this.name = name;
    this.capture = capture;
    this.multiple = multiple || false;
    this.follow = follow || false;
    this.elements = {};
    // added when a SelectorSet calls addRule
    this.selector;
}

Rule.prototype.object = function(){
    var data = {
        name: this.name,
        capture: this.capture
    };

    if ( this.multiple ) {
        data.multiple = this.multiple;
    }

    if ( this.follow ) {
        data.follow = this.follow;
    }

    return data;
};

Rule.prototype.html = function(selectorViewEvent, unselectorViewEvent, editEvent, previewEvent, deleteEvent){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        edit = noSelectElement("span"),
        preview = noSelectElement("span"),
        deltog = noSelectElement("span");

    holder.classList.add("savedRule");
    nametag.textContent = this.name;
    nametag.classList.add("savedRuleName");
    edit.classList.add("editRule");
    edit.textContent = "edit";
    preview.classList.add("previewRule");
    preview.textContent = "preview";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, edit, preview, deltog]);

    holder.addEventListener("mouseenter", selectorViewEvent.bind(this), false);
    holder.addEventListener("mouseleave", unselectorViewEvent.bind(this), false);
    edit.addEventListener("click", editEvent.bind(this), false);
    preview.addEventListener("click", previewEvent.bind(this), false);
    deltog.addEventListener("click", deleteEvent.bind(this), false);
    
    this.elements = {
        holder: holder,
        nametag: nametag,
        edit: edit,
        preview: preview,
        deltog: deltog
    };

    return holder;
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName = this.name,
        newName = object.name;
    if ( oldName !== newName ) {
        this.name = newName;
        // update nametag if html has been generated
        if ( this.elements.holder ) {
            this.elements.nametag.textContent = newName;
        }
        if ( this.selector ) {
            this.selector.rules[newName] = this;
            delete this.selector.rules[oldName];
        }
    }
    this.capture = object.capture;
    this.multiple = object.multiple || false;
    this.follow = object.follow || false;
};

/***
delete rule's html
is rule.follow, remove the page associated with the rule
remove rule from parent selector
***/
Rule.prototype.remove = function(){
    this.deleteHTML();
    // remove associated page if rule.follow = true
    if ( this.follow && this.selector && this.selector.set && this.selector.set.page &&
        this.selector.set.page.group) {
        this.selector.set.page.group.removePage(this.name);
    }

    if ( this.selector ) {
        delete this.selector.rules[this.name];
    }
};

// shared delete function
function prototypeDeleteHTML(){
    var holder = this.elements.holder;
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}

// append all of the elements in children to the parent element
function appendChildren(parent, children){
    for ( var i=0, len=children.length; i<len; i++ ) {
        parent.appendChild(children[i]);
    }
}

// Source: src/collector_with_html.js
var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"ruleTab\"data-for=\"ruleView\">Rule</div><div class=\"tab\" id=\"groupsTab\" data-for=\"groupsView\">Current Group</div><div class=\"tab\" id=\"previewTab\" data-for=\"previewView\">Preview</div><div class=\"tab\" id=\"optionsTab\" data-for=\"optionsView\">Options</div><div class=\"tab\" id=\"refreshCollect\">&#8635;</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Group: <select id=\"groupSelect\"></select><button id=\"createGroup\" title=\"create a new group\">+</button><button id=\"deleteGroup\" title=\"delete current group\">&times;</button><div id=\"indexMarker\" class=\"info\">Initial URL<input type=\"checkbox\" id=\"indexToggle\" /></div><div id=\"defaultNext\" class=\"info\">Next <input type=\"checkbox\" id=\"pageNext\" name=\"next\" /><span id=\"nextSelectorView\"></span></div></div><div>Page: <select id=\"pageSelect\"></select><button id=\"deletePage\" title=\"delete current page\">&times;</button></div><div>Rule Set: <select id=\"ruleSetSelect\"></select><button id=\"createRuleSet\" title=\"create a new rule set\">+</button><button id=\"deleteRuleSet\" title=\"delete current rule set\">&times;</button><div id=\"currentParent\" class=\"info\">Parent <input type=\"checkbox\" id=\"ruleSetParent\" name=\"parent\" /><span id=\"parentSelectorView\"></span><span id=\"parentRangeView\"></span></div></div><button id=\"uploadRules\">Upload Group</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><form id=\"ruleForm\" class=\"column\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the selector to get the rule in the DOM\">Selector:</label><span id=\"ruleSelector\"></span></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule multiple\"><label for=\"ruleMultiple\" title=\"capture from all elements matching selector. Useful when you only need one attribute from multiple elements (so that using a parent selector would be overkill)\">Multiple: </label><input id=\"ruleMultiple\" type=\"checkbox\" /></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><form id=\"editForm\" class=\"column\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"editName\" name=\"editName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the selector to get the rule in the DOM\">Selector:</label><span id=\"editSelector\"></span></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"editAttr\"></span></div><div class=\"rule editFollow\"><label for=\"editFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"editFollow\" name=\"editFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveEdit\">Save Edited Rule</button><button id=\"cancelEdit\">Cancel</button></div></form><form id=\"parentForm\" class=\"column\"><div class=\"rule\"><label>Selector:</label><span id=\"parentSelector\"></span></div><p>Range:</p><div class=\"rule\"><label for=\"parentLow\">Low:</label><input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></div><div class=\"rule\"><label for=\"parentHigh\">High:</label><input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></div><div><button id=\"saveParent\">Set Parent</button><button id=\"cancelParent\">Cancel</button></div></form><form id=\"nextForm\" class=\"column\"><div class=\"rule\"><label>Selector:</label><span id=\"nextSelector\"></span></div><button id=\"saveNext\">Save Next Rule</button><button id=\"cancelNext\">Cancel</button></form><div class=\"modifiers column\"><div id=\"selectorHolder\"></div><div class=\"ruleHTMLHolder\">Count: <span id=\"currentCount\"></span><div id=\"ruleCycle\"><button id=\"ruleCyclePrevious\" class=\"cycle\" title=\"previous element matching selector\">&lt;&lt;</button><span id=\"currentElementIndex\"></span><button id=\"ruleCycleNext\" class=\"cycle\" title=\"next element matching selector\">&gt;&gt;</button><span id=\"ruleHTML\"></span></div></div></div></div></div><div class=\"view\" id=\"groupsView\"><div id=\"groupHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"previewView\"><p>Name: <span id=\"previewName\" class=\"name\"></span>Selector: <span id=\"previewSelector\" class=\"name\"></span>Capture: <span id=\"previewCapture\" class=\"name\"></span><button id=\"previewClear\">Clear</button></p><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
        ruleSet: undefined
    },
    // parent.selector is set when Collect.current.ruleSet index=true
    parent: {},
    // currently loaded Group
    group: undefined
};

/*
Object that controls the functionality of the interface
*/
var Interface = {
    activeForm: "rule",
    tabs: {
        tab: document.querySelector(".tab.active"),
        view: document.querySelector(".view.active")
    },
    setup: function(){        
        loadOptions();
        setupHostname();
        this.events();
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
        ruleViewEvents();
        optionsViewEvents();
        previewViewEvents();
        permanentBarEvents();
    },
    update: function(){
        HTML.groups.group.querySelector("option[value=" + Collect.current.group + "]").selected = true;
        HTML.groups.page.querySelector("option[value=" + Collect.current.page + "]").selected = true;
        HTML.groups.ruleSet.querySelector("option[value=" + Collect.current.ruleSet + "]").selected = true;
    }
};

// save commonly referenced to elements
var HTML = {
    family: document.getElementById("selectorHolder"),
    form: {
        rule: {
            form: document.getElementById("ruleForm"),
            name: document.getElementById("ruleName"),
            capture: document.getElementById("ruleAttr"),
            selector: document.getElementById("ruleSelector"),
            multiple: document.getElementById("ruleMultiple"),
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
        },
        parent: {
            form: document.getElementById("parentForm"),
            selector: document.getElementById("parentSelector"),
            low: document.getElementById("parentLow"),
            high: document.getElementById("parentHigh")
        },
        next: {
            form: document.getElementById("nextForm"),
            selector: document.getElementById("nextSelector")
        }
    },
    groups: {
        group: document.getElementById("groupSelect"),
        page: document.getElementById("pageSelect"),
        ruleSet: document.getElementById("ruleSetSelect"),
        groupHolder: document.getElementById("groupHolder")
    },
    info: {
        alert: document.getElementById("collectAlert"),
        count: document.getElementById("currentCount"),
        cycleIndex: document.getElementById("currentElementIndex"),
        index: document.getElementById("indexMarker"),
        indexToggle: document.getElementById("indexToggle"),
        parent: document.getElementById("parentSelectorView"),
        parentCheckbox: document.getElementById("ruleSetParent"),
        nextHolder: document.getElementById("defaultNext"),
        next: document.getElementById("nextSelectorView"),
        nextCheckbox: document.getElementById("pageNext"),
        range: document.getElementById("parentRangeView")
    },
    interface: document.querySelector(".collectjs"),
    preview: {
        name: document.getElementById("previewName"),
        selector: document.getElementById("previewSelector"),
        capture: document.getElementById("previewCapture"),
        contents: document.getElementById("previewContents"),
        clear: document.getElementById("previewClear")
    },
    cycle: document.getElementById("ruleCycle"),
    ruleHTML: document.getElementById("ruleHTML"),
    tabs: {
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
            HTML.form.edit.name.value = Interface.editing.name;
        }
        
        var selectorElement;
        switch ( Interface.activeForm ){
        case "rule":
            selectorElement = HTML.form.rule.selector;
            break;
        case "parent":
            selectorElement = HTML.form.parent.selector;
            break;
        case "next":
            selectorElement = HTML.form.next.selector;
            break;
        case "edit":
            selectorElement = HTML.form.edit.selector;
            break;
        default:
            selectorElement = HTML.form.rule.selector;
        }

        var sf = new SelectorFamily(this,
            Collect.parent.selector,
            HTML.family,
            selectorElement,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
        showTab(HTML.tabs.rule);
    },
    edit: function(selector){
        var eles = parentElements(selector);
        if ( !eles.length ) {
            return;
        }
        var sf = new SelectorFamily(eles[0],
            Collect.parent.selector,
            HTML.family,
            HTML.form.rule.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
        showTab(HTML.tabs.rule);  
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
                HTML.form.rule.selector,
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
    sets Collect.matchedElements to elements matching the current selector and resets elementIndex
    */
    match: function(){
        Collect.matchedElements = this.elements();
        Collect.elementIndex = 0;
        setCurrentIndex();
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
        HTML.info.count.textContent = count;
        this.match();
        var ele = Collect.matchedElements[0];
        if ( ele ) {
            setRuleHTML(ele);
        }
    },
    /*
    only select elements that fall between low/elements.length + high (because high is negative)
    applies a range to the elements selected by the current selector
    */
    range: function(low, high){
        Family.match();
        var len = Collect.matchedElements.length;
        Collect.matchedElements = Array.prototype.slice.call(Collect.matchedElements).slice(low, len + high);
        Collect.elementIndex = 0;
        setCurrentIndex();
        setRuleHTML(Collect.matchedElements[0]);
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

function resetRulesView(){
    Family.remove();
    
    // reset rule form
    HTML.form.rule.name.value = "";
    HTML.form.rule.capture.textContent = "";
    HTML.form.rule.selector.textContent = "";
    HTML.form.rule.follow.checked = false;
    HTML.form.rule.follow.disabled = true;
    HTML.form.rule.followHolder.style.display = "none";

    // reset edit form
    HTML.form.edit.name.value = "";
    HTML.form.edit.capture.textContent = "";
    HTML.form.edit.selector.textContent = "";
    HTML.form.edit.follow.checked = false;
    HTML.form.edit.follow.disabled = true;
    HTML.form.edit.followHolder.style.display = "none";

    // reset parent form
    HTML.form.parent.selector.textContent = "";
    HTML.form.parent.low.value = "";
    HTML.form.parent.high.value = "";

    // reset next form
    HTML.form.next.selector.textContent = "";

    HTML.info.count.textContent = "";
    HTML.ruleHTML.innerHTML = "";
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

function ruleViewEvents(){
    idEvent("saveRule", "click", saveRuleEvent);
    idEvent("saveEdit", "click", saveEditEvent);
    idEvent("saveParent", "click", saveParentEvent);
    idEvent("saveNext", "click", saveNextEvent);

    idEvent("cancelRule", "click", cancelRuleEvent);
    idEvent("cancelEdit", "click", cancelEditEvent);
    idEvent("cancelParent", "click", cancelParentEvent);
    idEvent("cancelNext", "click", cancelNextEvent);

    idEvent("ruleCyclePrevious", "click", showPreviousElement);
    idEvent("ruleCycleNext", "click", showNextElement);

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
    idEvent("createRuleSet", "click", function newRuleSetEvent(event){
        event.preventDefault();
        createRuleSet();
    });

    idEvent("ruleSetSelect", "change", function loadRuleSetEvent(event){
        event.preventDefault();
        loadRuleSet(this);
    });

    idEvent("deleteRuleSet", "click", function deleteRuleSetEvent(event){
        event.preventDefault();
        deleteRuleSet();
    });

    // parent events
    idEvent("ruleSetParent", "change", toggleParentEvent);

    // next events
    idEvent("pageNext", "change", toggleNextEvent);

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

function cancelParentEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();
    HTML.info.parentCheckbox.checked = false;
}

function cancelNextEvent(event){
    event.stopPropagation();
    event.preventDefault();
    baseCancel();    
    HTML.info.nextCheckbox.checked = false;
}

function verifyAndApplyParentLow(event){
    var low = parseInt(HTML.form.parent.low.value, 10),
        high = parseInt(HTML.form.parent.high.value, 10) || 0;

    if ( isNaN(low) || low <= 0 ) {
        HTML.form.parent.low.value = "";
        alertMessage("Low must be positive integer greater than 0");
        return;
    }

    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.info.count.textContent = Collect.matchedElements.length;   
}

function verifyAndApplyParentHigh(event){
    var low = parseInt(HTML.form.parent.low.value, 10) || 0,
        high = parseInt(HTML.form.parent.high.value, 10);

    if ( isNaN(high) || high > 0 ) {
        HTML.form.parent.high.value = "";
        alertMessage("High must be a negative integer");
        return;
    }
    Family.range(low, high);
    clearClass("queryCheck");
    addClass("queryCheck", Collect.matchedElements);
    
    HTML.info.count.textContent = Collect.matchedElements.length;   
}

function applyParentRange(event){
}

/*
cycle to the previous element (based on Collect.elementIndex and Collect.matchedElements) to represent an
element in #ruleHTML
*/
function showPreviousElement(event){
    var index = Collect.elementIndex,
        len = Collect.matchedElements.length;
    Collect.elementIndex = (index=== 0) ? len-1 : index-1;
    setCurrentIndex();
    setRuleHTML(Collect.matchedElements[Collect.elementIndex]);
    markCapture();
}

/*
cycle to the next element (`d on Collect.elementIndex and Collect.matchedElements) to represent an
element in #ruleHTML
*/
function showNextElement(event){
    var index = Collect.elementIndex,
        len = Collect.matchedElements.length;
    Collect.elementIndex = (index=== len-1) ? 0 : index+1;
    setCurrentIndex();
    setRuleHTML(Collect.matchedElements[Collect.elementIndex]);
    markCapture();
}

/*
if the .capture element clicked does not have the .selected class, set attribute to capture
otherwise, clear the attribute to capture
toggle .selected class
*/
function capturePreview(event){
    var capture, follow, followHolder;
    if ( Interface.activeForm === "rule" ) {
        capture = HTML.form.rule.capture;
        follow = HTML.form.rule.follow;
        followHolder = HTML.form.rule.followHolder;
    } else if ( Interface.activeForm === "edit" ) {
        capture = HTML.form.edit.capture;
        follow = HTML.form.edit.follow;
        followHolder = HTML.form.edit.followHolder;
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
    RULE EVENTS
******************/
function saveRuleEvent(event){
    event.preventDefault();
    var name = HTML.form.rule.name.value,
        selector = HTML.form.rule.selector.textContent,
        capture = HTML.form.rule.capture.textContent,
        multiple = HTML.form.rule.multiple.checked,
        follow = HTML.form.rule.follow.checked,
        rule = {
            name: name,
            capture: capture,
            selector: selector
        };

    // error checking
    clearErrors();
    if ( emptyErrorCheck(name, HTML.form.rule.name, "Name needs to be filled in") ||
        emptyErrorCheck(selector, HTML.form.rule.selector, "No CSS selector selected") ||
        emptyErrorCheck(capture, HTML.form.rule.capture, "No attribute selected") || 
        reservedWordErrorCheck(rule.name, HTML.form.rule.name, "Cannot use " + rule.name + 
            " because it is a reserved word") ) {
        return;
    }
    else if ( !Collect.group.uniqueRuleName(name) ) {
        // some markup to signify you need to change the rule's name
        alertMessage("Rule name is not unique");
        HTML.form.rule.name.classList.add("error");
        return;
    }
    
    if ( multiple ) {
        rule.multiple = true;
    }

    if ( follow ) {
        rule.follow = true;
        // page will be created when rule is added to ruleset, but add option now
        HTML.groups.page.appendChild(newOption(rule.name));
    }
    
    addRule(rule, Collect.group.pages[Collect.current.page].sets[Collect.current.ruleSet]);
    saveGroup();
    resetInterface();
}

function saveEditEvent(event){
    event.preventDefault();
    var name = HTML.form.edit.name.value,
        selector = HTML.form.edit.selector.textContent,
        capture = HTML.form.edit.capture.textContent,
        follow = HTML.form.edit.follow.checked,
        rule = {
            name: name,
            capture: capture,
            selector: selector
        };

    clearErrors();
    if ( emptyErrorCheck(name, HTML.form.edit.name, "Name needs to be filled in") ||
        emptyErrorCheck(selector, HTML.form.edit.selector, "No CSS selector selected") ||
        emptyErrorCheck(capture, HTML.form.edit.capture, "No attribute selected") ) {
        return;
    }

    if ( follow ) {
        rule.follow = true;
    }
    var oldName = Interface.editing.name,
        ruleSet = Interface.editing.ruleSet;
    Interface.editing.update(rule);
    Collect.group.pages[ruleSet.page.name].sets[ruleSet.name] = ruleSet;
    saveGroup();

    deleteEditing();
    showRuleForm();
    resetInterface();
}

function saveParentEvent(event){
    event.preventDefault();
    var selector = HTML.form.parent.selector.textContent,
        low = parseInt(HTML.form.parent.low.value, 10),
        high = parseInt(HTML.form.parent.high.value, 10),
        parent = {
            selector: selector
        };

    if ( !isNaN(low) ) {
        parent.low = low;
    }
    if ( !isNaN(high) ) {
        parent.high = high;
    }

    clearErrors();
    if ( emptyErrorCheck(selector, HTML.form.parent.selector, "No CSS selector selected")) {
        return;
    }

    HTML.info.range.textContent = setRangeString(low, high);

    Collect.parent = parent;
    HTML.info.parent.textContent = selector;
    addParentGroup(selector, parent.low, parent.high);

    Collect.group.pages[Collect.current.page].sets[Collect.current.ruleSet].parent = parent;
    saveGroup();

    showRuleForm();
    refreshElements();
}

function saveNextEvent(event){
    event.preventDefault();
    var selector = HTML.form.next.selector.textContent,
        match = document.querySelector(selector),
        page = Collect.group.pages[Collect.current.page];

    clearErrors();

    if ( page.name !== "default" ) {
        alertMessage("Cannot add next selector to '" + page.name + "' page, only to default");
        return;
    }

    if ( emptyErrorCheck(selector, HTML.form.next.selector, "No CSS selector selected") || 
        errorCheck(!match.hasAttribute("href"), HTML.form.next.selector, "selector must select element with href attribute") ) {
        return;
    }

    HTML.info.next.textContent = selector;

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

function toggleParentEvent(event){
    deleteEditing();
    // can only be setting parent or next at once, so if setting next, return
    if ( Interface.activeForm === "next" ) {
        // revert checked
        this.checked = !this.checked;
        alertMessage("cannot set parent while setting next selector");
        return;
    }
    if ( this.checked ) {
        // if parent selector doesn't exist, switch to parent form
        showParentForm();
        showTab(HTML.tabs.rule);
    } else {
        // if parent selector exists, remove it from current ruleSet
        Collect.parent = {};
        HTML.info.parent.textContent = "";
        HTML.info.range.textContent = "";
        Collect.group.pages[Collect.current.page].sets[Collect.current.ruleSet].parent = undefined;
        saveGroup();
        clearClass("parentGroup");
        showRuleForm();
        Interface.turnOn();
    }
}

function toggleNextEvent(event){
    deleteEditing();
    // can only be setting parent or next at once, so if setting parent, return
    if ( Interface.activeForm === "parent" ) {
        // revert checked
        this.checked = !this.checked;
        alertMessage("cannot set next while setting parent selector");
        return;
    }
    if ( this.checked ) {
        showNextForm();
        showTab(HTML.tabs.rule);
        // remove parent selector limitation 
        clearClass("parentGroup");
    } else {
        delete Collect.next;
        HTML.info.next.textContent = "";
        Collect.group.pages[Collect.current.page].removeNext();
        saveGroup();
        showRuleForm();
        Interface.turnOn();
    }
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
    HTML.form.edit.name.value = this.name;
    HTML.form.edit.selector.textContent = this.selector;
    HTML.form.edit.capture.textContent = this.capture;
    if ( this.follow ) {
        HTML.form.edit.follow.checked = this.follow;
        HTML.form.edit.follow.disabled = false;
        HTML.form.edit.followHolder.style.display = "block";
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
    // also need to remove rule from RuleSet
    if ( this.follow ) {
        var pageOption = HTML.groups.page.querySelector("option[value=" + this.name + "]");
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

/*
if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
*/
function markCapture(){
    var capture = HTML.form.rule.capture.textContent,
        selector;
    if ( capture !== "") {
        selector = ".capture[data-capture='" + capture + "']";
        document.querySelector(selector).classList.add("selected");
    }
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
function addRule(rule, ruleSet){
    var ruleObject = new Rule(
        rule.name,
        rule.selector,
        rule.capture,
        rule.multiple || false,
        rule.follow || false,
        Collect.parent.selector
    );

    ruleSet.addRule(ruleObject,
        [selectorViewRule, unselectorViewRule, editSavedRule, previewSavedRule, deleteRuleEvent]);
}

/*
add .parentGroup to all elements matching parent selector and in range
*/
function addParentGroup(selector, low,  high){
    var elements = Collect.all(selector),
        end = elements.length + high;
    low = low || 0;
    high = high || 0;
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
    if ( Interface.activeForm === "next" ) {
        allElements = Array.prototype.slice.call(Collect.all(selector));
    } else if ( low !== 0 || high !== 0 ) {
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
    HTML.form.rule.form.style.display = "inline-block";
    HTML.form.parent.form.style.display = "none";
    HTML.form.next.form.style.display = "none";
    HTML.form.edit.form.style.display = "none";
    HTML.cycle.style.display = "block";
}

function showEditForm(){
    Interface.activeForm = "edit";
    HTML.form.edit.form.style.display = "inline-block";
    HTML.form.rule.form.style.display = "none";
    HTML.form.parent.form.style.display = "none";
    HTML.form.next.form.style.display = "none";
    HTML.cycle.style.display = "block";   
}

function showParentForm(){
    Interface.activeForm = "parent";
    HTML.form.parent.form.style.display = "inline-block";
    HTML.form.rule.form.style.display = "none";
    HTML.form.next.form.style.display = "none";
    HTML.form.edit.form.style.display = "none";
    HTML.cycle.style.display = "block";
}

function showNextForm(){
    Interface.activeForm = "next";
    HTML.form.next.form.style.display = "inline-block";
    HTML.form.parent.form.style.display = "none";
    HTML.form.rule.form.style.display = "none";
    HTML.form.edit.form.style.display = "none";
    HTML.cycle.style.display = "none";
}

function baseCancel(){
    deleteEditing();
    resetInterface();
    showRuleForm();
}

function setCurrentIndex(){
    var positive = Collect.elementIndex,
        negative = Collect.elementIndex - Collect.matchedElements.length;
    HTML.info.cycleIndex.textContent = (positive === 0 ) ? "" : positive + " / " + negative;
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

            HTML.groups.group.appendChild(newOption("default"));

        } else {
            options(Object.keys(site.groups), HTML.groups.group);
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

        HTML.groups.group.appendChild(newOption(name));
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
            currOption = HTML.groups.group.querySelector("option:checked");
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
        var currOption = HTML.groups.page.querySelector("option:checked");
        currOption.parentElement.removeChild(currOption);
        HTML.groups.page.querySelector("option[value=default]").selected = true;
        page = Collect.group.pages["default"];
    }
    saveGroup();

    resetInterface();
    deleteEditing();
    loadPageObject(page);
}

/***********************
    RULE SET STORAGE
***********************/

function loadRuleSet(ele){
    var option = ele.querySelector("option:checked"),
        name = option.value;
    Collect.current.ruleSet = name;

    deleteEditing();
    resetInterface();
    loadRuleSetObject(Collect.group.pages[Collect.current.page].sets[name]);
}

function createRuleSet(){
    var name = prompt("Group Name");
    if ( name === null ) {
        return;
    }
    else if ( name === "" ) {
        alertMessage("rule set name cannot be blank");
        return;
    }
    
    if ( !Collect.group.uniqueRuleSetName(name) ) {
        alertMessage("a rule set named \"" + name + "\" already exists");
        return;
    }
    
    HTML.groups.ruleSet.appendChild(newOption(name));
    var page = Collect.group.pages[Collect.current.page],
        ruleSet = new RuleSet(name);
    page.addSet(ruleSet);
    saveGroup();

    deleteEditing();
    loadRuleSetObject(ruleSet);
}

function deleteRuleSet(){
    var defaultRuleSet = (Collect.current.ruleSet === "default"),
        confirmed;
    if ( defaultRuleSet ) {
        confirmed = confirm("Cannot delete \"default\" rule set. Do you want to clear out all of its rules instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this rule set and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }

    var page = Collect.group.pages[Collect.current.page],
        ruleSet;
    page.removeSet(Collect.current.ruleSet);

    // handle setting new current RuleSet
    if ( defaultRuleSet ) {
        ruleSet = new RuleSet("default");
        page.addSet(ruleSet);
    } else {
        var currOption = HTML.groups.ruleSet.querySelector("option:checked");
        currOption.parentElement.removeChild(currOption);
        Collect.current.ruleSet = "default";
        ruleSet = page.sets["default"];
        HTML.groups.ruleSet.querySelector("option[value=default]").selected = true;
    }

    saveGroup();
    deleteEditing();    
    loadRuleSetObject(ruleSet);
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
        sets: {"default": newRuleSet("default")}
    };
}

// creates an empty ruleSet object
function newRuleSet(name){
    return {
        name: name,
        rules: {}
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
given JSON representing a group, create that Group's object and all associated Page/RuleSet/Rule objects
also setup relevant HTML data associated with the Group
*/
function loadGroupObject(group){
    HTML.groups.group.querySelector("option[value=" + group.name + "]").selected = true;

    var url = window.location.href;
    HTML.info.indexToggle.checked = group.urls[url] !== undefined;

    // clear out current options and populate with current group's pages
    HTML.groups.page.innerHTML = "";
    options(Object.keys(group.pages), HTML.groups.page);
    var groupObject,
        page, pageObject, pageName,
        ruleSet, ruleSetObject, ruleSetName,
        rule, ruleObject, ruleName;

    groupObject = new Group(group.name, group.urls);
    // clear out previous group
    HTML.groups.groupHolder.innerHTML = "";
    HTML.groups.groupHolder.appendChild(groupObject.html());
    Collect.group = groupObject;
    Collect.current.group = group.name;
    
    for ( pageName in group.pages ) {
        page = group.pages[pageName];
        pageObject = new Page(page.name, page.index, page.next);
        groupObject.addPage(pageObject);
        for ( ruleSetName in page.sets ) {
            ruleSet = page.sets[ruleSetName];
            ruleSetObject = new RuleSet(ruleSet.name, ruleSet.parent);
            pageObject.addSet(ruleSetObject);
            for ( ruleName in ruleSet.rules ) {
                rule = ruleSet.rules[ruleName];
                addRule(rule, ruleSetObject);
            }
        }
    }
    loadPageObject(Collect.group.pages["default"]);
}

function loadPageObject(page){
    Collect.current.page = page.name;
    if ( page.name === "default" ) {
        HTML.info.index.style.display = "inline-block";
        HTML.info.nextHolder.style.display = "inline-block";
        // handle whether or not next has already been set
        if ( page.next ) {
            Collect.next = page.next;
            HTML.info.nextCheckbox.checked = true;
            HTML.info.next.textContent = page.next;
        } else {
            delete Collect.next;
            HTML.info.nextCheckbox.checked = false;
            HTML.info.next.textContent = "";
        }
    } else {
        HTML.info.index.style.display = "none";
        HTML.info.nextHolder.style.display = "none";
    }

    options(Object.keys(page.sets), HTML.groups.ruleSet);

    loadRuleSetObject(page.sets["default"]);
}

function loadRuleSetObject(ruleSet){
    Collect.parent = ruleSet.parent || {};
    Collect.current.ruleSet = ruleSet.name;

    if ( ruleSet.parent ) {
        HTML.info.parent.textContent = ruleSet.parent.selector;
        HTML.info.parentCheckbox.checked = true;
        addParentGroup(ruleSet.parent.selector, ruleSet.parent.low, ruleSet.parent.high);
        setRangeString(ruleSet.parent.low, ruleSet.parent.high);
    } else {
        HTML.info.parent.textContent = "";
        HTML.info.parentCheckbox.checked = false;
        HTML.info.range.textContent = "";
        clearClass("parentGroup");
    }

    // don't call these in loadGroupObject or loadPageObject because we want to know if there is a
    // parent selector
    Interface.turnOn();
    Interface.update();
}

/*
Find all of the {follow: true} rules in a page that is going to be deleted, and make a recursive
call to delete those pages as well.
*/
function deletePageFromGroup(name, pages){
    var page = pages[name],
        followedRules;
    // can't delete default page
    if ( name === "default" || !page ) {
        return;
    }

    followedRules = followRulesInPage(page);
    for ( var i=0, len=followedRules.length; i<len; i++ ) {
        pages = deletePageFromGroup(followedRules[i], pages);
    }
    delete pages[name];

    // remove select
    var option = HTML.groups.page.querySelector("option[value=" + name + "]");
    if ( option ) {
        option.parentElement.removeChild(option);
    }

    return pages;
}

// iterate over ruleSets in a page and generate an array of rules that have follow=true
function followRulesInPage(page){
    var rules = [],
        setName, ruleName, ruleSet;
    for ( setName in page.sets ) {
        ruleSet = page.sets[setName];
        for ( ruleName in ruleSet.rules ) {
            if ( ruleSet.rules[ruleName].follow ) {
                rules.push(ruleName);
            }
        }
    }
    return rules;
}

function deleteEditing(){
    delete Interface.editing;
}

/***********************
    HTML FUNCTIONS
***********************/

/*
given an element, generate the html to represent an element and its "captureable" attributes and
create the event listeners for it to work
*/
function setRuleHTML(element){
    if ( element === undefined ) {
        return;
    }
    HTML.ruleHTML.innerHTML = "";
    var clone = cleanElement(element.cloneNode(true)),
        html = clone.outerHTML,
        attrs = clone.attributes,
        curr, text, splitHTML, firstHalf, secondHalf, captureEle;
    
    for ( var i=0, len =attrs.length; i<len; i++ ) {
        curr = attrs[i];
        text = attributeText(curr);

        splitHTML = html.split(text);
        firstHalf = splitHTML[0];
        secondHalf = splitHTML[1];

        HTML.ruleHTML.appendChild(document.createTextNode(firstHalf));
        captureEle = captureAttribute(text, 'attr-'+curr.name);
        if ( captureEle) {
            HTML.ruleHTML.appendChild(captureEle);
        }
        html = secondHalf;
    }

    if ( clone.textContent !== "" ) {
        text = clone.textContent;
        splitHTML = html.split(text);
        firstHalf = splitHTML[0];
        secondHalf = splitHTML[1];

        HTML.ruleHTML.appendChild(document.createTextNode(firstHalf));
        captureEle = captureAttribute(text, 'text');
        if ( captureEle) {
            HTML.ruleHTML.appendChild(captureEle);
        }

        html = secondHalf;
    }

    // append remaining text
    HTML.ruleHTML.appendChild(document.createTextNode(html));
}

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
