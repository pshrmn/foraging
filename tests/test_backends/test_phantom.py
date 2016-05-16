import unittest
from unittest.mock import patch
import os

from gatherer.backends import phantom_backend

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
FILE_DIRECTORY = os.path.join(TEST_DIRECTORY, "fake_files")

class MockProcess(object):

    def __init__(self, text):
        self.text = text

    def communicate(self):
        return (self.text, False)


def mocked_200(*args, **kwargs):
    return MockProcess(b"<html></html>")


def mocked_empty(*args, **kwargs):
    return MockProcess(b"")


class PhantomBackendTestCase(unittest.TestCase):

    def setUp(self):
        self.phantom_path = os.path.join(FILE_DIRECTORY, 'phantom.txt')
        self.js_path = os.path.join(FILE_DIRECTORY, 'getscript.js')

    def test_phantom_backend(self):
        """
        verify that the phantom_backend closure requires that the
        phantom_path and js_path files exist
        """
        # non-existent phantomjs path
        with self.assertRaises(ValueError):
            phantom_backend('fake_path.exe', self.js_path)
        # non-existent js path
        with self.assertRaises(ValueError):
            phantom_backend(self.phantom_path, 'fake_path.js')
        # both paths exist
        try:
            phantom_backend(self.phantom_path, self.js_path)
        except ValueError:
            self.fail('phantom_backend raises ValueError')


    @patch("gatherer.backends.phantom.subprocess.Popen", side_effect=mocked_200)
    def test_get_success(self, mock_get):
        get = phantom_backend(self.phantom_path, self.js_path)
        text = get("http://www.example.com")
        self.assertIsNotNone(text)

    @patch("gatherer.backends.phantom.subprocess.Popen", side_effect=mocked_empty)
    def test_get_empty(self, mock_get):
        get = phantom_backend(self.phantom_path, self.js_path)
        text = get("http://www.empty-example.com")
        self.assertIsNone(text)

if __name__ == "__main__":
    unittest.main()
