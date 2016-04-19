import { createStore, applyMiddleware } from "redux";

import reducer from './reducers';
import chromeMiddleware from "./middleware/chromeMiddleware";
import messageMiddleware from "./middleware/messageMiddleware";

const initialState = {
  show: true,
  page: {
    pages: [undefined],
    pageIndex: 0,
    elementIndex: 0
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

export default function makeStore() {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(
      chromeMiddleware,
      messageMiddleware
    )
  );
  return store;
}
