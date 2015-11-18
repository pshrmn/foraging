/*import * as types from "../constants/ActionTypes";
  case types.REMOVE_RULE:
    return Object.assign({}, state, {

    });
*/
import frame from "./frame";
import show from "./show";
import page from "./page";
import selector from "./selector";
import preview from "./preview";

const initialState = {
  show: true,
  page: {
    pages: [
      undefined
    ],
    pageIndex: 0
  },
  frame: {
    name: "selector",
    data: {}
  },
  preview: {
    visible: false
  },
  selector: undefined
};

/*
 * Forager reducer
 */
function reducer(state = initialState, action) {
  switch ( action.type ) {
  default:
    return {
      frame: frame(state.frame, action),
      show: show(state.show, action),
      page: page(state.page, action),
      selector: selector(state.selector, action),
      preview: preview(state.preview, action)
    };
  }
}

export default reducer;
