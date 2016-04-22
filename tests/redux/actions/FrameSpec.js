import {expect} from "chai";
import * as actions from "../../../src/actions/frame";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("frame actions", () => {

  describe("showElementFrame", () => {
    it("returns an action to show the element frame", () => {
      const action = actions.showElementFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_ELEMENT_FRAME);
    });
  });

  describe("showElementWizard", () => {
    it("returns an action to show the element wizard", () => {
      const action = actions.showElementWizard();
      expect(action.type).to.equal(ActionTypes.SHOW_ELEMENT_WIZARD);
    });
  });

  describe("showRuleFrame", () => {
    it("returns an action to show the rule frame", () => {
      const action = actions.showRuleFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_RULE_FRAME);
    });
  });
});
