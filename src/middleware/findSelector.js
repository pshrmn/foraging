import * as ActionTypes from "../constants/ActionTypes";

export const findSelector = state => next => action => {
  switch ( action.type ) {
  case ActionTypes.SELECT_SELECTOR:
    let current = state.getState();
    let id = action.selectorID;
    let page = current.page.pages[current.page.pageIndex];
    let selector = find(page, id);
    action.selector = selector;
    break;
  }
  return next(action);
};

let find = (page, id) => {
  if ( page.id === id ) {
    return page;
  } else {
    let sel;
    page.children.some(child => {
      let val = find(child, id);
      if ( val !== undefined ) {
        sel = child;
        return true;
      }
      return false;
    });
    return sel;
  }
}