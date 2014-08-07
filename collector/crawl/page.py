import time
from Queue import Queue

from .rules import RuleSet

class Page(object):
    def __init__(self, name, sets):
        self.name = name
        self.sets = sets    

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

    def __str__(self):
        return "Page(%s, %s)" % (self.name, self.sets)
