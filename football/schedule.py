import json

from collector import Page, Fetch, Cache

with open("pages/schedule.json") as fp:
    schedule_json = json.load(fp)

c = Cache("cache")
f = Fetch(cache=c)

schedule = Page.from_json(schedule_json, f)

BASE_URL = "http://www.nfl.com/schedules/2015/REG{}"

for week in range(1, 18):
    url = BASE_URL.format(week)
    s = schedule.get(url)
    with open("data/week{}.json".format(week), "w") as fp:
        json.dump(s, fp, indent=2)
