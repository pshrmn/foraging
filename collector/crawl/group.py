import requests
import json

from .rule import Rule

class Group(object):
    """
    A Group is roughly equivalent to a tuple in a relational database. It is made up of
    a series of collector.crawl.Rule's that are used to get data that make up the Group

    """
    def __init__(self, json_group):
        self.index_pages = json_group["indices"]
        self.site = json_group["site"]
        pass
