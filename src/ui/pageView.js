function PageView(options){
    /**********
        UI
    **********/
    options = options || {};

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
    var view = options.view || d3.select("body");

    // start selector
    var sf = newForm(view, true);
    sf.form.classed("inline", true);

    var selectorText = sf.workarea.append("p")
        .classed("selector", true);
    var selectorType = sf.workarea.append("p");
    var selectorRules = sf.workarea.append("div");

    sf.buttons.append("button")
        .classed("add-child", true)
        .text("add child")
        .on("click", events.addChild);

    sf.buttons.append("button")
        .classed("add-rule", true)
        .text("add rule")
        .on("click", events.addRule);

    sf.buttons.append("button")
        .classed("remove-selector", true)
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
        var desc = "";
        switch (type){
        case "single":
            desc = `Select element at index ${selector.spec.value}`;
            break;
        case "all":
            desc = `Select all elements, save as "${selector.spec.value}"`;
            break;
        }
        selectorType.text(desc);

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
            .enter().append("li");

        lis.append("span")
            .classed("name", true)
            .text(function(d){
                return d.name;
            });
        lis.append("span")
            .text(function(d){
                return "<" + d.attr + ">";
            });

        lis.append("span")
            .text(function(d){
                return "(" + d.type + ")";
            });

        lis.append("button")
            .classed("red", true)
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