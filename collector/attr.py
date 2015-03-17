from .errors import BadJSONError


def new_attr(attr):
    name = attr.get("name")
    attribute = attr.get("attr")
    if name is None:
        raise BadJSONError("Attr requires name, got {}".format(attr))
    if attribute is None:
        raise BadJSONError("Attr requires attr, got {}".format(attr))
    return Attr(name, attribute)


class Attr(object):
    def __init__(self, name, attr):
        self.name = name
        self.attr = attr

    def get(self, element):
        if self.attr == "text":
            return element.text_content().strip()
        else:
            return element.get(self.attr)
