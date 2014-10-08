from pycollector.crawl.rule import Rule
import unittest
from lxml.html import document_fromstring
from lxml.cssselect import CSSSelector

class SelectorTestCase(unittest.TestCase):
    pass

class RuleTestCase(unittest.TestCase):

    def setUp(self):
        self.good_rule = {"name": "links", "capture": "attr-href"}
        self.html = document_fromstring('''<div>
            <a href="#">Testing<span> more testing</span></a>
            <a href="http://www.example.com">Second</a>
            </div>''')
        xpath = CSSSelector("a")
        self.eles = xpath(self.html)

    def test_create_rule(self):
        r = Rule.from_json(self.good_rule)
        self.assertEqual(r.name, "links")
        self.assertEqual(r.capture, "attr-href")

        bad_rules = {"capture": "attr-href"}
        self.assertRaises(TypeError, Rule, bad_rules)

    def test_text(self):
        self.good_rule["capture"] = "text"
        r = Rule.from_json(self.good_rule)
        captured_text = r.get(self.eles[0])
        self.assertEqual(captured_text, "Testing more testing")

    def test_attr(self):
        r = Rule.from_json(self.good_rule)
        captured_attrs = r.get(self.eles[0])
        self.assertEqual(captured_attrs, "#")

if __name__=="__main__":
    unittest.main()
