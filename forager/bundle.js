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

	var _reducers = __webpack_require__(36);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _ActionTypes = __webpack_require__(24);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * check if the forager holder exists. If it doesn't, mount the app. If it does,
	 * check if the app is hidden. If it is hidden, show it.
	 */
	var holder = document.querySelector(".forager-holder");
	if (!holder) {
	  var _store = (0, _redux.createStore)(_reducers2.default, {
	    show: true,
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
	  });
	  // create an element to attach Forager to
	  var _holder = document.createElement("div");
	  _holder.classList.add("forager-holder");
	  document.body.appendChild(_holder);

	  (0, _reactDom.render)(_react2.default.createElement(
	    _reactRedux.Provider,
	    { store: _store },
	    _react2.default.createElement(_Forager2.default, null)
	  ), _holder);

	  window.store = _store;
	} else {
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

	var _Frames = __webpack_require__(29);

	var _Frames2 = _interopRequireDefault(_Frames);

	var _Graph = __webpack_require__(34);

	var _Graph2 = _interopRequireDefault(_Graph);

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

	    var page = pages[pageIndex];
	    var actions = (0, _redux.bindActionCreators)(ForagerActions, dispatch);
	    var classNames = ["forager", "no-select"];
	    if (!show) {
	      classNames.push("hidden");
	    }
	    return _react2.default.createElement(
	      "div",
	      { className: classNames.join(" "), ref: "app" },
	      _react2.default.createElement(_Controls2.default, { pages: pages,
	        index: pageIndex,
	        actions: actions }),
	      _react2.default.createElement(
	        "div",
	        { className: "workspace" },
	        _react2.default.createElement(_Frames2.default, { page: page,
	          actions: actions }),
	        _react2.default.createElement(_Graph2.default, { page: page,
	          actions: actions })
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

	function mapStateToProps(state) {
	  return {
	    show: state.show,
	    pages: state.pages,
	    pageIndex: state.pageIndex
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
	exports.closeForager = exports.showRuleFrame = exports.showSelectorFrame = exports.renamePage = exports.removePage = exports.addPage = exports.loadPage = undefined;

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

	/*
	 * SELECTOR ACTIONS
	 */

	var showSelectorFrame = exports.showSelectorFrame = function showSelectorFrame() {
	  return {
	    type: types.SHOW_SELECTOR_FRAME
	  };
	};

	var showRuleFrame = exports.showRuleFrame = function showRuleFrame() {
	  return {
	    type: types.SHOW_RULE_FRAME
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

	var SHOW_SELECTOR_FRAME = exports.SHOW_SELECTOR_FRAME = "SHOW_SELECTOR_FRAME";
	var SHOW_RULE_FRAME = exports.SHOW_RULE_FRAME = "SHOW_RULE_FRAME";

	var CLOSE_FORAGER = exports.CLOSE_FORAGER = "CLOSE_FORAGER";
	var SHOW_FORAGER = exports.SHOW_FORAGER = "SHOW_FORAGER";

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

	var _page = __webpack_require__(28);

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
	      var newPage = (0, _page.createPage)(name);
	      this.props.actions.addPage(newPage);
	    }
	  },
	  renameHandler: function renameHandler(event) {
	    event.preventDefault();
	    // don't do anything for the undefined option
	    if (curr === undefined) {
	      return;
	    }
	    var curr = this.props.pages[this.props.index];
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
	    console.error("not yet implemented");
	  },
	  previewHandler: function previewHandler(event) {
	    event.preventDefault();
	    console.error("not yet implemented");
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

	  handle: function handle(event) {
	    // do nothing
	    event.preventDefault();
	    console.error("not yet implemented");
	  },
	  handleClose: function handleClose(event) {
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
	      _react2.default.createElement(_Inputs.NeutralButton, { click: this.handleClose, text: String.fromCharCode(215) })
	    );
	  }
	});

/***/ },
/* 26 */
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
/* 27 */
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
/* 28 */
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _ViewFrame = __webpack_require__(30);

	var _ViewFrame2 = _interopRequireDefault(_ViewFrame);

	var _ElementFrame = __webpack_require__(31);

	var _ElementFrame2 = _interopRequireDefault(_ElementFrame);

	var _SelectorFrame = __webpack_require__(32);

	var _SelectorFrame2 = _interopRequireDefault(_SelectorFrame);

	var _SpecFrame = __webpack_require__(33);

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
/* 30 */
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _d = __webpack_require__(35);

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
/* 35 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(24);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var initialState = {
	  show: true,
	  pages: [undefined],
	  pageIndex: 0
	};

	/*
	 * Forager reducer
	 * One big function for the time being
	 */
	function reducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.LOAD_PAGE:
	      /*
	       * if the index is out of the bounds of state.pages, set to 0
	       */
	      var max = state.pages.length;
	      var index = action.index;
	      if (index < 0 || index >= max) {
	        index = 0;
	      }
	      return Object.assign({}, state, {
	        pageIndex: index
	      });
	    case types.ADD_PAGE:
	      var pages = state.pages;
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages), [action.page]),
	        pageIndex: pages.length - 1
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
	    case types.CLOSE_FORAGER:
	      return Object.assign({}, state, {
	        show: false
	      });
	    case types.SHOW_FORAGER:
	      return Object.assign({}, state, {
	        show: true
	      });
	    default:
	      return state;
	  }
	}

	exports.default = reducer;

/***/ }
/******/ ]);