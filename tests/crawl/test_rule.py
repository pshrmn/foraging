from collector.crawl.rule import Rule
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
        r = Rule(**self.good_rules)
        self.assertEqual(r.name, "links")
        self.assertEqual(r.selector, "a")
        self.assertEqual(r.capture, "attr-href")

        bad_rules = {"selector": "a", "capture": "attr-href"}
        self.assertRaises(TypeError, Rule, bad_rules)

    def test_text(self):
        self.good_rules["capture"] = "text"
        r = Rule(**self.good_rules)
        captured_text = r.get(self.html)
        self.assertEqual(captured_text, "Testing more testing")

    def test_multiple_test(self):
        self.good_rules["capture"] = "text"
        self.good_rules["which"] = 0
        r = Rule(**self.good_rules)
        captured_text = r.get(self.html)
        self.assertEqual(captured_text, ["Testing more testing", "Second"])

    def test_attr(self):
        r = Rule(**self.good_rules)
        captured_attrs = r.get(self.html)
        self.assertEqual(captured_attrs, "#")

    def test_multiple_attr(self):
        self.good_rules["which"] = 0
        r = Rule(**self.good_rules)
        captured_attrs = r.get(self.html)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])        

    def test_which(self):
        # no which
        r = Rule(**self.good_rules)
        self.assertEqual(r.which, None)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs, "#")

        # zero which
        self.good_rules["which"] = 0
        r = Rule(**self.good_rules)
        self.assertEqual(r.which, 0)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 2)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])

        # positive which
        self.good_rules["which"] = 1
        r = Rule(**self.good_rules)
        self.assertEqual(r.which, 1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "http://www.example.com")

        # negative which
        self.good_rules["which"] = -1
        r = Rule(**self.good_rules)
        self.assertEqual(r.which, -1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "#")

if __name__=="__main__":
    unittest.main()
