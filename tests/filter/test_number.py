from collector.filter import numbers
import unittest

class NumberTest(unittest.TestCase):
    """
    test the functions in collector.filter.number
    """
    def test_integer(self):
        values = [
            ("5", 5),
            ("13.6", 13),
            ("1,245", 1245)
        ]
        for s, i in values:
            self.assertEqual(numbers.integer(s), i)


if __name__=="__main__":
    unittest.main()
