/*
selector is a string
a spec is an object with type and value keys
returns a new Selector object
*/
function newSelector(selector, spec){
    return {
        selector: selector,
        spec: spec,
        children: [],
        rules: []
    };
}

function newRule(name, attr){
    return {
        name: name,
        attr: attr
    };
}

function newPage(name){
    return {
        name: name,
        selector: "body",
        spec: {
            type: "index",
            value: 0
        },
        children: [],
        rules: [],
        elements: [document.body]
    };
}
