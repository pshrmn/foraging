import * as ActionTypes from 'constants/ActionTypes';

import { showMessage } from 'expiring-redux-messages';
import { setPages } from 'actions';

import * as chrome from 'helpers/chrome';

export default fullStore => next => action => {
  const current = fullStore.getState();
  const { pages, pageIndex } = current.page;
  const page = pages[pageIndex];
  switch ( action.type ) {
  case ActionTypes.RENAME_PAGE:
    // new name, old name
    chrome.rename(action.name, page.name)
      .then(resp => {
        fullStore.dispatch(
          showMessage(resp, 1000, 1)
        );
      })
      .catch(error => {
        fullStore.dispatch(
          showMessage(error, 1000, -1)
        );
      });
    return next(action);

  case ActionTypes.REMOVE_PAGE:
    var nameToRemove = pages[pageIndex].name;
    chrome.remove(nameToRemove)
      .then(resp => {
        fullStore.dispatch(
          showMessage(resp, 1000, 1)
        );
      })
      .catch(error => {
        fullStore.dispatch(
          showMessage(error, 1000, -1)
        );
      });
    return next(action);

  case ActionTypes.UPLOAD_PAGE:
    chrome.upload(pages[pageIndex])
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
    chrome.sync()
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
  case ActionTypes.UPDATE_ELEMENT:
  case ActionTypes.SAVE_RULE:
  case ActionTypes.REMOVE_RULE:
    const retVal = next(action);
    const newState = fullStore.getState();
    const { page: newPage } = newState;
    const { pages: newPages, pageIndex: newPageIndex } = newPage;
    chrome.save(newPages[newPageIndex])
      .then(resp => {
        fullStore.dispatch(
          showMessage(resp, 1000, 1)
        );
      })
      .catch(error => {
        fullStore.dispatch(
          showMessage(error, 1000, -1)
        )
      })
    return retVal;

  default:
    return next(action);
  }
}
