import * as types from "../constants/ActionTypes";

/*
 * page
 * ----
 *
 * a page is made up of an array of pages, a pageIndex to indicate the current
 * page within the array, and a elementIndex to indicate the current selector
 * within the current page
 *
 * pages[0] is an undefined page.
 */
export default function page(state = {}, action) {
  switch ( action.type ) {
  case types.LOAD_PAGE:
    var index = parseInt(action.index, 10);
    // bad index values will be set to 0
    if ( isNaN(index) || index < 0 || index >= state.pages.length ) {
      index = 0;
    }
    return Object.assign({}, state, {
      pageIndex: index,
      elementIndex: 0
    });

  case types.ADD_PAGE:
    var pages = state.pages;
    var newPages = [
      ...pages,
      action.page
    ];
    return Object.assign({}, state, {
      pages: newPages,
      pageIndex: newPages.length - 1,
      elementIndex: 0
    });

  case types.REMOVE_PAGE:
    var { pages, pageIndex } = state;
    // don't remove the undefined page
    if ( pageIndex === 0 ) {
      return state;
    }
    return Object.assign({}, state, {
      pages: [
        ...pages.slice(0, pageIndex), ...pages.slice(pageIndex+1)
      ],
      pageIndex: 0,
      elementIndex: 0
    });

  case types.RENAME_PAGE:
    var { pages, pageIndex } = state;
    return Object.assign({}, state, {
      pages: [
        ...pages.slice(0, pageIndex),
        Object.assign({}, pages[pageIndex], {
          name: action.name
        }),
        ...pages.slice(pageIndex+1)]
    });

  case types.SELECT_ELEMENT:
    var { pages, pageIndex, elementIndex } = state;
    var selectorCount = pages[pageIndex].elements.length;
    var index = parseInt(action.index, 10);
    // set to 0 when out of bounds
    if ( isNaN(index) || index < 0 || index >= selectorCount) {
      index = 0;
    }
    return Object.assign({}, state, {
      elementIndex: index
    });

  case types.SAVE_ELEMENT:
    var { pages, pageIndex, elementIndex } = state;
    var currentPage = pages[pageIndex];
    var currentSelector = currentPage.elements[elementIndex];
    var currentCount = currentPage.elements.length;

    // set parent/child/index values
    var { element } = action;
    element.parent = currentSelector.index;
    element.index = currentCount;
    currentSelector.childIndices.push(currentCount);

    return Object.assign({}, state, {
      pages: [
        ...pages.slice(0, pageIndex),
        Object.assign({}, currentPage, {
          elements: currentPage.elements.concat([element])
        }),
        ...pages.slice(pageIndex+1)
      ],
      elementIndex: currentCount
    });

  case types.REMOVE_ELEMENT:
    var { pages, pageIndex, elementIndex } = state;
    // elementIndex will be the parent index
    var currentPage = pages[pageIndex];
    var currentSelector = currentPage.elements[elementIndex];

    // clear everything else out, but don't remove the body selector
    if ( elementIndex === 0 ) {
      const cleanedBody = Object.assign({}, currentPage.elements[0], {
        childIndices: []
      });
      return Object.assign({}, state, {
        pages: [
        ...pages.slice(0, pageIndex),
          Object.assign({}, currentPage, {
            elements: [cleanedBody]
          }),
          ...pages.slice(pageIndex+1)
        ],
        elementIndex: 0
      });
    }

    // index values of elements that should be removed
    let removeIndex = [elementIndex];
    var updatedPage = Object.assign({}, currentPage, {
      elements: currentPage.elements.map(s => {
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
    });

    return Object.assign({}, state, {
      pages: [
      ...pages.slice(0, pageIndex),
        updatedPage,
        ...pages.slice(pageIndex+1)
      ],
      elementIndex: 0
    });

  case types.RENAME_ELEMENT:
    var { pages, pageIndex, elementIndex } = state;
    var { name } = action;

    // elementIndex will be the parent index
    var currentPage = pages[pageIndex];

    return Object.assign({}, state, {
      pages: [
      ...pages.slice(0, pageIndex),
        Object.assign({}, currentPage, {
          elements: currentPage.elements.map(s => {
            // set the new name for the element matching elementIndex
            // only affects 'all' type elements
            if ( s.index === elementIndex && s.spec.type === "all" ) {
              return Object.assign({}, s, {
                spec: Object.assign({}, s.spec, {
                  value: name
                })
              });
            }
            return s;
          })
        }),
        ...pages.slice(pageIndex+1)
      ]
    });

    case types.TOGGLE_OPTIONAL:
      var { pages, pageIndex, elementIndex } = state;
      var currentPage = pages[pageIndex];
      return Object.assign({}, state, {
        pages: [
          ...pages.slice(0, pageIndex),
          Object.assign({}, currentPage, {
            elements: currentPage.elements.map(s => {
              if ( s.index === elementIndex ) {
                return Object.assign({}, s, {
                  optional: !s.optional
                });
              }
              return s;
            })
          }),
          ...pages.slice(pageIndex+1)
        ]
      });

  case types.SAVE_RULE:
    var { pages, pageIndex, elementIndex } = state;
    var { rule } = action;

    var currentPage = pages[pageIndex];

    return Object.assign({}, state, {
      pages: [
      ...pages.slice(0, pageIndex),
        Object.assign({}, currentPage, {
          elements: currentPage.elements.map(s => {
            // set the new name for the element matching elementIndex
            if ( s.index === elementIndex ) {
              s.rules = s.rules.concat([rule])
            }
            return s;
          })
        }),
        ...pages.slice(pageIndex+1)
      ]
    });

  case types.REMOVE_RULE:
    var { pages, pageIndex, elementIndex } = state;
    var { index } = action;

    var currentPage = pages[pageIndex];

    return Object.assign({}, state, {
      pages: [
      ...pages.slice(0, pageIndex),
        Object.assign({}, currentPage, {
          elements: currentPage.elements.map(s => {
            // remove the rule from the current element
            if ( s.index === elementIndex ) {
              return Object.assign({}, s, {
                rules: s.rules.filter((r,i) => i !== index)
              });
            }
            return s;
          })
        }),
        ...pages.slice(pageIndex+1)
      ]
    });  

  case types.CLOSE_FORAGER:
    return Object.assign({}, state, {
      pageIndex: 0,
      elementIndex: 0
    });

  default:
    return state;
  }
}
