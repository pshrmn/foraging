from .errors import BadJSONError


class Attr(object):
    def __init__(self, name, attr):
        self.name = name
        self.attr = attr

    @classmethod
    def from_json(cls, attr_json):
        name = attr_json.get("name")
        attribute = attr_json.get("attr")
        if name is None:
            raise BadJSONError("Attr requires name, got {}".format(attr_json))
        if attribute is None:
            raise BadJSONError("Attr requires attr, got {}".format(attr_json))
        return cls(name, attribute)

    def get(self, element):
        if self.attr == "text":
            return element.text_content().strip()
        else:
            return element.get(self.attr)
