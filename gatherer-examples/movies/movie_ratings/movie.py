import logging

from .dom import get_movie
from .utils.dates import short_month

log = logging.getLogger(__name__)


def release_date(info):
    """
    return a datetime.date of the date that the movie was released. If there is
    no theatrical release listed, falls back to the DVD release date. If that
    doesn't exist either, returns None
    """
    dvd_date = None
    for item in info:
        if item["key"] == "In Theaters:":
            date = short_month(item["value"])
            if date is not None:
                return date
        elif item["key"] == "On DVD:":
            # use the dvd release date as backup
            dvd_date = short_month(item["value"])
    if dvd_date is not None:
        log.info("using DVD release date")
        return dvd_date
    log.warning("no release date found")


def by_title(title):
    log.info("<movie> name={}".format(title))
    under_title = title.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/m/{}/".format(under_title)
    return get_movie_data(url)


def by_url(url):
    log.info("<movie> url={}".format(url))
    return get_movie_data(url)


def get_movie_data(url):
    data = get_movie(url)
    if data is None:
        log.warning("<movie> bad data for url {}".format(url))
    return {
        "title": data["title"],
        "url": url,
        "release": release_date(data["information"]),
        "critics": data["critics_value"],
        "audience": data["audience_value"]
    }
