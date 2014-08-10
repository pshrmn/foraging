from collector.crawl.rules import Rule
import unittest
from lxml.etree import fromstring

# don't log while testing
import logging
logging.disable(logging.CRITICAL)

class RuleTestCase(unittest.TestCase):

    def setUp(self):
        self.good_rules = {"name": "links", "selector": "a", "capture": "attr-href"}
        self.html = fromstring('''<div>
            <a href="#">Testing<span> more testing</span></a>
            <a href="http://www.example.com">Second</a>
            </div>''')

    def test_create_rule(self):
        r = Rule.from_json(self.good_rules)
        self.assertEqual(r.name, "links")
        self.assertEqual(r.selector, "a")
        self.assertEqual(r.capture, "attr-href")

        bad_rules = {"selector": "a", "capture": "attr-href"}
        self.assertRaises(TypeError, Rule, bad_rules)

    def test_text(self):
        self.good_rules["capture"] = "text"
        r = Rule.from_json(self.good_rules)
        captured_text, follow = r.get(self.html)
        self.assertEqual(captured_text, "Testing more testing")
        self.assertIsNone(follow)

    def test_attr(self):
        r = Rule.from_json(self.good_rules)
        captured_attrs, follow = r.get(self.html)
        self.assertEqual(captured_attrs, "#")


if __name__=="__main__":
    unittest.main()
