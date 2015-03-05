// build the ui
var ui = buildUI();
ui.addViews([
    [SchemaView, "Schema", {
        height: 200
    }, true],
    [AttributeView, "Attribute"]
]);

// load or create schema for url
var SiteSchemas;
// not sure if this will be necessary
var CurrentSite;
chromeLoad();
