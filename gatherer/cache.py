import glob
import os
import re
from urllib.parse import urlparse
import logging


log = logging.getLogger(__name__)


def clean_url_filename(url):
    """
    strip illegal filename characters out of urls to return a string that can
    be used as a filename
    """
    illegal_chars = re.compile(r'(\/|\\|:|\*|\?|"|\<|\>|\|)')
    return re.sub(illegal_chars, "", url)


def url_info(url):
    """
    for a given url, returns the domain with periods to converted underscores
    and a filename made by stripping illegal characters from the url. The domain
    will be used for caching a page to a specific folder, and the filename is
    used for finding the page in that domain folder.
    """
    domain = urlparse(url).netloc.replace(".", "_")
    filename = clean_url_filename(url)
    return domain, filename


class Cache(object):

    """Cache is a basic file system cache where the HTML for a given URL is
    stored in a folder based on the domain name of the url, and the contents
    is stored in a file whose name is created by stripping any illegal
    characters from the URL. Illegal characters are based off of characters
    which cannot be used in Windows filenames.
    """

    def __init__(self, folder):
        self.folder = folder
        os.makedirs(self.folder, exist_ok=True)
        """
        iterates over the folders in the cache to create a lookup dict to
        quickly check whether a url is cached
        """
        self.sites = {}
        for f in os.listdir(self.folder):
            f_path = os.path.join(self.folder, f)
            if os.path.isdir(f_path):
                path = os.path.join(f_path, "*")
                self.sites[f] = {name: True for name in glob.glob(path)}

    def get(self, url):
        """
        returns a string of the html for a url if it has been cached,
        otherwise None
        """
        domain, filename = url_info(url)
        if domain not in self.sites:
            return None
        site_cache = self.sites[domain]
        long_filename = os.path.join(self.folder, domain, filename)
        if long_filename in site_cache:
            log.info("<cache> {}".format(url))
            long_filename = os.path.join(self.folder, domain, filename)
            with open(long_filename, "r") as fp:
                return fp.read()
        return None

    def save(self, url, text):
        """
        saves the text in the cache folder and adds the path to the
        lookup dict
        """
        domain, filename = url_info(url)
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
