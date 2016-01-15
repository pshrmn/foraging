export const preview = page => {
    /*
     * Given a parent element, get all children that match the selector
     * Return data based on element's type (index or name)
     */
    const getElement = (element, parent) => {
        const elements = parent.querySelectorAll(element.selector);
        const { type, value } = element.spec;
        switch ( type ) {
        case "single":
            var ele = elements[value];
            if ( !ele) {
                return;
            }
            return getElementData(element, ele);
        case "all":
            var data = Array.from(elements).map(function(ele){
                return getElementData(element, ele);
            }).filter(function(datum){
                return datum !== undefined;
            });
            var obj = {};
            obj[value] = data;
            return obj;
        }
    }

    /*
     * Get data for each rule and each child. Merge the child data into the
     * rule data.
     */
    const getElementData = (element, htmlElement) => {
        const data = getRuleData(element.rules, htmlElement);
        const childData = getChildData(element.children, htmlElement);
        if ( !childData ) {
            return;
        }
        for ( const key in childData ) {
            data[key] = childData[key];
        }
        return data;
    }

    const getChildData = (children, htmlElement) => {
        let data = {};
        children.some(function(child){
            const childData = getElement(child, htmlElement);
            if ( !childData && !child.optional ) {
                data = undefined;
                return true;
            }
            for ( const key in childData ) {
                data[key] = childData[key];
            }
            return false;
        });
        return data;
    }

    const intRegEx = /\d+/;
    const floatRegEx = /\d+(\.\d+)?/;
    const getRuleData = (rules, htmlElement) => {
        const data = {};
        rules.forEach(function(rule){
            let val;
            let match;
            if ( rule.attr === "text" ) {
                 val = htmlElement.textContent.replace(/\s+/g, " ");
            } else {
                var attr = htmlElement.getAttribute(rule.attr);
                // attributes that don't exist will return null
                // just use empty string for now
                val = attr || "";
            }
            switch (rule.type) {
            case "int":
                match = val.match(intRegEx);
                val = match !== null ? parseInt(match[0], 10) : -1;
                break;
            case "float":
                match = val.match(floatRegEx);
                val = match !== null ? parseFloat(match[0]) : -1.0;
                break;
            }
            data[rule.name] = val;
        });
        return data;
    }

    return page === undefined ? "" : getElement(page.element, document);
}

