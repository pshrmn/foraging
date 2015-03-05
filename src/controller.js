function collectorController(){
    var schemas;
    var schema;    
    var page;
    var currentElements;
    var currentSelector;

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
        .clicked(function(element){
            var data = sp(element);
            queryCheckMarkup(data.join(""));

            var parts = fns.dispatch.Selector.addTags(data);
            parts.on("click", function(){
                    this.classList.toggle("on");
                    var tags = [];
                    parts.each(function(d){
                        if ( this.classList.contains("on") ) {
                            tags.push(d);
                        }
                    });
                    queryCheckMarkup(tags.join(""));
                });
        });

    function queryCheckMarkup(selector){
        clearClass("queryCheck");
        if ( selector !== "" ) {
            es(currentElements, selector).forEach(function(ele){
                ele.classList.add("queryCheck");
            });
        }
    }

    var fns = {
        loadSchemas: function(s){
            schemas = s;
        },
        setSchema: function(s, p){
            schema = schemas[s];
            page = schema.pages[p];
            if ( this.dispatch.Schema ) {
                // lazy clone the page because the layout removes the children array
                var clone = JSON.parse(JSON.stringify(page));
                this.dispatch.Schema.drawPage(clone);
            }
            schema = s;
        },
        setPage: function(name){
            page = schema.pages[name];
            return page;
        },
        setSelector: function(d){
            var path = tracePath(page, d.id);
            // currentSelector is the last element in the path
            currentSelector = path[path.length-1];
            currentElements = queryPath(path);
            console.log(currentSelector, currentElements);
        },
        events: {
            addChild: function(){
                // switch to selector tab
                ui.showView("Selector");

                var eles = es(currentElements);
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
                currentSelector.children.push(sel);
                // redraw the page
                var clone = JSON.parse(JSON.stringify(page));
                fns.dispatch.Schema.drawPage(clone);
                ui.showView("Schema");
                chromeSave(schemas);
            },
            cancelSelector: function(){
                fns.dispatch.Selector.reset();
                eh.remove();
                ui.showView("Schema");
            }
        },
        // used to interact with views
        dispatch: {}
    };

    return fns;
}