// this exists in a separate file for ease of use
// but has dependencies on variables in collector.js and thus is not modular

/* requires parent.js, fetch.js, and utility.js */

var CurrentSite;

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
    this.name       = name;
    this.schemas    = {};
    // relies on the fact that default schema/page/selector set needs to exist
    this.current    = {
        schema:     undefined,
        page:       undefined,
        set:        undefined,
        selector:   undefined
    };
    this.hasHTML    = false;
    this.eles       = {};

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

}

Site.prototype.html = function(){
    /*
    <div> // topbar
        Schema: <select>...</select>
            <button>+Schema</button>
            <button>×</button>
            <button>Upload</button>
        Page: <select>...</select>
        Selector Set: <select>...</select>
        <button>Upload</button>
    </div>
    <div>...</div> // schemas
    */

    var topbar          = noSelectElement("div");
    var schemaText      = document.createTextNode("Schema: ");
    var schemaSelect    = noSelectElement("select");
    var createSchema    = noSelectElement("button");
    var removeSchema    = noSelectElement("button");
    var upload          = noSelectElement("button");
    var pageText        = document.createTextNode("Page: ");
    var pageSelect      = noSelectElement("div");
    var selectorText    = document.createTextNode("Selector Set: ");
    var setSelect       = noSelectElement("div");

    var schemas         = noSelectElement("div");

    this.hasHTML    = true;
    this.eles       = {
        schemas:    schemas,
        select:     schemaSelect,
        bar: {
            schema: schemaSelect,
            page: pageSelect,
            set: setSelect
        }
    };

    createSchema.textContent = "+Schema";
    createSchema.setAttribute("title", "create a new schema");
    createSchema.addEventListener("click", this.events.createSchemaEvent.bind(this), false);

    removeSchema.innerHTML = "&times;";
    removeSchema.setAttribute("title", "delete current schema");
    removeSchema.addEventListener("click", this.events.removeSchemaEvent.bind(this), false);

    upload.textContent = "Upload";
    upload.addEventListener("click", this.events.uploadEvent.bind(this), false);

    appendChildren(topbar, [schemaText, schemaSelect, createSchema, removeSchema,
        pageText, pageSelect, selectorText, setSelect, upload]);

    // create html for all schemas, but only show the default one
    for ( var key in this.schemas ) {
        this.schemas[key].html();
        // only show the default schema when first generating html
        if ( key === "default") {
            this.schemas[key].eles.holder.classList.add("active");
        }
    }

    schemaSelect.addEventListener("change", this.events.loadSchemaEvent.bind(this), false);

    return {
        schema: schemas,
        topbar: topbar
    };
};

Site.prototype.events = {
    loadSchemaEvent: function(event){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        this.loadSchema(name);    
        resetInterface();
    },
    createSchemaEvent: function(event){
        event.preventDefault();
        var name = prompt("Schema Name");
        var schema;
        // null when cancelling prompt
        if ( name === null ) {
            return;
        }
        // make sure name isn't empty string or string that can't be used in a filename
        else if ( name === "" || !legalSchemaName(name)) {
            error.alertMessage("\'" + name + "\' is not a valid schema name");
            return;
        }
        else if ( !this.uniqueSchemaName(name)){
            error.alertMessage("a schema named \"" + name + "\" already exists");
            return;
        }
        
        schema = new Schema(name);
        this.addSchema(schema);
        this.save(name);
    },
    removeSchemaEvent: function(event){
        event.preventDefault();
        var schema = this.current.schema;
        this.removeSchema(schema.name);
    },
    uploadEvent: function(event){
        event.preventDefault();
        this.upload();
    }
};

/*
if name is provided, only save that schema, otherwise save all
*/
Site.prototype.save = function(schemaName){
    var obj = schemaName ? this.schemas[schemaName].object() : this.object();
    chromeSave(obj, this.name, schemaName);
    resetInterface();
};

Site.prototype.upload = function(){
    chromeUpload({
        schema: this.current.schema.uploadObject(),
        site: this.name
    });
};

Site.prototype.object = function(){
    var data = {
        site: this.name,
        schemas: {}
    };
    for ( var key in this.schemas ) {
        data.schemas[key] = this.schemas[key].object();
    }
    return data;
};

Site.prototype.saveCurrent = function(){
    this.save(this.current.schema.name);
};

Site.prototype.addSchema = function(schema){
    schema.parentSite = this;
    this.schemas[schema.name] = schema;
    if ( this.hasHTML ) {
        schema.html();
        this.loadSchema(schema.name);
    }
    this.current.schema = schema;
};

/*
set schema to site.current.schema
hide currently active schema's html and show new current schema's html
*/
Site.prototype.loadSchema = function(name){
    // reset before loading schmea
    if ( CurrentSite.current.schema ) {
        CurrentSite.current.schema.eles.holder.classList.remove("active");
    }
    CurrentSite.current = {
        schema:     undefined,
        page:       undefined,
        set:        undefined,
        selector:   undefined
    };
    var schema = this.schemas[name],
        prevSchema = this.current.schema;
    // if schema doesn't exist, do nothing
    if ( !schema ) {
        return;
    }

    this.current.schema = schema;
    if ( this.hasHTML ) {
        // select the schema's option
        if ( schema.eles.option ) {
            schema.eles.option.selected = true;
        }
        // load in the select for the schema's pages
        this.eles.bar.page.innerHTML = "";
        this.eles.bar.page.appendChild(schema.eles.select);
        if ( schema.eles.holder ) {
            schema.eles.holder.classList.add("active");
        }
    }

    // load the default page for the schema
    schema.loadPage("default");
};

Site.prototype.removeSchema = function(name){
    var defaultSchema = (name === "default"),
        confirmed;
    if ( defaultSchema ) {
        confirmed = confirm("Cannot delete \"default\" schema. Do you want to clear out all of its pages instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this schema and all of its related pages?");    
    }
    if ( !confirmed ) {
        return;
    }

    if ( defaultSchema ) {
        this.schemas["default"].reset();
    } else {
        this.loadSchema("default");
        this.schemas[name].remove();
    }
    this.save();
};

Site.prototype.removeCurrentSchema = function(){
    this.removeSchema(this.current.schema.name);
};

Site.prototype.uniqueSchemaName = function(name){
    for ( var key in this.schemas ) {
        if ( key === name ) {
            return false;
        }
    }
    return true;
};

/********************
        SCHEMA
********************/
function Schema(name, pages, urls){
    this.name           = name;
    this.urls           = urls || {};
    this.pages          = {};
    this.hasHTML        = false;
    this.eles           = {};
    this.parentSite;    
    var pageObj;
    var page;
    // create Pages
    if ( pages ) {
        for ( var key in pages ) {
            pageObj = pages[key];
            page = new Page(pageObj.name, pageObj.sets, pageObj.next);
            page.parentSchema = this;
            this.pages[key] = page;
        }
    } else {
        this.pages["default"] = new Page("default");
        this.pages["default"].parentSchema = this;
    }

}

Schema.prototype.object = function(){
    var data = {
        name:   this.name,
        urls:   this.urls,
        pages:  {}
    };
    var pageObject; 

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
    var data        = {
        name: this.name,
        urls: Object.keys(this.urls)
    };
    var pages       = {};
    var followSets  = {};
    var currPage;
    var pageName;
    var setName;
    var pageObject;
    var set;
    var followPages;

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
    var holder          = noSelectElement("div");
    var nametag         = noSelectElement("span");
    //var rename          = noSelectElement("button"),
    var pages           = noSelectElement("ul");
    var option          = noSelectElement("option");
    var select          = noSelectElement("select");
    var indexHolder     = noSelectElement("div");
    var indexText       = document.createTextNode("Initial URL: ");
    var indexCheckbox   = noSelectElement("input");


    this.hasHTML = true;
    this.eles = {
        holder: holder,
        nametag: nametag,
        pages: pages,
        option: option,
        select: select,
        index: {
            holder: indexHolder,
            checkbox: indexCheckbox
        }
    };

    // schema tab
    holder.classList.add("schema");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Schema");
    nametag.classList.add("nametag");
    //rename.textContent = "rename";
    //rename.addEventListener("click", this.events.renameEvent.bind(this), false);
    //appendChildren(holder, [nametag, rename, pages]);

    var url = window.location.href;
    indexCheckbox.setAttribute("type", "checkbox");
    indexCheckbox.addEventListener("change", this.events.toggleURLEvent.bind(this), false);
    if ( this.urls[url] ) {
        indexCheckbox.checked = true;
    }

    appendChildren(indexHolder, [indexText, indexCheckbox]);
    appendChildren(holder, [nametag, indexHolder, pages]);

    for ( var key in this.pages ) {
        this.pages[key].html();
    }

    // Schema option and Page select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    select.addEventListener("change", this.events.loadPageEvent.bind(this), false);

    // automatically append to parent site's schema holder and schema select
    if ( this.parentSite && this.parentSite.hasHTML ) {
        this.parentSite.eles.schemas.appendChild(holder);
        this.parentSite.eles.select.appendChild(option);
    }
};

Schema.prototype.deleteHTML = prototypeDeleteHTML;

Schema.prototype.events = {
    renameEvent: function(event){
        // do nothing for now
        event.preventDefault();
    },
    loadPageEvent: function(evenT){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        resetInterface();
        this.loadPage(name);
    },
    toggleURLEvent: function(event){
        var on              = this.toggleURL(window.location.href);
        var defaultPage     = this.pages["default"];
        
        if ( !on && defaultPage.next ) {
            defaultPage.removeNext();
        }
        CurrentSite.saveCurrent();
    }
};

Schema.prototype.remove = function(){
    this.deleteHTML();
    for ( var key in this.pages ) {
        this.removePage(key);
    }

    if ( this.parentSite ) {
        delete this.parentSite.schemas[this.name];
    }
};

// remove all pages, then create default page
Schema.prototype.reset = function(){
    for ( var key in this.pages ) {
        this.removePage(key);
    }
    // reset current values
    if ( this.parentSite ) {
        this.parentSite.current.schema = this;
        this.parentSite.current.page = undefined;
        this.parentSite.current.set = undefined;
    }
    var page = new Page("default");
    this.addPage(page);
    this.loadPage(page.name);
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

Schema.prototype.loadPage = function(name){
    var page        = this.pages[name];
    var prevPage    = this.parentSite.current.page;
    // if page doesn't exist or is the same as the current one, do nothing
    if ( !page || page === prevPage ) {
        return;
    }
    if ( this.hasHTML ) {
        // select the option for the page
        if ( page.eles.option ) {
            page.eles.option.selected = true;
        }
        // show the select for the page's selector set
        var site = this.parentSite;
        site.eles.bar.set.innerHTML = "";
        site.eles.bar.set.appendChild(page.eles.select);
    }
    CurrentSite.current.page = page;
    page.loadSet("default");
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
    var page;
    var pageName;
    var setName;
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
    var page;
    var selectorSet;
    var selector;
    var pageName;
    var setName;
    var selectorName;
    var ruleName;
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
function Page(name, sets, next){
    this.name       = name,
    this.next       = next;
    this.sets       = {};
    this.hasHTML    = false;
    this.eles       = {};
    // added when a schema calls addPage
    this.parentSchema;

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
}

Page.prototype.object = function(){
    var data = {
        name: this.name,
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
sets: dict containing non-empty (ie, has 1+ rules) selector sets
next: string for next selector
***/
Page.prototype.uploadObject = function(){
    var data = {
        name: this.name,
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
    var holder          = noSelectElement("li");
    var nametag         = noSelectElement("span");
    var createSet       = noSelectElement("button");
    var resetPage       = noSelectElement("button");
    var sets            = noSelectElement("ul");
    var option          = noSelectElement("option");
    var setSelect       = noSelectElement("select");
    var nextHolder      = noSelectElement("div");
    var nextText        = document.createTextNode("Next: ");
    var nextSelector    = noSelectElement("span");
    var nextAdd         = noSelectElement("button");
    var nextRemove      = noSelectElement("button");
    this.hasHTML        = true;
    // elements that need to be interacted with
    this.eles           = {
        holder:     holder,
        nametag:    nametag,
        option:     option,
        sets:       sets,
        select:     setSelect,
        next: {
            holder:     nextHolder,
            selector:   nextSelector,
            add:        nextAdd,
            remove:     nextRemove
        }
    };

    // Schema tab html
    holder.classList.add("page");
    nametag.textContent = this.name;
    nametag.setAttribute("title", "Page");
    nametag.classList.add("nametag");
    createSet.textContent = "+Set";
    createSet.classList.add("pos");
    createSet.addEventListener("click", this.events.createSetEvent.bind(this), false);

    resetPage.innerHTML = "&times;";
    resetPage.addEventListener("click", this.events.resetEvent.bind(this), false);

    // Next
    nextAdd.textContent = "+Next";
    nextAdd.addEventListener("click", this.events.addNextEvent.bind(this), false);
    nextRemove.innerHTML = "&times;";
    nextRemove.addEventListener("click", this.events.removeNextEvent.bind(this), false);
    nextHolder.classList.add("next");
    if ( this.next ) {
        nextSelector.textContent = this.next;
        nextAdd.classList.add("hidden");
    } else {
        nextSelector.textContent = "";
        nextRemove.classList.add("hidden");
    }

    appendChildren(nextHolder, [nextText, nextSelector, nextAdd, nextRemove]);
    appendChildren(holder, [nametag, createSet, resetPage, nextHolder, sets]);

    for ( var key in this.sets ) {
        this.sets[key].html();
    }


    // Page option, SelectorSet select
    option.textContent = this.name;
    option.setAttribute("value", this.name);
    setSelect.addEventListener("change", this.events.loadSetEvent.bind(this), false);

    // automatically append to parent schema's html elements
    if ( this.parentSchema && this.parentSchema.hasHTML ) {
        this.parentSchema.eles.pages.appendChild(holder);
        this.parentSchema.eles.select.appendChild(option);
    }
};

Page.prototype.events = {
    createSetEvent: function(event){
        event.preventDefault();
        var name = prompt("Selector Set Name");
        var set;
        if ( name === null ) {
            return;
        }
        else if ( name === "" ) {
            error.alertMessage("selector set name cannot be blank");
            return;
        }
        
        if ( !this.parentSchema.uniqueSelectorSetName(name) ) {
            error.alertMessage("a selector set named \"" + name + "\" already exists");
            return;
        }
        set = new SelectorSet(name);
        this.addSet(set);
        CurrentSite.saveCurrent();
    },
    resetEvent: function(event){
        var confirmed = confirm("Clear out all selector sets, selectors, and rules from the page?");
        if ( !confirmed ) {
            return;
        }
        this.reset();
        CurrentSite.saveCurrent();
    },
    loadSetEvent: function(event){
        var option  = this.eles.select.querySelector('option:checked');
        var name    = option.value;
        resetInterface();
        this.loadSet(name);
    },
    addNextEvent: function(event){
        event.preventDefault();
        SelectorView.show("next");
    },
    removeNextEvent: function(event){
        event.preventDefault();
        this.removeNext();
    }
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
    if ( this.eles.holder ) {
        selectorSet.html();
    }
    // automatically load the set
    this.loadSet(name);
};

Page.prototype.loadSet = function(name){
    var set         = this.sets[name];
    var prevSet     = CurrentSite.current.set;
    // if set doesn't exist or is the same as the current one, do nothing
    // need to make sure the page's name is also different since pages can have the same selector
    // set names. Might be a bug look into this
    // !!!!!!!!!!!!!!
    if ( !set || prevSet === set ) {
        return;
    }
    CurrentSite.current.set = set;

    // show the selector set's parent if it exists
    // clear out the previous set's parentSchema
    clearClass("parentSchema");
    if ( set.parent ) {
        Parent.set(set.parent);
    } else {
        Parent.remove();
    }

    if ( this.hasHTML ) {
        // select the option for the page
        if ( set.eles.option ) {
            set.eles.option.selected = true;
        }
        if ( prevSet ) {
            prevSet.eles.holder.classList.remove("active");
        }
        set.eles.holder.classList.add("active");
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
    if ( this.next ) {
        this.removeNext();
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
    if ( this.parentSchema ) {
        delete this.parentSchema.pages[this.name];
    }
};

Page.prototype.addNext = function(selector){
    this.next = selector;
    if ( this.hasHTML ) {
        this.eles.next.add.classList.add("hidden");
        this.eles.next.remove.classList.remove("hidden");
        this.eles.next.selector.textContent = selector;
    }
};

Page.prototype.removeNext = function(){
    this.next = undefined;
    if ( this.hasHTML ) {
        this.eles.next.add.classList.remove("hidden");
        this.eles.next.remove.classList.add("hidden");
        this.eles.next.selector.textContent = "";
    }
};

/***
iterate over sets in the page, returning an object mapping selector set's name to a list of pages that
follow it
***/
Page.prototype.followedSets = function(){
    var following = {};
    var set;
    var followed;
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
    var oldName     = this.name;
    this.name       = name;
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
    this.name           = name;
    this.parent         = parent;
    this.selectors      = {};
    this.hasHTML        = false;
    this.eles           = {};
    this.parentPage;
    var selectorObj;
    var selector;
    for ( var key in selectors ) {
        selectorObj = selectors[key];
        selector = new Selector(selectorObj.selector, selectorObj.rules);
        selector.parentSet = this;
        this.selectors[key] = selector;
    }
}

SelectorSet.prototype.object = function(){
    var data = {
        name:       this.name,
        selectors:  {}
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
    var holder          = noSelectElement("li");
    var nametag         = noSelectElement("span");
    var remove          = noSelectElement("button");
    var addSelector     = noSelectElement("button");
    var parentHolder    = noSelectElement("div");
    var parentText      = document.createTextNode("Parent: ");
    var parentSelector  = noSelectElement("span");
    var parentRange     = noSelectElement("span");
    var addParent       = noSelectElement("button");
    var editParent      = noSelectElement("button");
    var removeParent    = noSelectElement("button");
    var selectors       = noSelectElement("ul");
    var option          = noSelectElement("option");

    this.hasHTML = true;
    this.eles = {
        holder:     holder,
        nametag:    nametag,
        selectors:  selectors,
        option:     option,
        parent: {
            holder:     parentHolder,
            selector:   parentSelector,
            range:      parentRange,
            add:        addParent,
            edit:       editParent,
            remove:     removeParent
        }
    };

    // Schema tab html        
    holder.classList.add("set");
    holder.addEventListener("click", this.events.activateEvent.bind(this), false);
    nametag.textContent = this.name;
    nametag.classList.add("nametag");
    nametag.setAttribute("title", "Selector Set");
    addSelector.textContent = "+Selector";
    addSelector.classList.add("pos");
    addSelector.addEventListener("click", this.events.addSelectorEvent.bind(this), false);
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    remove.addEventListener("click", this.events.removeEvent.bind(this), false);


    // Selector Set Parent
    parentHolder.classList.add("parent");
    if ( this.parent ) {
        parentSelector.textContent = this.parent.selector;
        parentRange.textContent = createRangeString(this.parent.low, this.parent.high);
        addParent.classList.add("hidden");
    } else {
        editParent.classList.add("hidden");
        removeParent.classList.add("hidden");
    }
    addParent.textContent = "+Parent";
    addParent.classList.add("pos");
    addParent.addEventListener("click", this.events.addParentEvent.bind(this), false);
    editParent.textContent = "edit";
    editParent.classList.add("pos");
    editParent.addEventListener("click", this.events.editParentEvent.bind(this), false);
    removeParent.innerHTML = "&times;";
    removeParent.classList.add("neg");
    removeParent.addEventListener("click", this.events.removeParentEvent.bind(this), false);

    appendChildren(parentHolder, [parentText, parentSelector, parentRange,
        addParent, editParent, removeParent]);
    appendChildren(holder, [nametag, addSelector, remove, parentHolder, selectors]);

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

// don't use this quite yet
SelectorSet.prototype.events = {
    activateEvent: function(event){
        this.activate();
        this.eles.holder.scrollIntoViewIfNeeded();
    },
    addSelectorEvent: function(event){
        event.preventDefault();
        // make sure current.page is the selector set's parent page
        this.activate();
        SelectorView.show("selector");
    },
    removeEvent: function(event){
        event.preventDefault();
        var defaultSet = (this.name === "default"),
            question = defaultSet ?
                "Cannot delete \"default\" selector set. Do you want to reset it instead?" :
                "Are you sure you want to delete this selector set and all of its related selectors and rules?";
        if ( !confirm(question) ) {
            return;
        }

        var site = this.parentPage.parentSchema.parentSite;
        // handle setting new current SelectorSet
        if ( defaultSet ) {
            this.reset();
        } else {
            // load the default set, then delete this
            this.parentPage.loadSet("default");
            this.remove();
        }
        site.saveCurrent();
    },
    addParentEvent: function(event){
        event.preventDefault();
        SelectorView.show("parent");
    },
    editParentEvent: function(event){
        event.preventDefault();
        editParent(this);
    },
    removeParentEvent: function(event){
        event.preventDefault();
        this.removeParent();
        CurrentSite.saveCurrent();
        Parent.remove();
    }
};


SelectorSet.prototype.deleteHTML = prototypeDeleteHTML;

// make the selector set the current one
SelectorSet.prototype.activate = function(){
    var page = this.parentPage;
    if ( page !== CurrentSite.current.page ) {
        CurrentSite.current.schema.loadPage(page.name);
    }
    if ( this !== CurrentSite.current.set ) {
        CurrentSite.current.page.loadSet(this.name);
    }
};

SelectorSet.prototype.addParent = function(parent){
    this.parent = parent;
    if ( this.hasHTML ) {
        this.eles.parent.add.classList.add("hidden");
        this.eles.parent.edit.classList.remove("hidden");
        this.eles.parent.remove.classList.remove("hidden");
        this.eles.parent.selector.textContent = parent.selector;
        this.eles.parent.range.textContent = createRangeString(parent.low, parent.high);
    }
};

SelectorSet.prototype.removeParent = function(){
    this.parent = undefined;
    if ( this.hasHTML ) {
        this.eles.parent.add.classList.remove("hidden");
        this.eles.parent.edit.classList.add("hidden");
        this.eles.parent.remove.classList.add("hidden");
        this.eles.parent.selector.textContent = "";
        this.eles.parent.range.textContent = "";
    }
};

SelectorSet.prototype.addSelector = function(selector){
    // don't override an existing selector
    if ( this.selectors[selector.selector]) {
        return;
    }

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

SelectorSet.prototype.reset = function(){
    for ( var key in this.selectors ) {
        this.removeSelector(key);
    }
    if ( this.parent ) {
        this.removeParent();
        clearClass("parentSchema");
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
    this.selector   = selector;
    this.rules      = {};
    this.hasHTML    = false;
    this.eles       = {};
    this.parentSet;
    var ruleObj;
    var rule;
    for ( var key in rules ) {
        ruleObj = rules[key];
        rule = new Rule(ruleObj.name, ruleObj.capture, ruleObj.follow);
        rule.parentSelector = this;
        this.rules[key] = rule;
    }
}

Selector.prototype.object = function(){
    var data = {
        selector:   this.selector,
        rules:      {}
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
    // only add page if it doesn't already exist
    if ( rule.follow ) {
        var schema = this.getSchema();
        if ( schema ) {
            var page = new Page(rule.name);
            schema.addPage(page);
        }
    }

    // if Selector html exists, also create html for rule
    if ( this.hasHTML ) {
        rule.html();
    }
};

// uggggggggly
Selector.prototype.getSchema = function(){
    if ( this.parentSet && this.parentSet.parentPage && this.parentSet.parentPage.parentSchema ) {
        return this.parentSet.parentPage.parentSchema;
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
    var oldSelector     = this.selector;
    this.selector       = newSelector;
    if ( this.eles.nametag ) {
        this.eles.nametag.textContent = newSelector;
    }

    if ( this.parentSet ) {
        this.parentSet.selectors[newSelector] = this;
        delete this.parentSet.selectors[oldSelector];
    }
};

Selector.prototype.html = function(){
    var holder          = noSelectElement("li");
    var identifier      = document.createTextNode("Selector: ");
    var nametag         = noSelectElement("span");
    var editSelector    = noSelectElement("button");
    var newRule         = noSelectElement("button");
    var remove          = noSelectElement("button");
    var rules           = noSelectElement("ul");

    this.hasHTML = true;
    this.eles = {
        holder:     holder,
        nametag:    nametag,
        rules:      rules
    };

    holder.classList.add("selector");
    nametag.textContent = this.selector;
    nametag.classList.add("nametag");
    newRule.textContent = "+Rule";
    newRule.classList.add("pos");
    editSelector.textContent = "edit";
    remove.innerHTML = "&times;";
    remove.classList.add("neg");
    holder.addEventListener("mouseenter", this.events.previewEvent.bind(this), false);
    holder.addEventListener("mouseleave", this.events.unpreviewEvent.bind(this), false);
    newRule.addEventListener("click", this.events.newRuleEvent.bind(this), false);
    editSelector.addEventListener("click", this.events.editEvent.bind(this), false);
    remove.addEventListener("click", this.events.removeEvent.bind(this), false);

    appendChildren(holder, [identifier, nametag, editSelector, newRule, remove, rules]);

    // iterate over rules and add them
    for ( var key in this.rules ) {
        this.rules[key].html();
    }

    if ( this.parentSet && this.parentSet.hasHTML ) {
        this.parentSet.eles.selectors.appendChild(holder);
    }
};

Selector.prototype.events = {
    previewEvent: function(event){
        var parent      = this.parentSet ? this.parentSet.parent : undefined;
        var elements    = Fetch.matchedElements(this.selector, parent);
        addClass("savedPreview", elements);
    },
    unpreviewEvent: function(event){
        clearClass("savedPreview");
    },
    removeEvent: function(event){
        event.preventDefault();
        this.remove();
        CurrentSite.saveCurrent();
    },
    newRuleEvent: function(event){
        event.preventDefault();
        CurrentSite.current.selector = this;
        RuleView.show(this.selector);
    },
    editEvent: function(event){
        event.preventDefault();
        editSelector(this);
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
    var value       = "";
    var element     = dom.querySelector(this.selector);
    if ( !element ) {
        return "";
    }
    for ( var key in this.rules ) {
        value += this.rules[key].preview(element);
    }
    return value;
};

/********************
        RULE
********************/
function Rule(name, capture, follow){
    this.name       = name;
    this.capture    = capture;
    this.follow     = follow || false;
    this.hasHTML    = false;
    this.eles       = {};
    // added when a SelectorSet calls addRule
    this.parentSelector;
}

Rule.prototype.object = function(){
    var data = {
        name:       this.name,
        capture:    this.capture
    };

    if ( this.follow ) {
        data.follow = this.follow;
    }

    return data;
};

Rule.prototype.html = function(){
    var holder      = noSelectElement("li");
    var nametag     = noSelectElement("span");
    var capturetag  = noSelectElement("span");
    var edit        = noSelectElement("button");
    var deltog      = noSelectElement("button");
    this.hasHTML    = true;
    this.eles       = {
        holder:         holder,
        nametag:        nametag,
        capturetag:     capturetag
    };

    holder.classList.add("rule");
    nametag.textContent = this.name;
    nametag.classList.add("nametag");
    capturetag.textContent = "(" + this.capture + ")";
    capturetag.classList.add("nametag");
    edit.classList.add("editRule");
    edit.textContent = "edit";
    deltog.innerHTML = "&times;";
    deltog.classList.add("neg");
    deltog.classList.add("deltog");

    appendChildren(holder, [nametag, capturetag, edit, deltog]);

    edit.addEventListener("click", this.events.editEvent.bind(this), false);
    deltog.addEventListener("click", this.events.removeEvent.bind(this), false);
    
    // automatically append to parent selector's rule holder
    if ( this.parentSelector && this.parentSelector.hasHTML ) {
        this.parentSelector.eles.rules.appendChild(holder);
    }
};

Rule.prototype.events = {
    editEvent: function(event){
        editRule(this);
    },
    removeEvent: function(event){
        clearClass("savedPreview");
        this.remove();
        CurrentSite.saveCurrent();
    }
};

Rule.prototype.deleteHTML = prototypeDeleteHTML;

Rule.prototype.update = function(object){
    var oldName     = this.name;
    var newName     = object.name;
    var oldCapture  = this.capture;
    var newCapture  = object.capture;
    var oldFollow   = this.follow;
    var newFollow   = object.follow || false;

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
    
    if ( oldCapture !== newCapture && this.eles.capturetag ) {
        this.eles.capturetag.textContent = "(" + newCapture + ")";
    }

    if ( oldFollow && !newFollow ) {
        // remove based on oldName in case that was also changed
        if ( CurrentSite.current.schema ) {
            CurrentSite.current.schema.removePage(oldName);
        }
    } else if ( newFollow && !oldFollow ) {
        // create the follow page
        var page = new Page(newName);
        CurrentSite.current.schema.addPage(page);
    } else if ( oldFollow && newFollow && oldName !== newName) {
        // update the name of the follow page
        CurrentSite.current.schema.pages[oldName].updateName(newName);
    }
    this.name       = newName;
    this.capture    = newCapture;
    this.follow     = newFollow;
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
    var holder  = this.eles.holder;
    var option  = this.eles.option;
    if ( option && option.parentElement ) {
        option.parentElement.removeChild(option);
    }
    if ( holder ) {
        holder.parentElement.removeChild(holder);
    }
}
