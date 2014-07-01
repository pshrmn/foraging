/********************
    SELECTORFAMILY
********************/
/*
ele is the child element you want to build a selector from
parent is the most senior element you want to build a selector up to
text is the element in the interface/page that will hold the SelectorFamily's css string
*/
function SelectorFamily(ele, parent, options){
    this.parent = parent;
    this.selectors;
    this.ele = document.createElement("div");
    this.ele.classList.add("selectorFamily", "noSelect");
    this.buildFamily(ele, options || {});
}

/*
Populates the selectors array with Selectors from ele to parent (ignoring document.body)
Order is from most senior element to provided ele
*/
SelectorFamily.prototype.buildFamily = function(ele, options){
    var sel;
    // reset selectors before generating
    this.selectors = [];
    while ( ele !== null && ele.tagName !== "BODY" ) {
        // ignore element if it isn't allowed
        if ( options.noTable && !allowedElement(ele.tagName) ) {
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
};

function allowedElement(tag){
    // make sure that these are capitalized
    var illegal = ["TBODY", "CENTER"],
        allowed = true;
    for ( var i=0, len=illegal.length; i<len; i++){
        if ( tag === illegal[i] ) {
            allowed = false;
            break;
        }
    }
    return allowed;
}

SelectorFamily.prototype.removeSelector = function(index){
    this.selectors.splice(index, 1);
    // reset index values after splice
    for ( var i=0, len=this.selectors.length; i<len; i++ ) {
        this.selectors[i].index = i;
    }
    this.update();
};

/*********
SelectorFamily Interface methods
these are the only ones an outside program should need to call
*********/
/*
text is an element whose textContent will be set based on SelectorFamily.toString in update
fn is a function to be called when SelectorFamily.update is called
*/
SelectorFamily.prototype.setup = function(holder, text, fn){
    this.holder = holder;
    this.text = text;
    this.updateFunction = fn;
    // clear out holder, then attach SelectorFamily.ele
    this.holder.innerHTML = "";
    this.holder.appendChild(this.ele);
};

SelectorFamily.prototype.remove = function(){
    if ( this.holder ) {
        this.holder.innerHTML = "";    
    }
    if ( this.text ) {
        this.text.textContent = "";
    }
};

/*
called when something changes with the selectors/fragments
*/
SelectorFamily.prototype.update = function(){
    if ( this.text ) {
        this.text.textContent = this.toString();
    }
    if ( this.updateFunction ) {
        this.updateFunction();
    }
};

/*
Turn on Fragments that match
*/
SelectorFamily.prototype.match = function(selector){
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
};

SelectorFamily.prototype.toString = function(){
    var selectors = [],
        selectorString;
    for ( var i=0, len=this.selectors.length; i<len; i++ ) {
        selectorString = this.selectors[i].toString();
        if ( selectorString !== "" ) {
            selectors.push(selectorString);
        }
    }
    return selectors.join(' ');
};


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
        this.selector.family.update();
    }
};

/********************
    FRAGMENT
********************/
function Fragment(name, selector, on){
    this.selector = selector;
    this.name = name;
    this.ele = document.createElement("span");
    this.ele.classList.add("toggleable");
    this.ele.classList.add("realselector");
    this.ele.classList.add("noSelect");
    if ( !on ) {
        this.ele.classList.add("off");
    }
    this.ele.textContent = this.name;

    //Events
    this.ele.addEventListener("click", fragments.toggleOff.bind(this), false);
}

Fragment.prototype.on = fragments.on;
Fragment.prototype.turnOn = fragments.turnOn;
Fragment.prototype.turnOff = fragments.turnOff;
Fragment.prototype.matches = function(name){
    return name === this.name;
};

/********************
    NTHFRAGMENT
a fragment representing an nth-ot-type css pseudoselector
********************/
function NthFragment(selector, on){
    this.selector = selector;
    this.ele = document.createElement("span");
    this.ele.classList.add("toggleable", "noSelect");
    this.beforeText = document.createTextNode(":nth-of-type(");
    this.afterText = document.createTextNode(")");
    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.value = 1;
    this.input.classList.add("noSelect");
    this.input.classList.add("childToggle");
    this.input.setAttribute("title", "options: an+b (a & b are integers), a positive integer (1,2,3...), odd, even");

    this.ele.appendChild(this.beforeText);
    this.ele.appendChild(this.input);
    this.ele.appendChild(this.afterText);
    
    // default to
    if ( on === false ) {
        this.ele.classList.add("off");
    }

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

NthFragment.prototype.on = fragments.on;
NthFragment.prototype.turnOn = fragments.turnOn;
NthFragment.prototype.turnOff = fragments.turnOff;
NthFragment.prototype.matches = function(text){
    return this.text() === text;
};

NthFragment.prototype.text = function(){
    return this.beforeText.textContent + this.input.value + this.afterText.textContent;
};

/********************
    SELECTOR
********************/
function Selector(ele, family){
    this.family = family;
    this.tag = new Fragment(ele.tagName.toLowerCase(), this);
    this.id = ele.hasAttribute('id') ? new Fragment('#' + ele.getAttribute('id'), this) : undefined;
    this.classes = [];
    var curr;
    for ( var i=0, len=ele.classList.length; i<len; i++ ) {
        curr = ele.classList[i];
        if ( curr === "collectHighlight" || curr === "queryCheck" ) {
            continue;
        }
        this.classes.push(new Fragment('.' + curr, this));
    }
    this.setup();
}

Selector.prototype.addNthofType = function(){
    if ( this.nthoftype ) {
        return;
    }
    this.nthoftype = new NthFragment(this);
    this.ele.removeChild(this.nthtypeCreator);
    this.nthtypeCreator = undefined;
    
    var selectors = this.ele.getElementsByClassName("realselector"),
        len = selectors.length;

    var sibling = selectors[len-1].nextSibling;
    this.ele.insertBefore(this.nthoftype.ele, sibling);
};

Selector.prototype.setup = function(){
    var curr, deltog;
    this.ele = document.createElement("div");
    this.ele.classList.add("selectorGroup");
    this.ele.classList.add("noSelect");
    this.ele.appendChild(this.tag.ele);
    if ( this.id ) {
        this.ele.appendChild(this.id.ele);
    }
    for ( var i=0, len=this.classes.length; i<len; i++ ) {
        curr = this.classes[i];
        this.ele.appendChild(curr.ele);
    }

    this.nthtypeCreator = selectorSpan("+t", ["nthtype", "noSelect"], "add the nth-of-type pseudo selector"),
    this.ele.appendChild(this.nthtypeCreator);
    this.nthtypeCreator.addEventListener('click', createNthofType.bind(this), false);

    deltog = selectorSpan("x", ["deltog", "noSelect"]);
    this.ele.appendChild(deltog);
    deltog.addEventListener('click', removeSelectorGroup.bind(this), false);
};

/*
turn on (remove .off) from all toggleable parts of a selector if bool is undefined or true
turn off (add .off) to all toggleable parts if bool is false
*/
Selector.prototype.setAll = function(bool){
    if ( bool === true || bool === undefined ) {
        this.tag.ele.classList.remove("off");
        if ( this.id ) {
            this.id.ele.classList.remove("off");
        }
        for ( var i=0, len=this.classes.length; i<len; i++ ) {
            this.classes[i].ele.classList.remove("off");
        }
        if ( this.nthoftype ) {
            this.nthoftype.classList.remove("off");
        }
    } else {
        this.tag.ele.classList.add("off");
        if ( this.id ) {
            this.id.ele.classList.add("off");
        }
        for ( var j=0, classLen=this.classes.length; j<classLen; j++ ) {
            this.classes[j].ele.classList.add("off");
        }
        if ( this.nthoftype ) {
            this.nthoftype.classList.add("off");
        }
    }
};

/*
Given a selector string, return true if the Selector has attributes matching the query string
If returning true, also turn on the matching Fragments
*/
Selector.prototype.matches = function(selector){
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
};

Selector.prototype.toString = function(){
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
