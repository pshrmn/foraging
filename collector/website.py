import json
import time
import os
from Queue import Queue

import requests
from lxml import etree

import exceptions, rule

def crawl_delay(delay=5):
    if delay < 5:
        delay = 5
    def wrapped_fn(fn):
        def wrapper(*args, **kwargs):
            try:
                ret = fn(*args, **kwargs)
                time.sleep(delay)
            except Exception:
                time.sleep(delay)
                raise
            return ret
        return wrapper
    return wrapped_fn

class Site(object):
    """
    a Site represents a unique website
    the name of the folder is the domain
    the folder needs to contain:
        pages.txt file, which is a list of "index pages" to crawl, separated by newlines
        links.json, which contains the rules for an IndexPage
        data.json, which contains rules for a DataPage
    """
    def __init__(self, folder):
        self.folder = folder

        folder_split = folder.rsplit(os.sep, 2)
        # index -2 if there is a trailing slash
        self.domain = folder_split[-1] if folder_split[-1] != '' else folder_split[-2]
        self.domain = self.domain.replace('_', '.')

        with open("%s/pages.txt" % folder) as fp:
            index_list = fp.read().split('\n')
        self.index_pages = Queue()
        for page in index_list:
            self.index_pages.put(page)

        with open("%s/links.json" % folder) as fp:
            index_rules = json.load(fp)
        with open("%s/data.json" % folder) as fp:
            data_rules = json.load(fp)
        
        self.data_pages = []
        self.index_rules = {key: rule.Rule(val) for key, val in index_rules.iteritems()}
        self.data_rules = {key: rule.Rule(val) for key, val in data_rules.iteritems()}

    def fix_relative(self, url):
        if url.startswith("/"):
            url = url[1:]
        return "https://%s/%s" % (self.domain, url)

    def crawl_index(self, max=None):
        """
        iterate over index_pages
        """
        count = 0
        done = False
        self.failed_pages = []
        while not self.index_pages.empty() and not done:
            index = IndexPage(self.index_pages.get(False), self.index_rules)
            try:
                data = index.get_and_apply()
            except exceptions.GetException:
                self.failed_pages.append(index.url)
                continue
            if "next" in data:
                for url in data["next"]:
                    # handle relative urls
                    if not url.startswith("http"):
                        url = self.fix_relative(url)
                    self.index_pages.put(url)
            for link in data["links"]:
                self.data_pages.append(link)
            if max is not None:
                count += 1
                if count >= max:
                    done = True

    def crawl_data(self):
        self.data_queue = Queue()
        unique_data = set(self.data_pages)
        for page in unique_data:
            self.data_queue.put(page)

    def __str__(self):
        return self.domain

class Page(object):
    """
    url is the absolute url of a webpage
    rules is a dict containing collector.rule.Rule objects
    """
    def __init__(self, url, rules):
        self.rules = rules
        self.url = url
        self.data = {}

    def get_and_apply(self):
        """
        convenience function to get the html for a page and then apply rules to the returned html
        returns the data dict
        """
        self.get()
        self.apply()
        return self.data

    @crawl_delay
    def get(self):
        resp = requests.get(self.url)
        if resp.status_code != 200:
            raise exceptions.GetException(self.url)
        self.html = etree.HTML(resp.text)

    def apply(self):
        for key, val in self.rules.iteritems():
            self.data[key] = val.get(self.html)

class IndexPage(Page):
    """
    An index page is a webpage that contains links to the pages with the desired data
    The rules for an index page should be:
        {
            name: links,
            selector: ... a,
            capture: attr-href
        }
    where the anchor elements are links to data pages
    and optionally
        {
            name: next,
            selector: ... a,
            capture: attr-href
        }
    where the "next" rule points to a successive index page to get data pages from
    """
    def __init__(self, url, rules):
        if 'links' not in rules:
            raise exceptions.RulesException('no "links" rule in rules')
        super(IndexPage, self).__init__(url, rules)

class DataPage(Page):
    """

    """
    def __init__(self, url, rules):
        super(DataPage, self).__init__(url, rules)