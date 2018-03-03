import {
  createElement,
  preparePages,
  flatten,
  clean,
  fullGrow,
  simpleGrow,
  levelNames
} from "helpers/page";

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
        selector: "div",
        spec: {
          type: "single",
          index: 0
        },
        rules: [{
          name: "id",
          attr: "id",
          type: "string"
        }],
        index: 1,
        parent: 0,
        childIndices: [2]
      },
      {
        selector: "p",
        spec: {
          type: "all",
          name: "peas"
        },
        rules: [{
          name: "description",
          attr: "text",
          type: "string"
        }],
        index: 2,
        parent: 1,
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

  describe("preparePages", () => {
    it("prepares each page in the pages array", () => {
      const preppedPages = preparePages([examplePage]);
      expect(preppedPages.length).toBe(1);
    })

    it("ignored null pages", () => {
      const preppedPages = preparePages([null, examplePage]);
      expect(preppedPages.length).toBe(1);
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

    it("doesn't add null elements to the tree", () => {
      examplePage.elements.push(null);
      expect(examplePage.elements.length).toBe(4);
      const tree = fullGrow(examplePage.elements);

      // traverse the tree and count the number of elements
      let elementCount = 0;
      function traverse(element) {
        elementCount += 1;
        element.children.forEach(c => traverse(c));
      }
      traverse(tree);
      expect(elementCount).toBe(3);
    });
  });

  describe("simpleGrow", () => {
    it("converts an elements array to a tree for d3", () => {
      const tree = simpleGrow(examplePage.elements);
      expect(tree.hasRules).toBe(false);
      expect(tree.hasChildren).toBe(true);
      expect(tree.children).toBeInstanceOf(Array);
    });

    it("doesn't add null elements to the tree", () => {
      // when the child is set to null, the tree shouldn't have any children
      examplePage.elements[2] = null;
      const nullElements = [
        examplePage.elements[0],
        null
      ]
      const nullTree = simpleGrow(nullElements);
      expect(nullTree.hasChildren).toBe(false);
      expect(nullTree.children).toBeInstanceOf(Array);
      expect(nullTree.children.length).toBe(0)
    });

  });

  describe("levelNames", () => {
    it("returns a list of taken names for elements with spec name", () => {
      const names = levelNames(examplePage.elements, 2);
      const expectedNames = ["description"];
      names.forEach(n => {
        expect(expectedNames.includes(n)).toBe(true);
      });
    });

    it("returns a list of taken names beginning with the root element", () => {
      const names = levelNames(examplePage.elements, 1);
      const expectedNames = ["id", "peas"];
      names.forEach(n => {
        expect(expectedNames.includes(n)).toBe(true);
      });
    });

    it("returns an empty list if current element is null", () => {
      examplePage.elements.push(null);
      const names = levelNames(examplePage.elements, 3);
      expect(names.length).toBe(0);
    })
  });

});
