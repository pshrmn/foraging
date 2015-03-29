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
        clone.children = s.children.map(function(child){
            return cleanSelector(child, {});
        });
        return clone;
    }


    var clonedPage = cleanSelector(page, {});
    clonedPage.name = page.name;
    return clonedPage;
}

// check if an identical selector already exists
function matchSelector(sel, parent){
    var selIndex = sel.spec.type === "index" ? sel.spec.value : undefined;
    return parent.children.some(function(s){
        var index = s.spec.type === "index" ? s.spec.value : undefined;
        if ( s.selector === sel.selector && index === selIndex ) {
            return true;
        }
        return false;
    });
}

// get an array containing the names of all rules in the page
function usedNames(page){
    var names = [];

    function findNames(selector){
        if ( selector.spec.type === "name" ) {
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
