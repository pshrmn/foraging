function SelectorView(options){

    options = options || {};
    var holder = options.holder || "body";
    var view = d3.select(holder);


    var form = view.append("div")
        .classed({
            "form": true
        });
    var tags = form.append("div");
    var parts;
    var saveSelector = form.append("button")
        .text("Save")
        .on("click", controller.events.saveSelector);

    var cancelSelector = form.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelSelector);

    return {
        addTags: function(data){
            parts = tags.selectAll("p.tag")
                .data(data);
            parts.enter().append("p")
                .classed({
                    "tag": true,
                    "on": true
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
        }
    };
}
