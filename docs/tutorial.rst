.. _tutorial:

Tutorial
========

With a schema json file ``schema.json`` (generated from CollectorJS), crawl data from all urls in 
urls::

    import json
    from collector.crawl import Schema

    with open("schema.json", "r") as fp:
        schema_json = json.load(fp)

    schema = Schema.from_json(schema_json)
    data = schema.crawl_urls()

and save the data as ``output.json``::

    with open("output.json", "w") as fp:
        json.dump(data, fp)
