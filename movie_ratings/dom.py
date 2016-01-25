import json
from gatherer import Fetch, Cache, Page

cache = Cache("cache")
fetcher = Fetch(cache=cache)

with open("rules/www_rottentomatoes_com/actor.json") as fp:
    actor_json = json.load(fp)
actor_page = Page.from_json(actor_json)

with open("rules/www_rottentomatoes_com/movie.json") as fp:
    movie_json = json.load(fp)
movie_page = Page.from_json(movie_json)


def get_actor(url):
    """
    return a dict with the data from an actor's profile
    """
    dom = fetcher.get(url, True)
    if dom is not None:
        return actor_page.gather(dom)


def get_movie(url):
    """
    return a dict with the data from a movie's profile
    """
    dom = fetcher.get(url)
    if dom is not None:
        return movie_page.gather(dom)
