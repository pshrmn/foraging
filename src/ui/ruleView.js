function RuleView(options){
    var index = 0;
    var eles = [];
    var length = 0;
    var formState = {};

    options = options || {};
    var saveFn = options.save || function(){};

    var events = {
        saveRule: function(){
            var rule = getRule();
            if ( rule === undefined ) {
                return;
            }
            controller.saveRule(rule);
            fns.reset();
        },
        cancelRule: function(){
            fns.reset();
            controller.cancelRule();
        }
    };

    // ui
    var view = options.view || d3.select("body");

    // form
    var form = newForm(view);

    var nameInput = form.workarea.append("p")
        .append("label")
        .text("Name:")
        .append("input")
            .attr("type", "text")
            .attr("name", "name");

    var typeArea = form.workarea.append("p")
        .text("Type:");

    var currType = "string";
    var typeLabels = typeArea.selectAll("label")
        .data(["string", "int", "float"])
        .enter().append("label")
        .text(function(d){ return d; });

    var radioTypes = typeLabels.append("input")
        .attr("type", "radio")
        .attr("name", "type")
        .attr("value", function(d){ return d; })
        .property("checked", function(d, i) {
            return d === currType;
        })
        .on("change", function(){
            currType = this.value;
        });

    // display the attributes in a table
    var attributeHolder = form.workarea.append("table")
        .classed({"attributes": true});

    var th = attributeHolder.append("thead").append("tr");
    th.append("th").text("Attr");
    th.append("th").text("Value");
    var tb = attributeHolder.append("tbody");

    var buttons = form.workarea.append("div");
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

    form.buttons.append("button")
        .text("Save")
        .on("click", events.saveRule);

    form.buttons.append("button")
        .text("Cancel")
        .on("click", events.cancelRule);

    // end ui

    var rows;
    function displayElement(){
        // show the index for the current element
        indexText.text(function(){
            return (index+1) + "/" + (length);
        });

        var element = eles[index];
        var attrMap = attributes(element);
        var attrData = [];
        for ( var key in attrMap ) {
            attrData.push([key, attrMap[key]]);
        }

        rows = tb.selectAll("tr")
            .data(attrData, function(d){ return d[0]; });

        rows.enter().append("tr")
            .on("click", function(d){
                clearClass("selectedAttr");
                this.classList.add("selectedAttr");
                formState.attr = d[0];
            });

        rows.exit().remove();

        var tds = rows.selectAll("td")
            .data(function(d){ return d;});
        tds.enter().append("td");
        tds.text(function(d){ return abbreviate(d, 51); });
        tds.exit().remove();

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

    function getRule(){
        var attr = formState.attr;
        var name = nameInput.property("value");
        if ( name === ""){
            form.showError("Rule name is required");
            return;
        } else if ( !controller.legalName(name) ){
            form.showError("A rule with the name '" + name + "' already exists");
            return;
        } else if ( attr === undefined ) {
            form.showError("No attribute has been selected.");
            return;
        }
        var type = currType;
        return {
            name: name,
            attr: attr,
            type: type
        };
    }

    var fns = {
        setElements: function(elements){
            eles = elements;
            index = 0;
            length = elements.length;
            form.clearErrors();
            displayElement();
        },
        reset: function(){
            eles = undefined;
            index = 0;
            indexText.text("");
            if ( rows ) {
                rows.remove();
            }
            nameInput.property("value", "");
            currType = "string";
            radioTypes.property("checked", function(d){
                return d === currType;
            });
        }
    };
    return fns;
}
