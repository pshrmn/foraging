#Forager

A Chrome extension to determine how to gather data from a web page. 

##[Tutorial](http://www.pshrmn.com/tutorials/forager/)

###Format

#####Page

A page is made up of `Element`s which contain `Rule`s. When a `Page` is created, a root `Element` with a `selector` of the document's `body` is made. Any `Element`s that you make will be children (or granchildren) of this root `Element`.

```javascript
page = {
    name: "roster",
    element: {
        selector: "body",
        children: [...],
        rules: []
    }
}
```

A site can have multiple, independent pages, each of which is uploaded individually to the server. The extension stores a `pages` object for each site (determined by the hostname). Page names cannot be repeated on a site to prevent overriding when uploading to a server.

```javascript
pages = {
    roster: {...},
    schedule: {...}
}
```

#####Rule

Data is captured through `Rule`s. A `Rule` has a `name`, the `attr`, which is the attribute of an element to capture (or text) to capture, and the expected `type` of the attribute. By default the `type` is `string`, but it can also be `int` or `float`. A regular expression will be used to attempt to parse the int or float value out of the text of the `attr`.

```javascript
rule = {
    name: "h1",
    attr: "title",
    type: "..."
}
```

#####Element

An `Element` is made up of a css `selector` to match elements in the page, `children` Elements, a `rules` array of `Rule`s, and a `spec` with a `type` (`single` or `all`) and a `value` (an integer to target a specific element for `single` types and a string name to save the array as for `all` types). There is also an `optional` boolean property to handle cases where an `Element` might not match any exist, but you still want to gather other data.

```javascript
element = {
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
```

The above `Element` will select the second `p` element in the page and capture its `textContent`, saving it as the `description`. Any `a` elements that are children of the paragraph will have their `href` attribute captured and stored in a `urls` array.

######Spec

A `Spec` describes what to do with the elements that are matched by a selector. In both cases, the selector gives you an array of matched elements.

#######Single

```javascript
let single = {
    type: "single",
    value: <int>
}
```

A `single` spec returns a data object containing data captured by the `Element`'s rules and the rules of its children. The spec's `value` is used to select the element at the `value` index in the array of matched elements and only that element will be used to get rule data from.

#######All

```javascript
let all = {
    type: "all",
    value: <string>
}
```
An `all` spec returns an array of data objects. The name of the array is the `value` of the spec. Each item in the array will correspond to an element that was matched by the selector.

#####How to Use
To pack extension and use:

1. In Chrome open up the extensions page (Settings > Tools > Extensions)
2. Click the "Pack extension..." button and navigate to the extension folder (If you've previously packed the extension, make sure to include the extension.pem so that packing creates an updated extension instead of a new one.)
3. Open the folder where the packed extension (a .crx file) is located (that should be one folder above the extension folder)
4. Drag the .crx file to the Chrome extensions page
5. Accept the extension's permissions

Built with [React](https://facebook.github.io/react/), [Redux](http://rackt.org/redux/index.html), and [d3](http://d3js.org/).
