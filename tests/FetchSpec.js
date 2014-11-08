describe("Fetch", function(){
    describe("not", function(){
        it("returns selector with :not(.noSelect) appended", function(){
            expect(Fetch.not("a")).toEqual("body a:not(.noSelect)");
        });

        it("uses body as default prefix", function(){
            expect(Fetch.not("a")).toEqual("body a:not(.noSelect)");
        });

        it("prepends prefix if it exists", function(){
            expect(Fetch.not("a", "#main")).toEqual("#main a:not(.noSelect)");
        });
    });
});
