import * as types from "../constants/ActionTypes";

import { legalName, createPage, setupPage } from "../helpers";

export default state => next => action => {
  let fadeTime = 5000;
  if ( action.type === types.ADD_PAGE || action.type === types.RENAME_PAGE ) {
    action.error = false;
    let current = state.getState();
    let { pages, pageIndex } = current.page;
    let name = action.name;
    // verify that the name contains no illegal characters
    if ( !legalName(name) ) {
      action.text = `Name "${name}" contains one or more illegal characters (< > : \" \\ / | ? *)`;
      action.fade = fadeTime;
      action.error = true;
    }
    // verify that a page with the given name does not already exist
    let exists = pages.some(curr => curr === undefined ? false : name === curr.name);
    if ( exists ) {
      action.text = `A page with the name "${name}" already exists`;
      action.fade = fadeTime;
      action.error = true;
    }
    action.selector = current.selector;
    // need to actually create the page for ADD_PAGE
    if ( !action.error ) {
      if ( action.type === types.ADD_PAGE ) {
        let newPage = createPage(name);
        setupPage(newPage);
        action.page = newPage;
        action.selector = newPage;
      } else {
        // 
        let currentPage = pages[pageIndex];
        currentPage.name = name;
      }
      
    }
  }
  return next(action);
}
