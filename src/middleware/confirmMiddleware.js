/*
 * intercept some actions that can remove pages/elements and force
 * the user to confirm that they want to complete the action
 */
import * as types from '../constants/ActionTypes';
import { syncPages, removePage, removeElement } from '../actions';

export default store => next => action => {
  const selectActions = [
    types.SYNC_PAGES,
    types.REMOVE_PAGE,
    types.REMOVE_ELEMENT
  ];

  if ( !selectActions.includes(action.type) ) {
    return next(action);
  }

  let confirmMessage = 'Are you sure?';
  switch ( action.type ) {
  case types.SYNC_PAGES:
    confirmMessage = 'Syncing pages will overwrite duplicate pages. Continue?';
    break;
  case types.REMOVE_PAGE:
    var { page } = store.getState();
    var { pages, pageIndex } = page;
    var currentPage = pages[pageIndex];
    confirmMessage = `Are you sure you want to delete the page "${currentPage.name}"?`;
    break;
  case types.REMOVE_ELEMENT:
    // this relies on the fact that we only ever can remove the current element
    var { page } = store.getState();
    var { pages, pageIndex, elementIndex } = page;
    var currentPage = pages[pageIndex];
    var element = currentPage.elements[elementIndex];
    confirmMessage = element.index === 0 ?
      'Are you sure you want to reset the page? This will delete all rules and child elements' :
      `Are you sure you want to delete the element "${element.selector}"?`
    break;
  }

  if ( !window.confirm(confirmMessage) ) {
    return;
  }
  next(action);
}