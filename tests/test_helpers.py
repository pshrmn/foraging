import unittest
from collector import helpers

class HelperTestCase(unittest.TestCase):
    
    def test_dollars(self):
        money = [
            ("$9.99", 9.99),
            ("$1,024.00", 1024),
            ("$1,2", 12),
            ("the price is $1.99", 1.99)
        ]
        for word, number in money:
            self.assertEqual(number, helpers.dollars(word))
        

    def test_lowercase(self):
        words = [
            ("alright", "alright"),
            ("YELLING", "yelling"),
            ("Cool, calm, and Collected", "cool, calm, and collected")
        ]
        for word, expected in words:
            self.assertEqual(expected, helpers.lowercase(word))

    def test_uppercase(self):
        words = [
            ("alright", "ALRIGHT"),
            ("YELLING", "YELLING"),
            ("Cool, calm, and Collected", "COOL, CALM, AND COLLECTED")
        ]
        for word, expected in words:
            self.assertEqual(expected, helpers.uppercase(word))

    def test_capitalize(self):
        words = [
            ("alright", "Alright"),
            ("YELLING", "Yelling"),
            ("Cool, calm, and Collected", "Cool, calm, and collected")
        ]
        for word, expected in words:
            self.assertEqual(expected, helpers.capitalize(word))

if __name__=="__main__":
    unittest.main()
