from gatherer import Fetch, Cache

cache = Cache("cache")
fetcher = Fetch(cache=cache)


def fetch(url, no_cache=False):
    return fetcher.get(url, no_cache)
