import * as ActionTypes from "../constants/ActionTypes";

import { chromeSave, chromeDelete, chromeUpload, chromeRename } from "../helpers/chrome";

export default state => next => action => {
  const current = state.getState();
  const { pages, pageIndex } = current.page;
  const page = pages[pageIndex];
  switch ( action.type ) {

  case ActionTypes.ADD_PAGE:
    chromeSave(action.page);
    return next(action);

  case ActionTypes.RENAME_PAGE:
    chromeRename(action.name, page.name);
    return next(action);

  case ActionTypes.REMOVE_PAGE:
    chromeDelete(pages[pageIndex].name);
    return next(action);

  case ActionTypes.UPLOAD_PAGE:
    // the upload action doesn't need to hit the reducer
    chromeUpload(pages[pageIndex]);
    break;

  case ActionTypes.SAVE_ELEMENT:
  case ActionTypes.REMOVE_ELEMENT:
  case ActionTypes.RENAME_ELEMENT:
  case ActionTypes.SAVE_RULE:
  case ActionTypes.REMOVE_RULE:
  case ActionTypes.TOGGLE_OPTIONAL:
    chromeSave(page);
    return next(action);

  default:
    return next(action);
  }
}
