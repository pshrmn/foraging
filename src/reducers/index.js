import frame from "./frame";
import show from "./show";
import page from "./page";
import selector from "./selector";
import preview from "./preview";
import message from "./message";

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
  selector: undefined,
  messages: {
    text: "",
    fade: undefined
  }
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
      preview: preview(state.preview, action),
      message: message(state.message, action)
    };
  }
}

export default reducer;
