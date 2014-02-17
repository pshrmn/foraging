import os

import site, settings

def get_sites():
    """
    returns a list of folders in the directory folder
    """
    files = os.listdir(settings.rules_directory)
    return [f for f in files if os.path.isdir(os.path.join(settings.rules_directory, f))]

def main():
    sites = get_sites()

if __name__=="__main__":
    main()
