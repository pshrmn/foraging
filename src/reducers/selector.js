import * as types from "../constants/ActionTypes";

export default function selector(state, action) {
  switch ( action.type ) {
  case types.SELECT_SELECTOR:
    return action.selector;
  case types.LOAD_PAGE:
    // when switching pages, no selector should be selected
    return undefined;
  default:
    return state;
  }
}
