import unittest

from gatherer.selector import Selector
from gatherer.rule import Rule
from gatherer.errors import BadJSONError


class SelectorTestCase(unittest.TestCase):

    def test_simple_from_json(self):
        # no children, just rules
        simple_json = {
            "selector": "a",
            "children": [],
            "rules": [
                {
                    "name": "link",
                    "attr": "href"
                },
                {
                    "name": "headline",
                    "attr": "text"
                }
            ],
            "spec": {
                "type": "single",
                "value": 0
            }
        }
        s = Selector.from_json(simple_json)
        self.assertIsNotNone(s)
        self.assertEqual(len(s.rules), 2)
        self.assertIsInstance(s.rules[0], Rule)
        self.assertEqual(s.type, "single")
        self.assertEqual(s.value, 0)

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
                            "attr": "href"
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

        s = Selector.from_json(nested_json)
        self.assertIsInstance(s, Selector)

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
            Selector.from_json(empty_json)

    def test_optional_from_json(self):
        simple_json = {
            "selector": "a",
            "children": [],
            "rules": [
                {
                    "name": "link",
                    "attr": "href"
                }
            ],
            "spec": {
                "type": "single",
                "value": 0
            },
            "optional": True
        }
        s = Selector.from_json(simple_json)
        self.assertTrue(s.optional)

if __name__ == "__main__":
    unittest.main()
