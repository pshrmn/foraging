import os
import glob
import json
from Queue import Queue

from .set import *

class RuleGroup(object):
    """
    A RuleGroup is made up of sets of rules that get data that corresponds to a rdb tuple
    The "default" page is the first one crawled
    """
    def __init__(self, name, index_urls, rules):
        self.name = name
        self.index_urls = index_urls
        self.make_sets(rules)
        self.data = []

    def make_sets(self, rules):
        # create (Index)Set's
        self.sets = {}
        for key, val in rules.iteritems():
            if key == "default":
                self.sets[key] = IndexSet(key, val)
            else:
                self.sets[key] = Set(key, val)

        # determine the order to crawl the sets
        self.set_order = ["default"]
        new_sets = self.follow_sets(rules["default"])
        while new_sets:
            name = new_sets.pop()
            name_set = rules.get(name)
            # make sure set exists in rules and only add it once to self.sets
            if name_set is not None and name not in self.set_order:
                self.set_order.append(name)
                new_sets.extend(self.follow_sets(name_set))

    def follow_sets(self, rules):
        """
        iterate over rules in a set and return a list of names of rules with "follow" attribute
        """
        return [name for name in rules if rules[name].get("follow")]

    def crawl(self):
        data = {}
        for url in self.index_urls:
            dom = get_html(url)
            if dom is None:
                continue

class Website(object):
    """
    A Website is a queue of RuleGroups for a domain, only running one at a time to limit hits
    to the server
    """

    def __init__(self, folder):
        self.folder = folder
        self.queue = Queue()

    def populate(self):
        """
        iterate over *.json files in self.folder and add RuleGroups to self.queue
        """
        for filename in glob.glob(os.path.join(self.folder, "*.json")):
            with open(filename) as fp:
                rule_dict = json.load(fp)
                index_urls = rule_dict.get("index_urls", [])
                rules = rule_dict.get("rules", {})
                name = rule_dict.get("name", None)
                self.queue.put(RuleGroup(name, index_urls, rules))

    def crawl(self):
        """
        crawl over every RuleGroup for a website
        """
        while self.queue.empty() is False:
            group = self.queue.get()
            group.crawl()
