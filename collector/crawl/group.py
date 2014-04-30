import requests
import json
from Queue import Queue
import time

from .rule import Rule

class Tuple(object):
    """
    A Tuple is roughly equivalent to a database tuple.
    """
    def __init__(self, index_rules, page_rules=None):
        self.index_rules = index_rules
        self.page_rules = page_rules

    def get(html):
        data = {}
        for rule in index_rules:
            data[rule.name] = rule.get(html)
        return data

class RuleGroup(object):
    """
    A RuleGroup is a set of rules that get data for a Tuple
    It is made up of a series of collector.crawl.Rule's that are used to get data that
    make up the Group

    Properties: 
    index_pages: array of urls of index pages, which are pages to initially get data from
    
    parent: selector to use on an index_page, within which rules for a particular group will be
        collected from

        eg. if parent=".product" and you have rules on an index page for selectors '.link' and 'img'
        the following html will group the matches based on their parent element div.product
        <div class="product">
            <a class="link" href="#prod1">Shirt</a>
            <img src="prod1.jpg" />
        </div>
        <div class="product">
            <a class="link" href="#prod2">Shirt</a>
            <img src="prod2.jpg" />
        </div>
        <div class="product">
            <a class="link" href="#prod2">Shirt</a>
            <img src="prod2.jpg" />
        </div>

    """
    def __init__(self, name, index_pages, rules):
        self.name = name
        self.index_pages = index_pages
        self.rules = rules
        self.index_rules = []
        self.page_rules = []

    def parse_rules(self):
        for rule in self.rules:
            if rule["index"]:
                self.index_rules.append(rule)
            else:
                self.page_rules.append(rule)

    def crawl(self):
        pass
