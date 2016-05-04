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
        return None
    if not resp.ok or resp.text == "":
        log.warning("<requests> {} bad response".format(url))
        return None
    return resp.text
