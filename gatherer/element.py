from lxml.cssselect import CSSSelector

from .rule import Rule
from .errors import BadJSONError


class Element(object):

    def __init__(self, selector, spec, children, rules,
                 optional=False):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.spec = spec
        self.children = children
        self.rules = rules
        self.optional = optional

    @classmethod
    def from_json(cls, sel):
        selector = sel.get("selector")
        if selector is None:
            msg = "Element requires selector\n{}"
            raise BadJSONError(msg.format(sel))

        # verify spec
        spec = sel.get("spec")
        if spec is None:
            msg = "Element requires spec\n{}"
            raise BadJSONError(msg.format(sel))
        if spec.get("type") is None:
            msg = "no Element spec type provided"
            raise BadJSONError(msg)
        elif spec.get("type") not in ["single", "all"]:
            msg = "unexpected Element type {}"
            raise BadJSONError(msg.format(spec.get("type")))
        if spec.get("value") is None:
            msg = "no Element spec value provided"
            raise BadJSONError(msg)

        optional = sel.get("optional", False)

        # create children and rules
        try:
            children = [Element.from_json(child) for child in sel["children"]]
            rules = [Rule.from_json(a) for a in sel["rules"]]
        except BadJSONError:
            raise
        # ignore if there are no rules and no children to get data from
        if len(children) == 0 and len(rules) == 0:
            msg = ("Element has no children or rules and "
                   "should be removed from the page")
            raise BadJSONError(msg.format(sel))
        return cls(selector, spec, children, rules, optional)

    def get(self, parent):
        """
        Given a parent element, get the child element(s) using the compiled
        xpath for the selector. For "single" Elements, this will be a single
        element that returns a dict. For "all" Elements, this will be all
        elements and returns a list.
        """
        elements = self.xpath(parent)
        spec_type = self.spec.get("type")
        spec_value = self.spec.get("value")
        if spec_type == "single":
            try:
                element = elements[spec_value]
            except IndexError:
                # return None if element doesn't exist
                return
            return self._get_element_data(element)
        elif spec_type == "all":
            data = [self.get_element_data(e) for e in elements]
            return {spec_value: [d for d in data if d]}

    def _get_element_data(self, element):
        data = self._rule_data(element)
        child_data = self._child_data(element)
        # if child_data does not exist, return
        if child_data is None:
            return
        for key, val in child_data.items():
            data[key] = val
        return data

    def _rule_data(self, element):
        """
        Return the data associated with each attribute for each Rule.
        If the element does not have the attribute for a rule, the get call
        will return None
        """
        return {rule.name: rule.get(element) for rule in self.rules}

    def _child_data(self, element):
        """
        Get the data for all child selectors, merge that data into a dict,
        and return that dict. If a selector fails to match an element in the
        dom and the selector is not optional, return None.
        """
        data = {}
        for child in self.children:
            child_data = child.get(element)
            if child_data is None:
                if not child.optional:
                    return
                else:
                    continue
            for key, val in child_data.items():
                data[key] = val
        return data
