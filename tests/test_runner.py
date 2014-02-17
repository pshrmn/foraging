from collector import runner
import os
import unittest

test_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'data')

class RunnerTestCase(unittest.TestCase):

    def setUp(self):
        # reset directory to runner.default_directory
        runner.set_directory()

    def test_set_directory(self):
        runner.set_directory(test_directory)
        self.assertEqual(runner.directory, test_directory)
        runner.set_directory()
        self.assertEqual(runner.directory, runner.default_directory)

    def test_get_sites(self):
        runner.set_directory(test_directory)
        sites = runner.get_sites()
        self.assertEqual(sites, ['example.com'])

if __name__=="__main__":
    unittest.main()
