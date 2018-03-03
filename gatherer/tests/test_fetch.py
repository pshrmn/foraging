import unittest
from lxml.html import HtmlElement

from gatherer.fetch import Fetch, requests_backend


def fake_backend(url, headers):
    return '<!doctype html><html><body><div>Content</div></body></html>'


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
