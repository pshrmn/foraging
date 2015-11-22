from .selector import Selector
from .errors import BadJSONError


class Page(object):

    """A Page is made up of a Selectors and Rules to capture a subset
    of an HTML DOM. Each Selector has a CSS selector which is used to match
    elements in the page, a spec that designates which elements among those
    matched by the CSS selector are needed, rules to gather data from the
    matches elements' attributes and text, and children Selectors to get
    more deeply nested data.
    """

    def __init__(self, name, selector):
        self.name = name
        self.selector = selector

    @classmethod
    def from_json(cls, page_json):
        name = page_json["name"]
        try:
            selector = Selector.from_json(page_json)
        except BadJSONError:
            raise
        return cls(name, selector)

    def gather(self, dom):
        """The gather method is syntactic sugar for the Page's Selector's
        get method. It takes an lxml.HtmlElement and returns a dict with
        the data that was gathered from the dom.

        :param dom: An :class:`lxml.HtmlElement`
        :return: a dict with the desired data from the dom
        :rtype: dict
        """
        return self.selector.get(dom)
