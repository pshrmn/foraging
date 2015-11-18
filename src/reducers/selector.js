import * as types from "../constants/ActionTypes";

export default function selector(state, action) {
  switch ( action.type ) {
  case types.SELECT_SELECTOR:
  case types.SAVE_SELECTOR:
    return action.selector;
  case types.REMOVE_SELECTOR:
  case types.LOAD_PAGE:
  case types.ADD_PAGE:
  case types.REMOVE_PAGE:
    return undefined;
  default:
    return state;
  }
}
