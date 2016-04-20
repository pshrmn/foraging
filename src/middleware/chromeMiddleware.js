import * as ActionTypes from "../constants/ActionTypes";

import { showMessage } from "expiring-redux-messages";
import { setPages } from "../actions";

import {
  chromeSave,
  chromeDelete,
  chromeUpload,
  chromeRename,
  chromeSync } from "../helpers/chrome";

export default fullStore => next => action => {
  const current = fullStore.getState();
  const { pages, pageIndex } = current.page;
  const page = pages[pageIndex];
  switch ( action.type ) {
  case ActionTypes.RENAME_PAGE:
    // new name, old name
    chromeRename(action.name, page.name);
    fullStore.dispatch(
      showMessage(`Renamed "${page.name}" to "${action.name}"`, 1000, 1)
    );
    return next(action);

  case ActionTypes.REMOVE_PAGE:
    var nameToRemove = pages[pageIndex].name;
    chromeDelete(nameToRemove);
    fullStore.dispatch(
      showMessage(`Removed Page "${nameToRemove}"`, 1000, 0)
    );
    return next(action);

  case ActionTypes.UPLOAD_PAGE:
    chromeUpload(pages[pageIndex])
      .then(resp => {
        fullStore.dispatch(
          showMessage('Upload Successful', 5000, 1)
        );
      })
      .catch(error => {
        fullStore.dispatch(
          showMessage(error, 5000, -1)
        );
      });
    break;

  case ActionTypes.SYNC_PAGES:
    chromeSync()
      .then(pages => {
        fullStore.dispatch(
          setPages(pages)
        );
        fullStore.dispatch(
          showMessage('Pages synced', 5000, 1)
        );
      })
      .catch(error => {
        fullStore.dispatch(
          showMessage('Failed to sync pages', 5000, -1)
        );
      });
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
    fullStore.dispatch(
      showMessage('Saved', 1000, 1)
    );
    return retVal;

  default:
    return next(action);
  }
}
