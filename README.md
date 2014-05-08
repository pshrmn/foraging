##Collector

####Collector.web
Web app that runs in conjunction with collect-chrome extension (https://github.com/psherman/collectjs-chrome) to get rules to be used in a crawler

for default folder to save files, call

    python collector.web.server.py

to specify which folder to save rules to, use 

    -F <folder> or --folder <folder>

#####Rules Format

    sites: {
        example.com: {
            groups: {
                name: {
                    name: name,
                    index_urls: {...},
                    sets: {
                        default: {
                            parent: ... (optional),
                            rules: {
                                name: {
                                    name: ...,
                                    capture: ...,
                                    selector: ...,
                                    range: ... (optional)
                                },
                                ...
                            }
                        },
                        ...
                    }
                },
                ...
            }
        },
        ...
    }

####Collector.crawl
module used to crawl a website
