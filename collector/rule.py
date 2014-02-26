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
        self.xpath = CSSSelector(self.selector)

        index = rule_dict['index']
        self.index = int(index) if index != "" else None   
        self.values = self.set_capture()
        
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
                return [ele.get(attr_name) for ele in eles]
            return attr
        else:
            def text(eles):
                """
                iterate over all matches, returns a list of text strings
                """
                return ["".join(ele.itertext()) for ele in eles]
            return text

    
