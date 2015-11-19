import * as types from "../constants/ActionTypes";

export default function show(state = true, action) {
  switch ( action.type ) {
  case types.CLOSE_FORAGER:
    return false;
  case types.SHOW_FORAGER:
    return true;
  default:
    return state;
  }
}
