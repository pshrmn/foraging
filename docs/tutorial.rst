.. _tutorial:

Tutorial
========

With a schema json file ``schema.json`` (generated from CollectorJS), crawl data from all urls in 
Schema.urls::

    import json
    from pycollector import Schema

    with open("schema.json", "r") as fp:
        schema_json = json.load(fp)

    schema = Schema.from_json(schema_json)
    data = schema.crawl_urls()

and save the data as ``output.json``::

    with open("output.json", "w") as fp:
        json.dump(data, fp)


Or just use the shortcuts to crawl a schema::

    from pycollector import crawl_schema

    data = crawl_schema("schema.json")

or an individual url::

    from pycollector import crawl_url

    data = crawl_url("schema.json", "http://www.example.com")
