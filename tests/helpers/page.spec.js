import { createElement, flatten, clean,
  fullGrow, simpleGrow } from "helpers/page";

describe("page", () => {

  const page = {
    name: "example",
    elements: [
      {
        selector: "body",
        spec: {
          type: "single",
          index: 0
        },
        rules: [],
        index: 0,
        parent: null,
        childIndices: [1]
      },
      {
        selector: "p",
        spec: {
          type: "all",
          name: "peas"
        },
        rules: [],
        parent: 0,
        childIndices: []
      }
    ]    
  }

  let examplePage;
  beforeEach(() => {
    // "cheap" copy of the page
    examplePage = JSON.parse(JSON.stringify(page));
  });


  describe("createElement", () => {
    it("returns an element object with default values", () => {
      const links = createElement("a");
      expect(links.selector).toBe("a");
      expect(links.spec.type).toBe("single");
      expect(links.spec.index).toBe(0);
      expect(links.childIndices).toBeInstanceOf(Array);
      expect(links.optional).toBe(false);
      expect(links.matches).toBeInstanceOf(Array);
    });

    it("sets alternate values when provided", () => {
      const links = createElement(
        "div",
        {
          type: "all",
          name: "divs"
        },
        true
      );
      expect(links.spec.type).toBe("all");
      expect(links.spec.name).toBe("divs");
      expect(links.optional).toBe(true);
    });
  });

  describe("flatten", () => {
    it("returns empty array when tree is undefined", () => {
      expect(flatten().length).toBe(0);
    });

    it("returns an array representation of the tree", () => {
      const tree = {
        name: "parent",
        children: [
          {
            name: "child 1",
            children: []
          },
          {
            name: "child 2",
            children: []
          }
        ]
      };
      const arr = flatten(tree);
      expect(arr.length).toBe(3);
      expect(arr[0].parent).toBeNull();
      arr.forEach((a,i) => {
        // index should be the same as array index
        expect(a.index).toBe(i);
        expect(a.parent).toBeDefined();
        expect(a.childIndices).toBeInstanceOf(Array);
      })
    });
  });

  describe("clean", () => {
    it("returns a \"clean\" version of the page", () => {
      const cleanPage = clean(examplePage);
      expect(cleanPage.element).toBeInstanceOf(Object);
      expect(cleanPage.elements).toBeUndefined();
    });
  });

  describe("fullGrow", () => {
    it("converts an elements array to a tree", () => {
      const tree = fullGrow(examplePage.elements);
      // tree is the root element
      expect(tree.children).toBeInstanceOf(Array);
      expect(tree.childIndices).toBeUndefined();
      expect(tree.parent).toBeUndefined();
    });
  });

  describe("simpleGrow", () => {
    it("converts an elements array to a tree for d3", () => {
      const tree = simpleGrow(examplePage.elements);
      expect(tree.hasRules).toBe(false);
      expect(tree.hasChildren).toBe(true);
      expect(tree.children).toBeInstanceOf(Array);
    });
  });
});
