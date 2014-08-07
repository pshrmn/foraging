from lxml.cssselect import CSSSelector

class RuleSet(object):
    """
    A RuleSet consists of a group of (related?) rules in a page
    rules is a dict containing rules for the set
    parent (optional) is a dict with a selector and an optional range
    """
    def __init__(self, name, rules, parent=None):
        self.name = name
        self.rules = rules
        self.follow = []
        for rule in self.rules.itervalues():
            if rule.follow:
                self.follow.append(rule.name)
        self.parent = parent if parent else None

    @classmethod
    def from_json(cls, rule_set_json):
        name = rule_set_json["name"]
        rules = {rule["name"]: Rule.from_json(rule) for rule in rule_set_json["rules"].itervalues()}
        parent = None
        if rule_set_json.get("parent"):
            parent = Parent.from_json(rule_set_json["parent"])
        return cls(name, rules, parent)

    def get(self, dom):
        """
        returns an object where the key is a rule's name and the value is
        if self.parent, return a list
        otherwise, return a dict
        """
        if self.parent:
            return map(self.apply, self.parent.get(dom))
        else:    
            return self.apply(dom)

    def apply(self, dom):
        """
        iterate over rules given a dom, returning dict of {rule name:value} pairs and a dict of
        {page name: url} pairs to crawl subsequent pages
        """
        data = {}
        follow = {}
        for rule in self.rules.itervalues():
            rule_data, follow_data = rule.get(dom)
            # if any of the rules return None, have the whole thing fail
            if rule_data:
                data[rule.name] = rule_data
                if follow_data:
                    follow[rule.name] = follow_data
            else:
                return None, None
        return data, follow

    def __str__(self):
        return "RuleSet(%s, %s)" % (self.rules, self.parent)

class Parent(object):
    """
    selector is the selector break up the dom into multiple elements
    range is used to skip certain elements when a selector is applied
    if range is positive, skip from the beginning on the elements, if negative skip from the end
    """
    def __init__(self, selector, _range=None):
        self.selector = selector
        self.xpath = CSSSelector(selector)
        self.range = _range

    @classmethod
    def from_json(cls, parent_json):
        selector = parent_json["selector"]
        _range = parent_json.get("which")
        return cls(selector, _range)

    def get(self, dom):
        eles = self.xpath(dom)
        if self.range:
            if self.range >= 0:
                return eles[self.range:]
            else:
                return eles[:self.range]
        return eles

    def __str__(self):
        return "Parent(%s, %s)" % (self.selector, self.range)

class Rule(object):
    """
    A rule corresponds to a column in a sql tuple
    name is the name of the column
    selector is the css selector used to select the item(s) from an html dom
    capture is the attribute of the item(s) that you want to store
        eg. attr-href means that you want to get the element's href attribute
        text means that you want the text content of the element
    which is which rules to get if a selector returns multiple elements
        if which is None, returns the first element
        if which is 0, returns all matching elements
        if which is > 0, returns elements which to end of list
        if which is < 0, returns elements start of list to which
    """
    def __init__(self, name, selector, capture, follow=False):
        self.name = name
        self.selector = selector
        self.capture = capture
        self.follow = follow

        self.xpath = CSSSelector(self.selector)
        self.value = self.set_capture()

    @classmethod
    def from_json(cls, rule_json):
        name = rule_json["name"]
        selector = rule_json["selector"]
        capture = rule_json["capture"]
        follow = rule_json.get("follow", False)
        return cls(name, selector, capture, follow)

    def get(self, html):
        """
        html is an lxml parsed html etree
        returns a list of value based on self.capture
        """
        eles = self.xpath(html)
        # return None if the xpath gets no matches
        if len(eles) == 0:
            return None, None
        value = self.value(eles[0])
        if self.follow:
            return value, value
        else:
            return value, None

    def set_capture(self):
        """
        returns a function that captures the desired attribute or the text based
        on the self.capture value
        """
        if self.capture.startswith('attr-'):
            attr_name = self.capture[5:]
            def attr(eles):
                """
                called when self.capture is attr-<attr_name>
                iterate over all matches, returns a list of attributes
                """
                return eles.get(attr_name)
            return attr
        else:
            def text(eles):
                """
                iterate over all matches, returns a list of text strings
                """
                return "".join(eles.itertext())
            return text

    
    def __str__(self):
        return "Rule(%s, %s, %s, %s)" % (self.name, self.selector, self.capture, self.follow)
