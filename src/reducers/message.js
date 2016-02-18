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
