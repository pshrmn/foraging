from collector import rule
import unittest
from lxml.etree import fromstring

import logging
logging.disable(logging.CRITICAL)

class RuleTestCase(unittest.TestCase):

    def setUp(self):
        self.good_rules = {"name": "links", "selector": "a", "capture": "attr-href", "index": ""}
        self.html = fromstring('''<div>
            <a href="#">Testing<span> more testing</span></a>
            <a href="http://www.example.com">Second</a>
            </div>''')

    def test_create_rule(self):
        r = rule.Rule(self.good_rules)
        self.assertEqual(r.name, "links")
        self.assertEqual(r.selector, "a")
        self.assertEqual(r.capture, "attr-href")

        bad_rules = {"selector": "a", "capture": "attr-href"}
        self.assertRaises(KeyError, rule.Rule, bad_rules)

    def test_text(self):
        self.good_rules["capture"] = "text"
        r = rule.Rule(self.good_rules)
        captured_text = r.get(self.html)
        self.assertEqual(captured_text, ["Testing more testing", "Second"])

    def test_attr(self):
        r = rule.Rule(self.good_rules)
        captured_attrs = r.get(self.html)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])

    def test_index(self):
        # no index
        r = rule.Rule(self.good_rules)
        r = rule.Rule(self.good_rules)
        self.assertEqual(r.index, None)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 2)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])

        # positive index
        self.good_rules["index"] = 1
        r = rule.Rule(self.good_rules)
        self.assertEqual(r.index, 1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "http://www.example.com")

        # negative index
        self.good_rules["index"] = -1
        r = rule.Rule(self.good_rules)
        self.assertEqual(r.index, -1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "#")

if __name__=="__main__":
    unittest.main()
