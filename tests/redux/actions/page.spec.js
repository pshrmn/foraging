import * as actions from "actions/page";
import * as ActionTypes from "constants/ActionTypes";

describe("page actions", () => {

  describe("selectPage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.selectPage(1);
      expect(action.type).toBe(ActionTypes.SELECT_PAGE);
      expect(action.index).toBe(1);
    });
  });

  describe("addPage", () => {
    it("returns an action with the expected values", () => {
      const page = {name: "fake page"};
      const action = actions.addPage(page);
      expect(action.type).toBe(ActionTypes.ADD_PAGE);
      expect(action.page).toEqual(page);
    })
  });

  describe("removePage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.removePage();
      expect(action.type).toBe(ActionTypes.REMOVE_PAGE);
    });
  });

  describe("renamePage", () => {
    it("returns an action with the expected values", () => {
      const newName = "new name";
      const action = actions.renamePage(newName);
      expect(action.type).toBe(ActionTypes.RENAME_PAGE);
      expect(action.name).toBe(newName);
    })
  });

  describe("uploadPage", () => {
    it("returns an action with the expected values", () => {
      const action = actions.uploadPage();
      expect(action.type).toBe(ActionTypes.UPLOAD_PAGE);
    });
  });

  describe("syncPages", () => {
    it("returns an action with the expected values", () => {
      const action = actions.syncPages();
      expect(action.type).toBe(ActionTypes.SYNC_PAGES);
    });
  });

  describe("setPages", () => {
    it("returns an action with the expected values", () => {
      const pages = [1,2,3];
      const action = actions.setPages(pages);
      expect(action.type).toBe(ActionTypes.SET_PAGES);
      expect(action.pages).toEqual(pages);
    });
  });

  describe("setMatches", () => {
    it("returns an action with the expected values", () => {
      const matches = {1: [1,2,3], 0: [4,5,6]}
      const action = actions.setMatches(matches);
      expect(action.type).toBe(ActionTypes.SET_MATCHES);
      expect(action.matches).toEqual(matches);
    });
  });

  describe("refreshMatches", () => {
    it("returns an action with the expected values", () => {
      const action = actions.refreshMatches();
      expect(action.type).toBe(ActionTypes.REFRESH_MATCHES);
    });
  });

  describe("selectElement", () => {
    it("returns an action with the expected values", () => {
      const index = 2;
      const action = actions.selectElement(index);
      expect(action.type).toBe(ActionTypes.SELECT_ELEMENT);
      expect(action.index).toBe(index);
    });
  });

  describe("saveElement", () => {
    it("returns an action with the expected values", () => {
      const element = {selector: "p.info"};
      const action = actions.saveElement(element);
      expect(action.type).toBe(ActionTypes.SAVE_ELEMENT);
      expect(action.element).toEqual(element);
    });
  });

  describe("updateElement", () => {
    it("returns an action with the expected values", () => {
      const index = 2;
      const newProps = {optional: true};
      const action = actions.updateElement(index, newProps);
      expect(action.type).toBe(ActionTypes.UPDATE_ELEMENT);
      expect(action.index).toBe(index);
      expect(action.newProps).toEqual(newProps);
    });
  });

  describe("removeElement", () => {
    it("returns an action with the expected values", () => {
      const action = actions.removeElement();
      expect(action.type).toBe(ActionTypes.REMOVE_ELEMENT);
    });
  });

  describe("saveRule", () => {
    it("returns an action with the expected values", () => {
      const rule = {
        selector: "*"
      }
      const action = actions.saveRule(rule);
      expect(action.type).toBe(ActionTypes.SAVE_RULE);
      expect(action.rule).toEqual(rule);
    });
  });

  describe("removeRule", () => {
    it("returns an action to remove a rule from the current element", () => {
      const index = 3;
      const action = actions.removeRule(index);
      expect(action.type).toBe(ActionTypes.REMOVE_RULE);
      expect(action.index).toBe(index);
    });
  });

  describe("updateRule", () => {
    it("returns an action that replaces the rule with the given index", () => {
      const index = 0;
      const rule = {name: "foo", attr: "text", type: "string"};
      const action = actions.updateRule(index, rule);
      expect(action.type).toBe(ActionTypes.UPDATE_RULE);
      expect(action.index).toBe(index);
      expect(action.rule).toEqual(rule);
    });
  });

});
