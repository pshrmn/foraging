import {expect} from "chai";

import frame from "../../src/reducers/frame";
import show from "../../src/reducers/show";
import page from "../../src/reducers/page";
import * as ActionTypes from "../../src/constants/ActionTypes";

describe("redux reducers", () => {

  describe("frame reducer", () => {
    describe("SHOW_SELECTOR_FRAME", () => {
      it("shows the selector frame", () => {
        let state = {
          name: "rule"
        };
        let action = {
          type: ActionTypes.SHOW_SELECTOR_FRAME
        };
        let result = frame(state, action);
        expect(result.name).to.equal("selector");
      });
    });

    describe("SHOW_RULE_FRAME", () => {
      it("shows the rule frame", () => {
        let state = {
          name: "selector"
        };
        let action = {
          type: ActionTypes.SHOW_RULE_FRAME
        };
        let result = frame(state, action);
        expect(result.name).to.equal("rule");
      });
    });

    describe("SHOW_ELEMENT_FRAME", () => {
      it("shows the element frame", () => {
        let state = {
          name: "selector"
        };
        let action = {
          type: ActionTypes.SHOW_ELEMENT_FRAME
        };
        let result = frame(state, action);
        expect(result.name).to.equal("element");
      });
    });

    describe("SHOW_PARTS_FRAME", () => {
      it("shows the parts frame", () => {
        let state = {
          name: "selector"
        };
        let action = {
          type: ActionTypes.SHOW_PARTS_FRAME
        };
        let result = frame(state, action);
        expect(result.name).to.equal("parts");
      });
    });

        describe("SHOW_SPEC_FRAME", () => {
      it("shows the spec frame", () => {
        let state = {
          name: "selector"
        };
        let action = {
          type: ActionTypes.SHOW_SPEC_FRAME
        };
        let result = frame(state, action);
        expect(result.name).to.equal("spec");
      });
    });
  });

  describe("show reducer", () => {
    describe("CLOSE_FORAGER", () => {
      it("sets show to false", () => {
        let state = true
        let action = {
          type: ActionTypes.CLOSE_FORAGER
        };
        let result = show(state, action);
        expect(result).to.be.false;
      });
    });

    describe("SHOW_FORAGER", () => {
      it("sets show to true", () => {
        let state = false;
        let action = {
          type: ActionTypes.SHOW_FORAGER
        };
        let result = show(state, action);
        expect(result).to.be.true;
      });
    });
  });  

  describe("page reducer", () => {
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
      state = Object.assign({}, initialState);
    });

    describe("LOAD_PAGE", () => {
      it("sets pageIndex using the action's index", () => {
        let index = 1;
        let action = {
          type: ActionTypes.LOAD_PAGE,
          index: index
        };
        let result = page(state, action);
        expect(result.pageIndex).to.equal(index);
      });

      it("sets pageIndex to 0 when action.index is < 0", () => {
        let action = {
          type: ActionTypes.LOAD_PAGE,
          index: -1
        }
        let result = page(state, action);
        expect(result.pageIndex).to.equal(0);
      });

      it("sets pageIndex to 0 when action.index is >= pages.length", () => {
        let action = {
          type: ActionTypes.LOAD_PAGE,
          index: 3
        }
        let result = page(state, action);
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
        let result = page(state, action);
        let newPages = result.pages;
        expect(newPages[newPages.length-1]).to.eql(newPage);
      });

      it("sets the pageIndex to the index of the added page", () => {
        let newPage = {name: "3"};
        let action = {
          type: ActionTypes.ADD_PAGE,
          page: newPage
        };
        let result = page(state, action);
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
        let result = page(state, action);
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
        let result = page(state, action);
        expect(result.pages.length).to.equal(3);
      });
    });

    // this isn't actually used since middleware is handling the renaming
    describe("RENAME_PAGE", () => {});

  });

});
