import { select } from "./selection";

export const createPage = name => {
  return {
    name: name,
    selector: "body",
    spec: {
      type: "single",
      value: 0
    },
    children: [],
    rules: []
  };
};

export const createSelector = (selector, type = "single", value = 0, optional = false) => {
  return {
    selector: selector,
    spec: {
      type: type,
      value: value
    },
    children: [],
    rules: [],
    optional: optional
  };
};

/*
 * iterate through the page tree and add an "elements" property to each selector
 * which is an array containing all elements in the page that that selector
 * matches
 */
export const pageElements = page => {
  if ( page === undefined ) {
    return;
  }
  let elements = [document];
  let attach = selector => {
    elements = select(elements, selector.selector);
    selector["elements"] = elements;
    selector.children.forEach(child => {
      attach(child)
    });
  }

  attach(page);
};

/*
 * clone a page (useful with the graph because that adds unnecessary properties
 * to each selector) does not include the page's name
 */
export const clone = selector => {
  return Object.assign({}, {
    id: selector.id,
    selector: selector.selector,
    spec: Object.assign({}, selector.spec),
    children: selector.children.map(child => clone(child)),
    rules: selector.rules.map(r => Object.assign({}, r)),
    elements: selector.elements || []
  });
};

/*
 * iterate over the tree looking for selector matching id, and when found
 * append the newChild to its array of children
 */
export const addChild = (selector, id, newChild) => {
  if ( selector.id === id ) {
    selector.children.push(newChild);
    return true;
  } else {
    var found = selector.children.some(child => {
      addChild(child, id, newChild);
    });
    return found;
  }
};