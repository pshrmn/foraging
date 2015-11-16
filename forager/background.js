/*
 * Forager background page
 */

/*
 * Verify that chrome.storage.local contains sites and options objetcs, creating
 * them if they don't already exist
 */
chrome.storage.local.get(null, storage => {
  if ( !storage.sites ) {
    chrome.storage.local.set({"sites": {}});
  }
  if ( !storage.options ) {
    chrome.storage.local.set({"options": {}});
  }
});

/*
 * inject forager's interface when the browserAction icon is clicked
 */
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.insertCSS(null, {file: "css/interface.css"});
  chrome.tabs.executeScript(null, {file: "lib/libs.js"}, () => {
    chrome.tabs.executeScript(null, {file: "bundle.js"});
  });
});

// the url for the Granary server
var url = "http://localhost:5000";

/*
 * interact with Granary server
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if ( message ) {
    switch ( message.type ) {
      case "upload":
        xhr("POST", `${url}/upload`, message.data, sendResponse);
        // return true so sendResponse does not become invalid
        // http://developer.chrome.com/extensions/runtime.html#event-onMessage
        return true;
      case "sync":
        xhr("GET", `${url}/sync`, {"domain": message.domain}, sendResponse);
        return true;
    }
  }
});

function jsonToParams(obj){
  var params = [];
  for ( var key in obj ) {
    params.push(key + "=" + obj[key]);
  }
  return params.join("&");
}

/*
 * basic ajax request that returns data from server on success, otherwise object with error=true
 *
 * @param type - the type of request
 * @param url - the url to send the request to
 * @param data - the data to send with the request
 * @param callback - a function to call when the request gets a response
 */
function xhr(type, url, data, callback){
  var req = new XMLHttpRequest();
  req.onload = function(event){
    var resp = JSON.parse(req.responseText);
    callback(resp);
  }
  req.onerror = function(event){
    callback({"error": true});
  }

  var params = jsonToParams(data);
  if ( type === "GET" ) {
    req.open("GET", `${url}/?${params}`);
    req.send();
  } else if ( type === "POST") {
    req.open("POST", url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);
  }
}
