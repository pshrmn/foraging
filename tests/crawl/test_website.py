from collector.crawl.website import Website, RuleGroup
import unittest
import os
import json

parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
DIRECTORY = os.path.abspath(parent_directory)

class WebsiteTestCase(unittest.TestCase):
    def setUp(self):
        self.folder = os.path.join(DIRECTORY, 'rules', 'test_site_com')

    def test_populate(self):
        ws = Website(self.folder)
        ws.populate()
        self.assertEqual(ws.queue.qsize(), 3)

def open_group(filename):
    with open(filename) as fp:
        rules = json.load(fp)
    return rules

class RuleGroupTestCase(unittest.TestCase):
    def test_constructor(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'product.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_pages"], rules["rules"])
        self.assertEqual(rg.sets.keys(), ["default", "url"])
        self.assertEqual(rg.set_order, ["default", "url"])

    def test_prevent_circular_order(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'circular.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_pages"], rules["rules"])
        self.assertEqual(rg.set_order, ["default", "url"])        

    def test_chain_order(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'chain.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_pages"], rules["rules"])
        self.assertEqual(rg.set_order, ["default", "page2", "page4", "page3"])

if __name__=="__main__":
    unittest.main()
