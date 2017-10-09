/* eslint-disable no-redeclare */
import * as types from 'constants/ActionTypes';

/*
 * page
 * ----
 *
 * a page is made up of an array of pages, a current name string to indicate the
 * current page within the array, and an elementIndex to indicate the current
 * selector within the current page
 */
export default function page(state = {}, action) {
  switch ( action.type ) {
  case types.SELECT_PAGE:
    return Object.assign({}, state, {
      current: action.name,
      elementIndex: 0
    });

  /*
   * when setting pages, reset to empty page
   */
  case types.SET_PAGES:
    return Object.assign({}, state, {
      current: undefined,
      pages: action.pages,
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
      current: action.page.name,
      elementIndex: 0
    });

  case types.REMOVE_PAGE:
    var { pages, current } = state;
    return Object.assign({}, state, {
      pages: pages.filter(p => p.name !== current),
      current: undefined,
      elementIndex: 0
    });

  case types.RENAME_PAGE:
    var { pages, current } = state;
    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name === current) {
          return {
            ...p,
            name: action.name
          };
        } else {
          return p;
        }
      }),
      current: action.name
    });

  case types.SET_MATCHES:
    var { pages, current } = state;
    var { matches } = action;
    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name !== current) {
          return p;
        }

        return {
          ...p,
          elements: p.elements.map(element => {
            if ( element === null ) {
              return null;
            }
            const eleMatches = matches[element.index];
            if ( eleMatches !== undefined ) {
              return Object.assign({}, element, {
                matches: eleMatches
              });
            } else {
              return element;
            }
          })
        };
      })
    });

  case types.SELECT_ELEMENT:
    var { pages, current, elementIndex } = state;
    var page = pages.find(p => p.name === current);
    var selectorCount = page.elements.length;
    var index = parseInt(action.index, 10);
    // set to 0 when out of bounds
    if ( isNaN(index) || index < 0 || index >= selectorCount) {
      index = 0;
    }
    return Object.assign({}, state, {
      elementIndex: index
    });

  case types.SAVE_ELEMENT:
    var { pages, current, elementIndex } = state;
    var currentPage = pages.find(p => p.name === current);
    var currentSelector = currentPage.elements[elementIndex];
    var currentCount = currentPage.elements.length;

    // set parent/child/index values
    var { element } = action;
    element.parent = currentSelector.index;
    element.index = currentCount;
    currentSelector.childIndices.push(currentCount);

    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name !== current) {
          return p;
        }
        return {
          ...p,
          elements: currentPage.elements.concat([element])
        };
      }),
      elementIndex: currentCount
    });

  case types.UPDATE_ELEMENT:
    var { pages, current, elementIndex } = state;
    var currentPage = pages.map(p => p.name === current);
    var currentSelector = currentPage.elements[elementIndex];

    var { index, newProps } = action;

    // don't actually update the 0th Element (body)
    if ( index === 0 ) {
      return state;
    }

    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name !== current) {
          return p;
        }
        return {
          ...p,
          elements: currentPage.elements.map(e => {
            if ( e === null ) {
              return null;
            } else if ( e.index !== index ) {
              return e;
            } else {
              return Object.assign({}, e, newProps);
            }
          })
        };
      })
    });

  case types.REMOVE_ELEMENT:
    var { pages, current, elementIndex } = state;
    // elementIndex will be the parent index
    var currentPage = pages.find(p => p.name === current);
    var currentSelector = currentPage.elements[elementIndex];

    // clear everything else out, but don't remove the body selector
    if ( elementIndex === 0 ) {
      const cleanedBody = Object.assign({}, currentPage.elements[0], {
        childIndices: []
      });
      return Object.assign({}, state, {
        pages: pages.map(p => {
          if (p.name !== current) {
            return p;
          }
          return {
            ...p,
            element: [cleanedBody]
          };
        }),
        elementIndex: 0
      });
    }

    // index values of elements that should be removed
    let removeIndex = [elementIndex];
    let newElementIndex = currentPage.elements[elementIndex].parent || 0;
    var updatedPage = Object.assign({}, currentPage, {
      elements: currentPage.elements.map(s => {
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
    });

    return Object.assign({}, state, {
      pages: pages.map(p => p.name === current ? updatedPage : p),
      elementIndex: newElementIndex
    });

  case types.SAVE_RULE:
    var { pages, current, elementIndex } = state;
    var { rule } = action;

    var currentPage = pages.find(p => p.name === current);

    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name !== current) {
          return p;
        }
        return {
          ...p,
          elements: currentPage.elements.map(s => {
            // set the new name for the element matching elementIndex
            if ( s !== null && s.index === elementIndex ) {
              s.rules = s.rules.concat([rule]);
            }
            return s;
          })
        };
      })
    });

  case types.REMOVE_RULE:
    var { pages, current, elementIndex } = state;
    var { index } = action;

    var currentPage = pages.find(p => p.name === current);

    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name !== current) {
          return p;
        }
        return {
          ...p,
          elements: currentPage.elements.map(s => {
            // remove the rule from the current element
            if ( s !== null && s.index === elementIndex ) {
              return Object.assign({}, s, {
                rules: s.rules.filter((r,i) => i !== index)
              });
            }
            return s;
          })
        };
      })
    });

  case types.UPDATE_RULE:
    var { pages, current, elementIndex } = state;
    var { index, rule } = action;

    var currentPage = pages.find(p => p.name === current);

    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name === current) {
          return p;
        }
        return {
          ...p,
          elements: currentPage.elements.map(s => {
            // set the new name for the element matching elementIndex
            if ( s !== null && s.index === elementIndex ) {
              s.rules = s.rules.map((r,i) => i === index ? rule : r);
            }
            return s;
          })
        };
      })
    });

  case types.CLOSE_FORAGER:
    return Object.assign({}, state, {
      currentPage: undefined,
      elementIndex: 0
    });

  default:
    return state;
  }
}
