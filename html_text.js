/*
 * Small script to get a page, evaluate its javascript, and log the raw html
 * of the current state of the page. If the requested page cannot be loaded,
 * log nothing.
 */

var webpage = require("webpage");
var system = require("system");

var args = system.args;
/*
 * args[0] - this file's name
 * args[1] - url to get
 * args[2] - user-agent string (optional)
 */
if ( args.length < 2 ) {
    phantom.exit();
}

var page = webpage.create();
page.settings.loadImages = false;
page.settings.diskCache = true;
if ( args[2] ) {
    page.settings.userAgent = args[2];
}

var url = args[1];
var wrong_url = false;
page.open(url, function(status){
    if ( status === "fail" || wrong_url ) {
        phantom.exit();
    }
    // the subprocess receives text that has been logged
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
    // this is a very basic script so when a redirect is detected, it just fails
    if ( response.url === url && response.status !== 200 ) {
        wrong_url = true;
    }
}