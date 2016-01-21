#gatherer

Gather data from web pages. Works with pages created by [Forager](https://github.com/psherman/forager). For the data format, refer to that project's README.

##[Tutorial](http://www.pshrmn.com/tutorials/gatherer/)

##Install

Install gatherer using pip

    pip install git+git://github.com/psherman/gatherer.git

For Windows users, if installing `lxml` causes errors, download the wheel from the [Python Extension Packages for Windows](http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) and place the wheel in your project. Pip install that file, then try the above gatherer installation.

Example: (the filename will vary depending on your system and python version)

    pip install lxml-3.4.4-cp34-none-win_amd64.whl

##Usage

###Cache
A cache is a folder where static copies of the html for a page are stored to prevent multiple unnecessary requests to a server for a page. Currently the cache is very simple, storing a page the first time it is encountered and then subsequently always using that cached version. This is not ideal for pages where the content changes frequently (eg pages with user submitted content), so no cache should be used for pages where multiple requests to the same url will return different content.

Arguments:

* `folder`: folder to store the cached pages in.

```python
from gatherer import Cache

cache = Cache("cache_folder")
```

###Fetch
A fetcher takes a url and return the DOM (as parsed by `lxml`) of the corresponding web page. Requests can either be static (default) or dynamic. In order to make dynamic requests, the `make_dynamic` function needs to be called on the fetcher.

Arguments:

* `sleep_time`: how long to wait until the next request. (default `5`)
* `headers`: a dict of headers to send with the request. Your headers should include a `'User-Agent'` key to identify your gatherer.
* `cache`: an optional `Cache` object used to store webpages to mitigate duplicate requests (default `None`)

```python
from gatherer import Fetch

fetch = Fetch(headers={"User-Agent": "custom-gatherer-user-agent"})
```

######get(url, dynamic=False)
Takes a url and if the request was successful it returns an lxml html element, otherwise it returns `None`

```python
fetch.get("http://www.example.com")
```

######make_dynamic(phantom_path, js_path)
`make_dynamic` sets up the fetcher to be able to make requests to pages that have data you want to collect that is dynamically loaded. This requires PhantomJS and a Phantomjs script that logs the page's html. PhantomJS can be downloaded from its [website](http://phantomjs.org/). The code in [html_text.js](/html_text.js) should be downloaded and placed in your project folder. Calling this allows get requests using PhantomJS to be made by passing a `dynamic=True` argument in your `get` calls. If either path does not exist, this will raise a `ValueError`.

```python
f.make_dynamic("phantomjs/phantomjs.exe", "html_text.js")
```

###Pages
Pages are collections of rules to gather data from elements in a web page. For a better explanation of the makeup of a Page, read the README for [Forager](https://github.com/psherman/forager)

####Page

`Page`s are used to gather data from a specific page (url).

Usage:

```python
import json
from gatherer import Page, Fetch
from gatherer.errors import BadJSONError

f = Fetch()
try:
    with open("page.json") as fp:
        data = json.load(fp)
except FileNotFoundError:
    # the page json path is incorrect
try:
    p = Page.from_json(data)
except BadJSONError:
    # your page json isn't properly formatted
```

Use the `Fetch` object to get the data for the page by calling `get` with the `url` of the desired page.

```python
from gatherer import Fetch
f = Fetch()
dom = f.get(url)
data = p.gather(dom)
```

####expect

When the HTML of a web page is changed unexpected results can happen when gathering data. To verify that a Page's schema should still match data as expected, use `gatherer.expect`.

#####flatten_element(element)

`flatten_element` returns a dict where the keys are rule names and the values are the type that is expected to be returned by that rule (`str`, `int`, or `float`). A fourth value is also possible: for elements whose `spec` `type` is `all`, a `dict` containing the rule name/types for that element's rules and its children is returned.

```python
# element's json contains "title" and "author" rules
ele = Element.from_json({
  "selector": "div.main",
  "spec": {
    "type": "single",
    "value": 0
  },
  "children": [
    {
      "selector": "h1",
      "spec": {
        "type": "single",
        "value": 0
      },
      "children": [],
      "rules": [
        {
          "name": "title",
          "attr": "text",
          "type": "string"
        }
      ]
    },
    {
      "selector": "p.author",
      "spec": {
        "type": "single",
        "value": 0
      },
      "children": [],
      "rules": [
        {
          "name": "author",
          "attr": "text",
          "type": "string"
        }
      ]
    }
  ],
  "rules": []
})

flattened = flatten_element(ele)
"""
flattened == {
    "title": str,
    "author": str
}
"""
```

#####compare(values, expected)

`compare` compares the types of values returned from a page to their expected type, returning a boolean `True` if everything matches, and `False` if anything is wrong.

```python
flattened = {
    "title": str,
    "author": str
}
values = {
    "title": "The Dark Forest",
    "author": "Liu Cixin"
}
compare(values, flattened) # True

missing_values = {
    "title": "The Three-Body Problem"
}
compare(missing_values, flattened) # False
```

#####differences(values, expected)

`differences` is similar to `compare` but returns a `dict` telling you which values are missing or have unexpected types. If everything is as expected, it returns None.

```python
flattened = {
    "title": str,
    "author": str
}
values = {
    "title": "The Dark Forest",
    "author": "Liu Cixin"
}
differences(values, flattened) # None

missing_values = {
    "title": "The Three-Body Problem"
}
missing_diffs = differences(missing_values, flattened)
"""
missing_diffs == {
    "author": {
        "expected": <class "str">,
        "actual": <class "NoneType">,
        "value": None
    }
}
"""


bad_type = {
    "title": 3,
    "author": "Liu Cixin"
}
type_diffs = differences(bad_type, flattened)
"""
type_diffs == {
    "title": {
        "expected": <class "str">,
        "actual": <class "int">,
        "value": 3
    }
}
"""
```