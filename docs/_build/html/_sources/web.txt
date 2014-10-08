.. _web:

.. module:: web

Web
===

Start the server from the command line::

    python -m pycollector.web.server

By default, uploaded schemas will be saved into a ``rules`` directory in the current working
directory. Specify where to save the uploaded schemas using either the ``--folder`` or ``-F`` flags::

    python -m pycollector.web.server --folder some/other/folder
