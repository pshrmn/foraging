import * as ActionTypes from "../constants/ActionTypes";

import { chromeSave, chromeDelete, chromeUpload, chromeRename } from "../helpers/chrome";

export default fullStore => next => action => {
  const current = fullStore.getState();
  const { pages, pageIndex } = current.page;
  const page = pages[pageIndex];
  switch ( action.type ) {
  case ActionTypes.RENAME_PAGE:
    // new name, old name
    chromeRename(action.name, page.name);
    return next(action);

  case ActionTypes.REMOVE_PAGE:
    chromeDelete(pages[pageIndex].name);
    return next(action);

  case ActionTypes.UPLOAD_PAGE:
    // the upload action doesn't need to hit the reducer
    chromeUpload(pages[pageIndex]);
    break;

  // for chromeSave actions, save after the action has reached the reducer
  // so that we are saving the updated state of the store
  case ActionTypes.ADD_PAGE:
  case ActionTypes.SAVE_ELEMENT:
  case ActionTypes.REMOVE_ELEMENT:
  case ActionTypes.RENAME_ELEMENT:
  case ActionTypes.SAVE_RULE:
  case ActionTypes.REMOVE_RULE:
  case ActionTypes.TOGGLE_OPTIONAL:
    const retVal = next(action);
    const newState = fullStore.getState();
    const { page: newPage } = newState;
    const { pages: newPages, pageIndex: newPageIndex } = newPage;
    chromeSave(newPages[newPageIndex]);
    return retVal;

  default:
    return next(action);
  }
}
