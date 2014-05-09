from collector.crawl.group import RuleGroup, Set, ParentSet
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
        rg = RuleGroup(**rules)
        self.assertEqual(rg.tree.name, "default")
        self.assertEqual([child.name for child in rg.tree.children], ["url"])

class SetTestCase(unittest.TestCase):

    def test_set_with_children(self):
        set_json = {
            "name": "foobar",
            "rules": {
                "test": {
                    "name": "test",
                    "selector": "a",
                    "capture": "attr-href"
                }
            },
            "children": {
                "test": {
                    "name": "test",
                    "rules": {
                        "baz": {
                            "name": "baz",
                            "selector": "h1",
                            "capture": "text"
                        }
                    },
                    "children": {}
                }
            }
        }

        foo = Set(**set_json)
        self.assertEqual(foo.name, "foobar")
        self.assertEqual(len(foo.children), 1)

    def test_set_without_children(self):
        set_json = {
            "name": "foobar",
            "rules": {
                "test": {
                    "name": "test",
                    "selector": "a",
                    "capture": "text"
                }
            }
        }
        foo = Set(**set_json)
        self.assertEqual(foo.name, "foobar")
        self.assertEqual(len(foo.children), 0)
    

class ParentSetTestCase(unittest.TestCase):
    pass

if __name__=="__main__":
    unittest.main()
