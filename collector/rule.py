from .errors import BadJSONError


class Rule(object):

    def __init__(self, name, attr):
        self.name = name
        self.attr = attr

    @classmethod
    def from_json(cls, rule_json):
        name = rule_json.get("name")
        attribute = rule_json.get("attr")
        if name is None:
            raise BadJSONError("Rule requires name, got {}".format(rule_json))
        if attribute is None:
            raise BadJSONError("Rule requires attr, got {}".format(rule_json))
        return cls(name, attribute)

    def get(self, element):
        if self.attr == "text":
            return element.text_content().strip()
        else:
            return element.get(self.attr)
