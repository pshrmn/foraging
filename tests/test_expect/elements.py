SINGLE_ELEMENT = {
    "selector": "a",
    "spec": {"type": "single", "index": 0},
    "children": [],
    "rules": [
        {
            "name": "url",
            "attr": "href",
            "type": "string"
        },
        {
            "name": "title",
            "attr": "text",
            "type": "string"
        }
    ]
}

ALL_ELEMENT = {
    "selector": "div.item",
    "spec": {"type": "all", "name": "items"},
    "children": [],
    "rules": [
        {
            "name": "count",
            "attr": "data-count",
            "type": "int"
        }
    ]
}

RANGE_ELEMENT = {
    "selector": "div.item",
    "spec": {"type": "range", "name": "items", "low": 0, "high": 3},
    "children": [],
    "rules": [
        {
            "name": "count",
            "attr": "data-count",
            "type": "int"
        }
    ]
}
