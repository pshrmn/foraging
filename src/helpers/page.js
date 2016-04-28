import { select } from "./selection";

export const createElement = (selector, type = "single", value = 0, optional = false) => {
  return {
    selector: selector,
    spec: {
      type: type,
      value: value
    },
    childIndices: [],
    rules: [],
    optional: optional,
    matches: []
  };
};

/*
 * Iterate over the array of page tree, setting each up for use
 * in the app
 */
export const preparePages = pages => {
  const preppedPages = Object.keys(pages)
    .map(key => pages[key])
    .filter(p => p !== null)
    .map(p => {
      return {
        name: p.name,
        elements: flatten(p.element)
      };
    });
  //preppedPages.forEach(p => selectElements(p.elements));
  return preppedPages;
};

/*
 * flatten a page object's nested selectors into an array. each item
 * has three additional properties: index (the same as the index in
 * the array), parent (the index of the parent selector in the array),
 * and childIndices (the index values of child selectors in the array)
 */
export const flatten = pageTree => {
  if ( pageTree === undefined ) {
    return [];
  }
  let index = 0;

  // pageTree is the root element
  const breadth = [
    Object.assign({}, pageTree, {
      parent: null,
      childIndices: []
    })
  ];

  while ( index < breadth.length ) {
    let current = breadth[index];
    current.index = index;
    if ( current.parent !== null ) {
      breadth[current.parent].childIndices.push(index);
    }
    current.children.forEach(c => {
      breadth.push(Object.assign({}, c, {
        parent: index,
        childIndices: []
      }));
    });
    delete current.children;
    index += 1;
  }
  return breadth;
};

/* 
 * return a version of the page with elements as a tree for saving/uploading
 */
export const clean = page => {
  return {
    name: page.name,
    element: fullGrow(page.elements)
  };
};

/*
 * create a tree for saving a page
 */
export const fullGrow = elementArray => {
  const cleanElements = elementArray.map(e => {
    if ( e === null ) {
      return null
    };
    return {
      selector: e.selector,
      spec: Object.assign({}, e.spec),
      children: [],
      rules: e.rules.map(r => Object.assign({}, r)),
      optional: e.optional,
      // preserve for tree building
      parent: e.parent
    }
  });
  cleanElements.forEach(e => {
    if ( e === null ) {
      return;
    }
    const parent = e.parent;
    delete e.parent;
    if ( parent === null ) {
      return;
    }
    cleanElements[parent].children.push(e);
  });
  // return the root
  return cleanElements[0];
};

/*
 * create a tree for an array of elements with only the properties needed for
 * drawing and interacting with the tree
 */
export const simpleGrow = elementArray => {
  const cleanElements = elementArray.map(e => {
    if ( e === null ) {
      return null
    };
    return {
      selector: e.selector,
      spec: Object.assign({}, e.spec),
      hasRules: e.rules.length > 0,
      hasChildren: e.childIndices.length > 0,
      children: [],
      index: e.index,
      parent: e.parent,
      matches: e.matches
    };
  });
  cleanElements.forEach(e => {
    if ( e === null ) {
      return null
    };
    if ( e.parent === null ) {
      return;
    }
    cleanElements[e.parent].children.push(e);
  });
  return cleanElements[0];
}