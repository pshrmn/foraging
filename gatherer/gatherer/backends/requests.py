import requests
import logging

log = logging.getLogger(__name__)


def requests_backend(url, headers=None):
    """
    requests backend

    This can be directly passed to your Fetch class

    Uses requests to send a GET request to the url with any
    headers attached. If there is a connection error, if the
    response status code is not 200, or if the text of the
    response is blank, returns None
    """
    if headers is None:
        headers = {}
    log.info("<requests> {}".format(url))
    try:
        resp = requests.get(url, headers=headers)
    except requests.exceptions.ConnectionError:
        log.warning("<requests> {} ConnectionError".format(url))
        return
    if not resp.ok or resp.text == "":
        log.warning("<requests> {} bad response".format(url))
        return
    return resp.text


def session_backend(session):
    """
    session backend

    The session backend is useful if you want requests to be made
    with the same session. This can be useful if you need to have
    an authenticated session for your requests.

    >>> session = requests.Session()
    >>> credentials = {"username": "username", "password": "password"}
    >>> session.post("https://www.example.com/login", data=credentials)
    >>> backend = session_backend(session)
    >>> f = Fetch(backend=backend)
    """
    # basic verification of the sessions by making
    # sure that it has a get method
    if not hasattr(session, "get"):
        raise ValueError("invalid session")

    def get(url, headers=None):
        if headers is None:
            headers = {}
        log.info("<session> {}".format(url))
        try:
            resp = session.get(url, headers=headers)
        except requests.exceptions.ConnectionError:
            log.warning("<session> {} ConnectionError".format(url))
            return
        if not resp.ok or resp.text == "":
            log.warning("<session> {} bad response".format(url))
            return
        return resp.text

    return get
