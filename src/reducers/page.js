import * as types from "../constants/ActionTypes";

/*
 * page
 * ----
 *
 * a page is made up of an array of pages and a pageIndex to indicate the current
 * page within the array. pages[0] is an undefined page.
 */
export default function page(state = {}, action) {
  switch ( action.type ) {
  /*
   * sets the pageIndex, specifying that the page in the pages array at that
   * index is the "current" page. If the index is out of the bounds of the
   * state.pages array, set to 0.
   */
  case types.LOAD_PAGE:
    var index = parseInt(action.index, 10);
    if ( isNaN(index) || index < 0 || index >= state.pages.length ) {
      index = 0;
    }
    return Object.assign({}, state, {
      pageIndex: index
    });

  /*
   * add a page to the pages array. Multiple pages with the same name can be created
   * so care needs to be taken when uploading.
   */
  case types.ADD_PAGE:
    if ( action.error ) {
      return state;
    }
    var pages = state.pages;
    var newPages = [...pages, action.page];
    return Object.assign({}, state, {
      pages: newPages,
      pageIndex: newPages.length - 1
    });

  /*
   * remove the page from the pages array
   */
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

  /*
   * all of the updating is done in the components, which is not very redux-y,
   * but since the data is tree-like and the tree's nodes are passed by
   * reference throughout the app, it is simpler to do that than to keep ids
   * on the nodes and make changes in here. Since the changes have already been
   * made, all this does is create a new array of pages to trigger an update
   * when adding a rule to or removing a rule from a selector so that the UI
   * can reflect 
   *
   */
  case types.RENAME_PAGE:
  case types.SAVE_SELECTOR:
  case types.REMOVE_SELECTOR:
  case types.RENAME_SELECTOR:
  case types.SAVE_RULE:
  case types.REMOVE_RULE:
    var { pages, pageIndex } = state;
    var page = pages[pageIndex];
    return Object.assign({}, state, {
      pages: [...pages.slice(0, pageIndex), page, ...pages.slice(pageIndex+1)]
    });

  case types.CLOSE_FORAGER:
    return Object.assign({}, state, {
      pageIndex: 0
    });

  default:
    return state;
  }
}
