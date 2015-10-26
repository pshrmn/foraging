#Forager

A Chrome extension to determine how to gather data from a page. 

##[Tutorial](http://www.pshrmn.com/tutorials/forager/)

###Format

#####Rule

Data is captured through `rule`s. A rule has a name, the attribute of an element to capture (or text), and the expected type of the attribute. By default the type is string, but it can also be int or float. A regular expression will be used to attempt to parse the value out of the text of the attribute.

    rule = {
        name: "h1",
        attr: "title",
        type: "..."
    }

#####Selector

Rules are created on `selector`s. Selectors are made up of a css `selector`, `children` selectors, `rules`, a `spec`  with a `type` (`single` or `all`) and a `value` (an integer to target a specific element for `single` types and a string name to save the array as for `all` types). There is also an `optional` boolean property to handle cases where an element might not exist, but you still want to gather other data.

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
                        attr: "href",
                        type: "string"
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
                attr: "text",
                type: "string"
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

Makes extensive use of [d3](http://d3js.org/).
