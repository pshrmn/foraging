from collector.crawl.group import Group
from collector.crawl.page import Page, SelectorSet, Parent
from collector.crawl.rule import Selector, Rule

import unittest
import os
import json
import Queue
from lxml.cssselect import CSSSelector

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
        self.assertIsInstance(self.group.urls, Queue.Queue)

    def test_page_from_json(self):
        # do tests on default page
        page = self.group.page
        self.assertEqual(page.name, "default")
        self.assertFalse(page.index)
        self.assertIsNone(page.next)

        # page with next
        next_json = {
            "name": "default",
            "sets": {},
            "index": True,
            "next": "a.next"
        }
        page_next = Page.from_json(next_json)
        self.assertTrue(page_next.index)
        self.assertIsInstance(page_next.next, CSSSelector)

        # page with next but not default
        other_next_json = {
            "name": "not_default",
            "sets": {},
            "index": True,
            "next": "a.next"
        }
        other_page_next = Page.from_json(other_next_json)
        self.assertNotIsInstance(other_page_next.next, CSSSelector)        

    def test_selector_set_from_json(self):
        selector_set = self.group.page.sets["default"]
        self.assertEqual(selector_set.name, "default")
        self.assertEqual(len(selector_set.pages), 1)
        self.assertIsInstance(selector_set.parent, Parent)

        # when Parent isn't provided RuleSet.parent is None
        other_rule_set = self.group.page.sets["default"].pages["other_page"].sets["default"]
        self.assertNotIsInstance(other_rule_set.parent, Parent)

    def test_parent_from_json(self):
        parent_json = {
            "selector": ".product"
        }
        parent = Parent.from_json(parent_json)
        self.assertEqual(parent.selector, ".product")

        # test low
        parent_json["low"] = 3
        range_parent = Parent.from_json(parent_json)
        self.assertEqual(range_parent.low, 3)

        #test high
        parent_json["high"] = -1
        range_parent = Parent.from_json(parent_json)
        self.assertEqual(range_parent.high, -1)

    def test_selector_from_json(self):
        selector_json = {
            "selector": "a",
            "rules": {
                "url": {
                    "name": "url",
                    "capture": "attr-href"
                },
                "headline": {
                    "name": "headline",
                    "capture": "text"
                }
            }
        }
        selector = Selector.from_json(selector_json)
        self.assertEqual(selector.selector, "a")
        self.assertEqual(len(selector.rules.keys()), 2)

    def test_rule_from_json(self):
        rule_json = {
            "name": "title",
            "capture": "text"
        }
        rule = Rule.from_json(rule_json)
        self.assertEqual(rule.name, "title")
        self.assertEqual(rule.capture, "text")
        
        follow_rule_json = {
            "name": "product_page",
            "capture": "attr-href",
            "follow": True
        }
        follow_rule = Rule.from_json(follow_rule_json)
        self.assertTrue(follow_rule.follow)

if __name__=="__main__":
    unittest.main()
