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
        collect.RULES_DIRECTORY = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')
        self.example = os.path.join(collect.RULES_DIRECTORY, 'www_example_com')
        if not os.path.isdir(self.example):
            os.mkdir(self.example)
            open(os.path.join(self.example, 'rules.json'), 'w').close()
            open(os.path.join(self.example, 'index.txt'), 'w').close()
        self.app = collect.app.test_client()

    def tearDown(self):
        # reset file contents
        open(os.path.join(self.example, 'rules.json'), 'w').close()
        open(os.path.join(self.example, 'index.txt'), 'w').close()

    def test_site_folder(self):
        domain = "www.example.com"
        expected_folder = os.path.join(collect.RULES_DIRECTORY, 'www_example_com')
        self.assertEqual(collect.site_folder(domain), expected_folder)

    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_rules = {
            "host": "www.example.com",
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
        data_file = os.path.join(collect.RULES_DIRECTORY, 'www_example_com', 'rules.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules['examples'], example_rules['rules'])

    def test_upload_multiple(self):
        headers = [('Content-Type', 'application/json')]
        link_rules = {
            "host": "www.example.com",
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
            "host": "www.example.com",
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
        data_file = os.path.join(collect.RULES_DIRECTORY, 'www_example_com', 'rules.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules['links'], link_rules['rules'])
        self.assertEqual(saved_rules['images'], image_rules['rules'])
        
    def test_add_index(self):
        url = 'http://www.example.com/index.html'
        rules = self.app.get('/addindex?name=%s' % url)
        self.assertEqual(rules.status_code, 200)
        data_file = os.path.join(collect.RULES_DIRECTORY, 'www_example_com', 'index.txt')
        with open(data_file) as fp:
            saved_indices = fp.read().splitlines()
        self.assertEqual(saved_indices, [url])

    def test_remove_index(self):
        url = 'http://www.example.com/index.html'
        data_file = os.path.join(collect.RULES_DIRECTORY, 'www_example_com', 'index.txt')
        with open(data_file, 'w') as fp:
            fp.write('\n'.join([url, 'http://www.example.com/index2.html']))
        with open(data_file) as fp:
            x = fp.read()
        rules = self.app.get('/removeindex?name=%s' % url)
        self.assertEqual(rules.status_code, 200)
        with open(data_file) as fp:
            x = fp.read()
            saved_indices = x.splitlines()#fp.read().splitlines()
        self.assertEqual(saved_indices, ['http://www.example.com/index2.html'])

if __name__ == "__main__":
    unittest.main()
