Installation
============

Installation of Gatherer is done directly from Github

.. code-block:: none

    pip install git+git://github.com/pshrmn/foraging/gatherer.git

Windows
+++++++

For Windows users, installing ``lxml`` may cause errors. If it does, you can install ``lxml`` by downloading the ``lxml`` wheel from the `Python Extension Packages for Windows <http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml>`_ and installing.

Install lxml From Wheel
^^^^^^^^^^^^^^^^^^^^^^^

If you are not using a virtual environment, you can navigate to the downloaded folder in the command prompt and install from there. Otherwise, you should move the wheel to your project directory (and after activating the virtual environment) install ``lxml``. Call the command shown below to install ``lxml``.

.. code-block:: none

    pip install lxml-3.4.4-cp34-none-win_amd64.whl

The above example is for the 64-bit version of Python 3.4.4. The filename will vary based on your Python version and environment. After installation, the wheel file can be deleted.

Once ``lxml`` has been installed, you can install ``Gatherer``
