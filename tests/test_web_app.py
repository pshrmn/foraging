import os
import shutil
import unittest
import json

from collector.web import app as collect

class CollectTestCase(unittest.TestCase):
    
    def setUp(self):
        collect.app.testing = True
        collect.SITE_DIRECTORY = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')
        self.app = collect.app.test_client()


    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_rules = {
            "site": "www.example.com",
            "indices": {
                "http://www.example.com/pageone.html": True,
                "http://www.example.com/pagetwo.html": True
            },
            "rules": {
                "links": {
                    "name": "links",
                    "capture": "attr-href",
                    "selector": "a",
                    "index": True
                },
                "images": {
                    "name": "images",
                    "capture": "attr-src",
                    "selector": "#main img",
                    "index": False
                }
            }
        }
        rules = self.app.post('/upload', headers=headers, data=json.dumps(example_rules))
        self.assertEqual(rules.status_code, 200)
        data_file = os.path.join(collect.SITE_DIRECTORY, 'www-example-com.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules, example_rules)
        
if __name__ == "__main__":
    unittest.main()
