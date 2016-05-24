from lxml.cssselect import CSSSelector

from .rule import Rule


class ElementFactory(object):

    def from_json(element_json):
        selector = element_json.get("selector")
        if selector is None:
            msg = "Element requires selector\n{}"
            raise ValueError(msg.format(element_json))

        # verify spec
        spec = element_json.get("spec")
        _type = spec.get("type")
        if spec is None:
            msg = "Element requires spec\n{}"
            raise ValueError(msg.format(element_json))
        if _type is None:
            msg = "no Element spec type provided"
            raise ValueError(msg)
        elif _type not in ["single", "all", "range"]:
            msg = "unexpected Element type {}"
            raise ValueError(msg.format(spec.get("type")))

        optional = element_json.get("optional", False)

        # create children and rules
        try:
            children = [ElementFactory.from_json(child) for child in element_json["children"]]
            rules = [Rule.from_json(a) for a in element_json["rules"]]
        except ValueError:
            raise
        # ignore if there are no rules and no children to get data from
        if not children and not rules:
            msg = ("Element has no children or rules and "
                   "should be removed from the page")
            raise ValueError(msg.format(element_json))

        if _type == "single":
            return SingleElement(selector, spec, children, rules, optional)
        elif _type == "all":
            return AllElement(selector, spec, children, rules, optional)
        elif _type == "range":
            return RangeElement(selector, spec, children, rules, optional)
        else:
            return Element(selector, spec, children, rules, optional)


class Element(object):

    def __init__(self, selector, spec, children=None, rules=None, optional=False):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.spec = spec
        self.children = children if children is not None else []
        self.rules = rules if rules is not None else []
        self.optional = optional

    def data(self, parent):
        """
        Given a parent element, get the child element(s) using the compiled
        xpath for the selector.
        """
        return {}

    def _get_element_data(self, dom_element):
        """
        First get any data from this Element's rules list. Then merge any child
        data into that data dict.

        If either the rule or child data is None, return None.
        """
        data = self._rule_data(dom_element)
        if data is None:
            return
        child_data = self._child_data(dom_element)
        # if child_data does not exist, return
        if child_data is None:
            return
        # name collisions will override existing value
        for key, val in child_data.items():
            data[key] = val
        return data

    def _rule_data(self, dom_element):
        """
        Return the data associated with each attribute for each Rule.
        If the dom_element does not have the attribute for a rule, the data call
        will return None
        """
        data = {}
        for rule in self.rules:
            rule_data = rule.data(dom_element)
            if rule_data is None:
                return
            data[rule.name] = rule_data
        return data

    def _child_data(self, dom_element):
        """
        Get the data for all child selectors, merge that data into a dict,
        and return that dict. If a selector fails to match an element in the
        dom and the selector is not optional, return None.
        """
        data = {}
        for child in self.children:
            child_data = child.data(dom_element)
            if child_data is None:
                if not child.optional:
                    return
                else:
                    continue
            for key, val in child_data.items():
                data[key] = val
        return data

    def __repr__(self):
        children = ", ".join([repr(c) for c in self.children])
        rules = ", ".join([repr(r) for r in self.rules])
        return """AllElement("{}", {}, [{}], [{}], {})""".format(
            self.selector, self.spec, children, rules, self.optional)


class SingleElement(Element):

    def __init__(self, selector, spec, children, rules, optional=False):
        super().__init__(selector, spec, children, rules, optional)
        self.index = self.spec.get("index")
        if self.index is None:
            raise ValueError("No spec index provided")
        elif not isinstance(self.index, int):
            raise ValueError("Spec index must be an int, received {}".format(self.index))

    def data(self, parent):
        """
        Returns a dict with all data from the Element and its children merged
        together.
        """
        elements = self.xpath(parent)
        try:
            dom_element = elements[self.index]
        except IndexError:
            # return None if dom_element doesn't exist
            return None
        return self._get_element_data(dom_element)

    def __repr__(self):
        children = ", ".join([repr(c) for c in self.children])
        rules = ", ".join([repr(r) for r in self.rules])
        return """SingleElement("{}", {}, [{}], [{}], {})""".format(
            self.selector, self.spec, children, rules, self.optional)


class AllElement(Element):

    def __init__(self, selector, spec, children, rules, optional=False):
        super().__init__(selector, spec, children, rules, optional)
        self.name = self.spec.get("name")
        if not isinstance(self.name, str):
            raise ValueError("Spec name must be a str, received {}".format(self.name))
        elif self.name is None:
            raise ValueError("No spec name provided")
        elif self.name == "":
            raise ValueError("Spec name can not be an empty string")

    def data(self, parent):
        """
        Return a dict with one key/value pair. The key is the spec name and the
        value is a list of dicts, one for each DOM element selected. The dicts
        are the merged values for the element (similar to SingleElement.data's
        return value).
        """
        elements = self.xpath(parent)
        data = [self._get_element_data(e) for e in elements]
        real_data = [datum for datum in data if datum]
        # make sure that this didn't return all None
        if not real_data:
            return
        # filter out any elements that returned None
        return {self.name: real_data}

    def __repr__(self):
        children = ", ".join([repr(c) for c in self.children])
        rules = ", ".join([repr(r) for r in self.rules])
        return """AllElement("{}", {}, [{}], [{}], {})""".format(
            self.selector, self.spec, children, rules, self.optional)


class RangeElement(Element):

    def __init__(self, selector, spec, children, rules, optional=False):
        super().__init__(selector, spec, children, rules, optional)
        self.name = self.spec.get("name")
        if not isinstance(self.name, str):
            raise ValueError("Spec name must be a str, received {}".format(self.name))
        elif self.name is None:
            raise ValueError("No spec name provided")
        elif self.name == "":
            raise ValueError("Spec name can not be an empty string")

        self.low = self.spec.get("low")
        if not isinstance(self.low, int):
            raise ValueError("Spec low must be an int, received {}".format(self.low))
        elif self.low is None:
            raise ValueError("No spec low value provided")

        self.high = self.spec.get("high")
        if not isinstance(self.high, int) and self.high is not None:
            raise ValueError("Spec high must be an int or None, received {}".format(self.high))
        if "high" not in self.spec:
            raise ValueError("No spec high value provided")

        # verify that high > low
        if self.high is not None and self.high < self.low:
            msg = "high must be lower than greater than low (low={}, high={})"
            raise ValueError(msg.format(self.low, self.high))

    def data(self, parent):
        """
        Return a dict with one key/value pair. The key is the spec name and the
        value is a list of dicts, one for each DOM element selected. The dicts
        are the merged values for the element (similar to SingleElement.data's
        return value).
        """
        elements = self.xpath(parent)[self.low:self.high]
        data = [self._get_element_data(e) for e in elements]
        real_data = [datum for datum in data if datum]
        # make sure that this didn't return all None
        if not real_data:
            return
        # filter out any elements that returned None
        return {self.name: real_data}

    def __repr__(self):
        children = ", ".join([repr(c) for c in self.children])
        rules = ", ".join([repr(r) for r in self.rules])
        return """RangeElement("{}", {}, [{}], [{}], {})""".format(
            self.selector, self.spec, children, rules, self.optional)
