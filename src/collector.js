var controller = collectorController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [SchemaView, "Schema", {
        height: 200
    }, true],
    [SelectorView, "Selector"],
    [AttributeView, "Attribute"]
]);

chromeLoad();
