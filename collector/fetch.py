import time
import glob
import os
from urllib.parse import urlparse
import re
import subprocess
import logging

import requests
from lxml import html
from lxml.html.clean import Cleaner

log = logging.getLogger(__name__)


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
        folders = [f for f in files
                   if os.path.isdir(os.path.join(self.folder, f))]
        cache = {}
        for f in folders:
            path = os.path.join(self.folder, f, "*")
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
            log.info("<cache> {}".format(url))
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
        with open(os.path.join(domain_folder, filename), "wb") as fp:
            fp.write(text)


class Fetch(object):

    """
    Fetch takes a url and returns an lxml html element for that web page. It
    will sleep in between requests to limit the frequency of hits on a server.

    sleep_time: time to wait between requests to the same server (default 5)
    cache: optional Cache to store html of loaded urls to prevent re-hitting
        the server
    headers: headers to send with the request. It is recommended to include
        a "User-Agent" header
    """

    def __init__(self, sleep_time=5, cache=None, headers=None):
        self.last = {}
        self.sleep_time = sleep_time
        self.cache = cache
        self.headers = headers
        self.dynamic = False
        self.cleaner = Cleaner(style=True, links=True, add_nofollow=True,
                               page_structure=False, safe_attrs_only=False)

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

    def make_dynamic(self, phantom_path, js_path):
        """
        Allows requests to be made through PhantomJS. Raises a ValueError if
        either path does not exist (does not actually check they will run
        correctly)
        """
        if not os.path.exists(phantom_path):
            err = "phantom_path ({}) does not exist"
            raise ValueError(err.format(phantom_path))
        if not os.path.exists(js_path):
            err = "js_path ({}) does not exist"
            raise ValueError(err.format(js_path))

        self.phantom_path = phantom_path
        self.js_path = js_path
        self.dynamic = True

    def set_wait(self, url):
        domain = urlparse(url).netloc
        self.last[domain] = time.time()

    def wait(self, url):
        """
        if the necessary time hasn't elapsed, sleep until it has
        """
        domain = urlparse(url).netloc
        last = self.last.get(domain)
        if last is None:
            return
        diff = time.time() - last
        if diff < self.sleep_time:
            time.sleep(self.sleep_time - diff)

    def _phantom_get(self, url):
        """
        use subprocess to make the request through PhantomJS.
        """
        commands = [self.phantom_path, self.js_path, url]
        if self.headers and "User-Agent" in self.headers:
            commands.append(self.headers["User-Agent"])
        process = subprocess.Popen(commands, stdout=subprocess.PIPE)
        out, err = process.communicate()
        return out

    def get(self, url, dynamic=False):
        """
        returns the html of the url as a string. Will check cache to see if it
        exists and returns that string if it does. Otherwise uses requests
        to send a get request and returns the contents of the response. If the
        get request fails, returns None.

        if dynamic=True and self.dynamic=True, the request will be made
            through PhantomJS
        """
        text = self.get_cached(url)
        save = False
        if text is None:
            save = True
            self.wait(url)
            text = ""
            # allow DynamicFetch to get static content
            if dynamic and self.dynamic:
                log.info("<phantomjs> {}".format(url))
                text = self._phantom_get(url).decode()
            else:
                log.info("<requests> {}".format(url))
                resp = requests.get(url, headers=self.headers)
                if not resp.ok:
                    return
                text = resp.text
            self.set_wait(url)
            # text will be empty string when get fails
            if text == "":
                return
        dom = html.document_fromstring(text)
        dom = self.cleaner.clean_html(dom)
        dom.make_links_absolute(url)
        # save after formatting
        if save:
            clean_html = html.tostring(dom, pretty_print=True,
                                       include_meta_content_type=True)
            self.save_cached(url, clean_html)
        return dom
