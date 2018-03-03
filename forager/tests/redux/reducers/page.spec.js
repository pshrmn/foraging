import pages from "reducers/pages";
import * as ActionTypes from "constants/ActionTypes";

describe("pages reducer", () => {
  const initialState = [
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
        },
        null
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
  ];

  let state;
  beforeEach(() => {
    // create a lazy copy
    state = JSON.parse(JSON.stringify(initialState));
  });

  describe("unknown", () => {
    it("returns default for unknown action types", () => {
      const newState = pages(state, {
        type: "UNKNOWN_ACTION_TYPE"
      });
      expect(newState).toEqual(state);
    });
  });


  describe("SET_PAGES", () => {
    it("sets the pages in the store", () => {
      const newPages = [1,2,3];
      const newState = pages(state, {
        type: ActionTypes.SET_PAGES,
        pages: newPages
      });
      expect(newState).toEqual(newPages);
    });
  });

  describe("ADD_PAGE", () => {
    it("adds the page to the end of pages", () => {
      const newPage = {name: "3", elements:[]};
      const newState = pages(state, {
        type: ActionTypes.ADD_PAGE,
        page: newPage
      });
      // last page
      expect(newState[newState.length-1]).toEqual(newPage);
    });
  });

  describe("REMOVE_PAGE", () => {
    it("removes the page with provided name", () => {
      expect(state.length).toBe(2);
      const newState = pages(state, {
        type: ActionTypes.REMOVE_PAGE,
        name: "2"
      });
      expect(newState.length).toBe(1);
    });
  });

  describe("RENAME_PAGE", () => {
    it("changes the name of the page with the old name", () => {
      const newName = 'testname';
      const oldName = '2';
      const index = state.findIndex(p => p.name === oldName);
      const newState = pages(state, {
        type: ActionTypes.RENAME_PAGE,
        name: newName,
        oldName
      });
      expect(newState[index].name).toBe(newName);
    });
  });
});

