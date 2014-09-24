describe("Collect", function(){
    describe("not", function(){
        it("returns selector with :not(.noSelect) appended", function(){
            expect(Collect.not("a")).toEqual("a:not(.noSelect)");
        });

        it("prepends prefix if it exists", function(){
            expect(Collect.not("a", "#main")).toEqual("#main a:not(.noSelect)");
        });
    });
});

describe("event helpers", function(){
    describe("errors", function(){

        var ele = document.createElement("span");
        describe("errorCheck", function(){
            it("returns true if there is an error", function(){
                expect(errorCheck(true, ele, "test")).toBe(true);
            });

            it("returns false if there is not an error", function(){
                expect(errorCheck(false, ele, "test")).toBe(false);
            });

        });

        describe("emptyErrorCheck", function(){
            it("returns true if string is empty (ie. \"\"", function(){
                expect(emptyErrorCheck("", ele, "test")).toBe(true);
            });

            it("returns false if string is not empty", function(){
                expect(emptyErrorCheck("not empty", ele, "test")).toBe(false);
            });
        });

        describe("elementCount", function(){
            it("returns the number of matched selectors", function(){
                var total = elementCount(10);
                expect(total).toEqual("10 total");
            });

            it("returns count divided by parent count if parent is set", function(){
                var total = elementCount(10, 5);
                expect(total).toEqual("2 per parent group");
            });
        });
    });
});

describe("misc.", function(){
    describe("captureFunction", function(){
        it("\"text\" argument returns a function to capture text of element", function(){
            var ele = document.createElement("div"),
                captureText = captureFunction("text");
            ele.textContent = "this is only a test";
            expect(captureText(ele)).toEqual("this is only a test");
        });

        it("\"attr-___\" argument returns a function to capture attribute of element", function(){
            var ele = document.createElement("a"),
                captureID = captureFunction("attr-id"),
                captureHREF = captureFunction("attr-href");
            ele.setAttribute("id", "foo");
            ele.setAttribute("href", "http://www.example.com");
            expect(captureID(ele)).toEqual("foo");
            expect(captureHREF(ele)).toEqual("http://www.example.com");
        });
    });

    describe("isLink", function(){
        it("returns true if an element is an anchor", function(){
            var link = document.createElement("a");
            expect(isLink(link)).toBe(true);
        });

        it("returns false if an element is not an anchor", function(){
            var div = document.createElement("div"),
                span = document.createElement("span");
            expect(isLink(div)).toBe(false);
            expect(isLink(span)).toBe(false);
        });
    });

    describe("allLinks", function(){
        it("returns true if all elements in an array are anchors", function(){
            var links = [];
            for ( var i=0; i<10; i++ ) {
                links.push(document.createElement("a"));
            }
            expect(allLinks(links)).toBe(true);
        });

        it("works for a nodelist", function(){
            var div = document.createElement("div"),
                links;
            for ( var i=0; i<10; i++ ) {
                div.appendChild( document.createElement("a") );
            }
            links = div.getElementsByTagName("a");
            expect(allLinks(links)).toBe(true);
        });

        it("returns false if even one element is not an anchor", function(){
            var links = [];
            for ( var i=0; i<10; i++ ) {
                links.push(document.createElement("a"));
            }
            links.push(document.createElement("span"));
            expect(allLinks(links)).toBe(false);
        });
    });
});

describe("storage helpers", function(){

    describe("newPage", function(){
        it("returns a new page object with a default set", function(){
            var nonIndexPage = newPage("George"),
                indexPage = newPage("Bill", true);

            expect(nonIndexPage.name).toEqual("George");
            expect(nonIndexPage.index).toBe(false);
            expect(nonIndexPage.sets["default"]).toBeDefined();

            expect(indexPage.name).toEqual("Bill");
            expect(indexPage.index).toBe(true);
        });
    });

    describe("newSet", function(){
        it("returns a set with provided name", function(){
            var set = newSet("Barack");
            expect(set.name).toEqual("Barack");
        });
    });

    describe("legalFilename", function(){
        it("returns true for legal filenames", function(){
            var goodNames = ["test", "good.jpg", "this is legal !"];
            for ( var i=0, len=goodNames.length; i<len; i++ ) {
                expect(legalFilename(goodNames[i])).toBe(true);
            }
        });

        it("returns false for filenames that contain illegal characters", function(){
            var badNames = ["<", ">", ":", "\"", "\"", "/", "|", "?", "*"];
            for ( var i=0, len=badNames.length; i<len; i++ ) {
                expect(legalFilename(badNames[i])).toBe(false);
            }
        });

        it("returns false for null name", function(){
            expect(legalFilename(null)).toBe(false);
        });
    });

});

/*
describe("", function(){
    it("", function(){

    });
});
*/
