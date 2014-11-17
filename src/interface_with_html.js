// create interface and return a function to remove the collectorjs interface
var removeInterface = (function(){
    var marginBottom    = 0;
    var element         = noSelectElement("div");

    element.classList.add("collectjs");
    element.innerHTML = "<div class=\"tabHolder\"><div class=\"tabs\"><div class=\"tab active\" id=\"schemaTab\">Schema</div><div class=\"tab\" id=\"previewTab\">Preview</div><div class=\"tab\" id=\"optionsTab\">Options</div><div class=\"tab\" id=\"closeCollect\">&times;</div></div></div><div class=\"permanent\"><div id=\"schemaInfo\"></div><div id=\"collectAlert\"></div></div><div class=\"views\"><div class=\"view\" id=\"emptyView\"></div><div class=\"view active\" id=\"schemaView\"><div id=\"schemaHolder\" class=\"rules\"></div></div><div class=\"view\" id=\"selectorView\"><div class=\"column form\"><h3>Type:<span id=\"selectorType\">Selector</span></h3><!--displays what the current selector is--><p>Selector: <span id=\"currentSelector\"></span></p><p>Count: <span id=\"currentCount\"></span></p><div id=\"parentRange\"><label>Low: <input id=\"parentLow\" name=\"parentLow\" type=\"text\" /></label><label>High: <input id=\"parentHigh\" name=\"parentHigh\" type=\"text\" /></label></div><p><button id=\"saveSelector\">Save</button><button id=\"cancelSelector\">Cancel</button></p></div><div class=\"column\"><!--holds the interactive element for choosing a selector--><div id=\"selectorHolder\"></div><div id=\"selectorCycleHolder\"></div></div></div><div class=\"view\" id=\"ruleView\"><div id=\"ruleItems\" class=\"items\"><h3>Selector: <span id=\"ruleSelector\"></span></h3><form id=\"ruleForm\" class=\"column form\"><div class=\"rule\"><label for=\"ruleName\" title=\"the name of a rule\">Name:</label><input id=\"ruleName\" name=\"ruleName\" type=\"text\" /></div><div class=\"rule\"><label title=\"the attribute of an element to capture\">Capture:</label><span id=\"ruleAttr\"></span></div><div class=\"rule follow\" id=\"ruleFollowHolder\"><label for=\"ruleFollow\" title=\"create a new page from the element's captured url (capture must be attr-href)\">Follow:</label><input id=\"ruleFollow\" name=\"ruleFollow\" type=\"checkbox\" disabled=\"true\" title=\"Can only follow rules that get href attribute from links\" /></div><div><button id=\"saveRule\">Save Rule</button><button id=\"cancelRule\">Cancel</button></div></form><div class=\"modifiers column\"><div id=\"ruleCycleHolder\"></div></div></div></div><div class=\"view\" id=\"previewView\"><div id=\"previewContents\"></div></div><div class=\"view\" id=\"optionsView\"><p><label for=\"ignore\">Ignore helper elements (eg tbody)</label><input type=\"checkbox\" id=\"ignore\" /></p></div></div>";
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

/*
Object that controls the functionality of the interface
*/
var UI = (function(){
    var tabs        = {
        schema:     document.getElementById("schemaTab"),
        preview:    document.getElementById("previewTab"),
        options:    document.getElementById("optionsTab")
    };
    var views       = {
        schema:     document.getElementById("schemaView"),
        selector:   document.getElementById("selectorView"),
        rule:       document.getElementById("ruleView"),
        preview:    document.getElementById("previewView"),
        options:    document.getElementById("optionsView")
    };
    var current     = {
        view: views.schema,
        tab: tabs.schema
    };
    var preview     = document.getElementById("previewContents");

    function setCurrentView(view, tab){
        hideCurrentView();
        current.view = view;
        current.tab = tab;
        view.classList.add("active");
        tab.classList.add("active");
    }

    function hideCurrentView(){
        // turn selectors off when leaving selector view
        if ( current.view.id === "selectorView" && Family ) {
            Family.turnOff();
        }
        current.view.classList.remove("active");
        current.tab.classList.remove("active");
    }    

    function generatePreview(){
        // only regen preview when something in the schema has changed
        if (  ui.dirty ) {
            preview.innerHTML = CurrentSite.current.page.preview();
        }
        ui.dirty = false;
    }

    var ui = {
        editing:        false,
        dirty:          true,
        selectorType:   "selector",
        showSelectorView: function(){
            setCurrentView(views.selector, tabs.schema);
        },
        showRuleView: function(){
            setCurrentView(views.rule, tabs.schema);
        },
        showSchemaView: function(){
            setCurrentView(views.schema, tabs.schema);
            if ( Parent && Parent.exists() ) {
                Parent.show();
            }
        },
        showPreviewView: function(){
            generatePreview();
            setCurrentView(views.preview, tabs.preview);
        },
        showOptionsView: function(){
            setCurrentView(views.options, tabs.options);
        }
    };
    return ui;
})();

var error = (function(){
    var alert = document.getElementById("collectAlert");

    return {
        alertMessage: function(msg){
            var p = noSelectElement("p");
            p.textContent = msg;
            alert.appendChild(p);
            setTimeout(function(){
                alert.removeChild(p);
            }, 2000);
        },
        check: function(condition, ele, msg){
            if ( condition ) {
                ele.classList.add("error");
                this.alertMessage(msg);
                return true;
            }
            return false;
        },
        reservedWord: function(word, ele, msg){
            var reservedWords   = ["default", "url"];
            var reserved        = false;
            for ( var i=0, len=reservedWords.length; i<len; i++ ) {
                if ( word === reservedWords[i] ) {
                    reserved = true;
                    break;
                }
            }
            return this.check(reserved, ele, msg);
        },
        empty: function(attr, ele, msg){
            return this.check((attr === ""), ele, msg);
        },
        clear: function(){
            var errors = document.querySelectorAll(".collectjs .error");
            for ( var i=0, errorLen = errors.length; i<errorLen; i++ ) {
                errors[i].classList.remove("error");
            }        
        }
    };
})();

// encapsulate event activeTabEvent to keep track of current tab/view
(function tabEvents(){
    idEvent("closeCollect", "click", function(event){
        event.stopPropagation();
        event.preventDefault();
        resetInterface();
        Parent.remove();
        removeInterface();
    });
    
    idEvent("schemaTab", "click", function(event){
        UI.showSchemaView();
    });

    idEvent("previewTab", "click", function(event){
        UI.showPreviewView();
    });

    idEvent("optionsTab", "click", function(event){
        UI.showOptionsView();
    });
})();

(function optionsViewEvents(){
    idEvent("ignore", "change", function toggleTabOption(event){
        // if option exists, toggle it, otherwise set based on whether or not html element is checked
        if ( CollectOptions.ignore ) {
            CollectOptions.ignore = !CollectOptions.ignore;
        } else {
            CollectOptions.ignore = document.getElementById("ignore").checked;
        }
        chromeSetOptions(CollectOptions);
    });
})();
