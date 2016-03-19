import json

from gatherer import Page, Fetch, Cache

with open("pages/schedule.json") as fp:
    schedule_json = json.load(fp)

c = Cache("cache")
f = Fetch(headers={'User-Agent': 'gatherer agent'}, cache=c)

schedule = Page.from_json(schedule_json)

BASE_URL = "http://www.nfl.com/schedules/2015/REG{}"

for week in range(1, 18):
    dom = f.get(BASE_URL.format(week))
    s = schedule.gather(dom)
    with open("data/week{}.json".format(week), "w") as fp:
        json.dump(s, fp, indent=2)
