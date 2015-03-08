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