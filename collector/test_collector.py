import collector
import unittest

class CollectorTestCase(unittest.TestCase):
    
    def test_create_index_page(self):
        rules = {"test":"ing"}
        url = "http://www.example.com"
        index = collector.IndexPage(url, rules)
        self.assertEqual(index.url, url)
        self.assertEqual(index.rules, rules)

    def test_create_data_page(self):
        rules = {"test":"ing"}
        url = "http://www.example.com"
        data = collector.DataPage(url, rules)
        self.assertEqual(data.url, url)
        self.assertEqual(data.rules, rules)

if __name__=="__main__":
    unittest.main()
