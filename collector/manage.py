import os
import argparse
import site, settings

def get_sites():
    """
    returns a list of folders in the directory folder
    """
    files = os.listdir(settings.rules_directory)
    return [f for f in files if os.path.isdir(os.path.join(settings.rules_directory, f))]

def new_site(name):
    """
    creates a directory for a new site
    returns True if folder for site is new, False if it already existed
    """
    parent = settings.rules_directory
    site_path = os.path.join(settings.rules_directory, name)
    is_new = True
    #make sure the site doesn't already exist
    if not os.path.isdir(site_path):
        os.mkdir(site_path)
    else:
        is_new = False
        print "site folder already exists"
    for filename in ['data.json', 'links.json', 'pages.txt']:
        with open("%s/%s" % (site_path, filename), "a+"):
            pass
    return is_new


def main(dirname=None):
    sites = get_sites()

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Crawl sites with saved rules')
    parser.add_argument('--site', dest='site', 
                   help='create a new site folder')
    args = parser.parse_args()
    if args.site:
        new_site(args.site)
    main()
