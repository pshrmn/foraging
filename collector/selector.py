from lxml.cssselect import CSSSelector

from .rule import Rule
from .errors import BadJSONError


class Selector(object):

    def __init__(self, selector, sel_type, value, children, rules):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.type = sel_type
        self.value = value
        self.children = children
        self.rules = rules

    @classmethod
    def from_json(cls, selector_json):
        selector = selector_json.get("selector")
        if selector is None:
            msg = "selector requires selector\n{}"
            raise BadJSONError(msg.format(selector_json))

        # verify spec
        spec = selector_json.get("spec")
        if spec is None:
            msg = "selector requires spec\n{}"
            raise BadJSONError(msg.format(selector_json))
        sel_type = spec.get("type")
        value = spec.get("value")
        if sel_type is None:
            msg = "no selector spec type provided"
            raise BadJSONError(msg)
        elif sel_type not in ["index", "name"]:
            msg = "unexpected selector type {}"
            raise BadJSONError(msg.format(sel_type))
        if value is None:
            msg = "no selector spec value provided"
            raise BadJSONError(msg)
        children = []
        for child in selector_json["children"]:
            try:
                children.append(Selector.from_json(child))
            except BadJSONError:
                raise
        try:
            rules = [Rule.from_json(a) for a in selector_json["rules"]]
        except BadJSONError:
            raise
        # ignore if there are no rules and no children to get data from
        if len(children) == 0 and len(rules) == 0:
            msg = """selector has no children or rules and \
should be removed from the page"""
            raise BadJSONError(msg.format(selector_json))
        return cls(selector, sel_type, value, children, rules)

    def get(self, parent):
        elements = self.xpath(parent)
        if self.type == "index":
            try:
                element = elements[self.value]
            except IndexError:
                # return None if element doesn't exist
                return
            return self.getElementData(element)
        elif self.type == "name":
            data = [self.getElementData(e) for e in elements]
            return {self.value: [d for d in data if d]}
        pass

    def getElementData(self, element):
        data = self.ruleData(element)
        child_data = self.childData(element)
        if child_data is not None:
            for key, val in child_data.items():
                data[key] = val
        # if child_data does not exist, return
        else:
            return
        return data

    def ruleData(self, element):
        return {rule.name: rule.get(element) for rule in self.rules}

    def childData(self, element):
        data = {}
        for child in self.children:
            child_data = child.get(element)
            # if a child doesn't exist, return
            if child_data is None:
                return
            for key, val in child_data.items():
                data[key] = val
        return data
