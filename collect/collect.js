"use strict";

/*********************************
            COLLECT
*********************************/
var Collect = {
    // elements within the page that can be selected by collectJS
    allElements: [],
    not: ":not(.noSelect)",
    indexPage: false,
    family: {
        selectorFamily: undefined,
        create: function(event){
            event.stopPropagation();
            event.preventDefault();
            resetInterface();    
            // preserve name when switching selector while editing
            if ( Collect.editing ) {
                Collect.html.form.name.value = Collect.editing;
            }
            
            var sf = new SelectorFamily(this, Collect.parent.selector);
            sf.setup(Collect.html.family, Collect.html.form.selector, Collect.family.test.bind(Collect.family));
            Collect.family.selectorFamily = sf;
            sf.update();
            Collect.html.ruleItems.style.display = "block";
        },
        remove: function(){
            if ( this.selectorFamily ) {
                this.selectorFamily.remove();
                this.selectorFamily = undefined;
            }
        },
        // create a SelectorFamily given a css selector string
        fromSelector: function(selector){
            var longSelector = (Collect.parent.selector ? Collect.parent.selector: "body") +
                " " + selector + Collect.not;
            var element = document.querySelector(longSelector);
            if ( element ) {
                var sf = new SelectorFamily(element, Collect.parent.selector);
                sf.setup(Collect.html.family, Collect.html.form.selector,
                    Collect.family.test.bind(Collect.family));
                this.selectorFamily = sf;
                Collect.html.ruleItems.style.display = "block";
                this.selectorFamily.match(selector);
            }    
        },
        selector: function(){
            if ( this.selectorFamily ) {
                return this.selectorFamily.toString();
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
            Collect.html.count.textContent = count;
            updateMatchedElements();
        },
        /*
        applies a range to the elements selected by the current selector
        if val is positive, it sets Collect.elements to (val, elements.length)
        if val is negative, it sets Collect.elements to (0, elements.length-val)

        */
        range: function(val){
            var range = parseInt(Collect.html.form.range.value, 10),
                len;

            Collect.family.match();
            len = Collect.elements.length;
            if ( isNaN(range) || -1*range > len || range > len-1 ) {
                Collect.html.form.range.value = "";
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
        this.allElements = document.querySelectorAll(prefix + " *" + this.not);
        for ( var i=0, len=this.allElements.length; i<len; i++ ) {
            curr = this.allElements[i];
            curr.addEventListener('click', Collect.family.create, false);
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
        for ( var i=0, len=this.allElements.length; i<len; i++ ) {
            curr = this.allElements[i];
            curr.removeEventListener('click', Collect.family.create);
            curr.removeEventListener('mouseenter', highlightElement);
            curr.removeEventListener('mouseleave', unhighlightElement);
            
        }
        this.allElements = [];
    },
    /*
    messy proof of concept
    */
    setup: function(){
        addInterface();
        // call after addInterface otherwise html elements won't exist
        this.html = {
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
            groups: document.getElementById("allGroups"),
            preview: document.getElementById("rulePreview"),
            ruleGroups: {},
            ruleHTML: document.getElementById("ruleHTML"),
            ruleItems: document.getElementById("ruleItems"),
            sets: document.getElementById("allSets"),
            saved: document.getElementById("savedRuleHolder"),
            tabs: {
                parent: document.getElementById("parentTab"),
                next: document.getElementById("nextTab"),
                index: document.getElementById("indexTab"),
                add: document.getElementById("addIndex")
            }
        };
        
        // don't call loadSavedItems until hostname has been setup because it is asynchronous
        // and will throw errors the first time visiting a site and opening collectJS
        setupHostname();
        setupTabs();
        this.interfaceEvents();
    },
    interfaceEvents: function(){
        // preview
        idEvent("clearSelector", "click", removeSelectorEvent);

        // rules
        Collect.html.form.range.addEventListener("blur", applyRuleRange, false);
        Collect.html.form.multiple.addEventListener("change", function(event){
            Collect.html.form.range.disabled = !Collect.html.form.range.disabled;
            if ( Collect.html.form.disabled ) {
                Collect.html.form.rangeHolder.style.display = "none";
            } else {
                Collect.html.form.rangeHolder.style.display = "block";
            }
            
        });

        idEvent("saveRule", "click", saveRuleEvent);
        idEvent("previewSelector", "click", previewSelectorEvent);
        idEvent("ruleCyclePrevious", "click", showPreviousElement);
        idEvent("ruleCycleNext", "click", showNextElement);
        idEvent("uploadRules", "click", function(event){
            uploadRules();
        });

        // tabs
        idEvent("addIndex", "click", addIndexEvent);
        idEvent("closeCollect", "click", removeInterface);

        // groups
        idEvent("newGroup", "click", newGroupEvent);
        idEvent("deleteGroup", "click", deleteGroupEvent);
        idEvent("allGroups", "change", loadGroupEvent);
        idEvent("allSets", "change", loadSetEvent);
    }
};

Collect.setup();

function addInterface(){
    var div = noSelectElement("div");
    div.setAttribute("id", "collectjs");
    div.innerHTML = "<div class=\"topbarHolder\"><div class=\"topbar\"><div class=\"tabs\"><div class=\"tab\" id=\"parentTab\"></div><div class=\"tab hidden\" id=\"nextTab\"></div><div class=\"tab\" id=\"groupTab\">Group<select id=\"allGroups\"></select><button id=\"deleteGroup\">×</button><button id=\"newGroup\">+</button></div><div class=\"tab\" id=\"setTab\"><span title=\"create a new set by capturing the 'href' attribute of links\">Set</span><select id=\"allSets\"></select></div><div class=\"tab toggle\" id=\"ruleTab\" data-for=\"rules\">Rules</div><div class=\"tab toggle\" id=\"optionTab\" data-for=\"options\">Options</div><div class=\"tab\" id=\"indexTab\"><label for=\"addIndex\">Index Page</label><input type=\"checkbox\" id=\"addIndex\"></div><div class=\"tab\" id=\"closeCollect\" title=\"close collectjs\">&times;</div></div><div class=\"groups\"><div class=\"group options\"></div><div class=\"group rules\"><div id=\"savedRuleHolder\"></div><button id=\"uploadRules\">Upload Saved Rules</button></div><div class=\"group preview\" id=\"rulePreview\"></div></div></div></div><div id=\"collectMain\"><div id=\"ruleItems\" class=\"items\"><div id=\"ruleAlert\"></div><div class=\"rulesForm\"><div class=\"rule\"><label for=\"ruleName\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label>Selector:</label><span id=\"ruleSelector\"></span></div><div class=\"rule\"><label>Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule\"><label for=\"ruleMultiple\">Multiple:</label><input id=\"ruleMultiple\" name=\"ruleMultiple\" type=\"checkbox\" /></div><div class=\"rule range\"><label for=\"ruleRange\">Range:</label><input id=\"ruleRange\" name=\"ruleRange\" type=\"text\" disabled=\"true\"/></div><div class=\"rule follow\"><label for=\"ruleFollow\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div></div><div class=\"modifiers\"><div id=\"selectorHolder\"></div><div class=\"ruleHTMLHolder\">Count: <span id=\"currentCount\"></span><button id=\"ruleCyclePrevious\" class=\"cycle\" title=\"previous element matching selector\">&lt;&lt;</button><button id=\"ruleCycleNext\" class=\"cycle\" title=\"next element matching selector\">&gt;&gt;</button><span id=\"ruleHTML\"></span></div></div><div id=\"buttonContainer\"><button id=\"saveRule\">Save Rule</button><button id=\"previewSelector\">Preview Capture</button><button id=\"clearSelector\">Clear</button></div></div></div>";
    document.body.appendChild(div);
    addNoSelect(div.querySelectorAll("*"));

    // some some margin at the bottom of the page
    var currentMargin = parseInt(document.body.style.marginBottom, 10);
    if ( isNaN(currentMargin) ) {
        Collect.marginBottom = 0;
    } else {
        Collect.marginBottom = currentMargin;
    }
    document.body.style.marginBottom = (Collect.marginBottom + 300) + "px";
}

function setupTabs(){
    Collect.parent = toggleTab("parent", Collect.html.tabs.parent, toggleSetParent);
    Collect.next = toggleTab("next", Collect.html.tabs.next, toggleSetNext);

    var eles = Array.prototype.slice.call(document.querySelectorAll(".tab.toggle"));
    for ( var i=0, len=eles.length; i<len; i++ ) {
        eles[i].addEventListener("click", toggleGroups, false);
    }
}

function toggleTab(property, parent, toggleFn){
    var nameTag = document.createTextNode(property[0].toUpperCase() + property.slice(1)),
        selectorName = document.createElement("span"),
        toggleable = document.createElement("button"),
        obj = {
            selector: undefined,
            set: function(selector){
                if ( selector === undefined || selector === "" ) {
                    this.remove();
                    return;
                }
                this.selector = selector;
                selectorName.textContent = parentName(selector);
                selectorName.setAttribute("title", selector);
                toggleable.textContent = "×";
                toggleable.setAttribute("title", "remove " + property + "selector");
            },
            remove: function(){
                this.selector = undefined;
                selectorName.textContent = "";
                selectorName.removeAttribute("title");
                toggleable.textContent = "+";
                toggleable.setAttribute("title", "add " + property + "selector");
            },
            toggle: function(event){
                event.preventDefault();
                var clear = true;
                if ( !obj.selector ){
                    var selector = Collect.family.selector();
                    if ( selector !== "") {
                        obj.set(selector);
                        clear = false;
                    }
                }
                if ( clear ) {
                    obj.remove();
                }
                toggleFn(obj.selector);
                resetInterface();
                Collect.turnOn();
            }
        };

    selectorName.classList.add("smallSelector");

    toggleable.textContent = "+";
    parent.appendChild(nameTag);
    parent.appendChild(selectorName);
    parent.appendChild(toggleable);

    toggleable.addEventListener("click", obj.toggle, false);
    return obj;
}

function resetInterface(){
    clearClass("queryCheck");
    Collect.html.count.textContent = "";

    Collect.family.remove();
    
    // ruleItems
    Collect.html.ruleHTML.innerHTML = "";
    
    resetForm();
}

function resetForm(){
    // reset form
    Collect.html.form.name.value = "";
    Collect.html.form.capture.textContent = "";
    Collect.html.form.range.value = "";
    Collect.html.form.range.disabled = true;
    Collect.html.form.multiple.checked = false;
    Collect.html.form.follow.checked = false;
    Collect.html.form.follow.disabled = true;
    Collect.html.form.followHolder.style.display = "none";
    Collect.html.form.rangeHolder.style.display = "none";

    // divs to hide

    Collect.html.ruleItems.style.display = "none";
}

/******************
    EVENTS
******************/
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
    Collect.turnOff();
    clearClass('queryCheck');
    clearClass('collectHighlight');
    var elesToRemove = ["collectjs"],
        curr;
    for ( var i=0, len=elesToRemove.length; i<len; i++ ) {
        curr = document.getElementById(elesToRemove[i]);
        curr.parentElement.removeChild(curr);
    }

    document.body.style.marginBottom = (Collect.marginBottom) + "px";
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
    Collect.family.range();
    clearClass("queryCheck");
    addClass("queryCheck", Collect.elements);
    
    Collect.html.count.textContent = Collect.elements.length;
    generatePreviewElements(Collect.html.form.capture.textContent, Collect.elements);
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
        var elements = Collect.family.elements(),
            capture = this.dataset.capture;
        generatePreviewElements(capture, elements);
        Collect.html.form.capture.textContent = capture;
        this.classList.add("selected");

        if ( capture === "attr-href" && allLinks(Collect.elements) ){
            Collect.html.form.followHolder.style.display = "block";
            Collect.html.form.follow.removeAttribute("disabled");
            Collect.html.form.follow.setAttribute("title", "Follow link to get data for more rules");
        } else {
            Collect.html.form.followHolder.style.display = "none";
            Collect.html.form.follow.checked = false;
            Collect.html.form.follow.setAttribute("disabled", "true");
            Collect.html.form.follow.setAttribute("title", "Can only follow rules that get href attribute from links");
        }

    } else {
        Collect.html.form.capture.textContent ="";
        Collect.html.preview.innerHTML = "No selector/attribute to capture selected";
        Collect.html.form.follow.disabled = true;
        Collect.html.form.followHolder.style.display = "none";
        this.classList.remove("selected");
    }   
}

function saveRuleEvent(event){
    var name = Collect.html.form.name.value,
        selector = Collect.html.form.selector.textContent,
        capture = Collect.html.form.capture.textContent,
        range = Collect.html.form.range.value,
        follow = Collect.html.form.follow.checked,
        error = false,
        rule = {};
    Collect.html.alert.innerHTML = "";
    if ( name === "") {
        error = true;
        ruleAlertMessage("Name needs to be filled in");
    }
    if ( selector === "" ) {
        error = true;
        ruleAlertMessage("No css selector");
    }
    if ( capture === "" ) {
        error = true;
        ruleAlertMessage("No attribute selected");
    }
    if ( error ) {
        return;
    }
    
    rule.name = name;
    rule.capture = capture;
    rule.selector = selector;

    // non-int range value converts to 0
    if ( !Collect.html.form.range.disabled ) {
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

function editSavedRule(event){
    var name = this.textContent;
    deleteEditing();
    editRule(name, this);
}

function deleteRuleEvent(event){
    var parent = this.parentElement,
        name = parent.dataset.name;
    deleteRule(name, parent);
}

function addIndexEvent(event){
    toggleIndex();
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

function loadSetEvent(event){
    event.preventDefault();
    var selected = this.querySelector("option:checked");
    if ( selected ) {
        Collect.currentSet = selected.value;
        loadSet();
    }
}

function previewSelectorEvent(event){
    event.preventDefault();
    if ( document.querySelector(".group.preview.show") ) {
        hideGroups();
    } else {
        showGroup(".group.preview");
    }
}

function toggleGroups(event){
    event.preventDefault();
    event.stopPropagation();
    if ( this.classList.contains("active") ){
        hideGroups();
    } else {
        showGroup(".group." + this.dataset.for);
        this.classList.add("active");
    }
}

/***********************
    EVENT HELPERS
***********************/

function updateMatchedElements(){
    Collect.family.match();
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
    Collect.html.ruleHTML.innerHTML = selectorTextHTML(ele);
    var capture = Collect.html.ruleHTML.getElementsByClassName("capture");
    addEvents(capture, "click", capturePreview);
}

/*
if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
*/
function markCapture(){
    var capture = Collect.html.form.capture.textContent,
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
    Collect.html.preview.innerHTML = previewHTML;
}

/*
add the message to #ruleAlert
*/
function ruleAlertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    Collect.html.alert.appendChild(p);
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

function showGroup(selector){
    hideGroups();
    var ele = document.querySelector(selector);
    if ( ele ) {
        ele.classList.add("show");
    }
}

function hideGroups(){
    var groups = document.querySelectorAll(".group.show"),
        count = groups.length;
    for ( var i=0; i<count; i++ ) {
        groups[i].classList.remove("show");
    }
    var tabs = document.querySelectorAll(".tab.active");
    count = tabs.length;
    for ( var j=0; j<count; j++ ) {
        tabs[j].classList.remove("active");
    }
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
add the .no_select class to eles array, so that collect.js doesn't try to select them
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
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        groups:
            <name>:
                name: <name>,
                index_urls: {},
                nodes: {
                    default: {
                        name: default,
                        rules: {},
                        children: {
                            ...
                        }
                    }
                }
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
                index_urls: {},
                nodes: {
                    "default": addNode("default")
                }
            };
            storage.sites[host] = {
                site: host,
                groups: {
                    "default": defaultGroup
                }
            };
            chrome.storage.local.set({'sites': storage.sites});

            Collect.html.groups.appendChild(newOption("default"));

            loadGroupObject(defaultGroup);
        } else {
            for ( key in site.groups ) {
                Collect.html.groups.appendChild(newOption(key));
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
            group = Collect.currentGroup,
            set = Collect.currentSet;

        // make sure the name is unique first
            // if editing, overwrite the rule
        if ( Collect.editing ) {
            var editObj = editRuleFromGroup(rule, site.groups[group].nodes);
            if ( editObj.success ) {
                site.groups[group].nodes = editObj.nodes;
                storage.sites[host] = site;
                chrome.storage.local.set({'sites': storage.sites});
                resetInterface();    
            }
            
            // need to rename rule in Rules tab
        } else if ( uniqueRuleName(name, site.groups[group].nodes) ) {
            site.groups[group].nodes = addRuleToSet(rule, site.groups[group].nodes);      
            storage.sites[host] = site;
            chrome.storage.local.set({'sites': storage.sites});

            // hide preview after saving rule
            resetInterface();
            addRule(rule, set);
        } else {
            // some markup to signify you need to change the rule's name
            ruleAlertMessage("Rule name is not unique");
            Collect.html.form.ruleName.classList.add("error");
        }
    });
}

function deleteRule(name, element){
    chrome.storage.local.get('sites', function deleteRuleChrome(storage){
        var host = window.location.hostname,
            sites = storage.sites,
            group = Collect.currentGroup,
            set = Collect.currentSet,
            deleteSet = false;

        sites[host].groups[group].nodes = deleteRuleFromSet(name, sites[host].groups[group].nodes);

        chrome.storage.local.set({'sites': sites});
        element.parentElement.removeChild(element);
    });  
}

/*
toggle whether the current page's url represents an index page for the crawler.
saves index page in chrome.storage
*/
function toggleIndex(){
    chrome.storage.local.get("sites", function(storage){
        var host = window.location.hostname,
            url = window.location.href,
            group = Collect.currentGroup;
        // adding
        if ( !Collect.html.tabs.index.classList.contains("set")) {
            toggleIndexPage(true);
            storage.sites[host].groups[group].index_urls[url] = true;
        }
        // removing
        else {
            toggleIndexPage(false);
            if ( storage.sites[host].groups[group].index_urls[url] ) {
                delete storage.sites[host].groups[group].index_urls[url];    
            }
        }
        chrome.storage.local.set({"sites": storage.sites});
    });

}

function uploadRules(){
    chrome.storage.local.get(null, function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.currentGroup;
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

        // if group already exists, set it as the currentGroup
        if ( site.groups[name] ) {
            group = site.groups[name];
        } else {
            Collect.html.groups.appendChild(newOption(name));
            group = {
                name: name,
                index_urls: {},
                nodes: {
                    "default": addNode("default")
                }
            };
            storage.sites[host].groups[name] = group;

            chrome.storage.local.set({'sites': storage.sites});
            hideGroups();
            //Collect.collectTabs.hide();
        }
        loadGroupObject(group);
    });
}

/*
deletes the group currently selected, and removes its associated option from #allGroups
if the current group is "default", delete the rules for the group but don't delete the group
*/
function deleteGroup(){
    var currGroup = Collect.html.groups.querySelector("option:checked"),
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
            currOption = Collect.html.groups.querySelector("option:checked");
        // just delete all of the rules for "default" option
        if ( defaultGroup ) {
            site.groups["default"] = {
                name: "default",
                index_urls: {},
                nodes: {
                    "default": addNode("default")
                }
            };
        } else {
            delete site.groups[groupName];
            currOption.parentElement.removeChild(currOption);
            Collect.currentGroup = "default";
            Collect.html.groups.querySelector("option[value=default]").selected = true;
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        hideGroups();
        //Collect.collectTabs.hide();
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

function loadSet(){
    chrome.storage.local.get('sites', function loadSetChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[Collect.currentGroup];

        loadSetParent(group.nodes);
    });
}

function toggleSetParent(parent){
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.currentGroup;

        site.groups[group].nodes = toggleParentFromSet(parent, site.groups[group].nodes);
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
    });
}

function toggleSetNext(selector){
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.currentGroup;

        if ( selector ) {
            site.groups[group].next = selector;
        } else {
            delete site.groups[group].next;
        }
        
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
    });
}

function editRule(name, element){
    chrome.storage.local.get('sites', function editRuleChrome(storage){
        var host = window.location.hostname,
            sites = storage.sites,
            group = Collect.currentGroup,
            set = Collect.currentSet;
        findRuleFromGroup(name, element, sites[host].groups[group].nodes);
    });  
}


function previewRule(name){
    chrome.storage.local.get('sites', function previewRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.currentGroup,
            set = Collect.currentSet,
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


/***********************
    STORAGE HELPERS
***********************/

function addNode(name){
    return {
        name: name,
        rules: {},
        children: {}
    };
}

/*
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
    Collect.currentGroup = group.name;
    Collect.html.groups.querySelector("option[value=" + group.name + "]").selected = true;

    Collect.html.sets.innerHTML = "";
    Collect.currentSet = "default";
    addSets(group.nodes["default"], Collect.html.sets);

    // use default set when loading a group
    clearRules();
    addSavedRules(group.nodes["default"]);

    // clear out the parent selector
    Collect.parent.remove();
    // if parent is set for an index_url, make sure that its loaded
    if ( group.nodes["default"].parent ) {
        Collect.parent.set(group.nodes["default"].parent);
    }

    var turnOn = group.index_urls[window.location.href] !== undefined;
    toggleIndexPage(turnOn);
    
    Collect.turnOn();
}

function toggleIndexPage(on){
    if ( on ) {
        Collect.indexPage = true;
        Collect.html.tabs.next.classList.remove("hidden");
        Collect.html.tabs.index.classList.add("set");
        Collect.html.tabs.add.checked = true;
    } else {
        Collect.indexPage = false;
        Collect.html.tabs.next.classList.add("hidden");
        Collect.html.tabs.index.classList.remove("set");
        Collect.html.tabs.add.checked = false;
    }   
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
iterate over all rules in a rule group
return false if name already exists for a rule, otherwise true
*/
function uniqueRuleName(name, nodes){
    // can't have name default
    if ( name === "default" ) {
        return false;
    }
    var names = nodeRules(nodes["default"]);
    for ( var i=0, len=names.length; i<len; i++ ) {

        if ( names[i] === name ) {
            return false;
        }
    }

    return true;
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
    for ( var key in Collect.html.ruleGroups ) {
        curr = Collect.html.ruleGroups[key];
        curr.parentElement.removeChild(curr);
    }
    Collect.html.ruleGroups = {};
}

function addSets(node, select){
    select.appendChild(newOption(node.name));
    for ( var key in node.children ) {
        addSets(node.children[key], select);
    }
}

function addRuleToSet(rule, nodes){
    var set = Collect.currentSet,
        found = false;

    function findSet(node){
        if ( node.name == set ){
            node.rules[rule.name] = rule;
            if ( rule.follow ) {
                node.children[rule.name] = addNode(rule.name);
                Collect.html.sets.appendChild(newOption(rule.name));
            }
            found = true;
            return;
        } else {
            for ( var child in node.children ) {
                if ( !found ){
                    findSet(node.children[child]);
                }
            }
        }
    }

    findSet(nodes["default"]);

    return nodes;
}

/*
given sets, iterate over all the sets to find a rule with name and delete that rule
*/
function deleteRuleFromSet(name, nodes){
    var found = false,
        rule;
    function findRule(node){
        for ( var r in node.rules ) {
            rule = node.rules[r];
            if ( rule.name === name ) {
                delete node.rules[r];
                if ( rule.follow ) {
                    delete node.children[r];
                    removeSet(rule.name);
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

    findRule(nodes["default"]);

    return nodes;
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
find set, and if there is a parent, set it
*/
function loadSetParent(nodes){
    var set = Collect.currentSet,
        found = false;

    function findSet(node){
        if ( node.name == set ){
            if ( node.parent ) {
                Collect.parent.set(node.parent);
            } else {
                Collect.parent.remove();
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
    toggleSetParent(Collect.parent.selector);
}

/*
iterate over all rules to find the one to be edited, then load the saved rule
*/
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
                    Collect.parent.set(node.parent);
                } else {
                    Collect.parent.remove();
                }
                Collect.html.sets.querySelector("option[value=" + node.name + "]").selected = true;
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

/*
sets a rules name/capture/selector and follow/multiple/range if they exist
*/
function loadSavedRule(rule, element){
    resetForm();

    Collect.editing = rule.name;
    Collect.editingElement = element;
    element.classList.add("editing");
    Collect.family.fromSelector(rule.selector);

    Collect.html.ruleItems.style.display = "block";
    Collect.html.form.name.value = rule.name;
    Collect.html.form.selector.textContent = rule.selector;
    Collect.html.form.capture.textContent = rule.capture;
    if ( rule.which !== undefined ){
        Collect.html.form.range = rule.which;
        Collect.html.form.rangeHolder.style.display = "block";
        Collect.html.form.multiple.checked = true;
    }
    // show follow if capture is attr-href, check follow if rule.follow
    if ( rule.capture === "attr-href" ) {
        Collect.html.form.follow.disabled = false;
        Collect.html.form.followHolder.style.display = "block";    
    }
    if ( rule.follow ) {
        Collect.html.form.follow.checked = true;
    }
    markCapture();
}


/*
when saving an edited rule, handle special cases for following, make sure it isn't
in its own set (for capture="attr-href" elements), and if changing names, make sure
that the new name is unique
*/
function editRuleFromGroup(newRule, nodes){
    var found = false,
        setFound = false,
        set = Collect.currentSet,
        oldName = Collect.editing,
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
                        Collect.html.sets.appendChild(newOption(newName));
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
                    Collect.html.sets.appendChild(newOption(newName));
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
        Collect.html.form.ruleName.classList.add("error");
    } else if ( newName === set ){
        success = false;
        ruleAlertMessage("Rule cannot be in its own set");
        Collect.html.form.ruleName.classList.add("error");
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

function deleteEditing(){
    delete Collect.editing;
    if ( Collect.editingElement ) {
        Collect.editingElement.classList.remove("editing");
        delete Collect.editingElement;
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
    nametag.addEventListener("click", editSavedRule, false);
    deltog.addEventListener("click", deleteRuleEvent, false);
    
    return span;
}

/*
returns an element for all rules with the same parent to append to
*/
function ruleHolderHTML(name){
    var set = Collect.html.ruleGroups[name],
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

        Collect.html.ruleGroups[name] = set;

        Collect.html.saved.appendChild(set);
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
    return '<span class="capture no_select" title="click to capture ' + type + 
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
    var ruleGroup = Collect.html.ruleGroups[oldName],
        h2 = ruleGroup.getElementsByTagName('h2')[0],
        option = Collect.html.sets.querySelector("option[value=" + oldName + "]");
    
    if ( ruleGroup ){
        ruleGroup.dataset.name = newName;    
        Collect.html.ruleGroups[newName] = ruleGroup;
        delete Collect.html.ruleGroups[oldName];
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
    var options = Collect.html.sets.getElementsByTagName("option"),
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

    var rules = Collect.html.ruleGroups[name];
    // get rid of the .ruleGroup for the set
    if ( rules ) {
        rules.parentElement.removeChild(rules);
        delete Collect.html.ruleGroups[name];
    }

    // set default set to be selected
    Collect.html.sets.querySelector("option[value=default]").selected = true;
    Collect.currentSet = "default";
}

