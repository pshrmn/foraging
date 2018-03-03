import { integer, float } from "helpers/parse";

describe("parse", () => {
  describe("integer", () => {
    it("returns the first integer found in a string", () => {
      const text = "the number is 23";
      const int = integer(text);
      expect(int).toBe(23);
    });

    it("only returns the first integer", () => {
      const text = "31 is larger than 29";
      const int = integer(text);
      expect(int).toBe(31);
    });

    it("returns null when there is no integer", () => {
      const text = "one is the loneliest example";
      const int = integer(text);
      expect(int).toBeNull();
    });

    it("doesn't like commas", () => {
      const text = "$1,000,000";
      const int = integer(text);
      expect(int).toBe(1);
    })
  });

  describe("float", () => {
    it("returns the first float found in a string", () => {
      const text = "pi? you mean 3.14159?";
      const f = float(text);
      expect(f).toBe(3.14159);
    });

    it("only returns the first float", () => {
      const text = "31 is larger than 29";
      const f = float(text);
      expect(f).toBe(31);
    });

    it("returns null when there is no float", () => {
      const text = "one is the loneliest example";
      const f = float(text);
      expect(f).toBeNull();
    });
  });
});
