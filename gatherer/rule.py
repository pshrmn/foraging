import re

from .errors import BadJSONError


class Rule(object):

    def __init__(self, name, attr, _type):
        self.name = name
        self.attr = attr
        self.type = _type

    @classmethod
    def from_json(cls, rule_json):
        name = rule_json.get("name")
        attribute = rule_json.get("attr")
        _type = rule_json.get("type")
        if name is None:
            raise BadJSONError("Rule requires name, got {}".format(rule_json))
        if attribute is None:
            raise BadJSONError("Rule requires attr, got {}".format(rule_json))
        if _type is None:
            raise BadJSONError("Rule requires type, got {}".format(rule_json))
        return cls(name, attribute, _type)

    def get(self, element):
        val = ""
        if self.attr == "text":
            val = element.text_content().strip()
        else:
            val = element.get(self.attr)

        # convert to the desired format (or just return the string)
        if self.type == "int":
            return self.find_int(val)
        elif self.type == "float":
            return self.find_float(val)
        return val

    @staticmethod
    def find_int(text):
        match = re.search(r"\d+", text)
        if match.group():
            return int(match.group())
        return -1

    @staticmethod
    def find_float(text):
        match = re.search(r"\d+(\.\d+)?", text)
        if match.group():
            return float(match.group())
        return -1
