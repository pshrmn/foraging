import { expect } from "chai";

import { legalName, abbreviate } from "../../src/helpers/text";

describe("text", () => {

  describe("legalName", () => {
    it("returns true for legal names", () => {
      let allGood = [
        "these",
        "names_are",
        "all-legal"
      ].every(s => {
        return legalName(s);
      });
      expect(allGood).to.be.true;
    });

    it("returns false when a name is null", () => {
      expect(legalName(null)).to.be.false;
    });

    it("returns false when a name is an empty string", () => {
      expect(legalName("")).to.be.false;
    });    

    it("returns false when a name contains illegal characters", () => {
      // illegal characters: < > : " / \ | ? *
      let allBad = [
        "<name",
        ">name",
        ":name",
        "/name",
        "\\name",
        "|name",
        "?name",
        "*name"
      ].every(s => {
        return !legalName(s);
      })
      expect(allBad).to.be.true;
    });
  });

  describe("abbreviate", () => {
    it("returns text when length is less than max", () => {
      let text = "characters";
      expect(abbreviate(text, text.length)).to.equal(text);
    });

    it("returns ellipsis when max <= 3", () => {
      [0,1,2,3].forEach(function(val){
        expect(abbreviate("test", val)).to.equal("...");
      });
    });

    it("returns even first and second half length when max is odd", () => {
      let abbr = abbreviate("a string of characters", 15);
      let halves = abbr.split("...");
      expect(halves[0].length).to.equal(6);
      expect(halves[1].length).to.equal(6);
    });

    it("returns longer first half when max is even", () => {
      let abbr = abbreviate("a string of characters", 14);
      let halves = abbr.split("...");
      expect(halves[0].length).to.equal(6);
      expect(halves[1].length).to.equal(5);
    });
  });


});
