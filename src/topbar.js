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
            controller.addPage(name.trim());
        },
        removePage: function(){
            controller.removePage();
        },
        upload: function(){
            controller.upload();
        },
        sync: function(){
            controller.startSync();
        }
    };

    var bar = d3.select(holder);

    // page
    var pageGroup = bar.append("div")
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", events.loadPage);

    pageGroup.append("button")
        .text("add page")
        .on("click", events.addPage);

    pageGroup.append("button")
        .text("remove page")
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