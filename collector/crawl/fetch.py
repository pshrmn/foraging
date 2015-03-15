import requests
from lxml import html
import time
import glob
import os
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse
import re


def clean_url_filename(url):
    illegal_chars = re.compile(r'(\/|\\|:|\*|\?|"|\<|\>|\|)')
    return re.sub(illegal_chars, "", url)


def url_info(url):
    domain = urlparse(url).netloc.replace(".", "_")
    filename = clean_url_filename(url)
    return domain, filename


class Fetch(object):
    def __init__(self, sleep_time=5, cache_folder=None):
        self.last = None
        self.sleep_time = sleep_time
        self.cache_folder = cache_folder
        self.cache = None
        self.set_cache(cache_folder)

    def _get_cached_files(self):
        if not self.cache_folder:
            return
        folders = [f for f in os.listdir(self.cache_folder) if
                   os.path.isdir(os.path.join(self.cache_folder, f))]

        cache = {}
        for f in folders:
            path = os.path.join(self.cache_folder, f, "*.html")
            cache[f] = {name: True for name in glob.glob(path)}
        return cache

    def set_cache(self, folder):
        self.cache_folder = folder
        self.cache = self._get_cached_files()

    def get_cached(self, url):
        if not self.cache:
            return
        domain, filename = url_info(url)
        if self.is_cached(domain, filename):
            print("<cache> {}".format(url))
            long_filename = os.path.join(self.cache_folder, domain, filename)
            with open(long_filename, "r") as fp:
                return fp.read()
        return

    def is_cached(self, domain, filename):
        if domain not in self.cache:
            return False
        site_cache = self.cache[domain]
        long_filename = os.path.join(self.cache_folder, domain, filename)
        return long_filename in site_cache

    def save_cached(self, url, text):
        if not self.cache:
            return
        domain, filename = url_info(url)
        domain_folder = os.path.join(self.cache_folder, domain)
        if domain not in self.cache:
            self.cache[domain] = {filename: True}
            # make the folder
            os.makedirs(domain_folder)
        with open(os.path.join(domain_folder, filename), "w") as fp:
            fp.write(text)

    def get(self, url):
        """

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
