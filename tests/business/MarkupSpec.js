import { expect } from "chai";
import { jsdom } from "jsdom";

import { highlight, unhighlight, iHighlight, iUnhighlight } from "../../src/business/markup";

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

describe("markup", () => {
  
  describe("highlight", () => {
    it("adds the class to all elements", () => {
      let elements = document.querySelectorAll("div");
      let className = "highlighted";
      expect(document.getElementsByClassName(className).length).to.equal(0);
      highlight(elements, className);
      expect(document.getElementsByClassName(className).length).to.equal(3);
    });
  });

  describe("unhighlight", () => {
    it("remove the class from all elements", () => {
      let elements = document.querySelectorAll("div");
      let className = "highlighted";
      highlight(elements, className);
      expect(document.getElementsByClassName(className).length).to.equal(3);
      unhighlight(className);
      expect(document.getElementsByClassName(className).length).to.equal(0);
    });
  });

  describe("iHighlight", () => {
    // can't actually test if an element has an event attached without
    // simulating that event occurring
    it("adds the class to all elements", () => {
      let elements = document.querySelectorAll("div");
      let className = "highlighted";
      let over = () => {};
      let out = () => {};
      let click = () => {};
      expect(document.getElementsByClassName(className).length).to.equal(0);
      iHighlight(elements, className, over, out, click);
      expect(document.getElementsByClassName(className).length).to.equal(3);
    });
  });

  describe("iUnhighlight", () => {
    it("remove the class from all elements", () => {
      let elements = document.querySelectorAll("div");
      let className = "highlighted";
      let over = () => {};
      let out = () => {};
      let click = () => {};
      iHighlight(elements, className, over, out, click);
      expect(document.getElementsByClassName(className).length).to.equal(3);
      iUnhighlight(className);
      expect(document.getElementsByClassName(className).length).to.equal(0);
    });
  });
});
