/* functions that are related to the extension */

// takes an object to save, the name of the site, and an optional schemaName
// if schemaName is provided, obj is a schema object to be saved
// otherwise obj is a site object
function chromeSave(schemas, host){
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
        storage.sites[host] = schemas;
        chrome.storage.local.set({"sites": storage.sites});
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
function chromeLoad(){
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
        var host = window.location.hostname,
            siteObject = storage.sites[host];
        SiteSchemas = siteObject ?
            siteObject :
            {
                default: newSchema("default")
            };
        SiteSchemas = generateIds(SiteSchemas);
        CurrentSite = "default";
        ui.loadSchema(SiteSchemas.default, "default");
        chromeSave(SiteSchemas, host);
    });
}

/***********************
    OPTIONS STORAGE
***********************/
/*
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
*/