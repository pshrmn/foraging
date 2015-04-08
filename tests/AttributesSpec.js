describe("attributes", function(){
    it("returns an object representing an element's attributes", function(){
        var ele = document.createElement("img");
        var attrs = {
            "class": "link",
            "src": "example.png"
        };
        for ( var key in attrs ) {
            ele.setAttribute(key, attrs[key])
        };

        var mappedAttr = attributes(ele);
        for ( var key in attrs ) {
            expect(mappedAttr[key]).toEqual(attrs[key]);
        }
    });

    it("includes text if non-empty", function(){
        var ele = document.createElement("a");
        var text = "this is a test";
        ele.textContent = text;
        var mappedAttr = attributes(ele);
        expect(mappedAttr.text).toEqual(text);
    });

    it("does not include empty text", function(){
        var ele = document.createElement("a");
        var mappedAttr = attributes(ele);
        expect(mappedAttr.text).toBeUndefined();
    });
});
