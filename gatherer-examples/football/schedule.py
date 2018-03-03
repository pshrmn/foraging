import json
import argparse

from gatherer import Page, Fetch, Cache

with open("pages/schedule.json") as fp:
    schedule_json = json.load(fp)

c = Cache("cache")
f = Fetch(headers={'User-Agent': 'gatherer agent'}, cache=c)

schedule = Page.from_json(schedule_json)


def get_season(year):
    BASE_URL = "http://www.nfl.com/schedules/{}/REG{}"

    for week in range(1, 18):
        dom = f.get(BASE_URL.format(year, week))
        s = schedule.gather(dom)
        with open("data/{}-{:02d}.json".format(year, week), "w") as fp:
            json.dump(s, fp, indent=2)


def get_week(year, week):
    BASE_URL = "http://www.nfl.com/schedules/{}/REG{}"
    dom = f.get(BASE_URL.format(year, week))
    s = schedule.gather(dom)
    with open("data/{}-{:02d}.json".format(year, week), "w") as fp:
        json.dump(s, fp, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-year', '-Y', dest='year',
                        help='year to get schedules for')
    parser.add_argument('-week', '-W', dest='week',
                        help='week to get schedule for')
    args = parser.parse_args()
    year = args.year
    week = args.week
    print(year, week)
    if week is not None:
        get_week(year, int(week))
    else:
        get_season(year)
