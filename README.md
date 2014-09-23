###CollectorJS

A Chrome extension that allows you to get information necessary to crawl a page. Creates rules that consist of a css selector to get an element (or more) in the page and a capture value, which is either text or an element attribute. Should be run in correlation with the web.server module in https://github.com/psherman/collector

#####Rules Format

A group refers to a set of data to be captured
    
    group = {
        name: <string>
        urls: [<string>...],
        pages: {<page>...}
    }

A page is a webpage and contains selector sets to capture elements in the page

    page = {
        name: <string>,
        index: <boolean>,
        next: <string> (optional),
        sets: {<selectorSet>...}
    }

A selector set is a group of selectors within a page, optionally linked together by a parent selector

    selectorSet = {
        name: <string>,
        selectors: {<selector>...},
        parent: <parent> (optional)
    }

A selector is a css selector and associated rules

    selector = {
        selector: <string>,
        rules: {<rule>...}
    }

A rule is a name and a captured value (either text or an attribute)

    rule = {
        name: <string>,
        capture: <string>
    }

A parent is a selector for how to match an object within the DOM. This is useful if there are multiple sets within a page

    parent = {
        selector: <string>,
        low: <int> (optional),
        high: <int> (optional)
    }

And a site can have multiple, independent groups, each of which is uploaded individually to the server

    site = {
        groups: {
            group1: {...},
            group2: {...}
        }

Naming of groups, pages, and ruleSets is up to the user, but there a few reserverd words.

* default (group) - initial group when visiting a new site
* default (page) - first page to be crawled in a group
* default (ruleSet) - initial ruleSet for a page
* default (rule) - because a page's name is based on an associated rule, cannot have a rule named default
* next (ruleSet) - a next ruleSet can be added to a "default" page and contains one rule: a link with a capture of attr-href in order to generate more URLs for the default page to be applied to

When a domain is visited (and collectjs is opened) for the first time, a "default" group with a "default" page is generated. This can be used, although creating a new group with a more relevant name is encouraged.

#####How to Use
To pack extension and use:
1) In Chrome open up the extensions page (Settings > Tools > Extensions)
2) Click the "Pack extension..." button and navigate to the extension folder
2b) If you've previously packed the extension, make sure to include the extension.pem so that packing creates an updated extension instead of a new one.
3) Open the folder where the packed extension (a .crx file) is located (that should be one folder above the extension folder)
4) Drag the .crx file to the Chrome extensions page
5) Accept the extension's permissions

#####Extra info
Originally project was at https://github.com/psherman/collectjs, but transitioning over to an extension from a bookmarklet for ease of use.
Uses https://github.com/psherman/selector and https://github.com/psherman/tabs
