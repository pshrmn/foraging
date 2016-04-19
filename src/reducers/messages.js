import * as types from "../constants/ActionTypes";

/* 
 * message
 * -------
 *
 * a message to show the user (useful for errors)
 */
export default function messages(state = [], action) {
  switch ( action.type ) {
  case types.ADD_MESSAGE:
    return state.concat([
      {
        id: action.id,
        text: action.text
      }
    ]);
  case types.REMOVE_MESSAGE:
    var { id } = action;
    return state.filter(m => m.id !== id);
  default:
    return state;
  }
}
