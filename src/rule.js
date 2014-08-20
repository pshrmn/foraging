/********************
        GROUP
********************/
function Group(name, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {
        "default": new Page("default")
    };
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

Group.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        urls: Object.keys(this.urls),
        pages: {}
    },
        pageObject;

    for ( var key in this.pages ) {
        pageObject = this.pages[key].uploadObject();
        if ( pageObject ) {
            data.pages[key] = pageObject;
        }
    }

    return data;  
};

Group.prototype.html = function(){
    var holder = noSelectElement("div"),
        nametag = noSelectElement("p");

    nametag.textContent = "Group: " + this.name;
    holder.appendChild(nametag);

    this.elements = {
        holder: holder,
        nametag: nametag
    };

    return holder;
};

Group.prototype.deleteHTML = prototypeDeleteHTML;

Group.prototype.addPage = function(page){
    this.pages[page.name] = page;
    page.group = this;
    // if html for group exists, also generate html for page
    if ( this.elements.holder) {
        var ele = page.html();
        this.elements.holder.appendChild(ele);
    }
};

Group.prototype.removePage = function(name){
    this.pages[name].deleteHTML();
    delete this.pages[name];
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

Page.prototype.uploadObject = function(){
    var data = {
        name: this.name,
        index: this.index,
        sets: {}
    };

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
    var holder = noSelectElement("div"),
        nametag = noSelectElement("p");

    nametag.textContent = "Page: " + this.name;
    holder.appendChild(nametag);

    this.elements = {
        holder: holder,
        nametag: nametag
    };

    return holder;
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(ruleSet){
    this.sets[ruleSet.name] = ruleSet;
    ruleSet.page = this;
    // if html for page exists, also create html for RuleSet
    if ( this.elements.holder ) {
        var ele = ruleSet.html();
        this.elements.holder.appendChild(ele);
    }
};

Page.prototype.removeSet = function(name){
    this.sets[name].deleteHTML();
    delete this.sets[name];
};

Page.prototype.removeNext = function(){
    this.next = undefined;
    this.index = false;
};

/********************
        RULESET
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

RuleSet.prototype.uploadObject = function(){
    if ( Object.keys(this.rules).length === 0 ) {
        return;
    }

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

RuleSet.prototype.html = function(){
    var holder = noSelectElement("div"),
        nametag = noSelectElement("h3"),
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
    var rule = this.rules[name],
        follow = false;
    if ( !rule ) {
        return;
    }
    // if rule that is being deleted has follow=true, make sure to delete corresponding page
    if ( rule.follow ) {
        follow = true;
    }

    // remove the html element
    rule.deleteHTML();
    delete this.rules[name];
    return follow;
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

// shared delete function
function prototypeDeleteHTML(){
    var holder = this.elements.holder;
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
