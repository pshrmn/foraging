import json

from .schema import Schema

def crawl_url(filename, url):
    """
    given a filename for a JSON file for a Schema, get the data from the provided url

    :param string filename: location of Schema JSON file
    :param string url: url to collect data from
    """
    with open(filename) as fp:
        schema_json = json.load(fp)
    s = Schema.from_json(schema_json)
    return s.get(url)

def crawl_schema(filename):
    """
    given a filename for a JSON file for a Schema, crawl all urls and return the associated data

    :param string filename: location of Schema JSON file
    """
    with open(filename) as fp:
        schema_json = json.load(fp)
    s = Schema.from_json(schema_json)
    return s.crawl_urls()