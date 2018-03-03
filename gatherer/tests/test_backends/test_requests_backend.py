import unittest
from unittest.mock import patch
import logging

from gatherer.backends import requests_backend

logging.disable(logging.CRITICAL)


# http://stackoverflow.com/questions/15753390/python-mock-requests-and-the-response
class MockResponse:

    def __init__(self, text, status_code):
        self.text = text
        self.status_code = status_code

    @property
    def ok(self):
        return self.status_code == 200


def mocked_200(url, *args, **kwargs):
    return MockResponse("<html></html>", 200)


def mocked_404(*args, **kwargs):
    return MockResponse("<html></html>", 404)


def mocked_empty(*args, **kwargs):
    return MockResponse("", 200)


class RequestsBackendTestCase(unittest.TestCase):

    @patch("gatherer.backends.requests.requests.get", side_effect=mocked_200)
    def test_get_success(self, mock_get):
        text = requests_backend("http://www.example.com")
        self.assertIsNotNone(text)

    @patch("gatherer.backends.requests.requests.get", side_effect=mocked_404)
    def test_get_not_ok(self, mock_get):
        text = requests_backend("http://www.bad-example.com")
        self.assertIsNone(text)

    @patch("gatherer.backends.requests.requests.get", side_effect=mocked_empty)
    def test_get_empty(self, mock_get):
        text = requests_backend("http://www.empty-example.com")
        self.assertIsNone(text)

if __name__ == "__main__":
    unittest.main()
