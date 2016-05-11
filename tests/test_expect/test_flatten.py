import unittest
import copy

from gatherer.expect import flatten_element
from gatherer.element import ElementFactory

from .elements import (SINGLE_ELEMENT, ALL_ELEMENT, RANGE_ELEMENT,
                       ALT_SINGLE_ELEMENT, ALT_ALL_ELEMENT)


class FlattenElementTestCase(unittest.TestCase):

    """
    Single Element Tests
    {
        "title": str,
        "url": str
    }
    """

    def test_single(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, False),
            ("title", str, False)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_single_optional(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, True),
            ("title", str, True)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    All Element Tests
    {
        "items": {
            "count": int
        }
    }
    """

    def test_all(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_all_optional(self):
        """
        for an optional AllElement, the dict for it
        will be optional as will all rules from it and
        its children
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, True
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    Range Element Tests
    {
        "items": {
            "count": int
        }
    }
    """

    def test_range(self):
        """
        the RangeElement flattens the same as an AllElement
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_range_optional(self):
        """
        the RangeElement flattens the same as an AllElement
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        range_copy["optional"] = True
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        # "items", dict, True
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    Single Element w/ Child Single Element
    {
        "title": str,
        "url" str,
        "text": str
    }
    """

    def test_single_child_single(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, False),
            ("title", str, False),
            ("text", str, False)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_single_optional_child_single(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, True),
            ("title", str, True),
            ("text", str, True)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_single_child_single_optional(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        alt_single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, False),
            ("title", str, False),
            ("text", str, True)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    Single Element w/ Child All Element
    {
        "title": str,
        "url" str,
        "items": {
            "count": int
        }
    }
    """

    def test_single_child_all(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy["children"].append(all_copy)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, False),
            ("title", str, False)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_single_optional_child_all(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy["children"].append(all_copy)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, True),
            ("title", str, True)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_single_child_all_optional(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy["children"].append(all_copy)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        expected = [
            ("url", str, False),
            ("title", str, False)
        ]

        for item in expected:
            name, expected_type, expected_optional = item
            rule = flattened.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    All Element w/ Child Single Element
    {
        "items": {
            "count": int,
            "title": str,
            "url" str
        }
    }
    """

    def test_all_child_single(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy["children"].append(single_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False),
            ("title", str, False),
            ("url", str, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_all_optional_child_single(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy["children"].append(single_copy)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, True
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True),
            ("title", str, True),
            ("url", str, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_all_child_single_optional(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy["children"].append(single_copy)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False),
            ("title", str, True),
            ("url", str, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    """
    All Element w/ Child All Element
    {
        "items": {
            "count": int,
            "paragraphs: {
                "description": string
            }
        }
    }
    """

    def test_all_child_all(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        all_copy["children"].append(alt_all_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "paragraphs", dict, False
        paragraphs_tuple = items.get("paragraphs")
        paragraphs, paragraphs_optional = paragraphs_tuple
        self.assertIsInstance(paragraphs, dict)
        self.assertEqual(paragraphs_optional, False)

        expected_paragraph_keys = [
            ("description", str, False)
        ]

        for item in expected_paragraph_keys:
            name, expected_type, expected_optional = item
            rule = paragraphs.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_all_optional_child_all(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        all_copy["children"].append(alt_all_copy)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        # "items", dict, True
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, True)

        expected_item_keys = [
            ("count", int, True)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "paragraphs", dict, True
        paragraphs_tuple = items.get("paragraphs")
        paragraphs, paragraphs_optional = paragraphs_tuple
        self.assertIsInstance(paragraphs, dict)
        self.assertEqual(paragraphs_optional, True)

        expected_paragraph_keys = [
            ("description", str, True)
        ]

        for item in expected_paragraph_keys:
            name, expected_type, expected_optional = item
            rule = paragraphs.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

    def test_all_child_all_optional(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        all_copy["children"].append(alt_all_copy)
        alt_all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)
        # "items", dict, False
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsInstance(items, dict)
        self.assertEqual(items_optional, False)

        expected_item_keys = [
            ("count", int, False)
        ]

        for item in expected_item_keys:
            name, expected_type, expected_optional = item
            rule = items.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

        # "paragraphs", dict, True
        paragraphs_tuple = items.get("paragraphs")
        paragraphs, paragraphs_optional = paragraphs_tuple
        self.assertIsInstance(paragraphs, dict)
        self.assertEqual(paragraphs_optional, True)

        expected_paragraph_keys = [
            ("description", str, True)
        ]

        for item in expected_paragraph_keys:
            name, expected_type, expected_optional = item
            rule = paragraphs.get(name)
            self.assertIsNotNone(rule)

            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertEqual(optional, expected_optional)

if __name__ == "__main__":
    unittest.main()
