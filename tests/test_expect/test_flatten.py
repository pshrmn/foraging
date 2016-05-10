import unittest
import copy

from gatherer.expect import flatten_element
from gatherer.element import ElementFactory

from .elements import SINGLE_ELEMENT, ALL_ELEMENT, RANGE_ELEMENT


class FlattenElementTestCase(unittest.TestCase):

    def test_single_element(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        for key in ["url", "title"]:
            rule = flattened.get(key)
            self.assertIsNotNone(rule)
            _type, optional = rule
            self.assertIs(_type, str)
            self.assertFalse(optional)

    def test_optional_single_element(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        for key in ["url", "title"]:
            rule = flattened.get(key)
            self.assertIsNotNone(rule)
            _type, optional = rule
            self.assertIs(_type, str)
            self.assertTrue(optional)

    def test_all_element(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsNotNone(items_tuple)
        self.assertFalse(items_optional)

        count = items.get("count")
        self.assertIsNotNone(count)
        _type, optional = count
        self.assertIs(_type, int)
        self.assertFalse(optional)

    def test_optional_all_element(self):
        """
        for an optional AllElement, the dict for it
        will be optional as will all rules from it and
        its children
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsNotNone(items_tuple)
        self.assertTrue(items_optional)

        count = items.get("count")
        self.assertIsNotNone(count)
        _type, optional = count
        self.assertIs(_type, int)
        self.assertTrue(optional)

    def test_range_element(self):
        """
        the RangeElement flattens the same as an AllElement
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsNotNone(items_tuple)
        self.assertFalse(items_optional)

        count = items.get("count")
        self.assertIsNotNone(count)
        _type, optional = count
        self.assertIs(_type, int)
        self.assertFalse(optional)

    def test_optional_range_element(self):
        """
        the RangeElement flattens the same as an AllElement
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        range_copy["optional"] = True
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertIsNotNone(items_tuple)
        self.assertTrue(items_optional)

        count = items.get("count")
        self.assertIsNotNone(count)
        _type, optional = count
        self.assertIs(_type, int)
        self.assertTrue(optional)

    def test_nested_single_element(self):
        """
        when an AllElement (or RangeElement) is nested within
        a SingleElement, a key/value pair with the AllElement's
        spec name and a dict containing it (and its children's)
        rules will be created
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["children"].append(all_copy)
        ele = ElementFactory.from_json(single_copy)

        flattened = flatten_element(ele)
        for key in ["url", "title", "items"]:
            self.assertIn(key, flattened)

    def test_nested_all_element(self):
        """
        When a SingleElement is nested within an AllELement
        (or RangeElement), all of its rules will be added to the
        dict of the AllElement's rules.
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy["children"].append(single_copy)
        ele = ElementFactory.from_json(all_copy)

        flattened = flatten_element(ele)
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertFalse(items_optional)

        for values in [("count", int), ("url", str), ("title", str)]:
            key, expected_type = values
            rule = items.get(key)
            self.assertIsNotNone(rule)
            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertFalse(optional)

    def test_optional_nested_all_element(self):
        """
        When an Element is optional, its rules and all descendent Element's
        rules must be considered optional
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        all_copy["children"].append(single_copy)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(all_copy)

        flattened = flatten_element(ele)
        items_tuple = flattened.get("items")
        items, items_optional = items_tuple
        self.assertTrue(items_optional)

        for values in [("count", int), ("url", str), ("title", str)]:
            key, expected_type = values
            rule = items.get(key)
            self.assertIsNotNone(rule)
            _type, optional = rule
            self.assertIs(_type, expected_type)
            self.assertTrue(optional)

if __name__ == "__main__":
    unittest.main()
