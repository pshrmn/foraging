describe("Schema", function(){
    describe("constructor", function(){
        it("sets name and urls", function(){
            var urls = {"http://www.example.com/packers": true,
                "http://www.example.com/football": true};
            var g = new Schema("Packers", urls);
            expect(g.name).toEqual("Packers");
            expect(JSON.stringify(g.urls)).toEqual(JSON.stringify(urls));
        });

        it("sets urls to an empty object when not provided", function(){
            var g = new Schema("Vikings");
            expect(JSON.stringify(g.urls)).toEqual("{}");
        });

        it("creates a default page", function(){
            var g = new Schema("Broncos");
            expect(g.pages["default"]).toBeDefined();
        });
    });

    describe("object", function(){
        it("returns a JSON object representing the schema", function(){
            var urls = {"http://www.example.com/lions": true,
                "http://www.example.com/football": true};
            var schemaJSON = {
                name: "Lions",
                urls: urls,
                pages: {
                    "default": {
                        name: "default",
                        index: false,
                        sets: {
                            "default": {
                                name: "default",
                                selectors: {}
                            }
                        }
                    }
                }
            }
            var g = new Schema("Lions", urls);
            expect(JSON.stringify(g.object())).toEqual(JSON.stringify(schemaJSON));
        });
    });

    describe("uploadObject", function(){
        it("returns a JSON object formatted for upload", function(){
            var g = new Schema("Bears");
            var expected = {
                name: "Bears",
                urls: []
            }
            expect(JSON.stringify(g.uploadObject())).toEqual(JSON.stringify(expected));
        });

        it("correctly builds a tree based on followed rules", function(){
            var g = new Schema("Cardinals");
            var p = new Page("Foo");
            var s1 = new SelectorSet("Bar");
            var s2 = new SelectorSet("Baz");
            var sel1 = new Selector("A");
            var sel2 = new Selector("div");
            var r1 = new Rule("Foo", "attr-href", true);
            var r2 = new Rule("div", "text");

            s1.addSelector(sel1);
            s2.addSelector(sel2);

            sel1.addRule(r1);
            sel2.addRule(r2)

            g.pages.default.addSet(s1)
            p.addSet(s2);
            g.addPage(p);
            var expected = {
                name: "Cardinals",
                urls: [],
                page: {
                    name: "default",
                    index: false,
                    sets: {
                        "Bar": {
                            name: "Bar",
                            selectors: {
                                "A": {
                                    selector: "A",
                                    rules: {
                                        "Foo": {
                                            name: "Foo",
                                            capture: "attr-href",
                                            follow: true
                                        }
                                    }
                                }
                            },
                            pages: {
                                "Foo": {
                                    name: "Foo",
                                    index: false,
                                    sets: {
                                        "Baz": {
                                            name: "Baz",
                                            selectors: {
                                                "div": {
                                                    selector: "div",
                                                    rules: {
                                                        "div": {
                                                            name: "div",
                                                            capture: "text"
                                                        }
                                                    }    
                                                }
                                            },
                                            pages: {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var upJSON = JSON.stringify(g.uploadObject());
            var upExp = JSON.stringify(expected);
            expect(upJSON).toEqual(upExp);
        })
    });

    describe("html", function(){
        it("builds and returns html elements representing the schema", function(){
            var g = new Schema("Colts");
            var ele = g.html();
            expect(ele.tagName).toEqual("DIV");
            expect(g.htmlElements.pages.tagName).toEqual("UL");
            expect(g.htmlElements.nametag.textContent).toEqual("Colts");
        });
    });

    describe("toggleURL", function(){
        it("adds a url to this.urls if it doesn't already exist", function(){
            var g = new Schema("Cowboys"),
                testURL = "http://www.example.com";
            expect(g.urls[testURL]).toBeUndefined();
            var on = g.toggleURL(testURL);
            expect(g.urls[testURL]).toBe(true);
            expect(on).toBe(true);
        });

        it("it removes a url from this.urls if it already exists", function(){
            var g = new Schema("Eagles"),
                testURL = "http://www.example.com";
            g.toggleURL(testURL);
            expect(g.urls[testURL]).toBe(true); 
            var on  = g.toggleURL(testURL);
            expect(g.urls[testURL]).toBeUndefined();
            expect(on).toBe(false);
        });
    });

    describe("addPage", function(){
        it("adds a page to schema.pages", function(){
            var g = new Schema("Titans"),
                p = new Page("locations");
            expect(g.pages["locations"]).toBeUndefined();
            expect(p.parentSchema).toBeUndefined();
            g.addPage(p);
            expect(g.pages["locations"]).toBeDefined();
            expect(p.parentSchema).toBeDefined();
        });

        it("generates html if schema html has been generated", function(){
            var g = new Schema("Jaguars"),
                p = new Page("wins");
            g.html();
            g.addPage(p);
            expect(g.htmlElements.holder).toBeDefined();
            expect(p.htmlElements.holder).toBeDefined();
        })
    });

    describe("removePage", function(){
        it("removes page from schema.pages", function(){
            var g = new Schema("Texans"),
                p = new Page("quarterbacks");
            g.addPage(p);
            expect(g.pages["quarterbacks"]).toBeDefined();
            g.removePage(p.name);
            expect(g.pages["quarterbacks"]).toBeUndefined();
        });
    });

    describe("uniquePageName", function(){
        it("returns true if name does not already exist", function(){
            var g = new Schema("Browns");
            expect(g.uniquePageName("playoff wins")).toBe(true);
        });

        it("returns false if name already exists", function(){
            var g = new Schema("Bengals");
            var p = new Schema("arrested players");
            g.addPage(p);
            expect(g.uniquePageName("arrested players")).toBe(false);
        });
    });

    describe("uniqueSelectorSetName", function(){
        it("returns true if a SelectorSet with the name does not exist", function(){
            var g = new Schema("Steelers");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new SelectorSet("Quarterbacks");
            var r2 = new SelectorSet("Linebackers");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            expect(g.uniqueSelectorSetName("Punters")).toBe(true);
        });

        it("returns false if a SelectorSet with the name already exists", function(){
            var g = new Schema("Ravens");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new SelectorSet("Quarterbacks");
            var r2 = new SelectorSet("Linebackers");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            expect(g.uniqueSelectorSetName("Linebackers")).toBe(false);
        });
    });

    describe("uniqueRuleName", function(){
        var schema;
        beforeEach(function(){
            schema = new Schema("Bills");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new SelectorSet("Quarterbacks");
            var r2 = new SelectorSet("Linebackers");
            var sel1 = new Selector("Names", "");
            var rule = new Rule("Geno", "");
            schema.addPage(p1);
            schema.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            r1.addSelector(sel1)
            sel1.addRule(rule);
        });

        it("returns true if a Rule's name is unique across a schema", function(){
            expect(schema.uniqueRuleName("Doug")).toBe(true);
        });

        it("returns false if a Rule's name already exists in a schema", function(){
            expect(schema.uniqueRuleName("Geno")).toBe(false);
        });
    });
});

describe("Page", function(){
    describe("constructor", function(){
        it("returns new Page with index/next set as passed", function(){
            var p1 = new Page("Lakers", true, ".winning"),
                p2 = new Page("Clippers", false);
            expect(p1.index).toBe(true);
            expect(p1.next).toBe(".winning");
            expect(p2.index).toBe(false);
            expect(p2.next).toBeUndefined();
        });

        it("uses defaults for index/next if not provided", function(){
            var p1 = new Page("Supersonics");
            expect(p1.index).toBe(false);
            expect(p1.next).toBeUndefined();
        });

        it("creates a default SelectorSet", function(){
            var p1 = new Page("Knicks");
            expect(p1.sets["default"]).toBeDefined();
        });
    });

    describe("object", function(){
        it("returns a JSON object respresenting a Page", function(){
            var p = new Page("Suns", true, ".cssselector");
            var expected = {
                name: "Suns",
                index: true,
                sets: {
                    "default": {
                        name: "default",
                        selectors: {}
                    }
                },
                next: ".cssselector"
            };
            expect(JSON.stringify(p.object())).toEqual(JSON.stringify(expected));
        });

        it("doesn't include next if it is undefined", function(){
            var p = new Page("Warriors");
            var expected = {
                name: "Warriors",
                index: false,
                sets: {
                    "default": {
                        name: "default",
                        selectors: {}
                    }
                }
            };
            expect(JSON.stringify(p.object())).toEqual(JSON.stringify(expected));
        });

        it("works with SelectorSets/Selectors/Rules", function(){
            var p = new Page("Nuggets"),
                set = new SelectorSet("Players"),
                sel = new Selector(".game .points"),
                rule = new Rule("Points", "text");
            p.addSet(set);
            set.addSelector(sel);
            sel.addRule(rule);
            var expected = {
                name: "Nuggets",
                index: false,
                sets: {
                    "default": {
                        name: "default",
                        selectors: {}
                    },
                    "Players": {
                        name: "Players",
                        selectors: {
                            ".game .points": {
                                selector: ".game .points",
                                rules: {
                                    "Points": {
                                        name: "Points",
                                        capture: "text"
                                    }
                                }
                            }
                        }
                    }
                }
            };
            expect(JSON.stringify(p.object())).toEqual(JSON.stringify(expected));
        });
    });

    describe("uploadObject", function(){
        it("returns a JSON object that does not include sets with no rules", function(){
            var p = new Page("Rockets"),
                set1 = new SelectorSet("Seasons"),
                set2 = new SelectorSet("Players"),
                selector = new Selector(".score"),
                rule = new Rule("game", "text");
            var expected = {
                name: "Rockets",
                index: false,
                sets: {
                    "Seasons": {
                        name: "Seasons",
                        selectors: {
                            ".score": {
                                selector: ".score",
                                rules: {
                                    "game": {
                                        name: "game",
                                        capture: "text"
                                    }
                                }
                            }
                        },
                        pages: {}
                    }
                }
            };
            p.addSet(set1);
            p.addSet(set2);
            set1.addSelector(selector);
            selector.addRule(rule);
            var upJSON = JSON.stringify(p.uploadObject());
            var upExp = JSON.stringify(expected);
            expect(upJSON).toEqual(upExp);
        });
    });

    describe("html", function(){
        it("generates html to represent a page", function(){
            var p = new Page("Thunder"),
                ele = p.html();
            expect(ele.tagName).toEqual("LI");
            expect(p.htmlElements.sets.tagName).toEqual("UL");
            expect(p.htmlElements.nametag.textContent).toEqual("Thunder");
        });
    });

    describe("addSet", function(){
        it("adds a set to page.sets", function(){
            var p = new Page("Timberwolves"),
                s = new SelectorSet("Seasons");
            expect(p.sets["Seasons"]).toBeUndefined();
            p.addSet(s);
            expect(p.sets["Seasons"]).toBeDefined();
            expect(s.parentPage).toBeDefined();
        });
    });

    describe("removeSet", function(){
        it("removes a set from page.sets", function(){
            var p = new Page("Trailblazers"),
                s = new SelectorSet("Seasons");
            p.addSet(s);
            expect(p.sets["Seasons"]).toBeDefined();
            p.removeSet(s.name);
            expect(p.sets["Seasons"]).toBeUndefined();
        });
    });

    describe("removeNext", function(){
        it("sets page.next to undefined and page.index to false", function(){
            var p = new Page("Jazz", true, ".seasons");
            expect(p.index).toBe(true);
            expect(p.next).toBe(".seasons");
            p.removeNext();
            expect(p.index).toBe(false);
            expect(p.next).toBeUndefined();
        });
    });
});

describe("SelectorSet", function(){
    describe("constructor", function(){
        it("creates a new SelectorSet", function(){
            var s1 = new SelectorSet("Yankees");
            expect(s1.name).toEqual("Yankees");
            expect(s1.parent).toBeUndefined();
        });

        it("sets parent if provided", function(){
            var s1 = new SelectorSet("Red Sox", {"selector": ".players"});
            expect(s1.parent).toBeDefined();
        });
    });

    describe("object", function(){
        it("returns a JSON object representing the SelectorSet", function(){
            var s1 = new SelectorSet("Jays");
            var expected = {
                name: "Jays",
                selectors: {}
            };
            expect(JSON.stringify(s1.object())).toEqual(JSON.stringify(expected));
        });
    });

    describe("uploadObject", function(){
        it("returns undefined if there are no rules in SelectorSet", function(){
            var s1 = new SelectorSet("Rays")
            expect(s1.uploadObject()).toBeUndefined();
        });
    });

    describe("html", function(){
        it("generates html to represent a SelectorSet", function(){
            var s1 = new SelectorSet("Cardinals"),
                ele = s1.html();
            expect(ele.tagName).toEqual("LI");
            expect(s1.htmlElements.selectors.tagName).toEqual("UL");
            expect(s1.htmlElements.nametag.textContent).toEqual("Cardinals");
        });
    });

    describe("addSelector", function(){
        it("adds a selector to SelectorSet.selectors", function(){
            var set = new SelectorSet("Cubs"),
                sel = new Selector(".player");
            expect(set.selectors[".player"]).toBeUndefined();
            expect(sel.parentSet).toBeUndefined();
            set.addSelector(sel);
            expect(set.selectors[".player"]).toBeDefined();
            expect(sel.parentSet).toBeDefined();
        });
    });

    describe("removeSelector", function(){
        it("removes a selector from SelectorSet.selectors", function(){
            var set = new SelectorSet("Brewers"),
                sel = new Selector(".player");
            set.addSelector(sel);
            expect(set.selectors[".player"]).toBeDefined();
            set.removeSelector(".player");
            expect(set.selectors[".player"]).toBeUndefined();
        });
    });

    describe("remove", function(){
        it("removes all selectors", function(){
            var set = new SelectorSet("Candiens"),
                sel = new Selector(".player");
            set.addSelector(sel);
            expect(set.selectors[".player"]).toBeDefined();
            set.remove();
            expect(Object.keys(set.selectors).length).toEqual(0);
        });
    });
});

describe("Selector", function(){
    describe("constructor", function(){
        it("returns a new Selector object", function(){
            var sel = new Selector("a");
            expect(sel.selector).toEqual("a");
        });
    });

    describe("object", function(){
        it("returns an object representing the selector", function(){
            var sel = new Selector(".item"),
                rule = new Rule("test", "text");
            sel.addRule(rule);
            var expected = {
                selector: ".item",
                rules: {
                    "test": {
                        name: "test",
                        capture: "text"
                    }
                }
            };
            expect(JSON.stringify(sel.object())).toEqual(JSON.stringify(expected));
        });
    });

    describe("uploadObject", function(){
        it("returns an object representing the selector", function(){
            var sel = new Selector(".item"),
                rule = new Rule("test", "text");
            sel.addRule(rule);
            var expected = {
                selector: ".item",
                rules: {
                    "test": {
                        name: "test",
                        capture: "text"
                    }
                }
            };
            expect(JSON.stringify(sel.uploadObject())).toEqual(JSON.stringify(expected));
        });

        it("returns undefined if selector has no rules", function(){
            var sel = new Selector("#main");
            expect(sel.uploadObject()).toBeUndefined();
        });
    });

    describe("addRule", function(){
        it("adds a rule to selector's rules object", function(){
            var sel = new Selector(".item"),
                rule = new Rule("test", "text");
            expect(Object.keys(sel.rules).length).toEqual(0);
            sel.addRule(rule);
            expect(sel.rules[rule.name]).toEqual(rule);
        });

        it("creates a new page if schema/page are defined", function(){
            var g = new Schema("Pirates"),
                s = new Selector("a"),
                r = new Rule("two", "attr-href", true);
            g.pages["default"].sets["default"].addSelector(s);
            s.addRule(r);
            expect(g.pages["two"]).toBeDefined();
        });
    });

    describe("removeRule", function(){
        it("removes a rule from selector's rules object", function(){
            var sel = new Selector(".item"),
                rule = new Rule("test", "text");
            sel.addRule(rule);
            expect(Object.keys(sel.rules).length).toEqual(1);
            sel.removeRule("test");
            expect(Object.keys(sel.rules).length).toEqual(0);
        });
    });

    describe("updateSelector", function(){
        it("updates the selector", function(){
            var sel = new Selector(".foo");
            expect(sel.selector).toEqual(".foo");
            sel.updateSelector(".bar");
            expect(sel.selector).toEqual(".bar");
        });

        it("moves selector to new name in set.selectors", function(){
            var set = new SelectorSet("Baz"),
                sel = new Selector(".foo");
            set.addSelector(sel);
            expect(set.selectors[".foo"]).toBeDefined();
            sel.updateSelector(".bar");
            expect(set.selectors[".bar"]).toBeDefined();
            expect(set.selectors[".foo"]).toBeUndefined();
        });
    });

    describe("html", function(){
        it("generates an html element representing a selector", function(){
            var sel = new Selector(".foo"),
                fakeEvent = function(){},
                holder = sel.html(fakeEvent, fakeEvent, fakeEvent);
            expect(holder.tagName).toEqual("LI");
            expect(sel.htmlElements.nametag.textContent).toEqual(".foo");
        });
    });

    describe("remove", function(){
        it("removes selector from its parent set", function(){
            var set = new SelectorSet("test"),
                sel = new Selector(".item");
            set.addSelector(sel);
            expect(set.selectors[".item"]).toBeDefined();
            sel.remove();
            expect(set.selectors[".item"]).toBeUndefined();
        });
    });
});

describe("Rule", function(){
    describe("constructor", function(){
        it("returns a new Rule object", function(){
            var r1 = new Rule("name", "text");
            expect(r1.name).toEqual("name");
            expect(r1.capture).toEqual("text");
            expect(r1.follow).toBe(false);
        });

        it("includes Rule.follow if included", function(){
            var r1 = new Rule("seasons", "attr-href", true);
            expect(r1.follow).toBe(true);
        });
    });

    describe("object", function(){
        it("returns a JSON object representing a Rule", function(){
            var r1 = new Rule("seasons", "attr-href", true),
                r2 = new Rule("name", "text");
                r1Expected = {
                    name: "seasons",
                    capture: "attr-href",
                    follow: true
                },
                r2Expected = {
                    name: "name",
                    capture: "text"
                };
            expect(JSON.stringify(r1.object())).toEqual(JSON.stringify(r1Expected));
            expect(JSON.stringify(r2.object())).toEqual(JSON.stringify(r2Expected));
        })
    });

    describe("html", function(){
        it("generates a html element representing a Rule", function(){
            // blank function since we don't care about events in this test
            var fakeEvent = function(){},
                r1 = new Rule("seasons", "attr-href"),
                ele = r1.html(fakeEvent, fakeEvent, fakeEvent, fakeEvent);
            expect(ele.tagName).toEqual("LI");
            expect(r1.htmlElements.nametag.textContent).toEqual(r1.name);
        });
    });

    describe("update", function(){
        it("replaces Rule properties", function(){
            var r1 = new Rule("seasons", "attr-href", true),
                newRule = {
                    name: "seasons",
                    capture: "text"
                };
            r1.update(newRule);
            expect(r1.name).toEqual("seasons");
            expect(r1.capture).toEqual("text");
            expect(r1.follow).toBe(false);
        });

        it("moves places in selector if Rule.name is changed", function(){
            var sel = new Selector("h1"),
                rule = new Rule("name", "text");
                newRule = {
                    name: "nombre",
                    capture: "text"
                };
            sel.addRule(rule);
            rule.update(newRule);
            expect(rule.name).toEqual("nombre");
            expect(sel.rules["nombre"]).toBeDefined();
            expect(sel.rules["name"]).toBeUndefined();
        });
    });

    describe("remove", function(){
        it("removes all rules (and thus associated follow pages)", function(){
            var g = new Schema("One"),
                s = new Selector("a"),
                r = new Rule("two", "attr-href", true);
            g.pages["default"].sets["default"].addSelector(s);
            s.addRule(r);
            expect(g.pages["two"]).toBeDefined();
            r.remove();
            //g.pages["default"].sets["default"].removeRule("two");
            expect(g.pages["two"]).toBeUndefined();
        });
    });
});
