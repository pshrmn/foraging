// returns a function that takes an element and returns it's tag,
// id, and classes in css selector form
// include attribute selectors in the future?
function selectorParts(){
    var skipTags = [];
    var skipClasses = [];

    function tagAllowed(tag){
        return !skipTags.some(function(st){
            return st === tag;
        });
    }

    function classAllowed(c){
        return !skipClasses.some(function(sc){
            return sc === c;
        });
    }

    function parts(element){
        var pieces = [];
        var tag = element.tagName.toLowerCase();
        if ( tagAllowed(tag) ) {
            pieces.push(tag);
        } else {
            return;
        }

        if ( element.id !== "" ) {
            pieces.push("#" + element.id);
        }

        // classes
        var c;
        for ( var i=0; i<element.classList.length; i++ ) {
            c = element.classList.item(i);
            if ( classAllowed(c) ) {
                pieces.push ("." + c);
            }
        }
        return pieces;
    }

    // set the element tags to be ignored
    // returns new function
    parts.ignoreTags = function(tags){
        if ( !arguments.length ) { return skipTags; }
        skipTags = tags;
        return parts;
    };

    // set the element classes to be ignored
    // returns new function
    parts.ignoreClasses = function(classes){
        if ( !arguments.length ) { return skipClasses; }
        skipClasses = classes;
        return parts;
    };

    return parts;
}

function elementSelector(){
    var not = ".noSelect";

    function select(elements, selector, spec){
        var matches = [];
        var sel = selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = spec && spec.type === "index" ? spec.value : undefined;
        var eles;
        for ( var i=0; i<elements.length; i++ ) {
            eles = elements[i].querySelectorAll(sel);
            if ( index !== undefined ) {
                if ( !eles[index] ) {
                    continue;
                } else {
                    matches.push(eles[index]);
                }
            } else {
                [].push.apply(matches, [].slice.call(eles));
            }
        }
        return matches;
    }

    // return the max number of children per element
    select.count = function(elements, selector, spec){
        var max = -Infinity;
        selector = selector || {};
        var sel = selector.selector || "*";
        sel = sel + ":not(" + not + ")";
        var index = spec && spec.type === "index" ? spec.value : undefined;
        // index must specify only one element per parent
        if ( index !== undefined ) {
            return 1;
        }
        for ( var i=0; i<elements.length; i++ ) {
            var count = elements[i].querySelectorAll(sel).length;
            max = Math.max(max, count);
        }
        return max;
    };

    // set a new avoid selector
    select.not = function(avoid){
        if ( !arguments.length ) { return not; }
        not = avoid;
        return select;
    };

    return select;
}

function elementHighlighter(){
    var option = "collectHighlight";
    var clicked = function(){};

    function addOption(event){
        this.classList.add(option);
    }

    function removeOption(event){
        this.classList.remove(option);
    }

    function selectOption(event){
        event.preventDefault();
        event.stopPropagation();
        var eles = [].slice.call(event.path).filter(function(ele){
            return ele.classList && ele.classList.contains("selectableElement");
        }).reverse();
        clicked(eles);
    }

    function highlight(elements){
        elements.forEach(function(ele){
            ele.addEventListener("mouseenter", addOption, false);
            ele.addEventListener("mouseleave", removeOption, false);
            ele.addEventListener("click", selectOption, false);
            ele.classList.add("selectableElement");
        });
    }

    highlight.clicked = function(callback){
        clicked = callback;
        return highlight;
    };

    highlight.option = function(css){
        option = css;
        return highlight;
    };

    highlight.remove = function(){
        var elements = [].slice.call(document.getElementsByClassName("selectableElement"));
        elements.forEach(function(ele){
            ele.removeEventListener("mouseenter", addOption);
            ele.removeEventListener("mouseleave", removeOption);
            ele.removeEventListener("click", selectOption);
            ele.classList.remove("selectableElement");
            ele.classList.remove("queryCheck");
            ele.classList.remove("collectHighlight");
        });
    };

    return highlight;
}
