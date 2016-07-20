import { expect } from "chai";
import { jsdom } from "jsdom";

import { attributes, stripEvents } from "helpers/attributes";
import * as classNames from "constants/CSSClasses";

describe("attribute", () => {

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

  describe("attributes", () => {
    it("returns an array of objects representing an element's attributes", () => {
      const ele = document.createElement("img");
      const attrMap = {
        "class": "link",
        "src": "example.png"
      };
      for ( const key in attrMap ) {
        ele.setAttribute(key, attrMap[key])
      };

      const attrs = attributes(ele);
      Object.keys(attrMap).forEach(a => {
        const matches = attrs.filter(attr => {
          return attr.name === a;
        });
        expect(matches.length).to.equal(1);
      });
    });

    it("includes text if non-empty", () => {
      const ele = document.createElement("a");
      const text = "this is a test";
      ele.textContent = text;
      const attrs = attributes(ele);
      const matches = attrs.filter(attr => {
        return attr.name === "text";
      });
      expect(matches.length).to.equal(1);
    });

    it("does not include empty text", () => {
      const ele = document.createElement("a");
      const attrs = attributes(ele);
      const matches = attrs.filter(attr => {
        return attr.name === "text";
      });
      expect(matches.length).to.equal(0);
    });

    it("removes Forager's classes from the class attribute", () => {
      const classes = Object.keys(classNames).map(n => classNames[n]);
      classes.forEach(c => {
        const ele = document.createElement("a");
        ele.classList.add("foo");
        ele.classList.add(c);
        const attrs = attributes(ele);
        attrs.some(attr => {
          if (attr.name === "text") {
            expect(attr.value).to.equal("foo");
          }
        });
        
      })
    });

    it("does not include ignored attributes", () => {
      const ele = document.createElement("div");
      ele.style = "background: red;";
      const attrs = attributes(ele, {"style": true});
      const matches = attrs.filter(attr => {
        return attr.name === "style";
      });
      expect(matches.length).to.equal(0);
    });
  });

  describe("stripEvents", () => {
    it("returns element if it has no on* attributes", () => {
      const ele = document.createElement("button");
      document.body.appendChild(ele);
      ele.setAttribute("class", "button-class");
      ele.setAttribute("id", "button-id");
      const stripped = stripEvents(ele);
      expect(stripped).to.equal(ele);
    });

    it("remove any on* attributes from an element and return clone", () => {
      const ele = document.createElement("button");
      document.body.appendChild(ele);
      ele.setAttribute("onclick", () => { return false; });
      const beforeEvents = Array.from(ele.attributes).some(a =>  a.name.startsWith("on"))
      expect(beforeEvents).to.be.true;
      const stripped = stripEvents(ele);
      const afterEvents = Array.from(stripped.attributes).some(a => { a.name.startsWith("on"); });
      expect(afterEvents).to.be.false;
      expect(stripped).to.not.equal(ele);
    });
  });
});
