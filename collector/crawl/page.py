import time
from Queue import Queue

import requests
from lxml import html

from .rules import RuleSet

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

class Page(object):
    def __init__(self, name, sets):
        self.name = name
        self.sets = sets    

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        sets = {rule_set["name"]: RuleSet.from_json(rule_set) for rule_set in page_json["sets"].itervalues()}
        return cls(name, sets)

    def get(self, dom):
        """
        iterate over sets, returning a dict holding the captured values and a dict mapping
        page names to "follow" urls
        """
        data = {}
        for key, val in self.sets.iteritems():
            tup = val.get(dom)
            data[key] = tup
        return data

    def __str__(self):
        return "Page(%s, %s)" % (self.name, self.sets)
