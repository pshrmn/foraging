import json
import os
import argparse
import logging

from .actor import by_name
from .movie import by_url
from .db.models import Actor, Role, Movie
from .db.engine import db_add, db_add_all, db_actor, db_movie, db_role

logging.basicConfig(level=logging.WARNING)
OUTPUT_DIR = os.path.join(os.getcwd(), "data")


def get_actor(name):
    # always fetch the actor in case there are any new movies
    data = by_name(name)
    if data is not None:
        actor_tuple = db_actor(name)
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
    movie_data = by_url(m["url"])
    return Movie(title=m["title"],
                 url=movie_data["url"],
                 release=movie_data["release"],
                 critics=movie_data["critics"],
                 audience=movie_data["audience"])


def movie_ratings(roles):
    movies = []
    for role in roles:
        movie = role.movie
        movies.append({
            "title": movie.title,
            "critics": movie.critics,
            "release": movie.release.strftime("%B %d, %Y")
        })
    return movies


def output_actor(actor):
    data = {
        "name": actor.name,
        "movies": movie_ratings(actor.roles)
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
