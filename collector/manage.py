import os
import argparse
import website, settings

import time

if not os.path.isdir(settings.rules_directory):
    os.mkdir(settings.rules_directory)

def has_files(folder):
    """
    returns true if a folder has all the necessary files, otherwise false
    """
    needed_files = ['rules.json', 'pages.txt']
    files = os.listdir(folder)
    for f in needed_files:
        if f not in files:
            return False
    return True

def get_sites():
    """
    returns a list of folders in the directory folder
    """
    files = os.listdir(settings.rules_directory)
    site_folders = []
    for f in files:
        long_path = os.path.join(settings.rules_directory, f)
        if os.path.isdir(long_path) and has_files(long_path):
            site_folders.append(long_path)
    return site_folders

def new_site(name):
    """
    creates a directory for a new site
    returns True if folder for site is new, False if it already existed
    """
    parent = settings.rules_directory
    underscore_name = name.replace(".","_")
    site_path = os.path.join(settings.rules_directory, underscore_name)
    is_new = True
    #make sure the site doesn't already exist
    if not os.path.isdir(site_path):
        os.mkdir(site_path)
        settings.logging.info("created site <%s>" % name)
    else:
        is_new = False
        settings.logging.info("site <%s> already exists" % name)
    for filename in ['rules.json', 'pages.txt']:
        full_filename = os.path.join(site_path, filename)
        if not os.path.isfile(full_filename):
            with open("%s/%s" % (site_path, filename), "w+") as fp:
                # need an empty json object for json.load to not have a ValueError
                if filename[-5:] == '.json':
                    fp.write('{"links":{}, "data":{}}')
    return is_new


def main(dirname=None):
    sites = [website.Site(s) for s in get_sites()]

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Crawl sites with saved rules')
    parser.add_argument('--site', dest='site', 
                   help='create a new site folder')
    args = parser.parse_args()
    if args.site:
        new_site(args.site)
    else:
        main()
