import argparse
import os
import json

from .actor import get_actor_by_name
from .movie import get_movie_by_url

OUTPUT_DIR = os.path.join(os.getcwd(), "data")
ACTOR_DIR = os.path.join(OUTPUT_DIR, "actor")
MOVIE_DIR = os.path.join(OUTPUT_DIR, "movie")

os.makedirs(ACTOR_DIR, exist_ok=True)
os.makedirs(MOVIE_DIR, exist_ok=True)


def get_movies(movies):
    for movie in movies:
        movie_data = get_movie_by_url(movie["url"])
        # convert to a string for json
        movie_data["release"] = movie_data["release"].strftime("%B %d, %Y")
        under_title = movie["title"].lower().replace(" ", "_")
        # don't want the year left on
        movie_data["title"] = movie["title"]
        with open(os.path.join(MOVIE_DIR, "{}.json".format(under_title)), "w") as fp:
            json.dump(movie_data, fp, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()

    data = get_actor_by_name(args.name)
    if data is not None:
        # convert to a string for json
        data["birthdate"] = data["birthdate"].strftime("%B %d, %Y")
        under_name = args.name.lower().replace(" ", "_")
        with open(os.path.join(ACTOR_DIR, "{}.json".format(under_name)), "w") as fp:
            json.dump(data, fp, indent=2)
        get_movies(data["movies"])
