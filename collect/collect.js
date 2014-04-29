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
            Collect.family.selectorFamily = new SelectorFamily(this, Collect.parent.selector);
            Collect.family.selectorFamily.setup(Collect.html.family, Collect.html.text,
                Collect.family.test.bind(Collect.family));
            Collect.family.selectorFamily.update();
            document.getElementById('selectorPreview').style.display = "block";
            document.getElementById("selectorItems").style.display = "inline-block";
        },
        remove: function(){
            if ( this.selectorFamily ) {
                this.selectorFamily.remove();
                this.selectorFamily = undefined;
            }
        },
        // create a SelectorFamily given a css selector string
        fromSelector: function(selector){
            var element = this.elements(true);
            if ( element ) {
                this.selectorFamily = new SelectorFamily(element, Collect.parent.selector);
                this.selectorFamily.setup(Collect.html.family, Collect.html.text,
                    Collect.family.test.bind(Collect.family));
                document.getElementById('selectorPreview').style.display = "block";
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
            document.getElementById("currentCount").textContent = count;
        },
        /*
        applies a range to the elements selected by the current selector
        if val is positive, it sets Collect.elements to (val, elements.length)
        if val is negative, it sets Collect.elements to (0, elements.length-val)

        */
        range: function(val){
            var rangeElement = document.getElementById("ruleRange"),
                range = parseInt(rangeElement.value, 10),
                len;

            Collect.family.match();
            len = Collect.elements.length;
            if ( isNaN(range) || -1*range > len || range > len-1 ) {
                rangeElement.value = "";
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
    parent: {
        selector: undefined,
        set: function(){
            this.selector = Collect.family.selector();
            if ( this.selector === "") {
                this.selector = undefined;
                return false;
            }
            // parent to select elements from is the first element in the page matching the selector
            Collect.html.parent.textContent = this.selector;
            resetInterface();
            Collect.turnOn();
            return true;
        },
        remove: function(){
            this.selector = undefined;
            Collect.html.parent.textContent = "";
            resetInterface();
            Collect.turnOn();
        },
        toggle: function(event){
            event.preventDefault();
            if ( !Collect.parent.selector ){
                var success = Collect.parent.set();
                if ( success ) {
                    this.textContent = "×";
                    this.setAttribute("title", "remove parent selector");    
                }        
            } else {
                Collect.parent.remove();
                this.textContent = "+";
                this.setAttribute("title", "add parent selector");
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
        // make sure there is a rules object for the current hostname
        
        addInterface();
        this.html = {
            family: document.getElementById("selectorHolder"),
            text: document.getElementById("selectorText"),
            parent: document.getElementById("parentSelector")
        };
        
        // don't call loadSavedItems until hostname has been setup because it is asynchronous
        // and will throw errors the first time visiting a site and opening collectJS
        setupHostname();
        this.turnOn();
        this.interfaceEvents();
    },
    interfaceEvents: function(){
        // preview
        document.getElementById("clearSelector").addEventListener('click', removeSelectorEvent, false);
        document.getElementById("saveSelector").addEventListener("click", showRuleInputs, false);

        // rules
        document.getElementById("saveRule").addEventListener("click", saveRuleEvent, false);
        document.getElementById("ruleCyclePrevious").addEventListener("click", showPreviousElement, false);
        document.getElementById("ruleCycleNext").addEventListener("click", showNextElement, false);
        document.getElementById("ruleRange").addEventListener("blur", applyRuleRange, false);
        document.getElementById("uploadRules").addEventListener("click", function(event){
            uploadRules();
        }, false);

        // tabs
        document.getElementById("addIndex").addEventListener("click", function(){
            toggleIndex();
        }, false);
        document.getElementById('closeCollect').addEventListener('click', removeInterface, false);
        document.getElementById("toggleParent").addEventListener("click", Collect.parent.toggle, false);

        // groups
        document.getElementById("newGroup").addEventListener("click", function(event){
            event.preventDefault();
            createGroup();
        }, false);
        document.getElementById("deleteGroup").addEventListener("click", function(event){
            event.preventDefault();
            deleteGroup();
        }, false);
        document.getElementById("allGroups").addEventListener("change", function(event){
            event.preventDefault();
            loadGroup(this);
        }, false);
    },
};

Collect.setup();

function addInterface(){
    var div = noSelectElement("div");
    div.setAttribute("id", "collectjs");
    div.innerHTML = "<div id=\"collectTopbar\"><div id=\"selectorButtons\" class=\"topbarGroup\"><div id=\"selectorTabs\" class=\"tabs\"><div class=\"tab hidden\" id=\"parentTab\"><div id=\"parentWrapper\" title=\"parent selector\">Parent <span id=\"parentSelector\"></span><button id=\"toggleParent\" title=\"add parent selector\">+</button></div></div><div class=\"tab\" id=\"selectorCount\">Count <span id=\"currentCount\"></span></div><div class=\"tab toggle\" id=\"previewTab\" data-for=\"previews\">Preview</div><div class=\"tab\" id=\"clearSelector\">Clear</div></div><div id=\"selectorGroups\" class=\"groups\"><div class=\"group previews\"><div id=\"rulePreview\"></div></div></div></div><div id=\"collectOptions\" class=\"topbarGroup\"><div id=\"collectTabs\" class=\"tabs\"><div class=\"tab toggle\" id=\"groupTab\" data-for=\"groups\">Group<span id=\"groupName\"></span></div><div class=\"tab toggle\" id=\"ruleTab\" data-for=\"rules\">Rules</div><div class=\"tab toggle\" id=\"optionTab\" data-for=\"options\">Options</div><div class=\"tab\" id=\"indexTab\">Index Page<input type=\"checkbox\" id=\"addIndex\"></div><div class=\"tab\" id=\"closeCollect\" title=\"close collectjs\">&times;</div></div><div id=\"tabGroups\" class=\"groups\"><div class=\"group groups\"><select id=\"allGroups\"></select><button id=\"newGroup\">Add Rule Group</button><button id=\"deleteGroup\">Remove Rule Group</button></div><div class=\"group options\"></div><div class=\"group rules\"><div id=\"savedRuleHolder\"><div class=\"ruleGroup\" data-selector=\"default\"><div class=\"groupRules\"></div></div></div><button id=\"uploadRules\">Upload Saved Rules</button></div></div></div></div><div id=\"collectMain\"><div id=\"selectorPreview\">Selector: <span id=\"selectorText\"></span></div><div id=\"selectorItems\" class=\"items\"><div id=\"selectorHolder\"></div><button id=\"saveSelector\">Confirm Selector</button></div><div id=\"ruleItems\" class=\"items\"><div id=\"ruleAlert\"></div><div id=\"ruleHTMLHolder\"><button id=\"ruleCyclePrevious\" class=\"cycle\" title=\"previous element matching selector\">Previous</button><span id=\"ruleHTML\"></span><button id=\"ruleCycleNext\" class=\"cycle\" title=\"next element matching selector\">Next</button></div><div id=\"ruleInputs\"><div class=\"rule\"><label for=\"ruleName\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\"></input></div><div class=\"rule\"><label for=\"ruleAttr\">Attribute:</label><input id=\"ruleAttr\" name=\"ruleAttr\" type=\"text\"></input></div><div class=\"rule\"><label for=\"ruleRange\">Range:</label><input id=\"ruleRange\" name=\"ruleRange\" type=\"text\"></input></div></div><button id=\"saveRule\">Save Rule</button></div></div>";
    document.body.appendChild(div);
    addNoSelect(div.querySelectorAll("*"));

    Collect.collectTabs = tabs(document.getElementById("collectOptions")),
    Collect.selectorTabs = tabs(document.getElementById("selectorButtons"));
}

function resetInterface(){
    clearClass("queryCheck");
    document.getElementById("currentCount").textContent = "";

    Collect.family.remove();
    
    // ruleItems
    Collect.selectorTabs.hide();
    document.getElementById("rulePreview").innerHTML = "";
    document.getElementById("ruleHTML").innerHTML = "";
    var inputs = document.querySelectorAll("#ruleInputs input"),
        len = inputs.length;
    for ( var i=0; i<len; i++ ) {
        inputs[i].value = "";
    }

    // divs to hide
    document.getElementById("selectorPreview").style.display = "none";    
    document.getElementById("selectorItems").style.display = "none";
    document.getElementById("ruleItems").style.display = "none";
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
}

/*
clear the current SelectorFamily
*/
function removeSelectorEvent(event){
    event.stopPropagation();
    event.preventDefault();
    resetInterface();
}

function showRuleInputs(event){
    Collect.family.match();
    var ele = Collect.elements[0];
    if ( ele ) {
        document.getElementById("selectorItems").style.display = "none";
        document.getElementById("ruleItems").style.display = "inline-block";
        addSelectorTextHTML(ele);
    }
}

function hideRuleInputs(event){
    document.getElementById("selectorItems").style.display = "inline-block";
    document.getElementById("ruleItems").style.display = "none";
}

/*
on blur, update Collect.elements based on the value of #ruleRange
*/
function applyRuleRange(event){
    Collect.family.range();
    clearClass("queryCheck");
    addClass("queryCheck", Collect.elements);
    
    document.getElementById("currentCount").textContent = Collect.elements.length;
    generatePreviewElements(document.getElementById("ruleAttr").value, Collect.elements);
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
cycle to the next element (based on Collect.elementIndex and Collect.elements) to represent an
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
        document.getElementById("ruleAttr").value = capture;
        this.classList.add("selected");
    } else {
        document.getElementById("ruleAttr").value ='';
        document.getElementById("rulePreview").innerHTML = "";
        this.classList.remove("selected");
    }   
}

function saveRuleEvent(event){
    var name = document.getElementById("ruleName").value,
        selector = document.getElementById("selectorText").textContent,
        capture = document.getElementById("ruleAttr").value,
        range = document.getElementById("ruleRange").value,
        error = false,
        rule = {};
    clearErrors();
    document.getElementById("ruleAlert").innerHTML = "";
    if ( name === "") {
        error = true;
        ruleAlertMessage("Name needs to be filled in");
        document.getElementById("ruleName").classList.add("error");
    }
    if ( selector === "" ) {
        error = true;
        ruleAlertMessage("No css selector");
    }
    if ( capture === "" ) {
        error = true;
        ruleAlertMessage("No attribute selected");
        document.getElementById("ruleAttr").classList.add("error");
        // some message that capture isn't define
    }
    if ( error ) {
        return;
    }
    rule.name = name;
    rule.capture = capture;
    rule.selector = selector;
    rule.index = Collect.indexPage;
    if ( range !== "" ) {
        rule.range = range;
    }
    if ( Collect.parent.selector ) {
        rule.parent = Collect.parent.selector;
    }
    saveRule(rule);
    resetInterface();
    addRule(rule);
}

function previewSavedRule(event){
    clearClass("queryCheck");
    clearClass("collectHighlight");

    var parent = this.parentElement,
        index = parent.dataset.index,
        parentSelector, selector, elements;

    if ( parent.dataset.index === "true" && Collect.indexPage ) {
        parentSelector = parent.dataset.parent ? parent.dataset.parent + " " : "",
        selector = parentSelector + parent.dataset.selector + Collect.not,
        elements = document.querySelectorAll(selector);
        addClass("savedPreview", elements);    
    } else if ( parent.dataset.index === "false" && !Collect.indexPage ) {
        selector = parent.dataset.selector + Collect.not,
        elements = document.querySelectorAll(selector);
        addClass("savedPreview", elements);    
    }
}

function unpreviewSavedRule(event){
    clearClass("savedPreview");
}

function deleteRuleEvent(event){
    var parent = this.parentElement,
        name = parent.dataset.name;
    deleteRule(name);
    parent.parentElement.removeChild(parent);
}


/***********************
    EVENT HELPERS
***********************/
/*
given an element, generate the html to represent an element and its "captureable" attributes and
create the event listeners for it to work
*/
function addSelectorTextHTML(ele){
    var rule = document.getElementById("ruleHTML"),
        capture;
    rule.innerHTML = selectorTextHTML(ele);
    capture = rule.getElementsByClassName("capture");
    addEvents(capture, "click", capturePreview);
}

function clearRules(){
    // clear out, don't delete default ruleGroup
    var groups = document.getElementsByClassName("ruleGroup"),
        curr;
    for ( var i=0, len=groups.length; i<len; i++ ) {
        curr = groups[i];
        if ( curr.dataset.selector === "default" ) {
            curr.querySelector(".groupRules").innerHTML = "";
        } else {
            curr.parentElement.removeChild(curr);
        }
    }
}

/*
if #ruleAttr is set, add .selected class to the matching #ruleHTML .capture span
*/
function markCapture(){
    var capture = document.getElementById("ruleAttr").value,
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
    document.getElementById("rulePreview").innerHTML = previewHTML;
}

/*
remove .error class from rule inputs
*/
function clearErrors(){
    document.getElementById("ruleName").classList.remove("error");
    document.getElementById("ruleAttr").classList.remove("error");
}

/*
add the message to #ruleAlert
*/
function ruleAlertMessage(msg){
    var p = noSelectElement("p");
    p.textContent = msg;
    document.getElementById("ruleAlert").appendChild(p);
}


/*
add's a rule element to it's respective location in #ruleGroup
*/
function addRule(rule){
    var holder, ruleElement;

    if ( rule.parent ) {
        holder = ruleHolderHTML(rule.parent);
    } else {
        holder = document.querySelector('.ruleGroup[data-selector="default"] .groupRules');
    }

    ruleElement = ruleHTML(rule);
    holder.appendChild(ruleElement);
}

/***********************
    UTILITY FUNCTIONS
general helper functions
***********************/

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
                indices: {},
                rules: {}
If the site object exists for a host, load the saved rules
*/
function setupHostname(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            select = document.getElementById("allGroups");
        if ( !site ) {
            var defaultGroup = {
                name: "default",
                indices: {},
                rules: {}
            };
            storage.sites[host] = {
                site: host,
                groups: {
                    "default": defaultGroup
                }
            };
            chrome.storage.local.set({'sites': storage.sites});

            addSelectOption("default", select);
            loadGroupObject(defaultGroup);
        } else {
            for ( var key in site.groups ) {
                addSelectOption(key, select);
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
            group = Collect.currentGroup;
        site.groups[group].rules[name] = rule;
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        // hide preview after saving rule
        Collect.selectorTabs.hide();
    });
}

function deleteRule(name){
    chrome.storage.local.get('sites', function deleteRuleChrome(storage){
        var host = window.location.hostname,
            sites = storage.sites,
            group = Collect.currentGroup;
        delete sites[host].groups[group].rules[name];
        chrome.storage.local.set({'sites': sites});
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
            tab = document.getElementById("indexTab"),
            group = Collect.currentGroup;
        // adding
        if ( !tab.classList.contains("set")) {
            // set right away, remove if there is an error
            tab.classList.add("set");
            storage.sites[host].groups[group].indices[url] = true;
        }
        // removing
        else {
            // remove right away, reset if there is an error
            tab.classList.remove("set");
            if ( storage.sites[host].groups[group].indices[url] ) {
                delete storage.sites[host].groups[group].indices[url];    
            }
        }
        document.getElementById("parentTab").classList.toggle("hidden");
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
            newOption;

        // if group already exists, set it as the currentGroup
        if ( site.groups[name] ) {
            setCurrentGroup(document.querySelector("#allGroups option[value=" + name + "]"));
            return;
        } else {
            newOption = document.createElement("option");
            newOption.setAttribute("value", name);
            newOption.textContent = name;
            document.getElementById("allGroups").appendChild(newOption);
            setCurrentGroup(newOption);
            
            storage.sites[host].groups[name] = {
                name: name,
                indices: {},
                rules: {}
            };
            chrome.storage.local.set({'sites': storage.sites});
            Collect.collectTabs.hide();
        }
    });
}

/*
deletes the group currently selected, and removes its associated option from #allGroups
if the current group is "default", delete the rules for the group but don't delete the group
*/
function deleteGroup(){
    var currGroup = document.querySelector("#allGroups option:checked"),
        groupName = currGroup.value,
        defaultGroup = (groupName === "default"),
        confirmed;
    if ( groupName === "default" ) {
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
            currOption = document.querySelector("#allGroups option:checked");
        // just delete all of the rules for "default" option
        if ( defaultGroup ) {
            site.groups["default"] = {
                name: "default",
                indices: {},
                rules: {}
            };
        } else {
            delete site.groups[groupName];
            currOption.parentElement.removeChild(currOption);
            Collect.currentGroup = "default";
            setCurrentGroup(document.querySelector("#allGroups option[value=default]"));
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        Collect.collectTabs.hide();
    });
}

function loadGroup(ele){
    var option = ele.querySelector('option:checked'),
        name = option.value;
    chrome.storage.local.get('sites', function loadGroupsChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = site.groups[name];
        loadGroupObject(group);
    });
}

/***********************
    STORAGE HELPERS
***********************/

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

function setCurrentGroup(option){
    Collect.currentGroup = option.value;
    option.setAttribute("selected", true);
    document.getElementById("groupName").textContent = ": " + option.value;
}

/*
given a group object (rules, indices)
*/
function loadGroupObject(group){
    var currOption = document.querySelector("#allGroups option[value=" + group.name + "]");
    setCurrentGroup(currOption);
    if ( group.rules ) {
        clearRules();
        for (var key in group.rules){
            addRule(group.rules[key]);                    
        }
    }
    if ( group.indices[window.location.href] ) {
        Collect.indexPage = true;
        document.getElementById("indexTab").classList.add("set");
        document.getElementById("addIndex").checked = true;
        document.getElementById("parentTab").classList.remove("hidden");
    } else {
        Collect.indexPage = false;
        document.getElementById("indexTab").classList.remove("set");
        document.getElementById("addIndex").checked = false;
        document.getElementById("parentTab").classList.add("hidden");
    }
}

function addSelectOption(name, select){
    var newOption = document.createElement("option");
    newOption.setAttribute("value", name);
    newOption.textContent = name;
    select.appendChild(newOption);
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
    span.dataset.selector = obj.selector;
    span.dataset.name = obj.name;
    span.dataset.capture = obj.capture;
    span.dataset.index = obj.index;
    if ( obj.range) {
        span.dataset.range = obj.range;
    }
    if ( obj.parent ) {
        span.dataset.parent = obj.parent;
    }

    span.classList.add("collectGroup");
    nametag.classList.add("savedSelector");
    deltog.classList.add("deltog");

    span.appendChild(nametag);
    span.appendChild(deltog);

    nametag.textContent = obj.name;
    deltog.innerHTML = "&times;";

    nametag.addEventListener("mouseenter", previewSavedRule, false);
    nametag.addEventListener("mouseleave", unpreviewSavedRule, false);
    deltog.addEventListener("click", deleteRuleEvent, false);
    
    return span;
}

/*
returns an element for all rules with the same parent to append to
*/
function ruleHolderHTML(name){
    var group = document.querySelector('.ruleGroup[data-selector="' + name + '"]'),
        div, h2;
    if ( !group ) {
        group = noSelectElement("div");
        h2 = noSelectElement("h2");
        div = noSelectElement("div");

        group.classList.add("ruleGroup");
        group.dataset.selector = name;
        h2.textContent = name;
        div.classList.add("groupRules");

        group.appendChild(h2);
        group.appendChild(div);

        document.getElementById("savedRuleHolder").appendChild(group);
    } else {
        div = group.getElementsByTagName("div")[0];
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
