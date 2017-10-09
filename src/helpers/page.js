export const createElement = (selector, spec = {type: 'single', index: 0}, optional = false) => ({
  selector,
  spec,
  childIndices: [],
  rules: [],
  optional,
  matches: []
});

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

    // add reference to child in parent element
    if ( current.parent !== null ) {
      breadth[current.parent].childIndices.push(index);
    }

    // add all child elements to the breadth array
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
export const clean = page => ({
  name: page.name,
  element: fullGrow(page.elements)
});

/*
 * create a tree for saving a page
 */
export const fullGrow = elementArray => {
  const cleanElements = elementArray.map(e => {
    if ( e === null ) {
      return null;
    }
    return {
      selector: e.selector,
      spec: Object.assign({}, e.spec),
      children: [],
      rules: e.rules.map(r => Object.assign({}, r)),
      optional: e.optional,
      // preserve for tree building
      parent: e.parent
    };
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
      return null;
    }
    return {
      selector: e.selector,
      spec: Object.assign({}, e.spec),
      hasRules: e.rules.length > 0,
      children: [],
      index: e.index,
      parent: e.parent,
      matches: e.matches,
      optional: e.optional
    };
  });

  cleanElements.forEach(e => {
    if ( e === null || e.parent === null) {
      return;
    }
    cleanElements[e.parent].children.push(e);
  });
  // determine hasChildren based on its children array, not childIndices
  cleanElements.forEach(e => {
    if ( e === null ) {
      return;
    }
    e.hasChildren = e.children.length > 0;
  });
  return cleanElements[0];
};

/*
 * Return a list of names in the same level as the current element
 *
 * For example, given the below rules:
 * {
 *   'foo': '',
 *   'bar': 7,
 *   'baz': {
 *     'quux': 3.14
 *   }
 * }
 *
 * The names 'foo', 'bar', and 'baz' are in the same level. The name 'quux' is
 * in a separate level.
 *
 * This is useful for verifying that a rule or spec name is not a duplicate.
 */
export function levelNames(elements, currentIndex) {
  // find the root element for the current level. This will either be an element
  // with a spec name or the root element of the whole tree
  function searchForRoot(element) {
    // this shouldn't happen
    if ( element === null ) {
      return null;
    }
    // stop when the element's spec has a name property or if the
    // element has no parent
    if ( element.spec.name !== undefined || element.parent === null) {
      return element.index;
    } else {
      return searchForRoot(elements[element.parent]);
    }
  }
  const rootIndex = searchForRoot(elements[currentIndex]);
  return childNames(elements, rootIndex, true);
}

function childNames(elements, index, isRoot) {
  let current = elements[index];
  let takenNames = [];
  if ( current === undefined ) {
    return [];
  }

  // when there is a spec name, any of that element and its childrens
  // rules will be in another level. Do not do this for the root element.
  if ( !isRoot && current.spec.name !== undefined ) {
    takenNames.push(current.spec.name);
  } else {
    // add the name for every rule in the current element
    current.rules.forEach(r => {
      takenNames.push(r.name);
    });

    // and merge in the names from every child element
    current.childIndices.forEach(c => {
      const child = elements[c];
      takenNames = takenNames.concat(childNames(elements, child.index, false));
    });

  }

  return takenNames;
}


export function removeElement(page, element) {
  let newPage;
  let newElementIndex = 0;
  // clear everything else out, but don't remove the body selector
  if ( element.index === 0 ) {
    newPage = {
      ...page,
      elements: [{
        ...element,
        childIndices: []
      }]
    };
  } else {
    // index values of elements that should be removed
    let removeIndex = [element.index];
    newElementIndex = page.elements[element.index].parent || 0;

    newPage = {
      ...page,
      elements: page.elements.map(s => {
        if ( s === null ) {
          return null;
        }
        // remove any elements being removed from child indices
        s.childIndices = s.childIndices.filter(c => {
          return !removeIndex.includes(c);
        });
        if ( removeIndex.includes(s.index) ) {
          // if removing the selector element, remove any of its children
          // as well
          removeIndex = removeIndex.concat(s.childIndices);
          // replace with null so we don't have to recalculate references
          return null;
        }
        return s;
      })
    };
  }
  return { newPage, newElementIndex };
}