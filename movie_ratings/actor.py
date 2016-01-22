import re
import logging
import datetime

from .get import actor

log = logging.getLogger(__name__)


MONTHS = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}


def movie_info(movie):
    return {
        "title": movie["title"],
        "score": movie["score"],
        "url": movie["url"]
    }


def get_birthdate(info):
    for row in info:
        if row["key"] == "Birthday:":
            date = row["value"]
            # remove the &nbsp; that is placed between the month and day
            clean_date = date.replace("\u00a0", " ")
            pattern = r"(?P<month>[a-zA-Z]+) (?P<day>\d{1,2}), (?P<year>\d{4})"
            match = re.search(pattern, clean_date)
            if match is not None:
                year = int(match.group("year"))
                day = int(match.group("day"))
                month = MONTHS[match.group("month")]
                return datetime.date(year, month, day)
            log.warning("failed to match date:\t{}".format(clean_date))
    log.warning("no birthday found")


def get_actor(name):
    log.info("getting information actor:\t{}".format(name))
    data = actor(name)
    if data is None:
        log.warning("failed to retrive information for actor:\t{}".format(name))
    return {
        "name": data["name"],
        "birthdate": get_birthdate(data["information"]),
        "movies": [movie_info(m) for m in data["movies"]]
    }
