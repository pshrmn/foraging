import {
  currentSelector,
  potentialSelector,
  queryCheck,
  hoverClass,
  savedPreview
} from 'constants/CSSClasses';

/*
 * add the no-select class to all elements that are selected by the selector
 * as well as all of those elements' children
 */
export const protect = selector => {
  const roots = document.querySelectorAll(selector);
  Array.from(roots).forEach(element => {
    element.classList.add('no-select');
    Array.from(element.querySelectorAll('*')).forEach(c => {
      c.classList.add('no-select');
    });
  });
}

/*
 * select
 * ------
 * Returns an array of elements that are children of the parent elements and
 * match the selector.
 *
 * @param parents - an array of parent elements to search using the selector
 * @param selector - the selector to use to match children of the parent elements
 * @param spec - how to select the child element or elements of a parent element
 * @param ignored - a selector that when an element has it, the element and all
 *    of its descendents should be given the 'no-select' class.
 */
export const select = (parents, selector, spec, ignored) => {
  const sel = `${selector || '*'}:not(.no-select)`;
  if ( !spec ) {
    spec = {
      type: 'all'
    };
  }
  if ( ignored !== undefined && ignored !== '') {
    protect(ignored);
  }

  // select the elements from each parent element
  const childElements = Array.from(parents)
    .reduce((arr, p) => {
      const children = p.querySelectorAll(sel);
      const { type } = spec;
      let elements = [];
      switch ( type ) {
      case 'single':
        const index = spec.index;
        elements =  children[index] !== undefined ? [children[index]] : [];
        break;
      case 'all':
        elements = Array.from(children);
        break;
      case 'range':
        const low = spec.low;
        const high = spec.high || undefined; // slice undefined, not null
        elements = Array.from(children).slice(low, high);
        break;
      }
      return arr.concat(elements);
    }, []);
    return [...new Set(childElements)];
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
export const count = (parents, selector, spec = { type: 'all' }) => {
  const sel = `${selector || '*'}:not(.no-select)`;
  return Array.from(parents)
    .reduce((top, p) => {
      const children = p.querySelectorAll(sel);
      let count = 0;
      switch ( spec.type ) {
      case 'single':
        const index = spec.index;
        count = children[index] !== undefined ? 1 : 0;
        break;
      case 'all':
        count = children.length
        break;
      case 'range':
        const low = spec.low;
        const high = spec.high;
        count = Array.from(children).slice(low, high || undefined).length;
        break;
      }

      return top > count ? top : count;
    }, 0);
}

/*
 * parts
 * -------------
 * Returns an array of strings that can be used as CSS selectors to select the element.
 * Element tags are converted to lowercase, ids are preceded by a '#' and classes are
 * preceded by a '.'
 *
 * @param element - the element to analyze
 */
export const parts = element =>{
  // const skipTags = [];
  const skipClasses = [
    currentSelector,
    potentialSelector,
    queryCheck,
    hoverClass,
    savedPreview
  ];
  const classRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
  // const tagAllowed = tag => !skipTags.some(st => st === tag);
  const classAllowed = c => !skipClasses.some(sc => sc === c) && classRegex.test(c);

  const pieces = [];
  const tag = element.tagName.toLowerCase();
  // if the tag isn't allowed, return an empty array
  /*
  // TODO: not re-implemented, should it be?
  if ( !tagAllowed(tag) ) {
    return [];
  }
  */
  pieces.push(tag);

  // id
  if ( element.id !== '' && validID(element.id) ) {
    pieces.push(`#${element.id}`);
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
 * check if all elements matched by the selector are 'select' elements
 */
export const allSelect = s => s.every(ele => ele.tagName === 'SELECT');
