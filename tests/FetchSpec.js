describe("Fetch", function(){
    describe("not", function(){
        it("returns selector with :not(.noSelect) appended", function(){
            expect(Fetch.not("a")).toEqual("a:not(.noSelect)");
        });

        it("prepends prefix if it exists", function(){
            expect(Fetch.not("a", "#main")).toEqual("#main a:not(.noSelect)");
        });
    });
});
