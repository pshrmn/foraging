Tutorial
========

This tutorial will be a continuation of the `Forager tutorial <http://www.pshrmn.com/tutorials/forager/tutorial.html>`_. If you have not completed that, save the `below JSON <#example-json>`_ to use.

:code:`Gatherer` should be installed before proceeding with this tutorial. For instructions on installating :code:`Gatherer`, see `here <installation.html>`_

Setup
^^^^^

While the directory layout is not strict, generally speaking keeping a rules directory to load page json files from and a data directory to save gathered data to, is recommended. The structure for this project should look like the following:

.. code-block:: none

  <directory>
  |-- subreddit.py
  |-- rules
  |   +-- www_reddit_com
  |       +-- submissions.json
  +-- data
      +-- subs.json

If you uploaded the rules using `Granary <https://github.com/pshrmn/granary>`_, the :code:`rules/www_reddit_com` directory will have been made for you. You only need to create the :code:`subreddit.py` file and :code:`data` directory.

If you are starting from here, you will need to create the :code:`subreddit.py` file and :code:`data` directory, as well as the :code:`rules` directory and the `below JSON <#example-json>`_.

Basics
^^^^^^

Parse the file containing the desired rules and create a :code:`Fetch` object to get content from urls and a :code:`Page` object to gather the desired data from the content. All of the content that will be useful for us is available in the static HTML markup, so we can use the default :code:`backend`, :code:`requests_backend` to make requests instead of specifying one.

.. code-block:: python

  import json
  from gatherer import Page, Fetch

  # open and load the submissions.json file
  with open("rules/www_reddit_com/submissions.json", "r") as fp:
      submission_json = json.load(fp)

  # provide a User-Agent because reddit rate limits crawlers
  # that do not provide one
  fetcher = Fetch(headers={"User-Agent": "subreddit-gatherer"})

  # create a Page using the rules json
  subreddit_page = Page.from_json(submission_json)

:code:`gatherer.Page` represents the rules to gather data from a webpage.

:code:`gatherer.Fetch` makes http requests to get the text contents from a url. It has a built in sleep between requests (default of 5 seconds), so you do not hit the server of the site you're gathering data from with too many requests. The :code:`Fetch` class can be provided a :code:`gatherer.Cache`, but for this tutorial we won't be using one because we always want fresh content.


At this point you have a :code:`Page` object that is ready to gather data.

Gathering Data
^^^^^^^^^^^^^^

To gather data, first call the :code:`get` function of your :code:`Fetch` object, passing it the desired url. Once that returns verify that it has returned a DOM (is not None), then pass the DOM to your :code:`Page` through its :code:`gather` function.

.. code-block:: python

  URL = "https://www.reddit.com/r/bodyweightfitness"
  dom = fetcher.get(URL)
  if dom is not None:
    submissions = subreddit_page.gather(dom)

Saving Data
^^^^^^^^^^^

Now that you have your submissions, you can save them to a json file and view them. The code below provides an indent value to :code:`json.dump` so that it pretty prints in the file.

.. code-block:: python

  with open("data/bwf.json", "w") as fp:
    json.dump(submissions, fp, indent=2)

End Result
^^^^^^^^^^

Your program should now look like the code shown below. The code below is properly formatted, so some of the snippets grouped above are mixed in with one another to form a properly formatted program.

.. code-block:: python

  import json

  from gatherer import Page, Fetch

  URL = "https://www.reddit.com/r/bodyweightfitness"

  fetcher = Fetch(headers={"User-Agent": "subreddit-gatherer"})  
  with open("rules/www_reddit_com/submissions.json", "r") as fp:
      submission_json = json.load(fp)

  subreddit_page = Page.from_json(submission_json)

  dom = fetcher.get(URL)
  if dom is not None:
    submissions = subreddit_page.gather(dom)

    with open("data/bwf.json", "w") as fp:
      json.dump(submissions, fp, indent=2)

Now, just call the program from your command line, and you should get a :code:`bwf.json` file in your data directory.

.. code-block:: none

  python subreddit.py

Example JSON
^^^^^^^^^^^^

.. code-block:: json

    {
      "name": "submissions",
      "element": {
        "selector": "body",
        "spec": {
          "type": "single",
          "value": 0
        },
        "rules": [],
        "optional": false,
        "children": [
          {
            "selector": "div.thing.link",
            "spec": {
              "type": "all",
              "value": "submissions"
            },
            "rules": [],
            "optional": false,
            "children": [
              {
                "selector": "a.title",
                "spec": {
                  "type": "single",
                  "value": 0
                },
                "rules": [
                  {
                    "attr": "text",
                    "name": "title"
                  },
                  {
                    "attr": "href",
                    "name": "url"
                  }
                ],
                "optional": false,
                "children": []
              },
              {
                "selector": "div.score",
                "spec": {
                  "type": "single",
                  "value": 1
                },
                "rules": [
                  {
                    "attr": "text",
                    "name": "score"
                  }
                ],
                "optional": false,
                "children": []
              },
              {
                "selector": "a.comments",
                "spec": {
                  "type": "single",
                  "value": 0
                },
                "rules": [
                  {
                    "attr": "href",
                    "name": "comments_url"
                  },
                  {
                    "attr": "text",
                    "name": "comment_count"
                  }
                ],
                "optional": false,
                "children": []
              }
            ]
          }
        ]
      }
    }    
