import os

"""
files/folders
"""
# location of the folder that contains site rules
base_directory = os.path.dirname(os.path.realpath(__file__))
rules_directory = os.path.join(base_directory, 'rules')
# path to file that logs are sent to
log_file = os.path.join(base_directory, 'log.txt')


"""
logging
"""
import logging
logging.basicConfig(filename=log_file,
    format='%(asctime)s %(name)s %(levelname)s %(message)s',
    datefmt='%m-%d-%y %H:%M:%S',
    level=logging.DEBUG)
