import {expect} from "chai";

import reducer from "../../src/reducers";
import * as ActionTypes from "../../src/constants/ActionTypes";

describe("redux reducers", () => {
  let initialState = {
    pages: [
      undefined,
      {name: "1"},
      {name: "2"}
    ],
    pageIndex: 0
  };
  var state;
  beforeEach(() => {
    // this isn't actually working and initialState is getting changed
    state = Object.assign({}, initialState);
  });

  describe("LOAD_PAGE", () => {
    it("sets pageIndex using the action's index", () => {
      let index = 1;
      let action = {
        type: ActionTypes.LOAD_PAGE,
        index: index
      };
      let result = reducer(state, action);
      expect(result.pageIndex).to.equal(index);
    });

    it("sets pageIndex to 0 when action.index is < 0", () => {
      let action = {
        type: ActionTypes.LOAD_PAGE,
        index: -1
      }
      let result = reducer(state, action);
      expect(result.pageIndex).to.equal(0);
    });

    it("sets pageIndex to 0 when action.index is >= pages.length", () => {
      let action = {
        type: ActionTypes.LOAD_PAGE,
        index: 3
      }
      let result = reducer(state, action);
      expect(result.pageIndex).to.equal(0);
    });
  });

  describe("ADD_PAGE", () => {
    it("adds the page to the end of pages", () => {
      let newPage = {name: "3"};
      let action = {
        type: ActionTypes.ADD_PAGE,
        page: newPage
      };
      let result = reducer(state, action);
      let newPages = result.pages;
      expect(newPages[newPages.length-1]).to.eql(newPage);
    });

    it("sets the pageIndex to the index of the added page", () => {
      let newPage = {name: "3"};
      let action = {
        type: ActionTypes.ADD_PAGE,
        page: newPage
      };
      let result = reducer(state, action);
      expect(result.pageIndex).to.equal(result.pages.length - 1);
    });
  });

  describe("REMOVE_PAGE", () => {

    it("removes the page at pageIndex", () => {
      let state = {
        pages: [
          undefined,
          {name: "1"},
          {name: "2"}
        ],
        pageIndex: 1
      };
      expect(state.pages.length).to.equal(3);
      let action = {
        type: ActionTypes.REMOVE_PAGE
      };
      let result = reducer(state, action);
      expect(result.pages.length).to.equal(2);
    });

    it("does nothing when pageIndex === 0", () => {
      let state = {
        pages: [
          undefined,
          {name: "1"},
          {name: "2"}
        ],
        pageIndex: 0
      };
      expect(state.pages.length).to.equal(3);
      let action = {
        type: ActionTypes.REMOVE_PAGE
      };
      let result = reducer(state, action);
      expect(result.pages.length).to.equal(3);
    });
  });

  describe("RENAME_PAGE", () => {
    it("renames the page at pageIndex", () => {
      let state = {
        pages: [
          undefined,
          {name: "1"},
          {name: "2"}
        ],
        pageIndex: 1
      };
      let action = {
        type: ActionTypes.RENAME_PAGE,
        name: "Foo"
      };
      let result = reducer(state, action);
      expect(result.pages[result.pageIndex].name).to.equal("Foo");
    });

    it("does nothing when pageIndex === 0", () => {
      let state = {
        pages: [
          undefined,
          {name: "1"},
          {name: "2"}
        ],
        pageIndex: 0
      };
      let action = {
        type: ActionTypes.RENAME_PAGE,
        name: "Foo"
      };
      // because pages[0] is undefined, normally trying to set the name property
      // on it would throw an error, so this expects no error to be thrown
      // if handled properly
      expect(reducer.bind(null, state, action)).to.not.throw();
    });
  });
});
