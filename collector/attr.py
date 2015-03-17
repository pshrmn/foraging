class Attr(object):
    def __init__(self, name, attr):
        self.name = name
        self.attr = attr

    @classmethod
    def from_json(cls, attr):
        name = attr.get("name")
        attr = attr.get("attr")
        if not name or not attr:
            return None
        return cls(name, attr)

    def get(self, element):
        if self.attr == "text":
            return element.text_content().strip()
        else:
            return element.get(self.attr)
