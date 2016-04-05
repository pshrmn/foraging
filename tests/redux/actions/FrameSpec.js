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

  describe("showRuleFrame", () => {
    it("returns an action to show the rule frame", () => {
      const action = actions.showRuleFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_RULE_FRAME);
    });
  });

  describe("showHTMLFrame", () => {
    it("returns an action to show the html frame", () => {
      const action = actions.showHTMLFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_HTML_FRAME);
    });
  });

  describe("showPartsFrame", () => {
    it("returns an action to show the parts frame", () => {
      const parts = [1,2,3];
      const action = actions.showPartsFrame(parts);
      expect(action.type).to.equal(ActionTypes.SHOW_PARTS_FRAME);
    });

    it("sets the parts property of the action", () => {
      const parts = [1,2,3];
      const action = actions.showPartsFrame(parts);
      expect(action.parts).to.eql(parts);
    });
  });

  describe("showSpecFrame", () => {
    it("returns an action to show the spec frame", () => {
      const css = "div#main"
      const action = actions.showSpecFrame(css);
      expect(action.type).to.equal(ActionTypes.SHOW_SPEC_FRAME);
    });

    it("sets the css property of the action", () => {
      const css = "div#main"
      const action = actions.showSpecFrame(css);
      expect(action.css).to.equal(css);
    });
  });
});
