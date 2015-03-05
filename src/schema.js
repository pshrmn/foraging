// return an array of selectors from the root to the node with id
function tracePath(page, id){
    var path = [];
    function find(selector, lid){
        path.push(selector);
        if ( selector.id === lid ) {
            return true;
        }
        var found = selector.children.some(function(s){
            return find(s, lid);
        });
        if ( found ) {
            return true;
        } else {
            path.pop();
            return false;
        }
    }
    var found = find(page, id);
    return path;
}

// global
var idCount = 0;
function generateIds(schemas){
    function set(selector){
        selector.id = idCount++;
        selector.children.forEach(function(s){
            set(s);
        });
    }
    var curr;
    for ( var name in schemas ) {
        curr = schemas[name];
        for ( var page in curr.pages ) {
            set(curr.pages[page]);
        }
    }
    return schemas;
}

// get rid of extra information before saving
function cleanSchema(schema){
    console.log(schema);
    var goodKeys = ["selector", "index", "children", "attrs"];

    function goodKey(key){
        return goodKeys.some(function(gk){
            return gk === key;
        });
    }

    function clean(selector){
        for ( var key in selector ) {
            if ( !goodKey(key) ) {
                delete selector[key];
            }
        }
        selector.children.forEach(function(s){
            clean(s);
        });
    }
    for ( var page in schema.pages ) {
        clean(schema.pages[page]);
    }
    return schema;
}

// check if an identical selector already exists
function matchSelector(sel, parent){
    var match;
    parent.children.some(function(s){
        if ( s.selector === sel.selector && s.index === sel.index ) {
            match = s.id;
            return true;
        }
        return false;
    });
    return match;
}

/*
function editSelector(page, oldSel, newSel){
    // depth first search
    function find(selector, name){
        if ( selector.selector === name ) {
            selector.selector = newSel;
            return true;
        }
        selector.children.forEach(function(s){
            if ( find(s, name) ) {
                return true;
            }
        });
        return false;
    }

    var found = find(page, oldSel);
    if ( !found ) {
        // handle case when selector is not found
    }
    return page;
}

function editAttr(page, oldName, newAttr){
    // depth first search
    function find(selector, name){
        selector.attrs.forEach(function(attr){
            if ( attr.name === name) {
                attr = newAttr;
                return true;
            }
        });
        selector.children.forEach(function(s){
            if ( find(s, name) ) {
                return true;
            }
        });
    }

    var found = find(page, oldName);
    if ( !found ) {
        // handle case when selector is not found
    }
    return page;
}
*/

