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

ALT_SINGLE_ELEMENT = {
    "selector": "span",
    "spec": {"type": "single", "index": 0},
    "children": [],
    "rules": [
        {
            "name": "text",
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

ALT_ALL_ELEMENT = {
    "selector": "p",
    "spec": {"type": "all", "name": "paragraphs"},
    "children": [],
    "rules": [
        {
            "name": "description",
            "attr": "text",
            "type": "string"
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
