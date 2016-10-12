import * as actions from "actions/frame";
import * as ActionTypes from "constants/ActionTypes";

describe("frame actions", () => {

  describe("showElementFrame", () => {
    it("returns an action to show the element frame", () => {
      const action = actions.showElementFrame();
      expect(action.type).toBe(ActionTypes.SHOW_ELEMENT_FRAME);
    });
  });

  describe("showElementWizard", () => {
    it("returns an action to show the element wizard", () => {
      const action = actions.showElementWizard();
      expect(action.type).toBe(ActionTypes.SHOW_ELEMENT_WIZARD);
    });
  });

  describe("showEditElementWizard", () => {
    it("returns an action to show the element wizard", () => {
      const action = actions.showEditElementWizard();
      expect(action.type).toBe(ActionTypes.SHOW_EDIT_ELEMENT_WIZARD);
    });
  });

  describe("showRuleWizard", () => {
    it("returns an action to show the rule frame", () => {
      const action = actions.showRuleWizard();
      expect(action.type).toBe(ActionTypes.SHOW_RULE_WIZARD);
    });
  });

  describe("showEditRuleWizard", () => {
    it("returns an action to show the rule frame", () => {
      const index = 1;
      const action = actions.showEditRuleWizard(index);
      expect(action.type).toBe(ActionTypes.SHOW_EDIT_RULE_WIZARD);
      expect(action.index).toBe(index);
    });
  });

  describe("showPreview", () => {
    it("returns an action to show the rule frame", () => {
      const action = actions.showPreview();
      expect(action.type).toBe(ActionTypes.SHOW_PREVIEW);
    });
  });
});
