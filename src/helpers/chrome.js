import { select } from './selection';
import { preparePages, clean } from './page'

/*
 * any time that the page is updated, the stored page should be updated
 */
export const save = page => {
  return new Promise((resolve, reject) => {
    if ( page === undefined ) {
      reject('No page to save');
    }
    const cleaned = clean(page);
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
      const host = window.location.hostname;
      storage.sites[host] = storage.sites[host] || {};
      storage.sites[host][cleaned.name] = cleaned;
      chrome.storage.local.set({'sites': storage.sites});
      resolve('Saved');
    });
  })
}

export const rename = (newName, oldName) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
      const host = window.location.hostname;
      const page = storage.sites[host][oldName];
      if ( page === undefined ) {
        reject(`No page named ${oldName} found`);
      }
      page.name = newName;
      storage.sites[host][newName] = page;
      delete storage.sites[host][oldName];
      chrome.storage.local.set({'sites': storage.sites});
      resolve(`Renamed "${oldName}" to "${newName}"`);
    });
  });
}

/*
 * remove the page with the given name from storage
 */
export const remove = name => {
  return new Promise((resolve, reject) => {
    if ( name === undefined ) {
      reject('No page to delete');
    }
    chrome.storage.local.get('sites', function saveSchemaChrome(storage){
      const host = window.location.hostname;
      delete storage.sites[host][name];
      chrome.storage.local.set({'sites': storage.sites});
      resolve(`Deleted page ${name}`);
    });
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
export const load = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('sites', function setupHostnameChrome(storage){
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
export const upload = page => {
  return new Promise((resolve, reject) => {
    if ( page === undefined ) {
      reject('No page to upload');
    }
    chrome.runtime.sendMessage(
      {
        type: 'upload',
        data: {
          name: page.name,
          site: window.location.hostname,
          page: JSON.stringify(clean(page))
        }
      },
      function uploadResponse(response) {
        if ( response.error ) {
          reject('Failed to upload page');
        } else {
          resolve(response);
        }
      }
    );

  });
};

export const sync = () => {
  return new Promise((resolve, reject) => {
    const host = window.location.hostname;
    chrome.runtime.sendMessage(
      {
        type: 'sync',
        site: host
      },
      function saveSyncedPages(response) {
        // figure out how to handle no response
        if ( response.error ) {
          reject('Failed to sync pages');
        } else {
          const syncedPages = response.pages;

          // merge the synced pages with the current pages and save them
          chrome.storage.local.get('sites', function mergeSyncedPagesChrome(storage){
            const currentPages = storage.sites[host] || {};
            const allPages = Object.assign({}, currentPages, syncedPages);
            storage.sites[host] = allPages;
            chrome.storage.local.set({'sites': storage.sites});

            const parsedPages = preparePages(allPages);
            resolve(parsedPages);
          });
        }
      }
    );
  });
};
