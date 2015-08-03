function SelectorView(options){
    // the view is broken into three forms:
    //      elementChoices
    //      selectorChoices
    //      selectorType
    options = options || {};
    var view = options.view || d3.select("body");

    var choice;
    var choiceElement;
    var selector = "";
    var radioType = "single";

    var events = {
        saveSelector: function(){
            var sel = makeSelector();
            if ( sel === undefined || sel.selector === "" ) {
                typeForm.showError("\"all\" selector requires a name");
                return;
            }
            var resp = controller.saveSelector(sel);
            if ( !resp.error ) {
                fns.reset();
                interactive.remove();
                showcase.remove();
            } else {
                typeForm.showError(resp.msg);
            }
        },
        selectChoice: function(d){
            showcase.remove();
            viewChoice(d, this);
            var parent = controller.getSelector();
            selector = d.join("");
            var tempSpec = {
                type: "all"
            };
            count(tempSpec, elementCount);
            markup(tempSpec);
        },
        confirmElement: function(){
            if ( selector === "" ) {
                elementForm.showError("No element selected");
                return;
            }
            addTags();
            showSelectorForm();
        },
        confirmSelector: function(){
            if ( selector === "" ) {
                selectorForm.showError("Selector cannot be empty");
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
            var tempSpec = {
                type: "all"
            };
            count(tempSpec, selectorCount);
            markup(tempSpec);
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
    var elementForm = newForm(view, false);

    elementForm.workarea.append("p")
        .text("Choose Element:");

    var choiceHolder = elementForm.workarea.append("div");

    var elementCount = elementForm.workarea.append("p")
        .text("Count:")
        .append("span")
            .text("0");

    elementForm.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmElement);
    elementForm.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end elements

    // start selector
    var selectorForm = newForm(view, true);

    selectorForm.workarea.append("p")
        .text("Choose Selector:");
    var tags = selectorForm.workarea.append("div");
    var parts;

    var selectorCount = selectorForm.workarea.append("p")
        .text("Count:")
        .append("span")
            .text("0");

    selectorForm.buttons.append("button")
        .text("Confirm")
        .on("click", events.confirmSelector);
    selectorForm.buttons.append("button")
        .classed("red", true)
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end selector

    // start typeForm
    var typeForm = newForm(view, true);

    var radioDiv = typeForm.workarea.append("div");
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
        .attr("name", "selector-type")
        .attr("id", function(d){ return "radio-" + d;})
        .property("value", function(d){ return d;})
        .property("checked", function(d, i){ return i === 0; })
        .on("change", events.toggleRadio);

    var selectGroup = typeForm.workarea.append("div");

    var nameGroup = typeForm.workarea.append("div")
        .classed({"hidden": true});

    var nameElement = nameGroup.append("p").append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");


    var selectElement = selectGroup.append("p").append("label")
        .text("Index:")
        .append("select");

    var optionalCheckbox = typeForm.workarea.append("p").append("label")
        .text("Optional")
        .append("input")
            .attr("type", "checkbox");

    typeForm.buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    typeForm.buttons.append("button")
        .classed("red", true)
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
        elementForm.clearErrors();
        elementCount.text("0");
        elementForm.form.classed("hidden", false);
        selectorForm.form.classed("hidden", true);
        typeForm.form.classed("hidden", true);
    }

    function showSelectorForm(){
        selectorForm.clearErrors();
        count({"type": "all"}, selectorCount);
        elementForm.form.classed("hidden", true);
        selectorForm.form.classed("hidden", false);
        typeForm.form.classed("hidden", true);
    }

    function showTypeForm(){
        typeForm.clearErrors();
        elementForm.form.classed("hidden", true);
        selectorForm.form.classed("hidden", true);
        typeForm.form.classed("hidden", false);
        markup({
            type: "single",
            value: 0
        });
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
        .ignoreClasses(["forager-highlight", "query-check",
            "selectable-element", "current-selector"]);

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

    function count(spec, holder){
        var sel = selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var parent = controller.getSelector();
        var eleCount = controller.elements.count(parent.elements, sel, spec);
        holder.text(eleCount);
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
