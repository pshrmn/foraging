// return an object mapping attribute names to their value
// for all attributes of an element
function attributes(element, ignored) {
    var attrMap = {};
    ignored = ignored || {};
    [].slice.call(element.attributes).forEach(function(attr) {
        if ( ignored[attr.name] ) {

            return;
        }
        // don't include current-selector class
        if ( attr.name === "class" ) {
            attr.value = attr.value.replace("current-selector","").trim();
        }
        // don't include empty attrs
        if ( attr.value !== "" ) {
            attrMap[attr.name] = attr.value;
        }
    });

    // include text if it exists
    var text = element.textContent.trim();
    if ( text !== "" ) {
        attrMap.text = text;
    }
    return attrMap;
}
