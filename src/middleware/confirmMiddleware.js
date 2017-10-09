/* eslint-disable no-redeclare */

/*
 * intercept some actions that can remove pages/elements and force
 * the user to confirm that they want to complete the action
 */
import * as types from 'constants/ActionTypes';

export default () => next => action => {
  const selectActions = [
    types.SYNC_PAGES
  ];

  if ( !selectActions.includes(action.type) ) {
    return next(action);
  }

  let confirmMessage = 'Are you sure?';
  switch ( action.type ) {
  case types.SYNC_PAGES:
    confirmMessage = 'Syncing pages will overwrite duplicate pages. Continue?';
    break;
  }

  if ( !window.confirm(confirmMessage) ) {
    return false;
  }
  next(action);
};
