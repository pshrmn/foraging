import { expect } from "chai";

import { attributes } from "../../src/helpers/attributes";

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

});
