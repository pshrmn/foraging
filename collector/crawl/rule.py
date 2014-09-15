from lxml.cssselect import CSSSelector

class Rule(object):
    """
    A rule corresponds to a column in a sql tuple
    name is the name of the column
    selector is the css selector used to select the item(s) from an html dom
    capture is the attribute of the item(s) that you want to store
        eg. attr-href means that you want to get the element's href attribute
        text means that you want the text content of the element
    """
    def __init__(self, name, selector, capture, multiple=False, follow=False):
        self.name = name
        self.selector = selector
        self.capture = capture
        self.multiple = multiple
        self.follow = follow

        self.xpath = CSSSelector(self.selector)
        self.value = self.set_capture()

    @classmethod
    def from_json(cls, rule_json):
        name = rule_json["name"]
        selector = rule_json["selector"]
        capture = rule_json["capture"]
        multiple = rule_json.get("multiple", False)
        follow = rule_json.get("follow", False)
        return cls(name, selector, capture, multiple=multiple, follow=follow)

    def get(self, html):
        """
        html is an lxml parsed html etree
        eles is all elements in the dom that match the xpath, however only the first match is used
        this might change in the future (at least for specific targets like a select/options)
        returns a value based on self.capture
        """
        eles = self.xpath(html)
        # return None if the xpath gets no matches
        if len(eles) == 0:
            return None
        if self.multiple:
            return map(self.value, eles)
        else:
            return self.value(eles[0])

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
        return "Rule(%s, %s, %s, %s)" % (self.name, self.selector, self.capture, self.follow)
