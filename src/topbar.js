function topbar(options){
    options = options || {};
    var holder = options.holder || "body";

    var bar = d3.select(holder);

    var pageSelect = bar.append("select")
        .on("change", controller.events.loadPage);

    bar.append("button")
        .text("remove page")
        .on("click", controller.events.removePage);

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
        setPages: function(names){
            var pages = pageSelect.selectAll("option")
                .data(names);

            pages.enter().append("option");
            pages
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;});
            pages.exit().remove();

        },
        getPage: function(){
            return pageSelect.property("value");
        }
    };
}