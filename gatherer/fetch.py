import time
import os
from urllib.parse import urlparse
import subprocess
import logging

import requests
from lxml import html
from lxml.html.clean import Cleaner


log = logging.getLogger(__name__)


class Fetch(object):

    """
    Fetch takes a url and returns an lxml html element for that web page. It
    will sleep in between requests to limit the frequency of hits on a server.

    :param sleep_time: how long to wait between requests to a domain
    :param cache: a cache to attempt to load a url from a saved file before
        making a network request
    :param headers: a dict of headers to send with network requests
    """

    def __init__(self, sleep_time=5, cache=None, headers=None):
        self.last = {}
        self.sleep_time = sleep_time
        self.cache = cache
        self.headers = headers
        self.cleaner = Cleaner(style=True, links=True, add_nofollow=True,
                               page_structure=False, safe_attrs_only=False)

    def get_cached(self, url):
        """
        if there is a cache, check if there is a cached copy of the url's content
        """
        if not self.cache:
            return None
        return self.cache.get(url)

    def wait(self, domain):
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
        if not no_cache:
            cached_text = self.get_cached(url)
            if cached_text is not None:
                return self.parse(cached_text, url)

        domain = urlparse(url).netloc
        log.info("<requests> {}".format(url))
        self.wait(domain)
        try:
            resp = requests.get(url, headers=self.headers)
        except requests.exceptions.ConnectionError:
            log.warning("<requests> {} ConnectionError".format(url))
            return None
        self.last[domain] = time.time()
        if not resp.ok or resp.text == "":
            log.warning("<requests> {} bad response".format(url))
            return None
        dom = self.parse(resp.text, url)
        # cache after formatting
        if not no_cache and self.cache is not None:
            self.save(dom, url)
        return dom

    def save(self, dom, url):
        # a verification should have already been done, but check again for safety
        if not self.cache:
            return
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


class PhantomFetch(Fetch):

    """PhantomFetch allows requests to be made through PhantomJS. This is done
    using the PhantomJS executable and a JavaScript file that loads the url
    using PhantomJS and logs the HTML content of the page. These requests take
    longer than using Requests because PhantomJS will load and execute any
    scripts in the page. While this is overkill when all of the desired data
    is in the static HTML, it is a must when data is loaded dynamically.

    Raises a ValueError if either path does not exist (does not actually check
    whether or not they will run correctly)

    :param phantom_path: the location of the phantomjs executable
    :param js_path: the location of the javascript logging file
    :param sleep_time: how long to wait between requests to a domain
    :param cache: a cache to attempt to load a url from a saved file before
        making a network request
    :param headers: a dict of headers to send with network requests
    """

    def __init__(self, phantom_path, js_path, *args, **kwargs):
        if not os.path.exists(phantom_path):
            err = "phantom_path ({}) does not exist"
            raise ValueError(err.format(phantom_path))
        if not os.path.exists(js_path):
            err = "js_path ({}) does not exist"
            raise ValueError(err.format(js_path))
        self.phantom_path = phantom_path
        self.js_path = js_path
        super().__init__(*args, **kwargs)

    def get(self, url, no_cache=False):
        if not no_cache:
            cached_text = self.get_cached(url)
            if cached_text is not None:
                return self.parse(cached_text, url)

        domain = urlparse(url).netloc
        log.info("<phantomjs> {}".format(url))
        self.wait(domain)
        text = self._phantom_get(url).decode()
        self.last[domain] = time.time()
        # text will be empty string when phantom request is not successful
        if text == "":
            log.warning("<phantomjs> {} bad response".format(url))
            return None
        dom = self.parse(text, url)
        # save after formatting
        if not no_cache and self.cache is not None:
            self.save(dom, url)
        return dom

    def _phantom_get(self, url):
        """
        use subprocess to make the request through PhantomJS.
        """
        commands = [self.phantom_path, self.js_path, url]
        if self.headers and "User-Agent" in self.headers:
            commands.append(self.headers["User-Agent"])
        process = subprocess.Popen(commands, stdout=subprocess.PIPE)
        # err is ignored FBOFW
        out, err = process.communicate()
        return out
