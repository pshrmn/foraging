function cleanPages(pages){
    var ns = {};
    for ( var p in pages ) {
        ns[p] = cleanPage(pages[p]);
    }
    return ns;
}

// get rid of extra information before saving
function cleanPage(page){
    function cleanSelector(s, clone){
        clone.selector = s.selector;
        clone.spec = s.spec;
        clone.rules = s.rules.slice();
        clone.optional = s.optional;
        clone.children = s.children.map(function(child){
            return cleanSelector(child, {});
        });
        return clone;
    }


    var clonedPage = cleanSelector(page, {});
    clonedPage.name = page.name;
    return clonedPage;
}

/*
 * check if an identical selector already exists or one with the same name
 * exists
 */
function matchSelector(sel, parent){
    var selIndex = sel.spec.type === "single" ? sel.spec.value : undefined;
    var msg = "";
    var found = parent.children.some(function(s){
        var sameType = sel.spec.type === s.spec.type;
        if ( !sameType ) {
            return false;
        }

        switch ( s.spec.type ) {
        case "single":
            var index = s.spec.value;
            if ( s.selector === sel.selector && index === selIndex ) {
                msg = "a selector with the same selector and index already exists";
                return true;
            }
            break;
        case "all":
            if ( s.spec.value === sel.spec.value ) {
                msg = "a selector with the name '" + sel.spec.value + "' already exists";
                return true;
            }
            break;
        }
        return false;
    });
    return {
        error: found,
        msg: msg
    };
}

// get an array containing the names of all rules in the page
function usedNames(page){
    var names = [];

    function findNames(selector){
        if ( selector.spec.type === "all" ) {
            names.push(selector.spec.value);
        }
        selector.rules.forEach(function(n){
            names.push(n.name);
        });

        selector.children.forEach(function(child){
            findNames(child);
        });
    }

    for ( var name in page.pages ) {
        findNames(page.pages[name]);
    }
    return names;
}
