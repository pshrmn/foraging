var controller = collectorController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [PageView, "Page", {}, true],
    [SelectorView, "Selector"],
    [AttributeView, "Attribute"]
]);

ui.addTree(TreeView, "Tree", {
    holder: ".page-tree",
    width: 500,
    height: 220,
    margin: {
        top: 5,
        right: 15,
        bottom: 5,
        left: 50
    }
});

chromeLoad();
