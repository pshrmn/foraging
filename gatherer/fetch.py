import time
from urllib.parse import urlparse

from lxml import html
from lxml.html.clean import Cleaner

from gatherer.backends.requests import requests_backend


class Fetch(object):

    """
    Fetch takes a url and returns an lxml html element for the web page at
    the given url. It will sleep in between requests to the same domain
    in order to limit the frequency of hits to a server.

    :param backend: a function that takes a url and headers and returns the
        text of the response if successful, otherwise None
    :param headers: a dict of headers to send with network requests. Requires a
        User-Agent key to be provideded.
    :param sleep_time: how long to wait between requests to a domain
    :param cache: a cache to attempt to load a url from a saved file before
        making a network request
    """

    def __init__(self, backend=requests_backend, headers=None, sleep_time=5, cache=None):
        self.last = {}
        self.sleep_time = sleep_time

        self.cache = cache

        self.backend = backend
        self.headers = headers
        if not isinstance(self.headers, dict) or 'User-Agent' not in self.headers:
            raise ValueError(
                'Headers dict must include "User-Agent" key, received'.format(self.headers)
            )
        # the cleaner is used to remove dom markup gatherer doesn't care about
        self.cleaner = Cleaner(style=True, links=True, add_nofollow=True,
                               page_structure=False, safe_attrs_only=False)

    def _get_cached(self, url):
        """
        if there is a cache, check if there is a cached copy of the url's content
        """
        if not self.cache:
            return None
        return self.cache.get(url)

    def _wait(self, domain):
        """
        if the necessary time hasn't elapsed, sleep until it has
        """
        last = self.last.get(domain)
        if last is not None:
            diff = time.time() - last
            if diff < self.sleep_time:
                time.sleep(self.sleep_time - diff)

    def get(self, url, no_cache=False):
        """
        returns the html of the url as a string. Will check cache to see if it
        exists and returns that string if it does. Otherwise uses requests
        to send a get request and returns the contents of the response. If the
        get request fails, returns None.
        """

        # only attempt to load from cache when no_cache is False
        if not no_cache:
            cached_text = self._get_cached(url)
            if cached_text is not None:
                return self.parse(cached_text, url)

        domain = urlparse(url).netloc
        self._wait(domain)
        text = self.backend(url, self.headers)
        self.last[domain] = time.time()
        if text is None:
            return None
        dom = self.parse(text, url)
        # cache after formatting
        if not no_cache and self.cache is not None:
            self._save(dom, url)
        return dom

    def _save(self, dom, url):
        # slow, only clean when saving
        clean_dom = self.cleaner.clean_html(dom)
        clean_html = html.tostring(clean_dom, pretty_print=True,
                                   include_meta_content_type=True)
        self.cache.save(url, clean_html)

    @staticmethod
    def parse(text, url):
        dom = html.document_fromstring(text)
        dom.make_links_absolute(url)
        return dom
