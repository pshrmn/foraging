import {expect} from "chai";

import frame from "../../../src/reducers/frame";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("frame reducer", () => {

  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const state = {
        name: "element"
      };
      const action = {
        type: "UNKNOWN_ACTION_TYPE"
      };
      const newState = frame(state, action);
      expect(newState).to.deep.equal(state);
    });
  });

  describe("reset actions", () => {
    it("reverts to the element frame on certain actions", () => {
      const types = [
        ActionTypes.SELECT_PAGE,
        ActionTypes.REMOVE_ELEMENT,
        ActionTypes.SAVE_ELEMENT,
        ActionTypes.SAVE_RULE,
        ActionTypes.REMOVE_RULE,
        ActionTypes.CLOSE_FORAGER
      ];
      types.forEach(t => {
        const state = {
          name: "rule"
        };
        const newState = frame(state, {
          type: t
        });
        expect(newState.name).to.equal("element");
      });
    });
  });

  describe("SHOW_ELEMENT_FRAME", () => {
    it("shows the element frame", () => {
      const state = {
        name: "rule"
      };
      const action = {
        type: ActionTypes.SHOW_ELEMENT_FRAME
      };
      const newState = frame(state, action);
      expect(newState.name).to.equal("element");
    });
  });

  describe("SHOW_ELEMENT_WIZARD", () => {
    it("shows the element wizard", () => {
      const state = {
        name: "element"
      };
      const newState = frame(state, {
        type: ActionTypes.SHOW_ELEMENT_WIZARD
      });
      expect(newState.name).to.equal("wizard");
    });
  });

  describe("SHOW_RULE_FRAME", () => {
    it("shows the rule frame", () => {
      const state = {
        name: "element"
      };
      const action = {
        type: ActionTypes.SHOW_RULE_FRAME
      };
      const newState = frame(state, action);
      expect(newState.name).to.equal("rule");
    });
  });
});
