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
    var rangeString = "(";
    low = parseInt(low, 10);
    high = parseInt(high, 10);
    rangeString += (low !== 0 && !isNaN(low)) ? low : "start";
    rangeString += " to ";
    rangeString += (high !== 0 && !isNaN(high)) ? high : "end";
    return rangeString + ")";
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
// this exists in a separate file for ease of use
// but has dependencies on variables in collector.js and thus is not modular

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
    this.name = name;
    this.schemas = {};

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

    // relies on the fact that default schema/page/selector set needs to exist
    this.current = {
        schema: undefined,
        page: undefined,
        set: undefined,
        selector: undefined
    };

    this.hasHTML = false;
    this.eles = {};
}

Site.prototype.html = function(){
    var schemas = noSelectElement("div"),
        schemaSelect = noSelectElement("select"); 

    this.hasHTML = true;
    this.eles = {
        schemas: schemas,
        select: schemaSelect
    };
    // automatically attach the schema select to the page since it will always be shown
    HTML.perm.schema.select.appendChild(schemaSelect);

    // create html for all schemas, but only show the default one
    for ( var key in this.schemas ) {
        this.schemas[key].html();
        // only show the default schema when first generating html
        if ( key === "default") {
            this.schemas[key].eles.holder.classList.add("active");
        }
    }

    schemaSelect.addEventListener("change", this.events.loadSchema.bind(this), false);

    return schemas;
};

Site.prototype.events = {
    loadSchema: function(event){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        this.loadSchema(name);    
        resetInterface();
    },
    createSchema: function(event){
        event.preventDefault();
        var name = prompt("Schema Name");
        // null when cancelling prompt
        if ( name === null ) {
            return;
        }
        // make sure name isn't empty string or string that can't be used in a filename
        else if ( name === "" || !legalSchemaName(name)) {
            alertMessage("\'" + name + "\' is not a valid schema name");
            return;
        }
        else if ( !this.uniqueSchemaName(name)){
            alertMessage("a schema named \"" + name + "\" already exists");
            return;
        }
        
        var schema = new Schema(name);
        this.addSchema(schema);
        this.save(name);
        this.loadSchema(name);
    }
};

/*
if name is provided, only save that schema, otherwise save all
*/
Site.prototype.save = function(schemaName){
    var _this = this;
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        var host = _this.name;
        if ( schemaName ) {
            storage.sites[host].schemas[schemaName] = _this.schemas[schemaName].object();
        } else {
            storage.sites[host] = _this.object();
        }
        chrome.storage.local.set({"sites": storage.sites});
        UI.preview.dirty = true;
    });
    resetInterface();
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
    this.schemas[schema.name] = schema;
    if ( this.hasHTML ) {
        schema.html();
        this.loadSchema(schema.name);
    }
    this.current.schema = schema;
};

Site.prototype.loadSchema = function(name){
    var schema = this.schemas[name],
        prevSchema = this.current.schema;
    // if schema doesn't exist or is the same as the current one, do nothing
    if ( !schema || (prevSchema && prevSchema.name === name) ) {
        return;
    }

    this.current.schema = schema;
    if ( this.hasHTML ) {
        // select the schema's option
        if ( schema.eles.option ) {
            schema.eles.option.selected = true;
        }
        // load in the select for the schema's pages
        HTML.perm.page.select.innerHTML = "";
        HTML.perm.page.select.appendChild(schema.eles.select);
        if ( schema.eles.holder ) {
            // only hide previous schema if it actually exists
            if ( prevSchema ) {
                prevSchema.eles.holder.classList.remove("active");
            }
            schema.eles.holder.classList.add("active");
        }
    }

    // load the default page
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
    this.name = name;
    this.urls = urls || {};
    this.pages = {};
    // create Pages
    if ( pages ) {
        var pageObj, page;
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

    this.hasHTML = false;
    this.eles = {};
    this.parentSite;
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
        nametag = noSelectElement("span"),
        //rename = noSelectElement("button"),
        pages = noSelectElement("ul"),
        option = noSelectElement("option"),
        select = noSelectElement("select"),
        indexHolder = noSelectElement("div"),
        indexText = document.createTextNode("Initial URL: "),
        indexCheckbox = noSelectElement("input");


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
    //rename.addEventListener("click", this.events.rename.bind(this), false);
    //appendChildren(holder, [nametag, rename, pages]);

    var url = window.location.href;
    indexCheckbox.setAttribute("type", "checkbox");
    indexCheckbox.addEventListener("change", this.events.toggleURL.bind(this), false);
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
    select.addEventListener("change", this.events.loadPage.bind(this), false);

    // automatically append to parent site's schema holder and schema select
    if ( this.parentSite && this.parentSite.hasHTML ) {
        this.parentSite.eles.schemas.appendChild(holder);
        this.parentSite.eles.select.appendChild(option);
    }
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

Schema.prototype.events = {
    rename: function(event){
        // do nothing for now
        event.preventDefault();
    },
    loadPage: function(evenT){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        resetInterface();
        this.loadPage(name);
    },
    toggleURL: function(event){
        var on = this.toggleURL(window.location.href),
            defaultPage = this.pages["default"];
        
        if ( !on && defaultPage.next ) {
            defaultPage.removeNext();
        }
        Collect.site.saveCurrent();
    }
};

Schema.prototype.loadPage = function(name){
    var page = this.pages[name],
        prevPage = this.parentSite.current.page;
    // if page doesn't exist or is the same as the current one, do nothing
    if ( !page || (prevPage && prevPage.name === name) ) {
        return;
    }

    if ( this.hasHTML ) {
        // select the option for the page
        if ( page.eles.option ) {
            page.eles.option.selected = true;
        }
        // show the select for the page's selector set
        HTML.perm.set.select.innerHTML = "";
        HTML.perm.set.select.appendChild(page.eles.select);
    }
    Collect.site.current.page = page;
    page.loadSet("default");
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
    var page = new Page("default");
    this.addPage(page);
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
function Page(name, sets, next){
    this.name = name,
    this.next = next;
    this.sets = {};
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
    this.hasHTML = false;
    this.eles = {};
    // added when a schema calls addPage
    this.parentSchema;
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
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        createSet = noSelectElement("button"),
        clear = noSelectElement("button"),
        sets = noSelectElement("ul"),
        option = noSelectElement("option"),
        setSelect = noSelectElement("select"),
        nextHolder = noSelectElement("div"),
        nextText = document.createTextNode("Next: "),
        nextSelector = noSelectElement("span"),
        nextRemove = noSelectElement("button");

    this.hasHTML = true;
    // elements that need to be interacted with
    this.eles = {
        holder: holder,
        nametag: nametag,
        option: option,
        sets: sets,
        select: setSelect,
        next: {
            holder: nextHolder,
            selector: nextSelector,
            remove: nextRemove
        }
    };

    // Schema tab html
    holder.classList.add("page");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Page");
    nametag.classList.add("nametag");
    createSet.textContent = "+Set";
    createSet.classList.add("pos");
    createSet.addEventListener("click", this.events.createSet.bind(this), false);
    clear.textContent = "clear";
    clear.addEventListener("click", this.events.clear.bind(this), false);

    // Next
    nextRemove.innerHTML = "&times;";
    nextRemove.addEventListener("click", this.events.removeNext.bind(this), false);
    nextHolder.classList.add("next");
    if ( this.next ) {
        nextSelector.textContent = this.next;
    } else {
        nextSelector.textContent = "";
        nextHolder.classList.add("hidden");
    }

    appendChildren(nextHolder, [nextText, nextSelector, nextRemove]);
    appendChildren(holder, [nametag, createSet, nextHolder, sets]);

    for ( var key in this.sets ) {
        this.sets[key].html();
    }



    // Page option, SelectorSet select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    setSelect.addEventListener("change", this.events.loadSet.bind(this), false);

    // automatically append to parent schema's html elements
    if ( this.parentSchema && this.parentSchema.hasHTML ) {
        this.parentSchema.eles.pages.appendChild(holder);
        this.parentSchema.eles.select.appendChild(option);
    }
};

Page.prototype.events = {
    createSet: function(event){
        event.preventDefault();
        var name = prompt("Selector Set Name");
        if ( name === null ) {
            return;
        }
        else if ( name === "" ) {
            alertMessage("selector set name cannot be blank");
            return;
        }
        
        if ( !this.parentSchema.uniqueSelectorSetName(name) ) {
            alertMessage("a selector set named \"" + name + "\" already exists");
            return;
        }
        var set = new SelectorSet(name);
        this.addSet(set);
        Collect.site.saveCurrent();
    },
    clear: function(event){
        var confirmed = confirm("Clear out all selector sets, selectors, and rules from the page?");
        if ( !confirmed ) {
            return;
        }
        this.reset();
        Collect.site.saveCurrent();
    },
    loadSet: function(event){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        resetInterface();
        this.loadSet(name);
    },
    removeNext: function(event){
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
    var set = this.sets[name],
        prevSet = Collect.site.current.set;
    // if set doesn't exist or is the same as the current one, do nothing
    // need to make sure the page's name is also different since pages can have the same selector
    // set names. Might be a bug look into this
    // !!!!!!!!!!!!!!
    if ( !set || (prevSet && prevSet.name === name && prevSet.parentPage.name === this.name) ) {
        return;
    }
    Collect.site.current.set = set;

    // show the selector set's parent if it exists
    if ( set.parent ) {
        Collect.parent = set.parent;
        addParentSchema(set.parent);
    } else {
        Collect.parent = {};
        clearClass("parentSchema");
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
        this.eles.next.holder.classList.remove("hidden");
        this.eles.next.selector.textContent = selector;
    }
};

Page.prototype.removeNext = function(){
    this.next = undefined;
    if ( this.hasHTML ) {
        this.eles.next.holder.classList.add("hidden");
        this.eles.next.selector.textContent = "";
    }
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
    this.name = name;
    this.parent = parent;
    this.selectors = {};
    var selectorObj, selector;
    for ( var key in selectors ) {
        selectorObj = selectors[key];
        selector = new Selector(selectorObj.selector, selectorObj.rules);
        selector.parentSet = this;
        this.selectors[key] = selector;
    }
    this.hasHTML = false;
    this.eles = {};
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
        nametag = noSelectElement("span"),
        remove = noSelectElement("button"),
        addSelector = noSelectElement("button"),
        parentHolder = noSelectElement("div"),
        parentText = document.createTextNode("Parent: "),
        parentSelector = noSelectElement("span"),
        parentRange = noSelectElement("span"),
        removeParent = noSelectElement("button"),
        selectors = noSelectElement("ul"),
        option = noSelectElement("option");

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        selectors: selectors,
        option: option,
        parent: {
            holder: parentHolder,
            selector: parentSelector,
            range: parentRange,
            remove: removeParent
        }
    };

    // Schema tab html        
    holder.classList.add("set");
    holder.addEventListener("click", this.events.activate.bind(this), false);
    nametag.textContent = this.name;
    nametag.classList.add("nametag");
    nametag.setAttribute("title", "Selector Set");
    addSelector.textContent = "+Selector";
    addSelector.classList.add("pos");
    addSelector.addEventListener("click", this.events.addSelector.bind(this), false);
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    remove.addEventListener("click", this.events.remove.bind(this), false);


    // Selector Set Parent
    parentHolder.classList.add("parent");
    if ( this.parent ) {
        parentSelector.textContent = this.parent.selector;
        parentRange.textContent = createRangeString(this.parent.low, this.parent.high);
    } else {
        parentHolder.classList.add("hidden");
    }
    removeParent.innerHTML = "&times;";
    removeParent.classList.add("neg");
    removeParent.addEventListener("click", this.events.removeParent.bind(this), false);

    appendChildren(parentHolder, [parentText, parentSelector, parentRange, removeParent]);
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
    activate: function(event){
        this.activate();
        this.eles.holder.scrollIntoViewIfNeeded();
    },
    addSelector: function(event){
        event.preventDefault();
        // make sure current.page is the selector set's parent page
        this.activate();
        showSelectorView();
    },
    remove: function(event){
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
    removeParent: function(event){
        event.preventDefault();
        this.removeParent();
        Collect.site.saveCurrent();

        clearClass("parentSchema");
        delete Collect.parentCount;
        Collect.parent = {};
    }
};


SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

// make the selector set the current one
SelectorSet.prototype.activate = function(){
    var page = this.parentPage;
    if ( page !== Collect.site.current.page ) {
        Collect.site.current.schema.loadPage(page.name);
    }
    if ( this !== Collect.site.current.set ) {
        Collect.site.current.page.loadSet(this.name);
    }
};

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
    if ( this.hasHTML ) {
        this.eles.parent.holder.classList.remove("hidden");
        this.eles.parent.selector.textContent = parent.selector;
        this.eles.parent.range.textContent = createRangeString(parent.low, parent.high);
    }
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
    if ( this.hasHTML ) {
        this.eles.parent.holder.classList.add("hidden");
        this.eles.parent.selector.textContent = "";
        this.eles.parent.range.textContent = "";
    }
};

SelectorSet.prototype.addSelector = function(selector){
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
    this.rules = {};
    var ruleObj, rule;
    for ( var key in rules ) {
        ruleObj = rules[key];
        rule = new Rule(ruleObj.name, ruleObj.capture, ruleObj.follow);
        rule.parentSelector = this;
        this.rules[key] = rule;
    }
    this.hasHTML = false;
    this.eles = {};
    this.parentSet;
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

Selector.prototype.addRule = function(rule){
    this.rules[rule.name] = rule;
    rule.parentSelector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Schema)
    // add a new Page to the schema with the name of the Rule
    if ( rule.follow && this.parentSet && this.parentSet.parentPage && this.parentSet.parentPage.parentSchema ) {
        // only add page if it doesn't already exist
        if ( this.parentSet.parentPage.parentSchema.uniquePageName(rule.name) ) {
            var page = new Page(rule.name);
            this.parentSet.parentPage.parentSchema.addPage(page);
        }
    }

    // if Selector html exists, also create html for rule
    if ( this.hasHTML ) {
        rule.html();
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
    var oldSelector = this.selector;
    this.selector = newSelector;
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newSelector;
    }

    if ( this.parentSet ) {
        this.parentSet.selectors[newSelector] = this;
        delete this.parentSet.selectors[oldSelector];
    }
};

Selector.prototype.html = function(){
    var holder = noSelectElement("li"),
        identifier = document.createTextNode("Selector: "),
        nametag = noSelectElement("span"),
        editSelector = noSelectElement("button"),
        newRule = noSelectElement("button"),
        remove = noSelectElement("button"),
        rules = noSelectElement("ul");

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        rules: rules
    };

    holder.classList.add("selector");
    nametag.textContent = this.selector;
    nametag.classList.add("nametag");
    newRule.textContent = "+Rule";
    newRule.classList.add("pos");
    editSelector.textContent = "edit";
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    holder.addEventListener("mouseenter", this.events.preview.bind(this), false);
    holder.addEventListener("mouseleave", this.events.unpreview.bind(this), false);
    newRule.addEventListener("click", this.events.newRule.bind(this), false);
    editSelector.addEventListener("click", this.events.edit.bind(this), false);
    remove.addEventListener("click", this.events.remove.bind(this), false);

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
    preview: function(event){
        clearClass("queryCheck");
        clearClass("collectHighlight");
        var parent, elements;
        if ( this.parentSet ) {
            parent = this.parentSet.parent;
        }
        elements = Collect.matchedElements(this.selector, parent);
        addClass("savedPreview", elements);
    },
    unpreview: function(event){
        clearClass("savedPreview");
    },
    remove: function(event){
        event.preventDefault();
        this.remove();
        Collect.site.saveCurrent();
    },
    newRule: function(event){
        event.preventDefault();
        Collect.site.current.selector = this;

        setupRuleForm(this.selector);
        showRuleView();
    },
    edit: function(event){
        event.preventDefault();
        UI.editing.selector = this;
        Family.fromSelector(this.selector);
        Family.match();

        HTML.selector.radio.parent.disabled = true;
        HTML.selector.radio.next.disabled = true;

        showSelectorView();
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
    this.hasHTML = false;
    this.eles = {};
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

Rule.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        capturetag = noSelectElement("span"),
        edit = noSelectElement("button"),
        deltog = noSelectElement("button");

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        capturetag: capturetag
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

    edit.addEventListener("click", this.events.edit.bind(this), false);
    deltog.addEventListener("click", this.events.remove.bind(this), false);
    
    // automatically append to parent selector's rule holder
    if ( this.parentSelector && this.parentSelector.hasHTML ) {
        this.parentSelector.eles.rules.appendChild(holder);
    }
};

Rule.prototype.events = {
    edit: function(event){
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
        showRuleView();
    },
    remove: function(event){
        clearClass("savedPreview");
        this.remove();
        Collect.site.saveCurrent();
    }
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName = this.name,
        newName = object.name;
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
    var oldCapture = this.capture,
        newCapture = object.capture;
    if ( oldCapture !== newCapture && this.eles.capturetag ) {
        this.eles.capturetag.textContent = "(" + newCapture + ")";
    }

    var oldFollow = this.follow,
        newFollow = object.follow || false;
    if ( oldFollow && !newFollow ) {
        // remove based on oldName in case that was also changed
        if ( Collect.site.current.schema ) {
            Collect.site.current.schema.removePage(oldName);
        }
    } else if ( newFollow && !oldFollow ) {
        // create the follow page
        var page = new Page(newName);
        Collect.site.current.schema.addPage(page);
    } else if ( oldFollow && newFollow && oldName !== newName) {
        // update the name of the follow page
        Collect.site.current.schema.pages[oldName].updateName(newName);
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
    var holder = this.eles.holder,
        option = this.eles.option;
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

        // return if element doesn't exist
        if ( !element ) {
            return;
        }

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
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemaTab\">Schema</div><div class=\"tab\" id=\"previewTab\">Preview</div><div class=\"tab\" id=\"optionsTab\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Schema: <div id=\"schemaSelect\"></div><button id=\"createSchema\" title=\"create a new schema\">+</button><button id=\"deleteSchema\" title=\"delete current schema\">&times;</button></div><div>Page: <div id=\"pageSelect\"></div></div><div>Selector Set: <div id=\"selectorSetSelect\"></div><!--<button id=\"createSelectorSet\" title=\"create a new selector set\">+</button><button id=\"deleteSelectorSet\" title=\"delete current selector set\">&times;</button>--></div><button id=\"uploadRules\">Upload Schema</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemaView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div><h3>Type:</h3><p><label for=\"selectorRadio\">Selector</label><input type=\"radio\" id=\"selectorRadio\" name=\"selector\" value=\"selector\" checked/></p><p><label for=\"parentRadio\">Parent</label><input type=\"radio\" id=\"parentRadio\" name=\"selector\" value=\"parent\" /></p><p><label for=\"nextRadio\">Next</label><input type=\"radio\" id=\"nextRadio\" name=\"selector\" value=\"next\" /></p></div><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label for=\"parentHigh\">High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"clearSelector\">Clear</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
    parent is an optional parent selector that limits selected elements to children of
        elements matching Collect.parent.selector
    if parent.high/low are defined, only use parent.selector elements within that range
    */
    matchedElements: function(selector, parent){
        var allElements = [];
        if ( UI.activeSelector === "selector" && parent ) {
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
    elements: [],
    parent: {},
    site: undefined
};

/*
Object that controls the functionality of the interface
*/
var UI = {
    activeForm: "rule",
    activeSelector: "selector",
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
    /*
    adds events listeners based on whether or not Collect.parent.elector is set
    if it is, only add them to children of that element, otherwise add them to all elements
    that don't have the noSelect class
    store elements with eventlisteners in this.elements
    */
    turnSelectorsOn: function(){
        var curr;
        this.turnSelectorsOff();
        Collect.elements = Collect.matchedElements("*", Collect.parent);

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
    create: function(event){
        event.stopPropagation();
        event.preventDefault();

        var parentSelector;
        if ( UI.activeSelector === "selector" && Collect.parent ) {
            parentSelector = Collect.parent.selector;
        }

        Family.family = new SelectorFamily(this,
            parentSelector,
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
    elements: function(){
        var selector = this.selector(),
            parent = Collect.site.current.set.parent;
        if ( selector === "") {
            return [];
        }
        return Collect.matchedElements(selector, parent);
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
    if ( Collect.parent ) {
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
    showSchemaView();
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
    //showParent();
    addParentSchema(parent);

    // attach the parent to the current set and save
    Collect.site.current.set.addParent(parent);
    Collect.site.saveCurrent();
}

function saveNext(selector){
    var match = document.querySelector(selector),
        name = Collect.site.current.page.name;

    if ( errorCheck( (name !== "default" ), HTML.selector.selector,
            ("Cannot add next selector to '" + name + "' page, only to default")) || 
        errorCheck(!match.hasAttribute("href"), HTML.selector.selector,
            "selector must select element with href attribute") ) {
        return;
    }

    Collect.site.current.page.addNext(selector);
    Collect.site.saveCurrent();
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
    UI.activeSelector = "selector";
    UI.turnSelectorsOn();
    clearSelectorClasses();
    setCurrentView(HTML.views.selector, HTML.tabs.schema);
}

function showSchemaView(){
    UI.turnSelectorsOff();
    clearSelectorClasses();
    setCurrentView(HTML.views.schema, HTML.tabs.schema);
}

function showRuleView(){
    UI.turnSelectorsOff();
    clearSelectorClasses();
    setCurrentView(HTML.views.rule, HTML.tabs.schema);
}

function showPreviewView(){
    generatePreview();
    UI.turnSelectorsOff();
    clearSelectorClasses();
    setCurrentView(HTML.views.preview, HTML.tabs.preview);
}

function showOptionsView(){
    UI.turnSelectorsOff();
    clearSelectorClasses();
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
    for ( ; low<end ; low++ ){
        elements[low].classList.add("parentSchema");
    }
}

function setupRuleForm(selector){
    HTML.rule.selector.textContent = selector;
    var parent = Collect.site.current.set.parent;
    var elements = Collect.matchedElements(selector, parent);
    UI.ruleCycle.setElements(elements);
    addClass("queryCheck", elements);
    Collect.elements = elements;
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
