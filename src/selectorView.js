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
    var formState = {
        selector: "",
        type: "name",
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
                // SPECIAL CASE FOR SELECT ELEMENTS, AUTOMATICALLY ADD OPTION CHILD
                if ( allSelects(sel.elements ) ) {
                    var optionsName = prompt("What should the options be called?");
                    if ( optionsName === null || optionsName.trim() === "" ) {
                        optionsName = "options";
                    }
                    var optionsSelector = newSelector("option", {
                        type: "name",
                        value: optionsName
                    });
                    sel.children.push(optionsSelector);
                }
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
            if ( formState.selector === "" ) {
                return;
            }
            addTags();
            showSelectorForm();
        },
        confirmSelector: function(){
            if ( formState.selector === "" ) {
                return;
            }
            setupForm();
            showTypeForm();
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
        },
        toggleRadio: function(){
            switch ( this.value ) {
            case "index":
                nameGroup.classed("hidden", true);
                selectGroup.classed("hidden", false);
                formState.type = "index";
                formState.value = parseInt(selectElement.property("value"));
                break;
            case "name":
                nameGroup.classed("hidden", false);
                selectGroup.classed("hidden", true);
                formState.type = "name";
                formState.value = undefined;
                break;
            }
            markup();
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
            .data(["name", "index"])
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

    var nameGroup = st.workarea.append("div");
    var nameElement = nameGroup.append("p").append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text");

    var selectGroup = st.workarea.append("div")
        .classed({"hidden": true});

    var selectElement = selectGroup.append("p").append("label")
        .text("Index:")
        .append("select");

    st.buttons.append("button")
        .text("Save")
        .on("click", events.saveSelector);


    st.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelSelector);

    // end selectorType
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
        switch (formState.type){
        case "index":
            spec.type = "index";
            spec.value = parseInt(selectElement.property("value"));
            break;
        case "name":
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
        .ignoreClasses(["collectHighlight", "queryCheck", "selectableElement"]);

    function markup(){
        showcase.remove();
        var sel = formState.selector;
        // don't markup empty selector
        if ( sel === "" ) {
            return;
        }
        var spec;
        if ( formState.type === "index" ) {
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

        var choices = choiceHolder.selectAll("div.tag")
            .data(data);
        choices.enter().append("div")
            .classed({
                "tag": true,
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
        parts = tags.selectAll("div.tag")
            .data(choice);
        parts.enter().append("div")
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

    function allSelects(elements){
        return elements.every(function(e){
            return e.tagName === "SELECT";
        });
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
            formState = {
                selector: "",
                type: "name",
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
