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
    var saveSelector = form.append("button")
        .text("Save")
        .on("click", controller.events.saveSelector);

    var cancelSelector = form.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelSelector);

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
            controller.markup(data.join(""));

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
                    controller.markup(tags.join(""));
                });
            ui.noSelect();
            parts.text(function(d){ return d; });
            parts.exit().remove();

            return parts;
        },
        getValues: function(){
            var sel = [];
            parts.each(function(d){
                if ( this.classList.contains("on") ) {
                    sel.push(d);
                }
            });
            // no index for now
            return [sel.join(""), undefined];
        },
        reset: function(){
            tags.selectAll("*").remove();
            choices.remove();
            form.classed("hidden", true);
            elementChoices.classed("hidden", false);
        }
    };

    return fns;
}
