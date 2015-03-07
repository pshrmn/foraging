function SelectorView(options){

    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);


    var elementChoices = view.append("div");
    var choices;

    var form = view.append("div")
        .classed({
            "form": true,
            "hidden": true
        });

    var tags = form.append("div");
    var parts;
    var selectElement = form.append("select")
        .classed({"hidden": true});

    var saveSelector = form.append("button")
        .text("Save")
        .on("click", controller.events.saveSelector);


    var cancelSelector = view.append("button")
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
            var childCounts = ['-'].concat(d3.range(maxChildren));
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
            selectElement.selectAll("option")
                    .data(childCounts)
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
            parts.each(function(d){
                if ( this.classList.contains("on") ) {
                    sel.push(d);
                }
            });
            var index = parseInt(selectElement.property("value"));
            index = !isNaN(index) ? index : undefined;
            // no index for now
            return newSelector(sel.join(""), index);
        },
        reset: function(){
            tags.selectAll("*").remove();
            if ( choices ) {
                choices.remove();
            }
            form.classed("hidden", true);
            elementChoices.classed("hidden", false);
            selectElement.classed("hidden", true);
            selectElement.selectAll("option").remove();
        }
    };

    return fns;
}
