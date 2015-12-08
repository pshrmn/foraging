import unittest

from gatherer.element import Element
from gatherer.rule import Rule
from gatherer.errors import BadJSONError


class ElementTestCase(unittest.TestCase):

    def test_simple_from_json(self):
        # no children, just rules
        simple_json = {
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
        e = Element.from_json(simple_json)
        self.assertIsNotNone(e)
        self.assertEqual(len(e.rules), 2)
        self.assertIsInstance(e.rules[0], Rule)
        self.assertEqual(e.type, "single")
        self.assertEqual(e.value, 0)

    def test_nested_from_json(self):
        nested_json = {
            "selector": "div",
            "children": [
                {
                    "selector": "a",
                    "children": [],
                    "rules": [
                        {
                            "name": "link",
                            "attr": "href",
                            "type": "string"
                        }
                    ],
                    "spec": {
                        "type": "all",
                        "value": "links"
                    }
                }
            ],
            "rules": [],
            "spec": {
                "type": "single",
                "value": 0
            }
        }

        e = Element.from_json(nested_json)
        self.assertIsInstance(e, Element)

    def test_empty_from_json(self):
        # empty returns None
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
        simple_json = {
            "selector": "a",
            "children": [],
            "rules": [
                {
                    "name": "link",
                    "attr": "href",
                    "type": "string"
                }
            ],
            "spec": {
                "type": "single",
                "value": 0
            },
            "optional": True
        }
        e = Element.from_json(simple_json)
        self.assertTrue(e.optional)

if __name__ == "__main__":
    unittest.main()
