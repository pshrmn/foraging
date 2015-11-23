import { expect } from "chai";
import { jsdom } from "jsdom";

import { attributes, stripEvents } from "../../src/helpers/attributes";

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

describe("attribute", () => {

  describe("attributes", () => {
    it("returns an array of objects representing an element's attributes", () => {
      var ele = document.createElement("img");
      var attrMap = {
        "class": "link",
        "src": "example.png"
      };
      for ( var key in attrMap ) {
        ele.setAttribute(key, attrMap[key])
      };

      var attrs = attributes(ele);
      Object.keys(attrMap).forEach(a => {
        let matches = attrs.filter(attr => {
          return attr.name === a;
        });
        expect(matches.length).to.equal(1);
      });
    });

    it("includes text if non-empty", () => {
      var ele = document.createElement("a");
      var text = "this is a test";
      ele.textContent = text;
      var attrs = attributes(ele);
      let matches = attrs.filter(attr => {
        return attr.name === "text";
      });
      expect(matches.length).to.equal(1);
    });

    it("does not include empty text", () => {
      var ele = document.createElement("a");
      var attrs = attributes(ele);
      let matches = attrs.filter(attr => {
        return attr.name === "text";
      });
      expect(matches.length).to.equal(0);
    });

    it("removes the 'current-selector' class from the class attribute", () => {
      var ele = document.createElement("a");
      ele.classList.add("foo");
      ele.classList.add("current-selector");
      let attrs = attributes(ele);
      attrs.some(attr => {
        if (attr.name === "text") {
          expect(attr.value).to.equal("foo");
        }
      });
    });

    it("does not include ignored attributes", () => {
      var ele = document.createElement("div");
      ele.style = "background: red;";
      let attrs = attributes(ele, {"style": true});
      let matches = attrs.filter(attr => {
        return attr.name === "style";
      });
      expect(matches.length).to.equal(0);
    });
  });

  describe("stripEvents", () => {
    it("returns element if it has no on* attributes", () => {
      let ele = document.createElement("button");
      document.body.appendChild(ele);
      ele.setAttribute("class", "button-class");
      ele.setAttribute("id", "button-id");
      let stripped = stripEvents(ele);
      expect(stripped).to.equal(ele);
    });

    it("remove any on* attributes from an element and return clone", () => {
      let ele = document.createElement("button");
      document.body.appendChild(ele);
      ele.setAttribute("onclick", () => { return false; });
      let beforeEvents = Array.from(ele.attributes).some(a =>  a.name.startsWith("on"))
      expect(beforeEvents).to.be.true;
      let stripped = stripEvents(ele);
      let afterEvents = Array.from(stripped.attributes).some(a => { a.name.startsWith("on"); });
      expect(afterEvents).to.be.false;
      expect(stripped).to.not.equal(ele);
    });
  });
});
