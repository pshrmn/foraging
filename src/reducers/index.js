import * as types from "../constants/ActionTypes";

const initialState = {
  pages: [
    undefined
  ],
  pageIndex: 0
};

/*
 * Forager reducer
 * One big function for the time being
 */
function reducer(state = initialState, action) {
  switch ( action.type ) {
  case types.LOAD_PAGE:
    return Object.assign({}, state, {
      pageIndex: action.index
    });
  case types.ADD_PAGE:
    var pages = state.pages;
    pages.push(action.page);
    return Object.assign({}, state, {
      pages: pages,
      pageIndex: pages.length - 1
    });
  case types.REMOVE_PAGE:
    var { pages, pageIndex } = state;
    // don't remove the undefined page
    if ( pageIndex !== 0 ) {
      pages.splice(pageIndex, 1);
    }
    return Object.assign({}, state, {
      pages: pages,
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

export default reducer;