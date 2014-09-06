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
    this.elements = {};
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
    holder.appendChild(nametag);
    holder.appendChild(pages);

    for ( var key in this.pages ) {
        pages.appendChild(this.pages[key].html());
    }

    this.elements = {
        holder: holder,
        nametag: nametag,
        pages: pages
    };

    return holder;
};

Group.prototype.deleteHTML = prototypeDeleteHTML;

Group.prototype.addPage = function(page){
    var name = page.name;
    if ( this.pages[name] ) {
        this.removePage(name);
    }
    this.pages[name] = page;
    page.group = this;
    // if html for group exists, also generate html for page
    if ( this.elements.holder) {
        var ele = page.html();
        this.elements.pages.appendChild(ele);
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

Group.prototype.uniqueRuleSetName = function(name){
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
    var page, ruleSet,
        pageName, setName, ruleName;
    for ( pageName in this.pages ){
        page = this.pages[pageName];
        for ( setName in page.sets ) {
            ruleSet = page.sets[setName];
            for ( ruleName in ruleSet.rules ) {
                if ( name === ruleName ) {
                    return false;
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
        "default": new RuleSet("default")
    };
    this.sets["default"].page = this;
    this.elements = {};
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
sets: dict containing non-empty (ie, has 1+ rules) rule sets
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
    holder.appendChild(nametag);
    holder.appendChild(sets);

    for ( var key in this.sets ) {
        sets.appendChild(this.sets[key].html());
    }

    this.elements = {
        holder: holder,
        nametag: nametag,
        sets: sets
    };

    return holder;
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(ruleSet){
    var name = ruleSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = ruleSet;
    ruleSet.page = this;
    // if html for page exists, also create html for RuleSet
    if ( this.elements.holder ) {
        var ele = ruleSet.html();
        this.elements.sets.appendChild(ele);
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
iterate over sets in the page, returning an object mapping rule set's name to a list of pages that
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
        RULESET
*********************
name: name of the rule set
parent: selector/range for selecting a rule set's parent element
********************/
function RuleSet(name, parent){
    this.name = name;
    this.parent = parent;
    this.rules = {};
    this.elements = {};
    // added when a page calls addSet
    this.page;
}

RuleSet.prototype.object = function(){
    var data = {
        name: this.name,
        rules: {}
    };

    if ( this.parent ) {
        data.parent = this.parent;
    }

    for ( var key in this.rules ) {
        data.rules[key] = this.rules[key].object();
    }


    return data;
};

/***
    name: name of rule set
    rules: dict mapping name of rules to rules
    pages: any pages that should be crawled based on a "follow"ed rule
***/
RuleSet.prototype.uploadObject = function(){
    if ( Object.keys(this.rules).length === 0 ) {
        return;
    }

    var data = {
        name: this.name,
        rules: {},
        pages: {}
    };

    if ( this.parent ) {
        data.parent = this.parent;
    }

    for ( var key in this.rules ) {
        data.rules[key] = this.rules[key].object();
    }


    return data;
};

RuleSet.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("h5"),
        ul = noSelectElement("ul");
        
    holder.classList.add("ruleSet");
    nametag.textContent = "Rule Set: " + this.name;

    holder.appendChild(nametag);
    holder.appendChild(ul);

    this.elements = {
        holder: holder,
        nametag: nametag,
        rules: ul
    };

    return holder;
};

RuleSet.prototype.deleteHTML = prototypeDeleteHTML;

RuleSet.prototype.addRule = function(rule, events){   
    this.rules[rule.name] = rule;
    rule.ruleSet = this;

    // if the Rule has follow=true and the RuleSet has a Page (which in turn has a Group)
    // add a new Page to the group with the name of the Rule
    if ( rule.follow && this.page && this.page.group ) {
        var page = new Page(rule.name);
        this.page.group.addPage(page);
    }

    // if RuleSet html exists, also create html for rule
    if ( this.elements.rules ) {
        var ele = rule.html.apply(rule, events);
        this.elements.rules.appendChild(ele);
    }
};

RuleSet.prototype.removeRule = function(name){
    var rule = this.rules[name];
    if ( rule ) {
        rule.remove();
    }
};

RuleSet.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.rules ) {
        this.removeRule(key);
    }
    if ( this.page ) {
        delete this.page.sets[this.name];
    }
};

/***
iterate over rules in the set and returns an array containg names of rules where follow = true
***/
RuleSet.prototype.followedRules = function(){
    var following = [];
    for ( var key in this.rules ) {
        if ( this.rules[key].follow ) {
            following.push(key);
        }
    }
    return following;
};

/********************
        RULE
********************/
function Rule(name, selector, capture, follow){
    this.name = name;
    this.selector = selector;
    this.capture = capture;
    this.follow = follow || false;
    this.elements = {};
    // added when a ruleSet calls addRule
    this.ruleSet;
}

Rule.prototype.object = function(){
    var data = {
        name: this.name,
        selector: this.selector,
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

    holder.classList.add("savedRule");
    nametag.textContent = this.name;
    nametag.classList.add("savedRuleName");
    edit.classList.add("editRule");
    edit.textContent = "edit";
    preview.classList.add("previewRule");
    preview.textContent = "preview";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    holder.appendChild(nametag);
    holder.appendChild(edit);
    holder.appendChild(preview);
    holder.appendChild(deltog);

    holder.addEventListener("mouseenter", selectorViewEvent.bind(this), false);
    holder.addEventListener("mouseleave", unselectorViewEvent.bind(this), false);
    edit.addEventListener("click", editEvent.bind(this), false);
    preview.addEventListener("click", previewEvent.bind(this), false);
    deltog.addEventListener("click", deleteEvent.bind(this), false);
    
    this.elements = {
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
        if ( this.elements.holder ) {
            this.elements.nametag.textContent = newName;
        }
        if ( this.ruleSet ) {
            this.ruleSet.rules[newName] = this;
            delete this.ruleSet.rules[oldName];
        }
    }
    this.selector = object.selector;
    this.capture = object.capture;
    this.follow = object.follow || false;
};

Rule.prototype.remove = function(){
    this.deleteHTML();
    if ( this.follow && this.ruleSet && this.ruleSet.page && this.ruleSet.page.group ) {
        // find associated page and remove that
        this.ruleSet.page.group.removePage(this.name);
    }
    if ( this.ruleSet ) {
        delete this.ruleSet.rules[this.name];
    }
};

// shared delete function
function prototypeDeleteHTML(){
    var holder = this.elements.holder;
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
