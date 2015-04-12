#CollectorJS

A Chrome extension to determine how to collect data from a page. 

###Format

#####Rule

Data is captured through `rule`s. A rule has a name and the attribute of an element to capture (or text).

    rule = {
        name: "h1",
        attr: "title"
    }

#####Selector

Rules are created on `selector`s. Selectors are made up of a css `selector`, `children` selectors, `rules`, a `spec`  with a `type` (`single` or `all`) and a `value` (an integer to target a specific element for `single` types and a string name to save the array as for `all` types). There is also an `optional` boolean property to handle cases where an element might not exist, but you still want to collect other data.

Specs are either

    {
        type: "single",
        value: <int>
    }
    
or

    {
        type: "all",
        value: <string>
    }

and a selector looks like:

    selector = {
        selector: "p",
        children: [
            {
                selector: "a",
                children: [],
                rules: [
                    {
                        name: "url",
                        attr: "href"
                    }
                ],
                spec: {
                    type: "all",
                    value: "urls"
                }
            }
        ],
        rules: [
            {
                name: "description",
                attr: "text"
            }
        ],
        spec: {
            type: "single",
            value: 2
        }
    }

The above selector will select the second `p` element in the page and capture its `textContent` as the `description`. Any `a` elements that are children of the paragraph will have their `href` attribute captured and stored in a `urls` array.

#####Page

A `page` is a special type of `selector` that has a `name`. Its `selector` is the document's `body`.
    page = {
        name: "roster",
        selector: "body",
        children: [...],
        rules: []
    }

And a site can have multiple, independent pages, each of which is uploaded individually to the server. The extension stores a `pages` object for each site (determined by the hostname)

    pages = {
        roster: {...},
        schedule: {...}
    }

#####How to Use
To pack extension and use:

1. In Chrome open up the extensions page (Settings > Tools > Extensions)
2. Click the "Pack extension..." button and navigate to the extension folder (If you've previously packed the extension, make sure to include the extension.pem so that packing creates an updated extension instead of a new one.)
3. Open the folder where the packed extension (a .crx file) is located (that should be one folder above the extension folder)
4. Drag the .crx file to the Chrome extensions page
5. Accept the extension's permissions

#####Extra info
Originally project was at https://github.com/psherman/collectjs, but transitioning over to an extension from a bookmarklet for ease of use.

Makes extensive use of [d3](http://d3js.org/).
