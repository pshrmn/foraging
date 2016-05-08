Elements
========

``Elements`` are used to match DOM elements. An ``Element`` has a selector property, which is a CSS selector, to match elements in the DOM. Further, an ``Element`` has a ``spec`` which specifies which of the matched DOM elements are wanted. ``Elements``, much like the DOM, have a tree structure, so an ``Element`` keep a list of its ``children`` ``Elements``. ``Gatherer`` has different ``Element`` classes for different spec types: ``SingleElement`` for single spec type elements and ``AllElement`` for all spec type elements. ``Gatherer`` provides an ``ElementFactory`` to facilitate creating the different ``Elements`` based on the spec.

ElementFactory
^^^^^^^^^^^^^^

.. code-block:: python

  from gatherer.element import ElementFactory, SingleElement

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

  ele = ElementFactory.from_json(ele_json)
  # spec type = "single"
  isinstance(ele, SingleElement) == True

from_json(element_json)
+++++++++++++++++++++++

Returns a new ``Element``. The class type of the ``Element`` will be based on the ``type`` value of the ``spec``. When ``type="single"``, returns a ``SingleElement``. When ``type="all"``, returns an ``AllElement``. Otherwise, returns an ``Element``.

Element
^^^^^^^

Attributes
++++++++++

1. ``selector``

The CSS selector string used to match DOM elements. This selector will be used relative to the elements matched by its parent.

2. ``spec``

The ``spec`` is a dict that specifies how data selection works for the ``Element``. It has to have a ``type`` key which specifies which type of ``spec`` it is.with two properties: ``type`` and ``value``. The ``type`` specifies which of the matched DOM elements to use and the ``value`` adds additional information based on the ``type``.

3. ``children``

An ``Element`` can have child ``Elements`` that are used to select further nested DOM elements.

4. ``rules``

A list of ``Rules`` to describe how to extract data from the matched DOM element(s).

5. ``optional``

A boolean describing whether or not the ``Element`` is required. When ``False`, if no DOM elements are matched by selector, ``_get_element_data`` will return None.

Methods
+++++++

``data(parent)``

``data`` takes a parent DOM element and returns a dict of all data from it and its child ``Elements`` merged together. If at any point the ``Element`` or its child ``Elements`` fail to match any DOM elements, and the ``Element`` is not optional, ``data`` will return ``None``.

SingleElement
^^^^^^^^^^^^^

A ``SingleElement`` is created for ``type="single"`` spec elements. A ``SingleElement`` requires an ``index`` value in its spec, which must be an integer.

Methods
+++++++

``data(parent)``

``data`` returns the data from a single element of all elements matched by the selector. Which element is specified by the ``index`` value of the ``spec``. The ``index`` will specify the list index of the DOM element to use.

AllElement
^^^^^^^^^^

An ``AllElement`` is created for ``type="all"`` spec elements. An ``AllElement`` requires a ``name`` value in its spec, which must be a non-empty string.

Methods
+++++++

``data(parent)``

``data`` returns the data from all elements matched by the seletor. It returns a dict with one key value pair. The key is the ``name`` from the ``spec`` and the value is a list of the data dicts from each DOM element. Any elements that return ``None`` will be filtered out.
