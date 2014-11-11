"""
given an uploaded schema, test (using default url or a provided one) the initial page and the 
subsequent pages to see if the default html can be used to capture rule values or whether
dynamically loaded data needs to be downloaded as well.
"""

import json
import argparse

import requests
from lxml import html
from lxml.cssselect import CSSSelector

debug = False

def test_schema(schema, url=None):
    """
    test initial page, then iterate through any followed pages. return schema with "dynamic"
    property added to any pages that need to be loaded dynamically
    """
    if not url:
        urls = schema["urls"]
        # do nothing if there is no starting url
        if len(urls) == 0 or urls[0] == "":
            return schema
        url = urls[0]
    schema["page"] = test_page(schema["page"], url)
    return schema

def test_page(page, url):
    """
    given a page, iterate over and test the selector sets in the page. if any of those fail (they 
    return false), add the dynamic=True property, then return the page
    """
    if debug:
        print(("Page:\t{}".format(page["name"])))
    resp = requests.get(url)
    dom = html.document_fromstring(resp.text)
    dom.make_links_absolute(url)
    working_selector_sets = []
    for selector_set in page.get("sets").values():
        works, ss = test_selector_set(selector_set, dom)
        page["sets"][selector_set["name"]] = ss
        working_selector_sets.append(works)
    page["dynamic"] = not all(working_selector_sets)
    return page

def test_selector_set(selector_set, dom):
    """
    iterate over selectors in a selector set to test if they match anything in the page
    then iterate over any child pages of the set
    returns a bool/updated selector_set tuple
    bool is True if all selectors in the set are in the page (and thus don't need to be loaded
        dynamically), otherwise False
    """
    if debug:
        print(("  Selector Set: {}".format(selector_set["name"])))
    working_selectors = []
    for selector in selector_set["selectors"].values():
        works, follow_info = test_selector(selector, dom)
        working_selectors.append(works)
        if works and follow_info:
            name, page_url = follow_info
            page = selector_set["pages"][name]
            selector_set["pages"][name] = test_page(page, page_url)
    return all(working_selectors), selector_set

def test_selector(selector, dom):
    css = CSSSelector(selector["selector"])
    eles = css(dom)
    works, works_char = (True, "+") if len(eles) > 0 else (False, "-")
    follow_info = None
    if works:
        follow_info = has_follow(selector, eles[0])
    if debug:
        print(("    {}: {}".format(selector["selector"], works_char)))
    return works, follow_info

def has_follow(selector, ele):
    """
    iterates over a selector's rules. if any of them are to be followed, return (True, <rule name>),
    otherwise return (None, None)
    """
    for rule in selector["rules"].values():
        if rule.get("follow", False):
            return rule["name"], ele.get("href")
    return None

def load_json(filename):
    with open(filename, "r") as fp:
        schema_json = json.load(fp)
    return schema_json

def save_json(filename, data):
    with open(filename, "w") as fp:
        json.dump(data, fp)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""Determine whether json for schema needs to be
loaded dynamically or with a simple get request""")
    parser.add_argument('--json', '-J', dest='json', help='json file to test')
    parser.add_argument('--url', '-U', dest='url', help='starting url to test')
    parser.add_argument('--debug', '-D', dest='debug', help='print results to console',
        default=False)
    args = parser.parse_args()
    debug = args.debug
    schema_json = load_json(args.json)
    schema = test_schema(schema_json)
    #save the updated schema with "dynamic" property
    save_json(args.json, schema)