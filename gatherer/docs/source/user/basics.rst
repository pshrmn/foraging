Basics
======

The purpose of ``Gatherer` is to get structured data out of HTML. In order to do this, ``Gatherer`` has two main functions: getting the contents of a web page for a given url and extracting the desired data from that web page. ``Gatherer``'s ``Fetch`` class is used to get the content of a web page and the ``Page`` class extracts the desired data from the web page. The ``Page`` is made up of a collection of ``Elements`` and ``Rules``. The elements match DOM elements in the web page and the rules specify what attributes of the elements have the desired data.

Simple Example
^^^^^^^^^^^^^^

.. code-block:: python

  from gatherer import Fetch, Page

  fetcher = Fetch()

  with open("path/to/page.json") as fp:
    page_json = json.load(fp)
  page = Page.from_json(page_json)

  url = "http://www.example.com"
  dom = fetcher.get(url)
  data = page.gather(dom)
