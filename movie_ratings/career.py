import json
import os
import argparse
import logging

from .actor import by_name
from .movie import by_url
from .db.models import Actor, Role, Movie
from .db.engine import db_add, db_add_all, db_actor, db_movie, db_role

logging.basicConfig(level=logging.WARNING)
log = logging.getLogger(__name__)
OUTPUT_DIR = os.path.join(os.getcwd(), "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def get_actor(name, require_new=True):
    """
    get an actor, then iterate over their roles, getting the movie for each
    role. A tuple in the db is created for the actor, each movie the actor
    has appeared in, and for each role the actor has portrayed.

    If require_new is False and there is already an entry for the actor in the
    database, just require that entry.
    """
    actor_tuple = db_actor(name)
    if not require_new and actor_tuple is not None:
        return actor_tuple

    data = by_name(name)
    if data is not None:
        if actor_tuple is None:
            actor_tuple = Actor(name=data["name"], birthdate=data["birthdate"])
            db_add(actor_tuple)

        new_movies = []
        movie_tuples = []
        for m in data["movies"]:
            movie_tuple = db_movie(m["url"])
            if movie_tuple is None:
                movie_tuple = get_movie(m)
                new_movies.append(movie_tuple)
            movie_tuples.append((m["role"], movie_tuple))
        # commit any new movies
        db_add_all(new_movies)

        roles = []
        for row in movie_tuples:
            role, m_tuple = row
            role_tuple = db_role(actor_tuple.id, m_tuple.id)
            if role_tuple is None:
                roles.append(Role(role=role,
                                  actor_id=actor_tuple.id,
                                  movie_id=m_tuple.id))
        db_add_all(roles)
        return actor_tuple


def get_movie(m):
    """
    return a Movie tuple for a movie using data from Rotten Tomatoes
    """
    movie_data = by_url(m["url"])
    return Movie(title=m["title"],
                 url=movie_data["url"],
                 release=movie_data["release"],
                 critics=movie_data["critics"],
                 audience=movie_data["audience"])


def movie_dict(role):
    """
    return a dict with relevant information from a movie
    """
    movie = role.movie
    return {
        "title": movie.title,
        "critics": movie.critics,
        "release": movie.release.strftime("%B %d, %Y") if movie.release else None
    }


def output_actor(actor):
    data = {
        "name": actor.name,
        "movies": [movie_dict(role) for role in actor.roles]
    }
    under_name = actor.name.lower().replace(" ", "_")
    file_path = os.path.join(OUTPUT_DIR, "{}.json".format(under_name))
    with open(file_path, "w") as fp:
        json.dump(data, fp, indent=2)


def get_and_save(name):
    actor = get_actor(args.name)
    if actor is not None:
        output_actor(actor)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()
    get_and_save(args.name)
