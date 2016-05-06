Elements
========

``Elements`` are used to match DOM elements. An ``Element`` has a selector property, which is a CSS selector, to match elements in the DOM. Further, an ``Element`` has a ``spec`` which specifies which of the matched DOM elements are wanted. ``Elements``, much like the DOM, have a tree structure, so an ``Element`` keep a list of its ``children`` ``Elements``.

.. code-block:: python

  from gatherer.element import Element

  ele_json = {
    "selector": "a",
    "spec": {
      "type": "single",
      "value": 1
    },
    "children": [],
    "rules": [...],
    "optional": False
  }

  ele = Element.from_json(ele_json)

Arguments
^^^^^^^^^

selector
++++++++

The CSS selector string used to match DOM elements. This selector will be used relative to the elements matched by its parent.

spec
++++

The ``spec`` is a dict with two properties: ``type`` and ``value``. The ``type`` specifies which of the matched DOM elements to use and the ``value`` adds additional information based on the ``type``.

The ``type`` of the ``spec`` will either be:

* ``single`` - to state that the ``Element`` should only match a single DOM element among the list of elements that the ``Element``'s selector matches.
* ``all`` - to state that all DOM elements matched by the ``Element``'s selector should be matched.

The value for either type provides different information. For ``type``:

* ``single`` - the ``value`` will be the index of the DOM element in the matches list that we want.
* ``all`` - the ``value`` will be the name of the list that the matches' data should be stored in.

children
++++++++

An ``Element`` can have child ``Elements`` that are used to select further nested DOM elements.

rules
+++++

A list of ``Rules`` to describe how to extract data from the matched DOM element(s).

optional
++++++++

A boolean describing whether or not the ``Element`` is required. When ``False`, if no DOM elements are matched by selector, ``_get_element_data`` will return None.

Methods
^^^^^^^

from_json(element_json)
+++++++++++++++++++++++

The ``from_json`` method is a class method that creates a new ``Element`` from a JSON configuration dict.

data(parent)
+++++++++++

``data`` takes a parent DOM element and returns a dict of all data from it and its child ``Elements`` merged together. If at any point the ``Element`` or its child ``Elements`` fail to match any DOM elements, and the ``Element`` is not optional, ``data`` will return ``None``.
