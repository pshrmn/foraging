from .selector import Selector
from .errors import BadJSONError


class Page(object):

    def __init__(self, name, selector):
        self.name = name
        self.selector = selector

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        try:
            selector = Selector.from_json(page_json)
        except BadJSONError:
            raise
        return cls(name, selector)

    def gather(self, dom):
        return self.selector.get(dom)
