import unittest
import os
import shutil

from gatherer.cache import clean_url_filename, url_info, Cache

cache_directory = os.path.join(os.getcwd(), "tests", "test_cache")


class CacheHelpersTestCase(unittest.TestCase):

    def test_clean_url_filename(self):
        # \ / : * ? " < > |
        cases = [
            ("http://www.example.com", "httpwww.example.com"),
            ("url?query=string", "urlquery=string"),
            ("test\\*\"\<\>\|", "test")
        ]
        for dirty, clean in cases:
            self.assertEqual(clean_url_filename(dirty), clean)

    def test_url_info(self):
        cases = [
            ("http://www.example.com", ("www_example_com", "httpwww.example.com")),
            ("http://www.example.com/somepage.html", ("www_example_com", "httpwww.example.comsomepage.html")),
            ("http://www.example.com/otherpage", ("www_example_com", "httpwww.example.comotherpage")),
        ]
        for dirty, clean in cases:
            self.assertEqual(url_info(dirty), clean)


class CacheTestCase(unittest.TestCase):

    def test_cache_setup(self):
        c = Cache(cache_directory)
        self.assertEqual(c.folder, cache_directory)
        # verify that each folder has been loaded
        for name in os.listdir(os.path.join(cache_directory)):
            if os.path.isdir(os.path.join(cache_directory, name)):
                self.assertIn(name, c.sites)

    def test_cache_get(self):
        c = Cache(cache_directory)
        exists = [
            "http://www.example.com/somepage.html",
            "http://www.example.com/otherpage"
        ]
        for filename in exists:
            self.assertIsNotNone(c.get(filename))
        does_not_exist = [
            "http://www.example.com/doesnotexist.html",
            "https://en.wikipedia.org/wiki/Python_(programming_language)"
        ]
        for filename in does_not_exist:
            self.assertIsNone(c.get(filename))

    def test_cache_save_existing(self):
        c = Cache(cache_directory)
        # verify that it adds a file to a pre-existing cached site
        html_string = "<html></html".encode("utf-8")
        example_url = "http://www.example.com/testpage.html"
        d, f = url_info(example_url)
        full_save_name = os.path.join(cache_directory, d, f)
        self.assertNotIn(full_save_name, c.sites[d])

        c.save(example_url, html_string)

        self.assertTrue(os.path.exists(full_save_name))
        self.assertIn(full_save_name, c.sites[d])
        # cleanup
        os.remove(full_save_name)

    def test_cache_save_new(self):
        c = Cache(cache_directory)
        html_string = "<html></html".encode("utf-8")
        sample_url = "http://www.sample.com/testpage.html"
        d, f = url_info(sample_url)
        directory = os.path.join(cache_directory, d)
        # the www_sample_com directory should exist until the file is cached
        self.assertFalse(os.path.exists(directory))
        self.assertNotIn(d, c.sites)

        c.save(sample_url, html_string)

        full_save_name = os.path.join(directory, f)
        self.assertIn(full_save_name, c.sites[d])
        self.assertTrue(os.path.exists(full_save_name))

        # remove this after the test is done
        shutil.rmtree(directory)

if __name__ == "__main__":
    unittest.main()
