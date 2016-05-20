import {expect} from 'chai';
import configureStore from 'redux-mock-store';
import { jsdom } from 'jsdom';
import sinon from 'sinon';

import confirmMiddleware from '../../../src/middleware/confirmMiddleware';

const mockStore = configureStore([confirmMiddleware])

describe('confirmMiddleware', () => {

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
    const doc = jsdom(`<!doctype html><html><body></body></html>`,
      {
        url: 'http://localhost:8000/',
      }
    );
    global.document = doc;
    global.window = doc.defaultView;
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
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

  describe('SYNC_PAGES', () => {
    it('reaches store when window.confirm=true', () => {
      sinon.stub(global.window, 'confirm', () => true);
      store.dispatch({
        type: 'SYNC_PAGES'
      });
      const [first] = store.getActions();
      expect(first.type).to.equal('SYNC_PAGES');
    });

    it('stops when window.confirm=false', () => {
      sinon.stub(global.window, 'confirm', () => false);
      store.dispatch({
        type: 'SYNC_PAGES'
      });
      const [first] = store.getActions();
      expect(first).to.be.undefined;
    });
  });

  describe('REMOVE_PAGE', () => {
    it('reaches store when window.confirm=true', () => {
      sinon.stub(global.window, 'confirm', () => true);
      store.dispatch({
        type: 'REMOVE_PAGE'
      });
      const [first] = store.getActions();
      expect(first.type).to.equal('REMOVE_PAGE');
    });

    it('stops when window.confirm=false', () => {
      sinon.stub(global.window, 'confirm', () => false);
      store.dispatch({
        type: 'REMOVE_PAGE'
      });
      const [first] = store.getActions();
      expect(first).to.be.undefined;
    });
  });

  describe('REMOVE_ELEMENT', () => {
    it('reaches store when window.confirm=true', () => {
      sinon.stub(global.window, 'confirm', () => true);
      store.dispatch({
        type: 'REMOVE_ELEMENT'
      });
      const [first] = store.getActions();
      expect(first.type).to.equal('REMOVE_ELEMENT');
    });

    it('stops when window.confirm=false', () => {
      sinon.stub(global.window, 'confirm', () => false);
      store.dispatch({
        type: 'REMOVE_ELEMENT'
      });
      const [first] = store.getActions();
      expect(first).to.be.undefined;
    });
  });
});
