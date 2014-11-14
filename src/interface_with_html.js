// create interface and return a function to remove the collectorjs interface
var removeInterface = (function(){
    var marginBottom = 0,
        element = noSelectElement("div");

    element.classList.add("collectjs");
    element.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemaTab\">Schema</div><div class=\"tab\" id=\"previewTab\">Preview</div><div class=\"tab\" id=\"optionsTab\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div id=\"schemaInfo\"></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemaView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><h3>Type:<span id=\"selectorType\">Selector</span></h3><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label>High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"cancelSelector\">Cancel</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
    document.body.appendChild(element);
    addNoSelect(element.querySelectorAll("*"));    

    // some some margin at the bottom of the page
    var currentMargin = parseInt(document.body.style.marginBottom, 10);
    marginBottom = isNaN(currentMargin) ? 0 : currentMargin;
    document.body.style.marginBottom = (marginBottom + 500) + "px";

    return function(){
        element.parentElement.removeChild(element);
        document.body.style.marginBottom = marginBottom + "px";
    };
})();

// save commonly referenced to elements
var HTML = {
    schema: {
        info: document.getElementById("schemaInfo"),
        holder: document.getElementById("schemaHolder")
    },
    // elements in the selector view
    selector: {
        family: document.getElementById("selectorHolder"),
        selector: document.getElementById("currentSelector"),
        count: document.getElementById("currentCount"),
        parent: {
            holder: document.getElementById("parentRange"),
            low: document.getElementById("parentLow"),
            high: document.getElementById("parentHigh")
        },
        type: document.getElementById("selectorType")
    },
    // elements in the rule view
    rule: {
        selector: document.getElementById("ruleSelector"),
        form: document.getElementById("ruleForm"),
        name: document.getElementById("ruleName"),
        capture: document.getElementById("ruleAttr"),
        follow: document.getElementById("ruleFollow"),
        followHolder: document.querySelector("#ruleItems .follow")
    },
    // elements in the the permament bar
    perm: {
        schema: {
            select: document.getElementById("schemaSelect"),
            buttons: document.getElementById("schemaButtons")
        },
        page: {
            select: document.getElementById("pageSelect"),
        },
        set: {
            select: document.getElementById("selectorSetSelect")
        },
        alert: document.getElementById("collectAlert"),
    },
    preview: {
        contents: document.getElementById("previewContents")
    },
    tabs: {
        schema: document.getElementById("schemaTab"),
        preview: document.getElementById("previewTab"),
        options: document.getElementById("optionsTab")
    },
    views: {
        schema: document.getElementById("schemaView"),
        selector: document.getElementById("selectorView"),
        rule: document.getElementById("ruleView"),
        preview: document.getElementById("previewView"),
        options: document.getElementById("optionsView")
    }
};

/*
Object that controls the functionality of the interface
*/
var UI = {
    selectorType: "selector",
    editing: false,
    view: {
        view: undefined,
        tab: undefined
    },
    preview: {
        dirty: true
    },
    setup: function(){        
        loadOptions();
        setupHostname();
        
        // tabs
        tabEvents();

        //views
        selectorViewEvents();
        ruleViewEvents();
        optionsViewEvents();

        setupSelectorView();
        setupRulesView();
    }
};
