import urlparse
import requests
from lxml import html

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
        data = {}
        for rule in self.rules:
            data[rule.name] = rule.get(dom)
        return data

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
    def __init__(self, name, rules):
        super(IndexSet, self).__init__(name, rules)

    def get(self, dom):
        data = {}
        for rule in self.rules:
            data[rule.name] = rule.get(dom)
        return data
