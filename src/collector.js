// build the ui
var ui = buildUI();
ui.addView(SchemaView, "Schema", {}, true);
ui.addView(AttributeView, "Attribute");

// load