"use strict";

/*
Notes:
need to fix editing a rule once everything is up and running
implement ruleSet.parent once the rest of the storage things are fully functional
*/

var marginBottom;
// add the interface first so that html elements are present
(function addInterface(){
    var div = noSelectElement("div");
    div.classList.add("collectjs");
    div.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"ruleTab\"data-for=\"ruleView\">Rule</div><div class=\"tab\" id=\"groupsTab\" data-for=\"groupsView\">Saved Rules</div><div class=\"tab\" id=\"previewTab\" data-for=\"previewView\">Preview</div><div class=\"tab\" id=\"optionsTab\" data-for=\"optionsView\">Options</div><div class=\"tab\" id=\"refreshCollect\">&#8635;</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div class=\"currentInfo\"><div>Group: <select id=\"groupSelect\"></select><button id=\"createGroup\" title=\"create a new group\">+</button><button id=\"deleteGroup\" title=\"delete current group\">&times;</button></div><div>Page: <select id=\"pageSelect\"></select><button id=\"deletePage\" title=\"delete current page\">&times;</button></div><div>Rule Set: <select id=\"ruleSetSelect\"></select><button id=\"createRuleSet\" title=\"create a new rule set\">+</button><button id=\"deleteRuleSet\" title=\"delete current rule set\">&times;</button></div><div id=\"currentParent\">Parent <input type=\"checkbox\" id=\"ruleSetParent\" name=\"parent\" /><span id=\"parentSelectorView\"></span><span id=\"parentRangeView\"></span></div><div id=\"indexMarker\">Initial URL<input type=\"checkbox\" id=\"indexToggle\" /></div><div></div><button id=\"uploadRules\">Upload Group</button></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><form id=\"ruleForm\" class=\"column\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the selector to get the rule in the DOM\">Selector:</label><span id=\"ruleSelector\"></span></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"clearSelector\">Clear</button></div></form><form id=\"parentForm\" class=\"column\"><div class=\"rule\"><label>Selector:</label><span id=\"parentSelector\"></span></div><div class=\"rule range\"><label for=\"parentRange\">Range:</label><input id=\"parentRange\" name=\"parentRange\" type=\"text\" /></div><div><button id=\"saveParent\">Set Parent</button><button id=\"clearParent\">Clear</button></div></form><div class=\"modifiers column\"><div id=\"selectorHolder\"></div><div class=\"ruleHTMLHolder\">Count: <span id=\"currentCount\"></span><button id=\"ruleCyclePrevious\" class=\"cycle\" title=\"previous element matching selector\">&lt;&lt;</button><button id=\"ruleCycleNext\" class=\"cycle\" title=\"next element matching selector\">&gt;&gt;</button><span id=\"ruleHTML\"></span></div></div></div></div><div class=\"view\" id=\"groupsView\"><div id=\"ruleSets\" class=\"rules\"><!-- example .ruleSet layout<div class=\"ruleSet\"><h3>Name: {{name}}</h3><ul><li>Rule...</li></ul></div>--></div></div><div class=\"view\" id=\"previewView\"><p>Name: <span id=\"previewName\"></span>Selector: <span id=\"previewSelector\"></span>Capture: <span id=\"previewCapture\"></span></p><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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
    activeForm: "rule",
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
        var curr;

        this.turnOff();
        Collect.allElements = parentElements("*");

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
        permanentBarEvents();
    },
    update: function(){
        HTML.groups.group.querySelector("option[value=" + Collect.current.group + "]").selected = true;
        HTML.groups.page.querySelector("option[value=" + Collect.current.page + "]").selected = true;
        HTML.groups.ruleSet.querySelector("option[value=" + Collect.current.ruleSet + "]").selected = true;
    }
};

// save commonly referenced to elements
var HTML = {
    family: document.getElementById("selectorHolder"),
    form: {
        rule: {
            form: document.getElementById("ruleForm"),
            name: document.getElementById("ruleName"),
            capture: document.getElementById("ruleAttr"),
            selector: document.getElementById("ruleSelector"),
            follow: document.getElementById("ruleFollow"),
            followHolder: document.querySelector("#ruleItems .follow")
        },
        parent: {
            form: document.getElementById("parentForm"),
            selector: document.getElementById("parentSelector"),
            range: document.getElementById("parentRange")
        }
    },
    groups: {
        group: document.getElementById("groupSelect"),
        page: document.getElementById("pageSelect"),
        ruleSet: document.getElementById("ruleSetSelect"),
        ruleSetHolder: document.getElementById("ruleSets")
    },
    info: {
        alert: document.getElementById("collectAlert"),
        count: document.getElementById("currentCount"),
        index: document.getElementById("indexMarker"),
        indexToggle: document.getElementById("indexToggle"),
        parent: document.getElementById("parentSelectorView"),
        parentCheckbox: document.getElementById("ruleSetParent"),
        range: document.getElementById("parentRangeView")
    },
    interface: document.querySelector(".collectjs"),
    preview: {
        name: document.getElementById("previewName"),
        selector: document.getElementById("previewSelector"),
        capture: document.getElementById("previewCapture"),
        contents: document.getElementById("previewContents"),
    },
    ruleHTML: document.getElementById("ruleHTML"),
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
            HTML.form.rule.name.value = Interface.editing;
        }
        
        var selectorElement = Interface.activeForm === "rule" ?
            HTML.form.rule.selector : HTML.form.parent.selector;

        var sf = new SelectorFamily(this,
            Collect.parent.selector,
            HTML.family,
            selectorElement,
            Family.test.bind(Family),
            Collect.options
        );
        Family.family = sf;
        sf.update();
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
                HTML.form.rule.selector,
                Family.test.bind(Family),
                Collect.options
            );
            this.family = sf;
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
    elements: function(){
        var selector = this.selector();
        if ( selector === "") {
            return [];
        }
        return parentElements(selector);
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
        HTML.info.count.textContent = count;
        updateMatchedElements();
    },
    /*
    applies a range to the elements selected by the current selector
    if range is positive, it sets Collect.elements to (range, elements.length)
    if range is negative, it sets Collect.elements to (0, elements.length-range)
    */
    range: function(range){
        var len;

        Family.match();
        len = Collect.elements.length;
        if ( isNaN(range) || -1*range > len || range > len-1 ) {
            HTML.form.parent.range.value = "";
        } else {
           if ( range < 0 ) {
                Collect.elements = Array.prototype.slice.call(Collect.elements).slice(0, range);
                Collect.elementIndex = 0;
                setRuleHTML(Collect.elements[0]);
            } else if ( range > 0 ) {
                Collect.elements = Array.prototype.slice.call(Collect.elements).slice(range);
                Collect.elementIndex = 0;
                setRuleHTML(Collect.elements[0]);
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
    
    // reset rule form
    HTML.form.rule.name.value = "";
    HTML.form.rule.capture.textContent = "";
    HTML.form.rule.follow.checked = false;
    HTML.form.rule.follow.disabled = true;
    HTML.form.rule.followHolder.style.display = "none";

    // reset parent form
    HTML.form.parent.selector.textContent = "";
    HTML.form.parent.range.value = "";

    HTML.info.count.textContent = "";
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
    idEvent("saveParent", "click", saveParentEvent);
    idEvent("ruleCyclePrevious", "click", showPreviousElement);
    idEvent("ruleCycleNext", "click", showNextElement);
    idEvent("clearSelector", "click", removeSelectorEvent);
    idEvent("clearParent", "click", removeSelectorEvent);

    HTML.form.parent.range.addEventListener("blur", applyParentRange, false);
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

function permanentBarEvents(){
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

    idEvent("deleteRuleSet", "click", function deleteRuleSetEvent(event){
        event.preventDefault();
        deleteRuleSet();
    });

    // parent events
    idEvent("ruleSetParent", "change", toggleParentEvent);

    // upload events
    idEvent("uploadRules", "click", function uploadEvent(event){
        event.preventDefault();
        uploadCurrentGroupRules();
    });

    // index events
    idEvent("indexToggle", "change", toggleURLEvent);
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
    clearClass('parentGroup');
    HTML.interface.parentElement.removeChild(HTML.interface);

    document.body.style.marginBottom = marginBottom + "px";
}

function refreshElements(){
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

function applyParentRange(event){
    Family.range(parseInt(HTML.form.parent.range.value, 10));
    clearClass("queryCheck");
    addClass("queryCheck", Collect.elements);
    
    HTML.info.count.textContent = Collect.elements.length;   
}

/*
cycle to the previous element (based on Collect.elementIndex and Collect.elements) to represent an
element in #ruleHTML
*/
function showPreviousElement(event){
    var index = Collect.elementIndex,
        len = Collect.elements.length;
    Collect.elementIndex = (index=== 0) ? len-1 : index-1;
    setRuleHTML(Collect.elements[Collect.elementIndex]);
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
    setRuleHTML(Collect.elements[Collect.elementIndex]);
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
        HTML.form.rule.capture.textContent = capture;
        this.classList.add("selected");

        if ( capture === "attr-href" && allLinks(Collect.elements) ){
            HTML.form.rule.followHolder.style.display = "block";
            HTML.form.rule.follow.removeAttribute("disabled");
            HTML.form.rule.follow.setAttribute("title", "Follow link to get data for more rules");
        } else {
            HTML.form.rule.followHolder.style.display = "none";
            HTML.form.rule.follow.checked = false;
            HTML.form.rule.follow.setAttribute("disabled", "true");
            HTML.form.rule.follow.setAttribute("title", "Can only follow rules that get href attribute from links");
        }

    } else {
        HTML.form.rule.capture.textContent ="";
        //HTML.preview.innerHTML = "No selector/attribute to capture selected";
        HTML.form.rule.follow.disabled = true;
        HTML.form.rule.followHolder.style.display = "none";
        this.classList.remove("selected");
    }   
}

function saveRuleEvent(event){
    event.preventDefault();
    var name = HTML.form.rule.name.value,
        selector = HTML.form.rule.selector.textContent,
        capture = HTML.form.rule.capture.textContent,
        follow = HTML.form.rule.follow.checked,
        rule;

    clearErrors();
    if ( errorCheck(name, HTML.form.rule.name, "Name needs to be filled in") ||
        errorCheck(selector, HTML.form.rule.selector, "No CSS selector selected") ||
        errorCheck(capture, HTML.form.rule.capture, "No attribute selected") ) {
        return;
    }
    
    rule = {
        name: name,
        capture: capture,
        selector: selector
    };

    if ( follow ) {
        rule.follow = true;
    }
    saveRule(rule);
}

function saveParentEvent(event){
    event.preventDefault();
    var selector = HTML.form.parent.selector.textContent,
        range = HTML.form.parent.range.value,
        parent;

    clearErrors();
    if ( errorCheck(selector, HTML.form.parent.selector, "No CSS selector selected")) {
        return;
    }

    parent = {
        selector: selector
    };

    var rangeInt = parseInt(range, 10);
    // 0 for range includes everything, so its useless to save
    if ( !isNaN(rangeInt) && rangeInt !== 0 ) {
        parent.which = rangeInt;
        if ( rangeInt > 0 ) {
            HTML.info.range.textContent = "Range: (" + rangeInt + " to end)";
        } else {
            HTML.info.range.textContent = "Range: (start to " + rangeInt + ")";
        }
    }

    Collect.parent = parent;

    HTML.info.parent.textContent = selector;
    
    addParentGroup(selector, parent.which);
    saveParent(parent);
    showRuleForm();
    refreshElements();
}

function toggleParentEvent(event){
    if ( this.checked ) {
        // if parent selector doesn't exist, switch to parent form
        showParentForm();
        showTab(HTML.tabs.rule);
    } else {
        // if parent selector exists, remove it from current ruleSet
        Collect.parent = {};
        HTML.info.parent.textContent = "";
        HTML.info.range.textContent = "";
        deleteParent();
        clearClass("parentGroup");
        showRuleForm();
        Interface.turnOn();
    }
}

function toggleURLEvent(event){
    toggleURL();
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
        setRuleHTML(ele);
    }
}

/*
given an element, generate the html to represent an element and its "captureable" attributes and
create the event listeners for it to work
*/
function setRuleHTML(element){
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
        captureEle = captureAttribute(text, 'text');
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
    var capture = HTML.form.rule.capture.textContent,
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
    HTML.info.alert.appendChild(p);
    setTimeout(function(){
        HTML.info.alert.removeChild(p);
    }, 2000);
}

function errorCheck(attr, ele, msg){
    if ( attr === "" ) {
        ele.classList.add("error");
        alertMessage(msg);
        return true;
    }
    return false;
}

function clearErrors(){
    // doing this instead of clearClass("error") in case the native page also uses the error class
    var errors = HTML.interface.getElementsByClassName("error");
    for ( var i=0, errorLen = errors.length; i<errorLen; i++ ) {
        errors[i].classList.remove("error");
    }
}

/*
add's a rule element to it's respective location in #ruleGroup
*/
function addRule(rule, set){
    var ele = ruleElement(rule);
    HTML.groups.rules.appendChild(ele);
}


function addParentGroup(selector, range){
    var elements = document.querySelectorAll(selector + Collect.not),
        start = 0,
        end = elements.length;
    if ( range ) {
        if ( range > 0 ) {
            start = range;
        } else {
            end -= range;
        }
    }
    for ( ; start<end ; start++ ){
        elements[start].classList.add("parentGroup");
    }
}

/*
uses Collect.parent to limit selected elements to children of elements matching Collect.parent.seelctor
if Collect.parent.which is defined, only use Collect.parent.selector elements within that range
*/
function parentElements(selector){
    var range = Collect.parent.which,
        allElements = [];
    if ( range !== undefined ) {
        var elements = document.querySelectorAll(Collect.parent.selector),
            start = 0,
            end = elements.length,
            currElements;
        if ( range > 0 ) {
            start = range;
        } else {
            end -= range;
        }
        for ( ; start<end; start++ ) {
            currElements = elements[start].querySelectorAll(selector+Collect.not);
            allElements = allElements.concat(Array.prototype.slice.call(currElements));
        }
        return allElements;
    } else {
        var prefix = Collect.parent.selector ? Collect.parent.selector : "body";
        allElements = Array.prototype.slice.call(document.querySelectorAll(prefix + " " + selector + Collect.not));
    }
    return allElements;
}

function showRuleForm(){
    Interface.activeForm = "rule";
    HTML.form.parent.form.style.display = "none";
    HTML.form.rule.form.style.display = "inline-block";
}

function showParentForm(){
    Interface.activeForm = "parent";
    HTML.form.parent.form.style.display = "inline-block";
    HTML.form.rule.form.style.display = "none";
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
            group =site.groups[Collect.current.group],
            data = {};

        // setup things for Collector
        group.urls = Object.keys(group.urls);
        group.pages = nonEmptyPages(group.pages);

        data.group = group;
        data.site = window.location.host;

        chrome.runtime.sendMessage({type: 'upload', data: data});
    });
}

function toggleURL(){
    chrome.storage.local.get(null, function(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group =site.groups[Collect.current.group],
            url = window.location.href;

        if ( group.urls[url] ) {
            delete group.urls[url];
        } else {
            group.urls[url] = true;
        }

        site.groups[Collect.current.group] = group;
        chrome.storage.local.set({'sites': storage.sites});
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
        confirmed = confirm("Cannot delete \"default\" group. Do you want to clear out all of its pages instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this group and all of its related pages?");    
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
        confirmed = confirm("Are you sure you want to delete this page and all of its related rule sets?");    
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
        loadRuleSetObject(page.sets[option.value]);
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
        if ( !uniqueRuleSetName(name, group.pages) ) {
            alertMessage("a rule set named \"" + name + "\" already exists");
            return;
        }

        HTML.groups.ruleSet.appendChild(newOption(name));

        page.sets[name] = {
            name: name,
            rules: {}
        };
        storage.sites[host].groups[Collect.current.group].pages[Collect.current.page] = page;
        chrome.storage.local.set({'sites': storage.sites});

        loadRuleSetObject(page.sets[name]);
    });
}

function deleteRuleSet(){
    var defaultRuleSet = (Collect.current.ruleSet === "default"),
        confirmed;
    if ( defaultRuleSet ) {
        confirmed = confirm("Cannot delete \"default\" rule set. Do you want to clear out all of its rules instead?");
    } else {
        confirmed = confirm("Are you sure you want to delete this rule set and all of its related rules?");    
    }
    if ( !confirmed ) {
        return;
    }
    chrome.storage.local.get("sites", function deleteGroupChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            currOption = HTML.groups.ruleSet.querySelector("option:checked"),
            currGroup = Collect.current.group,
            currPage = Collect.current.page,
            pages = site.groups[currGroup].pages,
            ruleSet = pages[currPage].sets[currOption],
            currRule, ruleName;
        // delete any {follow: true} generated pages
        for ( ruleName in ruleSet.rules ) {
            currRule = ruleSet.rules[ruleName];
            if ( currRule.follow ) {
                deletePageFromGroup(ruleName, pages);
            }
        }
        // just delete all of the rules for "default" option and return a new ruleSet
        // Collect.current.ruleSet and the selected option are already set to default
        if ( defaultRuleSet ) {
            site.groups[currGroup].pages[currPage].sets["default"] = newRuleSet("default");
        } else {
            delete site.groups[Collect.current.group].pages[Collect.current.page].sets[currOption];
            currOption.parentElement.removeChild(currOption);
            Collect.current.ruleSet = "default";
            HTML.groups.ruleSet.querySelector("option[value=default]").selected = true;
        }
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
        loadRuleSetObject(site.groups[currGroup].pages[currPage].sets[Collect.current.ruleSet]);
    });
}

/***********************
    RULE STORAGE
***********************/

function saveRule(rule){
    if ( rule.name === "default" ) {
        alertMessage("Rule cannot be named 'default'");
        HTML.form.rule.name.classList.add("error");
        return;
    }
    chrome.storage.local.get('sites', function saveRuleChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            name = rule.name,
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        if ( !uniqueRuleName(name, site.groups[group].pages) ) {
            // some markup to signify you need to change the rule's name
            alertMessage("Rule name is not unique");
            HTML.form.rule.name.classList.add("error");
            return;
        }

        site.groups[group].pages[page].sets[ruleSet].rules[rule.name] = rule;

        // create a new page if rule.follow
        if ( rule.follow ) {
            site.groups[group].pages[rule.name] = newPage(rule.name);
            HTML.groups.page.appendChild(newOption(rule.name));
        }

        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});

        // hide preview after saving rule
        resetInterface();
        addRule(rule, ruleSet);
    });
}

function saveParent(parent){
    chrome.storage.local.get('sites', function saveParentChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        site.groups[group].pages[page].sets[ruleSet].parent = parent;
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
    });
}

function deleteParent(){
    chrome.storage.local.get('sites', function deleteParentChrome(storage){
        var host = window.location.hostname,
            site = storage.sites[host],
            group = Collect.current.group,
            page = Collect.current.page,
            ruleSet = Collect.current.ruleSet;

        delete site.groups[group].pages[page].sets[ruleSet].parent;
        storage.sites[host] = site;
        chrome.storage.local.set({'sites': storage.sites});
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
        element.parentElement.removeChild(element);
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
iterate over pages and only return pages/rule sets that contain rules
*/
function nonEmptyPages(pages){
    var emptyPage = true,
        page, ruleSet,
        pageName, ruleSetName,
        pageRules = {},
        allPages = {};
    for ( pageName in pages ) {
        page = pages[pageName];
        pageRules = {};
        emptyPage = true;
        for ( ruleSetName in page.sets ) {
            ruleSet = page.sets[ruleSetName];
            if ( Object.keys(ruleSet.rules).length > 0 ) {
                pageRules[ruleSet.name] = ruleSet;
                emptyPage = false;
            }
        }
        if ( !emptyPage ) {
            allPages[page.name] = pageRules;
        }
    }

    return allPages;
}


/*
given a group object (rules, index_urls)
*/
function loadGroupObject(group){
    deleteEditing();
    
    HTML.groups.group.querySelector("option[value=" + group.name + "]").selected = true;

    var url = window.location.href;
    HTML.info.indexToggle.checked = group.urls[url] !== undefined;

    // clear out current options and populate with current group's pages
    HTML.groups.page.innerHTML = "";
    for ( var key in group.pages ) {
        HTML.groups.page.appendChild(newOption(key));
    }

    Collect.current.group = group.name;

    // load the default page
    loadPageObject(group.pages.default);
}

function loadPageObject(page){
    deleteEditing();
    Collect.current.page = page.name;

    if ( page.name === "default" ) {
        HTML.info.index.display = "inline-block";
    } else {
        HTML.info.index.display = "none";
    }

    var currSet, setName;
    HTML.groups.ruleSet.innerHTML = "";
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

    if ( ruleSet.parent ) {
        HTML.info.parent.textContent = ruleSet.parent.selector;
        HTML.info.parentCheckbox.checked = true;
        addParentGroup(ruleSet.parent.selector, ruleSet.parent.which);

        if ( ruleSet.parent.which ) {
            if ( ruleSet.parent.which > 0 ) {
                HTML.info.range.textContent = "Range: (" + ruleSet.parent.which + " to end)";
            } else {
                HTML.info.range.textContent = "Range: (start to " + ruleSet.parent.which + ")";
            }
        } else {
            HTML.info.range.textContent = "";    
        }
    } else {
        HTML.info.parent.textContent = "";
        HTML.info.parentCheckbox.checked = false;
        HTML.info.range.textContent = "";
        clearClass("parentGroup");
    }
    HTML.groups.ruleSetHolder.innerHTML = "";
    HTML.groups.ruleSetHolder.appendChild(ruleSetElement(ruleSet));


    // don't call these in loadGroupObject or loadPageObject because we want to know if there is a
    // parent selector
    Interface.turnOn();
    Interface.update();
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

/*
Find all of the {follow: true} rules in a page that is going to be deleted, and make a recursive
call to delete those pages as well.
*/
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

    // remove select
    var option = HTML.groups.page.querySelector("option[value=" + name + "]");
    if ( option ) {
        option.parentElement.removeChild(option);
    }

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
    /*****
        html this generates:
        <div class="ruleSet">
            <h3>
                Name: {{name}}
            </h3>
            <p class="selectorName">{{selector}}</p>
            <p>Rules</p>
            <ul>
                <li>{{rule}}</li>
                ...
            </ul>
        </div>
    *****/
    var holder = noSelectElement("div"),
        //label = noSelectElement("label"),
        //selector = noSelectElement("p"),
        //p = noSelectElement("p"),
        ul = noSelectElement("ul");
    holder.classList.add("ruleSet");
    holder.innerHTML = "<h3 class=\"noSelect\">Name: " + ruleSet.name + "</h3>";
    

    //label.textContent = "Parent: ";
    //label.appendChild(input);
    //input.setAttribute("type", "checkbox");
    //input.setAttribute("name", "parent");
    //input.addEventListener("change", toggleParent(selector), false);

    //selector.classList.add("selectorName");
    //if ( ruleSet.parent ) {
        //selector.textContent = ruleSet.parent.selector;
        //input.checked = true;
    //}
    for ( var key in ruleSet.rules ) {
        ul.appendChild(ruleElement(ruleSet.rules[key]));
    }

    //holder.appendChild(label);
    //holder.appendChild(selector);
    //holder.appendChild(p);
    holder.appendChild(ul);

    HTML.groups.rules = ul;

    return holder;
}

function ruleElement(rule){
    var li = noSelectElement("li"),
        nametag = noSelectElement("span"),
        deltog = noSelectElement("span");
    li.dataset.name = rule.name;

    li.classList.add("collectGroup");
    nametag.classList.add("savedSelector");
    deltog.classList.add("deltog");

    li.appendChild(nametag);
    li.appendChild(deltog);

    nametag.textContent = rule.name;
    deltog.innerHTML = "&times;";

    nametag.addEventListener("mouseenter", previewSavedRule, false);
    nametag.addEventListener("mouseleave", unpreviewSavedRule, false);
    //nametag.addEventListener("click", editSavedRule, false);
    deltog.addEventListener("click", deleteRuleEvent, false);
    
    return li;
}
