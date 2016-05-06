Backends
========

``Gatherer`` needs web pages to parse and extract data out of. To do so, it must make requests to the URLs where the data is located. The response to the requests can then be parsed and your ``Gatherer`` ``Page`` can select the elements that it requires.

There are two main situations when it comes to the response content. The first one, which is the easist to handle, is when all of the content that your ``Page`` requires is included in the static markup of the web page. When this is the case, it is unnecessary to have the web page's scripts execute, so we just return the HTML of the web page. The second case is when there is dynamically loaded content that requires scripts to run before the page is fully initialized. This requires the scripts to be downloaded and executed, which adds both time and bandwidth costs to getting these web pages.

``Gatherer`` uses ``backends`` to make requests and return responses. A ``backend`` takes two arguments, a ``url`` string and a ``headers`` dict. The ``url`` identifies what web page we want and the ``headers`` provides any request headers that might be needed by the server to handle our request. A ``backend`` returns the HTML content of a web page as a string. When a request fails, for whatever reason, the ``backend`` will return None.

.. code-block:: python

  def backend(url, headers):
    # make the request
    resp = requests.get(url, headers=headers)
    # check if the request was successful
    if resp.success:
      return resp.text
    # when the request was unsuccessful, return None
    else:
      return None

Builtin Backends
^^^^^^^^^^^^^^^^

``Gatherer`` comes with two ``backends``, one for each of the situations described above.

requests_backend
++++++++++++++++

``requests_backend`` is used to make requests for static data.

.. code-block:: python

  from gatherer.backends import requests_backend

  url = "https://www.example.com"

  html_text = requests_backend(url)

phantom_backend
+++++++++++++++

``phantom_backend`` is used to make requests for dynamic data. It makes use of PhantomJS, which will load and execute any JavaScript for the page. In order to use the ``phantom_backend``, you need to provide it two paths: 1) the location of the PhantomJS executable and 2) the location of the PhantomJS script. The PhantomJS executable can be downloaded from the `PhantomJS <http://phantomjs.org/>`_ website. The PhantomJS script is a JavaScript file that will be run by PhantomJS to make the request. There is a simple ``html_text.js`` file in the `Gatherer <https://github.com/pshrmn/gatherer>`_ repository that can be used for this.

While the ``requests_backend`` only downloads the main response to the request, the ``phantom_backend`` downloads the JavaScript and CSS files linked to in the web page. Unless your code needs access to dynamic content, it should prefer to use the ``requests_backend``.

.. code-block:: python

  from gatherer.backends import phantom_backend

  url = "https://www.example.com/dynamic-page";

  # initialize the backend with the PhantomJS executable and script paths
  phantom_exe = "path/to/phantomjs.exe"
  phantom_script = "path/to/script.js"
  phantom = phantom_backend(phantom_exe, phantom_script)

  html_text = phantom(url)
