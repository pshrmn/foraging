function previewModal(parentElement){
    var parent = d3.select(parentElement);

    function closeModal(){
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
        .on("click", closeModal);

    var modal = holder.append("div")
        .classed({
            "no-select": true,
            "cjs-modal": true
        });

    var pre = modal.append("pre")
        .classed("no-select", true);

    var close = modal.append("button")
        .classed("no-select", true)
        .text("close")
        .on("click", closeModal);

    return function(text){
        holder.classed("hidden", false);
        pre.text(text);
    };
}
