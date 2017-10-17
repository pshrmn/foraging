import { createStore, combineReducers, applyMiddleware } from 'redux';
import { messages, messagesMiddleware } from 'expiring-redux-messages';
import { responseReducer, curiReducer } from '@curi/redux';

import { show, pages } from 'reducers';
import chromeMiddleware from 'middleware/chromeMiddleware';

const reducer = combineReducers({
  show,
  pages,
  messages,
  response: responseReducer,
  curi: curiReducer
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
    chromeMiddleware,
    messagesMiddleware
  )
);
