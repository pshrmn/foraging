import unittest
import os
import shutil
import time

from gatherer.cache import clean_url_filename, url_info, Cache

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CACHE_DIRECTORY = os.path.join(TEST_DIRECTORY, "cache")


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
            ("http://www.example.com/foo?bar=quux", ("www_example_com", "httpwww.example.comfoobar=quux"))
        ]
        for dirty, clean in cases:
            self.assertEqual(url_info(dirty), clean)


class CacheTestCase(unittest.TestCase):

    def test_cache_setup(self):
        c = Cache(CACHE_DIRECTORY)
        self.assertEqual(c.folder, CACHE_DIRECTORY)
        # verify that each folder has been loaded
        for name in os.listdir(os.path.join(CACHE_DIRECTORY)):
            if os.path.isdir(os.path.join(CACHE_DIRECTORY, name)):
                self.assertIn(name, c.sites)

    def test_cache_get(self):
        c = Cache(CACHE_DIRECTORY)
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
        c = Cache(CACHE_DIRECTORY)
        # verify that it adds a file to a pre-existing cached site
        html_string = "<html></html>".encode("utf-8")
        example_url = "http://www.example.com/testpage.html"
        d, f = url_info(example_url)
        full_save_name = os.path.join(CACHE_DIRECTORY, d, f)
        self.assertNotIn(full_save_name, c.sites[d])

        c.save(example_url, html_string)

        self.assertTrue(os.path.exists(full_save_name))
        self.assertIn(full_save_name, c.sites[d])
        # cleanup
        os.remove(full_save_name)

    def test_cache_save_new(self):
        c = Cache(CACHE_DIRECTORY)
        html_string = "<html></html>".encode("utf-8")
        sample_url = "http://www.sample.com/testpage.html"
        d, f = url_info(sample_url)
        DIRECTORY = os.path.join(CACHE_DIRECTORY, d)
        # the www_sample_com directory should not exist until the file is cached
        self.assertFalse(os.path.exists(DIRECTORY))
        self.assertNotIn(d, c.sites)

        c.save(sample_url, html_string)

        full_save_name = os.path.join(DIRECTORY, f)
        self.assertIn(full_save_name, c.sites[d])
        self.assertTrue(os.path.exists(full_save_name))

        # remove this after the test is done
        shutil.rmtree(DIRECTORY)

    def test_cache_max_age(self):
        # create a new cache folder
        EXPIRE_CACHE_DIRECTORY = os.path.join(TEST_DIRECTORY, "test_cache_expire")
        os.makedirs(EXPIRE_CACHE_DIRECTORY, exist_ok=True)

        # create two files, the first won't have its modified time changed and the
        # second will have its last modified time to be more than 60 seconds ago
        html_string = "<html></html>".encode("utf-8")
        first_url = "http://www.example.com/testpage.html"
        second_url = "http://www.example.com/testpage2.html"
        first_info = url_info(first_url)
        second_info = url_info(second_url)

        # the two urls share the same domain, so only need to create first
        full_domain_path = os.path.join(EXPIRE_CACHE_DIRECTORY, first_info[0])
        os.makedirs(full_domain_path, exist_ok=True)
        first_path = os.path.join(full_domain_path, first_info[1])
        second_path = os.path.join(full_domain_path, second_info[1])
        with open(first_path, "wb") as fp:
            fp.write(html_string)
        with open(second_path, "wb") as fp:
            fp.write(html_string)

        # verify that the second path exists at this point in time
        self.assertTrue(os.path.isfile(second_path))

        # modify the last modified time of the second file to
        # two minutes ago
        now = int(time.time())
        then = now - 120
        os.utime(second_path, (then, then))

        # now that thats all taken care of, actually create the cache
        c = Cache(EXPIRE_CACHE_DIRECTORY, max_age=60)
        # only the first url should exist in the cache
        self.assertIn(first_path, c.sites[first_info[0]])
        # and the second path should no longer exist
        self.assertFalse(os.path.isfile(second_path))

        shutil.rmtree(EXPIRE_CACHE_DIRECTORY)

    def test_cache_expire_during_get(self):
        # create a new cache folder
        EXPIRE_CACHE_DIRECTORY = os.path.join(TEST_DIRECTORY, "test_cache_expire_during")
        os.makedirs(EXPIRE_CACHE_DIRECTORY, exist_ok=True)

        # create two files, the first won't have its modified time changed and the
        # second will have its last modified time to be more than 60 seconds ago
        html_string = "<html></html>".encode("utf-8")
        first_url = "http://www.example.com/testpage.html"
        first_info = url_info(first_url)

        # the two urls share the same domain, so only need to create first
        full_domain_path = os.path.join(EXPIRE_CACHE_DIRECTORY, first_info[0])
        os.makedirs(full_domain_path, exist_ok=True)
        first_path = os.path.join(full_domain_path, first_info[1])
        with open(first_path, "wb") as fp:
            fp.write(html_string)

        self.assertTrue(os.path.isfile(first_path))

        c = Cache(EXPIRE_CACHE_DIRECTORY, max_age=60)
        self.assertIsNotNone(c.get(first_url))

        # modify the last modified time of the file to two minutes ago
        now = int(time.time())
        then = now - 120
        os.utime(first_path, (then, then))

        # trying to get it again should remove it
        self.assertIsNone(c.get(first_url))
        self.assertFalse(os.path.isfile(first_path))

        shutil.rmtree(EXPIRE_CACHE_DIRECTORY)

if __name__ == "__main__":
    unittest.main()
