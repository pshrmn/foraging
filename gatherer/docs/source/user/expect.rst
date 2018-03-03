Expected Data
=============

The structure and values within web pages that are outside of your control can change unexpectedly. ``Gatherer`` includes two functions: ``compare`` and ``differences`` (and a helper function ``flatten_element``) to help you make sure that your ``Page`` will continue to select data as expected.

flatten_element
^^^^^^^^^^^^^^^

``flatten_element`` returns a dict that represents the structure of the data dict that an ``Element``'s ``data`` method returns.

The keys in the dict will be the names of the ``Rules`` and the values will be the ``Rule``'s type (``string``, ``float``, or ``int``).

For ``all`` ``Elements``, ``flatten_element`` will add a key-value pair of that ``Element``'s spec ``value`` as the key and a dict of that ``Element``'s flattened rules as a value.

Arguments
+++++++++

``element`` - the ``Element`` to be flattened.

Example
+++++++

.. code-block:: python

  ele = SingleElement(
      selector="a",
      spec={"type": "single", "value": 0},
      optional=False,
      children=[],
      rules=[
          Rule(name="url", attr="href", _type="string"),
          Rule(name="title", attr="text", _type="string")
      ]
  )

  flat = flatten_element(ele)
  """
  flat == {
      "url": str,
      "title": str
  }
  """

  nested_ele = AllElement(
      selector="div.author",
      spec={"type": "all", "value": "authors"},
      optional=False,
      children=[
          SingleElement(
              selector="a",
              spec={"type": "single", "value": 0},
              optional=False,
              children=[],
              rules=[
                  Rule(name="url", attr="href", _type="string"),
                  Rule(name="title", attr="text", _type="string")
              ]
          )
      ],
      rules=[]
  )

  flat = flatten_element(nested_ele)
  """
  flat == {
      "authors": {
          "url": str,
          "title": str
      }
  }
  """  

compare
^^^^^^^

``compare`` returns a boolean which is ``True`` when the data matches the expected output and ``False`` when it does not. This is a simple way to let you know when the data isn't as expected, but doesn't tell you what is wrong.

Arguments
+++++++++

``data`` - the data returned by a ``Page``'s ``data`` call.
``expected`` - the expected rule names and types (from calling ``flatten_element`` on a ``Page``'s root ``Element``)

differences
^^^^^^^^^^^

``differences`` lets you know what differences (in type/existence) there are between the data returned by a ``Page`` and what was expected. This returns ``None`` when there are no differences.

Arguments
+++++++++

``data`` the data returned by a ``Page``'s ``data`` call.
``expected`` - the expected rule names and types (from calling ``flatten_element`` on a ``Page``'s root ``Element``)
