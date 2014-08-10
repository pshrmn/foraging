from Queue import Queue
import os

from .page import Page
from .cache import Cache, make_cache

cache_folder = make_cache(os.getcwd())
group_cache = Cache(cache_folder)

class Group(object):
    def __init__(self, name, pages, urls=None):
        self.name = name
        self.pages = pages
        self.urls = Queue()
        if urls is not None:
            for url in urls:
                self.urls.put(url)

    @classmethod
    def from_json(cls, group_json):
        name = group_json["name"]
        pages = {page["name"]: Page.from_json(page) for page in group_json["pages"].itervalues()}
        urls = group_json.get("urls")
        return cls(name, pages, urls)

    def crawl_urls(self):
        """
        iterate over the urls in self.urls, then merge the resulting data based on the sets in the
        default page of the group
        """
        crawled_data = {}
        while not self.urls.empty():
            url = self.urls.get()
            data = self.get(url)
            for key, val in data.iteritems():
                new_data = crawled_data.get(key, [])
                if isinstance(val, list):
                    new_data.extend(val)
                else:
                    new_data.append(val)
                crawled_data[key] = new_data
        return crawled_data

    def get(self, url):
        """
        takes a url and iterates over pages, starting with the default page
        """
        return self.get_page(url, "default")

    def get_page(self, url, page_name):
        """
        takes a url and which page in self.pages, sends a request (or just opens if the url's html
        is cached), and returns an lxml.html.HtmlElement
        """
        data = {}
        dom, canonical_url = group_cache.fetch(url)
        if dom is None:
            return {}
        page = self.pages[page_name]
        page_data = page.get(dom)

        if page_name == "default" and page.next:
            new_url = page.next_page(dom)
            self.urls.put(new_url)

        for set_name, rule_set in page_data.iteritems():
            if isinstance(rule_set, list):
                """
                if rule_set returned a list, iterate over each (rule_data, follow_dict) tuple,
                adding pages if necessary, then return only the rule_data
                """
                new_list = []
                for item, follow in rule_set:
                    if not item:
                        continue
                    for name, href in follow.iteritems():
                        new_page_data = self.get_page(href, name)
                        item.update({name+"_page": new_page_data})
                    new_list.append(item)
                data[set_name] = new_list
            else:
                """
                otherwise, rule_set is a tuple containing (rule_data, follow_dict)
                """
                item, follow = rule_set
                if not item:
                    continue
                for name, href in follow.iteritems():
                    new_page_data = self.get_page(href, name)
                    item.update({name+"_page": new_page_data})
                data[set_name] = item
        return data

    def __str__(self):
        return "Group(%s, %s, %s)" % (self.name, self.pages, self.urls)
