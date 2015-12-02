import * as types from "../constants/ActionTypes";

/*
 * selector
 * ---------
 *
 * Never create a new selector, always just mutate the current one so that
 * the changes are reflected in the page that contains the selector.
 */
export default function selector(state, action) {
  switch ( action.type ) {
  case types.SELECT_SELECTOR:
  case types.SAVE_SELECTOR:
    return action.selector;
  case types.REMOVE_SELECTOR:
  case types.LOAD_PAGE:
  case types.ADD_PAGE:
  case types.REMOVE_PAGE:
  case types.CLOSE_FORAGER:
    return undefined;
  case types.SAVE_RULE:
    state.rules.push(action.rule);
    return state;
  case types.REMOVE_RULE:
    var rules = state.rules;
    state.rules.splice(action.index, 1);
    return state;
  default:
    return state;
  }
}
