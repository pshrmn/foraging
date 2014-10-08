from pycollector.filter import numbers
import unittest

class NumberTest(unittest.TestCase):
    """
    test the functions in collector.filter.numbers
    """
    def test_integer(self):
        values = [
            ("5", 5),
            ("13.6", 13),
            ("1,245", 1245)
        ]
        for s, i in values:
            self.assertEqual(numbers.integer(s), i)


    def test_decimal(self):
        values = [
            ("5", 5),
            ("13.6", 13.6),
            ("1,234.56", 1234.56)

        ]
        for s, i in values:
            self.assertEqual(numbers.decimal(s), i)

    def test_clean_number_string(self):
        values = [
            ("1,234,567", "1234567"),
            ("1,3,5,7", "1357"),
            ("73,379.90", "73379.90")
        ]
        for s, i in values:
            self.assertEqual(numbers.clean_number_string(s), i)

    def test_currency_from_string(self):
        values = [
            ("3,139", "3139.00"),
            ("2789.457", "2789.46")
        ]
        for s, i in values:
            self.assertEqual(numbers.currency_from_string(s), i)

    def test_currency_from_number(self):
        values = [
            (3139, "3139.00"),
            (2789.457, "2789.46")
        ]
        for s, i in values:
            self.assertEqual(numbers.currency_from_number(s), i)

if __name__=="__main__":
    unittest.main()
