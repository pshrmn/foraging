Rules
=====

A ``Rule`` describes how to get the desired data from a DOM element. The desired data will be either an attribute of the DOM element or the element's text content.

.. code-block:: python

  from lxml import html
  from gatherer.rule import Rule

  rule_json = {
      "name": "url",
      "attr": "href",
      "type": "string"
  }

  r = Rule.from_json(rule_json)

  ele = html.fromstring("<a href='http://www.example.com'>Example</a>")

  data = r.data(ele)
  # data == "http://www.example.com"

Arguments
^^^^^^^^^

name
++++

The string that the ``Rule``'s return value should be saved as in the data dict.

attr
++++

The attribute of the DOM element that has the desired data.

type
++++

The type of the data. This is either ``string``, ``int``, or ``float``. For most situations, this will be ``string``. The ``int`` and ``float`` types work by matching the first integer or float in a string using a regular expression. This works for for simple cases, but for more complex ones you will need to handle extracting the data from the string yourself. 

Methods
^^^^^^^

data(element)
++++++++++++

Takes a DOM element and returns the extracted value. If the attribute doesn't exist or the type is ``int`` or ``float``, but not exists in the attribute string, it returns ``None``.

find_int(text)
++++++++++++++

Given a string, returns the first integer found in the string. Returns ``None`` if no integer is found.

find_float(text)
++++++++++++++++

Given a string, returns the first float found in the string. Returns ``None`` if no float is found.
