import unittest
from lxml import html

from gatherer.element import (ElementFactory, Element,
                                SingleElement, AllElement, RangeElement)
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

RANGE_JSON = {
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
        "type": "range",
        "name": "divs",
        "low": 0,
        "high": 2
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

    def test_all_from_json(self):
        e = ElementFactory.from_json(ALL_JSON)
        self.assertIsInstance(e, AllElement)
        # test type of child
        first_child = e.children[0]
        self.assertIsInstance(first_child, SingleElement)

    def test_range_from_json(self):
        e = ElementFactory.from_json(RANGE_JSON)
        self.assertIsInstance(e, RangeElement)

    def test_creates_rule_and_child_objects(self):
        e = ElementFactory.from_json(SINGLE_JSON)
        self.assertEqual(len(e.rules), 1)
        self.assertIsInstance(e.rules[0], Rule)
        self.assertEqual(e.spec.get("type"), "single")
        self.assertEqual(e.spec.get("index"), 0)

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


class ElementTestCase(unittest.TestCase):

    def test_children_is_none(self):
        ele = Element("selector", {"type": "single", "index": 0}, rules=[])
        self.assertIsInstance(ele.children, list)

    def test_rules_is_none(self):
        ele = Element("selector", {"type": "single", "index": 0}, children=[])
        self.assertIsInstance(ele.rules, list)


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

    def test_all_data_none(self):
        """
        when every element returns None, data will be None
        """
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div><a>Foo</a></div>
            <div><a>Bar</a></div>
            <div><a>Baz</a></div>
            <div><a>Quux</a></div>
        </section>
        """)
        data = e.data(parent)
        self.assertIsNone(data)

    def test_children_data(self):
        """
        the data from child elements is merged into the datum for
        each element
        """
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div><a href=\"#foo\">Foo</a></div>
            <div><a href=\"#bar\">Bar</a></div>
            <div><a href=\"#baz\">Baz</a></div>
            <div><a href=\"#quux\">Quux</a></div>
        </section>
        """)
        data = e.data(parent)
        self.assertIn("divs", data)
        for div in data.get("divs"):
            self.assertIn("link", div)
            self.assertIn("headline", div)

    def test_child_element_doesnt_exist(self):
        """
        when a child element doesn't exist, its data is filtered out
        """
        e = ElementFactory.from_json(ALL_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div><a href=\"#foo\">Foo</a></div>
            <div></div>
            <div><a href=\"#baz\">Baz</a></div>
            <div><a href=\"#quux\">Quux</a></div>
        </section>
        """)
        data = e.data(parent)
        divs = data.get("divs")
        self.assertEqual(len(divs), 3)


class RangeElementTestCase(unittest.TestCase):

    def test_good_spec_values(self):
        good_specs = [
            {"type": "range", "name": "Foo", "low": 0, "high": 3},
            {"type": "range", "name": "Foo", "low": 0, "high": None}
        ]
        for spec in good_specs:
            ele = RangeElement(
                "a",
                spec,
                [],
                [Rule("url", "href", "string")]
            )
            self.assertIsInstance(ele, RangeElement)

    def test_bad_spec_values(self):
        bad_specs = [
            {"type": "range", "low": 0, "high": 3},  # no name
            {"type": "range", "name": 0, "low": 0, "high": 3},  # bad name type
            {"type": "range", "name": "", "low": 0, "high": 3},  # bad name value
            {"type": "range", "name": "foo", "high": 3},  # no low
            {"type": "range", "name": "foo", "low": "0", "high": 3},  # bad low value
            {"type": "range", "name": "foo", "low": 0},  # no high
            {"type": "range", "name": "foo", "low": 0, "high": "3"},  # bad high value
            {"type": "range", "name": "foo", "low": 3, "high": 0},  # low > high
        ]
        for bs in bad_specs:
            with self.assertRaises(ValueError):
                RangeElement(
                    "a",
                    bs,
                    [],
                    [Rule("url", "href", "string")]
                )

    def test_rule_no_attr(self):
        """
        when an element returns None, it is filtered out
        """
        e = ElementFactory.from_json(RANGE_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div><a href=\"#\">Test</a></div>
            <div><a>Test</a></div>
            <div><a href=\"#\">Test</a></div>
            <div><a href=\"#\">Test</a></div>
        </section>
        """)
        data = e.data(parent)
        divs = data.get("divs")
        self.assertEqual(len(divs), 1)

    def test_children_data(self):
        """
        child data is merged into the datum for each element
        """
        e = ElementFactory.from_json(RANGE_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div><a href=\"#\">Test</a></div>
            <div><a>Test</a></div>
            <div><a href=\"#\">Test</a></div>
            <div><a href=\"#\">Test</a></div>
        </section>
        """)
        data = e.data(parent)
        self.assertIn("divs", data)
        for div in data.get("divs"):
            self.assertIn("link", div)
            self.assertIn("headline", div)

    def test_all_data_doesnt_exist(self):
        """
        when all matched elements return None, data
        will return None
        """
        e = ElementFactory.from_json(RANGE_JSON)
        parent = html.fragment_fromstring("""
        <section>
            <div></div>
            <div></div>
            <div><a href=\"#\">Test</a></div>
            <div><a href=\"#\">Test</a></div>
        </section>
        """)
        data = e.data(parent)
        self.assertIsNone(data)

if __name__ == "__main__":
    unittest.main()
