function preview(page) {
    console.log(page);
    /**
     * Given a parent element, get all children that match the selector
     * Return data based on selector's type (index or name)
     */
    function getElement(selector, parent) {
        var elements = parent.querySelectorAll(selector.selector);
        var value = selector.spec.value;
        switch ( selector.spec.type ) {
        case "index":
            var ele = elements[value];
            if ( !ele) {
                return;
            }
            return getElementData(selector, ele);
        case "name":
            var data = Array.prototype.slice.call(elements).map(function(ele){
                return getElementData(selector, ele);
            }).filter(function(datum){
                return datum !== undefined;
            });
            var obj = {};
            obj[value] = data;
            return obj;
        }
    }

    /**
     * Get data for each rule and each child. Merge the child data into the
     * rule data.
     */
    function getElementData(selector, element){
        var data = getRuleData(selector.rules, element);
        var childData = getChildData(selector.children, element);
        if ( !childData ) {
            return;
        }
        for ( var key in childData ) {
            data[key] = childData[key];
        }
        return data;
    }

    function getChildData(children, element) {
        var data = {};
        children.some(function(child){
            var childData = getElement(child, element);
            if ( !childData && !child.optional ) {
                data = undefined;
                return true;
            }
            for ( var key in childData ) {
                data[key] = childData[key];
            }
            return false;
        });
        return data;
    }

    function getRuleData(rules, element) {
        var data = {};
        rules.forEach(function(rule){
            if ( rule.attr === "text" ) {
                data[rule.name] = element.textContent.replace(/\s+/g, " ");
            } else {
                var attr = element.getAttribute(rule.attr);
                // attributes that don't exist will return null
                // just use empty string for now
                data[rule.name] = attr || "";
            }
        });
        return data;
    }


    return getElement(page, document);
}

