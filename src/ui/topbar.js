function topbar(options){
    options = options || {};
    var pageHolder = options.page || "body";
    var controlsHolder = options.control || "body";

    var hidden = false;
    var pageFrame = d3.select(".frame.pages");
    var events = {
        loadPage: function(){
            var pageName = fns.getPage();
            controller.loadPage(pageName);
        },
        addPage: function(){
            var name = prompt("Page Name\nCannot contain the following characters: < > : \" \\ / | ? *");
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
        preview: function(){
            controller.preview();
        },
        sync: function(){
            controller.startSync();
        },
        showOptions: function(){
            controller.showOptions();
        },
        minMax: function() {
            hidden = !hidden;
            this.textContent = hidden ? "+" : "-";
            pageFrame.classed("hidden", hidden);
        },
        close: function(){
            d3.select(".forager").remove();
            d3.selectAll(".modal-holder").remove();
            controller.close();
        }
    };

    /*
     * UI
     */

    var pageGroup = d3.select(pageHolder)
        .text("Page");

    var pageSelect = pageGroup.append("select")
        .on("change", events.loadPage);

    pageGroup.append("button")
        .text("Add")
        .classed("green", true)
        .attr("title", "add a new Page")
        .on("click", events.addPage);

    pageGroup.append("button")
        .text("Rename")
        .classed("green", true)
        .attr("title", "rename current Page")
        .on("click", events.renamePage);

    pageGroup.append("button")
        .text("Delete")
        .attr("title", "remove the current Page")
        .classed("red", true)
        .on("click", events.removePage);

    pageGroup.append("button")
        .text("upload")
        .classed("green", true)
        .on("click", events.upload);

    pageGroup.append("button")
        .text("preview")
        .classed("green", true)
        .attr("title", "Preview will be logged in the console")
        .on("click", events.preview);

    var controlButtons = d3.select(controlsHolder);

    controlButtons.append("button")
        .text("sync")
        .attr("title", "Get uploaded pages for this domain from the server. " +
                "Warning: This will override existing pages")
        .classed({
            "control": true
        })
        .on("click", events.sync);

    controlButtons.append("button")
        .text("Options")
        .attr("title", "options")
        .classed({
            "control": true
        })
        .on("click", events.showOptions);

    controlButtons.append("button")
        .text("-")
        .attr("title", "minimize/restore the Forager UI")
        .classed({
            "control": true
        })
        .on("click", events.minMax);

    controlButtons.append("button")
        .text("×")
        .attr("title", "Close Forager")
        .classed({
            "control": true
        })
        .on("click", events.close);

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