import re
import logging
import datetime
import json
from gatherer import Page

from .get import get_dom

log = logging.getLogger(__name__)

with open("rules/www_rottentomatoes_com/actor.json") as fp:
    actor_json = json.load(fp)
actor_page = Page.from_json(actor_json)

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
        "role": movie["role"],
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


def get_actor_by_name(name):
    log.info("<actor> name={}".format(name))
    under_name = name.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/celebrity/{}/".format(under_name)
    return gather_actor(url)


def get_actor_by_url(url):
    log.info("<actor> url={}".format(url))
    return gather_actor(url)


def gather_actor(url):
    dom = get_dom(url, True)
    if dom is not None:
        data = actor_page.gather(dom)
    if data is None:
        log.warning("<actor> bad data for url {}".format(url))
    return {
        "name": data["name"],
        "birthdate": get_birthdate(data["information"]),
        "movies": [movie_info(m) for m in data["movies"]]
    }
