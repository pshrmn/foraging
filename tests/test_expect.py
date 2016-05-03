import unittest
import os
import json

from gatherer.expect import flatten_element, compare, differences
from gatherer.element import Element

path = os.path.join(os.getcwd(), "tests", "data", "test_expect")


def make_element(path):
    with open(path) as fp:
        element_json = json.load(fp)
    return Element.from_json(element_json)


class ExpectTestCase(unittest.TestCase):

    def test_simple_flatten_element(self):
        ele = make_element(os.path.join(path, "simple.json"))
        flattened = flatten_element(ele)

        title = flattened.get("title")
        self.assertIsNotNone(title)
        self.assertIs(title, str)

        author = flattened.get("author")
        self.assertIsNotNone(author)
        self.assertIs(author, str)

    def test_nested_flatten_element(self):
        ele = make_element(os.path.join(path, "nested.json"))
        flattened = flatten_element(ele)

        links = flattened.get("links")
        self.assertIsNotNone(links)
        self.assertIsInstance(links, dict)

        link = links.get("link")
        self.assertIsNotNone(link)
        self.assertIs(link, str)

    def test_compare(self):
        ele = make_element(os.path.join(path, "simple.json"))
        flattened = flatten_element(ele)
        output = {
            "title": "Nightfall",
            "author": "Isaac Asimov"
        }
        self.assertTrue(compare(output, flattened))

        bad_outputs = [
            {
                "title": "Nightfall"
            },
            {
                "author": "Isaac Asimov"
            },
            {
                "title": "Nightfall",
                "author": 7
            },
            {}
        ]
        for out in bad_outputs:
            self.assertFalse(compare(out, flattened))

    def test_differences(self):
        ele = make_element(os.path.join(path, "simple.json"))
        flattened = flatten_element(ele)
        output = {
            "title": "Nightfall",
            "author": "Isaac Asimov"
        }
        diffs = differences(output, flattened)
        self.assertIsNone(diffs)

        bad_outputs = [
            {
                "title": "Nightfall"
            },
            {
                "author": "Isaac Asimov"
            },
            {
                "title": "Nightfall",
                "author": 7
            },
            {}
        ]
        for out in bad_outputs:
            self.assertIsNotNone(differences(out, flattened))

if __name__ == "__main__":
    unittest.main()
