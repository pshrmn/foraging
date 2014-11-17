/* requires fetch.js and utility.js */
var Parent = {
    exists:     false,
    count:      0,
    hidden:     false,
    html:       false,
    type:       "selector",
    // set the parent object
    set: function(obj){
        this.parent     = obj;
        this.exists     = true;
        this.addMarkup();
    },
    // remove the parent object
    remove: function(){
        this.exists     = false;
        this.count      = 0;
        this.clearMarkup();
        delete this.parent;
    },
    // add .parentSchema class to all elements that match the parent selector and are in range
    addMarkup: function(){
        var elements    = Fetch.all(this.parent.selector);
        var low         = this.parent.low || 0;
        var high        = this.parent.high || 0;
        var end         = elements.length + high;
        this.count      = 0;
        this.hidden     = false;
        this.html       = true;
        for ( ; low<end ; low++ ){
            elements[low].classList.add("parentSchema");
            this.count++;
        }
    },
    clearMarkup: function(){
        this.hidden     = false;
        this.html       = false;
        clearClass("parentSchema");
    },
    show: function(){
        // add the markup first if it doesn't exist
        if ( !this.html ) {
            this.addMarkup();
        }

        if ( !this.hidden ) {
            return;
        }

        this.hidden     = false;
        var elements    = document.getElementsByClassName("parentSchema");
        for ( var i=elements.length-1; i>0; i-- ) {
            elements[i].classList.remove("hidden");
        }
    },
    hide: function(){
        this.hidden     = true;
        var elements    = document.getElementsByClassName("parentSchema");
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("hidden");
        }
    },
    // returns the parent selector
    // if type !== "selector", always return "body". Then check if there is a parent selector
    // and if there is use that, defaulting to "body" if there is none
    selector: function(){
        var parent;
        switch(this.type){
            case "selector":
                parent = this.exists ? this.parent.selector : "body";
                break;
            default:
                parent = "body";
        }
        return parent;
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
        var parent;
        switch(this.type){
            case "selector":
                parent = this.exists ? this.nearest(ele, this.parent.selector) : document.body;
                break;
            default:
                parent = document.body;
        }
        return parent;
    },
    object: function(){
        var parent;
        switch(this.type){
            case "selector":
                parent = this.parent;
                break;
        }
        return parent;
    },
    getCount: function(){
        return this.type === "selector" ? this.count : undefined;
    }
};
