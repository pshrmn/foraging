##granary

Web app that runs in conjunction with Forager chrome extension (https://github.com/psherman/forager) to get rules to be used in a crawler

###install

    pip install git+git://github.com/psherman/granary.git

####usage

for default folder to save files, call

    python -m granary.server

to specify which folder to save rules to, use 

    -F <folder> or --folder <folder>
