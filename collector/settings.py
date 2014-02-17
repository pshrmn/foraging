import os

# location of the folder that contains site rules
base_directory = os.path.dirname(os.path.realpath(__file__))
rules_directory = os.path.join(base_directory, 'rules')

import logging
import time
log_file = os.path.join(base_directory, 'log.txt')
logging.basicConfig(filename=log_file, level=logging.DEBUG)

def info(msg):
    when = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime())
    logging.info("%s\t%s" % (when, msg))