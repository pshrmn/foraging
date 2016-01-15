import { expect } from "chai";
import { jsdom } from "jsdom";

import { select, count, parts } from "../../src/helpers/selection";

const doc = jsdom(`<!doctype html>
  <html>
  <body>
    <div>
      <p>One</p>
      <p>Two</p>
    </div>
    <div></div>
    <div>
      <p>Three</p>
      <p class='no-select'>Ignore</p>
    </div>
  </body>
</html>`);
const win = doc.defaultView;
global.document = doc;
global.window = win;

describe("selector", () => {

  describe("select", () => {
    it("matches all child elements, ignores .no-select elements", () => {
      const divs = document.querySelectorAll("div");
      const elements = select(divs, "p");
      expect(elements.length).to.equal(3);
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
});