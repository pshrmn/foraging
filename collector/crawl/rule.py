from lxml.cssselect import CSSSelector

class Selector(object):
    """
    A selector is used to select element(s) from a dom to apply rules to

    :param string selector: CSS selector to select element(s) in the DOM that Rule data should be
        captured from
    :param list rules: list of Rules that are applied to elements matching the selector
    :param boolean multiple: whether or not the selector should only match the first element or all
        elements that match the selector
    """
    def __init__(self, selector, rules, multiple=False):
        self.selector = selector
        self.rules = rules
        self.multiple = multiple
        self.xpath = CSSSelector(self.selector)

    @classmethod
    def from_json(cls, selector_json):
        selector = selector_json["selector"]
        rules = selector_json["rules"]
        rules = {key: Rule.from_json(rule) for key, rule in rules.items()}
        multiple = selector_json.get("multiple", False)
        return cls(selector, rules)

    def get(self, html):
        eles = self.xpath(html)
        if len(eles) == 0:
            return None

        data = {}
        for rule_name, rule in self.rules.items():
            # return None if the xpath gets no matches
            if self.multiple:
                data[rule_name] = map(rule.get, eles)
            else:
                data[rule_name] = rule.get(eles[0])
        return data

class Rule(object):
    """
    A rule corresponds to a column in a sql tuple

    :param string name: the name of the column
    :param string capture: is the attribute of the item(s) that you want to store
        eg. attr-href means that you want to get the element's href attribute
        text means that you want the text content of the element
    """
    def __init__(self, name, capture, follow=False):
        self.name = name
        self.capture = capture
        self.follow = follow
        self.value = self.set_capture()

    @classmethod
    def from_json(cls, rule_json):
        name = rule_json["name"]
        capture = rule_json["capture"]
        follow = rule_json.get("follow", False)
        return cls(name, capture, follow=follow)

    def get(self, ele):
        """
        given an element, return the desired attribute for the element
        """
        return self.value(ele)

    def set_capture(self):
        """
        returns a function that captures the desired attribute or the text based
        on the self.capture value
        """
        if self.capture.startswith('attr-'):
            attr_name = self.capture[5:]
            def attr(ele):
                """
                called when self.capture is attr-<attr_name>
                iterate over all matches, returns a list of attributes
                """
                return ele.get(attr_name)
            return attr
        else:
            def text(ele):
                """
                iterate over all matches, returns a list of text strings
                """
                return ele.text_content().strip()
            return text

    
    def __str__(self):
        return "Rule(%s, %s, %s, %s)" % (self.name, self.capture, self.follow)
