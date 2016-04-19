import * as ActionTypes from "../constants/ActionTypes";

import { addMessage, removeMessage } from "../actions";

/*
 * the message middleware intercepts messages before they reach
 * the reducer. A new action will be dispatched for the message
 * with a unique ID. After the wait time, another action will
 * be dispatched to delete the message with the given ID.
 */
export default fullStore => next => action => {
  if ( action.type !== ActionTypes.SHOW_MESSAGE ) {
    return next(action);
  }
  const { wait, text } = action;
  const id = pseudoRandomID();
 
  setTimeout(() => {
    fullStore.dispatch(
      removeMessage(id)
    )
  }, wait);

  return fullStore.dispatch(
    addMessage(text, id)
  );
}

function pseudoRandomID() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charCount = chars.length;
  return Array.from(Array(5))
    .map(() => chars[Math.floor(Math.random() * charCount)])
    .join('')
}
