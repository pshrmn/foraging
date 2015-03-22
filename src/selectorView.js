function SelectorView(options){
    // the view is broken into three columns:
    //      elementChoices
    //      selectorChoices
    //      form
    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);

    var choice;
    var choiceElement;
    var formState = {
        selector: "",
        type: "all",
        value: undefined
    };

    var events = {
        saveSelector: function(){
            var sel = makeSelector();
            if ( sel === undefined || sel.selector === "" ) {
                return;
            }
            var parent = controller.getSelector();
            // only save if page doesn't have 
            if ( !matchSelector(sel, parent) ) {
                sel.id = controller.nextId();
                sel.elements = controller.elements(parent.elements, sel.selector, sel.spec);
                controller.saveSelector(sel);
            }

            fns.reset();
            interactive.remove();
            showcase.remove();
        },
        selectChoice: function(d){
            showcase.remove();
            viewChoice(d, this);
            var parent = controller.getSelector();
            formState.selector = d.join("");
            markup();
        },
        confirmElement: function(){
            addTags();
            showSelectorColumn();
        },
        confirmSelector: function(){

            setupForm();
            showFormColumn();
        },
        cancelSelector: function(){
            fns.reset();
            ui.showView("Page");
        },
        toggleTag: function(){
            this.classList.toggle("on");
            formState.selector = currentSelector();
            markup();
        },
        selectorIndex: function(){
            formState.selector = currentSelector();
            formState.value = selectElement.property("value");
            markup();
        }
    };

    // start elements
    var elementChoices = view.append("div")
        .classed({
            "column": true
        });
    elementChoices.append("p")
        .text("Choose Element:");
    var choiceHolder = elementChoices.append("div");
    elementChoices.append("button")
        .text("Confirm")
        .on("click", events.confirmElement);
    elementChoices.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end elements

    // start selector
    var selectorChoices = view.append("div")
        .classed({
            "column": true,
            "hidden": true
        });
    selectorChoices.append("p")
        .text("Choose Selector:");
    var tags = selectorChoices.append("div");
    var parts;

    selectorChoices.append("button")
        .text("Confirm")
        .on("click", events.confirmSelector);
    selectorChoices.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);
    // end selector

    // start form
    var form = view.append("div")
        .classed({
            "form": true,
            "hidden": true,
            "column": true
        });
    form.append("p")
        .text("Choose Type:");
    var inputs = form.append("div").selectAll("label")
            .data(["all", "single"])
        .enter().append("label")
            .text(function(d){ return d;})
            .append("input")
                .attr("type", "radio")
                .attr("name", "type")
                .property("value", function(d){ return d;})
                .property("checked", function(d, i){ return i === 0; })
                .on("change", function(){
                    switch ( this.value ) {
                    case "single":
                        nameGroup.classed("hidden", true);
                        selectGroup.classed("hidden", false);
                        formState.type = "single";
                        formState.value = parseInt(selectElement.property("value"));
                        break;
                    case "all":
                        nameGroup.classed("hidden", false);
                        selectGroup.classed("hidden", true);
                        formState.type = "all";
                        formState.value = undefined;
                        break;
                    }
                    markup();
                });

    var nameGroup = form.append("div");
    var nameElement = nameGroup.append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");

    var selectGroup = form.append("div")
        .classed({"hidden": true});

    var selectElement = selectGroup.append("label")
        .text("Index:")
        .append("select");

    var buttons = form.append("div");

    buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);

    // end form
    // end ui

        // apply the queryCheck class to selected elements
    var showcase = highlightElements()
        .cssClass("queryCheck");

    var interactive = interactiveElements()
        .cssClass("selectableElement")
        .hoverClass("collectHighlight")
        .clicked(function selectOption(event){
            event.preventDefault();
            event.stopPropagation();
            var data = [].slice.call(event.path)
                .filter(function(ele){
                    return ele.classList && ele.classList.contains("selectableElement");
                })
                .reverse()
                .map(function(ele){
                    return getParts(ele);
                });
            setChoices(data);
        });

    function showElementColumn(){
        elementChoices.classed("hidden", false);
        selectorChoices.classed("hidden", true);
        form.classed("hidden", true);
    }

    function showSelectorColumn(){
        elementChoices.classed("hidden", true);
        selectorChoices.classed("hidden", false);
        form.classed("hidden", true);
    }

    function showFormColumn(){
        elementChoices.classed("hidden", true);
        selectorChoices.classed("hidden", true);
        form.classed("hidden", false);
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
        switch (formState.type){
        case "single":
            spec.type = "index";
            spec.value = parseInt(selectElement.property("value"));
            break;
        case "all":
            var name = nameElement.property("value");
            if ( name === "" || !controller.legalName(name)){
                return;
            }
            spec.type = "name";
            spec.value = name;
            break;
        }
        return newSelector(sel.join(""), spec);
    }

    // parts is given an element and returns an array containing its tag
    // and (if they exist) its id and any classes
    var getParts = selectorParts()
        .ignoreClasses(["collectHighlight", "queryCheck",
            "selectedElement", "selectableElement"]);

    function markup(){
        showcase.remove();
        var sel = formState.selector;
        var spec;
        if ( formState.type === "single" ) {
            spec = {
                type: "index",
                value: formState.value
            };
        } else {
            spec = {};
        }
        var parent = controller.getSelector();
        showcase(controller.elements(parent.elements, sel, spec));
    }

    function setChoices(data){
        interactive.remove();

        var choices = choiceHolder.selectAll("div.choice")
            .data(data);
        choices.enter().append("div")
            .classed({
                "choice": true,
                "noSelect": true
            })
            .on("click", events.selectChoice);
        choices.text(function(d){ return d.join(""); });
        choices.exit().remove();
    }

    function addTags(){
        if ( !choice ) {
            return;
        }
        formState.selector = choice.join("");
        markup();
        parts = tags.selectAll("p.tag")
            .data(choice);
        parts.enter().append("p")
            .classed({
                "tag": true,
                "on": true,
                "noSelect": true
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
        var maxChildren = controller.eleCount(formState.selector);

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
            showElementColumn();
            interactive.remove();
            showcase.remove();
            parts = undefined;
            choice = undefined;
            choiceElement = undefined;

            tags.selectAll("*").remove();
            choiceHolder.selectAll("*").remove();

            // form
            inputs.property("checked", function(d, i){ return i === 0; });
            formState = {
                selector: "",
                type: "all",
                value: undefined
            };
            nameGroup.classed("hidden", false);
            nameElement.property("value", "");
            selectGroup.classed("hidden", true);
            selectElement.selectAll("option").remove();
        }
    };

    return fns;
}
