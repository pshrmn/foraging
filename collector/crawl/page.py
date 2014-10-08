import os
from lxml.cssselect import CSSSelector

from .rule import Selector
from .cache import make_cache

page_cache = make_cache(os.getcwd())

class Page(object):
    """
    A Page is analogous to a webpage on a website. Given a url, the Page fetches the DOM for that
    url and the Page uses its SelectorSets to collect data
    
    :param string name: name of the page
    :param list sets: the selector sets associated with the page
    :param string next: is a selector for another index page (optional)
    :param boolean dynamic: whether or not data necessary to collect is dynamically loaded (so need to
        use selenium/phantomjs)
    """
    def __init__(self, name, sets, next=None, dynamic=False):
        self.name = name
        self.sets = sets
        self.next = next
        # if dynamic, will make a request to a url using selenium/phantomjs
        # otherwise just use requests for nice and simple stuff
        self.dynamic = dynamic
        # only set next on "default" page
        if self.name == "default" and next:
            self.next = CSSSelector(next)

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        sel_sets = page_json["sets"]
        sets = {key: SelectorSet.from_json(ss) for key, ss in sel_sets.items()}
        next = page_json.get("next")
        dynamic = page_json.get("dynamic", False)
        return cls(name, sets, next, dynamic)

    def get(self, url):
        """
        iterate over sets, returning a dict holding the captured values and a dict mapping
        page names to "follow" urls
        """
        dom, canonical_url = page_cache.fetch(url, self.dynamic)
        #start by adding url to page's data
        # use the canonical url
        data = {
            "url": canonical_url
        }
        for key, selector_set in self.sets.items():
            set_data = selector_set.get(dom)
            if set_data is not None:
                data[key] = set_data
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

class SelectorSet(object):
    """
    A SelectorSet consists of a group of (related?) selector/rule pairs in a page

    :param string name: name of the selector set
    :param list selectors: selectors that correspond to the selector set
    :param list pages: pages whose data cannot be crawled until a rule (with follow=True) in one of
        the selectors has been captured
    :param Parent parent: (optional) parent selector and range (high/low) to limit matches for the
        selectors
    """
    def __init__(self, name, selectors, pages=None, parent=None):
        self.name = name
        self.selectors = selectors
        self.pages = pages
        self.parent = parent

    @classmethod
    def from_json(cls, selector_set_json):
        name = selector_set_json["name"]
        selector_dict = selector_set_json["selectors"]
        selectors = {key: Selector.from_json(sel) for key, sel in selector_dict.items()}

        json_pages = selector_set_json.get("pages")
        pages = None
        if json_pages:
            pages = {key: Page.from_json(page) for key, page in json_pages.items()}

        parent_json = selector_set_json.get("parent")
        parent = None
        if parent_json:
            parent = Parent.from_json(parent_json)

        return cls(name, selectors, pages=pages, parent=parent)

    def get(self, dom):
        """
        returns an object where the key is a rule's name and the value is
        if self.parent, return a list
        otherwise, return a dict
        """
        if self.parent:
            parent_data = map(self.apply, self.parent.get(dom))
            return [d for d in parent_data if d is not None]
        else:    
            return self.apply(dom)

    def apply(self, dom):
        """
        given a dom, iterate over selector returning dict of {rule name:value} pairs and a dict of
        {page name: url} pairs to crawl subsequent pages
        """
        data = {}
        # iterate over self.selector to get values
        for selector in self.selectors.values():
            rule_data = selector.get(dom)
            # if any of the rules return None, have the whole thing fail
            if rule_data:
                for name, value in rule_data.items():
                    data[name] = value
            else:
                return None
        if self.pages:
            for page in self.pages.values():
                page_url = data[page.name]
                page_data = page.get(page_url)
                # overwrite url with page
                data[page.name] = page_data
        return data

    def __str__(self):
        return "SelectorSet(%s, %s, pages=%s, parent=%s)" % (self.name, self.selectors,
            self.pages, self.parent)

class Parent(object):
    """
    A Parent is used to limit selectors to a subset of the page. A Parent is especially useful
    if there are multiple sets of selectors/rules in a page that should be captured. For example,
    given a table where you want to capture data from multiple columns for each row, a Parent
    selector that selects the rows could then be used to capture the column data across the row
    and return a list of the captured data for each row in the table.

    Given the following html::

        <table>
            <th>
                <td>Name</td>
                <td>Age</td>
            </th>
            <tr>
                <td class="name">Bill</td>
                <td class="age">32</td>
            </tr>
            <tr>
                <td class="name">Dave</td>
                <td class="age">51</td>
            </tr>
            <tr>
                <td class="name">Sue</td>
                <td class="age">28</td>
            </tr>
        </table>

    A Parent selector of "tr" would allow you to use the selectors ".name" and ".age" to collect
    the name and age for each row individually, giving you the data::

        [
            {"name": "Bill", "age": 32},
            {"name": "Dave", "age": 51},
            {"name": "Sue", "age": 28}
        ]

    :param string selector: the selector to break up the dom into multiple elements
    :param int low: is the number of elements to skip from the beginning
    :param int high: is the number of elements to skip from the end
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