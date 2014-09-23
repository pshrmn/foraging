/********************
        GROUP
********************/
function Group(name, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {
        "default": new Page("default")
    };
    this.pages["default"].group = this;
    this.htmlElements = {};
}

Group.prototype.object = function(){
    var data = {
        name: this.name,
        urls: this.urls,
        pages: {}
    },
        pageObject;

    for ( var key in this.pages ) {
        data.pages[key] = this.pages[key].object();
    }

    return data;
};

/***
rearrange the group's JSON into proper format for Collector
name: the name of the group
urls: converted from an object to a list of urls
pages: a tree with root node of the "default" page. Each 
***/
Group.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        urls: Object.keys(this.urls)
    },
        pages = {},
        followSets = {},
        currPage,
        pageName, setName,
        pageObject,
        set, followPages;

    // iterate over all pages and generate their upload json
    for ( pageName in this.pages ) {
        currPage = this.pages[pageName];
        pageObject = currPage.uploadObject();
        if ( pageObject ) {
            pages[pageName] = pageObject;
            followSets[pageName] = currPage.followedSets();
        }
    }

    // iterate over followSets to build tree
    for ( pageName in followSets ) {
        set = followSets[pageName];
        for ( setName in set ) {
            followPages = set[setName];
            for ( var i=0, len=followPages.length; i<len; i++ ) {
                var currPageName = followPages[i];

                // make sure the page actually exists before appending
                if ( pages[currPageName] ) {
                    pages[pageName].sets[setName].pages[currPageName] = pages[currPageName];
                }
            }
        }
    }

    // once all of the following pages have been attached to their set, set data.page
    data.page = pages.default;

    return data;  
};

Group.prototype.html = function(){
    var holder = noSelectElement("div"),
        nametag = noSelectElement("h3"),
        pages = noSelectElement("ul");

    holder.classList.add("group");
    nametag.textContent = "Group: " + this.name;
    appendChildren(holder, [nametag, pages]);

    for ( var key in this.pages ) {
        pages.appendChild(this.pages[key].html());
    }

    this.htmlElements = {
        holder: holder,
        nametag: nametag,
        pages: pages
    };

    return holder;
};

Group.prototype.deleteHTML = prototypeDeleteHTML;

Group.prototype.toggleURL = function(url){
    if ( this.urls[url] ) {
        delete this.urls[url];
    } else {
        this.urls[url] = true;
    }
};

Group.prototype.addPage = function(page){
    var name = page.name;
    if ( this.pages[name] ) {
        this.removePage(name);
    }
    this.pages[name] = page;
    page.group = this;
    // if html for group exists, also generate html for page
    if ( this.htmlElements.holder) {
        var ele = page.html();
        this.htmlElements.pages.appendChild(ele);
    }
};

Group.prototype.removePage = function(name){
    var page = this.pages[name];
    if ( page ) {
        this.pages[name].deleteHTML();
        delete this.pages[name];
    }
};

Group.prototype.uniquePageName = function(name){
    for ( var key in this.pages ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
};

Group.prototype.uniqueSelectorSetName = function(name){
    var page, pageName, setName;
    for ( pageName in this.pages ){
        page = this.pages[pageName];
        for ( setName in page.sets ) {
            if ( name === setName ) {
                return false;
            }
        }
    }
    return true;
};

Group.prototype.uniqueRuleName = function(name){
    var page, selectorSet, selector,
        pageName, setName, selectorName, ruleName;
    for ( pageName in this.pages ){
        page = this.pages[pageName];
        for ( setName in page.sets ) {
            selectorSet = page.sets[setName];
            for ( selectorName in selectorSet.selectors ) {
                selector = selectorSet.selectors[selectorName];
                for ( ruleName in selector.rules ) {
                    if ( name === ruleName ) {
                        return false;
                    }
                }
            }
        }
    }
    return true;  
};

/********************
        PAGE
********************/
function Page(name, index, next){
    this.name = name,
    this.index = index || false;
    this.next = next;
    this.sets = {
        "default": new SelectorSet("default")
    };
    this.sets["default"].page = this;
    this.htmlElements = {};
    // added when a group calls addPage
    this.group;
}

Page.prototype.object = function(){
    var data = {
        name: this.name,
        index: this.index,
        sets: {}
    };

    if ( this.next ) {
        data.next = this.next;
    }

    for ( var key in this.sets ) {
        data.sets[key] = this.sets[key].object();
    }

    return data;
};

/***
returns an object representing a page for upload
name: name of the page
index: whether or not the page is an index page (based on if there is a next)
    probably not necessary, look to remove after tree is working
sets: dict containing non-empty (ie, has 1+ rules) selector sets
next: string for next selector (if index = true)
***/
Page.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        index: this.index,
        sets: {}
    };

    // only add next if it exists
    if ( this.next){
        data.next = this.next;
    }

    var set;
    for ( var key in this.sets ) {
        set = this.sets[key].uploadObject();
        if ( set ) {
            data.sets[key] = set;
        }
    }

    // return undefined if all sets were empty
    if ( Object.keys(data.sets).length === 0 ) {
        return;
    }

    return data;  
};

Page.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("h4"),
        sets = noSelectElement("ul");

    holder.classList.add("page");
    nametag.textContent = "Page: " + this.name;
    appendChildren(holder, [nametag, sets]);

    for ( var key in this.sets ) {
        sets.appendChild(this.sets[key].html());
    }

    this.htmlElements = {
        holder: holder,
        nametag: nametag,
        sets: sets
    };

    return holder;
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(selectorSet){
    var name = selectorSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = selectorSet;
    selectorSet.page = this;
    // if html for page exists, also create html for SelectorSet
    if ( this.htmlElements.holder ) {
        var ele = selectorSet.html();
        this.htmlElements.sets.appendChild(ele);
    }
};

Page.prototype.removeSet = function(name){
    var set = this.sets[name];
    if ( set ) {
        set.remove();
        delete this.sets[name];
    }
};

Page.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.sets ) {
        this.removeSet(key);
    }
    if ( this.group ) {
        delete this.group.pages[this.name];
    }
};

Page.prototype.removeNext = function(){
    this.next = undefined;
    this.index = false;
};

/***
iterate over sets in the page, returning an object mapping selector set's name to a list of pages that
follow it
***/
Page.prototype.followedSets = function(){
    var following = {},
        set, followed;
    for ( var key in this.sets ) {
        set = this.sets[key];
        followed = set.followedRules();
        if ( followed.length ) {
            following[key] = followed;
        }
    }
    return following;
};

/********************
        SelectorSet
*********************
name: name of the selector set
parent: selector/range for selecting a selector set's parent element
********************/
function SelectorSet(name, parent){
    this.name = name;
    this.parent = parent;
    this.selectors = {};
    this.htmlElements = {};
    // added when a page calls addSet
    this.page;
}

SelectorSet.prototype.object = function(){
    var data = {
        name: this.name,
        selectors: {}
    };

    if ( this.parent ) {
        data.parent = this.parent;
    }

    for ( var key in this.selectors ) {
        data.selectors[key] = this.selectors[key].object();
    }

    return data;
};

/***
    name: name of selector set
    selectors: dict mapping name of selectors to selectors
    pages: any pages that should be crawled based on a "follow"ed rule
***/
SelectorSet.prototype.uploadObject = function(){
    if ( Object.keys(this.selectors).length === 0 ) {
        return;
    }

    // use base object created by SelectorSet.object
    var data = this.object();

    for ( var key in this.selectors ) {
        data.selectors[key] = this.selectors[key].uploadObject();
    }

    data.pages = {};

    // only upload low/high if their values are not 0
    if ( data.parent ) {
        if ( data.parent.low === 0 ) {
            delete data.parent.low;
        }

        if ( data.parent.high === 0 ) {
            delete data.parent.high;
        }
    }

    return data;
};

SelectorSet.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("h5"),
        ul = noSelectElement("ul");
        
    holder.classList.add("set");
    nametag.textContent = "Selector Set: " + this.name;
    appendChildren(holder, [nametag, ul]);

    this.htmlElements = {
        holder: holder,
        nametag: nametag,
        selectors: ul
    };

    return holder;
};

SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
};

SelectorSet.prototype.addSelector = function(selector, events){
    this.selectors[selector.selector] = selector;
    if ( this.htmlElements.selectors) {
        var ele = selector.html.apply(selector, events);
        this.htmlElements.selectors.appendChild(ele);
    }
    selector.set = this;
};

SelectorSet.prototype.removeSelector = function(name){
    var selector = this.selectors[name];
    if ( selector ) {
        selector.remove();
        delete this.selectors[name];
    }
};

SelectorSet.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.selectors ) {
        this.removeSelector(key);
    }
    if ( this.page ) {
        delete this.page.sets[this.name];
    }
};

/***
iterate over rules in the set and returns an array containg names of rules where follow = true
***/
SelectorSet.prototype.followedRules = function(){
    var following = [],
        selector;
    for ( var key in this.selectors ) {
        selector = this.selectors[key];
        for ( var ruleName in selector.rules ) {
            following.push(ruleName);
        }
    }
    return following;
};

/********************
        SELECTOR
********************/
function Selector(selector, rules){
    this.selector = selector;
    this.rules = rules || {};
    this.htmlElements = {};
}

Selector.prototype.object = function(){
    var data = {
        selector: this.selector,
        rules: {}
    };

    for ( var key in this.rules ) {
        data.rules[key] = this.rules[key].object();
    }

    return data;
};

/*
only include the selector if it has rules
*/
Selector.prototype.uploadObject = function(){
    if ( Object.keys(this.rules).length === 0 ) {
        return;
    }

    return this.object();
};

Selector.prototype.addRule = function(rule, events){
    this.rules[rule.name] = rule;
    rule.selector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Group)
    // add a new Page to the group with the name of the Rule
    if ( rule.follow && this.set && this.set.page && this.set.page.group ) {
        var page = new Page(rule.name);
        this.set.page.group.addPage(page);
    }

    // if Selector html exists, also create html for rule
    if ( this.htmlElements.rules ) {
        var ele = rule.html.apply(rule, events);
        this.htmlElements.rules.appendChild(ele);
    }
};

Selector.prototype.removeRule = function(name){
    delete this.rules[name];
};

Selector.prototype.updateSelector = function(newSelector){
    var oldSelector = this.selector;
    this.selector = newSelector;
    if ( this.htmlElements.nametag ) {
        this.htmlElements.nametag.textContent = newSelector;
    }

    if ( this.set ) {
        this.set.selectors[newSelector] = this;
        delete this.set.selectors[oldSelector];
    }
};

Selector.prototype.html = function(newRuleEvent, editEvent, deleteEvent){
    var holder = noSelectElement("li"),
        identifier = document.createTextNode("Selector: "),
        nametag = noSelectElement("span"),
        newRule = noSelectElement("button"),
        editSelector = noSelectElement("button"),
        remove = noSelectElement("button"),
        rules = noSelectElement("ul");

    holder.classList.add("selector");
    nametag.textContent = this.selector;

    newRule.textContent = "Add Rule";
    editSelector.textContent = "Edit Selector";
    remove.textContent = "×";

    newRule.addEventListener("click", newRuleEvent.bind(this), false);
    editSelector.addEventListener("click", editEvent.bind(this), false);
    remove.addEventListener("click", deleteEvent.bind(this), false);

    appendChildren(holder, [identifier, nametag, newRule, editSelector, remove, rules]);

    this.htmlElements = {
        holder: holder,
        nametag: nametag,
        newRule: newRule,
        editSelector: editSelector,
        remove: remove,
        rules: rules
    };

    return holder;
};

Selector.prototype.deleteHTML = prototypeDeleteHTML;

Selector.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.rules ) {
        this.removeRule(key);
    }

    if ( this.set ) {
        delete this.set.selectors[this.selector];
    }
};

/********************
        RULE
********************/
function Rule(name, capture, follow){
    this.name = name;
    this.capture = capture;
    this.follow = follow || false;
    this.htmlElements = {};
    // added when a SelectorSet calls addRule
    this.selector;
}

Rule.prototype.object = function(){
    var data = {
        name: this.name,
        capture: this.capture
    };

    if ( this.follow ) {
        data.follow = this.follow;
    }

    return data;
};

Rule.prototype.html = function(selectorViewEvent, unselectorViewEvent, editEvent, previewEvent, deleteEvent){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        edit = noSelectElement("span"),
        preview = noSelectElement("span"),
        deltog = noSelectElement("span");

    holder.classList.add("rule");
    nametag.textContent = this.name;
    nametag.classList.add("savedRuleName");
    edit.classList.add("editRule");
    edit.textContent = "edit";
    preview.classList.add("previewRule");
    preview.textContent = "preview";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, edit, preview, deltog]);

    holder.addEventListener("mouseenter", selectorViewEvent.bind(this), false);
    holder.addEventListener("mouseleave", unselectorViewEvent.bind(this), false);
    edit.addEventListener("click", editEvent.bind(this), false);
    preview.addEventListener("click", previewEvent.bind(this), false);
    deltog.addEventListener("click", deleteEvent.bind(this), false);
    
    this.htmlElements = {
        holder: holder,
        nametag: nametag,
        edit: edit,
        preview: preview,
        deltog: deltog
    };

    return holder;
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName = this.name,
        newName = object.name;
    if ( oldName !== newName ) {
        this.name = newName;
        // update nametag if html has been generated
        if ( this.htmlElements.holder ) {
            this.htmlElements.nametag.textContent = newName;
        }
        if ( this.selector ) {
            this.selector.rules[newName] = this;
            delete this.selector.rules[oldName];
        }
    }
    this.capture = object.capture;
    this.follow = object.follow || false;
};

/***
delete rule's html
is rule.follow, remove the page associated with the rule
remove rule from parent selector
***/
Rule.prototype.remove = function(){
    this.deleteHTML();
    // remove associated page if rule.follow = true
    if ( this.follow && this.selector && this.selector.set && this.selector.set.page &&
        this.selector.set.page.group) {
        this.selector.set.page.group.removePage(this.name);
    }

    if ( this.selector ) {
        delete this.selector.rules[this.name];
    }
};

// shared delete function
function prototypeDeleteHTML(){
    var holder = this.htmlElements.holder;
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
