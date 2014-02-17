import argparse
import site
import os


default_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'rules')
directory = default_directory

def set_directory(name=None):
    global directory
    if name is not None:
        directory = name
    else:
        directory = default_directory

def get_sites():
    """
    returns a list of folders in the directory folder
    """
    files = os.listdir(directory)
    return [f for f in files if os.path.isdir(os.path.join(directory, f))]

def main(dirname=None):
    set_directory(dirname)
    sites = get_sites()

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Crawl sites with saved rules')
    parser.add_argument('--folder', '-F', dest='directory', 
                   help='folder to open crawl rules from')
    args = parser.parse_args()
    main(args.directory)
