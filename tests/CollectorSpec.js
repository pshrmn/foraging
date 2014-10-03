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

/*
describe("", function(){
    it("", function(){

    });
});
*/
