from sqlalchemy import (create_engine,
                        Column, ForeignKey, Integer, String, Date,
                        and_, func)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

engine = create_engine("sqlite:///ratings.sqlite")
Base = declarative_base()


class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    birthdate = Column(Date)

    roles = relationship("Role", back_populates="actor")

    def __repr__(self):
        return "<Actor(name={}, birthdate={}>".format(self.name, self.birthdate)


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    url = Column(String(255))
    release = Column(Date)
    critics = Column(Integer)
    audience = Column(Integer)

    roles = relationship("Role", back_populates="movie")

    def __repr__(self):
        return "<Movie(title={}, release={}, critics={}, audience={}>".format(
                self.title, self.release, self.critics, self.audience)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    role = Column(String(255))
    actor_id = Column(Integer, ForeignKey("actors.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))

    actor = relationship("Actor", back_populates="roles")
    movie = relationship("Movie", back_populates="roles")

    def __repr__(self):
        return "<Role(role={}, actor={}, movie={}>".format(
                self.role, self.actor, self.movie)


Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


def db_session():
    return session


def db_actor(name):
    return session.query(Actor).\
        filter(func.lower(Actor.name) == func.lower(name)).first()


def db_movie(url):
    return session.query(Movie).filter(Movie.url == url).first()


def db_role(actor, movie):
    return session.query(Role).\
        filter(and_(Role.actor_id == actor, Role.movie_id == movie)).first()
