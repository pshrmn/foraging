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
// Source: src/selector.js
// returns a function that takes an element and returns it's tag,
// id, and classes in css selector form
// include attribute selectors in the future?
function SelectorParts(){
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

// Source: src/attributeView.js
function AttributeView(options){
    var index = 0;
    var length = 0;
    var eles = [];

    options = options || {};
    var holder = options.holder || "body";
    var saveFn = options.save || function(){};

    // ui
    var view = d3.select(holder).append("div");

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
    // focused selector
    var current;
    function setCurrent(d){
        current = d;
        selectorText.text(d.selector);
    }

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

    var view = d3.select(holder).append("div");

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
    var edit = existing.append("button")
        .text("edit")
        .on("click", function(){
            // show the selectorView
        });

    var remove = existing.append("button")
        .text("remove");

    var addChild = existing.append("button")
        .text("add child")
        .on("click", function(){
            
            // enter editing mode
            // set the parent to be the current element


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

    function updatePage(p){

    }


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
            nodes = tree.nodes(page);
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
                    });

            node.append("text")
                .text(function(d){
                    return d.selector;
                });
        },
        getData: function(){
            return links;
        }
    };
}
// Source: src/ui.js
function buildUI(){
    var holder = document.createElement("div");
    holder.classList.add("collectjs");
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
        fns: fns
    };
}

// Source: src/collector.js
// build the ui
var ui = buildUI();
ui.addView(SchemaView, "Schema", {}, true);
ui.addView(AttributeView, "Attribute");

// load