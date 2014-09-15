import os
import shutil
import unittest
import json

from collector.web import server

class CollectTestCase(unittest.TestCase):
    
    def setUp(self):
        server.app.testing = True
        parent_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir)
        real_directory = os.path.abspath(parent_directory)
        server.SITE_DIRECTORY = os.path.join(parent_directory, 'rules')
        self.app = server.app.test_client()

    def test_underscore_host(self):
        hosts = [("www.example.com", "www_example_com"),
            ("test.ing", "test_ing")]
        for before, after in hosts:
            self.assertEqual(server.underscore_host(before), after)
    
    def test_host_folder(self):
        host = "www.example.com"

        folder = server.host_folder(host)
        expected_folder = os.path.join(server.SITE_DIRECTORY, "www_example_com")
        self.assertEqual(folder, expected_folder)
        self.assertTrue(os.path.isdir(folder))

        os.rmdir(folder)

    def test_empty_upload(self):
        headers = [('Content-Type', 'application/json')]
        resp = self.app.post('/upload', headers=headers)
        resp_json = json.loads(resp.data)
        self.assertTrue(resp_json["error"])

    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_group = {
            "name": "example",
            "index_urls": [
                "http://www.example.com/pageone.html",
                "http://www.example.com/pagetwo.html"
            ],
            "pages": {
                "default": {
                    "name": "default",
                    "index": False,
                    "sets": {
                        "default": {
                            "name": "default",
                            "rules": {
                                "links": {
                                    "name": "links",
                                    "capture": "attr-href",
                                    "selector": "a"
                                },
                                "images": {
                                    "name": "images",
                                    "capture": "attr-src",
                                    "selector": "#main img",
                                }
                            }
                        }
                    }
                }
            }
        }

        upload = {
            "group": example_group,
            "site": "www.example.com"
        }

        # overwrite test_upload to prevent multiprocessing error showing up in output
        server.test_upload = lambda x: None

        resp = self.app.post('/upload', headers=headers, data=json.dumps(upload))
        self.assertEqual(resp.status_code, 200)
        resp_json = json.loads(resp.data)
        self.assertFalse(resp_json["error"])

        data_folder = os.path.join(server.SITE_DIRECTORY, 'www_example_com')
        data_file = os.path.join(data_folder, 'example.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules, example_group)

        # clear out the directory
        os.remove(data_file)
        os.rmdir(data_folder)

if __name__ == "__main__":
    unittest.main()
