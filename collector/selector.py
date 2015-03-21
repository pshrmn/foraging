from lxml.cssselect import CSSSelector

from .attr import Attr
from .errors import BadJSONError


class Selector(object):
    def __init__(self, selector, spec, children, attrs):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.type = spec["type"]
        if self.type not in ["index", "name"]:
            raise BadJSONError("unexpected selector type {}".format(self.type))
        self.value = spec["value"]
        self.children = children
        self.attrs = attrs

    @classmethod
    def from_json(cls, selector_json):
        selector = selector_json.get("selector")
        if selector is None:
            msg = "selector requires selector\n{}"
            raise BadJSONError(msg.format(selector_json))
        spec = selector_json.get("spec")
        if spec is None:
            msg = "selector requires spec\n{}"
            raise BadJSONError(msg.format(selector_json))
        children = []
        for child in selector_json["children"]:
            try:
                children.append(Selector.from_json(child))
            except BadJSONError:
                raise
        try:
            attrs = [Attr.from_json(a) for a in selector_json["attrs"]]
        except BadJSONError:
            raise
        # ignore if there are no attrs and no children to get data from
        if len(children) == 0 and len(attrs) == 0:
            msg = """selector has no children or attrs and \
should be removed from the page"""
            raise BadJSONError(msg.format(selector_json))
        return cls(selector, spec, children, attrs)

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
        data = self.attrData(element)
        child_data = self.childData(element)
        if child_data is not None:
            for key, val in child_data.items():
                data[key] = val
        # if child_data does not exist, return
        else:
            return
        return data

    def attrData(self, element):
        return {attr.name: attr.get(element) for attr in self.attrs}

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

