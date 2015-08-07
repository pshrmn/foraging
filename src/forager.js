var controller = foragerController();

// build the ui
var ui = buildUI(controller);
ui.addViews([
    [PageView, "Page", {}, true],
    [SelectorView, "Selector"],
    [RuleView, "Rule"]
]);

ui.addTree(TreeView, "Tree", {});
ui.addOptions(OptionsView, "Options", {});
ui.addPreview(PreviewView, "Preview", {});
chromeLoadPages();
chromeLoadOptions();
