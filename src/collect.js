"use strict";

/*
Notes:
need to fix editing a rule once everything is up and running
Interface.parent refers to parent tab from previous iteration, will need to be replaced
*/

var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = {{src/collect.html}};
    document.body.appendChild(div);
    addNoSelect(div.querySelectorAll("*"));

    // some some margin at the bottom of the page
    var currentMargin = parseInt(document.body.style.marginBottom, 10);
    if ( isNaN(currentMargin) ) {
        marginBottom = 0;
    } else {
        marginBottom = currentMargin;
    }
    document.body.style.marginBottom = (marginBottom + 300) + "px";
})();

/*********************************
            GLOBALS
*********************************/
/*
Object that stores information related to elements that match the current selector
(and how to select them)
*/
var Collect = {
    not: ":not(.noSelect)",
    options: {},
    allElements: [],
    indexPage: false,
    current: {
        group: undefined,
        page: undefined,
        ruleSet: undefined
    }
};

/*
Object that controls the functionality of the interface
*/
var Interface = {
    parent: {}, // filler for the time being,
    tabs: {
        tab: document.querySelector(".tab.active"),
        view: document.querySelector(".view.active")
    },
    setup: function(){        
        loadOptions();
        setupHostname();
        this.events();
    },
    /*
    adds events listeners based on whether or not this.parentSelector is set
    if it is, only add them to children of that element, otherwise add them to all elements
    that don't have the noSelect class
    store elements with eventlisteners in this.ele
    */
    turnOn: function(){
        var prefix = this.parent.selector ? this.parent.selector : "body",
            curr;
        this.turnOff();
        Collect.allElements = document.querySelectorAll(prefix + " *" + Collect.not);
        for ( var i=0, len=Collect.allElements.length; i<len; i++ ) {
            curr = Collect.allElements[i];
            curr.addEventListener('click', Family.create, false);
            curr.addEventListener('mouseenter', highlightElement, false);
            curr.addEventListener('mouseleave', unhighlightElement, false);
        }
        clearClass("queryCheck");
        clearClass("collectHighlight");
    },
    /*
    removes event listeners from elements in this.ele
    */
    turnOff: function(){
        var curr;
        for ( var i=0, len=Collect.allElements.length; i<len; i++ ) {
            curr = Collect.allElements[i];
            curr.removeEventListener('click', Family.create);
            curr.removeEventListener('mouseenter', highlightElement);
            curr.removeEventListener('mouseleave', unhighlightElement);
            
        }
        Collect.allElements = [];
    },
    events: function(){
        // tabs
        tabEvents();

        //views
        createViewEvents();
        ruleViewEvents();
        optionsViewEvents();

        // preview
        idEvent("clearSelector", "click", removeSelectorEvent);

        /*
        idEvent("uploadRules", "click", function(event){
            uploadRules();
        });

        // groups
        idEvent("newGroup", "click", newGroupEvent);
        idEvent("deleteGroup", "click", deleteGroupEvent);
        */
        idEvent("groupSelect", "change", loadGroupEvent);
        idEvent("pageSelect", "change", loadPageEvent);
    }
};

// save commonly referenced to elements
var HTML = {
    alert: document.getElementById("ruleAlert"),
    count: document.getElementById("currentCount"),
    family: document.getElementById("selectorHolder"),
    form: {
        name: document.getElementById("ruleName"),
        capture: document.getElementById("ruleAttr"),
        selector: document.getElementById("ruleSelector"),
        multiple: document.getElementById("ruleMultiple"),
        range: document.getElementById("ruleRange"),
        rangeHolder: document.querySelector("#ruleItems .range"),
        follow: document.getElementById("ruleFollow"),
        followHolder: document.querySelector("#ruleItems .follow")
    },
    groups: {
        group: document.getElementById("groupSelect"),
        page: document.getElementById("pageSelect")
    },
    info: {
        group: document.getElementById("currGroup"),
        page: document.getElementById("currPage"),
        ruleSet: document.getElementById("currRuleSet")
    },
    preview: {
        name: document.getElementById("previewName"),
        selector: document.getElementById("previewSelector"),
        capture: document.getElementById("previewCapture"),
        contents: document.getElementById("previewContents"),
    },
    ruleGroups: {},
    ruleHTML: document.getElementById("ruleHTML"),
    ruleItems: document.getElementById("ruleItems"),
    saved: document.getElementById("savedRuleHolder"),
};

// Family derived from clicked element in the page
var Family = {
    family: undefined,
    create: function(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface(); 
        // preserve name when switching selector while editing
        if ( Interface.editing ) {
            HTML.form.name.value = Interface.editing;
        }
        
        var sf = new SelectorFamily(this,
            Interface.parent.selector,
            HTML.family,
            HTML.form.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
        HTML.ruleItems.style.display = "block";
    },
    remove: function(){
        if ( this.family ) {
            this.family.remove();
            this.family = undefined;
        }
    },
    // create a SelectorFamily given a css selector string
    fromSelector: function(selector){
        var longSelector = (Interface.parent.selector ? Interface.parent.selector: "body") +
            " " + selector + Collect.not;
        var element = document.querySelector(longSelector);
        if ( element ) {
            var sf = new SelectorFamily(element,
                Interface.parent.selector,
                HTML.family,
                HTML.form.selector,
                Family.test.bind(Family),
                Collect.options
            );
            this.family = sf;
            HTML.ruleItems.style.display = "block";
            this.family.match(selector);
        }    
    },
    selector: function(){
        if ( this.family ) {
            return this.family.toString();
        } else {
            return "";
        }
    },
    elements: function(one){
        var selector = this.selector(),
            longSelector;
        if ( selector === "") {
            return ( one ? undefined : []);
        }
        longSelector = (Interface.parent.selector ? Interface.parent.selector: "body") +
            " " + selector + Collect.not;
        if ( one ) {
            return document.querySelector(longSelector);
        } else {
            return document.querySelectorAll(longSelector);    
        }
    },
    /*
    sets Collect.elements to elements matching the current selector and resets elementIndex
    */
    match: function(){
        Collect.elements = this.elements();
        Collect.elementIndex = 0;
    },
    /*
    add queryCheck class to all elements matching selector
    set the count based on number of matching elements
    set the preview
    */
    test: function(){
        clearClass("queryCheck");
        clearClass("collectHighlight");
        var elements = this.elements(),
            count;
        for ( var i=0, len=elements.length; i<len; i++ ) {
            elements[i].classList.add("queryCheck");
        }
        count = elements.length ? elements.length : "";
        HTML.count.textContent = count;
        updateMatchedElements();
    },
    /*
    applies a range to the elements selected by the current selector
    if val is positive, it sets Collect.elements to (val, elements.length)
    if val is negative, it sets Collect.elements to (0, elements.length-val)

    */
    range: function(val){
        var range = parseInt(HTML.form.range.value, 10),
            len;

        Family.match();
        len = Collect.elements.length;
        if ( isNaN(range) || -1*range > len || range > len-1 ) {
            HTML.form.range.value = "";
        } else {
           if ( range < 0 ) {
                Collect.elements = Array.prototype.slice.call(Collect.elements).slice(0, range);
                Collect.elementIndex = 0;
                addSelectorTextHTML(Collect.elements[0]);
            } else if ( range > 0 ) {
                Collect.elements = Array.prototype.slice.call(Collect.elements).slice(range);
                Collect.elementIndex = 0;
                addSelectorTextHTML(Collect.elements[0]);
            }    
        }
    }
};

Interface.setup();


function resetInterface(){
    clearClass("queryCheck");
    
    Collect.current = {
        group: undefined,
        page: undefined,
        ruleSet: undefined
    };

    resetRulesView();
    resetPreviewView();
}

function resetRulesView(){
    Family.remove();
    
    // reset form
    HTML.form.name.value = "";
    HTML.form.capture.textContent = "";
    HTML.form.range.value = "";
    HTML.form.range.disabled = true;
    HTML.form.multiple.checked = false;
    HTML.form.follow.checked = false;
    HTML.form.follow.disabled = true;
    HTML.form.followHolder.style.display = "none";
    HTML.form.rangeHolder.style.display = "none";

    HTML.count.textContent = "";
    HTML.ruleHTML.innerHTML = "";
}

function resetPreviewView(){
    HTML.preview.name.textContent = "";
    HTML.preview.selector.textContent = "";
    HTML.preview.capture.textContent = "";
    HTML.preview.contents.innerHTML = "";
}

/******************
    EVENTS
******************/

// encapsulate event activeTabEvent to keep track of current tab/view
function tabEvents(){
    // querySelectorAll because getElementsByClassName could overlap with native elements
    var tabs = document.querySelectorAll(".tabHolder .tab");
    for ( var i=0, len=tabs.length; i<len; i++ ) {
        tabs[i].addEventListener("click", showTabEvent, false);
    }

    function showTabEvent(event){
        showTab(this);
    }

    idEvent("refreshCollect", "click", refreshElements);
    idEvent("closeCollect", "click", removeInterface);
}

function showTab(tab){
    var target = tab.dataset.for,
        view = document.getElementById(target);
    // fail if either data-for or related element is undefined
    if ( !target || !view || tab === Interface.tabs.tab) {
        return;
    }
    Interface.tabs.tab.classList.remove("active");
    Interface.tabs.view.classList.remove("active");

    Interface.tabs.tab = tab;
    Interface.tabs.view = view;
    Interface.tabs.tab.classList.add("active");
    Interface.tabs.view.classList.add("active");
}

function ruleViewEvents(){
    HTML.form.range.addEventListener("blur", applyRuleRange, false);
    HTML.form.multiple.addEventListener("change", function(event){
        HTML.form.range.disabled = !HTML.form.range.disabled;
        if ( HTML.form.disabled ) {
            HTML.form.rangeHolder.style.display = "none";
        } else {
            HTML.form.rangeHolder.style.display = "block";
        }
        
    });

    idEvent("saveRule", "click", saveRuleEvent);
    //idEvent("previewSelector", "click", previewSelectorEvent);
    idEvent("ruleCyclePrevious", "click", showPreviousElement);
    idEvent("ruleCycleNext", "click", showNextElement);
}

function createViewEvents(){
    idEvent("createGroup", "click", newGroupEvent);
    //idEvent("createPage", "click", undefined);
    idEvent("createSet", "click", undefined);
}

function optionsViewEvents(){
    idEvent("ignore", "change", toggleTabOption);
}

/*
add .collectHighlight to an element on mouseenter
*/
function highlightElement(event){
    this.classList.add("collectHighlight");
}

/*
remove .collectHighlight from an element on mouseleave
*/
function unhighlightElement(event){
    this.classList.remove("collectHighlight");
}

/*
removes the collectjs interface from the page
*/
function removeInterface(event){
    event.stopPropagation();
    event.preventDefault();
    Interface.turnOff();
    clearClass('queryCheck');
    clearClass('collectHighlight');
    var elesToRemove = ["collectjs"],
        curr;
    for ( var i=0, len=elesToRemove.length; i<len; i++ ) {
        curr = document.getElementById(elesToRemove[i]);
        curr.parentElement.removeChild(curr);
    }

    document.body.style.marginBottom = marginBottom + "px";
}

function refreshElements(event){
    resetInterface();
    Interface.turnOn();
}

/*
clear the current SelectorFamily
*/
function removeSelectorEvent(event){
    event.stopPropagation();
    event.preventDefault();
    deleteEditing();
    resetInterface();
}

/*
on blur, update Collect.elements based on the value of #ruleRange
*/
function applyRuleRange(event){
    Family.range();
    clearClass("queryCheck");
    addClass("queryCheck", Collect.elements);
    
    HTML.count.textContent = Collect.elements.length;
    generatePreviewElements(HTML.form.capture.textContent, Collect.elements);
}

/*
cycle to the previous element (based on Collect.elementIndex and Collect.elements) to represent an
element in #ruleHTML
*/
function showPreviousElement(event){
    var index = Collect.elementIndex,
        len = Collect.elements.length;
    Collect.elementIndex = (index=== 0) ? len-1 : index-1;
    addSelectorTextHTML(Collect.elements[Collect.elementIndex]);
    markCapture();
}

/*
cycle to the next element (`d on Collect.elementIndex and Collect.elements) to represent an
element in #ruleHTML
*/
function showNextElement(event){
    var index = Collect.elementIndex,
        len = Collect.elements.length;
    Collect.elementIndex = (index=== len-1) ? 0 : index+1;
    addSelectorTextHTML(Collect.elements[Collect.elementIndex]);
    markCapture();
}

/*
if the .capture element clicked does not have the .selected class, set attribute to capture
otherwise, clear the attribute to capture
toggle .selected class
*/
function capturePreview(event){
    if ( !this.classList.contains("selected") ){
        clearClass("selected");
        var elements = Family.elements(),
            capture = this.dataset.capture;
        generatePreviewElements(capture, elements);
        HTML.form.capture.textContent = capture;
        this.classList.add("selected");

        if ( capture === "attr-href" && allLinks(Collect.elements) ){
            HTML.form.followHolder.style.display = "block";
            HTML.form.follow.removeAttribute("disabled");
            HTML.form.follow.setAttribute("title", "Follow link to get data for more rules");
        } else {
            HTML.form.followHolder.style.display = "none";
            HTML.form.follow.checked = false;
            HTML.form.follow.setAttribute("disabled", "true");
            HTML.form.follow.setAttribute("title", "Can only follow rules that get href attribute from links");
        }

    } else {
        HTML.form.capture.textContent ="";
        //HTML.preview.innerHTML = "No selector/attribute to capture selected";
        HTML.form.follow.disabled = true;
        HTML.form.followHolder.style.display = "none";
        this.classList.remove("selected");
    }   
}

function saveRuleEvent(event){
    var name = HTML.form.name.value,
        selector = HTML.form.selector.textContent,
        capture = HTML.form.capture.textContent,
        range = HTML.form.range.value,
        follow = HTML.form.follow.checked,
        error = false,
        rule = {};
    HTML.alert.innerHTML = "";
    if ( name === "") {
        error = true;
        alertMessage("Name needs to be filled in");
    }
    if ( selector === "" ) {
        error = true;
        alertMessage("No css selector");
    }
    if ( capture === "" ) {
        error = true;
        alertMessage("No attribute selected");
    }
    if ( error ) {
        return;
    }
    
    rule.name = name;
    rule.capture = capture;
    rule.selector = selector;

    // non-int range value converts to 0
    if ( !HTML.form.range.disabled ) {
        var rangeInt = parseInt(range, 10);
        rule.which = (isNaN(rangeInt)) ? 0 : rangeInt;
    }

    if ( follow ) {
        rule.follow = true;
    }
    saveRule(rule);
}

function previewSavedRule(event){
    clearClass("queryCheck");
    clearClass("collectHighlight");
    previewRule(this.textContent);
}

function unpreviewSavedRule(event){
    clearClass("savedPreview");
}

/*
function editSavedRule(event){
    var name = this.textContent;
    deleteEditing();
    editRule(name, this);
}
*/

function deleteRuleEvent(event){
    var parent = this.parentElement,
        name = parent.dataset.name;
    deleteRule(name, parent);
}

function newGroupEvent(event){
    event.preventDefault();
    createGroup();
}

function deleteGroupEvent(event){
    event.preventDefault();
    deleteGroup();
}

function loadGroupEvent(event){
    event.preventDefault();
    loadGroup(this);
}

function loadPageEvent(event){
    event.preventDefault();
    loadPage(this);
}

/*
function loadSetEvent(event){
    event.preventDefault();
    var selected = this.querySelector("option:checked");
    if ( selected ) {
        Collect.currentSet = selected.value;
        loadSet();
    }
}
*/
function toggleTabOption(event){
    // if option exists, toggle it, otherwise set based on whether or not html element is checked
    if ( Collect.options.ignore ) {
        Collect.options.ignore = !Collect.options.ignore;
    } else {
        Collect.options.ignore = document.getElementById("ignore").checked;
    }
    setOptions(Collect.options);
}

/***********************
    EVENT HELPERS
***********************/

function updateMatchedElements(){
    Family.match();
    var ele = Collect.elements[0];
    if ( ele ) {
        addSelectorTextHTML(ele);
    }
}

/*
given an element, generate the html to represent an element and its "captureable" attributes and
create the event listeners for it to work
*/
function addSelectorTextHTML(ele){
    HTML.ruleHTML.innerHTML = selectorTextHTML(ele);
    var capture = HTML.ruleHTML.getElementsByClassName("capture");
    addEvents(capture, "click", capturePreview);
}

/*
if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
*/
function markCapture(){
    var capture = HTML.form.capture.textContent,
        selector;
    if ( capture !== "") {
        selector = ".capture[data-capture='" + capture + "']";
        document.querySelector(selector).classList.add("selected");
    }
}
/*
generate paragraphs html for the captured attribute on all of the elements and attach them to #rulePreview
*/
function generatePreviewElements(capture, elements) {
    if ( capture === "" ) {
        return;
    }
    var fn = captureFunction(capture),
        previewHTML = "";
    for ( var i=0, len=elements.length; i<len; i++ ) {
        previewHTML += "<p class=\"noSelect\">" + fn(elements[i]) + "</p>";
    }
    if ( previewHTML === "" ) {
        previewHTML = "No selector/attribute to capture selected";
    }
    //HTML.preview.innerHTML = previewHTML;
}

/*
add the message to #ruleAlert
*/
function alertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    HTML.alert.appendChild(p);
    setTimeout(function(){
        HTML.alert.removeChild(p);
    }, 2000);
}


/*
add's a rule element to it's respective location in #ruleGroup
*/
function addRule(rule, set){
    var holder, ruleElement;
    holder = ruleHolderHTML(set);
    ruleElement = ruleHTML(rule);
    holder.appendChild(ruleElement);
}

/***********************
    UTILITY FUNCTIONS
general helper functions
***********************/

function parentName(name){
    // if name is less than 12 characters, just use it
    if ( name.length < 8 ) {
        return name;
    }
    
    // just return the first selector succeeded by an ellipsis
    return name.substr(0, 5) + "..."; 

}

function noSelectElement(type){
    var ele = document.createElement(type);
    ele.classList.add("noSelect");
    return ele;
}

// check if an element has a class
function hasClass(ele, name){   
    return ele.classList.contains(name);
}

// purge a classname from all elements with it
function clearClass(name){
    var eles = document.getElementsByClassName(name),
        len = eles.length;
    // iterate from length to 0 because its a NodeList
    while ( len-- ){
        eles[len].classList.remove(name);
    }
}

/*
iterate over array (or converted nodelist) and add a class to each element
*/
function addClass(name, eles){
    eles = Array.prototype.slice.call(eles);
    var len = eles.length;
    for ( var i=0; i<len; i++ ) {
        eles[i].classList.add(name);
    }
}

// utility function to swap two classes
function swapClasses(ele, oldClass, newClass){
    ele.classList.remove(oldClass);
    ele.classList.add(newClass);
}

/*
add an EventListener to an array/nodelist of elements
*/
function addEvents(eles, type, fn){
    // convert nodelist to array
    eles = Array.prototype.slice.call(eles);
    var len = eles.length;
    for ( var i=0; i<len; i++ ) {
        eles[i].addEventListener(type, fn, false);
    }
}

/*
add an EventListener to a an element, given the id of the element
*/
function idEvent(id, type, fn){
    document.getElementById(id).addEventListener(type, fn, false);
}

/*
remove an EventListener from an array/nodelist of elements
*/
function removeEvents(eles, type, fn){
    // convert nodelist to array
    eles = Array.prototype.slice.call(eles);
    var len = eles.length;
    for ( var i=0; i<len; i++ ) {
        eles[i].removeEventListener(type, fn);
    }
}

/*
add the .noSelect class to eles array, so that collect.js doesn't try to select them
*/
function addNoSelect(eles){
    var len = eles.length;
    for( var i=0; i<len; i++ ) {
        eles[i].classList.add('noSelect');
    }
}

function selectorIsComplete(selector_object){
    if ( selector_object.name === '' || selector_object.selector === '' ||
        selector_object.capture === '' ) {
        selector_object.incomplete = true;
    }
    return selector_object;
}   

function captureFunction(capture){
    if (capture==="text") { 
        return function(ele){
            return ele.textContent;
        };
    } else if (capture.indexOf("attr-")===0) {
        // return substring after first hyphen so that it works with data- attributes
        var attribute = capture.slice(capture.indexOf("-")+1);
        return function(ele){
            return ele.getAttribute(attribute);
        };
    }
}

function isLink(element, index, array){
    return element.tagName === "A";
}

function allLinks(elements){
    elements = Array.prototype.slice.call(elements);
    return elements.every(isLink);
}

function setInfo(){
    HTML.info.group.textContent = Collect.current.group || "(not set)";
    HTML.info.page.textContent = Collect.current.group || "(not set)";
    HTML.info.ruleSet.textContent = Collect.current.ruleSet || "(not set)";
}

/***********************
        STORAGE
***********************/
/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        groups:
            <name>:
                name: <name>,
                pages: {},
                urls: {}

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
function setupHostname(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            key;
        // default setup if page hasn't been visited before
        if ( !site ) {
            var defaultGroup = {
                name: "default",
                pages: {"default": newPage("default", false)},
                urls: {}
            };
            storage.sites[host] = {
                site: host,
                groups: {
                    "default": defaultGroup
                }
            };
            chrome.storage.local.set({'sites': storage.sites});

            HTML.groups.group.appendChild(newOption("default"));

            loadGroupObject(defaultGroup);
        } else {
            for ( key in site.groups ) {
                HTML.groups.group.appendChild(newOption(key));
            }
            loadGroupObject(site.groups["default"]);
        }
    });
}

function saveRule(rule){
    chrome.storage.local.get('sites', function saveRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            name = rule.name,
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        // make sure the name is unique first
        // if editing, overwrite the rule
        /*
        // disable editing until everything else is reconfigured for new object setup
        if ( Interface.editing ) {
            var editObj = editRuleFromGroup(rule, site.groups[group].nodes);
            if ( editObj.success ) {
                site.groups[group].nodes = editObj.nodes;
                storage.sites[host] = site;
                chrome.storage.local.set({'sites': storage.sites});
                resetInterface();    
            }
            
            // need to rename rule in Rules tab
        } else 
        */
        if ( uniqueRuleName(name, site.groups[group]) ) {
            site.groups[group].pages = addRuleToSet(rule, site.groups[group].pages);
            storage.sites[host] = site;
            chrome.storage.local.set({'sites': storage.sites});

            // hide preview after saving rule
            resetInterface();
            addRule(rule, ruleSet);
        } else {
            // some markup to signify you need to change the rule's name
            alertMessage("Rule name is not unique");
            HTML.form.ruleName.classList.add("error");
        }
    });
}

/*
iterate over pages to find a rule:
three nested loops, so not ideal
var page, ruleSet, rule;
for ( var key in pages ) {
    page = pages[key];
    for ( var j=0, setLen=page.sets.length; j<setLen; j++ ) {
        ruleSet = page.sets[j];
        for ( var ruleName in ruleSet.rules ) {
            // condition here
        }
    }
}
*/

function deleteRule(name, element){
    chrome.storage.local.get('sites', function deleteRuleChrome(storage){
        var host = window.location.hostname,
            sites = storage.sites,
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        sites[host].groups[group].pages = deleteRuleFromSet(name, sites[host].groups[group].pages);

        chrome.storage.local.set({'sites': sites});
        //element.parentElement.removeChild(element);
    });  
}

function uploadRules(){
    chrome.storage.local.get(null, function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group =site.groups[Collect.current.group];

        group.urls = Object.keys(group.urls);

        chrome.runtime.sendMessage({'type': 'upload', data: site.groups[group]});
    });
}

function createGroup(){
    var name = prompt("Group Name");
    // make sure name isn't empty string
    if ( name === "" || !legalFilename(name)) {
        return;
    }
    
    chrome.storage.local.get("sites", function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group;

        if ( !uniqueGroupName(name, site.groups)){
            // alertMessage not yet defined
            alertMessage("a group named \"" + name + "\" already exists");
            return;
        }

        HTML.groups.group.appendChild(newOption(name));
        group = {
            name: name,
            pages: {"default": newPage("default", false)},
            urls: {}
        };
        storage.sites[host].groups[name] = group;

        chrome.storage.local.set({'sites': storage.sites});

        loadGroupObject(group);
    });
}

/*
deletes the group currently selected, and removes its associated option from #allGroups
if the current group is "default", delete the rules for the group but don't delete the group
*/
function deleteGroup(){
    var currGroup = HTML.groups.querySelector("option:checked"),
        groupName = currGroup.value,
        defaultGroup = (groupName === "default"),
        confirmed;
    if ( defaultGroup ) {
        confirmed = confirm("Cannot delete \"default\" group. Do you want to clear out all of its rules instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this group and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }
    chrome.storage.local.get("sites", function deleteGroupChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            currOption = HTML.groups.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultGroup ) {
            site.groups["default"] = {
                name: "default",
                pages: {"default": newPage("default", false)},
                urls: {}
            };
        } else {
            delete site.groups[groupName];
            currOption.parentElement.removeChild(currOption);
            Collect.current.group = "default";
            HTML.group.group.querySelector("option[value=default]").selected = true;
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
    });
}

function loadGroup(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[name];
        resetInterface();
        loadGroupObject(group);
    });
}

function loadPage(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[Collect.current.group],
            page = group.pages[name];
        resetInterface();
        loadPageObject(page);
    });
}

/*
function editRule(name, element){
    chrome.storage.local.get('sites', function editRuleChrome(storage){
        var host = window.location.hostname,
            sites = storage.sites,
            group = Collect.current.group,
            // ruleSet... set = Collect.currentSet;
        findRuleFromGroup(name, element, sites[host].groups[group].nodes);
    });  
}
*/

function previewRule(name){
    chrome.storage.local.get('sites', function previewRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet,
            found = false,
            parentSelector, selector, elements;
        
        function findRule(node){
            var rule;
            for ( var r in node.rules ) {
                rule = node.rules[r];
                if ( rule.name === name ) {
                    found = true;
                    parentSelector = node.parent ? node.parent + " ": "";
                    selector = parentSelector + rule.selector + Collect.not,
                    elements = document.querySelectorAll(selector);
                    addClass("savedPreview", elements);
                    return;
                }
            }
            for ( var child in node.children ) {
                if ( !found ) {
                    findRule(node.children[child]);
                }    
            }
        }

        findRule(site.groups[group].nodes["default"]);
    });
}

function loadOptions(){
    chrome.storage.local.get("options", function(storage){
        var input;
        Collect.options = storage.options;
        for ( var key in storage.options ) {
            if ( storage.options[key] ) {
                input = document.getElementById(key);
                if ( input ) {
                    input.checked = true;
                }
            }
        }
    });
}

// override current options with passed in options
function setOptions(options){
    chrome.storage.local.set({"options": options});
}

/***********************
    STORAGE HELPERS
***********************/

// creates an empty page object
function newPage(name, index){
    return {
        name: name,
        index: index,
        rule_sets: {}
    };
}

// creates an empty ruleSet object
function newRuleSet(name){
    return {
        name: name,
        rules: {}
    };
}

function uniqueGroupName(name, groups){
    for ( var key in groups ) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
}

/*
a page's name must be unique within its group
*/
function uniquePageName(name, pages){
    for ( var key in pages) {
        if ( name === key ) {
            return false;
        }
    }
    return true;
}

/*
a ruleset's name must be unique within its group
*/
function uniqueRuleSetName(name, pages){
    var page;
    for ( var key in pages ){
        page = pages[key];
        for ( var j=0, setLen = page.sets.length; j<setLen; j++ ) {
            if ( name === page.sets[j].name ) {
                return false;
            }
        }
    }
    return true;
}

/*
a rule's name must be unique within its group
*/
function uniqueRuleName(name, pages){
    var page, ruleSet,
        pageName, ruleName;
    for ( pageName in pages ){
        page = pages[pageName];
        for ( var j=0, setLen = page.sets.length; j<setLen; j++ ) {
            ruleSet = page.sets[j];
            for ( ruleName in ruleSet.rules ) {
                if ( name === ruleName ) {
                    return false;
                }
            }
        }
    }
    return true;   
}

/*
a group's name will be the name of the file when it is uploaded, so make sure that any characters in the name will be legal to use
rejects if name contains characters not allowed in filename: <, >, :, ", \, /, |, ?, *
*/
function legalFilename(name){
    if ( name === null ) {
        return false;
    }
    var badCharacters = /[<>:"\/\\\|\?\*]/,
        match = name.match(badCharacters);
    return ( match === null );
}

/*
given a group object (rules, index_urls)
*/
function loadGroupObject(group){
    deleteEditing();

    // load group and set
    Collect.current.group = group.name;
    
    HTML.groups.group.querySelector("option[value=" + group.name + "]").selected = true;

    // clear out current options and populate with current group's pages
    HTML.groups.page.innerHTML = "";
    for ( var key in group.pages ) {
        HTML.groups.page.appendChild(newOption(key));
    }

    // use default set when loading a group
    clearRules();
    //addSavedRules(group.nodes["default"]);

    Interface.turnOn();
    setInfo();
}

function loadPageObject(page){
    deleteEditing();
    Collect.current.page = page.name;
}

/*
recursive pass over nodes to get an array of rule names
*/
function nodeRules(node){
    var rules = [];
    for ( var key in node.rules ) {
        rules.push(key);
    }

    for ( var child in node.children ) {
        rules = rules.concat(nodeRules(node.children[child]));
    }
    return rules;
}

/*
add saved rules from the node to the #savedRuleHolder
*/
function addSavedRules(node){
    for ( var key in node.rules ) {
        addRule(node.rules[key], node.name);
    }

    for ( var child in node.children ) {
        addSavedRules(node.children[child]);
    }    
}

function clearRules(){
    var curr;
    for ( var key in HTML.ruleGroups ) {
        curr = HTML.ruleGroups[key];
        curr.parentElement.removeChild(curr);
    }
    HTML.ruleGroups = {};
}

function addSets(node, select){
    select.appendChild(newOption(node.name));
    for ( var key in node.children ) {
        addSets(node.children[key], select);
    }
}

function addRuleToSet(rule, pages){
    var page = Collect.currentPage,
        ruleSet = Collect.currentRuleSet,
        currPage = pages[page],
        currSet;
    for ( var i=0, len=currPage.sets.length; i<len; i++ ) {
        currSet = currPage.sets[i];
        if ( currSet.name === ruleSet ) {
            currPage.sets[i].rules[rule.name] = rule;
            break;
        }
    }
    pages[page] = currPage;
    return pages;
}

/*
given sets, iterate over all the sets to find a rule with name and delete that rule
*/
function deleteRuleFromSet(name, pages){
    var page, ruleSet, rule,
        deletePage = false;
    for ( var key in pages ) {
        page = pages[key];
        for ( var j=0, setLen=page.sets.length; j<setLen; j++ ) {
            ruleSet = page.sets[j];
            for ( var ruleName in ruleSet.rules ) {
                rule = ruleSet.rules[ruleName];
                // found rule, check if it has an associated page to also delete
                if ( name === ruleName ) {
                    if ( rule.follow ) {
                        deletePage = true;
                    }
                }
                delete pages[key].sets[j].rules[ruleName];
            }
        }
    }

    if ( deletePage ) {
        pages = deletePage(name, pages);
    }

    return pages;
}

function deletePage(name, pages){
    var page = pages[name],
        followedRules;
    // can't delete default page
    if ( name === "default" || !page ) {
        return;
    }

    followedRules = followRulesInPage(page);
    for ( var i=0, len=followedRules.length; i<len; i++ ) {
        pages = deletePage(followedRules[i], pages);
    }
    delete pages[name];

    return pages;
}

// iterate over ruleSets in a page and generate an array of rules that have follow=true
function followRulesInPage(page){
    var rules = [],
        ruleSet;
    for ( var i=0, setLen = page.sets.length; i<setLen; i++ ){
        ruleSet = page.sets[i];
        for ( var key in ruleSet.rules ) {
            if ( ruleSet.rules[key].follow ) {
                rules.push(key);
            }
        }
    }
    return rules;
}

/*
iterate over sets to find current set
if parent is defined, set it for the node
if parent is undefined, delete the parent string from the set
*/
function toggleParentFromSet(parent, nodes){
    var set = Collect.currentSet,
        found = false;

    function findSet(node){
        if ( node.name === set ){
            if ( parent ) {
                node.parent = parent;
            } else {
                delete node.parent;
            }
            found = true;
            return;
        } else {
            for ( var child in node.children ) {
                if ( !found ) {
                    findSet(node.children[child]);
                }
            }
        }
    }

    findSet(nodes["default"]);

    return nodes;
}

/*
iterate over all rules to find the one to be edited, then load the saved rule
function findRuleFromGroup(name, element, nodes){
    var foundRule;
    function findRule(node){
        var rule;
        for ( var r in node.rules ) {
            rule = node.rules[r];
            if ( rule.name === name ) {
                foundRule = rule;

                // load set's parent for rule that you're editing
                Collect.currentSet = node.name;
                if ( node.parent ) {
                    Interface.parent.set(node.parent);
                } else {
                    Interface.parent.remove();
                }
                HTML.sets.querySelector("option[value=" + node.name + "]").selected = true;
                return;
            }
        }
        if ( foundRule === undefined ) {
            for ( var child in node.children ) {
                findRule(node.children[child]);    
                if ( foundRule ) {
                    break;
                }
            }    
        }
    }
    findRule(nodes["default"]);
    if ( foundRule ) {
        loadSavedRule(foundRule, element);    
    }
}
*/

/*
sets a rules name/capture/selector and follow/multiple/range if they exist
function loadSavedRule(rule, element){
    resetRulesView();

    Interface.editing = rule.name;
    Interface.editingElement = element;
    element.classList.add("editing");
    Family.fromSelector(rule.selector);

    HTML.ruleItems.style.display = "block";
    HTML.form.name.value = rule.name;
    HTML.form.selector.textContent = rule.selector;
    HTML.form.capture.textContent = rule.capture;
    if ( rule.which !== undefined ){
        HTML.form.range = rule.which;
        HTML.form.rangeHolder.style.display = "block";
        HTML.form.multiple.checked = true;
    }
    // show follow if capture is attr-href, check follow if rule.follow
    if ( rule.capture === "attr-href" ) {
        HTML.form.follow.disabled = false;
        HTML.form.followHolder.style.display = "block";    
    }
    if ( rule.follow ) {
        HTML.form.follow.checked = true;
    }
    markCapture();
}
*/


/*
when saving an edited rule, handle special cases for following, make sure it isn't
in its own set (for capture="attr-href" elements), and if changing names, make sure
that the new name is unique
function editRuleFromGroup(newRule, nodes){
    var found = false,
        setFound = false,
        set = Collect.currentSet,
        oldName = Interface.editing,
        newName = newRule.name,
        success = true,
        childrenCopy;

    function findRule(node){
        var rule;
        for ( var r in node.rules ) {
            rule = node.rules[r];
            // look for old name in case thats changing
            if ( rule.name === oldName ) {
                if ( node.name === Collect.currentSet ) {
                    // handle rule.follow
                    if ( rule.follow && !newRule.follow ) {
                        // remove set if no longer following
                        delete node.children[oldName];
                        removeSet(oldName);
                    } else if ( !rule.follow && newRule.follow ) {
                        // create a set if now following
                        node.children[rule.name] = addNode(newName);
                        HTML.sets.appendChild(newOption(newName));
                    } else if ( rule.follow && newRule.follow && oldName !== newName) {
                        // need to rename set
                        node.children[newName] = node.children[oldName];
                        node.children[newName].name = newName;
                        delete node.children[oldName];
                        updateSetName(oldName, newName);
                    }

                    if ( oldName === newName ) {
                        node.rules[r] = newRule;
                    } else {
                        updateRuleName(oldName, newName);
                        delete node.rules[oldName];
                        node.rules[newName] = newRule;
                    }
                } else {
                    if ( rule.follow && !newRule.follow ) {
                        delete node.children[oldName];
                    } else if ( rule.follow && newRule.follow ) {
                        childrenCopy = node.children[oldName];
                        delete node.children[oldName];
                        updateSetName(oldName, newName);
                    }

                    delete node.rules[oldName];
                    moveSet(nodes["default"]);

                    // need to move rule element to new set
                    var holder = ruleHolderHTML(set),
                        collectGroup = document.querySelector('.collectGroup[data-name="' + oldName + '"]');
                    holder.appendChild(collectGroup);

                    if ( oldName !== newName ) {
                        updateRuleName(oldName, newName);
                    }
                }
                found = true;
                return;
            }
        }
        
        for ( var child in node.children ) {
            if ( !found ) {
                findRule(node.children[child]);
            }    
        }
    }

    // finds current set and adds child node to it, using childrenCopy if it exists otherwise
    // creates a new node
    function moveSet(node){
        if ( node.name == set ){
            node.rules[newName] = newRule;
            if ( newRule.follow ) {
                if ( childrenCopy ) {
                    node.children[newName] = childrenCopy;
                } else {
                    node.children[newName] = addNode(newName);
                    HTML.sets.appendChild(newOption(newName));
                }
            }
            setFound = true;
            return;
        } else {
            for ( var child in node.children ) {
                if ( !setFound ) {
                    moveSet(node.children[child]);
                }
            }
        }
    }

    // if changing names, make sure that it is unique
    if ( oldName !== newName && !uniqueRuleName(newName, nodes) ){
        success = false;
        ruleAlertMessage("Rule name is not unique");
        HTML.form.ruleName.classList.add("error");
    } else if ( newName === set ){
        success = false;
        ruleAlertMessage("Rule cannot be in its own set");
        HTML.form.ruleName.classList.add("error");
    }

    if ( success ) {
        findRule(nodes["default"]);
        // no longer editing
        deleteEditing();        
    }
    return {
        "nodes": nodes,
        "success": success
    };
}
*/

function deleteEditing(){
    delete Interface.editing;
    if ( Interface.editingElement ) {
        Interface.editingElement.classList.remove("editing");
        delete Interface.editingElement;
    }
}

/***********************
    HTML FUNCTIONS
***********************/
/*
generate and return a span representing a rule object
*/
function ruleHTML(obj){
    var span = noSelectElement("span"),
        nametag = noSelectElement("span"),
        deltog = noSelectElement("span");
    span.dataset.name = obj.name;

    span.classList.add("collectGroup");
    nametag.classList.add("savedSelector");
    deltog.classList.add("deltog");

    span.appendChild(nametag);
    span.appendChild(deltog);

    nametag.textContent = obj.name;
    deltog.innerHTML = "&times;";

    nametag.addEventListener("mouseenter", previewSavedRule, false);
    nametag.addEventListener("mouseleave", unpreviewSavedRule, false);
    //nametag.addEventListener("click", editSavedRule, false);
    deltog.addEventListener("click", deleteRuleEvent, false);
    
    return span;
}

/*
returns an element for all rules with the same parent to append to
*/
function ruleHolderHTML(name){
    var set = HTML.ruleGroups[name],
        div, h2;
    if ( !set ) {
        set = noSelectElement("div");
        h2 = noSelectElement("h2");
        div = noSelectElement("div");

        set.classList.add("ruleGroup");
        set.dataset.name = name;
        h2.textContent = name;
        div.classList.add("groupRules");

        set.appendChild(h2);
        set.appendChild(div);

        HTML.ruleGroups[name] = set;

        HTML.saved.appendChild(set);
    } else {
        div = set.getElementsByTagName("div")[0];
    }
    return div;
}

//given an element, return html for selector text with 
//"capture"able parts wrapped
function selectorTextHTML(element) {
    if ( element === undefined ) {
        return '';
    }

    var clone = cleanElement(element.cloneNode(true)),
        html = clone.outerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;'),
        attrs = clone.attributes,
        curr, text;
    
    for ( var i=0, len =attrs.length; i<len; i++ ) {
        curr = attrs[i];
        text = attributeText(curr);
        html = html.replace(text, wrapTextHTML(text, 'attr-'+curr.name));
    }

    if ( clone.textContent !== "" ) {
        text = clone.textContent;
        // wrap tags so the textContent and not something else is replaced
        html = html.replace(("&gt;" + text + "&lt;"), ("&gt;" + wrapTextHTML(text, 'text') + "&lt;"));
    }

    return html;
}

function cleanElement(ele){
    ele.classList.remove('queryCheck');
    ele.classList.remove('collectHighlight');
    if ( ele.hasAttribute('src') ) {
        var value = ele.getAttribute('src'),
            query = value.indexOf('?');
        if ( query !== -1 ) {
            value = value.slice(0, query);
        }
        ele.setAttribute('src', value);
    }
    if ( ele.textContent !== "" ) {
        var innerText = ele.textContent.replace(/(\s{2,}|[\n\t]+)/g, ' ');
        if ( innerText.length > 100 ){
            innerText = innerText.slice(0, 25) + "..." + innerText.slice(-25);
        }
        ele.innerHTML = innerText;
    }
    return ele;
}

function attributeText(attr) {
    // encode ampersand
    attr.value = attr.value.replace("&", "&amp;");
    return attr.name + "=\"" + attr.value + "\"";
}

//wrap an attribute or the text of an html string 
//(used in #selector_text div)
function wrapTextHTML(text, type){
    // don't include empty properties
    if ( text.indexOf('=""') !== -1 ) {
        return '';
    }
    return '<span class="capture noSelect" title="click to capture ' + type + 
        ' property" data-capture="' + type + '">' + text + '</span>';
}

function newOption(name){
    var option = document.createElement("option");
    option.setAttribute("value", name);
    option.textContent = name;
    return option;
}

function updateRuleName(oldName, newName){
    var collectGroup = document.querySelector('.collectGroup[data-name="' + oldName + '"]'),
        savedSelector = collectGroup.getElementsByClassName('savedSelector')[0];
    collectGroup.dataset.name = newName;
    savedSelector.textContent = newName;
}

function updateSetName(oldName, newName){
    var ruleGroup = HTML.ruleGroups[oldName],
        h2 = ruleGroup.getElementsByTagName('h2')[0],
        option = HTML.sets.querySelector("option[value=" + oldName + "]");
    
    if ( ruleGroup ){
        ruleGroup.dataset.name = newName;    
        HTML.ruleGroups[newName] = ruleGroup;
        delete HTML.ruleGroups[oldName];
    }
    if ( h2 ) {
        h2.textContent = newName;    
    }
    if ( option ) {
        option.value = newName;
        option.textContent = newName;
    }
}

function removeSetOption(name){
    var options = HTML.sets.getElementsByTagName("option"),
        curr;
    for ( var i=0, len=options.length; i<len; i++ ) {
        curr = options[i];
        if ( curr.value === name ) {
            curr.parentElement.removeChild(curr);
            break;
        }
    }

}

/*
removes option and .ruleGroup associated with a rule set
*/
function removeSet(name){
    removeSetOption(name);

    var rules = HTML.ruleGroups[name];
    // get rid of the .ruleGroup for the set
    if ( rules ) {
        rules.parentElement.removeChild(rules);
        delete HTML.ruleGroups[name];
    }

    // set default set to be selected
    HTML.sets.querySelector("option[value=default]").selected = true;
    Collect.currentSet = "default";
}

