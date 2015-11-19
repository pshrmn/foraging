// return an object mapping attribute names to their value
// for all attributes of an element
export const attributes = (element, ignored = {}) => {

    let attrs = Array.from(element.attributes).reduce((stored, attr) => {
        if ( ignored[attr.name] ) {
            return stored;
        }
        // don't include current-selector class
        if ( attr.name === "class" ) {
            attr.value = attr.value.replace("current-selector","").trim();
        }
        // don't include empty attrs
        if ( attr.value !== "" ) {
            stored.push({name: attr.name, value: attr.value});
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
