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


});

