import glob
import os
import shutil
import time
import re
from urllib.parse import urlparse
from hashlib import md5
import logging

log = logging.getLogger(__name__)


def md5_hash(url):
    """
    Hash a url using md5.
    This is useful for long urls that would mess with Window's path limitations
    but removes the ability to manually identify a URL while browsing the files.
    """
    return md5(url.encode("utf-8")).hexdigest()


def clean_url_hash(url):
    """
    strip illegal filename characters out of urls to return a string that can
    be used as a filename
    """
    illegal_chars = re.compile(r'(\/|\\|:|\*|\?|"|\<|\>|\|)')
    return re.sub(illegal_chars, "", url)


def dir_domain(url):
    """
    replace the periods in a domain with an underscore so that it can be used
    as the name of a directory
    """
    return urlparse(url).netloc.replace(".", "_")


def should_expire(path, max_age):
    if max_age is None:
        return False
    oldest = time.time() - max_age
    modified = os.path.getmtime(path)
    return modified < oldest


class Cache(object):

    """
    Cache is a basic file system cache where the HTML for a given page is
    stored in a folder based on the domain name of the url. The name of the file
    is created by stripping any illegal characters from the page's url. Illegal
    characters are based off of characters which cannot be used in Windows filenames.

    File structure:
    <cache>
    |-- www_example_com
    |  +-- httpwww.example.compage1
    |  +-- httpwww.example.compage2
    |-- en_wikipedia_org
    |  +-- httpen.wikipedia.orgwikiFoobar

    :param folder: the location of the folder where cached files should
        be saved
    :param hasher: a function used to derive the filename from a url
    :param max_age: the maximum age of the file, in seconds, since last modification
    """

    def __init__(self, folder, hasher=clean_url_hash, max_age=None):
        self.folder = folder
        self.max_age = max_age
        self.hasher = hasher
        os.makedirs(self.folder, exist_ok=True)
        """
        iterates over the folders in the cache to create a lookup dict to
        quickly check whether a url is cached
        """
        self.sites = self._load_from_cache()

    def _load_from_cache(self):
        sites = {}
        for f in os.listdir(self.folder):
            dir_path = os.path.join(self.folder, f)
            if os.path.isdir(dir_path):
                path = os.path.join(dir_path, "*")
                site_urls = {}
                for fp in glob.glob(path):
                    if not os.path.isdir(fp):
                        removed = False
                        # if max_age is set, delete the file if it was last
                        # modified before max_age
                        if should_expire(fp, self.max_age):
                            log.info("<cache> removed {}".format(fp))
                            os.remove(fp)
                            removed = True
                        if not removed:
                            site_urls[fp] = True
                sites[f] = site_urls
        return sites

    def clear_domain(self, domain):
        """
        delete all the files from a given domain and remove them from the
        cache dict
        """
        formatted_domain = domain.replace(".", "_")
        if formatted_domain in self.sites:
            shutil.rmtree(os.path.join(self.folder, formatted_domain))
            del self.sites[formatted_domain]

    def get(self, url):
        """
        returns a string of the html for a url if it has been cached,
        otherwise None
        """
        domain = dir_domain(url)
        filename = self.hasher(url)
        if domain not in self.sites:
            return
        site_cache = self.sites[domain]
        full_name = os.path.join(self.folder, domain, filename)
        if full_name in site_cache:
            # test the file to see if it should be expired
            if should_expire(full_name, self.max_age):
                log.info("<cache> expired {}".format(url))
                os.remove(full_name)
                del site_cache[full_name]
                return
            log.info("<cache> {}".format(url))
            full_name = os.path.join(self.folder, domain, filename)
            with open(full_name, "r") as fp:
                return fp.read()
        return

    def save(self, url, text):
        """
        saves the text in the cache folder and adds the path to the
        lookup dict
        """
        domain = dir_domain(url)
        filename = self.hasher(url)

        domain_folder = os.path.join(self.folder, domain)
        output_name = os.path.join(domain_folder, filename)
        if domain not in self.sites:
            self.sites[domain] = {output_name: True}
            os.makedirs(domain_folder, exist_ok=True)
        else:
            self.sites[domain][output_name] = True
        # lxml outputs bytes
        with open(output_name, "wb") as fp:
            fp.write(text)
