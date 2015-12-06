import {expect} from "chai";
import * as actions from "../../src/actions";
import * as ActionTypes from "../../src/constants/ActionTypes";

describe("redux actions", () => {

  describe("loadPage", () => {
    it("returns an action with the expected action type", () => {
      let action = actions.loadPage(1);
      expect(action.type).to.equal(ActionTypes.LOAD_PAGE);
    });

    it("sets the index value", () => {
      let action = actions.loadPage(1);
      expect(action.index).to.equal(1);
    });
  });

  describe("addPage", () => {
    it("returns an action with the expected action type", () => {
      let action = actions.addPage("example");
      expect(action.type).to.equal(ActionTypes.ADD_PAGE);
    });

    it("sets the page value", () => {
      let action = actions.addPage("example");
      expect(action.name).to.equal("example");
    })
  });

  describe("removePage", () => {
    it("returns an action with the expected action type", () => {
      let action = actions.removePage();
      expect(action.type).to.equal(ActionTypes.REMOVE_PAGE);
    });
  });

  describe("renamePage", () => {
    it("returns an action with the expected action type", () => {
      let action = actions.renamePage("new name");
      expect(action.type).to.equal(ActionTypes.RENAME_PAGE);
    });

    it("sets the name value", () => {
      let action = actions.renamePage("new name");
      expect(action.name).to.equal("new name");
    })
  });

  describe("uploadPage", () => {
    it("returns an action to upload the current Page", () => {
      let action = actions.uploadPage();
      expect(action.type).to.equal(ActionTypes.UPLOAD_PAGE);
    });
  });

  describe("showPreview", () => {
    it("returns an action to show the preview modal", () => {
      let action = actions.showPreview();
      expect(action.type).to.equal(ActionTypes.SHOW_PREVIEW);
    });
  });

  describe("hidePreview", () => {
    it("returns an action to hide the preview modal", () => {
      let action = actions.hidePreview();
      expect(action.type).to.equal(ActionTypes.HIDE_PREVIEW);
    });
  });

  describe("showMessage", () => {
    it("returns an action to show a message", () => {
      let action = actions.showMessage("this is the message", 1000);
      expect(action.type).to.equal(ActionTypes.SHOW_MESSAGE);
    });

    it("sets the text and fade properties of the action", () => {
      let action = actions.showMessage("this is the message", 1000);
      expect(action.text).to.equal("this is the message");
      expect(action.fade).to.equal(1000);
    });
  });

  describe("showSelectorFrame", () => {
    it("returns an action to show the selector frame", () => {
      let action = actions.showSelectorFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_SELECTOR_FRAME);
    });
  });

  describe("showRuleFrame", () => {
    it("returns an action to show the rule frame", () => {
      let action = actions.showRuleFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_RULE_FRAME);
    });
  });

  describe("showElementFrame", () => {
    it("returns an action to show the element frame", () => {
      let action = actions.showElementFrame();
      expect(action.type).to.equal(ActionTypes.SHOW_ELEMENT_FRAME);
    });
  });

  describe("showPartsFrame", () => {
    it("returns an action to show the parts frame", () => {
      let parts = [1,2,3];
      let action = actions.showPartsFrame(parts);
      expect(action.type).to.equal(ActionTypes.SHOW_PARTS_FRAME);
    });

    it("sets the parts property of the action", () => {
      let parts = [1,2,3];
      let action = actions.showPartsFrame(parts);
      expect(action.parts).to.eql(parts);
    });
  });

  describe("showSpecFrame", () => {
    it("returns an action to show the spec frame", () => {
      let css = "div#main"
      let action = actions.showSpecFrame(css);
      expect(action.type).to.equal(ActionTypes.SHOW_SPEC_FRAME);
    });

    it("sets the css property of the action", () => {
      let css = "div#main"
      let action = actions.showSpecFrame(css);
      expect(action.css).to.equal(css);
    });
  });

  describe("closeForager", () => {
    it("returns an action to close (hide) the forager extension", () => {
      let action = actions.closeForager();
      expect(action.type).to.equal(ActionTypes.CLOSE_FORAGER);
    });
  });

  describe("selectSelector", () => {
    it("returns an action to set the current selector", () => {
      let selector = {selector: "a"};
      let action = actions.selectSelector(selector);
      expect(action.type).to.equal(ActionTypes.SELECT_SELECTOR);
    });

    it("sets the selector property of the action", () => {
      let selector = {selector: "a"};
      let action = actions.selectSelector(selector);
      expect(action.selector).to.eql(selector);
    });
  });

  describe("saveSelector", () => {
    it("returns an action to save a new selector", () => {
      let selector = {selector: "p.info"};
      let action = actions.saveSelector(selector);
      expect(action.type).to.equal(ActionTypes.SAVE_SELECTOR);
    });

    it("sets the selector property of the action", () => {
      let selector = {selector: "p.info"};
      let action = actions.saveSelector(selector);
      expect(action.selector).to.eql(selector);
    });
  });

  describe("renameSelector", () => {
    it("returns an action to rename a selector (for type=all selectors)", () => {
      // the actual renaming is done in the app and since object references are 
      // used it is automatically set in the state. This isn't very redux-y,
      // but neither are trees.
      let action = actions.renameSelector();
      expect(action.type).to.equal(ActionTypes.RENAME_SELECTOR);
    });
  });

  describe("removeSelector", () => {
    it("returns an action to remove the current selector", () => {
      // see the comment for renameSelector
      let action = actions.removeSelector();
      expect(action.type).to.equal(ActionTypes.REMOVE_SELECTOR);
    });
  });

  describe("saveRule", () => {
    it("returns an action to add a rule to the current selector", () => {
      let rule = {name: "url", attr: "href"};
      let action = actions.saveRule(rule);
      expect(action.type).to.equal(ActionTypes.SAVE_RULE);
    });

    it("sets the rule property of the action", () => {
      let rule = {name: "url", attr: "href"};
      let action = actions.saveRule(rule);
      expect(action.rule).to.eql(rule);
    });
  });

  describe("removeRule", () => {
    it("returns an action to remove a rule from the current selector", () => {
      let action = actions.removeRule(3);
      expect(action.type).to.equal(ActionTypes.REMOVE_RULE);
    });

    it("sets the index property of the action for the rule to remove", () => {
      let action = actions.removeRule(3);
      expect(action.index).to.equal(3);
    });
  });

  /*
  describe("", () => {
    it("", () => {
      let action = ;
      expect(action.type).to.equal(ActionTypes.);
    });
  });
*/
});
