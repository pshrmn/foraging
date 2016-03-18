import time
import os
from urllib.parse import urlparse
import subprocess
import logging

import requests
from lxml import html
from lxml.html.clean import Cleaner


log = logging.getLogger(__name__)


def requests_backend(url, headers):
    """
    requests backend

    This can be directly passed to your Fetch class

    Uses requests to send a GET request to the url with any
    headers attached. If there is a connection error, if the
    response status code is not 200, or if the text of the
    response is blank, returns None
    """
    log.info("<requests> {}".format(url))
    try:
        resp = requests.get(url, headers=headers)
    except requests.exceptions.ConnectionError:
        log.warning("<requests> {} ConnectionError".format(url))
        return None
    if not resp.ok or resp.text == "":
        log.warning("<requests> {} bad response".format(url))
        return None
    return resp.text


def phantom_backend(phantom_path, js_path):
    """
    phantom backend

    A closure function to create a backend, this needs to be
    called with the correct paths, then the returned function
    is passed to your Fetch class.

    Uses PhantomJS to send a GET request to the url with the
    User-Agent header attached. If the result from the function
    is an empty string, returns None, otherwise returns the
    decoded result.
    """
    if not os.path.exists(phantom_path):
        err = "phantom_path ({}) does not exist"
        raise ValueError(err.format(phantom_path))
    if not os.path.exists(js_path):
        err = "js_path ({}) does not exist"
        raise ValueError(err.format(js_path))

    def get(url, headers):
        log.info("<phantomjs> {}".format(url))
        commands = [phantom_path, js_path, url, headers['User-Agent']]
        process = subprocess.Popen(commands, stdout=subprocess.PIPE)
        # any errors are ignored, for better or probably for worse
        out, _ = process.communicate()
        text = out.decode()
        # text will be empty string when phantom request is not successful
        if text == "":
            log.warning("<phantomjs> {} bad response".format(url))
            return None
        return text

    return get


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

    def __init__(self, backend, headers, sleep_time=5, cache=None):
        self.last = {}
        self.sleep_time = sleep_time

        self.cache = cache
        
        self.backend = backend
        self.headers = headers
        if self.headers is None or 'User-Agent' not in self.headers:
            raise ValueError(
                'Headers dict must include "User-Agent" key, received'.format(self.headers)
            )
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
