import * as types from "../constants/ActionTypes";

export default function page(state = {}, action) {
  switch ( action.type ) {
  case types.LOAD_PAGE:
    /*
     * if the index is out of the bounds of state.pages, set to 0
     */
    var max = state.pages.length;
    var index = action.index;
    if ( index < 0 || index >= max ) {
      index = 0;
    }
    return Object.assign({}, state, {
      pageIndex: index
    });
  case types.ADD_PAGE:
    var pages = state.pages;
    var newPages = [...pages, action.page];
    return Object.assign({}, state, {
      pages: newPages,
      pageIndex: newPages.length - 1
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
      pageIndex: 0
    });
  case types.RENAME_PAGE:
    var { pages, pageIndex } = state;
    // can't rename the empty page
    if ( pageIndex === 0 ) {
      return state;
    }
    var newPages = pages.slice();
    newPages[pageIndex] = Object.assign({}, newPages[pageIndex], {
      name: action.name
    });
    return Object.assign({}, state, {
      pages: newPages
    });
  default:
    return state;
  }
}
