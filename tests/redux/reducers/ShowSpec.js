import {expect} from "chai";

import show from "../../../src/reducers/show";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("show reducer", () => {

  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const state = true;
      const action = {
        type: "UNKNOWN_ACTION_TYPE"
      };
      const newState = show(state, action);
      expect(newState).to.deep.equal(state);
    });
  });

  describe("CLOSE_FORAGER", () => {
    it("sets show to false", () => {
      const state = true
      const action = {
        type: ActionTypes.CLOSE_FORAGER
      };
      const newState = show(state, action);
      expect(newState).to.be.false;
    });
  });

  describe("OPEN_FORAGER", () => {
    it("sets show to true", () => {
      const state = false;
      const action = {
        type: ActionTypes.OPEN_FORAGER
      };
      const newState = show(state, action);
      expect(newState).to.be.true;
    });
  });
});  
