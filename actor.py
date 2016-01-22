import json
import argparse
import sys
import os

from gatherer import Page, Fetch
from gatherer.errors import BadJSONError

OUTPUT_DIR = os.path.join(os.getcwd(), "data", "actor")
os.makedirs(OUTPUT_DIR, exist_ok=True)

fetcher = Fetch()
with open("rules/www_rottentomatoes_com/actor.json") as fp:
    page_json = json.load(fp)

try:
    page = Page.from_json(page_json)
except BadJSONError:
    sys.exit("Bad Page JSON file")


def movie_info(movie):
    return {
        "title": movie["title"],
        "score": movie["score"],
        "url": movie["url"]
    }


def get_birthdate(info):
    for row in info:
        if row["key"] == "Birthday:":
            return row["value"]


def get_actor(name):
    under_name = name.lower().replace(" ", "_")
    url = "http://www.rottentomatoes.com/celebrity/{}/".format(under_name)
    dom = fetcher.get(url)
    if dom is not None:
        data = page.gather(dom)
        out_data = {
            "name": data["name"],
            "birthdate": get_birthdate(data["information"]),
            "movies": list(map(movie_info, data["movies"]))
        }

        with open(os.path.join(OUTPUT_DIR, "{}.json".format(under_name)), "w") as fp:
            json.dump(out_data, fp, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()
    get_actor(args.name)
