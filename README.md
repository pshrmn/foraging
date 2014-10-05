##Collector

####Collector.web
Web app that runs in conjunction with collect-chrome extension (https://github.com/psherman/collectorjs) to get rules to be used in a crawler

for default folder to save files, call

    python collector.web.server.py

to specify which folder to save rules to, use 

    -F <folder> or --folder <folder>

#####Rules Format

A schema along with the hostname of the site for the rules is uploaded by collectJS extension

    {
        schema: <Schema>,
        site: <string>
    }

A Schema is a set of data to be captured from various rules
    
    Schema = {
        name: <string>
        urls: [<string>...],
        pages: {<Page>...}
    }

A Page is a webpage and contains selector sets to capture elements in a webpage

    Page = {
        name: <string>,
        index: <boolean>,
        next: <string> (optional),
        sets: {<SelectorSet>...}
    }

A selector set is a group of selectors within a page, optionally linked together by a parent selector

    SelectorSet = {
        name: <string>,
        selectors: {<selector>...},
        parent: <Parent> (optional)
    }

A Selector is a css selector and associated rules

    Selector = {
        selector: <string>,
        rules: {<Rule>...}
    }

A rule is a name and a captured value (either text or an attribute)

    Rule = {
        name: <string>,
        capture: <string>
    }

A parent is a selector for how to match an object within the DOM. This is useful if there are multiple sets within a page

    Parent = {
        selector: <string>,
        low: <int> (optional),
        high: <int> (optional)
    }


####Collector.crawl
module used to crawl a website

Create a Schema from a (properly formatted) json file

    import json
    from collector.crawl import Schema

    with open("schema.json") as fp:
        data = json.load(fp)
    s = Schema.from_json(data)

Get data by crawling urls in Schema.urls (and any subsequent urls from successive Pages)

    crawled_data = s.crawl_urls()

Or set a specific page to get data from

    spec_url_data = s.get(url)
