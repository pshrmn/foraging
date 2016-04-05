import { expect } from "chai";
import { jsdom } from "jsdom";

import { highlight, unhighlight, iHighlight, iUnhighlight } from "../../src/helpers/markup";

describe("markup", () => {
  
    beforeEach(() => {
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
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
  });

  describe("highlight", () => {
    it("adds the class to all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      expect(document.getElementsByClassName(className).length).to.equal(0);
      highlight(elements, className);
      expect(document.getElementsByClassName(className).length).to.equal(3);
    });
  });

  describe("unhighlight", () => {
    it("remove the class from all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
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
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      const over = () => {};
      const out = () => {};
      const click = () => {};
      expect(document.getElementsByClassName(className).length).to.equal(0);
      iHighlight(elements, className, over, out, click);
      expect(document.getElementsByClassName(className).length).to.equal(3);
    });
  });

  describe("iUnhighlight", () => {
    it("remove the class from all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      const over = () => {};
      const out = () => {};
      const click = () => {};
      iHighlight(elements, className, over, out, click);
      expect(document.getElementsByClassName(className).length).to.equal(3);
      iUnhighlight(className);
      expect(document.getElementsByClassName(className).length).to.equal(0);
    });
  });
});
