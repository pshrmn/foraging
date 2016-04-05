import show from "./show";
import page from "./page";
import frame from "./frame";
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
    name: "element",
    data: {}
  },
  preview: {
    visible: false
  },
  message: {
    text: "",
    wait: undefined
  }
};

export default function reducer(state = initialState, action) {
  switch ( action.type ) {
  default:
    return {
      frame: frame(state.frame, action),
      show: show(state.show, action),
      page: page(state.page, action),
      preview: preview(state.preview, action),
      message: message(state.message, action)
    };
  }
}
