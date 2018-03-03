/* eslint-disable no-redeclare */
import * as types from 'constants/ActionTypes';

/*
 * page
 * ----
 *
 * a page is made up of an array of pages
 */
export default function page(state = {}, action) {
  switch ( action.type ) {
  /*
   * when setting pages, reset to empty page
   */
  case types.SET_PAGES:
    return action.pages;

  case types.ADD_PAGE:
    return [
      ...state,
      action.page
    ];

  case types.REMOVE_PAGE:
    return state.filter(p => p.name !== action.name);

  case types.RENAME_PAGE:
    return state.map(p => {
      if (p.name === action.oldName) {
        return {
          ...p,
          name: action.name
        };
      } else {
        return p;
      }
    });

  case types.UPDATE_PAGE:
    var name = action.page.name;
    return state.map(p => {
      if (p.name === name) {
        return action.page;
      } else {
        return p;
      }
    });

  default:
    return state;
  }
}
