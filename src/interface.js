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
    schema: {
        info:       document.getElementById("schemaInfo"),
        holder:     document.getElementById("schemaHolder")
    },
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
    preview:    document.getElementById("previewContents"),
    tabs: {
        schema:     document.getElementById("schemaTab"),
        preview:    document.getElementById("previewTab"),
        options:    document.getElementById("optionsTab")
    },
    views: {
        schema:     document.getElementById("schemaView"),
        selector:   document.getElementById("selectorView"),
        rule:       document.getElementById("ruleView"),
        preview:    document.getElementById("previewView"),
        options:    document.getElementById("optionsView")
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
        SelectorView.setup();
        RuleView.setup();
        optionsViewEvents();
    }
};
