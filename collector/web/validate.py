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
    working_rule_sets = []
    for rule_set in page.get("sets").itervalues():
        works = test_rule_set(rule_set, dom)
        working_rule_sets.append(works)
    if not all(working_rule_sets):
        print("Page:\t{} may need to be loaded dynamically".format(page["name"]))

def test_rule_set(rule_set, dom):
    """
    iterate over rules in a rule set to test if their css selector matches anything in the page
    then iterate over any child pages of the rule set
    """
    print("  Rule Set: {}".format(rule_set["name"]))
    working_rules = []
    matched_pages = {}
    for rule in rule_set["rules"].itervalues():
        works, follow = test_rule(rule, dom)
        working_rules.append(works)
        if works and follow:
            matched_pages[rule["name"]] = follow
    for name, page_url in matched_pages.iteritems():
        page = rule_set["pages"][name]
        test_page(page, page_url)
    return all(working_rules)


def test_rule(rule, dom):
    """
    given a rule and a dom, test if the css selector for the rule matches anything in the page
    print a line and return a boolean indicating if there is a match
    """
    rule_output = "    {} ({}): {}"
    css = CSSSelector(rule["selector"])
    eles = css(dom)
    works, works_char = (True, "+") if len(eles) > 0 else (False, "-")
    follow_url = None
    if works and rule.get("follow", False):
        follow_url = eles[0].get_attribute("href")
    print(rule_output.format(rule["name"], rule["selector"], works_char))
    return works, follow_url

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