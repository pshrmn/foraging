from collector.rule import Rule
from collector import helpers
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

    def test_helpers(self):
        rules = {"name": "price", "selector": ".price", "capture": "text"}
        html = fromstring('''<div class="price">$29.99</div>''')
        r = Rule(helpers=[helpers.dollars], **rules)
        money = r.get(html)
        self.assertEqual(money, [29.99])

    def test_chain_helpers(self):
        rules = {"name": "text", "selector": "div", "capture": "text"}
        html = fromstring('''<div>THIS SENTENCE IS PROPERLY CAPITALIZED</div>''')
        r = Rule(helpers=[helpers.lowercase, helpers.capitalize], **rules)
        sentence = r.get(html)
        self.assertEqual(sentence, ["This sentence is properly capitalized"])

    def test_text(self):
        self.good_rules["capture"] = "text"
        r = Rule(**self.good_rules)
        captured_text = r.get(self.html)
        self.assertEqual(captured_text, ["Testing more testing", "Second"])

    def test_attr(self):
        r = Rule(**self.good_rules)
        captured_attrs = r.get(self.html)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])

    def test_index(self):
        # no index
        r = Rule(**self.good_rules)
        self.assertEqual(r.index, None)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 2)
        self.assertEqual(captured_attrs, ["#", "http://www.example.com"])

        # positive index
        self.good_rules["index"] = 1
        r = Rule(**self.good_rules)
        self.assertEqual(r.index, 1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "http://www.example.com")

        # negative index
        self.good_rules["index"] = -1
        r = Rule(**self.good_rules)
        self.assertEqual(r.index, -1)
        captured_attrs = r.get(self.html)
        self.assertEqual(len(captured_attrs), 1)
        self.assertEqual(captured_attrs[0], "#")

if __name__=="__main__":
    unittest.main()
