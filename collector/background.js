/*
CollectJS background page
*/

chrome.storage.local.get(null, function(storage) {
    if ( !storage.sites ) {
        chrome.storage.local.set({"sites": {}});
    }
    if ( !storage.options ) {
        chrome.storage.local.set({"options": {}});
    }
});

// inject collectjs interface when the browserAction icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.insertCSS(null, {file: "css/interface.css"});
    chrome.tabs.executeScript(null, {file: "lib/d3.js"}, function(){
        chrome.tabs.executeScript(null, {file: "collector.js"});
    });
});

var url = "http://localhost:5000/";

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if ( message ) {
        switch ( message.type ) {
            case "upload":
                xhr("POST", url + "upload",
                    JSON.stringify(message.data), sendResponse, true);
                // return true so sendResponse does not become invalid
                // http://developer.chrome.com/extensions/runtime.html#event-onMessage
                return true;
            case "sync":
                xhr("GET", url + "sync",
                    {"domain": message.domain}, sendResponse, false);
                return true;
        }
    }
});

// basic ajax request that returns data from server on success, otherwise object with error=true
function xhr(type, url, data, callback, isJSON){
    // url is the endpoint that you're uploading the collect rules to
    var xhr = new XMLHttpRequest();

    xhr.onload = function(event){
        var resp = JSON.parse(xhr.responseText);
        callback(resp);
    }
    xhr.onerror = function(event){
        callback({"error": true});
    }

    if ( type === "GET" ) {
        var params = [];
        for ( var key in data ) {
            params.push(key + "=" + data[key]);
        }

        xhr.open("GET", url + "?" + params.join("&"));
        xhr.send();
    } else if ( type === "POST") {
        
        xhr.open("POST", url);
        if ( isJSON ) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(data);
    }
}
