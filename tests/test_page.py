import unittest

from gatherer.page import Page

class PageTestCase(unittest.TestCase):

    def test_new_page(self):
        GOOD_JSON = {
            "name": "simple",
            "element": {
            "selector": "body",
            "spec": {
                "type": "single",
                "index": 0
            },
            "children": [
                {
                   "selector": "a",
                    "spec": {
                        "type": "all",
                        "name": "links"
                    },
                    "children": [],
                    "rules": [
                        {
                            "name": "link",
                            "attr": "href",
                            "type": "string"
                        }
                    ]
                }
            ],
            "rules": []
            }
        }
        p = Page.from_json(GOOD_JSON)
        self.assertIsInstance(p, Page)

    def test_bad_json(self):
        BAD_JSON = {
            "name": "simple",
            "element": {
                "selector": "body",
                "spec": {
                    "type": "single",
                    "index": 0
                },
                "children": [],
                "rules": []
            }
        }
        with self.assertRaises(ValueError):
            Page.from_json(BAD_JSON)

if __name__ == "__main__":
    unittest.main()
