function collectorController(){
    var schemas;
    var schema;    
    var page;
    var selector;

    // sp is given an element and returns an array containing its tag
    // and if they exist, its id and any classes
    var sp = selectorParts()
        .ignoreClasses(["collectHighlight", "queryCheck", "selectableElement"]);

    // es takes an array of elements and queries each to get their child elements
    // if no selector is provided it uses the all selector (*)
    var es = elementSelector();

    // element highlighter takes an array of elements and adds event listeners
    // to give the user the ability to select an element in the page (along with
    // vanity markup to identify which element is being selected)
    var eh = elementHighlighter()
        .clicked(elementChoices);

    function elementChoices(elements){
        var data = elements.map(function(ele){
            return sp(ele);
        });
        fns.dispatch.Selector.setChoices(data);
        /*
        queryCheckMarkup(data.join(""));

        var parts = fns.dispatch.Selector.addTags(data);
        parts.on("click", function(){
                d3.event.stopPropagation();
                this.classList.toggle("on");
                var tags = [];
                parts.each(function(d){
                    if ( this.classList.contains("on") ) {
                        tags.push(d);
                    }
                });
                queryCheckMarkup(tags.join(""));
            });
        */
    }

    // get all of the elements that match each selector
    // and store in object.elements
    function getMatches(selectFn){
        function match(elements, s){
            s.elements = selectFn(elements, s.selector);
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
    }

    var fns = {
        clonePage: function(){
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
        },
        loadSchemas: function(s){
            schemas = s;
        },
        setSchema: function(schemaName, pageName){
            idCount = 0;
            schema = schemas[schemaName];

            fns.setPage(pageName);
            if ( this.dispatch.Schema ) {
                var clone = fns.clonePage();
                this.dispatch.Schema.drawPage(clone);
            }
        },
        setPage: function(name){
            page = schema.pages[name];
            setupPage();
            getMatches(es);
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
        markup: function(selectorString){
            clearClass("queryCheck");
            if ( selectorString !== "" ) {
                es(selector.elements, selectorString).forEach(function(ele){
                    ele.classList.add("queryCheck");
                });
            }
        },
        events: {
            addChild: function(){
                // switch to selector tab
                ui.showView("Selector");

                var eles = es(selector.elements);
                eh(eles);
                // enter editing mode
                // set the parent to be the current element
                // turn on element select mode
            },
            addAttr: function(){

            },
            saveSelector: function(){
                // get the selector from elements that are "on"
                var vals = fns.dispatch.Selector.getValues();
                var sel = newSelector.apply(null, vals);
                var match = matchSelector(sel, selector);
                // only save if schema doesn't match pre-existing one
                if ( match === undefined ) {
                    sel.id = idCount++;
                    sel.elements = es(selector.elements, sel.selector);    
                    selector.children.push(sel);
                    // redraw the page
                    fns.dispatch.Schema.drawPage(fns.clonePage());
                    selector = sel;
                    fns.dispatch.Schema.showSelector(selector);
                }

                ui.showView("Schema");
                fns.dispatch.Selector.reset();
                eh.remove();
                chromeSave(schemas);
            },
            cancelSelector: function(){
                fns.dispatch.Selector.reset();
                eh.remove();
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
                fns.dispatch.Schema.drawPage(fns.clonePage());
                fns.dispatch.Schema.showSelector(selector);
            }
        },
        // used to interact with views
        dispatch: {},
        getData: function(){
            return page;
        }
    };

    return fns;
}