import logging

from .dom import get_actor
from .utils.dates import long_month

log = logging.getLogger(__name__)


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
    """
    Rotten Tomatoes lists information on actors in a table with rows that are
    a key in the first td and a value in the second. The key for an actor's
    birthdate is "Birthday:", so parse the value from the same row to get
    the birthdate.
    """
    for row in info:
        if row["key"] == "Birthday:":
            date = row["value"]
            # remove the &nbsp; that is placed between the month and day
            clean_date = date.replace("\u00a0", " ")
            return long_month(clean_date)
    log.warning("no birthday found")


def by_name(name):
    """
    Format a url for an actor based on their name and return data on that
    actor from Rotten Tomatoes. This url should be the one that points to the
    person's profile on Rotten Tomatoes, but it is not guaranteed to return the
    correct page.
    """
    log.info("<actor> name={}".format(name))
    under_name = name.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/celebrity/{}/".format(under_name)
    return get_actor_data(url)


def by_url(url):
    """
    Return data for an actor given the url.
    """
    log.info("<actor> url={}".format(url))
    return get_actor_data(url)


def get_actor_data(url):
    """
    return a dict with the name of an actor, the actor's birthdate, and a list
    of movies that that actor has appeared in.
    """
    data = get_actor(url)
    if data is None:
        return None
        log.warning("<actor> bad data for url {}".format(url))
    return {
        "name": data["name"],
        "birthdate": parse_birthdate(data["information"]),
        "movies": [movie_info(m) for m in data["movies"]]
    }
