import os
import glob
import json
from Queue import Queue

from .group import RuleGroup

class Website(object):
    """
    A Website is a queue of RuleGroups based on files in a folder

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
