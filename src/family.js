// requires SelectorFamily, Parent, CollectOptions

// Family derived from clicked element in the page
var Family = (function(){
    var family;
    var elements            = [];
    var selectableElements  = [];
    var selectorsOn         = false;
    var html                = {
        family:     document.getElementById("selectorHolder"),
        selector:   document.getElementById("currentSelector"),
        count:      document.getElementById("currentCount"),
    };

    /*
    markup the page to indicate elements that match the current selector
    */
    function markup(){
        clearClasses(["queryCheck", "collectHighlight"]);

        elements = f.selectorElements();
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        html.count.textContent = elementCount(elements.length, Parent.getCount() );
        if ( SelectorView ) {
            SelectorView.setElements(elements);
        }
    }

    // returns a string representing the current selector or if none, an empty string
    function selectorString(){
        return family ? family.toString() : "";
    }

    var f   = {
        remove: function(){
            if ( family ) {
                family.remove();
                family = undefined;
            }
            elements = [];
        },
        // create a SelectorFamily given a css selector string
        fromSelector: function(selector, prefix){
            // default to using provided prefix, then check Parent, lastly use "body"
            prefix = prefix ? prefix : Parent.selector();
            var element = Fetch.one(selector, prefix);
            // clear out existing SelectorFamily
            family = undefined;
            if ( element ) {
                family = new SelectorFamily(element,
                    Parent.element(element),
                    html.family,
                    html.selector,
                    markup,
                    CollectOptions
                );
                family.match(selector);
            }    
        },
        // uses current SelectorFamily's computed selector to match elements in the page
        // uses Parent to limit matches
        selectorElements: function(){
            var selector = selectorString(),
                parent = Parent.object();
            if ( selector === "") {
                return [];
            }
            return Fetch.matchedElements(selector, parent);
        },
        /*
        match all child elements of parent selector (or "body" if no parent selector is provided)
            and save in elements
        selectable elements are restricted by :not(.noSelect)
        add event listeners to all of those elements
        */
        turnOn: function(){
            var curr;
            if ( selectorsOn ) {
                f.turnOff();
            }
            var parent = Parent.object();
            selectableElements = Fetch.matchedElements("*", parent);
            for ( var i=0, len=selectableElements.length; i<len; i++ ) {
                curr = selectableElements[i];
                curr.addEventListener('click', create, false);
                curr.addEventListener('mouseenter', highlightElement, false);
                curr.addEventListener('mouseleave', unhighlightElement, false);
            }
            selectorsOn = true;
        },
        /*
        remove events from all elements in elements
        clear out any classes that would be set by events on the elements
        */
        turnOff: function(){
            clearClasses(["queryCheck", "collectHighlight", "savedPreview"]);
            var curr;
            for ( var i=0, len=selectableElements.length; i<len; i++ ) {
                curr = selectableElements[i];
                curr.removeEventListener('click', create);
                curr.removeEventListener('mouseenter', highlightElement);
                curr.removeEventListener('mouseleave', unhighlightElement);
                
            }
            selectableElements = [];
            selectorsOn = false;
            elements = [];
        },
    };

    /***************
        EVENTS
    ***************/
    function create(event){
        event.stopPropagation();
        event.preventDefault();
        if ( event.currentTarget !== event.target ) {
            return;
        }
        // this = clicked element
        family = new SelectorFamily(this,
            Parent.element(this),
            html.family,
            html.selector,
            markup,
            CollectOptions
        );
        family.update();
    }

    // add .collectHighlight to an element on mouseenter
    function highlightElement(event){
        this.classList.add("collectHighlight");
    }

    // remove .collectHighlight from an element on mouseleave
    function unhighlightElement(event){
        this.classList.remove("collectHighlight");
    }


    return f;
})();
