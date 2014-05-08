from urlparse import urlparse
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
    parsed_url = urlparse(url)
    base_url = "%s://%s" % (parsed_url.scheme, parsed_url.hostname)
    dom.make_links_absolute(base_url)
    return dom

class RuleGroup(object):
    """
    A RuleGroup is made up of sets of rules that get data that corresponds to a rdb tuple
    """
    def __init__(self, name, index_urls, sets):
        self.name = name
        self.index_urls = index_urls
        self.make_sets(sets)
        self.data = []

    def make_sets(self, sets):
        #index_set is made up of rules in the "default" set
        index = sets["default"]
        self.index_set = IndexSet("default", index["rules"], index.get("parent"))

        # determine the order to crawl the non-index sets
        new_sets = self.follow_sets(index["rules"])
        order = []
        while new_sets:
            name = new_sets.pop()
            rule_set = sets.get(name)
            # make sure set exists in rules and only add it once to self.sets
            if rule_set is None or name in order or name == "default":
                continue
            set_rules = rule_set.get("rules")
            if set_rules is not None:
                order.append(name)
                new_sets.extend(self.follow_sets(set_rules))
        self.ordered_sets = [Set(name, sets[name]["rules"]) for name in order]

    def follow_sets(self, rules):
        """
        iterate over rules in a set and return a list of names of rules with "follow" attribute
        """
        return [name for name in rules if rules[name].get("follow")]

    def crawl(self):
        eles = []
        for url in self.index_urls:
            dom = get_html(url)
            if dom is None:
                continue
            """
            if there is a parent element, select on that to create multiple eles to spawn Tuples
            from, otherwise, just add the whole dom from the url
            """
            if self.index_set.parent:
                eles.extend(self.index_set.xpath(dom))
            else:
                eles.extend(dom)
        tuples = [Tuple(dom, self.index_set, self.ordered_sets) for dom in eles]
        return [t.get() for t in tuples]

class Tuple(object):
    """
    a Tuple roughly corresponds to the data for a single row in a database
    it is passed an initial piece of html (dom) to get data for the index_set
    if there are other sets in other_sets, crawl over those in order and append their data
    """
    def __init__(self, dom, index_set, other_sets=None):
        self.index_set = index_set
        self.other_sets = other_sets
        self.dom = dom
        self.data = {}

    def get(self):
        self.data = self.index_set.get(self.dom)
        for curr_set in self.other_sets:
            name = curr_set.name
            set_url = self.data.get(name)
            # if data[name] doesn't exist, skip, but really should fail at this point
            if set_url is None:
                continue
            self.data.extend(curr_set.get(set_url))
        return self.data

class Set(object):
    """
    a set of rules to be applied to html that make up part of a Group
    """
    def __init__(self, name, rules):
        self.name = name
        self.rules = {key: Rule(**rules[key]) for key in rules}

    def get(self, url):
        dom = get_html(url)
        if dom is None:
            return
        return {name: self.rules[name].get(dom) for name in self.rules}

class IndexSet(Set):
    """
    a set of rules to be applied to html, but instead of an entire page (like Set), runs over
    a section of a page, as determined by a parent selector
    eg.) if the parent selector is ".group", get will be passed
        <div class="group">
            <h3 class="title">Example</h3>
        </div>
        instead of the entire page
    """
    def __init__(self, name, rules, parent=None):
        self.parent = parent
        if self.parent:
            self.xpath = CSSSelector(self.parent)
        super(IndexSet, self).__init__(name, rules)

    def get(self, dom):
        return {name: self.rules[name].get(dom) for name in self.rules}
