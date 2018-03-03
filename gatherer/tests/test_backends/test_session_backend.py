import unittest
import requests
import types

from gatherer.backends import session_backend


class MockResponse:

    def __init__(self, text, status_code):
        self.text = text
        self.status_code = status_code

    @property
    def ok(self):
        return self.status_code == 200


class MockSession(object):

    def __init__(self, text, status_code):
        self.text = text
        self.status_code = status_code

    def get(self, url, *args, **kwargs):
        return MockResponse(self.text, self.status_code)


class SessionBackendTestCase(unittest.TestCase):

    def test_create_success(self):
        session = requests.Session()
        get = session_backend(session)
        self.assertIsInstance(get, types.FunctionType)

    def test_create_fail(self):
        """
        when the session doesn't have a get method, a
        ValueError should be raised
        """
        with self.assertRaises(ValueError):
            fake_session = None
            backend = session_backend(fake_session)

    def test_get_success(self):
        session = MockSession("<html></html>", 200)
        backend = session_backend(session)
        text = backend("http://www.example.com")
        self.assertIsNotNone(text)

    def test_get_not_ok(self):
        session = MockSession("<html></html>", 404)
        backend = session_backend(session)
        text = backend("http://www.bad-example.com")
        self.assertIsNone(text)

    def test_get_empty(self):
        session = MockSession("", 200)
        backend = session_backend(session)
        text = backend("http://www.empty-example.com")
        self.assertIsNone(text)

if __name__ == "__main__":
    unittest.main()
