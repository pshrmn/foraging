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
    def __init__(self, name, selector, capture, index=None, follow=False):
        self.name = name
        self.selector = selector
        self.capture = capture
        self.index = index
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
        # only return one value if no index is provided
        if self.index is None:
            eles = eles[0]
        else:
            eles = eles[:self.index] if self.index < 0 else eles[self.index:]
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
        return "Rule(%s, %s, %s, %s)" % (self.name, self.selector, self.capture, self.index)
