import * as types from "../constants/ActionTypes";

import { legalName } from "../helpers/text";
import { createPage, setupPage } from "../helpers/page";

export default state => next => action => {
  if ( action.type === types.ADD_PAGE || action.type === types.RENAME_PAGE ) {
    action.error = false;

    const current = state.getState();
    const { pages, pageIndex } = current.page;
    const name = action.name;
    const wait = 5000;

    // verify that the name contains no illegal characters
    if ( !legalName(name) ) {
      action.text = `Name "${name}" contains one or more illegal characters (< > : \" \\ / | ? *)`;
      action.wait = wait;
      action.error = true;
    }
    // verify that a page with the given name does not already exist
    const exists = pages.some(curr => curr === undefined ? false : name === curr.name);
    if ( exists ) {
      action.text = `A page with the name "${name}" already exists`;
      action.wait = wait;
      action.error = true;
    }
    action.element = current.element;
    // need to actually create the page for ADD_PAGE
    if ( !action.error ) {
      if ( action.type === types.ADD_PAGE ) {
        const newPage = createPage(name);
        setupPage(newPage);
        action.page = newPage;
        action.element = newPage.element;
      } else {
        const currentPage = pages[pageIndex];
        currentPage.name = name;
      }
      
    }
  }
  return next(action);
}
