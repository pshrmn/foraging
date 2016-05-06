Data Merging
============

So how does ``Gatherer`` merge the data together? In short, it performs depth first traversal where for each ``Element``, merging the data from an ``Element`` with the data from its children. For more detail continue reading the walkthrough below.

**Note**: In order to more succinctly describe ``Elements``, they will be described using their selector and spec. ``div[0]`` means that the CSS selector is ``div``, the spec type is ``single`` and the spec value is ``0``. ``[div]`` means that the CSS selector is ``div`` and the spec type is ``all``.

Basic Merge
^^^^^^^^^^^

Below we will work through the same flow that ``Gatherer`` uses to get the desired data from a web page.

Setup
+++++

We will start with the following HTML:

.. code-block:: html

  <html>
    <body>
      <section id="first">
        <a href="/one">One</a>
        <p>First paragraph</p>
        <a href="/foo">Foo</a>
      </section>
      <section id="second">
        <a href="/two">Two</a>
        <p>Second paragraph</p>
        <p>Bar paragraph</p>
      </section>
      <section id="third">
        <a href="/three">Three</a>
        <p>Third paragraph</p>
      </section>
    </body>
  </html>

And the following ``Page``:

.. code-block:: json

  {
    "selector": "body",
    "spec": {"type": "single", "value": 0},
    "optional": false,
    "rules": [],
    "children": [
      {
        "selector": "section",
        "spec": {"type": "all", "value": "sections"},
        "optional": false,
        "rules": [],
        "children": [
          {
            "selector": "a",
            "spec": {"type": "single", "value": 0},
            "optional": true,
            "rules": [
              {
                "name": "url",
                "attr": "href",
                "type": "string"
              },
              {
                "name": "title",
                "attr": "text",
                "type": "string"
              }
            ],
            "children": []
          },
          {
            "selector": "p",
            "spec": {"type": "single", "value": 0},
            "optional": false,
            "rules": [
              {
                "name": "description",
                "attr": "text",
                "type": "string"
              }
            ],
            "children": []
          }
        ]
      }
    ]
  }

In the shorthand, the ``Page`` has the following ``Elements``:

.. code-block:: python

    body[0]
        [section]
            a[0]
            p[0]

Root Element
++++++++++++

The root ``Element`` of a `Page`` is always ``body[0]``, so we will start by selecting all of the ``body`` elements in the DOM (which should only be one). Because this is a ``single``, we use the spec value, ``0``, to specify that we want only the 0th element in the list. The ``Element`` then gets the data for its ``Rules``, but since there aren't the data is an empty dict.

.. code-block:: python

  # selectAll is pseudo function that does the same
  # thing as JavaScript's Element.querySelectorAll
  bodies = DOM.selectAll("body")
  body = bodies[0]
  # body == <body></body>

  body_data = {}

Children
++++++++

Next the ``Element`` iterates over its children ``Elements`` and merges returned data dicts into its data dict.

The first child ``Element`` is ``[section]``, so we select all ``section`` DOM elements. Because this is an ``all`` ``Element``, we will be grouping the data from the ``section`` elements into a list. The data returned by the ``[section]`` ``Element`` will use its spec value as the key to the list in the data dict.

.. code-block:: python

  section_element = Element(
    selector="section",
    spec={"type": "all", "value": "sections"},
    ...
  )
  section_data = section_element.get(parent)
  # section_data == {"sections": [...]}

Now, we iterate over that list and get data for each one. Like the ``body[0]`` selector, ``[section]`` has no ``Rules``.


.. code-block:: python

  sections = body.selectAll("section")
  section_list = []
  for section in sections:
      section_data = {}


``[section]`` has two children that we can select: ``a[0]`` and ``p[0]``. Each of those has rules that we can merge into the ``section_data`` dict. The ``a[0]`` ``Element`` has two rules: ``href`` which is saved as ``url`` and ``text`` which is saved as ``title`. The ``p[0]`` ``Element`` has one rule: ``text`` which is saved as ``description``.

.. code-block:: python

  def get_link(section)
      links = section.selectAll("a")
      link = links[0]
      return {
          "url": link.getAttribute("href"),
          "title": link.textContent()
      }

  def get_paragraph(section):
      paragraphs = section.selectAll("p")
      paragraph = paragraphs[0]
      return {
          "description": paragraph.textContent()
      }

The data from each of the child ``Elements`` can then be merged back into each section element's data dict. Then the data can be added to the list of section data.

.. code-block:: python

  sections = body.selectAll("section")
  section_list = []
  for section in sections:
      section_data = {}
      link_data = get_link(section)
      for key, val in link_data.items():
          section_data[key] = val

      paragraph_data = get_paragraph(section) 
      for key, val in paragraph_data.items():
          section_data[key] = val

      section_list.append(section_data)

Once we have iterated over all of the sections, we create a dict with the list of all of their data. The name of the list of the spec value of the ``[section]`` ``Element``, which in this case is ``sections``.

.. code-block:: python

  sections_data = {
      "sections": section_list
  }

That data is then merged into the ``body[0]``'s data.

.. code-block:: python

  for key, val in sections_data.items():
      body_data[key] = val

Now, we have a dict containing the data for each

.. code-block:: python

  body_data == {
    "sections": [
      {
          "url": "/one",
          "title": "One",
          "description": "First paragraph"
      },
      {
          "url": "/two",
          "title": "Two",
          "description": "Second paragraph"
      },
      {
          "url": "/three",
          "title": "Three",
          "description": "Third paragraph"
      }
    ]
  }

Optional Elements
^^^^^^^^^^^^^^^^^

In the above HTML, every ``Element`` had the desired matching DOM element, but what if that was not the case? Take the following HTML:

.. code-block:: html

  <body>
    <!-- other sections ... -->
    <section>
      <a href="/five">Five</a>
    </section>
  </body>

That contains the ``a[0]`` child, but not the ``p[0]`` child, so lets take another look at the ``get_paragraph`` function. When ``get_paragraph`` calls ``section.selectAll("p")``, it won't match any items, so paragraph will be an empty list. Then, our ``paragraphs[0]`` call would cause an ``IndexError``. We should make a check that ``selectAll``'s result is not empty, and return ``None`` when it is.

.. code-block:: python

    def get_paragraph(section):
      paragraphs = section.selectAll("p")
      if not paragraphs:
          return
      paragraph = paragraphs[0]
      return {
          "description": paragraph.textContent()
      }

That fixes the issue in ``get_paragraph``, but what about when we merge the ``p[0]`` data back into the section's data? ``get_paragraph`` will have returned ``None``, but our code expects to call the ``items`` method of a dict. Trying to do that on a ``None`` value will cause an ``AttributeError``, so we should check for ``None`` before merging.

.. code-block:: python

  paragraph_data = get_paragraph(section) 
  if paragraph_data:
    for key, val in paragraph_data.items():
        section_data[key] = val

Just making sure that the ``paragraph_data`` is not ``None`` will result in our data dict for this section being:

.. code-block:: python

  section_data == {
      "url": "/five",
      "title": "Five"
  }

That would be fine if the ``p[0]`` ``Element`` was optional, but it is not (``optional=False``). So what should be do then? If the data for an ``Element`` is ``None`` and the ``Element`` is not optional, then its parent's data should also be ``None``, but when an ``Element`` is optional, we should just skip merging its data. In our case the ``p[0]`` ``Element`` is not optional, but the ``a[0]`` ``Element`` is.

.. code-block:: python

  section_list = []

  for section in sections:
      section_data = {}
      link_data = get_link(section)
      # when we get data, merge as usual
      # because a[0] is optional, we do nothing
      # when link_data is None
      if link_data:
          for key, val in link_data.items():
              section_data[key] = val

      paragraph_data = get_paragraph(section) 
      # when we get data, merge as usual
      # because p[0] is not optional, we continue
      # to the next section when paragraph_data
      # is None
      if paragraph_data:
          for key, val in paragraph_data.items():
              section_data[key] = val
      else:
        continue

      section_list.append(section_data)

Now, because that section didn't have a ``<p>`` DOM element, ``continue`` gets called and the data for that section is not added to the list of section data.

What about rules that don't exist? Rules are always required, so if 

Full Example Code
^^^^^^^^^^^^^^^^^

**Note:** While the code in here looks Pythonic, it is actually pseudocode, so this can't actually be run. It should just be considered a useful reference for understanding how ``Gatherer``'s data collection works.

.. code-block:: python

  """
  selectAll is pseudo function that does the same
  thing as JavaScript's Element.querySelectorAll
  """

  def get_body(DOM):
      bodies = DOM.selectAll("body")
      body = bodies[0]
      # body == <body></body>

      body_data = {}

      sections_data = get_sections(body)
      for key, val in sections_data.items():
          body_data[key] = val

      return body_data


  def get_sections(body):
      sections = body.selectAll("section")
      section_list = []

      for section in sections:
          section_data = {}
          link_data = get_link(section)
          # when we get data, merge as usual
          # because a[0] is optional, we do nothing
          # when link_data is None
          if link_data:
              for key, val in link_data.items():
                  section_data[key] = val

          paragraph_data = get_paragraph(section) 
          # when we get data, merge as usual
          # because p[0] is not optional, we continue
          # to the next section when paragraph_data
          # is None
          if paragraph_data:
              for key, val in paragraph_data.items():
                  section_data[key] = val
          else:
            continue

          section_list.append(section_data)

      sections_data = {
          "sections": section_list
      }

  def get_link(section)
      links = section.selectAll("a")
      if not links:
          return
      link = links[0]
      return {
          "url": link.getAttribute("href"),
          "title": link.textContent()
      }

  def get_paragraph(section):
      paragraphs = section.selectAll("p")
      if not paragraphs:
          return
      paragraph = paragraphs[0]
      return {
          "description": paragraph.textContent()
      }

  url = "http://www.example.com"
  dom = fetcher.get(url)
  data = get_body(dom)
