Program to scrape data based on rules collected through collectjs/collect app

Each domain should have a folder with specs:
    name of folder is the domain name (eg www.example.com)
    pages.txt: newline separated of pages that contain links to the desired content
    links.json: rules for getting links to desired content from index pages
    data.json: rules for getting desired content from a page