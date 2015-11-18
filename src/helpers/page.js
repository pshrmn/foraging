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


export const clean = page => {
  return Object.assign({}, {
    name: page.name
  }, cleanSelector(page));
};


const cleanSelector = s => {
  return Object.assign({}, {
    selector: s.selector,
    spec: Object.assign({}, s.spec),
    children: s.children.map(c => cleanSelector(c)),
    rules: s.rules.map(r => Object.assign({}, r))
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

/*
 * set an id on each selector and determine the elements that each selector matches
 */
export const setupPage = page => {
  if ( page === undefined ) {
    return;
  }
  let id = 0;
  let setup = (selector, parentElements) => {
    selector.id = id++;
    selector.elements = select(parentElements, selector.selector, selector.spec);
    selector.children.forEach(child => {
      setup(child, selector.elements);
    });
  }

  setup(page, [document]);
  page.nextID = id;
}