import {expect} from "chai";

import frame from "../../src/reducers/frame";
import show from "../../src/reducers/show";
import page from "../../src/reducers/page";
import * as ActionTypes from "../../src/constants/ActionTypes";

describe("redux reducers", () => {

  describe("frame reducer", () => {
    describe("SHOW_ELEMENT_FRAME", () => {
      it("shows the element frame", () => {
        const state = {
          name: "rule"
        };
        const action = {
          type: ActionTypes.SHOW_ELEMENT_FRAME
        };
        const result = frame(state, action);
        expect(result.name).to.equal("element");
      });
    });

    describe("SHOW_RULE_FRAME", () => {
      it("shows the rule frame", () => {
        const state = {
          name: "element"
        };
        const action = {
          type: ActionTypes.SHOW_RULE_FRAME
        };
        const result = frame(state, action);
        expect(result.name).to.equal("rule");
      });
    });

    describe("SHOW_HTML_FRAME", () => {
      it("shows the element frame", () => {
        const state = {
          name: "element"
        };
        const action = {
          type: ActionTypes.SHOW_HTML_FRAME
        };
        const result = frame(state, action);
        expect(result.name).to.equal("html");
      });
    });

    describe("SHOW_PARTS_FRAME", () => {
      it("shows the parts frame", () => {
        const state = {
          name: "element"
        };
        const action = {
          type: ActionTypes.SHOW_PARTS_FRAME
        };
        const result = frame(state, action);
        expect(result.name).to.equal("parts");
      });
    });

    describe("SHOW_SPEC_FRAME", () => {
      it("shows the spec frame", () => {
        const state = {
          name: "element"
        };
        const action = {
          type: ActionTypes.SHOW_SPEC_FRAME
        };
        const result = frame(state, action);
        expect(result.name).to.equal("spec");
      });
    });
  });

  describe("show reducer", () => {
    describe("CLOSE_FORAGER", () => {
      it("sets show to false", () => {
        const state = true
        const action = {
          type: ActionTypes.CLOSE_FORAGER
        };
        const result = show(state, action);
        expect(result).to.be.false;
      });
    });

    describe("SHOW_FORAGER", () => {
      it("sets show to true", () => {
        const state = false;
        const action = {
          type: ActionTypes.SHOW_FORAGER
        };
        const result = show(state, action);
        expect(result).to.be.true;
      });
    });
  });  

  describe("page reducer", () => {
    const initialState = {
      pages: [
        undefined,
        {name: "1"},
        {name: "2"}
      ],
      pageIndex: 0
    };

    let state;
    beforeEach(() => {
      state = Object.assign({}, initialState);
    });

    describe("LOAD_PAGE", () => {
      it("sets pageIndex using the action's index", () => {
        const index = 1;
        const action = {
          type: ActionTypes.LOAD_PAGE,
          index: index
        };
        const result = page(state, action);
        expect(result.pageIndex).to.equal(index);
      });

      it("sets pageIndex to 0 when action.index is < 0", () => {
        const action = {
          type: ActionTypes.LOAD_PAGE,
          index: -1
        }
        const result = page(state, action);
        expect(result.pageIndex).to.equal(0);
      });

      it("sets pageIndex to 0 when action.index is >= pages.length", () => {
        const action = {
          type: ActionTypes.LOAD_PAGE,
          index: 3
        }
        const result = page(state, action);
        expect(result.pageIndex).to.equal(0);
      });
    });

    describe("ADD_PAGE", () => {
      it("adds the page to the end of pages", () => {
        const newPage = {name: "3"};
        const action = {
          type: ActionTypes.ADD_PAGE,
          page: newPage
        };
        const result = page(state, action);
        const newPages = result.pages;
        expect(newPages[newPages.length-1]).to.eql(newPage);
      });

      it("sets the pageIndex to the index of the added page", () => {
        const newPage = {name: "3"};
        const action = {
          type: ActionTypes.ADD_PAGE,
          page: newPage
        };
        const result = page(state, action);
        expect(result.pageIndex).to.equal(result.pages.length - 1);
      });
    });

    describe("REMOVE_PAGE", () => {

      it("removes the page at pageIndex", () => {
        const state = {
          pages: [
            undefined,
            {name: "1"},
            {name: "2"}
          ],
          pageIndex: 1
        };
        expect(state.pages.length).to.equal(3);
        const action = {
          type: ActionTypes.REMOVE_PAGE
        };
        const result = page(state, action);
        expect(result.pages.length).to.equal(2);
      });

      it("does nothing when pageIndex === 0", () => {
        const state = {
          pages: [
            undefined,
            {name: "1"},
            {name: "2"}
          ],
          pageIndex: 0
        };
        expect(state.pages.length).to.equal(3);
        const action = {
          type: ActionTypes.REMOVE_PAGE
        };
        const result = page(state, action);
        expect(result.pages.length).to.equal(3);
      });
    });

    // this isn't actually used since middleware is handling the renaming
    describe("RENAME_PAGE", () => {});

  });

});
