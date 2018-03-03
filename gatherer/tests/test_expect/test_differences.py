import unittest
import copy

from gatherer.expect import flatten_element, differences
from gatherer.element import ElementFactory

from .elements import (SINGLE_ELEMENT, ALL_ELEMENT, RANGE_ELEMENT,
                       ALT_SINGLE_ELEMENT, ALT_ALL_ELEMENT)


class CompareTestCase(unittest.TestCase):

    """
    Single Element Tests
    {
        "title": str,
        "url": str
    }
    """

    def test_single_element(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        output = {
            "title": "Nightfall",
            "url": "http://www.isaacasimov.com/nightfall"
        }
        self.assertIsNone(differences(output, flattened))

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
            self.assertIsNotNone(differences(o, flattened))

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
            },
            {}
        ]
        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_optional_single_element_fail(self):
        # all optional, cannot fail
        pass

    """
    All Element Tests
    {
        "items": {
            "count": int
        }
    }
    """

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
        self.assertIsNone(differences(output, flattened))

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
        self.assertIsNotNone(differences(output, flattened))

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
        self.assertIsNone(differences(output, flattened))

    def test_optional_all_element_fail(self):
        # all optional, cannot fail
        pass

    """
    Range Element Tests
    {
        "items": {
            "count": int
        }
    }
    """

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
        self.assertIsNone(differences(output, flattened))

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
        self.assertIsNotNone(differences(output, flattened))

    def test_optional_range_element(self):
        """
        for an optional RangeElement, the dict for it
        will be optional as will all rules from it and
        its children
        """
        range_copy = copy.deepcopy(RANGE_ELEMENT)
        range_copy["optional"] = True
        ele = ElementFactory.from_json(range_copy)
        flattened = flatten_element(ele)

        output = {}
        self.assertIsNone(differences(output, flattened))

    def test_optional_range_element_fail(self):
        # all optional, cannot fail
        pass

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

        output = {
            "title": "The Dark Forest",
            "url": "http://www.liucixin.com/the_dark_forest",
            "text": "The Second Novel"
        }

        self.assertIsNone(differences(output, flattened))

    def test_single_child_single_fail(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "The Dark Forest",
                "url": "http://www.liucixin.com/the_dark_forest",
            },
            {
                "url": "http://www.liucixin.com/the_dark_forest",
                "text": "The Second Novel"
            }
        ]

        for o in outputs:
            self.assertIsNotNone(differences(o, flattened))

    def test_single_optional_child_single(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "The Dark Forest",
                "url": "http://www.liucixin.com/the_dark_forest",
                "text": "The Second Novel"
            },
            {
                "url": "http://www.liucixin.com/the_dark_forest",
                "text": "The Second Novel"
            }
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_single_optional_child_single_fail(self):
        # everything is optional, cannot fail
        pass

    def test_single_child_single_optional(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        alt_single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "The Dark Forest",
                "url": "http://www.liucixin.com/the_dark_forest",
                "text": "The Second Novel"
            },
            {
                "title": "The Dark Forest",
                "url": "http://www.liucixin.com/the_dark_forest"
            }
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_single_child_single_optional_fail(self):
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        alt_single_copy = copy.deepcopy(ALT_SINGLE_ELEMENT)
        single_copy["children"].append(alt_single_copy)
        alt_single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "title": "The Dark Forest",
                "text": "The Second Novel"
            }
        ]

        for o in outputs:
            self.assertIsNotNone(differences(o, flattened))

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

        self.assertIsNone(differences(output, flattened))

    def test_single_child_all_fail(self):
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
            self.assertIsNotNone(differences(o, flattened))

    def test_single_optional_child_all(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["children"].append(all_copy)
        single_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
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
            },
            {
                "title": "Nightfall",
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
            },
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall",
                "items": []
            }
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_single_optional_child_all_fail(self):
        # all optional, cannot fail
        pass

    def test_single_child_all_optional(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["children"].append(all_copy)
        all_copy["optional"] = True
        ele = ElementFactory.from_json(single_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
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
            },
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall",
                "items": []
            },
            {
                "title": "Nightfall",
                "url": "http://www.isaacasimov.com/nightfall",
            }
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_single_child_all_optional_fail(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        single_copy = copy.deepcopy(SINGLE_ELEMENT)
        single_copy["children"].append(all_copy)
        all_copy["optional"] = True
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
                "items": [
                    {
                        "count": 7,
                    },
                    {
                        "count": 12,
                    }
                ]
            }
        ]

        for o in bad_outputs:
            self.assertIsNotNone(differences(o, flattened))

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

        self.assertIsNone(differences(output, flattened))

    def test_all_child_single_fail(self):
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
            self.assertIsNotNone(differences(out, flattened))

    def test_all_optional_child_single(self):
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
            self.assertIsNone(differences(out, flattened))

    def test_all_optional_child_single_fail(self):
        # all true, cannot fail
        pass

    def test_all_child_single_optional(self):
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
            self.assertIsNone(differences(out, flattened))

    def test_all_child_single_optional_fail(self):
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
            self.assertIsNotNone(differences(out, flattened))

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

        output = {
            "items": [
                {
                    "count": 6,
                    "paragraphs": [
                        {
                            "description": "foo"
                        },
                        {
                            "description": "bar"
                        }
                    ]
                }
            ]
        }

        self.assertIsNone(differences(output, flattened))

    def test_all_child_all_fail(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        all_copy["children"].append(alt_all_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        bad_outputs = [
            {
                "items": [
                    {
                        "count": 6,
                    }
                ]
            },
            {
                "items": [
                    {
                        "paragraphs": [
                            {
                                "description": "foo"
                            },
                            {
                                "description": "bar"
                            }
                        ]
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 6
                    }
                ]
            },
            {}
        ]

        for o in bad_outputs:
            self.assertIsNotNone(differences(o, flattened))

    def test_all_optional_child_all(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        all_copy["optional"] = True
        all_copy["children"].append(alt_all_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "items": [
                    {
                        "count": 6,
                        "paragraphs": [
                            {
                                "description": "foo"
                            },
                            {
                                "description": "bar"
                            }
                        ]
                    }
                ]
            },
            {
                "items": []
            },
            {
                "items": [
                    {
                        "paragraphs": [
                            {
                                "description": "foo"
                            },
                            {
                                "description": "bar"
                            }
                        ]
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 6,
                        "paragraphs": []
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 6
                    }
                ]
            },
            {}
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_all_optional_child_all_fail(self):
        # all rules optional, cannot fail
        pass

    def test_all_child_all_optional(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        alt_all_copy["optional"] = True
        all_copy["children"].append(alt_all_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        outputs = [
            {
                "items": [
                    {
                        "count": 6,
                        "paragraphs": [
                            {
                                "description": "foo"
                            },
                            {
                                "description": "bar"
                            }
                        ]
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 6,
                        "paragraphs": []
                    }
                ]
            },
            {
                "items": [
                    {
                        "count": 6
                    }
                ]
            }
        ]

        for o in outputs:
            self.assertIsNone(differences(o, flattened))

    def test_all_child_all_optional_fail(self):
        all_copy = copy.deepcopy(ALL_ELEMENT)
        alt_all_copy = copy.deepcopy(ALT_ALL_ELEMENT)
        alt_all_copy["optional"] = True
        all_copy["children"].append(alt_all_copy)
        ele = ElementFactory.from_json(all_copy)
        flattened = flatten_element(ele)

        bad_outputs = [
            {
                "items": [
                    {
                        "paragraphs": [
                            {
                                "description": "foo"
                            },
                            {
                                "description": "bar"
                            }
                        ]
                    }
                ]
            },
            {}
        ]

        for o in bad_outputs:
            self.assertIsNotNone(differences(o, flattened))

if __name__ == "__main__":
    unittest.main()
