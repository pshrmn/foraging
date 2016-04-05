import {expect} from "chai";

import preview from "../../../src/reducers/preview";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("preview reducer", () => {
  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const state = {
        visible: true
      };
      const action = {
        type: "UNKNOWN_ACTION_TYPE"
      };
      const newState = preview(state, action);
      expect(newState).to.deep.equal(state);;
    });
  });

  describe("SHOW_PREVIEW", () => {
    it("sets visible to true", () => {
      const state = {
        visible: false
      };
      const action = {
        type: ActionTypes.SHOW_PREVIEW
      };
      const newState = preview(state, action);
      expect(newState.visible).to.be.true;
    });
  });

  describe("HIDE_PREVIEW", () => {
    it("sets visible to false", () => {
      const state = {
        visible: true
      };
      const action = {
        type: ActionTypes.HIDE_PREVIEW
      };
      const newState = preview(state, action);
      expect(newState.visible).to.be.false;
    });
  });
});
