import { select } from "./selection";
import { clean, setupPage } from "./page"

/*
 * any time that the page is updated, the stored page should be updated
 */
export const chromeSave = page => {
  if ( page === undefined ) {
    return;
  }
  let cleaned = clean(page);
  chrome.storage.local.get("sites", function saveSchemaChrome(storage){
    let host = window.location.hostname;
    // replace the updated page, keeping the rest the same
    storage.sites[host] = storage.sites[host].map(s => ( s.name === cleaned.name ) ? cleaned : s);
    chrome.storage.local.set({"sites": storage.sites});
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
export const chromeLoad = callback => {
  chrome.storage.local.get("sites", function setupHostnameChrome(storage){
    let host = window.location.hostname;
    let pages = storage.sites[host] || [];
    pages.forEach(p => setupPage(p));
    callback(pages);
  });
};

/*
 * formats the page and sends it to the background script, which will upload it to the server
 */
export const chromeUpload = page => {
  if ( page === undefined ) {
    return;
  }
  chrome.runtime.sendMessage({
    type: "upload",
    data: {
      name: page.name,
      site: window.location.hostname,
      page: JSON.stringify(clean(page))
    }
  }); 
}