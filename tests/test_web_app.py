import os
import shutil
import unittest
import json

from collector.web import app as collect

class CollectTestCase(unittest.TestCase):
    
    def setUp(self):
        collect.app.testing = True
        collect.groups = {
            "test":"ing"
        }
        self.directory = collect.directory
        self.app = collect.app.test_client()

    def tearDown(self):
        example_directory = '%s/rules/example_com' % self.directory
        if os.path.isdir(example_directory):
            shutil.rmtree(example_directory)

    def test_get_groups(self):
        groups = self.app.get('/groups')
        self.assertEqual(groups.headers.get('Content-Type'), 'application/json')
        self.assertEqual(json.loads(groups.data), collect.groups)

    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_rules = {
            "host": "example.com",
            "name": "examples",
            "rules": {
                "links": {
                    "name": "links",
                    "capture": "attr-href",
                    "selector": "a"
                },
                "images": {
                    "name": "images",
                    "capture": "attr-src",
                    "selector": "#main img"
                }
            }
        }
        rules = self.app.post('/upload', headers=headers, data=json.dumps(example_rules))
        self.assertEqual(rules.status_code, 200)
        data_file = os.path.join(self.directory, 'rules', 'example_com', 'rules.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules['examples'], example_rules['rules'])

    def test_upload_multiple(self):
        headers = [('Content-Type', 'application/json')]
        link_rules = {
            "host": "example.com",
            "name": "links",
            "rules": {
                "links": {
                    "name": "links",
                    "capture": "attr-href",
                    "selector": "a"
                }, 
                "next": {
                    "name": "next",
                    "capture": "attr-href",
                    "selector": "a.next"
                }
            }
        }
        image_rules = {
            "host": "example.com",
            "name": "images",
            "rules": {
                "images": {
                    "name": "images",
                    "capture": "attr-src",
                    "selector": "#main img"
                }
            }
        }
        rules = self.app.post('/upload', headers=headers, data=json.dumps(link_rules))
        self.assertEqual(rules.status_code, 200)
        rules = self.app.post('/upload', headers=headers, data=json.dumps(image_rules))
        self.assertEqual(rules.status_code, 200)
        data_file = os.path.join(self.directory, 'rules', 'example_com', 'rules.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules['links'], link_rules['rules'])
        self.assertEqual(saved_rules['images'], image_rules['rules'])
        

if __name__ == "__main__":
    unittest.main()
