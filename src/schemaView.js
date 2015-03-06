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
    /*
    var edit = form.append("button")
        .text("edit")
        .on("click", function(){
            // show the selectorView
        });
    */

    var remove = form.append("button")
        .text("remove")
        .on("click", controller.events.removeSelector);

    var addChild = form.append("button")
        .text("add child")
        .on("click", controller.events.addChild);

    var addAttr = form.append("button")
        .text("add attr")
        .on("click", controller.events.addAttr);


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
        drawPage: function(page){
            if ( !page ) {
                return;
            }

            var nodes = tree.nodes(page);
            var links = tree.links(nodes);
            var link = svg.selectAll(".link")
                .data(links, function(d) { return d.source.id + "-" + d.target.id; });
            var node = svg.selectAll(".node")
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
                    return d.selector;
                });

            node.exit().remove();
        },
        showSelector: function(selector){
            form.classed("hidden", false);
            selectorText.text(selector.selector);
        },
        hideSelector: function(){
            form.classed("hidden", true);
        }
    };
}