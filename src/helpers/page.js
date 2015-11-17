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
}
