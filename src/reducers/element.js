import * as types from "../constants/ActionTypes";

/*
 * element
 * ---------
 *
 * Never create a new element, always just mutate the current one so that
 * the changes are reflected in the page that contains the element.
 */
export default function element(state, action) {
  switch ( action.type ) {
  case types.ADD_PAGE:
    return action.page.element;

  // loadPage is passed the element since it doesn't have
  // access to the store's page
  case types.LOAD_PAGE:
  case types.SELECT_ELEMENT:
  case types.SAVE_ELEMENT:
    return action.element;

  case types.REMOVE_ELEMENT:
  case types.REMOVE_PAGE:
  case types.CLOSE_FORAGER:
    return undefined;

  case types.SAVE_RULE:
  case types.REMOVE_RULE:
  case types.RENAME_ELEMENT:
  case types.TOGGLE_OPTIONAL:
    return Object.assign({}, state);
  default:
    return state;
  }
}
