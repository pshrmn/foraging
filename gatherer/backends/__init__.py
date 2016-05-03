"""
Builtin backends for gatherer.

A backend function takes a url string and a dict of headers
and makes a web request to the url to get the content of the
response. The backend returns the text content of the response
when the request is successful, otherwise it returns None.

requests_backend returns the static html that is returned by the
response. phantom_backend makes use of phantomjs to run any initial
scripts and returns the html text content of the page after those
scripts have executed. This is useful for pages that dynamically
load data.
"""

from .requests import requests_backend
from .phantom import phantom_backend
