import {expect} from "chai";
import * as actions from "../../../src/actions/page";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("page actions", () => {

  describe("selectPage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.selectPage(1);
      expect(action.type).to.equal(ActionTypes.SELECT_PAGE);
      expect(action.index).to.equal(1);
    });
  });

  describe("addPage", () => {
    it("returns an action with the expected values", () => {
      const page = {name: "fake page"};
      const action = actions.addPage(page);
      expect(action.type).to.equal(ActionTypes.ADD_PAGE);
      expect(action.page).to.deep.equal(page);
    })
  });

  describe("removePage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.removePage();
      expect(action.type).to.equal(ActionTypes.REMOVE_PAGE);
    });
  });

  describe("renamePage", () => {
    it("returns an action with the expected values", () => {
      const newName = "new name";
      const action = actions.renamePage(newName);
      expect(action.type).to.equal(ActionTypes.RENAME_PAGE);
      expect(action.name).to.equal(newName);
    })
  });

  describe("uploadPage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.uploadPage();
      expect(action.type).to.equal(ActionTypes.UPLOAD_PAGE);
    });
  });

  describe("syncPages", () => {
    it("returns an action with the expected values", () => {
      const action = actions.syncPages();
      expect(action.type).to.equal(ActionTypes.SYNC_PAGES);
    });
  });

  describe("setPages", () => {
    it("returns an action with the expected values", () => {
      const pages = [1,2,3];
      const action = actions.setPages(pages);
      expect(action.type).to.equal(ActionTypes.SET_PAGES);
      expect(action.pages).to.deep.equal(pages);
    });
  });

  describe("showPreview", () => {
    it("returns an action with the expected values", () => {
      const action = actions.showPreview();
      expect(action.type).to.equal(ActionTypes.SHOW_PREVIEW);
    });
  });

  describe("hidePreview", () => {
    it("returns an action with the expected values", () => {
      const action = actions.hidePreview();
      expect(action.type).to.equal(ActionTypes.HIDE_PREVIEW);
    });
  });

  describe("setMatches", () => {
    it("returns an action with the expected values", () => {
      const matches = {1: [1,2,3], 0: [4,5,6]}
      const action = actions.setMatches(matches);
      expect(action.type).to.equal(ActionTypes.SET_MATCHES);
      expect(action.matches).to.deep.equal(matches);
    });
  });

  describe("refreshMatches", () => {
    it("returns an action with the expected values", () => {
      const action = actions.refreshMatches();
      expect(action.type).to.equal(ActionTypes.REFRESH_MATCHES);
    });
  });

  describe("selectElement", () => {
    it("returns an action with the expected values", () => {
      const index = 2;
      const action = actions.selectElement(index);
      expect(action.type).to.equal(ActionTypes.SELECT_ELEMENT);
      expect(action.index).to.equal(index);
    });
  });

  describe("saveElement", () => {
    it("returns an action with the expected values", () => {
      const element = {selector: "p.info"};
      const action = actions.saveElement(element);
      expect(action.type).to.equal(ActionTypes.SAVE_ELEMENT);
      expect(action.element).to.deep.equal(element);
    });
  });

  describe("updateElement", () => {
    it("returns an action with the expected values", () => {
      const index = 2;
      const newProps = {optional: true};
      const action = actions.updateElement(index, newProps);
      expect(action.type).to.equal(ActionTypes.UPDATE_ELEMENT);
      expect(action.index).to.equal(index);
      expect(action.newProps).to.deep.equal(newProps);
    });
  });

  describe("removeElement", () => {
    it("returns an action with the expected values", () => {
      const action = actions.removeElement();
      expect(action.type).to.equal(ActionTypes.REMOVE_ELEMENT);
    });
  });

  describe("saveRule", () => {
    it("returns an action with the expected values", () => {
      const rule = {
        selector: "*"
      }
      const action = actions.saveRule(rule);
      expect(action.type).to.equal(ActionTypes.SAVE_RULE);
      expect(action.rule).to.deep.equal(rule);
    });
  });

  describe("removeRule", () => {
    it("returns an action to remove a rule from the current element", () => {
      const index = 3;
      const action = actions.removeRule(index);
      expect(action.type).to.equal(ActionTypes.REMOVE_RULE);
      expect(action.index).to.equal(index);
    });
  });

});
