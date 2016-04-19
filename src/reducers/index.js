import show from "./show";
import page from "./page";
import frame from "./frame";
import preview from "./preview";
import messages from "./messages";

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
  messages: []
};

export default function reducer(state = initialState, action) {
  switch ( action.type ) {
  default:
    return {
      frame: frame(state.frame, action),
      show: show(state.show, action),
      page: page(state.page, action),
      preview: preview(state.preview, action),
      messages: messages(state.messages, action)
    };
  }
}
