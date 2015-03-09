function collectorController(){
    var schemas;
    var currentSchema;
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
            ui.setSchemas(Object.keys(schemas));
        },
        setSchema: function(schemaName){
            currentSchema = schemaName;
            idCount = 0;
            schema = schemas[schemaName];

            // use the default page when loading a schema
            // might update if in the future this stores last used schema/page
            fns.setPage("default");
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
                if ( sel.selector === "" ) {
                    return;
                }
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
                chromeUpload({
                    name: currentSchema,
                    site: window.location.hostname,
                    schema: schema
                });
            },
            loadSchema: function(){
                fns.setSchema(ui.getSchema());
            },
            addSchema: function(){
                var name = prompt("Schema name");
                if ( name !== null && name !== "" &&
                    schemas[name] === undefined && legalSchemaName(name) ) {
                    schemas[name] = newSchema(name);
                    ui.setSchemas(Object.keys(schemas), name);
                    fns.setSchema(name);
                    chromeSave(schemas);
                }
            },
            removeSchema: function(){
                if ( currentSchema === "default" ){
                    schemas["default"] = newSchema("default");
                } else {
                    delete schemas[currentSchema];
                }
                fns.setSchema("default");
                ui.setSchemas(Object.keys(schemas));
                chromeSave(schemas);
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
            },
            close: function(){
                eHighlight.remove();
                ui.close();
            }
        },
        // used to interact with views
        dispatch: {},
    };

    return fns;
}