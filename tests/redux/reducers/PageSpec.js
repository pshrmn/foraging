import {expect} from "chai";

import page from "../../../src/reducers/page";
import * as ActionTypes from "../../../src/constants/ActionTypes";

describe("page reducer", () => {
  const initialState = {
        pages: [
          undefined,
          {
            name: "1",
            elements: [
              {
                selector: "body",
                spec: {
                  type: "single",
                  value: 0
                },
                rules: [],
                optional: false,
                parent: null,
                index: 0,
                childIndices: [1]
              },
              {
                selector: "a",
                spec: {
                  type: "all",
                  value: "links"
                },
                rules: [
                  {
                    name: "baz",
                    type: "string",
                    attr: "href"
                  }
                ],
                optional: false,
                parent: 0,
                index: 1,
                childIndices: []
              },
              {
                selector: "div",
                spec: {
                  type: "single",
                  value: 0
                },
                rules: [],
                optional: true,
                parent: 0,
                index: 2,
                childIndices: [3]
              },
              {
                selector: "a",
                spec: {
                  type: "single",
                  value: 0
                },
                rules: [],
                optional: false,
                parent: 2,
                index: 3,
                childIndices: []
              }
            ]
          },
          {
            name: "2",
            elements: [
              {
                selector: "body",
                spec: {
                  type: "single",
                  value: 0
                },
                rules: [],
                optional: false,
                parent: null,
                index: 0,
                childIndices: []
              }
            ]
          }
        ],
        pageIndex: 1,
        elementIndex: 0
      };

  let state;
  beforeEach(() => {
    // create a lazy copy
    state = JSON.parse(JSON.stringify(initialState));
  });

  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const newState = page(state, {
        type: "UNKNOWN_ACTION_TYPE"
      });
      expect(newState).to.deep.equal(state);
    });
  });


  describe("SELECT_PAGE", () => {
    it("sets pageIndex using the action's index", () => {
      const index = 1;
      const newState = page(state, {
        type: ActionTypes.SELECT_PAGE,
        index: index
      });
      expect(newState.pageIndex).to.equal(index);
      expect(newState.elementIndex).to.equal(0);
    });

    it("sets pageIndex to 0 when action.index is < 0", () => {
      const newState = page(state, {
        type: ActionTypes.SELECT_PAGE,
        index: -1
      });
      expect(newState.pageIndex).to.equal(0);
    });

    it("sets pageIndex to 0 when action.index is >= pages.length", () => {
      const newState = page(state, {
        type: ActionTypes.SELECT_PAGE,
        index: 3
      });
      expect(newState.pageIndex).to.equal(0);
    });
  });

  describe("ADD_PAGE", () => {
    it("adds the page to the end of pages", () => {

      const newPage = {name: "3", elements:[]};
      const newState = page(state, {
        type: ActionTypes.ADD_PAGE,
        page: newPage
      });
      const { pages, pageIndex, elementIndex } = newState
      // last page
      expect(pageIndex).to.equal(pages.length-1);
      expect(pages[pageIndex]).to.deep.equal(newPage);
      expect(elementIndex).to.equal(0);
    });

    it("sets the pageIndex to the index of the added page", () => {
     
      const newPage = {name: "3"};
      const action = {
        type: ActionTypes.ADD_PAGE,
        page: newPage
      };
      const newState = page(state, action);
      expect(newState.pageIndex).to.equal(newState.pages.length - 1);

    });
  });

  describe("REMOVE_PAGE", () => {

    it("removes the page at pageIndex", () => {
      expect(state.pages.length).to.equal(3);
      const newState = page(state, {
        type: ActionTypes.REMOVE_PAGE
      });
      expect(newState.pages.length).to.equal(2);
    });

    it("does nothing when pageIndex === 0", () => {
      // change the pageIndex for this test
      state.pageIndex = 0;
      expect(state.pages.length).to.equal(3);
      const newState = page(state, {
        type: ActionTypes.REMOVE_PAGE
      });
      expect(newState.pages.length).to.equal(3);
    });
  });

  describe("RENAME_PAGE", () => {
    it("changes the name of the current page", () => {
      const newName = 'testname';
      const newState = page(state, {
        type: ActionTypes.RENAME_PAGE,
        name: newName
      });
      const { pages, pageIndex } = newState;
      expect(pages[pageIndex].name).to.equal(newName);
    });
  });

  describe("SET_PAGES", () => {
    it("sets the pages in the store", () => {
      const newPages = [1,2,3];
      const newState = page(state, {
        type: ActionTypes.SET_PAGES,
        pages: newPages
      });
      const { pages, pageIndex, elementIndex } = newState;
      expect(pageIndex).to.equal(0)
      expect(elementIndex).to.equal(0);
      expect(pages.slice(1)).to.deep.equal(newPages);
    });
  });

  describe("SELECT_ELEMENT", () => {
    it("sets the elementIndex", () => {
      const index = 1;
      const newState = page(state, {
        type: ActionTypes.SELECT_ELEMENT,
        index: index
      });
      const { elementIndex } = newState;
      expect(elementIndex).to.equal(index);
    });

    it("reverts to 0 for bad index values", () => {
      [-2, 10, 'f'].forEach(i => {
        // "cheap" copy
        let tempState = JSON.parse(JSON.stringify(state)); 
        const newState = page(tempState, {
          type: ActionTypes.SELECT_ELEMENT,
          index: i
        });
        const { elementIndex } = newState;
        expect(elementIndex).to.equal(0);
      });
    });
  });

  describe("SAVE_ELEMENT", () => {
    it("adds a new element to the elements array", () => {
      const element = {
        selector: 'div',
        spec: {}
      };
      // cache init values
      const { elementIndex: oldElementIndex } = state;
      const newState = page(state, {
        type: ActionTypes.SAVE_ELEMENT,
        element: element
      });
      const {
        pages: newPages,
        pageIndex: newPageIndex,
        elementIndex: newElementIndex
      } = newState;
      const current = newPages[newPageIndex].elements[newElementIndex];
      const parent = newPages[newPageIndex].elements[current.parent];
      expect(newElementIndex).to.equal(current.index);
      expect(current.parent).to.equal(oldElementIndex);
      expect(parent.childIndices.includes(current.index)).to.be.true;
    });
  });

  describe("UPDATE_ELEMENT", () => {
    it("updates the properties of the element at index", () => {
      const newProps = {
        spec: {
          type: 'all',
          value: 'new name'
        },
        optional: true
      };
      // index 1 is an all element, so it has a name to update
      const index = 1;
      state.elementIndex = index;

      // verify values prior to update
      const {
        pages: initPages,
        pageIndex: initPageIndex
      } = state;
      const initElement = initPages[initPageIndex].elements[index];
      expect(initElement.spec.value).to.equal('links');
      expect(initElement.optional).to.be.false;

      const newState = page(state, {
        type: ActionTypes.UPDATE_ELEMENT,
        index,
        newProps
      });

      const {
        pages: newPages,
        pageIndex: newPageIndex
      } = newState;
      const current = newPages[newPageIndex].elements[index];
      expect(current.spec.value).to.equal(newProps.spec.value);
      expect(current.optional).to.equal(newProps.optional);
    });
  });

  describe("REMOVE_ELEMENT", () => {
    it("sets any \"removed\" elements to be null", () => {
      state.elementIndex = 1;
      const newState = page(state, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      const { pages, pageIndex, elementIndex } = newState;
      expect(pages[pageIndex].elements[1]).to.be.null;
    });

    it("doesn't actually remove the 0th element", () => {
      const newState = page(state, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      const { pages, pageIndex, elementIndex } = newState;
      expect(pages[pageIndex].elements[0]).to.not.be.null;
      expect(elementIndex).to.equal(0);
    });

    it("ignores null elements", () => {
      state.elementIndex = 1;
      const newState = page(state, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      newState.elementIndex = 2;
      const newerState = page(newState, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      const { pages, pageIndex, elementIndex } = newerState;
      expect(pages[pageIndex].elements[2]).to.be.null;
    });

    it("also removes child elements", () => {
      // element 3 is a child of element 2
      state.elementIndex = 2;
      const newState = page(state, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      const { pages, pageIndex, elementIndex } = newState;
      const currentPage = pages[pageIndex];
      expect(currentPage.elements[2]).to.be.null;
      expect(currentPage.elements[3]).to.be.null;
    });

    it("sets the elementIndex to the element's parent's index", () => {
      // element 3 is a child of element 2
      state.elementIndex = 3;
      const newState = page(state, {
        type: ActionTypes.REMOVE_ELEMENT
      });
      const { pages, pageIndex, elementIndex } = newState;
      expect(elementIndex).to.equal(2);
    });
  });

  describe("SAVE_RULE", () => {
    it("adds the rule to the current element's rules array", () => {
      const rule = {
        name: "foo",
        type: "string",
        attr: "text"
      };
      const newState = page(state, {
        type: ActionTypes.SAVE_RULE,
        rule: rule
      });

      const { pages, pageIndex, elementIndex } = newState;
      const current = pages[pageIndex].elements[elementIndex];
      expect(current.rules[current.rules.length-1]).to.deep.equal(rule);
    });
  });

  describe("REMOVE_RULE", () => {
    it("removes the rule at index from the current element", () => {
      state.elementIndex = 1;
      const newState = page(state, {
        type: ActionTypes.REMOVE_RULE,
        index: 0
      });
      const { pages, pageIndex, elementIndex } = newState;
      const current = pages[pageIndex].elements[elementIndex];
      expect(current.rules.length).to.equal(0);
    });
  });

  describe("CLOSE_FORAGER", () => {
    const newState = page(state, {
      type: ActionTypes.CLOSE_FORAGER
    });
    expect(newState.pageIndex).to.equal(0);
    expect(newState.elementIndex).to.equal(0);
  });
});

