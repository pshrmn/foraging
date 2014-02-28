from collector import exceptions
from collector.website import Website, IndexPage, DataPage
import unittest
import os

# don't log while testing
import logging
logging.disable(logging.CRITICAL)

directory = os.path.dirname(os.path.realpath(__file__))

class CollectorTestCase(unittest.TestCase):
    
    def test_create_index_page(self):
        bad_rules = {"test":"ing"}
        good_rules = {"links": {"name": "links", "selector": "a", "capture": "attr-href"}}
        url = "http://www.example.com"
        good_index = IndexPage(url, good_rules)
        self.assertEqual(good_index.url, url)
        self.assertEqual(good_index.rules, good_rules)
        self.assertRaises(exceptions.RulesException, IndexPage, url, bad_rules)

    def test_create_data_page(self):
        rules = {"test":"ing"}
        url = "http://www.example.com"
        data = DataPage(url, rules)
        self.assertEqual(data.url, url)
        self.assertEqual(data.rules, rules)

    def test_new_site(self):
        # don't care about rules
        s = Website("www.example.com", [], [],
            ["http://www.example.com/index1", "http://www.example.com/index2"])
        self.assertEqual(s.domain, "www.example.com")
        link_pages = []
        # iterate over queue and place in list
        while not s.index_pages.empty():
            link_pages.append(s.index_pages.get())
        example_links = ["http://www.example.com/index1", "http://www.example.com/index2"]
        self.assertEqual(link_pages, example_links)

    def test_new_site_sleep(self):
        for arg, val in [(None, 5), (10, 10), (4, 5)]:
            # don't care about rules or start_pages
            s = Website("www.example.com", [], [], [], arg)
            self.assertEqual(s.sleep, val)

if __name__=="__main__":
    unittest.main()
