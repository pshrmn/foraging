import { expect } from "chai";
import { jsdom } from "jsdom";

import { createElement, flatten, clean,
  fullGrow, simpleGrow } from "../../src/helpers/page";

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
      expect(links.selector).to.equal("a");
      expect(links.spec.type).to.equal("single");
      expect(links.spec.index).to.equal(0);
      expect(links.childIndices).to.be.instanceof(Array);
      expect(links.optional).to.be.false;
      expect(links.matches).to.be.instanceof(Array);
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
      expect(links.spec.type).to.equal("all");
      expect(links.spec.name).to.equal("divs");
      expect(links.optional).to.be.true;
    });
  });

  describe("flatten", () => {
    it("returns empty array when tree is undefined", () => {
      expect(flatten().length).to.equal(0);
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
      expect(arr.length).to.equal(3);
      expect(arr[0].parent).to.be.null;
      arr.forEach((a,i) => {
        // index should be the same as array index
        expect(a.index).to.equal(i);
        expect(a.parent).to.be.defined;
        expect(a.childIndices).to.be.instanceof(Array);
      })
    });
  });

  describe("clean", () => {
    it("returns a \"clean\" version of the page", () => {
      const cleanPage = clean(examplePage);
      expect(cleanPage.element).to.be.instanceof(Object);
      expect(cleanPage.elements).to.be.undefined;
    });
  });

  describe("fullGrow", () => {
    it("converts an elements array to a tree", () => {
      const tree = fullGrow(examplePage.elements);
      // tree is the root element
      expect(tree.children).to.be.instanceof(Array);
      expect(tree.childIndices).to.be.undefined;
      expect(tree.parent).to.be.undefined;
    });
  });

  describe("simpleGrow", () => {
    it("converts an elements array to a tree for d3", () => {
      const tree = simpleGrow(examplePage.elements);
      expect(tree.hasRules).to.be.false;
      expect(tree.hasChildren).to.be.true;
      expect(tree.children).to.be.instanceof(Array);
    });
  });
});
