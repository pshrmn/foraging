import time
from Queue import Queue

import requests
from lxml import html
from lxml.cssselect import CSSSelector

from .page import Page

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

def canonical(dom):
    """
    gets the canonical url for a page
    not yet used, but will be useful to prevent duplicate elements
    """
    canon = CSSSelector("link[rel=canonical]")
    matches = canon.get(dom)
    if len(matches)==0:
        return
    return matches[0].get("href")

class Group(object):
    def __init__(self, name, pages, urls=None):
        self.name = name
        self.pages = pages
        self.urls = urls if urls else []

    @classmethod
    def from_json(cls, group_json):
        name = group_json["name"]
        pages = {page["name"]: Page.from_json(page) for page in group_json["pages"].itervalues()}
        urls = group_json.get("urls")
        return cls(name, pages, urls)

    def crawl_urls(self):
        crawled_data = []
        for url in self.urls:
            data = self.get(url)
            if isinstance(data, list):
                crawled_data.extend(data)
            else:
                crawled_data.append(data)
        return crawled_data

    def get_page(self, url, page_name):
        data = {}
        dom = get_html(url)
        page_data = self.pages[page_name].get(dom)

        for set_name, rule_set in page_data.iteritems():
            if isinstance(rule_set, list):
                """
                if rule_set returned a list, iterate over each (rule_data, follow_dict) tuple,
                adding pages if necessary, then return only the rule_data
                """
                new_list = []
                for item, follow in rule_set:
                    if not item:
                        continue
                    for name, href in follow.iteritems():
                        new_page_data = self.get_page(href, name)
                        item.update({name+"_page": new_page_data})
                    new_list.append(item)
                data[set_name] = new_list
            else:
                """
                otherwise, rule_set is a tuple containing (rule_data, follow_dict)
                """
                item, follow = rule_set
                if not item:
                    continue
                for name, href in follow.iteritems():
                    new_page_data = self.get_page(href, name)
                    item.update({name+"_page": new_page_data})
                data[set_name] = item
        return data

    def get(self, url):
        """
        takes a url
        """
        data = self.get_page(url, "default")
        # don't need wrapper, just the data
        return data["default"]

    def next_page(self):
        pass

    def __str__(self):
        return "Group(%s, %s, %s)" % (self.name, self.pages, self.urls)
