import json
import argparse

import requests
from lxml import html
from lxml.cssselect import CSSSelector

"""
given an uploaded group, test (using default url or a provided one) the initial page and the 
subsequent pages to see if the default html can be used to capture rule values or whether
dynamically loaded data needs to be downloaded as well.
"""

def test_group(group, url=None):
    if not url:
        urls = group["urls"]
        if len(urls) == 0:
            return
        url = urls[0]
    default_page = group["page"]
    test_page(default_page, url)

def test_page(page, url):
    print("Page:\t{}".format(page["name"]))
    resp = requests.get(url)
    dom = html.document_fromstring(resp.text)
    working_selector_sets = []
    for selector_set in page.get("sets").itervalues():
        works = test_selector_set(selector_set, dom)
        working_selector_sets.append(works)
    if not all(working_selector_sets):
        print("Page:\t{} may need to be loaded dynamically".format(page["name"]))

def test_selector_set(selector_set, dom):
    """
    iterate over selectors in a selector set to test if they match anything in the page
    then iterate over any child pages of the set
    """
    print("  Rule Set: {}".format(selector_set["name"]))
    working_selectors = []
    matched_pages = {}
    for selector in selector_set["selectors"].itervalues():
        works, follow = test_selector(selector, dom)
        working_selectors.append(works)
        if works and follow:
            matched_pages[rule["name"]] = follow
    for name, page_url in matched_pages.iteritems():
        page = selector_set["pages"][name]
        test_page(page, page_url)
    return all(working_selectors)

def test_selector(selector, dom):
    selector_output = "    {}: {}"
    css = CSSSelector(selector["selector"])
    eles = css(dom)
    works, works_char = (True, "+") if len(eles) > 0 else (False, "-")
    follow_url = None
    if works:
        follow_url = has_follow(selector, eles[0])
    print(selector_output.format(selector["selector"], works_char))
    return works, follow_url

def has_follow(selector, ele):
    for rule in selector["rules"].itervalues():
        if rule.get("follow", False):
            return ele.get("href")
    return None

def load_json(filename):
    with open(filename, "r") as fp:
        group_json = json.load(fp)
    return group_json

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""Determine whether json for collector needs to be
loaded dynamically or with a simple get request""")
    parser.add_argument('--json', '-J', dest='json', help='json file to test')
    parser.add_argument('--url', '-U', dest='url', help='starting url to test')
    args = parser.parse_args()
    group_json = load_json(args.json)
    test_group(group_json)