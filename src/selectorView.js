function SelectorView(options){

    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);


    var elementChoices = view.append("div")
        .classed({
            "column": true
        });
    var choices;


    var selectorChoices = view.append("div")
        .classed({
            "column": true
        });
    var tags = selectorChoices.append("div");
    var parts;

    // specify selector info div
    var form = view.append("div")
        .classed({
            "form": true,
            "hidden": true,
            "column": true
        });
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
                        break;
                    case "all":
                        nameGroup.classed("hidden", false);
                        selectGroup.classed("hidden", true);
                        break;
                    }
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

    var buttons = view.append("div")
        .classed({
            "column": true
        });

    var saveSelector = buttons.append("button")
        .text("Save")
        .on("click", controller.events.saveSelector);


    var cancelSelector = buttons.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelSelector);

    function markup(selector, index){
        index = parseInt(index);
        index = !isNaN(index) ? index : undefined;
        controller.markup({
            selector: selector,
            index: index
        });
    }

    var fns = {
        setChoices: function(data){
            if ( choices ) {
                choices.remove();
            }
            choices = elementChoices.selectAll("div.choice")
                .data(data);
            choices.enter().append("div")
                .classed({
                    "choice": true
                })
                .text(function(d){
                    return d.join("");
                })
                .on("click", function(d){
                    fns.addTags(d);
                    elementChoices.classed("hidden", true);
                    form.classed("hidden", false);
                });
            choices.exit().remove();
        },
        addTags: function(data){
            // initialize with full selector
            var fullSelector = data.join("");
            markup(fullSelector);
            parts = tags.selectAll("p.tag")
                .data(data);
            parts.enter().append("p")
                .classed({
                    "tag": true,
                    "on": true
                })
                .on("click", function(){
                    this.classList.toggle("on");
                    var tags = [];
                    parts.each(function(d){
                        if ( this.classList.contains("on") ) {
                            tags.push(d);
                        }
                    });
                    markup(tags.join(""), selectElement.property("value"));
                });
            var maxChildren = controller.eleCount({
                selector: fullSelector,
                index: undefined
            });
            selectElement.classed("hidden", false);
            selectElement.on("change", function(){
                var tags = [];
                parts.each(function(d){
                    if ( this.classList.contains("on") ) {
                        tags.push(d);
                    }
                });
                markup(tags.join(""), selectElement.property("value"));
            });
            var eles = selectElement.selectAll("option");
            eles.remove();
            eles.data(d3.range(maxChildren))
                .enter().append("option")
                    .text(function(d){ return d;})
                    .attr("value", function(d){ return d;});

            ui.noSelect();
            parts.text(function(d){ return d; });
            parts.exit().remove();

            return parts;
        },
        getSelector: function(){
            var sel = [];
            if ( !parts ) {
                return;
            }
            parts.each(function(d){
                if ( this.classList.contains("on") ) {
                    sel.push(d);
                }
            });
            var spec;
            var type;
            inputs.each(function(){
                if ( this.checked ) {
                    type = this.value;
                }
            });
            if ( type === "single" ) {
                var index = parseInt(selectElement.property("value"));
                spec = {
                    type: "index",
                    value: index
                };
            } else {
                var name = nameElement.property("value");
                if ( name === "" || !controller.legalName(name)){
                    return;
                }
                spec = {
                    type: "name",
                    value: name
                };
            }
            // no index for now
            return newSelector(sel.join(""), spec);
        },
        reset: function(){
            elementChoices.classed("hidden", false);

            tags.selectAll("*").remove();
            if ( choices ) {
                choices.remove();
            }
            parts = undefined;

            // form
            form.classed("hidden", true);
            inputs.property("checked", function(d, i){ return i === 0; });
            nameGroup.classed("hidden", false);
            nameElement.property("value", "");
            selectGroup.classed("hidden", true);
            selectElement.selectAll("option").remove();
        }
    };

    return fns;
}
