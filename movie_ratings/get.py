import json

from gatherer import Page, Fetch, Cache

cache = Cache("cache")
fetcher = Fetch(cache=cache)

with open("rules/www_rottentomatoes_com/actor.json") as fp:
    actor_json = json.load(fp)
actor_page = Page.from_json(actor_json)

with open("rules/www_rottentomatoes_com/movie.json") as fp:
    movie_json = json.load(fp)
movie_page = Page.from_json(movie_json)

ACTOR_URL = "http://www.rottentomatoes.com/celebrity/{}/"
MOVIE_URL = "http://www.rottentomatoes.com/m/{}/"


def actor(name):
    under_name = name.lower().replace(" ", "_")
    url = ACTOR_URL.format(under_name)
    dom = fetcher.get(url)
    if dom is not None:
        return actor_page.gather(dom)


def movie(name):
    under_name = name.lower().replace(" ", "_")
    url = MOVIE_URL.format(under_name)
    dom = fetcher.get(url)
    if dom is not None:
        return movie_page.gather(dom)
