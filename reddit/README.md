#Reddit Collectors

##submissions

Get a list of submissions currently on the front page of reddit (or a subreddit).

    python -m submissions -url <url> -filename <filename>

`url` is the url of the page to collect data from. By default, that is the reddit homepage `http://www.reddit.com`. The url for most (not 18+) subreddits will also work.
`filename` is the name to save the collected data as. This will be a json file, so the filename should end in `.json`. If no filename is provided, the data will be saved in `output.json`
