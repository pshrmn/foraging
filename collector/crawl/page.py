from .rules import RuleSet

from lxml.cssselect import CSSSelector

class Page(object):
    def __init__(self, name, sets, index=False, next=None):
        self.name = name
        self.sets = sets
        self.next = None
        self.index = index
        # only set next on "default" page
        if self.name == "default" and next:
            self.next = CSSSelector(next)

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        sets = {rule_set["name"]: RuleSet.from_json(rule_set) for rule_set in page_json["sets"].itervalues()}
        return cls(name, sets)

    def get(self, dom):
        """
        iterate over sets, returning a dict holding the captured values and a dict mapping
        page names to "follow" urls
        """
        data = {}
        for key, val in self.sets.iteritems():
            tup = val.get(dom)
            data[key] = tup
        return data

    def next_page(self, dom):
        """
        given a dom and Page.next not being None, apply the next selector to the dom
        and return the href attribute for the match
        """
        if not self.next:
            return None
        matches = self.next(dom)
        if len(matches) == 0:
            return None
        return matches[0].get("href")


    def __str__(self):
        return "Page(%s, %s)" % (self.name, self.sets)
