import os
import subprocess
import logging

log = logging.getLogger(__name__)


def phantom_backend(phantom_path, js_path):
    """
    phantom backend

    A closure function to create a backend, this needs to be
    called with the correct paths, then the returned function
    is passed to your Fetch class.

    Uses PhantomJS to send a GET request to the url with the
    User-Agent header attached. If the result from the function
    is an empty string, returns None, otherwise returns the
    decoded result.
    """
    if not os.path.exists(phantom_path):
        err = "phantom_path ({}) does not exist"
        raise ValueError(err.format(phantom_path))
    if not os.path.exists(js_path):
        err = "js_path ({}) does not exist"
        raise ValueError(err.format(js_path))

    def get(url, headers):
        log.info("<phantomjs> {}".format(url))
        commands = [phantom_path, js_path, url, headers['User-Agent']]
        process = subprocess.Popen(commands, stdout=subprocess.PIPE)
        # any errors are ignored, for better or probably for worse
        out, _ = process.communicate()
        text = out.decode()
        # text will be empty string when phantom request is not successful
        if text == "":
            log.warning("<phantomjs> {} bad response".format(url))
            return None
        return text

    return get
