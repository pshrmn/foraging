/*
 * select
 * ------
 * Returns an array of elements that are children of the parent elements and
 * match the selector.
 *
 * @param parents - an array of parent elements to search using the selector
 * @param selector - the selector to use to match children of the parent elements
 * @param spec - how to select the child element or elements of a parent element
 */
export const select = (parents, selector, spec) => {
  const sel = (selector || "*") + ":not(.no-select)";
  const index = spec && spec.type === "single" ? spec.value : undefined;

  const specElements = elements => {
    if ( index !== undefined ) {
      return elements[index] !== undefined ? [elements[index]] : [];
    } else {
      return Array.from(elements);
    }
  }

  return Array.from(parents).reduce((arr, p) => {
    const eles = p.querySelectorAll(sel);
    return arr.concat(specElements(eles));
  }, []);
}


/*
 * count
 * ------
 * Returns the max number of child elements that the selector matches per parent
 *
 * @param parents - an array of parent elements to search using the selector
 * @param selector - the selector to use to match children of the parent elements
 * @param spec - how to select the child element or elements of a parent element
 */
export const count = (parents, selector, spec) => {
  const sel = (selector || "*") + ":not(.no-select)";
  const index = spec && spec.type === "single" ? spec.value : undefined;

  const specElements = elements => {
    if ( index !== undefined ) {
      return elements[index] !== undefined ? 1 :0;
    } else {
      return elements.length;
    }
  }

  return Array.from(parents).reduce((top, p) => {
    const eles = p.querySelectorAll(sel);
    const count = specElements(eles);
    return top > count ? top : count;
  }, 0);
}

/*
 * parts
 * -------------
 * Returns an array of strings that can be used as CSS selectors to select the element.
 * Element tags are converted to lowercase, ids are preceded by a "#" and classes are
 * preceded by a "."
 *
 * @param element - the element to analyze
 */
export const parts = element =>{
  const skipTags = [];
  const skipClasses = ["forager-highlight", "query-check", "selectable-element", "current-selector"];
  const classRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
  const tagAllowed = tag => {
    return !skipTags.some(st => st === tag);
  }

  const classAllowed = c => {
    return !skipClasses.some(sc => sc === c) && classRegex.test(c);
  }

  const pieces = [];
  const tag = element.tagName.toLowerCase();
  if ( tagAllowed(tag) ) {
    pieces.push(tag);
  } else {
    // if the tag isn't allowed, return an empty array
    return [];
  }

  // id
  if ( element.id !== "" && validID(element.id) ) {
    pieces.push("#" + element.id);
  }

  // classes
  Array.from(element.classList).forEach(c => {
    if ( classAllowed(c) ) {
      pieces.push(`.${c}`);
    }  
  });
  return pieces;
};

/*
 * querySelectorAll requires ids to start with an alphabet character
 */
function validID(id) {
  const firstChar = id.charCodeAt(0);
  // A=65, Z=90, a=97, z=122
  return !( firstChar < 65 || ( firstChar > 90 && firstChar < 97 ) || firstChar > 122 );
}

/*
 * check if all elements matched by the selector are "select" elements
 */
export const allSelect = s => s.every(ele => ele.tagName === "SELECT");
