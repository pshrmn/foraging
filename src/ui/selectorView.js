function SelectorView(options){
    // the view is broken into three forms:
    //      elementChoices
    //      selectorChoices
    //      selectorType
    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);

    var choice;
    var choiceElement;
    var selector = "";
    var radioType = "single";

    var events = {
        saveSelector: function(){
            var sel = makeSelector();
            if ( sel === undefined || sel.selector === "" ) {
                return;
            }
            var success = controller.saveSelector(sel);
            if ( success ) {
                fns.reset();
                interactive.remove();
                showcase.remove();
            }
        },
        selectChoice: function(d){
            showcase.remove();
            viewChoice(d, this);
            var parent = controller.getSelector();
            selector = d.join("");
            markup({
                type: "all"
            });
        },
        confirmElement: function(){
            if ( selector === "" ) {
                return;
            }
            addTags();
            showSelectorForm();
        },
        confirmSelector: function(){
            if ( selector === "" ) {
                return;
            }
            setupForm();
            showTypeForm();
        },
        cancelSelector: function(){
            fns.reset();
            controller.cancelSelector();
        },
        toggleTag: function(){
            this.classList.toggle("on");
            selector = currentSelector();
            markup({
                type: "all"
            });
        },
        selectorIndex: function(){
            selector = currentSelector();
            markup({
                type: "single",
                value: parseInt(selectElement.property("value"), 10)
            });
        },
        toggleRadio: function(){
            switch ( this.value ) {
            case "single":
                nameGroup.classed("hidden", true);
                selectGroup.classed("hidden", false);
                radioType = "single";
                markup({
                    type: "single",
                    value: parseInt(selectElement.property("value"))
                });
                break;
            case "all":
                nameGroup.classed("hidden", false);
                selectGroup.classed("hidden", true);
                radioType = "all";
                markup({
                    type: "all"
                });
                break;
            }
        }
    };

    // start elements
    var ec = newForm(view, false);

    ec.workarea.append("p")
        .text("Choose Element:");
    var choiceHolder = ec.workarea.append("div");

    ec.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmElement);
    ec.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end elements

    // start selector
    var sc = newForm(view, true);

    sc.workarea.append("p")
        .text("Choose Selector:");
    var tags = sc.workarea.append("div");
    var parts;

    sc.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmSelector);
    sc.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end selector

    // start selectorType
    var st = newForm(view, true);

    var radioDiv = st.workarea.append("div");
    radioDiv.append("span")
        .text("Choose Type:");

    var inputHolders = radioDiv.selectAll("span.radio")
            .data(["single", "all"])
        .enter().append("span")
            .classed("radio", true);
    inputHolders.append("label")
        .text(function(d){ return d;})
        .attr("for", function(d){ return "radio-" + d;});
    
    var radios = inputHolders.append("input")
        .attr("type", "radio")
        .attr("name", "type")
        .attr("id", function(d){ return "radio-" + d;})
        .property("value", function(d){ return d;})
        .property("checked", function(d, i){ return i === 0; })
        .on("change", events.toggleRadio);

    var selectGroup = st.workarea.append("div");

    var nameGroup = st.workarea.append("div")
        .classed({"hidden": true});

    var nameElement = nameGroup.append("p").append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");


    var selectElement = selectGroup.append("p").append("label")
        .text("Index:")
        .append("select");

    var optionalCheckbox = st.workarea.append("p").append("label")
        .text("Optional")
        .append("input")
            .attr("type", "checkbox");

    st.buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    st.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);

    // end selectorType
    // end ui

        // apply the query-check class to selected elements
    var showcase = highlightElements()
        .cssClass("query-check");

    var interactive = interactiveElements()
        .cssClass("selectable-element")
        .hoverClass("forager-highlight")
        .clicked(function selectOption(event){
            event.preventDefault();
            event.stopPropagation();
            var data = [].slice.call(event.path)
                .filter(function(ele){
                    return ele.classList && ele.classList.contains("selectable-element");
                })
                .reverse()
                .map(function(ele){
                    return getParts(ele);
                });
            setChoices(data);
        });

    function showElementForm(){
        ec.form.classed("hidden", false);
        sc.form.classed("hidden", true);
        st.form.classed("hidden", true);
    }

    function showSelectorForm(){
        ec.form.classed("hidden", true);
        sc.form.classed("hidden", false);
        st.form.classed("hidden", true);
    }

    function showTypeForm(){
        ec.form.classed("hidden", true);
        sc.form.classed("hidden", true);
        st.form.classed("hidden", false);
    }


    /***
    create a new selector based on the user's choices
    ***/
    function makeSelector(){
        var sel = [];
        if ( !parts ) {
            return;
        }
        parts.each(function(d){
            if ( this.classList.contains("on") ) {
                sel.push(d);
            }
        });
        var spec = {};

        switch (radioType){
        case "single":
            spec.type = "single";
            spec.value = parseInt(selectElement.property("value"));
            break;
        case "all":
            var name = nameElement.property("value");
            if ( name === "" || !controller.legalName(name)){
                return;
            }
            spec.type = "all";
            spec.value = name;
            break;
        }
        var optional = optionalCheckbox.property("checked");

        return newSelector(sel.join(""), spec, optional);
    }

    // parts is given an element and returns an array containing its tag
    // and (if they exist) its id and any classes
    var getParts = selectorParts()
        .ignoreClasses(["forager-highlight", "query-check", "selectable-element"]);

    function markup(spec){
        showcase.remove();
        var sel = selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var parent = controller.getSelector();
        showcase(controller.elements(parent.elements, sel, spec));
    }

    function setChoices(data){
        interactive.remove();

        var choices = choiceHolder.selectAll("div.tag")
            .data(data);
        choices.enter().append("div")
            .classed({
                "tag": true,
                "no-select": true
            })
            .on("click", events.selectChoice);
        choices.text(function(d){ return d.join(""); });
        choices.exit().remove();
    }

    function addTags(){
        if ( !choice ) {
            return;
        }
        selector = choice.join("");
        markup({
            type: "all"
        });
        parts = tags.selectAll("div.tag")
            .data(choice);
        parts.enter().append("div")
            .classed({
                "tag": true,
                "on": true,
                "no-select": true
            })
            .on("click", events.toggleTag);
        
        parts.text(function(d){ return d; });
        parts.exit().remove();

        ui.noSelect();
        return parts;
    }

    function setupForm(){
        selectElement.classed("hidden", false);
        selectElement.on("change", events.selectorIndex);
        var eles = selectElement.selectAll("option");
        eles.remove();
        var maxChildren = controller.eleCount(selector);

        eles.data(d3.range(maxChildren))
            .enter().append("option")
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;});
    }

    function viewChoice(d, ele){
        if ( choiceElement ) {
            choiceElement.classList.remove("on");
        }
        ele.classList.add("on");
        choiceElement = ele;
        choice = d;
    }

    function currentSelector(){
        var tags = [];
        parts.each(function(d){
            if ( this.classList.contains("on") ) {
                tags.push(d);
            }
        });
        return tags.join("");
    }

    var fns = {
        setup: function(eles){
            interactive(eles);
        },
        reset: function(){
            showElementForm();
            interactive.remove();
            showcase.remove();
            parts = undefined;
            choice = undefined;
            choiceElement = undefined;

            tags.selectAll("*").remove();
            choiceHolder.selectAll("*").remove();

            // form
            radios.property("checked", function(d, i){ return i === 0; });
            optionalCheckbox.property("checked", false);
            selector = "";
            radioType = "single";
            selectGroup.classed("hidden", false);
            selectElement.selectAll("option").remove();
            nameGroup.classed("hidden", true);
            nameElement.property("value", "");
        }
    };

    return fns;
}
