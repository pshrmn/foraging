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
    def from_json(cls, sel):
        selector = sel["selector"]
        spec = sel["spec"]
        children = []
        for child in sel["children"]:
            child_selector = Selector.from_json(child)
            # don't add child if it returned None
            if child_selector:
                children.append(child_selector)
        attrs = [Attr.from_json(a) for a in sel["attrs"]]
        # ignore if there are no attrs and no children to get data from
        if len(children) == 0 and len(attrs) == 0:
            return None
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
            return [d for d in data if d]
        pass

    def getElementData(self, element):
        data = self.attrData(element)
        if not data:
            return
        child_data = self.childData(element)
        if not child_data:
            return
        for key, val in child_data.items():
            data[key] = val
        return data

    def attrData(self, element):
        return {attr.name: attr.attr(element) for attr in self.attrs}

    def childData(self, element):
        data = {}
        for child in self.children:
            child_data = {key: val for key, val in child.get(element)}
            for key, val in child_data.items():
                data[key] = val
        return data
