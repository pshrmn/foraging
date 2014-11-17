/* functions that are related to the extension */
/* requires UI, rules.js, HTML, and CollectOptions */

// takes an object to save, the name of the site, and an optional schemaName
// if schemaName is provided, obj is a schema object to be saved
// otherwise obj is a site object
function chromeSave(obj, siteName, schemaName){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        if ( schemaName ) {
            storage.sites[siteName].schemas[schemaName] = obj;
        } else {
            storage.sites[siteName] = obj;
        }
        chrome.storage.local.set({"sites": storage.sites});
        // mark as dirty so that preview will be regenerated
        UI.dirty = true;
    });
}

// takes a data object to be uploaded and passes it to the background page to handle
function chromeUpload(data){
    chrome.runtime.sendMessage({type: 'upload', data: data});
}

/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        schemas:
            <name>:
                name: <name>,
                pages: {},
                urls: {}

urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

If the site object exists for a host, load the saved rules
*/
function chromeSetupHostname(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            siteObject = storage.sites[host];
        // default setup if page hasn't been visited before
        if ( !siteObject ) {
            CurrentSite = new Site(host);
            // save it right away
            CurrentSite.save();
        } else {
            CurrentSite = new Site(host, siteObject.schemas);
        }
        var siteHTML = CurrentSite.html();
        document.getElementById("schemaInfo").appendChild(siteHTML.topbar);
        document.getElementById("schemaHolder").appendChild(siteHTML.schema);
        CurrentSite.loadSchema("default");
    });
}

/***********************
    OPTIONS STORAGE
***********************/

function chromeLoadOptions(){
    chrome.storage.local.get("options", function loadOptionsChrome(storage){
        var input;
        CollectOptions = storage.options;
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
function chromeSetOptions(options){
    chrome.storage.local.set({"options": options});
}
