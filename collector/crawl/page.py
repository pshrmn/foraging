import os
from lxml.cssselect import CSSSelector

from .rule import Rule
from .cache import make_cache

page_cache = make_cache(os.getcwd())

class Page(object):
    def __init__(self, name, sets, index=False, next=None):
        self.name = name
        self.sets = sets
        self.next = next
        self.index = index
        # only set next on "default" page
        if self.name == "default" and next:
            self.next = CSSSelector(next)

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        sets = {rule_set["name"]: RuleSet.from_json(rule_set) for rule_set in page_json["sets"].itervalues()}
        index = page_json.get("index", False)
        next = page_json.get("next")
        return cls(name, sets, index, next) 

    def get(self, url):
        """
        iterate over sets, returning a dict holding the captured values and a dict mapping
        page names to "follow" urls
        """
        dom, canonical_url = page_cache.fetch(url)
        #start by adding url to page's data
        # use the canonical url
        data = {
            "url": canonical_url
        }
        for key, rule_set in self.sets.iteritems():
            data[key] = rule_set.get(dom) 
        return data

    def next_page(self, url):
        """
        given a dom and Page.next not being None, apply the next selector to the dom
        and return the href attribute for the match
        """
        # url should always be cached
        dom, canon = page_cache.fetch(url)
        if not self.next:
            return None
        matches = self.next(dom)
        if len(matches) == 0:
            return None
        new_url = matches[0].get("href")
        # if another index page has already been visited, don't crawl it again
        if page_cache.visited(new_url):
            return None
        return new_url


    def __str__(self):
        return "Page(%s, %s)" % (self.name, self.sets)

class RuleSet(object):
    """
    A RuleSet consists of a group of (related?) rules in a page
    rules is a dict containing rules for the set
    parent (optional) is a dict with a selector and an optional low/high range
    """
    def __init__(self, name, rules, pages=None, parent=None):
        self.name = name
        self.rules = rules
        self.pages = pages
        self.parent = parent

    @classmethod
    def from_json(cls, rule_set_json):
        name = rule_set_json["name"]
        rules = {rule["name"]: Rule.from_json(rule) for rule in rule_set_json["rules"].itervalues()}
        json_pages = rule_set_json.get("pages")
        if json_pages:
            pages = {page["name"]: Page.from_json(page) for page in rule_set_json["pages"].itervalues()}
        else:
            pages = None
        parent = None
        if rule_set_json.get("parent"):
            parent = Parent.from_json(rule_set_json["parent"])
        return cls(name, rules, pages=pages, parent=parent)

    def get(self, dom):
        """
        returns an object where the key is a rule's name and the value is
        if self.parent, return a list
        otherwise, return a dict
        """
        if self.parent:
            return map(self.apply, self.parent.get(dom))
        else:    
            return self.apply(dom)

    def apply(self, dom):
        """
        iterate over rules given a dom, returning dict of {rule name:value} pairs and a dict of
        {page name: url} pairs to crawl subsequent pages
        """
        data = {}
        # iterate over self.rules to get values
        for rule in self.rules.itervalues():
            rule_data = rule.get(dom)
            # if any of the rules return None, have the whole thing fail
            if rule_data:
                data[rule.name] = rule_data
            else:
                return None
        for page in self.pages.itervalues():
            page_url = data[page.name]
            page_data = page.get(page_url)
            # overwrite url with page
            data[page.name] = page_data
        return data

    def __str__(self):
        return "RuleSet(%s, %s)" % (self.rules, self.parent)

class Parent(object):
    """
    selector is the selector break up the dom into multiple elements
    low is the number of elements to skip from the beginning
    high is the number of elements to skip from the end
    """
    def __init__(self, selector, low=None, high=None):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.low = low
        self.high = high

    @classmethod
    def from_json(cls, parent_json):
        selector = parent_json["selector"]
        low = parent_json.get("low")
        high = parent_json.get("high")
        return cls(selector, low, high)

    def get(self, dom):
        eles = self.xpath(dom)
        return eles[self.low:self.high]

    def __str__(self):
        return "Parent(%s, %s)" % (self.selector, self.low, self.high)