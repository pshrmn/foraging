"use strict";

/*
Notes:
need to fix editing a rule once everything is up and running
implement parent once the rest of the storage things are fully functional
issues with Collect.current/select elements
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
    },
    // parent.selector is set when Collect.current.ruleSet index=true
    parent: {}
};

/*
Object that controls the functionality of the interface
*/
var Interface = {
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
    adds events listeners based on whether or not Collect.parent.elector is set
    if it is, only add them to children of that element, otherwise add them to all elements
    that don't have the noSelect class
    store elements with eventlisteners in this.ele
    */
    turnOn: function(){
        var prefix = Collect.parent.selector ? Collect.parent.selector : "body",
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
        ruleViewEvents();
        optionsViewEvents();
        groupViewEvents();
    },
    update: function(){
        HTML.groups.group.querySelector("option[value=" + Collect.current.group + "]").selected = true;
        HTML.groups.page.querySelector("option[value=" + Collect.current.page + "]").selected = true;
        HTML.groups.ruleSet.querySelector("option[value=" + Collect.current.ruleSet + "]").selected = true;
    }
};

// save commonly referenced to elements
var HTML = {
    alert: document.getElementById("collectAlert"),
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
        page: document.getElementById("pageSelect"),
        ruleSet: document.getElementById("ruleSetSelect"),
        ruleSetHolder: document.getElementById("ruleSets")
    },
    interface: document.querySelector(".collectjs"),
    preview: {
        name: document.getElementById("previewName"),
        selector: document.getElementById("previewSelector"),
        capture: document.getElementById("previewCapture"),
        contents: document.getElementById("previewContents"),
    },
    ruleGroups: {},
    ruleHTML: document.getElementById("ruleHTML"),
    ruleItems: document.getElementById("ruleItems"),
    tabs: {
        rule: document.getElementById("ruleTab"),
        groups: document.getElementById("groupsTab"),
        preview: document.getElementById("previewTab"),
        options: document.getElementById("optionsTab")
    },
    views: {
        rule: document.getElementById("ruleView"),
        groups: document.getElementById("groupsView"),
        preview: document.getElementById("previewView"),
        options: document.getElementById("optionsView")
    }
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
            Collect.parent.selector,
            HTML.family,
            HTML.form.selector,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
        HTML.ruleItems.style.display = "block";
        showTab(HTML.tabs.rule);
    },
    remove: function(){
        if ( this.family ) {
            this.family.remove();
            this.family = undefined;
        }
    },
    // create a SelectorFamily given a css selector string
    fromSelector: function(selector){
        var longSelector = (Collect.parent.selector ? Collect.parent.selector: "body") +
            " " + selector + Collect.not;
        var element = document.querySelector(longSelector);
        if ( element ) {
            var sf = new SelectorFamily(element,
                Collect.parent.selector,
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
        longSelector = (Collect.parent.selector ? Collect.parent.selector: "body") +
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
    idEvent("refreshCollect", "click", refreshElements);
    idEvent("closeCollect", "click", removeInterface);

    // querySelectorAll because getElementsByClassName could overlap with native elements
    var tabs = document.querySelectorAll(".tabHolder .tab");
    for ( var i=0, len=tabs.length; i<len; i++ ) {
        tabs[i].addEventListener("click", showTabEvent, false);
    }

    function showTabEvent(event){
        showTab(this);
    }
}

function ruleViewEvents(){
    idEvent("saveRule", "click", saveRuleEvent);
    idEvent("ruleCyclePrevious", "click", showPreviousElement);
    idEvent("ruleCycleNext", "click", showNextElement);
    idEvent("clearSelector", "click", removeSelectorEvent);

    HTML.form.range.addEventListener("blur", applyRuleRange, false);
    HTML.form.multiple.addEventListener("change", function(event){
        HTML.form.range.disabled = !HTML.form.range.disabled;
        if ( HTML.form.disabled ) {
            HTML.form.rangeHolder.style.display = "none";
        } else {
            HTML.form.rangeHolder.style.display = "block";
        }
    });
}

function optionsViewEvents(){
    idEvent("ignore", "change", function toggleTabOption(event){
        // if option exists, toggle it, otherwise set based on whether or not html element is checked
        if ( Collect.options.ignore ) {
            Collect.options.ignore = !Collect.options.ignore;
        } else {
            Collect.options.ignore = document.getElementById("ignore").checked;
        }
        setOptions(Collect.options);
    });
}

function groupViewEvents(){
    // group events
    idEvent("groupSelect", "change", function loadGroupEvent(event){
        event.preventDefault();
        loadGroup(this);
    });

    idEvent("createGroup", "click", function newGroupEvent(event){
        event.preventDefault();
        createGroup();
    });

    idEvent("deleteGroup", "click", function deleteGroupEvent(event){
        event.preventDefault();
        deleteGroup();
    });

    // page events
    idEvent("pageSelect", "change", function loadPageEvent(event){
        event.preventDefault();
        loadPage(this);
    });

    idEvent("deletePage", "click", function deletePageEvent(event){
        event.preventDefault();
        deletePage();
    });

    // don't need to create a page, those are automatically made when creating a rule that captures
    // attr-href and follow=true

    // rule set events
    idEvent("createRuleSet", "click", function newRuleSetEvent(event){
        event.preventDefault();
        createRuleSet();
    });

    idEvent("ruleSetSelect", "change", function loadRuleSetEvent(event){
        event.preventDefault();
        loadRuleSet(this);
    });


    idEvent("uploadRules", "click", function uploadEvent(event){
        event.preventDefault();
        uploadCurrentGroupRules();
    });
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
    HTML.interface.parentElement.removeChild(HTML.interface);

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

/***********************
    EVENT HELPERS
***********************/

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
function addSelectorTextHTML(element){
    if ( element === undefined ) {
        return;
    }
    HTML.ruleHTML.innerHTML = "";
    var clone = cleanElement(element.cloneNode(true)),
        html = clone.outerHTML,
        attrs = clone.attributes,
        curr, text, splitHTML, firstHalf, secondHalf, captureEle;
    
    for ( var i=0, len =attrs.length; i<len; i++ ) {
        curr = attrs[i];
        text = attributeText(curr);

        splitHTML = html.split(text);
        firstHalf = splitHTML[0];
        secondHalf = splitHTML[1];

        HTML.ruleHTML.appendChild(document.createTextNode(firstHalf));
        captureEle = captureAttribute(text, 'attr-'+curr.name);
        if ( captureEle) {
            HTML.ruleHTML.appendChild(captureEle);
        }
        html = secondHalf;
    }

    if ( clone.textContent !== "" ) {
        text = clone.textContent;
        splitHTML = html.split(text);
        firstHalf = splitHTML[0];
        secondHalf = splitHTML[1];

        HTML.ruleHTML.appendChild(document.createTextNode(firstHalf));
        captureEle = captureAttribute(text, 'attr-'+curr.name);
        if ( captureEle) {
            HTML.ruleHTML.appendChild(captureEle);
        }

        html = secondHalf;
    }

    // append remaining text
    HTML.ruleHTML.appendChild(document.createTextNode(html));
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
//update
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
    var holder = ruleHolderHTML(set),
        ele = ruleElement(rule);
    holder.appendChild(ele);
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

/***********************
        STORAGE
***********************/
/*
iterate over pages to find a rule:
three nested loops, so not ideal
var page, ruleSet, rule,
    pageName, setName, ruleName
for ( pageName in pages ) {
    page = pages[pageName];
    for ( setName in page.sets ) {
        ruleSet = page.sets[setName];
        for ( ruleName in ruleSet.rules ) {
            // condition here
        }
    }
}
*/
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

function uploadCurrentGroupRules(){
    chrome.storage.local.get(null, function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group =site.groups[Collect.current.group];

        group.urls = Object.keys(group.urls);

        chrome.runtime.sendMessage({'type': 'upload', data: site.groups[group]});
    });
}

/***********************
    GROUP STORAGE
***********************/

function createGroup(){
    var name = prompt("Group Name");
    // null when cancelling prompt
    if ( name === null ) {
        return;
    }
    // make sure name isn't empty string or string that can't be used in a filename
    else if ( name === "" || !legalFilename(name)) {
        alertMessage("\'" + name + "\' is not a valid group name");
        return;
    }
    
    chrome.storage.local.get("sites", function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group;

        if ( !uniqueGroupName(name, site.groups)){
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

/*
deletes the group currently selected, and removes its associated option from #allGroups
if the current group is "default", delete the rules for the group but don't delete the group
*/
function deleteGroup(){
    var defaultGroup = (Collect.current.group === "default"),
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
            currOption = HTML.groups.group.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultGroup ) {
            site.groups["default"] = {
                name: "default",
                pages: {"default": newPage("default", false)},
                urls: {}
            };
        } else {
            delete site.groups[Collect.current.group];
            currOption.parentElement.removeChild(currOption);
            Collect.current.group = "default";
            HTML.groups.group.querySelector("option[value=default]").selected = true;
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        loadGroupObject(site.groups[Collect.current.group]);
    });
}

/***********************
    PAGE STORAGE
***********************/

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

function deletePage(){
    var defaultPage = (Collect.current.page === "default"),
        confirmed;
    if ( defaultPage ) {
        confirmed = confirm("Cannot delete \"default\" page. Do you want to clear out all of its rule sets instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this group and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }
    chrome.storage.local.get("sites", function deleteGroupChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            currOption = HTML.groups.page.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultPage ) {
            site.groups["default"].pages["default"] = newPage("default", false);
        } else {
            delete site.groups[Collect.current.group].pages[Collect.current.page];
            currOption.parentElement.removeChild(currOption);
            Collect.current.page = "default";
            HTML.group.page.querySelector("option[value=default]").selected = true;
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        loadPageObject(site.groups[Collect.current.group].pages[Collect.current.page]);
    });
}

/***********************
    RULE SET STORAGE
***********************/

function loadRuleSet(ele){
    var option = ele.querySelector("option:checked");

    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[Collect.current.group],
            page = group.pages[Collect.current.page];
        resetInterface();
        loadRuleSetObject(page.sets[Collect.current.ruleSet]);
    });
}

function createRuleSet(){
    var name = prompt("Group Name");
    if ( name === "" ) {
        alertMessage("rule set name cannot be blank");
        return;
    }
    chrome.storage.local.get("sites", function(storage){
         var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[Collect.current.group],
            page = group.pages[Collect.current.page];
        if ( !uniqueRuleSetName(name) ) {
            alertMessage("a rule set named \"" + name + "\" already exists");
            return;
        }
        page.sets[name] = {
            name: name,
            rules: {}
        };
        storage.sites[host].groups[Collect.current.group].pages[Collect.current.page] = page;
        chrome.storage.local.set({'sites': storage.sites});

        loadRuleSetObject(page.sets[name]);
    });
}

/***********************
    RULE STORAGE
***********************/

function saveRule(rule){
    chrome.storage.local.get('sites', function saveRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            name = rule.name,
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        if ( !uniqueRuleName(name, site.groups[group]) ) {
            // some markup to signify you need to change the rule's name
            alertMessage("Rule name is not unique");
            HTML.form.ruleName.classList.add("error");
        }

        site.groups[group].pages[page].sets[ruleSet].rules[rule.name] = rule;

        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});

        // hide preview after saving rule
        resetInterface();
        addRule(rule, ruleSet);
    });
}

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

function previewRule(name){
    chrome.storage.local.get('sites', function previewRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet,
            pages = site.groups[group].pages[page],
            parentSelector, selector, elements,
            currPage, set,
            pageName, setName, ruleName;
        for ( pageName in pages ) {
            currPage = pages[pageName];
            for ( setName in currPage.sets ) {
                set = currPage.sets[setName];
                for ( ruleName in set.rules ) {
                    if ( name === ruleName ) {
                        parentSelector = set.parent ? set.parent.selector + " ": "";
                        selector = parentSelector + set.rules[ruleName].selector + Collect.not,
                        elements = document.querySelectorAll(selector);
                        addClass("savedPreview", elements);
                        // return to quickly break out of the three loops :)
                        return;
                    }
                }
            }
        }
    });
}

/***********************
    OPTIONS STORAGE
***********************/

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
        sets: {"default": newRuleSet("default")}
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
    var page, pageName, setName;
    for ( pageName in pages ){
        page = pages[pageName];
        for ( setName in page.sets ) {
            if ( name === setName ) {
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
        pageName, setName, ruleName;
    for ( pageName in pages ){
        page = pages[pageName];
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
    
    HTML.groups.group.querySelector("option[value=" + group.name + "]").selected = true;

    // clear out current options and populate with current group's pages
    HTML.groups.page.innerHTML = "";
    for ( var key in group.pages ) {
        HTML.groups.page.appendChild(newOption(key));
    }

    Collect.current.group = group.name;

    // load the default page
    loadPageObject(group.pages.default);
    clearRules();
}

function loadPageObject(page){
    deleteEditing();
    Collect.current.page = page.name;
    var currSet, setName;
    for ( setName in page.sets ) {
        currSet = page.sets[setName];
        HTML.groups.ruleSet.appendChild(newOption(currSet.name));
    }
    loadRuleSetObject(page.sets.default);
}

function loadRuleSetObject(ruleSet){
    // maybe? look into
    deleteEditing();

    Collect.parent = ruleSet.parent || {};

    Collect.current.ruleSet = ruleSet.name;

    HTML.groups.ruleSetHolder.innerHTML = "";
    HTML.groups.ruleSetHolder.appendChild(ruleSetElement(ruleSet));

    // don't call these in loadGroupObject or loadPageObject because we want to know if there is a
    // parent selector
    Interface.turnOn();
    Interface.update();
}

function clearRules(){
    var curr;
    for ( var key in HTML.ruleGroups ) {
        curr = HTML.ruleGroups[key];
        curr.parentElement.removeChild(curr);
    }
    HTML.ruleGroups = {};
}

/*
given sets, iterate over all the sets to find a rule with name and delete that rule
*/
function deleteRuleFromSet(name, pages){
    var deletePage = false,
        page, ruleSet, rule,
        pageName, setName, ruleName,
        ruleFound = false;

    for ( pageName in pages ) {
        page = pages[pageName];
        for ( setName in page.sets ) {
            ruleSet = page.sets[setName];
            for ( ruleName in ruleSet.rules ) {
                rule = ruleSet.rules[ruleName];
                // found rule, check if it has an associated page to also delete
                if ( name === ruleName ) {
                    if ( rule.follow ) {
                        deletePage = true;
                    }
                   delete pages[pageName].sets[setName].rules[ruleName];
                   ruleFound = true;
                   break;
                }
            }
            if ( ruleFound ) {
                break;
            }
        }
        if ( ruleFound ) {
            break;
        }
    }

    if ( deletePage ) {
        pages = deletePageFromGroup(name, pages);
    }

    return pages;
}

function deletePageFromGroup(name, pages){
    var page = pages[name],
        followedRules;
    // can't delete default page
    if ( name === "default" || !page ) {
        return;
    }

    followedRules = followRulesInPage(page);
    for ( var i=0, len=followedRules.length; i<len; i++ ) {
        pages = deletePageFromGroup(followedRules[i], pages);
    }
    delete pages[name];

    return pages;
}

// iterate over ruleSets in a page and generate an array of rules that have follow=true
function followRulesInPage(page){
    var rules = [],
        setName, ruleName, ruleSet;
    for ( setName in page.sets ) {
        ruleSet = page.sets[setName];
        for ( ruleName in ruleSet.rules ) {
            if ( ruleSet.rules[ruleName].follow ) {
                rules.push(ruleName);
            }
        }
    }
    return rules;
}

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

/*
takes an element and remove collectjs related classes and shorten text, then returns outerHTML
*/
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
function captureAttribute(text, type){
    // don't include empty properties
    if ( text.indexOf('=""') !== -1 ) {
        return;
    }
    var span = noSelectElement("span");
    span.classList.add("capture");
    span.setAttribute("title", "click to capture " + type + " property");
    span.dataset.capture = type;
    span.textContent = text;
    span.addEventListener("click", capturePreview, false);
    return span;
}

function newOption(name){
    var option = noSelectElement("option");
    option.setAttribute("value", name);
    option.textContent = name;
    return option;
}

function ruleSetElement(ruleSet){
    var holder = noSelectElement("div"),
        label = noSelectElement("label"),
        input = noSelectElement("input"),
        p = noSelectElement("p"),
        ul = noSelectElement("ul");
    holder.classList.add("ruleSet");
    holder.innerHTML = "<h3 class=\"noSelect\">Name: " + ruleSet.name + "</h3>";
    
    label.textContent = "Parent: ";
    label.appendChild(input);
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "parent");

    for ( var key in ruleSet.rules ) {
        ul.appendChild(ruleElement(ruleSet.rules[key]));
    }

    holder.appendChild(label);
    holder.appendChild(p);
    holder.appendChild(ul);
    return holder;
}

function ruleElement(rule){
    var span = noSelectElement("span"),
        nametag = noSelectElement("span"),
        deltog = noSelectElement("span");
    span.dataset.name = rule.name;

    span.classList.add("collectGroup");
    nametag.classList.add("savedSelector");
    deltog.classList.add("deltog");

    span.appendChild(nametag);
    span.appendChild(deltog);

    nametag.textContent = rule.name;
    deltog.innerHTML = "&times;";

    nametag.addEventListener("mouseenter", previewSavedRule, false);
    nametag.addEventListener("mouseleave", unpreviewSavedRule, false);
    //nametag.addEventListener("click", editSavedRule, false);
    deltog.addEventListener("click", deleteRuleEvent, false);
    
    return span;
}
