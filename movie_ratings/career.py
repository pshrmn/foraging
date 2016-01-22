import argparse
import os
import json

from .actor import get_actor

OUTPUT_DIR = os.path.join(os.getcwd(), "data", "actor")
os.makedirs(OUTPUT_DIR, exist_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", "-N", dest="name", help="name of actor")
    args = parser.parse_args()

    data = get_actor(args.name)
    if data is not None:
        under_name = args.name.lower().replace(" ", "_")
        with open(os.path.join(OUTPUT_DIR, "{}.json".format(under_name)), "w") as fp:
            json.dump(data, fp, indent=2)
