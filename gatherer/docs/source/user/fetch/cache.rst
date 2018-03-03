Cache
=====

``Gatherer`` includes a basic ``Cache`` which uses the file system to save the HTML content of web pages that have been previously requested.

.. code-block:: python

  from gatherer import Cache

  c = Cache("cache-folder")

Files will be saved based on the url. The cache folder has a folder for each domain. Inside the domain are files whose names are the urls of the web pages they are from. Any characters that are not allowed in filenames (for Windows) are stripped out of the url filename string prior to saving.

Arguments
^^^^^^^^^

folder
++++++

The location of the folder where the cached files should be saved.

max_age
+++++++

If you want to remove cached files that are stale, you can specify a ``max_age``. If this is specified, on creation of the cache and when requesting a resource, files will be verified that they are younger than ``max_age`` and deleted if they are not.

This value is specified in seconds and by default is not set.

Custom Cache
^^^^^^^^^^^^

If you want to create your own cache system for your ``Fetch`` class to use, it needs to implement two methods: ``get`` and ``save``.

get(url)
++++++++

``get`` returns the text content for the web page at the url if a cached version exists, otherwise it returns None.

save(url, text)
+++++++++++++++

``save`` saves the text in a way that it can be identified given the url.
