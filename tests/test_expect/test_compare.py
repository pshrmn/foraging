import unittest
import copy

from gatherer.expect import flatten_element, compare
from gatherer.element import ElementFactory

from .elements import SINGLE_ELEMENT, ALL_ELEMENT, RANGE_ELEMENT


class CompareTestCase(unittest.TestCase):

    def test_single_element(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        output = {
            "title": "Nightfall",
            "url": "http://www.isaacasimov.com/nightfall"
        }
        self.assertTrue(compare(output, flattened))

    def test_optional_single_element(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall"
            },
            {
                "url": "http://www.isaacasimov.com/nightfall"
            },
            {
                "title": "Nightfall",
            }
        ]
        for o in outputs:
            self.assertTrue(compare(o, flattened))

    def test_single_element_fail(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "Nightfall"
            },
            {
                "url": "http://www.isaacasimov.com/nightfall"
            },
            {
                "title": "Nightfall",
                "url": 7
            },
            {}
        ]
        for o in outputs:
            self.assertFalse(compare(o, flattened))

    def test_all_element(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        output = {
            "items": [
                {"count": 7},
                {"count": 12}
            ]
        }
        self.assertTrue(compare(output, flattened))

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

        output = {}
        self.assertTrue(compare(output, flattened))

    def test_all_element_fail(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        output = {
            "items": [
                {"count": 7},
                {}
            ]
        }
        self.assertFalse(compare(output, flattened))

    def test_range_element(self):
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        output = {
            "items": [
                {"count": 7},
                {"count": 12}
            ]
        }
        self.assertTrue(compare(output, flattened))

    def test_optional_range_element(self):
        """
        for an optional AllElement, the dict for it
        will be optional as will all rules from it and
        its children
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        range_copy["optional"] = True
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        output = {}
        self.assertTrue(compare(output, flattened))

    def test_range_element_fail(self):
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        output = {
            "items": [
                {"count": 7},
                {}
            ]
        }
        self.assertFalse(compare(output, flattened))

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

        output = {
            "title": "Nightfall",
            "url": "http://www.isaacasimov.com/nightfall",
            "items": [
                {
                    "count": 7,
                },
                {
                    "count": 12,
                }
            ]
        }

        self.assertTrue(compare(output, flattened))

    def test_nested_single_element_fail(self):
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

        bad_outputs = [
            {
                "url": "http://www.isaacasimov.com/nightfall",
                "items": [
                    {
                        "count": 7,
                    },
                    {
                        "count": 12,
                    }
                ]
            },
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall",
                "items": [
                    {},
                    {
                        "count": 12,
                    }
                ]
            },
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall",
            }
        ]

        for o in bad_outputs:
            self.assertFalse(compare(o, flattened))

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

        output = {
            "items": [
                {
                    "count": 7,
                    "title": "Nightfall",
                    "url": "http://www.isaacasimov.com/nightfall"
                },
                {
                    "count": 12,
                    "title": "Foundation",
                    "url": "http://www.isaacasimov.com/foundation"
                }
            ]
        }

        self.assertTrue(compare(output, flattened))

    def test_nested_all_element_fail(self):
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
        bad_outputs = [
            {
                "items": [
                    {
                        "count": "12",
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 12,
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {}
        ]
        for out in bad_outputs:
            self.assertFalse(compare(out, flattened))

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

        optional_outputs = [
            {
                "items": [
                    {
                        "count": 12,
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 12,
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {}
        ]
        for out in optional_outputs:
            self.assertTrue(compare(out, flattened))

    def test_nested_element_optional_child(self):
        """
        When an Element is optional, its rules and all descendent Element's
        rules must be considered optional
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["optional"] = True
        all_copy["children"].append(single_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        optional_outputs = [
            {
                "items": [
                    {
                        "count": 12,
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 12,
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 12
                    }
                ]
            }
        ]
        for out in optional_outputs:
            self.assertTrue(compare(out, flattened))

    def test_nested_element_optional_child_fail(self):
        """
        When an Element is optional, its rules and all descendent Element's
        rules must be considered optional
        """
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["optional"] = True
        all_copy["children"].append(single_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        optional_outputs = [
            {
                "items": [
                    {
                        "title": "Foundation",
                        "url": "http://www.isaacasimov.com/foundation"
                    }
                ]
            },
            {},
        ]
        for out in optional_outputs:
            self.assertFalse(compare(out, flattened))

if __name__ == "__main__":
    unittest.main()
