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