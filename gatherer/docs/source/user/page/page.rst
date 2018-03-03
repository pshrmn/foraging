Page
====

The ``Page`` is responsible for getting the desired data out of the DOM of a web page. A ``Page`` is made up of `Elements <./elements.html>`_ that match DOM elements within the provided DOM. `Rules <./rules.html>`_ are used on matched DOM elements to get data either from attributes of the element or from the element's text content.

Arguments
^^^^^^^^^

name
++++

The name of the page.

element
+++++++

The root ``Element`` of the ``Page`` (this ``Element`` will select the ``document.body``)

Methods
^^^^^^^

from_json(page_json)
++++++++++++++++++++

A class method, ``from_json`` creates a new ``Page`` given a Python dict of the desired ``Page`` structure. This can be created using `Forager <https://github.com/pshrmn/foraging/forager>`_. If there is an error in creating the ``Page``, a ``ValueError`` will be raised.

.. code-block:: python

  import json
  from gatherer import Page

  with open("path/to/page.json") as fp:
    page_json = json.load(fp)

  try:
    page = Page.from_json(page_json)
  except ValueError as e:
    print("Error creating page", e)

gather(dom)
+++++++++++

Given a DOM (an ``lxml`` html element), gather will select the proper ``Elements`` in the DOM and extract the data as defined by their ``Rules``.

.. code-block:: python

  dom = fetcher.get(url)
  # verify that the fetch succeeded
  if dom is not None:
    data = page.gather(dom)
