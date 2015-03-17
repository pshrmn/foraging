#collector

Collect data from web pages. Works with schemas created by [collectJS](https://github.com/psherman/collectorjs). For the data format, refer to that project's README.

##Install

Install collector using pip

    pip install git+git://github.com/psherman/collector.git

For Windows users, if installing `lxml` causes errors. Download the wheel from the [Python Extension Packages for Windows](http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) and place the wheel in your project. Pip install that file, the try the above collector installation.

Example: (the filename will vary depending on your system and python version)

    pip install lxml-3.4.2-cp34-none-win32.whl

###SimpleSchema

`SimpleSchema`s are used to collect data from single pages.

`SimpleSchema` is currently the only type of schema implemented, but more advanced ones will be available in the future.

Create a Schema from a (properly formatted) json file

    import json
    from collector import SimpleSchema

    with open("schema.json") as fp:
        data = json.load(fp)
    try:
        s = Schema.from_json(data)
    except BadJSONError:
        # your schema isn't properly formatted

Get the data for the schema by getting `get` and providing a `url`

    data = s.get(url)

###Fetch
####Fetch
Arguments:

* `sleep_time`: how long to wait until the next request. (default `5`)
* `cache`: an optional `Cache` object used to store webpages to mitigate duplicate requests (default `None)

Usage:

    f = Fetch()

######Fetch.get(url)
Takes a url and returns an lxml html element if the request was successful, otherwise `None`

####DynamicFetch

Arguments
DynamicFetch is used to get pages where the data does not exist prior to some javascript has been run. 
This requires PhantomJS and a Phantomjs script that logs the page's html. PhantomJS can be downloaded from its [website](http://phantomjs.org/). The code in [html_text.js](/blob/master/html_text.js) should be downloaded and placed in your project folder.

Arguments:

* `phantom_path` - location of phantomjs.exe (required)
* `js_path` - location of phantomjs script (required)


Usage:

    d_f = DynamicFetch("phantomjs/phantomjs.exe", "html_text.js")
