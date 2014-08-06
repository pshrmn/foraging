from collector.crawl.group import Group
from collector.crawl.page import Page
from collector.crawl.rules import RuleSet, Parent, Rule

import unittest
import os
import json

parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
DIRECTORY = os.path.abspath(parent_directory)

def open_group(filename):
    with open(filename) as fp:
        rules = json.load(fp)
    return rules

class FromJSONTestCase(unittest.TestCase):
    def setUp(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'product.json')
        rules = open_group(filename)
        self.group = Group.from_json(rules)

    def test_group_from_json(self):
        self.assertEqual(self.group.name, "product")
        self.assertEqual(len(self.group.pages.keys()), 2)

    def test_page_from_json(self):
        # do tests on default page
        page = self.group.pages["default"]
        self.assertEqual(page.name, "default")

    def test_rule_set_from_json(self):
        rule_set = self.group.pages["default"].sets["default"]
        self.assertEqual(rule_set.name, "default")

    def test_parent_from_json(self):
        parent_json = {
            "selector": ".product"
        }
        parent = Parent.from_json(parent_json)
        self.assertEqual(parent.selector, ".product")

        parent_json["which"] = 3
        range_parent = Parent.from_json(parent_json)
        self.assertEqual(range_parent.range, 3)

    def test_rule_from_json(self):
        rule_json = {
            "name": "title",
            "selector": "h1",
            "capture": "text"
        }
        rule = Rule.from_json(rule_json)
        self.assertEqual(rule.name, "title")
        self.assertEqual(rule.capture, "text")
        self.assertEqual(rule.selector, "h1")
        
        follow_rule_json = {
            "name": "product_page",
            "selector": ".product a",
            "capture": "attr-href",
            "follow": True
        }
        follow_rule = Rule.from_json(follow_rule_json)
        self.assertTrue(follow_rule.follow)

if __name__=="__main__":
    unittest.main()
