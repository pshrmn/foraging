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
    def __init__(self, rule_dict):
        self.name = rule_dict['name']
        self.selector = rule_dict['selector']
        self.capture = rule_dict['capture']
        self.index = rule_dict['index']
        if self.index != "":
            self.index = int(self.index)
        else:
            self.index = None
        self.xpath = CSSSelector(self.selector)

        # default to text, but override for attrs
        self.capture_fn = self.text
        if self.capture.startswith('attr-'):
            self.capture_attr = self.capture[5:]
            self.capture_fn = self.attr
        
    def get(self, html):
        """
        html is an lxml parsed html etree
        """
        eles = self.xpath(html)
        if self.index is not None:
            if self.index < 0:
                eles = eles[:self.index]
            else:
                eles = eles[self.index:]
        return self.capture_fn(eles)

    def attr(self, eles):
        return [ele.get(self.capture_attr) for ele in eles]

    def text(self, eles):
        """
        iterate over all matches, returns a list of text strings
        """
        return ["".join(ele.itertext()) for ele in eles]
