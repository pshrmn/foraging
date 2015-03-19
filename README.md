#CollectorJS

A Chrome extension to determine how to collect data from a page. 

###Format

#####Attr

Data is captured through `attr`s. An attr has a name and the attribute of an element to capture (or text).

    attr = {
        name: "h1",
        attr: "title"
    }

#####Selector

Attrs are created on `selector`s. Selectors are made up of a css `selector`, `children` selectors, `attrs`, and an optional `index` that can be used on a selector to specify a specific element to target. (default behavior includes all matching elements. `index` is zero-based)

    {
        type: "index",
        value: <int>
    }
    
or

    {
        type: "name",
        value: <string>
    }

    selector = {
        selector: "p",
        children: [
            {
                selector: "a",
                children: [],
                attrs: [
                    {
                        name: "url",
                        attr: "href"
                    }
                ]
            }
        ],
        attrs: [
            {
                name: "description",
                attr: "text"
            }
        ],
        index: 2
    }

The above selector will select the second `p` element in the page and capture its `textContent` as the `description`. Any `a` elements that are children of the paragraph will have their `href` attribute captured and stored in a `url` array.

#####Page

A `page` is a special type of `selector` that has a `name`. Its `selector` is the document's `body`.
    page = {
        name: "roster",
        selector: "body",
        children: [...],
        attrs: []
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
