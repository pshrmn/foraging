import os
import unittest
import shutil

from collector import manage

class ManageTestCase(unittest.TestCase):

    def setUp(self):
        manage.settings.rules_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'data')

    def test_get_sites(self):
        sites = manage.get_sites()
        self.assertEqual(sites, [os.path.join(manage.settings.rules_directory, 'example.com')])


class NewSiteTestCase(unittest.TestCase):
    def setUp(self):
        self.dirname = os.path.join(manage.settings.rules_directory, 'www_foo_bar')

    def tearDown(self):
        shutil.rmtree(self.dirname)

    def test_new_site(self):
        is_new = manage.new_site("www.foo.bar")
        self.assertTrue(is_new)
        dirname = os.path.join(manage.settings.rules_directory, 'www_foo_bar')
        self.assertTrue(os.path.isdir(dirname))
        for filename in ['data.json', 'links.json', 'pages.txt']:
            self.assertTrue(os.path.exists(os.path.join(dirname, filename)))
    
    def test_existing_site(self):
        manage.new_site("www.foo.bar")
        is_new = manage.new_site("www.foo.bar")
        self.assertFalse(is_new)


if __name__=="__main__":
    unittest.main()
