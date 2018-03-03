from .element import ElementFactory
from .expect import flatten_element, compare


class Page(object):

    """
    A Page is made up of a Elements and Rules to capture a subset
    of an HTML DOM. Each Element has a CSS selector which is used to match
    elements in the page, a spec that designates which elements among those
    matched by the CSS selector are needed, rules to gather data from the
    matches elements' attributes and text, and children Selectors to get
    more deeply nested data.
    """

    def __init__(self, name, element):
        self.name = name
        self.element = element

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        try:
            element = ElementFactory.from_json(page_json["element"])
        except ValueError:
            raise
        return cls(name, element)

    def gather(self, dom):
        """
        The gather method is syntactic sugar for the Page's Element's
        data method. It takes an lxml.HtmlElement and returns a dict with
        the data that was gathered from the dom.

        :param dom: An :class:`lxml.HtmlElement`
        :return: a dict with the desired data from the dom
        :rtype: dict
        """
        if dom is None:
            return
        return self.element.data(dom)

    def verify(self, dom):
        """
        verify compares the data from the dom to the expected types
        """
        return compare(self.gather(dom), flatten_element(self.element))

    def __repr__(self):
        return """Page("{}", {})""".format(self.name, self.element)
