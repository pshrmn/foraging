from collector import rule
import unittest

from lxml.etree import fromstring

class RuleTestCase(unittest.TestCase):

    def setUp(self):
        self.good_rules = {"name": "links", "selector": "a", "capture": "attr-href"}
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



if __name__=="__main__":
    unittest.main()
