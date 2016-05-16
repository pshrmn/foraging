import unittest
import requests
import types

from gatherer.backends import session_backend


class RequestsBackendTestCase(unittest.TestCase):
    pass


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

if __name__ == "__main__":
    unittest.main()
