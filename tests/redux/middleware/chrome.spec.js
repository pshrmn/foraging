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

const mockStore = configureStore([chromeMiddleware])

describe('chromeMiddleware', () => {

  let store;
  beforeEach(() => {
    store = mockStore({
      page: {
        pages: [
          undefined,
          {
            name: 'foo',
            elements: [0,1]
          }
        ],
        pageIndex: 1,
        elementIndex: 0
      }
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
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('renamed'));
      chrome.rename = spy;
      store.dispatch({
        type: RENAME_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(RENAME_PAGE);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('REMOVE_PAGE', () => {
    it('calls chrome.remove', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('removed'));
      chrome.remove = spy;
      store.dispatch({
        type: REMOVE_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(REMOVE_PAGE);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('UPLOAD_PAGE', () => {
    it('calls chrome.upload', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('uploaded'));
      chrome.upload = spy;
      store.dispatch({
        type: UPLOAD_PAGE
      });
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('SYNC_PAGES', () => {
    it('calls chrome.sync', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('synced'));
      chrome.sync = spy;
      store.dispatch({
        type: SYNC_PAGES
      });
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('ADD_PAGE', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: ADD_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(ADD_PAGE);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('SAVE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: SAVE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).toBe(SAVE_ELEMENT);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('REMOVE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: REMOVE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).toBe(REMOVE_ELEMENT);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('UPDATE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: UPDATE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).toBe(UPDATE_ELEMENT);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('SAVE_RULE', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: SAVE_RULE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(SAVE_RULE);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

  describe('REMOVE_RULE', () => {
    it('calls chrome.save', () => {
      const spy = jest.fn()
        .mockReturnValue(Promise.resolve('saved'));
      chrome.save = spy;
      store.dispatch({
        type: REMOVE_RULE
      });
      const [first] = store.getActions();
      expect(first.type).toBe(REMOVE_RULE);
      expect(spy.mock.calls.length).toBe(1);
    });
  });

});
