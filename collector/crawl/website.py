import os
import glob
import json
from Queue import Queue

from .schema import Schema

class Website(object):
    """
    A Website is a queue of Schemas for a domain, only running one at a time to limit hits
    to the server
    """

    def __init__(self, folder):
        self.folder = folder
        self.queue = Queue()

    def populate(self):
        """
        iterate over *.json files in self.folder and add Schemas to self.queue
        """
        for filename in glob.glob(os.path.join(self.folder, "*.json")):
            with open(filename) as fp:
                rule_dict = json.load(fp)
                self.queue.put(Schema.from_json(rule_dict))
                
    def crawl(self):
        """
        crawl over every Schema for a website
        """
        while self.queue.empty() is False:
            schema = self.queue.get()
            schema.crawl_urls()
