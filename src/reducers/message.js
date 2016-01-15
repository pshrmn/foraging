import * as types from "../constants/ActionTypes";

/* 
 * message
 * -------
 *
 * a message to show the user (useful for errors)
 */
export default function message(state = {}, action) {
  switch ( action.type ) {
  case types.SHOW_MESSAGE:
  case types.ADD_PAGE:
  case types.RENAME_PAGE:
    return Object.assign({}, {
      text: action.text,
      wait: action.wait
    });
  default:
    return {
      text: "",
      wait: undefined
    };
  }
}
