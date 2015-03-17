import time
import glob
import os
from urllib.parse import urlparse
import re
import subprocess

import requests
from lxml import html


def clean_url_filename(url):
    """
    strip illegal filename characters out of urls
    """
    illegal_chars = re.compile(r'(\/|\\|:|\*|\?|"|\<|\>|\|)')
    return re.sub(illegal_chars, "", url)


def url_info(url):
    domain = urlparse(url).netloc.replace(".", "_")
    filename = clean_url_filename(url)
    return domain, filename


def is_dir(path):
    return os.path.isdir(path)


class Cache(object):
    def __init__(self, folder):
        self.folder = folder
        self.sites = {}
        self._load_files()

    def _load_files(self):
        """
        iterates over the folders in the cache to create a
        lookup dict to check whether a url is cached
        """
        os.makedirs(self.folder, exist_ok=True)

        files = os.listdir(self.folder)
        folders = [f for f in files if is_dir(os.path.join(self.folder, f))]
        cache = {}
        for f in folders:
            path = os.path.join(self.folder, f, "*.html")
            cache[f] = {name: True for name in glob.glob(path)}
        self.sites = cache

    def exists(self, domain, filename):
        """
        returns True if the filename exists in the cache, otherwise False
        """
        if domain not in self.sites:
            return False
        site_cache = self.sites[domain]
        long_filename = os.path.join(self.folder, domain, filename)
        return long_filename in site_cache

    def get(self, url):
        """
        returns a string of the html for a url if it has been cached,
        otherwise None
        """
        domain, filename = url_info(url)
        if self.exists(domain, filename):
            print("<cache> {}".format(url))
            long_filename = os.path.join(self.folder, domain, filename)
            with open(long_filename, "r") as fp:
                return fp.read()
        return

    def set(self, folder):
        """
        updates the cache's folder and recreates the sites lookup dict
        """
        self.folder = folder
        self._load_files()

    def save(self, url, text):
        """
        saves the text in the cache folder and adds the path to the
        lookup dict
        """
        domain, filename = url_info(url)
        domain_folder = os.path.join(self.folder, domain)
        if domain not in self.sites:
            self.sites[domain] = {filename: True}
            os.makedirs(domain_folder, exist_ok=True)
        with open(os.path.join(domain_folder, filename), "w") as fp:
            fp.write(text)


class Fetch(object):
    """
    Fetch takes a url and returns an lxml html element for that web page. It
    will sleep in between requests to limit the frequency of hits on a server.
    The default sleep time is 5 seconds, but can be manually set. An optional
    cache can be provided. The cache will be used to save the html of pages so
    that subsequent requests for a url do not have to be made to the website.
    """
    def __init__(self, sleep_time=5, cache=None):
        self.last = None
        self.sleep_time = sleep_time
        self.cache = cache

    def set_cache(self, folder):
        self.cache = Cache(folder)

    def get_cached(self, url):
        if not self.cache:
            return
        return self.cache.get(url)

    def save_cached(self, url, text):
        if not self.cache:
            return
        self.cache.save(url, text)

    def get(self, url):
        """
        returns the html of the url as a string. Will check cache to see if it
        exists and returns that string if it does. Otherwise uses requests
        to send a get request and returns the contents of the response. If the
        get request fails, returns None.
        """
        # if there is a cache, check if url is cached
        text = self.get_cached(url)
        if not text:
            print("<web> {}".format(url))
            self.wait()
            resp = requests.get(url)
            self.last = time.time()
            if not resp.ok:
                return
            text = resp.text
            self.save_cached(url, text)
        dom = html.document_fromstring(text)
        dom.make_links_absolute(url)
        return dom

    def wait(self):
        """
        if the necessary time hasn't elapsed, sleep until it has
        """
        if not self.last:
            return
        now = time.time()
        diff = now - self.last
        if diff < self.sleep_time:
            time.sleep(self.sleep_time - diff)


class DynamicFetch(Fetch):
    """
    DynamicFetch uses PhantomJS to get web pages. This is useful for pages
    where some of the data to be collected is loaded via javascript.

    NOTE: This class requires PhantomJS and a PhantomJS script that logs
    the html of a web page as a string. Without those, DynamicFetch will
    fail to function properly
    """
    def __init__(self, phantom_path, js_path, sleep_time=5, cache=None):
        self.phantom_path = phantom_path
        if not os.path.exists(self.phantom_path):
            err = "phantom_path ({})does not exit"
            raise ValueError(err.format(self.phantom_path))
        self.js_path = js_path
        if not os.path.exists(self.js_path):
            err = "js_path ({})does not exit"
            raise ValueError(err.format(self.js_path))
        super(DynamicFetch, self).__init__(sleep_time, cache)

    def _phantom_get(self, url):
        process = subprocess.Popen([self.phantom_path, self.js_path, url],
                                   stdout=subprocess.PIPE)
        out, err = process.communicate()
        return out

    def get(self, url):
        text = self.get_cached(url)
        if not text:
            print("<web> {}".format(url))
            self.wait()
            text = self._phantom_get(url)
            self.last = time.time()
            # text will be empty binary string when get fails
            if text == b"":
                return
            self.save_cached(url, text)
        dom = html.document_fromstring(text)
        dom.make_links_absolute(url)
        return dom
