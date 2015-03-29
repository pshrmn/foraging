function PageView(options){
    /**********
        UI
    **********/
    options = options || {};
    var holder = options.holder || document.body;

    var page;
    var selector;

    var events = {
        addChild: function(){
            controller.addSelector();
        },
        addAttr: function(){
            controller.addAttr();
        },
        removeAttr: function(d, i){
            selector.attrs.splice(i, 1);
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
    var view = d3.select(holder);

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

    function showSelector(){
        sf.form.classed("hidden", false);
        selectorText.text(selector.selector);
        var type = selector.spec.type;
        var typeCap = type.charAt(0).toUpperCase() + type.slice(1);
        selectorType.text(typeCap + ": " + selector.spec.value);

        var currentId = selector.id;
        d3.selectAll(".node").classed("current", function(d){
            return d.id === currentId;
        });

        showAttrs(selectorAttrs, selector.attrs);
    }

    function showAttrs(holder, attrs){
        holder.selectAll("*").remove();
        if ( !attrs || attrs.length === 0 ) {
            holder.append("p").text("No Attrs");
            return;
        }
        holder.append("p").text("Attrs:");
        var attrList = holder.append("ul");
        var lis = attrList.selectAll("li")
                .data(attrs)
            .enter().append("li")
                .text(function(d){
                    return d.name + " <" + d.attr + ">";
                });

        lis.append("button")
            .text("×")
            .on("click", events.removeAttr);
    }

    function clearSelector(){
        sf.form.classed("hidden", true);
        selectorText.text("");
        selectorType.text("");
        selectorAttrs.selectAll("*").remove();
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