#Reddit Gatherers

##submissions

Get a list of submissions currently on the front page of reddit (or a subreddit).

    python -m submissions -subreddit <subreddit> -filename <filename>

`subreddit` is the name of the subreddit to gather data from. If not provided, will use reddit homepage.
`filename` is the name to save the gathered data as. This will be a json file, so the filename should end in `.json`. If no filename is provided, the data will be saved in `output.json`
