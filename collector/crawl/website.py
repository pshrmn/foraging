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
        self.order = Queue()
        self.data = []

    def make_sets(self, rules):
        self.sets = {}
        for key in rules:
            if key == "default":
                self.sets[key] = IndexSet(key, rules[key])
            else:
                self.sets[key] = Set(key, rules[key])

    def crawl(self):
        data = {}
        for url in self.index_urls:
            dom = get_html(url)
            if dom is None:
                continue

class Website(object):
    """
    A Website is a queue of RuleGroups for a domain
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
                index_pages = rule_dict.get("indices", [])
                rules = rule_dict.get("rules", {})
                name = rule_dict.get("name", None)
                self.queue.put(RuleGroup(name, index_pages, rules))

    def crawl(self):
        """
        crawl over every RuleGroup for a website
        """
        while self.queue.empty() is False:
            group = self.queue.get()
            group.crawl()
