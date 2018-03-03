#Movie Ratings

Get the ratings of actors' movies from Rotten Tomatoes.

```python
python -m movie_ratings.career -name "<actors's name>"
```

Above will use cached data if it exists. To force fresh actor information to
be fetched, use the `-fresh`/`-F` tag.

```python
python -m movie_ratings.career -name "<actor's name>" -fresh
```
