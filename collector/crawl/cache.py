import os
import glob
import re
import time
import urlparse

from lxml import html
from lxml.cssselect import CSSSelector
import requests
from selenium import webdriver

cache_dir = os.path.abspath(__file__)
collector_dir = os.path.join(cache_dir, os.pardir, os.pardir)
PHANTOM_PATH = os.path.join(os.path.abspath(collector_dir), "phantomjs", "phantomjs.exe")

def clean_url_filename(url):
    illegal_chars = re.compile(r'(\/|\\|:|\*|\?|"|\<|\>|\|)')
    return re.sub(illegal_chars, "", url)

def canonical(dom):
    """
    gets the canonical url for a page
    not yet used, but will be useful to prevent duplicate elements
    """
    canon = CSSSelector("link[rel=canonical]")
    matches = canon(dom)
    if len(matches)==0:
        return
    return matches[0].get("href")

def make_folder(path):
    """
    given a path, create a folder from the path if one doesn't already exist
    returns True if folder was created, False is folder already existed
    """
    if not os.path.exists(path):
        os.makedirs(path)
        return True
    return False

def make_cache(folder):
    """
    given a folder, check if cache folder exists in it. if it doesn't, create it
    return path to folder
    creates a new cache from the provided folder + 'cache'
    """
    path = os.path.join(folder, 'cache')
    make_folder(path)
    return Cache(path)

class Cache(object):
    """
    given a cache folder for a website, when attempting to fetch a url, first check if a saved copy is
    stored in the cache folder and if there is, open that file, otherwise send a get request to the url
    """
    def __init__(self, folder):
        self.folder = folder
        self.sites = {}
        self._make_sites()
        
    def _make_sites(self):
        walk_generator = os.walk(self.folder)
        path, folders, files = walk_generator.next()
        for folder in folders:
            self.sites[folder] = Site(folder, self.folder)

    def fetch(self, url, dynamic=False):
        domain = urlparse.urlparse(url).netloc.replace(".", "_")
        if domain not in self.sites:
            self.sites[domain] = Site(domain, self.folder)
        site = self.sites.get(domain)
        return site.fetch(url, dynamic)

    def visited(self, url):
        """
        check whether a url has been visited
        """
        domain = urlparse.urlparse(url).netloc.replace(".", "_")
        if domain not in self.sites:
            return False
        site = self.sites.get(domain)
        return site.visited(url)

    def clear(self):
        """
        clear out all of the stored html files
        """
        for name, site in self.sites.iteritems():
            site.clear()
            os.rmdir(os.path.join(self.folder, name))

    def nuke(self):
        """
        remove the cache folder
        """
        self.clear()
        os.rmdir(self.folder)

class Site(object):
    def __init__(self, name, parent):
        self.name = name
        self.parent = parent
        self.folder = os.path.join(self.parent, self.name)
        make_folder(self.folder)
        self.filenames = {name: True for name in glob.glob(os.path.join(self.folder, "*"))}

        self.wait = False
        self.wait_until = 0

    def fetch(self, url, dynamic=False):
        clean_url = os.path.join(self.folder, clean_url_filename(url))
        new_file = False
        if clean_url in self.filenames:
            with open(os.path.join(self.folder, clean_url)) as fp:
                text = fp.read()
            new_file = True
            print("<cache>:\t%s" % url)
        else:
            """
            limit the number of hits on a server by setting a "wait_until" time of 5 seconds
            from the previous request. loop until time is hit, essentially a sleep, but letting
            the rest of the crawler work instead of freezing everything up
            """
            if self.wait:
                while time.time() < self.wait_until:
                    continue
                self.wait = False
            if dynamic:
                # don't create dynamic driver until it is needed
                if not self.dynamic_driver:
                    self.dynamic_driver = webdriver.PhantomJS(PHANTOM_PATH,
                        service_args=['--load-images=no'])
                self.dynamic_driver.get(url)
                html_element = self.dynamic_driver.find_element_by_tag_name("html")
                text = html_element.get_attribute("outerHTML")
            else:
                resp = requests.get(url)
                if not resp.ok:
                    return None, None
                text = resp.text
            # save html file
            self.filenames[clean_url] = True
            with open(os.path.join(self.folder, clean_url), 'w') as fp:
                fp.write(text.encode('utf-8'))
            # only sleep when actually hitting the server
            print("<web>:\t%s" % url)
            self.wait = True
            self.wait_until = time.time() + 5

        dom = html.document_fromstring(text)
        dom.make_links_absolute(url)
        canonical_url = canonical(dom) or url
        # also save html under canonical url name if canonical is different from provided url
        # currently having issues with this
        #if new_file and canonical_url != url:
        #    clean_canon_url = os.path.join(self.folder, clean_url_filename(canonical_url))
        #    with open(clean_canon_url, 'w') as fp:
        #        fp.write(text.encode('utf-8'))
        return dom, canonical_url

    def visited(self, url):
        clean_url = os.path.join(self.folder, clean_url_filename(url))
        return clean_url in self.filenames

    def clear(self):
        for f in self.filenames.iterkeys():
            os.remove(f)
