import {expect} from "chai";

import message from "../../../src/reducers/message";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("message reducer", () => {
  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const state = {
        text: '',
        wait: undefined
      };
      const action = {
        type: "UNKNOWN_ACTION_TYPE"
      };
      const newState = message(state, action);
      expect(newState).to.deep.equal(state);
    });
  });

  describe("SHOW_MESSAGE", () => {
    it("sets text and wait values", () => {
      const state = {
        text: "",
        wait: undefined
      };
      const msg = "test message";
      const wait = 5000;
      const action = {
        type: ActionTypes.SHOW_MESSAGE,
        text: msg,
        wait: wait
      };
      const newState = message(state, action);
      expect(newState.text).to.equal(msg);
      expect(newState.wait).to.equal(wait);
    });
  });
});
