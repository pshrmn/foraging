import * as ActionTypes from 'constants/ActionTypes';

import { showMessage } from 'expiring-redux-messages';
import { setPages } from 'actions';

import * as chromeExt from 'helpers/chrome';

export default fullStore => next => action => {
  const store = fullStore.getState();
  const { pages } = store;
  const { params } = store.response || {};
  const current = params && params.name;
  const page = pages.find(p => p.name === current);
  switch ( action.type ) {
  case ActionTypes.RENAME_PAGE:
    // new name, old name
    chromeExt.rename(action.name, page.name)
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
    var nameToRemove = page.name;
    chromeExt.remove(nameToRemove)
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

  case ActionTypes.SYNC_PAGES:
    chromeExt.sync()
      .then(pages => {
        fullStore.dispatch(
          setPages(pages)
        );
        fullStore.dispatch(
          showMessage('Pages synced', 5000, 1)
        );
      })
      .catch(() => {
        fullStore.dispatch(
          showMessage('Failed to sync pages', 5000, -1)
        );
      });
    break;

  // for chromeSave actions, save after the action has reached the reducer
  // so that we are saving the updated state of the store
  case ActionTypes.ADD_PAGE:
  case ActionTypes.UPDATE_PAGE:
    const retVal = next(action);
    const newState = fullStore.getState();
    const { pages: newPages, response } = newState;
    const newPageName = response.params.name;
    const newPage = newPages.find(p => p.name === newPageName);
    chromeExt.save(newPage)
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
    return retVal;

  default:
    return next(action);
  }
};
