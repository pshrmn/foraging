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

    def __str__(self):
        return "Group(%s, %s, %s)" % (self.name, self.pages, self.urls)
