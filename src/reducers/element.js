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
  case types.LOAD_PAGE:
  case types.RENAME_PAGE:
  case types.SELECT_ELEMENT:
  case types.SAVE_ELEMENT:
    return action.element;
  case types.REMOVE_ELEMENT:
  case types.REMOVE_PAGE:
  case types.CLOSE_FORAGER:
    return undefined;
  case types.SAVE_RULE:
    state.rules.push(action.rule);
    return state;
  case types.TOGGLE_OPTIONAL:
    state.optional = action.optional;
    return state;
  case types.REMOVE_RULE:
    var rules = state.rules;
    state.rules.splice(action.index, 1);
    return state;
  default:
    return state;
  }
}
