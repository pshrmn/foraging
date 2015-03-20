from .selector import new_selector
from .errors import BadJSONError


def new_page(page, fetch):
    name = page["name"]
    try:
        selector = new_selector(page)
    except BadJSONError:
        raise
    return Page(name, selector, fetch)


class Page(object):
    def __init__(self, name, selector, fetch):
        self.name = name
        self.selector = selector
        self.fetch = fetch

    def get(self, url, dynamic=False):
        if not self.fetch:
            return
        dom = self.fetch.get(url, dynamic)
        if dom is None:
            return
        return self.selector.get(dom)
