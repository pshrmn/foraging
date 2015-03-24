import os
import unittest
import json

from uploador import server


class CollectTestCase(unittest.TestCase):

    def setUp(self):
        server.app.testing = True
        file_dir = os.path.dirname(os.path.realpath(__file__))
        server.SITE_DIRECTORY = os.path.join(file_dir, 'rules')
        self.app = server.app.test_client()

    def test_underscore_host(self):
        hosts = [("www.example.com", "www_example_com"),
                 ("test.ing", "test_ing")]
        for before, after in hosts:
            self.assertEqual(server.underscore_host(before), after)

    def test_host_folder(self):
        host = "www.example.com"

        folder = server.host_folder(host)
        expected_folder = os.path.join(server.SITE_DIRECTORY,
                                       "www_example_com")
        self.assertEqual(folder, expected_folder)
        self.assertTrue(os.path.isdir(folder))

        os.rmdir(folder)

    def test_empty_upload(self):
        headers = [('Content-Type', 'application/json')]
        resp = self.app.post('/upload', headers=headers)
        resp_json = json.loads(resp.data.decode())
        self.assertTrue(resp_json["error"])

    def test_upload(self):
        headers = [('Content-Type', 'application/json')]
        example_page = {
            "name": "example",
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [],
                                    "attrs": [],
                                    "selector": "a"
                                }
                            ],
                            "attrs": [],
                            "selector": "h2"
                        },
                        {
                            "children": [],
                            "attrs": [],
                            "selector": "p"
                        },
                        {
                            "children": [],
                            "attrs": [],
                            "selector": "img"
                        }
                    ],
                    "attrs": [],
                    "selector": "div.site"
                }
            ],
            "attrs": [],
            "selector": "body"
        }

        upload = {
            "name": "example",
            "site": "www.example.com",
            "page": example_page,
        }

        resp = self.app.post('/upload', headers=headers,
                             data=json.dumps(upload))
        self.assertEqual(resp.status_code, 200)
        resp_json = json.loads(resp.data.decode())
        self.assertFalse(resp_json["error"])

        data_folder = os.path.join(server.SITE_DIRECTORY, 'www_example_com')
        data_file = os.path.join(data_folder, 'example.json')
        with open(data_file) as fp:
            saved_rules = json.load(fp)
        self.assertEqual(saved_rules, example_page)

        # clear out the directory
        os.remove(data_file)
        os.rmdir(data_folder)

    def test_sync(self):
        pass

if __name__ == "__main__":
    unittest.main()
