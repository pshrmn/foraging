import {
  currentSelector,
  potentialSelector,
  queryCheck,
  hoverClass,
  savedPreview
} from 'constants/CSSClasses';

// return an object mapping attribute names to their value
// for all attributes of an element
export const attributes = (element, ignored = {}) => {
  const ignoredClasses = [
    currentSelector,
    potentialSelector,
    queryCheck,
    hoverClass,
    savedPreview
  ];

  const attrs = Array.from(element.attributes)
    .reduce((stored, attr) => {
      let { name, value } = attr;
      if ( ignored[name] ) {
        return stored;
      }
      // don't include forager specific classes
      if ( name === 'class' ) {
        value = value
          .split(' ')
          .filter(c => !ignoredClasses.includes(c) && c !== '')
          .join(' ');
      }
      // don't include empty attrs
      if ( value !== '' ) {
        stored.push({name: name, value: value});
      }
      return stored;
    }, []);

  // include text if it exists
  const text = element.textContent.trim();
  if ( text !== '' ) {
    attrs.push({name: 'text', value: text});
  }

  return attrs;
};

/*
 * stripEvents
 * -----------
 * If an element has no on* attributes, it is returned. Otherwise, all on* attrs
 * are removed from the element and a clone is made. The element is replaced in
 * the dom by the clone and the clone is returned.
 *
 * This breaks the page (so that Forager events can dispatch uninterrupted)
 * but makes it so that you don't have to worry about accidentally navigating,
 * submitting, or anythign else while trying to select an element. A refresh
 * of the page will be necessary to restore the page's default functionality.
 *
 * Because there isn't a good reason to capture data from on* attributes, they
 * are removed instead of just replacing the event function.
 */
export const stripEvents = element => {
  const attrs = Array.from(element.attributes);
  if ( attrs.some(a => a.name.startsWith('on')) ) {
    attrs.forEach(attr => {
      const name = attr.name;
      if ( name.startsWith('on') ) {
        element.removeAttribute(name);
      }
    });
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
  } else {
    return element;
  }
};
