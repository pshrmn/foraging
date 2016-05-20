import {expect} from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import chromeMiddleware from '../../../src/middleware/chromeMiddleware';
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
} from '../../../src/constants/ActionTypes';
import * as chrome from '../../../src/helpers/chrome';

const mockStore = configureStore([chromeMiddleware])

describe('chromeMiddleware', () => {

  let store;
  let sandbox;
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

    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('unknown', () => {
    it('ignores unknown actions', () => {
      store.dispatch({
        type: 'UNKNOWN_ACTION_TYPE'
      });
      const [first] = store.getActions();
      expect(first.type).to.equal('UNKNOWN_ACTION_TYPE');
    });
  });

  describe('RENAME_PAGE', () => {
    it('calls chrome.rename', () => {
      const renameStub = sandbox.stub(chrome, 'rename', () => Promise.resolve('Renamed'));
      store.dispatch({
        type: RENAME_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(RENAME_PAGE);
      expect(renameStub.called).to.be.true;
    });
  });

  describe('REMOVE_PAGE', () => {
    it('calls chrome.remove', () => {
      const removeStub = sandbox.stub(chrome, 'remove', () => Promise.resolve('Removed'));
      store.dispatch({
        type: REMOVE_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(REMOVE_PAGE);
      expect(removeStub.called).to.be.true;
    });
  });

  describe('UPLOAD_PAGE', () => {
    it('calls chrome.upload', () => {
      const uploadStub = sandbox.stub(chrome, 'upload', () => Promise.resolve('Uploaded'));
      store.dispatch({
        type: UPLOAD_PAGE
      });
      expect(uploadStub.called).to.be.true;
    });
  });

  describe('SYNC_PAGES', () => {
    it('calls chrome.sync', () => {
      const syncStub = sandbox.stub(chrome, 'sync', () => Promise.resolve('Synced'));
      store.dispatch({
        type: SYNC_PAGES
      });
      expect(syncStub.called).to.be.true;
    });
  });

  describe('ADD_PAGE', () => {
    it('calls chrome.save', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: ADD_PAGE
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(ADD_PAGE);
      expect(saveStub.called).to.be.true;
    });
  });

  describe('SAVE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: SAVE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(SAVE_ELEMENT);
      expect(saveStub.called).to.be.true;
    });
  });

  describe('REMOVE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: REMOVE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(REMOVE_ELEMENT);
      expect(saveStub.called).to.be.true;
    });
  });

  describe('UPDATE_ELEMENT', () => {
    it('calls chrome.save', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: UPDATE_ELEMENT
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(UPDATE_ELEMENT);
      expect(saveStub.called).to.be.true;
    });
  });

  describe('SAVE_RULE', () => {
    it('calls chrome.save', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: SAVE_RULE
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(SAVE_RULE);
      expect(saveStub.called).to.be.true;
    });
  });

  describe('REMOVE_RULE', () => {
    it('calls chrome.rename', () => {
      const saveStub = sandbox.stub(chrome, 'save', () => Promise.resolve('Saved'));
      store.dispatch({
        type: REMOVE_RULE
      });
      const [first] = store.getActions();
      expect(first.type).to.equal(REMOVE_RULE);
      expect(saveStub.called).to.be.true;
    });
  });

});
