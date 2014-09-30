// this exists in a separate file for ease of use
// but has dependencies on variables in collector.js and thus is not modular

/********************
        SITE
********************/
/*
name is the hostname of the site
schemas is an object containing the various schemas in the page
selects are select elements used to switch between different schemas, different pages, and
different sets
*/
function Site(name, schemas){
    this.name = name;
    this.schemas = {};

    // create Schemas
    if ( schemas ) {
        var schemaObj, schema;
        for ( var key in schemas ) {
            schemaObj = schemas[key];
            schema = new Schema(schemaObj.name, schemaObj.pages, schemaObj.urls);
            schema.parentSite = this;
            this.schemas[key] = schema;
        }
        
    } else {
        this.schemas["default"] = new Schema("default");
        this.schemas["default"].parentSite = this;
    }

    // relies on the fact that default schema/page/selector set needs to exist
    this.current = {
        schema: undefined,
        page: undefined,
        set: undefined
    };

    this.hasHTML = false;
    this.eles = {};
}

Site.prototype.html = function(){
    var holder = noSelectElement("div"),
        schemas = noSelectElement("div"),
        schemaSelect = noSelectElement("select"); 

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        schemas: schemas,
        select: schemaSelect
    };
    // automatically attach the schema select to the page since it will always be shown
    HTML.perm.schema.select.appendChild(schemaSelect);
    appendChildren(holder, [schemas]);

    // create html for all schemas, but only show the default one
    for ( var key in this.schemas ) {
        this.schemas[key].html();
        // only show the default schema when first generating html
        if ( key === "default") {
            this.schemas[key].eles.holder.classList.add("active");
        }
    }

    schemaSelect.addEventListener("change", this.events.loadSchema.bind(this), false);

    return holder;
};

Site.prototype.events = {
    loadSchema: function(event){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        this.loadSchema(name);    
        resetInterface();
    },
    createSchema: function(event){
        event.preventDefault();
        var name = prompt("Schema Name");
        // null when cancelling prompt
        if ( name === null ) {
            return;
        }
        // make sure name isn't empty string or string that can't be used in a filename
        else if ( name === "" || !this.legalSchemaName(name)) {
            alertMessage("\'" + name + "\' is not a valid schema name");
            return;
        }
        
        chrome.storage.local.get("sites", function(storage){
            var host = window.location.hostname,
                site = storage.sites[host],
                schema;

            if ( !uniqueSchemaName(name, site.schemas)){
                alertMessage("a schema named \"" + name + "\" already exists");
                return;
            }

            schema = newSchema(name);
            storage.sites[host].schemas[name] = schema;

            chrome.storage.local.set({'sites': storage.sites});
            loadSchemaObject(schema);
        });
    }
};

Site.prototype.addSchema = function(schema){
    this.schemas[schema.name] = schema;
    if ( this.hasHTML ) {
        schema.html();
        this.loadSchema(schema.name);
    }
    this.current.schema = schema;
};

Site.prototype.loadSchema = function(name){
    var schema = this.schemas[name],
        prevSchema = this.current.schema;
    // if schema doesn't exist or is the same as the current one, do nothing
    if ( !schema || (prevSchema && prevSchema.name === name) ) {
        return;
    }

    this.current.schema = schema;
    if ( this.hasHTML ) {
        // select the schema's option
        if ( schema.eles.option ) {
            schema.eles.option.selected = true;
        }
        // load in the select for the schema's pages
        HTML.perm.page.select.innerHTML = "";
        HTML.perm.page.select.appendChild(schema.eles.select);
        if ( schema.eles.holder ) {
            // only hide previous schema if it actually exists
            if ( prevSchema ) {
                prevSchema.eles.holder.classList.remove("active");
            }
            schema.eles.holder.classList.add("active");
        }
    }

    // load the default page
    schema.loadPage("default");
};

Site.prototype.uniqueSchemaName = function(name){
    for ( var key in this.schemas ) {
        if ( key === name ) {
            return false;
        }
    }
    return true;
}

/*
a schema's name will be the name of the file when it is uploaded, so make sure that any characters in the name will be legal to use
rejects if name contains characters not allowed in filename: <, >, :, ", \, /, |, ?, *
*/
Site.prototype.legalSchemaName = function(name){
    if ( name === null ) {
        return false;
    }
    var badCharacters = /[<>:"\/\\\|\?\*]/,
        match = name.match(badCharacters);
    return ( match === null );
}

/********************
        SCHEMA
********************/
function Schema(name, pages, urls){
    this.name = name;
    this.urls = urls || {};
    this.pages = {};
    // create Pages
    if ( pages ) {
        var pageObj, page;
        for ( var key in pages ) {
            pageObj = pages[key];
            page = new Page(pageObj.name, pageObj.sets, pageObj.index, pageObj.next);
            page.parentSchema = this;
            this.pages[key] = page;
        }
    } else {
        this.pages["default"] = new Page("default");
        this.pages["default"].parentSchema = this;
    }

    this.hasHTML = false;
    this.eles = {};
    this.parentSite;
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
        rename = noSelectElement("button"),
        pages = noSelectElement("ul"),
        option = noSelectElement("option"),
        select = noSelectElement("select");


    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        pages: pages,
        option: option,
        select: select
    };

    // schema tab
    holder.classList.add("schema");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Schema");
    rename.textContent = "rename";
    rename.addEventListener("click", this.events.rename.bind(this), false);
    appendChildren(holder, [nametag, rename, pages]);

    for ( var key in this.pages ) {
        this.pages[key].html();
    }

    // Schema option and Page select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    select.addEventListener("change", this.events.loadPage.bind(this), false);

    // automatically append to parent site's schema holder and schema select
    if ( this.parentSite && this.parentSite.hasHTML ) {
        this.parentSite.eles.schemas.appendChild(holder);
        this.parentSite.eles.select.appendChild(option);
    }
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

Schema.prototype.events = {
    rename: function(event){
        // do nothing for now
        event.preventDefault();
    },
    loadPage: function(evenT){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        resetInterface();
        this.loadPage(name);
    }
};

Schema.prototype.loadPage = function(name){
    var page = this.pages[name],
        prevPage = this.parentSite.current.page;
    // if page doesn't exist or is the same as the current one, do nothing
    if ( !page || (prevPage && prevPage.name === name) ) {
        return;
    }

    this.parentSite.current.page = page;
    if ( this.hasHTML ) {
        // select the option for the page
        if ( page.eles.option ) {
            page.eles.option.selected = true;
        }
        // show the select for the page's selector set
        HTML.perm.set.select.innerHTML = "";
        HTML.perm.set.select.appendChild(page.eles.select);
    }
    page.loadSet("default");
};

Schema.prototype.rename = function(newName){
    var oldName = this.name;
    // always need a default group, so if renaming default, create a new default as well
    if ( oldName === "default" ) {
        var def = new Schema("default");
    }


    this.name = newName;
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newName;
    }

    // will need to change select option once that is tied to the Schema object
};

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
    if ( this.eles.pages) {
        page.html();
    }
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
function Page(name, sets, index, next){
    this.name = name,
    this.index = index || false;
    this.next = next;
    this.sets = {};
    if ( sets ) {
        var setObject, set;
        for ( var key in sets ) {
            setObject = sets[key];
            set = new SelectorSet(setObject.name, setObject.selectors, setObject.parent);
            set.parentPage = this;
            this.sets[key] = set;
        }
    } else {
        this.sets["default"] = new SelectorSet("default");
        this.sets["default"].parentPage = this;
    }
    this.hasHTML = false;
    this.eles = {};
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
        clear = noSelectElement("button"),
        sets = noSelectElement("ul"),
        option = noSelectElement("option"),
        setSelect = noSelectElement("select");

    this.hasHTML = true;
    // elements that need to be interacted with
    this.eles = {
        holder: holder,
        nametag: nametag,
        option: option,
        sets: sets,
        select: setSelect
    };

    // Schema tab html
    holder.classList.add("page");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Page");
    addSet.textContent = "add set";
    addSet.addEventListener("click", this.events.addSet.bind(this), false);
    clear.textContent = "clear";
    clear.addEventListener("click", this.events.clear.bind(this), false);
    appendChildren(holder, [nametag, addSet, sets]);

    for ( var key in this.sets ) {
        this.sets[key].html();
    }

    // Page option, SelectorSet select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    setSelect.addEventListener("change", this.events.loadSet.bind(this), false);

    // automatically append to parent schema's html elements
    if ( this.parentSchema && this.parentSchema.hasHTML ) {
        this.parentSchema.eles.pages.appendChild(holder);
        this.parentSchema.eles.select.appendChild(option);
    }
};

Page.prototype.events = {
    addSet: function(event){
        event.preventDefault();
        createSelectorSet(this);
    },
    clear: function(event){
        var confirmed = confirm("Clear out all selector sets, selectors, and rules from the page?");
        if ( !confirmed ) {
            return;
        }
        this.reset();
        var site = this.getSite();
        if ( site ) {
            site.save();
        }
        resetInterface();
    },
    loadSet: function(event){
        var option = this.eles.select.querySelector('option:checked'),
            name = option.value;
        resetInterface();
        this.loadSet(name);
    }
};

Page.prototype.deleteHTML = prototypeDeleteHTML;

// return the Site object if it exists, otherwise undefined
Page.prototype.getSite = function(){
    if ( this.parentSchema && this.parentSchema.parentSite ) {
        return this.parentSchema.parentSite;
    }
}

Page.prototype.addSet = function(selectorSet){
    var name = selectorSet.name;
    // if a set with the same name already exists, overwrite it
    if ( this.sets[name]) {
        this.removeSet(name);
    }

    this.sets[name] = selectorSet;
    selectorSet.parentPage = this;
    // if html for page exists, also create html for SelectorSet
    if ( this.eles.holder ) {
        selectorSet.html();
    }
};

Page.prototype.loadSet = function(name){
    var set = this.sets[name],
        prevSet = this.parentSchema.parentSite.current.set;
    // if set doesn't exist or is the same as the current one, do nothing
    if ( !set || (prevSet && prevSet.name === name) ) {
        return;
    }

    this.parentSchema.parentSite.current.set = set;
    if ( this.hasHTML ) {
        // select the option for the page
        if ( set.eles.option ) {
            set.eles.option.selected = true;
        }
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

    if ( this.eles.option ) {
        this.eles.option.setAttribute("value", this.name);
        this.eles.option.textContent = this.name;
    }
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = this.name;
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
function SelectorSet(name, selectors, parent){
    this.name = name;
    this.parent = parent;
    this.selectors = {};
    var selectorObj, selector;
    for ( var key in selectors ) {
        selectorObj = selectors[key];
        selector = new Selector(selectorObj.selector, selectorObj.rules);
        selector.parentSet = this;
        this.selectors[key] = selector;
    }
    this.hasHTML = false;
    this.eles = {};
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
        selectors = noSelectElement("selectors"),
        option = noSelectElement("option");

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        selectors: selectors,
        option: option
    };

    // Schema tab html        
    holder.classList.add("set");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Selector Set");
    //addSelector.textContent = "add selector";
    //addSelector.addEventListener("click", this.events.addSelector.bind(this), false);
    //appendChildren(holder, [nametag, addSelector, ul]);
    appendChildren(holder, [nametag, selectors]);

    for ( var key in this.selectors ) {
        this.selectors[key].html();
    }

    // SelectorSet option
    option.textContent = this.name;
    option.setAttribute("value", this.name);

    if ( this.parentPage && this.parentPage.hasHTML ) {
        this.parentPage.eles.sets.appendChild(holder);
        this.parentPage.eles.select.appendChild(option);
    }
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

SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
};

SelectorSet.prototype.addSelector = function(selector){
    this.selectors[selector.selector] = selector;
    selector.parentSet = this;
    if ( this.hasHTML ) {
        selector.html();
    }
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
    this.rules = {};
    var ruleObj, rule;
    for ( var key in rules ) {
        ruleObj = rules[key];
        rule = new Rule(ruleObj.name, ruleObj.capture, ruleObj.follow);
        rule.parentSelector = this;
        this.rules[key] = rule;
    }
    this.hasHTML = false;
    this.eles = {};
    this.parentSet;
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
        if ( !this.parentSet.parentPage.parentSchema.uniquePageName(rule.name) ) {
            var page = new Page(rule.name);
            this.parentSet.parentPage.parentSchema.addPage(page);
        }
    }

    // if Selector html exists, also create html for rule
    if ( this.hasHTML ) {
        rule.html();
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
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newSelector;
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

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        rules: rules
    };

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

    if ( this.parentSet && this.parentSet.hasHTML ) {
        this.parentSet.eles.selectors.appendChild(holder);
    }
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
    this.hasHTML = false;
    this.eles = {};
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

    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        capturetag: capturetag
    };

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
    
    // automatically append to parent selector's rule holder
    if ( this.parentSelector && this.parentSelector.hasHTML ) {
        this.parentSelector.eles.pages.appendChild(holder);
    }
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
        if ( this.eles.nametag ) {
            this.eles.nametag.textContent = newName;
        }
        if ( this.parentSelector ) {
            this.parentSelector.rules[newName] = this;
            delete this.parentSelector.rules[oldName];
        }
    }
    var oldCapture = this.capture,
        newCapture = object.capture;
    if ( oldCapture !== newCapture && this.eles.capturetag ) {
        this.eles.capturetag.textContent = "(" + newCapture + ")";
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
    var holder = this.eles.holder,
        option = this.eles.option;
    if ( option && option.parentElement ) {
        option.parentElement.removeChild(option);
    }
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
