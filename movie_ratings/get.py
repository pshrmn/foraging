from gatherer import Fetch, Cache

cache = Cache("cache")
fetcher = Fetch(cache=cache)


def get_dom(url):
    return fetcher.get(url)
