import time
import os
from Queue import Queue
from urlparse import urlparse
import logging

import requests
from lxml import html

import exceptions
from .rule import Rule

class Website(object):
    """
    a Site represents a unique website
    domain: website's domain (eg "www.example.com")
    index_rules: list of rule.Rules for IndexPages
    data_rules: list of rule.Rules for DataPages
    start_pages: list of urls to crawl as IndexPages
    sleep: seconds to sleep in between requests to the server
    """
    def __init__(self, domain, index_rules, data_rules, start_pages, sleep=5):
        self.domain = domain
        self.index_rules = index_rules
        self.data_rules = data_rules
        self.sleep = sleep

        self.index_pages = Queue()
        self.data_pages = []
        for page in start_pages:
            self.index_pages.put(page)

        # minimum sleep time of 5 seconds
        if not isinstance(self.sleep, int) or self.sleep < 5:
            self.sleep = 5

        # setup logging for a site
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        #probably not what I want
        self.folder = os.path.dirname(os.path.abspath(__name__))
        log_file = logging.FileHandler(os.path.join(self.folder, "log.txt"))
        log_file.setLevel(logging.INFO)

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        log_file.setFormatter(formatter)
        self.logger.addHandler(log_file)
        
    def crawl(self, max_index=1):
        self.crawl_index(max_index)
        self.crawl_data()

    def crawl_index(self, max=1):
        """
        iterate over index_pages
        """
        count = 0
        while not self.index_pages.empty() and count < max:
            index = IndexPage(self.index_pages.get(False), self.index_rules)
            try:
                data = index.get_and_apply()
                time.sleep(self.sleep)
                self.logger.info('got <%s> (index)' % index.url)
            except exceptions.GetException:
                time.sleep(self.sleep)
                self.logger.error('<%s> failed' % index.url)
                continue
            if "next" in data:
                for url in data["next"]:
                    self.index_pages.put(url)
            for link in data["links"]:
                self.data_pages.append(link)
            count += 1

    def crawl_data(self):
        """
        iterate over compiled list of index_pages
        """
        unique_data = list(set(self.data_pages))
        # just dumping the data to a dict for the time being
        self.compiled_data = {}
        for page in unique_data:
            data = DataPage(page, self.data_rules)
            self.compiled_data[page] = data.get_and_apply()
            tims.sleep(self.sleep)
            self.logger.info('got <%s> (data)' % data.url)

    def preview_index(self, url):
        """
        apply the index rules to a specific page
        """
        index = IndexPage(url, self.index_rules)
        try:
            data = index.get_and_apply()
        except exceptions.GetException:
            return None
        return data

    def preview_data(self, url):
        """
        apply the data rules to a specific page
        """
        data_page = DataPage(url, self.data_rules)
        try:
            data = data_page.get_and_apply()
        except exceptions.GetException:
            return None
        return data

    def __str__(self):
        return self.domain

class Page(object):
    """
    url is the absolute url of a webpage
    rules is a dict containing collector.rule.Rule objects
    """
    def __init__(self, url, rules, data=None):
        self.rules = rules
        self.url = url
        self.data = data or {}

    def get_and_apply(self):
        """
        convenience function to get the html for a page and then apply rules to the returned html
        returns the data dict
        """
        self.get()
        self.apply()
        return self.data

    def get(self):
        resp = requests.get(self.url)
        if resp.status_code != 200:
            raise exceptions.GetException(self.url)
        self.html = html.document_fromstring(resp.text)
        url = urlparse(self.url)
        base_url = "%s://%s" % (url.scheme, url.hostname)
        self.html.make_links_absolute(base_url)
        self.apply()

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
    A data page is a webpage that contains the desired data
    """
    def __init__(self, url, rules, data=None):
        super(DataPage, self).__init__(url, rules, data)
        self.data["url"] = url
