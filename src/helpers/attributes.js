// return an object mapping attribute names to their value
// for all attributes of an element
export const attributes = (element, ignored = {}) => {
  let attrs = Array.from(element.attributes).reduce((stored, attr) => {
    let { name, value } = attr;
    if ( ignored[name] ) {
      return stored;
    }
    // don't include current-element class
    if ( name === "class" ) {
      value = value.replace("current-element","").trim();
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

/*
 * stripEvents
 * -----------
 * If an element has no on* attributes, it is returned. Otherwise, all on* attrs
 * are removed from the element and a clone is made. The element is replaced in
 * the dom by the clone and the clone is returned.
 */
export const stripEvents = element => {
  let attrs = Array.from(element.attributes);
  if ( attrs.some(a => a.name.startsWith("on")) ) {
    attrs.forEach(attr => {
      let name = attr.name;
      if ( name.startsWith("on") ) {
        element.removeAttribute(name);
      }
    });
    let clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
  } else {
    return element;
  }
}