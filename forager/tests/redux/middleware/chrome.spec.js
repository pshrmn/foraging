import configureStore from 'redux-mock-store';

import chromeMiddleware from 'middleware/chromeMiddleware';
import {
  RENAME_PAGE,
  REMOVE_PAGE,
  UPLOAD_PAGE,
  SYNC_PAGES,
  ADD_PAGE,
  SAVE_ELEMENT,
  REMOVE_ELEMENT,
  UPDATE_ELEMENT,
  SAVE_RULE,
  REMOVE_RULE
} from 'constants/ActionTypes';
import * as chrome from 'helpers/chrome';

// mock each chrome function to return a Promise
Object.keys(chrome).forEach(key => {
  chrome[key] = jest.fn().mockReturnValue(Promise.resolve(key))
});

const mockStore = configureStore([chromeMiddleware])

describe('chromeMiddleware', () => {

  let store;
  beforeEach(() => {
    store = mockStore({
      response: { params: { name: 'foo' }},
      pages: [
        {
          name: 'foo',
          elements: [0,1]
        }
      ]
    });
  });

  afterEach(() => {
    // jest.resetAllMocks() removed the mocked return values, which
    // is undesirable, so instead just clear each individually
    Object.keys(chrome).forEach(key => {
      chrome[key].mockClear()
    });
  });

  describe('unknown', () => {
    it('ignores unknown actions', () => {
      store.dispatch({
        type: 'UNKNOWN_ACTION_TYPE'
      });
      const [first] = store.getActions();
      expect(first.type).toBe('UNKNOWN_ACTION_TYPE');
    });
  });

  describe('RENAME_PAGE', () => {
    it('calls chrome.rename', () => {
      store.dispatch({
        type: RENAME_PAGE,
        name: 'test',
        oldName: 'foo'
      });
      const [first] = store.getActions();
      expect(first.type).toBe(RENAME_PAGE);
      expect(chrome.rename.mock.calls.length).toBe(1);
    });
  });

  describe('REMOVE_PAGE', () => {
    it('calls chrome.remove', () => {
      store.dispatch({
        type: REMOVE_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(REMOVE_PAGE);
      expect(chrome.remove.mock.calls.length).toBe(1);
    });
  });

  describe('SYNC_PAGES', () => {
    it('calls chrome.sync', () => {
      store.dispatch({
        type: SYNC_PAGES
      });
      expect(chrome.sync.mock.calls.length).toBe(1);
    });
  });

  describe('ADD_PAGE', () => {
    it('calls chrome.save', () => {
      store.dispatch({
        type: ADD_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(ADD_PAGE);
      expect(chrome.save.mock.calls.length).toBe(1);
    });
  });

});
