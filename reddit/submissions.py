import os
import json
import argparse

from collector import Page, Fetch

os.makedirs("data", exist_ok=True)
with open("submissions.json") as fp:
    data = json.load(fp)

f = Fetch(headers={"User-Agent": "collector"})
p = Page.from_json(data, f)


def fetch_and_save(filename, subreddit=None):
    if subreddit is None:
        url = "http://www.reddit.com"
    else:
        url = "http://www.reddit.com/r/{}".format(subreddit)
    data = p.get(url)
    path = "data/{}".format(filename)
    with open(path, "w") as fp:
        json.dump(data, fp)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-subreddit', dest='subreddit',
                        help='subreddit to collect data from')
    parser.add_argument('-filename', dest='filename',
                        help='location to save data')
    args = parser.parse_args()
    subreddit = args.subreddit
    filename = args.filename or "output.json"
    fetch_and_save(filename, subreddit)
