import { select } from "./selection";

export const createPage = name => {
  return {
    name: name,
    element: {
      selector: "body",
      spec: {
        type: "single",
        value: 0
      },
      children: [],
      rules: []
    }
  };
};

export const createElement = (selector, type = "single", value = 0, optional = false) => {
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
export const clone = element => {
  return Object.assign({}, {
    selector: element.selector,
    spec: element.spec,
    children: element.children.map(child => clone(child)),
    hasRules: element.rules.length,
    elements: element.elements || [],
    original: element
  });
};


export const clean = page => {
  return Object.assign({}, {
    name: page.name,
    element: cleanElement(page.element)
  });
};


const cleanElement = e => {
  return Object.assign({}, {
    selector: e.selector,
    spec: Object.assign({}, e.spec),
    children: e.children.map(c => cleanElement(c)),
    rules: e.rules.map(r => Object.assign({}, r)),
    optional: e.optional
  });
};

/*
 * set an id on each element and determine the html elements that each element matches
 */
export const setupPage = page => {
  if ( page === undefined ) {
    return;
  }
  let id = 0;
  const setup = (element, parentElements, parent) => {
    element.id = id++;
    element.parent = parent;
    element.elements = select(parentElements, element.selector, element.spec);
    element.children.forEach(child => {
      setup(child, element.elements, element);
    });
  }

  setup(page.element, [document], null);
}