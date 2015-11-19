import {expect} from "chai";

import { loadPage, addPage, removePage, renamePage } from "../../src/actions";
import * as ActionTypes from "../../src/constants/ActionTypes";

describe("redux actions", () => {

  describe("loadPage", () => {
    it("returns an action with the expected action type", () => {
      let action = loadPage(1);
      expect(action.type).to.equal(ActionTypes.LOAD_PAGE);
    });

    it("sets the index value", () => {
      let action = loadPage(1);
      expect(action.index).to.equal(1);
    });
  });

  describe("addPage", () => {
    it("returns an action with the expected action type", () => {
      let page = {
        name: "example"
      }
      let action = addPage(page);
      expect(action.type).to.equal(ActionTypes.ADD_PAGE);
    });

    it("sets the page value", () => {
      let page = {
        name: "example"
      }
      let action = addPage(page);
      expect(action.page).to.eql(page);
    })
  });

  describe("removePage", () => {
    it("returns an action with the expected action type", () => {
      let action = removePage();
      expect(action.type).to.equal(ActionTypes.REMOVE_PAGE);
    });
  });

  describe("renamePage", () => {
    it("returns an action with the expected action type", () => {
      let action = renamePage("new name");
      expect(action.type).to.equal(ActionTypes.RENAME_PAGE);
    });

    it("sets the name value", () => {
      let action = renamePage("new name");
      expect(action.name).to.equal("new name");
    })
  });
});
