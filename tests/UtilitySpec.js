describe("utility functions", function(){
    describe("noSelectElement", function(){
        it("returns element with the correct tagname", function(){
            expect(noSelectElement("div").tagName).toEqual("DIV");
            expect(noSelectElement("span").tagName).toEqual("SPAN");
        });

        it("adds noSelect class", function(){
            expect(noSelectElement("div").classList.contains("noSelect")).toBe(true);
        });
    });

    describe("hasClass", function(){
        var ele;
        beforeEach(function(){
            ele = document.createElement("div");
        });

        it("does have class", function(){
            ele.classList.add("foo");
            expect(hasClass(ele, "foo")).toBe(true);
        });
        it("does not have class", function(){
            expect(hasClass(ele, "foo")).toBe(false);
        });
    });

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

    describe("swapClasses", function(){
        it("removes oldClass and adds newClass", function(){
            var ele = document.createElement("div");
            ele.classList.add("first");
            swapClasses(ele, "first", "second");
            expect(ele.classList.contains("first")).toBe(false);
            expect(ele.classList.contains("second")).toBe(true);
        });
    });

    //addevents/removeevents, not sure how to check if an element has an eventlistener attached to it

    describe("addNoSelect", function(){
        it("adds .noSelect class to all elements in eles", function(){
            var holder = document.createElement("div"),
                holderEles;
            for ( var i=0; i<20; i++ ){
                holder.appendChild(document.createElement("div"));
            }
            document.body.appendChild(holder);
            holderEles = holder.getElementsByTagName("div");
            addNoSelect(holderEles);
            expect(holder.getElementsByClassName("noSelect").length).toEqual(20);
            document.body.removeChild(holder);
        });
    });
});