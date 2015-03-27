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

// Source: src/objects.js
/*
selector is a string
a spec is an object with type and value keys
returns a new Selector object
*/
function newSelector(selector, spec){
    return {
        selector: selector,
        spec: spec,
        children: [],
        attrs: []
    };
}

function newAttr(name, attr){
    return {
        name: name,
        attr: attr
    };
}

function newPage(name){
    return {
        name: name,
        selector: "body",
        spec: {
            type: "index",
            value: 0
        },
        children: [],
        attrs: [],
        elements: [document.body]
    };
}

// Source: src/markup.js
/**
functions to add classes to elements in the page to indicate they
can be selected or match a selector
**/

function highlightElements(){
    var className = "highlighted";

    function highlight(elements){
        elements.forEach(function(e){
            e.classList.add(className);
        });
    }

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName(className));
        elements.forEach(function(e){
            e.classList.remove(className);
        });
    };

    highlight.cssClass = function(name){
        className = name;
        return highlight;
    };

    return highlight;
}

function interactiveElements(){
    var className = "highlighted";
    var hovered = "hovered";
    var clicked = function(){};
    var mouseover = function addOption(event){
        event.stopPropagation();
        this.classList.add(hovered);
    };
    var mouseout = function removeOption(event){
        this.classList.remove(hovered);
    };

    function highlight(elements){
        elements.forEach(function(e){
            e.classList.add(className);
            e.addEventListener("mouseover", mouseover, false);
            e.addEventListener("mouseout", mouseout, false);
            e.addEventListener("click", clicked, false);
        });
    }

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName(className));
        elements.forEach(function(e){
            e.classList.remove(className);
            e.classList.remove(hovered);
            e.removeEventListener("mouseover", mouseover, false);
            e.removeEventListener("mouseout", mouseout, false);
            e.removeEventListener("click", clicked, false);
        });
    };

    highlight.cssClass = function(name){
        className = name;
        return highlight;
    };

    highlight.hoverClass = function(name){
        hovered = name;
        return highlight;
    };

    highlight.clicked = function(fn){
        clicked = fn;
        return highlight;
    };

    highlight.mouseover = function(fn){
        mouseover = fn;
        return highlight;
    };

    highlight.mouseout = function(fn){
        mouseout = fn;
        return highlight;
    };

    return highlight;
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

    function select(elements, selector, spec){
        var matches = [];
        var sel = selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = spec && spec.type === "index" ? spec.value : undefined;
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
    select.count = function(elements, selector, spec){
        var max = -Infinity;
        var sel = selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = spec && spec.type === "index" ? spec.value : undefined;
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

// Source: src/page.js
function cleanPages(pages){
    var ns = {};
    for ( var p in pages ) {
        ns[p] = cleanPage(pages[p]);
    }
    return ns;
}

// get rid of extra information before saving
function cleanPage(page){
    function cleanSelector(s, clone){
        clone.selector = s.selector;
        clone.spec = s.spec;
        clone.attrs = s.attrs.slice();
        clone.children = s.children.map(function(child){
            return cleanSelector(child, {});
        });
        return clone;
    }


    var clonedPage = cleanSelector(page, {});
    clonedPage.name = page.name;
    return clonedPage;
}

// check if an identical selector already exists
function matchSelector(sel, parent){
    var selIndex = sel.spec.type === "index" ? sel.spec.value : undefined;
    return parent.children.some(function(s){
        var index = s.spec.type === "index" ? s.spec.value : undefined;
        if ( s.selector === sel.selector && index === selIndex ) {
            return true;
        }
        return false;
    });
}

// get an array containing the names of all attrs in the page
function usedNames(page){
    var names = [];

    function findNames(selector){
        if ( selector.spec.type === "name" ) {
            names.push(selector.spec.value);
        }
        selector.attrs.forEach(function(n){
            names.push(n.name);
        });

        selector.children.forEach(function(child){
            findNames(child);
        });
    }

    for ( var name in page.pages ) {
        findNames(page.pages[name]);
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
    var pages;
    var currentPage;
    // a list of all attr names in the page
    var pageAttrs = [];
    var page;
    var selector;

    var idCount = 0;
    var fns = {
        elements: elementSelector(),
        loadPages: function(ps){
            pages = ps;
            var options = Object.keys(pages);
            ui.setPages(options);
        },
        loadPage: function(pageName){
            currentPage = pageName;
            idCount = 0;
            page = pages[pageName];
            selector = page;
            ui.showView("Page");
            fns.dispatch.Page.setPage(page);
        },
        setVals: function(newPage, newSelector){
            currentPage = newPage.name;
            page = newPage;
            pages[currentPage] = page;
            selector = newSelector;
            chromeSave(pages);
        },
        addPage: function(name){
            if ( pages[name] === undefined && legalPageName(name) ) {
                pages[name] = newPage(name);
                ui.setPages(Object.keys(pages), name);
                fns.loadPage(name);
                chromeSave(pages);
            }
        },
        removePage: function(){
            delete pages[currentPage];
            //fns.setPage("default");
            ui.setPages(Object.keys(pages));
            fns.dispatch.Page.reset();
            chromeSave(pages);
            currentPage = undefined;
        },
        nextId: function(){
            return idCount++;
        },
        getSelector: function(){
            return selector;
        },
        setSelector: function(d){
            selector = d;
        },
        saveSelector: function(sel){
            selector.children.push(sel);
            selector = sel;
            ui.showView("Page");
            fns.dispatch.Page.setPage(page, selector);

            chromeSave(pages);
        },
        eleCount: function(sel, spec){
            return fns.elements.count(selector.elements, sel, spec);
        },
        legalName: function(name){
            return !usedNames(page).some(function(n){
                return n === name;
            });
        },
        getPage: function(){
            return page;
        },
        isUrl: function(){
            var url = window.location.href;
            if ( page ) {
                return page.urls.some(function(curl){
                    return curl === url;
                });
            } else {
                return false;
            }
        },
        addChild: function(){
            var eles = fns.elements(selector.elements);
            fns.dispatch.Selector.setup(eles);
            ui.showView("Selector");
        },
        addAttr: function(){
            fns.dispatch.Attribute.setElements(selector.elements);
            ui.showView("Attribute");
        },
        saveAttr: function(attr){
            selector.attrs.push(attr);
            ui.showView("Page");
            fns.dispatch.Page.setPage(page, selector);
            chromeSave(pages);
        },
        save: function(){
            chromeSave(pages);
        },
        upload: function(){
            chromeUpload({
                name: currentPage,
                site: window.location.hostname,
                page: page
            });
        },
        startSync: function(){
            // make a request for all saved pages for the domain
            chromeSync(window.location.hostname);
        },
        finishSync: function(newPages){
            for ( var key in newPages ) {
                pages[key] = newPages[key];
            }
            // refresh the ui
            if ( currentPage ) {
                fns.loadPage(currentPage);
            }
            var options = Object.keys(pages);
            ui.setPages(options, currentPage);

            chromeSave(pages);
        },
        close: function(){
            fns.dispatch.Selector.reset();
            fns.dispatch.Page.reset();
            ui.close();
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

    var events = {
        loadPage: function(){
            var pageName = fns.getPage();
            controller.loadPage(pageName);
        },
        addPage: function(){
            var name = prompt("Page name");
            controller.addPage(name.trim());
        },
        removePage: function(){
            controller.removePage();
        },
        upload: function(){
            controller.upload();
        },
        sync: function(){
            controller.startSync();
        }
    };

    var bar = d3.select(holder);

    // page
    var pageGroup = bar.append("div")
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", events.loadPage);

    pageGroup.append("button")
        .text("add page")
        .on("click", events.addPage);

    pageGroup.append("button")
        .text("remove page")
        .on("click", events.removePage);

    // global
    bar.append("button")
        .text("upload")
        .on("click", events.upload);

    bar.append("button")
        .text("sync")
        .attr("title", "Get uploaded pages for this domain from the server. " +
                "Warning: This will override existing pages")
        .on("click", events.sync);

    var fns = {
        getPage: function(){
            return pageSelect.property("value");
        },
        setPages: function(names, focus){
            focus = focus || "";
            names = [""].concat(names);
            var pages = pageSelect.selectAll("option")
                .data(names);
            pages.enter().append("option");
            pages
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;})
                .property("selected", function(d){
                    return d === focus;
                });
            pages.exit().remove();
        }
    };
    return fns;
}
// Source: src/chrome.js
/* functions that are related to the extension */

// save all of the pages for the site
function chromeSave(pages){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        var host = window.location.hostname;
        storage.sites[host] = cleanPages(pages);
        chrome.storage.local.set({"sites": storage.sites});
    });
}

// takes a data object to be uploaded and passes it to the background page to handle
function chromeUpload(data){
    data.page = cleanPage(data.page);
    chrome.runtime.sendMessage({type: 'upload', data: data});
}

function chromeSync(domain){
    chrome.runtime.sendMessage({type: 'sync', domain: domain}, function(response){
        if ( response.error ) {
            return;
        }
        controller.finishSync(response.pages);
    });
}

/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        page: <page>

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
function chromeLoad(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname;
        var pages = storage.sites[host] || {};
        controller.loadPages(pages);
    });
}

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
A page's name will be the name of the file when it is uploaded, so make sure that any characters
in the name will be legal to use.
rejects if name contains characters not allowed in filename: <, >, :, ", \, /, |, ?, *
*/
function legalPageName(name){
    if ( name === null || name === "") {
        return false;
    }
    var badCharacters = /[<>:"\/\\\|\?\*]/,
        match = name.match(badCharacters);
    return ( match === null );
}

function newForm(holder, hidden){
    var form = holder.append("div")
        .classed({
            "form": true,
            "hidden": hidden
        });
    var work = form.append("div")
        .classed("workarea", true);
    var buttons = form.append("div")
        .classed("buttons", true);
    return {
        form: form,
        workarea: work,
        buttons: buttons
    };
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

// Source: src/attributeView.js
function AttributeView(options){
    var index = 0;
    var eles = [];
    var length = 0;
    var formState = {};

    options = options || {};
    var holder = options.holder || "body";
    var saveFn = options.save || function(){};

    var events = {
        saveAttr: function(){
            var attr = getAttr();
            if ( attr === undefined ) {
                return;
            }
            controller.saveAttr(attr);
            fns.reset();
        },
        cancelAttr: function(){
            fns.reset();
            ui.showView("Page");
        }
    };

    // ui
    var view = d3.select(holder);

    // form
    var form = newForm(view);

    var nameInput = form.workarea.append("p")
        .append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    // display the attributes in a table
    var attributeHolder = form.workarea.append("table")
        .classed({"attributes": true});

    var th = attributeHolder.append("thead").append("tr");
    th.append("th").text("Attr");
    th.append("th").text("Value");
    var tb = attributeHolder.append("tbody");

    var buttons = form.workarea.append("div");
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

    form.buttons.append("button")
        .text("Save")
        .on("click", events.saveAttr);

    form.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelAttr);

    // end ui

    var rows;
    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return (index+1) + "/" + (length);
        });

        var element = eles[index];
        var attrMap = attributes(element);
        var attrData = [];
        for ( var key in attrMap ) {
            attrData.push([key, attrMap[key]]);
        }

        rows = tb.selectAll("tr")
            .data(attrData, function(d){ return d[0]; });

        rows.enter().append("tr")
            .on("click", function(d){
                clearClass("selectedAttr");
                this.classList.add("selectedAttr");
                formState.attr = d[0];
            });

        rows.exit().remove();

        var tds = rows.selectAll("td")
            .data(function(d){ return d;});
        tds.enter().append("td");
        tds.text(function(d){ return abbreviate(d, 51); });
        tds.exit().remove();

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

    function getAttr(){
        var attr = formState.attr;
        var name = nameInput.property("value");
        if ( name === "" || !controller.legalName(name)){
            return;
        }

        return {
            name: name,
            attr: attr
        };
    }

    var fns = {
        setElements: function(elements){
            eles = elements;
            index = 0;
            length = elements.length;
            displayElement();
        },
        reset: function(){
            eles = undefined;
            index = 0;
            indexText.text("");
            if ( rows ) {
                rows.remove();
            }
            nameInput.property("value", "");
        }
    };
    return fns;
}

// Source: src/pageView.js
function PageView(options){
    /**********
        UI
    **********/
    options = options || {};
    var holder = options.holder || document.body;
    var width = options.width || 600;
    var height = options.height || 300;
    var margin = options.margin || {
        top: 15,
        right: 25,
        bottom: 15,
        left: 100
    };

    var page;
    var selector;

    var events = {
        removeSelector: function(){
            var id = selector.id;
            // handle deleting root
            function remove(selector, lid){
                if ( selector.id === lid ) {
                    return true;
                }
                var curr;
                for ( var i=0; i<selector.children.length; i++ ) {
                    curr = selector.children[i];
                    if ( remove(curr, lid) ) {
                        // remove the child and return
                        selector.children.splice(i, 1);
                        return;
                    }
                }
                return false;
            }
            if ( page.id === id ) {
                // remove the page
                fns.reset();
                controller.removePage();
            } else {
                remove(page, id);
                selector = page;
                controller.setVals(page, selector);
                drawPage();
                showSelector();
            }
        },
        addChild: function(){
            controller.addChild();
        },
        addAttr: function(){
            controller.addAttr();
        },
        removeAttr: function(d, i){
            selector.attrs.splice(i, 1);
            drawPage();
            showSelector();
            controller.setVals(page, selector);
        },
        clickNode: function(d){
            selector = d;
            showSelector();
            fns.setSelector(d);
        },
        enterNode: function(d){
            d.elements.forEach(function(ele){
                ele.classList.add("savedPreview");
            });
        },
        exitNode: function(d){
            d.elements.forEach(function(ele){
                ele.classList.remove("savedPreview");
            });
        }
    };

    /**********
      START UI
    **********/
    var view = d3.select(holder);

    // start tree
    var svg = view.append("svg")
        .classed("inline", true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tree = d3.layout.tree()
        .size([height, width]);
    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });
    var link;
    var node;
    // end tree


    // start selector
    var sf = newForm(view, true);
    sf.form.classed("inline", true);

    var selectorText = sf.workarea.append("p")
        .text("Selector: ")
        .append("span");

    var selectorType = sf.workarea.append("p");
    var selectorAttrs = sf.workarea.append("div");

    sf.buttons.append("button")
        .text("add child")
        .on("click", events.addChild);

    sf.buttons.append("button")
        .text("add attr")
        .on("click", events.addAttr);

    sf.buttons.append("button")
        .text("remove")
        .on("click", events.removeSelector);

    
    // end selector
    /**********
      END UI
    **********/

    // get all of the elements that match each selector
    // and store in object.elements
    function getMatches(){
        function match(elements, s){
            if ( !s.elements ) {
                s.elements = controller.elements(elements, s.selector, s.spec);
            }
            s.children.forEach(function(child){
                match(s.elements, child);
            });      
        }

        match([document], page);
    }

    // attach an id to each node for d3
    function setupPage(){
        function setId(s){
            s.id = controller.nextId();
            s.children.forEach(function(s){
                setId(s);
            });
        }
        setId(page);
        getMatches();
        drawPage();

        showSelector();
    }

    function clonePage(){
        function setClone(selector, clone){
            clone.selector = selector.selector;
            clone.id = selector.id;
            clone.spec = selector.spec;
            clone.attrs = selector.attrs.slice();
            clone.elements = selector.elements.slice();
            clone.children = selector.children.map(function(child){
                return setClone(child, {});
            });
            return clone;
        }
        return setClone(page, {});
    }

    function showSelector(){
        sf.form.classed("hidden", false);
        selectorText.text(selector.selector);
        var type = selector.spec.type;
        var typeCap = type.charAt(0).toUpperCase() + type.slice(1);
        selectorType.text(typeCap + ": " + selector.spec.value);

        var currentId = selector.id;
        d3.selectAll(".node").classed("current", function(d){
            return d.id === currentId;
        });

        showAttrs(selectorAttrs, selector.attrs);
    }

    function showAttrs(holder, attrs){
        holder.selectAll("*").remove();
        if ( !attrs || attrs.length === 0 ) {
            holder.append("p").text("No Attrs");
            return;
        }
        holder.append("p").text("Attrs:");
        var attrList = holder.append("ul");
        var lis = attrList.selectAll("li")
                .data(attrs)
            .enter().append("li")
                .text(function(d){
                    return d.name + " <" + d.attr + ">";
                });

        lis.append("button")
            .text("×")
            .on("click", events.removeAttr);
    }

    function clearSelector(){
        sf.form.classed("hidden", true);
        selectorText.text("");
        selectorType.text("");
        selectorAttrs.selectAll("*").remove();
    }

    function drawPage(){
        if ( link ) {
            link.remove();
        }
        if ( node ) {
            node.remove();
        }

        var clone = clonePage(page);

        var nodes = tree.nodes(clone);
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
                "empty": empty
            })
            .on("click", events.clickNode)
            .on("mouseenter", events.enterNode)
            .on("mouseleave", events.exitNode);

        node.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        node.append("text")
            .attr("y", 5)
            .attr("dx", -5)
            .text(function(d){
                var text;
                switch ( d.spec.type ) {
                case "index":
                    text = d.selector + "[" + d.spec.value + "]";
                    break;
                case "name":
                    text = "[" + d.selector + "]";
                    break;
                default:
                    text = "";
                }
                return abbreviate(text, 15);
            });

        node.append("circle")
            .filter(function(d){
                return d.attrs.length === 0;
            })
            .attr("r", 3);

        node.append("rect")
            .filter(function(d){
                return d.attrs.length > 0;
            })
            .attr("width", 6)
            .attr("height", 6)
            .attr("x", -3)
            .attr("y", -3);

        node.exit().remove();
    }

    function empty(sel){
        var hasAttrs = sel.attrs.length;
        var hasChildren = sel.children ? sel.children.length > 0 : false;
        return !hasAttrs && !hasChildren;
    }

    var fns = {
        setPage: function(newPage, sel){
            if ( !newPage ) {
                return;
            }
            page = newPage;
            selector = sel ? sel : page;
            setupPage();
        },
        setSelector: function(d){
            // find the real selector, not the cloned one
            function find(s, lid){
                if ( s.id === lid ) {
                    selector = s;
                    return true;
                }
                return s.children.some(function(child){
                    return find(child, lid);
                });
            }

            if ( find(page, d.id) ) {
                controller.setSelector(selector);
                showSelector();
            }
        },
        hideSelector: function(){
            sf.form.classed("hidden", true);
        },
        reset: function(){
            page = undefined;
            selector = undefined;
            svg.selectAll("*").remove();
            clearSelector();
        }
    };
    return fns;
}
// Source: src/selectorView.js
function SelectorView(options){
    // the view is broken into three forms:
    //      elementChoices
    //      selectorChoices
    //      selectorType
    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);

    var choice;
    var choiceElement;
    var formState = {
        selector: "",
        type: "name",
        value: undefined
    };

    var events = {
        saveSelector: function(){
            var sel = makeSelector();
            if ( sel === undefined || sel.selector === "" ) {
                return;
            }
            var parent = controller.getSelector();
            // only save if page doesn't have 
            if ( !matchSelector(sel, parent) ) {
                sel.id = controller.nextId();
                sel.elements = controller.elements(parent.elements, sel.selector, sel.spec);
                // SPECIAL CASE FOR SELECT ELEMENTS, AUTOMATICALLY ADD OPTION CHILD
                if ( allSelects(sel.elements ) ) {
                    var optionsName = prompt("What should the options be called?");
                    if ( optionsName === null || optionsName.trim() === "" ) {
                        optionsName = "options";
                    }
                    var optionsSelector = newSelector("option", {
                        type: "name",
                        value: optionsName
                    });
                    sel.children.push(optionsSelector);
                }
                controller.saveSelector(sel);
            }

            fns.reset();
            interactive.remove();
            showcase.remove();
        },
        selectChoice: function(d){
            showcase.remove();
            viewChoice(d, this);
            var parent = controller.getSelector();
            formState.selector = d.join("");
            markup();
        },
        confirmElement: function(){
            if ( formState.selector === "" ) {
                return;
            }
            addTags();
            showSelectorForm();
        },
        confirmSelector: function(){
            if ( formState.selector === "" ) {
                return;
            }
            setupForm();
            showTypeForm();
        },
        cancelSelector: function(){
            fns.reset();
            ui.showView("Page");
        },
        toggleTag: function(){
            this.classList.toggle("on");
            formState.selector = currentSelector();
            markup();
        },
        selectorIndex: function(){
            formState.selector = currentSelector();
            formState.value = selectElement.property("value");
            markup();
        },
        toggleRadio: function(){
            switch ( this.value ) {
            case "index":
                nameGroup.classed("hidden", true);
                selectGroup.classed("hidden", false);
                formState.type = "index";
                formState.value = parseInt(selectElement.property("value"));
                break;
            case "name":
                nameGroup.classed("hidden", false);
                selectGroup.classed("hidden", true);
                formState.type = "name";
                formState.value = undefined;
                break;
            }
            markup();
        }
    };

    // start elements
    var ec = newForm(view, false);

    ec.workarea.append("p")
        .text("Choose Element:");
    var choiceHolder = ec.workarea.append("div");

    ec.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmElement);
    ec.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end elements

    // start selector
    var sc = newForm(view, true);

    sc.workarea.append("p")
        .text("Choose Selector:");
    var tags = sc.workarea.append("div");
    var parts;

    sc.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmSelector);
    sc.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end selector

    // start selectorType
    var st = newForm(view, true);

    var radioDiv = st.workarea.append("div");
    radioDiv.append("span")
        .text("Choose Type:");

    var inputHolders = radioDiv.selectAll("span.radio")
            .data(["name", "index"])
        .enter().append("span")
            .classed("radio", true);
    inputHolders.append("label")
        .text(function(d){ return d;})
        .attr("for", function(d){ return "radio-" + d;});
    
    var radios = inputHolders.append("input")
        .attr("type", "radio")
        .attr("name", "type")
        .attr("id", function(d){ return "radio-" + d;})
        .property("value", function(d){ return d;})
        .property("checked", function(d, i){ return i === 0; })
        .on("change", events.toggleRadio);

    var nameGroup = st.workarea.append("div");
    var nameElement = nameGroup.append("p").append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");

    var selectGroup = st.workarea.append("div")
        .classed({"hidden": true});

    var selectElement = selectGroup.append("p").append("label")
        .text("Index:")
        .append("select");

    st.buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    st.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);

    // end selectorType
    // end ui

        // apply the queryCheck class to selected elements
    var showcase = highlightElements()
        .cssClass("queryCheck");

    var interactive = interactiveElements()
        .cssClass("selectableElement")
        .hoverClass("collectHighlight")
        .clicked(function selectOption(event){
            event.preventDefault();
            event.stopPropagation();
            var data = [].slice.call(event.path)
                .filter(function(ele){
                    return ele.classList && ele.classList.contains("selectableElement");
                })
                .reverse()
                .map(function(ele){
                    return getParts(ele);
                });
            setChoices(data);
        });

    function showElementForm(){
        ec.form.classed("hidden", false);
        sc.form.classed("hidden", true);
        st.form.classed("hidden", true);
    }

    function showSelectorForm(){
        ec.form.classed("hidden", true);
        sc.form.classed("hidden", false);
        st.form.classed("hidden", true);
    }

    function showTypeForm(){
        ec.form.classed("hidden", true);
        sc.form.classed("hidden", true);
        st.form.classed("hidden", false);
    }


    /***
    create a new selector based on the user's choices
    ***/
    function makeSelector(){
        var sel = [];
        if ( !parts ) {
            return;
        }
        parts.each(function(d){
            if ( this.classList.contains("on") ) {
                sel.push(d);
            }
        });
        var spec = {};
        switch (formState.type){
        case "index":
            spec.type = "index";
            spec.value = parseInt(selectElement.property("value"));
            break;
        case "name":
            var name = nameElement.property("value");
            if ( name === "" || !controller.legalName(name)){
                return;
            }
            spec.type = "name";
            spec.value = name;
            break;
        }
        return newSelector(sel.join(""), spec);
    }

    // parts is given an element and returns an array containing its tag
    // and (if they exist) its id and any classes
    var getParts = selectorParts()
        .ignoreClasses(["collectHighlight", "queryCheck", "selectableElement"]);

    function markup(){
        showcase.remove();
        var sel = formState.selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var spec;
        if ( formState.type === "index" ) {
            spec = {
                type: "index",
                value: formState.value
            };
        } else {
            spec = {};
        }
        var parent = controller.getSelector();
        showcase(controller.elements(parent.elements, sel, spec));
    }

    function setChoices(data){
        interactive.remove();

        var choices = choiceHolder.selectAll("div.tag")
            .data(data);
        choices.enter().append("div")
            .classed({
                "tag": true,
                "noSelect": true
            })
            .on("click", events.selectChoice);
        choices.text(function(d){ return d.join(""); });
        choices.exit().remove();
    }

    function addTags(){
        if ( !choice ) {
            return;
        }
        formState.selector = choice.join("");
        markup();
        parts = tags.selectAll("div.tag")
            .data(choice);
        parts.enter().append("div")
            .classed({
                "tag": true,
                "on": true,
                "noSelect": true
            })
            .on("click", events.toggleTag);
        
        parts.text(function(d){ return d; });
        parts.exit().remove();

        ui.noSelect();
        return parts;
    }

    function setupForm(){
        selectElement.classed("hidden", false);
        selectElement.on("change", events.selectorIndex);
        var eles = selectElement.selectAll("option");
        eles.remove();
        var maxChildren = controller.eleCount(formState.selector);

        eles.data(d3.range(maxChildren))
            .enter().append("option")
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;});
    }

    function viewChoice(d, ele){
        if ( choiceElement ) {
            choiceElement.classList.remove("on");
        }
        ele.classList.add("on");
        choiceElement = ele;
        choice = d;
    }

    function currentSelector(){
        var tags = [];
        parts.each(function(d){
            if ( this.classList.contains("on") ) {
                tags.push(d);
            }
        });
        return tags.join("");
    }

    function allSelects(elements){
        return elements.every(function(e){
            return e.tagName === "SELECT";
        });
    }

    var fns = {
        setup: function(eles){
            interactive(eles);
        },
        reset: function(){
            showElementForm();
            interactive.remove();
            showcase.remove();
            parts = undefined;
            choice = undefined;
            choiceElement = undefined;

            tags.selectAll("*").remove();
            choiceHolder.selectAll("*").remove();

            // form
            radios.property("checked", function(d, i){ return i === 0; });
            formState = {
                selector: "",
                type: "name",
                value: undefined
            };
            nameGroup.classed("hidden", false);
            nameElement.property("value", "");
            selectGroup.classed("hidden", true);
            selectElement.selectAll("option").remove();
        }
    };

    return fns;
}

// Source: src/ui.js
function buildUI(controller){
    controller.dispatch = {};

    // ugly, might want to convert to d3 since everything else uses it, but it works
    var holder = document.createElement("div");
    holder.classList.add("collectjs");
    holder.classList.add("noSelect");
    holder.innerHTML = '<div class="tabHolder">' +
            '<div class="tabs">' +
                '<div class="tab" id="closeCollectjs">&times;</div>' +
            '</div>' +
        '</div>' +
        '<div class="permanent">' +
            '<div id="schemaInfo"></div>' +
            '<div id="collectAlert"></div>' +
        '</div>' +
        '<div class="views"></div>';
    document.body.appendChild(holder);

    var events = {
        close: function(){
            holder.parentElement.removeChild(holder);
            document.body.style.marginBottom = initialMargin;
            controller.close();
        }
    };

    var existingStyle = getComputedStyle(document.body);
    var initialMargin = existingStyle.marginBottom;
    document.body.style.marginBottom = "500px";

    var topbarFns = topbar({
        holder: "#schemaInfo"
    });

    var closer = d3.select("#closeCollectjs")
        .on("click", events.close);

    var tabHolder = holder.querySelector(".tabs");
    var viewHolder = holder.querySelector(".views");
    var tabs = {};
    var views = {};
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

    var fns = {
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
            tabHolder.insertBefore(t, tabHolder.lastChild);

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
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };

    return fns;
}

// Source: src/collector.js
var controller = collectorController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [PageView, "Page", {
        width: 500,
        height: 200
    }, true],
    [SelectorView, "Selector"],
    [AttributeView, "Attribute"]
]);

chromeLoad();
