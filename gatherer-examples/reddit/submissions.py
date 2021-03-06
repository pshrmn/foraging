import os
import json
import argparse

from gatherer import Page, Fetch

os.makedirs("data", exist_ok=True)
with open("submissions.json") as fp:
    sub_json = json.load(fp)

f = Fetch(headers={"User-Agent": "gatherer"})
p = Page.from_json(sub_json)


def fetch_and_save(filename, subreddit=None):
    if subreddit is None:
        url = "http://www.reddit.com"
    else:
        url = "http://www.reddit.com/r/{}".format(subreddit)
    dom = f.get(url)
    if dom is not None:
        data = p.gather(dom)
        path = "data/{}".format(filename)
        with open(path, "w") as fp:
            json.dump(data, fp)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-subreddit', dest='subreddit',
                        help='subreddit to get data from')
    parser.add_argument('-filename', dest='filename',
                        help='location to save data')
    args = parser.parse_args()
    subreddit = args.subreddit
    filename = args.filename or "output.json"
    fetch_and_save(filename, subreddit)
