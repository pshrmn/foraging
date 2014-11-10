import unittest
import os

from collector.crawl import cache

TEST_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))

class CacheFnTestCase(unittest.TestCase):
    def test_clean_url_filename(self):
        # illegal characters /, \, :, *, ?, ", <, >, |
        bad_filename = "\/\\:\*\?\"\<\>\|.html"
        self.assertEqual(cache.clean_url_filename(bad_filename), ".html")
        good_filename = "abc123.html"
        self.assertEqual(cache.clean_url_filename(good_filename), "abc123.html")

    def test_canonical(self):
        # do nothing for now since nothing is implemented for the canonical url, but it can be
        # useful in the future to map multiple 
        pass

    def test_make_folder(self):
        dir_exists = os.path.join(TEST_DIR, "cache")
        self.assertFalse(cache.make_folder(dir_exists))
        dir_does_not_exist = os.path.join(TEST_DIR, "doesnotexist")
        self.assertTrue(cache.make_folder(dir_does_not_exist))
        # delete it so future tests dont' fail because tmp dir already exists
        os.rmdir(dir_does_not_exist)

    def test_make_cache(self):
        tmp_cache = cache.make_cache(TEST_DIR)
        self.assertIsInstance(tmp_cache, cache.Cache)

class CacheTestCase(unittest.TestCase):
    def setUp(self):
        self.cache_dir = os.path.join(TEST_DIR, "cache")
        self.cache = cache.Cache(self.cache_dir)

    def test_Cache(self):
        self.assertEqual(self.cache.folder, self.cache_dir)
        self.assertIsNotNone(self.cache.sites["www_example_com"])

    def test_fetch(self):
        # skipping for now because I don't want to actually make requests
        # will need to override or just test getting already cached files
        pass

    def test_visited(self):
        visited_url = "http://www.example.com/exists.html"
        unvisisted_url = "http://www.example.com/doesnotexist.html"
        self.assertTrue(self.cache.visited(visited_url))
        self.assertFalse(self.cache.visited(unvisisted_url))

    def test_clear(self):
        tmp_path = os.path.join(TEST_DIR, 'tmp')
        # create the structure of a cache
        cache.make_folder(tmp_path)
        tmp_example_path = os.path.join(tmp_path, "cache", "www_example_com")
        cache.make_folder(tmp_example_path)
        with open(os.path.join(tmp_example_path, "httpwww.example.comtmp.html"), "w") as fp:
            fp.write("tmp")
        tmp_cache = cache.make_cache(tmp_path)
        # verify that something exists inside of the cache
        self.assertTrue(tmp_cache.visited("http://www.example.com/tmp.html"))
        tmp_cache.clear()
        self.assertFalse(os.path.exists(tmp_example_path))
        os.rmdir(tmp_cache.folder)
        os.rmdir(tmp_path)

    def test_nuke(self):
        tmp_path = os.path.join(TEST_DIR, 'tmp')
        cache.make_folder(tmp_path)
        tmp_cache = cache.make_cache(tmp_path)
        self.assertTrue(os.path.exists(tmp_cache.folder))
        tmp_cache.nuke()
        self.assertFalse(os.path.exists(tmp_cache.folder))
        os.rmdir(tmp_path)
    
class SiteTestCase(unittest.TestCase):
    def setUp(self):
        parent = os.path.join(TEST_DIR, "cache")
        self.site = cache.Site("www_example_com", parent)

    def test_fetch(self):
        # same deal as CacheTestCase.test_fetch
        pass

    def test_visited(self):
        visited_url = "http://www.example.com/exists.html"
        unvisisted_url = "http://www.example.com/doesnotexist.html"
        self.assertTrue(self.site.visited(visited_url))
        self.assertFalse(self.site.visited(unvisisted_url))

    def test_clear(self):
        cache_folder = os.path.join(TEST_DIR, "cache")
        site_name = "www_example_org"
        site_folder = os.path.join(cache_folder, site_name)
        cache.make_folder(site_folder)
        file_path = os.path.join(site_folder, "file.html")
        with open(file_path, "w") as fp:
            fp.write("temp")
        site = cache.Site(site_name, cache_folder)
        self.assertTrue(os.path.isfile(file_path))
        site.clear()
        self.assertFalse(os.path.isfile(file_path))

if __name__=="__main__":
    unittest.main()
