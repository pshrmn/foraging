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

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _redux = __webpack_require__(3);

	var _reactRedux = __webpack_require__(13);

	var _Forager = __webpack_require__(22);

	var _Forager2 = _interopRequireDefault(_Forager);

	var _reducers = __webpack_require__(43);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _ActionTypes = __webpack_require__(24);

	var _findSelector = __webpack_require__(49);

	var _findSelector2 = _interopRequireDefault(_findSelector);

	var _chromeBackground = __webpack_require__(50);

	var _chromeBackground2 = _interopRequireDefault(_chromeBackground);

	var _chrome = __webpack_require__(51);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/*
	 * check if the forager holder exists. If it doesn't, mount the app. If it does,
	 * check if the app is hidden. If it is hidden, show it.
	 */
	var holder = document.querySelector(".forager-holder");
	document.body.classList.add("foraging");
	if (!holder) {
	  (0, _chrome.chromeLoad)(function (pages) {
	    /*
	     * initialState uses the pages loaded by chrome
	     */
	    var initialState = {
	      show: true,
	      selector: undefined,
	      page: {
	        pages: [undefined].concat(_toConsumableArray(pages)),
	        pageIndex: 0
	      },
	      frame: {
	        name: "selector",
	        data: {}
	      },
	      preview: {
	        visible: false
	      }
	    };
	    var store = (0, _redux.applyMiddleware)(_findSelector2.default, _chromeBackground2.default)(_redux.createStore)(_reducers2.default, initialState);

	    /*
	     * subscribe to the store and save the pages any time that they change
	     */
	    var oldPages = {};
	    store.subscribe(function () {
	      var state = store.getState();
	      var pages = state.page.pages;
	      if (pages !== oldPages) {
	        (0, _chrome.chromeSave)(pages);
	        oldPages = pages;
	      }
	    });

	    /*
	     * actually render Forager
	     */
	    var holder = document.createElement("div");
	    holder.classList.add("forager-holder");
	    holder.classList.add("no-select");
	    document.body.appendChild(holder);

	    (0, _reactDom.render)(_react2.default.createElement(
	      _reactRedux.Provider,
	      { store: store },
	      _react2.default.createElement(_Forager2.default, null)
	    ), holder);

	    // window here is the extension's context, so it is not reachable by code
	    // outside of the extension.
	    window.store = store;
	  });
	} else {
	  document.body.classList.add("foraging");
	  var currentState = store.getState();
	  if (!currentState.show) {
	    store.dispatch({
	      type: _ActionTypes.SHOW_FORAGER
	    });
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(4);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _utilsCombineReducers = __webpack_require__(6);

	var _utilsCombineReducers2 = _interopRequireDefault(_utilsCombineReducers);

	var _utilsBindActionCreators = __webpack_require__(10);

	var _utilsBindActionCreators2 = _interopRequireDefault(_utilsBindActionCreators);

	var _utilsApplyMiddleware = __webpack_require__(11);

	var _utilsApplyMiddleware2 = _interopRequireDefault(_utilsApplyMiddleware);

	var _utilsCompose = __webpack_require__(12);

	var _utilsCompose2 = _interopRequireDefault(_utilsCompose);

	exports.createStore = _createStore2['default'];
	exports.combineReducers = _utilsCombineReducers2['default'];
	exports.bindActionCreators = _utilsBindActionCreators2['default'];
	exports.applyMiddleware = _utilsApplyMiddleware2['default'];
	exports.compose = _utilsCompose2['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createStore;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsIsPlainObject = __webpack_require__(5);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */

	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */

	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

	  if (proto === null) {
	    return true;
	  }

	  var constructor = proto.constructor;

	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
	}

	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports['default'] = combineReducers;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(4);

	var _utilsIsPlainObject = __webpack_require__(5);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	var _utilsMapValues = __webpack_require__(8);

	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

	var _utilsPick = __webpack_require__(9);

	var _utilsPick2 = _interopRequireDefault(_utilsPick);

	/* eslint-disable no-console */

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
	  var reducerKeys = Object.keys(outputState);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!_utilsIsPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return reducerKeys.indexOf(key) < 0;
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */

	function combineReducers(reducers) {
	  var finalReducers = _utilsPick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;

	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  var defaultState = _utilsMapValues2['default'](finalReducers, function () {
	    return undefined;
	  });

	  return function combination(state, action) {
	    if (state === undefined) state = defaultState;

	    if (sanityError) {
	      throw sanityError;
	    }

	    var hasChanged = false;
	    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	      return nextStateForKey;
	    });

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }

	    return hasChanged ? finalState : state;
	  };
	}

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = mapValues;

	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = pick;

	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = bindActionCreators;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsMapValues = __webpack_require__(8);

	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */

	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    // eslint-disable-line no-eq-null
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}

	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = applyMiddleware;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _compose = __webpack_require__(12);

	var _compose2 = _interopRequireDefault(_compose);

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */

	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function (arg) {
	    return funcs.reduceRight(function (composed, f) {
	      return f(composed);
	    }, arg);
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

	var _componentsProvider = __webpack_require__(14);

	exports.Provider = _interopRequire(_componentsProvider);

	var _componentsConnect = __webpack_require__(16);

	exports.connect = _interopRequire(_componentsConnect);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _utilsStoreShape = __webpack_require__(15);

	var _utilsStoreShape2 = _interopRequireDefault(_utilsStoreShape);

	var didWarnAboutReceivingStore = false;
	function warnAboutReceivingStore() {
	  if (didWarnAboutReceivingStore) {
	    return;
	  }

	  didWarnAboutReceivingStore = true;
	  console.error( // eslint-disable-line no-console
	  '<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/rackt/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
	}

	var Provider = (function (_Component) {
	  _inherits(Provider, _Component);

	  Provider.prototype.getChildContext = function getChildContext() {
	    return { store: this.store };
	  };

	  function Provider(props, context) {
	    _classCallCheck(this, Provider);

	    _Component.call(this, props, context);
	    this.store = props.store;
	  }

	  Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var store = this.store;
	    var nextStore = nextProps.store;

	    if (store !== nextStore) {
	      warnAboutReceivingStore();
	    }
	  };

	  Provider.prototype.render = function render() {
	    var children = this.props.children;

	    return _react.Children.only(children);
	  };

	  return Provider;
	})(_react.Component);

	exports['default'] = Provider;

	Provider.propTypes = {
	  store: _utilsStoreShape2['default'].isRequired,
	  children: _react.PropTypes.element.isRequired
	};
	Provider.childContextTypes = {
	  store: _utilsStoreShape2['default'].isRequired
	};
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	exports['default'] = _react.PropTypes.shape({
	  subscribe: _react.PropTypes.func.isRequired,
	  dispatch: _react.PropTypes.func.isRequired,
	  getState: _react.PropTypes.func.isRequired
	});
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = connect;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _utilsStoreShape = __webpack_require__(15);

	var _utilsStoreShape2 = _interopRequireDefault(_utilsStoreShape);

	var _utilsShallowEqual = __webpack_require__(17);

	var _utilsShallowEqual2 = _interopRequireDefault(_utilsShallowEqual);

	var _utilsIsPlainObject = __webpack_require__(18);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	var _utilsWrapActionCreators = __webpack_require__(19);

	var _utilsWrapActionCreators2 = _interopRequireDefault(_utilsWrapActionCreators);

	var _hoistNonReactStatics = __webpack_require__(20);

	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

	var _invariant = __webpack_require__(21);

	var _invariant2 = _interopRequireDefault(_invariant);

	var defaultMapStateToProps = function defaultMapStateToProps() {
	  return {};
	};
	var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
	  return { dispatch: dispatch };
	};
	var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
	  return _extends({}, parentProps, stateProps, dispatchProps);
	};

	function getDisplayName(WrappedComponent) {
	  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}

	// Helps track hot reloading.
	var nextVersion = 0;

	function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	  var shouldSubscribe = Boolean(mapStateToProps);
	  var finalMapStateToProps = mapStateToProps || defaultMapStateToProps;
	  var finalMapDispatchToProps = _utilsIsPlainObject2['default'](mapDispatchToProps) ? _utilsWrapActionCreators2['default'](mapDispatchToProps) : mapDispatchToProps || defaultMapDispatchToProps;
	  var finalMergeProps = mergeProps || defaultMergeProps;
	  var shouldUpdateStateProps = finalMapStateToProps.length > 1;
	  var shouldUpdateDispatchProps = finalMapDispatchToProps.length > 1;
	  var _options$pure = options.pure;
	  var pure = _options$pure === undefined ? true : _options$pure;
	  var _options$withRef = options.withRef;
	  var withRef = _options$withRef === undefined ? false : _options$withRef;

	  // Helps track hot reloading.
	  var version = nextVersion++;

	  function computeStateProps(store, props) {
	    var state = store.getState();
	    var stateProps = shouldUpdateStateProps ? finalMapStateToProps(state, props) : finalMapStateToProps(state);

	    _invariant2['default'](_utilsIsPlainObject2['default'](stateProps), '`mapStateToProps` must return an object. Instead received %s.', stateProps);
	    return stateProps;
	  }

	  function computeDispatchProps(store, props) {
	    var dispatch = store.dispatch;

	    var dispatchProps = shouldUpdateDispatchProps ? finalMapDispatchToProps(dispatch, props) : finalMapDispatchToProps(dispatch);

	    _invariant2['default'](_utilsIsPlainObject2['default'](dispatchProps), '`mapDispatchToProps` must return an object. Instead received %s.', dispatchProps);
	    return dispatchProps;
	  }

	  function _computeNextState(stateProps, dispatchProps, parentProps) {
	    var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
	    _invariant2['default'](_utilsIsPlainObject2['default'](mergedProps), '`mergeProps` must return an object. Instead received %s.', mergedProps);
	    return mergedProps;
	  }

	  return function wrapWithConnect(WrappedComponent) {
	    var Connect = (function (_Component) {
	      _inherits(Connect, _Component);

	      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
	        if (!pure) {
	          this.updateStateProps(nextProps);
	          this.updateDispatchProps(nextProps);
	          this.updateState(nextProps);
	          return true;
	        }

	        var storeChanged = nextState.storeState !== this.state.storeState;
	        var propsChanged = !_utilsShallowEqual2['default'](nextProps, this.props);
	        var mapStateProducedChange = false;
	        var dispatchPropsChanged = false;

	        if (storeChanged || propsChanged && shouldUpdateStateProps) {
	          mapStateProducedChange = this.updateStateProps(nextProps);
	        }

	        if (propsChanged && shouldUpdateDispatchProps) {
	          dispatchPropsChanged = this.updateDispatchProps(nextProps);
	        }

	        if (propsChanged || mapStateProducedChange || dispatchPropsChanged) {
	          this.updateState(nextProps);
	          return true;
	        }

	        return false;
	      };

	      function Connect(props, context) {
	        _classCallCheck(this, Connect);

	        _Component.call(this, props, context);
	        this.version = version;
	        this.store = props.store || context.store;

	        _invariant2['default'](this.store, 'Could not find "store" in either the context or ' + ('props of "' + this.constructor.displayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + this.constructor.displayName + '".'));

	        this.stateProps = computeStateProps(this.store, props);
	        this.dispatchProps = computeDispatchProps(this.store, props);
	        this.state = { storeState: null };
	        this.updateState();
	      }

	      Connect.prototype.computeNextState = function computeNextState() {
	        var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

	        return _computeNextState(this.stateProps, this.dispatchProps, props);
	      };

	      Connect.prototype.updateStateProps = function updateStateProps() {
	        var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

	        var nextStateProps = computeStateProps(this.store, props);
	        if (_utilsShallowEqual2['default'](nextStateProps, this.stateProps)) {
	          return false;
	        }

	        this.stateProps = nextStateProps;
	        return true;
	      };

	      Connect.prototype.updateDispatchProps = function updateDispatchProps() {
	        var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

	        var nextDispatchProps = computeDispatchProps(this.store, props);
	        if (_utilsShallowEqual2['default'](nextDispatchProps, this.dispatchProps)) {
	          return false;
	        }

	        this.dispatchProps = nextDispatchProps;
	        return true;
	      };

	      Connect.prototype.updateState = function updateState() {
	        var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

	        this.nextState = this.computeNextState(props);
	      };

	      Connect.prototype.isSubscribed = function isSubscribed() {
	        return typeof this.unsubscribe === 'function';
	      };

	      Connect.prototype.trySubscribe = function trySubscribe() {
	        if (shouldSubscribe && !this.unsubscribe) {
	          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
	          this.handleChange();
	        }
	      };

	      Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
	        if (this.unsubscribe) {
	          this.unsubscribe();
	          this.unsubscribe = null;
	        }
	      };

	      Connect.prototype.componentDidMount = function componentDidMount() {
	        this.trySubscribe();
	      };

	      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
	        this.tryUnsubscribe();
	      };

	      Connect.prototype.handleChange = function handleChange() {
	        if (!this.unsubscribe) {
	          return;
	        }

	        this.setState({
	          storeState: this.store.getState()
	        });
	      };

	      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
	        _invariant2['default'](withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');

	        return this.refs.wrappedInstance;
	      };

	      Connect.prototype.render = function render() {
	        var ref = withRef ? 'wrappedInstance' : null;
	        return _react2['default'].createElement(WrappedComponent, _extends({}, this.nextState, { ref: ref }));
	      };

	      return Connect;
	    })(_react.Component);

	    Connect.displayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
	    Connect.WrappedComponent = WrappedComponent;
	    Connect.contextTypes = {
	      store: _utilsStoreShape2['default']
	    };
	    Connect.propTypes = {
	      store: _utilsStoreShape2['default']
	    };

	    if (process.env.NODE_ENV !== 'production') {
	      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
	        if (this.version === version) {
	          return;
	        }

	        // We are hot reloading!
	        this.version = version;

	        // Update the state and bindings.
	        this.trySubscribe();
	        this.updateStateProps();
	        this.updateDispatchProps();
	        this.updateState();
	      };
	    }

	    return _hoistNonReactStatics2['default'](Connect, WrappedComponent);
	  };
	}

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = shallowEqual;

	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  var hasOwn = Object.prototype.hasOwnProperty;
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */

	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

	  if (proto === null) {
	    return true;
	  }

	  var constructor = proto.constructor;

	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
	}

	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = wrapActionCreators;

	var _redux = __webpack_require__(3);

	function wrapActionCreators(actionCreators) {
	  return function (dispatch) {
	    return _redux.bindActionCreators(actionCreators, dispatch);
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';

	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};

	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    arguments: true,
	    arity: true
	};

	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
	    var keys = Object.getOwnPropertyNames(sourceComponent);
	    for (var i=0; i<keys.length; ++i) {
	        if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]]) {
	            targetComponent[keys[i]] = sourceComponent[keys[i]];
	        }
	    }

	    return targetComponent;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _redux = __webpack_require__(3);

	var _reactRedux = __webpack_require__(13);

	var _actions = __webpack_require__(23);

	var ForagerActions = _interopRequireWildcard(_actions);

	var _Controls = __webpack_require__(25);

	var _Controls2 = _interopRequireDefault(_Controls);

	var _Frames = __webpack_require__(34);

	var _Frames2 = _interopRequireDefault(_Frames);

	var _Graph = __webpack_require__(40);

	var _Graph2 = _interopRequireDefault(_Graph);

	var _Preview = __webpack_require__(42);

	var _Preview2 = _interopRequireDefault(_Preview);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Forager = _react2.default.createClass({
	  displayName: "Forager",

	  render: function render() {
	    var _props = this.props;
	    var pages = _props.pages;
	    var pageIndex = _props.pageIndex;
	    var show = _props.show;
	    var dispatch = _props.dispatch;
	    var frame = _props.frame;
	    var selector = _props.selector;
	    var preview = _props.preview;

	    var page = pages[pageIndex];
	    var actions = (0, _redux.bindActionCreators)(ForagerActions, dispatch);
	    var classNames = ["no-select"];
	    if (!show) {
	      classNames.push("hidden");
	    }

	    var previewModal = preview.visible ? _react2.default.createElement(_Preview2.default, { page: page, close: actions.hidePreview }) : null;

	    // only let the graph update the current selector when
	    var selectSelector = frame.name === "selector" ? actions.selectSelector : function () {};
	    return _react2.default.createElement(
	      "div",
	      { id: "forager", className: classNames.join(" "), ref: "app" },
	      _react2.default.createElement(_Controls2.default, { pages: pages,
	        index: pageIndex,
	        actions: actions }),
	      _react2.default.createElement(
	        "div",
	        { className: "workspace" },
	        _react2.default.createElement(_Frames2.default, { selector: selector,
	          frame: frame,
	          actions: actions }),
	        _react2.default.createElement(_Graph2.default, { page: page,
	          selector: selector,
	          selectSelector: selectSelector })
	      ),
	      previewModal
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

	function mapStateToProps(state) {
	  // while pages and pageIndex are stored under page in the store,
	  // destructure them in the app
	  return {
	    show: state.show,
	    frame: state.frame,
	    pages: state.page.pages,
	    pageIndex: state.page.pageIndex,
	    selector: state.selector,
	    preview: state.preview
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(Forager);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeRule = exports.saveRule = exports.removeSelector = exports.saveSelector = exports.selectSelector = exports.closeForager = exports.showSpecFrame = exports.showPartsFrame = exports.showElementFrame = exports.showRuleFrame = exports.showSelectorFrame = exports.hidePreview = exports.showPreview = exports.uploadPage = exports.renamePage = exports.removePage = exports.addPage = exports.loadPage = undefined;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/*
	 * PAGE ACTIONS
	 */
	var loadPage = exports.loadPage = function loadPage(index) {
	  return {
	    type: types.LOAD_PAGE,
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

	var showPreview = exports.showPreview = function showPreview() {
	  return {
	    type: types.SHOW_PREVIEW
	  };
	};

	var hidePreview = exports.hidePreview = function hidePreview() {
	  return {
	    type: types.HIDE_PREVIEW
	  };
	};

	/*
	 * FRAME ACTIONS
	 */

	var showSelectorFrame = exports.showSelectorFrame = function showSelectorFrame() {
	  return {
	    type: types.SHOW_SELECTOR_FRAME
	  };
	};

	var showRuleFrame = exports.showRuleFrame = function showRuleFrame(selector) {
	  return {
	    type: types.SHOW_RULE_FRAME,
	    selector: selector
	  };
	};

	var showElementFrame = exports.showElementFrame = function showElementFrame() {
	  return {
	    type: types.SHOW_ELEMENT_FRAME
	  };
	};

	var showPartsFrame = exports.showPartsFrame = function showPartsFrame(parts) {
	  return {
	    type: types.SHOW_PARTS_FRAME,
	    parts: parts
	  };
	};

	var showSpecFrame = exports.showSpecFrame = function showSpecFrame(css) {
	  return {
	    type: types.SHOW_SPEC_FRAME,
	    css: css
	  };
	};

	/*
	 * GENERAL ACTIONS
	 */
	var closeForager = exports.closeForager = function closeForager() {
	  return {
	    type: types.CLOSE_FORAGER
	  };
	};

	/*
	 * SELECTOR/RULE ACTIONS
	 */

	var selectSelector = exports.selectSelector = function selectSelector(selectorID) {
	  return {
	    type: types.SELECT_SELECTOR,
	    selectorID: selectorID
	  };
	};

	var saveSelector = exports.saveSelector = function saveSelector(selector, parentID) {
	  return {
	    type: types.SAVE_SELECTOR,
	    selector: selector,
	    parentID: parentID
	  };
	};

	var removeSelector = exports.removeSelector = function removeSelector(selectorID) {
	  return {
	    type: types.REMOVE_SELECTOR,
	    selectorID: selectorID
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

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var LOAD_PAGE = exports.LOAD_PAGE = "LOAD_PAGE";
	var ADD_PAGE = exports.ADD_PAGE = "ADD_PAGE";
	var REMOVE_PAGE = exports.REMOVE_PAGE = "REMOVE_PAGE";
	var RENAME_PAGE = exports.RENAME_PAGE = "RENAME_PAGE";
	var UPLOAD_PAGE = exports.UPLOAD_PAGE = "UPLOAD_PAGE";
	var SHOW_PREVIEW = exports.SHOW_PREVIEW = "SHOW_PREVIEW";
	var HIDE_PREVIEW = exports.HIDE_PREVIEW = "HIDE_PREVIEW";

	var SHOW_SELECTOR_FRAME = exports.SHOW_SELECTOR_FRAME = "SHOW_SELECTOR_FRAME";
	var SHOW_RULE_FRAME = exports.SHOW_RULE_FRAME = "SHOW_RULE_FRAME";
	var SHOW_ELEMENT_FRAME = exports.SHOW_ELEMENT_FRAME = "SHOW_ELEMENT_FRAME";
	var SHOW_PARTS_FRAME = exports.SHOW_PARTS_FRAME = "SHOW_PARTS_FRAME";
	var SHOW_SPEC_FRAME = exports.SHOW_SPEC_FRAME = "SHOW_SPEC_FRAME";

	var CLOSE_FORAGER = exports.CLOSE_FORAGER = "CLOSE_FORAGER";
	var SHOW_FORAGER = exports.SHOW_FORAGER = "SHOW_FORAGER";

	var SELECT_SELECTOR = exports.SELECT_SELECTOR = "SELECT_SELECTOR";
	var SAVE_SELECTOR = exports.SAVE_SELECTOR = "SAVE_SELECTOR";
	var REMOVE_SELECTOR = exports.REMOVE_SELECTOR = "REMOVE_SELECTOR";
	var SAVE_RULE = exports.SAVE_RULE = "SAVE_RULE";
	var REMOVE_RULE = exports.REMOVE_RULE = "REMOVE_RULE";

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Controls",

	  render: function render() {
	    var _props = this.props;
	    var pages = _props.pages;
	    var index = _props.index;
	    var actions = _props.actions;

	    return _react2.default.createElement(
	      "div",
	      { className: "controls" },
	      _react2.default.createElement(PageControls, { pages: pages,
	        index: index,
	        actions: actions }),
	      _react2.default.createElement(GeneralControls, { actions: actions })
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
	      var newPage = (0, _helpers.createPage)(name);
	      (0, _helpers.setupPage)(newPage);
	      this.props.actions.addPage(newPage);
	    }
	  },
	  renameHandler: function renameHandler(event) {
	    event.preventDefault();
	    var curr = this.props.pages[this.props.index];
	    // don't do anything for the undefined option
	    if (curr === undefined) {
	      return;
	    }
	    var name = this.getName();
	    if (name !== undefined && name !== curr.name) {
	      // set the new name
	      this.props.actions.renamePage(name);
	    }
	  },
	  deleteHandler: function deleteHandler(event) {
	    event.preventDefault();
	    // report the current page index
	    this.props.actions.removePage();
	  },
	  uploadHandler: function uploadHandler(event) {
	    event.preventDefault();
	    this.props.actions.uploadPage();
	  },
	  previewHandler: function previewHandler(event) {
	    event.preventDefault();
	    this.props.actions.showPreview();
	  },
	  loadPage: function loadPage(event) {
	    this.props.actions.loadPage(event.target.value);
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

	  handleClose: function handleClose(event) {
	    // remove any classes that would have been added to the page
	    ["foraging", "query-check", "current-selector", "selectable-element", "saved-preview"].forEach(function (css) {
	      (0, _helpers.unhighlight)(css);
	    });
	    this.props.actions.closeForager();
	  },
	  render: function render() {
	    /*
	      no need to render these until their features have been implemented
	      <NeutralButton click={this.handle} text="Sync" />
	      <NeutralButton click={this.handle} text="Options" />
	    */
	    return _react2.default.createElement(
	      "div",
	      { className: "app-controls" },
	      _react2.default.createElement(_Inputs.NeutralButton, { text: String.fromCharCode(215),
	        classes: ["transparent"],
	        click: this.handleClose })
	    );
	  }
	});

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	/*
	 * Forager app specific input/form elements
	 */

	var PosButton = exports.PosButton = React.createClass({
	  displayName: "PosButton",

	  render: function render() {
	    var _props = this.props;
	    var classes = _props.classes;

	    var rest = _objectWithoutProperties(_props, ["classes"]);

	    return React.createElement(NeutralButton, _extends({}, rest, {
	      classes: ["pos"].concat(classes) }));
	  }
	});

	var NegButton = exports.NegButton = React.createClass({
	  displayName: "NegButton",

	  render: function render() {
	    var _props2 = this.props;
	    var classes = _props2.classes;

	    var rest = _objectWithoutProperties(_props2, ["classes"]);

	    return React.createElement(NeutralButton, _extends({}, rest, {
	      classes: ["neg"].concat(classes) }));
	  }
	});

	var NeutralButton = exports.NeutralButton = React.createClass({
	  displayName: "NeutralButton",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      text: "",
	      click: function click() {},
	      title: "",
	      classes: []
	    };
	  },
	  render: function render() {
	    var _props3 = this.props;
	    var text = _props3.text;
	    var click = _props3.click;
	    var classes = _props3.classes;
	    var title = _props3.title;

	    return React.createElement(
	      "button",
	      { className: classes.join(" "),
	        title: title,
	        onClick: click },
	      text
	    );
	  }
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _text = __webpack_require__(28);

	Object.defineProperty(exports, "legalName", {
	  enumerable: true,
	  get: function get() {
	    return _text.legalName;
	  }
	});
	Object.defineProperty(exports, "abbreviate", {
	  enumerable: true,
	  get: function get() {
	    return _text.abbreviate;
	  }
	});

	var _attributes = __webpack_require__(29);

	Object.defineProperty(exports, "attributes", {
	  enumerable: true,
	  get: function get() {
	    return _attributes.attributes;
	  }
	});

	var _markup = __webpack_require__(30);

	Object.defineProperty(exports, "highlight", {
	  enumerable: true,
	  get: function get() {
	    return _markup.highlight;
	  }
	});
	Object.defineProperty(exports, "unhighlight", {
	  enumerable: true,
	  get: function get() {
	    return _markup.unhighlight;
	  }
	});
	Object.defineProperty(exports, "iHighlight", {
	  enumerable: true,
	  get: function get() {
	    return _markup.iHighlight;
	  }
	});
	Object.defineProperty(exports, "iUnhighlight", {
	  enumerable: true,
	  get: function get() {
	    return _markup.iUnhighlight;
	  }
	});

	var _page = __webpack_require__(31);

	Object.defineProperty(exports, "createPage", {
	  enumerable: true,
	  get: function get() {
	    return _page.createPage;
	  }
	});
	Object.defineProperty(exports, "createSelector", {
	  enumerable: true,
	  get: function get() {
	    return _page.createSelector;
	  }
	});
	Object.defineProperty(exports, "clone", {
	  enumerable: true,
	  get: function get() {
	    return _page.clone;
	  }
	});
	Object.defineProperty(exports, "clean", {
	  enumerable: true,
	  get: function get() {
	    return _page.clean;
	  }
	});
	Object.defineProperty(exports, "setupPage", {
	  enumerable: true,
	  get: function get() {
	    return _page.setupPage;
	  }
	});

	var _selection = __webpack_require__(32);

	Object.defineProperty(exports, "select", {
	  enumerable: true,
	  get: function get() {
	    return _selection.select;
	  }
	});
	Object.defineProperty(exports, "count", {
	  enumerable: true,
	  get: function get() {
	    return _selection.count;
	  }
	});
	Object.defineProperty(exports, "parts", {
	  enumerable: true,
	  get: function get() {
	    return _selection.parts;
	  }
	});
	Object.defineProperty(exports, "allSelect", {
	  enumerable: true,
	  get: function get() {
	    return _selection.allSelect;
	  }
	});

	var _preview = __webpack_require__(33);

	Object.defineProperty(exports, "preview", {
	  enumerable: true,
	  get: function get() {
	    return _preview.preview;
	  }
	});

/***/ },
/* 28 */
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
/* 29 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// return an object mapping attribute names to their value
	// for all attributes of an element
	var attributes = exports.attributes = function attributes(element) {
	    var ignored = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var attrs = Array.from(element.attributes).reduce(function (stored, attr) {
	        var name = attr.name;
	        var value = attr.value;

	        if (ignored[name]) {
	            return stored;
	        }
	        // don't include current-selector class
	        if (name === "class") {
	            value = value.replace("current-selector", "").trim();
	        }
	        // don't include empty attrs
	        if (value !== "") {
	            stored.push({ name: name, value: value });
	        }
	        return stored;
	    }, []);

	    // include text if it exists
	    var text = element.textContent.trim();
	    if (text !== "") {
	        attrs.push({ name: "text", value: text });
	    }

	    return attrs;
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

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
	  [].slice.call(elements).forEach(function (e) {
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
	  [].slice.call(document.getElementsByClassName(className)).forEach(function (e) {
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
	  [].slice.call(elements).forEach(function (e) {
	    e.classList.add(className);
	    e.addEventListener("mouseover", over, false);
	    e.addEventListener("mouseout", out, false);
	    e.addEventListener("click", click, false);
	  });
	};

	/*
	 * iUnhighlight
	 * ---------
	 *
	 * @param className - the className to remove from all elements that have it
	 * @param over - mouseover function to remove
	 * @param out - mouseout function to remove
	 * @param click - click function to remove
	 */
	var iUnhighlight = exports.iUnhighlight = function iUnhighlight(className, over, out, click) {
	  [].slice.call(document.getElementsByClassName(className)).forEach(function (e) {
	    e.classList.remove(className);
	    e.removeEventListener("mouseover", over, false);
	    e.removeEventListener("mouseout", out, false);
	    e.removeEventListener("click", click, false);
	  });
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setupPage = exports.addChild = exports.clean = exports.clone = exports.createSelector = exports.createPage = undefined;

	var _selection = __webpack_require__(32);

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

	var createSelector = exports.createSelector = function createSelector(selector) {
	  var type = arguments.length <= 1 || arguments[1] === undefined ? "single" : arguments[1];
	  var value = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var optional = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	  return {
	    selector: selector,
	    spec: {
	      type: type,
	      value: value
	    },
	    children: [],
	    rules: [],
	    optional: optional
	  };
	};

	/*
	 * clone a page (useful with the graph because that adds unnecessary properties
	 * to each selector) does not include the page's name
	 */
	var clone = exports.clone = function clone(selector) {
	  return Object.assign({}, {
	    id: selector.id,
	    selector: selector.selector,
	    spec: Object.assign({}, selector.spec),
	    optional: selector.optional,
	    children: selector.children.map(function (child) {
	      return clone(child);
	    }),
	    rules: selector.rules.map(function (r) {
	      return Object.assign({}, r);
	    }),
	    elements: selector.elements || []
	  });
	};

	var clean = exports.clean = function clean(page) {
	  return Object.assign({}, {
	    name: page.name
	  }, cleanSelector(page));
	};

	var cleanSelector = function cleanSelector(s) {
	  return Object.assign({}, {
	    selector: s.selector,
	    spec: Object.assign({}, s.spec),
	    children: s.children.map(function (c) {
	      return cleanSelector(c);
	    }),
	    rules: s.rules.map(function (r) {
	      return Object.assign({}, r);
	    }),
	    optional: s.optional
	  });
	};

	/*
	 * iterate over the tree looking for selector matching id, and when found
	 * append the newChild to its array of children
	 */
	var addChild = exports.addChild = function addChild(selector, id, newChild) {
	  if (selector.id === id) {
	    selector.children.push(newChild);
	    return true;
	  } else {
	    var found = selector.children.some(function (child) {
	      addChild(child, id, newChild);
	    });
	    return found;
	  }
	};

	/*
	 * set an id on each selector and determine the elements that each selector matches
	 */
	var setupPage = exports.setupPage = function setupPage(page) {
	  if (page === undefined) {
	    return;
	  }
	  var id = 0;
	  var setup = function setup(selector, parentElements) {
	    selector.id = id++;
	    selector.elements = (0, _selection.select)(parentElements, selector.selector, selector.spec);
	    selector.children.forEach(function (child) {
	      setup(child, selector.elements);
	    });
	  };

	  setup(page, [document]);
	  page.nextID = id;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * select
	 * ------
	 * Returns an array of elements that are children of the parent elements and
	 * match the selector.
	 *
	 * @param parents - an array of parent elements to search using the selector
	 * @param selector - the selector to use to match children of the parent elements
	 * @param spec - how to select the child element or elements of a parent element
	 */
	var select = exports.select = function select(parents, selector, spec) {
	  var sel = (selector || "*") + ":not(.no-select)";
	  var index = spec && spec.type === "single" ? spec.value : undefined;

	  var specElements = function specElements(elements) {
	    if (index !== undefined) {
	      return elements[index] !== undefined ? [elements[index]] : [];
	    } else {
	      return [].slice.call(elements);
	    }
	  };

	  return [].slice.call(parents).reduce(function (arr, p) {
	    var eles = p.querySelectorAll(sel);
	    return arr.concat(specElements(eles));
	  }, []);
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
	var count = exports.count = function count(parents, selector, spec) {
	  var sel = (selector || "*") + ":not(.no-select)";
	  var index = spec && spec.type === "single" ? spec.value : undefined;

	  var specElements = function specElements(elements) {
	    if (index !== undefined) {
	      return elements[index] !== undefined ? 1 : 0;
	    } else {
	      return elements.length;
	    }
	  };

	  return [].slice.call(parents).reduce(function (top, p) {
	    var eles = p.querySelectorAll(sel);
	    var count = specElements(eles);
	    return top > count ? top : count;
	  }, 0);
	};

	/*
	 * parts
	 * -------------
	 * Returns an array of strings that can be used as CSS selectors to select the element.
	 * Element tags are converted to lowercase, ids are preceded by a "#" and classes are
	 * preceded by a "."
	 *
	 * @param element - the element to analyze
	 */
	var parts = exports.parts = function parts(element) {
	  var skipTags = [];
	  var skipClasses = ["forager-highlight", "query-check", "selectable-element", "current-selector"];

	  var tagAllowed = function tagAllowed(tag) {
	    return !skipTags.some(function (st) {
	      return st === tag;
	    });
	  };

	  var classAllowed = function classAllowed(c) {
	    return !skipClasses.some(function (sc) {
	      return sc === c;
	    });
	  };

	  var pieces = [];
	  var tag = element.tagName.toLowerCase();
	  if (tagAllowed(tag)) {
	    pieces.push(tag);
	  } else {
	    // if the tag isn't allowed, return an empty array
	    return [];
	  }

	  // id
	  if (element.id !== "") {
	    pieces.push("#" + element.id);
	  }

	  // classes
	  [].slice.call(element.classList).forEach(function (c) {
	    if (classAllowed(c)) {
	      pieces.push("." + c);
	    }
	  });
	  return pieces;
	};

	/*
	 * check if all elements matched by the selector are "select" elements
	 */
	var allSelect = exports.allSelect = function allSelect(selection) {
	  return selection.every(function (ele) {
	    return ele.tagName === "SELECT";
	  });
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var preview = exports.preview = function preview(page) {
	    /*
	     * Given a parent element, get all children that match the selector
	     * Return data based on selector's type (index or name)
	     */
	    var getElement = function getElement(selector, parent) {
	        var elements = parent.querySelectorAll(selector.selector);
	        var value = selector.spec.value;
	        switch (selector.spec.type) {
	            case "single":
	                var ele = elements[value];
	                if (!ele) {
	                    return;
	                }
	                return getElementData(selector, ele);
	            case "all":
	                var data = Array.from(elements).map(function (ele) {
	                    return getElementData(selector, ele);
	                }).filter(function (datum) {
	                    return datum !== undefined;
	                });
	                var obj = {};
	                obj[value] = data;
	                return obj;
	        }
	    };

	    /*
	     * Get data for each rule and each child. Merge the child data into the
	     * rule data.
	     */
	    var getElementData = function getElementData(selector, element) {
	        var data = getRuleData(selector.rules, element);
	        var childData = getChildData(selector.children, element);
	        if (!childData) {
	            return;
	        }
	        for (var key in childData) {
	            data[key] = childData[key];
	        }
	        return data;
	    };

	    var getChildData = function getChildData(children, element) {
	        var data = {};
	        children.some(function (child) {
	            var childData = getElement(child, element);
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

	    var intRegEx = /\d+/;
	    var floatRegEx = /\d+(\.\d+)?/;
	    var getRuleData = function getRuleData(rules, element) {
	        var data = {};
	        rules.forEach(function (rule) {
	            var val;
	            var match;
	            if (rule.attr === "text") {
	                val = element.textContent.replace(/\s+/g, " ");
	            } else {
	                var attr = element.getAttribute(rule.attr);
	                // attributes that don't exist will return null
	                // just use empty string for now
	                val = attr || "";
	            }
	            switch (rule.type) {
	                case "int":
	                    match = val.match(intRegEx);
	                    val = match !== null ? parseInt(match[0], 10) : -1;
	                    break;
	                case "float":
	                    match = val.match(floatRegEx);
	                    val = match !== null ? parseFloat(match[0]) : -1.0;
	                    break;
	            }
	            data[rule.name] = val;
	        });
	        return data;
	    };

	    return page === undefined ? "" : getElement(page, document);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _SelectorFrame = __webpack_require__(35);

	var _SelectorFrame2 = _interopRequireDefault(_SelectorFrame);

	var _RuleFrame = __webpack_require__(36);

	var _RuleFrame2 = _interopRequireDefault(_RuleFrame);

	var _ElementFrame = __webpack_require__(37);

	var _ElementFrame2 = _interopRequireDefault(_ElementFrame);

	var _PartsFrame = __webpack_require__(38);

	var _PartsFrame2 = _interopRequireDefault(_PartsFrame);

	var _SpecFrame = __webpack_require__(39);

	var _SpecFrame2 = _interopRequireDefault(_SpecFrame);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Frames",

	  cssSelector: "current-selector",
	  _selectFrame: function _selectFrame() {
	    var _props = this.props;
	    var frame = _props.frame;
	    var selector = _props.selector;
	    var actions = _props.actions;

	    switch (frame.name) {
	      case "selector":
	        return _react2.default.createElement(_SelectorFrame2.default, { selector: selector,
	          data: frame.data,
	          actions: actions });
	      case "rule":
	        return _react2.default.createElement(_RuleFrame2.default, { selector: selector,
	          data: frame.data,
	          actions: actions });
	      case "element":
	        return _react2.default.createElement(_ElementFrame2.default, { selector: selector,
	          data: frame.data,
	          actions: actions });
	      case "parts":
	        return _react2.default.createElement(_PartsFrame2.default, { selector: selector,
	          data: frame.data,
	          actions: actions });
	      case "spec":
	        return _react2.default.createElement(_SpecFrame2.default, { selector: selector,
	          data: frame.data,
	          actions: actions });
	      default:
	        return null;
	    }
	  },
	  componentWillMount: function componentWillMount() {
	    if (this.props.selector) {
	      this._highlightParents(this.props.selector.elements);
	    }
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.selector !== undefined && nextProps.selector !== this.props.selector) {
	      this._highlightParents(nextProps.selector.elements);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _helpers.unhighlight)(this.cssSelector);
	  },
	  _highlightParents: function _highlightParents(elements) {
	    (0, _helpers.unhighlight)(this.cssSelector);
	    (0, _helpers.highlight)(elements, this.cssSelector);
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "frames" },
	      this._selectFrame()
	    );
	  }
	});

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "SelectorFrame",

	  addChild: function addChild(event) {
	    this.props.actions.showElementFrame();
	  },
	  addRule: function addRule(event) {
	    this.props.actions.showRuleFrame();
	  },
	  remove: function remove(event) {
	    this.props.actions.removeSelector(this.props.selector.id);
	  },
	  render: function render() {
	    if (this.props.selector === undefined) {
	      return null;
	    }

	    var _props$selector = this.props.selector;
	    var selector = _props$selector.selector;
	    var children = _props$selector.children;
	    var rules = _props$selector.rules;
	    var spec = _props$selector.spec;
	    var optional = _props$selector.optional;
	    var type = spec.type;
	    var value = spec.value;

	    var description = "";
	    if (type === "single") {
	      description = "element at index " + value;
	    } else if (type === "all") {
	      description = "all elements, stores them as \"" + value + "\"";
	    }
	    // include spaces since this is text
	    var optionalText = optional ? " (optional)" : "";
	    return _react2.default.createElement(
	      "div",
	      { className: "frame" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "div",
	          null,
	          "Selector: ",
	          _react2.default.createElement(
	            "span",
	            { className: "big bold" },
	            selector
	          ),
	          " ",
	          optionalText
	        ),
	        _react2.default.createElement(
	          "div",
	          null,
	          "Captures: ",
	          description
	        ),
	        _react2.default.createElement(RuleList, { rules: rules,
	          actions: this.props.actions })
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Inputs.PosButton, { text: "Add Child",
	          click: this.addChild }),
	        _react2.default.createElement(_Inputs.PosButton, { text: "Add Rule",
	          click: this.addRule }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Remove",
	          title: "Remove Selector",
	          click: this.remove })
	      )
	    );
	  }
	});

	var RuleList = _react2.default.createClass({
	  displayName: "RuleList",

	  render: function render() {
	    var _props = this.props;
	    var rules = _props.rules;
	    var actions = _props.actions;
	    var removeRule = actions.removeRule;

	    var list = rules.length ? rules.map(function (r, i) {
	      return _react2.default.createElement(Rule, _extends({ key: i, index: i, remove: removeRule }, r));
	    }) : _react2.default.createElement(
	      "li",
	      null,
	      "No Rules"
	    );
	    return _react2.default.createElement(
	      "div",
	      { className: "rules" },
	      "Rules:",
	      _react2.default.createElement(
	        "ul",
	        null,
	        list
	      )
	    );
	  }
	});

	var Rule = _react2.default.createClass({
	  displayName: "Rule",

	  handleClick: function handleClick(event) {
	    event.preventDefault();
	    this.props.remove(this.props.index);
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var name = _props2.name;
	    var attr = _props2.attr;
	    var type = _props2.type;

	    return _react2.default.createElement(
	      "li",
	      { className: "rule" },
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
	      _react2.default.createElement(_Inputs.NegButton, { text: String.fromCharCode(215),
	        classes: ["transparent"],
	        click: this.handleClick })
	    );
	  }
	});

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "RuleFrame",

	  getInitialState: function getInitialState() {
	    return {
	      name: "",
	      type: "string",
	      attr: "",
	      elementIndex: 0
	    };
	  },
	  setName: function setName(event) {
	    this.setState({
	      name: event.target.value
	    });
	  },
	  setType: function setType(event) {
	    this.setState({
	      type: event.target.value
	    });
	  },
	  setAttr: function setAttr(attr) {
	    this.setState({
	      attr: attr
	    });
	  },
	  saveHandler: function saveHandler(event) {
	    event.preventDefault();
	    var _state = this.state;
	    var name = _state.name;
	    var type = _state.type;
	    var attr = _state.attr;
	    // basic validation

	    if (name !== "" && attr !== "") {
	      this.props.actions.saveRule({
	        name: name,
	        type: type,
	        attr: attr
	      });
	    }
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.actions.showSelectorFrame();
	  },
	  render: function render() {
	    var _this = this;

	    var _props = this.props;
	    var selector = _props.selector;
	    var actions = _props.actions;

	    var typeRadios = ["string", "int", "float"].map(function (t, i) {
	      return _react2.default.createElement(
	        "label",
	        { key: i },
	        t,
	        ": ",
	        _react2.default.createElement("input", { type: "radio",
	          name: "rule-type",
	          value: t,
	          checked: t === _this.state.type,
	          onChange: _this.setType })
	      );
	    });

	    return _react2.default.createElement(
	      "div",
	      { className: "frame rule-form" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "div",
	          null,
	          _react2.default.createElement(
	            "label",
	            null,
	            "Name: ",
	            _react2.default.createElement("input", { type: "text",
	              value: this.state.name,
	              onChange: this.setName })
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          null,
	          "Type: ",
	          typeRadios
	        ),
	        _react2.default.createElement(AttrChoices, { elements: selector.elements,
	          attr: this.state.attr,
	          setAttr: this.setAttr })
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Inputs.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  }
	});

	var AttrChoices = _react2.default.createClass({
	  displayName: "AttrChoices",

	  getInitialState: function getInitialState() {
	    return {
	      index: 0
	    };
	  },
	  nextElement: function nextElement(event) {
	    var index = this.state.index;

	    var eleCount = this.props.elements.length;
	    this.setState({
	      index: (index + 1) % eleCount
	    });
	  },
	  prevElement: function prevElement(event) {
	    var index = this.state.index;

	    var eleCount = this.props.elements.length;
	    this.setState({
	      index: (index - 1 + eleCount) % eleCount
	    });
	  },
	  selectAttr: function selectAttr(event) {
	    this.props.setAttr(event.target.value);
	  },
	  elementAttributes: function elementAttributes(element) {
	    var _this2 = this;

	    var attr = this.props.attr;

	    return (0, _helpers.attributes)(element).map(function (a, i) {
	      return _react2.default.createElement(
	        "li",
	        { key: i },
	        _react2.default.createElement(
	          "label",
	          null,
	          _react2.default.createElement("input", { type: "radio",
	            name: "rule-attr",
	            value: a.name,
	            checked: a.name === attr,
	            onChange: _this2.selectAttr }),
	          a.name,
	          " - ",
	          (0, _helpers.abbreviate)(a.value, 100)
	        )
	      );
	    });
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var elements = _props2.elements;
	    var attr = _props2.attr;
	    var index = this.state.index;

	    var eleCount = elements.length;
	    return _react2.default.createElement(
	      "div",
	      { className: "element-attributes" },
	      _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(_Inputs.PosButton, { text: "<<", click: this.prevElement }),
	        " ",
	        index,
	        "/",
	        eleCount - 1,
	        " ",
	        _react2.default.createElement(_Inputs.PosButton, { text: ">>", click: this.nextElement })
	      ),
	      _react2.default.createElement(
	        "ul",
	        null,
	        this.elementAttributes(elements[index])
	      )
	    );
	  }
	});

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * ElementFrame
	 * ------------
	 *
	 * This frame is used select an element within the page. An elements props is
	 * passed to the frame, which is used when the frame is mounted/updated to attach
	 * an event listener all child elements of the elements. When one of those elements
	 * is clicked, an array of css selector options (from the clicked element to the
	 * parent) will be rendered.
	 */
	exports.default = _react2.default.createClass({
	  displayName: "ElementFrame",

	  potentialSelector: "selectable-element",
	  currentSelector: "query-check",
	  events: {
	    over: function over(event) {
	      event.target.classList.add("forager-highlight");
	    },
	    out: function out(event) {
	      event.target.classList.remove("forager-highlight");
	    },
	    click: function click(event) {
	      event.preventDefault();
	      event.stopPropagation();
	      var selectors = Array.from(event.path).filter(function (ele) {
	        return ele.classList && ele.classList.contains("selectable-element");
	      }).reverse().map(function (ele) {
	        return (0, _helpers.parts)(ele);
	      });
	      this.setState({
	        selectors: selectors
	      });
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      checked: undefined,
	      selectors: [],
	      eleCount: 0
	    };
	  },
	  setRadio: function setRadio(i) {
	    var selector = this.state.selectors[i].join("");
	    var eleCount = (0, _helpers.count)(this.props.selector.elements, selector);
	    this.setState({
	      checked: i,
	      eleCount: eleCount
	    });
	  },
	  saveHandler: function saveHandler(event) {
	    event.preventDefault();
	    var _state = this.state;
	    var checked = _state.checked;
	    var selectors = _state.selectors;

	    var s = selectors[checked];
	    if (checked !== undefined && s !== undefined) {
	      this.props.actions.showPartsFrame(s);
	    }
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.actions.showSelectorFrame();
	  },
	  render: function render() {
	    var _this = this;

	    var _props = this.props;
	    var selector = _props.selector;
	    var data = _props.data;
	    var _state2 = this.state;
	    var selectors = _state2.selectors;
	    var checked = _state2.checked;
	    var eleCount = _state2.eleCount;

	    var opts = selectors.map(function (s, i) {
	      return _react2.default.createElement(SelectorRadio, { key: i,
	        selector: s,
	        index: i,
	        checked: i === checked,
	        select: _this.setRadio });
	    });
	    return _react2.default.createElement(
	      "div",
	      { className: "frame element-form" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "h3",
	          null,
	          "Selectors:"
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "choices" },
	          opts
	        ),
	        _react2.default.createElement(
	          "h5",
	          null,
	          "Count: ",
	          eleCount
	        )
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Inputs.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  },
	  /*
	   * below here are the functions for interacting with the non-Forager part of the page
	   */
	  componentWillMount: function componentWillMount() {
	    this._setupPageEvents(this.props.selector.elements);
	  },
	  componentWillReceiveNewProps: function componentWillReceiveNewProps(nextProps) {
	    this._setupPageEvents(nextProps.selector.elements);
	  },
	  /*
	   * when a selector possibility is chosen, add a class to all matching elements
	   * to show what that selector could match
	   */
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    // remove any highlights from a previously selected selector
	    (0, _helpers.unhighlight)(this.currentSelector);
	    var clickedSelector = nextState.selectors[nextState.checked];
	    if (clickedSelector !== undefined) {
	      var fullSelector = clickedSelector.join("");
	      var elements = (0, _helpers.select)(nextProps.selector.elements, fullSelector);
	      (0, _helpers.highlight)(elements, this.currentSelector);
	    }
	  },
	  /*
	   * remove any classes and event listeners from the page when the frame is unmounted
	   */
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _helpers.unhighlight)(this.currentSelector);
	    (0, _helpers.iUnhighlight)(this.potentialSelector, this.events.over, this.events.out, this.boundClick);
	    delete this.boundClick;
	  },
	  /*
	   * attach a class and events to all child elements of the current selector
	   */
	  _setupPageEvents: function _setupPageEvents(parents) {
	    var elements = (0, _helpers.select)(parents);
	    this.boundClick = this.events.click.bind(this);
	    (0, _helpers.iHighlight)(elements, this.potentialSelector, this.events.over, this.events.out, this.boundClick);
	  }
	});

	var SelectorRadio = _react2.default.createClass({
	  displayName: "SelectorRadio",

	  setRadio: function setRadio(event) {
	    // do not call event.preventDefault() here or the checked dot will fail to render
	    this.props.select(this.props.index);
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var selector = _props2.selector;
	    var checked = _props2.checked;

	    var labelClass = checked ? "selected" : "";
	    return _react2.default.createElement(
	      "label",
	      { className: labelClass },
	      _react2.default.createElement("input", { type: "radio",
	        name: "css-selector",
	        checked: checked,
	        onChange: this.setRadio }),
	      selector.join("")
	    );
	  }
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "PartsFrame",

	  previewClass: "query-check",
	  getInitialState: function getInitialState() {
	    return {
	      parts: [],
	      eleCount: 0
	    };
	  },
	  saveHandler: function saveHandler(event) {
	    event.preventDefault();
	    var parts = this.state.parts;

	    var selector = parts.reduce(function (str, curr) {
	      if (curr.checked) {
	        str += curr.name;
	      }
	      return str;
	    }, "");
	    if (selector !== "") {
	      this.props.actions.showSpecFrame(selector);
	    }
	  },
	  cancelHander: function cancelHander(event) {
	    event.preventDefault();
	    this.props.actions.showSelectorFrame();
	  },
	  toggleRadio: function toggleRadio(event) {
	    // don't prevent default
	    var index = event.target.value;
	    var parts = this.state.parts;
	    parts[index].checked = !parts[index].checked;
	    var fullSelector = parts.reduce(function (str, curr) {
	      if (curr.checked) {
	        str += curr.name;
	      }
	      return str;
	    }, "");

	    var eleCount = fullSelector === "" ? 0 : (0, _helpers.count)(this.props.selector.elements, fullSelector);
	    this._setupHighlights(fullSelector);
	    this.setState({
	      parts: parts,
	      eleCount: eleCount
	    });
	  },
	  componentWillMount: function componentWillMount() {
	    var names = this.props.data.parts;
	    var parts = names.map(function (name) {
	      return {
	        name: name,
	        checked: true
	      };
	    });
	    var fullSelector = names.join("");
	    var eleCount = (0, _helpers.count)(this.props.selector.elements, fullSelector);
	    this._setupHighlights(fullSelector);
	    this.setState({
	      parts: parts,
	      eleCount: eleCount
	    });
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this._removeHighlights();
	  },
	  render: function render() {
	    var _this = this;

	    var _state = this.state;
	    var parts = _state.parts;
	    var eleCount = _state.eleCount;

	    var opts = parts.map(function (part, index) {
	      var name = part.name;
	      var checked = part.checked;

	      var labelClass = checked ? "selected" : "";
	      return _react2.default.createElement(
	        "label",
	        { key: index,
	          className: labelClass },
	        name,
	        _react2.default.createElement("input", { type: "checkbox",
	          name: "selector-part",
	          value: index,
	          checked: checked,
	          onChange: _this.toggleRadio })
	      );
	    });
	    return _react2.default.createElement(
	      "div",
	      { className: "frame parts-form" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "h3",
	          null,
	          "Parts:"
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "choices" },
	          opts
	        ),
	        _react2.default.createElement(
	          "h5",
	          null,
	          "Count: ",
	          this.state.eleCount
	        )
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Inputs.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Cancel", click: this.cancelHander })
	      )
	    );
	  },
	  _setupHighlights: function _setupHighlights(cssSelector) {
	    (0, _helpers.unhighlight)(this.previewClass);
	    if (cssSelector !== "") {
	      var elements = (0, _helpers.select)(this.props.selector.elements, cssSelector);
	      (0, _helpers.highlight)(elements, this.previewClass);
	    }
	  },
	  _removeHighlights: function _removeHighlights() {
	    (0, _helpers.unhighlight)(this.previewClass);
	  }
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "SpecFrame",

	  highlight: "query-check",
	  getInitialState: function getInitialState() {
	    return {
	      type: "single",
	      value: 0,
	      optional: false
	    };
	  },
	  saveHandler: function saveHandler(event) {
	    event.preventDefault();
	    var _state = this.state;
	    var type = _state.type;
	    var value = _state.value;
	    var optional = _state.optional;
	    // all value must be set

	    if (type === "all" && value === "") {
	      return;
	    }
	    var sel = (0, _helpers.createSelector)(this.props.data.css, type, value, optional);
	    // generate the list of elements right away
	    sel.elements = (0, _helpers.select)(this.props.selector.elements, sel.selector, sel.spec);
	    // if saving a selector that selects "select" elements, add a child selector
	    // to match option elements
	    if ((0, _helpers.allSelect)(sel.elements)) {
	      var optionsChild = (0, _helpers.createSelector)("option", "all", "option", false);
	      optionsChild.elements = (0, _helpers.select)(sel.elements, optionsChild.selector, optionsChild.spec);
	      sel.children.push(optionsChild);
	    }
	    // send the new selector and the parent
	    this.props.actions.saveSelector(sel, this.props.selector.id);
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.actions.showSelectorFrame();
	  },
	  setSpec: function setSpec(type, value) {
	    this.setState({
	      type: type,
	      value: value
	    });
	  },
	  toggleOptional: function toggleOptional(event) {
	    this.setState({
	      optional: event.target.checked
	    });
	  },
	  render: function render() {
	    var _props = this.props;
	    var selector = _props.selector;
	    var data = _props.data;
	    var css = data.css;

	    var elementCount = (0, _helpers.count)(selector.elements, css);
	    return _react2.default.createElement(
	      "div",
	      { className: "frame spec-form" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "div",
	          null,
	          "Selector: ",
	          css
	        ),
	        _react2.default.createElement(SpecForm, { count: elementCount,
	          setSpec: this.setSpec }),
	        _react2.default.createElement(
	          "div",
	          null,
	          _react2.default.createElement(
	            "label",
	            null,
	            "Optional: ",
	            _react2.default.createElement("input", { type: "checkbox",
	              checked: this.state.optional,
	              onChange: this.toggleOptional })
	          )
	        )
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Inputs.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Inputs.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  },
	  componentWillMount: function componentWillMount() {
	    var parentElements = this.props.selector.elements;
	    var cssSelector = this.props.data.css;
	    var spec = {
	      type: this.state.type,
	      value: this.state.value
	    };
	    var elements = (0, _helpers.select)(parentElements, cssSelector, spec);
	    (0, _helpers.highlight)(elements, this.highlight);
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    var parentElements = nextProps.selector.elements;
	    var cssSelector = nextProps.data.css;
	    var spec = {
	      type: nextState.type,
	      value: nextState.value
	    };
	    (0, _helpers.unhighlight)(this.highlight);
	    var elements = (0, _helpers.select)(parentElements, cssSelector, spec);
	    (0, _helpers.highlight)(elements, this.highlight);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _helpers.unhighlight)(this.highlight);
	  }
	});

	var SpecForm = _react2.default.createClass({
	  displayName: "SpecForm",

	  getInitialState: function getInitialState() {
	    return {
	      type: "single",
	      value: 0
	    };
	  },
	  setType: function setType(event) {
	    var type = event.target.value;
	    var value = undefined;
	    if (type === "single") {
	      value = 0;
	    } else if (type === "all") {
	      value = "";
	    }
	    this.props.setSpec(type, value);
	    this.setState({
	      type: type,
	      value: value
	    });
	  },
	  setValue: function setValue(event) {
	    var value = event.target.value;
	    if (this.state.type === "single") {
	      value = parseInt(value, 10);
	    }
	    this.setSpec(this.state.type, value);
	    this.setState({
	      value: value
	    });
	  },
	  setSpec: function setSpec(type, value) {
	    this.props.setSpec(type, value);
	  },
	  _singleValue: function _singleValue() {
	    var value = this.state.value;

	    var options = [];
	    for (var i = 0; i < this.props.count; i++) {
	      options.push(_react2.default.createElement(
	        "option",
	        { key: i, value: i },
	        i
	      ));
	    }
	    return _react2.default.createElement(
	      "select",
	      { value: value,
	        onChange: this.setValue },
	      options
	    );
	  },
	  _allValue: function _allValue() {
	    return _react2.default.createElement(
	      "div",
	      null,
	      "Name: ",
	      _react2.default.createElement("input", { type: "text",
	        value: this.state.value,
	        onChange: this.setValue })
	    );
	  },
	  render: function render() {
	    var valueChooser = this.state.type === "single" ? this._singleValue() : this._allValue();
	    return _react2.default.createElement(
	      "div",
	      null,
	      _react2.default.createElement(
	        "div",
	        null,
	        "Type:",
	        _react2.default.createElement(
	          "label",
	          null,
	          "single ",
	          _react2.default.createElement("input", { type: "radio",
	            name: "type",
	            value: "single",
	            checked: this.state.type === "single",
	            onChange: this.setType })
	        ),
	        _react2.default.createElement(
	          "label",
	          null,
	          "all ",
	          _react2.default.createElement("input", { type: "radio",
	            name: "type",
	            value: "all",
	            checked: this.state.type === "all",
	            onChange: this.setType })
	        )
	      ),
	      valueChooser
	    );
	  }
	});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _d = __webpack_require__(41);

	var _d2 = _interopRequireDefault(_d);

	var _helpers = __webpack_require__(27);

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
	      width: 500,
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
	  _makeNodes: function _makeNodes() {
	    // don't draw anything when there isn't a page
	    var _props = this.props;
	    var page = _props.page;
	    var selector = _props.selector;
	    var selectSelector = _props.selectSelector;

	    if (page === undefined) {
	      return null;
	    }

	    var _state = this.state;
	    var tree = _state.tree;
	    var diagonal = _state.diagonal;

	    var clonedPage = (0, _helpers.clone)(page);

	    // generate the tree's nodes and links
	    var nodes = tree.nodes(clonedPage);
	    var links = tree.links(nodes);
	    var paths = links.map(function (l, i) {
	      return _react2.default.createElement("path", { key: i,
	        className: "link",
	        d: diagonal(l) });
	    });

	    var selectors = nodes.map(function (n, i) {
	      var current = false;
	      if (selector && n.id === selector.id) {
	        current = true;
	      }
	      return _react2.default.createElement(Node, _extends({ key: i,
	        current: current,
	        select: selectSelector
	      }, n));
	    });

	    return _react2.default.createElement(
	      "g",
	      null,
	      paths,
	      selectors
	    );
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var width = _props2.width;
	    var height = _props2.height;
	    var margin = _props2.margin;

	    var nodes = this._makeNodes();

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

	  hoverClass: "saved-preview",
	  handleClick: function handleClick(event) {
	    event.preventDefault();
	    this.props.select(this.props.id);
	  },
	  handleMouseover: function handleMouseover(event) {
	    (0, _helpers.highlight)(this.props.elements, this.hoverClass);
	  },
	  handleMouseout: function handleMouseout(event) {
	    (0, _helpers.unhighlight)(this.hoverClass);
	  },
	  specText: function specText() {
	    var _props3 = this.props;
	    var selector = _props3.selector;
	    var spec = _props3.spec;

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
	    return (0, _helpers.abbreviate)(text, 10);
	  },
	  render: function render() {
	    var _props4 = this.props;
	    var rules = _props4.rules;
	    var children = _props4.children;
	    var current = _props4.current;
	    var depth = _props4.depth;

	    var hasChildren = children && children.length;
	    var hasRules = rules && rules.length;
	    var text = this.specText();
	    var marker = rules && rules.length ? _react2.default.createElement("rect", { width: "6", height: "6", x: "-3", y: "-3" }) : _react2.default.createElement("circle", { r: "3" });
	    var classNames = ["node"];
	    if (current) {
	      classNames.push("current");
	    }
	    if (!hasRules && !hasChildren) {
	      classNames.push("empty");
	    }
	    return _react2.default.createElement(
	      "g",
	      { className: classNames.join(" "),
	        transform: "translate(" + this.props.y + "," + this.props.x + ")",
	        onClick: this.handleClick,
	        onMouseOver: this.handleMouseover,
	        onMouseOut: this.handleMouseout },
	      _react2.default.createElement(
	        "text",
	        { y: "-10" },
	        text
	      ),
	      marker
	    );
	  }
	});

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Inputs = __webpack_require__(26);

	var _helpers = __webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createClass({
	  displayName: "Preview",

	  clickHandler: function clickHandler(event) {
	    event.preventDefault();
	    this.props.close();
	  },
	  render: function render() {
	    var page = this.props.page;

	    var previewText = JSON.stringify((0, _helpers.preview)(page), null, 2);
	    return _react2.default.createElement(
	      "div",
	      { className: "preview-holder" },
	      _react2.default.createElement("div", { className: "preview-bg", onClick: this.clickHandler }),
	      _react2.default.createElement(
	        "div",
	        { className: "preview" },
	        _react2.default.createElement(
	          "pre",
	          null,
	          previewText
	        ),
	        _react2.default.createElement(_Inputs.NeutralButton, { text: "Close", click: this.clickHandler })
	      )
	    );
	  }
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _frame = __webpack_require__(44);

	var _frame2 = _interopRequireDefault(_frame);

	var _show = __webpack_require__(45);

	var _show2 = _interopRequireDefault(_show);

	var _page = __webpack_require__(46);

	var _page2 = _interopRequireDefault(_page);

	var _selector = __webpack_require__(47);

	var _selector2 = _interopRequireDefault(_selector);

	var _preview = __webpack_require__(48);

	var _preview2 = _interopRequireDefault(_preview);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var initialState = {
	  show: true,
	  page: {
	    pages: [undefined],
	    pageIndex: 0
	  },
	  frame: {
	    name: "selector",
	    data: {}
	  },
	  preview: {
	    visible: false
	  },
	  selector: undefined
	};

	/*
	 * Forager reducer
	 */
	/*import * as types from "../constants/ActionTypes";
	  case types.REMOVE_RULE:
	    return Object.assign({}, state, {

	    });
	*/
	function reducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    default:
	      return {
	        frame: (0, _frame2.default)(state.frame, action),
	        show: (0, _show2.default)(state.show, action),
	        page: (0, _page2.default)(state.page, action),
	        selector: (0, _selector2.default)(state.selector, action),
	        preview: (0, _preview2.default)(state.preview, action)
	      };
	  }
	}

	exports.default = reducer;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = frame;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function frame() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.LOAD_PAGE:
	    case types.REMOVE_SELECTOR:
	    case types.SAVE_SELECTOR:
	    case types.SAVE_RULE:
	    case types.REMOVE_RULE:
	    case types.CLOSE_FORAGER:
	    case types.SHOW_SELECTOR_FRAME:
	      return Object.assign({}, state, {
	        name: "selector",
	        data: {}
	      });
	    case types.SHOW_RULE_FRAME:
	      return Object.assign({}, state, {
	        name: "rule",
	        data: {}
	      });
	    case types.SHOW_ELEMENT_FRAME:
	      return Object.assign({}, state, {
	        name: "element",
	        data: {}
	      });
	    case types.SHOW_PARTS_FRAME:
	      return Object.assign({}, state, {
	        name: "parts",
	        data: {
	          parts: action.parts
	        }
	      });
	    case types.SHOW_SPEC_FRAME:
	      return Object.assign({}, state, {
	        name: "spec",
	        data: {
	          css: action.css
	        }
	      });
	    default:
	      return state;
	  }
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = show;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function show() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.CLOSE_FORAGER:
	      return false;
	    case types.SHOW_FORAGER:
	      return true;
	    default:
	      return state;
	  }
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = page;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function page() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.LOAD_PAGE:
	      /*
	       * if the index is out of the bounds of state.pages, set to 0
	       */
	      var max = state.pages.length;
	      var index = parseInt(action.index, 10);
	      if (index < 0 || index >= max) {
	        index = 0;
	      }
	      return Object.assign({}, state, {
	        pageIndex: index
	      });
	    case types.ADD_PAGE:
	      var pages = state.pages;
	      var newPages = [].concat(_toConsumableArray(pages), [action.page]);
	      return Object.assign({}, state, {
	        pages: newPages,
	        pageIndex: newPages.length - 1
	      });
	    case types.REMOVE_PAGE:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      // don't remove the undefined page

	      if (pageIndex === 0) {
	        return state;
	      }
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), _toConsumableArray(pages.slice(pageIndex + 1))),
	        pageIndex: 0
	      });
	    case types.RENAME_PAGE:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      // can't rename the empty page

	      if (pageIndex === 0) {
	        return state;
	      }
	      var newPages = pages.slice();
	      newPages[pageIndex] = Object.assign({}, newPages[pageIndex], {
	        name: action.name
	      });
	      return Object.assign({}, state, {
	        pages: newPages
	      });
	    case types.SAVE_SELECTOR:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;

	      var page = pages[pageIndex];
	      var selector = action.selector;
	      var parentID = action.parentID;

	      // assign the id of the new selector

	      selector.id = page.nextID++;
	      page.nextID++;
	      // and assign the id of the options selector if there is one
	      if (selector.children.length !== 0) {
	        selector.children.forEach(function (child) {
	          child.id = page.nextID++;
	        });
	      }

	      var find = function find(s) {
	        if (s.id === parentID) {
	          s.children.push(selector);
	          return true;
	        } else {
	          var found = s.children.some(function (child) {
	            return find(child);
	          });
	          return found;
	        }
	      };
	      find(page);
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [page], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });
	    case types.REMOVE_SELECTOR:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;

	      var page = pages[pageIndex];

	      var find = function find(s) {
	        var count = s.children.length;
	        s.children = s.children.filter(function (child) {
	          return child.id !== action.selectorID;
	        });
	        return s.children.length < count ? true : s.children.some(function (child) {
	          return find(child);
	        });
	      };

	      if (action.selectorID === 0) {
	        // special case for the root body selector,
	        // just replace the page with a new one
	        page.children = [];
	        page.rules = [];
	      } else {
	        find(page);
	      }

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [page], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });
	    case types.SAVE_RULE:
	    case types.REMOVE_RULE:
	      // attempting to trigger a save
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;

	      var page = pages[pageIndex];
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [page], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });
	    default:
	      return state;
	  }
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = selector;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/*
	 * reducer for the selector. Never create a new selector, always just mutate
	 * the current one so that the changes are reflected in the page that contains
	 * the selector.
	 */
	function selector(state, action) {
	  switch (action.type) {
	    case types.SELECT_SELECTOR:
	    case types.SAVE_SELECTOR:
	      return action.selector;
	    case types.REMOVE_SELECTOR:
	    case types.LOAD_PAGE:
	    case types.ADD_PAGE:
	    case types.REMOVE_PAGE:
	    case types.CLOSE_FORAGER:
	      return undefined;
	    case types.SAVE_RULE:
	      state.rules.push(action.rule);
	      return state;
	    case types.REMOVE_RULE:
	      var rules = state.rules;
	      state.rules.splice(action.index, 1);
	      return state;
	    default:
	      return state;
	  }
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = preview;

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function preview() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.SHOW_PREVIEW:
	      return Object.assign({}, {
	        visible: true
	      });
	    case types.HIDE_PREVIEW:
	      return Object.assign({}, {
	        visible: false
	      });
	    default:
	      return state;
	  }
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(24);

	var ActionTypes = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (state) {
	  return function (next) {
	    return function (action) {
	      switch (action.type) {
	        case ActionTypes.SELECT_SELECTOR:
	          var current = state.getState();
	          var id = action.selectorID;
	          var page = current.page.pages[current.page.pageIndex];
	          var selector = find(page, id);
	          action.selector = selector;
	          break;
	      }
	      return next(action);
	    };
	  };
	};

	var find = function find(page, id) {
	  var sel = undefined;
	  var search = function search(selector) {
	    if (selector.id === id) {
	      sel = selector;
	      return true;
	    } else {
	      return selector.children.some(function (child) {
	        return search(child);
	      });
	    }
	  };
	  search(page);
	  return sel;
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(24);

	var ActionTypes = _interopRequireWildcard(_ActionTypes);

	var _helpers = __webpack_require__(27);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (state) {
	  return function (next) {
	    return function (action) {
	      switch (action.type) {
	        case ActionTypes.UPLOAD_PAGE:
	          var current = state.getState();
	          var _current$page = current.page;
	          var pages = _current$page.pages;
	          var pageIndex = _current$page.pageIndex;

	          var page = pages[pageIndex];

	          var uploadData = {
	            name: page.name,
	            site: window.location.hostname,
	            page: JSON.stringify((0, _helpers.clean)(page))
	          };
	          chrome.runtime.sendMessage({ type: 'upload', data: uploadData });
	      }
	      return next(action);
	    };
	  };
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.chromeLoad = exports.chromeSave = undefined;

	var _helpers = __webpack_require__(27);

	/*
	 * TODO: this will load pages and options from and save them to
	 * chrome.storage.local
	 * Pages are saved on a hostname basis, while options are global.
	 *
	 */

	/*
	 * any time that the page is updated, the new value should be saved
	 */
	var chromeSave = exports.chromeSave = function chromeSave(pages) {
	  var cleaned = cleanPages(pages);
	  chrome.storage.local.get("sites", function saveSchemaChrome(storage) {
	    var host = window.location.hostname;
	    storage.sites[host] = cleaned;
	    chrome.storage.local.set({ "sites": storage.sites });
	  });
	};

	var cleanPages = function cleanPages(pages) {
	  return pages.filter(function (p) {
	    return p !== undefined;
	  }).map(function (page) {
	    return (0, _helpers.clean)(page);
	  });
	};

	/*
	creates an object representing a site and saves it to chrome.storage.local
	the object is:
	    host:
	        site: <hostname>
	        page: <page>

	urls is saved as an object for easier lookup, but converted to an array of the keys before uploading

	If the site object exists for a host, load the saved rules
	*/
	var chromeLoad = exports.chromeLoad = function chromeLoad(callback) {
	  chrome.storage.local.get("sites", function setupHostnameChrome(storage) {
	    var host = window.location.hostname;
	    var pages = storage.sites[host] || [];
	    pages.forEach(function (p) {
	      return (0, _helpers.setupPage)(p);
	    });
	    callback(pages);
	  });
	};

	// takes a data object to be uploaded and passes it to the background page to handle
	function chromeUpload(data) {
	  data.page = JSON.stringify(cleanPage(data.page));
	  chrome.runtime.sendMessage({ type: 'upload', data: data });
	}

	function chromeSync(domain) {
	  chrome.runtime.sendMessage({ type: 'sync', domain: domain }, function (response) {
	    if (response.error) {
	      return;
	    }
	    controller.finishSync(response.pages);
	  });
	}

/***/ }
/******/ ]);