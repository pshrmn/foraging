import unittest

from gatherer.rule import Rule
from gatherer.errors import BadJSONError


class RuleTestCase(unittest.TestCase):

    def test_from_json(self):
        rules = [
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
            {}
        ]
        for rule_json in bad_rules:
            with self.assertRaises(BadJSONError):
                Rule.from_json(rule_json)


if __name__ == "__main__":
    unittest.main()
