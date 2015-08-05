function OptionsView(options) {
    options = options || {};
    var ignorable = [
        "class", "id", "src", "href", "style", "alt", "title", "target",
        "tabindex", "type"
    ];

    var parent = d3.select(options.parent || document.body);

    function closeAndSaveModal(){
        var opts = {};
        opts.attrs = {};
        ignoreOptions.each(function(d, i){
            if ( this.checked ) {
                opts.attrs[d] = true;
            }
        });
        chromeSaveOptions(opts);
        holder.classed("hidden", true);
    }

    var holder = parent.append("div")
        .classed({
            "no-select": true,
            "modal-holder": true,
            "hidden": true
        });

    var background = holder.append("div")
        .classed({
            "background": true,
            "no-select": true
        })
        .attr("title", "click to close preview")
        .on("click", closeAndSaveModal);

    var modal = holder.append("div")
        .classed({
            "no-select": true,
            "cjs-modal": true,
            "options-modal": true
        });

    var ignorePart = modal.append("div");

    ignorePart.append("p")
        .text("Hidden Attributes");
    var close = modal.append("button")
        .classed("no-select", true)
        .text("close")
        .on("click", closeAndSaveModal);


    var ignoreOptions = ignorePart.selectAll("label")
            .data(ignorable)
        .enter().append("label")
            .text(function(d){ return d; })
            .append("input")
                .attr("type", "checkbox")
                .classed({
                    "option-radio": true
                })
                .property("checked", false);

    return {
        show: function() {
            holder.classed("hidden", false);
        },
        setOptions: function(opts) {
            ignoreOptions.each(function(d, i) {
                d3.select(this).property("checked", opts.attrs[d] !== undefined);
            });
        },
        ignoredAttributes: function() {
            // automatically ignore the on___ functions
            var ignored = {
                "onblur": true,
                "onchange": true,
                "onclick": true,
                "onfocus": true,
                "onkeydown": true,
                "onkeypress": true,
                "onkeyup": true,
                "onload": true,
                "onmousedown": true,
                "onmouseout": true,
                "onmouseover": true,
                "onmouseup": true,
                "onreset": true,
                "onselect": true,
                "onsubmit": true,
                "onunload": true
            };
            ignoreOptions.each(function(d){
                if ( this.checked ) {
                    ignored[d] = true;
                }
            });
            return ignored;
        }
    };
}