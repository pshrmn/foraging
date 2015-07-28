from .selector import Selector
from .errors import BadJSONError


class Page(object):

    def __init__(self, name, selector, fetch):
        self.name = name
        self.selector = selector
        self.fetch = fetch

    @classmethod
    def from_json(cls, page_json, fetch):
        name = page_json["name"]
        try:
            selector = Selector.from_json(page_json)
        except BadJSONError:
            raise
        return cls(name, selector, fetch)

    def get(self, url, dynamic=False):
        if not self.fetch:
            return
        dom = self.fetch.get(url, dynamic)
        if dom is None:
            return
        return self.selector.get(dom)
