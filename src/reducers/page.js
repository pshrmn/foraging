/* eslint-disable no-redeclare */
import * as types from 'constants/ActionTypes';

/*
 * page
 * ----
 *
 * a page is made up of an array of pages and an elementIndex to indicate the current
 * selector within the current page
 */
export default function page(state = {}, action) {
  switch ( action.type ) {
  /*
   * when setting pages, reset to empty page
   */
  case types.SET_PAGES:
    return Object.assign({}, state, {
      pages: action.pages,
      elementIndex: 0
    });

  case types.ADD_PAGE:
    return Object.assign({}, state, {
      pages: [
        ...state.pages,
        action.page
      ],
      elementIndex: 0
    });

  case types.REMOVE_PAGE:
    var { pages } = state;
    return Object.assign({}, state, {
      pages: pages.filter(p => p.name !== action.name),
      elementIndex: 0
    });

  case types.RENAME_PAGE:
    var { pages } = state;
    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name === action.oldName) {
          return {
            ...p,
            name: action.name
          };
        } else {
          return p;
        }
      })
    });

  case types.UPDATE_PAGE:
    var { pages } = state;
    var name = action.page.name;
    return Object.assign({}, state, {
      pages: pages.map(p => {
        if (p.name === name) {
          return action.page;
        } else {
          return p;
        }
      })
    });

  default:
    return state;
  }
}
