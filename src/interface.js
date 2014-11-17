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
function tabEvents(){
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
}

function optionsViewEvents(){
    idEvent("ignore", "change", function toggleTabOption(event){
        // if option exists, toggle it, otherwise set based on whether or not html element is checked
        if ( CollectOptions.ignore ) {
            CollectOptions.ignore = !CollectOptions.ignore;
        } else {
            CollectOptions.ignore = document.getElementById("ignore").checked;
        }
        chromeSetOptions(CollectOptions);
    });
}
