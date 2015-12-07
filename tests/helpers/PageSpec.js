import { expect } from "chai";

import { createPage } from "../../src/helpers/page";

describe("page", () => {

  describe("createPage", () => {
    it("creates a new page with the given name", () => {
      let p = createPage("example");
      expect(p.name).to.equal("example");
    });

    it("has expected default properties", () => {
      let p = createPage("example");
      let element = p.element;
      expect(element.selector).to.equal("body");
      expect(element).to.have.property("children");
      expect(element).to.have.property("rules");
      expect(element.spec).to.eql({type: "single", value: 0});
    });
  });
});
