function topbar(options){
    options = options || {};
    var holder = options.holder || "body";

    var events = {
        loadPage: function(){
            var pageName = fns.getPage();
            controller.loadPage(pageName);
        },
        addPage: function(){
            var name = prompt("Page name");
            if ( name === null || name === "" ) {
                return;
            }
            controller.addPage(name.trim());
        },
        removePage: function(){
            controller.removePage();
        },
        renamePage: function(){
            controller.renamePage();
        },
        upload: function(){
            controller.upload();
        },
        sync: function(){
            controller.startSync();
        },
        preview: function(){
            controller.preview();
        }
    };

    var bar = d3.select(holder);

    // page
    var pageGroup = bar.append("div")
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", events.loadPage);

    pageGroup.append("button")
        .text("Add")
        .attr("title", "add a new Page")
        .on("click", events.addPage);

    pageGroup.append("button")
        .text("Rename")
        .attr("title", "rename current Page")
        .on("click", events.renamePage);

    pageGroup.append("button")
        .text("Delete")
        .attr("title", "remove the current Page")
        .classed("red", true)
        .on("click", events.removePage);

    // global
    bar.append("button")
        .text("upload")
        .on("click", events.upload);

    bar.append("button")
        .text("sync")
        .attr("title", "Get uploaded pages for this domain from the server. " +
                "Warning: This will override existing pages")
        .on("click", events.sync);

    bar.append("button")
        .text("preview")
        .attr("title", "Preview will be logged in the console")
        .on("click", events.preview);

    var fns = {
        getPage: function(){
            return pageSelect.property("value");
        },
        setPages: function(names, focus){
            focus = focus || "";
            names = [""].concat(names);
            var pages = pageSelect.selectAll("option")
                .data(names);
            pages.enter().append("option");
            pages
                .text(function(d){ return d;})
                .attr("value", function(d){ return d;})
                .property("selected", function(d){
                    return d === focus;
                });
            pages.exit().remove();
        }
    };
    return fns;
}