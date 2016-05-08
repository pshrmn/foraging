import unittest
from lxml import html

from gatherer.element import ElementFactory, SingleElement, AllElement
from gatherer.rule import Rule

SINGLE_JSON = {
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
                },
                {
                    "name": "headline",
                    "attr": "text",
                    "type": "string"
                }
            ],
            "spec": {
                "type": "single",
                "index": 0
            }
        }
    ],
    "rules": [
        {
            "name": "text",
            "attr": "text",
            "type": "string"
        }
    ],
    "spec": {
        "type": "single",
        "index": 0
    }
}

ALL_JSON = {
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
                },
                {
                    "name": "headline",
                    "attr": "text",
                    "type": "string"
                }
            ],
            "spec": {
                "type": "single",
                "index": 0
            }
        }
    ],
    "rules": [],
    "spec": {
        "type": "all",
        "name": "divs"
    }
}


class ElementFactoryTestCase(unittest.TestCase):

    def test_single_from_json(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        self.assertIsNotNone(e)
        self.assertIsInstance(e, SingleElement)
        # test type of child
        first_child = e.children[0]
        self.assertIsInstance(first_child, SingleElement)

    def test_creates_rule_and_child_objects(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        self.assertEqual(len(e.rules), 1)
        self.assertIsInstance(e.rules[0], Rule)
        self.assertEqual(e.spec.get("type"), "single")
        self.assertEqual(e.spec.get("index"), 0)

    def test_all_from_json(self):
        e = ElementFactory.from_json(ALL_JSON)
        self.assertIsInstance(e, AllElement)
        # test type of child
        first_child = e.children[0]
        self.assertIsInstance(first_child, SingleElement)

    def test_empty_from_json(self):
        # an empty Element has no rules or children
        # creating it should fail
        empty_json = {
            "selector": "div",
            "children": [],
            "rules": [],
            "spec": {
                "type": "single",
                "index": 0
            }
        }
        with self.assertRaises(ValueError):
            ElementFactory.from_json(empty_json)

    def test_optional_from_json(self):
        single_copy = SINGLE_JSON.copy()
        single_copy["optional"] = True
        e = ElementFactory.from_json(single_copy)
        self.assertTrue(e.optional)


class SingleElementTestCase(unittest.TestCase):

    def test_good_spec_index(self):
        single = SingleElement(
            "a",
            {"type": "single", "index": 0},
            [],
            [Rule("url", "href", "string")]
        )
        self.assertIsInstance(single, SingleElement)

    def test_bad_spec_index(self):
        bad_specs = [
            {"type": "single"},
            {"type": "single", "index": "0"}
        ]
        for bs in bad_specs:
            with self.assertRaises(ValueError):
                SingleElement(
                    "a",
                    bs,
                    [],
                    [Rule("url", "href", "string")]
                )

    def test_data_from_rules(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        parent = html.fragment_fromstring("<div><a href=\"#\">Test</a></div>")
        data = e.data(parent)
        self.assertIn("link", data)
        self.assertIn("headline", data)

    def test_rule_no_attr(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        parent = html.fragment_fromstring("<div><a>Test</a></div>")
        data = e.data(parent)
        self.assertIsNone(data)

    def test_children_data(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        parent = html.fragment_fromstring("<body><div><a href=\"#\">Test</a></div></body>")
        data = e.data(parent)
        self.assertIn("link", data)
        self.assertIn("headline", data)

    def test_child_element_doesnt_exist(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        parent = html.fragment_fromstring("<body><div></div></body>")
        data = e.data(parent)
        self.assertIsNone(data)


class AllElementTestCase(unittest.TestCase):

    def test_good_spec_name(self):
        all_e = AllElement(
            "a",
            {"type": "all", "name": "links"},
            [],
            [Rule("url", "href", "string")]
        )
        self.assertIsInstance(all_e, AllElement)

    def test_bad_spec_name(self):
        bad_specs = [
            {"type": "all"},
            {"type": "all", "name": 0},
            {"type": "all", "name": ""}
        ]
        for bs in bad_specs:
            with self.assertRaises(ValueError):
                AllElement(
                    "a",
                    bs,
                    [],
                    [Rule("url", "href", "string")]
                )

    def test_data_from_rules(self):
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("<div><a href=\"#\">Test</a></div>")
        data = e.data(parent)
        self.assertIn("divs", data)
        divs = data.get("divs")
        for div in divs:
            self.assertIn("link", div)
            self.assertIn("headline", div)

    def test_rule_no_attr(self):
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("<div><a>Test</a></div>")
        data = e.data(parent)
        self.assertIsNone(data)

    def test_children_data(self):
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("<body><div><a href=\"#\">Test</a></div></body>")
        data = e.data(parent)
        self.assertIn("divs", data)
        for div in data.get("divs"):
            self.assertIn("link", div)
            self.assertIn("headline", div)

    def test_child_element_doesnt_exist(self):
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("<body><div></div></body>")
        data = e.data(parent)
        self.assertIsNone(data)

if __name__ == "__main__":
    unittest.main()
