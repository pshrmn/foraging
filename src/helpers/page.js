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
 * clone a page (useful with the tree because that adds unnecessary properties
 * to each selector) does not include the page's name
 */
export const clone = selector => {
  return Object.assign({}, {
    selector: selector.selector,
    spec: selector.spec,
    children: selector.children.map(child => clone(child)),
    hasRules: selector.rules.length,
    elements: selector.elements || [],
    original: selector
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
    rules: s.rules.map(r => Object.assign({}, r)),
    optional: s.optional
  });
};

/*
 * set an id on each selector and determine the elements that each selector matches
 */
export const setupPage = page => {
  if ( page === undefined ) {
    return;
  }
  let id = 0;
  let setup = (selector, parentElements, parent) => {
    selector.id = id++;
    selector.parent = parent;
    selector.elements = select(parentElements, selector.selector, selector.spec);
    selector.children.forEach(child => {
      setup(child, selector.elements, selector);
    });
  }

  setup(page, [document], null);
}