import re
import datetime
import logging
import json
from gatherer import Page

from .get import get_dom

with open("rules/www_rottentomatoes_com/movie.json") as fp:
    movie_json = json.load(fp)
movie_page = Page.from_json(movie_json)


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


def match_date(date_string):
    pattern = r"(?P<month>[a-zA-Z]{3}) (?P<day>\d{1,2}), (?P<year>\d{4})"
    match = re.search(pattern, date_string)
    if match is not None:
        year = int(match.group("year"))
        day = int(match.group("day"))
        month = MONTHS[match.group("month")]
        return datetime.date(year, month, day)
    log.warning("failed to match date:\t{}".format(date_string))


def release_date(info):
    dvd_date = None
    for item in info:
        if item["key"] == "In Theaters:":
            date = match_date(item["value"])
            if date is not None:
                return date
        elif item["key"] == "On DVD:":
            # use the dvd release date as backup
            dvd_date = match_date(item["value"])
    if dvd_date is not None:
        log.info("using DVD release date")
        return dvd_date
    log.warning("no release date found")


def get_movie_by_title(title):
    log.info("<movie> name={}".format(title))
    under_title = title.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/m/{}/".format(under_title)
    return gather_movie(url)


def get_movie_by_url(url):
    log.info("<movie> url={}".format(url))
    return gather_movie(url)


def gather_movie(url):
    dom = get_dom(url)
    if dom is None:
        return
    data = movie_page.gather(dom)
    if data is None:
        log.warning("<movie> bad data for url {}".format(url))
    return {
        "title": data["title"],
        "release": release_date(data["information"]),
        "critics": data["critics_value"],
        "audience": data["audience_value"]
    }
