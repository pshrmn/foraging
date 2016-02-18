import { expect } from "chai";

import { validName, abbreviate } from "../../src/helpers/text";

describe("text", () => {

  describe("validName", () => {
    it("returns true for legal names", () => {
      const allGood = [
        "these",
        "names_are",
        "all-legal"
      ].every(s => {
        return validName(s);
      });
      expect(allGood).to.be.true;
    });

    it("returns false when a name is null", () => {
      expect(validName(null)).to.be.false;
    });

    it("returns false when a name is an empty string", () => {
      expect(validName("")).to.be.false;
    });    

    it("returns false when a name contains illegal characters", () => {
      // illegal characters: < > : " / \ | ? *
      const allBad = [
        "<name",
        ">name",
        ":name",
        "/name",
        "\\name",
        "|name",
        "?name",
        "*name"
      ].every(s => {
        return !validName(s);
      })
      expect(allBad).to.be.true;
    });

    it("returns false when a name is already taken", () => {
      const existing = ["foo", "bar", "baz"];
      expect(validName("test", existing)).to.be.true;
      expect(validName("foo", existing)).to.be.false;
    });
  });

  describe("abbreviate", () => {
    it("returns text when length is less than max", () => {
      const text = "characters";
      expect(abbreviate(text, text.length)).to.equal(text);
    });

    it("returns ellipsis when max <= 3", () => {
      [0,1,2,3].forEach(function(val){
        expect(abbreviate("test", val)).to.equal("...");
      });
    });

    it("returns even first and second half length when max is odd", () => {
      const abbr = abbreviate("a string of characters", 15);
      const halves = abbr.split("...");
      expect(halves[0].length).to.equal(6);
      expect(halves[1].length).to.equal(6);
    });

    it("returns longer first half when max is even", () => {
      const abbr = abbreviate("a string of characters", 14);
      const halves = abbr.split("...");
      expect(halves[0].length).to.equal(6);
      expect(halves[1].length).to.equal(5);
    });
  });


});
