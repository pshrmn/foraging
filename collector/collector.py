import argparse
import os

directory = os.path.dirname(os.path.realpath(__file__))

if __name__=="__main__":
    parser = argparse.ArgumentParser(description='Crawl sites with saved rules')
    parser.add_argument('--folder', '-F', dest='directory', 
                   help='folder to open crawl rules from')
    args = parser.parse_args()
    directory = args.directory or directory
