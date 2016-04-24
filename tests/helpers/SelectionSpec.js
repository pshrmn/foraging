import { expect } from "chai";
import { jsdom } from "jsdom";

import { protect, select, count, parts, allSelect } from "../../src/helpers/selection";

describe("selector", () => {

    beforeEach(() => {
    const doc = jsdom(`<!doctype html>
      <html>
      <body>
        <div>
          <p>One</p>
          <p>Two</p>
        </div>
        <div></div>
        <div class='third'>
          <p>Three</p>
          <p class='no-select'>Ignore</p>
        </div>
      </body>
    </html>`);
    const win = doc.defaultView;
    global.document = doc;
    global.window = win;
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
  });

  describe("protect", () => {
    it("should add the no-select class to elements matching selector and children", () => {

      protect('.third');
      Array.from(document.querySelectorAll('.third')).forEach(ele => {
        expect(ele.classList.contains('no-select')).to.be.true;
        Array.from(ele.querySelectorAll('*')).forEach(child => {
          expect(child.classList.contains('no-select')).to.be.true;
        });
      });
    });
  });

  describe("select", () => {
    it("matches all child elements, ignores .no-select elements", () => {
      const divs = document.querySelectorAll("div");
      const elements = select(divs, "p");
      expect(elements.length).to.equal(3);
    });

    it("only selects elements that match the spec", () => {
      const elements = select([document.body], "div", {type: "single", value: 0});
      expect(elements.length).to.equal(1);
    });

    it("adds the no-select class to ignored classes before selecting", () => {
      const elements = select([document.body], "div", {type: "all", value: "div"}, ".third");
      expect(elements.length).to.equal(2)
    });
  });

  describe("count", () => {
    it("returns the maximum number of elements for a parent", () => {
      const divs = document.querySelectorAll("div");
      const max = count(divs, "p");
      expect(max).to.equal(2);
    });
  });

  describe("parts", () => {
    it("returns an array with the element's tag", () => {
      const element = document.createElement("div");
      const tags = parts(element);
      expect(tags).to.eql(["div"]);
    });

    it("includes the id if there is one", () => {
      const element = document.createElement("div");
      element.id = "example";
      const tags = parts(element);
      expect(tags).to.eql(["div", "#example"]);
    });

    it("includes classes", () => {
      const element = document.createElement("div");
      element.classList.add("example");
      const tags = parts(element);
      expect(tags).to.eql(["div", ".example"]);
    })

    it("ignores undesired classes", () => {
      const element = document.createElement("span");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      const tags= parts(element);
      expect(tags).to.eql(["span"]);
    });
  });

  describe("allSelect", () => {
    it("returns true when all elements are select elements", () => {
      const elements = ["select", "select", "select"].map(t => document.createElement(t));
      expect(allSelect(elements)).to.be.true;
    });

    it("returns false if any elements are not select elements", () => {
      const elements = ["select", "div", "select"].map(t => document.createElement(t));
      expect(allSelect(elements)).to.be.false;
    });
  });
});