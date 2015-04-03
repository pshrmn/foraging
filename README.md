#collector

Collect data from web pages. Works with pages created by [collectJS](https://github.com/psherman/collectorjs). For the data format, refer to that project's README.

##Install

Install collector using pip

    pip install git+git://github.com/psherman/collector.git

For Windows users, if installing `lxml` causes errors. Download the wheel from the [Python Extension Packages for Windows](http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) and place the wheel in your project. Pip install that file, the try the above collector installation.

Example: (the filename will vary depending on your system and python version)

    pip install lxml-3.4.2-cp34-none-win32.whl

##Usage



###Fetch
A fetcher takes a url and return the html contents of the corresponding web page. Requests can either be static (default) or dynamic. In order to make dynamic requests, the `make_dynamic` function needs to be called.

Arguments:

* `sleep_time`: how long to wait until the next request. (default `5`)
* `headers`: a dict of headers to send with the request. Your headers should include a `'User-Agent'` key to identify your collector.
* `cache`: an optional `Cache` object used to store webpages to mitigate duplicate requests (default `None`)


######get(url, dynamic=False)
Takes a url and returns an lxml html element if the request was successful, otherwise `None`

######make_dynamic(phantom_path, js_path)
This requires PhantomJS and a Phantomjs script that logs the page's html. PhantomJS can be downloaded from its [website](http://phantomjs.org/). The code in [html_text.js](/html_text.js) should be downloaded and placed in your project folder. Calling this allows get requests using PhantomJS to be made. If either path does not exist, this will raise a `ValueError`. To make dynamic requests, provide `True` as the second argument in a `get` call.

    f.make_dynamic("phantomjs/phantomjs.exe", "html_text.js")

###Pages
Pages are collections of rules to collect data from elements in a web page. For a better explanation of the makeup of a Page, read the README for [collectorJS](https://github.com/psherman/collectorjs)

####Page

`Page`s are used to collect data from single pages.

Usage:

    import json
    from collector import Page

    with open("page.json") as fp:
        data = json.load(fp)
    try:
        p = Page.from_json(data)
    except BadJSONError:
        # your page json isn't properly formatted

Use the `Fetch` object to get the data for the page by calling `get` with the `url` of the desired page.

    data = p.get(url)
