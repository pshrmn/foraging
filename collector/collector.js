'use strict';
// Source: src/attributes.js
// return an object mapping attribute names to their value
// for all attributes of an element
function attributes(element) {
    var attrMap = {};
    var attrs = element.attributes;
    var curr;
    for ( var i=0; i<attrs.length; i++ ) {
        curr = attrs[i];
        attrMap[curr.name] = curr.value;
    }
    // include text if it exists
    var text = element.textContent;
    if ( text !== "" ) {
        attrMap.text = text;
    }
    return attrMap;
}

function abbreviate(text, max) {
    if ( text.length <= max ) {
        return text;
    } else if ( max <= 3 ) {
        return "...";
    }
    // determine the length of the first and second halves of the text
    var firstHalf;
    var secondHalf;
    var leftovers = max-3;
    var half = leftovers/2;
    if ( leftovers % 2 === 0 ) {
        firstHalf = half;
        secondHalf = half;
    } else {
        firstHalf = Math.ceil(half);
        secondHalf = Math.floor(half);
    }

    // splice correct amounts of text
    var firstText = text.slice(0, firstHalf);
    var secondText = ( secondHalf === 0 ) ? "" : text.slice(-secondHalf);
    return firstText + "..." + secondText;
}

// Source: src/objects.js
function newSelector(selector, index){
    return {
        selector: selector,
        children: [],
        attrs: [],
        index: index
    };
}

function newAttr(name, attr){
    return {
        name: name,
        attr: attr
    };
}

function newSchema(name){
    return {
        name: name,
        urls: [],
        pages: {
            default: newSelector("body")
        }
    };
}

// Source: src/selector.js
// returns a function that takes an element and returns it's tag,
// id, and classes in css selector form
// include attribute selectors in the future?
function selectorParts(){
    var skipTags = [];
    var skipClasses = [];

    function tagAllowed(tag){
        return !skipTags.some(function(st){
            return st === tag;
        });
    }

    function classAllowed(c){
        return !skipClasses.some(function(sc){
            return sc === c;
        });
    }

    function parts(element){
        var pieces = [];
        var tag = element.tagName.toLowerCase();
        if ( tagAllowed(tag) ) {
            pieces.push(tag);
        } else {
            return;
        }

        if ( element.id !== "" ) {
            pieces.push("#" + element.id);
        }

        // classes
        var c;
        for ( var i=0; i<element.classList.length; i++ ) {
            c = element.classList.item(i);
            if ( classAllowed(c) ) {
                pieces.push ("." + c);
            }
        }
        return pieces;
    }

    // set the element tags to be ignored
    // returns new function
    parts.ignoreTags = function(tags){
        if ( !arguments.length ) { return skipTags; }
        skipTags = tags;
        return parts;
    };

    // set the element classes to be ignored
    // returns new function
    parts.ignoreClasses = function(classes){
        if ( !arguments.length ) { return skipClasses; }
        skipClasses = classes;
        return parts;
    };

    return parts;
}

function elementSelector(){
    var not = ".noSelect";

    function select(elements, selector){
        var matches = [];
        selector = selector || "*";
        for ( var i=0; i<elements.length; i++ ) {
            [].push.apply(matches, [].slice.call(
                elements[i].querySelectorAll(selector + ":not(" + not + ")"))
            );
        }
        return matches;
    }

    // set a new avoid selector
    select.not = function(avoid){
        if ( !arguments.length ) { return not; }
        not = avoid;
        return select;
    };

    return select;
}

function elementHighlighter(){
    var option = "collectHighlight";
    var clicked = function(){};

    function highlight(elements){
        elements.forEach(function(ele){
            ele.addEventListener("mouseenter", function(event){
                ele.classList.add(option);
            }, false);
            ele.addEventListener("mouseleave", function(event){
                ele.classList.remove(option);
            }, false);
            ele.addEventListener("click", function(event){
                event.preventDefault();
                event.stopPropagation();
                clicked(this);
            }, false);
        });
    }

    highlight.clicked = function(callback){
        clicked = callback;
        return highlight;
    };

    highlight.option = function(css){
        option = css;
        return highlight;
    };

    return highlight;
}

function queryPath(parts){
    var currentElements = [document];
    for ( var i=0; i<parts.length; i++ ) {
        currentElements = getCurrentSelector(currentElements, parts[i]);
        if ( currentElements.length === 0 ) {
            return [];
        }
    }
    return currentElements;
}

function getCurrentSelector(eles, selector){
    var s = selector.selector;
    var i = selector.index;
    var newElements = [];
    [].slice.call(eles).forEach(function(element){
        var matches = [].slice.call(element.querySelectorAll(s));
        if ( i !== undefined ) {
            // skip if the index doesn't exist
            if ( matches[i] === undefined ) {
                return;
            }
            matches = [matches[i]];
        }
        [].push.apply(newElements, matches);
    });
    return newElements;
}
// Source: src/schema.js
// return an array of selectors from the root to the node with id
function selectorPath(page, id){
    var path = [];
    function find(selector, id){
        path.push(selector);
        if ( selector.id === id ) {
            return true;
        }
        selector.children.forEach(function(s){
            if ( find(s, id) ) {
                return true;
            }
        });
        path.pop();
    }
    var found = find(page, id);
    return path;
}

// global
var idCount = 0;
function generateIds(schemas){
    function set(selector){
        selector.id = idCount++;
        selector.children.forEach(function(s){
            set(s);
        });
    }
    var curr;
    for ( var name in schemas ) {
        curr = schemas[name];
        for ( var page in curr.pages ) {
            set(curr.pages[page]);
        }
    }
    return schemas;
}

// get rid of extra information before saving
function cleanSchema(schema){
    console.log(schema);
    var goodKeys = ["selector", "index", "children", "attrs"];

    function goodKey(key){
        return goodKeys.some(function(gk){
            return gk === key;
        });
    }

    function clean(selector){
        for ( var key in selector ) {
            if ( !goodKey(key) ) {
                delete selector[key];
            }
        }
        selector.children.forEach(function(s){
            clean(s);
        });
    }
    for ( var page in schema.pages ) {
        clean(schema.pages[page]);
    }
    return schema;
}

/*
function editSelector(page, oldSel, newSel){
    // depth first search
    function find(selector, name){
        if ( selector.selector === name ) {
            selector.selector = newSel;
            return true;
        }
        selector.children.forEach(function(s){
            if ( find(s, name) ) {
                return true;
            }
        });
        return false;
    }

    var found = find(page, oldSel);
    if ( !found ) {
        // handle case when selector is not found
    }
    return page;
}

function editAttr(page, oldName, newAttr){
    // depth first search
    function find(selector, name){
        selector.attrs.forEach(function(attr){
            if ( attr.name === name) {
                attr = newAttr;
                return true;
            }
        });
        selector.children.forEach(function(s){
            if ( find(s, name) ) {
                return true;
            }
        });
    }

    var found = find(page, oldName);
    if ( !found ) {
        // handle case when selector is not found
    }
    return page;
}
*/


// Source: src/chrome.js
/* functions that are related to the extension */

// takes an object to save, the name of the site, and an optional schemaName
// if schemaName is provided, obj is a schema object to be saved
// otherwise obj is a site object
function chromeSave(schemas, host){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        storage.sites[host] = schemas;
        chrome.storage.local.set({"sites": storage.sites});
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
function chromeLoad(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            siteObject = storage.sites[host];
        SiteSchemas = siteObject ?
            siteObject :
            {
                default: newSchema("default")
            };
        SiteSchemas = generateIds(SiteSchemas);
        CurrentSite = "default";
        ui.loadSchema(SiteSchemas.default, "default");
        chromeSave(SiteSchemas, host);
    });
}

/***********************
    OPTIONS STORAGE
***********************/
/*
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
*/
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


// Source: src/attributeView.js
function AttributeView(options){
    var index = 0;
    var length = 0;
    var eles = [];

    options = options || {};
    var holder = options.holder || "body";
    var saveFn = options.save || function(){};

    // ui
    var view = d3.select(holder);

    // form
    var form = view.append("div")
        .classed({"form": true})
        .append("form")
            .on("submit", function(){
                d3.event.preventDefault();
                saveFn({
                    name: nameInput.property("value"),
                    attr: attrInput.property("value")
                });
            });

    var nameInput = form.append("p")
        .append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    var attrInput = form.append("p")
        .append("label")
        .text("Attr:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    form.append("button")
        .text("Save Attr");

    // attribute display
    var display = view.append("div")
        .classed({"display": true});

    var attributeHolder = display.append("div")
        .classed({"attributes": true});

    var buttons = display.append("div");
    var previous = buttons.append("button")
        .text("<<")
        .on("click", showPrevious);

    var indexText = buttons.append("span")
        .text(function(){
            return index + "/" + length;
        });

    var next = buttons.append("button")
        .text(">>")
        .on("click", showNext);

    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return index + "/" + (index - length);
        });

        var element = eles[index];
        var attrMap = attributes(element);
        var attrData = [];
        for ( var key in attrMap ) {
            attrData.push({
                name: key,
                value: attrMap[key]
            });
        }

        var attrs = attributeHolder.selectAll("div")
            .data(attrData);

        attrs.enter().append("div")
            .on("click", function(d){
                attrInput.attr("value", d.name);
            });

        attrs.text(function(d){
            // using 11 as an arbitrary number right now
            return d.name + "=" + abbreviate(d.value, 11);
        });

        attrs.exit().remove();
    }

    function showNext(){
        index++;
        if ( index >= length ) {
            index = 0;
        }
        displayElement();
    }

    function showPrevious(){
        index--;
        if ( index < 0 ) {
            index = length-1;
        }
        displayElement();
    }
    return {
        setElements: function(elements){
            eles = elements;
            index = 0;
            length = elements.length;
            displayElement();
        },
    };
}

// Source: src/schemaView.js
function SchemaView(options){
    var schema;    
    var page;
    var nodes;
    var links;
    var currentPath;
    var currentElements;
    // focused selector
    var current;
    function setCurrent(d){
        current = d;
        selectorText.text(d.selector);
    }

    var es = elementSelector();

    var currentParts;
    var eh = elementHighlighter()
        .clicked(function(element){
            var tagData = sp(element);
            queryCheckMarkup(tagData.join(""));
            currentParts = tags.selectAll("p.tag")
                .data(tagData);
            currentParts.enter().append("p")
                .classed({
                    "tag": true,
                    "on": true
                })
                .on("click", function(){
                    this.classList.toggle("on");
                    var tags = [];
                    currentParts.each(function(d){
                        if ( this.classList.contains("on") ) {
                            tags.push(d);
                        }
                    });
                    queryCheckMarkup(tags.join(""));
                });
            ui.noSelect();
            currentParts.text(function(d){ return d; });
            currentParts.exit().remove();
        });

    function queryCheckMarkup(selector){
        clearClass("queryCheck");
        if ( selector !== "" ) {
            es(currentElements, selector).forEach(function(ele){
                ele.classList.add("queryCheck");
            });
        }
    }

    var sp = selectorParts()
        .ignoreClasses(["collectHighlight", "queryCheck"]);


    /**********
        UI
    **********/
    options = options || {};
    var holder = options.holder || document.body;
    var width = options.width || 600;
    var height = options.height || 300;
    var margin = options.margin || {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
    };

    var view = d3.select(holder);

    // existing selector form
    var info = view.append("div")
        .classed({
            "info": true
        });

    var existing = info.append("div")
        .classed({
            "form": true
        });
    var selectorText = existing.append("p")
        .text("Selector: ")
        .append("span");
    /*
    var edit = existing.append("button")
        .text("edit")
        .on("click", function(){
            // show the selectorView
        });
    */

    var remove = existing.append("button")
        .text("remove");

    var addChild = existing.append("button")
        .text("add child")
        .on("click", function(){
            var eles = es(currentElements);
            eh(eles);
            // enter editing mode
            // set the parent to be the current element
            // turn on element select mode

            // show the create/edit form
            newSelector.classed({"hidden": false});
            existing.classed({"hidden": true});
        });

    var addAttr = existing.append("button")
        .text("add attr")
        .on("click", function(){
            // show the attributeView
        });

    // create/edit selector form
    var newSelector = info.append("div")
        .classed({
            "form": true,
            "hidden": true,
        });
    var tags = newSelector.append("div");
    var saveSelector = newSelector.append("button")
        .text("Save")
        .on("click", function(){
            var sel = newSelector();
        });

    var cancelSelector = newSelector.append("button")
        .text("Cancel")
        .on("click", function(){
            newSelector.classed({"hidden": true});
            existing.classed({"hidden": false});
        });


    // tree
    var svg = view.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var tree = d3.layout.tree()
        .size([width, height]);
    var diagonal = d3.svg.diagonal();
    /**********
      END UI
    **********/

    return {
        setSchema: function(s){
            schema = s;
        },
        drawPage: function(pageName){
            if ( !schema ) {
                // handle schema not being present
                return;
            }

            page = schema.pages[pageName];
            if ( !page ) {
                // handle page not being found
                return;
            }

            // lazy clone the page because the layout removes the children array
            var clone = JSON.parse(JSON.stringify(page));
            nodes = tree.nodes(clone);
            links = tree.links(nodes);

            svg.selectAll(".link")
                    .data(links)
                .enter().append("path")
                    .attr("class", "link")
                    .attr("d", diagonal);

            var node = svg.selectAll(".node")
                    .data(nodes)
                .enter().append("g")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .classed({
                        "node": true,
                        "hasAttrs": function(d){
                            return d.attrs && d.attrs.length > 0;
                        }
                    })
                    .on("click", function(d){
                        setCurrent(d);
                        currentPath = selectorPath(schema.pages[pageName], d.id);
                        currentElements = queryPath(currentPath);
                    });

            node.append("text")
                .text(function(d){
                    return d.selector;
                });
        },
        getData: function(){
            return schema;
        }
    };
}
// Source: src/ui.js
function buildUI(){
    var holder = document.createElement("div");
    holder.classList.add("collectjs");
    holder.classList.add("noSelect");
    document.body.appendChild(holder);
    holder.innerHTML = '<div class="tabHolder">' +
            '<div class="tabs">' +
            '</div>' +
        '</div>' +
        '<div class="permanent">' +
            '<div id="schemaInfo"></div>' +
            '<div id="collectAlert"></div>' +
        '</div>' +
        '<div class="views">' +
            '<div class="view" id="emptyView"></div>' +
        '</div>';

    var tabHolder = holder.querySelector(".tabs");
    var viewHolder = holder.querySelector(".views");

    var tabs = {};
    var views = {};
    var fns = {};

    var activeTab;
    var activeView;

    function showView(name){
        if ( activeTab ) {
            activeTab.classList.remove("active");
        }
        if ( activeView ) {
            activeView.classList.remove("active");
        }
        activeTab = tabs[name];
        activeView = views[name];
        activeTab.classList.add("active");
        activeView.classList.add("active");
    }

    return {
        // make sure that all elements in the collectjs have the noSelect class
        noSelect: function(){
            var all = holder.querySelectorAll("*");
            for ( var i=0; i<all.length; i++ ) {
                all[i].classList.add("noSelect");
            }
        },
        addViews: function(views){
            var fn = this.addView;
            var _this = this;
            views.forEach(function(view){
                fn.apply(_this, view);
            });
            this.noSelect();
        },
        addView: function(viewFn, name, options, active){
            options = options || {};

            // create a new tab
            var t = document.createElement("div");
            t.classList.add("tab");
            t.textContent = name;
            tabs[name] = t;
            tabHolder.appendChild(t);
            t.addEventListener("click", function(event){
                showView(name);
            });

            // create a new view
            var v = document.createElement("div");
            v.classList.add("view");
            views[name] = v;
            viewHolder.appendChild(v);

            if ( active ) {
                t.classList.add("active");
                v.classList.add("active");
                activeTab = t;
                activeView = v;
            }

            options.holder = v;
            fns[name] = viewFn(options);
        },
        // make these global for the time being, might want to lock it down?
        fns: fns,
        loadSchema: function(schema, page){
            fns.Schema.setSchema(schema);
            fns.Schema.drawPage(page);
        }
    };
}

// Source: src/collector.js
// build the ui
var ui = buildUI();
ui.addViews([
    [SchemaView, "Schema", {
        height: 200
    }, true],
    [AttributeView, "Attribute"]
]);

// load or create schema for url
var SiteSchemas;
// not sure if this will be necessary
var CurrentSite;
chromeLoad();
