import unittest
import os
import json

from gatherer.page import Page
from gatherer.errors import BadJSONError

path = os.path.join(os.getcwd(), "tests", "test_json")


class PageTestCase(unittest.TestCase):

    def test_new_page(self):
        with open(os.path.join(path, "page.json"), "r") as fp:
            simple_json = json.load(fp)
        p = Page.from_json(simple_json, None)
        self.assertIsInstance(p, Page)

    def test_bad_json(self):
        with open(os.path.join(path, "bad_page.json"), "r") as fp:
            bad_json = json.load(fp)
        with self.assertRaises(BadJSONError):
            Page.from_json(bad_json, None)

if __name__ == "__main__":
    unittest.main()
