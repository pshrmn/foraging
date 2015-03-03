function AttributeView(holder, saveFn){
    var index = 0;
    var length = 0;
    var eles = [];

    // ui
    var view = d3.select(holder).append("div");

    // form
    var form = view.append("div")
        .classed({"form": true})
        .append("form")
            .on("submit", function(){
                d3.event.preventDefault();
                saveFn({
                    name: nameInput.property("value"),
                    attr: attrInput.property("value")
                });
            });

    var nameInput = form.append("p")
        .append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    var attrInput = form.append("p")
        .append("label")
        .text("Attr:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    form.append("button")
        .text("Save Attr")

    // attribute display
    var display = view.append("div")
        .classed({"display": true})

    var attributeHolder = display.append("div")
        .classed({"attributes": true})

    var buttons = display.append("div");
    var previous = buttons.append("button")
        .text("<<")
        .on("click", showPrevious);

    var indexText = buttons.append("span")
        .text(function(){
            return index + "/" + length;
        });

    var next = buttons.append("button")
        .text(">>")
        .on("click", showNext);

    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return index + "/" + (index - length);
        });

        var element = eles[index];
        var attrMap = attributes(element);
        var attrData = [];
        for ( var key in attrMap ) {
            attrData.push({
                name: key,
                value: attrMap[key]
            });
        }

        var attrs = attributeHolder.selectAll("div")
            .data(attrData);

        attrs.enter().append("div")
            .on("click", function(d){
                attrInput.attr("value", d.name);
            });

        attrs.text(function(d){
            // using 11 as an arbitrary number right now
            return d.name + "=" + abbreviate(d.value, 11);
        });

        attrs.exit().remove();
    }

    function showNext(){
        index++;
        if ( index >= length ) {
            index = 0;
        }
        displayElement();
    }

    function showPrevious(){
        index--;
        if ( index < 0 ) {
            index = length-1;
        }
        displayElement();
    }
    return {
        setElements: function(elements){
            eles = elements;
            index = 0;
            length = elements.length;
            displayElement();
        },
    };
}
