import { createStore, combineReducers, applyMiddleware } from 'redux';
import { messages, messagesMiddleware } from 'expiring-redux-messages';
import { responseReducer } from '@curi/redux';

import { show, pages } from 'reducers';
import chromeMiddleware from 'middleware/chromeMiddleware';
import confirmMiddleware from 'middleware/confirmMiddleware';

const reducer = combineReducers({
  show,
  pages,
  messages,
  response: responseReducer
});

const initialState = {
  show: true,
  pages: [],
  messages: []
};

export default createStore(
  reducer,
  initialState,
  applyMiddleware(
    confirmMiddleware,
    chromeMiddleware,
    messagesMiddleware
  )
);
