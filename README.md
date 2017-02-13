#gatherer

Gather data from web pages. Works with pages created by [Forager](https://github.com/pshrmn/forager). For the data format, refer to that project's README.

##[Tutorial](http://www.pshrmn.com/tutorials/gatherer/)
##[Examples](https://github.com/pshrmn/gatherer-examples)

##Install

Install gatherer using pip

    pip install git+git://github.com/pshrmn/gatherer.git

For Windows users, if installing `lxml` causes errors, download the wheel from the [Python Extension Packages for Windows](http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) and place the wheel in your project. Pip install that file, then try the above gatherer installation.

Example: (the filename will vary depending on your system and python version)

    pip install lxml-3.4.4-cp34-none-win_amd64.whl

##Usage

###Cache
A cache is a folder where static copies of the html for a page are stored to prevent multiple unnecessary requests to a server for a page. Currently the cache is very simple, storing a page the first time it is encountered.

Arguments:

* `folder`: folder to store the cached pages in.
* `hasher`: a function used to create a filename from a url
* `max_age`: the maximum time (in seconds) that a cached page should be considered valid.

```python
from gatherer import Cache

cache = Cache("cache_folder")
```

By default, the `Cache` will use save file using filenames created using `clean_url_hash` which works by removing any illegal filename characters (for Windows) from a url. However, you can provide it any function that you would like (which returns a legal filename string). A function `md5_hash` is also provided which hashes the url using md5 and returns the result as a hexadecimal string.

```python
from gatherer import Cache, md5_hash

cache = Cache("cache_folder", hasher=md5_hash)
```

You can pass the `Cache` a `max_age` to specify that files that were last modified longer than `max_age` seconds ago are removed from the cache folder. Each time that you call the `get` method of the cache, the associated file will be checked to see if it has expired.

```python
week_in_seconds = 7*24*60*60
cache = Cache("cache_folder", max_age=week_in_seconds)
```

There is also a `GzipCache` which will compress the files before saving them to disk and decompress them when reading. If you want to minimize the amount of disk space used by the cache, use the `GzipCache`.

```python
from Gatherer import GzipCache

compress_cache = GzipCache("cache_folder")
```

If you have an existing cache directory that you would like to convert to a `GzipCache`, you can use the `dangerously_convert_cache_to_gzip` function. As the name implies, you should be careful with this because it will gzip all of the files in the provided folder and remove the originals.

###Backends
Backend functions take a url and return the text of the returned web page. There are two built-in backends, `requests_backend` and `phantom_backend`.

* `requests_backend` (default) uses the `requests` module to make the request. This function can be passed directly to the `Fetch` class.
* `phantom_backend` is a closure that takes two paths, the first to the `phantomjs` executable and the second to a JavaScript script that `phantomjs` uses to get the content of a web page from a url. The closure returns a function that is passed to the Fetch class. This backend is most useful when you have pages whose content isn't given with the base HTML and relies on JavaScript to render the page.
* `session_backend` is a closure that takes a `requests.Session`. Any requests made with this backend will use the provided session. This is useful if you need to be authenticated when making requests.

###Fetch
A fetcher takes a url and return the DOM (as parsed by `lxml`) of the corresponding web page. Requests can either be static (default) or dynamic. In order to make dynamic requests, the `make_dynamic` function needs to be called on the fetcher.

Arguments:

* `backend`: a function that takes a url and headers and returns the text of the web page at the url.
* `headers`: a dict of headers to send with the request. Your headers must include a `'User-Agent'` key to identify your gatherer.
* `sleep_time`: how long to wait until the next request. (default `5`)
* `cache`: an optional `Cache` object used to store webpages to mitigate duplicate requests (default `None`)

```python
from gatherer import Fetch
from gatherer.backends import requests_backend, phantom_backend

fetch = Fetch(backend=requests_backend, headers={"User-Agent": "custom-gatherer-user-agent"})
# requests_backend is the default backend, so it doesn't
# actually need to be specified
fetch = Fetch(headers={"User-Agent": "custom-gatherer-user-agent"})

phantom_get = phantom_backend('./phantomjs.exe', './getScript.js')
dynamic_fetch = Fetch(backend=phantom_get, headers={"User-Agent": "custom-gatherer-user-agent"})
```

######get(url, dynamic=False)
Takes a url and if the request was successful it returns an lxml html element, otherwise it returns `None`

```python
fetch.get("http://www.example.com")
```

###Pages
Pages are collections of rules to gather data from elements in a web page. For a better explanation of the makeup of a Page, read the README for [Forager](https://github.com/pshrmn/forager)

####Page

`Page`s are used to gather data from a specific page (url).

Usage:

```python
import json
from gatherer import Page, Fetch

f = Fetch(headers={'User-Agent': 'example-agent'})
try:
    with open("page.json") as fp:
        data = json.load(fp)
except FileNotFoundError:
    # the page json path is incorrect
try:
    p = Page.from_json(data)
except ValueError:
    # your page json isn't properly formatted
```

Use the `Fetch` object to get the data for the page by calling `get` with the `url` of the desired page.

```python
dom = f.get(url)
data = p.gather(dom)
```

####expect

When the HTML of a web page is changed unexpected results can happen when gathering data. To verify that a Page's schema should still match data as expected, use `gatherer.expect`.

#####flatten_element(element)

`flatten_element` returns a dict of the expected structure of data fetched by the `Element`. In the structure dict, the keys are rule names and the values are the type that is returned by that rule (`str`, `int`, or `float`). A fourth value is also possible: for elements whose `spec` `type` is `all`, a `dict` containing the rule name/types for that element's rules and its children is returned.

```python
# element's json contains "title" and "author" rules
ele = Element.from_json({
  "selector": "div.main",
  "spec": {
    "type": "single",
    "index": 0
  },
  "children": [
    {
      "selector": "h1",
      "spec": {
        "type": "single",
        "index": 0
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
        "index": 0
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

Note: This uses an `Element`, not a `Page`. If you want to test a `Page`, pass the `Page`'s `element` attribute in the `flatten_element` call.

```python
page = Page.from_json(some_page_json)
flattened = flatten_element(page.element)
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

bad_values = {
  "title": "Death's End",
  "author": 7
}

compare(bad_values, flattened) # False
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