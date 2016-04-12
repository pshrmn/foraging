import { select } from "./selection";
import { preparePages, clean } from "./page"

/*
 * any time that the page is updated, the stored page should be updated
 */
export const chromeSave = page => {
  if ( page === undefined ) {
    return;
  }
  const cleaned = clean(page);
  chrome.storage.local.get("sites", function saveSchemaChrome(storage){
    const host = window.location.hostname;
    storage.sites[host] = storage.sites[host] || {};
    storage.sites[host][cleaned.name] = cleaned;
    chrome.storage.local.set({"sites": storage.sites});
  });
}

export const chromeRename = (newName, oldName) => {
  chrome.storage.local.get("sites", function saveSchemaChrome(storage){
    const host = window.location.hostname;
    const page = storage.sites[host][oldName];
    page.name = newName;
    storage.sites[host][newName] = page;
    delete storage.sites[host][oldName];
    chrome.storage.local.set({"sites": storage.sites});
  });
}

/*
 * remove the page with the given name from storage
 */
export const chromeDelete = name => {
  if ( name === undefined ) {
    return;
  }
  chrome.storage.local.get("sites", function saveSchemaChrome(storage){
    const host = window.location.hostname;
    delete storage.sites[host][name];
    chrome.storage.local.set({"sites": storage.sites});
  });
}

/*
creates an object representing a site and saves it to chrome.storage.local
the object is:
    host:
        site: <hostname>
        page: <page>

If the site object exists for a host, load the saved rules
*/
export const chromeLoad = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("sites", function setupHostnameChrome(storage){
      const host = window.location.hostname;
      const current = storage.sites[host] || {};
      const pages = preparePages(current);
      resolve(pages);
    });
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
};

export const chromeSync = () => {
  return new Promise((resolve, reject) => {
    const host = window.location.hostname;
    chrome.runtime.sendMessage(
      {
        type: "sync",
        site: host
      },
      function saveSyncedPages(response) {
        // figure out how to handle no response
        if ( response.error ) {
          reject('Failed to sync pages');
        } else {
          const syncedPages = response.pages;

          chrome.storage.local.get("sites", function mergeSyncedPagesChrome(storage){
            const currentPages = storage.sites[host] || {};
            // merge the synced pages with the current pages and save them
            const allPages = Object.assign({}, currentPages, syncedPages);
            storage.sites[host] = allPages;
            chrome.storage.local.set({"sites": storage.sites});

            const parsedPages = preparePages(allPages);
            resolve(parsedPages);
          });
        }
      }
    );
    
  })
};
