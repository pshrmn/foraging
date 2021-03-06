import { validName, abbreviate, describeSpec, shortElement } from "helpers/text";

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
      expect(allGood).toBe(true);
    });

    it("returns false when a name is null", () => {
      expect(validName(null)).toBe(false);
    });

    it("returns false when a name is an empty string", () => {
      expect(validName("")).toBe(false);
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
      expect(allBad).toBe(true);
    });

    it("returns false when a name is already taken", () => {
      const existing = ["foo", "bar", "baz"];
      expect(validName("test", existing)).toBe(true);
      expect(validName("foo", existing)).toBe(false);
    });
  });

  describe("abbreviate", () => {
    it("returns text when length is less than max", () => {
      const text = "characters";
      expect(abbreviate(text, text.length)).toBe(text);
    });

    it("returns ellipsis when max <= 3", () => {
      [0,1,2,3].forEach(function(val){
        expect(abbreviate("test", val)).toBe("...");
      });
    });

    it("returns even first and second half length when max is odd", () => {
      const abbr = abbreviate("a string of characters", 15);
      const halves = abbr.split("...");
      expect(halves[0].length).toBe(6);
      expect(halves[1].length).toBe(6);
    });

    it("returns longer first half when max is even", () => {
      const abbr = abbreviate("a string of characters", 14);
      const halves = abbr.split("...");
      expect(halves[0].length).toBe(6);
      expect(halves[1].length).toBe(5);
    });
  });

  describe("describeSpec", () => {
    it("properly describes single specs", () => {
      const spec = {
        type: 'single',
        index: 2
      };
      const text = describeSpec(spec);
      expect(text).toBe('captures element at index 2');
    });

    it("properly describes all specs", () => {
      const spec = {
        type: 'all',
        name: 'group'
      };
      const text = describeSpec(spec);
      expect(text).toBe('captures all elements, groups them as "group"');
    });

    it("properly describes range specs", () => {
      const spec = {
        type: 'range',
        name: 'group',
        low: 1,
        high: 3
      };
      const text = describeSpec(spec);
      expect(text).toBe('captures elements 1 to 3, groups them as "group"');
    });

    it("uses end as filler for null high value in range specs", () => {

      const noHighSpec = {
        type: 'range',
        name: 'group',
        low: 1,
        high: null
      };
      const highText = describeSpec(noHighSpec);
      expect(highText).toBe('captures elements 1 to end, groups them as "group"');
    });

    it("returns empty string for other specs", () => {
      const badSpecs = [
        undefined,
        {
          type: 'unknown'
        }
      ];
      badSpecs.forEach(bs => {
        expect(describeSpec(bs)).toBe('');
      });
    });
  });

  describe("shortElement", () => {

    it("properly shortens single elements", () => {
      const short = shortElement(
        'div',
        {
          type: 'single',
          index: 2
        }
      );
      expect(short).toBe('div[2]');
    });

    it("properly shortens all elements", () => {
      const short = shortElement(
        'div',
        {
          type: 'all'
        }
      );
      expect(short).toBe('[div]');
    });

    it("properly shortens range elements", () => {
      const short = shortElement(
        'div',
        {
          type: 'range',
          low: 1,
          high: 4
        }
      );
      expect(short).toBe('div[1:4]');
    });

    it("replaces null with end for range elements with high=null", () => {
      const short = shortElement(
        'div',
        {
          type: 'range',
          low: 1,
          high: null
        }
      );
      expect(short).toBe('div[1:end]');
    });

    it("includes an asterisk for optional elements", () => {
      const short = shortElement(
        'div',
        {
          type: 'single',
          index: 2
        },
        true
      );
      expect(short).toBe('div[2]*');
    });

    it("only returns abbreviated selector when no spec is provided", () => {
      const short = shortElement(
        'div'
      );
      expect(short).toBe('div');
    });
  });
});
