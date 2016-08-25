Basic NFL stadium info

```
    python -m info
```

Get the coordinates of each NFL stadium

```
    python -m coordinates
```

Get weekly schedules for a given year. Specify the year using either the `-year` or `-Y` argument.

```
    python -m schedule -Y <year>
```

For each game within a week, a dict will be created with `home` and `away` keys. These will have the name of the home and away team for a given game. All of the games for a given week will be placed in an array. In the JSON output for a given week, the object will have a `games` key whose value is the array of games. If there are teams on a bye week for a given week, the JSON object will also have a `byes` key whose value is an array of team objects. Each team object has one key, `team`, whose value is the name of the team.

You can also get only a specific week's schedule by providing the week using either the `-week` or `-W` argument.

```
    python -m schedule -Y 2016 -W 7
```
