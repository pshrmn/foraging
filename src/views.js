// requires Family, Cycle, Parent, UI

// control the selector view
var SelectorView = (function(){
    var html    = {
        family:     document.getElementById("selectorHolder"),
        selector:   document.getElementById("currentSelector"),
        count:      document.getElementById("currentCount"),
        parent: {
            holder: document.getElementById("parentRange"),
            low:    document.getElementById("parentLow"),
            high:   document.getElementById("parentHigh")
        },
        type:       document.getElementById("selectorType")
    };
    var cycle   = new Cycle(document.getElementById("selectorCycleHolder"));
    var sv      = {
        editing:    false,
        type:       "selector",
        reset: function(){
            Family.remove();
            Parent.setType("selector");
            this.editing = false;
            delete this.editingObject;
            cycle.reset();

            html.parent.holder.style.display = "none";
            html.parent.low.value = "";
            html.parent.high.value = "";
            html.count.textContent = "";
        },
        setElements: function(elements){
            cycle.setElements(elements);
        },
        // type is the type of selector that is being created
        // selector is a pre-existing selector to be edited
        show: function(type, selector){
            Parent.setType(type);
            html.type.textContent = type;
            switch(type){
            case "selector":
                html.parent.holder.style.display = "none";
                if ( selector ) {
                    html.selector.textContent = selector.selector;
                }
                break;
            case "parent":
                html.parent.holder.style.display = "block";
                Parent.hide();
                if ( selector ) {
                    html.parent.low.value = selector.low || "";
                    html.parent.high.value = selector.high || "";
                    html.selector.textContent = selector.selector;
                }
                break;
            case "next":
                html.parent.holder.style.display = "none";
                Parent.hide();
                break;
            }
            UI.showSelectorView();
            Family.turnOn();
        }
    };


    /***************
        EVENTS
    ***************/
    idEvent("saveSelector", "click", saveEvent);
    idEvent("cancelSelector", "click", cancelEvent);

    idEvent("parentLow", "blur", rangeEvent);
    idEvent("parentHigh", "blur", rangeEvent);

    function saveEvent(event){
        event.preventDefault();
        error.clear();
        var selector = html.selector.textContent;
        var success;

        if ( error.empty(selector, html.selector, "No CSS selector selected") ) {
            return;
        }
        switch(Parent.getType()){
        case "selector":
            success = saveSelector(selector);
            break;
        case "parent":
            success = saveParent(selector);
            break;
        case "next":
            success = saveNext(selector);
            break;
        default:
            success = true;
        }
        if ( success ) {
            resetInterface();
            UI.showSchemaView();
        }
    }

    function saveSelector(selector){
        var sel = new Selector(selector);
        // if editing just update the selector, otherwise add it to the current set
        if ( sv.editing ) {
            sv.editingObject.updateSelector(selector);
        } else {
            CurrentSite.current.set.addSelector(sel);
        }
        
        CurrentSite.saveCurrent();
        return true;
    }

    function saveParent(selector){
        var low     = parseInt(html.parent.low.value, 10);
        var high    = parseInt(html.parent.high.value, 10);
        var parent  = {
            selector: selector
        };

        if ( !isNaN(low) ) {
            parent.low = low;
        }
        if ( !isNaN(high) ) {
            parent.high = high;
        }
        Parent.set(parent);

        // attach the parent to the current set and save
        CurrentSite.current.set.addParent(parent);
        CurrentSite.saveCurrent();
        return true;
    }

    function saveNext(selector){
        var match           = document.querySelector(selector);
        var name            = CurrentSite.current.page.name;
        var defaultError    = "Cannot add next selector to '" + name + "' page, only to default";
        var hrefError       = "selector must select element with href attribute";

        if ( error.check( (name !== "default" ), html.selector, defaultError) || 
            error.check(!match.hasAttribute("href"), html.selector, hrefError) ) {
            return false;
        }

        CurrentSite.current.page.addNext(selector);
        CurrentSite.saveCurrent();
        return true;
    }


    function cancelEvent(event){
        event.preventDefault();
        resetInterface();
        UI.showSchemaView();
    }

    function rangeEvent(event){
        var lowVal      = html.parent.low.value;
        var highVal     = html.parent.high.value;
        var low         = parseInt(lowVal, 10);
        var high        = parseInt(highVal, 10);
        var errorBool   = false;
        var lowMsg      = "Low must be positive integer greater than 0";
        var highMsg     = "High must be negative integer";

        if ( lowVal !== "" ) {
            if ( error.check(( isNaN(low) || low <= 0 ), html.parent.low, lowMsg) ) {
                html.parent.low.value = "";
                errorBool = true;
            }
        } else { 
            low = 0;
        }

        if ( highVal !== "" ) {
            if ( error.check( (isNaN(high) || high > 0 ), html.parent.high, highMsg )) {
                html.parent.high.value = "";
                errorBool = true;
            }
        } else {
            high = 0;
        }

        if ( errorBool ) {
            return;
        }

        var elements    = Family.selectorElements();
        // restrict to range
        elements = Array.prototype.slice.call(elements).slice(low, elements.length + high);
        clearClass("queryCheck");
        addClass("queryCheck", elements);
        cycle.setElements(elements);
        html.count.textContent = elementCount(elements.length, Parent.getCount() );
    }

    return sv;

})();

var RuleView = (function(){
    var html    = {
        selector:       document.getElementById("ruleSelector"),
        form:           document.getElementById("ruleForm"),
        name:           document.getElementById("ruleName"),
        capture:        document.getElementById("ruleAttr"),
        follow:         document.getElementById("ruleFollow"),
        followHolder:   document.getElementById("ruleFollowHolder")
    };
    var cycle   = new Cycle(document.getElementById("ruleCycleHolder"), true);
    var rv      = {
        editing: false,
        reset: function(){
            this.editing = false;
            delete this.editingObject;
            cycle.reset();
            // reset rule form
            html.selector.textContent           = "";
            html.name.value                     = "";
            html.capture.textContent            = "";
            html.follow.checked                 = false;
            html.follow.disabled                = true;
            html.followHolder.style.display     = "none";
        },
        show: function(selector, rule){
            // setup based on (optional) rule
            if ( rule ) {
                html.name.value = rule.name;
                html.capture.textContent = rule.capture;
                if ( rule.capture === "attr-href" ) {
                    html.follow.checked = rule.follow;
                    html.follow.disabled = false;
                    html.followHolder.style.display = "block";
                } else {
                    html.follow.checked = false;
                    html.follow.disabled = true;
                    html.followHolder.style.display = "none";
                }
            }

            // setup based on selector
            html.selector.textContent = selector;
            var elements = Fetch.matchedElements(selector, Parent.getParent());
            cycle.setElements(elements);
            addClass("savedPreview", elements);
            UI.showRuleView();
        }
    };

    /***************
        EVENTS
    ***************/

    idEvent("saveRule", "click", saveEvent);
    idEvent("cancelRule", "click", cancelEvent);

    function saveEvent(event){
        event.preventDefault();
        var name            = html.name.value;
        var capture         = html.capture.textContent;
        var follow          = html.follow.checked;
        var emptyName       = "Name needs to be filled in";
        var emptyAttr       = "No attribute selected";
        var reservedName    = "Cannot use " + name + " because it is a reserved word";
        var notUnique       = "Rule name is not unique";
        // error checking
        error.clear();
        if ( error.empty(name, html.name, emptyName) ||
            error.empty(capture, html.capture, emptyAttr) || 
            error.reservedWord(name, html.name, reservedName) ) {
            return;
        }

        if ( rv.editing ) {
            rv.editingObject.update({
                name: name,
                capture: capture,
                follow: follow
            });
            delete rv.editingObject;
        } else {
            if ( error.check(!CurrentSite.current.schema.uniqueRuleName(name), html.name, notUnique) ) {
                return;
            }
            var rule = new Rule(name, capture, follow);
            CurrentSite.current.selector.addRule(rule);
        }
        CurrentSite.current.selector = undefined;
        CurrentSite.saveCurrent();
        UI.showSchemaView();
    }

    function cancelEvent(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface();
        UI.showSchemaView();
    }

    return rv;

})();
