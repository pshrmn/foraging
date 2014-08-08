import os
import glob
import re
import time

from lxml import html
from lxml.cssselect import CSSSelector

import requests

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

def make_cache(folder):
    """
    given a folder, check if cache folder exists in it. if it doesn't, create it
    return path to folder
    """
    path = os.path.join(folder, 'cache')
    if not os.path.exists(path):
        os.makedirs(path)
    return path

class Cache(object):
    """
    given a cache folder for a website, when attempting to fetch a url, first check if a saved copy is
    stored in the cache folder and if there is, open that file, otherwise send a get request to the url
    """
    def __init__(self, folder):
        self.folder = folder
        self.filenames = {name: True for name in glob.glob(os.path.join(self.folder, "*"))}
        self.wait = False
        self.wait_until = 0

    def fetch(self, url):
        clean_url = clean_url_filename(url)
        if clean_url in self.filenames:
            with open(os.path.join(self.folder, clean_url)) as fp:
                text = fp.read()
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
        return dom, url

    def clear(self):
        """
        clear out all of the stored html files
        """
        for f in self.filenames.iterkeys():
            os.remove(f)

    def nuke(self):
        """
        remove the cache folder
        """
        self.clear()
        os.rmdir(self.folder)
