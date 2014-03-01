import unittest
from collector import boilerplate

class HelperTestCase(unittest.TestCase):
    
    def test_rule_code(self):
        rule = {
            "name": "link",
            "selector": "a",
            "capture": "attr-href"
        }
        text = boilerplate.rule_code(rule)
        self.assertEqual(text, "Rule(name=\"link\", selector=\"a\", capture=\"attr-href\")")

    def test_rule_code_index(self):
        rule = {
            "name": "link",
            "selector": "a",
            "capture": "attr-href",
            "index": -3
        }
        text = boilerplate.rule_code(rule)
        self.assertEqual(text, "Rule(name=\"link\", selector=\"a\", capture=\"attr-href\", index=-3)")

    def test_rules_dict(self):
        rules = {
            "link": {
                "name": "link",
                "selector": "a",
                "capture": "attr-href",
                "index": -1
            },
            "next": {
                "name": "next",
                "selector": "a.next",
                "capture": "attr-href"
            }
        }
        text = boilerplate.rules_dict(rules, "links")
        expected = """links = {
\t"link": Rule(name="link", selector="a", capture="attr-href", index=-1),
\t"next": Rule(name="next", selector="a.next", capture="attr-href")
}"""

        self.assertEqual(text, expected)

if __name__=="__main__":
    unittest.main()
