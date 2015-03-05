function newSelector(selector, index){
    return {
        selector: selector,
        children: [],
        attrs: [],
        index: index
    };
}

function newAttr(name, attr){
    return {
        name: name,
        attr: attr
    };
}

function newSchema(name){
    return {
        name: name,
        urls: [],
        pages: {
            default: newSelector("body")
        }
    };
}
