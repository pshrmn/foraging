// return an object mapping attribute names to their value
// for all attributes of an element
export const attributes = (element, ignored = {}) => {
    let attrs = Array.from(element.attributes).reduce((stored, attr) => {
        let { name, value } = attr;
        if ( ignored[name] ) {
            return stored;
        }
        // don't include current-selector class
        if ( name === "class" ) {
            value = value.replace("current-selector","").trim();
        }
        // don't include empty attrs
        if ( value !== "" ) {
            stored.push({name: name, value: value});
        }
        return stored;
    }, []);

    // include text if it exists
    let text = element.textContent.trim();
    if ( text !== "" ) {
        attrs.push({name: "text", value: text});
    }

    return attrs;
}
