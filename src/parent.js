var Parent = (function(){
    var count       = 0;
    var type        = "selector";
    var hasHTML     = false;
    var hidden      = false;
    var exists      = false;
    var parent;

    function addMarkup(){
        var elements    = Fetch.all(parent.selector);
        var low         = parent.low || 0;
        var high        = parent.high || 0;
        var end         = elements.length + high;
        count           = 0;
        hidden          = false;
        hasHTML         = true;
        for ( ; low<end ; low++ ){
            elements[low].classList.add("parentSchema");
            count++;
        }
    }

    function clearMarkup(){
        hidden      = false;
        hasHTML     = false;
        clearClass("parentSchema");
    }

    var p = {
        getParent: function(){
            return parent;
        },
        getType: function(){
            return type;
        },
        exists: function(){
            return exists;
        },
        getCount: function(){
            return type === "selector" ? count : undefined;
        },
        setType: function(_type){
            type = _type;
        },
        set: function(obj){
            parent = obj;
            exists = true;
            addMarkup();
        },
        remove: function(){
            exists = false;
            count = 0;
            clearMarkup();
            parent = undefined;
        },
        // remove hidden class from .parentSchema elements
        show: function(){
            // add the markup first if it doesn't exist
            if ( !hasHTML ) {
                addMarkup();
            }

            if ( !hidden ) {
                return;
            }

            hidden          = false;
            var elements    = document.getElementsByClassName("parentSchema");
            var length      = elements.length;
            while ( length-- ) {
                elements[length].classList.remove("hidden");
            }
        },
        hide: function(){
            hidden = true;
            addClass("hidden", document.getElementsByClassName("parentSchema"));
        },
        // returns the parent selector
        // if type !== "selector", always return "body". Then check if there is a parent selector
        // and if there is use that, defaulting to "body" if there is none
        selector: function(){
            var sel;
            switch(type){
                case "selector":
                    sel = exists ? parent.selector : "body";
                    break;
                default:
                    sel = "body";
            }
            return sel;
        },
        /*
        brute force to find parent element of the passed in element argument that matches the parentSelector
        O(n^2), so not ideal but works for the time being
        */
        nearest: function(element, parentSelector){
            var parents         = Fetch.all(parentSelector);
            var elementParents  = [];
            var curr            = element;
            var parent;
            // get all parent elements of element up to BODY
            while ( curr !== null && curr.tagName !== "BODY" ) {
                curr = curr.parentElement;
                elementParents.push(curr);
            }
            for ( var i=0, iLen=elementParents.length; i<iLen; i++ ) {
                parent = elementParents[i];
                for ( var j=0, jLen=parents.length; j<jLen; j++ ) {
                    if ( parent === parents[j] ) {
                        return parent;
                    }
                }
            }
            return;
        },
        // returns nearest parent element (as determined by the parent selector) to the passed in element
        // defaults to the body if there is no parent or the current ype !== "selector"
        element: function(ele){
            var e;
            switch(type){
                case "selector":
                    e = exists ? this.nearest(ele, parent.selector) : document.body;
                    break;
                default:
                    e = document.body;
            }
            return e;
        },
        object: function(){
            var obj;
            switch(type){
                case "selector":
                    obj = parent;
                    break;
            }
            return obj;
        },
    };

    return p;

})();
