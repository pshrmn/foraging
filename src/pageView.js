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
            showSelector();
            drawPage();
            controller.setVals(page, selector);
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
        function set(s){
            s.id = controller.nextId();
            s.children.forEach(function(s){
                set(s);
            });
        }
        set(page);
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

        showAttrs(selectorAttrs, selector.attrs);
    }

    function showAttrs(holder, attrs){
        holder.selectAll("*").remove();
        if ( !attrs || attrs.length === 0 ) {
            holder.append("p").text("No Attrs");
            return;
        }
        holder.append("p").text("Attrs:");
        var table = holder.append("table");

        var tb = table.append("tbody");
        var rows = tb.selectAll("tr")
            .data(attrs);
        rows.enter().append("tr")
            .classed({
                "attr": true
            });

        rows.append("td").text(function(d){ return d.name; });
        rows.append("td").text(function(d){ return d.attr; });
        rows.append("td")
            .append("button")
                .text("×")
                .on("click", events.removeAttr);
        rows.exit().remove();
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
                "node": true
            })
            .on("click", function(d){
                clearClass("currentSelector");
                this.classList.add("currentSelector");
                selector = d;
                showSelector();
                fns.setSelector(d);
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

        node.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        node.append("text")
            .attr("y", 5)
            .style("fill", empty)
            .attr("dx", -5)
            .text(function(d){
                switch ( d.spec.type ) {
                case "index":
                    return d.selector + "[" + d.spec.value + "]";
                case "name":
                    return "[" + d.selector + "]";
                }
            });

        node.append("circle")
            .filter(function(d){
                return d.spec.type === "index";
            })
            .attr("r", 3)
            .style("fill", empty);

        node.append("rect")
            .filter(function(d){
                return d.spec.type === "name";
            })
            .attr("width", 6)
            .attr("height", 6)
            .attr("x", -3)
            .attr("y", -3)
            .style("fill", empty);

        node.exit().remove();
    }

    function empty(sel){
        var hasAttrs = sel.attrs.length;
        var hasChildren = sel.children ? sel.children.length > 0 : false;
        return hasAttrs || hasChildren ? "#21732C" : "#CF2558";
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