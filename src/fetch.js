/*
functions to get elements in the page
*/
var Fetch = {
    /***
    select the first element in the page to match the selector
    if prefix is provided, append that in front of the selector
    ***/
    one: function(selector, prefix){
        return document.querySelector(this.not(selector, prefix));
    },
    /***
    select all elements in the page that match the selector
    ***/
    all: function(selector, prefix){
        return document.querySelectorAll(this.not(selector, prefix));
    },
    /***
    returns a string for a css selector suffixed by :not(.noSelect)
    in order to ignore elements that are part of the collectorjs interface
    default prefix is "body"
    ***/
    not: function(selector, prefix){
        return (prefix || "body") + " " + selector + ":not(.noSelect)";
    },
    /*
    uses selector to match elements in the page
    parent is an optional object containing a selector and a low/high range to limit matched elements
    if parent.high/low are defined, only use parent.selector elements within that range
    */
    matchedElements: function(selector, parent){
        var allElements = parent ? this.matchedParentElements(selector, parent)
            : this.all(selector, "body");
        return Array.prototype.slice.call(allElements);
    },
    matchedParentElements: function(selector, parent){
        var allElements     = [];
        var low             = parent.low || 0;
        var high            = parent.high || 0;
        var end;
        var parents;
        var currElements;
        var notSelector;
        // if either high or low is defined, 
        // iterate over all child elements of elements matched by parent selector
        if ( low !== 0 || high !== 0 ) {
            parents         = document.querySelectorAll(parent.selector);
            end             = parents.length + high; // add high because it is negative
            notSelector     = this.not(selector);
            // select elements within parent that match the selector, then merge into allElements
            for ( ; low<end; low++ ) {
                currElements = parents[low].querySelectorAll(notSelector);
                allElements = allElements.concat(Array.prototype.slice.call(currElements));
            }
        } else {
            allElements = this.all(selector, parent.selector);
        }
        return allElements;
    }
};
