###CollectJS

A Chrome extension that allows you to get information necessary to crawl a page. Creates rules that consist of a css selector to get an element (or more) in the page and a capture value, which is either text or an element attribute. Should be run in correlation with the web.app module in https://github.com/psherman/collector

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

#####Sets
The "default" set is called on index_urls, other sets are references to rules which capture the href from an anchor.
For example, a rule with the name "product_page" that captures "attr-href" will create a set called "product_page" and the data for that page will be attained by making a get call to the captured href url.

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
