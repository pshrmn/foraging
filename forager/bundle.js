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

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _redux = __webpack_require__(3);

	var _reactRedux = __webpack_require__(15);

	var _Forager = __webpack_require__(23);

	var _Forager2 = _interopRequireDefault(_Forager);

	var _reducers = __webpack_require__(48);

	var _reducers2 = _interopRequireDefault(_reducers);

	var _actions = __webpack_require__(31);

	var _chromeMiddleware = __webpack_require__(54);

	var _chromeMiddleware2 = _interopRequireDefault(_chromeMiddleware);

	var _chrome = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	document.body.classList.add("foraging");

	/*
	 * check if the forager holder exists. If it doesn't, mount the app. If it does,
	 * check if the app is hidden. If it is hidden, show it.
	 */
	if (!document.querySelector(".forager-holder")) {
	  (function () {
	    // create the element that will hold the app
	    var holder = document.createElement("div");
	    holder.classList.add("forager-holder");
	    holder.classList.add("no-select");
	    document.body.appendChild(holder);

	    (0, _chrome.chromeLoad)().then(function (pages) {

	      var initialState = {
	        show: true,
	        page: {
	          pages: [undefined].concat(_toConsumableArray(pages)),
	          pageIndex: 0,
	          elementIndex: 0
	        },
	        frame: {
	          name: "element",
	          data: {}
	        },
	        preview: {
	          visible: false
	        },
	        message: {
	          text: "",
	          wait: undefined
	        }
	      };

	      var store = (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_chromeMiddleware2.default));

	      _reactDom2.default.render(_react2.default.createElement(
	        _reactRedux.Provider,
	        { store: store },
	        _react2.default.createElement(_Forager2.default, null)
	      ), holder);

	      // a function to re-show the app if it has been closed
	      window.restore = function () {
	        if (!store.getState().show) {
	          store.dispatch((0, _actions.openForager)());
	        }
	      };
	    });
	  })();
	} else {
	  document.body.classList.add("foraging");
	  window.restore();
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

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

	var _createStore = __webpack_require__(5);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(10);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(12);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(13);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(14);

	var _compose2 = _interopRequireDefault(_compose);

	var _warning = __webpack_require__(11);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	exports.createStore = _createStore2["default"];
	exports.combineReducers = _combineReducers2["default"];
	exports.bindActionCreators = _bindActionCreators2["default"];
	exports.applyMiddleware = _applyMiddleware2["default"];
	exports.compose = _compose2["default"];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports["default"] = createStore;

	var _isPlainObject = __webpack_require__(6);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};

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
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, initialState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

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
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all states changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
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
	    if (!(0, _isPlainObject2["default"])(action)) {
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

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }

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
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(7),
	    isHostObject = __webpack_require__(8),
	    isObjectLike = __webpack_require__(9);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	module.exports = getPrototype;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports["default"] = combineReducers;

	var _createStore = __webpack_require__(5);

	var _isPlainObject = __webpack_require__(6);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _warning = __webpack_require__(11);

	var _warning2 = _interopRequireDefault(_warning);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!(0, _isPlainObject2["default"])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
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
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);

	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        (0, _warning2["default"])(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that you can use this stack
	    // to find the callsite that caused this warning to fire.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = bindActionCreators;
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

	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;
	exports["default"] = applyMiddleware;

	var _compose = __webpack_require__(14);

	var _compose2 = _interopRequireDefault(_compose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {
	      var store = createStore(reducer, initialState, enhancer);
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
	      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function () {
	    if (funcs.length === 0) {
	      return arguments.length <= 0 ? undefined : arguments[0];
	    }

	    var last = funcs[funcs.length - 1];
	    var rest = funcs.slice(0, -1);

	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.connect = exports.Provider = undefined;

	var _Provider = __webpack_require__(16);

	var _Provider2 = _interopRequireDefault(_Provider);

	var _connect = __webpack_require__(18);

	var _connect2 = _interopRequireDefault(_connect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports.Provider = _Provider2["default"];
	exports.connect = _connect2["default"];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports["default"] = undefined;

	var _react = __webpack_require__(1);

	var _storeShape = __webpack_require__(17);

	var _storeShape2 = _interopRequireDefault(_storeShape);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var didWarnAboutReceivingStore = false;
	function warnAboutReceivingStore() {
	  if (didWarnAboutReceivingStore) {
	    return;
	  }
	  didWarnAboutReceivingStore = true;

	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/rackt/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
	  }
	  /* eslint-disable no-console */
	}

	var Provider = function (_Component) {
	  _inherits(Provider, _Component);

	  Provider.prototype.getChildContext = function getChildContext() {
	    return { store: this.store };
	  };

	  function Provider(props, context) {
	    _classCallCheck(this, Provider);

	    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

	    _this.store = props.store;
	    return _this;
	  }

	  Provider.prototype.render = function render() {
	    var children = this.props.children;

	    return _react.Children.only(children);
	  };

	  return Provider;
	}(_react.Component);

	exports["default"] = Provider;

	if (process.env.NODE_ENV !== 'production') {
	  Provider.prototype.componentWillReceiveProps = function (nextProps) {
	    var store = this.store;
	    var nextStore = nextProps.store;

	    if (store !== nextStore) {
	      warnAboutReceivingStore();
	    }
	  };
	}

	Provider.propTypes = {
	  store: _storeShape2["default"].isRequired,
	  children: _react.PropTypes.element.isRequired
	};
	Provider.childContextTypes = {
	  store: _storeShape2["default"].isRequired
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	exports["default"] = _react.PropTypes.shape({
	  subscribe: _react.PropTypes.func.isRequired,
	  dispatch: _react.PropTypes.func.isRequired,
	  getState: _react.PropTypes.func.isRequired
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;
	exports["default"] = connect;

	var _react = __webpack_require__(1);

	var _storeShape = __webpack_require__(17);

	var _storeShape2 = _interopRequireDefault(_storeShape);

	var _shallowEqual = __webpack_require__(19);

	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

	var _wrapActionCreators = __webpack_require__(20);

	var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);

	var _isPlainObject = __webpack_require__(6);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _hoistNonReactStatics = __webpack_require__(21);

	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

	var _invariant = __webpack_require__(22);

	var _invariant2 = _interopRequireDefault(_invariant);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var defaultMapStateToProps = function defaultMapStateToProps(state) {
	  return {};
	}; // eslint-disable-line no-unused-vars
	var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
	  return { dispatch: dispatch };
	};
	var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
	  return _extends({}, parentProps, stateProps, dispatchProps);
	};

	function getDisplayName(WrappedComponent) {
	  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}

	function checkStateShape(stateProps, dispatch) {
	  (0, _invariant2["default"])((0, _isPlainObject2["default"])(stateProps), '`%sToProps` must return an object. Instead received %s.', dispatch ? 'mapDispatch' : 'mapState', stateProps);
	  return stateProps;
	}

	// Helps track hot reloading.
	var nextVersion = 0;

	function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	  var shouldSubscribe = Boolean(mapStateToProps);
	  var mapState = mapStateToProps || defaultMapStateToProps;
	  var mapDispatch = (0, _isPlainObject2["default"])(mapDispatchToProps) ? (0, _wrapActionCreators2["default"])(mapDispatchToProps) : mapDispatchToProps || defaultMapDispatchToProps;

	  var finalMergeProps = mergeProps || defaultMergeProps;
	  var checkMergedEquals = finalMergeProps !== defaultMergeProps;
	  var _options$pure = options.pure;
	  var pure = _options$pure === undefined ? true : _options$pure;
	  var _options$withRef = options.withRef;
	  var withRef = _options$withRef === undefined ? false : _options$withRef;

	  // Helps track hot reloading.

	  var version = nextVersion++;

	  function computeMergedProps(stateProps, dispatchProps, parentProps) {
	    var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
	    (0, _invariant2["default"])((0, _isPlainObject2["default"])(mergedProps), '`mergeProps` must return an object. Instead received %s.', mergedProps);
	    return mergedProps;
	  }

	  return function wrapWithConnect(WrappedComponent) {
	    var Connect = function (_Component) {
	      _inherits(Connect, _Component);

	      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
	        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
	      };

	      function Connect(props, context) {
	        _classCallCheck(this, Connect);

	        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

	        _this.version = version;
	        _this.store = props.store || context.store;

	        (0, _invariant2["default"])(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + _this.constructor.displayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + _this.constructor.displayName + '".'));

	        var storeState = _this.store.getState();
	        _this.state = { storeState: storeState };
	        _this.clearCache();
	        return _this;
	      }

	      Connect.prototype.computeStateProps = function computeStateProps(store, props) {
	        if (!this.finalMapStateToProps) {
	          return this.configureFinalMapState(store, props);
	        }

	        var state = store.getState();
	        var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);

	        return checkStateShape(stateProps);
	      };

	      Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
	        var mappedState = mapState(store.getState(), props);
	        var isFactory = typeof mappedState === 'function';

	        this.finalMapStateToProps = isFactory ? mappedState : mapState;
	        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;

	        return isFactory ? this.computeStateProps(store, props) : checkStateShape(mappedState);
	      };

	      Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
	        if (!this.finalMapDispatchToProps) {
	          return this.configureFinalMapDispatch(store, props);
	        }

	        var dispatch = store.dispatch;

	        var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);

	        return checkStateShape(dispatchProps, true);
	      };

	      Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
	        var mappedDispatch = mapDispatch(store.dispatch, props);
	        var isFactory = typeof mappedDispatch === 'function';

	        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
	        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;

	        return isFactory ? this.computeDispatchProps(store, props) : checkStateShape(mappedDispatch, true);
	      };

	      Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
	        var nextStateProps = this.computeStateProps(this.store, this.props);
	        if (this.stateProps && (0, _shallowEqual2["default"])(nextStateProps, this.stateProps)) {
	          return false;
	        }

	        this.stateProps = nextStateProps;
	        return true;
	      };

	      Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
	        var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
	        if (this.dispatchProps && (0, _shallowEqual2["default"])(nextDispatchProps, this.dispatchProps)) {
	          return false;
	        }

	        this.dispatchProps = nextDispatchProps;
	        return true;
	      };

	      Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
	        var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
	        if (this.mergedProps && checkMergedEquals && (0, _shallowEqual2["default"])(nextMergedProps, this.mergedProps)) {
	          return false;
	        }

	        this.mergedProps = nextMergedProps;
	        return true;
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

	      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	        if (!pure || !(0, _shallowEqual2["default"])(nextProps, this.props)) {
	          this.haveOwnPropsChanged = true;
	        }
	      };

	      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
	        this.tryUnsubscribe();
	        this.clearCache();
	      };

	      Connect.prototype.clearCache = function clearCache() {
	        this.dispatchProps = null;
	        this.stateProps = null;
	        this.mergedProps = null;
	        this.haveOwnPropsChanged = true;
	        this.hasStoreStateChanged = true;
	        this.renderedElement = null;
	        this.finalMapDispatchToProps = null;
	        this.finalMapStateToProps = null;
	      };

	      Connect.prototype.handleChange = function handleChange() {
	        if (!this.unsubscribe) {
	          return;
	        }

	        var prevStoreState = this.state.storeState;
	        var storeState = this.store.getState();

	        if (!pure || prevStoreState !== storeState) {
	          this.hasStoreStateChanged = true;
	          this.setState({ storeState: storeState });
	        }
	      };

	      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
	        (0, _invariant2["default"])(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');

	        return this.refs.wrappedInstance;
	      };

	      Connect.prototype.render = function render() {
	        var haveOwnPropsChanged = this.haveOwnPropsChanged;
	        var hasStoreStateChanged = this.hasStoreStateChanged;
	        var renderedElement = this.renderedElement;

	        this.haveOwnPropsChanged = false;
	        this.hasStoreStateChanged = false;

	        var shouldUpdateStateProps = true;
	        var shouldUpdateDispatchProps = true;
	        if (pure && renderedElement) {
	          shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
	          shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
	        }

	        var haveStatePropsChanged = false;
	        var haveDispatchPropsChanged = false;
	        if (shouldUpdateStateProps) {
	          haveStatePropsChanged = this.updateStatePropsIfNeeded();
	        }
	        if (shouldUpdateDispatchProps) {
	          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
	        }

	        var haveMergedPropsChanged = true;
	        if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
	          haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
	        } else {
	          haveMergedPropsChanged = false;
	        }

	        if (!haveMergedPropsChanged && renderedElement) {
	          return renderedElement;
	        }

	        if (withRef) {
	          this.renderedElement = (0, _react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
	            ref: 'wrappedInstance'
	          }));
	        } else {
	          this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);
	        }

	        return this.renderedElement;
	      };

	      return Connect;
	    }(_react.Component);

	    Connect.displayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
	    Connect.WrappedComponent = WrappedComponent;
	    Connect.contextTypes = {
	      store: _storeShape2["default"]
	    };
	    Connect.propTypes = {
	      store: _storeShape2["default"]
	    };

	    if (process.env.NODE_ENV !== 'production') {
	      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
	        if (this.version === version) {
	          return;
	        }

	        // We are hot reloading!
	        this.version = version;
	        this.trySubscribe();
	        this.clearCache();
	      };
	    }

	    return (0, _hoistNonReactStatics2["default"])(Connect, WrappedComponent);
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 19 */
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

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports["default"] = wrapActionCreators;

	var _redux = __webpack_require__(3);

	function wrapActionCreators(actionCreators) {
	  return function (dispatch) {
	    return (0, _redux.bindActionCreators)(actionCreators, dispatch);
	  };
	}

/***/ },
/* 21 */
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
	            try {
	                targetComponent[keys[i]] = sourceComponent[keys[i]];
	            } catch (error) {

	            }
	        }
	    }

	    return targetComponent;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
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
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Controls = __webpack_require__(24);

	var _Controls2 = _interopRequireDefault(_Controls);

	var _Frames = __webpack_require__(36);

	var _Frames2 = _interopRequireDefault(_Frames);

	var _PageTree = __webpack_require__(44);

	var _PageTree2 = _interopRequireDefault(_PageTree);

	var _Preview = __webpack_require__(46);

	var _Preview2 = _interopRequireDefault(_Preview);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Forager = _react2.default.createClass({
	  displayName: "Forager",

	  mixins: [_NoSelectMixin2.default],
	  render: function render() {
	    // don't render anything when show=False
	    return !this.props.show ? null : _react2.default.createElement(
	      "div",
	      { id: "forager", ref: "parent" },
	      _react2.default.createElement(_Controls2.default, null),
	      _react2.default.createElement(
	        "div",
	        { className: "workspace" },
	        _react2.default.createElement(_PageTree2.default, null),
	        _react2.default.createElement(_Frames2.default, null)
	      ),
	      _react2.default.createElement(_Preview2.default, null)
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    show: state.show
	  };
	})(Forager);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	var _Buttons = __webpack_require__(26);

	var _Message = __webpack_require__(27);

	var _Message2 = _interopRequireDefault(_Message);

	var _text = __webpack_require__(28);

	var _selection = __webpack_require__(29);

	var _page = __webpack_require__(30);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Controls = _react2.default.createClass({
	  displayName: "Controls",

	  mixins: [_NoSelectMixin2.default],
	  addHandler: function addHandler(event) {
	    event.preventDefault();
	    var _props = this.props;
	    var pages = _props.pages;
	    var showMessage = _props.showMessage;
	    var addPage = _props.addPage;

	    var name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");

	    var existingNames = pages.filter(function (p) {
	      return p !== undefined;
	    }).map(function (p) {
	      return p.name;
	    });

	    if (!(0, _text.validName)(name, existingNames)) {
	      showMessage("Invalid Name: \"" + name + "\"", 5000);
	    } else {

	      var body = (0, _page.createElement)("body");
	      // initial values for the body selector
	      body = Object.assign({}, body, {
	        index: 0,
	        parent: null,
	        elements: [document.body]
	      });

	      addPage({
	        name: name,
	        elements: [body]
	      });
	    }
	  },
	  loadHandler: function loadHandler(event) {
	    this.props.loadPage(parseInt(event.target.value, 10));
	  },
	  closeHandler: function closeHandler(event) {
	    document.body.classList.remove("foraging");
	    this.props.closeForager();
	  },
	  pageControls: function pageControls() {
	    var _props2 = this.props;
	    var pages = _props2.pages;
	    var index = _props2.index;

	    var options = pages.map(function (p, i) {
	      return _react2.default.createElement(
	        "option",
	        { key: i, value: i },
	        p === undefined ? "" : p.name
	      );
	    });
	    return _react2.default.createElement(
	      "select",
	      { value: index,
	        onChange: this.loadHandler },
	      options
	    );
	  },
	  render: function render() {
	    var message = this.props.message;

	    return _react2.default.createElement(
	      "div",
	      { className: "topbar", ref: "parent" },
	      _react2.default.createElement(
	        "div",
	        { className: "controls" },
	        _react2.default.createElement(
	          "div",
	          { className: "page-controls" },
	          "Page ",
	          this.pageControls(),
	          _react2.default.createElement(_Buttons.PosButton, { text: "Add Page",
	            click: this.addHandler })
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "app-controls" },
	          _react2.default.createElement(_Buttons.NeutralButton, { text: String.fromCharCode(215),
	            classes: ["transparent"],
	            click: this.closeHandler })
	        )
	      ),
	      _react2.default.createElement(_Message2.default, message)
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  return {
	    pages: state.page.pages,
	    index: state.page.pageIndex,
	    message: state.message
	  };
	}, {
	  addPage: _actions.addPage,
	  loadPage: _actions.loadPage,
	  closeForager: _actions.closeForager,
	  showMessage: _actions.showMessage
	})(Controls);

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/*
	 * When choosing elements in the page, the selector uses a :not(.no-select)
	 * query to ignore certain elements. To make sure that no elements in the
	 * Forager app are selected, this function selects all child elements in the
	 * app and gives them the "no-select" class. This is done in lieu of manually
	 * setting className="no-select" on all elements (and handling cases where
	 * there are multiple classes on an element). Ideally a :not(.forager, .forager *)
	 * selector would exist, but this will have to do.
	 *
	 * While most state updates are done through the store and thus managing the
	 * "no-select" class can mostly be done through the main app, a few Frames
	 * maintain an internal state and so they need to set the "no-select" class
	 * on their children themselves.
	 *
	 * The main element in a component with the NoSelectMixin applied needs to have
	 * a ref="parent" prop.
	 */
	exports.default = {
	  _makeNoSelect: function _makeNoSelect() {
	    var parent = this.refs.parent;

	    if (parent !== undefined) {
	      parent.classList.add("no-select");
	      Array.from(parent.querySelectorAll("*")).forEach(function (c) {
	        c.classList.add("no-select");
	      });
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    // load the site's pages from chrome.storage.local and set the state
	    this._makeNoSelect();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    this._makeNoSelect();
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Message
	 * -------
	 *
	 * A message is a simple text string that is displayed to the user. An optional
	 * wait prop can also be passed, which indicates how long to wait before fading
	 * out the message.
	 */
	exports.default = _react2.default.createClass({
	  displayName: "Message",

	  getInitialState: function getInitialState() {
	    return {
	      text: "",
	      faded: true
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.setState({
	      text: this.props.text,
	      faded: false
	    });
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    this.setState({
	      text: nextProps.text,
	      faded: false
	    });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "message" },
	      this.state.text
	    );
	  },
	  componentDidMount: function componentDidMount() {
	    this.fade();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    this.fade();
	  },
	  fade: function fade() {
	    var _this = this;

	    clearTimeout(this.timeout);
	    var wait = this.props.wait;

	    if (wait !== undefined && this.state.faded === false) {
	      this.timeout = setTimeout(function () {
	        _this.setState({
	          text: "",
	          faded: true
	        });
	      }, wait);
	    }
	  },
	  timeout: undefined
	});

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var validName = exports.validName = function validName(name) {
	    var takenNames = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	    if (name === null || name === "") {
	        return false;
	    }
	    var badCharacters = /[<>:"\/\\\|\?\*]/;
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
	        return "...";
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
	      return Array.from(elements);
	    }
	  };

	  return Array.from(parents).reduce(function (arr, p) {
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

	  return Array.from(parents).reduce(function (top, p) {
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
	  var classRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
	  var tagAllowed = function tagAllowed(tag) {
	    return !skipTags.some(function (st) {
	      return st === tag;
	    });
	  };

	  var classAllowed = function classAllowed(c) {
	    return !skipClasses.some(function (sc) {
	      return sc === c;
	    }) && classRegex.test(c);
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
	  if (element.id !== "" && validID(element.id)) {
	    pieces.push("#" + element.id);
	  }

	  // classes
	  Array.from(element.classList).forEach(function (c) {
	    if (classAllowed(c)) {
	      pieces.push("." + c);
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
	 * check if all elements matched by the selector are "select" elements
	 */
	var allSelect = exports.allSelect = function allSelect(s) {
	  return s.every(function (ele) {
	    return ele.tagName === "SELECT";
	  });
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.simpleGrow = exports.fullGrow = exports.clean = exports.selectElements = exports.flatten = exports.createElement = undefined;

	var _selection = __webpack_require__(29);

	var createElement = exports.createElement = function createElement(selector) {
	  var type = arguments.length <= 1 || arguments[1] === undefined ? "single" : arguments[1];
	  var value = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var optional = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	  return {
	    selector: selector,
	    spec: {
	      type: type,
	      value: value
	    },
	    childIndices: [],
	    rules: [],
	    optional: optional
	  };
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
	    if (current.parent !== null) {
	      breadth[current.parent].childIndices.push(index);
	    }
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
	 * iterate over the selector elements and add an elements property which is an array
	 * of all elements in the page that the selector matches
	 */
	var selectElements = exports.selectElements = function selectElements(elements) {
	  elements.forEach(function (s) {
	    var parentElements = s.parent === null ? [document] : elements[s.parent].elements;
	    s.elements = (0, _selection.select)(parentElements, s.selector, s.spec);
	  });
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
	    };
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
	    };
	    return {
	      selector: e.selector,
	      spec: Object.assign({}, e.spec),
	      hasRules: e.rules.length > 0,
	      hasChildren: e.childIndices.length > 0,
	      children: [],
	      index: e.index,
	      parent: e.parent,
	      elements: e.elements
	    };
	  });
	  cleanElements.forEach(function (e) {
	    if (e === null) {
	      return null;
	    };
	    if (e.parent === null) {
	      return;
	    }
	    cleanElements[e.parent].children.push(e);
	  });
	  return cleanElements[0];
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _general = __webpack_require__(32);

	Object.keys(_general).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _general[key];
	    }
	  });
	});

	var _frame = __webpack_require__(34);

	Object.keys(_frame).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _frame[key];
	    }
	  });
	});

	var _page = __webpack_require__(35);

	Object.keys(_page).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _page[key];
	    }
	  });
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.showMessage = exports.openForager = exports.closeForager = undefined;

	var _ActionTypes = __webpack_require__(33);

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

	var showMessage = exports.showMessage = function showMessage(text, wait) {
	  return {
	    type: types.SHOW_MESSAGE,
	    text: text,
	    wait: wait
	  };
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* page */
	// set a page as the current page
	var LOAD_PAGE = exports.LOAD_PAGE = "LOAD_PAGE";
	var ADD_PAGE = exports.ADD_PAGE = "ADD_PAGE";
	var REMOVE_PAGE = exports.REMOVE_PAGE = "REMOVE_PAGE";
	var RENAME_PAGE = exports.RENAME_PAGE = "RENAME_PAGE";
	var UPLOAD_PAGE = exports.UPLOAD_PAGE = "UPLOAD_PAGE";
	var SHOW_PREVIEW = exports.SHOW_PREVIEW = "SHOW_PREVIEW";
	var HIDE_PREVIEW = exports.HIDE_PREVIEW = "HIDE_PREVIEW";

	var SELECT_ELEMENT = exports.SELECT_ELEMENT = "SELECT_ELEMENT";
	var SAVE_ELEMENT = exports.SAVE_ELEMENT = "SAVE_ELEMENT";
	var REMOVE_ELEMENT = exports.REMOVE_ELEMENT = "REMOVE_ELEMENT";
	var RENAME_ELEMENT = exports.RENAME_ELEMENT = "RENAME_ELEMENT";
	var TOGGLE_OPTIONAL = exports.TOGGLE_OPTIONAL = "TOGGLE_OPTIONAL";
	var SAVE_RULE = exports.SAVE_RULE = "SAVE_RULE";
	var REMOVE_RULE = exports.REMOVE_RULE = "REMOVE_RULE";

	/* frame */
	// the app is made up of frames,
	// the following action types show specific frames
	var SHOW_ELEMENT_FRAME = exports.SHOW_ELEMENT_FRAME = "SHOW_ELEMENT_FRAME";
	var SHOW_RULE_FRAME = exports.SHOW_RULE_FRAME = "SHOW_RULE_FRAME";
	var SHOW_HTML_FRAME = exports.SHOW_HTML_FRAME = "SHOW_HTML_FRAME";
	var SHOW_PARTS_FRAME = exports.SHOW_PARTS_FRAME = "SHOW_PARTS_FRAME";
	var SHOW_SPEC_FRAME = exports.SHOW_SPEC_FRAME = "SHOW_SPEC_FRAME";

	/* general */
	// open and close the app
	var CLOSE_FORAGER = exports.CLOSE_FORAGER = "CLOSE_FORAGER";
	var OPEN_FORAGER = exports.OPEN_FORAGER = "OPEN_FORAGER";
	// show the user a message (such as an error)
	var SHOW_MESSAGE = exports.SHOW_MESSAGE = "SHOW_MESSAGE";

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.showSpecFrame = exports.showPartsFrame = exports.showHTMLFrame = exports.showRuleFrame = exports.showElementFrame = undefined;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var showElementFrame = exports.showElementFrame = function showElementFrame() {
	  return {
	    type: types.SHOW_ELEMENT_FRAME
	  };
	};

	var showRuleFrame = exports.showRuleFrame = function showRuleFrame(element) {
	  return {
	    type: types.SHOW_RULE_FRAME,
	    element: element
	  };
	};

	var showHTMLFrame = exports.showHTMLFrame = function showHTMLFrame() {
	  return {
	    type: types.SHOW_HTML_FRAME
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

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeRule = exports.saveRule = exports.toggleOptional = exports.removeElement = exports.renameElement = exports.saveElement = exports.selectElement = exports.hidePreview = exports.showPreview = exports.uploadPage = exports.renamePage = exports.removePage = exports.addPage = exports.loadPage = undefined;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

	// rename the currently selected element selector
	var renameElement = exports.renameElement = function renameElement(name) {
	  return {
	    type: types.RENAME_ELEMENT,
	    name: name
	  };
	};

	// remove the currently selected element selector
	var removeElement = exports.removeElement = function removeElement() {
	  return {
	    type: types.REMOVE_ELEMENT
	  };
	};

	// toggle whether the current element selector is optional
	var toggleOptional = exports.toggleOptional = function toggleOptional() {
	  return {
	    type: types.TOGGLE_OPTIONAL
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _ElementFrame = __webpack_require__(37);

	var _ElementFrame2 = _interopRequireDefault(_ElementFrame);

	var _RuleFrame = __webpack_require__(38);

	var _RuleFrame2 = _interopRequireDefault(_RuleFrame);

	var _HTMLFrame = __webpack_require__(41);

	var _HTMLFrame2 = _interopRequireDefault(_HTMLFrame);

	var _PartsFrame = __webpack_require__(42);

	var _PartsFrame2 = _interopRequireDefault(_PartsFrame);

	var _SpecFrame = __webpack_require__(43);

	var _SpecFrame2 = _interopRequireDefault(_SpecFrame);

	var _markup = __webpack_require__(40);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Frames
	 * ------
	 *
	 * The main way for a user to interact with Forager is through the Frames. There
	 * are a number of different frames associated with different states of viewing
	 * and creating elements.
	 *
	 * Through its props, each frame is given any pertinent actions that, relevant
	 * parts of the current element (referred to as the parent when creating a 
	 * new element), and the destructured parts of a data object containing any
	 * extra data for that frame.
	 */
	var Frames = _react2.default.createClass({
	  displayName: "Frames",

	  cssSelector: "current-element",
	  _selectFrame: function _selectFrame() {
	    var frame = this.props.frame;
	    /*
	     * only the necessary actions are sent to the frame components
	     */

	    switch (frame.name) {
	      case "element":
	        return _react2.default.createElement(_ElementFrame2.default, null);
	      case "rule":
	        return _react2.default.createElement(_RuleFrame2.default, null);
	      case "html":
	        return _react2.default.createElement(_HTMLFrame2.default, null);
	      case "parts":
	        return _react2.default.createElement(_PartsFrame2.default, null);
	      case "spec":
	        return _react2.default.createElement(_SpecFrame2.default, null);
	      default:
	        return null;
	    }
	  },
	  componentWillMount: function componentWillMount() {
	    (0, _markup.unhighlight)(this.cssSelector);
	    if (this.props.element) {
	      (0, _markup.highlight)(this.props.element.elements, this.cssSelector);
	    }
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    (0, _markup.unhighlight)(this.cssSelector);
	    if (nextProps.element !== undefined && nextProps.element !== this.props.element) {
	      (0, _markup.highlight)(nextProps.element.elements, this.cssSelector);
	    }
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      { className: "frames" },
	      this._selectFrame()
	    );
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.cssSelector);
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var frame = state.frame;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return {
	    frame: frame,
	    element: element
	  };
	})(Frames);

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	var _actions = __webpack_require__(31);

	var _Buttons = __webpack_require__(26);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ElementFrame = _react2.default.createClass({
	  displayName: "ElementFrame",

	  mixins: [_NoSelectMixin2.default],
	  addChild: function addChild(event) {
	    this.props.showHTMLFrame();
	  },
	  addRule: function addRule(event) {
	    this.props.showRuleFrame();
	  },
	  remove: function remove(event) {
	    var _props = this.props;
	    var element = _props.element;
	    var removeElement = _props.removeElement;

	    if (!confirm("Are you sure you want to delete the element \"" + element.selector + "\"?")) {
	      return;
	    }
	    removeElement();
	  },
	  rename: function rename(event) {
	    var newName = window.prompt("New name to save element's array as:");
	    if (newName === null || newName === "") {
	      return;
	    }
	    var _props2 = this.props;
	    var element = _props2.element;
	    var renameElement = _props2.renameElement;

	    renameElement(newName);
	  },
	  removeRule: function removeRule(index) {
	    var rules = this.props.element.rules;
	    this.props.removeRule(index);
	  },
	  toggleOptional: function toggleOptional(event) {
	    this.props.toggleOptional();
	  },
	  render: function render() {
	    var element = this.props.element;

	    if (element === undefined) {
	      return null;
	    }

	    var selector = element.selector;
	    var rules = element.rules;
	    var spec = element.spec;
	    var optional = element.optional;
	    var type = spec.type;
	    var value = spec.value;

	    var description = "";
	    if (type === "single") {
	      description = "element at index " + value;
	    } else if (type === "all") {
	      description = "all elements, stores them as \"" + value + "\"";
	    }
	    var renameButton = type === "all" ? _react2.default.createElement(_Buttons.NeutralButton, { text: "Rename", click: this.rename }) : null;
	    return _react2.default.createElement(
	      "div",
	      { className: "frame", ref: "parent" },
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
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          null,
	          "Captures: ",
	          description
	        ),
	        _react2.default.createElement(
	          "div",
	          null,
	          "Optional: ",
	          _react2.default.createElement("input", { type: "checkbox", checked: optional, onChange: this.toggleOptional })
	        ),
	        _react2.default.createElement(RuleList, { rules: rules,
	          remove: this.removeRule })
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Buttons.PosButton, { text: "Add Child",
	          click: this.addChild }),
	        _react2.default.createElement(_Buttons.PosButton, { text: "Add Rule",
	          click: this.addRule }),
	        _react2.default.createElement(_Buttons.NegButton, { text: "Remove",
	          title: "Remove Element",
	          click: this.remove }),
	        renameButton
	      )
	    );
	  }
	});

	var RuleList = _react2.default.createClass({
	  displayName: "RuleList",

	  render: function render() {
	    var _props3 = this.props;
	    var rules = _props3.rules;
	    var remove = _props3.remove;

	    if (!rules.length) {
	      return null;
	    }
	    return _react2.default.createElement(
	      "ul",
	      { className: "rules" },
	      rules.map(function (r, i) {
	        return _react2.default.createElement(Rule, _extends({ key: i, index: i, remove: remove }, r));
	      })
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
	    var _props4 = this.props;
	    var name = _props4.name;
	    var attr = _props4.attr;
	    var type = _props4.type;

	    return _react2.default.createElement(
	      "li",
	      { className: "rule" },
	      _react2.default.createElement(
	        "span",
	        { className: "rule-name", title: "name" },
	        name
	      ),
	      _react2.default.createElement(
	        "span",
	        { className: "rule-attr", title: "attribute (or text)" },
	        attr
	      ),
	      _react2.default.createElement(
	        "span",
	        { className: "rule-type", title: "data type" },
	        type
	      ),
	      _react2.default.createElement(_Buttons.NegButton, { text: String.fromCharCode(215),
	        classes: ["transparent"],
	        click: this.handleClick })
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return {
	    element: element
	  };
	}, {
	  showHTMLFrame: _actions.showHTMLFrame,
	  removeElement: _actions.removeElement,
	  renameElement: _actions.renameElement,
	  showRuleFrame: _actions.showRuleFrame,
	  removeRule: _actions.removeRule,
	  toggleOptional: _actions.toggleOptional
	})(ElementFrame);

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Buttons = __webpack_require__(26);

	var _attributes = __webpack_require__(39);

	var _selection = __webpack_require__(29);

	var _text = __webpack_require__(28);

	var _markup = __webpack_require__(40);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var RuleFrame = _react2.default.createClass({
	  displayName: "RuleFrame",

	  highlight: "current-element",
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
	      this.props.saveRule({
	        name: name,
	        type: type,
	        attr: attr
	      });
	    }
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.cancel();
	  },
	  render: function render() {
	    var _this = this;

	    var element = this.props.element;
	    var _state2 = this.state;
	    var name = _state2.name;
	    var type = _state2.type;
	    var attr = _state2.attr;

	    var typeRadios = ["string", "int", "float"].map(function (t, i) {
	      return _react2.default.createElement(
	        "label",
	        { key: i },
	        _react2.default.createElement("input", { type: "radio",
	          name: "rule-type",
	          value: t,
	          checked: t === type,
	          onChange: _this.setType }),
	        _react2.default.createElement(
	          "span",
	          { className: "rule-type" },
	          t
	        )
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
	              value: name,
	              onChange: this.setName })
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          null,
	          "Type: ",
	          typeRadios
	        ),
	        _react2.default.createElement(AttrChoices, { elements: element.elements,
	          attr: attr,
	          setAttr: this.setAttr })
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "buttons" },
	        _react2.default.createElement(_Buttons.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Buttons.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  },
	  componentWillMount: function componentWillMount() {
	    var elements = this.props.element.elements;

	    (0, _markup.highlight)(elements, this.highlight);
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    (0, _markup.unhighlight)(this.highlight);
	    var elements = nextProps.element.elements;

	    (0, _markup.highlight)(elements, this.highlight);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.highlight);
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
	    // JavaScript's modulo of negative numbers stay negative
	    this.setState({
	      index: ((index - 1) % eleCount + eleCount) % eleCount
	    });
	  },
	  selectAttr: function selectAttr(event) {
	    this.props.setAttr(event.target.value);
	  },
	  /*
	   * return an array of radio inputs, one for each attribute. input is checked
	   * if it matches the attr prop
	   */
	  elementAttributes: function elementAttributes(element) {
	    var _this2 = this;

	    var attr = this.props.attr;

	    return (0, _attributes.attributes)(element).map(function (a, i) {
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
	          _react2.default.createElement(
	            "span",
	            { className: "rule-attr" },
	            a.name
	          ),
	          " ",
	          (0, _text.abbreviate)(a.value, 40)
	        )
	      );
	    });
	  },
	  render: function render() {
	    var _props = this.props;
	    var elements = _props.elements;
	    var attr = _props.attr;
	    var index = this.state.index;

	    var eleCount = elements.length;
	    return _react2.default.createElement(
	      "div",
	      { className: "element-attributes" },
	      _react2.default.createElement(
	        "ul",
	        null,
	        this.elementAttributes(elements[index])
	      ),
	      _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(_Buttons.PosButton, { text: "<<",
	          classes: ["transparent"],
	          click: this.prevElement }),
	        " ",
	        index + 1,
	        "/",
	        eleCount,
	        " ",
	        _react2.default.createElement(_Buttons.PosButton, { text: ">>",
	          classes: ["transparent"],
	          click: this.nextElement })
	      )
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return {
	    element: element
	  };
	}, {
	  saveRule: _actions.saveRule,
	  cancel: _actions.showElementFrame
	})(RuleFrame);

/***/ },
/* 39 */
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
	    // don't include current-element class
	    if (name === "class") {
	      value = value.replace("current-element", "").trim();
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

	/*
	 * stripEvents
	 * -----------
	 * If an element has no on* attributes, it is returned. Otherwise, all on* attrs
	 * are removed from the element and a clone is made. The element is replaced in
	 * the dom by the clone and the clone is returned.
	 */
	var stripEvents = exports.stripEvents = function stripEvents(element) {
	  var attrs = Array.from(element.attributes);
	  if (attrs.some(function (a) {
	    return a.name.startsWith("on");
	  })) {
	    attrs.forEach(function (attr) {
	      var name = attr.name;
	      if (name.startsWith("on")) {
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

/***/ },
/* 40 */
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
	  Array.from(document.getElementsByClassName(className)).forEach(function (e) {
	    e.classList.remove(className);
	    e.removeEventListener("mouseover", over, false);
	    e.removeEventListener("mouseout", out, false);
	    e.removeEventListener("click", click, false);
	  });
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Buttons = __webpack_require__(26);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	var _selection = __webpack_require__(29);

	var _attributes = __webpack_require__(39);

	var _markup = __webpack_require__(40);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * HTMLFrame
	 * ------------
	 *
	 * This frame is used select an element within the page. An elements props is
	 * passed to the frame, which is used when the frame is mounted/updated to attach
	 * an event listener all child elements of the elements. When one of those elements
	 * is clicked, an array of css selector options (from the clicked element to the
	 * parent) will be rendered.
	 */
	var HTMLFrame = _react2.default.createClass({
	  displayName: "HTMLFrame",

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
	        return (0, _selection.parts)(ele);
	      });
	      this.setState({
	        // maintain the wildcard selector
	        selectors: [["*"]].concat(selectors),
	        checked: undefined
	      });
	    }
	  },
	  getInitialState: function getInitialState() {
	    var selectors = [["*"]];
	    // when the parentElements are select elements, automatically add "option"
	    // to the selectors array since it cannot be selected
	    if ((0, _selection.allSelect)(this.props.parentElements)) {
	      selectors.push(["option"]);
	    }
	    return {
	      // the index of the selected selector
	      checked: undefined,
	      // the array of possible selectors. each selector is an array of selector parts
	      // ie tag name, class names, and id
	      selectors: selectors,
	      // the number of elements the currently selected selector matches
	      eleCount: 0
	    };
	  },
	  setRadio: function setRadio(i) {
	    var selector = this.state.selectors[i].join("");
	    this.setState({
	      checked: i,
	      eleCount: (0, _selection.count)(this.props.parentElements, selector)
	    });
	  },
	  nextHandler: function nextHandler(event) {
	    event.preventDefault();
	    var _state = this.state;
	    var checked = _state.checked;
	    var selectors = _state.selectors;

	    var selectedSelector = selectors[checked];
	    if (checked !== undefined && selectedSelector !== undefined) {
	      this.props.next(selectedSelector);
	    } else {
	      this.props.message("No selector selected");
	    }
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.cancel();
	  },
	  render: function render() {
	    var _this = this;

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
	          "Select Relevant Element(s)"
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
	        _react2.default.createElement(_Buttons.PosButton, { text: "Next", click: this.nextHandler }),
	        _react2.default.createElement(_Buttons.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  },
	  /*
	   * below here are the functions for interacting with the non-Forager part of the page
	   */
	  componentWillMount: function componentWillMount() {
	    this._setupPageEvents(this.props.parentElements);
	  },
	  componentWillReceiveNewProps: function componentWillReceiveNewProps(nextProps) {
	    this._setupPageEvents(nextProps.parentElements);
	  },
	  /*
	   * when a selector possibility is chosen, add a class to all matching elements
	   * to show what that selector could match
	   */
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    // remove any highlights from a previously selected selector
	    (0, _markup.unhighlight)(this.currentSelector);
	    var clickedSelector = nextState.selectors[nextState.checked];
	    if (clickedSelector !== undefined) {
	      var fullSelector = clickedSelector.join("");
	      var elements = (0, _selection.select)(nextProps.parentElements, fullSelector);
	      (0, _markup.highlight)(elements, this.currentSelector);
	    }
	  },
	  /*
	   * remove any classes and event listeners from the page when the frame is unmounted
	   */
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.currentSelector);
	    (0, _markup.iUnhighlight)(this.potentialSelector, this.events.over, this.events.out, this.boundClick);
	    delete this.boundClick;
	  },
	  /*
	   * attach a class and events to all child elements of the current selector
	   */
	  _setupPageEvents: function _setupPageEvents(parents) {
	    var elements = (0, _selection.select)(parents).map(function (ele) {
	      return (0, _attributes.stripEvents)(ele);
	    });
	    this.boundClick = this.events.click.bind(this);
	    (0, _markup.iHighlight)(elements, this.potentialSelector, this.events.over, this.events.out, this.boundClick);
	  }
	});

	var SelectorRadio = _react2.default.createClass({
	  displayName: "SelectorRadio",

	  mixins: [_NoSelectMixin2.default],
	  setRadio: function setRadio(event) {
	    // do not call event.preventDefault() here or the checked dot will fail to render
	    this.props.select(this.props.index);
	  },
	  render: function render() {
	    var _props = this.props;
	    var selector = _props.selector;
	    var checked = _props.checked;

	    return _react2.default.createElement(
	      "label",
	      { ref: "parent", className: checked ? "selected" : "" },
	      _react2.default.createElement("input", { type: "radio",
	        name: "css-selector",
	        checked: checked,
	        onChange: this.setRadio }),
	      selector.join("")
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;


	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  var parentElements = element.elements || [];
	  return {
	    parentElements: parentElements
	  };
	}, {
	  next: _actions.showPartsFrame,
	  cancel: _actions.showElementFrame,
	  message: _actions.showMessage
	})(HTMLFrame);

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Buttons = __webpack_require__(26);

	var _selection = __webpack_require__(29);

	var _markup = __webpack_require__(40);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PartsFrame = _react2.default.createClass({
	  displayName: "PartsFrame",

	  previewClass: "query-check",
	  getInitialState: function getInitialState() {
	    return {
	      parts: [],
	      eleCount: 0
	    };
	  },
	  nextHandler: function nextHandler(event) {
	    event.preventDefault();
	    var parts = this.state.parts;

	    var selector = this.joinParts(parts);
	    if (selector !== "") {
	      this.props.next(selector);
	    } else {
	      this.props.message("No selectors parts selected");
	    }
	  },
	  cancelHander: function cancelHander(event) {
	    event.preventDefault();
	    this.props.cancel();
	  },
	  toggleRadio: function toggleRadio(event) {
	    // don't prevent default
	    var index = event.target.value;
	    var parts = this.state.parts;
	    parts[index].checked = !parts[index].checked;
	    var fullSelector = this.joinParts(parts);

	    this._setupHighlights(fullSelector);
	    this.setState({
	      parts: parts,
	      eleCount: fullSelector === "" ? 0 : (0, _selection.count)(this.props.parentElements, fullSelector)
	    });
	  },
	  joinParts: function joinParts(parts) {
	    return parts.reduce(function (str, curr) {
	      if (curr.checked) {
	        str += curr.name;
	      }
	      return str;
	    }, "");
	  },
	  componentWillMount: function componentWillMount() {
	    var names = this.props.parts;
	    // by default, each css selector part should be checked
	    var parts = names.map(function (name) {
	      return {
	        name: name,
	        checked: true
	      };
	    });
	    var fullSelector = names.join("");
	    this._setupHighlights(fullSelector);
	    this.setState({
	      parts: parts,
	      eleCount: (0, _selection.count)(this.props.parentElements, fullSelector)
	    });
	  },
	  render: function render() {
	    var _this = this;

	    var _state = this.state;
	    var parts = _state.parts;
	    var eleCount = _state.eleCount;

	    var opts = parts.map(function (part, index) {
	      var name = part.name;
	      var checked = part.checked;

	      return _react2.default.createElement(
	        "label",
	        { key: index,
	          className: checked ? "selected" : "" },
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
	          "Select Relevant Parts of the CSS selector"
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
	        _react2.default.createElement(_Buttons.PosButton, { text: "Next", click: this.nextHandler }),
	        _react2.default.createElement(_Buttons.NegButton, { text: "Cancel", click: this.cancelHander })
	      )
	    );
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.previewClass);
	  },
	  _setupHighlights: function _setupHighlights(cssSelector) {
	    (0, _markup.unhighlight)(this.previewClass);
	    if (cssSelector !== "") {
	      var elements = (0, _selection.select)(this.props.parentElements, cssSelector);
	      (0, _markup.highlight)(elements, this.previewClass);
	    }
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  var parentElements = element.elements || [];
	  return _extends({
	    parentElements: element.elements
	  }, state.frame.data);
	}, {
	  next: _actions.showSpecFrame,
	  cancel: _actions.showElementFrame,
	  message: _actions.showMessage
	})(PartsFrame);

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Buttons = __webpack_require__(26);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	var _page = __webpack_require__(30);

	var _selection = __webpack_require__(29);

	var _markup = __webpack_require__(40);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SpecFrame = _react2.default.createClass({
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
	    var _props = this.props;
	    var css = _props.css;
	    var parent = _props.parent;
	    var message = _props.message;
	    var save = _props.save;
	    // all value must be set

	    if (type === "all" && value === "") {
	      message("Name for type \"all\" elements cannot be empty");
	      return;
	    }
	    var ele = (0, _page.createElement)(css, type, value, optional);
	    ele.elements = (0, _selection.select)(parent.elements, ele.selector, ele.spec);

	    save(ele);
	    return;
	  },
	  cancelHandler: function cancelHandler(event) {
	    event.preventDefault();
	    this.props.cancel();
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
	    var _props2 = this.props;
	    var parent = _props2.parent;
	    var css = _props2.css;

	    var elementCount = (0, _selection.count)(parent.elements, css);
	    return _react2.default.createElement(
	      "div",
	      { className: "frame spec-form" },
	      _react2.default.createElement(
	        "div",
	        { className: "info" },
	        _react2.default.createElement(
	          "div",
	          { className: "line" },
	          "CSS Selector: ",
	          css
	        ),
	        _react2.default.createElement(SpecForm, { count: elementCount,
	          setSpec: this.setSpec }),
	        _react2.default.createElement(
	          "div",
	          { className: "line" },
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
	        _react2.default.createElement(_Buttons.PosButton, { text: "Save", click: this.saveHandler }),
	        _react2.default.createElement(_Buttons.NegButton, { text: "Cancel", click: this.cancelHandler })
	      )
	    );
	  },
	  componentWillMount: function componentWillMount() {
	    var elements = (0, _selection.select)(this.props.parent.elements, this.props.css, {
	      type: this.state.type,
	      value: this.state.value
	    });
	    (0, _markup.highlight)(elements, this.highlight);
	  },
	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    (0, _markup.unhighlight)(this.highlight);
	    var elements = (0, _selection.select)(nextProps.parent.elements, nextProps.css, {
	      type: nextState.type,
	      value: nextState.value
	    });
	    (0, _markup.highlight)(elements, this.highlight);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.highlight);
	  }
	});

	var SpecForm = _react2.default.createClass({
	  displayName: "SpecForm",

	  mixins: [_NoSelectMixin2.default],
	  getInitialState: function getInitialState() {
	    return {
	      type: "single",
	      value: 0
	    };
	  },
	  setType: function setType(event) {
	    var type = event.target.value;
	    var value = void 0;
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

	    var options = Array.from(new Array(this.props.count)).map(function (u, i) {
	      return _react2.default.createElement(
	        "option",
	        { key: i, value: i },
	        i
	      );
	    });
	    return _react2.default.createElement(
	      "select",
	      { value: value,
	        onChange: this.setValue },
	      options
	    );
	  },
	  _allValue: function _allValue() {
	    return _react2.default.createElement("input", { type: "text",
	      value: this.state.value,
	      onChange: this.setValue });
	  },
	  render: function render() {
	    var valueChooser = this.state.type === "single" ? this._singleValue() : this._allValue();
	    return _react2.default.createElement(
	      "div",
	      { ref: "parent" },
	      _react2.default.createElement(
	        "div",
	        { className: "line" },
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
	      _react2.default.createElement(
	        "div",
	        { className: "line" },
	        "Value: ",
	        valueChooser
	      )
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return _extends({
	    parent: element
	  }, state.frame.data);
	}, {
	  save: _actions.saveElement,
	  cancel: _actions.showElementFrame,
	  message: _actions.showMessage
	})(SpecFrame);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _d = __webpack_require__(45);

	var _d2 = _interopRequireDefault(_d);

	var _NoSelectMixin = __webpack_require__(25);

	var _NoSelectMixin2 = _interopRequireDefault(_NoSelectMixin);

	var _Buttons = __webpack_require__(26);

	var _text = __webpack_require__(28);

	var _page = __webpack_require__(30);

	var _markup = __webpack_require__(40);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * A tree rendering of the page, used to show the current page, the current
	 * element, and to select an element (for editing, adding children, or rules)
	 */
	var PageTree = _react2.default.createClass({
	  displayName: "PageTree",

	  mixins: [_NoSelectMixin2.default],
	  getDefaultProps: function getDefaultProps() {
	    return {
	      width: 500,
	      height: 150
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
	    var _props = this.props;
	    var width = _props.width;
	    var height = _props.height;

	    this.setState({
	      tree: _d2.default.layout.tree().size([height, width])
	    });
	  },
	  _makeNodes: function _makeNodes() {
	    var _props2 = this.props;
	    var page = _props2.page;
	    var element = _props2.element;
	    var elementIndex = _props2.elementIndex;
	    var active = _props2.active;
	    var selectElement = _props2.selectElement;
	    var _state = this.state;
	    var tree = _state.tree;
	    var diagonal = _state.diagonal;


	    var clonedPage = (0, _page.simpleGrow)(page.elements);

	    // generate the tree's nodes and links
	    var nodes = tree.nodes(clonedPage);
	    var links = tree.links(nodes);

	    return _react2.default.createElement(
	      "g",
	      null,
	      links.map(function (link, i) {
	        return _react2.default.createElement("path", { key: i,
	          className: "link",
	          d: diagonal(link) });
	      }),
	      nodes.map(function (n, i) {
	        return _react2.default.createElement(Node, _extends({ key: i,
	          current: element !== undefined && n.index === elementIndex,
	          select: selectElement,
	          active: active
	        }, n));
	      })
	    );
	  },
	  render: function render() {
	    var _props3 = this.props;
	    var page = _props3.page;
	    var pageNames = _props3.pageNames;
	    var width = _props3.width;
	    var height = _props3.height;
	    var active = _props3.active;
	    var renamePage = _props3.renamePage;
	    var removePage = _props3.removePage;
	    var uploadPage = _props3.uploadPage;
	    var showPreview = _props3.showPreview;
	    var showMessage = _props3.showMessage;
	    // return an empty .graph when there is no page

	    if (page === undefined) {
	      return _react2.default.createElement("div", { className: "graph" });
	    }
	    /*
	     * The tree layout places the left and right-most nodes directly on the edge,
	     * so additional space needs to be granted so that the labels aren't cut off.
	     * In this case, a left and right margin of 50 is used by expanding with width
	     * by 100 and translating the tree 50 pixels to the right
	     */
	    return _react2.default.createElement(
	      "div",
	      { className: "graph", ref: "parent" },
	      _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "h2",
	          null,
	          page.name
	        ),
	        _react2.default.createElement(PageControls, _extends({ renamePage: renamePage,
	          removePage: removePage,
	          uploadPage: uploadPage,
	          showPreview: showPreview,
	          showMessage: showMessage,
	          pageNames: pageNames
	        }, page))
	      ),
	      _react2.default.createElement(
	        "svg",
	        { width: width + 100,
	          height: height + 50,
	          className: active ? "no-select" : "no-select not-allowed" },
	        _react2.default.createElement(
	          "g",
	          { transform: "translate(50,25)" },
	          this._makeNodes()
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
	    this.props.select(this.props.index);
	  },
	  handleMouseover: function handleMouseover(event) {
	    (0, _markup.highlight)(this.props.elements, this.hoverClass);
	  },
	  handleMouseout: function handleMouseout(event) {
	    (0, _markup.unhighlight)(this.hoverClass);
	  },
	  specText: function specText() {
	    var _props4 = this.props;
	    var selector = _props4.selector;
	    var spec = _props4.spec;

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
	    return (0, _text.abbreviate)(text, 10);
	  },
	  render: function render() {
	    var _props5 = this.props;
	    var current = _props5.current;
	    var hasRules = _props5.hasRules;
	    var children = _props5.children;
	    var active = _props5.active;

	    var empty = !hasRules && !(children && children.length);
	    var text = this.specText();
	    // nodes with rules drawn as rect, nodes with no rules drawn as circles
	    var marker = hasRules ? _react2.default.createElement("rect", { width: "6", height: "6", x: "-3", y: "-3" }) : _react2.default.createElement("circle", { r: "3" });

	    var classNames = ["node"];
	    classNames.push(current ? "current" : null);
	    classNames.push(empty ? "empty" : null);
	    // only apply events when the node is "active"
	    var events = active ? {
	      onClick: this.handleClick,
	      onMouseOver: this.handleMouseover,
	      onMouseOut: this.handleMouseout
	    } : {};
	    return _react2.default.createElement(
	      "g",
	      _extends({ className: classNames.join(" "),
	        transform: "translate(" + this.props.y + "," + this.props.x + ")"
	      }, events),
	      _react2.default.createElement(
	        "text",
	        { y: "-10" },
	        text
	      ),
	      marker
	    );
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    (0, _markup.unhighlight)(this.hoverClass);
	  }
	});

	/*
	 * PageControls
	 * ------------
	 *
	 * Interact with the Page to upload it to a server, preview what the Page would capture
	 * on the current web page, rename the Page, and delete it.
	 */
	var PageControls = _react2.default.createClass({
	  displayName: "PageControls",

	  renameHandler: function renameHandler(event) {
	    event.preventDefault();
	    var name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
	    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
	    if (!(0, _text.validName)(name, this.props.pageNames)) {
	      this.props.showMessage("Invalid Name: \"" + name + "\"", 5000);
	    } else {
	      this.props.renamePage(name);
	    }
	  },
	  deleteHandler: function deleteHandler(event) {
	    event.preventDefault();
	    if (!confirm("Are you sure you want to delete the page \"" + this.props.name + "\"?")) {
	      return;
	    }
	    // report the current page index
	    this.props.removePage();
	  },
	  uploadHandler: function uploadHandler(event) {
	    event.preventDefault();
	    this.props.uploadPage();
	  },
	  previewHandler: function previewHandler(event) {
	    event.preventDefault();
	    this.props.showPreview();
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      null,
	      _react2.default.createElement(_Buttons.PosButton, { click: this.uploadHandler, text: "Upload" }),
	      _react2.default.createElement(_Buttons.PosButton, { click: this.previewHandler, text: "Preview" }),
	      _react2.default.createElement(_Buttons.PosButton, { click: this.renameHandler, text: "Rename" }),
	      _react2.default.createElement(_Buttons.NegButton, { click: this.deleteHandler, text: "Delete" })
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var frame = state.frame;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;
	  var elementIndex = page.elementIndex;

	  var currentPage = pages[pageIndex];
	  var element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
	  return {
	    page: currentPage,
	    pageNames: pages.filter(function (p) {
	      return p !== undefined;
	    }).map(function (p) {
	      return p.name;
	    }),
	    element: element,
	    active: frame.name === "element",
	    elementIndex: elementIndex
	  };
	}, {
	  selectElement: _actions.selectElement,
	  renamePage: _actions.renamePage,
	  removePage: _actions.removePage,
	  uploadPage: _actions.uploadPage,
	  showPreview: _actions.showPreview,
	  showMessage: _actions.showMessage
	})(PageTree);

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(15);

	var _Buttons = __webpack_require__(26);

	var _page = __webpack_require__(30);

	var _preview = __webpack_require__(47);

	var _actions = __webpack_require__(31);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Preview = _react2.default.createClass({
	  displayName: "Preview",

	  closeHandler: function closeHandler(event) {
	    event.preventDefault();
	    this.props.close();
	  },
	  logHandler: function logHandler(event) {
	    event.preventDefault();
	    console.log(JSON.stringify((0, _preview.preview)(this.props.tree)));
	  },
	  prettyLogHandler: function prettyLogHandler(event) {
	    event.preventDefault();
	    console.log(JSON.stringify((0, _preview.preview)(this.props.tree), null, 2));
	  },
	  render: function render() {
	    if (!this.props.visible) {
	      return null;
	    }

	    return _react2.default.createElement(
	      "div",
	      { className: "preview-holder" },
	      _react2.default.createElement("div", { className: "preview-bg", onClick: this.closeHandler }),
	      _react2.default.createElement(
	        "div",
	        { className: "preview" },
	        _react2.default.createElement(
	          "div",
	          null,
	          _react2.default.createElement(_Buttons.PosButton, { text: "Log to Console", click: this.logHandler }),
	          _react2.default.createElement(_Buttons.PosButton, { text: "Pretty Log", click: this.prettyLogHandler }),
	          _react2.default.createElement(_Buttons.NegButton, { text: "Close", click: this.closeHandler })
	        ),
	        _react2.default.createElement(
	          "pre",
	          null,
	          JSON.stringify((0, _preview.preview)(this.props.tree), null, 2)
	        )
	      )
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)(function (state) {
	  var page = state.page;
	  var preview = state.preview;
	  var pages = page.pages;
	  var pageIndex = page.pageIndex;

	  var currentPage = pages[pageIndex];
	  return {
	    visible: preview.visible,
	    // only grow the tree when visible
	    tree: preview.visible ? currentPage === undefined ? {} : (0, _page.fullGrow)(currentPage.elements) : undefined
	  };
	}, {
	  close: _actions.hidePreview
	})(Preview);

/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var preview = exports.preview = function preview(tree) {
	    /*
	     * Given a parent element, get all children that match the selector
	     * Return data based on element's type (index or name)
	     */
	    var getElement = function getElement(element, parent) {
	        var elements = parent.querySelectorAll(element.selector);
	        var _element$spec = element.spec;
	        var type = _element$spec.type;
	        var value = _element$spec.value;

	        switch (type) {
	            case "single":
	                var ele = elements[value];
	                if (!ele) {
	                    return;
	                }
	                return getElementData(element, ele);
	            case "all":
	                var data = Array.from(elements).map(function (ele) {
	                    return getElementData(element, ele);
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
	    var getElementData = function getElementData(element, htmlElement) {
	        var data = getRuleData(element.rules, htmlElement);
	        var childData = getChildData(element.children, htmlElement);
	        if (!childData) {
	            return;
	        }
	        for (var key in childData) {
	            data[key] = childData[key];
	        }
	        return data;
	    };

	    var getChildData = function getChildData(children, htmlElement) {
	        var data = {};
	        children.some(function (child) {
	            var childData = getElement(child, htmlElement);
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
	    var getRuleData = function getRuleData(rules, htmlElement) {
	        var data = {};
	        rules.forEach(function (rule) {
	            var val = void 0;
	            var match = void 0;
	            if (rule.attr === "text") {
	                val = htmlElement.textContent.replace(/\s+/g, " ");
	            } else {
	                var attr = htmlElement.getAttribute(rule.attr);
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

	    return tree === undefined ? "" : getElement(tree, document);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reducer;

	var _show = __webpack_require__(49);

	var _show2 = _interopRequireDefault(_show);

	var _page = __webpack_require__(50);

	var _page2 = _interopRequireDefault(_page);

	var _frame = __webpack_require__(51);

	var _frame2 = _interopRequireDefault(_frame);

	var _preview = __webpack_require__(52);

	var _preview2 = _interopRequireDefault(_preview);

	var _message = __webpack_require__(53);

	var _message2 = _interopRequireDefault(_message);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var initialState = {
	  show: true,
	  page: {
	    pages: [undefined],
	    pageIndex: 0
	  },
	  frame: {
	    name: "element",
	    data: {}
	  },
	  preview: {
	    visible: false
	  },
	  message: {
	    text: "",
	    wait: undefined
	  }
	};

	function reducer() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    default:
	      return {
	        frame: (0, _frame2.default)(state.frame, action),
	        show: (0, _show2.default)(state.show, action),
	        page: (0, _page2.default)(state.page, action),
	        preview: (0, _preview2.default)(state.preview, action),
	        message: (0, _message2.default)(state.message, action)
	      };
	  }
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = show;

	var _ActionTypes = __webpack_require__(33);

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
	  var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
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

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = page;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.LOAD_PAGE:
	      var index = parseInt(action.index, 10);
	      // bad index values will be set to 0
	      if (isNaN(index) || index < 0 || index >= state.pages.length) {
	        index = 0;
	      }
	      return Object.assign({}, state, {
	        pageIndex: index,
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
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
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
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, pages[pageIndex], {
	          name: action.name
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.SELECT_ELEMENT:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;

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
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;

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

	    case types.REMOVE_ELEMENT:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;
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
	      var updatedPage = Object.assign({}, currentPage, {
	        elements: currentPage.elements.map(function (s) {
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
	        elementIndex: 0
	      });

	    case types.RENAME_ELEMENT:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;
	      var name = action.name;

	      // elementIndex will be the parent index

	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // set the new name for the element matching elementIndex
	            // only affects 'all' type elements
	            if (s.index === elementIndex && s.spec.type === "all") {
	              return Object.assign({}, s, {
	                spec: Object.assign({}, s.spec, {
	                  value: name
	                })
	              });
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.TOGGLE_OPTIONAL:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;

	      var currentPage = pages[pageIndex];
	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            if (s.index === elementIndex) {
	              return Object.assign({}, s, {
	                optional: !s.optional
	              });
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.SAVE_RULE:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;
	      var rule = action.rule;


	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // set the new name for the element matching elementIndex
	            if (s.index === elementIndex) {
	              s.rules = s.rules.concat([rule]);
	            }
	            return s;
	          })
	        })], _toConsumableArray(pages.slice(pageIndex + 1)))
	      });

	    case types.REMOVE_RULE:
	      var pages = state.pages;
	      var pageIndex = state.pageIndex;
	      var elementIndex = state.elementIndex;
	      var index = action.index;


	      var currentPage = pages[pageIndex];

	      return Object.assign({}, state, {
	        pages: [].concat(_toConsumableArray(pages.slice(0, pageIndex)), [Object.assign({}, currentPage, {
	          elements: currentPage.elements.map(function (s) {
	            // remove the rule from the current element
	            if (s.index === elementIndex) {
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

	    case types.CLOSE_FORAGER:
	      return Object.assign({}, state, {
	        pageIndex: 0,
	        elementIndex: 0
	      });

	    default:
	      return state;
	  }
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = frame;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/*
	 * frame
	 * -----
	 *
	 * Which frame to show. In the majority of cases, the "element" frame should
	 * be shown.
	 */
	function frame() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.LOAD_PAGE:
	    case types.REMOVE_ELEMENT:
	    case types.SAVE_ELEMENT:
	    case types.SAVE_RULE:
	    case types.REMOVE_RULE:
	    case types.CLOSE_FORAGER:
	    case types.SHOW_ELEMENT_FRAME:
	      return Object.assign({}, state, {
	        name: "element",
	        data: {}
	      });
	    case types.SHOW_RULE_FRAME:
	      return Object.assign({}, state, {
	        name: "rule",
	        data: {}
	      });
	    case types.SHOW_HTML_FRAME:
	      return Object.assign({}, state, {
	        name: "html",
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = preview;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/* 
	 * preview
	 * -------
	 *
	 * preview modal is shown when true, hidden when false
	 */
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
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = message;

	var _ActionTypes = __webpack_require__(33);

	var types = _interopRequireWildcard(_ActionTypes);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/* 
	 * message
	 * -------
	 *
	 * a message to show the user (useful for errors)
	 */
	function message() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case types.SHOW_MESSAGE:
	      return Object.assign({}, {
	        text: action.text,
	        wait: action.wait
	      });
	    default:
	      return {
	        text: "",
	        wait: undefined
	      };
	  }
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ActionTypes = __webpack_require__(33);

	var ActionTypes = _interopRequireWildcard(_ActionTypes);

	var _chrome = __webpack_require__(55);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = function (fullStore) {
	  return function (next) {
	    return function (action) {
	      var current = fullStore.getState();
	      var _current$page = current.page;
	      var pages = _current$page.pages;
	      var pageIndex = _current$page.pageIndex;

	      var page = pages[pageIndex];
	      switch (action.type) {
	        case ActionTypes.RENAME_PAGE:
	          // new name, old name
	          (0, _chrome.chromeRename)(action.name, page.name);
	          return next(action);

	        case ActionTypes.REMOVE_PAGE:
	          (0, _chrome.chromeDelete)(pages[pageIndex].name);
	          return next(action);

	        case ActionTypes.UPLOAD_PAGE:
	          // the upload action doesn't need to hit the reducer
	          (0, _chrome.chromeUpload)(pages[pageIndex]);
	          break;

	        // for chromeSave actions, save after the action has reached the reducer
	        // so that we are saving the updated state of the store
	        case ActionTypes.ADD_PAGE:
	        case ActionTypes.SAVE_ELEMENT:
	        case ActionTypes.REMOVE_ELEMENT:
	        case ActionTypes.RENAME_ELEMENT:
	        case ActionTypes.SAVE_RULE:
	        case ActionTypes.REMOVE_RULE:
	        case ActionTypes.TOGGLE_OPTIONAL:
	          var retVal = next(action);
	          var newState = fullStore.getState();
	          var newPage = newState.page;
	          var newPages = newPage.pages;
	          var newPageIndex = newPage.pageIndex;

	          (0, _chrome.chromeSave)(newPages[newPageIndex]);
	          return retVal;

	        default:
	          return next(action);
	      }
	    };
	  };
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.chromeUpload = exports.chromeLoad = exports.chromeDelete = exports.chromeRename = exports.chromeSave = undefined;

	var _selection = __webpack_require__(29);

	var _page = __webpack_require__(30);

	/*
	 * any time that the page is updated, the stored page should be updated
	 */
	var chromeSave = exports.chromeSave = function chromeSave(page) {
	  if (page === undefined) {
	    return;
	  }
	  var cleaned = (0, _page.clean)(page);
	  chrome.storage.local.get("sites", function saveSchemaChrome(storage) {
	    var host = window.location.hostname;
	    storage.sites[host] = storage.sites[host] || {};
	    storage.sites[host][cleaned.name] = cleaned;
	    chrome.storage.local.set({ "sites": storage.sites });
	  });
	};

	var chromeRename = exports.chromeRename = function chromeRename(newName, oldName) {
	  chrome.storage.local.get("sites", function saveSchemaChrome(storage) {
	    var host = window.location.hostname;
	    var page = storage.sites[host][oldName];
	    page.name = newName;
	    storage.sites[host][newName] = page;
	    delete storage.sites[host][oldName];
	    chrome.storage.local.set({ "sites": storage.sites });
	  });
	};

	/*
	 * remove the page with the given name from storage
	 */
	var chromeDelete = exports.chromeDelete = function chromeDelete(name) {
	  if (name === undefined) {
	    return;
	  }
	  chrome.storage.local.get("sites", function saveSchemaChrome(storage) {
	    var host = window.location.hostname;
	    delete storage.sites[host][name];
	    chrome.storage.local.set({ "sites": storage.sites });
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
	var chromeLoad = exports.chromeLoad = function chromeLoad() {
	  return new Promise(function (resolve, reject) {
	    chrome.storage.local.get("sites", function setupHostnameChrome(storage) {
	      var host = window.location.hostname;
	      var current = storage.sites[host] || {};
	      var pages = Object.keys(current).map(function (key) {
	        return current[key];
	      }).filter(function (p) {
	        return p !== null;
	      }).map(function (p) {
	        return {
	          name: p.name,
	          elements: (0, _page.flatten)(p.element)
	        };
	      });
	      pages.forEach(function (p) {
	        return (0, _page.selectElements)(p.elements);
	      });
	      resolve(pages);
	    });
	  });
	};

	/*
	 * formats the page and sends it to the background script, which will upload it to the server
	 */
	var chromeUpload = exports.chromeUpload = function chromeUpload(page) {
	  if (page === undefined) {
	    return;
	  }
	  chrome.runtime.sendMessage({
	    type: "upload",
	    data: {
	      name: page.name,
	      site: window.location.hostname,
	      page: JSON.stringify((0, _page.clean)(page))
	    }
	  });
	};

/***/ }
/******/ ]);