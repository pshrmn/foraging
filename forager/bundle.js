webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(37);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactRedux = __webpack_require__(184);

	var _Forager = __webpack_require__(224);

	var _Forager2 = _interopRequireDefault(_Forager);

	var _actions = __webpack_require__(238);

	var _chrome = __webpack_require__(285);

	var _attributes = __webpack_require__(276);

	var _store = __webpack_require__(286);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// the foraging class adds a margin to the bottom of the page, which
	// is helpful in preventing the app from overlapping content
	{
	  document.body.classList.add('foraging');
	  (0, _attributes.stripEvents)(document.body);
	  Array.from(document.querySelectorAll("*")).forEach(function (e) {
	    (0, _attributes.stripEvents)(e);
	  });
	}

	/*
	 * check if the forager holder exists. If it doesn't, mount the app. If it does,
	 * check if the app is hidden. If it is hidden, show it.
	 */
	if (!document.querySelector('.forager-holder')) {
	  // create the element that will hold the app
	  var holder = document.createElement('div');
	  holder.classList.add('forager-holder');
	  document.body.appendChild(holder);

	  var store = (0, _store2.default)();

	  // remove any event (on*) attributes on load

	  (0, _chrome.load)().then(function (pages) {
	    store.dispatch((0, _actions.setPages)(pages));
	    _reactDom2.default.render(_react2.default.createElement(
	      _reactRedux.Provider,
	      { store: store },
	      _react2.default.createElement(_Forager2.default, null)
	    ), holder);
	  });
	  // a function to re-show the app if it has been closed
	  window.restore = function () {
	    if (!store.getState().show) {
	      store.dispatch((0, _actions.openForager)());
	    }
	  };
	} else {
	  document.body.classList.add('foraging');
	  window.restore();
	}

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Controls = __webpack_require__(225);

	var _Controls2 = _interopRequireDefault(_Controls);

	var _Frames = __webpack_require__(243);

	var _Frames2 = _interopRequireDefault(_Frames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Forager = function Forager(_ref) {
	  var show = _ref.show;
	  return !show ? null : _react2.default.createElement(
	    'div',
	    { id: 'forager' },
	    _react2.default.createElement(_Controls2.default, null),
	    _react2.default.createElement(_Frames2.default, null)
	  );
	};

	Forager.propTypes = {
	  show: _react2.default.PropTypes.bool.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    show: state.show
	  };
	})(Forager);

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Buttons = __webpack_require__(226);

	var _MessageBoard = __webpack_require__(227);

	var _MessageBoard2 = _interopRequireDefault(_MessageBoard);

	var _text = __webpack_require__(228);

	var _selection = __webpack_require__(229);

	var _page = __webpack_require__(231);

	var _expiringReduxMessages = __webpack_require__(232);

	var _actions = __webpack_require__(238);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function promptName() {
	  return window.prompt('Page Name:\nCannot contain the following characters: < > : \' \\ / | ? * ');
	}

	function pageNames(pages) {
	  return pages.filter(function (p) {
	    return p !== undefined;
	  }).map(function (p) {
	    return p.name;
	  });
	}

	var Controls = function (_React$Component) {
	  _inherits(Controls, _React$Component);

	  function Controls(props) {
	    _classCallCheck(this, Controls);

	    var _this = _possibleConstructorReturn(this, (Controls.__proto__ || Object.getPrototypeOf(Controls)).call(this, props));

	    _this.addHandler = _this.addHandler.bind(_this);
	    _this.renameHandler = _this.renameHandler.bind(_this);
	    return _this;
	  }

	  _createClass(Controls, [{
	    key: 'addHandler',
	    value: function addHandler() {
	      var _props = this.props,
	          pages = _props.pages,
	          showMessage = _props.showMessage,
	          addPage = _props.addPage;

	      var name = promptName();
	      if (!(0, _text.validName)(name, pageNames(pages))) {
	        showMessage('Cannot Use Name: "' + name + '"', 5000, -1);
	      } else {
	        var body = (0, _page.createElement)('body');
	        // initial values for the body element
	        body = Object.assign({}, body, {
	          index: 0,
	          parent: null,
	          matches: [document.body]
	        });

	        addPage({
	          name: name,
	          elements: [body]
	        });
	      }
	    }
	  }, {
	    key: 'renameHandler',
	    value: function renameHandler() {
	      var name = promptName();
	      var _props2 = this.props,
	          pages = _props2.pages,
	          showMessage = _props2.showMessage,
	          renamePage = _props2.renamePage;
	      // do nothing if the user cancels, does not enter a name, or enter the same name as the current one

	      if (!(0, _text.validName)(name, pageNames(pages))) {
	        showMessage('Cannot Use Name: "' + name + '"', 5000, -1);
	      } else {
	        renamePage(name);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props3 = this.props,
	          pages = _props3.pages,
	          currentIndex = _props3.currentIndex,
	          selectPage = _props3.selectPage,
	          uploadPage = _props3.uploadPage,
	          showPreview = _props3.showPreview,
	          refreshMatches = _props3.refreshMatches,
	          syncPages = _props3.syncPages,
	          removePage = _props3.removePage,
	          closeForager = _props3.closeForager;

	      var active = currentIndex !== 0;
	      return _react2.default.createElement(
	        'div',
	        { className: 'topbar' },
	        _react2.default.createElement(
	          'div',
	          { className: 'controls' },
	          _react2.default.createElement(
	            'div',
	            { className: 'page-controls' },
	            'Page ',
	            _react2.default.createElement(
	              'select',
	              {
	                value: currentIndex,
	                onChange: function onChange(event) {
	                  selectPage(parseInt(event.target.value, 10));
	                } },
	              pages.map(function (p, i) {
	                return _react2.default.createElement(
	                  'option',
	                  { key: i, value: i },
	                  p === undefined ? '' : p.name
	                );
	              })
	            ),
	            _react2.default.createElement(_Buttons.PosButton, {
	              text: 'Add Page',
	              click: this.addHandler }),
	            _react2.default.createElement(_Buttons.NeutralButton, {
	              text: 'Refresh',
	              title: 'Refresh the list of matched elements. This is useful if more content has been dynamically loaded',
	              click: function click() {
	                refreshMatches();
	              },
	              disabled: !active }),
	            _react2.default.createElement(_Buttons.PosButton, {
	              text: 'Preview',
	              click: function click() {
	                showPreview();
	              },
	              disabled: !active }),
	            _react2.default.createElement(_Buttons.NegButton, {
	              text: 'Delete',
	              click: function click() {
	                removePage();
	              },
	              disabled: !active }),
	            _react2.default.createElement(_Buttons.PosButton, {
	              text: 'Rename',
	              click: this.renameHandler,
	              disabled: !active }),
	            _react2.default.createElement(_Buttons.PosButton, {
	              text: 'Upload',
	              click: function click() {
	                uploadPage();
	              },
	              disabled: !active }),
	            _react2.default.createElement(_Buttons.PosButton, {
	              text: 'Sync Pages',
	              click: function click() {
	                syncPages();
	              } })
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'app-controls' },
	            _react2.default.createElement(_Buttons.NegButton, {
	              text: String.fromCharCode(215),
	              classes: ['transparent'],
	              click: function click() {
	                document.body.classList.remove('foraging');
	                closeForager();
	              } })
	          )
	        ),
	        _react2.default.createElement(_MessageBoard2.default, null)
	      );
	    }
	  }]);

	  return Controls;
	}(_react2.default.Component);

	Controls.propTypes = {
	  currentIndex: _react2.default.PropTypes.number.isRequired,
	  pages: _react2.default.PropTypes.array,
	  addPage: _react2.default.PropTypes.func.isRequired,
	  selectPage: _react2.default.PropTypes.func.isRequired,
	  closeForager: _react2.default.PropTypes.func.isRequired,
	  showMessage: _react2.default.PropTypes.func.isRequired,
	  syncPages: _react2.default.PropTypes.func.isRequired,
	  refreshMatches: _react2.default.PropTypes.func.isRequired,
	  renamePage: _react2.default.PropTypes.func.isRequired,
	  removePage: _react2.default.PropTypes.func.isRequired,
	  uploadPage: _react2.default.PropTypes.func.isRequired,
	  showPreview: _react2.default.PropTypes.func.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages,
	      pageIndex = page.pageIndex;

	  return {
	    currentIndex: pageIndex,
	    pages: pages
	  };
	}, {
	  addPage: _actions.addPage,
	  selectPage: _actions.selectPage,
	  closeForager: _actions.closeForager,
	  showMessage: _expiringReduxMessages.showMessage,
	  syncPages: _actions.syncPages,
	  refreshMatches: _actions.refreshMatches,
	  renamePage: _actions.renamePage,
	  removePage: _actions.removePage,
	  uploadPage: _actions.uploadPage,
	  showPreview: _actions.showPreview
	})(Controls);

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.NeutralButton = exports.NegButton = exports.PosButton = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var PosButton = function PosButton(_ref) {
	  var classes = _ref.classes,
	      rest = _objectWithoutProperties(_ref, ['classes']);

	  return _react2.default.createElement(NeutralButton, _extends({}, rest, {
	    classes: ['pos'].concat(classes) }));
	};

	exports.PosButton = PosButton;
	var NegButton = function NegButton(_ref2) {
	  var classes = _ref2.classes,
	      rest = _objectWithoutProperties(_ref2, ['classes']);

	  return _react2.default.createElement(NeutralButton, _extends({}, rest, {
	    classes: ['neg'].concat(classes) }));
	};

	exports.NegButton = NegButton;
	var defaultClick = function defaultClick() {};

	var NeutralButton = exports.NeutralButton = function NeutralButton(props) {
	  var _props$text = props.text,
	      text = _props$text === undefined ? '' : _props$text,
	      _props$click = props.click,
	      click = _props$click === undefined ? defaultClick : _props$click,
	      _props$classes = props.classes,
	      classes = _props$classes === undefined ? [] : _props$classes,
	      _props$title = props.title,
	      title = _props$title === undefined ? '' : _props$title,
	      _props$disabled = props.disabled,
	      disabled = _props$disabled === undefined ? false : _props$disabled,
	      _props$type = props.type,
	      type = _props$type === undefined ? 'button' : _props$type;


	  return _react2.default.createElement(
	    'button',
	    {
	      className: classes.join(' '),
	      title: title,
	      disabled: disabled,
	      type: type,
	      onClick: click },
	    text
	  );
	};

	NeutralButton.propTypes = {
	  text: _react2.default.PropTypes.string,
	  click: _react2.default.PropTypes.func,
	  classes: _react2.default.PropTypes.array,
	  title: _react2.default.PropTypes.string,
	  disabled: _react2.default.PropTypes.bool,
	  type: _react2.default.PropTypes.string
	};

	PosButton.propTypes = NeutralButton.propTypes;
	NegButton.propTypes = NeutralButton.propTypes;

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MessageBoard = function MessageBoard(_ref) {
	  var messages = _ref.messages;
	  return _react2.default.createElement(
	    'div',
	    { className: 'message-board' },
	    messages.map(function (m) {
	      return _react2.default.createElement(Message, { key: m.id, message: m.message, rating: m.rating });
	    })
	  );
	};

	MessageBoard.propTypes = {
	  messages: _react2.default.PropTypes.array.isRequired
	};

	function Message(props) {
	  var message = props.message,
	      rating = props.rating;

	  var classes = ['message'];
	  if (rating < 0) {
	    classes.push('neg');
	  } else if (rating > 0) {
	    classes.push('pos');
	  }
	  return _react2.default.createElement(
	    'div',
	    { className: classes.join(' ') },
	    message
	  );
	}

	Message.propTypes = {
	  message: _react2.default.PropTypes.string,
	  rating: _react2.default.PropTypes.number
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    messages: state.messages
	  };
	})(MessageBoard);

/***/ }),
/* 228 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.describeSpec = describeSpec;
	exports.shortElement = shortElement;
	var validName = exports.validName = function validName(name) {
	  var takenNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	  if (name === null || name === '') {
	    return false;
	  }
	  var badCharacters = /[<>:'\/\\\|\?\*]/;
	  if (name.match(badCharacters) !== null) {
	    return false;
	  }
	  return takenNames.every(function (tn) {
	    return tn !== name;
	  });
	};

	var abbreviate = exports.abbreviate = function abbreviate(text, max) {
	  if (text.length <= max) {
	    return text;
	  } else if (max <= 3) {
	    return '...';
	  }
	  // determine the length of the first and second halves of the text
	  var firstHalf = void 0;
	  var secondHalf = void 0;
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
	  var secondText = secondHalf === 0 ? '' : text.slice(-secondHalf);
	  return firstText + '...' + secondText;
	};

	/*
	 * return a string describing what a spec captures
	 */
	function describeSpec() {
	  var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  switch (spec.type) {
	    case 'single':
	      return describeSingle(spec);
	    case 'all':
	      return describeAll(spec);
	    case 'range':
	      return describeRange(spec);
	    default:
	      return '';
	  }
	}

	function describeSingle(spec) {
	  var _spec$index = spec.index,
	      index = _spec$index === undefined ? 0 : _spec$index;

	  return 'captures element at index ' + index;
	}

	function describeAll(spec) {
	  var _spec$name = spec.name,
	      name = _spec$name === undefined ? '' : _spec$name;

	  return 'captures all elements, groups them as "' + name + '"';
	}

	function describeRange(spec) {
	  var _spec$name2 = spec.name,
	      name = _spec$name2 === undefined ? '' : _spec$name2,
	      low = spec.low,
	      high = spec.high;

	  var highText = high === null ? 'end' : high;
	  return 'captures elements ' + low + ' to ' + highText + ', groups them as "' + name + '"';
	}

	/*
	 * an abbreviated way of describing an element depending on its spec
	 */
	function shortElement(selector, spec) {
	  var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var shortSelector = abbreviate(selector, 10);
	  var text = '';

	  if (!spec) {
	    return shortSelector;
	  }

	  switch (spec.type) {
	    case 'single':
	      text = shortSelector + '[' + spec.index + ']';
	      break;
	    case 'all':
	      text = '[' + shortSelector + ']';
	      break;
	    case 'range':
	      text = shortSelector + '[' + spec.low + ':' + (spec.high || 'end') + ']';
	  }
	  if (optional) {
	    text += '*';
	  }
	  return text;
	}

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.allSelect = exports.parts = exports.count = exports.select = exports.protect = undefined;

	var _CSSClasses = __webpack_require__(230);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/*
	 * add the no-select class to all elements that are selected by the selector
	 * as well as all of those elements' children
	 */
	var protect = exports.protect = function protect(selector) {
	  var roots = document.querySelectorAll(selector);
	  Array.from(roots).forEach(function (element) {
	    element.classList.add('no-select');
	    Array.from(element.querySelectorAll('*')).forEach(function (c) {
	      c.classList.add('no-select');
	    });
	  });
	};

	/*
	 * select
	 * ------
	 * Returns an array of elements that are children of the parent elements and
	 * match the selector.
	 *
	 * @param parents - an array of parent elements to search using the selector
	 * @param selector - the selector to use to match children of the parent elements
	 * @param spec - how to select the child element or elements of a parent element
	 * @param ignored - a selector that when an element has it, the element and all
	 *    of its descendents should be given the 'no-select' class.
	 */
	var select = exports.select = function select(parents, selector, spec, ignored) {
	  var sel = (selector || '*') + ':not(.no-select)';
	  if (!spec) {
	    spec = {
	      type: 'all'
	    };
	  }
	  if (ignored !== undefined && ignored !== '') {
	    protect(ignored);
	  }

	  // select the elements from each parent element
	  var childElements = Array.from(parents).reduce(function (arr, p) {
	    var children = p.querySelectorAll(sel);
	    var _spec = spec,
	        type = _spec.type;

	    var elements = [];
	    switch (type) {
	      case 'single':
	        var index = spec.index;
	        elements = children[index] !== undefined ? [children[index]] : [];
	        break;
	      case 'all':
	        elements = Array.from(children);
	        break;
	      case 'range':
	        var low = spec.low;
	        var high = spec.high || undefined; // slice undefined, not null
	        elements = Array.from(children).slice(low, high);
	        break;
	    }
	    return arr.concat(elements);
	  }, []);
	  return [].concat(_toConsumableArray(new Set(childElements)));
	};

	/*
	 * count
	 * ------
	 * Returns the max number of child elements that the selector matches per parent
	 *
	 * @param parents - an array of parent elements to search using the selector
	 * @param selector - the selector to use to match children of the parent elements
	 * @param spec - how to select the child element or elements of a parent element
	 */
	var count = exports.count = function count(parents, selector) {
	  var spec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { type: 'all' };

	  var sel = (selector || '*') + ':not(.no-select)';
	  return Array.from(parents).reduce(function (top, p) {
	    var children = p.querySelectorAll(sel);
	    var count = 0;
	    switch (spec.type) {
	      case 'single':
	        var index = spec.index;
	        count = children[index] !== undefined ? 1 : 0;
	        break;
	      case 'all':
	        count = children.length;
	        break;
	      case 'range':
	        var low = spec.low;
	        var high = spec.high;
	        count = Array.from(children).slice(low, high || undefined).length;
	        break;
	    }

	    return top > count ? top : count;
	  }, 0);
	};

	/*
	 * parts
	 * -------------
	 * Returns an array of strings that can be used as CSS selectors to select the element.
	 * Element tags are converted to lowercase, ids are preceded by a '#' and classes are
	 * preceded by a '.'
	 *
	 * @param element - the element to analyze
	 */
	var parts = exports.parts = function parts(element) {
	  // const skipTags = [];
	  var skipClasses = [_CSSClasses.currentSelector, _CSSClasses.potentialSelector, _CSSClasses.queryCheck, _CSSClasses.hoverClass, _CSSClasses.savedPreview];
	  var classRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
	  // const tagAllowed = tag => !skipTags.some(st => st === tag);
	  var classAllowed = function classAllowed(c) {
	    return !skipClasses.some(function (sc) {
	      return sc === c;
	    }) && classRegex.test(c);
	  };

	  var pieces = [];
	  var tag = element.tagName.toLowerCase();
	  // if the tag isn't allowed, return an empty array
	  /*
	  // TODO: not re-implemented, should it be?
	  if ( !tagAllowed(tag) ) {
	    return [];
	  }
	  */
	  pieces.push(tag);

	  // id
	  if (element.id !== '' && validID(element.id)) {
	    pieces.push('#' + element.id);
	  }

	  // classes
	  Array.from(element.classList).forEach(function (c) {
	    if (classAllowed(c)) {
	      pieces.push('.' + c);
	    }
	  });
	  return pieces;
	};

	/*
	 * querySelectorAll requires ids to start with an alphabet character
	 */
	function validID(id) {
	  var firstChar = id.charCodeAt(0);
	  // A=65, Z=90, a=97, z=122
	  return !(firstChar < 65 || firstChar > 90 && firstChar < 97 || firstChar > 122);
	}

	/*
	 * check if all elements matched by the selector are 'select' elements
	 */
	var allSelect = exports.allSelect = function allSelect(s) {
	  return s.every(function (ele) {
	    return ele.tagName === 'SELECT';
	  });
	};

/***/ }),
/* 230 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var currentSelector = exports.currentSelector = 'current-element';
	var potentialSelector = exports.potentialSelector = 'selectable-element';
	var queryCheck = exports.queryCheck = 'query-check';
	var hoverClass = exports.hoverClass = 'forager-highlight';
	var savedPreview = exports.savedPreview = 'saved-preview';

/***/ }),
/* 231 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.levelNames = levelNames;
	var createElement = exports.createElement = function createElement(selector) {
	  var spec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'single', index: 0 };
	  var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	  return {
	    selector: selector,
	    spec: spec,
	    childIndices: [],
	    rules: [],
	    optional: optional,
	    matches: []
	  };
	};

	/*
	 * Iterate over the array of page tree, setting each up for use
	 * in the app
	 */
	var preparePages = exports.preparePages = function preparePages(pages) {
	  var preppedPages = Object.keys(pages).map(function (key) {
	    return pages[key];
	  }).filter(function (p) {
	    return p !== null;
	  }).map(function (p) {
	    return {
	      name: p.name,
	      elements: flatten(p.element)
	    };
	  });
	  return preppedPages;
	};

	/*
	 * flatten a page object's nested selectors into an array. each item
	 * has three additional properties: index (the same as the index in
	 * the array), parent (the index of the parent selector in the array),
	 * and childIndices (the index values of child selectors in the array)
	 */
	var flatten = exports.flatten = function flatten(pageTree) {
	  if (pageTree === undefined) {
	    return [];
	  }
	  var index = 0;

	  // pageTree is the root element
	  var breadth = [Object.assign({}, pageTree, {
	    parent: null,
	    childIndices: []
	  })];

	  while (index < breadth.length) {
	    var current = breadth[index];
	    current.index = index;

	    // add reference to child in parent element
	    if (current.parent !== null) {
	      breadth[current.parent].childIndices.push(index);
	    }

	    // add all child elements to the breadth array
	    current.children.forEach(function (c) {
	      breadth.push(Object.assign({}, c, {
	        parent: index,
	        childIndices: []
	      }));
	    });
	    delete current.children;
	    index += 1;
	  }
	  return breadth;
	};

	/*
	 * return a version of the page with elements as a tree for saving/uploading
	 */
	var clean = exports.clean = function clean(page) {
	  return {
	    name: page.name,
	    element: fullGrow(page.elements)
	  };
	};

	/*
	 * create a tree for saving a page
	 */
	var fullGrow = exports.fullGrow = function fullGrow(elementArray) {
	  var cleanElements = elementArray.map(function (e) {
	    if (e === null) {
	      return null;
	    }
	    return {
	      selector: e.selector,
	      spec: Object.assign({}, e.spec),
	      children: [],
	      rules: e.rules.map(function (r) {
	        return Object.assign({}, r);
	      }),
	      optional: e.optional,
	      // preserve for tree building
	      parent: e.parent
	    };
	  });
	  cleanElements.forEach(function (e) {
	    if (e === null) {
	      return;
	    }
	    var parent = e.parent;
	    delete e.parent;
	    if (parent === null) {
	      return;
	    }
	    cleanElements[parent].children.push(e);
	  });
	  // return the root
	  return cleanElements[0];
	};

	/*
	 * create a tree for an array of elements with only the properties needed for
	 * drawing and interacting with the tree
	 */
	var simpleGrow = exports.simpleGrow = function simpleGrow(elementArray) {
	  var cleanElements = elementArray.map(function (e) {
	    if (e === null) {
	      return null;
	    }
	    return {
	      selector: e.selector,
	      spec: Object.assign({}, e.spec),
	      hasRules: e.rules.length > 0,
	      children: [],
	      index: e.index,
	      parent: e.parent,
	      matches: e.matches,
	      optional: e.optional
	    };
	  });

	  cleanElements.forEach(function (e) {
	    if (e === null || e.parent === null) {
	      return;
	    }
	    cleanElements[e.parent].children.push(e);
	  });
	  // determine hasChildren based on its children array, not childIndices
	  cleanElements.forEach(function (e) {
	    if (e === null) {
	      return;
	    }
	    e.hasChildren = e.children.length > 0;
	  });
	  return cleanElements[0];
	};

	/*
	 * Return a list of names in the same level as the current element
	 *
	 * For example, given the below rules:
	 * {
	 *   'foo': '',
	 *   'bar': 7,
	 *   'baz': {
	 *     'quux': 3.14
	 *   }
	 * }
	 *
	 * The names 'foo', 'bar', and 'baz' are in the same level. The name 'quux' is
	 * in a separate level.
	 *
	 * This is useful for verifying that a rule or spec name is not a duplicate.
	 */
	function levelNames(elements, currentIndex) {
	  // find the root element for the current level. This will either be an element
	  // with a spec name or the root element of the whole tree
	  function searchForRoot(element) {
	    // this shouldn't happen
	    if (element === null) {
	      return null;
	    }
	    // stop when the element's spec has a name property or if the
	    // element has no parent
	    if (element.spec.name !== undefined || element.parent === null) {
	      return element.index;
	    } else {
	      return searchForRoot(elements[element.parent]);
	    }
	  }
	  var rootIndex = searchForRoot(elements[currentIndex]);
	  return childNames(elements, rootIndex, true);
	}

	function childNames(elements, index, isRoot) {
	  var current = elements[index];
	  var takenNames = [];
	  if (current === undefined) {
	    return [];
	  }

	  // when there is a spec name, any of that element and its childrens
	  // rules will be in another level. Do not do this for the root element.
	  if (!isRoot && current.spec.name !== undefined) {
	    takenNames.push(current.spec.name);
	  } else {
	    // add the name for every rule in the current element
	    current.rules.forEach(function (r) {
	      takenNames.push(r.name);
	    });

	    // and merge in the names from every child element
	    current.childIndices.forEach(function (c) {
	      var child = elements[c];
	      takenNames = takenNames.concat(childNames(elements, child.index, false));
	    });
	  }

	  return takenNames;
	}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _types = __webpack_require__(233);

	Object.defineProperty(exports, 'ADD_MESSAGE', {
	  enumerable: true,
	  get: function get() {
	    return _types.ADD_MESSAGE;
	  }
	});
	Object.defineProperty(exports, 'REMOVE_MESSAGE', {
	  enumerable: true,
	  get: function get() {
	    return _types.REMOVE_MESSAGE;
	  }
	});

	var _actions = __webpack_require__(234);

	Object.defineProperty(exports, 'showMessage', {
	  enumerable: true,
	  get: function get() {
	    return _actions.showMessage;
	  }
	});

	var _middleware = __webpack_require__(235);

	Object.defineProperty(exports, 'messagesMiddleware', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_middleware).default;
	  }
	});

	var _reducer = __webpack_require__(237);

	Object.defineProperty(exports, 'messages', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_reducer).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 233 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SHOW_MESSAGE = exports.SHOW_MESSAGE = '@@erm/SHOW_MESSAGE';
	var ADD_MESSAGE = exports.ADD_MESSAGE = '@@erm/ADD_MESSAGE';
	var REMOVE_MESSAGE = exports.REMOVE_MESSAGE = '@@erm/REMOVE_MESSAGE';

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.showMessage = showMessage;
	exports.addMessage = addMessage;
	exports.removeMessage = removeMessage;

	var _types = __webpack_require__(233);

	function showMessage(message, lifetime) {
	  var rating = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	  return {
	    type: _types.SHOW_MESSAGE,
	    message: message,
	    lifetime: lifetime,
	    rating: rating
	  };
	}

	function addMessage(message, id) {
	  var rating = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	  return {
	    type: _types.ADD_MESSAGE,
	    message: message,
	    id: id,
	    rating: rating
	  };
	}

	function removeMessage(id) {
	  return {
	    type: _types.REMOVE_MESSAGE,
	    id: id
	  };
	}

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _types = __webpack_require__(233);

	var _actions = __webpack_require__(234);

	var _helpers = __webpack_require__(236);

	/*
	 * the message middleware intercepts messages before they reach
	 * the reducer. A new action will be dispatched for the message
	 * with a unique ID. After the wait time, another action will
	 * be dispatched to delete the message with the given ID.
	 */

	exports.default = function (store) {
	  return function (next) {
	    return function (action) {
	      if (action.type !== _types.SHOW_MESSAGE) {
	        return next(action);
	      }
	      var message = action.message;
	      var lifetime = action.lifetime;
	      var rating = action.rating;

	      var id = (0, _helpers.pseudoRandomID)();

	      setTimeout(function () {
	        store.dispatch((0, _actions.removeMessage)(id));
	      }, lifetime);

	      return store.dispatch((0, _actions.addMessage)(message, id, rating));
	    };
	  };
	};

/***/ }),
/* 236 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pseudoRandomID = pseudoRandomID;
	/*
	 * returns a 10 character code
	 * ~839 quadrillion possibilities
	 */
	function pseudoRandomID() {
	  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	  var charCount = chars.length;
	  return Array.from(Array(10)).map(function () {
	    return chars[Math.floor(Math.random() * charCount)];
	  }).join('');
	}

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = messages;

	var _types = __webpack_require__(233);

	/*
	 * messages contains an array of message objects
	 * a message object has two properties:
	 *   message - the text of the message
	 *   id - a unique identifier for the message
	 */
	function messages() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case _types.ADD_MESSAGE:
	      return state.concat([{
	        id: action.id,
	        message: action.message,
	        rating: action.rating
	      }]);
	    case _types.REMOVE_MESSAGE:
	      return state.filter(function (m) {
	        return m.id !== action.id;
	      });
	    default:
	      return state;
	  }
	}

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _general = __webpack_require__(239);

	Object.keys(_general).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _general[key];
	    }
	  });
	});

	var _frame = __webpack_require__(241);

	Object.keys(_frame).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _frame[key];
	    }
	  });
	});

	var _page = __webpack_require__(242);

	Object.keys(_page).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _page[key];
	    }
	  });
	});

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.openForager = exports.closeForager = undefined;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var closeForager = exports.closeForager = function closeForager() {
	  return {
	    type: types.CLOSE_FORAGER
	  };
	};

	var openForager = exports.openForager = function openForager() {
	  return {
	    type: types.OPEN_FORAGER
	  };
	};

/***/ }),
/* 240 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* page */
	// set a page as the current page
	var SELECT_PAGE = exports.SELECT_PAGE = 'SELECT_PAGE';
	var ADD_PAGE = exports.ADD_PAGE = 'ADD_PAGE';
	var REMOVE_PAGE = exports.REMOVE_PAGE = 'REMOVE_PAGE';
	var RENAME_PAGE = exports.RENAME_PAGE = 'RENAME_PAGE';
	var UPLOAD_PAGE = exports.UPLOAD_PAGE = 'UPLOAD_PAGE';
	var SYNC_PAGES = exports.SYNC_PAGES = 'SYNC_PAGES';
	var SET_PAGES = exports.SET_PAGES = 'SET_PAGES';

	// set the matches property of multiple elements
	var SET_MATCHES = exports.SET_MATCHES = 'SET_MATCHES';
	var REFRESH_MATCHES = exports.REFRESH_MATCHES = 'REFRESH_MATCHES';

	var SELECT_ELEMENT = exports.SELECT_ELEMENT = 'SELECT_ELEMENT';
	var SAVE_ELEMENT = exports.SAVE_ELEMENT = 'SAVE_ELEMENT';
	var REMOVE_ELEMENT = exports.REMOVE_ELEMENT = 'REMOVE_ELEMENT';
	var UPDATE_ELEMENT = exports.UPDATE_ELEMENT = 'UPDATE_ELEMENT';
	var SAVE_RULE = exports.SAVE_RULE = 'SAVE_RULE';
	var REMOVE_RULE = exports.REMOVE_RULE = 'REMOVE_RULE';
	var UPDATE_RULE = exports.UPDATE_RULE = 'UPDATE_RULE';

	/* frame */
	// the app is made up of frames,
	// the following action types show specific frames
	var SHOW_ELEMENT_FRAME = exports.SHOW_ELEMENT_FRAME = 'SHOW_ELEMENT_FRAME';
	var SHOW_ELEMENT_WIZARD = exports.SHOW_ELEMENT_WIZARD = 'SHOW_ELEMENT_WIZARD';
	var SHOW_EDIT_ELEMENT_WIZARD = exports.SHOW_EDIT_ELEMENT_WIZARD = 'SHOW_EDIT_ELEMENT_WIZARD';
	var SHOW_RULE_WIZARD = exports.SHOW_RULE_WIZARD = 'SHOW_RULE_WIZARD';
	var SHOW_EDIT_RULE_WIZARD = exports.SHOW_EDIT_RULE_WIZARD = 'SHOW_EDIT_RULE_WIZARD';
	var SHOW_PREVIEW = exports.SHOW_PREVIEW = 'SHOW_PREVIEW';

	/* general */
	// open and close the app
	var CLOSE_FORAGER = exports.CLOSE_FORAGER = 'CLOSE_FORAGER';
	var OPEN_FORAGER = exports.OPEN_FORAGER = 'OPEN_FORAGER';

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.showPreview = exports.showEditRuleWizard = exports.showRuleWizard = exports.showEditElementWizard = exports.showElementWizard = exports.showElementFrame = undefined;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var showElementFrame = exports.showElementFrame = function showElementFrame() {
	  return {
	    type: types.SHOW_ELEMENT_FRAME
	  };
	};

	var showElementWizard = exports.showElementWizard = function showElementWizard() {
	  return {
	    type: types.SHOW_ELEMENT_WIZARD
	  };
	};

	var showEditElementWizard = exports.showEditElementWizard = function showEditElementWizard() {
	  return {
	    type: types.SHOW_EDIT_ELEMENT_WIZARD
	  };
	};

	var showRuleWizard = exports.showRuleWizard = function showRuleWizard() {
	  return {
	    type: types.SHOW_RULE_WIZARD
	  };
	};

	var showEditRuleWizard = exports.showEditRuleWizard = function showEditRuleWizard(index) {
	  return {
	    type: types.SHOW_EDIT_RULE_WIZARD,
	    index: index
	  };
	};

	var showPreview = exports.showPreview = function showPreview() {
	  return {
	    type: types.SHOW_PREVIEW
	  };
	};

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateRule = exports.removeRule = exports.saveRule = exports.removeElement = exports.updateElement = exports.saveElement = exports.selectElement = exports.refreshMatches = exports.setMatches = exports.setPages = exports.syncPages = exports.uploadPage = exports.renamePage = exports.removePage = exports.addPage = exports.selectPage = undefined;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var selectPage = exports.selectPage = function selectPage(index) {
	  return {
	    type: types.SELECT_PAGE,
	    index: index
	  };
	};

	var addPage = exports.addPage = function addPage(page) {
	  return {
	    type: types.ADD_PAGE,
	    page: page
	  };
	};

	var removePage = exports.removePage = function removePage() {
	  return {
	    type: types.REMOVE_PAGE
	  };
	};

	var renamePage = exports.renamePage = function renamePage(name) {
	  return {
	    type: types.RENAME_PAGE,
	    name: name
	  };
	};

	var uploadPage = exports.uploadPage = function uploadPage() {
	  return {
	    type: types.UPLOAD_PAGE
	  };
	};

	var syncPages = exports.syncPages = function syncPages() {
	  return {
	    type: types.SYNC_PAGES
	  };
	};

	var setPages = exports.setPages = function setPages(pages) {
	  return {
	    type: types.SET_PAGES,
	    pages: pages
	  };
	};

	// matches is an object where the keys are
	// element indices and the values are elements
	// that are matched by the element selector with
	// the same index
	var setMatches = exports.setMatches = function setMatches(matches) {
	  return {
	    type: types.SET_MATCHES,
	    matches: matches
	  };
	};

	// trigger the matches to be re-selected
	var refreshMatches = exports.refreshMatches = function refreshMatches() {
	  return {
	    type: types.REFRESH_MATCHES
	  };
	};

	/*
	 * ELEMENT/RULE ACTIONS
	 */
	var selectElement = exports.selectElement = function selectElement(index) {
	  return {
	    type: types.SELECT_ELEMENT,
	    index: index
	  };
	};

	// add a new element selector, using the current element
	// selector as its parent
	var saveElement = exports.saveElement = function saveElement(element) {
	  return {
	    type: types.SAVE_ELEMENT,
	    element: element
	  };
	};

	// update the properties of the element at index
	var updateElement = exports.updateElement = function updateElement(index, newProps) {
	  return {
	    type: types.UPDATE_ELEMENT,
	    index: index,
	    newProps: newProps
	  };
	};

	// remove the currently selected element selector
	var removeElement = exports.removeElement = function removeElement() {
	  return {
	    type: types.REMOVE_ELEMENT
	  };
	};

	var saveRule = exports.saveRule = function saveRule(rule) {
	  return {
	    type: types.SAVE_RULE,
	    rule: rule
	  };
	};

	var removeRule = exports.removeRule = function removeRule(index) {
	  return {
	    type: types.REMOVE_RULE,
	    index: index
	  };
	};

	var updateRule = exports.updateRule = function updateRule(index, rule) {
	  return {
	    type: types.UPDATE_RULE,
	    index: index,
	    rule: rule
	  };
	};

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _ElementFrame = __webpack_require__(244);

	var _ElementFrame2 = _interopRequireDefault(_ElementFrame);

	var _ElementWizard = __webpack_require__(253);

	var _ElementWizard2 = _interopRequireDefault(_ElementWizard);

	var _EditElementWizard = __webpack_require__(272);

	var _EditElementWizard2 = _interopRequireDefault(_EditElementWizard);

	var _RuleWizard = __webpack_require__(273);

	var _RuleWizard2 = _interopRequireDefault(_RuleWizard);

	var _EditRuleWizard = __webpack_require__(282);

	var _EditRuleWizard2 = _interopRequireDefault(_EditRuleWizard);

	var _Preview = __webpack_require__(283);

	var _Preview2 = _interopRequireDefault(_Preview);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Frames
	 * ------
	 *
	 * The main way for a user to interact with Forager is through the Frames. There
	 * are a number of different frames associated with different states of viewing
	 * and creating elements.
	 *
	 */
	var Frames = function Frames(_ref) {
	  var frame = _ref.frame;

	  switch (frame.name) {
	    case 'element':
	      return _react2.default.createElement(_ElementFrame2.default, null);
	    case 'element-wizard':
	      return _react2.default.createElement(_ElementWizard2.default, null);
	    case 'edit-element-wizard':
	      return _react2.default.createElement(_EditElementWizard2.default, null);
	    case 'rule-wizard':
	      return _react2.default.createElement(_RuleWizard2.default, null);
	    case 'edit-rule-wizard':
	      return _react2.default.createElement(_EditRuleWizard2.default, null);
	    case 'preview':
	      return _react2.default.createElement(_Preview2.default, null);
	    default:
	      return null;
	  }
	};

	Frames.propTypes = {
	  frame: _react2.default.PropTypes.object
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    frame: state.frame
	  };
	})(Frames);

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Tree = __webpack_require__(245);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _ElementCard = __webpack_require__(249);

	var _ElementCard2 = _interopRequireDefault(_ElementCard);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ElementFrame = function (_React$Component) {
	  _inherits(ElementFrame, _React$Component);

	  function ElementFrame(props) {
	    _classCallCheck(this, ElementFrame);

	    return _possibleConstructorReturn(this, (ElementFrame.__proto__ || Object.getPrototypeOf(ElementFrame)).call(this, props));
	  }

	  _createClass(ElementFrame, [{
	    key: 'render',
	    value: function render() {
	      var element = this.props.element;

	      if (element === undefined) {
	        return _react2.default.createElement('div', { className: 'frame' });
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_Tree2.default, null),
	        _react2.default.createElement(_ElementCard2.default, { element: element, active: true })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	      if (this.props.element) {
	        (0, _markup.highlight)(this.props.element.matches, _CSSClasses.currentSelector);
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	      if (nextProps.element !== undefined && nextProps.element !== this.props.element) {
	        (0, _markup.highlight)(nextProps.element.matches, _CSSClasses.currentSelector);
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	    }
	  }]);

	  return ElementFrame;
	}(_react2.default.Component);

	ElementFrame.propTypes = {
	  element: _react2.default.PropTypes.object
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    element: (0, _store.currentElement)(page)
	  };
	})(ElementFrame);

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _d3Hierarchy = __webpack_require__(246);

	var _d3Path = __webpack_require__(247);

	var _text = __webpack_require__(228);

	var _page = __webpack_require__(231);

	var _markup = __webpack_require__(248);

	var _actions = __webpack_require__(238);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// d3 dropped svg.diagonal, but this is the equivalent path function
	// https://github.com/d3/d3-shape/issues/27#issuecomment-227839157
	function drawLink(node) {
	  var context = (0, _d3Path.path)();
	  var source = node.source,
	      target = node.target;

	  context.moveTo(target.y, target.x);
	  context.bezierCurveTo((target.y + source.y) / 2, target.x, (target.y + source.y) / 2, source.x, source.y, source.x);
	  return context.toString();
	}

	var Tree = function (_React$Component) {
	  _inherits(Tree, _React$Component);

	  function Tree(props) {
	    _classCallCheck(this, Tree);

	    var _this = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

	    _this._makeNodes = _this._makeNodes.bind(_this);
	    return _this;
	  }

	  _createClass(Tree, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props = this.props,
	          width = _props.width,
	          height = _props.height;

	      this.setState({
	        // tree layout
	        tree: (0, _d3Hierarchy.tree)().size([height, width])
	      });
	    }
	  }, {
	    key: '_makeNodes',
	    value: function _makeNodes() {
	      var _props2 = this.props,
	          page = _props2.page,
	          elementIndex = _props2.elementIndex,
	          active = _props2.active,
	          selectElement = _props2.selectElement;
	      var tree = this.state.tree;

	      // clone the page data so that data isn't interfered with
	      // this might not be necessary with d3 v4 since all of the
	      // data is moved to a data object.

	      var clonedPage = (0, _page.simpleGrow)(page.elements);
	      // hierarchy sets up the nested information
	      var treeRoot = (0, _d3Hierarchy.hierarchy)(clonedPage);
	      // determine the layout of the tree
	      tree(treeRoot);
	      // descendants is all of the nodes in the tree
	      // we draw a node for each node
	      var nodes = treeRoot.descendants().map(function (n, i) {
	        return _react2.default.createElement(Node, _extends({ key: i,
	          current: n.data.index === elementIndex,
	          select: selectElement,
	          active: active
	        }, n));
	      });
	      // each link has a source and a target
	      var links = treeRoot.links().map(function (link, i) {
	        return _react2.default.createElement('path', { key: i,
	          className: 'link',
	          d: drawLink(link) });
	      });

	      return _react2.default.createElement(
	        'g',
	        { transform: 'translate(50,25)' },
	        _react2.default.createElement(
	          'g',
	          { className: 'links' },
	          links
	        ),
	        _react2.default.createElement(
	          'g',
	          { className: 'nodes' },
	          nodes
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.props.page === undefined) {
	        return null;
	      }
	      var _props3 = this.props,
	          width = _props3.width,
	          height = _props3.height,
	          active = _props3.active;
	      /*
	       * The tree layout places the left and right-most nodes directly on the edge,
	       * so additional space needs to be granted so that the labels aren't cut off.
	       * In this case, a left and right margin of 50 is used by expanding with width
	       * by 100 and translating the tree 50 pixels to the right
	       */

	      return _react2.default.createElement(
	        'div',
	        { className: 'tree' },
	        _react2.default.createElement(
	          'svg',
	          {
	            width: width + 100,
	            height: height + 50,
	            className: active ? null : 'not-allowed' },
	          this._makeNodes()
	        )
	      );
	    }
	  }]);

	  return Tree;
	}(_react2.default.Component);

	Tree.defaultProps = {
	  width: 400,
	  height: 150
	};

	Tree.propTypes = {
	  width: _react2.default.PropTypes.number,
	  height: _react2.default.PropTypes.number,
	  page: _react2.default.PropTypes.object.isRequired,
	  elementIndex: _react2.default.PropTypes.number.isRequired,
	  active: _react2.default.PropTypes.bool,
	  selectElement: _react2.default.PropTypes.func.isRequired
	};

	var Node = function (_React$Component2) {
	  _inherits(Node, _React$Component2);

	  function Node(props) {
	    _classCallCheck(this, Node);

	    var _this2 = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, props));

	    _this2.handleClick = _this2.handleClick.bind(_this2);
	    _this2.handleMouseover = _this2.handleMouseover.bind(_this2);
	    _this2.handleMouseout = _this2.handleMouseout.bind(_this2);
	    return _this2;
	  }

	  _createClass(Node, [{
	    key: 'handleClick',
	    value: function handleClick(event) {
	      event.preventDefault();
	      this.props.select(this.props.data.index);
	    }
	  }, {
	    key: 'handleMouseover',
	    value: function handleMouseover() {
	      (0, _markup.highlight)(this.props.data.matches, _CSSClasses.savedPreview);
	    }
	  }, {
	    key: 'handleMouseout',
	    value: function handleMouseout() {
	      (0, _markup.unhighlight)(_CSSClasses.savedPreview);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props4 = this.props,
	          current = _props4.current,
	          data = _props4.data,
	          active = _props4.active,
	          children = _props4.children,
	          x = _props4.x,
	          y = _props4.y;
	      var hasRules = data.hasRules,
	          selector = data.selector,
	          spec = data.spec,
	          optional = data.optional;

	      var empty = !hasRules && !(children && children.length);

	      // nodes with rules drawn as rect, nodes with no rules drawn as circles
	      var marker = hasRules ? _react2.default.createElement('rect', { width: '6', height: '6', x: '-3', y: '-3' }) : _react2.default.createElement('circle', { r: '3' });

	      var classNames = ['node', current ? 'current' : null, empty ? 'empty' : null];
	      // only apply events when the node is 'active'
	      var events = active ? {
	        onClick: this.handleClick,
	        onMouseOver: this.handleMouseover,
	        onMouseOut: this.handleMouseout
	      } : {};
	      return _react2.default.createElement(
	        'g',
	        _extends({
	          className: classNames.join(' '),
	          transform: 'translate(' + y + ',' + x + ')'
	        }, events),
	        _react2.default.createElement(
	          'text',
	          { y: '-10' },
	          (0, _text.shortElement)(selector, spec, optional)
	        ),
	        marker
	      );
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.savedPreview);
	    }
	  }]);

	  return Node;
	}(_react2.default.Component);

	Node.propTypes = {
	  select: _react2.default.PropTypes.func.isRequired,
	  data: _react2.default.PropTypes.object.isRequired,
	  current: _react2.default.PropTypes.bool,
	  active: _react2.default.PropTypes.bool,
	  children: _react2.default.PropTypes.array,
	  x: _react2.default.PropTypes.number.isRequired,
	  y: _react2.default.PropTypes.number.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page,
	      frame = state.frame;
	  var pages = page.pages,
	      pageIndex = page.pageIndex,
	      elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  return {
	    page: currentPage,
	    active: frame.name === 'element',
	    elementIndex: elementIndex
	  };
	}, {
	  selectElement: _actions.selectElement
	})(Tree);

/***/ }),
/* 246 */,
/* 247 */,
/* 248 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * highlight
	 * ---------
	 *
	 * @param elements - an array of elements
	 * @param className - the class added to the elements
	 */
	var highlight = exports.highlight = function highlight(elements, className) {
	  Array.from(elements).forEach(function (e) {
	    e.classList.add(className);
	  });
	};

	/*
	 * unhighlight
	 * -----------
	 *
	 * @param className - the className to remove from all elements that have it
	 */
	var unhighlight = exports.unhighlight = function unhighlight(className) {
	  Array.from(document.getElementsByClassName(className)).forEach(function (e) {
	    e.classList.remove(className);
	  });
	};

	/*
	 * iHighlight
	 * ---------
	 *
	 * @param elements - an array of elements
	 * @param className - the class added to the elements
	 * @param over - the function to call on mouseover
	 * @param out - the function to call on mouseout
	 * @param click - the function to call when an element is clicked
	 */
	var iHighlight = exports.iHighlight = function iHighlight(elements, className, over, out, click) {
	  Array.from(elements).forEach(function (e) {
	    e.classList.add(className);
	  });

	  function checkEvent(fn) {
	    return function (event) {
	      if (event.target.classList.contains(className)) {
	        event.stopPropagation();
	        fn(event);
	      }
	    };
	  }

	  var checkOver = checkEvent(over);
	  var checkOut = checkEvent(out);
	  var checkClick = checkEvent(click);

	  document.body.addEventListener('mouseover', checkOver, false);
	  document.body.addEventListener('mouseout', checkOut, false);
	  document.body.addEventListener('click', checkClick, false);

	  return function iUnhighlight() {

	    Array.from(elements).forEach(function (e) {
	      e.classList.remove(className);
	    });

	    document.body.removeEventListener('mouseover', checkOver, false);
	    document.body.removeEventListener('mouseout', checkOut, false);
	    document.body.removeEventListener('click', checkClick, false);
	  };
	};

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Element = __webpack_require__(250);

	var _Element2 = _interopRequireDefault(_Element);

	var _Buttons = __webpack_require__(226);

	var _actions = __webpack_require__(238);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * An ElementCard is used to display a selector Element and its control functions
	 */
	function ElementCard(props) {
	  var _props$element = props.element,
	      element = _props$element === undefined ? {} : _props$element,
	      _props$active = props.active,
	      active = _props$active === undefined ? true : _props$active,
	      showElementWizard = props.showElementWizard,
	      showRuleWizard = props.showRuleWizard,
	      showEditElementWizard = props.showEditElementWizard,
	      removeElement = props.removeElement;


	  var isRoot = element.index === 0;

	  return _react2.default.createElement(
	    'div',
	    { className: 'info-box' },
	    _react2.default.createElement(
	      'div',
	      { className: 'info' },
	      _react2.default.createElement(_Element2.default, _extends({ active: active }, element))
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'buttons' },
	      _react2.default.createElement(_Buttons.PosButton, {
	        text: 'Add Child',
	        disabled: !active,
	        click: function click() {
	          showElementWizard();
	        } }),
	      _react2.default.createElement(_Buttons.PosButton, {
	        text: 'Add Rule',
	        disabled: !active,
	        click: function click() {
	          showRuleWizard();
	        } }),
	      _react2.default.createElement(_Buttons.NeutralButton, {
	        text: 'Edit',
	        disabled: !active || isRoot,
	        click: function click() {
	          showEditElementWizard();
	        } }),
	      _react2.default.createElement(_Buttons.NegButton, {
	        text: isRoot ? 'Reset' : 'Delete',
	        title: isRoot ? 'Reset Page' : 'Delete Element',
	        disabled: !active,
	        click: function click() {
	          removeElement();
	        } })
	    )
	  );
	}

	ElementCard.propTypes = {
	  element: _react2.default.PropTypes.object,
	  active: _react2.default.PropTypes.bool,
	  showElementWizard: _react2.default.PropTypes.func.isRequired,
	  showRuleWizard: _react2.default.PropTypes.func.isRequired,
	  showEditElementWizard: _react2.default.PropTypes.func.isRequired,
	  removeElement: _react2.default.PropTypes.func.isRequired
	};

	exports.default = (0, _reactRedux.connect)(null, {
	  showElementWizard: _actions.showElementWizard,
	  removeElement: _actions.removeElement,
	  showRuleWizard: _actions.showRuleWizard,
	  showEditElementWizard: _actions.showEditElementWizard
	})(ElementCard);

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Rule = __webpack_require__(251);

	var _Rule2 = _interopRequireDefault(_Rule);

	var _text = __webpack_require__(228);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Element(props) {
	  var selector = props.selector,
	      rules = props.rules,
	      spec = props.spec,
	      _props$optional = props.optional,
	      optional = _props$optional === undefined ? false : _props$optional,
	      _props$active = props.active,
	      active = _props$active === undefined ? true : _props$active;


	  return _react2.default.createElement(
	    'div',
	    { className: 'element' },
	    _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'span',
	        { className: 'big bold' },
	        selector,
	        optional ? _react2.default.createElement(
	          'span',
	          { title: 'optional' },
	          '*'
	        ) : null
	      )
	    ),
	    _react2.default.createElement(
	      'div',
	      null,
	      (0, _text.describeSpec)(spec)
	    ),
	    _react2.default.createElement(RuleList, { rules: rules, active: active })
	  );
	}

	Element.propTypes = {
	  selector: _react2.default.PropTypes.string.isRequired,
	  rules: _react2.default.PropTypes.array,
	  spec: _react2.default.PropTypes.object,
	  optional: _react2.default.PropTypes.bool,
	  active: _react2.default.PropTypes.bool
	};

	var RuleList = function RuleList(_ref) {
	  var rules = _ref.rules,
	      active = _ref.active;
	  return !rules.length ? null : _react2.default.createElement(
	    'ul',
	    { className: 'rules' },
	    rules.map(function (r, i) {
	      return _react2.default.createElement(_Rule2.default, _extends({
	        key: i,
	        index: i,
	        active: active
	      }, r));
	    })
	  );
	};

	RuleList.propTypes = {
	  rules: _react2.default.PropTypes.array,
	  active: _react2.default.PropTypes.bool.isRequired
	};

	exports.default = Element;

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Buttons = __webpack_require__(226);

	var _actions = __webpack_require__(238);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Rule(props) {
	  var name = props.name,
	      attr = props.attr,
	      type = props.type,
	      _props$active = props.active,
	      active = _props$active === undefined ? true : _props$active,
	      index = props.index,
	      removeRule = props.removeRule,
	      updateRule = props.updateRule;


	  return _react2.default.createElement(
	    'li',
	    { className: 'rule' },
	    _react2.default.createElement(
	      'span',
	      { className: 'rule-name', title: 'name' },
	      name
	    ),
	    _react2.default.createElement(
	      'span',
	      { className: 'rule-attr', title: 'attribute (or text)' },
	      attr
	    ),
	    _react2.default.createElement(
	      'span',
	      { className: 'rule-type', title: 'data type' },
	      type
	    ),
	    active ? _react2.default.createElement(_Buttons.NeutralButton, {
	      text: 'Edit',
	      click: function click() {
	        updateRule(index);
	      } }) : null,
	    active ? _react2.default.createElement(_Buttons.NegButton, {
	      text: 'Delete',
	      click: function click() {
	        removeRule(index);
	      } }) : null
	  );
	}

	Rule.propTypes = {
	  removeRule: _react2.default.PropTypes.func.isRequired,
	  updateRule: _react2.default.PropTypes.func.isRequired,
	  name: _react2.default.PropTypes.string.isRequired,
	  attr: _react2.default.PropTypes.string.isRequired,
	  type: _react2.default.PropTypes.string.isRequired,
	  active: _react2.default.PropTypes.bool,
	  index: _react2.default.PropTypes.number
	};

	exports.default = (0, _reactRedux.connect)(null, {
	  removeRule: _actions.removeRule,
	  updateRule: _actions.showEditRuleWizard
	})(Rule);

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.currentElement = currentElement;
	exports.currentParent = currentParent;
	exports.takenNames = takenNames;

	var _page = __webpack_require__(231);

	/*
	 * returns the currently selected element
	 */
	function currentElement(page) {
	  var pages = page.pages,
	      pageIndex = page.pageIndex,
	      elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  return currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	}

	/*
	 * returns the parent element of the currently selected element
	 * or undefined if either the current element does not exist
	 */
	function currentParent(page) {
	  var pages = page.pages,
	      pageIndex = page.pageIndex,
	      elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var current = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return current === undefined ? undefined : currentPage.elements[current.parent];
	}

	/*
	 * return a list of names for all elements in the same level as
	 * the current element
	 */
	function takenNames(page) {
	  var current = currentElement(page);
	  var index = current.parent !== null ? current.parent : page.elementIndex;
	  var currentPage = page.pages[page.pageIndex].elements;
	  return (0, _page.levelNames)(currentPage, index);
	}

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Tree = __webpack_require__(245);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _simpleWizardComponent = __webpack_require__(254);

	var _simpleWizardComponent2 = _interopRequireDefault(_simpleWizardComponent);

	var _element = __webpack_require__(255);

	var _actions = __webpack_require__(238);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var steps = [_element.Elements, _element.Parts, _element.CreateType, _element.CreateValue, _element.CreateOptional, _element.ConfirmElement];

	/*
	 * Elements -> Parts -> Type -> Value -> Optional -> ConfirmElement
	 * each step should make sure to pass the current object (the currently
	 * selected element selector) as a property of the object returned
	 * in its next call
	 */

	var ElementWizard = function (_React$Component) {
	  _inherits(ElementWizard, _React$Component);

	  function ElementWizard(props) {
	    _classCallCheck(this, ElementWizard);

	    var _this = _possibleConstructorReturn(this, (ElementWizard.__proto__ || Object.getPrototypeOf(ElementWizard)).call(this, props));

	    _this.save = _this.save.bind(_this);
	    _this.cancel = _this.cancel.bind(_this);
	    return _this;
	  }

	  _createClass(ElementWizard, [{
	    key: 'save',
	    value: function save(ele) {
	      this.props.saveElement(ele);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var current = this.props.current;


	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_Tree2.default, null),
	        _react2.default.createElement(_simpleWizardComponent2.default, {
	          steps: steps,
	          initialData: {},
	          staticData: {
	            parent: current
	          },
	          save: this.save,
	          cancel: this.cancel })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var current = this.props.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps) {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	      var current = nextProps.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	    }
	  }]);

	  return ElementWizard;
	}(_react2.default.Component);

	ElementWizard.propTypes = {
	  current: _react2.default.PropTypes.object,
	  saveElement: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    current: (0, _store.currentElement)(page)
	  };
	}, {
	  saveElement: _actions.saveElement,
	  cancel: _actions.showElementFrame
	})(ElementWizard);

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/*
	 * A Wizard walks through multiple steps to get to a desired state.
	 * Each step is a form that has three buttons: next, previous, and cancel.
	 * The next button will cause the wizard to proceed to the next step, the
	 * previous button will revert to the previous step, and the cancel button
	 * will exit the wizard. If the current step is the last step, the next button
	 * will function as the finish button, passing the function the completed
	 * state of the wizard.
	 *
	 * props -
	 *   initialData - an object with data that should be available to the first step
	 *   staticData - data that is useful to all steps
	 *   steps - an array of steps that need to be completed to finish the wizard
	 *   save - a function to call once all steps have been completed
	 *   cancel - a function to call to immediately exit the wizard
	 *   children - any child elements will be passed to the step, which needs to
	 *       handle rendering them
	 * state - the wizard maintains two pieces of state:
	 *   position - which step it is currently on
	 *   data - an array of datum, one for each step
	 */

	var Wizard = function (_React$Component) {
	  _inherits(Wizard, _React$Component);

	  function Wizard(props) {
	    _classCallCheck(this, Wizard);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Wizard).call(this, props));

	    _this.state = {
	      position: 0,
	      data: [props.initialData].concat(Array(props.steps.length))
	    };

	    _this.next = _this.next.bind(_this);
	    _this.previous = _this.previous.bind(_this);
	    _this.cancel = _this.cancel.bind(_this);
	    _this.finish = _this.finish.bind(_this);
	    return _this;
	  }

	  _createClass(Wizard, [{
	    key: 'next',
	    value: function next(newData) {
	      var _state = this.state;
	      var position = _state.position;
	      var data = _state.data;
	      var steps = this.props.steps;

	      var maxPos = steps.length - 1;
	      // don't let the position become greater than the number of steps
	      // (0 normalized)
	      var nextPos = position === maxPos ? position : position + 1;
	      data[nextPos] = newData;
	      this.setState({
	        position: nextPos,
	        data: data
	      });
	    }
	  }, {
	    key: 'previous',
	    value: function previous() {
	      var _state2 = this.state;
	      var position = _state2.position;
	      var data = _state2.data;

	      this.setState({
	        position: position > 0 ? position - 1 : 0
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.props.cancel();
	    }
	  }, {
	    key: 'finish',
	    value: function finish(data) {
	      this.props.save(data);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state3 = this.state;
	      var position = _state3.position;
	      var data = _state3.data;
	      var _props = this.props;
	      var steps = _props.steps;
	      var staticData = _props.staticData;
	      var children = _props.children;

	      var CurrentStep = steps[position];
	      // don't pass a previous function to the first step
	      var prevStep = position === 0 ? undefined : this.previous;
	      // on the last step, call the finish function, otherwise call the next function
	      var completeStep = position === steps.length - 1 ? this.finish : this.next;
	      return _react2.default.createElement(
	        'div',
	        { className: 'wizard' },
	        _react2.default.createElement(ProgressBar, {
	          steps: steps.length,
	          position: position }),
	        _react2.default.createElement(CurrentStep, {
	          startData: data[position],
	          endData: data[position + 1],
	          staticData: staticData,
	          cancel: this.cancel,
	          next: completeStep,
	          previous: prevStep })
	      );
	    }
	  }]);

	  return Wizard;
	}(_react2.default.Component);

	Wizard.propTypes = {
	  initialData: _react2.default.PropTypes.object.isRequired,
	  steps: _react2.default.PropTypes.array.isRequired,
	  staticData: _react2.default.PropTypes.object,
	  save: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	/*
	 * Visual progression through the steps
	 */
	var ProgressBar = function ProgressBar(_ref) {
	  var steps = _ref.steps;
	  var position = _ref.position;
	  return _react2.default.createElement(
	    'div',
	    { className: 'progress-bar' },
	    Array.from(Array(steps)).map(function (s, i) {
	      return _react2.default.createElement('div', {
	        key: i,
	        className: ['marker', i < position ? 'complete' : null, i == position ? 'active' : null].filter(function (c) {
	          return c !== null;
	        }).join(' ').trim() });
	    })
	  );
	};

	exports.default = Wizard;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ChooseElements = __webpack_require__(256);

	Object.defineProperty(exports, 'Elements', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ChooseElements).default;
	  }
	});

	var _ChooseParts = __webpack_require__(258);

	Object.defineProperty(exports, 'Parts', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ChooseParts).default;
	  }
	});

	var _ChooseType = __webpack_require__(259);

	Object.defineProperty(exports, 'CreateType', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseType.CreateType;
	  }
	});
	Object.defineProperty(exports, 'EditType', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseType.EditType;
	  }
	});

	var _ChooseValue = __webpack_require__(261);

	Object.defineProperty(exports, 'CreateValue', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseValue.CreateValue;
	  }
	});
	Object.defineProperty(exports, 'EditValue', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseValue.EditValue;
	  }
	});

	var _ChooseOptional = __webpack_require__(268);

	Object.defineProperty(exports, 'CreateOptional', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseOptional.CreateOptional;
	  }
	});
	Object.defineProperty(exports, 'EditOptional', {
	  enumerable: true,
	  get: function get() {
	    return _ChooseOptional.EditOptional;
	  }
	});

	var _ConfirmElement = __webpack_require__(270);

	Object.defineProperty(exports, 'ConfirmElement', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ConfirmElement).default;
	  }
	});

	var _ConfirmUpdate = __webpack_require__(271);

	Object.defineProperty(exports, 'ConfirmUpdate', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ConfirmUpdate).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/*
	 * This step is used select an element within the page. An elements props is
	 * passed to the frame, which is used when the frame is mounted/updated to attach
	 * an event listener all child elements of the elements. When one of those elements
	 * is clicked, an array of css selector options (from the clicked element to the
	 * parent) will be rendered.
	 */
	var ChooseElement = function (_React$Component) {
	  _inherits(ChooseElement, _React$Component);

	  function ChooseElement(props) {
	    _classCallCheck(this, ChooseElement);

	    var _this = _possibleConstructorReturn(this, (ChooseElement.__proto__ || Object.getPrototypeOf(ChooseElement)).call(this, props));

	    var selectors = [['*']];
	    var staticData = _this.props.staticData;
	    var parent = staticData.parent;
	    // when current's elements are select elements, automatically add 'option'
	    // to the selectors array since it cannot be selected by the user

	    if ((0, _selection.allSelect)(parent.matches)) {
	      selectors.push(['option']);
	    }
	    _this.state = {
	      // the index of the selected selector
	      checked: undefined,
	      // the array of possible selectors. each selector is an array of selector parts
	      // ie tag name, class names, and id
	      selectors: selectors,
	      // the number of elements the currently selected selector matches
	      eleCount: 0,
	      error: true
	    };

	    _this.mouseover = _this.mouseover.bind(_this);
	    _this.mouseout = _this.mouseout.bind(_this);
	    _this.click = _this.click.bind(_this);
	    _this.addEvents = _this.addEvents.bind(_this);

	    _this.setRadio = _this.setRadio.bind(_this);
	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseElement, [{
	    key: 'mouseover',
	    value: function mouseover(event) {
	      event.target.classList.add(_CSSClasses.hoverClass);
	    }
	  }, {
	    key: 'mouseout',
	    value: function mouseout(event) {
	      event.target.classList.remove(_CSSClasses.hoverClass);
	    }

	    // requires a component to be bound to this in order to call setState

	  }, {
	    key: 'click',
	    value: function click(event) {
	      // preventDefault & stopPropagation to deal with
	      // any real events from the page
	      event.preventDefault();
	      event.stopPropagation();
	      var selectors = Array.from(event.path).filter(function (ele) {
	        return ele.classList && ele.classList.contains(_CSSClasses.potentialSelector);
	      }).reverse().map(function (ele) {
	        return (0, _selection.parts)(ele);
	      });
	      this.setState({
	        // maintain the wildcard selector
	        selectors: [['*']].concat(selectors),
	        checked: undefined,
	        error: true
	      });
	    }
	  }, {
	    key: 'addEvents',
	    value: function addEvents(staticData) {
	      // get all child elements of the parents
	      var elements = (0, _selection.select)(staticData.parent.matches, null, null, '.forager-holder');

	      // remove any existing events
	      if (this.iUnhighlight) {
	        this.iUnhighlight();
	        delete this.iUnhighlight;
	      }

	      this.iUnhighlight = (0, _markup.iHighlight)(elements, _CSSClasses.potentialSelector, this.mouseover, this.mouseout, this.click);
	    }
	  }, {
	    key: 'setRadio',
	    value: function setRadio(i) {
	      var selector = this.state.selectors[i].join('');
	      var staticData = this.props.staticData;
	      var parent = staticData.parent;

	      this.setState({
	        checked: i,
	        eleCount: (0, _selection.count)(parent.matches, selector),
	        error: false
	      });
	    }
	  }, {
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var _state = this.state,
	          checked = _state.checked,
	          selectors = _state.selectors;
	      var next = this.props.next;

	      var selectedSelector = selectors[checked];
	      if (checked !== undefined && selectedSelector !== undefined) {
	        next({
	          parts: selectedSelector
	        });
	      } else {
	        this.setState({
	          error: true
	        });
	      }
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _state2 = this.state,
	          selectors = _state2.selectors,
	          checked = _state2.checked,
	          eleCount = _state2.eleCount,
	          error = _state2.error;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'Select Relevant Element(s)'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'choices' },
	            selectors.map(function (s, i) {
	              return _react2.default.createElement(SelectorRadio, { key: i,
	                selector: s,
	                index: i,
	                checked: i === checked,
	                select: _this2.setRadio });
	            })
	          ),
	          _react2.default.createElement(
	            'h5',
	            null,
	            'Count: ',
	            eleCount
	          )
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }

	    /*
	     * below here are the functions for interacting with the non-Forager part of the page
	     */

	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var staticData = this.props.staticData;

	      this.addEvents(staticData);
	    }
	  }, {
	    key: 'componentWillReceiveNewProps',
	    value: function componentWillReceiveNewProps(nextProps) {
	      var staticData = nextProps.staticData;

	      this.addEvents(staticData);
	    }

	    /*
	     * when a selector possibility is chosen, add a class to all matching elements
	     * to show what that selector could match
	     */

	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      // remove any highlights from a previously selected selector
	      (0, _markup.unhighlight)(_CSSClasses.queryCheck);
	      var clickedSelector = nextState.selectors[nextState.checked];
	      if (clickedSelector !== undefined) {
	        var fullSelector = clickedSelector.join('');
	        var staticData = nextProps.staticData;

	        var elements = (0, _selection.select)(staticData.parent.matches, fullSelector, null, '.forager-holder');
	        (0, _markup.highlight)(elements, _CSSClasses.queryCheck);
	      }
	    }

	    /*
	     * remove any classes and event listeners from the page when the frame is unmounted
	     */

	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.queryCheck);
	      this.iUnhighlight();
	    }
	  }]);

	  return ChooseElement;
	}(_react2.default.Component);

	ChooseElement.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	// do not call event.preventDefault() here or the checked dot will fail to render
	var SelectorRadio = function SelectorRadio(_ref) {
	  var selector = _ref.selector,
	      checked = _ref.checked,
	      select = _ref.select,
	      index = _ref.index;
	  return _react2.default.createElement(
	    'label',
	    { className: checked ? 'selected' : '' },
	    _react2.default.createElement('input', { type: 'radio',
	      name: 'css-selector',
	      checked: checked,
	      onChange: function onChange() {
	        return select(index);
	      } }),
	    selector.join('')
	  );
	};

	SelectorRadio.propTypes = {
	  selector: _react2.default.PropTypes.array.isRequired,
	  checked: _react2.default.PropTypes.bool.isRequired,
	  select: _react2.default.PropTypes.func.isRequired,
	  index: _react2.default.PropTypes.number.isRequired
	};

	exports.default = ChooseElement;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Controls;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Buttons = __webpack_require__(226);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Controls are a set of buttons used by frames to either:
	 *  1. advance to the next step
	 *  2. go back to the previous step
	 *  3. cancel out of the current cycle of steps
	 */
	function Controls(props) {
	  var previous = props.previous,
	      next = props.next,
	      _props$nextText = props.nextText,
	      nextText = _props$nextText === undefined ? 'Next' : _props$nextText,
	      cancel = props.cancel,
	      _props$error = props.error,
	      error = _props$error === undefined ? false : _props$error;

	  return _react2.default.createElement(
	    'div',
	    { className: 'buttons' },
	    _react2.default.createElement(_Buttons.NegButton, { text: 'Previous', click: previous, disabled: previous === undefined }),
	    _react2.default.createElement(_Buttons.PosButton, { text: nextText, type: 'submit', click: next, disabled: error }),
	    _react2.default.createElement(_Buttons.NegButton, { text: 'Cancel', click: cancel })
	  );
	}

	Controls.propTypes = {
	  previous: _react2.default.PropTypes.func,
	  next: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  nextText: _react2.default.PropTypes.string,
	  error: _react2.default.PropTypes.bool
	};

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var joinParts = function joinParts(parts) {
	  return parts.reduce(function (str, curr) {
	    return str + (curr.checked ? curr.name : '');
	  }, '');
	};

	function setupHighlights(cssSelector, matches) {
	  (0, _markup.unhighlight)(_CSSClasses.queryCheck);
	  if (cssSelector !== '') {
	    var elements = (0, _selection.select)(matches, cssSelector, null, '.forager-holder');
	    (0, _markup.highlight)(elements, _CSSClasses.queryCheck);
	  }
	}

	var ChooseParts = function (_React$Component) {
	  _inherits(ChooseParts, _React$Component);

	  function ChooseParts(props) {
	    _classCallCheck(this, ChooseParts);

	    var _this = _possibleConstructorReturn(this, (ChooseParts.__proto__ || Object.getPrototypeOf(ChooseParts)).call(this, props));

	    _this.state = {
	      parts: [],
	      eleCount: 0,
	      error: true
	    };

	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.toggleRadio = _this.toggleRadio.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseParts, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var parts = this.state.parts;
	      var next = this.props.next;

	      var selector = joinParts(parts);
	      if (selector !== '') {
	        next({
	          selector: selector
	        });
	      } else {
	        this.setState({
	          error: true
	        });
	      }
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'toggleRadio',
	    value: function toggleRadio(event) {
	      // don't prevent default
	      var index = event.target.value;
	      var parts = this.state.parts;
	      parts[index].checked = !parts[index].checked;
	      var fullSelector = joinParts(parts);
	      var staticData = this.props.staticData;

	      var matches = staticData.parent.matches;

	      setupHighlights(fullSelector, matches);
	      this.setState({
	        parts: parts,
	        eleCount: fullSelector === '' ? 0 : (0, _selection.count)(matches, fullSelector),
	        error: fullSelector === ''
	      });
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props = this.props,
	          startData = _props.startData,
	          staticData = _props.staticData;
	      var parts = startData.parts;
	      var parent = staticData.parent;

	      var fullSelector = parts.join('');

	      setupHighlights(fullSelector, parent.matches);
	      this.setState({
	        parts: parts.map(function (name) {
	          return { name: name, checked: true };
	        }),
	        eleCount: (0, _selection.count)(parent.matches, fullSelector),
	        error: false
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _state = this.state,
	          parts = _state.parts,
	          eleCount = _state.eleCount,
	          error = _state.error;

	      var opts = parts.map(function (part, index) {
	        var name = part.name,
	            checked = part.checked;

	        return _react2.default.createElement(
	          'label',
	          {
	            key: index,
	            className: checked ? 'selected' : '' },
	          _react2.default.createElement('input', {
	            type: 'checkbox',
	            name: 'selector-part',
	            value: index,
	            checked: checked,
	            onChange: _this2.toggleRadio }),
	          name
	        );
	      });
	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'Select Relevant Part(s) of the CSS selector'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'choices' },
	            opts
	          ),
	          _react2.default.createElement(
	            'h5',
	            null,
	            'Count: ',
	            eleCount
	          )
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.queryCheck);
	    }
	  }]);

	  return ChooseParts;
	}(_react2.default.Component);

	ChooseParts.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	exports.default = ChooseParts;

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditType = exports.CreateType = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _TypeForm = __webpack_require__(260);

	var _TypeForm2 = _interopRequireDefault(_TypeForm);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ChooseType = function (_React$Component) {
	  _inherits(ChooseType, _React$Component);

	  function ChooseType(props) {
	    _classCallCheck(this, ChooseType);

	    var _this = _possibleConstructorReturn(this, (ChooseType.__proto__ || Object.getPrototypeOf(ChooseType)).call(this, props));

	    _this.state = {
	      type: props.setupState(props)
	    };
	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.typeHandler = _this.typeHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseType, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var type = this.state.type;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next;

	      var newSpec = {
	        type: type
	      };
	      // populate initial spec data based on the type
	      switch (type) {
	        case 'single':
	          newSpec.index = 0;
	          break;
	        case 'all':
	          newSpec.name = '';
	          break;
	        case 'range':
	          newSpec.name = '';
	          newSpec.low = 0;
	          newSpec.high = undefined;
	          break;
	      }
	      next(Object.assign({}, startData, { spec: newSpec }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'typeHandler',
	    value: function typeHandler(event) {
	      this.setState({
	        type: event.target.value
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var type = this.state.type;
	      var _props$noPrevious = this.props.noPrevious,
	          noPrevious = _props$noPrevious === undefined ? false : _props$noPrevious;

	      var types = ['single', 'all', 'range'];
	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(_TypeForm2.default, { types: types, current: type, setType: this.typeHandler })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: noPrevious ? undefined : this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props2 = this.props,
	          highlight = _props2.highlight,
	          highlightClass = _props2.highlightClass;

	      highlight(this.props, this.state, highlightClass);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	      var highlight = nextProps.highlight,
	          highlightClass = nextProps.highlightClass;

	      highlight(nextProps, nextState, highlightClass);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	    }
	  }]);

	  return ChooseType;
	}(_react2.default.Component);

	ChooseType.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  noPrevious: _react2.default.PropTypes.bool,
	  setupState: _react2.default.PropTypes.func.isRequired,
	  highlight: _react2.default.PropTypes.func.isRequired,
	  highlightClass: _react2.default.PropTypes.string.isRequired
	};

	var CreateType = exports.CreateType = function CreateType(props) {
	  return _react2.default.createElement(ChooseType, _extends({
	    highlight: createHighlightElements,
	    highlightClass: _CSSClasses.queryCheck,
	    setupState: initialCreateType
	  }, props));
	};

	var EditType = exports.EditType = function EditType(props) {
	  return _react2.default.createElement(ChooseType, _extends({
	    highlight: editHighlightElements,
	    highlightClass: _CSSClasses.currentSelector,
	    setupState: initialEditType,
	    noPrevious: true
	  }, props));
	};

	function initialCreateType(props) {
	  var _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var type = 'single';
	  if (endData.spec && endData.spec.type) {
	    type = endData.spec.type;
	  }
	  return type;
	}

	function initialEditType(props) {
	  var startData = props.startData,
	      _props$endData2 = props.endData,
	      endData = _props$endData2 === undefined ? {} : _props$endData2;

	  var type = 'single';
	  if (endData.spec && endData.spec.type) {
	    type = endData.spec.type;
	  } else if (startData.spec && startData.spec.type) {
	    type = startData.spec.type;
	  }
	  return type;
	}

	function createHighlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var type = state.type;
	  var selector = startData.selector;
	  var parent = staticData.parent;


	  var spec = { type: type };
	  // use set single index if possible
	  if (type === 'single') {
	    spec.index = 0;
	  } else if (type === 'range') {
	    spec.low = 0;
	    spec.high = undefined;
	  }
	  var elements = (0, _selection.select)(parent.matches, selector, spec, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

	function editHighlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var type = state.type;
	  var _staticData$parent = staticData.parent,
	      parent = _staticData$parent === undefined ? {} : _staticData$parent;
	  var _parent$matches = parent.matches,
	      parentMatches = _parent$matches === undefined ? [document] : _parent$matches;


	  var spec = { type: type };
	  // use set single index if possible
	  if (type === 'single') {
	    var wasSingle = startData.spec && startData.spec.type === 'single';
	    spec.index = wasSingle ? startData.spec.index : 0;
	  } else if (type === 'range') {
	    var wasRange = startData.spec && startData.spec.type === 'range';
	    spec.low = wasRange ? startData.spec.low : 0;
	    spec.high = wasRange ? startData.spec.high : undefined;
	  }

	  var elements = (0, _selection.select)(parentMatches, startData.selector, spec, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = TypeForm;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function TypeForm(_ref) {
	  var types = _ref.types,
	      current = _ref.current,
	      setType = _ref.setType;


	  var typeInputs = types.map(function (t) {
	    var selected = current === t;
	    return _react2.default.createElement(
	      'label',
	      {
	        key: t,
	        className: selected ? 'selected' : null },
	      _react2.default.createElement('input', {
	        type: 'radio',
	        name: 'type',
	        value: t,
	        checked: selected,
	        onChange: setType }),
	      t
	    );
	  });

	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h3',
	      null,
	      'Should the element target a single element or all?'
	    ),
	    typeInputs
	  );
	}

	TypeForm.propTypes = {
	  types: _react2.default.PropTypes.array,
	  current: _react2.default.PropTypes.string,
	  setType: _react2.default.PropTypes.func
	};

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CreateValue = CreateValue;
	exports.EditValue = EditValue;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _AllValueStep = __webpack_require__(262);

	var _SingleValueStep = __webpack_require__(264);

	var _RangeValueStep = __webpack_require__(266);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function CreateValue(props) {
	  var spec = props.startData.spec;

	  switch (spec.type) {
	    case 'all':
	      return _react2.default.createElement(_AllValueStep.CreateAllValueStep, props);
	    case 'single':
	      return _react2.default.createElement(_SingleValueStep.CreateSingleValueStep, props);
	    case 'range':
	      return _react2.default.createElement(_RangeValueStep.CreateRangeValueStep, props);
	    default:
	      return null;
	  }
	}

	function EditValue(props) {
	  var spec = props.startData.spec;

	  switch (spec.type) {
	    case 'all':
	      return _react2.default.createElement(_AllValueStep.EditAllValueStep, props);
	    case 'single':
	      return _react2.default.createElement(_SingleValueStep.EditSingleValueStep, props);
	    case 'range':
	      return _react2.default.createElement(_RangeValueStep.EditRangeValueStep, props);
	    default:
	      return null;
	  }
	}

	CreateValue.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired
	};

	EditValue.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditAllValueStep = exports.CreateAllValueStep = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _AllForm = __webpack_require__(263);

	var _AllForm2 = _interopRequireDefault(_AllForm);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _expiringReduxMessages = __webpack_require__(232);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AllValueStep = function (_React$Component) {
	  _inherits(AllValueStep, _React$Component);

	  function AllValueStep(props) {
	    _classCallCheck(this, AllValueStep);

	    var _this = _possibleConstructorReturn(this, (AllValueStep.__proto__ || Object.getPrototypeOf(AllValueStep)).call(this, props));

	    var name = props.setupState(props);
	    _this.state = {
	      name: name,
	      error: name === ''
	    };

	    _this.nameHandler = _this.nameHandler.bind(_this);
	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(AllValueStep, [{
	    key: 'nameHandler',
	    value: function nameHandler(event) {
	      var value = event.target.value;

	      this.setState({
	        name: value,
	        error: value === ''
	      });
	    }
	  }, {
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var _state = this.state,
	          name = _state.name,
	          error = _state.error;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next,
	          showMessage = _props.showMessage,
	          validate = _props.validate;


	      if (error) {
	        return;
	      }

	      var ok = validate(this.props, this.state);
	      if (!ok) {
	        showMessage('"' + name + '" is a duplicate name and cannot be used.', 5000, -1);
	        return;
	      }

	      var newSpec = { type: 'all', name: name };
	      next(Object.assign({}, startData, { spec: newSpec }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state2 = this.state,
	          name = _state2.name,
	          error = _state2.error;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(_AllForm2.default, { name: name, setName: this.nameHandler })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      highlightElements(this.props, this.state, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      // remove the highlight based on previous highlightClass
	      (0, _markup.unhighlight)(this.props.highlightClass);
	      highlightElements(nextProps, nextState, nextProps.highlightClass);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	    }
	  }]);

	  return AllValueStep;
	}(_react2.default.Component);

	AllValueStep.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  setupState: _react2.default.PropTypes.func,
	  showMessage: _react2.default.PropTypes.func,
	  validate: _react2.default.PropTypes.func,
	  highlightClass: _react2.default.PropTypes.string,
	  takenNames: _react2.default.PropTypes.array
	};

	var ConnectedAllValueStep = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    takenNames: (0, _store.takenNames)(page)
	  };
	}, {
	  showMessage: _expiringReduxMessages.showMessage
	})(AllValueStep);

	var CreateAllValueStep = exports.CreateAllValueStep = function CreateAllValueStep(props) {
	  return _react2.default.createElement(ConnectedAllValueStep, _extends({
	    setupState: initialCreateName,
	    highlightClass: _CSSClasses.queryCheck,
	    validate: validateCreate
	  }, props));
	};

	var EditAllValueStep = exports.EditAllValueStep = function EditAllValueStep(props) {
	  return _react2.default.createElement(ConnectedAllValueStep, _extends({
	    setupState: initialEditName,
	    highlightClass: _CSSClasses.currentSelector,
	    validate: validateEdit
	  }, props));
	};

	/*
	 * when creating an All value, use endData and then startData to
	 * set an initial name
	 */
	function initialCreateName(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var name = '';
	  // if there is an existing value, only use it if the types match
	  if (endData.spec && endData.spec.name !== undefined) {
	    name = endData.spec.name;
	  } else if (startData.spec && startData.spec.name) {
	    name = startData.spec.name;
	  }
	  return name;
	}

	/*
	 * when editing an All value, use endData and then staticData to
	 * set an initial name
	 */
	function initialEditName(props) {
	  var staticData = props.staticData,
	      _props$endData2 = props.endData,
	      endData = _props$endData2 === undefined ? {} : _props$endData2;

	  var name = '';
	  if (endData.spec && endData.spec.name !== undefined) {
	    name = endData.spec.name;
	  } else if (staticData.originalSpec && staticData.originalSpec.name !== undefined) {
	    name = staticData.originalSpec.name;
	  }
	  return name;
	}

	function validateCreate(props, state) {
	  var name = state.name;
	  var takenNames = props.takenNames;

	  return takenNames.every(function (n) {
	    return n !== name;
	  });
	}

	function validateEdit(props, state) {
	  var name = state.name;
	  var takenNames = props.takenNames,
	      staticData = props.staticData;

	  var originalName = staticData.originalSpec.name;
	  // name is taken if we're keeping the same name
	  return name === originalName || takenNames.every(function (n) {
	    return n !== name;
	  });
	}

	function highlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var name = state.name;
	  var selector = startData.selector;
	  var parent = staticData.parent;

	  var elements = (0, _selection.select)(parent.matches, selector, { type: 'all', name: name }, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = AllForm;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function AllForm(props) {
	  var name = props.name,
	      setName = props.setName;

	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h3',
	      null,
	      'What should the array of elements be named?'
	    ),
	    _react2.default.createElement('input', {
	      type: 'text',
	      placeholder: 'e.g., names',
	      value: name,
	      onChange: setName })
	  );
	}

	AllForm.propTypes = {
	  name: _react2.default.PropTypes.string,
	  setName: _react2.default.PropTypes.func
	};

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditSingleValueStep = exports.CreateSingleValueStep = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _SingleForm = __webpack_require__(265);

	var _SingleForm2 = _interopRequireDefault(_SingleForm);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SingleValueStep = function (_React$Component) {
	  _inherits(SingleValueStep, _React$Component);

	  function SingleValueStep(props) {
	    _classCallCheck(this, SingleValueStep);

	    var _this = _possibleConstructorReturn(this, (SingleValueStep.__proto__ || Object.getPrototypeOf(SingleValueStep)).call(this, props));

	    _this.state = {
	      index: props.setupState(props),
	      error: false
	    };

	    _this.indexHandler = _this.indexHandler.bind(_this);
	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(SingleValueStep, [{
	    key: 'indexHandler',
	    value: function indexHandler(event) {
	      var value = event.target.value;

	      this.setState({
	        index: parseInt(value, 10),
	        error: false
	      });
	    }
	  }, {
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var _state = this.state,
	          index = _state.index,
	          error = _state.error;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next,
	          validate = _props.validate;

	      if (error) {
	        return;
	      }
	      var ok = validate(this.props, this.state);
	      if (!ok) {
	        return;
	      }
	      var newSpec = { type: 'single', index: index };
	      next(Object.assign({}, startData, { spec: newSpec }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state2 = this.state,
	          index = _state2.index,
	          error = _state2.error;
	      var _props2 = this.props,
	          startData = _props2.startData,
	          staticData = _props2.staticData;
	      var selector = startData.selector;
	      var parent = staticData.parent;


	      var indices = (0, _selection.count)(parent.matches, selector);

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(_SingleForm2.default, { index: index, count: indices, setIndex: this.indexHandler })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      highlightElements(this.props, this.state, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	      highlightElements(nextProps, nextState, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	    }
	  }]);

	  return SingleValueStep;
	}(_react2.default.Component);

	SingleValueStep.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  setupState: _react2.default.PropTypes.func,
	  validate: _react2.default.PropTypes.func,
	  highlightClass: _react2.default.PropTypes.string
	};

	var CreateSingleValueStep = exports.CreateSingleValueStep = function CreateSingleValueStep(props) {
	  return _react2.default.createElement(SingleValueStep, _extends({
	    setupState: initialCreateIndex,
	    highlightClass: _CSSClasses.queryCheck,
	    validate: function validate() {
	      return true;
	    }
	  }, props));
	};

	var EditSingleValueStep = exports.EditSingleValueStep = function EditSingleValueStep(props) {
	  return _react2.default.createElement(SingleValueStep, _extends({
	    setupState: initialEditIndex,
	    highlightClass: _CSSClasses.currentSelector,
	    validate: function validate() {
	      return true;
	    }
	  }, props));
	};

	function initialCreateIndex(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var index = 0;
	  // if there is an existing value, only use it if the types match
	  if (endData.spec && endData.spec.index !== undefined) {
	    index = endData.spec.index;
	  } else if (startData.spec && startData.spec.index !== undefined) {
	    index = startData.spec.index;
	  }
	  return index;
	}

	function initialEditIndex(props) {
	  var staticData = props.staticData,
	      _props$endData2 = props.endData,
	      endData = _props$endData2 === undefined ? {} : _props$endData2;

	  var index = 0;
	  // if there is an existing index, only use it if the types match
	  if (endData.spec && endData.spec.index !== undefined) {
	    index = endData.spec.index;
	  } else if (staticData.originalSpec && staticData.originalSpec.index !== undefined) {
	    index = staticData.originalSpec.index;
	  }
	  return index;
	}

	function highlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var index = state.index;
	  var selector = startData.selector;
	  var parent = staticData.parent;


	  var elements = (0, _selection.select)(parent.matches, selector, { type: 'single', index: index }, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SingleForm = function SingleForm(_ref) {
	  var index = _ref.index,
	      count = _ref.count,
	      setIndex = _ref.setIndex;
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h3',
	      null,
	      'The element at which index should be selected?'
	    ),
	    _react2.default.createElement(
	      'select',
	      {
	        value: index,
	        onChange: setIndex },
	      Array.from(new Array(count)).map(function (u, i) {
	        return _react2.default.createElement(
	          'option',
	          { key: i, value: i },
	          i
	        );
	      })
	    )
	  );
	};

	SingleForm.propTypes = {
	  index: _react2.default.PropTypes.number,
	  count: _react2.default.PropTypes.number,
	  setIndex: _react2.default.PropTypes.func
	};

	exports.default = SingleForm;

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditRangeValueStep = exports.CreateRangeValueStep = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _RangeForm = __webpack_require__(267);

	var _RangeForm2 = _interopRequireDefault(_RangeForm);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _expiringReduxMessages = __webpack_require__(232);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RangeValueStep = function (_React$Component) {
	  _inherits(RangeValueStep, _React$Component);

	  function RangeValueStep(props) {
	    _classCallCheck(this, RangeValueStep);

	    var _this = _possibleConstructorReturn(this, (RangeValueStep.__proto__ || Object.getPrototypeOf(RangeValueStep)).call(this, props));

	    _this.state = props.setupState(props);

	    _this.nameHandler = _this.nameHandler.bind(_this);
	    _this.lowHandler = _this.lowHandler.bind(_this);
	    _this.highHandler = _this.highHandler.bind(_this);
	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(RangeValueStep, [{
	    key: 'nameHandler',
	    value: function nameHandler(event) {
	      var value = event.target.value;

	      this.setState({
	        name: value,
	        error: value === ''
	      });
	    }
	  }, {
	    key: 'lowHandler',
	    value: function lowHandler(event) {
	      var value = event.target.value;

	      var low = parseInt(value, 10);
	      var high = this.state.high;

	      if (low > high) {
	        var _ref = [low, high];
	        high = _ref[0];
	        low = _ref[1];
	      }
	      this.setState({
	        low: low,
	        high: high
	      });
	    }
	  }, {
	    key: 'highHandler',
	    value: function highHandler(event) {
	      var value = event.target.value;

	      if (value === 'end') {
	        this.setState({
	          high: value
	        });
	        return;
	      }
	      var high = parseInt(value, 10);
	      var low = this.state.low;

	      if (low > high) {
	        var _ref2 = [low, high];
	        high = _ref2[0];
	        low = _ref2[1];
	      }
	      this.setState({
	        low: low,
	        high: high
	      });
	    }
	  }, {
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var _state = this.state,
	          name = _state.name,
	          low = _state.low,
	          high = _state.high,
	          error = _state.error;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next,
	          showMessage = _props.showMessage,
	          validate = _props.validate;


	      var ok = validate(this.props, this.state);
	      if (!ok) {
	        showMessage('"' + name + '" is a duplicate name and cannot be used.', 5000, -1);
	        return;
	      }

	      if (error) {
	        return;
	      }
	      var newSpec = {
	        type: 'range',
	        name: name,
	        low: low,
	        high: high === 'end' ? null : high // convert 'end' to null
	      };
	      next(Object.assign({}, startData, { spec: newSpec }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state2 = this.state,
	          name = _state2.name,
	          low = _state2.low,
	          high = _state2.high,
	          error = _state2.error;
	      var _props2 = this.props,
	          startData = _props2.startData,
	          staticData = _props2.staticData;
	      var selector = startData.selector;
	      var parent = staticData.parent;


	      var indices = (0, _selection.count)(parent.matches, selector);

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(_RangeForm2.default, {
	            name: name,
	            low: low,
	            high: high,
	            count: indices,
	            setName: this.nameHandler,
	            setLow: this.lowHandler,
	            setHigh: this.highHandler })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      highlightElements(this.props, this.state, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	      highlightElements(nextProps, nextState, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	    }
	  }]);

	  return RangeValueStep;
	}(_react2.default.Component);

	RangeValueStep.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  setupState: _react2.default.PropTypes.func,
	  highlightClass: _react2.default.PropTypes.string,
	  validate: _react2.default.PropTypes.func,
	  showMessage: _react2.default.PropTypes.func,
	  takenNames: _react2.default.PropTypes.array
	};

	var ConnectedRangeValueStep = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    takenNames: (0, _store.takenNames)(page)
	  };
	}, {
	  showMessage: _expiringReduxMessages.showMessage
	})(RangeValueStep);

	var CreateRangeValueStep = exports.CreateRangeValueStep = function CreateRangeValueStep(props) {
	  return _react2.default.createElement(ConnectedRangeValueStep, _extends({
	    setupState: initialCreateState,
	    highlightClass: _CSSClasses.queryCheck,
	    validate: validateCreate
	  }, props));
	};

	var EditRangeValueStep = exports.EditRangeValueStep = function EditRangeValueStep(props) {
	  return _react2.default.createElement(ConnectedRangeValueStep, _extends({
	    setupState: initialEditState,
	    highlightClass: _CSSClasses.currentSelector,
	    validate: validateEdit
	  }, props));
	};

	function initialCreateState(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var name = '';
	  var low = 0;
	  var high = 'end';

	  if (endData.spec) {
	    if (endData.spec.name) {
	      name = endData.spec.name;
	    }
	    if (endData.spec.low !== undefined) {
	      low = endData.spec.low;
	    }
	    if (endData.spec.high !== undefined) {
	      high = endData.spec.high === null ? 'end' : endData.spec.high;
	    }
	  } else if (startData.spec) {
	    if (startData.spec.name) {
	      name = startData.spec.name;
	    }
	    if (startData.spec.low !== undefined) {
	      low = startData.spec.low;
	    }
	    if (startData.spec.high !== undefined) {
	      high = startData.spec.high === null ? 'end' : startData.spec.high;
	    }
	  }

	  return {
	    name: name,
	    low: low,
	    high: high,
	    error: name === ''
	  };
	}

	function initialEditState(props) {
	  var staticData = props.staticData,
	      _props$endData2 = props.endData,
	      endData = _props$endData2 === undefined ? {} : _props$endData2;

	  var name = '';
	  var low = 0;
	  var high = 'end';
	  // if there is an existing value, only use it if the types match
	  if (endData.spec) {
	    var spec = endData.spec;
	    if (spec.name) {
	      name = spec.name;
	    }
	    if (spec.low !== undefined) {
	      low = spec.low;
	    }
	    if (spec.high !== undefined) {
	      high = spec.high === null ? 'end' : spec.high;
	    }
	  } else if (staticData.originalSpec) {
	    var _spec = staticData.originalSpec;
	    if (_spec.name) {
	      name = _spec.name;
	    }
	    if (_spec.low !== undefined) {
	      low = _spec.low;
	    }
	    if (_spec.high !== undefined) {
	      high = _spec.high === null ? 'end' : _spec.high;
	    }
	  }
	  return {
	    name: name,
	    low: low,
	    high: high,
	    error: name === ''
	  };
	}

	function validateCreate(props, state) {
	  var name = state.name;
	  var takenNames = props.takenNames;

	  return takenNames.every(function (n) {
	    return n !== name;
	  });
	}

	function validateEdit(props, state) {
	  var name = state.name;
	  var takenNames = props.takenNames,
	      staticData = props.staticData;

	  var originalName = staticData.originalSpec.name;
	  // name is taken if we're keeping the same name
	  return name === originalName || takenNames.every(function (n) {
	    return n !== name;
	  });
	}

	function highlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var name = state.name,
	      low = state.low;
	  var high = state.high;
	  var selector = startData.selector;
	  var parent = staticData.parent;

	  if (high === 'end') {
	    high = null;
	  }
	  var elements = (0, _selection.select)(parent.matches, selector, { type: 'range', name: name, low: low, high: high }, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = RangeForm;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function RangeForm(props) {
	  var name = props.name,
	      low = props.low,
	      high = props.high,
	      count = props.count,
	      setName = props.setName,
	      setLow = props.setLow,
	      setHigh = props.setHigh;


	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h3',
	      null,
	      'What should the array of elements be named?'
	    ),
	    _react2.default.createElement('input', {
	      type: 'text',
	      placeholder: 'e.g., names',
	      value: name,
	      onChange: setName }),
	    _react2.default.createElement(
	      'h3',
	      null,
	      'Which elements should be selected?'
	    ),
	    _react2.default.createElement(
	      'select',
	      { value: low, onChange: setLow },
	      Array.from(new Array(count)).map(function (u, i) {
	        return _react2.default.createElement(
	          'option',
	          { key: i, value: i },
	          i
	        );
	      })
	    ),
	    ' - ',
	    _react2.default.createElement(
	      'select',
	      { value: high, onChange: setHigh },
	      Array.from(new Array(count)).map(function (u, i) {
	        return _react2.default.createElement(
	          'option',
	          { key: i, value: i },
	          i
	        );
	      }),
	      _react2.default.createElement(
	        'option',
	        { key: 'end', value: 'end' },
	        'end'
	      )
	    )
	  );
	}

	RangeForm.propTypes = {
	  name: _react2.default.PropTypes.string,
	  low: _react2.default.PropTypes.number,
	  high: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
	  count: _react2.default.PropTypes.number,
	  setName: _react2.default.PropTypes.func,
	  setLow: _react2.default.PropTypes.func,
	  setHigh: _react2.default.PropTypes.func
	};

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditOptional = exports.CreateOptional = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _OptionalForm = __webpack_require__(269);

	var _OptionalForm2 = _interopRequireDefault(_OptionalForm);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ChooseOptional = function (_React$Component) {
	  _inherits(ChooseOptional, _React$Component);

	  function ChooseOptional(props) {
	    _classCallCheck(this, ChooseOptional);

	    var _this = _possibleConstructorReturn(this, (ChooseOptional.__proto__ || Object.getPrototypeOf(ChooseOptional)).call(this, props));

	    _this.state = {
	      optional: initialOptional(_this.props)
	    };

	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.toggleOptional = _this.toggleOptional.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseOptional, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var optional = this.state.optional;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next;

	      next(Object.assign({}, startData, { optional: optional }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'toggleOptional',
	    value: function toggleOptional(event) {
	      this.setState({
	        optional: event.target.checked
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var optional = this.state.optional;


	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(_OptionalForm2.default, { optional: optional, toggle: this.toggleOptional })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      highlightElements(this.props, this.state, this.props.highlightClass);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      // remove the highlight based on previous highlightClass
	      (0, _markup.unhighlight)(this.props.highlightClass);
	      highlightElements(nextProps, nextState, nextProps.highlightClass);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(this.props.highlightClass);
	    }
	  }]);

	  return ChooseOptional;
	}(_react2.default.Component);

	ChooseOptional.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func,
	  highlightClass: _react2.default.PropTypes.string.isRequired
	};

	var CreateOptional = exports.CreateOptional = function CreateOptional(props) {
	  return _react2.default.createElement(ChooseOptional, _extends({ highlightClass: _CSSClasses.queryCheck }, props));
	};

	var EditOptional = exports.EditOptional = function EditOptional(props) {
	  return _react2.default.createElement(ChooseOptional, _extends({ highlightClass: _CSSClasses.currentSelector }, props));
	};

	function initialOptional(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var optional = false;
	  if (endData.optional !== undefined) {
	    optional = endData.optional;
	  } else if (startData.optional !== undefined) {
	    optional = startData.optional;
	  }
	  return optional;
	}

	function highlightElements(props, state, highlightClass) {
	  var startData = props.startData,
	      staticData = props.staticData;
	  var selector = startData.selector,
	      spec = startData.spec;
	  var _staticData$parent = staticData.parent,
	      parent = _staticData$parent === undefined ? {} : _staticData$parent;
	  var _parent$matches = parent.matches,
	      parentMatches = _parent$matches === undefined ? [document] : _parent$matches;

	  var elements = (0, _selection.select)(parentMatches, selector, spec, '.forager-holder');
	  (0, _markup.highlight)(elements, highlightClass);
	}

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var OptionalForm = function OptionalForm(_ref) {
	  var optional = _ref.optional,
	      toggle = _ref.toggle;
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h3',
	      null,
	      'Is this element optional?'
	    ),
	    _react2.default.createElement(
	      'label',
	      { className: optional ? 'selected' : null },
	      _react2.default.createElement('input', {
	        type: 'checkbox',
	        checked: optional,
	        onChange: toggle }),
	      optional ? 'Yes' : 'No'
	    )
	  );
	};

	OptionalForm.propTypes = {
	  optional: _react2.default.PropTypes.bool,
	  toggle: _react2.default.PropTypes.func
	};

	exports.default = OptionalForm;

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _page = __webpack_require__(231);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ConfirmElement = function (_React$Component) {
	  _inherits(ConfirmElement, _React$Component);

	  function ConfirmElement(props) {
	    _classCallCheck(this, ConfirmElement);

	    var _this = _possibleConstructorReturn(this, (ConfirmElement.__proto__ || Object.getPrototypeOf(ConfirmElement)).call(this, props));

	    _this.saveHandler = _this.saveHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ConfirmElement, [{
	    key: 'saveHandler',
	    value: function saveHandler(event) {
	      event.preventDefault();
	      var _props = this.props,
	          startData = _props.startData,
	          save = _props.next;
	      var selector = startData.selector,
	          spec = startData.spec,
	          optional = startData.optional;

	      var ele = (0, _page.createElement)(selector, spec, optional);
	      save(ele);
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var startData = this.props.startData;
	      var selector = startData.selector,
	          spec = startData.spec,
	          optional = startData.optional;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'h2',
	          null,
	          'Confirm Element'
	        ),
	        _react2.default.createElement(
	          'ul',
	          null,
	          _react2.default.createElement(
	            'li',
	            null,
	            'Selector: ',
	            selector
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Spec: ',
	            JSON.stringify(spec, null, '\t')
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Optional: ',
	            optional ? 'Yes' : 'No'
	          )
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.saveHandler,
	          nextText: 'Save',
	          cancel: this.cancelHandler })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props2 = this.props,
	          startData = _props2.startData,
	          staticData = _props2.staticData;
	      var selector = startData.selector,
	          spec = startData.spec;
	      var parent = staticData.parent;

	      var elements = (0, _selection.select)(parent.matches, selector, spec, '.forager-holder');
	      (0, _markup.highlight)(elements, _CSSClasses.queryCheck);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.queryCheck);
	    }
	  }]);

	  return ConfirmElement;
	}(_react2.default.Component);

	ConfirmElement.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	exports.default = ConfirmElement;

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _selection = __webpack_require__(229);

	var _markup = __webpack_require__(248);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ConfirmElement = function (_React$Component) {
	  _inherits(ConfirmElement, _React$Component);

	  function ConfirmElement(props) {
	    _classCallCheck(this, ConfirmElement);

	    var _this = _possibleConstructorReturn(this, (ConfirmElement.__proto__ || Object.getPrototypeOf(ConfirmElement)).call(this, props));

	    _this.saveHandler = _this.saveHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ConfirmElement, [{
	    key: 'saveHandler',
	    value: function saveHandler(event) {
	      event.preventDefault();
	      var _props = this.props,
	          startData = _props.startData,
	          save = _props.next;
	      var spec = startData.spec,
	          optional = startData.optional;

	      save({
	        optional: optional,
	        spec: spec
	      });
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var startData = this.props.startData;
	      var selector = startData.selector,
	          spec = startData.spec,
	          optional = startData.optional;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'h2',
	          null,
	          'Confirm Updated Element'
	        ),
	        _react2.default.createElement(
	          'ul',
	          null,
	          _react2.default.createElement(
	            'li',
	            null,
	            'Selector: ',
	            selector
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Spec: ',
	            JSON.stringify(spec, null, '\t')
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Optional: ',
	            optional ? 'Yes' : 'No'
	          )
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.saveHandler,
	          nextText: 'Update',
	          cancel: this.cancelHandler })
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props2 = this.props,
	          startData = _props2.startData,
	          staticData = _props2.staticData;
	      var spec = startData.spec;
	      var _staticData$parent = staticData.parent,
	          parent = _staticData$parent === undefined ? {} : _staticData$parent;
	      var _parent$matches = parent.matches,
	          parentMatches = _parent$matches === undefined ? [document] : _parent$matches;

	      var elements = (0, _selection.select)(parentMatches, startData.selector, spec, '.forager-holder');
	      (0, _markup.highlight)(elements, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	    }
	  }]);

	  return ConfirmElement;
	}(_react2.default.Component);

	ConfirmElement.propTypes = {
	  startData: _react2.default.PropTypes.object,
	  endData: _react2.default.PropTypes.object,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func
	};

	exports.default = ConfirmElement;

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _simpleWizardComponent = __webpack_require__(254);

	var _simpleWizardComponent2 = _interopRequireDefault(_simpleWizardComponent);

	var _Tree = __webpack_require__(245);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _element = __webpack_require__(255);

	var _actions = __webpack_require__(238);

	var _store = __webpack_require__(252);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var steps = [_element.EditType, _element.EditValue, _element.EditOptional, _element.ConfirmUpdate];

	/*
	 * Type -> Value -> Optional -> ConfirmUpdate
	 * each step should make sure to pass the current object (the currently
	 * selected element selector) as a property of the object returned
	 * in its next call
	 */

	var EditElementWizard = function (_React$Component) {
	  _inherits(EditElementWizard, _React$Component);

	  function EditElementWizard(props) {
	    _classCallCheck(this, EditElementWizard);

	    var _this = _possibleConstructorReturn(this, (EditElementWizard.__proto__ || Object.getPrototypeOf(EditElementWizard)).call(this, props));

	    _this.save = _this.save.bind(_this);
	    _this.cancel = _this.cancel.bind(_this);
	    return _this;
	  }

	  _createClass(EditElementWizard, [{
	    key: 'save',
	    value: function save(newProps) {
	      var _props = this.props,
	          current = _props.current,
	          updateElement = _props.updateElement;
	      var spec = newProps.spec,
	          optional = newProps.optional;

	      updateElement(current.index, {
	        spec: spec,
	        optional: optional
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props,
	          current = _props2.current,
	          parent = _props2.parent;
	      var selector = current.selector,
	          spec = current.spec,
	          optional = current.optional;

	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_Tree2.default, null),
	        _react2.default.createElement(_simpleWizardComponent2.default, {
	          steps: steps,
	          initialData: {
	            selector: selector,
	            spec: spec,
	            optional: optional
	          },
	          staticData: {
	            parent: parent,
	            originalSpec: spec
	          },
	          save: this.save,
	          cancel: this.cancel })
	      );
	    }
	  }]);

	  return EditElementWizard;
	}(_react2.default.Component);

	EditElementWizard.propTypes = {
	  current: _react2.default.PropTypes.object,
	  parent: _react2.default.PropTypes.object,
	  updateElement: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    current: (0, _store.currentElement)(page),
	    parent: (0, _store.currentParent)(page)
	  };
	}, {
	  updateElement: _actions.updateElement,
	  cancel: _actions.showElementFrame
	})(EditElementWizard);

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _simpleWizardComponent = __webpack_require__(254);

	var _simpleWizardComponent2 = _interopRequireDefault(_simpleWizardComponent);

	var _ElementCard = __webpack_require__(249);

	var _ElementCard2 = _interopRequireDefault(_ElementCard);

	var _rule = __webpack_require__(274);

	var _Cycle = __webpack_require__(281);

	var _Cycle2 = _interopRequireDefault(_Cycle);

	var _actions = __webpack_require__(238);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var steps = [_rule.Attribute, _rule.Type, _rule.Name, _rule.ConfirmSaveRule];

	/*
	 * ttribute -> Type -> Name -> ConfirmSaveRule
	 *
	 * The RuleWizard is used to create a rule for an element. A Cycle is
	 * used to cycle through the DOM elements that the element matches while
	 * creating the rule.
	 */

	var RuleWizard = function (_React$Component) {
	  _inherits(RuleWizard, _React$Component);

	  function RuleWizard(props) {
	    _classCallCheck(this, RuleWizard);

	    var _this = _possibleConstructorReturn(this, (RuleWizard.__proto__ || Object.getPrototypeOf(RuleWizard)).call(this, props));

	    _this.state = {
	      index: 0
	    };
	    _this.setIndex = _this.setIndex.bind(_this);
	    _this.save = _this.save.bind(_this);
	    _this.cancel = _this.cancel.bind(_this);
	    return _this;
	  }

	  _createClass(RuleWizard, [{
	    key: 'setIndex',
	    value: function setIndex(index) {
	      this.setState({
	        index: index
	      });
	    }
	  }, {
	    key: 'save',
	    value: function save(rule) {
	      this.props.saveRule(rule);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var current = this.props.current;
	      var index = this.state.index;

	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_ElementCard2.default, { active: false, element: current }),
	        _react2.default.createElement(
	          _simpleWizardComponent2.default,
	          { steps: steps,
	            initialData: {},
	            staticData: {
	              element: current.matches[index]
	            },
	            save: this.save,
	            cancel: this.cancel },
	          _react2.default.createElement(_Cycle2.default, { index: index,
	            count: current.matches.length,
	            setIndex: this.setIndex })
	        )
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var current = this.props.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps) {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	      var current = nextProps.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	    }
	  }]);

	  return RuleWizard;
	}(_react2.default.Component);

	RuleWizard.propTypes = {
	  saveRule: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired,
	  current: _react2.default.PropTypes.object
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;

	  return {
	    current: (0, _store.currentElement)(page)
	  };
	}, {
	  saveRule: _actions.saveRule,
	  cancel: _actions.showElementFrame
	})(RuleWizard);

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ChooseAttribute = __webpack_require__(275);

	Object.defineProperty(exports, 'Attribute', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ChooseAttribute).default;
	  }
	});

	var _ChooseName = __webpack_require__(277);

	Object.defineProperty(exports, 'Name', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ChooseName).default;
	  }
	});

	var _ChooseType = __webpack_require__(278);

	Object.defineProperty(exports, 'Type', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ChooseType).default;
	  }
	});

	var _ConfirmRule = __webpack_require__(280);

	Object.defineProperty(exports, 'ConfirmSaveRule', {
	  enumerable: true,
	  get: function get() {
	    return _ConfirmRule.ConfirmSaveRule;
	  }
	});
	Object.defineProperty(exports, 'ConfirmUpdateRule', {
	  enumerable: true,
	  get: function get() {
	    return _ConfirmRule.ConfirmUpdateRule;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _attributes = __webpack_require__(276);

	var _text = __webpack_require__(228);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function initialAttribute(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;


	  var attribute = '';
	  if (endData.attribute) {
	    attribute = endData.attribute;
	  } else if (startData.attr) {
	    attribute = startData.attr;
	  }
	  return attribute;
	}

	var ChooseAttribute = function (_React$Component) {
	  _inherits(ChooseAttribute, _React$Component);

	  function ChooseAttribute(props) {
	    _classCallCheck(this, ChooseAttribute);

	    var _this = _possibleConstructorReturn(this, (ChooseAttribute.__proto__ || Object.getPrototypeOf(ChooseAttribute)).call(this, props));

	    var attribute = initialAttribute(props);
	    _this.state = {
	      attribute: attribute,
	      error: attribute === ''
	    };

	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.attributeHandler = _this.attributeHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseAttribute, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var _state = this.state,
	          attribute = _state.attribute,
	          error = _state.error;


	      if (error) {
	        return;
	      }

	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next;

	      next(Object.assign({}, startData, { attribute: attribute }));
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'attributeHandler',
	    value: function attributeHandler(event) {
	      this.setState({
	        attribute: event.target.value,
	        error: false
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _state2 = this.state,
	          attribute = _state2.attribute,
	          error = _state2.error;
	      var staticData = this.props.staticData;
	      var element = staticData.element;


	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'Which attribute has the value that you want?'
	          ),
	          _react2.default.createElement(
	            'ul',
	            null,
	            (0, _attributes.attributes)(element).map(function (a, i) {
	              return _react2.default.createElement(
	                'li',
	                { key: i },
	                _react2.default.createElement(
	                  'label',
	                  null,
	                  _react2.default.createElement('input', {
	                    type: 'radio',
	                    value: a.name,
	                    checked: a.name === attribute,
	                    onChange: _this2.attributeHandler }),
	                  a.name
	                ),
	                _react2.default.createElement(
	                  'p',
	                  { className: 'line' },
	                  (0, _text.abbreviate)(a.value, 40)
	                )
	              );
	            })
	          ),
	          this.props.children
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }]);

	  return ChooseAttribute;
	}(_react2.default.Component);

	ChooseAttribute.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired,
	  children: _react2.default.PropTypes.element
	};

	exports.default = ChooseAttribute;

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.stripEvents = exports.attributes = undefined;

	var _CSSClasses = __webpack_require__(230);

	// return an object mapping attribute names to their value
	// for all attributes of an element
	var attributes = exports.attributes = function attributes(element) {
	  var ignored = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var ignoredClasses = [_CSSClasses.currentSelector, _CSSClasses.potentialSelector, _CSSClasses.queryCheck, _CSSClasses.hoverClass, _CSSClasses.savedPreview];

	  var attrs = Array.from(element.attributes).reduce(function (stored, attr) {
	    var name = attr.name,
	        value = attr.value;

	    if (ignored[name]) {
	      return stored;
	    }
	    // don't include forager specific classes
	    if (name === 'class') {
	      value = value.split(' ').filter(function (c) {
	        return !ignoredClasses.includes(c) && c !== '';
	      }).join(' ');
	    }
	    // don't include empty attrs
	    if (value !== '') {
	      stored.push({ name: name, value: value });
	    }
	    return stored;
	  }, []);

	  // include text if it exists
	  var text = element.textContent.trim();
	  if (text !== '') {
	    attrs.push({ name: 'text', value: text });
	  }

	  return attrs;
	};

	/*
	 * stripEvents
	 * -----------
	 * If an element has no on* attributes, it is returned. Otherwise, all on* attrs
	 * are removed from the element and a clone is made. The element is replaced in
	 * the dom by the clone and the clone is returned.
	 *
	 * This breaks the page (so that Forager events can dispatch uninterrupted)
	 * but makes it so that you don't have to worry about accidentally navigating,
	 * submitting, or anythign else while trying to select an element. A refresh
	 * of the page will be necessary to restore the page's default functionality.
	 *
	 * Because there isn't a good reason to capture data from on* attributes, they
	 * are removed instead of just replacing the event function.
	 */
	var stripEvents = exports.stripEvents = function stripEvents(element) {
	  var attrs = Array.from(element.attributes);
	  if (attrs.some(function (a) {
	    return a.name.startsWith('on');
	  })) {
	    attrs.forEach(function (attr) {
	      var name = attr.name;
	      if (name.startsWith('on')) {
	        element.removeAttribute(name);
	      }
	    });
	    var clone = element.cloneNode(true);
	    element.parentNode.replaceChild(clone, element);
	    return clone;
	  } else {
	    return element;
	  }
	};

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _page = __webpack_require__(231);

	var _expiringReduxMessages = __webpack_require__(232);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function initialName(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var name = '';
	  if (endData.name) {
	    name = endData.name;
	  } else if (startData.name) {
	    name = startData.name;
	  }
	  return name;
	}

	var ChooseName = function (_React$Component) {
	  _inherits(ChooseName, _React$Component);

	  function ChooseName(props) {
	    _classCallCheck(this, ChooseName);

	    var _this = _possibleConstructorReturn(this, (ChooseName.__proto__ || Object.getPrototypeOf(ChooseName)).call(this, props));

	    var name = initialName(props);
	    _this.state = {
	      name: name,
	      error: name === ''
	    };

	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.nameHandler = _this.nameHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseName, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var name = this.state.name;
	      var _props = this.props,
	          takenNames = _props.takenNames,
	          showMessage = _props.showMessage,
	          startData = _props.startData,
	          next = _props.next;
	      var existingName = startData.name;


	      if (name !== existingName && !takenNames.every(function (n) {
	        return n !== name;
	      })) {
	        showMessage('"' + name + '" is a duplicate name and cannot be used.', 5000, -1);
	        return;
	      }

	      next(Object.assign({}, startData, { name: name }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'nameHandler',
	    value: function nameHandler(event) {
	      var name = event.target.value;
	      this.setState({
	        name: name,
	        error: name === ''
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _state = this.state,
	          name = _state.name,
	          error = _state.error;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'What should the rule be named?'
	          ),
	          _react2.default.createElement('input', {
	            type: 'text',
	            placeholder: 'e.g., name',
	            value: name,
	            onChange: this.nameHandler })
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler,
	          error: error })
	      );
	    }
	  }]);

	  return ChooseName;
	}(_react2.default.Component);

	ChooseName.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired,
	  next: _react2.default.PropTypes.func.isRequired,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func.isRequired,
	  takenNames: _react2.default.PropTypes.array.isRequired,
	  showMessage: _react2.default.PropTypes.func.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages,
	      pageIndex = page.pageIndex,
	      elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  /*
	   * NOTE: this is different than other takenNames because it wants
	   * the names within the current element
	   */
	  return {
	    takenNames: (0, _page.levelNames)(currentPage.elements, elementIndex)
	  };
	}, {
	  showMessage: _expiringReduxMessages.showMessage
	})(ChooseName);

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	var _text = __webpack_require__(228);

	var _parse = __webpack_require__(279);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function initialType(props) {
	  var startData = props.startData,
	      _props$endData = props.endData,
	      endData = _props$endData === undefined ? {} : _props$endData;

	  var type = 'string';
	  if (endData.type) {
	    type = endData.type;
	  } else if (startData.type) {
	    type = startData.type;
	  }
	  return type;
	}

	var ChooseType = function (_React$Component) {
	  _inherits(ChooseType, _React$Component);

	  function ChooseType(props) {
	    _classCallCheck(this, ChooseType);

	    var _this = _possibleConstructorReturn(this, (ChooseType.__proto__ || Object.getPrototypeOf(ChooseType)).call(this, props));

	    _this.state = {
	      type: initialType(props)
	    };

	    _this.nextHandler = _this.nextHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    _this.typeHandler = _this.typeHandler.bind(_this);
	    return _this;
	  }

	  _createClass(ChooseType, [{
	    key: 'nextHandler',
	    value: function nextHandler(event) {
	      event.preventDefault();
	      var type = this.state.type;
	      var _props = this.props,
	          startData = _props.startData,
	          next = _props.next;

	      next(Object.assign({}, startData, { type: type }));
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'typeHandler',
	    value: function typeHandler(event) {
	      this.setState({
	        type: event.target.value
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var type = this.state.type;
	      var _props2 = this.props,
	          startData = _props2.startData,
	          children = _props2.children;
	      var attribute = startData.attribute;
	      var staticData = this.props.staticData;
	      var element = staticData.element;


	      var value = attribute === 'text' ? element.innerText : element.getAttribute(attribute);

	      var preview = void 0;
	      switch (type) {
	        case 'string':
	          preview = (0, _text.abbreviate)(value, 40);
	          break;
	        case 'int':
	          preview = (0, _parse.integer)(value);
	          if (preview === null) {
	            preview = 'No int detected';
	          }
	          break;
	        case 'float':
	          preview = (0, _parse.float)(value);
	          if (preview === null) {
	            preview = 'No float detected';
	          }
	          break;
	      }

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'div',
	          { className: 'info' },
	          _react2.default.createElement(
	            'h3',
	            null,
	            'What type of value is this?'
	          ),
	          ['string', 'int', 'float'].map(function (t, i) {
	            return _react2.default.createElement(
	              'label',
	              { key: i },
	              _react2.default.createElement('input', {
	                type: 'radio',
	                value: t,
	                checked: t === type,
	                onChange: _this2.typeHandler }),
	              t
	            );
	          }),
	          _react2.default.createElement(
	            'p',
	            { className: 'line' },
	            preview
	          ),
	          children
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.nextHandler,
	          cancel: this.cancelHandler })
	      );
	    }
	  }]);

	  return ChooseType;
	}(_react2.default.Component);

	ChooseType.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired,
	  staticData: _react2.default.PropTypes.object,
	  next: _react2.default.PropTypes.func.isRequired,
	  previous: _react2.default.PropTypes.func,
	  cancel: _react2.default.PropTypes.func.isRequired,
	  children: _react2.default.PropTypes.element
	};

	exports.default = ChooseType;

/***/ }),
/* 279 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.integer = integer;
	exports.float = float;
	// extract the first integer from a string
	function integer(value) {
	  var intRegEx = /\d+/;
	  var match = value.match(intRegEx);
	  return match !== null ? parseInt(match[0], 10) : null;
	}

	// extract the first float from a string
	function float(value) {
	  var floatRegEx = /\d+(\.\d+)?/;
	  var match = value.match(floatRegEx);
	  return match !== null ? parseFloat(match[0]) : null;
	}

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ConfirmUpdateRule = exports.ConfirmSaveRule = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _StepControls = __webpack_require__(257);

	var _StepControls2 = _interopRequireDefault(_StepControls);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Confirm = function (_React$Component) {
	  _inherits(Confirm, _React$Component);

	  function Confirm(props) {
	    _classCallCheck(this, Confirm);

	    var _this = _possibleConstructorReturn(this, (Confirm.__proto__ || Object.getPrototypeOf(Confirm)).call(this, props));

	    _this.saveHandler = _this.saveHandler.bind(_this);
	    _this.previousHandler = _this.previousHandler.bind(_this);
	    _this.cancelHandler = _this.cancelHandler.bind(_this);
	    return _this;
	  }

	  _createClass(Confirm, [{
	    key: 'saveHandler',
	    value: function saveHandler(event) {
	      event.preventDefault();
	      var _props = this.props,
	          startData = _props.startData,
	          save = _props.next;
	      var name = startData.name,
	          attribute = startData.attribute,
	          type = startData.type;

	      save({
	        name: name,
	        type: type,
	        attr: attribute
	      });
	    }
	  }, {
	    key: 'previousHandler',
	    value: function previousHandler(event) {
	      event.preventDefault();
	      this.props.previous();
	    }
	  }, {
	    key: 'cancelHandler',
	    value: function cancelHandler(event) {
	      event.preventDefault();
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props,
	          startData = _props2.startData,
	          buttonText = _props2.buttonText,
	          title = _props2.title;
	      var name = startData.name,
	          attribute = startData.attribute,
	          type = startData.type;

	      return _react2.default.createElement(
	        'form',
	        { className: 'info-box' },
	        _react2.default.createElement(
	          'h2',
	          null,
	          title
	        ),
	        _react2.default.createElement(
	          'ul',
	          null,
	          _react2.default.createElement(
	            'li',
	            null,
	            'Name: ',
	            name
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Attribute: ',
	            attribute
	          ),
	          _react2.default.createElement(
	            'li',
	            null,
	            'Type: ',
	            type
	          )
	        ),
	        _react2.default.createElement(_StepControls2.default, {
	          previous: this.previousHandler,
	          next: this.saveHandler,
	          nextText: buttonText,
	          cancel: this.cancelHandler })
	      );
	    }
	  }]);

	  return Confirm;
	}(_react2.default.Component);

	Confirm.propTypes = {
	  startData: _react2.default.PropTypes.object.isRequired,
	  title: _react2.default.PropTypes.string.isRequired,
	  buttonText: _react2.default.PropTypes.string.isRequired,
	  next: _react2.default.PropTypes.func.isRequired,
	  previous: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired
	};

	var ConfirmSaveRule = exports.ConfirmSaveRule = function ConfirmSaveRule(props) {
	  return _react2.default.createElement(Confirm, _extends({
	    title: 'Confirm Rule',
	    buttonText: 'Save'
	  }, props));
	};

	var ConfirmUpdateRule = exports.ConfirmUpdateRule = function ConfirmUpdateRule(props) {
	  return _react2.default.createElement(Confirm, _extends({
	    title: 'Confirm Update Rule',
	    buttonText: 'Update'
	  }, props));
	};

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Buttons = __webpack_require__(226);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Given an array of items, a Cycle uses two buttons to
	 * allow you to cycle through the items in the array. The
	 * Cycle only handles controlling the index that should
	 * be shown, not displaying the actual items. A callback
	 * is used to let the component in charge of displaying
	 * items know the index of the one to show.
	 *
	 * When incrementing, automatically returns to 0 when end of
	 * list has been reached. When decrementing, automatically
	 * jumps to end of list after 0.
	 */
	var Cycle = function Cycle(_ref) {
	  var index = _ref.index,
	      count = _ref.count,
	      setIndex = _ref.setIndex;

	  var nextIndex = (index + 1) % count;
	  var prevIndex = (index - 1 + count) % count;
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(_Buttons.NeutralButton, {
	      click: function click() {
	        setIndex(prevIndex);
	      },
	      text: '<' }),
	    index + 1,
	    ' / ',
	    count,
	    _react2.default.createElement(_Buttons.NeutralButton, {
	      click: function click() {
	        setIndex(nextIndex);
	      },
	      text: '>' })
	  );
	};

	Cycle.propTypes = {
	  index: _react2.default.PropTypes.number.isRequired,
	  count: _react2.default.PropTypes.number.isRequired,
	  setIndex: _react2.default.PropTypes.func
	};

	exports.default = Cycle;

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _simpleWizardComponent = __webpack_require__(254);

	var _simpleWizardComponent2 = _interopRequireDefault(_simpleWizardComponent);

	var _ElementCard = __webpack_require__(249);

	var _ElementCard2 = _interopRequireDefault(_ElementCard);

	var _rule = __webpack_require__(274);

	var _Cycle = __webpack_require__(281);

	var _Cycle2 = _interopRequireDefault(_Cycle);

	var _actions = __webpack_require__(238);

	var _markup = __webpack_require__(248);

	var _store = __webpack_require__(252);

	var _CSSClasses = __webpack_require__(230);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var steps = [_rule.Attribute, _rule.Type, _rule.Name, _rule.ConfirmUpdateRule];

	/*
	 * Attribute -> Type -> Name -> ConfirmUpdateRule
	 */

	var EditRuleWizard = function (_React$Component) {
	  _inherits(EditRuleWizard, _React$Component);

	  function EditRuleWizard(props) {
	    _classCallCheck(this, EditRuleWizard);

	    var _this = _possibleConstructorReturn(this, (EditRuleWizard.__proto__ || Object.getPrototypeOf(EditRuleWizard)).call(this, props));

	    _this.state = {
	      index: 0
	    };
	    _this.setIndex = _this.setIndex.bind(_this);
	    _this.save = _this.save.bind(_this);
	    _this.cancel = _this.cancel.bind(_this);
	    return _this;
	  }

	  _createClass(EditRuleWizard, [{
	    key: 'setIndex',
	    value: function setIndex(index) {
	      this.setState({
	        index: index
	      });
	    }
	  }, {
	    key: 'save',
	    value: function save(rule) {
	      var _props = this.props,
	          updateRule = _props.updateRule,
	          ruleIndex = _props.ruleIndex;

	      updateRule(ruleIndex, rule);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this.props.cancel();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props,
	          current = _props2.current,
	          ruleIndex = _props2.ruleIndex;
	      // make sure that the rule exists

	      var rule = current.rules[ruleIndex];
	      if (ruleIndex === undefined || ruleIndex === undefined) {
	        return null;
	      }
	      var index = this.state.index;
	      var name = rule.name,
	          attr = rule.attr,
	          type = rule.type;


	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_ElementCard2.default, { active: false, element: current }),
	        _react2.default.createElement(
	          _simpleWizardComponent2.default,
	          {
	            steps: steps,
	            initialData: {
	              current: current,
	              index: 0,
	              name: name,
	              attr: attr,
	              type: type
	            },
	            staticData: {
	              element: current.matches[index]
	            },
	            save: this.save,
	            cancel: this.cancel },
	          _react2.default.createElement(_Cycle2.default, {
	            index: index,
	            count: current.matches.length,
	            setIndex: this.setIndex })
	        )
	      );
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var current = this.props.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps) {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	      var current = nextProps.current;

	      (0, _markup.highlight)(current.matches, _CSSClasses.currentSelector);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      (0, _markup.unhighlight)(_CSSClasses.currentSelector);
	    }
	  }]);

	  return EditRuleWizard;
	}(_react2.default.Component);

	EditRuleWizard.propTypes = {
	  updateRule: _react2.default.PropTypes.func.isRequired,
	  cancel: _react2.default.PropTypes.func.isRequired,
	  current: _react2.default.PropTypes.object,
	  ruleIndex: _react2.default.PropTypes.number
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page,
	      frame = state.frame;

	  return {
	    current: (0, _store.currentElement)(page),
	    ruleIndex: frame.index
	  };
	}, {
	  updateRule: _actions.updateRule,
	  cancel: _actions.showElementFrame
	})(EditRuleWizard);

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(184);

	var _Buttons = __webpack_require__(226);

	var _Tree = __webpack_require__(245);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _page = __webpack_require__(231);

	var _preview = __webpack_require__(284);

	var _actions = __webpack_require__(238);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Preview = function (_React$Component) {
	  _inherits(Preview, _React$Component);

	  function Preview(props) {
	    _classCallCheck(this, Preview);

	    var _this = _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this, props));

	    _this.closeHandler = _this.closeHandler.bind(_this);
	    _this.logHandler = _this.logHandler.bind(_this);
	    _this.prettyLogHandler = _this.prettyLogHandler.bind(_this);
	    _this.varHandler = _this.varHandler.bind(_this);
	    return _this;
	  }

	  _createClass(Preview, [{
	    key: 'closeHandler',
	    value: function closeHandler(event) {
	      event.preventDefault();
	      this.props.close();
	    }
	  }, {
	    key: 'logHandler',
	    value: function logHandler(event) {
	      event.preventDefault();
	      /* eslint-disable no-console */
	      console.log(JSON.stringify((0, _preview.preview)(this.props.tree)));
	      /* eslint-enable no-console */
	    }
	  }, {
	    key: 'prettyLogHandler',
	    value: function prettyLogHandler(event) {
	      event.preventDefault();
	      /* eslint-disable no-console */
	      console.log(JSON.stringify((0, _preview.preview)(this.props.tree), null, 2));
	      /* eslint-enable no-console */
	    }
	  }, {
	    key: 'varHandler',
	    value: function varHandler(event) {
	      event.preventDefault();
	      /* eslint-disable no-console */
	      console.log(['The current preview data can be accessed using the %c"pageData"%c variable.', 'Make sure that the Forager extension\'s context is selected.', '(This will be a string using the extension\'s ID that starts with "chrome-extensions://". Open the chrome://extensions tab and look for the Forager extension to determine the extension ID)'].join(' '), 'font-weight: bold; font-size: 1.5em;', '');
	      /* eslint-enable no-console */
	      window.pageData = (0, _preview.preview)(this.props.tree);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'frame' },
	        _react2.default.createElement(_Tree2.default, null),
	        _react2.default.createElement(
	          'div',
	          { className: 'preview' },
	          _react2.default.createElement(
	            'pre',
	            null,
	            JSON.stringify((0, _preview.preview)(this.props.tree), null, 2)
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'buttons' },
	            _react2.default.createElement(_Buttons.PosButton, { text: 'Log to Console', click: this.logHandler }),
	            _react2.default.createElement(_Buttons.PosButton, { text: 'Pretty Log', click: this.prettyLogHandler }),
	            _react2.default.createElement(_Buttons.PosButton, { text: 'Use as Variable', click: this.varHandler }),
	            _react2.default.createElement(_Buttons.NegButton, { text: 'Hide Preview', click: this.closeHandler })
	          )
	        )
	      );
	    }
	  }]);

	  return Preview;
	}(_react2.default.Component);

	Preview.propTypes = {
	  close: _react2.default.PropTypes.func.isRequired,
	  tree: _react2.default.PropTypes.object.isRequired
	};

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages,
	      pageIndex = page.pageIndex;

	  var currentPage = pages[pageIndex];
	  return {
	    tree: currentPage === undefined ? {} : (0, _page.fullGrow)(currentPage.elements)
	  };
	}, {
	  close: _actions.showElementFrame
	})(Preview);

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.preview = undefined;

	var _parse = __webpack_require__(279);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/*
	 * Given a parent element, get all children that match the selector
	 * Return data based on element's type (index or name)
	 */
	var getElement = function getElement(element, parent) {
	  var elements = parent.querySelectorAll(element.selector);
	  var type = element.spec.type;


	  switch (type) {
	    case 'single':
	      var index = element.spec.index;

	      var ele = elements[index];
	      if (!ele) {
	        return;
	      }
	      return getElementData(element, ele);
	    case 'all':
	      var name = element.spec.name;

	      var allData = Array.from(elements).map(function (ele) {
	        return getElementData(element, ele);
	      }).filter(function (datum) {
	        return datum !== undefined;
	      });
	      return _defineProperty({}, name, allData);
	    case 'range':
	      /* eslint-disable no-redeclare */
	      var _element$spec = element.spec,
	          name = _element$spec.name,
	          low = _element$spec.low,
	          high = _element$spec.high;
	      /* eslint-enable no-redeclare */

	      var rangeData = Array.from(elements).slice(low, high || undefined).map(function (ele) {
	        return getElementData(element, ele);
	      }).filter(function (datum) {
	        return datum !== undefined;
	      });
	      return _defineProperty({}, name, rangeData);
	  }
	};

	/*
	 * Get data for each rule and each child. Merge the child data into the
	 * rule data. If either the rule data or child data is undefined (because
	 * something required does not exist), return undefined. Otherwise returns
	 * an object with the data for that element and its children.
	 */
	var getElementData = function getElementData(element, domElement) {
	  var data = getRuleData(element.rules, domElement);
	  if (!data) {
	    return;
	  }

	  var childData = getChildData(element.children, domElement);
	  if (!childData) {
	    return;
	  }
	  return Object.assign({}, data, childData);
	};

	var getChildData = function getChildData(children, domElement) {
	  var data = {};
	  // iterate through the children until one fails
	  children.some(function (child) {
	    var childData = getElement(child, domElement);
	    // when some child data does not exist, clear the lot
	    if (!childData && !child.optional) {
	      data = undefined;
	      return true;
	    }
	    for (var key in childData) {
	      data[key] = childData[key];
	    }
	    return false;
	  });
	  return data;
	};

	var getRuleData = function getRuleData(rules, domElement) {
	  var data = {};
	  // break when some rule's attribute does not exist
	  rules.some(function (rule) {
	    var val = void 0;
	    if (rule.attr === 'text') {
	      val = domElement.textContent.replace(/\s+/g, ' ');
	    } else {
	      var attr = domElement.getAttribute(rule.attr);
	      if (attr === null) {
	        data = undefined;
	        return true;
	      }
	      // attributes that don't exist will return null
	      // just use empty string for now
	      val = attr || '';
	    }
	    switch (rule.type) {
	      case 'int':
	        val = (0, _parse.integer)(val);
	        break;
	      case 'float':
	        val = (0, _parse.float)(val);
	        break;
	    }
	    data[rule.name] = val;
	    return false;
	  });
	  return data;
	};

	var preview = exports.preview = function preview(tree) {
	  return tree === undefined ? '' : getElement(tree, document);
	};

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sync = exports.upload = exports.load = exports.remove = exports.rename = exports.save = undefined;

	var _page = __webpack_require__(231);

	/*
	 * any time that the page is updated, the stored page should be updated
	 */
	var save = exports.save = function save(page) {
	  return new Promise(function (resolve, reject) {
	    if (page === undefined) {
	      reject('No page to save');
	    }
	    var cleaned = (0, _page.clean)(page);
	    chrome.storage.local.get('sites', function saveSchemaChrome(storage) {
	      var host = window.location.hostname;
	      storage.sites[host] = storage.sites[host] || {};
	      storage.sites[host][cleaned.name] = cleaned;
	      chrome.storage.local.set({ 'sites': storage.sites });
	      resolve('Saved');
	    });
	  });
	};

	var rename = exports.rename = function rename(newName, oldName) {
	  return new Promise(function (resolve, reject) {
	    chrome.storage.local.get('sites', function saveSchemaChrome(storage) {
	      var host = window.location.hostname;
	      var page = storage.sites[host][oldName];
	      if (page === undefined) {
	        reject('No page named ' + oldName + ' found');
	      }
	      page.name = newName;
	      storage.sites[host][newName] = page;
	      delete storage.sites[host][oldName];
	      chrome.storage.local.set({ 'sites': storage.sites });
	      resolve('Renamed "' + oldName + '" to "' + newName + '"');
	    });
	  });
	};

	/*
	 * remove the page with the given name from storage
	 */
	var remove = exports.remove = function remove(name) {
	  return new Promise(function (resolve, reject) {
	    if (name === undefined) {
	      reject('No page to delete');
	    }
	    chrome.storage.local.get('sites', function saveSchemaChrome(storage) {
	      var host = window.location.hostname;
	      delete storage.sites[host][name];
	      chrome.storage.local.set({ 'sites': storage.sites });
	      resolve('Deleted page ' + name);
	    });
	  });
	};

	/*
	creates an object representing a site and saves it to chrome.storage.local
	the object is:
	    host:
	        site: <hostname>
	        page: <page>

	If the site object exists for a host, load the saved rules
	*/
	var load = exports.load = function load() {
	  return new Promise(function (resolve) {
	    chrome.storage.local.get('sites', function setupHostnameChrome(storage) {
	      var host = window.location.hostname;
	      var current = storage.sites[host] || {};
	      var pages = (0, _page.preparePages)(current);
	      resolve(pages);
	    });
	  });
	};

	/*
	 * formats the page and sends it to the background script, which will upload it to the server
	 */
	var upload = exports.upload = function upload(page) {
	  return new Promise(function (resolve, reject) {
	    if (page === undefined) {
	      reject('No page to upload');
	    }
	    chrome.runtime.sendMessage({
	      type: 'upload',
	      data: {
	        name: page.name,
	        site: window.location.hostname,
	        page: JSON.stringify((0, _page.clean)(page))
	      }
	    }, function uploadResponse(response) {
	      if (response.error) {
	        reject('Failed to upload page');
	      } else {
	        resolve(response);
	      }
	    });
	  });
	};

	var sync = exports.sync = function sync() {
	  return new Promise(function (resolve, reject) {
	    var host = window.location.hostname;
	    chrome.runtime.sendMessage({
	      type: 'sync',
	      site: host
	    }, function saveSyncedPages(response) {
	      // figure out how to handle no response
	      if (response.error) {
	        reject('Failed to sync pages');
	      } else {
	        var syncedPages = response.pages;

	        // merge the synced pages with the current pages and save them
	        chrome.storage.local.get('sites', function mergeSyncedPagesChrome(storage) {
	          var currentPages = storage.sites[host] || {};
	          var allPages = Object.assign({}, currentPages, syncedPages);
	          storage.sites[host] = allPages;
	          chrome.storage.local.set({ 'sites': storage.sites });

	          var parsedPages = (0, _page.preparePages)(allPages);
	          resolve(parsedPages);
	        });
	      }
	    });
	  });
	};

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = makeStore;

	var _redux = __webpack_require__(197);

	var _expiringReduxMessages = __webpack_require__(232);

	var _reducers = __webpack_require__(287);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _chromeMiddleware = __webpack_require__(291);

	var _chromeMiddleware2 = _interopRequireDefault(_chromeMiddleware);

	var _selectMiddleware = __webpack_require__(292);

	var _selectMiddleware2 = _interopRequireDefault(_selectMiddleware);

	var _confirmMiddleware = __webpack_require__(293);

	var _confirmMiddleware2 = _interopRequireDefault(_confirmMiddleware);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var reducer = (0, _redux.combineReducers)(Object.assign({}, _reducers2.default, {
	  messages: _expiringReduxMessages.messages
	}));

	var initialState = {
	  show: true,
	  page: {
	    pages: [undefined],
	    pageIndex: 0,
	    elementIndex: 0
	  },
	  frame: {
	    name: 'element',
	    data: {}
	  },
	  messages: []
	};

	function makeStore() {
	  var store = (0, _redux.createStore)(reducer, initialState, (0, _redux.applyMiddleware)(_confirmMiddleware2.default, _selectMiddleware2.default, _chromeMiddleware2.default, _expiringReduxMessages.messagesMiddleware));
	  return store;
	}

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _show = __webpack_require__(288);

	var _show2 = _interopRequireDefault(_show);

	var _page = __webpack_require__(289);

	var _page2 = _interopRequireDefault(_page);

	var _frame = __webpack_require__(290);

	var _frame2 = _interopRequireDefault(_frame);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  frame: _frame2.default,
	  show: _show2.default,
	  page: _page2.default
	};

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = show;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/*
	 * show
	 * ----
	 *
	 * Determines whether or not the Forager UI is shown. When show=false, the
	 * extension can be considered off.
	 */
	function show() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	  var action = arguments[1];

	  switch (action.type) {
	    case types.CLOSE_FORAGER:
	      return false;
	    case types.OPEN_FORAGER:
	      return true;
	    default:
	      return state;
	  }
	}

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = page;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-redeclare */


	/*
	 * page
	 * ----
	 *
	 * a page is made up of an array of pages, a pageIndex to indicate the current
	 * page within the array, and a elementIndex to indicate the current selector
	 * within the current page
	 *
	 * pages[0] is an undefined page.
	 */
	function page() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var action = arguments[1];

	  switch (action.type) {
	    case types.SELECT_PAGE:
	      var index = parseInt(action.index, 10);
	      // bad index values will be set to 0
	      if (isNaN(index) || index < 0 || index >= state.pages.length) {
	        index = 0;
	      }
	      return Object.assign({}, state, {
	        pageIndex: index,
	        elementIndex: 0
	      });

	    /*
	     * when setting pages, reset to empty page
	     */
	    case types.SET_PAGES:
	      return Object.assign({}, state, {
	        pageIndex: 0,
	        pages: [undefined].concat(_toConsumableArray(action.pages)),
	        elementIndex: 0
	      });

	    case types.ADD_PAGE:
	      var pages = state.pages;
	      var newPages = [].concat(_toConsumableArray(pages), [action.page]);
	      return Object.assign({}, state, {
	        pages: newPages,
	        pageIndex: newPages.length - 1,
	        elementIndex: 0
	      });

	    case types.REMOVE_PAGE:
	      var pages = state.pages,
	          pageIndex = state.pageIndex;
	      // don't remove the undefined page

	      if (pageIndex === 0) {
	        return state;
	      }
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), _toConsumableArray(pages.slice(pageIndex + 1))),
	        pageIndex: 0,
	        elementIndex: 0
	      });

	    case types.RENAME_PAGE:
	      var pages = state.pages,
	          pageIndex = state.pageIndex;

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, pages[pageIndex], {
	          name: action.name
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.SET_MATCHES:
	      var pages = state.pages,
	          pageIndex = state.pageIndex;
	      var matches = action.matches;

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, pages[pageIndex], {
	          elements: pages[pageIndex].elements.map(function (element) {
	            if (element === null) {
	              return null;
	            }
	            var eleMatches = matches[element.index];
	            if (eleMatches !== undefined) {
	              return Object.assign({}, element, {
	                matches: eleMatches
	              });
	            } else {
	              return element;
	            }
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.SELECT_ELEMENT:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;

	      var selectorCount = pages[pageIndex].elements.length;
	      var index = parseInt(action.index, 10);
	      // set to 0 when out of bounds
	      if (isNaN(index) || index < 0 || index >= selectorCount) {
	        index = 0;
	      }
	      return Object.assign({}, state, {
	        elementIndex: index
	      });

	    case types.SAVE_ELEMENT:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;

	      var currentPage = pages[pageIndex];
	      var currentSelector = currentPage.elements[elementIndex];
	      var currentCount = currentPage.elements.length;

	      // set parent/child/index values
	      var element = action.element;

	      element.parent = currentSelector.index;
	      element.index = currentCount;
	      currentSelector.childIndices.push(currentCount);

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.concat([element])
	        })], _toConsumableArray(pages.slice(pageIndex + 1))),
	        elementIndex: currentCount
	      });

	    case types.UPDATE_ELEMENT:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;

	      var currentPage = pages[pageIndex];
	      var currentSelector = currentPage.elements[elementIndex];

	      var index = action.index,
	          newProps = action.newProps;

	      // don't actually update the 0th Element (body)

	      if (index === 0) {
	        return state;
	      }

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (e) {
	            if (e === null) {
	              return null;
	            } else if (e.index !== index) {
	              return e;
	            } else {
	              return Object.assign({}, e, newProps);
	            }
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.REMOVE_ELEMENT:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;
	      // elementIndex will be the parent index

	      var currentPage = pages[pageIndex];
	      var currentSelector = currentPage.elements[elementIndex];

	      // clear everything else out, but don't remove the body selector
	      if (elementIndex === 0) {
	        var cleanedBody = Object.assign({}, currentPage.elements[0], {
	          childIndices: []
	        });
	        return Object.assign({}, state, {
	          pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	            elements: [cleanedBody]
	          })], _toConsumableArray(pages.slice(pageIndex + 1))),
	          elementIndex: 0
	        });
	      }

	      // index values of elements that should be removed
	      var removeIndex = [elementIndex];
	      var newElementIndex = currentPage.elements[elementIndex].parent || 0;
	      var updatedPage = Object.assign({}, currentPage, {
	        elements: currentPage.elements.map(function (s) {
	          if (s === null) {
	            return null;
	          }
	          // remove any elements being removed from child indices
	          s.childIndices = s.childIndices.filter(function (c) {
	            return !removeIndex.includes(c);
	          });
	          if (removeIndex.includes(s.index)) {
	            // if removing the selector element, remove any of its children
	            // as well
	            removeIndex = removeIndex.concat(s.childIndices);
	            // replace with null so we don't have to recalculate references
	            return null;
	          }
	          return s;
	        })
	      });

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [updatedPage], _toConsumableArray(pages.slice(pageIndex + 1))),
	        elementIndex: newElementIndex
	      });

	    case types.SAVE_RULE:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;
	      var rule = action.rule;


	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // set the new name for the element matching elementIndex
	            if (s !== null && s.index === elementIndex) {
	              s.rules = s.rules.concat([rule]);
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.REMOVE_RULE:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;
	      var index = action.index;


	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // remove the rule from the current element
	            if (s !== null && s.index === elementIndex) {
	              return Object.assign({}, s, {
	                rules: s.rules.filter(function (r, i) {
	                  return i !== index;
	                })
	              });
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.UPDATE_RULE:
	      var pages = state.pages,
	          pageIndex = state.pageIndex,
	          elementIndex = state.elementIndex;
	      var index = action.index,
	          rule = action.rule;


	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // set the new name for the element matching elementIndex
	            if (s !== null && s.index === elementIndex) {
	              s.rules = s.rules.map(function (r, i) {
	                return i === index ? rule : r;
	              });
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.CLOSE_FORAGER:
	      return Object.assign({}, state, {
	        pageIndex: 0,
	        elementIndex: 0
	      });

	    default:
	      return state;
	  }
	}

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = frame;

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/*
	 * frame
	 * -----
	 *
	 * Which frame to show. In the majority of cases, the 'element' frame should
	 * be shown.
	 */
	function frame() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { name: 'element' };
	  var action = arguments[1];

	  switch (action.type) {
	    case types.SELECT_PAGE:
	    case types.ADD_PAGE:
	    case types.SET_PAGES:
	    case types.REMOVE_PAGE:
	    case types.REMOVE_ELEMENT:
	    case types.SAVE_ELEMENT:
	    case types.UPDATE_ELEMENT:
	    case types.SAVE_RULE:
	    case types.REMOVE_RULE:
	    case types.UPDATE_RULE:
	    case types.CLOSE_FORAGER:
	    case types.SHOW_ELEMENT_FRAME:
	      return {
	        name: 'element'
	      };
	    case types.SHOW_ELEMENT_WIZARD:
	      return {
	        name: 'element-wizard'
	      };
	    case types.SHOW_EDIT_ELEMENT_WIZARD:
	      return {
	        name: 'edit-element-wizard'
	      };
	    case types.SHOW_RULE_WIZARD:
	      return {
	        name: 'rule-wizard'
	      };
	    case types.SHOW_EDIT_RULE_WIZARD:
	      return {
	        name: 'edit-rule-wizard',
	        index: action.index
	      };
	    case types.SHOW_PREVIEW:
	      return {
	        name: 'preview'
	      };
	    default:
	      return state;
	  }
	}

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(240);

	var ActionTypes = _interopRequireWildcard(_ActionTypes);

	var _expiringReduxMessages = __webpack_require__(232);

	var _actions = __webpack_require__(238);

	var _chrome = __webpack_require__(285);

	var chromeExt = _interopRequireWildcard(_chrome);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (fullStore) {
	  return function (next) {
	    return function (action) {
	      var current = fullStore.getState();
	      var _current$page = current.page,
	          pages = _current$page.pages,
	          pageIndex = _current$page.pageIndex;

	      var page = pages[pageIndex];
	      switch (action.type) {
	        case ActionTypes.RENAME_PAGE:
	          // new name, old name
	          chromeExt.rename(action.name, page.name).then(function (resp) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(resp, 1000, 1));
	          }).catch(function (error) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(error, 1000, -1));
	          });
	          return next(action);

	        case ActionTypes.REMOVE_PAGE:
	          var nameToRemove = pages[pageIndex].name;
	          chromeExt.remove(nameToRemove).then(function (resp) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(resp, 1000, 1));
	          }).catch(function (error) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(error, 1000, -1));
	          });
	          return next(action);

	        case ActionTypes.UPLOAD_PAGE:
	          chromeExt.upload(pages[pageIndex]).then(function () {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)('Upload Successful', 5000, 1));
	          }).catch(function (error) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(error, 5000, -1));
	          });
	          break;

	        case ActionTypes.SYNC_PAGES:
	          chromeExt.sync().then(function (pages) {
	            fullStore.dispatch((0, _actions.setPages)(pages));
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)('Pages synced', 5000, 1));
	          }).catch(function () {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)('Failed to sync pages', 5000, -1));
	          });
	          break;

	        // for chromeSave actions, save after the action has reached the reducer
	        // so that we are saving the updated state of the store
	        case ActionTypes.ADD_PAGE:
	        case ActionTypes.SAVE_ELEMENT:
	        case ActionTypes.REMOVE_ELEMENT:
	        case ActionTypes.UPDATE_ELEMENT:
	        case ActionTypes.SAVE_RULE:
	        case ActionTypes.REMOVE_RULE:
	          var retVal = next(action);
	          var newState = fullStore.getState();
	          var newPage = newState.page;
	          var newPages = newPage.pages,
	              newPageIndex = newPage.pageIndex;

	          chromeExt.save(newPages[newPageIndex]).then(function (resp) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(resp, 1000, 1));
	          }).catch(function (error) {
	            fullStore.dispatch((0, _expiringReduxMessages.showMessage)(error, 1000, -1));
	          });
	          return retVal;

	        default:
	          return next(action);
	      }
	    };
	  };
	};

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _selection = __webpack_require__(229);

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	var _actions = __webpack_require__(238);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (store) {
	  return function (next) {
	    return function (action) {
	      var selectActions = [types.SELECT_PAGE, types.SAVE_ELEMENT, types.UPDATE_ELEMENT, types.REFRESH_MATCHES];

	      if (!selectActions.includes(action.type)) {
	        return next(action);
	      }

	      switch (action.type) {
	        // casting a wide net and reselecting everything
	        case types.SELECT_PAGE:
	        case types.SAVE_ELEMENT:
	        case types.UPDATE_ELEMENT:
	        case types.REFRESH_MATCHES:
	          var result = next(action);
	          var page = store.getState().page;
	          var pages = page.pages,
	              pageIndex = page.pageIndex;

	          var currentPage = pages[pageIndex];
	          if (currentPage === undefined) {
	            return;
	          }
	          // iterate over all elements, creating an object of matches for each element
	          var matchesObject = currentPage.elements.reduce(function (matchObject, element) {
	            if (element === null) {
	              return matchObject;
	            }
	            var parentElements = element.parent === null ? [document] : matchObject[element.parent];
	            matchObject[element.index] = (0, _selection.select)(parentElements, element.selector, element.spec, '.forager-holder');
	            return matchObject;
	          }, {});

	          // gets matches for all of the elements in the newly loaded page
	          store.dispatch((0, _actions.setMatches)(matchesObject));
	          return result;
	      }
	    };
	  };
	}; /*
	    * handle the selecting of elements that match element selectors here
	    */

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(240);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (store) {
	  return function (next) {
	    return function (action) {
	      var selectActions = [types.SYNC_PAGES, types.REMOVE_PAGE, types.REMOVE_ELEMENT];

	      if (!selectActions.includes(action.type)) {
	        return next(action);
	      }

	      var confirmMessage = 'Are you sure?';
	      switch (action.type) {
	        case types.SYNC_PAGES:
	          confirmMessage = 'Syncing pages will overwrite duplicate pages. Continue?';
	          break;
	        case types.REMOVE_PAGE:
	          var _store$getState = store.getState(),
	              page = _store$getState.page;

	          var pages = page.pages,
	              pageIndex = page.pageIndex;

	          var currentPage = pages[pageIndex];
	          confirmMessage = 'Are you sure you want to delete the page "' + currentPage.name + '"?';
	          break;
	        case types.REMOVE_ELEMENT:
	          // this relies on the fact that we only ever can remove the current element
	          var _store$getState2 = store.getState(),
	              page = _store$getState2.page;

	          var pages = page.pages,
	              pageIndex = page.pageIndex,
	              elementIndex = page.elementIndex;

	          var currentPage = pages[pageIndex];
	          var element = currentPage.elements[elementIndex];
	          confirmMessage = element.index === 0 ? 'Are you sure you want to reset the page? This will delete all rules and child elements' : 'Are you sure you want to delete the element "' + element.selector + '"?';
	          break;
	      }

	      if (!window.confirm(confirmMessage)) {
	        return;
	      }
	      next(action);
	    };
	  };
	}; /* eslint-disable no-redeclare */

	/*
	 * intercept some actions that can remove pages/elements and force
	 * the user to confirm that they want to complete the action
	 */

/***/ })
]);