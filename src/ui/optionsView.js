function OptionsView(options) {
    options = options || {};
    // list of attributes that can be individually ignored. class, id, and type
    // can most likely be checked. src and href probably shouldn't be ignored
    // but perhaps there could be a reason to ignore them, so the are included
    var ignorable = [
        "class", "id", "src", "href", "style", "alt", "title", "value",
        "target", "tabindex", "type"
    ];
    // list of event related attributes. These are always ignored
    var eventAttrs = [
        "onblur", "onchange", "onclick", "onfocus", "onkeydown", "onkeypress",
        "onkeyup", "onload", "onmousedown", "onmouseout", "onmouseover",
        "onmouseup", "onreset", "onselect", "onsubmit", "onunload"
    ];
    // list of table attributes that can be ignored en masse
    var tableAttrs = [
        "axis", "cellpadding", "cellspacing", "char", "charoff", "colspan",
        "frame", "headers", "nowrap", "rowspan", "rule", "scope", "valign"
    ];
    // list of style attributes that can be ignored en masse
    var styleAttrs = [
        "align", "background", "bgcolor", "border", "color", "frameborder",
        "height", "marginheight", "marginwidth", "maxlength", "width"
    ];

    /*
     * currentIgnored is an object of string-boolean key-value pairs
     * where the string is the name of an attribute, and if it is true
     * that attribute should be ignored
     * the object is updated whenever the radio buttons are toggled
     */
    var currentIgnored = {};
    eventAttrs.forEach(function(attr){
        currentIgnored[attr] = true;
    });

    /*
     * events
     */
    function toggleIgnore(d, i){
        currentIgnored[d] = !currentIgnored[d];
    }

    function toggleTable(){
        var on = tableCheckbox.property("checked");
        tableAttrs.forEach(function(attr){
            currentIgnored[attr] = on;
        });
    }

    function toggleStyle(){
        var on = styleCheckbox.property("checked");
        styleAttrs.forEach(function(attr){
            currentIgnored[attr] = on;
        });
    }

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

    /*
     * UI
     */
    var parent = d3.select(options.parent || document.body);


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
                .property("checked", false)
                .on("change", toggleIgnore);

    groupAttrs.append("h3")
        .text("Hide Related Groups of Attributes");
    groupAttrs.append("p")
        .classed("note", true)
        .text("Hover over checkbox to see affected attributes");

    var tableCheckbox = groupAttrs.append("div").append("label")
        .text("Table Attributes")
        .attr("title", tableAttrs.join(", "))
        .append("input")
            .attr("type","checkbox")
            .on("change", toggleTable);

    var styleCheckbox = groupAttrs.append("div").append("label")
        .text("Style Attributes")
        .attr("title", styleAttrs.join(", "))
        .append("input")
            .attr("type","checkbox")
            .on("change", toggleStyle);

    var close = modal.append("button")
        .classed("no-select", true)
        .text("close")
        .on("click", closeAndSaveModal);

    holder.selectAll("*")
        .classed("no-select", true);

    return {
        show: function() {
            holder.classed("hidden", false);
        },
        setOptions: function(opts) {
            ignoreOptions.each(function(d, i) {
                d3.select(this).property("checked", opts.attrs[d] !== undefined);
            });
            for ( var key in opts.attrs) {
                currentIgnored[key] = true;
            }
            if ( opts.table ) {
                tableCheckbox.property("checked", true);
                tableAttrs.forEach(function(attr){
                    currentIgnored[attr] = true;
                });
            }
            if ( opts.style ) {
                styleCheckbox.property("checked", true);
                styleAttrs.forEach(function(attr){
                    currentIgnored[attr] = true;
                });
            }
        },
        ignoredAttributes: function() {
            return currentIgnored;
        }
    };
}