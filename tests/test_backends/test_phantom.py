import unittest
import os

from gatherer.backends import phantom_backend

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
FILE_DIRECTORY = os.path.join(TEST_DIRECTORY, "fake_files")


class PhantomBackendTestCase(unittest.TestCase):

    def test_phantom_backend(self):
        """
        verify that the phantom_backend closure requires that the
        phantom_path and js_path files exist
        """
        phantom_path = os.path.join(FILE_DIRECTORY, 'phantom.txt')
        js_path = os.path.join(FILE_DIRECTORY, 'getscript.js')
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

if __name__ == "__main__":
    unittest.main()
