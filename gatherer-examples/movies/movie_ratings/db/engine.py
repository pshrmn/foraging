from sqlalchemy import create_engine, and_, func
from sqlalchemy.orm import sessionmaker

from .models import Base, Actor, Movie, Role

engine = create_engine("sqlite:///ratings.sqlite")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


def db_actor(name):
    """
    find an actor given their name
    """
    return session.query(Actor).\
        filter(func.lower(Actor.name) == func.lower(name)).first()


def db_movie(url):
    """
    find a movie given its url
    """
    return session.query(Movie).filter(Movie.url == url).first()


def db_role(actor, movie):
    """
    find a role given an actor and a movie
    """
    return session.query(Role).\
        filter(and_(Role.actor_id == actor, Role.movie_id == movie)).first()


def db_add(tuple):
    session.add(tuple)
    session.commit()


def db_add_all(tuples):
    session.add_all(tuples)
    session.commit()
