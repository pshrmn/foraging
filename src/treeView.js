function TreeView(options){

    var page;
    var selector;
    var currentSelector;

    options = options || {};
    var holder = options.holder || document.body;
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
        },
        enterNode: function(d){
            d.elements.forEach(function(ele){
                ele.classList.add("saved-preview");
            });
        },
        exitNode: function(d){
            d.elements.forEach(function(ele){
                ele.classList.remove("saved-preview");
            });
        }
    };

    /***
    START UI
    ***/
    var view = d3.select(holder);

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
    /***
    END UI
    ***/

    function empty(sel){
        var hasAttrs = sel.attrs.length;
        var hasChildren = sel.children ? sel.children.length > 0 : false;
        return !hasAttrs && !hasChildren;
    }

    var fns = {
        draw: function(page, currentId){
            currentId = currentId || 0;
            if ( link ) {
                link.remove();
            }
            if ( node ) {
                node.remove();
            }

            var nodes = tree.nodes(page);
            var links = tree.links(nodes);
            link = g.selectAll(".link")
                .data(links, function(d) { return d.source.id + "-" + d.target.id; });
            node = g.selectAll(".node")
                .data(nodes, function(d) { return d.id; });

                
            link.enter().append("path")
                .attr("class", "link");

            link.attr("d", diagonal);
            link.exit().remove();

            node.enter().append("g")
                .classed({
                    "node": true,
                    "empty": empty,
                    "current": function(d){ return d.id === currentId; }
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
            svg.classed("not-allowed", false);
        },
        setCurrent: function(id){
            svg.selectAll(".node").classed("current", function(d){
                return d.id === id;
            });
        },
        turnOn: function(){
            svg.classed("not-allowed", false);
            g.selectAll(".node")
                .on("click", events.clickNode)
                .on("mouseenter", events.enterNode)
                .on("mouseleave", events.exitNode);
        },
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
        }
    };
    return fns;
}
