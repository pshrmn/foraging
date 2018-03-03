import configureStore from 'redux-mock-store';

import confirmMiddleware from 'middleware/confirmMiddleware';
import {
  SYNC_PAGES,
  REMOVE_PAGE,
  REMOVE_ELEMENT
} from 'constants/ActionTypes';

const mockStore = configureStore([confirmMiddleware])

describe('confirmMiddleware', () => {

  let store;
  let confirmMock;
  const originalMock = window.confirm;
  beforeEach(() => {
    store = mockStore({
      pages: [
        {
          name: 'foo',
          elements: [0,1]
        }
      ]
    });
    confirmMock = jest.fn()
  });

  afterEach(() => {
    window.confirm = originalMock;
  })

  describe('unknown', () => {
    it('ignores unknown actions', () => {
      store.dispatch({
        type: 'UNKNOWN_ACTION_TYPE'
      });
      const [first] = store.getActions();
      expect(first.type).toBe('UNKNOWN_ACTION_TYPE');
    });
  });

  describe('SYNC_PAGES', () => {
    it('reaches store when window.confirm=true', () => {
      window.confirm = confirmMock.mockReturnValue(true);
      store.dispatch({
        type: SYNC_PAGES
      });
      const [first] = store.getActions();
      expect(first.type).toBe(SYNC_PAGES);
    });

    it('stops when window.confirm=false', () => {
      window.confirm = confirmMock.mockReturnValue(false);
      store.dispatch({
        type: SYNC_PAGES
      });
      const [first] = store.getActions();
      expect(first).toBeUndefined();
    });
  });
});
