import argparse
import os
import json
import re
import logging

from .actor import get_actor_by_name
from .movie import get_movie_by_url

logging.basicConfig(level=logging.WARNING)

OUTPUT_DIR = os.path.join(os.getcwd(), "data")
ACTOR_DIR = os.path.join(OUTPUT_DIR, "actor")
MOVIE_DIR = os.path.join(OUTPUT_DIR, "movie")

os.makedirs(ACTOR_DIR, exist_ok=True)
os.makedirs(MOVIE_DIR, exist_ok=True)

BACKUP = True


def clean_filename(name):
    """
    remove any illegal filename characters from a string
    """
    new_name, _ = re.subn(r"[<>:\"/\\\|?*]", "", name)
    return new_name


def add_actor(name):
    data = get_actor_by_name(name)
    if data is not None:
        # convert to a string for json
        if data["birthdate"] is not None:
            data["birthdate"] = data["birthdate"].strftime("%B %d, %Y")
        get_movies(data["movies"])
        if BACKUP:
            under_name = args.name.lower().replace(" ", "_")
            clean_under_name = clean_filename(under_name)
            actor_path = os.path.join(ACTOR_DIR, "{}.json".format(clean_under_name))
            with open(actor_path, "w") as fp:
                json.dump(data, fp, indent=2)


def get_movies(movies):
    data = []
    for movie in movies:
        movie_data = get_movie_by_url(movie["url"])
        # convert to a string for json
        if movie_data["release"] is not None:
            movie_data["release"] = movie_data["release"].strftime("%B %d, %Y")
        # don't want the year left on
        movie_data["title"] = movie["title"]
        data.append(movie_data)
        if BACKUP:
            under_title = movie["title"].lower().replace(" ", "_")
            clean_under_title = clean_filename(under_title)
            path = os.path.join(MOVIE_DIR, "{}.json".format(clean_under_title))
            with open(path, "w") as fp:
                json.dump(movie_data, fp, indent=2)
    return data

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()
    add_actor(args.name)
