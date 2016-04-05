import * as types from "../constants/ActionTypes";

/*
 * show
 * ----
 *
 * Determines whether or not the Forager UI is shown. When show=false, the
 * extension can be considered off.
 */
export default function show(state = true, action) {
  switch ( action.type ) {
  case types.CLOSE_FORAGER:
    return false;
  case types.OPEN_FORAGER:
    return true;
  default:
    return state;
  }
}
