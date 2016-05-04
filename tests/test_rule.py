import unittest
from lxml import html

from gatherer.rule import Rule
from gatherer.errors import BadJSONError


class RuleTestCase(unittest.TestCase):

    def test_from_json(self):
        rules = [
            {
                "name": "title",
                "attr": "text",
                "type": "string"
            },
            {
                "name": "url",
                "attr": "href",
                "type": "string"
            },
            {
                "name": "img",
                "attr": "src",
                "type": "string"
            },
            {
                "name": "description",
                "attr": "text",
                "type": "string"
            }
        ]
        for rule_json in rules:
            a = Rule.from_json(rule_json)
            self.assertIsInstance(a, Rule)
            self.assertEqual(a.name, rule_json["name"])
            self.assertEqual(a.attr, rule_json["attr"])

    def test_bad_from_json(self):
        # returns None if either name or rule aren't provided
        bad_rules = [
            {
                "name": "foo"
            },
            {
                "attr": "bar"
            },
            {
                "type": "float"
            },
            {}
        ]
        for rule_json in bad_rules:
            with self.assertRaises(BadJSONError):
                Rule.from_json(rule_json)

    def test_no_attr(self):
        # if the attribute doesn't exist, returns None
        example = "<a href=\"http://www.example.com\">Test</a>"
        ele = html.fragment_fromstring(example)
        r = Rule.from_json({
            "name": "url",
            "attr": "src",
            "type": "string"
        })
        val = r.get(ele)
        self.assertIsNone(val)

    def test_type_string(self):
        example = "<a href=\"http://www.example.com\">Test</a>"
        ele = html.fragment_fromstring(example)
        r = Rule.from_json({
            "name": "url",
            "attr": "href",
            "type": "string"
        })
        val = r.get(ele)
        self.assertIsInstance(val, str)
        self.assertEqual(val, "http://www.example.com")

    def test_type_int(self):
        examples = [
            ("<p data-index=\"3\">Test</p>", "data-index", 3),
            ("<p>15 miles</p>", "text", 15),
            ("<p>The 18th of July</p>", "text", 18)
        ]
        for example in examples:
            html_string, attr, expected = example
            r = Rule.from_json({
                "name": "url",
                "attr": attr,
                "type": "int"
            })
            ele = html.fragment_fromstring(html_string)
            val = r.get(ele)
            self.assertIsInstance(val, int)
            self.assertEqual(val, expected)

    def test_bad_int(self):
        # should return -1
        r = Rule.from_json({
            "name": "url",
            "attr": "text",
            "type": "int"
        })
        html_string = "<div>Nothing to see here</div>"
        ele = html.fragment_fromstring(html_string)
        val = r.get(ele)
        self.assertIsNone(val)

    def test_type_float(self):
        examples = [
            ("<p data-num=\"3.14159\">Test</p>", "data-num", 3.14159),
            ("<p>26.2 miles</p>", "text", 26.2),
            ("<p>In the 98.325th percentile</p>", "text", 98.325)
        ]
        for example in examples:
            html_string, attr, expected = example
            r = Rule.from_json({
                "name": "url",
                "attr": attr,
                "type": "float"
            })
            ele = html.fragment_fromstring(html_string)
            val = r.get(ele)
            self.assertIsInstance(val, float)
            self.assertEqual(val, expected)

    def test_bad_float(self):
        # should return None
        r = Rule.from_json({
            "name": "url",
            "attr": "text",
            "type": "float"
        })
        html_string = "<div>Nothing to see here</div>"
        ele = html.fragment_fromstring(html_string)
        val = r.get(ele)
        self.assertIsNone(val)

if __name__ == "__main__":
    unittest.main()
