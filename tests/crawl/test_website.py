from collector.crawl.website import Website
import unittest
import os

parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
DIRECTORY = os.path.abspath(parent_directory)

class CollectorTestCase(unittest.TestCase):

    def setUp(self):
        self.folder = os.path.join(DIRECTORY, 'rules', 'test_site_com')

    def test_populate(self):
        ws = Website(self.folder)
        ws.populate()
        self.assertEqual(ws.queue.qsize(), 3)

if __name__=="__main__":
    unittest.main()
