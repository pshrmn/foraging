import requests
from lxml import html
import time


class Fetch(object):
    def __init__(self, sleep_time=5):
        self.last = None
        self.sleep_time = sleep_time
        pass

    def get(self, url):
        """

        """
        self.wait()
        resp = requests.get(url)
        self.last = time.time()
        if not resp.ok:
            return
        dom = html.document_fromstring(resp.text)
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
