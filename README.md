##Collector

####Collector.web
Web app that runs in conjunction with collect-chrome extension (https://github.com/psherman/collectjs-chrome) to get rules to be used in a crawler

for default folder to save files, call

    python collector.web.server.py

to specify which folder to save rules to, use 

    -F <folder> or --folder <folder>

#####Rules Format

A group along with the hostname of the site for the rules is uploaded by collectJS extension

    {
        group: <group>,
        site: <string>
    }

A group contains a set of related rules across multiple pages

    group: {
        name: <string>,
        pages: {
            name: <page>,
            ...    
        },
        urls: [<string>, ...]
    }

A page is a single web page, but can contain multiple rule sets

    page: {
        // order of operations within a page does not matter
        name: <string>,
        index: <bool>,
        sets: {
            <name>: {...},
            ...
        },
    }

A rule set contains related rules within a page. If there are multiple "groups" in the page that you want to get data for, use a parent selector to identify each group. For example, if you wanted to get different columns (td elements) from a table, the parent selector should specify how to select the rows (tr elements)

    rule_set: {
        name: <string>,
        rules: {},
        parent: <parent> (optional)
    }

    parent: {
        selector: <string>,
        which: <int> (optional)
    }

####Collector.crawl
module used to crawl a website
