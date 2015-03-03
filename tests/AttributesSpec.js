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

describe("abbreviate", function(){
    it("returns text when length is less than max", function(){
        var text = "characters";
        expect(abbreviate(text, text.length)).toEqual(text);
    });

    it("returns ellipsis when max <= 3", function(){
        [0,1,2,3].forEach(function(val){
            expect(abbreviate("test", val)).toEqual("...");
        });
    });

    it("returns even first and second half length when max is odd", function(){
        var abbr = abbreviate("a string of characters", 15);
        var halves = abbr.split("...");
        expect(halves[0].length).toEqual(6);
        expect(halves[1].length).toEqual(6);
    });

    it("returns longer first half when max is even", function(){
        var abbr = abbreviate("a string of characters", 14);
        var halves = abbr.split("...");
        expect(halves[0].length).toEqual(6);
        expect(halves[1].length).toEqual(5);
    });
});