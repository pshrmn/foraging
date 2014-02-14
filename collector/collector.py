import json
import requests
import exceptions
from bs4 import BeautifulSoup

"""
class Rule(object):
    def __init__(self, rule_dict, helpers):
        self.name = rule_dict['name']
        self.selector = rule_dict['selector']
        self.capture = rule_dict['capture']
        self.helpers = helpers

    def parse(self, soup):
        pass

    def clean(self):
        """
        #iterate over all helper functions to get the desired value
        """
        for helper in self.helpers:
            self.value = helper(self.value)
"""

class Page(object):
    def __init__(self, url, rules):
        self.rules = rules
        self.url = url

    def get(self):
        resp = requests.get(self.url)
        if resp.status_code != 200:
            raise exceptions.FailedGetException(self.url)
        self.soup = BeautifulSoup(resp.text)

class IndexPage(Page):
    """
    An index page is a webpage that contains links to the pages with the desired data

    """
    def __init__(self, url, rules):
        super(IndexPage, self).__init__(url, rules)

class DataPage(Page):
    def __init__(self, url, rules):
        super(DataPage, self).__init__(url, rules)