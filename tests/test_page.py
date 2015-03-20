import unittest
import os
import json

from collector.page import (new_page, Page)
from collector.errors import BadJSONError

path = os.path.join(os.getcwd(), "tests", "test_json")


class PageTestCase(unittest.TestCase):

    def test_new_page(self):
        with open(os.path.join(path, "page.json"), "r") as fp:
            simple_json = json.load(fp)
        s = new_page(simple_json, None)
        self.assertIsInstance(s, Page)

    def test_bad_json(self):
        with open(os.path.join(path, "bad_page.json"), "r") as fp:
            bad_json = json.load(fp)
        with self.assertRaises(BadJSONError):
            new_page(bad_json, None)

if __name__ == "__main__":
    unittest.main()
