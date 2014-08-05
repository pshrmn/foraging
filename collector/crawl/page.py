import time
from Queue import Queue

import requests
from lxml import html
from lxml.cssselect import CSSSelector

from .ruleset import RuleSet, Parent

def get_html(url):
    """
    get request to url, if it succeeds, parses text and returns an lxml.html.HtmlElement
    also makes links absolute
    """
    resp = requests.get(url)
    if resp.ok:
        return
    dom = html.document_fromstring(resp.text)
    dom.make_links_absolute(url)
    print("got:\t%s" % url)
    # don't hit a server too often
    time.sleep(5)
    return dom

def make_rule_set(rule_set):
    RuleSet()

class IndexPage(object):
    """
    An IndexPage is a specific type Page where:
        - there is only one RuleSet
        - there is a parent selector
        - there is a list of urls to crawl
        - there is an optional next selector to generate more urls to crawl
    """
    def __init__(self, index_dict, fetch=get_html):
        #setup based on index_dict
        self.rule_set = index_dict.get("rule_set")
        self.parent = Parent(**index_dict.get("parent"))
        self.urls = Queue()
        for url in index_dict.get("urls"):
            self.urls.put(Queue)
        next = index_dict.get("next")
        self.next = CSSSelector(next) if next else None

        self.fetch = fetch

    def get(self):
        data = []
        while not self.urls.empty():
            url = self.urls.get()
            dom = self.fetch(url)
            self.add_next(dom)
            for ele in self.parent(dom):
                data.append(self.rule_set.get(ele))
        

    def add_next(self, dom):
        if self.next:
            next = self.next(dom)
            href = next.get("href")
            if href:
                self.urls.put(href)

class Page(object):
    """
    A Page is equivalent to 
    """
    def __init__(self, rule_sets, fetch=get_html):
        """
        sets is dict of RuleSet objects that exist in a page
        fetch is a function that takes a url and returns an lxml.html.HtmlElement
        """
        self.fetch = fetch
        self.rule_sets = rule_sets

    def get(self, url):
        dom = self.fetch(url)
        return [rule_set.get(dom) for rule_set in self.rule_sets]
