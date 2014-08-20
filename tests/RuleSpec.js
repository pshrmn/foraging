describe("Group", function(){
    describe("constructor", function(){
        it("sets name and urls", function(){
            var urls = {"http://www.example.com/packers": true,
                "http://www.example.com/football": true};
            var g = new Group("Packers", urls);
            expect(g.name).toEqual("Packers");
            expect(JSON.stringify(g.urls)).toEqual(JSON.stringify(urls));
        });

        it("sets urls to an empty object when not provided", function(){
            var g = new Group("Vikings");
            expect(JSON.stringify(g.urls)).toEqual("{}");
        });
    });

    describe("object", function(){
        it("returns a JSON object representing the group", function(){
            var urls = {"http://www.example.com/lions": true,
                "http://www.example.com/football": true};
            var groupJSON = {
                name: "Lions",
                urls: urls,
                pages: {}
            }
            var g = new Group("Lions", urls);
            expect(JSON.stringify(g.object())).toEqual(JSON.stringify(groupJSON));
        });
    });

    describe("uploadObject", function(){
        it("returns a JSON object formatted for upload", function(){
            var g = new Group("Bears"),
                p = new Page("Super Bowl Championships", undefined, undefined, g);
            var expected = {
                name: "Bears",
                urls: [],
                pages: {}
            }
            expect(JSON.stringify(g.uploadObject())).toEqual(JSON.stringify(expected));
        })
    });

    describe("html", function(){
        it("builds and returns html elements representing the group", function(){
            var g = new Group("Colts");
            var ele = g.html();
            expect(ele.tagName).toEqual("DIV");
            expect(g.elements.nametag.textContent).toEqual("Group: Colts");
        });
    });

    describe("addPage", function(){
        it("adds a page to group.pages", function(){
            var g = new Group("Titans"),
                p = new Page("locations");
            expect(g.pages["locations"]).toBeUndefined();
            expect(p.group).toBeUndefined();
            g.addPage(p);
            expect(g.pages["locations"]).toBeDefined();
            expect(p.group).toBeDefined();
        });

        it("generates html if group html has been generated", function(){
            var g = new Group("Jaguars"),
                p = new Page("wins");
            g.html();
            g.addPage(p);
            expect(g.elements.holder).toBeDefined();
            expect(p.elements.holder).toBeDefined();
        })
    });

    describe("removePage", function(){
        it("removes page from group.pages", function(){
            var g = new Group("Texans"),
                p = new Page("quarterbacks");
            g.addPage(p);
            expect(g.pages["quarterbacks"]).toBeDefined();
            g.removePage(p.name);
            expect(g.pages["quarterbacks"]).toBeUndefined();
        });
    });

    describe("uniquePageName", function(){
        it("returns true if name does not already exist", function(){
            var g = new Group("Browns");
            expect(g.uniquePageName("playoff wins")).toBe(true);
        });

        it("returns false if name already exists", function(){
            var g = new Group("Bengals");
            var p = new Group("arrested players");
            g.addPage(p);
            expect(g.uniquePageName("arrested players")).toBe(false);
        });
    });

    describe("uniqueRuleSetName", function(){
        it("returns true if a RuleSet with the name does not exist", function(){
            var g = new Group("Steelers");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new RuleSet("Quarterbacks");
            var r2 = new RuleSet("Linebackers");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            expect(g.uniqueRuleSetName("Punters")).toBe(true);
        });

        it("returns false if a RuleSet with the name already exists", function(){
            var g = new Group("Ravens");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new RuleSet("Quarterbacks");
            var r2 = new RuleSet("Linebackers");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            expect(g.uniqueRuleSetName("Linebackers")).toBe(false);
        });
    });

    describe("uniqueRuleName", function(){
        it("returns true if a Rule's name is unique across a group", function(){
            var g = new Group("Bills");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new RuleSet("Quarterbacks");
            var r2 = new RuleSet("Linebackers");
            var rule = new Rule("Geno", "", "");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            r1.addRule(rule);
            expect(g.uniqueRuleName("Doug")).toBe(true);
        });

        it("returns false if a Rule's name already exists in a group", function(){
            var g = new Group("Jets");
            var p1 = new Page("Offense");
            var p2 = new Page("Defense");
            var r1 = new RuleSet("Quarterbacks");
            var r2 = new RuleSet("Linebackers");
            var rule = new Rule("Geno", "", "");
            g.addPage(p1);
            g.addPage(p2);
            p1.addSet(r1);
            p2.addSet(r2);
            r1.addRule(rule);
            expect(g.uniqueRuleName("Geno")).toBe(false);
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
        })
    });

    describe("object", function(){
        it("returns a JSON object respresenting a Page", function(){
            var p = new Page("Suns", true, ".cssselector");
            var expected = {
                name: "Suns",
                index: true,
                sets: {},
                next: ".cssselector"
            };
            expect(JSON.stringify(p.object())).toEqual(JSON.stringify(expected));
        });

        it("doesn't include next if it is undefined", function(){
            var p = new Page("Warriors");
            var expected = {
                name: "Warriors",
                index: false,
                sets: {}
            };
            expect(JSON.stringify(p.object())).toEqual(JSON.stringify(expected));
        });
    });

    describe("uploadObject", function(){
        it("returns a JSON object that does not include sets with no rules", function(){
            var p = new Page("Rockets"),
                s1 = new RuleSet("Seasons"),
                s2 = new RuleSet("Players"),
                r1 = new Rule("game", ".score", "text");
            var expected = {
                name: "Rockets",
                index: false,
                sets: {
                    "Seasons": {
                        name: "Seasons",
                        rules: {
                            "game": {
                                name: "game",
                                selector: ".score",
                                capture: "text"
                            }
                        }
                    }
                }
            };
            p.addSet(s1);
            p.addSet(s2);
            s1.addRule(r1);
            expect(JSON.stringify(p.uploadObject())).toEqual(JSON.stringify(expected));
        });
    });

    describe("html", function(){
        it("generates html to represent a page", function(){
            var p = new Page("Thunder"),
                ele = p.html();
            expect(ele.tagName).toEqual("DIV");
            expect(p.elements.nametag.textContent).toEqual("Page: Thunder");
        });
    });

    describe("addSet", function(){
        it("adds a set to page.sets", function(){
            var p = new Page("Timberwolves"),
                s = new RuleSet("Seasons");
            expect(p.sets["Seasons"]).toBeUndefined();
            p.addSet(s);
            expect(p.sets["Seasons"]).toBeDefined();
            expect(s.page).toBeDefined();
        });
    });

    describe("removeSet", function(){
        it("removes a set from page.sets", function(){
            var p = new Page("Trailblazers"),
                s = new RuleSet("Seasons");
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

describe("RuleSet", function(){
    describe("constructor", function(){
        it("creates a new RuleSet", function(){
            var s1 = new RuleSet("Yankees");
            expect(s1.name).toEqual("Yankees");
            expect(s1.parent).toBeUndefined();
        });

        it("sets parent if provided", function(){
            var s1 = new RuleSet("Red Sox", {"selector": ".players"});
            expect(s1.parent).toBeDefined();
        });
    });

    describe("object", function(){
        it("returns a JSON object representing the RuleSet", function(){
            var s1 = new RuleSet("Jays");
            var expected = {
                name: "Jays",
                rules: {}
            };
            expect(JSON.stringify(s1.object())).toEqual(JSON.stringify(expected));
        });
    });

    describe("uploadObject", function(){
        it("returns undefined if there are no rules in RuleSet", function(){
            var s1 = new RuleSet("Rays")
            expect(s1.uploadObject()).toBeUndefined();
        });
    });

    describe("html", function(){
        it("generates html to represent a RuleSet", function(){
            var s1 = new RuleSet("Cardinals"),
                ele = s1.html();
            expect(ele.tagName).toEqual("DIV");
            expect(s1.elements.nametag.textContent).toEqual("Rule Set: Cardinals");
        });
    });

    describe("addRule", function(){
        it("adds a rule to RuleSet.rules", function(){
            var s1 = new RuleSet("Cubs"),
                r1 = new Rule("Players", ".player", "text");
            expect(s1.rules["Players"]).toBeUndefined();
            expect(r1.ruleSet).toBeUndefined();
            s1.addRule(r1);
            expect(s1.rules["Players"]).toBeDefined();
            expect(r1.ruleSet).toBeDefined();
        })
    });

    describe("removeRule", function(){
        it("removes a rule from RuleSet.rules", function(){
            var s1 = new RuleSet("Brewers"),
                r1 = new Rule("Players", ".player", "text");
            s1.addRule(r1);
            expect(s1.rules["Players"]).toBeDefined();
            s1.removeRule(r1.name);
            expect(s1.rules["Players"]).toBeUndefined();
        });
    });
});

describe("Rule", function(){
    describe("constructor", function(){
        it("returns a new Rule object", function(){
            var r1 = new Rule("name", "h1", "text");
            expect(r1.name).toEqual("name");
            expect(r1.selector).toEqual("h1");
            expect(r1.capture).toEqual("text");
            expect(r1.follow).toBe(false);
        });

        it("includes Rule.follow if included", function(){
            var r1 = new Rule("seasons", "a.season", "attr-href", true);
            expect(r1.follow).toBe(true);
        });
    });

    describe("object", function(){
        it("returns a JSON object representing a Rule", function(){
            var r1 = new Rule("seasons", "a.season", "attr-href", true),
                r2 = new Rule("name", "h1", "text");
                r1Expected = {
                    name: "seasons",
                    selector: "a.season",
                    capture: "attr-href",
                    follow: true
                },
                r2Expected = {
                    name: "name",
                    selector: "h1",
                    capture: "text"
                };
            expect(JSON.stringify(r1.object())).toEqual(JSON.stringify(r1Expected));
            expect(JSON.stringify(r2.object())).toEqual(JSON.stringify(r2Expected));
        })
    });

    describe("html", function(){
        it("generates a html element representing a Rule", function(){
            var sE = usE = eE = pE = dE = function(){};
            var r1 = new Rule("seasons", "a.season", "attr-href", true),
                ele = r1.html(sE, usE, eE, pE, dE);
            expect(ele.tagName).toEqual("LI");
            expect(r1.elements.nametag.textContent).toEqual(r1.name);
        });
    });

    describe("update", function(){
        it("replaces Rule properties", function(){
            var r1 = new Rule("seasons", "a.season", "attr-href", true),
                newRule = {
                    name: "seasons",
                    selector: "a.season",
                    capture: "text"
                };
            r1.update(newRule);
            expect(r1.name).toEqual("seasons");
            expect(r1.selector).toEqual("a.season");
            expect(r1.capture).toEqual("text");
            expect(r1.follow).toBe(false);
        });

        it("moves places in ruleSet if Rule.name is changed", function(){
            var s1 = new RuleSet("test"),
                r1 = new Rule("name", "h1", "text");
                newRule = {
                    name: "nombre",
                    selector: "h1",
                    capture: "text"
                };
            s1.addRule(r1);
            r1.update(newRule);
            expect(r1.name).toEqual("nombre");
            expect(s1.rules["nombre"]).toBeDefined();
            expect(s1.rules["name"]).toBeUndefined();
        });
    });
});
