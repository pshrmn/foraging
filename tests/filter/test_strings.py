from collector.filter import strings
import unittest

class NumberTest(unittest.TestCase):
    """
    test the functions in collector.filter.strings
    """
    def test_clean_whitespace(self):
        values = [
            ("   this\nis\ta   test", "this is a test"),
            ("\n\nof the    emergency", "of the emergency"),
            ("broadcast\n         system", "broadcast system")
        ]
        for s, i in values:
            self.assertEqual(strings.clean_whitespace(s), i)


    def test_clean_extra_spaces(self):
        values = [
            ("   this\nis\ta   test", "this\nis\ta test"),
            ("\n\nof the    emergency", "of the emergency"),
            ("broadcast\n         system", "broadcast\n system")
        ]
        for s, i in values:
            self.assertEqual(strings.clean_extra_spaces(s), i)

if __name__=="__main__":
    unittest.main()
