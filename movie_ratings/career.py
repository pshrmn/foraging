import argparse
import os
import json

from .actor import get_actor
from .movie import get_movie
from .db import session

OUTPUT_DIR = os.path.join(os.getcwd(), "data")
ACTOR_DIR = os.path.join(OUTPUT_DIR, "actor")
MOVIE_DIR = os.path.join(OUTPUT_DIR, "movie")

os.makedirs(ACTOR_DIR, exist_ok=True)
os.makedirs(MOVIE_DIR, exist_ok=True)

db_session = session()


def get_movies(movies):
    for movie in data["movies"]:
        movie_data = get_movie(movie["url"])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()

    data = get_actor(args.name)
    if data is not None:
        under_name = args.name.lower().replace(" ", "_")
        with open(os.path.join(ACTOR_DIR, "{}.json".format(under_name)), "w") as fp:
            json.dump(data, fp, indent=2)
        get_movies(data["movies"])
