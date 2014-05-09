from urlparse import urlparse
import requests
from lxml import html
from lxml.cssselect import CSSSelector
import time

from .rule import Rule

def get_html(url):
    """
    get request to url, if it succeeds, parses text and returns an lxml.html.HtmlElement
    also makes links absolute
    """
    resp = requests.get(url)
    if resp.status_code != 200:
        return
    dom = html.document_fromstring(resp.text)
    parsed_url = urlparse(url)
    base_url = "%s://%s" % (parsed_url.scheme, parsed_url.hostname)
    dom.make_links_absolute(base_url)
    print("got:\t%s" % url)
    time.sleep(5)
    return dom

class RuleGroup(object):
    """
    A RuleGroup is made up of sets of rules that get data that corresponds to a rdb tuple
    rule sets are stored in a
    """
    def __init__(self, name, index_urls, nodes):
        self.name = name
        self.index_urls = index_urls
        self.nodes = nodes
        self.data = []
        self.tree = make_set(self.nodes["default"])

    def crawl(self):
        data = []
        for url in self.index_urls:
            data.extend(self.tree.get(url))
        return data

def make_set(node):
    if node.get("parent"):
        new_set = ParentSet(**node)
    else:
        new_set = Set(**node)
    return new_set

class Set(object):
    """
    a set of rules to be applied to html that make up part of a Group
    """
    def __init__(self, name, rules, children=None):
        self.name = name
        self.rules = {key: Rule(**rules[key]) for key in rules}
        if not children:
            self.children = []
        else:
            self.children = [make_set(child) for child in children.itervalues()]

    def get(self, url):
        dom = get_html(url)
        if dom is None:
            return
        return self.get_from_dom(dom)

    def get_from_dom(self, dom):
        """
        given an lxml parsed dom, apply rules for the set, then call child sets given data
        """
        data = {name: self.rules[name].get(dom) for name in self.rules}
        for val in data.itervalues():
            if not val:
                return None
        for child in self.children:
            url = data.get(child.name)
            if url:
                child_data = child.get(url)
                if child_data:
                    data.update(child_data)
        return data

class ParentSet(Set):
    """
    a set of rules to be applied to html, but instead of an entire page (like Set), runs over
    a section of a page, as determined by a parent selector
    eg.) if the parent selector is ".group", get will be passed
        <div class="group">
            <h3 class="title">Example</h3>
        </div>
        instead of the entire page
    """
    def __init__(self, name, parent, rules, children=None):
        self.parent = parent
        self.xpath = CSSSelector(self.parent)
        super(ParentSet, self).__init__(name, rules, children)

    def get(self, url):
        """
        returns an array of data for each dom element selected by the parent selector
        """
        dom = get_html(url)
        if dom is None:
            return
        elements = self.xpath(dom)
        data = []
        for ele in elements:
            new_data = self.get_from_dom(ele)
            if new_data:
                data.append(new_data)
        return data
