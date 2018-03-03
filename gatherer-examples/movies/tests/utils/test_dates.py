import unittest
from datetime import date
from movie_ratings.utils import dates
import logging

logging.basicConfig(level=logging.CRITICAL)


class PageTestCase(unittest.TestCase):

    def test_long_month(self):
        good_dates = [
            "July 7, 2007",
            "date August 8, 2008",
            "September 9, 2009 date"
        ]
        for d in good_dates:
            day = dates.long_month(d)
            self.assertIsInstance(day, date)
        bad_dates = [
            "no date in here",
            "Jul 7, 2007",
            "8 August 2008"
        ]
        for d in bad_dates:
            day = dates.long_month(d)
            self.assertIsNone(day)

    def test_short_month(self):
        good_dates = [
            "Jul 7, 2007",
            "date Aug 8, 2008",
            "Sep 9, 2009 date"
        ]
        for d in good_dates:
            day = dates.short_month(d)
            self.assertIsInstance(day, date)
        bad_dates = [
            "no date in here",
            "July 7, 2007",
            "8 Aug 2008"
        ]
        for d in bad_dates:
            day = dates.short_month(d)
            self.assertIsNone(day)

if __name__ == "__main__":
    unittest.main()
