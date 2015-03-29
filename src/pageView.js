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
        addRule: function(){
            controller.addRule();
        },
        removeRule: function(d, i){
            selector.rules.splice(i, 1);
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
    var selectorRules = sf.workarea.append("div");

    sf.buttons.append("button")
        .text("add child")
        .on("click", events.addChild);

    sf.buttons.append("button")
        .text("add rule")
        .on("click", events.addRule);

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

        showRules(selectorRules, selector.rules);
    }

    function showRules(holder, rules){
        holder.selectAll("*").remove();
        if ( !rules || rules.length === 0 ) {
            holder.append("p").text("No Rules");
            return;
        }
        holder.append("p").text("Rules:");
        var ruleList = holder.append("ul");
        var lis = ruleList.selectAll("li")
                .data(rules)
            .enter().append("li")
                .text(function(d){
                    return d.name + " <" + d.attr + ">";
                });

        lis.append("button")
            .text("×")
            .on("click", events.removeRule);
    }

    function clearSelector(){
        sf.form.classed("hidden", true);
        selectorText.text("");
        selectorType.text("");
        selectorRules.selectAll("*").remove();
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