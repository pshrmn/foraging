function previewModal(parentElement){
    var parent = d3.select(parentElement);

    function closeModal(){
        holder.classed("hidden", true);
    }

    var holder = parent.append("div")
        .classed({
            "modal-holder": true,
            "hidden": true
        });

    var background = holder.append("div")
        .classed({"background": true})
        .on("click", closeModal);

    var modal = holder.append("div")
        .classed({"cjs-modal": true});

    var pre = modal.append("pre");

    var close = modal.append("button")
        .text("close")
        .on("click", closeModal);

    return function(text){
        holder.classed("hidden", false);
        pre.text(text);
    };
}
