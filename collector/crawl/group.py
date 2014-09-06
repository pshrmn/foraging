from Queue import Queue
import os

from .page import Page

class Group(object):
    def __init__(self, name, page, urls=None):
        self.name = name
        self.page = page
        self.urls = Queue()
        if urls is not None:
            for url in urls:
                self.urls.put(url)

    @classmethod
    def from_json(cls, group_json):
        name = group_json["name"]
        page = Page.from_json(group_json["page"])
        urls = group_json.get("urls")
        return cls(name, page, urls)

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
            # if the page has a next selector, use it to get
            if self.page.index:
                next_url = self.page.next_page(url)
                if next_url:
                    self.urls.put(next_url)
        return crawled_data

    def get(self, url):
        """
        takes a url and iterates over pages, starting with the default page
        """
        return self.page.get(url)

    def __str__(self):
        return "Group(%s, %s, %s)" % (self.name, self.pages, self.urls)
