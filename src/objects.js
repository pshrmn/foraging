/*
selector is a string
a spec is an object with type and value keys
optional is a boolean describing whehther or not selector has to match elements
returns a new Selector object
*/
function newSelector(selector, spec, optional){
    optional = optional || false;
    return {
        selector: selector,
        spec: spec,
        children: [],
        rules: [],
        optional: optional
    };
}

function newPage(name){
    return {
        name: name,
        selector: "body",
        spec: {
            type: "single",
            value: 0
        },
        children: [],
        rules: [],
        optional: false,
        elements: [document.body]
    };
}
