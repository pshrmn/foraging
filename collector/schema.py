from .selector import new_selector
from .errors import BadJSONError


def new_schema(schema, fetch):
    name = schema["name"]
    urls = schema["urls"]
    try:
        pages = {k: new_selector(v) for k, v in schema["pages"].items()}
    except BadJSONError:
        raise
    return Schema(name, urls, pages, fetch)


def new_simple_schema(schema, fetch):
    name = schema["name"]
    urls = schema["urls"]
    try:
        pages = {k: new_selector(v) for k, v in schema["pages"].items()}
    except BadJSONError:
        raise
    return SimpleSchema(name, urls, pages, fetch)


class Schema(object):
    def __init__(self, name, urls, pages, fetch):
        self.name = name
        self.urls = urls
        self.pages = pages
        self.fetch = fetch


class SimpleSchema(Schema):
    """
    a simple schema has one page, "default"
    """
    def __init__(self, name, urls, pages, fetch):
        page_count = len(pages.keys())
        if page_count != 1 or not pages.get("default"):
            err = "SimpleSchema takes only one page (default), given {}"
            raise BadJSONError(err.format(pages.keys()))
        super(SimpleSchema, self).__init__(name, urls, pages, fetch)

    def get(self, url, dynamic=False):
        if not self.fetch:
            return
        dom = self.fetch.get(url, dynamic)
        if dom is None:
            return
        return self.pages["default"].get(dom)
