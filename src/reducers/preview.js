import * as types from "../constants/ActionTypes";

export default function preview(state = {}, action) {
  switch ( action.type ) {
  case types.SHOW_PREVIEW:
    return Object.assign({}, {
      visible: true
    });
  case types.HIDE_PREVIEW:
    return Object.assign({}, {
      visible: false
    });
  default:
    return state;
  }
}
