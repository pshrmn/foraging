// this exists in a separate file for ease of use
// but has dependencies on variables in collector.js and thus is not modular

/********************
        SCHEMA
********************/
function Schema(name, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {
        "default": new Page("default")
    };
    this.pageOptions;
    this.pages["default"].parentSchema = this;
    this.htmlElements = {};
}

Schema.prototype.object = function(){
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
rearrange the schema's JSON into proper format for Collector
name: the name of the schema
urls: converted from an object to a list of urls
pages: a tree with root node of the "default" page. Each 
***/
Schema.prototype.uploadObject = function(){
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

Schema.prototype.html = function(){
    var holder = noSelectElement("div"),
        nametag = noSelectElement("span"),
        pages = noSelectElement("ul");

    holder.classList.add("schema");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Schema");
    appendChildren(holder, [nametag, pages]);

    for ( var key in this.pages ) {
        pages.appendChild(this.pages[key].html());
    }

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.pages = pages;

    return holder;
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

Schema.prototype.toggleURL = function(url){
    if ( this.urls[url] ) {
        delete this.urls[url];
        return false;
    } else {
        this.urls[url] = true;
        return true;
    }
};

Schema.prototype.addPage = function(page){
    var name = page.name;
    if ( this.pages[name] ) {
        this.removePage(name);
    }
    this.pages[name] = page;
    page.parentSchema = this;
    // if html for schema exists, also generate html for page
    if ( this.htmlElements.holder) {
        var ele = page.html();
        this.htmlElements.pages.appendChild(ele);
    }
    // need to do something with select
};

Schema.prototype.removePage = function(name){
    var page = this.pages[name];
    if ( page ) {
        page.remove();
        delete this.pages[name];
    }
};

Schema.prototype.uniquePageName = function(name){
    for ( var key in this.pages ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
};

Schema.prototype.uniqueSelectorSetName = function(name){
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

Schema.prototype.uniqueRuleName = function(name){
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
    this.sets["default"].parentPage = this;
    this.htmlElements = {};
    // added when a schema calls addPage
    this.parentSchema;
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
        nametag = noSelectElement("span"),
        addSet = noSelectElement("button"),
        sets = noSelectElement("ul");

    holder.classList.add("page");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Page");
    addSet.textContent = "add set";
    addSet.addEventListener("click", this.events.addSet.bind(this), false);
    appendChildren(holder, [nametag, addSet, sets]);

    for ( var key in this.sets ) {
        sets.appendChild(this.sets[key].html());
    }

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.sets = sets;

    return holder;
};

Page.prototype.events = {
    addSet: function(event){
        event.preventDefault();
        createSelectorSet(this);
    }
};

Page.prototype.addOption = function(select){
    if ( !select ) {
        return;
    }
    var option = noSelectElement("option");

    option.setAttribute("value", this.name);
    option.textContent = this.name;

    select.appendChild(option);
    this.htmlElements.option = option;
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

Page.prototype.addSet = function(selectorSet){
    var name = selectorSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = selectorSet;
    selectorSet.parentPage = this;
    // if html for page exists, also create html for SelectorSet
    if ( this.htmlElements.holder ) {
        var ele = selectorSet.html();
        this.htmlElements.sets.appendChild(ele);
    }
};

/*
get rid of selector sets, selectors, and rules in the page
*/
Page.prototype.reset = function(){
    for ( var key in this.sets ) {
        this.removeSet(key);
    }
    var defaultSet = new SelectorSet("default");
    this.addSet(defaultSet);
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
    if ( this.parentSchema ) {
        delete this.parentSchema.pages[this.name];
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

Page.prototype.updateName = function(name){
    if ( name === this.name ) {
        return;
    }
    var oldName = this.name;
    this.name = name;
    if ( this.parentSchema ) {
        this.parentSchema.pages[name] = this;
        delete this.parentSchema.pages[oldName];
    }

    if ( this.htmlElements.option ) {
        this.htmlElements.option.setAttribute("value", this.name);
        this.htmlElements.option.textContent = this.name;
    }
    if ( this.htmlElements.nametag ) {
        this.htmlElements.nametag.textContent = this.name;
    }
};

Page.prototype.preview = function(){
    var value = "";
    for ( var key in this.sets ) {
        value += this.sets[key].preview();
    }
    return value;
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
    this.parentPage;
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
        nametag = noSelectElement("span"),
        //addSelector = noSelectElement("button"),
        ul = noSelectElement("ul");
        
    holder.classList.add("set");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Selector Set");
    //addSelector.textContent = "add selector";
    //addSelector.addEventListener("click", this.events.addSelector.bind(this), false);
    //appendChildren(holder, [nametag, addSelector, ul]);
    appendChildren(holder, [nametag, ul]);

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.selectors = ul;

    return holder;
};

/*
// don't use this quite yet
SelectorSet.prototype.events = {
    addSelector: function(event){
        event.preventDefault();
        // make this the current selector set
        Collect.current.set = this;
        if ( this.option ) {
            this.option.selected = true;
        }
        showTab(HTML.tabs.selector);
    }
};
*/

SelectorSet.prototype.addOption = function(select){
    if ( !select ) {
        return;
    }
    var option = noSelectElement("option");

    option.setAttribute("value", this.name);
    option.textContent = this.name;

    select.appendChild(option);
    this.htmlElements.option = option;
};

SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
};

SelectorSet.prototype.addSelector = function(selector){
    this.selectors[selector.selector] = selector;
    if ( this.htmlElements.selectors) {
        var ele = selector.html();
        this.htmlElements.selectors.appendChild(ele);
    }
    selector.parentSet = this;
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
    if ( this.parentPage ) {
        delete this.parentPage.sets[this.name];
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

SelectorSet.prototype.preview = function(){
    var value = "",
        key;
    if ( this.parent ) {
        var parentElements = document.querySelectorAll(this.parent.selector),
            len = parentElements.length,
            low = this.parent.low || 0,
            high = this.parent.high || 0,
            elements = Array.prototype.slice.call(parentElements).slice(low, len + high);
        for ( var i=0, eLen = elements.length; i<eLen; i++ ) {
            value += "<div class=\"previewSet noSelect\">";
            for ( key in this.selectors ) {
                value += this.selectors[key].preview(elements[i]);
            }
            value +=  "</div>";
        }
    } else {
        for ( key in this.selectors ) {
            value += this.selectors[key].preview(document.body);
        }
    }
    return value;
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

Selector.prototype.addRule = function(rule){
    this.rules[rule.name] = rule;
    rule.parentSelector = this;

    // if the Rule has follow=true and the SelectorSet has a Page (which in turn has a Schema)
    // add a new Page to the schema with the name of the Rule
    if ( rule.follow && this.parentSet && this.parentSet.parentPage && this.parentSet.parentPage.parentSchema ) {
        // only add page if it doesn't already exist
        if ( !this.parentSet.parentPage.parentSchema.pages[rule.name] ) {
            var page = new Page(rule.name);
            page.addOption(HTML.perm.page.select);
            this.parentSet.parentPage.parentSchema.addPage(page);
        }
    }

    // if Selector html exists, also create html for rule
    if ( this.htmlElements.rules ) {
        var ele = rule.html();
        this.htmlElements.rules.appendChild(ele);
    }
};

Selector.prototype.removeRule = function(name){
    var rule = this.rules[name];
    if ( rule ) {
        rule.remove();
        delete this.rules[name];
    }
};

Selector.prototype.updateSelector = function(newSelector){
    var oldSelector = this.selector;
    this.selector = newSelector;
    if ( this.htmlElements.nametag ) {
        this.htmlElements.nametag.textContent = newSelector;
    }

    if ( this.parentSet ) {
        this.parentSet.selectors[newSelector] = this;
        delete this.parentSet.selectors[oldSelector];
    }
};

Selector.prototype.html = function(){
    var holder = noSelectElement("li"),
        identifier = document.createTextNode("Selector: "),
        nametag = noSelectElement("span"),
        editSelector = noSelectElement("button"),
        newRule = noSelectElement("button"),
        remove = noSelectElement("button"),
        rules = noSelectElement("ul");

    holder.classList.add("selector");
    nametag.textContent = this.selector;

    newRule.textContent = "add rule";
    editSelector.textContent = "edit";
    remove.textContent = "×";

    holder.addEventListener("mouseenter", this.events.preview.bind(this), false);
    holder.addEventListener("mouseleave", this.events.unpreview.bind(this), false);
    newRule.addEventListener("click", this.events.newRule.bind(this), false);
    editSelector.addEventListener("click", this.events.edit.bind(this), false);
    remove.addEventListener("click", this.events.remove.bind(this), false);

    appendChildren(holder, [identifier, nametag, editSelector, newRule, remove, rules]);

    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.newRule = newRule;
    this.htmlElements.editSelector = editSelector;
    this.htmlElements.remove = remove;
    this.htmlElements.rules = rules;

    return holder;
};

Selector.prototype.events = {
    preview: function(event){
        clearClass("queryCheck");
        clearClass("collectHighlight");
        var elements = Collect.matchedElements(this.selector);
        addClass("savedPreview", elements);
    },
    unpreview: function(event){
        clearClass("savedPreview");
    },
    remove: function(event){
        event.preventDefault();
        this.remove();
        saveSchema();
    },
    newRule: function(event){
        event.preventDefault();
        Collect.current.selector = this;

        setupRuleForm(this.selector);
        showTab(HTML.tabs.rule);
    },
    edit: function(event){
        event.preventDefault();
        UI.editing.selector = this;
        Family.fromSelector(this.selector);
        Family.match();

        HTML.selector.radio.parent.disabled = true;
        HTML.selector.radio.next.disabled = true;

        showTab(HTML.tabs.selector);
    }
};

Selector.prototype.deleteHTML = prototypeDeleteHTML;

Selector.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.rules ) {
        this.removeRule(key);
    }

    if ( this.parentSet ) {
        delete this.parentSet.selectors[this.selector];
    }
};

Selector.prototype.preview = function(dom){
    var value = "",
        element = dom.querySelector(this.selector);
    for ( var key in this.rules ) {
        value += this.rules[key].preview(element);
    }
    return value;
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
    this.parentSelector;
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

Rule.prototype.html = function(){
    var holder = noSelectElement("li"),
        nametag = noSelectElement("span"),
        capturetag = noSelectElement("span"),
        edit = noSelectElement("button"),
        deltog = noSelectElement("button");

    holder.classList.add("rule");
    nametag.textContent = this.name;
    capturetag.textContent = "(" + this.capture + ")";
    edit.classList.add("editRule");
    edit.textContent = "edit";
    deltog.innerHTML = "&times;";
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, capturetag, edit, deltog]);

    edit.addEventListener("click", this.events.edit.bind(this), false);
    deltog.addEventListener("click", this.events.remove.bind(this), false);
    
    this.htmlElements.holder = holder;
    this.htmlElements.nametag = nametag;
    this.htmlElements.capturetag = capturetag;
    this.htmlElements.edit = edit;
    this.htmlElements.deltog = deltog;

    return holder;
};

Rule.prototype.events = {
    edit: function(event){
        UI.editing.rule = this;

        // setup the form
        HTML.rule.name.value = this.name;
        HTML.rule.selector.textContent = this.parentSelector.selector;
        HTML.rule.capture.textContent = this.capture;
        if ( this.capture === "attr-href" ) {
            HTML.rule.follow.checked = this.follow;
            HTML.rule.follow.disabled = false;
            HTML.rule.followHolder.style.display = "block";
        } else {
            HTML.rule.follow.checked = false;
            HTML.rule.follow.disabled = true;
            HTML.rule.followHolder.style.display = "none";
        }

        setupRuleForm(this.parentSelector.selector);
        showTab(HTML.tabs.rule);
    },
    remove: function(event){
        clearClass("savedPreview");
        this.remove();
        saveSchema();
    }
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName = this.name,
        newName = object.name;
    if ( oldName !== newName ) {
        // update nametag if html has been generated
        if ( this.htmlElements.nametag ) {
            this.htmlElements.nametag.textContent = newName;
        }
        if ( this.parentSelector ) {
            this.parentSelector.rules[newName] = this;
            delete this.parentSelector.rules[oldName];
        }
    }
    var oldCapture = this.capture,
        newCapture = object.capture;
    if ( oldCapture !== newCapture && this.htmlElements.capturetag ) {
        this.htmlElements.capturetag.textContent = "(" + newCapture + ")";
    }

    var oldFollow = this.follow,
        newFollow = object.follow || false;
    if ( this.hasSchema() ) {
        var schema = this.getSchema();
        if ( oldFollow && !newFollow ) {
            // remove based on oldName in case that was also changed
            schema.removePage(oldName);
        } else if ( newFollow && !oldFollow ) {
            // create the follow page
            var page = new Page(newName);
            schema.addPage(page);
        } else if ( oldFollow && newFollow && oldName !== newName) {
            // update the name of the follow page
            schema.pages[oldName].updateName(newName);
        }
    }
    this.name = newName;
    this.capture = newCapture;
    this.follow = newFollow;
};

/***
delete rule's html
is rule.follow, remove the page associated with the rule
remove rule from parent selector
***/
Rule.prototype.remove = function(){
    this.deleteHTML();
    // remove associated page if rule.follow = true
    if ( this.follow && this.hasSchema() ) {
        this.getSchema().removePage(this.name);
    }

    if ( this.parentSelector ) {
        delete this.parentSelector.rules[this.name];
    }
};

// some convenience functions
Rule.prototype.hasSelector = function(){
    return this.parentSelector !== undefined;
};

Rule.prototype.hasSet = function(){
    return this.hasSelector() && this.parentSelector.parentSet !== undefined;
};

Rule.prototype.hasPage = function(){
    return this.hasSet() && this.parentSelector.parentSet.parentPage !== undefined;
};

Rule.prototype.hasSchema = function(){
    return this.hasPage() && this.parentSelector.parentSet.parentPage.parentSchema !== undefined;
};

Rule.prototype.getSchema = function(){
    if ( this.hasSchema() ) {
        return this.parentSelector.parentSet.parentPage.parentSchema;
    }
};

Rule.prototype.preview = function(element){
    
    var cap;
    if ( this.capture.indexOf("attr-") !== -1 ) {
        var attr = this.capture.slice(5);
        cap = element.getAttribute(attr);
    } else {
        cap = element.textContent;
    }
    return "<p class=\"noSelect\">" + this.name + ": " + cap + "</p>";
};

// shared delete function
function prototypeDeleteHTML(){
    var holder = this.htmlElements.holder,
        option = this.htmlElements.option;
    if ( option && option.parentElement ) {
        option.parentElement.removeChild(option);
    }
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
