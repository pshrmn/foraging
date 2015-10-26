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

    from gatherer import Cache

    cache = Cache("cache_folder")

###Fetch
A fetcher takes a url and return the DOM (as parsed by `lxml`) of the corresponding web page. Requests can either be static (default) or dynamic. In order to make dynamic requests, the `make_dynamic` function needs to be called on the fetcher.

Arguments:

* `sleep_time`: how long to wait until the next request. (default `5`)
* `headers`: a dict of headers to send with the request. Your headers should include a `'User-Agent'` key to identify your gatherer.
* `cache`: an optional `Cache` object used to store webpages to mitigate duplicate requests (default `None`)


    from gatherer import Fetch

    fetch = Fetch(headers={"User-Agent": "custom-gatherer-user-agent"})

######get(url, dynamic=False)
Takes a url and if the request was successful it returns an lxml html element, otherwise it returns `None`

    fetch.get("http://www.example.com")

######make_dynamic(phantom_path, js_path)
`make_dynamic` sets up the fetcher to be able to make requests to pages that have data you want to collect that is dynamically loaded. This requires PhantomJS and a Phantomjs script that logs the page's html. PhantomJS can be downloaded from its [website](http://phantomjs.org/). The code in [html_text.js](/html_text.js) should be downloaded and placed in your project folder. Calling this allows get requests using PhantomJS to be made by passing a `dynamic=True` argument in your `get` calls. If either path does not exist, this will raise a `ValueError`.

    f.make_dynamic("phantomjs/phantomjs.exe", "html_text.js")

###Pages
Pages are collections of rules to gather data from elements in a web page. For a better explanation of the makeup of a Page, read the README for [Forager](https://github.com/psherman/forager)

####Page

`Page`s are used to gather data from single pages.

Usage:

    import json
    from gatherer import Page, Fetch

    f = Fetch()
    with open("page.json") as fp:
        data = json.load(fp)
    try:
        p = Page.from_json(data)
    except BadJSONError:
        # your page json isn't properly formatted

Use the `Fetch` object to get the data for the page by calling `get` with the `url` of the desired page.

    from gatherer import Fetch
    f = Fetch()
    dom = f.get(url)
    data = p.gather(dom)
