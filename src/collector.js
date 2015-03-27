var controller = collectorController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [PageView, "Page", {
        width: 500,
        height: 200
    }, true],
    [SelectorView, "Selector"],
    [AttributeView, "Attribute"]
]);

chromeLoad();
