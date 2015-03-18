/***
Small script to get a page, evaluate its javascript, and log the raw html
of the current state of the page. If the requested page cannot be loaded,
log nothing.
***/

var webpage = require("webpage");
var system = require("system");

var page = webpage.create();
page.settings.loadImages = false;
page.settings.diskCache = true;

var args = system.args;
// first arg is this file's name, second is the url to get, third is an
// optional user-agent string
if ( args.length < 2 ) {
    phantom.exit();
}
var ua = args[2];
if ( ua ) {
    page.settings.userAgent = ua;
}

var url = args[1];
var wrong_url = false;
page.open(url, function(status){
    if ( status === "fail" || wrong_url ) {
        phantom.exit();
    }
    console.log(page.content);
    phantom.exit();
});

page.onResourceRequested = function(requestData, request) {
    // don't bother requesting files if this is the wrong page
    if ( wrong_url ) {
        request.abort();
    }
};

page.onResourceReceived = function(response){
    if ( response.url === url && response.status !== 200 ) {
        wrong_url = true;
    }
}