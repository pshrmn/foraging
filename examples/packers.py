import json
from pprint import pprint
import os

from collector.crawl.group import RuleGroup

with open(os.path.join(os.getcwd(), "packers.json")) as fp:
    packers = json.load(fp)

rg = RuleGroup(**packers)
pprint(rg.crawl())
