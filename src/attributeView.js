function AttributeView(options){
    var index = 0;
    var eles = [];
    var length = 0;

    options = options || {};
    var holder = options.holder || "body";
    var saveFn = options.save || function(){};

    // ui
    var view = d3.select(holder);

    // form
    var form = view.append("div")
        .classed({"form": true});

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
            .attr("name", "attr");

    var followInput = form.append("p")
        .append("label")
        .text("Follow: ")
        .append("input")
            .attr("type", "checkbox")
            .attr("name", "follow")
            .property("disabled", true);

    var saveButton = form.append("button")
        .text("Save")
        .on("click", controller.events.saveAttr);

    var cancelButton = form.append("button")
        .text("Cancel")
        .on("click", controller.events.cancelAttr);

    // attribute display
    var display = view.append("div")
        .classed({"display": true});

    var attributeHolder = display.append("div")
        .classed({"attributes": true});

    var buttons = display.append("div");
    var previous = buttons.append("button")
        .text("<<")
        .on("click", showPrevious);

    var indexText = buttons.append("span")
        .text(function(){
            return index;
        });

    var next = buttons.append("button")
        .text(">>")
        .on("click", showNext);

    var attrs;
    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return index;
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

        attrs = attributeHolder.selectAll("div")
            .data(attrData);

        attrs.enter().append("div")
            .on("click", function(d){
                attrInput.property("value", d.name);
                followInput.property("disabled", function(){
                    return d.name !== "href";
                });
            });

        attrs.text(function(d){
            return d.name + ": " + abbreviate(d.value, 51);
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
        getAttr: function(){
            var attr = attrInput.property("value");
            var name = nameInput.property("value");
            var follow = followInput.property("checked") && attr === "href";
            if ( name === "" || !controller.legalName(name)){
                return;
            }

            return {
                name: name,
                attr: attr,
                follow: follow
            };
        },
        reset: function(){
            eles = undefined;
            index = 0;
            indexText.text("");
            if ( attrs ) {
                attrs.remove();
            }
            attrInput.property("value", "");
            nameInput.property("value", "");
            followInput.property("disabled", true);
            followInput.property("checked", false);
        }
    };
}
