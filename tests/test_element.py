import unittest
from lxml import html

from gatherer.element import Element
from gatherer.rule import Rule
from gatherer.errors import BadJSONError


class ElementTestCase(unittest.TestCase):

    def setUp(self):
        # no children, just rules
        self.simple_json = {
            "selector": "a",
            "children": [],
            "rules": [
                {
                    "name": "link",
                    "attr": "href",
                    "type": "string"
                },
                {
                    "name": "headline",
                    "attr": "text",
                    "type": "string"
                }
            ],
            "spec": {
                "type": "single",
                "value": 0
            }
        }

        self.nested_json = {
            "selector": "div",
            "children": [
                self.simple_json
            ],
            "rules": [],
            "spec": {
                "type": "single",
                "value": 0
            }
        }

    def test_simple_from_json(self):
        e = Element.from_json(self.simple_json)
        self.assertIsNotNone(e)
        self.assertEqual(len(e.rules), 2)
        self.assertIsInstance(e.rules[0], Rule)
        self.assertEqual(e.spec.get("type"), "single")
        self.assertEqual(e.spec.get("value"), 0)

    def test_nested_from_json(self):
        e = Element.from_json(self.nested_json)
        self.assertIsInstance(e, Element)

    def test_empty_from_json(self):
        # an empty Element has no rules or children
        # creating it should fail
        empty_json = {
            "selector": "div",
            "children": [],
            "rules": [],
            "spec": {
                "type": "single",
                "value": 0
            }
        }
        with self.assertRaises(BadJSONError):
            Element.from_json(empty_json)

    def test_optional_from_json(self):
        self.simple_json["optional"] = True
        e = Element.from_json(self.simple_json)
        self.assertTrue(e.optional)

    def test_data_from_rules(self):
        e = Element.from_json(self.simple_json)
        parent = html.fragment_fromstring("<div><a href=\"#\">Test</a></div>")
        data = e.data(parent)
        self.assertIn("link", data)
        self.assertIn("headline", data)

    def test_rule_no_attr(self):
        e = Element.from_json(self.simple_json)
        parent = html.fragment_fromstring("<div><a>Test</a></div>")
        data = e.data(parent)
        self.assertIsNone(data)

    def test_children_data(self):
        e = Element.from_json(self.nested_json)
        parent = html.fragment_fromstring("<body><div><a href=\"#\">Test</a></div></body>")
        data = e.data(parent)
        self.assertIn("link", data)
        self.assertIn("headline", data)

    def test_child_element_doesnt_exist(self):
        e = Element.from_json(self.nested_json)
        parent = html.fragment_fromstring("<body><div></div></body>")
        data = e.data(parent)
        self.assertIsNone(data)

if __name__ == "__main__":
    unittest.main()
