function topbar(options){
    options = options || {};
    var holder = options.holder || "body";

    var bar = d3.select(holder);

    // schema
    var schemaGroup = bar.append("div")
        .text("Schema");

    var schemaSelect = schemaGroup.append("select")
        .on("change", controller.events.loadSchema);

    schemaGroup.append("button")
        .text("add schema")
        .on("click", controller.events.addSchema);

    schemaGroup.append("button")
        .text("remove schema")
        .on("click", controller.events.removeSchema);

    // page
    var pageGroup = bar.append("div")
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", controller.events.loadPage);

    pageGroup.append("button")
        .text("remove page")
        .on("click", controller.events.removePage);

    // global
    bar.append("button")
        .text("upload")
        .on("click", controller.events.upload);

    var toggleUrl = bar.append("button")
        .text(function(){
            return "add url";
        })
        .classed({
            "on": false
        })
        .on("click", controller.events.toggleUrl);

    return {
        setUrl: function(on){
            if ( on ) {
                toggleUrl
                    .text("remove url")
                    .classed("on", true);
            } else {
                toggleUrl
                    .text("add url")
                    .classed("on", false);
            }
        },
        toggleUrl: function(on){
            toggleUrl.classed("hidden", !on);
        },
        setSchemas: function(names, focus){
            focus = focus || "default";
            var schemas = schemaSelect.selectAll("option")
                .data(names);
            schemas.enter().append("option");
            schemas
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;})
                .property("selected", function(d){
                    return d === focus;
                });
            schemas.exit().remove();
        },
        setPages: function(names){
            var pages = pageSelect.selectAll("option")
                .data(names);

            pages.enter().append("option");
            pages
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;});
            pages.exit().remove();

        },
        getSchema: function(){
            return schemaSelect.property("value");
        },
        getPage: function(){
            return pageSelect.property("value");
        }
    };
}