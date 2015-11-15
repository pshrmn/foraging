/* functions that are related to the extension */

// save all of the pages for the site
export const chromeSave = pages => {
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        var host = window.location.hostname;
        storage.sites[host] = cleanPages(pages);
        chrome.storage.local.set({"sites": storage.sites});
    });
}

// takes a data object to be uploaded and passes it to the background page to handle
export const chromeUpload = data => {
    data.page = JSON.stringify(cleanPage(data.page));
    chrome.runtime.sendMessage({type: 'upload', data: data});
}

export const chromeSync = domain => {
    chrome.runtime.sendMessage({type: 'sync', domain: domain}, function(response){
        if ( response.error ) {
            return;
        }
        controller.finishSync(response.pages);
    });
}

/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        page: <page>

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
export const chromeLoadPages = () => {
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname;
        var pages = storage.sites[host] || {};
        controller.loadPages(pages);
    });
}

export const chromeLoadOptions = () => {
    chrome.storage.local.get("options", function loadOptionsChrome(storage){
        controller.setOptions(storage.options);
    });
}

export const chromeSaveOptions = opts => {
    chrome.storage.local.set({"options": opts});
}