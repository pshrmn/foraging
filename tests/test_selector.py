import unittest

from collector.selector import Selector
from collector.attr import Attr
from collector.errors import BadJSONError


class SelectorTestCase(unittest.TestCase):

    def test_simple_from_json(self):
        # no children, just attrs
        simple_json = {
            "selector": "a",
            "children": [],
            "attrs": [
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
                "type": "index",
                "value": 0
            }
        }
        s = Selector.from_json(simple_json)
        self.assertIsNotNone(s)
        self.assertEqual(len(s.attrs), 2)
        self.assertIsInstance(s.attrs[0], Attr)
        self.assertEqual(s.type, "index")
        self.assertEqual(s.value, 0)

    def test_nested_from_json(self):
        nested_json = {
            "selector": "div",
            "children": [
                {
                    "selector": "a",
                    "children": [],
                    "attrs": [
                        {
                            "name": "link",
                            "attr": "href"
                        }
                    ],
                    "spec": {
                        "type": "name",
                        "value": "links"
                    }
                }
            ],
            "attrs": [],
            "spec": {
                "type": "index",
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
            "attrs": [],
            "spec": {
                "type": "index",
                "value": 0
            }
        }
        with self.assertRaises(BadJSONError):
            Selector.from_json(empty_json)


if __name__ == "__main__":
    unittest.main()
