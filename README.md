##Collector

####Collector.web
Web app that runs in conjunction with collect-chrome extension (https://github.com/psherman/collectjs-chrome) to get rules to be used in a crawler
Valid JSON created must contain:

* indices: an array of url strings for index pages
* rules: an object containing rules objects (selector, data, etc)

####Collector.crawl
module used to crawl a website
