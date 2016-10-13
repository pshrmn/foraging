import { jsdom } from "jsdom";

import { protect, select, count, parts, allSelect } from "helpers/selection";

describe("selector", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <p>One</p>
        <p>Two</p>
      </div>
      <div></div>
      <div class="third">
        <p>Three</p>
        <p class='no-select'>Ignore</p>
      </div>`;
  });

  describe("protect", () => {
    it("should add the no-select class to elements matching selector and children", () => {

      protect('.third');
      Array.from(document.querySelectorAll('.third')).forEach(ele => {
        expect(ele.classList.contains('no-select')).toBe(true);
        Array.from(ele.querySelectorAll('*')).forEach(child => {
          expect(child.classList.contains('no-select')).toBe(true);
        });
      });
    });
  });

  describe("select", () => {
    it("matches all child elements, ignores .no-select elements", () => {
      const divs = document.querySelectorAll("div");
      const elements = select(divs, "p");
      expect(elements.length).toBe(3);
    });

    it("only selects elements that match the spec", () => {
      const elements = select([document.body], "div", {type: "single", index: 0});
      expect(elements.length).toBe(1);
    });

    it("adds the no-select class to ignored classes before selecting", () => {
      const elements = select([document.body], "div", {type: "all", name: "div"}, ".third");
      expect(elements.length).toBe(2)
    });

    it("selects with range spec", () => {
      const divs = document.querySelectorAll("div");
      const elements = select(divs, "p", {type: 'range', low: 0, high: 1});
      expect(elements.length).toBe(2);
    });

    it("selects with single spec", () => {
      const divs = document.querySelectorAll("div");
      const elements = select(divs, "p", {type: 'single', index: 1});
      expect(elements.length).toBe(1);
    })
  });

  describe("count", () => {
    it("returns the maximum number of elements for a parent", () => {
      const divs = document.querySelectorAll("div");
      const max = count(divs, "p");
      expect(max).toBe(2);
    });

    it("counts with range spec", () => {
      const divs = document.querySelectorAll("div");
      const max = count(divs, "p", {type: 'range', low: 0, high: 1})
      expect(max).toBe(1)
    });

    it("counts with single spec", () => {
      const divs = document.querySelectorAll("div");
      const max = count(divs, "p", {type: 'single', index: 0})
      expect(max).toBe(1)
    })
  });

  describe("parts", () => {
    it("returns an array with the element's tag", () => {
      const element = document.createElement("div");
      const tags = parts(element);
      expect(tags).toEqual(["div"]);
    });

    it("includes the id if there is one", () => {
      const element = document.createElement("div");
      element.id = "example";
      const tags = parts(element);
      expect(tags).toEqual(["div", "#example"]);
    });

    it("includes classes", () => {
      const element = document.createElement("div");
      element.classList.add("example");
      const tags = parts(element);
      expect(tags).toEqual(["div", ".example"]);
    })

    it("ignores undesired classes", () => {
      const element = document.createElement("span");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      const tags= parts(element);
      expect(tags).toEqual(["span"]);
    });
  });

  describe("allSelect", () => {
    it("returns true when all elements are select elements", () => {
      const elements = ["select", "select", "select"].map(t => document.createElement(t));
      expect(allSelect(elements)).toBe(true);
    });

    it("returns false if any elements are not select elements", () => {
      const elements = ["select", "div", "select"].map(t => document.createElement(t));
      expect(allSelect(elements)).toBe(false);
    });
  });
});