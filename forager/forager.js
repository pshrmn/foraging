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
        // special case for class attribute
        if ( curr.name === "class" ) {
            var classVal = curr.value.replace("current-selector","").trim();
            if ( classVal !== "" ) {
                attrMap.class = classVal;
            }
            continue;
        }
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
optional is a boolean describing whehther or not selector has to match elements
returns a new Selector object
*/
function newSelector(selector, spec, optional){
    optional = optional || false;
    return {
        selector: selector,
        spec: spec,
        children: [],
        rules: [],
        optional: optional
    };
}

function newPage(name){
    return {
        name: name,
        selector: "body",
        spec: {
            type: "single",
            value: 0
        },
        children: [],
        rules: [],
        optional: false,
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
    var not = ".no-select";

    /*
     * given an array of parent elements, return an array of child elements
     * that match the selector. The returned array will vary based on the
     * given spec. A spec with type=all will return all matching child elements
     * and a spec with type=single will return the child element at the
     * provided index for each parent elements.
     */
    function select(elements, selector, spec){
        var matches = [];
        var sel = selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = spec && spec.type === "single" ? spec.value : undefined;
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
        var index = spec && spec.type === "single" ? spec.value : undefined;
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

/*
 * get rid of extra information before saving
 */
function cleanPage(page){
    function cleanSelector(s, clone){
        clone.selector = s.selector;
        clone.spec = s.spec;
        clone.rules = s.rules.slice();
        clone.optional = s.optional;
        clone.children = s.children.map(function(child){
            return cleanSelector(child, {});
        });
        return clone;
    }

    var clonedPage = cleanSelector(page, {});
    clonedPage.name = page.name;
    return clonedPage;
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

/*
 * check if an identical selector already exists or one with the same name
 * exists
 */
function matchSelector(sel, parent){
    var selIndex = sel.spec.type === "single" ? sel.spec.value : undefined;
    var msg = "";
    var found = parent.children.some(function(s){
        var sameType = sel.spec.type === s.spec.type;
        if ( !sameType ) {
            return false;
        }

        switch ( s.spec.type ) {
        case "single":
            var index = s.spec.value;
            if ( s.selector === sel.selector && index === selIndex ) {
                msg = "a selector with the same selector and index already exists";
                return true;
            }
            break;
        case "all":
            if ( s.spec.value === sel.spec.value ) {
                msg = "a selector with the name '" + sel.spec.value + "' already exists";
                return true;
            }
            break;
        }
        return false;
    });
    return {
        error: found,
        msg: msg
    };
}

/*
 * generate and return an array containing the names of all rules in the page
 * and "all"-type selector names
 */
function usedNames(page){
    var names = [];

    function findNames(selector){
        if ( selector.spec.type === "all" ) {
            names.push(selector.spec.value);
        }
        selector.rules.forEach(function(n){
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

// Source: src/preview.js
function preview(page) {
    /**
     * Given a parent element, get all children that match the selector
     * Return data based on selector's type (index or name)
     */
    function getElement(selector, parent) {
        var elements = parent.querySelectorAll(selector.selector);
        var value = selector.spec.value;
        switch ( selector.spec.type ) {
        case "single":
            var ele = elements[value];
            if ( !ele) {
                return;
            }
            return getElementData(selector, ele);
        case "all":
            var data = Array.prototype.slice.call(elements).map(function(ele){
                return getElementData(selector, ele);
            }).filter(function(datum){
                return datum !== undefined;
            });
            var obj = {};
            obj[value] = data;
            return obj;
        }
    }

    /**
     * Get data for each rule and each child. Merge the child data into the
     * rule data.
     */
    function getElementData(selector, element){
        var data = getRuleData(selector.rules, element);
        var childData = getChildData(selector.children, element);
        if ( !childData ) {
            return;
        }
        for ( var key in childData ) {
            data[key] = childData[key];
        }
        return data;
    }

    function getChildData(children, element) {
        var data = {};
        children.some(function(child){
            var childData = getElement(child, element);
            if ( !childData && !child.optional ) {
                data = undefined;
                return true;
            }
            for ( var key in childData ) {
                data[key] = childData[key];
            }
            return false;
        });
        return data;
    }

    var intRegEx = /\d+/;
    var floatRegEx = /\d+(\.\d+)?/;
    function getRuleData(rules, element) {
        var data = {};
        rules.forEach(function(rule){
            var val;
            var match;
            if ( rule.attr === "text" ) {
                 val = element.textContent.replace(/\s+/g, " ");
            } else {
                var attr = element.getAttribute(rule.attr);
                // attributes that don't exist will return null
                // just use empty string for now
                val = attr || "";
            }
            switch (rule.type) {
            case "int":
                match = val.match(intRegEx);
                val = match !== null ? parseInt(match[0], 10) : -1;
                break;
            case "float":
                match = val.match(floatRegEx);
                val = match !== null ? parseFloat(match[0]) : -1.0;
                break;
            }
            data[rule.name] = val;
        });
        return data;
    }


    return getElement(page, document);
}


// Source: src/ui/previewModal.js
function previewModal(parentElement){
    var parent = d3.select(parentElement);

    function closeModal(){
        holder.classed("hidden", true);
    }

    var holder = parent.append("div")
        .classed({
            "no-select": true,
            "modal-holder": true,
            "hidden": true
        });

    var background = holder.append("div")
        .classed({
            "background": true,
            "no-select": true
        })
        .attr("title", "click to close preview")
        .on("click", closeModal);

    var modal = holder.append("div")
        .classed({
            "no-select": true,
            "cjs-modal": true
        });

    var pre = modal.append("pre")
        .classed("no-select", true);

    var close = modal.append("button")
        .classed("no-select", true)
        .text("close")
        .on("click", closeModal);

    return function(text){
        holder.classed("hidden", false);
        pre.text(text);
    };
}

// Source: src/controller.js
function foragerController(){
    var pages;
    var currentPage;
    var page;
    var selector;
    var lastId;

    function setupPage(){
        generateIds();
        getMatches();
        // page is base selector, has id 0
        selector = page;
        fns.dispatch.Page.setSelector(selector);
        fns.dispatch.Tree.draw(page, selector.id);
    }

    function generateIds(){
        var idCount = 0;
        function setId(sel){
            sel.id = idCount++;
            sel.children.forEach(function(child){
                setId(child);
            });
        }
        setId(page);
        lastId = idCount;
    }

    // get all of the elements that match each selector
    // and store in object.elements
    function getMatches(){
        function match(eles, s){
            if ( !s.elements ) {
                s.elements = fns.elements(eles, s.selector, s.spec);
            }
            s.children.forEach(function(child){
                match(s.elements, child);
            });      
        }

        match([document], page);
    }

    function resetAll(){
        fns.dispatch.Tree.reset();
        fns.dispatch.Page.reset();
        fns.dispatch.Selector.reset();
        fns.dispatch.Rule.reset();
        currentPage = undefined;
        page = undefined;
        selector = undefined;
    }

    function allSelects(elements){
        return elements.every(function(e){
            return e.tagName === "SELECT";
        });
    }

    var modal = previewModal(document.body);

    var fns = {
        elements: elementSelector(),
        loadPages: function(ps){
            pages = ps;
            var options = Object.keys(pages);
            ui.setPages(options);
        },
        loadPage: function(pageName){
            resetAll();
            if ( pages[pageName] ) {
                currentPage = pageName;
                page = pages[pageName];
                setupPage();
                ui.showView("Page");
            }
        },
        addPage: function(name){
            if ( pages[name] === undefined && legalPageName(name) ) {
                page = newPage(name);
                currentPage = name;
                pages[name] = page;
                setupPage();
                ui.showView("Page");
                // update options after adding page to pages
                var options = Object.keys(pages);
                ui.setPages(options, name);
                chromeSave(pages);
            }
        },
        renamePage: function(){
            if ( !currentPage ) {
                return;
            }
            var name = prompt("New Page Name\nCannot contain the following characters: < > : \" \\ / | ? *");
            var oldName = currentPage;
            if ( name === oldName ) {
                return;
            } else if ( pages[name] === undefined && legalPageName(name) ) {
                currentPage = name;
                pages[name] = page;
                delete pages[oldName];
                var options = Object.keys(pages);
                ui.setPages(options, name);
                chromeSave(pages);
            }
        },
        removePage: function(){
            delete pages[currentPage];
            currentPage = undefined;
            page = undefined;
            selector = undefined;
            resetAll();
            var options = Object.keys(pages);
            ui.setPages(options);
            chromeSave(pages);
        },
        upload: function(){
            if ( page ) {
                chromeUpload({
                    name: currentPage,
                    site: window.location.hostname,
                    page: page
                });
            }
        },
        setSelectorById: function(id){
            function find(sel, id){
                if ( sel.id === id ) {
                    selector = sel;
                    return true;
                }
                return sel.children.some(function(child){
                    return find(child, id);
                });
            }
            
            if ( !find(page, id) ) {
                selector = undefined;
            }
            fns.dispatch.Page.setSelector(selector);
        },
        setSelector: function(sel){
            selector = sel;
            fns.dispatch.Tree.draw(page, selector.id);
            chromeSave(pages);
        },
        getSelector: function(){
            return selector;
        },
        // add a selector as a child of the current selector
        addSelector: function(){
            var eles = fns.elements(selector.elements);
            fns.dispatch.Selector.setup(eles);
            fns.dispatch.Tree.turnOff();
            ui.showView("Selector");
        },
        cancelSelector: function(){
            fns.dispatch.Tree.turnOn();
            ui.showView("Page");
        },
        // remove the current selector and set the body to the current
        removeSelector: function(){

            function remove(sel, lid){
                if ( sel.id === lid ) {
                    return true;
                }
                var curr;
                for ( var i=0; i<sel.children.length; i++ ) {
                    curr = sel.children[i];
                    if ( remove(curr, lid) ) {
                        // remove the child and return
                        sel.children.splice(i, 1);
                        return;
                    }
                }
                return false;
            }
            if ( page.id === selector.id ) {
                // remove the page
                fns.removePage();
            } else {
                remove(page, selector.id);
                selector = page;
                fns.dispatch.Tree.draw(page, selector.id);
                fns.dispatch.Page.setSelector(selector);
            }
            chromeSave(pages);
        },
        saveSelector: function(sel){
            sel.id = ++lastId;

            // only save if page doesn't have 
            var collision = matchSelector(sel, selector);
            if ( collision.error ) {
                return collision;
            }
            sel.elements = fns.elements(selector.elements, sel.selector, sel.spec);
            // SPECIAL CASE FOR SELECT ELEMENTS, AUTOMATICALLY ADD OPTION CHILD
            if ( allSelects(sel.elements ) ) {
                var optionsName = prompt("What should the options be called?");
                if ( optionsName === null || optionsName.trim() === "" ) {
                    optionsName = "options";
                }
                var opts = newSelector("option", {
                    type: "name",
                    value: optionsName
                });
                opts.id = ++lastId;
                opts.elements = fns.elements(sel.elements, opts.selector, opts.spec);
                sel.children.push(opts);
            }
            selector.children.push(sel);
            selector = sel;
            ui.showView("Page");
            fns.dispatch.Tree.draw(page, selector.id);
            fns.dispatch.Page.setSelector(selector);
            chromeSave(pages);
            return true;
        },
        // add an Rule to the current selector
        addRule: function(){
            fns.dispatch.Rule.setElements(selector.elements);
            fns.dispatch.Tree.turnOff();
            ui.showView("Rule");
        },
        cancelRule: function(){
            fns.dispatch.Tree.turnOn();
            ui.showView("Page");
        },
        saveRule: function(rule){
            selector.rules.push(rule);
            fns.dispatch.Tree.draw(page, selector.id);
            fns.dispatch.Page.setSelector(selector);
            ui.showView("Page");
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
        preview: function(){
            if ( !page ) {
                return;
            }
            var text = preview(page);
            if ( !text ) {
                console.error("failed to generate preview");
            } else {
                modal(JSON.stringify(text, null, 2));
                // console.log(JSON.stringify(text, null, 2));
            }
        },
        close: function(){
            resetAll();
        },
        // used to interact with views
        dispatch: {},
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
    data.page = JSON.stringify(cleanPage(data.page));
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
    var errors = buttons.append("p")
        .classed("errors", true);

    function clearErrors(){
        errors.text("");
    }

    function showError(msg){
        errors.text(msg);
    }

    return {
        form: form,
        workarea: work,
        buttons: buttons,
        clearErrors: clearErrors,
        showError: showError
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

// Source: src/ui/topbar.js
function topbar(options){
    options = options || {};
    var holder = options.holder || "body";

    var events = {
        loadPage: function(){
            var pageName = fns.getPage();
            controller.loadPage(pageName);
        },
        addPage: function(){
            var name = prompt("Page Name\nCannot contain the following characters: < > : \" \\ / | ? *");
            if ( name === null || name === "" ) {
                return;
            }
            controller.addPage(name.trim());
        },
        removePage: function(){
            controller.removePage();
        },
        renamePage: function(){
            controller.renamePage();
        },
        upload: function(){
            controller.upload();
        },
        sync: function(){
            controller.startSync();
        },
        preview: function(){
            controller.preview();
        }
    };

    var bar = d3.select(holder);

    // global
    bar.append("button")
        .text("sync")
        .classed("green", true)
        .attr("title", "Get uploaded pages for this domain from the server. " +
                "Warning: This will override existing pages")
        .on("click", events.sync);

    // page
    var pageGroup = bar.append("div")
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", events.loadPage);

    pageGroup.append("button")
        .text("Add")
        .classed("green", true)
        .attr("title", "add a new Page")
        .on("click", events.addPage);

    pageGroup.append("button")
        .text("Rename")
        .classed("green", true)
        .attr("title", "rename current Page")
        .on("click", events.renamePage);

    pageGroup.append("button")
        .text("Delete")
        .attr("title", "remove the current Page")
        .classed("red", true)
        .on("click", events.removePage);

    pageGroup.append("button")
        .text("upload")
        .classed("green", true)
        .on("click", events.upload);

    pageGroup.append("button")
        .text("preview")
        .classed("green", true)
        .attr("title", "Preview will be logged in the console")
        .on("click", events.preview);

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
// Source: src/ui/ruleView.js
function RuleView(options){
    var index = 0;
    var eles = [];
    var length = 0;
    var formState = {};

    options = options || {};
    var saveFn = options.save || function(){};

    var events = {
        saveRule: function(){
            var rule = getRule();
            if ( rule === undefined ) {
                return;
            }
            controller.saveRule(rule);
            fns.reset();
        },
        cancelRule: function(){
            fns.reset();
            controller.cancelRule();
        }
    };

    // ui
    var view = options.view || d3.select("body");

    // form
    var form = newForm(view);

    var nameInput = form.workarea.append("p")
        .append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    var typeArea = form.workarea.append("p")
        .text("Type:");

    var currType = "string";
    var typeLabels = typeArea.selectAll("label")
        .data(["string", "int", "float"])
        .enter().append("label")
        .text(function(d){ return d; });

    var radioTypes = typeLabels.append("input")
        .attr("type", "radio")
        .attr("name", "rule-type")
        .attr("value", function(d){ return d; })
        .property("checked", function(d, i) {
            return d === currType;
        })
        .on("change", function(){
            currType = this.value;
        });

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
        .on("click", events.saveRule);

    form.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelRule);

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

    function getRule(){
        var attr = formState.attr;
        var name = nameInput.property("value");
        if ( name === ""){
            form.showError("Rule name is required");
            return;
        } else if ( !controller.legalName(name) ){
            form.showError("A rule with the name '" + name + "' already exists");
            return;
        } else if ( attr === undefined ) {
            form.showError("No attribute has been selected.");
            return;
        }
        var type = currType;
        return {
            name: name,
            attr: attr,
            type: type
        };
    }

    var fns = {
        setElements: function(elements){
            eles = elements;
            index = 0;
            length = elements.length;
            form.clearErrors();
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
            currType = "string";
            radioTypes.property("checked", function(d){
                return d === currType;
            });
        }
    };
    return fns;
}

// Source: src/ui/pageView.js
function PageView(options){
    /**********
        UI
    **********/
    options = options || {};

    var page;
    var selector;

    var events = {
        addChild: function(){
            controller.addSelector();
        },
        addRule: function(){
            controller.addRule();
        },
        removeRule: function(d, i){
            selector.rules.splice(i, 1);
            showSelector();
            controller.setSelector(selector);
        },
        removeSelector: function(){
            controller.removeSelector();
        },
    };

    /**********
      START UI
    **********/
    var view = options.view || d3.select("body");

    // start selector
    var sf = newForm(view, true);
    sf.form.classed("inline", true);

    var selectorText = sf.workarea.append("p")
        .classed("selector", true);
    var selectorType = sf.workarea.append("p");
    var selectorRules = sf.workarea.append("div");

    sf.buttons.append("button")
        .classed("add-child", true)
        .text("add child")
        .on("click", events.addChild);

    sf.buttons.append("button")
        .classed("add-rule", true)
        .text("add rule")
        .on("click", events.addRule);

    sf.buttons.append("button")
        .classed("remove-selector", true)
        .text("remove")
        .on("click", events.removeSelector);

    
    // end selector
    /**********
      END UI
    **********/

    function showSelector(){
        sf.form.classed("hidden", false);
        selectorText.text(selector.selector);
        var type = selector.spec.type;
        var typeCap = type.charAt(0).toUpperCase() + type.slice(1);
        var desc = "";
        switch (type){
        case "single":
            desc = "Select element at index " + selector.spec.value;
            break;
        case "all":
            desc = "Select all elements, save as \"" + selector.spec.value + "\"";
            break;
        }
        selectorType.text(desc);

        var currentId = selector.id;
        d3.selectAll(".node").classed("current", function(d){
            return d.id === currentId;
        });

        showRules(selectorRules, selector.rules);
    }

    function showRules(holder, rules){
        holder.selectAll("*").remove();
        if ( !rules || rules.length === 0 ) {
            holder.append("p").text("No Rules");
            return;
        }
        holder.append("p").text("Rules:");
        var ruleList = holder.append("ul");
        var lis = ruleList.selectAll("li")
                .data(rules)
            .enter().append("li");

        lis.append("span")
            .classed("name", true)
            .text(function(d){
                return d.name;
            });
        lis.append("span")
            .text(function(d){
                return "<" + d.attr + ">";
            });

        lis.append("span")
            .text(function(d){
                return "(" + d.type + ")";
            });

        lis.append("button")
            .classed("red", true)
            .text("×")
            .on("click", events.removeRule);
    }

    function clearSelector(){
        sf.form.classed("hidden", true);
        selectorText.text("");
        selectorType.text("");
        selectorRules.selectAll("*").remove();
    }

    var fns = {
        setSelector: function(sel){
            selector = sel;
            showSelector();
        },
        hideSelector: function(){
            sf.form.classed("hidden", true);
        },
        reset: function(){
            page = undefined;
            selector = undefined;
            clearSelector();
        }
    };
    return fns;
}
// Source: src/ui/selectorView.js
function SelectorView(options){
    // the view is broken into three forms:
    //      elementChoices
    //      selectorChoices
    //      selectorType
    options = options || {};
    var view = options.view || d3.select("body");

    var choice;
    var choiceElement;
    var selector = "";
    var radioType = "single";

    var events = {
        saveSelector: function(){
            var sel = makeSelector();
            if ( sel === undefined || sel.selector === "" ) {
                typeForm.showError("\"all\" selector requires a name");
                return;
            }
            var resp = controller.saveSelector(sel);
            if ( !resp.error ) {
                fns.reset();
                interactive.remove();
                showcase.remove();
            } else {
                typeForm.showError(resp.msg);
            }
        },
        selectChoice: function(d){
            showcase.remove();
            viewChoice(d, this);
            var parent = controller.getSelector();
            selector = d.join("");
            var tempSpec = {
                type: "all"
            };
            count(tempSpec, elementCount);
            markup(tempSpec);
        },
        confirmElement: function(){
            if ( selector === "" ) {
                elementForm.showError("No element selected");
                return;
            }
            addTags();
            showSelectorForm();
        },
        confirmSelector: function(){
            if ( selector === "" ) {
                selectorForm.showError("Selector cannot be empty");
                return;
            }
            setupForm();
            showTypeForm();
        },
        cancelSelector: function(){
            fns.reset();
            controller.cancelSelector();
        },
        toggleTag: function(){
            this.classList.toggle("on");
            selector = currentSelector();
            var tempSpec = {
                type: "all"
            };
            count(tempSpec, selectorCount);
            markup(tempSpec);
        },
        selectorIndex: function(){
            selector = currentSelector();
            markup({
                type: "single",
                value: parseInt(selectElement.property("value"), 10)
            });
        },
        toggleRadio: function(){
            switch ( this.value ) {
            case "single":
                nameGroup.classed("hidden", true);
                selectGroup.classed("hidden", false);
                radioType = "single";
                markup({
                    type: "single",
                    value: parseInt(selectElement.property("value"))
                });
                break;
            case "all":
                nameGroup.classed("hidden", false);
                selectGroup.classed("hidden", true);
                radioType = "all";
                markup({
                    type: "all"
                });
                break;
            }
        }
    };

    // start elements
    var elementForm = newForm(view, false);

    elementForm.workarea.append("p")
        .text("Choose Element:");

    var choiceHolder = elementForm.workarea.append("div");

    var elementCount = elementForm.workarea.append("p")
        .text("Count:")
        .append("span")
            .text("0");

    elementForm.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmElement);
    elementForm.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end elements

    // start selector
    var selectorForm = newForm(view, true);

    selectorForm.workarea.append("p")
        .text("Choose Selector:");
    var tags = selectorForm.workarea.append("div");
    var parts;

    var selectorCount = selectorForm.workarea.append("p")
        .text("Count:")
        .append("span")
            .text("0");

    selectorForm.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmSelector);
    selectorForm.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end selector

    // start typeForm
    var typeForm = newForm(view, true);

    var radioDiv = typeForm.workarea.append("div");
    radioDiv.append("span")
        .text("Choose Type:");

    var inputHolders = radioDiv.selectAll("span.radio")
            .data(["single", "all"])
        .enter().append("span")
            .classed("radio", true);
    inputHolders.append("label")
        .text(function(d){ return d;})
        .attr("for", function(d){ return "radio-" + d;});
    
    var radios = inputHolders.append("input")
        .attr("type", "radio")
        .attr("name", "selector-type")
        .attr("id", function(d){ return "radio-" + d;})
        .property("value", function(d){ return d;})
        .property("checked", function(d, i){ return i === 0; })
        .on("change", events.toggleRadio);

    var selectGroup = typeForm.workarea.append("div");

    var nameGroup = typeForm.workarea.append("div")
        .classed({"hidden": true});

    var nameElement = nameGroup.append("p").append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");


    var selectElement = selectGroup.append("p").append("label")
        .text("Index:")
        .append("select");

    var optionalCheckbox = typeForm.workarea.append("p").append("label")
        .text("Optional")
        .append("input")
            .attr("type", "checkbox");

    typeForm.buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    typeForm.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelSelector);

    // end selectorType
    // end ui

        // apply the query-check class to selected elements
    var showcase = highlightElements()
        .cssClass("query-check");

    var interactive = interactiveElements()
        .cssClass("selectable-element")
        .hoverClass("forager-highlight")
        .clicked(function selectOption(event){
            event.preventDefault();
            event.stopPropagation();
            var data = [].slice.call(event.path)
                .filter(function(ele){
                    return ele.classList && ele.classList.contains("selectable-element");
                })
                .reverse()
                .map(function(ele){
                    return getParts(ele);
                });
            setChoices(data);
        });


    function showElementForm(){
        elementForm.clearErrors();
        elementCount.text("0");
        elementForm.form.classed("hidden", false);
        selectorForm.form.classed("hidden", true);
        typeForm.form.classed("hidden", true);
    }

    function showSelectorForm(){
        selectorForm.clearErrors();
        count({"type": "all"}, selectorCount);
        elementForm.form.classed("hidden", true);
        selectorForm.form.classed("hidden", false);
        typeForm.form.classed("hidden", true);
    }

    function showTypeForm(){
        typeForm.clearErrors();
        elementForm.form.classed("hidden", true);
        selectorForm.form.classed("hidden", true);
        typeForm.form.classed("hidden", false);
        markup({
            type: "single",
            value: 0
        });
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

        switch (radioType){
        case "single":
            spec.type = "single";
            spec.value = parseInt(selectElement.property("value"));
            break;
        case "all":
            var name = nameElement.property("value");
            if ( name === "" || !controller.legalName(name)){
                return;
            }
            spec.type = "all";
            spec.value = name;
            break;
        }
        var optional = optionalCheckbox.property("checked");

        return newSelector(sel.join(""), spec, optional);
    }

    // parts is given an element and returns an array containing its tag
    // and (if they exist) its id and any classes
    var getParts = selectorParts()
        .ignoreClasses(["forager-highlight", "query-check",
            "selectable-element", "current-selector"]);

    function markup(spec){
        showcase.remove();
        var sel = selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var parent = controller.getSelector();
        showcase(controller.elements(parent.elements, sel, spec));
    }

    function count(spec, holder){
        var sel = selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var parent = controller.getSelector();
        var eleCount = controller.elements.count(parent.elements, sel, spec);
        holder.text(eleCount);
    }

    function setChoices(data){
        interactive.remove();

        var choices = choiceHolder.selectAll("div.tag")
            .data(data);
        choices.enter().append("div")
            .classed({
                "tag": true,
                "no-select": true
            })
            .on("click", events.selectChoice);
        choices.text(function(d){ return d.join(""); });
        choices.exit().remove();
    }

    function addTags(){
        if ( !choice ) {
            return;
        }
        selector = choice.join("");
        markup({
            type: "all"
        });
        parts = tags.selectAll("div.tag")
            .data(choice);
        parts.enter().append("div")
            .classed({
                "tag": true,
                "on": true,
                "no-select": true
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
        var maxChildren = controller.eleCount(selector);

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
            optionalCheckbox.property("checked", false);
            selector = "";
            radioType = "single";
            selectGroup.classed("hidden", false);
            selectElement.selectAll("option").remove();
            nameGroup.classed("hidden", true);
            nameElement.property("value", "");
        }
    };

    return fns;
}

// Source: src/ui/treeView.js
/*
 * A tree diagram representing  the current Page
 */
function TreeView(options){
    var page;

    options = options || {};
    var width = options.width || 600;
    var height = options.height || 300;
    var margin = options.margin || {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25
    };

    var events = {
        clickNode: function(node){
            controller.setSelectorById(node.id);
            svg.selectAll(".node").classed("current", function(d){
                return d.id === node.id;
            });
            highlightSelectorElements(node);
        },
        enterNode: function(node){
            node.elements.forEach(function(ele){
                ele.classList.add("saved-preview");
            });
        },
        exitNode: function(node){
            node.elements.forEach(function(ele){
                ele.classList.remove("saved-preview");
            });
        }
    };

    /*
     * START UI
     */
    var view = d3.select(options.view || d3.select("body"));

    var svg = d3.select(".page-tree").append("svg")
        .classed("inline", true)
        .attr("width", width)
        .attr("height", height);
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var usableWidth = width - margin.left - margin.right;
    var usableHeight = height - margin.top - margin.bottom;
    var tree = d3.layout.tree()
        .size([usableHeight, usableWidth]);
    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });
    var link;
    var node;
    /*
     * END UI
     */

    function empty(sel){
        var hasRules = sel.rules.length;
        var hasChildren = sel.children ? sel.children.length > 0 : false;
        return !hasRules && !hasChildren;
    }

    function highlightSelectorElements(sel){
        clearClass("current-selector");
        sel.elements.forEach(function(ele){
            ele.classList.add("current-selector");
        });
    }

    function clonePage(page){
        function setClone(selector, clone){
            clone.selector = selector.selector;
            clone.id = selector.id;
            clone.spec = selector.spec;
            clone.rules = selector.rules.slice();
            clone.optional = selector.optional;
            clone.elements = selector.elements.slice();
            clone.children = selector.children.map(function(child){
                return setClone(child, {});
            });
            return clone;
        }
        return setClone(page, {});
    }

    var fns = {
        draw: function(page, currentId){
            var clone = clonePage(page);
            currentId = currentId || 0;
            // clear out all current nodes and links
            if ( link ) {
                link.remove();
            }
            if ( node ) {
                node.remove();
            }

            // have d3 generate the nodes and links
            var nodes = tree.nodes(clone);
            var links = tree.links(nodes);
            link = g.selectAll(".link")
                .data(links, function(d) {
                    return d.source.id + "-" + d.target.id; }
                );
            node = g.selectAll(".node")
                .data(nodes, function(d) { return d.id; });

                
            // draw the links first
            link.enter().append("path")
                .attr("class", "link");
            link.attr("d", diagonal);
            link.exit().remove();

            // draw the nodes
            node.enter().append("g")
                .classed({
                    "node": true,
                    "empty": empty,
                    "current": function(d){ return d.id === currentId; }
                })
                .on("click", events.clickNode)
                .on("mouseenter", events.enterNode)
                .on("mouseleave", events.exitNode)
                .each(function(d){
                    if ( d.id === currentId ) {
                        highlightSelectorElements(d);
                    }
                });

            node.attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; }
            );

            node.append("text")
                .attr("y", 5)
                .attr("dx", -5)
                .text(function(d){
                    var text;
                    switch ( d.spec.type ) {
                    case "single":
                        text = d.selector + "[" + d.spec.value + "]";
                        break;
                    case "all":
                        text = "[" + d.selector + "]";
                        break;
                    default:
                        text = "";
                    }
                    return abbreviate(text, 15);
                });

            // nodes that have no rules are denoted by circle markers
            // and nodes that have rules are denoted by square markers
            node.append("circle")
                .filter(function(d){
                    return d.rules.length === 0;
                })
                .attr("r", 3);

            node.append("rect")
                .filter(function(d){
                    return d.rules.length > 0;
                })
                .attr("width", 6)
                .attr("height", 6)
                .attr("x", -3)
                .attr("y", -3);

            node.exit().remove();

            svg.classed("not-allowed", false);
        },
        turnOn: function(){
            svg.classed("not-allowed", false);
            g.selectAll(".node")
                .on("click", events.clickNode)
                .on("mouseenter", events.enterNode)
                .on("mouseleave", events.exitNode);
        },
        /*
         * turn off interactivity when performing some tasks
         * most useful when the current selector should not change
         */
        turnOff: function(){
            svg.classed("not-allowed", true);
            // d3 has no .off
            g.selectAll(".node")
                .on("click", null)
                .on("mouseenter", null)
                .on("mouseleave", null);
        },
        reset: function(){
            g.selectAll("*").remove();
            clearClass("current-selector");
        }
    };
    return fns;
}

// Source: src/ui/ui.js
function buildUI(controller){
    controller.dispatch = {};

    var holder = d3.select("body").append("div")
        .classed({
            "forager": true,
            "no-select": true
        })
        .html('<div class="permanent">' +
                '<div id="schemaInfo"></div>' +
                '<div id="foragerAlert"></div>' +
                '<div id="ui-buttons">' +
                    '<div id="min-forager">-</div>' +
                    '<div id="close-forager">&times;</div>' +
                '</div>' +
            '</div>' +
            '<div class="views page-divs"></div>' + 
            '<div class="page-tree page-divs"></div>'
        );
    var divs = d3.selectAll(".page-divs");
    var hidden = false;
    var events = {
        minMax: function() {
            hidden = !hidden;
            this.textContent = hidden ? "+" : "-";
            divs.classed("hidden", hidden);
        },
        close: function(){
            holder.remove();
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

    var minmax = d3.select("#min-forager")
        .on("click", events.minMax);

    var closer = d3.select("#close-forager")
        .on("click", events.close);

    var viewHolder = holder.select(".views");
    var views = {};
    var activeView;

    function showView(name){
        if ( activeView ) {
            activeView.classed("active", false);
        }
        activeView = views[name];
        activeView.classed("active", true);
    }

    var fns = {
        // make sure that all elements in the forager ui are .no-select
        noSelect: function(){
            holder.selectAll("*")
                .classed("no-select", true);
        },
        addViews: function(views){
            var fn = this.addView;
            var _this = this;
            views.forEach(function(view){
                fn.apply(_this, view);
            });
            fns.noSelect();
        },
        addView: function(viewFn, name, options, active){
            options = options || {};

            // create a new view
            var v = viewHolder.append("div")
                .classed({
                    "view": true,
                    "active": active
                });
 
            views[name] = v;
            if ( active ) {
                activeView = v;
            }

            options.view = v;
            controller.dispatch[name] = viewFn(options);
        },
        addTree: function(treeFn, name, options){
            options = options || {};
            options.view = d3.select(".page-tree");
            options.width = 500;
            options.height = 220;
            options.margin = {
                top: 5,
                right: 15,
                bottom: 5,
                left: 50
            };
            controller.dispatch[name] = treeFn(options);
            fns.noSelect();
        },
        showView: showView,
        setPages: topbarFns.setPages,
        getPage: topbarFns.getPage,
    };

    return fns;
}

// Source: src/forager.js
var controller = foragerController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [PageView, "Page", {}, true],
    [SelectorView, "Selector"],
    [RuleView, "Rule"]
]);

ui.addTree(TreeView, "Tree", {});

chromeLoad();
