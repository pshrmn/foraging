import { select, setupPage, clean } from "./helpers";

/*
 * TODO: this will load pages and options from and save them to
 * chrome.storage.local
 * Pages are saved on a hostname basis, while options are global.
 *
 */

/*
 * any time that the page is updated, the new value should be saved
 */
export const chromeSave = pages => {
  let cleaned = cleanPages(pages);
  chrome.storage.local.get("sites", function saveSchemaChrome(storage){
    let host = window.location.hostname;
    storage.sites[host] = cleaned;
    chrome.storage.local.set({"sites": storage.sites});
  });
}

const cleanPages = pages => {
  return pages.filter(p => p !== undefined).map(page => clean(page));
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
export const chromeLoad = callback => {
  chrome.storage.local.get("sites", function setupHostnameChrome(storage){
    let host = window.location.hostname;
    let pages = storage.sites[host] || [];
    pages.forEach(p => setupPage(p));
    callback(pages);
  });
};

// takes a data object to be uploaded and passes it to the background page to handle
function chromeUpload(data) {
  data.page = JSON.stringify(cleanPage(data.page));
  chrome.runtime.sendMessage({type: 'upload', data: data});
}

function chromeSync(domain) {
  chrome.runtime.sendMessage({type: 'sync', domain: domain}, function(response){
    if ( response.error ) {
      return;
    }
    controller.finishSync(response.pages);
  });
}
