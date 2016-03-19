import unittest
import os
from lxml.html import HtmlElement

from gatherer.fetch import Fetch, requests_backend, phantom_backend

file_directory = os.path.join(os.getcwd(), "tests", "test_files")


def fake_backend(url, headers):
    return '<!doctype html><html><body><div>Content</div></body></html>'


class PhantomBackendTestCase(unittest.TestCase):

    def test_phantom_backend(self):
        """
        verify that the phantom_backend closure requires that the
        phantom_path and js_path files exist
        """
        phantom_path = os.path.join(file_directory, 'phantom.txt')
        js_path = os.path.join(file_directory, 'getscript.js')
        # non-existent phantomjs path
        with self.assertRaises(ValueError):
            phantom_backend('fake_path.exe', js_path)
        # non-existent js path
        with self.assertRaises(ValueError):
            phantom_backend(phantom_path, 'fake_path.js')
        # both paths exist
        try:
            phantom_backend(phantom_path, js_path)
        except ValueError:
            self.fail('phantom_backend raises ValueError')


class FetchTestCase(unittest.TestCase):

    def test_fetch_user_agent_header(self):
        bad_headers = [
            None,
            {},
            {'origin': 'http://example.com'}
        ]
        for header in bad_headers:
            with self.assertRaises(ValueError):
                Fetch(fake_backend, header)
        f = Fetch(fake_backend, {'User-Agent': 'my fetcher'})
        self.assertTrue('User-Agent' in f.headers)

    def test_simple_get(self):
        f = Fetch(fake_backend, {'User-Agent': 'my fetcher'}, sleep_time=0)
        dom = f.get('http://www.example.com')
        self.assertIsInstance(dom, HtmlElement)

    def test_default_values(self):
        f = Fetch(headers={'User-Agent': 'my fetcher'})
        self.assertEqual(f.backend, requests_backend)
        self.assertEqual(f.sleep_time, 5)


if __name__ == "__main__":
    unittest.main()
