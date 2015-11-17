import { expect } from "chai";
import { jsdom } from "jsdom";

import { select, count, parts } from "../../src/helpers/selection";

let doc = jsdom(`<!doctype html>
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
let win = doc.defaultView;
global.document = doc;
global.window = win;

describe("selector", () => {

  describe("select", () => {
    it("matches all child elements, ignores .no-select elements", () => {
      let divs = document.querySelectorAll("div");
      let elements = select(divs, "p");
      expect(elements.length).to.equal(3);
    });
  });

  describe("count", () => {
    it("returns the maximum number of elements for a parent", () => {
      let divs = document.querySelectorAll("div");
      let max = count(divs, "p");
      expect(max).to.equal(2);
    });
  });

  describe("parts", () => {
    it("returns an array with the element's tag", () => {
      let element = document.createElement("div");
      let tags = parts(element);
      expect(tags).to.eql(["div"]);
    });

    it("includes the id if there is one", () => {
      let element = document.createElement("div");
      element.id = "example";
      let tags = parts(element);
      expect(tags).to.eql(["div", "#example"]);
    });

    it("includes classes", () => {
      let element = document.createElement("div");
      element.classList.add("example");
      let tags = parts(element);
      expect(tags).to.eql(["div", ".example"]);
    })

    it("ignores undesired classes", () => {
      let element = document.createElement("span");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      element.classList.add("forager-highlight");
      let tags= parts(element);
      expect(tags).to.eql(["span"]);
    });
  });
});