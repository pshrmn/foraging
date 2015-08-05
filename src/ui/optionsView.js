function OptionsView(options) {
    options = options || {};
    var ignorable = [
        "class", "id", "src", "href", "style", "alt", "title", "value",
        "target", "tabindex", "type"
    ];
    var eventAttrs = [
        "onblur", "onchange", "onclick", "onfocus", "onkeydown", "onkeypress",
        "onkeyup", "onload", "onmousedown", "onmouseout", "onmouseover",
        "onmouseup", "onreset", "onselect", "onsubmit", "onunload"
    ];
    var tableAttrs = [
        "axis", "cellpadding", "cellspacing", "char", "charoff", "colspan",
        "frame", "headers", "nowrap", "rowspan", "rule", "scope", "valign"
    ];
    var styleAttrs = [
        "align", "background", "bgcolor", "border", "color", "frameborder",
        "height", "marginheight", "marginwidth", "maxlength", "width"
    ];

    var parent = d3.select(options.parent || document.body);

    function closeAndSaveModal(){
        var opts = {};
        // ignored attributes
        opts.attrs = {};
        ignoreOptions.each(function(d, i){
            if ( this.checked ) {
                opts.attrs[d] = true;
            }
        });
        // ignore table and style attrs?
        opts.table = tableCheckbox.property("checked");
        opts.style = styleCheckbox.property("checked");
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
        .attr("title", "click to save and close options")
        .on("click", closeAndSaveModal);

    var modal = holder.append("div")
        .classed({
            "no-select": true,
            "cjs-modal": true,
            "options-modal": true
        });

    modal.append("h2")
        .text("Options");

    modal.append("p")
        .classed("note", true)
        .text("Options will be saved automatically when you click Close");

    var ignorePart = modal.append("div");
    var baseAttrs = ignorePart.append("div");
    var groupAttrs = ignorePart.append("div");

    baseAttrs.append("h3")
        .text("Hidden Attributes");

    var ignoreOptions = baseAttrs.selectAll("label")
            .data(ignorable)
        .enter().append("label")
            .text(function(d){ return d; })
            .append("input")
                .attr("type", "checkbox")
                .classed({
                    "option-radio": true
                })
                .property("checked", false);

    groupAttrs.append("h3")
        .text("Hide Related Groups of Attributes");
    groupAttrs.append("p")
        .classed("note", true)
        .text("Hover over checkbox to see affected attributes");

    var tableCheckbox = groupAttrs.append("div").append("label")
        .text("Table Attributes")
        .attr("title", tableAttrs.join(", "))
        .append("input")
            .attr("type","checkbox");

    var styleCheckbox = groupAttrs.append("div").append("label")
        .text("Style Attributes")
        .attr("title", styleAttrs.join(", "))
        .append("input")
            .attr("type","checkbox");

    var close = modal.append("button")
        .classed("no-select", true)
        .text("close")
        .on("click", closeAndSaveModal);

    return {
        show: function() {
            holder.classed("hidden", false);
        },
        setOptions: function(opts) {
            ignoreOptions.each(function(d, i) {
                d3.select(this).property("checked", opts.attrs[d] !== undefined);
            });
            if ( opts.table ) {
                tableCheckbox.property("checked", true);
            }
            if ( opts.style ) {
                styleCheckbox.property("checked", true);
            }
        },
        ignoredAttributes: function() {
            // automatically ignore the on___ functions
            var ignored = {};
            eventAttrs.forEach(function(attr){
                ignored[attr] = true;
            });
            ignoreOptions.each(function(d){
                if ( this.checked ) {
                    ignored[d] = true;
                }
            });
            if ( tableCheckbox.property("checked") ) {
                tableAttrs.forEach(function(attr){
                    ignored[attr] = true;
                });
            }
            if ( styleCheckbox.property("checked") ) {
                styleAttrs.forEach(function(attr){
                    ignored[attr] = true;
                });
            }
            return ignored;
        }
    };
}