from lxml.cssselect import CSSSelector

class Parent(object):
    """
    selector is the selector break up the dom into multiple elements
    range is used to skip certain elements when a selector is applied
    if range is positive, skip from the beginning on the elements, if negative skip from the end
    """
    def __init__(self, selector, _range=None):
        self.selector = CSSSelector(selector)
        self.range = _range

    def get(self, dom):
        eles = self.selector(dom)
        if self.range:
            if self.range >= 0:
                return eles[self.range:]
            else:
                return eles[:self.range]
        return eles

class RuleSet(object):
    """
    A RuleSet consists of a group of (related?) rules in a page
    rules is a dict containing rules for the set
    parent (optional) is a dict with a selector and an optional range
    """
    def __init__(self, rules, parent=None):
        self.rules = self.make_rules(rules)
        self.parent = Parent(**parent) if parent else None

    def make_rules(self, rules):
        self.rules = [Rule(**rule) for rule in rules]

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
        return {rule.name: rule.get(dom) for rule in self.rules}

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
    def __init__(self, name, selector, capture, which=None, follow=False):
        self.name = name
        self.selector = selector
        self.capture = capture
        self.which = which
        self.xpath = CSSSelector(self.selector)
        self.values = self.set_capture()
        self.follow = follow
        
    def get(self, html):
        """
        html is an lxml parsed html etree
        returns a list of values based on self.capture
        """
        eles = self.xpath(html)
        # return None if the xpath gets no matches
        if len(eles) == 0:
            return None
        # only return one value if no which is provided
        if self.which is None:
            eles = eles[0]
        else:
            eles = eles[:self.which] if self.which < 0 else eles[self.which:]
        return self.values(eles)

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
                if isinstance(eles, list):
                    return [ele.get(attr_name) for ele in eles]
                else:
                    return eles.get(attr_name)
            return attr
        else:
            def text(eles):
                """
                iterate over all matches, returns a list of text strings
                """
                if isinstance(eles, list):
                    return ["".join(ele.itertext()) for ele in eles]
                else:
                    return "".join(eles.itertext())
            return text

    
    def __str__(self):
        return "Rule(%s, %s, %s, %s)" % (self.name, self.selector, self.capture, self.which)
