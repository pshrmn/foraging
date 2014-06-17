import time
from Queue import Queue

import requests
from lxml import html
from lxml.cssselect import CSSSelector

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
    dom.make_links_absolute(url)
    print("got:\t%s" % url)
    # don't hit a server too often
    time.sleep(5)
    return dom

class RuleGroup(object):
    """
    A RuleGroup is made up of sets of rules that get data that corresponds to a rdb tuple
    rule sets are stored in a
    """
    def __init__(self, name, index_urls, nodes, next=None):
        self.name = name
        self.urls = Queue()
        for url in index_urls:
            self.urls.put(url)
        #self.index_urls = index_urls
        if next:
            self.next = Rule("next", next, "attr-href")
        self.nodes = nodes
        self.data = []
        self.tree = make_set(self.nodes["default"])

    def crawl(self):
        data = []
        while not self.urls.empty():
            url = self.urls.get()
            dom = get_html(url)
            if dom is not None:
                # if there is a "next" selector, push that url to the urls queue
                if self.next:
                    next = self.next.get(dom)
                    if next is not None:
                        self.urls.put(next)
                new_data = self.tree.get(dom)
                if new_data is not None:
                    data.extend(new_data)
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

    def get(self, dom):
        """
        given an lxml parsed dom, apply rules for the set, then call child sets given data
        """
        data = {name: self.rules[name].get(dom) for name in self.rules}
        for val in data.itervalues():
            # allow empty strings, but if any rule isn't matched, return None
            # TBD: set None values to empty string?
            if val is None:
                return None
        for child in self.children:
            url = data.get(child.name)
            if url:
                child_dom = get_html(url)
                if child_dom:
                    child_data = child.get(child_dom)
                    if child_data:
                        # for nested parentsets, pluralize name of the set and add returned array
                        if isinstance(child, ParentSet):
                            data[child.name + "s"] = child_data
                        else:
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

    def get(self, dom):
        """
        returns an array of data for each dom element selected by the parent selector
        """
        elements = self.xpath(dom)
        data = []
        for ele in elements:
            new_data = self.get_from_dom(ele)
            if new_data is not None:
                data.append(new_data)
        return data
