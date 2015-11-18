import * as ActionTypes from "../constants/ActionTypes";

export default state => next => action => {
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

  let sel;

  let search = selector => {
    if ( selector.id === id ) {
      sel = selector;
      return true;
    } else {
      return selector.children.some(child => {
        return search(child);
      })
    }
  }
  search(page);
  return sel;
}