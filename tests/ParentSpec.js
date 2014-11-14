describe("Parent", function(){
    describe("defaults", function(){
        it("expect default values to be set", function(){
            expect(Parent.exists).toBe(false);
            expect(Parent.count).toEqual(0);
            expect(Parent.hidden).toBe(false);
            expect(Parent.html).toBe(false);
        });
    });

    describe("set", function(){
        var eles;
        // generate 10 div.parent elements
        beforeEach(function(){
            eles = [];
            var e;
            for ( var i=0; i<10; i++ ) {
                e = document.createElement("div");
                e.classList.add("parent");
                document.body.appendChild(e);
                eles.push(e);
            }
        });

        // remove all .parent elements, and reset array
        afterEach(function(){
            eles.forEach(function(e){
                e.parentElement.removeChild(e);
            });
            eles = [];
        });

        it("sets the parent object", function(){
            var p = {
                selector: ".parent"
            };
            Parent.set(p);
            expect(Parent.exists).toBe(true);
            expect(Parent.count).toEqual(10);
            expect(Parent.html).toBe(true);
        });

        it("uses range", function(){
            var p = {
                selector: ".parent",
                low: 3
            };
            Parent.set(p);
            expect(Parent.count).toEqual(7);
        })
    });

    describe("remove", function(){
        var eles;
        // generate 10 div.parent elements
        beforeEach(function(){
            eles = [];
            var e;
            for ( var i=0; i<10; i++ ) {
                e = document.createElement("div");
                e.classList.add("parent");
                document.body.appendChild(e);
                eles.push(e);
            }
        });

        // remove all .parent elements, and reset array
        afterEach(function(){
            eles.forEach(function(e){
                e.parentElement.removeChild(e);
            });
            eles = [];
        });

        it("removes the parent", function(){
            var p = {
                selector: ".parent"
            }
            Parent.set(p);
            expect(Parent.exists).toBe(true);
            Parent.remove();
            expect(Parent.exists).toBe(false);
            expect(Parent.parent).toBeUndefined();
            expect(Parent.count).toEqual(0);
            expect(Parent.html).toBe(false);
        });

    });
});