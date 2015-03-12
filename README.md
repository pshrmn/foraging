#CollectorJS

A Chrome extension to determine how to collect data from a page. 

###Format

#####Attr

Data is captured through `attr`s. An attr has a name and the attribute of an element to capture (or text).

    attr = {
        name: "h1",
        attr: "title"
    }

There is a special type of `attr` that can only be created on the `href` attribute of `a`s. For these `attr`s, if `follow=true`, a `page` with the same name as the `attr` will be created.

    attr = {
        name: "url",
        attr: "href",
        follow: true
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

A `page` is a special type of `selector`. Its `selector` is the document's `body`. Each `schema` is made up a series of pages. A schema requires a `default` page. Additional pages are created by `attr`s with property `follow=true` for the `href` value of an anchor (`a`) element. The created page will share the name of the `attr` that creates it.

    page = {
        selector: "body",
        children: [...],
        attrs: []
    }

#####Schema

A schema refers to an overall set of data to be captured, possibly across a set of pages. The schema's pages are used to collect data. The `default` page is the starting point.
    
    schema = {
        name: <string>
        urls: [<string>...],
        pages: {<page>...}
    }

And a site can have multiple, independent schemas, each of which is uploaded individually to the server. The extension stores a `schemas` object for each site (determined by the hostname)

    schemas = {
        default: {...},
        other: {...}
    }

When a domain is visited (and collectjs is opened) for the first time, a `default` schema with a `default` page is generated. This can be used, although creating a new schema with a more relevant name is encouraged.

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
