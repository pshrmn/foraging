function cleanSchemas(schemas){
    var ns = {};
    for ( var s in schemas ) {
        ns[s] = cleanSchema(schemas[s]);
    }
    return ns;
}

// get rid of extra information before saving
function cleanSchema(schema){
    var ns = {
        name: schema.name,
        urls: schema.urls.slice(),
        pages: {}
    };

    function clonePage(s, clone){
        clone.selector = s.selector;
        clone.index = s.index;
        clone.attrs = s.attrs.slice();
        clone.children = s.children.map(function(child){
            return clonePage(child, {});
        });
        return clone;
    }

    for ( var page in schema.pages ) {
        ns.pages[page] = clonePage(schema.pages[page], {});
    }
    return ns;
}

// check if an identical selector already exists
function matchSelector(sel, parent){
    return parent.children.some(function(s){
        if ( s.selector === sel.selector && s.index === sel.index ) {
            return true;
        }
        return false;
    });
}

// get an array containing the names of all attrs in the schema
function attrNames(schema){
    var names = [];

    function findNames(selector){
        selector.attrs.forEach(function(n){
            names.push(n);
        });

        selector.children.forEach(function(child){
            findNames(child);
        });
    }

    for ( var name in schema.pages ) {
        findNames(schema.pages[name]);
    }
    return names;
}

function followedAttrs(page){
    var attrs = [];

    function findFollowedAttrs(selector){
        selector.attrs.forEach(function(attr){
            if ( attr.follow ) {
                attrs.push(attr.name);
            }
        });
        selector.children.forEach(function(child){
            findFollowedAttrs(child);
        });
    }
    findFollowedAttrs(page);
    return attrs;
}
