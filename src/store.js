import { createStore, combineReducers, applyMiddleware } from 'redux';
import { messages, messagesMiddleware } from 'expiring-redux-messages';
import { responseReducer } from '@curi/redux';

import { frame, show, page } from 'reducers';
import chromeMiddleware from 'middleware/chromeMiddleware';
import selectMiddleware from 'middleware/selectMiddleware';
import confirmMiddleware from 'middleware/confirmMiddleware';

const reducer = combineReducers({
  frame,
  show,
  page,
  messages,
  response: responseReducer
});

const initialState = {
  show: true,
  page: {
    pages: [],
    current: undefined,
    elementIndex: 0
  },
  frame: {
    name: 'element',
    data: {}
  },
  messages: []
};

export default createStore(
  reducer,
  initialState,
  applyMiddleware(
    confirmMiddleware,
    selectMiddleware,
    chromeMiddleware,
    messagesMiddleware
  )
);
