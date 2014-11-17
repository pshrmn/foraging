// create interface and return a function to remove the collectorjs interface
var removeInterface = (function(){
    var marginBottom    = 0;
    var element         = noSelectElement("div");

    element.classList.add("collectjs");
    element.innerHTML = {{src/collector.html}};
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
    // elements in the selector view
    selector: {
        family:     document.getElementById("selectorHolder"),
        selector:   document.getElementById("currentSelector"),
        count:      document.getElementById("currentCount"),
        parent: {
            holder: document.getElementById("parentRange"),
            low:    document.getElementById("parentLow"),
            high:   document.getElementById("parentHigh")
        },
        type:       document.getElementById("selectorType")
    },
    // elements in the rule view
    rule: {
        selector:       document.getElementById("ruleSelector"),
        form:           document.getElementById("ruleForm"),
        name:           document.getElementById("ruleName"),
        capture:        document.getElementById("ruleAttr"),
        follow:         document.getElementById("ruleFollow"),
        followHolder:   document.getElementById("ruleFollowHolder")
    },
    alert:      document.getElementById("collectAlert"),
    preview:    document.getElementById("previewContents")
};

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
            HTML.preview.innerHTML = CurrentSite.current.page.preview();
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
            if ( Parent && Parent.exists ) {
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
