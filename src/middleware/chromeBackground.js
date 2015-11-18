import * as ActionTypes from "../constants/ActionTypes";
import { clean } from "../helpers";

export default state => next => action => {
  switch ( action.type ) {
  case ActionTypes.UPLOAD_PAGE:
    var current = state.getState();
    var { pages, pageIndex } = current.page;
    var page = pages[pageIndex];

    let uploadData = {
      name: page.name,
      site: window.location.hostname,
      page: JSON.stringify(clean(page))
    }
    console.log(uploadData);
    chrome.runtime.sendMessage({type: 'upload', data: uploadData}); 
  }
  return next(action);
}