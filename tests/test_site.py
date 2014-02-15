from collector import site, exceptions
import unittest
import os

directory = os.path.dirname(os.path.realpath(__file__))

class CollectorTestCase(unittest.TestCase):
    
    def test_create_index_page(self):
        bad_rules = {"test":"ing"}
        good_rules = {"links": {"name": "links", "selector": "a", "capture": "attr-href"}}
        url = "http://www.example.com"
        good_index = site.IndexPage(url, good_rules)
        self.assertEqual(good_index.url, url)
        self.assertEqual(good_index.rules, good_rules)
        self.assertRaises(exceptions.RulesException, site.IndexPage, url, bad_rules)

    def test_create_data_page(self):
        rules = {"test":"ing"}
        url = "http://www.example.com"
        data = site.DataPage(url, rules)
        self.assertEqual(data.url, url)
        self.assertEqual(data.rules, rules)

    def test_new_site(self):
        s = site.Site("%s\\data\\example.com" % directory)
        self.assertEqual(s.domain, "example.com")
        link_pages = []
        # iterate over queue and place in list
        while not s.index_pages.empty():
            link_pages.append(s.index_pages.get())
        example_links = ["http://www.example.com/index1", "http://www.example.com/index2"]
        self.assertEqual(link_pages, example_links)

    def test_new_site_trailing_slash(self):
        s = site.Site("%s\\data\\example.com\\" % directory)
        self.assertEqual(s.domain, "example.com")

if __name__=="__main__":
    unittest.main()
