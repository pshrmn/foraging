import argparse
import logging

from .actor import get_actor_by_name
from .movie import get_movie_by_url
from .db import (db_session, db_actor, db_movie, db_role,
                 Actor, Role, Movie)

logging.basicConfig(level=logging.WARNING)
session = db_session()


def add_actor(name):
    # always fetch the actor in case there are any new movies
    data = get_actor_by_name(name)
    if data is not None:
        actor_tuple = db_actor(name)
        if actor_tuple is None:
            actor_tuple = Actor(name=data["name"], birthdate=data["birthdate"])
            session.add(actor_tuple)
            session.commit()

        new_movies = []
        movie_tuples = []
        for movie in data["movies"]:
            movie_tuple = db_movie(movie["url"])
            if movie_tuple is None:
                movie_tuple = get_movie(movie)
                new_movies.append(movie_tuple)
            movie_tuples.append((movie["role"], movie_tuple))
        # commit any new movies
        session.add_all(new_movies)
        session.commit()

        roles = []
        for row in movie_tuples:
            role, m_tuple = row
            role_tuple = db_role(actor_tuple.id, m_tuple.id)
            if role_tuple is None:
                roles.append(Role(role=role,
                                  actor_id=actor_tuple.id,
                                  movie_id=m_tuple.id))
        session.add_all(roles)
        session.commit()


def get_movie(movie):
    movie_data = get_movie_by_url(movie["url"])
    return Movie(title=movie["title"],
                 url=movie_data["url"],
                 release=movie_data["release"],
                 critics=movie_data["critics"],
                 audience=movie_data["audience"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()
    add_actor(args.name)
