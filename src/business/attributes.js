// return an object mapping attribute names to their value
// for all attributes of an element
export const attributes = (element, ignored = {}) => {
    let attrMap = {};

    // include text if it exists
    let text = element.textContent.trim();
    if ( text !== "" ) {
        attrMap.text = text;
    }

    return [].slice.call(element.attributes).reduce((stored, attr) => {
        if ( ignored[attr.name] ) {
            return stored;
        }
        // don't include current-selector class
        if ( attr.name === "class" ) {
            attr.value = attr.value.replace("current-selector","").trim();
        }
        // don't include empty attrs
        if ( attr.value !== "" ) {
            stored[attr.name] = attr.value
        }
        return stored;
    }, attrMap);
}
