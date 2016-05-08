import re


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
            raise ValueError("Rule requires name, got {}".format(rule_json))
        if attribute is None:
            raise ValueError("Rule requires attr, got {}".format(rule_json))
        if _type is None:
            raise ValueError("Rule requires type, got {}".format(rule_json))
        return cls(name, attribute, _type)

    def data(self, element):
        """
        Returns an error message and a value. If there is as error message, the
        value is None and vice versa.
        """
        val = ""
        if self.attr == "text":
            val = element.text_content().strip()
        else:
            val = element.get(self.attr)
            if val is None:
                return

        # convert to the desired format (or just return the string)
        if self.type == "string":
            return val
        if self.type == "int":
            return self.find_int(val)
        elif self.type == "float":
            return self.find_float(val)

    @staticmethod
    def find_int(text):
        """
        find an int in the string, parse it, and return it. If there is no
        int found in the string, return None
        """
        match = re.search(r"\d+", text)
        if match is not None:
            return int(match.group())
        return

    @staticmethod
    def find_float(text):
        """
        find an float in the string, parse it, and return it. If there is no
        float found in the string, return None
        """
        match = re.search(r"\d+(\.\d+)?", text)
        if match is not None:
            return float(match.group())
        return
