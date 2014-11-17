describe("errors", function(){
    var ele = document.createElement("span");
    describe("errorCheck", function(){
        it("returns true if there is an error", function(){
            expect(error.check(true, ele, "test")).toBe(true);
        });

        it("returns false if there is not an error", function(){
            expect(error.check(false, ele, "test")).toBe(false);
        });

    });

    describe("emptyErrorCheck", function(){
        it("returns true if string is empty (ie. \"\"", function(){
            expect(error.empty("", ele, "test")).toBe(true);
        });

        it("returns false if string is not empty", function(){
            expect(error.empty("not empty", ele, "test")).toBe(false);
        });
    });

});