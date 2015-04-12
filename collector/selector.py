from lxml.cssselect import CSSSelector

from .rule import Rule
from .errors import BadJSONError


class Selector(object):

    def __init__(self, selector, sel_type, value, children, rules,
                 optional=False):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.type = sel_type
        self.value = value
        self.children = children
        self.rules = rules
        self.optional = optional

    @classmethod
    def from_json(cls, sel):
        selector = sel.get("selector")
        if selector is None:
            msg = "selector requires selector\n{}"
            raise BadJSONError(msg.format(sel))

        # verify spec
        spec = sel.get("spec")
        if spec is None:
            msg = "selector requires spec\n{}"
            raise BadJSONError(msg.format(sel))
        sel_type = spec.get("type")
        value = spec.get("value")
        if sel_type is None:
            msg = "no selector spec type provided"
            raise BadJSONError(msg)
        elif sel_type not in ["single", "all"]:
            msg = "unexpected selector type {}"
            raise BadJSONError(msg.format(sel_type))
        if value is None:
            msg = "no selector spec value provided"
            raise BadJSONError(msg)

        optional = sel.get("optional", False)

        # create children and rules
        try:
            children = [Selector.from_json(child) for child in sel["children"]]
            rules = [Rule.from_json(a) for a in sel["rules"]]
        except BadJSONError:
            raise
        # ignore if there are no rules and no children to get data from
        if len(children) == 0 and len(rules) == 0:
            msg = ("selector has no children or rules and "
                   "should be removed from the page")
            raise BadJSONError(msg.format(sel))
        return cls(selector, sel_type, value, children, rules, optional)

    def get(self, parent):
        """
        Given a parent element, get the child element(s) using the compiled
        xpath for the selector. For "single" selectors, this will be a single
        element that returns a dict. For "all" selectors, this will be all
        elements and returns a list.
        """
        elements = self.xpath(parent)
        if self.type == "single":
            try:
                element = elements[self.value]
            except IndexError:
                # return None if element doesn't exist
                return
            return self.getElementData(element)
        elif self.type == "all":
            data = [self.getElementData(e) for e in elements]
            return {self.value: [d for d in data if d]}

    def getElementData(self, element):
        data = self.ruleData(element)
        child_data = self.childData(element)
        # if child_data does not exist, return
        if child_data is None:
            return
        for key, val in child_data.items():
            data[key] = val
        return data

    def ruleData(self, element):
        """
        Return the data associated with each attribute for each Rule.
        """
        return {rule.name: rule.get(element) for rule in self.rules}

    def childData(self, element):
        """
        Get the data for all child selectors, merge that data into a dict,
        and return that dict. If a selector fails to match an element in the
        dom and the selector is not optional, return None.
        """
        data = {}
        for child in self.children:
            child_data = child.get(element)
            if child_data is None and not child.optional:
                return
            for key, val in child_data.items():
                data[key] = val
        return data
