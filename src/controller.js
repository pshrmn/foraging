function collectorController(){
    var pages;
    var currentPage;
    // a list of all attr names in the page
    var pageAttrs = [];
    var page;
    var selector;

    var idCount = 0;
    var fns = {
        elements: elementSelector(),
        loadPages: function(ps){
            pages = ps;
            var options = [""].concat(Object.keys(pages));
            ui.setPages(options);
        },
        loadPage: function(pageName){
            currentPage = pageName;
            idCount = 0;
            page = pages[pageName];
            selector = page;
            fns.dispatch.Page.setPage(page);
            ui.showView("Page");
        },
        setVals: function(newPage, newSelector){
            currentPage = newPage.name;
            page = newPage;
            pages[currentPage] = page;
            selector = newSelector;
            chromeSave(pages);
        },
        addPage: function(name){
            if ( pages[name] === undefined && legalPageName(name) ) {
                pages[name] = newPage(name);
                ui.setPages([""].concat(Object.keys(pages)), name);
                fns.loadPage(name);
                chromeSave(pages);
            }
        },
        removePage: function(){
            delete pages[currentPage];
            //fns.setPage("default");
            ui.setPages([""].concat(Object.keys(pages)));
            fns.dispatch.Page.reset();
            chromeSave(pages);

        },
        nextId: function(){
            return idCount++;
        },
        getSelector: function(){
            return selector;
        },
        setSelector: function(d){
            selector = d;
        },
        saveSelector: function(sel){
            selector.children.push(sel);
            selector = sel;
            fns.dispatch.Page.setPage(page, selector);

            ui.showView("Page");
            chromeSave(pages);
        },
        eleCount: function(obj){
            return fns.elements.count(selector.elements, obj);
        },
        legalName: function(name){
            return !usedNames(page).some(function(n){
                return n === name;
            });
        },
        getPage: function(){
            return page;
        },
        isUrl: function(){
            var url = window.location.href;
            if ( page ) {
                return page.urls.some(function(curl){
                    return curl === url;
                });
            } else {
                return false;
            }
        },
        addChild: function(){
            var eles = fns.elements(selector.elements);
            fns.dispatch.Selector.setup(eles);
            ui.showView("Selector");
        },
        addAttr: function(){
            fns.dispatch.Attribute.setElements(selector.elements);
            ui.showView("Attribute");
        },
        saveAttr: function(attr){
            selector.attrs.push(attr);
            fns.dispatch.Page.setPage(page, selector);
            chromeSave(pages);
            ui.showView("Page");
        },
        save: function(){
            chromeSave(pages);
        },
        upload: function(){
            chromeUpload({
                name: currentPage,
                site: window.location.hostname,
                page: page
            });
        },
        events: {
            close: function(){
                fns.dispatch.Selector.reset();
                fns.dispatch.Page.reset();
                ui.close();
            }
        },
        // used to interact with views
        dispatch: {},
    };

    return fns;
}