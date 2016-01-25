import re
import logging
import datetime
import json
from gatherer import Page

from .dom import fetch

log = logging.getLogger(__name__)

with open("rules/www_rottentomatoes_com/actor.json") as fp:
    actor_json = json.load(fp)
actor_page = Page.from_json(actor_json)


def movie_info(movie):
    """
    return a dict describing a movie that the actor had a role in
    """
    return {
        "title": movie["title"],
        "score": movie["score"],
        "role": movie["role"],
        "url": movie["url"]
    }


def parse_birthdate(info):
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


def by_name(name):
    log.info("<actor> name={}".format(name))
    under_name = name.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/celebrity/{}/".format(under_name)
    return get_actor_data(url)


def by_url(url):
    log.info("<actor> url={}".format(url))
    return get_actor_data(url)


def get_actor_data(url):
    dom = fetch(url, True)
    if dom is not None:
        data = actor_page.gather(dom)
    if data is None:
        log.warning("<actor> bad data for url {}".format(url))
    return {
        "name": data["name"],
        "birthdate": parse_birthdate(data["information"]),
        "movies": [movie_info(m) for m in data["movies"]]
    }
