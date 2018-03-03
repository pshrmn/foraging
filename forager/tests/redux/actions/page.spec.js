import * as actions from "actions/page";
import * as ActionTypes from "constants/ActionTypes";

describe("page actions", () => {

  describe("setPages", () => {
    it("returns an action with the expected values", () => {
      const pages = [1,2,3];
      const action = actions.setPages(pages);
      expect(action.type).toBe(ActionTypes.SET_PAGES);
      expect(action.pages).toEqual(pages);
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
});
