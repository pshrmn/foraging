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
    });
});

describe("utility functions", function(){
    describe("parentName", function(){
        it("returns name when length < 8 characters", function(){
            expect(parentName("short")).toEqual("short");
            expect(parentName("1234567")).toEqual("1234567");
        });

        it("returns shortened name when length >= 8 characters", function(){
            expect(parentName("this is too long")).toEqual("this ...");
            expect(parentName("12345678")).toEqual("12345...");
        });
    });

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

    describe("selectorIsComplete", function(){
        var obj;
        beforeEach(function(){
            obj = {
                name: 'link',
                selector: 'a',
                capture: 'attr-href',
                index: ''
            };
        })
        it("does nothing for complete objects", function(){
            obj = selectorIsComplete(obj);
            expect(obj.incomplete).toBeUndefined();
        });
        it("sets obj.incomplete name is missing", function(){
            obj.name = '';
            obj = selectorIsComplete(obj);
            expect(obj.incomplete).toBe(true); 
        });
        it("sets obj.incomplete selector is missing", function(){
            obj.selector = '';
            obj = selectorIsComplete(obj);
            expect(obj.incomplete).toBe(true); 
        });
        it("sets obj.incomplete capture is missing", function(){
            obj.capture = '';
            obj = selectorIsComplete(obj);
            expect(obj.incomplete).toBe(true); 
        });
        it("doesn't care about obj.index", function(){
            delete obj.index;
            obj = selectorIsComplete(obj);
            expect(obj.incomplete).toBeUndefined(); 
        });
    });

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

    describe("newRuleSet", function(){
        it("returns a rule set with provided name", function(){
            var ruleSet = newRuleSet("Barack");
            expect(ruleSet.name).toEqual("Barack");
        });
    });

    var groups = {
        "Presidents": {
            "George": {
                name: "George",
                sets: {
                    "Washington": {
                        name: "Washington",
                        rules: {
                            "one": {},
                            "two": {}
                        }
                    },
                    "Bush": {
                        name: "Bush",
                        rules: {
                            "three": {},
                            "four": {}
                        }
                    }
                }
            },
            "John": {
                name: "John",
                sets: {
                    "Adams": {
                        name: "Adams",
                        rules: {
                            "five": {},
                            "six": {}
                        }
                    },
                    "Kennedy": {
                        name: "Kennedy",
                        rules: {}
                    }
                }
            },
            "Thomas": {
                name: "Thomas",
                sets: {
                    "Jefferson": {
                        name: "Jefferson",
                        rules: {}
                    }
                }
            },
            "James": {
                name: "James",
                sets: {
                    "Madison": {
                        name: "Madison",
                        rules: {}
                    },
                    "Monroe": {
                        name: "Monroe",
                        rules: {}
                    }
                }
            }
        }
    };

    describe("unique name functions", function(){
        describe("uniqueGroupName", function(){
            it("returns false if name already exists", function(){
                expect(uniqueGroupName("Presidents", groups)).toBe(false);
            });

            it("returns true if name does not exist in", function(){
                expect(uniqueGroupName("Prime Ministers", groups)).toBe(true);
            });
        });

        describe("uniquePageName", function(){
            it("returns false if name already exists", function(){
                expect(uniquePageName("John", groups["Presidents"])).toBe(false);
            });

            it("returns true if name does not exist", function(){
                expect(uniquePageName("Mitt", groups["Presidents"])).toBe(true);
            });
        });

        describe("uniqueRuleSetName", function(){

            it("returns false if a rule set with name already exists in any of the pages", function(){
                expect(uniqueRuleSetName("Kennedy", groups["Presidents"])).toBe(false);
            });

            it("returns true if no rule set with name exists in any of the pages", function(){
                expect(uniqueRuleSetName("Kerry", groups["Presidents"])).toBe(true);
            });
        });

        describe("uniqueRuleName", function(){
            it("returns true if name doesn't exist for any current rule", function(){
                expect(uniqueRuleName("test", groups["Presidents"])).toBe(true);
            });

            it("returns false if a rule already has name", function(){
                var names = ["one", "two", "three", "four", "five", "six"];
                for ( var i=0, len=names.length; i<len; i++ ) {
                    expect(uniqueRuleName(names[i], groups["Presidents"])).toBe(false);
                }
            });
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

    describe("nonEmptyPages", function(){
        it("returns an object containing pages/sets that contain rules", function(){
            var pages = nonEmptyPages(groups["Presidents"]);
            expect(pages["George"]).toBeDefined();
            expect(pages["Thomas"]).toBeUndefined();
        });
    });

    describe("deleteEditing", function(){
        it("doesn't need to do anything if not currently editing", function(){
            // make sure it doesn't exist
            delete Interface.editing;
            expect(Interface.editing).toBeUndefined();
            deleteEditing();
            expect(Interface.editing).toBeUndefined();
        });

        it("deletes Interface.editing and removes 'editing' class when editing", function(){
            Interface.editing = {
                rule: {}
            };
            expect(Interface.editing).toBeDefined();
            deleteEditing();
            expect(Interface.editing).toBeUndefined();
        });

        it("removes .editing if editing.element exists", function(){
            var ele = document.createElement("div");
            ele.classList.add("editing");
            Interface.editing = {
                rule: {},
                element: ele
            };
            expect(Interface.editing.element.classList.contains("editing")).toBe(true);
            deleteEditing();
            expect(ele.classList.contains("editing")).toBe(false);
        });
    });
});

describe("html functions", function(){    

    describe("cleanElement", function(){
        var ele;
        beforeEach(function(){
            ele = document.createElement("div");
        });
        it("removes query string from src", function(){
            ele.setAttribute("src", "http://www.example.com/?remove=this")
            ele = cleanElement(ele);
            expect(ele.getAttribute("src")).toEqual("http://www.example.com/");
        });
        it("removes unwanted classes", function(){
            ele.classList.add("queryCheck");
            ele.classList.add("keeper");
            ele.classList.add("collectHighlight");
            ele = cleanElement(ele);
            expect(ele.className).toEqual("keeper");
        });
        it("replaces innerHTML with textContent", function(){
            ele.innerHTML = "<i>italic content</i>";
            ele = cleanElement(ele);
            expect(ele.innerHTML).toEqual("italic content");
        })
        it("concatenates long innerHTML", function(){
            ele.innerHTML = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
            ele = cleanElement(ele);
            expect(ele.innerHTML).toEqual("0123456789012345678901234...5678901234567890123456789")
        });
        it("strips whitespace from textContent", function(){
            ele.innerHTML = "this           shouldn't be so\nspread out";
            ele = cleanElement(ele);
            expect(ele.innerHTML).toEqual("this shouldn't be so spread out");
        })
    });

    describe("attributeText", function(){
        it("returns proper string representation", function(){
            var ele = document.createElement("div"),
                attrText = "class=\"foo bar\"";
            ele.setAttribute("class", "foo bar");
            expect(attributeText(ele.attributes[0])).toEqual(attrText);
        });
    });

    describe("captureAttribute", function(){
        it("returns proper string representation", function(){
            var  html = '<span class="noSelect capture" title="click to capture text property" ' + 
                'data-capture="text">this is a text</span>';
            expect(captureAttribute("this is a text", "text").outerHTML).toEqual(html);
        });
        it("ignores empty attributes", function(){
            expect(captureAttribute("class=\"\"")).toBeUndefined();
        });
    });

    describe("newOption", function(){
        it("creates a new option element with value as name", function(){
            var option = newOption("foobar");
            expect(option.tagName).toEqual("OPTION");
            expect(option.textContent).toEqual("foobar");
            expect(option.value).toEqual("foobar");
        });
    });

    /*
    // pass on this until I decide how to revampt the saved rules tab
    describe("ruleSetElement", function(){
        it("", function(){

        });
    });
    */

    describe("ruleElement", function(){
        it("creates a set of html elements representing a saved rule", function(){
            var rule = {
                name: "Bill",
                selector: ".bill",
                capture: "text"
            }

            var ele = ruleElement(rule),
                tag = ele.getElementsByTagName("span")[0];
            expect(ele.tagName).toEqual("LI");
            expect(ele.dataset.name).toEqual(rule.name);
            expect(tag.textContent).toEqual(rule.name);
            expect(tag.dataset.selector).toEqual(rule.selector);
        });
    });
});

/*
describe("", function(){
    it("", function(){

    });
});
*/
