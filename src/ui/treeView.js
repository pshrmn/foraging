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
        .attr("transform", `translate(${margin.left},${margin.top})`);
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
                return `translate(${d.y},${d.x})`; }
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
