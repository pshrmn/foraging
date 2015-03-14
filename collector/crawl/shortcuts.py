import json

from .schema import SimpleSchema


def get_url(schema_file, output_file, url):
    """
    takes the path to a (simple) schema, gets data from url,
    and saved to output_file
    """
    with open(schema_file) as fp:
        schema_json = json.load(fp)

    s = SimpleSchema.from_json(schema_json)
    data = s.get(url)
    with open(output_file, "w") as fp:
        json.dump(data, fp)
