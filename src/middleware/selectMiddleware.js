/*
 * handle the selecting of elements that match element selectors here
 */
import { select } from 'helpers/selection';
import * as types from 'constants/ActionTypes';
import { setMatches } from 'actions';

export default store => next => action => {
  const selectActions = [
    types.SELECT_PAGE,
    types.SAVE_ELEMENT,
    types.UPDATE_ELEMENT,
    types.REFRESH_MATCHES
  ];

  if ( !selectActions.includes(action.type) ) {
    return next(action);
  }

  switch ( action.type ) {
  // casting a wide net and reselecting everything
  case types.SELECT_PAGE:
  case types.SAVE_ELEMENT:
  case types.UPDATE_ELEMENT:
  case types.REFRESH_MATCHES:
    var result = next(action);
    var page = store.getState().page;
    var { pages, pageIndex } = page;
    var currentPage = pages[pageIndex];
    if ( currentPage === undefined ) {
      return;
    }
    // iterate over all elements, creating an object of matches for each element
    var matchesObject = currentPage.elements.reduce((matchObject, element) => {
      if ( element === null ) {
        return matchObject;
      }
      const parentElements = element.parent === null ? [document] : matchObject[element.parent];
      matchObject[element.index] = select(parentElements, element.selector, element.spec, '.forager-holder');
      return matchObject;
    }, {});

    // gets matches for all of the elements in the newly loaded page
    store.dispatch(
      setMatches(matchesObject)
    );
    return result;
  }
};
