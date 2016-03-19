import re
import json

from gatherer import Page, Fetch, Cache


def pretty_coords(coord):
    c = coordinate_vals(coord)
    # return original value if regex fails
    if c is None:
        return coord
    return coordinate_decimal(c)


def coordinate_vals(coord):
    # don't care about precision down to the seconds
    nums = re.compile(r'(?P<degree>\d+)\u00b0(?P<minutes>\d+)')
    match = nums.search(coord)
    if match is None:
        return
    return match.groupdict()


def coordinate_decimal(coord):
    return float(coord["degree"]) + (float(coord["minutes"])/60)

c = Cache("cache")
f = Fetch(headers={'User-Agent': 'gatherer agent'}, cache=c)

with open("pages/stadiums.json") as fp:
    stadium_json = json.load(fp)
    stadiums = Page.from_json(stadium_json)

with open("pages/coordinates.json") as fp:
    coord_json = json.load(fp)
    coords = Page.from_json(coord_json)


# get the basic stadium data
stadium_dom = f.get("http://en.wikipedia.org/wiki/List_of_current_National_Football_League_stadiums")
stadium_data = stadiums.gather(stadium_dom)

stadium_coords = {}

for stadium in stadium_data['stadiums']:
    dom = f.get(stadium["url"])
    c = coords.gather(dom)
    c_dict = {key: pretty_coords(val) for key, val in c.items()}
    for team in stadium['teams']:
        name = team['name'].split(" ")[-1].lower()
        stadium_coords[name] = c_dict

with open('data/coordinates.json', 'w') as fp:
    json.dump(stadium_coords, fp, indent=2, sort_keys=True)
