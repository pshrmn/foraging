import { createStore, combineReducers, applyMiddleware } from 'redux';
import { messages, messagesMiddleware } from 'expiring-redux-messages';

import { frame, show, page } from 'reducers';
import chromeMiddleware from 'middleware/chromeMiddleware';
import selectMiddleware from 'middleware/selectMiddleware';
import confirmMiddleware from 'middleware/confirmMiddleware';

const reducer = combineReducers({
  frame,
  show,
  page,
  messages
});

const initialState = {
  show: true,
  page: {
    pages: [undefined],
    pageIndex: 0,
    elementIndex: 0
  },
  frame: {
    name: 'element',
    data: {}
  },
  messages: []
};

export default function makeStore() {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(
      confirmMiddleware,
      selectMiddleware,
      chromeMiddleware,
      messagesMiddleware
    )
  );
  return store;
}
