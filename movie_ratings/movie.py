import re
import datetime
import logging

from .get import movie


log = logging.getLogger(__name__)

MONTHS = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
}


def release_date(info):
    for item in info:
        if item["key"] == "In Theaters:":
            pattern = r"(?P<month>[a-zA-Z]{3}) (?P<day>\d{1,2}), (?P<year>\d{4})"
            match = re.search(pattern, item["value"])
            if match is not None:
                year = int(match.group("year"))
                day = int(match.group("day"))
                month = MONTHS[match.group("month")]
                return datetime.date(year, month, day)
            log.warning("failed to match date:\t{}".format(item["value"]))
    log.warning("no release date found")


def get_movie(name):
    log.info("getting information on movie:\t{}".format(name))
    data = movie(name)
    if data is None:
        log.warning("failed to retrive information for movie:\t{}".format(name))
    return {
        "title": data["title"],
        "release": release_date(data["information"]),
        "critics": data["critics_value"],
        "audience": data["audience_value"]
    }
