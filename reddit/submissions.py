import os
import json
import argparse

from collector import Page, Fetch, Cache

os.makedirs("data", exist_ok=True)
with open("submissions.json") as fp:
    data = json.load(fp)

c = Cache("cache")
f = Fetch(headers={"User-Agent": "collector"}, cache=c)
p = Page.from_json(data, f)


def get_url(url):
    return p.get(url)


def save_page(data, filename):
    path = "data/{}".format(filename)
    with open(path, "w") as fp:
        json.dump(data, fp)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-url', dest='url', help='url of submissions page')
    parser.add_argument('-filename', dest='filename',
                        help='location to save data')
    args = parser.parse_args()
    url = args.url or "http://www.reddit.com"
    filename = args.filename or "output.json"
    data = get_url(url)
    save_page(data, filename)
