import requests
from lxml import html
import time
import glob
import os
import errno
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


def is_dir(path):
    return os.path.isdir(path)


class Cache(object):
    def __init__(self, folder):
        self.folder = folder
        self.sites = {}
        self._load_files()

    def _load_files(self):
        try:
            os.makedirs(self.folder)
        except OSError as exception:
            if exception.errno != errno.EEXIST:
                raise

        files = os.listdir(self.folder)
        folders = [f for f in files if is_dir(os.path.join(self.folder, f))]
        cache = {}
        for f in folders:
            path = os.path.join(self.folder, f, "*.html")
            cache[f] = {name: True for name in glob.glob(path)}
        self.sites = cache

    def exists(self, domain, filename):
        if domain not in self.sites:
            return False
        site_cache = self.sites[domain]
        long_filename = os.path.join(self.folder, domain, filename)
        return long_filename in site_cache

    def get(self, url):
        domain, filename = url_info(url)
        if self.exists(domain, filename):
            print("<cache> {}".format(url))
            long_filename = os.path.join(self.folder, domain, filename)
            with open(long_filename, "r") as fp:
                return fp.read()
        return

    def set(self, folder):
        self.folder = folder
        self._load_files()

    def save(self, url, text):
        domain, filename = url_info(url)
        domain_folder = os.path.join(self.folder, domain)
        if domain not in self.sites:
            self.sites[domain] = {filename: True}
            # make the folder
            os.makedirs(domain_folder)
        with open(os.path.join(domain_folder, filename), "w") as fp:
            fp.write(text)


class Fetch(object):
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
