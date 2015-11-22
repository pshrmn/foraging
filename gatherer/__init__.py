"""
Gatherer
~~~~~~~~

A tiny web scraping library. Pairs well with https://github.com/psherman/forager
for creating rule sets.

    >>> import json
    >>> from Gatherer import Fetch, Page
    >>> f = Fetch(header={"User-Agent": "My Custom User Agent"})
    >>> with open("example.json") as fp:
    >>>     page_json = json.load(fp)
    >>> p = Page.from_json(page_json)
    >>> url = "http://www.example.com"
    >>> dom = f.get(url)
    >>> if dom is not None:
    >>>     data = p.gather(dom)
    >>>     # do something with the data

:copyright: (c) 2015 by Paul Sherman
:license: MIT, see LICENSE for more details
"""

__version__ = "1.2.0"

from .fetch import Fetch
from .cache import Cache
from .page import Page
