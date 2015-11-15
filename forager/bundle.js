/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _reactDom = __webpack_require__(1);

	var _Forager = __webpack_require__(2);

	var _Forager2 = _interopRequireDefault(_Forager);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// create an element to attach Forager to
	var holder = document.createElement("div");
	holder.classList.add("forager-holder");
	document.body.appendChild(holder);

	(0, _reactDom.render)(_react2.default.createElement(_Forager2.default, null), holder);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _Controls = __webpack_require__(4);

	var _Controls2 = _interopRequireDefault(_Controls);

	var _Frames = __webpack_require__(8);

	var _Frames2 = _interopRequireDefault(_Frames);

	var _Graph = __webpack_require__(13);

	var _Graph2 = _interopRequireDefault(_Graph);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Forager",

	  getInitialState: function getInitialState() {
	    // this is just being used for dev and should be removed once saving/loaded
	    // of pages is implemented
	    return {
	      pages: [undefined, {
	        name: "example 1",
	        selector: "body",
	        spec: {
	          type: "single",
	          value: 0
	        },
	        children: [],
	        rules: [{
	          name: "test",
	          attr: "text",
	          type: "string"
	        }]
	      }, {
	        name: "example 2",
	        selector: "body",
	        spec: {
	          type: "single",
	          value: 0
	        },
	        children: [],
	        rules: []
	      }],
	      pageIndex: 0
	    };
	  },
	  loadPage: function loadPage(index) {
	    this.setState({
	      pageIndex: index
	    });
	  },
	  addPage: function addPage(page) {
	    var pages = this.state.pages;
	    pages.push(page);
	    this.setState({
	      pages: pages,
	      pageIndex: pages.length - 1
	    });
	  },
	  /*
	   * remove the current page
	   */
	  removePage: function removePage() {
	    var _state = this.state;
	    var pages = _state.pages;
	    var pageIndex = _state.pageIndex;
	    // can't delete the empty page

	    if (pageIndex === 0) {
	      return;
	    }
	    pages.splice(pageIndex, 1);
	    this.setState({
	      pages: pages,
	      pageIndex: 0
	    });
	  },
	  renamePage: function renamePage(newName) {
	    var _state2 = this.state;
	    var pages = _state2.pages;
	    var pageIndex = _state2.pageIndex;

	    pages[pageIndex].name = newName;
	    this.setState({
	      pages: pages
	    });
	  },
	  render: function render() {
	    var _state3 = this.state;
	    var pages = _state3.pages;
	    var pageIndex = _state3.pageIndex;

	    var page = pages[pageIndex];
	    return _react2.default.createElement(
	      "div",
	      { className: "forager no-select", ref: "app" },
	      _react2.default.createElement(_Controls2.default, { pages: pages,
	        index: pageIndex,
	        loadPage: this.loadPage,
	        addPage: this.addPage,
	        removePage: this.removePage,
	        renamePage: this.renamePage }),
	      _react2.default.createElement(
	        "div",
	        { className: "workspace" },
	        _react2.default.createElement(_Frames2.default, { page: page }),
	        _react2.default.createElement(_Graph2.default, { page: page })
	      )
	    );
	  },
	  /*
	   * When choosing elements in the page, the selector uses a :not(.no-select)
	   * query to ignore certain elements. To make sure that no elements in the
	   * Forager app are selected, this function selects all child elements in the
	   * app and gives them the "no-select" class. This is done in lieu of manually
	   * setting className="no-select" on all elements (and handling cases where
	   * there are multiple classes on an element). Ideally a :not(.forager, .forager *)
	   * selector would exist, but this will have to do.
	   */
	  _makeNoSelect: function _makeNoSelect() {
	    [].slice.call(this.refs.app.querySelectorAll("*")).forEach(function (c) {
	      c.classList.add("no-select");
	    });
	  },
	  componentDidMount: function componentDidMount() {
	    // load the site's pages from chrome.storage.local and set the state
	    this._makeNoSelect();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    this._makeNoSelect();
	  }
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(5);

	var _helpers = __webpack_require__(6);

	var _page = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Controls",

	  render: function render() {
	    var _props = this.props;
	    var pages = _props.pages;
	    var index = _props.index;
	    var loadPage = _props.loadPage;
	    var addPage = _props.addPage;
	    var removePage = _props.removePage;
	    var renamePage = _props.renamePage;

	    return _react2.default.createElement(
	      "div",
	      { className: "controls" },
	      _react2.default.createElement(PageControls, { pages: pages,
	        index: index,
	        loadPage: loadPage,
	        addPage: addPage,
	        removePage: removePage,
	        renamePage: renamePage }),
	      _react2.default.createElement(GeneralControls, null)
	    );
	  }
	});

	var PageControls = _react2.default.createClass({
	  displayName: "PageControls",

	  getName: function getName() {
	    var name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \ / | ? * ");
	    if (!(0, _helpers.legalName)(name)) {
	      console.error("bad name", name);
	      return;
	    }
	    return name;
	  },
	  addHandler: function addHandler(event) {
	    event.preventDefault();
	    var name = this.getName();
	    if (name !== undefined) {
	      // report the new name
	      var newPage = (0, _page.createPage)(name);
	      this.props.addPage(newPage);
	    }
	  },
	  renameHandler: function renameHandler(event) {
	    event.preventDefault();
	    var curr = this.props.pages[this.props.index];
	    var name = this.getName();
	    if (name !== undefined && name !== curr.name) {
	      // set the new name
	      this.props.renamePage(name);
	    }
	  },
	  deleteHandler: function deleteHandler(event) {
	    event.preventDefault();
	    // report the current page index
	    this.props.removePage();
	  },
	  uploadHandler: function uploadHandler(event) {
	    event.preventDefault();
	    console.error("not yet implemented");
	  },
	  previewHandler: function previewHandler(event) {
	    event.preventDefault();
	    console.error("not yet implemented");
	  },
	  loadPage: function loadPage(event) {
	    this.props.loadPage(event.target.value);
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var pages = _props2.pages;
	    var index = _props2.index;

	    var options = pages.map(function (p, i) {
	      var text = p === undefined ? "" : p.name;
	      return _react2.default.createElement(
	        "option",
	        { key: i, value: i },
	        text
	      );
	    });
	    return _react2.default.createElement(
	      "div",
	      { className: "page-controls" },
	      "Page: ",
	      _react2.default.createElement(
	        "select",
	        { value: index,
	          onChange: this.loadPage },
	        options
	      ),
	      _react2.default.createElement(_Inputs.PosButton, { click: this.addHandler, text: "Add" }),
	      _react2.default.createElement(_Inputs.PosButton, { click: this.renameHandler, text: "Rename" }),
	      _react2.default.createElement(_Inputs.NegButton, { click: this.deleteHandler, text: "Delete" }),
	      _react2.default.createElement(_Inputs.PosButton, { click: this.uploadHandler, text: "Upload" }),
	      _react2.default.createElement(_Inputs.PosButton, { click: this.previewHandler, text: "Preview" })
	    );
	  }
	});

	var GeneralControls = _react2.default.createClass({
	  displayName: "GeneralControls",

	  handle: function handle(event) {
	    // do nothing
	    event.preventDefault();
	    console.error("not yet implemented");
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "app-controls" },
	      _react2.default.createElement(_Inputs.NeutralButton, { click: this.handle, text: "Sync" }),
	      _react2.default.createElement(_Inputs.NeutralButton, { click: this.handle, text: "Options" }),
	      _react2.default.createElement(_Inputs.NeutralButton, { click: this.handle, text: String.fromCharCode(215) })
	    );
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * Forager app specific input/form elements
	 */

	var PosButton = exports.PosButton = React.createClass({
	  displayName: "PosButton",

	  render: function render() {
	    var _props = this.props;
	    var text = _props.text;
	    var click = _props.click;

	    return React.createElement(
	      "button",
	      { className: "pos", onClick: click },
	      text
	    );
	  }
	});

	var NegButton = exports.NegButton = React.createClass({
	  displayName: "NegButton",

	  render: function render() {
	    var _props2 = this.props;
	    var text = _props2.text;
	    var click = _props2.click;

	    return React.createElement(
	      "button",
	      { className: "neg", onClick: click },
	      text
	    );
	  }
	});

	var NeutralButton = exports.NeutralButton = React.createClass({
	  displayName: "NeutralButton",

	  render: function render() {
	    var _props3 = this.props;
	    var text = _props3.text;
	    var click = _props3.click;

	    return React.createElement(
	      "button",
	      { className: "neutral", onClick: click },
	      text
	    );
	  }
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var legalName = exports.legalName = function legalName(name) {
	    if (name === null || name === "") {
	        return false;
	    }
	    var badCharacters = /[<>:"\/\\\|\?\*]/;
	    return name.match(badCharacters) === null;
	};

	/*
	 * check if an identical selector already exists or one with the same name
	 * exists
	 */
	var matchSelector = exports.matchSelector = function matchSelector(sel, parent) {
	    var selIndex = sel.spec.type === "single" ? sel.spec.value : undefined;
	    var msg = "";
	    var found = parent.children.some(function (s) {
	        if (sel.spec.type !== s.spec.type) {
	            return false;
	        }

	        switch (s.spec.type) {
	            case "single":
	                var index = s.spec.value;
	                if (s.selector === sel.selector && index === selIndex) {
	                    msg = "a selector with the same selector and index already exists";
	                    return true;
	                }
	                break;
	            case "all":
	                if (s.spec.value === sel.spec.value) {
	                    msg = "a selector with the name \"" + sel.spec.value + "\" already exists";
	                    return true;
	                }
	                break;
	        }
	        return false;
	    });

	    return {
	        error: found,
	        msg: msg
	    };
	};

	var abbreviate = exports.abbreviate = function abbreviate(text, max) {
	    if (text.length <= max) {
	        return text;
	    } else if (max <= 3) {
	        return "...";
	    }
	    // determine the length of the first and second halves of the text
	    var firstHalf;
	    var secondHalf;
	    var leftovers = max - 3;
	    var half = leftovers / 2;
	    if (leftovers % 2 === 0) {
	        firstHalf = half;
	        secondHalf = half;
	    } else {
	        firstHalf = Math.ceil(half);
	        secondHalf = Math.floor(half);
	    }

	    // splice correct amounts of text
	    var firstText = text.slice(0, firstHalf);
	    var secondText = secondHalf === 0 ? "" : text.slice(-secondHalf);
	    return firstText + "..." + secondText;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var createPage = exports.createPage = function createPage(name) {
	  return {
	    name: name,
	    selector: "body",
	    spec: {
	      type: "single",
	      value: 0
	    },
	    children: [],
	    rules: []
	  };
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _ViewFrame = __webpack_require__(9);

	var _ViewFrame2 = _interopRequireDefault(_ViewFrame);

	var _ElementFrame = __webpack_require__(10);

	var _ElementFrame2 = _interopRequireDefault(_ElementFrame);

	var _SelectorFrame = __webpack_require__(11);

	var _SelectorFrame2 = _interopRequireDefault(_SelectorFrame);

	var _SpecFrame = __webpack_require__(12);

	var _SpecFrame2 = _interopRequireDefault(_SpecFrame);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Frames",

	  render: function render() {
	    var _props = this.props;
	    var form = _props.form;
	    var page = _props.page;

	    var frame = null;
	    switch (form) {
	      case "selector":
	      default:
	        frame = _react2.default.createElement(_ViewFrame2.default, { page: page });
	        break;
	    }

	    return _react2.default.createElement(
	      "div",
	      { className: "frames" },
	      frame
	    );
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "ViewFrame",

	  addChild: function addChild(event) {
	    console.error("not yet implemented");
	  },
	  addRule: function addRule(event) {
	    console.error("not yet implemented");
	  },
	  remove: function remove(event) {
	    console.error("not yet implemented");
	  },
	  render: function render() {
	    var page = this.props.page;

	    if (page === undefined) {
	      return null;
	    }

	    var selector = page.selector;
	    var children = page.children;
	    var rules = page.rules;
	    var spec = page.spec;
	    var type = spec.type;
	    var value = spec.value;

	    var description = "";
	    if (type === "single") {
	      description = "Select element at index " + value;
	    } else if (type === "all") {
	      description = "Select all elements, save as \"" + value + "\"";
	    }

	    var rulesList = rules.length ? _react2.default.createElement(RuleList, { rules: rules }) : _react2.default.createElement(
	      "p",
	      null,
	      "No Rules"
	    );

	    return _react2.default.createElement(
	      "div",
	      { className: "frame selector-form" },
	      _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "h2",
	          null,
	          selector
	        ),
	        _react2.default.createElement(
	          "p",
	          null,
	          description
	        ),
	        rulesList,
	        _react2.default.createElement(_Inputs.PosButton, { text: "Add Child", click: this.addChild }),
	        _react2.default.createElement(_Inputs.PosButton, { text: "Add Rule", click: this.addRule }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Remove", click: this.remove })
	      )
	    );
	  }
	});

	var RuleList = _react2.default.createClass({
	  displayName: "RuleList",

	  render: function render() {
	    var rules = this.props.rules;

	    var list = rules.map(function (r, i) {
	      return _react2.default.createElement(Rule, _extends({ key: i }, r));
	    });

	    return _react2.default.createElement(
	      "ul",
	      null,
	      list
	    );
	  }
	});

	var Rule = _react2.default.createClass({
	  displayName: "Rule",

	  handleClick: function handleClick(event) {
	    console.error("not yet implemented");
	  },
	  render: function render() {
	    var _props = this.props;
	    var name = _props.name;
	    var attr = _props.attr;
	    var type = _props.type;

	    return _react2.default.createElement(
	      "li",
	      null,
	      _react2.default.createElement(
	        "span",
	        { className: "name" },
	        name
	      ),
	      " <",
	      attr,
	      "> (",
	      type,
	      ")",
	      _react2.default.createElement(
	        "button",
	        { onClick: this.handleClick },
	        String.fromCharCode(215)
	      )
	    );
	  }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "ElementFrame",

	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "frame element-form" },
	      _react2.default.createElement(
	        "h2",
	        null,
	        selector
	      ),
	      _react2.default.createElement(
	        "p",
	        null,
	        description
	      )
	    );
	  }
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "SelectorFrame",

	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "frame element-form" },
	      _react2.default.createElement(
	        "h2",
	        null,
	        selector
	      ),
	      _react2.default.createElement(
	        "p",
	        null,
	        description
	      )
	    );
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "SpecFrame",

	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "frame element-form" },
	      _react2.default.createElement(
	        "h2",
	        null,
	        selector
	      ),
	      _react2.default.createElement(
	        "p",
	        null,
	        description
	      )
	    );
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _d = __webpack_require__(14);

	var _d2 = _interopRequireDefault(_d);

	var _helpers = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * A tree rendering of the page, used to show the current page, the current
	 * selector, and to select a selector (for editing, adding children, or rules)
	 */
	exports.default = _react2.default.createClass({
	  displayName: "Graph",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      selectPage: function selectPage() {},
	      width: 300,
	      height: 150,
	      margin: {
	        top: 25,
	        right: 25,
	        bottom: 25,
	        left: 50
	      }
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      diagonal: _d2.default.svg.diagonal().projection(function (d) {
	        return [d.y, d.x];
	      })
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this._makeTreeLayout(this.props.width, this.props.height);
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var width = nextProps.width;
	    var height = nextProps.height;

	    if (width !== this.props.width || height !== this.props.height) {
	      this._makeTreeLayout(width, height);
	    }
	  },
	  _makeTreeLayout: function _makeTreeLayout(width, height) {
	    var tree = _d2.default.layout.tree().size([height, width]);
	    this.setState({
	      tree: tree
	    });
	  },
	  _makeNodes: function _makeNodes(page) {
	    // don't draw anything when there isn't a page
	    if (page === undefined) {
	      return null;
	    }

	    var _state = this.state;
	    var tree = _state.tree;
	    var diagonal = _state.diagonal;

	    // generate the tree's nodes and links

	    var nodes = tree.nodes(page);
	    var links = tree.links(nodes);
	    var paths = links.map(function (l, i) {
	      return _react2.default.createElement("path", { className: "link", d: diagonal(l) });
	    });

	    var selectors = nodes.map(function (n, i) {
	      return _react2.default.createElement(Node, _extends({ key: i }, n));
	    });

	    return _react2.default.createElement(
	      "g",
	      null,
	      paths,
	      selectors
	    );
	  },
	  render: function render() {
	    var _props = this.props;
	    var page = _props.page;
	    var width = _props.width;
	    var height = _props.height;
	    var margin = _props.margin;

	    var nodes = this._makeNodes(page);

	    return _react2.default.createElement(
	      "div",
	      { className: "graph" },
	      _react2.default.createElement(
	        "svg",
	        { width: margin.left + width + margin.right,
	          height: margin.top + height + margin.bottom },
	        _react2.default.createElement(
	          "g",
	          { transform: "translate(" + margin.left + "," + margin.top + ")" },
	          nodes
	        )
	      )
	    );
	  }
	});

	var Node = _react2.default.createClass({
	  displayName: "Node",

	  handleClick: function handleClick(event) {
	    event.preventDefault();
	    console.log("You are selecting a selector");
	  },
	  specText: function specText(spec, selector) {
	    var text = "";
	    if (!spec) {
	      return text;
	    }
	    switch (spec.type) {
	      case "single":
	        text = selector + "[" + spec.value + "]";
	        break;
	      case "all":
	        text = "[" + selector + "]";
	        break;
	    }
	    return (0, _helpers.abbreviate)(text, 15);
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var selector = _props2.selector;
	    var spec = _props2.spec;
	    var rules = _props2.rules;
	    var x = _props2.x;
	    var y = _props2.y;

	    var text = this.specText(spec, selector);
	    var marker = rules && rules.length ? _react2.default.createElement("rect", { width: "6", height: "6", x: "-3", y: "-3" }) : _react2.default.createElement("circle", { r: "3" });

	    return _react2.default.createElement(
	      "g",
	      { className: "node", onClick: this.handleClick, transform: "translate(" + y + "," + x + ")" },
	      _react2.default.createElement(
	        "text",
	        { y: "5", dx: "-5" },
	        text
	      ),
	      marker
	    );
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ }
/******/ ]);