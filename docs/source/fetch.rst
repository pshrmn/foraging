Fetch
=====

:code:`Gatherer` uses a :code:`Fetch` class to request the content of a web page.

.. code-block:: python

  from gatherer import Fetch

  fetcher = Fetch()

Arguments
^^^^^^^^^

backend
+++++++

The :code:`backend` is a function that makes the request for a URL and returns the text content of the web page. For more information on backends, check out the `backend documentation <./backends.html>`_. The default backend that :code:`Gatherer` uses is the :code:`requests_backend`.

headers
+++++++

Any headers to be sent with the request should be passed in through a :code:`headers` dict. It is a good idea to pass a :code:`User-Agent` header to identify yourself to the server.

sleep_time
++++++++++

In order to prevent a deluge of requests to one server, :code:`Fetch` can take a sleep time which is the minimum amount of time that should pass between requests to the server. This is implemented on a per-domain basis. The default sleep time is :code:`5` seconds.

cache
+++++

To prevent having to make multiple requests for the same URL, :code:`Fetch` can take a :code:`Cache` class. When a request is made for a URL, it will first check the cache to see if a cached version of the URLs content exists. If it does, that will be used instead of making a new request.

Methods
^^^^^^^

get(url, no_cache)
++++++++++++++++++

The :code:`get` method is used to get the DOM for a given URL. It returns an :code:`lxml` html element when successful, and None when it is not.

Arguments
---------

:code:`url`

The URL of the web page that you wish to get the data from. This must be a full URL (including the http/https scheme)

:code:`no_cache`

If you are using a cache, but want a specific request to be made without checking the cache, use :code:`no_cache=True`. By default, this is :code:`False`.

.. code-block:: python

  cache = Cache("cache")
  # get calls from fetcher will first check the cache
  # for content
  fetcher = Fetch(cache=cache)

  dom = fetcher.get('http://www.example.com', no_cache=True)



parse(text, url)
++++++++++++++++

This converts the text content of a webpage to an :code:`lxml` element. It also transforms relative urls to absolute urls using the provided url argument.

Arguments
---------

:code:`text`

The text content of the web page.

:code:`url`

The url of the web page, used for making links absolute.
