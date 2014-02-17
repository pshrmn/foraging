import os
import unittest

from collector import runner

class RunnerTestCase(unittest.TestCase):

    def setUp(self):
        runner.settings.rules_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'data')

    def test_get_sites(self):
        sites = runner.get_sites()
        self.assertEqual(sites, ['example.com'])

if __name__=="__main__":
    unittest.main()
