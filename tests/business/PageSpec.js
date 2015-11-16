import { expect } from "chai";

import { createPage } from "../../src/business/page";

describe("page", () => {

  describe("createPage", () => {
    it("creates a new page with the given name", () => {
      let p = createPage("example");
      expect(p.name).to.equal("example");
    });

    it("has expected default properties", () => {
      let p = createPage("example");
      expect(p.selector).to.equal("body");
      expect(p).to.have.property("children");
      expect(p).to.have.property("rules");
      expect(p.spec).to.eql({type: "single", value: 0});
    });
  });
});
