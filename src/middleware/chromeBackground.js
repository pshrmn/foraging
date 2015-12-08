import * as ActionTypes from "../constants/ActionTypes";
import { chromeUpload } from "../helpers/chrome";

export default state => next => action => {
  switch ( action.type ) {
  case ActionTypes.UPLOAD_PAGE:
    var current = state.getState();
    var { pages, pageIndex } = current.page;
    chromeUpload(pages[pageIndex]);
  }
  return next(action);
}
