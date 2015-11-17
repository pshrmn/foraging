import { expect } from "chai";

import { attributes } from "../../src/helpers/attributes";

describe("attribute", () => {

  describe("attributes", () => {
    it("returns an object representing an element's attributes", () => {
      var ele = document.createElement("img");
      var attrs = {
        "class": "link",
        "src": "example.png"
      };
      for ( var key in attrs ) {
        ele.setAttribute(key, attrs[key])
      };

      var mappedAttrs = attributes(ele);
      for ( var key in attrs ) {
        expect(mappedAttrs[key]).to.equal(attrs[key]);
      }
    });

    it("includes text if non-empty", () => {
      var ele = document.createElement("a");
      var text = "this is a test";
      ele.textContent = text;
      var mappedAttrs = attributes(ele);
      expect(mappedAttrs.text).to.equal(text);
    });

    it("does not include empty text", () => {
      var ele = document.createElement("a");
      var mappedAttrs = attributes(ele);
      expect(mappedAttrs.text).to.be.undefined;
    });

    it("removes the 'current-selector' class from the class attribute", () => {
      var ele = document.createElement("a");
      ele.classList.add("foo");
      ele.classList.add("current-selector");
      let mappedAttrs = attributes(ele);
      expect(mappedAttrs["class"]).to.equal("foo");
    });

    it("does not include ignored attributes", () => {
      var ele = document.createElement("div");
      ele.style = "background: red;";
      let mappedAttrs = attributes(ele, {"style": true});
      expect(mappedAttrs["style"]).to.be.undefined;
    });
  });

});
