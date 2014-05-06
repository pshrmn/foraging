import os
import shutil
import unittest
import json

from collector.web import app as collect

class CollectTestCase(unittest.TestCase):
    
    def setUp(self):
        collect.app.testing = True
        parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
        real_directory = os.path.abspath(parent_directory)
        collect.SITE_DIRECTORY = os.path.join(parent_directory, 'rules')
        self.app = collect.app.test_client()

    def test_underscore_host(self):
        hosts = [("www.example.com", "www_example_com"),
            ("test.ing", "test_ing")]
        for before, after in hosts:
            self.assertEqual(collect.underscore_host(before), after)
    
    def test_host_folder(self):
        host = "www.example.com"

        folder = collect.host_folder(host)
        expected_folder = os.path.join(collect.SITE_DIRECTORY, "www_example_com")
        self.assertEqual(folder, expected_folder)
        self.assertTrue(os.path.isdir(folder))

        os.rmdir(folder)

    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_rules = {
            "name": "example",
            "index_pages": {
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
        example_saved_rules = {
            "name": "example",
            "index_pages": ["http://www.example.com/pageone.html",
                "http://www.example.com/pagetwo.html" ],
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
        data_folder = os.path.join(collect.SITE_DIRECTORY, 'www_example_com')
        data_file = os.path.join(data_folder, 'example.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules, example_saved_rules)

        # clear out the directory
        os.remove(data_file)
        os.rmdir(data_folder)

if __name__ == "__main__":
    unittest.main()
