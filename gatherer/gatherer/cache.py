import glob
import os
import shutil
import time
import re
from urllib.parse import urlparse
from hashlib import md5
import gzip
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
    """
    check a file's last modified time to determine whether it is older than
    the max age
    """
    if max_age is None:
        return False
    oldest = time.time() - max_age
    modified = os.path.getmtime(path)
    return modified < oldest


def dangerously_convert_cache_to_gzip(folder):
    """
    WARNING: This will gzip all of the files in a folder and remove the
    originals. This is only meant to convert a cache folder created using Cache
    to one that can be used by GzipCache.
    """
    for f in os.listdir(folder):
        dir_path = os.path.join(folder, f)
        if os.path.isdir(dir_path):
            path = os.path.join(dir_path, "*")
            for fp in glob.glob(path):
                # don't try to convert folders or already gzipped files
                # (using a gzip test that isn't necessarily accurate)
                if not os.path.isdir(fp) and not fp.endswith(".gz"):
                    with open(fp, "rb") as rp, gzip.open("{}.gz".format(fp), "wb") as wp:
                        shutil.copyfileobj(rp, wp)
                    os.remove(fp)


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
            """
            f is the domain of a website with periods replaced by underscores
            """
            dir_path = os.path.join(self.folder, f)
            if os.path.isdir(dir_path):
                sites[f] = self._dir_pages(dir_path)
        return sites

    def _read(self, filename):
        with open(filename, "r") as fp:
            return fp.read()

    def _write(self, filename, text):
        # lxml outputs bytes
        with open(filename, "wb") as fp:
            fp.write(text)

    def _dir_pages(self, directory):
        """
        Returns a site_urls dict where the keys are urls (which have been formatted
        to remove invalid filename characters) and the keys are the boolean True.

        Iterate over all of the files in a directory. For each file, if it is
        older than max_age, remove it from the directory. Otherwise, add it to
        the site_urls dict.
        """
        path = os.path.join(directory, "*")
        site_urls = {}
        for fp in glob.glob(path):
            if not os.path.isdir(fp):
                # if max_age is set, delete the file if it was last
                # modified before max_age
                if should_expire(fp, self.max_age):
                    log.info("<cache> removed {}".format(fp))
                    os.remove(fp)
                    continue
                site_urls[fp] = True
        return site_urls

    def has(self, url):
        """
        Verify whether there is a cached file for a given url. If a cached
        version of the file exists, but it is older than max age, it will
        be removed and has will report that it does not exist.

        Returns a tuple where the first value is a boolean of whether or not
        the cached version exists and the second is the path to the cached
        version, or None if the cached version doesn't exist.
        """
        domain = dir_domain(url)
        filename = self.hasher(url)
        if domain not in self.sites:
            return False, None
        site_cache = self.sites[domain]
        full_name = os.path.join(self.folder, domain, filename)
        
        if should_expire(full_name, self.max_age):
            log.info("<cache> expired {}".format(url))
            os.remove(full_name)
            del site_cache[full_name]
            return False, None
        if full_name in site_cache:
            return True, full_name
        else:
            return False, None

    def get(self, url):
        """
        returns a string of the html for a url if it has been cached,
        otherwise None
        """
        exists, full_name = self.has(url)
        if exists:
            log.info("<cache> {}".format(url))
            return self._read(full_name)
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
            self.sites[domain] = {}
            os.makedirs(domain_folder, exist_ok=True)

        self.sites[domain][output_name] = True
        self._write(output_name, text)

    def clear_domain(self, domain):
        """
        delete all the files from a given domain and remove them from the
        cache dict
        """
        formatted_domain = domain.replace(".", "_")
        if formatted_domain in self.sites:
            shutil.rmtree(os.path.join(self.folder, formatted_domain))
            del self.sites[formatted_domain]

class GzipCache(Cache):
    """
    The GzipCache 
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def _read(self, filename):
        with gzip.open("{}.gz".format(filename), "rb") as fp:
            return fp.read().decode("utf-8")

    def _write(self, filename, text):
        with gzip.open("{}.gz".format(filename), "wb") as fp:
                fp.write(text)

    def _dir_pages(self, directory):
        """
        Similar to the Cache's _dir_pages method, but only checks
        for files with the .gz extension
        """
        path = os.path.join(directory, "*.gz")
        site_urls = {}
        for fp in glob.glob(path):
            if not os.path.isdir(fp):
                # if max_age is set, delete the file if it was last
                # modified before max_age
                if should_expire(fp, self.max_age):
                    log.info("<cache> removed {}".format(fp))
                    os.remove(fp)
                    continue
                non_zipped_filename = fp[:-3]
                site_urls[non_zipped_filename] = True
        return site_urls
