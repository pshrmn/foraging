import { expect } from "chai";
import configureStore from 'redux-mock-store';

import * as ActionTypes from "../../../src/constants/ActionTypes";
import { showMessage } from "../../../src/actions/general";
import messageMiddleware from "../../../src/middleware/messageMiddleware";

const mockStore = configureStore([messageMiddleware]);

describe("message middleware", () => {
  let store;
  beforeEach(() => {
    store = mockStore({});
  });

  describe("unknown", () => {
    it("does nothing for unexpected action types", () => {
      store.dispatch({
        type: "UNKNOWN_ACTION_TYPE"
      });
      const [first, ...rest] = store.getActions();
      expect(first.type).to.equal("UNKNOWN_ACTION_TYPE");
    });
  });

  describe("SHOW_MESSAGE", () => {
    it("dispatches an ADD_MESSAGE immediately", () => {
      const text = "this is an example, it is only an example";
      store.dispatch(
        showMessage(text, 500)
      );
      const [first, ...rest] = store.getActions();
      expect(first.type).to.equal(ActionTypes.ADD_MESSAGE);
      expect(first.text).to.equal(text);
    });

    it("dispatches a REMOVE_MESSAGE after wait time", done => {
      const text = "this is an example, it is only an example";
      const wait = 15; // something really low
      store.dispatch(
        showMessage(text, wait)
      )
      setTimeout(() => {
        // by now removeMessage should be dispatched
        const [ first, second, ...rest] = store.getActions();
        expect(second.type).to.equal(ActionTypes.REMOVE_MESSAGE);
        expect(second.id).to.equal(first.id);
        done();
      }, 50)
    });
  });
});
