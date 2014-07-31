###CollectJS

A Chrome extension that allows you to get information necessary to crawl a page. Creates rules that consist of a css selector to get an element (or more) in the page and a capture value, which is either text or an element attribute. Should be run in correlation with the web.app module in https://github.com/psherman/collector

#####Rules Format

A rule set is a group of rules on a page. A rule consists of a name (semi-equivalent to a row in a tuple of a relational database), a selector to access the element in the page, what part of the element o capture (an attribute or text).

    rule_set = {
        name: <string>,
        rules: {
            name: {
                name: <string>,
                selector: <string>,
                capture: <string>,
                range: <int> (optional)
            },
            ...
        },
        parent: parent (optional)
    }


A parent is a selector for how to match an object within the DOM. This is useful if there are multiple sets within a page

    parent = {
        selector: <string>,
        range: <int> (optional)
    }

A page can have multiple sets in it, in case parts of it require a parent selector while others do not

    page = [
        {
            name: <string>
            rules: {...},
            parent: parent
        },
        {
            name: <string>,
            rules: {...}
        }
    ]

A group is an array made up of one or more pages whose data are all related. The URL to get the second page is determined by a rule in the page1 page that has the name page2

    group = {
        name: <string>
        pages: [page1, page2],
        urls: []
    }

And a site can have multiple, independent groups, each of which is uploaded individually to the server

    site = {
        groups: {
            group1: {...},
            group2: {...}
        }

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
