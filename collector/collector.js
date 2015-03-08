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
        // don't include empty attrs
        if ( curr.value !== "") {
            attrMap[curr.name] = curr.value;
        }
    }
    // include text if it exists
    var text = element.textContent.trim();
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
        selector = selector || {};
        var sel = selector.selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = selector.index;
        var eles;
        for ( var i=0; i<elements.length; i++ ) {
            eles = elements[i].querySelectorAll(sel);
            if ( index !== undefined ) {
                if ( !eles[index] ) {
                    continue;
                } else {
                    matches.push(eles[index]);
                }
            } else {
                [].push.apply(matches, [].slice.call(eles));
            }
        }
        return matches;
    }

    // return the max number of children per element
    select.count = function(elements, selector){
        var max = -Infinity;
        selector = selector || {};
        var sel = selector.selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = selector.index;
        // index must specify only one element per parent
        if ( index !== undefined ) {
            return 1;
        }
        for ( var i=0; i<elements.length; i++ ) {
            var count = elements[i].querySelectorAll(sel).length;
            max = Math.max(max, count);
        }
        return max;
    };

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

    function addOption(event){
        this.classList.add(option);
    }

    function removeOption(event){
        this.classList.remove(option);
    }

    function selectOption(event){
        event.preventDefault();
        event.stopPropagation();
        var eles = [].slice.call(event.path).filter(function(ele){
            return ele.classList && ele.classList.contains("selectableElement");
        }).reverse();
        clicked(eles);
    }

    function highlight(elements){
        elements.forEach(function(ele){
            ele.addEventListener("mouseenter", addOption, false);
            ele.addEventListener("mouseleave", removeOption, false);
            ele.addEventListener("click", selectOption, false);
            ele.classList.add("selectableElement");
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

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName("selectableElement"));
        elements.forEach(function(ele){
            ele.removeEventListener("mouseenter", addOption);
            ele.removeEventListener("mouseleave", removeOption);
            ele.removeEventListener("click", selectOption);
            ele.classList.remove("selectableElement");
            ele.classList.remove("queryCheck");
            ele.classList.remove("collectHighlight");
        });
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

// given parent elements, return all child elements that match the selector
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
function cleanSchemas(schemas){
    var ns = {};
    for ( var s in schemas ) {
        ns[s] = cleanSchema(schemas[s]);
    }
    return ns;
}

// get rid of extra information before saving
function cleanSchema(schema){
    var ns = {
        name: schema.name,
        urls: schema.urls.slice(),
        pages: {}
    };

    function clonePage(s, clone){
        clone.selector = s.selector;
        clone.index = s.index;
        clone.attrs = s.attrs.slice();
        clone.children = s.children.map(function(child){
            return clonePage(child, {});
        });
        return clone;
    }

    for ( var page in schema.pages ) {
        ns.pages[page] = clonePage(schema.pages[page], {});
    }
    return ns;
}

// check if an identical selector already exists
function matchSelector(sel, parent){
    return parent.children.some(function(s){
        if ( s.selector === sel.selector && s.index === sel.index ) {
            return true;
        }
        return false;
    });
}

// get an array containing the names of all attrs in the schema
function attrNames(schema){
    var names = [];

    function findNames(selector){
        selector.attrs.forEach(function(n){
            names.push(n);
        });

        selector.children.forEach(function(child){
            findNames(child);
        });
    }

    for ( var name in schema.pages ) {
        findNames(schema.pages[name]);
    }
    return names;
}

function followedAttrs(page){
    var attrs = [];

    function findFollowedAttrs(selector){
        selector.attrs.forEach(function(attr){
            if ( attr.follow ) {
                attrs.push(attr.name);
            }
        });
        selector.children.forEach(function(child){
            findFollowedAttrs(child);
        });
    }
    findFollowedAttrs(page);
    return attrs;
}

// Source: src/controller.js
function collectorController(){
    var schemas;
    var schema;
    // a list of all attr names in the schema
    var schemaAttrs = [];
    var page;
    // track the name of the current page
    var currentPage;
    var selector;

    // sp is given an element and returns an array containing its tag
    // and if they exist, its id and any classes
    var sParts = selectorParts()
        .ignoreClasses(["collectHighlight", "queryCheck", "selectableElement"]);

    // es takes an array of elements and queries each to get their child elements
    // if no selector is provided it uses the all selector (*)
    var eSelect = elementSelector();

    // element highlighter takes an array of elements and adds event listeners
    // to give the user the ability to select an element in the page (along with
    // vanity markup to identify which element is being selected)
    var eHighlight = elementHighlighter()
        .clicked(elementChoices);

    function elementChoices(elements){
        var data = elements.map(function(ele){
            return sParts(ele);
        });
        fns.dispatch.Selector.setChoices(data);
    }

    // get all of the elements that match each selector
    // and store in object.elements
    function getMatches(selectFn){
        function match(elements, s){
            s.elements = selectFn(elements, s);
            s.children.forEach(function(child){
                match(s.elements, child);
            });      
        }

        match([document], page);
    }

    // attach an id to each node for d3
    var idCount = 0;
    function setupPage(){
        function set(s){
            s.id = idCount++;
            s.children.forEach(function(s){
                set(s);
            });
        }
        set(page);
        selector = page;
        fns.dispatch.Schema.showSelector(selector);
    }

    function clonePage(){
        function setClone(selector, clone){
            clone.selector = selector.selector;
            clone.id = selector.id;
            clone.index = selector.index;
            clone.attrs = selector.attrs.slice();
            clone.elements = selector.elements.slice();
            clone.children = selector.children.map(function(child){
                return setClone(child, {});
            });
            return clone;
        }
        return setClone(page, {});
    }

    var fns = {
        loadSchemas: function(s){
            schemas = s;
        },
        setSchema: function(schemaName, pageName){
            idCount = 0;
            schema = schemas[schemaName];

            fns.setPage(pageName);
            ui.setPages(Object.keys(schema.pages));
        },
        setPage: function(name){
            currentPage = name;
            page = schema.pages[name];
            setupPage();
            getMatches(eSelect);
            fns.dispatch.Schema.drawPage(clonePage());
            if ( name === "default" ) {
                ui.setUrl(fns.isUrl());
                ui.toggleUrl(true);
            } else {
                ui.toggleUrl(false);
            }

        },
        setSelector: function(d){
            function find(s, lid){
                if ( s.id === lid ) {
                    selector = s;
                    return true;
                }
                var found = s.children.some(function(child){
                    return find(child, lid);
                });
                return false;
            }

            find(page, d.id);
            fns.dispatch.Schema.showSelector(selector);
        },
        markup: function(selectorObject){
            clearClass("queryCheck");
            if ( selectorObject.selector !== "" ) {
                eSelect(selector.elements, {
                    selector: selectorObject.selector,
                    index: selectorObject.index
                }).forEach(function(ele){
                    ele.classList.add("queryCheck");
                });
            }
        },
        eleCount: function(selectorObject){
            return eSelect.count(selector.elements, selectorObject);
        },
        legalName: function(name){
            // default is a reserved name
            if ( name === "default" ) {
                return false;
            }
            return !schemaAttrs.some(function(attr){
                return attr === name;
            });
        },
        getSchema: function(){
            return schema;
        },
        isUrl: function(){
            var url = window.location.href;
            if ( schema ) {
                return schema.urls.some(function(curl){
                    return curl === url;
                });
            } else {
                return false;
            }
        },
        events: {
            addChild: function(){
                // switch to selector tab
                ui.showView("Selector");

                var eles = eSelect(selector.elements);
                eHighlight(eles);
                // enter editing mode
                // set the parent to be the current element
                // turn on element select mode
            },
            addAttr: function(){
                ui.showView("Attribute");

                fns.dispatch.Attribute.setElements(selector.elements);
            },
            saveSelector: function(){
                var sel = fns.dispatch.Selector.getSelector();
                // only save if schema doesn't match pre-existing one
                if ( !matchSelector(sel, selector) ) {
                    sel.id = idCount++;
                    sel.elements = eSelect(selector.elements, sel);
                    selector.children.push(sel);
                    // redraw the page
                    fns.dispatch.Schema.drawPage(clonePage());
                    selector = sel;
                    fns.dispatch.Schema.showSelector(selector);
                }

                ui.showView("Schema");
                fns.dispatch.Selector.reset();
                eHighlight.remove();
                chromeSave(schemas);
            },
            cancelSelector: function(){
                fns.dispatch.Selector.reset();
                eHighlight.remove();
                ui.showView("Schema");
            },
            saveAttr: function(){
                var attr = fns.dispatch.Attribute.getAttr();
                if ( attr === undefined ) {
                    return;
                }
                selector.attrs.push(attr);

                // if follow=true, create a new page with the name of the attr
                if ( attr.follow ) {
                    schema.pages[attr.name] = newSelector("body");
                    ui.setPages(Object.keys(schema.pages));
                }

                fns.dispatch.Schema.drawPage(clonePage());
                ui.showView("Schema");
                fns.dispatch.Attribute.reset();
                chromeSave(schemas);
            },
            cancelAttr: function(){
                fns.dispatch.Attribute.reset();
                ui.showView("Schema");
            },
            removeSelector: function(){
                var id = selector.id;
                // handle deleting root
                function find(selector, lid){
                    if ( selector.id === lid ) {
                        return true;
                    }
                    var curr;
                    for ( var i=0; i<selector.children.length; i++ ) {
                        curr = selector.children[i];
                        if ( find(curr, lid) ) {
                            // remove the child and return
                            selector.children.splice(i, 1);
                            return;
                        }
                    }
                    return false;
                }
                if ( page.id === id ) {
                    page =  newSelector("body");
                    page.elements = [document.body];
                    selector = page;
                } else {
                    find(page, id);
                    selector = page;
                }
                // redraw the page
                chromeSave(schemas);
                fns.dispatch.Schema.drawPage(clonePage());
                fns.dispatch.Schema.showSelector(selector);
            },
            removeAttr: function(d, i){
                d3.event.preventDefault();
                selector.attrs.splice(i, 1);
                chromeSave(schemas);
                fns.dispatch.Schema.drawPage(clonePage());
                fns.dispatch.Schema.showSelector(selector);
            },
            toggleUrl: function(){
                var url = window.location.href;
                var index;
                schema.urls.some(function(curl, i){
                    if ( curl === url ) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                // remove it
                if ( index !== undefined ) {
                    schema.urls.splice(index, 1);
                    ui.setUrl(false);
                } else {
                    schema.urls.push(url);
                    ui.setUrl(true);
                }
                chromeSave(schemas);
            },
            upload: function(){
                chromeUpload(schema);
            },
            loadPage: function(){
                fns.setPage(ui.getPage());
            },
            removePage: function(){
                var pagesToRemove = [];
                function findChildPages(pageName){
                    var currPage = schema.pages[pageName];
                    if ( currPage ) {
                        pagesToRemove.push(pageName);
                        pagesToRemove = pagesToRemove.concat(followedAttrs(currPage));                       
                    }
                }
                function removeAttr(selector, name){
                    var found = selector.attrs.some(function(attr, index){
                        if ( attr.name === name ) {
                            selector.attrs.splice(index, 1);
                            return true;
                        }
                        return false;
                    });
                    if ( !found ) {
                        found = selector.children.some(function(child){
                            return removeAttr(child, name);
                        });
                    }
                    return found;
                }
                if ( currentPage === "default" ) {
                    // only have the new page
                    schema.pages = {
                        "default": newSelector("body")
                    };
                } else {
                    // recursively remove child pages
                    findChildPages(currentPage);
                    pagesToRemove.forEach(function(name){
                        delete schema.pages[name];
                    });

                    // iterate over still existing pages and remove the attribute
                    // from the rule with the currentPage name?
                    var found = false;
                    for ( var key in schema.pages ) {
                        if ( removeAttr(schema.pages[key], currentPage) ) {
                            break;
                        }
                    }
                }


                chromeSave(schemas);
                ui.setPages(Object.keys(schema.pages));
                // revert to the default page after removing a page
                fns.setPage("default");
            }
        },
        // used to interact with views
        dispatch: {},
    };

    return fns;
}
// Source: src/topbar.js
function topbar(options){
    options = options || {};
    var holder = options.holder || "body";

    var bar = d3.select(holder);

    var pageSelect = bar.append("select")
        .on("change", controller.events.loadPage);

    bar.append("button")
        .text("remove page")
        .on("click", controller.events.removePage);

    bar.append("button")
        .text("upload")
        .on("click", controller.events.upload);

    var toggleUrl = bar.append("button")
        .text(function(){
            return "add url";
        })
        .classed({
            "on": false
        })
        .on("click", controller.events.toggleUrl);

    return {
        setUrl: function(on){
            if ( on ) {
                toggleUrl
                    .text("remove url")
                    .classed("on", true);
            } else {
                toggleUrl
                    .text("add url")
                    .classed("on", false);
            }
        },
        toggleUrl: function(on){
            toggleUrl.classed("hidden", !on);
        },
        setPages: function(names){
            var pages = pageSelect.selectAll("option")
                .data(names);

            pages.enter().append("option");
            pages
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;});
            pages.exit().remove();

        },
        getPage: function(){
            return pageSelect.property("value");
        }
    };
}
// Source: src/chrome.js
/* functions that are related to the extension */

// takes an object to save, the name of the site, and an optional schemaName
// if schemaName is provided, obj is a schema object to be saved
// otherwise obj is a site object
function chromeSave(schemas){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        var host = window.location.hostname;
        storage.sites[host] = cleanSchemas(schemas);
        chrome.storage.local.set({"sites": storage.sites});
    });
}

// takes a data object to be uploaded and passes it to the background page to handle
function chromeUpload(schema){
    var data = cleanSchema(schema);
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
        var host = window.location.hostname;
        var siteObject = storage.sites[host];
        var schemas = siteObject ?
            siteObject :
            {
                default: newSchema("default")
            };
        controller.loadSchemas(schemas);
        controller.setSchema("default", "default");
        // save right away (for new schemas, maybe unncessary)
        chromeSave(schemas);
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

// Source: src/attributeView.js
function AttributeView(options){
    var index = 0;
    var eles = [];
    var length = 0;

    options = options || {};
    var holder = options.holder || "body";
    var saveFn = options.save || function(){};

    // ui
    var view = d3.select(holder);

    // form
    var form = view.append("div")
        .classed({"form": true});

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
            .attr("name", "attr");

    var followInput = form.append("p")
        .append("label")
        .text("Follow: ")
        .append("input")
            .attr("type", "checkbox")
            .attr("name", "follow")
            .property("disabled", true);

    var saveButton = form.append("button")
        .text("Save")
        .on("click", controller.events.saveAttr);

    var cancelButton = form.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelAttr);

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
            return index;
        });

    var next = buttons.append("button")
        .text(">>")
        .on("click", showNext);

    var attrs;
    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return index;
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

        attrs = attributeHolder.selectAll("div")
            .data(attrData);

        attrs.enter().append("div")
            .on("click", function(d){
                attrInput.property("value", d.name);
                followInput.property("disabled", function(){
                    return d.name !== "href";
                });
            });

        attrs.text(function(d){
            return d.name + ": " + abbreviate(d.value, 51);
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
        getAttr: function(){
            var attr = attrInput.property("value");
            var name = nameInput.property("value");
            var follow = followInput.property("checked") && attr === "href";
            if ( name === "" || !controller.legalName(name)){
                return;
            }

            return {
                name: name,
                attr: attr,
                follow: follow
            };
        },
        reset: function(){
            eles = undefined;
            index = 0;
            indexText.text("");
            attrs.remove();
            attrInput.property("value", "");
            nameInput.property("value", "");
            followInput.property("disabled", true);
            followInput.property("checked", false);
        }
    };
}

// Source: src/schemaView.js
function SchemaView(options){
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

    var form = view.append("div")
        .classed({
            "form": true,
            "hidden": true
        });

    var selectorText = form.append("p")
        .text("Selector: ")
        .append("span");

    var buttonHolder = form.append("div");

    var remove = buttonHolder.append("button")
        .text("remove")
        .on("click", controller.events.removeSelector);

    var addChild = buttonHolder.append("button")
        .text("add child")
        .on("click", controller.events.addChild);

    var addAttr = buttonHolder.append("button")
        .text("add attr")
        .on("click", controller.events.addAttr);

    var selectorAttrs = form.append("ul");
    var attrs;

    // tree
    var svg = view.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var tree = d3.layout.tree()
        .size([width, height]);
    var diagonal = d3.svg.diagonal();
    var link;
    var node;
    /**********
      END UI
    **********/

    return {
        drawPage: function(page){
            if ( !page ) {
                return;
            }

            if ( link ) {
                link.remove();
            }
            if ( node ) {
                node.remove();
            }

            var nodes = tree.nodes(page);
            var links = tree.links(nodes);
            link = svg.selectAll(".link")
                .data(links, function(d) { return d.source.id + "-" + d.target.id; });
            node = svg.selectAll(".node")
                .data(nodes, function(d) { return d.id; });

                
            link.enter().append("path")
                .attr("class", "link");

            link.attr("d", diagonal);
            link.exit().remove();

            node.enter().append("g")
                .classed({
                    "node": true,
                    "hasAttrs": function(d){
                        return d.attrs && d.attrs.length > 0;
                    }
                })
                .on("click", function(d){
                    controller.setSelector(d);
                })
                .on("mouseenter", function(d){
                    d.elements.forEach(function(ele){
                        ele.classList.add("savedPreview");
                    });
                })
                .on("mouseleave", function(d){
                    d.elements.forEach(function(ele){
                        ele.classList.remove("savedPreview");
                    });
                });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.append("text")                
                .text(function(d){
                    return d.selector + (d.index !== undefined ? " (" + d.index + ")" : "");
                });

            node.insert("rect", ":last-child")
                .each(function(){
                    // use the bounding box of the parent to set the rect's values
                    var box = this.parentElement.getBBox();
                    this.setAttribute("height", box.height);
                    this.setAttribute("width", box.width);
                    this.setAttribute("x", box.x);
                    this.setAttribute("y", box.y);
                });

            node.exit().remove();
        },
        showSelector: function(selector){
            form.classed("hidden", false);
            selectorText.text(selector.selector + (selector.index !== undefined ? " (" + selector.index + ")" : ""));
            attrs = selectorAttrs.selectAll("li.attr")
                .data(selector.attrs);
            attrs.enter().append("li")
                .classed({
                    "attr": true
                });
            attrs.text(function(d){
                    return d.name + ": " + d.attr;
                });
            attrs.append("button")
                .text("remove")
                .on("click", controller.events.removeAttr);
            attrs.exit().remove();
        },
        hideSelector: function(){
            form.classed("hidden", true);
        }
    };
}
// Source: src/selectorView.js
function SelectorView(options){

    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);


    var elementChoices = view.append("div");
    var choices;

    var form = view.append("div")
        .classed({
            "form": true,
            "hidden": true
        });

    var tags = form.append("div");
    var parts;
    var selectElement = form.append("select")
        .classed({"hidden": true});

    var saveSelector = form.append("button")
        .text("Save")
        .on("click", controller.events.saveSelector);


    var cancelSelector = view.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelSelector);

    function markup(selector, index){
        index = parseInt(index);
        index = !isNaN(index) ? index : undefined;
        controller.markup({
            selector: selector,
            index: index
        });
    }

    var fns = {
        setChoices: function(data){
            if ( choices ) {
                choices.remove();
            }
            choices = elementChoices.selectAll("div.choice")
                .data(data);
            choices.enter().append("div")
                .classed({
                    "choice": true
                })
                .text(function(d){
                    return d.join("");
                })
                .on("click", function(d){
                    fns.addTags(d);
                    elementChoices.classed("hidden", true);
                    form.classed("hidden", false);
                });
            choices.exit().remove();
        },
        addTags: function(data){
            // initialize with full selector
            var fullSelector = data.join("");
            markup(fullSelector);
            parts = tags.selectAll("p.tag")
                .data(data);
            parts.enter().append("p")
                .classed({
                    "tag": true,
                    "on": true
                })
                .on("click", function(){
                    this.classList.toggle("on");
                    var tags = [];
                    parts.each(function(d){
                        if ( this.classList.contains("on") ) {
                            tags.push(d);
                        }
                    });
                    markup(tags.join(""), selectElement.property("value"));
                });
            var maxChildren = controller.eleCount({
                selector: fullSelector,
                index: undefined
            });
            var childCounts = ['-'].concat(d3.range(maxChildren));
            selectElement.classed("hidden", false);
            selectElement.on("change", function(){
                var tags = [];
                parts.each(function(d){
                    if ( this.classList.contains("on") ) {
                        tags.push(d);
                    }
                });
                markup(tags.join(""), selectElement.property("value"));
            });
            var eles = selectElement.selectAll("option");
            eles.remove();
            eles.data(childCounts)
                .enter().append("option")
                    .text(function(d){ return d;})
                    .attr("value", function(d){ return d;});

            ui.noSelect();
            parts.text(function(d){ return d; });
            parts.exit().remove();

            return parts;
        },
        getSelector: function(){
            var sel = [];
            parts.each(function(d){
                if ( this.classList.contains("on") ) {
                    sel.push(d);
                }
            });
            var index = parseInt(selectElement.property("value"));
            index = !isNaN(index) ? index : undefined;
            // no index for now
            return newSelector(sel.join(""), index);
        },
        reset: function(){
            tags.selectAll("*").remove();
            if ( choices ) {
                choices.remove();
            }
            form.classed("hidden", true);
            elementChoices.classed("hidden", false);
            selectElement.classed("hidden", true);
            selectElement.selectAll("option").remove();
        }
    };

    return fns;
}

// Source: src/ui.js
function buildUI(controller){
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

    var topbarFns = topbar({
        holder: "#schemaInfo"
    });

    var tabs = {};
    var views = {};

    controller.dispatch = {};

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
            controller.dispatch[name] = viewFn(options);
        },
        showView: showView,
        setUrl: topbarFns.setUrl,
        toggleUrl: topbarFns.toggleUrl,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };
}

// Source: src/collector.js
var controller = collectorController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [SchemaView, "Schema", {
        height: 200
    }, true],
    [SelectorView, "Selector"],
    [AttributeView, "Attribute"]
]);

chromeLoad();
