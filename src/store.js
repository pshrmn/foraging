import { createStore, combineReducers, applyMiddleware } from "redux";
import { messages, messagesMiddleware } from "expiring-redux-messages";

import reducers from './reducers';
import chromeMiddleware from "./middleware/chromeMiddleware";
import selectMiddleware from "./middleware/selectMiddleware";

const reducer = combineReducers(Object.assign({}, reducers, {
  messages
}));

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
  messages: []
};

export default function makeStore() {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(
      selectMiddleware,
      chromeMiddleware,
      messagesMiddleware
    )
  );
  return store;
}
