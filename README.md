##collector

Collect data from web pages. Works with schemas created by [collectJS](https://github.com/psherman/collectorjs). For the data format, refer to that project's README.

Currently only works for pages with static html, but support for dynanmically loaded content will be available in the future.

#####Install

Install collector using pip

    pip install git+git://github.com/psherman/collector.git

####collector.crawl
module used to crawl a website

#####SimpleSchema

`SimpleSchema`s are used to collect data from single pages.

`SimpleSchema` is currently the only type of schema implemented, but more advanced ones will be available in the future.

Create a Schema from a (properly formatted) json file

    import json
    from collector import SimpleSchema

    with open("schema.json") as fp:
        data = json.load(fp)
    try:
        s = Schema.from_json(data)
    except BadJSONError:
        # your schema isn't properly formatted

Get the data for the schema by getting `get` and providing a `url`

    data = s.get(url)
