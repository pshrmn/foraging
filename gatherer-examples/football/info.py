import json

from gatherer import Page, Fetch, Cache

with open("pages/stadiums.json") as fp:
    stadium_data = json.load(fp)

c = Cache("cache")
f = Fetch(headers={'User-Agent': 'gatherer agent'}, cache=c)

stadiums = Page.from_json(stadium_data, f)

output = stadiums.get("http://en.wikipedia.org/wiki/List_of_current_National_Football_League_stadiums")

with open("data/stadium_info.json", "w") as fp:
    json.dump(output, fp, indent=2)
