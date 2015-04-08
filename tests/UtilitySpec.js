describe("utility functions", function(){
    describe("clearClass", function(){
        it("removes class from all elements with it", function(){
            var holder = document.createElement("div"),
                ele;
            for ( var i=0; i<20; i++ ){
                ele = document.createElement("div");
                ele.classList.add("foo");
                holder.appendChild(ele);
            }
            document.body.appendChild(holder);
            expect(document.getElementsByClassName("foo").length).toEqual(20);
            clearClass("foo");
            expect(document.getElementsByClassName("foo").length).toEqual(0);
            document.body.removeChild(holder);
        });
    });

    describe("addClass", function(){
        it ("adds class to each element in an array", function(){
            var eles = [],
                curr;
            for ( var i=0; i<20; i++ ){
                curr = document.createElement("div");
                eles.push(curr);
            }
            addClass("test", eles);
            for ( var i=0; i<20; i++ ){
                expect(eles[i].classList.contains("test")).toBe(true);
            }
        });

        it ("adds class to each element in a node list", function(){
            var holder = document.createElement("div"),
                curr;
            for ( var i=0; i<20; i++ ){
                curr = document.createElement("div");
                holder.appendChild(curr);
            }
            var eles = holder.getElementsByTagName("div");
            addClass("test", eles);
            for ( var i=0; i<20; i++ ){
                expect(eles[i].classList.contains("test")).toBe(true);
            }
        });
    })

    describe("legalPageName", function(){
        it("returns true for legal filenames", function(){
            var goodNames = ["test", "good.jpg", "this is legal !"];
            for ( var i=0, len=goodNames.length; i<len; i++ ) {
                expect(legalPageName(goodNames[i])).toBe(true);
            }
        });

        it("returns false for filenames that contain illegal characters", function(){
            var badNames = ["<", ">", ":", "\"", "\"", "/", "|", "?", "*"];
            for ( var i=0, len=badNames.length; i<len; i++ ) {
                expect(legalPageName(badNames[i])).toBe(false);
            }
        });

        it("returns false for null name", function(){
            expect(legalPageName(null)).toBe(false);
        });
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
