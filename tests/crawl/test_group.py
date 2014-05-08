from collector.crawl.website import Website, RuleGroup
import unittest
import os
import json

parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
DIRECTORY = os.path.abspath(parent_directory)

def open_group(filename):
    with open(filename) as fp:
        rules = json.load(fp)
    return rules

class RuleGroupTestCase(unittest.TestCase):
    def test_constructor(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'product.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_urls"], rules["rules"])
        self.assertEqual(rg.index_set.name, "default")
        self.assertEqual([curr_set.name for curr_set in rg.ordered_sets], ["url"])

    def test_prevent_circular_order(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'circular.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_urls"], rules["rules"])
        self.assertEqual([curr_set.name for curr_set in rg.ordered_sets], ["url"])        

    def test_chain_order(self):
        filename = os.path.join(DIRECTORY, 'rules', 'test_site_com', 'chain.json')
        rules = open_group(filename)
        rg = RuleGroup(rules["name"], rules["index_urls"], rules["rules"])
        self.assertEqual([curr_set.name for curr_set in rg.ordered_sets], ["page2", "page4", "page3"])

if __name__=="__main__":
    unittest.main()
