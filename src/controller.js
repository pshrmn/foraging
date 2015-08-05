function foragerController(){
    var pages;
    var currentPage;
    var page;
    var selector;
    var lastId;

    function setupPage(){
        generateIds();
        getMatches();
        // page is base selector, has id 0
        selector = page;
        fns.dispatch.Page.setSelector(selector);
        fns.dispatch.Tree.draw(page, selector.id);
    }

    function generateIds(){
        var idCount = 0;
        function setId(sel){
            sel.id = idCount++;
            sel.children.forEach(function(child){
                setId(child);
            });
        }
        setId(page);
        lastId = idCount;
    }

    // get all of the elements that match each selector
    // and store in object.elements
    function getMatches(){
        function match(eles, s){
            if ( !s.elements ) {
                s.elements = fns.elements(eles, s.selector, s.spec);
            }
            s.children.forEach(function(child){
                match(s.elements, child);
            });      
        }

        match([document], page);
    }

    function resetAll(){
        fns.dispatch.Tree.reset();
        fns.dispatch.Page.reset();
        fns.dispatch.Selector.reset();
        fns.dispatch.Rule.reset();
        currentPage = undefined;
        page = undefined;
        selector = undefined;
    }

    function allSelects(elements){
        return elements.every(function(e){
            return e.tagName === "SELECT";
        });
    }

    var modal = previewModal(document.body);

    var fns = {
        elements: elementSelector(),
        loadPages: function(ps){
            pages = ps;
            var options = Object.keys(pages);
            ui.setPages(options);
        },
        loadPage: function(pageName){
            resetAll();
            if ( pages[pageName] ) {
                currentPage = pageName;
                page = pages[pageName];
                setupPage();
                ui.showView("Page");
            }
        },
        addPage: function(name){
            if ( pages[name] === undefined && legalPageName(name) ) {
                page = newPage(name);
                currentPage = name;
                pages[name] = page;
                setupPage();
                ui.showView("Page");
                // update options after adding page to pages
                var options = Object.keys(pages);
                ui.setPages(options, name);
                chromeSave(pages);
            }
        },
        renamePage: function(){
            if ( !currentPage ) {
                return;
            }
            var name = prompt("New Page Name\nCannot contain the following characters: < > : \" \\ / | ? *");
            var oldName = currentPage;
            if ( name === oldName ) {
                return;
            } else if ( pages[name] === undefined && legalPageName(name) ) {
                currentPage = name;
                pages[name] = page;
                delete pages[oldName];
                var options = Object.keys(pages);
                ui.setPages(options, name);
                chromeSave(pages);
            }
        },
        removePage: function(){
            delete pages[currentPage];
            currentPage = undefined;
            page = undefined;
            selector = undefined;
            resetAll();
            var options = Object.keys(pages);
            ui.setPages(options);
            chromeSave(pages);
        },
        upload: function(){
            if ( page ) {
                chromeUpload({
                    name: currentPage,
                    site: window.location.hostname,
                    page: page
                });
            }
        },
        setSelectorById: function(id){
            function find(sel, id){
                if ( sel.id === id ) {
                    selector = sel;
                    return true;
                }
                return sel.children.some(function(child){
                    return find(child, id);
                });
            }
            
            if ( !find(page, id) ) {
                selector = undefined;
            }
            fns.dispatch.Page.setSelector(selector);
        },
        setSelector: function(sel){
            selector = sel;
            fns.dispatch.Tree.draw(page, selector.id);
            chromeSave(pages);
        },
        getSelector: function(){
            return selector;
        },
        // add a selector as a child of the current selector
        addSelector: function(){
            var eles = fns.elements(selector.elements);
            fns.dispatch.Selector.setup(eles);
            fns.dispatch.Tree.turnOff();
            ui.showView("Selector");
        },
        cancelSelector: function(){
            fns.dispatch.Tree.turnOn();
            ui.showView("Page");
        },
        // remove the current selector and set the body to the current
        removeSelector: function(){

            function remove(sel, lid){
                if ( sel.id === lid ) {
                    return true;
                }
                var curr;
                for ( var i=0; i<sel.children.length; i++ ) {
                    curr = sel.children[i];
                    if ( remove(curr, lid) ) {
                        // remove the child and return
                        sel.children.splice(i, 1);
                        return;
                    }
                }
                return false;
            }
            if ( page.id === selector.id ) {
                // remove the page
                fns.removePage();
            } else {
                remove(page, selector.id);
                selector = page;
                fns.dispatch.Tree.draw(page, selector.id);
                fns.dispatch.Page.setSelector(selector);
            }
            chromeSave(pages);
        },
        saveSelector: function(sel){
            sel.id = ++lastId;

            // only save if page doesn't have 
            var collision = matchSelector(sel, selector);
            if ( collision.error ) {
                return collision;
            }
            sel.elements = fns.elements(selector.elements, sel.selector, sel.spec);
            // SPECIAL CASE FOR SELECT ELEMENTS, AUTOMATICALLY ADD OPTION CHILD
            if ( allSelects(sel.elements ) ) {
                var optionsName = prompt("What should the options be called?");
                if ( optionsName === null || optionsName.trim() === "" ) {
                    optionsName = "options";
                }
                var opts = newSelector("option", {
                    type: "name",
                    value: optionsName
                });
                opts.id = ++lastId;
                opts.elements = fns.elements(sel.elements, opts.selector, opts.spec);
                sel.children.push(opts);
            }
            selector.children.push(sel);
            selector = sel;
            ui.showView("Page");
            fns.dispatch.Tree.draw(page, selector.id);
            fns.dispatch.Page.setSelector(selector);
            chromeSave(pages);
            return true;
        },
        // add an Rule to the current selector
        addRule: function(){
            fns.dispatch.Rule.setElements(selector.elements);
            fns.dispatch.Tree.turnOff();
            ui.showView("Rule");
        },
        cancelRule: function(){
            fns.dispatch.Tree.turnOn();
            ui.showView("Page");
        },
        saveRule: function(rule){
            selector.rules.push(rule);
            fns.dispatch.Tree.draw(page, selector.id);
            fns.dispatch.Page.setSelector(selector);
            ui.showView("Page");
            chromeSave(pages);
        },
        eleCount: function(sel, spec){
            return fns.elements.count(selector.elements, sel, spec);
        },
        legalName: function(name){
            return !usedNames(page).some(function(n){
                return n === name;
            });
        },
        startSync: function(){
            // make a request for all saved pages for the domain
            chromeSync(window.location.hostname);
        },
        finishSync: function(newPages){
            for ( var key in newPages ) {
                pages[key] = newPages[key];
            }
            // refresh the ui
            if ( currentPage ) {
                fns.loadPage(currentPage);
            }
            var options = Object.keys(pages);
            ui.setPages(options, currentPage);

            chromeSave(pages);
        },
        preview: function(){
            if ( !page ) {
                return;
            }
            var text = preview(page);
            if ( !text ) {
                console.error("failed to generate preview");
            } else {
                modal(JSON.stringify(text, null, 2));
            }
        },
        setOptions: function(opts){
            fns.dispatch.Options.setOptions(opts);
        },
        showOptions: function(){
            fns.dispatch.Options.show();
        },
        close: function(){
            resetAll();
        },
        // used to interact with views
        dispatch: {},
    };

    return fns;
}