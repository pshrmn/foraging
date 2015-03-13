import unittest

from collector.crawl.attr import Attr


class AttrTestCase(unittest.TestCase):

    def test_from_json(self):
        attrs = [
            {
                "name": "title",
                "attr": "text"
            },
            {
                "name": "url",
                "attr": "href"
            },
            {
                "name": "img",
                "attr": "src"
            },
            {
                "name": "description",
                "attr": "text"
            }
        ]
        for attr_json in attrs:
            a = Attr.from_json(attr_json)
            self.assertIsInstance(a, Attr)
            self.assertEqual(a.name, attr_json["name"])
            self.assertEqual(a.attr, attr_json["attr"])

    def test_bad_from_json(self):
        # returns None if either name or attr aren't provided
        bad_attrs = [
            {
                "name": "foo"
            },
            {
                "attr": "bar"
            },
            {}
        ]
        for attr_json in bad_attrs:
            a = Attr.from_json(attr_json)
            self.assertIsNone(a)


if __name__ == "__main__":
    unittest.main()
