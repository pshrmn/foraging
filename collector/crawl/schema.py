from .selector import Selector
from .errors import BadSimpleSchemaError


class Schema(object):
    def __init__(self, name, urls, pages):
        self.name = name
        self.urls = urls
        self.pages = pages

    @classmethod
    def from_json(cls, schema):
        name = schema["name"]
        urls = schema["urls"]
        pages = {key: Selector.from_json(val) for key, val
                 in schema["pages"].items()}
        return cls(name, urls, pages)


class SimpleSchema(Schema):
    """
    a simple schema has one page, "default"
    """
    def __init__(self, name, urls, pages):
        page_count = len(pages.keys())
        if page_count != 1 or not pages.get("default"):
            err = "SimpleSchema takes only one page (default), given {}"
            raise BadSimpleSchemaError(err.format(pages.keys()))
        super(SimpleSchema, self).__init__(name, urls, pages)

    @classmethod
    def from_json(cls, schema):
        name = schema["name"]
        urls = schema["urls"]
        pages_json = schema["pages"]
        page_count = len(pages_json.keys())
        if page_count != 1 or not pages_json.get("default"):
            err = "SimpleSchema takes only one page (default), given {}"
            raise BadSimpleSchemaError(err.format(pages_json.keys()))
        pages = {key: Selector.from_json(val) for key, val
                 in schema["pages"].items()}
        return cls(name, urls, pages)
