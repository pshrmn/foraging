import { highlight, unhighlight, iHighlight, iUnhighlight } from "helpers/markup";

describe("markup", () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <p>One</p>
        <p>Two</p>
      </div>
      <div></div>
      <div>
        <p>Three</p>
        <p class='no-select'>Ignore</p>
      </div>`;
  });

  describe("highlight", () => {
    it("adds the class to all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      expect(document.getElementsByClassName(className).length).toBe(0);
      highlight(elements, className);
      expect(document.getElementsByClassName(className).length).toBe(3);
    });
  });

  describe("unhighlight", () => {
    it("remove the class from all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      highlight(elements, className);
      expect(document.getElementsByClassName(className).length).toBe(3);
      unhighlight(className);
      expect(document.getElementsByClassName(className).length).toBe(0);
    });
  });

  describe("iHighlight", () => {
    // can't actually test if an element has an event attached without
    // simulating that event occurring
    it("adds the class to all elements", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      const e = () => {};
      expect(document.getElementsByClassName(className).length).toBe(0);
      const iUn = iHighlight(elements, className, e, e, e);
      expect(document.getElementsByClassName(className).length).toBe(3);

      
    });

    it("returns a function that removes the class", () => {
      const elements = document.querySelectorAll("div");
      const className = "highlighted";
      const e = () => {};
      const iUn = iHighlight(elements, className, e, e, e);
      expect(document.getElementsByClassName(className).length).toBe(3);
      expect(iUn.call).toBeDefined();
      // this should now remove the className
      iUn();
      expect(document.getElementsByClassName(className).length).toBe(0);
    })
  });
});
