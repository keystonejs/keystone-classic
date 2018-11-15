// 4.8.5 (2018-10-30)
(function () {
(function () {
    'use strict';

    var noop = function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
    };
    var compose = function (fa, fb) {
      return function () {
        var x = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          x[_i] = arguments[_i];
        }
        return fa(fb.apply(null, arguments));
      };
    };
    var constant = function (value) {
      return function () {
        return value;
      };
    };
    var identity = function (x) {
      return x;
    };
    var curry = function (f) {
      var x = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
      }
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++)
        args[i - 1] = arguments[i];
      return function () {
        var x = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          x[_i] = arguments[_i];
        }
        var newArgs = new Array(arguments.length);
        for (var j = 0; j < newArgs.length; j++)
          newArgs[j] = arguments[j];
        var all = args.concat(newArgs);
        return f.apply(null, all);
      };
    };
    var die = function (msg) {
      return function () {
        throw new Error(msg);
      };
    };
    var never = constant(false);
    var always = constant(true);

    var never$1 = never;
    var always$1 = always;
    var none = function () {
      return NONE;
    };
    var NONE = function () {
      var eq = function (o) {
        return o.isNone();
      };
      var call$$1 = function (thunk) {
        return thunk();
      };
      var id = function (n) {
        return n;
      };
      var noop$$1 = function () {
      };
      var nul = function () {
        return null;
      };
      var undef = function () {
        return undefined;
      };
      var me = {
        fold: function (n, s) {
          return n();
        },
        is: never$1,
        isSome: never$1,
        isNone: always$1,
        getOr: id,
        getOrThunk: call$$1,
        getOrDie: function (msg) {
          throw new Error(msg || 'error: getOrDie called on none.');
        },
        getOrNull: nul,
        getOrUndefined: undef,
        or: id,
        orThunk: call$$1,
        map: none,
        ap: none,
        each: noop$$1,
        bind: none,
        flatten: none,
        exists: never$1,
        forall: always$1,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray: function () {
          return [];
        },
        toString: constant('none()')
      };
      if (Object.freeze)
        Object.freeze(me);
      return me;
    }();
    var some = function (a) {
      var constant_a = function () {
        return a;
      };
      var self = function () {
        return me;
      };
      var map = function (f) {
        return some(f(a));
      };
      var bind = function (f) {
        return f(a);
      };
      var me = {
        fold: function (n, s) {
          return s(a);
        },
        is: function (v) {
          return a === v;
        },
        isSome: always$1,
        isNone: never$1,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        getOrNull: constant_a,
        getOrUndefined: constant_a,
        or: self,
        orThunk: self,
        map: map,
        ap: function (optfab) {
          return optfab.fold(none, function (fab) {
            return some(fab(a));
          });
        },
        each: function (f) {
          f(a);
        },
        bind: bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter: function (f) {
          return f(a) ? me : NONE;
        },
        equals: function (o) {
          return o.is(a);
        },
        equals_: function (o, elementEq) {
          return o.fold(never$1, function (b) {
            return elementEq(a, b);
          });
        },
        toArray: function () {
          return [a];
        },
        toString: function () {
          return 'some(' + a + ')';
        }
      };
      return me;
    };
    var from = function (value) {
      return value === null || value === undefined ? NONE : some(value);
    };
    var Option = {
      some: some,
      none: none,
      from: from
    };

    var typeOf = function (x) {
      if (x === null)
        return 'null';
      var t = typeof x;
      if (t === 'object' && Array.prototype.isPrototypeOf(x))
        return 'array';
      if (t === 'object' && String.prototype.isPrototypeOf(x))
        return 'string';
      return t;
    };
    var isType = function (type) {
      return function (value) {
        return typeOf(value) === type;
      };
    };
    var isString = isType('string');
    var isObject = isType('object');
    var isArray = isType('array');
    var isNull = isType('null');
    var isBoolean = isType('boolean');
    var isFunction = isType('function');
    var isNumber = isType('number');

    var rawIndexOf = function () {
      var pIndexOf = Array.prototype.indexOf;
      var fastIndex = function (xs, x) {
        return pIndexOf.call(xs, x);
      };
      var slowIndex = function (xs, x) {
        return slowIndexOf(xs, x);
      };
      return pIndexOf === undefined ? slowIndex : fastIndex;
    }();
    var indexOf = function (xs, x) {
      var r = rawIndexOf(xs, x);
      return r === -1 ? Option.none() : Option.some(r);
    };
    var contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1;
    };
    var exists = function (xs, pred) {
      return findIndex(xs, pred).isSome();
    };
    var map = function (xs, f) {
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i, xs);
      }
      return r;
    };
    var each = function (xs, f) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i, xs);
      }
    };
    var eachr = function (xs, f) {
      for (var i = xs.length - 1; i >= 0; i--) {
        var x = xs[i];
        f(x, i, xs);
      }
    };
    var partition = function (xs, pred) {
      var pass = [];
      var fail = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var arr = pred(x, i, xs) ? pass : fail;
        arr.push(x);
      }
      return {
        pass: pass,
        fail: fail
      };
    };
    var filter = function (xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          r.push(x);
        }
      }
      return r;
    };
    var foldr = function (xs, f, acc) {
      eachr(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };
    var foldl = function (xs, f, acc) {
      each(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };
    var find = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(x);
        }
      }
      return Option.none();
    };
    var findIndex = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(i);
        }
      }
      return Option.none();
    };
    var slowIndexOf = function (xs, x) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    };
    var push = Array.prototype.push;
    var flatten = function (xs) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (!Array.prototype.isPrototypeOf(xs[i]))
          throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
        push.apply(r, xs[i]);
      }
      return r;
    };
    var bind = function (xs, f) {
      var output = map(xs, f);
      return flatten(output);
    };
    var forall = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        var x = xs[i];
        if (pred(x, i, xs) !== true) {
          return false;
        }
      }
      return true;
    };
    var slice = Array.prototype.slice;
    var reverse = function (xs) {
      var r = slice.call(xs, 0);
      r.reverse();
      return r;
    };
    var difference = function (a1, a2) {
      return filter(a1, function (x) {
        return !contains(a2, x);
      });
    };
    var mapToObject = function (xs, f) {
      var r = {};
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };
    var sort = function (xs, comparator) {
      var copy = slice.call(xs, 0);
      copy.sort(comparator);
      return copy;
    };
    var head = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[0]);
    };
    var last = function (xs) {
      return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1]);
    };
    var from$1 = isFunction(Array.from) ? Array.from : function (x) {
      return slice.call(x);
    };

    var Global = typeof window !== 'undefined' ? window : Function('return this;')();

    var path = function (parts, scope) {
      var o = scope !== undefined && scope !== null ? scope : Global;
      for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
        o = o[parts[i]];
      return o;
    };
    var resolve = function (p, scope) {
      var parts = p.split('.');
      return path(parts, scope);
    };

    var unsafe = function (name, scope) {
      return resolve(name, scope);
    };
    var getOrDie = function (name, scope) {
      var actual = unsafe(name, scope);
      if (actual === undefined || actual === null)
        throw name + ' not available on this browser';
      return actual;
    };
    var Global$1 = { getOrDie: getOrDie };

    var url = function () {
      return Global$1.getOrDie('URL');
    };
    var createObjectURL = function (blob) {
      return url().createObjectURL(blob);
    };
    var revokeObjectURL = function (u) {
      url().revokeObjectURL(u);
    };
    var URL = {
      createObjectURL: createObjectURL,
      revokeObjectURL: revokeObjectURL
    };

    var nav = navigator, userAgent = nav.userAgent;
    var opera, webkit, ie, ie11, ie12, gecko, mac, iDevice, android, fileApi, phone, tablet, windowsPhone;
    var matchMediaQuery = function (query) {
      return 'matchMedia' in window ? matchMedia(query).matches : false;
    };
    opera = false;
    android = /Android/.test(userAgent);
    webkit = /WebKit/.test(userAgent);
    ie = !webkit && !opera && /MSIE/gi.test(userAgent) && /Explorer/gi.test(nav.appName);
    ie = ie && /MSIE (\w+)\./.exec(userAgent)[1];
    ie11 = userAgent.indexOf('Trident/') !== -1 && (userAgent.indexOf('rv:') !== -1 || nav.appName.indexOf('Netscape') !== -1) ? 11 : false;
    ie12 = userAgent.indexOf('Edge/') !== -1 && !ie && !ie11 ? 12 : false;
    ie = ie || ie11 || ie12;
    gecko = !webkit && !ie11 && /Gecko/.test(userAgent);
    mac = userAgent.indexOf('Mac') !== -1;
    iDevice = /(iPad|iPhone)/.test(userAgent);
    fileApi = 'FormData' in window && 'FileReader' in window && 'URL' in window && !!URL.createObjectURL;
    phone = matchMediaQuery('only screen and (max-device-width: 480px)') && (android || iDevice);
    tablet = matchMediaQuery('only screen and (min-width: 800px)') && (android || iDevice);
    windowsPhone = userAgent.indexOf('Windows Phone') !== -1;
    if (ie12) {
      webkit = false;
    }
    var contentEditable = !iDevice || fileApi || parseInt(userAgent.match(/AppleWebKit\/(\d*)/)[1], 10) >= 534;
    var Env = {
      opera: opera,
      webkit: webkit,
      ie: ie,
      gecko: gecko,
      mac: mac,
      iOS: iDevice,
      android: android,
      contentEditable: contentEditable,
      transparentSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      caretAfter: ie !== 8,
      range: window.getSelection && 'Range' in window,
      documentMode: ie && !ie12 ? document.documentMode || 7 : 10,
      fileApi: fileApi,
      ceFalse: ie === false || ie > 8,
      cacheSuffix: null,
      container: null,
      overrideViewPort: null,
      experimentalShadowDom: false,
      canHaveCSP: ie === false || ie > 11,
      desktop: !phone && !tablet,
      windowsPhone: windowsPhone
    };

    var promise = function () {
      function bind(fn, thisArg) {
        return function () {
          fn.apply(thisArg, arguments);
        };
      }
      var isArray = Array.isArray || function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
      };
      var Promise = function (fn) {
        if (typeof this !== 'object') {
          throw new TypeError('Promises must be constructed via new');
        }
        if (typeof fn !== 'function') {
          throw new TypeError('not a function');
        }
        this._state = null;
        this._value = null;
        this._deferreds = [];
        doResolve(fn, bind(resolve, this), bind(reject, this));
      };
      var asap = Promise.immediateFn || typeof setImmediate === 'function' && setImmediate || function (fn) {
        setTimeout(fn, 1);
      };
      function handle(deferred) {
        var me = this;
        if (this._state === null) {
          this._deferreds.push(deferred);
          return;
        }
        asap(function () {
          var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
          if (cb === null) {
            (me._state ? deferred.resolve : deferred.reject)(me._value);
            return;
          }
          var ret;
          try {
            ret = cb(me._value);
          } catch (e) {
            deferred.reject(e);
            return;
          }
          deferred.resolve(ret);
        });
      }
      function resolve(newValue) {
        try {
          if (newValue === this) {
            throw new TypeError('A promise cannot be resolved with itself.');
          }
          if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
              doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
              return;
            }
          }
          this._state = true;
          this._value = newValue;
          finale.call(this);
        } catch (e) {
          reject.call(this, e);
        }
      }
      function reject(newValue) {
        this._state = false;
        this._value = newValue;
        finale.call(this);
      }
      function finale() {
        for (var i = 0, len = this._deferreds.length; i < len; i++) {
          handle.call(this, this._deferreds[i]);
        }
        this._deferreds = null;
      }
      function Handler(onFulfilled, onRejected, resolve, reject) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
      }
      function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
          fn(function (value) {
            if (done) {
              return;
            }
            done = true;
            onFulfilled(value);
          }, function (reason) {
            if (done) {
              return;
            }
            done = true;
            onRejected(reason);
          });
        } catch (ex) {
          if (done) {
            return;
          }
          done = true;
          onRejected(ex);
        }
      }
      Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
      };
      Promise.prototype.then = function (onFulfilled, onRejected) {
        var me = this;
        return new Promise(function (resolve, reject) {
          handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
        });
      };
      Promise.all = function () {
        var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
        return new Promise(function (resolve, reject) {
          if (args.length === 0) {
            return resolve([]);
          }
          var remaining = args.length;
          function res(i, val) {
            try {
              if (val && (typeof val === 'object' || typeof val === 'function')) {
                var then = val.then;
                if (typeof then === 'function') {
                  then.call(val, function (val) {
                    res(i, val);
                  }, reject);
                  return;
                }
              }
              args[i] = val;
              if (--remaining === 0) {
                resolve(args);
              }
            } catch (ex) {
              reject(ex);
            }
          }
          for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
          }
        });
      };
      Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) {
          return value;
        }
        return new Promise(function (resolve) {
          resolve(value);
        });
      };
      Promise.reject = function (value) {
        return new Promise(function (resolve, reject) {
          reject(value);
        });
      };
      Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
          for (var i = 0, len = values.length; i < len; i++) {
            values[i].then(resolve, reject);
          }
        });
      };
      return Promise;
    };
    var promiseObj = window.Promise ? window.Promise : promise();

    var requestAnimationFramePromise;
    var requestAnimationFrame$$1 = function (callback, element) {
      var i, requestAnimationFrameFunc = window.requestAnimationFrame;
      var vendors = [
        'ms',
        'moz',
        'webkit'
      ];
      var featurefill = function (callback) {
        window.setTimeout(callback, 0);
      };
      for (i = 0; i < vendors.length && !requestAnimationFrameFunc; i++) {
        requestAnimationFrameFunc = window[vendors[i] + 'RequestAnimationFrame'];
      }
      if (!requestAnimationFrameFunc) {
        requestAnimationFrameFunc = featurefill;
      }
      requestAnimationFrameFunc(callback, element);
    };
    var wrappedSetTimeout = function (callback, time) {
      if (typeof time !== 'number') {
        time = 0;
      }
      return setTimeout(callback, time);
    };
    var wrappedSetInterval = function (callback, time) {
      if (typeof time !== 'number') {
        time = 1;
      }
      return setInterval(callback, time);
    };
    var wrappedClearTimeout = function (id) {
      return clearTimeout(id);
    };
    var wrappedClearInterval = function (id) {
      return clearInterval(id);
    };
    var debounce = function (callback, time) {
      var timer, func;
      func = function () {
        var args = arguments;
        clearTimeout(timer);
        timer = wrappedSetTimeout(function () {
          callback.apply(this, args);
        }, time);
      };
      func.stop = function () {
        clearTimeout(timer);
      };
      return func;
    };
    var Delay = {
      requestAnimationFrame: function (callback, element) {
        if (requestAnimationFramePromise) {
          requestAnimationFramePromise.then(callback);
          return;
        }
        requestAnimationFramePromise = new promiseObj(function (resolve) {
          if (!element) {
            element = document.body;
          }
          requestAnimationFrame$$1(resolve, element);
        }).then(callback);
      },
      setTimeout: wrappedSetTimeout,
      setInterval: wrappedSetInterval,
      setEditorTimeout: function (editor, callback, time) {
        return wrappedSetTimeout(function () {
          if (!editor.removed) {
            callback();
          }
        }, time);
      },
      setEditorInterval: function (editor, callback, time) {
        var timer;
        timer = wrappedSetInterval(function () {
          if (!editor.removed) {
            callback();
          } else {
            clearInterval(timer);
          }
        }, time);
        return timer;
      },
      debounce: debounce,
      throttle: debounce,
      clearInterval: wrappedClearInterval,
      clearTimeout: wrappedClearTimeout
    };

    var eventExpandoPrefix = 'mce-data-';
    var mouseEventRe = /^(?:mouse|contextmenu)|click/;
    var deprecated = {
      keyLocation: 1,
      layerX: 1,
      layerY: 1,
      returnValue: 1,
      webkitMovementX: 1,
      webkitMovementY: 1,
      keyIdentifier: 1
    };
    var hasIsDefaultPrevented = function (event$$1) {
      return event$$1.isDefaultPrevented === returnTrue || event$$1.isDefaultPrevented === returnFalse;
    };
    var returnFalse = function () {
      return false;
    };
    var returnTrue = function () {
      return true;
    };
    var addEvent = function (target, name$$1, callback, capture) {
      if (target.addEventListener) {
        target.addEventListener(name$$1, callback, capture || false);
      } else if (target.attachEvent) {
        target.attachEvent('on' + name$$1, callback);
      }
    };
    var removeEvent = function (target, name$$1, callback, capture) {
      if (target.removeEventListener) {
        target.removeEventListener(name$$1, callback, capture || false);
      } else if (target.detachEvent) {
        target.detachEvent('on' + name$$1, callback);
      }
    };
    var getTargetFromShadowDom = function (event$$1, defaultTarget) {
      if (event$$1.composedPath) {
        var composedPath = event$$1.composedPath();
        if (composedPath && composedPath.length > 0) {
          return composedPath[0];
        }
      }
      return defaultTarget;
    };
    var fix = function (originalEvent, data) {
      var name$$1;
      var event$$1 = data || {};
      for (name$$1 in originalEvent) {
        if (!deprecated[name$$1]) {
          event$$1[name$$1] = originalEvent[name$$1];
        }
      }
      if (!event$$1.target) {
        event$$1.target = event$$1.srcElement || document;
      }
      if (Env.experimentalShadowDom) {
        event$$1.target = getTargetFromShadowDom(originalEvent, event$$1.target);
      }
      if (originalEvent && mouseEventRe.test(originalEvent.type) && originalEvent.pageX === undefined && originalEvent.clientX !== undefined) {
        var eventDoc = event$$1.target.ownerDocument || document;
        var doc = eventDoc.documentElement;
        var body = eventDoc.body;
        event$$1.pageX = originalEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event$$1.pageY = originalEvent.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      }
      event$$1.preventDefault = function () {
        event$$1.isDefaultPrevented = returnTrue;
        if (originalEvent) {
          if (originalEvent.preventDefault) {
            originalEvent.preventDefault();
          } else {
            originalEvent.returnValue = false;
          }
        }
      };
      event$$1.stopPropagation = function () {
        event$$1.isPropagationStopped = returnTrue;
        if (originalEvent) {
          if (originalEvent.stopPropagation) {
            originalEvent.stopPropagation();
          } else {
            originalEvent.cancelBubble = true;
          }
        }
      };
      event$$1.stopImmediatePropagation = function () {
        event$$1.isImmediatePropagationStopped = returnTrue;
        event$$1.stopPropagation();
      };
      if (hasIsDefaultPrevented(event$$1) === false) {
        event$$1.isDefaultPrevented = returnFalse;
        event$$1.isPropagationStopped = returnFalse;
        event$$1.isImmediatePropagationStopped = returnFalse;
      }
      if (typeof event$$1.metaKey === 'undefined') {
        event$$1.metaKey = false;
      }
      return event$$1;
    };
    var bindOnReady = function (win, callback, eventUtils) {
      var doc = win.document, event$$1 = { type: 'ready' };
      if (eventUtils.domLoaded) {
        callback(event$$1);
        return;
      }
      var isDocReady = function () {
        return doc.readyState === 'complete' || doc.readyState === 'interactive' && doc.body;
      };
      var readyHandler = function () {
        if (!eventUtils.domLoaded) {
          eventUtils.domLoaded = true;
          callback(event$$1);
        }
      };
      var waitForDomLoaded = function () {
        if (isDocReady()) {
          removeEvent(doc, 'readystatechange', waitForDomLoaded);
          readyHandler();
        }
      };
      var tryScroll = function () {
        try {
          doc.documentElement.doScroll('left');
        } catch (ex) {
          Delay.setTimeout(tryScroll);
          return;
        }
        readyHandler();
      };
      if (doc.addEventListener && !(Env.ie && Env.ie < 11)) {
        if (isDocReady()) {
          readyHandler();
        } else {
          addEvent(win, 'DOMContentLoaded', readyHandler);
        }
      } else {
        addEvent(doc, 'readystatechange', waitForDomLoaded);
        if (doc.documentElement.doScroll && win.self === win.top) {
          tryScroll();
        }
      }
      addEvent(win, 'load', readyHandler);
    };
    var EventUtils = function () {
      var self$$1 = this;
      var events = {}, count, expando, hasFocusIn, hasMouseEnterLeave, mouseEnterLeave;
      expando = eventExpandoPrefix + (+new Date()).toString(32);
      hasMouseEnterLeave = 'onmouseenter' in document.documentElement;
      hasFocusIn = 'onfocusin' in document.documentElement;
      mouseEnterLeave = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
      };
      count = 1;
      self$$1.domLoaded = false;
      self$$1.events = events;
      var executeHandlers = function (evt, id) {
        var callbackList, i, l, callback;
        var container = events[id];
        callbackList = container && container[evt.type];
        if (callbackList) {
          for (i = 0, l = callbackList.length; i < l; i++) {
            callback = callbackList[i];
            if (callback && callback.func.call(callback.scope, evt) === false) {
              evt.preventDefault();
            }
            if (evt.isImmediatePropagationStopped()) {
              return;
            }
          }
        }
      };
      self$$1.bind = function (target, names, callback, scope) {
        var id, callbackList, i, name$$1, fakeName, nativeHandler, capture;
        var win = window;
        var defaultNativeHandler = function (evt) {
          executeHandlers(fix(evt || win.event), id);
        };
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return;
        }
        if (!target[expando]) {
          id = count++;
          target[expando] = id;
          events[id] = {};
        } else {
          id = target[expando];
        }
        scope = scope || target;
        names = names.split(' ');
        i = names.length;
        while (i--) {
          name$$1 = names[i];
          nativeHandler = defaultNativeHandler;
          fakeName = capture = false;
          if (name$$1 === 'DOMContentLoaded') {
            name$$1 = 'ready';
          }
          if (self$$1.domLoaded && name$$1 === 'ready' && target.readyState === 'complete') {
            callback.call(scope, fix({ type: name$$1 }));
            continue;
          }
          if (!hasMouseEnterLeave) {
            fakeName = mouseEnterLeave[name$$1];
            if (fakeName) {
              nativeHandler = function (evt) {
                var current, related;
                current = evt.currentTarget;
                related = evt.relatedTarget;
                if (related && current.contains) {
                  related = current.contains(related);
                } else {
                  while (related && related !== current) {
                    related = related.parentNode;
                  }
                }
                if (!related) {
                  evt = fix(evt || win.event);
                  evt.type = evt.type === 'mouseout' ? 'mouseleave' : 'mouseenter';
                  evt.target = current;
                  executeHandlers(evt, id);
                }
              };
            }
          }
          if (!hasFocusIn && (name$$1 === 'focusin' || name$$1 === 'focusout')) {
            capture = true;
            fakeName = name$$1 === 'focusin' ? 'focus' : 'blur';
            nativeHandler = function (evt) {
              evt = fix(evt || win.event);
              evt.type = evt.type === 'focus' ? 'focusin' : 'focusout';
              executeHandlers(evt, id);
            };
          }
          callbackList = events[id][name$$1];
          if (!callbackList) {
            events[id][name$$1] = callbackList = [{
                func: callback,
                scope: scope
              }];
            callbackList.fakeName = fakeName;
            callbackList.capture = capture;
            callbackList.nativeHandler = nativeHandler;
            if (name$$1 === 'ready') {
              bindOnReady(target, nativeHandler, self$$1);
            } else {
              addEvent(target, fakeName || name$$1, nativeHandler, capture);
            }
          } else {
            if (name$$1 === 'ready' && self$$1.domLoaded) {
              callback({ type: name$$1 });
            } else {
              callbackList.push({
                func: callback,
                scope: scope
              });
            }
          }
        }
        target = callbackList = 0;
        return callback;
      };
      self$$1.unbind = function (target, names, callback) {
        var id, callbackList, i, ci, name$$1, eventMap;
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1;
        }
        id = target[expando];
        if (id) {
          eventMap = events[id];
          if (names) {
            names = names.split(' ');
            i = names.length;
            while (i--) {
              name$$1 = names[i];
              callbackList = eventMap[name$$1];
              if (callbackList) {
                if (callback) {
                  ci = callbackList.length;
                  while (ci--) {
                    if (callbackList[ci].func === callback) {
                      var nativeHandler = callbackList.nativeHandler;
                      var fakeName = callbackList.fakeName, capture = callbackList.capture;
                      callbackList = callbackList.slice(0, ci).concat(callbackList.slice(ci + 1));
                      callbackList.nativeHandler = nativeHandler;
                      callbackList.fakeName = fakeName;
                      callbackList.capture = capture;
                      eventMap[name$$1] = callbackList;
                    }
                  }
                }
                if (!callback || callbackList.length === 0) {
                  delete eventMap[name$$1];
                  removeEvent(target, callbackList.fakeName || name$$1, callbackList.nativeHandler, callbackList.capture);
                }
              }
            }
          } else {
            for (name$$1 in eventMap) {
              callbackList = eventMap[name$$1];
              removeEvent(target, callbackList.fakeName || name$$1, callbackList.nativeHandler, callbackList.capture);
            }
            eventMap = {};
          }
          for (name$$1 in eventMap) {
            return self$$1;
          }
          delete events[id];
          try {
            delete target[expando];
          } catch (ex) {
            target[expando] = null;
          }
        }
        return self$$1;
      };
      self$$1.fire = function (target, name$$1, args) {
        var id;
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1;
        }
        args = fix(null, args);
        args.type = name$$1;
        args.target = target;
        do {
          id = target[expando];
          if (id) {
            executeHandlers(args, id);
          }
          target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow;
        } while (target && !args.isPropagationStopped());
        return self$$1;
      };
      self$$1.clean = function (target) {
        var i, children;
        var unbind = self$$1.unbind;
        if (!target || target.nodeType === 3 || target.nodeType === 8) {
          return self$$1;
        }
        if (target[expando]) {
          unbind(target);
        }
        if (!target.getElementsByTagName) {
          target = target.document;
        }
        if (target && target.getElementsByTagName) {
          unbind(target);
          children = target.getElementsByTagName('*');
          i = children.length;
          while (i--) {
            target = children[i];
            if (target[expando]) {
              unbind(target);
            }
          }
        }
        return self$$1;
      };
      self$$1.destroy = function () {
        events = {};
      };
      self$$1.cancel = function (e) {
        if (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        return false;
      };
    };
    EventUtils.Event = new EventUtils();
    EventUtils.Event.bind(window, 'ready', function () {
    });

    var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document$1, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains$1, expando = 'sizzle' + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function (a, b) {
        if (a === b) {
          hasDuplicate = true;
        }
        return 0;
      }, strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push$1 = arr.push, slice$1 = arr.slice, indexOf$1 = arr.indexOf || function (elem) {
        var i = 0, len = this.length;
        for (; i < len; i++) {
          if (this[i] === elem) {
            return i;
          }
        }
        return -1;
      }, booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped', whitespace = '[\\x20\\t\\r\\n\\f]', identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+', attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace + '*([*^$|!~]?=)' + whitespace + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace + '*\\]', pseudos = ':(' + identifier + ')(?:\\((' + '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' + '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' + '.*' + ')\\)|)', rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*'), rattributeQuotes = new RegExp('=' + whitespace + '*([^\\]\'"]*?)' + whitespace + '*\\]', 'g'), rpseudo = new RegExp(pseudos), ridentifier = new RegExp('^' + identifier + '$'), matchExpr = {
        ID: new RegExp('^#(' + identifier + ')'),
        CLASS: new RegExp('^\\.(' + identifier + ')'),
        TAG: new RegExp('^(' + identifier + '|[*])'),
        ATTR: new RegExp('^' + attributes),
        PSEUDO: new RegExp('^' + pseudos),
        CHILD: new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
        bool: new RegExp('^(?:' + booleans + ')$', 'i'),
        needsContext: new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
      }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig'), funescape = function (_, escaped, escapedWhitespace) {
        var high = '0x' + escaped - 65536;
        return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
      };
    try {
      push$1.apply(arr = slice$1.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push$1 = {
        apply: arr.length ? function (target, els) {
          push_native.apply(target, slice$1.call(els));
        } : function (target, els) {
          var j = target.length, i = 0;
          while (target[j++] = els[i++]) {
          }
          target.length = j - 1;
        }
      };
    }
    var Sizzle = function (selector, context, results, seed) {
      var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
      if ((context ? context.ownerDocument || context : preferredDoc) !== document$1) {
        setDocument(context);
      }
      context = context || document$1;
      results = results || [];
      if (!selector || typeof selector !== 'string') {
        return results;
      }
      if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
        return [];
      }
      if (documentIsHTML && !seed) {
        if (match = rquickExpr.exec(selector)) {
          if (m = match[1]) {
            if (nodeType === 9) {
              elem = context.getElementById(m);
              if (elem && elem.parentNode) {
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              }
            } else {
              if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains$1(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            }
          } else if (match[2]) {
            push$1.apply(results, context.getElementsByTagName(selector));
            return results;
          } else if ((m = match[3]) && support.getElementsByClassName) {
            push$1.apply(results, context.getElementsByClassName(m));
            return results;
          }
        }
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          nid = old = expando;
          newContext = context;
          newSelector = nodeType === 9 && selector;
          if (nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
            groups = tokenize(selector);
            if (old = context.getAttribute('id')) {
              nid = old.replace(rescape, '\\$&');
            } else {
              context.setAttribute('id', nid);
            }
            nid = '[id=\'' + nid + '\'] ';
            i = groups.length;
            while (i--) {
              groups[i] = nid + toSelector(groups[i]);
            }
            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            newSelector = groups.join(',');
          }
          if (newSelector) {
            try {
              push$1.apply(results, newContext.querySelectorAll(newSelector));
              return results;
            } catch (qsaError) {
            } finally {
              if (!old) {
                context.removeAttribute('id');
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, '$1'), context, results, seed);
    };
    function createCache() {
      var keys = [];
      function cache(key, value) {
        if (keys.push(key + ' ') > Expr.cacheLength) {
          delete cache[keys.shift()];
        }
        return cache[key + ' '] = value;
      }
      return cache;
    }
    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    function siblingCheck(a, b) {
      var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
      if (diff) {
        return diff;
      }
      if (cur) {
        while (cur = cur.nextSibling) {
          if (cur === b) {
            return -1;
          }
        }
      }
      return a ? 1 : -1;
    }
    function createInputPseudo(type) {
      return function (elem) {
        var name$$1 = elem.nodeName.toLowerCase();
        return name$$1 === 'input' && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function (elem) {
        var name$$1 = elem.nodeName.toLowerCase();
        return (name$$1 === 'input' || name$$1 === 'button') && elem.type === type;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function (argument) {
        argument = +argument;
        return markFunction(function (seed, matches) {
          var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
          while (i--) {
            if (seed[j = matchIndexes[i]]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    function testContext(context) {
      return context && typeof context.getElementsByTagName !== strundefined && context;
    }
    support = Sizzle.support = {};
    isXML = Sizzle.isXML = function (elem) {
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== 'HTML' : false;
    };
    setDocument = Sizzle.setDocument = function (node) {
      var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent$$1 = doc.defaultView;
      function getTop(win) {
        try {
          return win.top;
        } catch (ex) {
        }
        return null;
      }
      if (doc === document$1 || doc.nodeType !== 9 || !doc.documentElement) {
        return document$1;
      }
      document$1 = doc;
      docElem = doc.documentElement;
      documentIsHTML = !isXML(doc);
      if (parent$$1 && parent$$1 !== getTop(parent$$1)) {
        if (parent$$1.addEventListener) {
          parent$$1.addEventListener('unload', function () {
            setDocument();
          }, false);
        } else if (parent$$1.attachEvent) {
          parent$$1.attachEvent('onunload', function () {
            setDocument();
          });
        }
      }
      support.attributes = true;
      support.getElementsByTagName = true;
      support.getElementsByClassName = rnative.test(doc.getElementsByClassName);
      support.getById = true;
      Expr.find.ID = function (id, context) {
        if (typeof context.getElementById !== strundefined && documentIsHTML) {
          var m = context.getElementById(id);
          return m && m.parentNode ? [m] : [];
        }
      };
      Expr.filter.ID = function (id) {
        var attrId = id.replace(runescape, funescape);
        return function (elem) {
          return elem.getAttribute('id') === attrId;
        };
      };
      Expr.find.TAG = support.getElementsByTagName ? function (tag, context) {
        if (typeof context.getElementsByTagName !== strundefined) {
          return context.getElementsByTagName(tag);
        }
      } : function (tag, context) {
        var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
        if (tag === '*') {
          while (elem = results[i++]) {
            if (elem.nodeType === 1) {
              tmp.push(elem);
            }
          }
          return tmp;
        }
        return results;
      };
      Expr.find.CLASS = support.getElementsByClassName && function (className, context) {
        if (documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      rbuggyMatches = [];
      rbuggyQSA = [];
      support.disconnectedMatch = true;
      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));
      hasCompare = rnative.test(docElem.compareDocumentPosition);
      contains$1 = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      } : function (a, b) {
        if (b) {
          while (b = b.parentNode) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      };
      sortOrder = hasCompare ? function (a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
          return compare;
        }
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
        if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
          if (a === doc || a.ownerDocument === preferredDoc && contains$1(preferredDoc, a)) {
            return -1;
          }
          if (b === doc || b.ownerDocument === preferredDoc && contains$1(preferredDoc, b)) {
            return 1;
          }
          return sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0;
        }
        return compare & 4 ? -1 : 1;
      } : function (a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
        if (!aup || !bup) {
          return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0;
        } else if (aup === bup) {
          return siblingCheck(a, b);
        }
        cur = a;
        while (cur = cur.parentNode) {
          ap.unshift(cur);
        }
        cur = b;
        while (cur = cur.parentNode) {
          bp.unshift(cur);
        }
        while (ap[i] === bp[i]) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return doc;
    };
    Sizzle.matches = function (expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function (elem, expr) {
      if ((elem.ownerDocument || elem) !== document$1) {
        setDocument(elem);
      }
      expr = expr.replace(rattributeQuotes, '=\'$1\']');
      if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {
        }
      }
      return Sizzle(expr, document$1, null, [elem]).length > 0;
    };
    Sizzle.contains = function (context, elem) {
      if ((context.ownerDocument || context) !== document$1) {
        setDocument(context);
      }
      return contains$1(context, elem);
    };
    Sizzle.attr = function (elem, name$$1) {
      if ((elem.ownerDocument || elem) !== document$1) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name$$1.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name$$1.toLowerCase()) ? fn(elem, name$$1, !documentIsHTML) : undefined;
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name$$1) : (val = elem.getAttributeNode(name$$1)) && val.specified ? val.value : null;
    };
    Sizzle.error = function (msg) {
      throw new Error('Syntax error, unrecognized expression: ' + msg);
    };
    Sizzle.uniqueSort = function (results) {
      var elem, duplicates = [], j = 0, i = 0;
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        while (elem = results[i++]) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      sortInput = null;
      return results;
    };
    getText = Sizzle.getText = function (elem) {
      var node, ret = '', i = 0, nodeType = elem.nodeType;
      if (!nodeType) {
        while (node = elem[i++]) {
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof elem.textContent === 'string') {
          return elem.textContent;
        } else {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        '>': {
          dir: 'parentNode',
          first: true
        },
        ' ': { dir: 'parentNode' },
        '+': {
          dir: 'previousSibling',
          first: true
        },
        '~': { dir: 'previousSibling' }
      },
      preFilter: {
        ATTR: function (match) {
          match[1] = match[1].replace(runescape, funescape);
          match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape);
          if (match[2] === '~=') {
            match[3] = ' ' + match[3] + ' ';
          }
          return match.slice(0, 4);
        },
        CHILD: function (match) {
          match[1] = match[1].toLowerCase();
          if (match[1].slice(0, 3) === 'nth') {
            if (!match[3]) {
              Sizzle.error(match[0]);
            }
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'));
            match[5] = +(match[7] + match[8] || match[3] === 'odd');
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }
          return match;
        },
        PSEUDO: function (match) {
          var excess, unquoted = !match[6] && match[2];
          if (matchExpr.CHILD.test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || '';
          } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }
          return match.slice(0, 3);
        }
      },
      filter: {
        TAG: function (nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === '*' ? function () {
            return true;
          } : function (elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        CLASS: function (className) {
          var pattern = classCache[className + ' '];
          return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
            return pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || '');
          });
        },
        ATTR: function (name$$1, operator, check) {
          return function (elem) {
            var result = Sizzle.attr(elem, name$$1);
            if (result == null) {
              return operator === '!=';
            }
            if (!operator) {
              return true;
            }
            result += '';
            return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (' ' + result + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-' : false;
          };
        },
        CHILD: function (type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== 'nth', forward = type.slice(-4) !== 'last', ofType = what === 'of-type';
          return first === 1 && last === 0 ? function (elem) {
            return !!elem.parentNode;
          } : function (elem, context, xml) {
            var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? 'nextSibling' : 'previousSibling', parent$$1 = elem.parentNode, name$$1 = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
            if (parent$$1) {
              if (simple) {
                while (dir) {
                  node = elem;
                  while (node = node[dir]) {
                    if (ofType ? node.nodeName.toLowerCase() === name$$1 : node.nodeType === 1) {
                      return false;
                    }
                  }
                  start = dir = type === 'only' && !start && 'nextSibling';
                }
                return true;
              }
              start = [forward ? parent$$1.firstChild : parent$$1.lastChild];
              if (forward && useCache) {
                outerCache = parent$$1[expando] || (parent$$1[expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = cache[0] === dirruns && cache[2];
                node = nodeIndex && parent$$1.childNodes[nodeIndex];
                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    outerCache[type] = [
                      dirruns,
                      nodeIndex,
                      diff
                    ];
                    break;
                  }
                }
              } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                diff = cache[1];
              } else {
                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                  if ((ofType ? node.nodeName.toLowerCase() === name$$1 : node.nodeType === 1) && ++diff) {
                    if (useCache) {
                      (node[expando] || (node[expando] = {}))[type] = [
                        dirruns,
                        diff
                      ];
                    }
                    if (node === elem) {
                      break;
                    }
                  }
                }
              }
              diff -= last;
              return diff === first || diff % first === 0 && diff / first >= 0;
            }
          };
        },
        PSEUDO: function (pseudo, argument) {
          var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error('unsupported pseudo: ' + pseudo);
          if (fn[expando]) {
            return fn(argument);
          }
          if (fn.length > 1) {
            args = [
              pseudo,
              pseudo,
              '',
              argument
            ];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
              var idx, matched = fn(seed, argument), i = matched.length;
              while (i--) {
                idx = indexOf$1.call(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function (elem) {
              return fn(elem, 0, args);
            };
          }
          return fn;
        }
      },
      pseudos: {
        not: markFunction(function (selector) {
          var input = [], results = [], matcher = compile(selector.replace(rtrim, '$1'));
          return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
            var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
            while (i--) {
              if (elem = unmatched[i]) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function (elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results);
            return !results.pop();
          };
        }),
        has: markFunction(function (selector) {
          return function (elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        contains: markFunction(function (text) {
          text = text.replace(runescape, funescape);
          return function (elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        lang: markFunction(function (lang) {
          if (!ridentifier.test(lang || '')) {
            Sizzle.error('unsupported lang: ' + lang);
          }
          lang = lang.replace(runescape, funescape).toLowerCase();
          return function (elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute('xml:lang') || elem.getAttribute('lang')) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + '-') === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);
            return false;
          };
        }),
        target: function (elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        root: function (elem) {
          return elem === docElem;
        },
        focus: function (elem) {
          return elem === document$1.activeElement && (!document$1.hasFocus || document$1.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        enabled: function (elem) {
          return elem.disabled === false;
        },
        disabled: function (elem) {
          return elem.disabled === true;
        },
        checked: function (elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
        },
        selected: function (elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        empty: function (elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        parent: function (elem) {
          return !Expr.pseudos.empty(elem);
        },
        header: function (elem) {
          return rheader.test(elem.nodeName);
        },
        input: function (elem) {
          return rinputs.test(elem.nodeName);
        },
        button: function (elem) {
          var name$$1 = elem.nodeName.toLowerCase();
          return name$$1 === 'input' && elem.type === 'button' || name$$1 === 'button';
        },
        text: function (elem) {
          var attr;
          return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text');
        },
        first: createPositionalPseudo(function () {
          return [0];
        }),
        last: createPositionalPseudo(function (matchIndexes, length$$1) {
          return [length$$1 - 1];
        }),
        eq: createPositionalPseudo(function (matchIndexes, length$$1, argument) {
          return [argument < 0 ? argument + length$$1 : argument];
        }),
        even: createPositionalPseudo(function (matchIndexes, length$$1) {
          var i = 0;
          for (; i < length$$1; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        odd: createPositionalPseudo(function (matchIndexes, length$$1) {
          var i = 1;
          for (; i < length$$1; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        lt: createPositionalPseudo(function (matchIndexes, length$$1, argument) {
          var i = argument < 0 ? argument + length$$1 : argument;
          for (; --i >= 0;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        gt: createPositionalPseudo(function (matchIndexes, length$$1, argument) {
          var i = argument < 0 ? argument + length$$1 : argument;
          for (; ++i < length$$1;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in {
        radio: true,
        checkbox: true,
        file: true,
        password: true,
        image: true
      }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
        submit: true,
        reset: true
      }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    function setFilters() {
    }
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    tokenize = Sizzle.tokenize = function (selector, parseOnly) {
      var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + ' '];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;
      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        matched = false;
        if (match = rcombinators.exec(soFar)) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: match[0].replace(rtrim, ' ')
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
    };
    function toSelector(tokens) {
      var i = 0, len = tokens.length, selector = '';
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir, checkNonElements = base && dir === 'parentNode', doneName = done++;
      return combinator.first ? function (elem, context, xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }
      } : function (elem, context, xml) {
        var oldCache, outerCache, newCache = [
            dirruns,
            doneName
          ];
        if (xml) {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {});
              if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                return newCache[2] = oldCache[2];
              } else {
                outerCache[dir] = newCache;
                if (newCache[2] = matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          }
        }
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function (elem, context, xml) {
        var i = matchers.length;
        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
      var i = 0, len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
      for (; i < len; i++) {
        if (elem = unmatched[i]) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function (seed, results, context, xml) {
        var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          i = temp.length;
          while (i--) {
            if (elem = temp[i]) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if (elem = matcherOut[i]) {
                  temp.push(matcherIn[i] = elem);
                }
              }
              postFinder(null, matcherOut = [], temp, xml);
            }
            i = matcherOut.length;
            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf$1.call(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push$1.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function (elem) {
          return elem === checkContext;
        }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
          return indexOf$1.call(checkContext, elem) > -1;
        }, implicitRelative, true), matchers = [function (elem, context, xml) {
            return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
          }];
      for (; i < len; i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matcher[expando]) {
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, outermost) {
          var elem, j, matcher, matchedCount = 0, i = '0', unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG('*', outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
          if (outermost) {
            outermostContext = context !== document$1 && context;
          }
          for (; i !== len && (elem = elems[i]) != null; i++) {
            if (byElement && elem) {
              j = 0;
              while (matcher = elementMatchers[j++]) {
                if (matcher(elem, context, xml)) {
                  results.push(elem);
                  break;
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
              }
            }
            if (bySet) {
              if (elem = !matcher && elem) {
                matchedCount--;
              }
              if (seed) {
                unmatched.push(elem);
              }
            }
          }
          matchedCount += i;
          if (bySet && i !== matchedCount) {
            j = 0;
            while (matcher = setMatchers[j++]) {
              matcher(unmatched, setMatched, context, xml);
            }
            if (seed) {
              if (matchedCount > 0) {
                while (i--) {
                  if (!(unmatched[i] || setMatched[i])) {
                    setMatched[i] = pop.call(results);
                  }
                }
              }
              setMatched = condense(setMatched);
            }
            push$1.apply(results, setMatched);
            if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
              Sizzle.uniqueSort(results);
            }
          }
          if (outermost) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }
          return unmatched;
        };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    compile = Sizzle.compile = function (selector, match) {
      var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + ' '];
      if (!cached) {
        if (!match) {
          match = tokenize(selector);
        }
        i = match.length;
        while (i--) {
          cached = matcherFromTokens(match[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        cached.selector = selector;
      }
      return cached;
    };
    select = Sizzle.select = function (selector, context, results, seed) {
      var i, tokens, token, type, find, compiled = typeof selector === 'function' && selector, match = !seed && tokenize(selector = compiled.selector || selector);
      results = results || [];
      if (match.length === 1) {
        tokens = match[0] = match[0].slice(0);
        if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0];
          if (!context) {
            return results;
          } else if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
        while (i--) {
          token = tokens[i];
          if (Expr.relative[type = token.type]) {
            break;
          }
          if (find = Expr.find[type]) {
            if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);
              if (!selector) {
                push$1.apply(results, seed);
                return results;
              }
              break;
            }
          }
        }
      }
      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
      return results;
    };
    support.sortStable = expando.split('').sort(sortOrder).join('') === expando;
    support.detectDuplicates = !!hasDuplicate;
    setDocument();
    support.sortDetached = true;

    var isArray$1 = Array.isArray;
    var toArray = function (obj) {
      var array = obj, i, l;
      if (!isArray$1(obj)) {
        array = [];
        for (i = 0, l = obj.length; i < l; i++) {
          array[i] = obj[i];
        }
      }
      return array;
    };
    var each$1 = function (o, cb, s) {
      var n, l;
      if (!o) {
        return 0;
      }
      s = s || o;
      if (o.length !== undefined) {
        for (n = 0, l = o.length; n < l; n++) {
          if (cb.call(s, o[n], n, o) === false) {
            return 0;
          }
        }
      } else {
        for (n in o) {
          if (o.hasOwnProperty(n)) {
            if (cb.call(s, o[n], n, o) === false) {
              return 0;
            }
          }
        }
      }
      return 1;
    };
    var map$1 = function (array, callback) {
      var out = [];
      each$1(array, function (item, index) {
        out.push(callback(item, index, array));
      });
      return out;
    };
    var filter$1 = function (a, f) {
      var o = [];
      each$1(a, function (v, index) {
        if (!f || f(v, index, a)) {
          o.push(v);
        }
      });
      return o;
    };
    var indexOf$2 = function (a, v) {
      var i, l;
      if (a) {
        for (i = 0, l = a.length; i < l; i++) {
          if (a[i] === v) {
            return i;
          }
        }
      }
      return -1;
    };
    var reduce = function (collection, iteratee, accumulator, thisArg) {
      var i = 0;
      if (arguments.length < 3) {
        accumulator = collection[0];
      }
      for (; i < collection.length; i++) {
        accumulator = iteratee.call(thisArg, accumulator, collection[i], i);
      }
      return accumulator;
    };
    var findIndex$1 = function (array, predicate, thisArg) {
      var i, l;
      for (i = 0, l = array.length; i < l; i++) {
        if (predicate.call(thisArg, array[i], i, array)) {
          return i;
        }
      }
      return -1;
    };
    var find$1 = function (array, predicate, thisArg) {
      var idx = findIndex$1(array, predicate, thisArg);
      if (idx !== -1) {
        return array[idx];
      }
      return undefined;
    };
    var last$1 = function (collection) {
      return collection[collection.length - 1];
    };
    var Arr = {
      isArray: isArray$1,
      toArray: toArray,
      each: each$1,
      map: map$1,
      filter: filter$1,
      indexOf: indexOf$2,
      reduce: reduce,
      findIndex: findIndex$1,
      find: find$1,
      last: last$1
    };

    var whiteSpaceRegExp = /^\s*|\s*$/g;
    var trim = function (str) {
      return str === null || str === undefined ? '' : ('' + str).replace(whiteSpaceRegExp, '');
    };
    var is = function (obj, type) {
      if (!type) {
        return obj !== undefined;
      }
      if (type === 'array' && Arr.isArray(obj)) {
        return true;
      }
      return typeof obj === type;
    };
    var makeMap = function (items, delim, map) {
      var i;
      items = items || [];
      delim = delim || ',';
      if (typeof items === 'string') {
        items = items.split(delim);
      }
      map = map || {};
      i = items.length;
      while (i--) {
        map[items[i]] = {};
      }
      return map;
    };
    var hasOwnProperty = function (obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
    var create = function (s, p, root) {
      var self$$1 = this;
      var sp, ns, cn, scn, c, de = 0;
      s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s);
      cn = s[3].match(/(^|\.)(\w+)$/i)[2];
      ns = self$$1.createNS(s[3].replace(/\.\w+$/, ''), root);
      if (ns[cn]) {
        return;
      }
      if (s[2] === 'static') {
        ns[cn] = p;
        if (this.onCreate) {
          this.onCreate(s[2], s[3], ns[cn]);
        }
        return;
      }
      if (!p[cn]) {
        p[cn] = function () {
        };
        de = 1;
      }
      ns[cn] = p[cn];
      self$$1.extend(ns[cn].prototype, p);
      if (s[5]) {
        sp = self$$1.resolve(s[5]).prototype;
        scn = s[5].match(/\.(\w+)$/i)[1];
        c = ns[cn];
        if (de) {
          ns[cn] = function () {
            return sp[scn].apply(this, arguments);
          };
        } else {
          ns[cn] = function () {
            this.parent = sp[scn];
            return c.apply(this, arguments);
          };
        }
        ns[cn].prototype[cn] = ns[cn];
        self$$1.each(sp, function (f, n) {
          ns[cn].prototype[n] = sp[n];
        });
        self$$1.each(p, function (f, n) {
          if (sp[n]) {
            ns[cn].prototype[n] = function () {
              this.parent = sp[n];
              return f.apply(this, arguments);
            };
          } else {
            if (n !== cn) {
              ns[cn].prototype[n] = f;
            }
          }
        });
      }
      self$$1.each(p.static, function (f, n) {
        ns[cn][n] = f;
      });
    };
    var extend = function (obj, ext) {
      var x = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        x[_i - 2] = arguments[_i];
      }
      var i, l, name$$1;
      var args = arguments;
      var value;
      for (i = 1, l = args.length; i < l; i++) {
        ext = args[i];
        for (name$$1 in ext) {
          if (ext.hasOwnProperty(name$$1)) {
            value = ext[name$$1];
            if (value !== undefined) {
              obj[name$$1] = value;
            }
          }
        }
      }
      return obj;
    };
    var walk = function (o, f, n, s) {
      s = s || this;
      if (o) {
        if (n) {
          o = o[n];
        }
        Arr.each(o, function (o, i) {
          if (f.call(s, o, i, n) === false) {
            return false;
          }
          walk(o, f, n, s);
        });
      }
    };
    var createNS = function (n, o) {
      var i, v;
      o = o || window;
      n = n.split('.');
      for (i = 0; i < n.length; i++) {
        v = n[i];
        if (!o[v]) {
          o[v] = {};
        }
        o = o[v];
      }
      return o;
    };
    var resolve$1 = function (n, o) {
      var i, l;
      o = o || window;
      n = n.split('.');
      for (i = 0, l = n.length; i < l; i++) {
        o = o[n[i]];
        if (!o) {
          break;
        }
      }
      return o;
    };
    var explode = function (s, d) {
      if (!s || is(s, 'array')) {
        return s;
      }
      return Arr.map(s.split(d || ','), trim);
    };
    var _addCacheSuffix = function (url) {
      var cacheSuffix = Env.cacheSuffix;
      if (cacheSuffix) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + cacheSuffix;
      }
      return url;
    };
    var Tools = {
      trim: trim,
      isArray: Arr.isArray,
      is: is,
      toArray: Arr.toArray,
      makeMap: makeMap,
      each: Arr.each,
      map: Arr.map,
      grep: Arr.filter,
      inArray: Arr.indexOf,
      hasOwn: hasOwnProperty,
      extend: extend,
      create: create,
      walk: walk,
      createNS: createNS,
      resolve: resolve$1,
      explode: explode,
      _addCacheSuffix: _addCacheSuffix
    };

    var doc = document, push$2 = Array.prototype.push, slice$2 = Array.prototype.slice;
    var rquickExpr$1 = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
    var Event$$1 = EventUtils.Event;
    var skipUniques = Tools.makeMap('children,contents,next,prev');
    var isDefined = function (obj) {
      return typeof obj !== 'undefined';
    };
    var isString$1 = function (obj) {
      return typeof obj === 'string';
    };
    var isWindow = function (obj) {
      return obj && obj === obj.window;
    };
    var createFragment = function (html, fragDoc) {
      var frag, node, container;
      fragDoc = fragDoc || doc;
      container = fragDoc.createElement('div');
      frag = fragDoc.createDocumentFragment();
      container.innerHTML = html;
      while (node = container.firstChild) {
        frag.appendChild(node);
      }
      return frag;
    };
    var domManipulate = function (targetNodes, sourceItem, callback, reverse) {
      var i;
      if (isString$1(sourceItem)) {
        sourceItem = createFragment(sourceItem, getElementDocument(targetNodes[0]));
      } else if (sourceItem.length && !sourceItem.nodeType) {
        sourceItem = DomQuery.makeArray(sourceItem);
        if (reverse) {
          for (i = sourceItem.length - 1; i >= 0; i--) {
            domManipulate(targetNodes, sourceItem[i], callback, reverse);
          }
        } else {
          for (i = 0; i < sourceItem.length; i++) {
            domManipulate(targetNodes, sourceItem[i], callback, reverse);
          }
        }
        return targetNodes;
      }
      if (sourceItem.nodeType) {
        i = targetNodes.length;
        while (i--) {
          callback.call(targetNodes[i], sourceItem);
        }
      }
      return targetNodes;
    };
    var hasClass = function (node, className) {
      return node && className && (' ' + node.className + ' ').indexOf(' ' + className + ' ') !== -1;
    };
    var wrap = function (elements, wrapper, all) {
      var lastParent, newWrapper;
      wrapper = DomQuery(wrapper)[0];
      elements.each(function () {
        var self$$1 = this;
        if (!all || lastParent !== self$$1.parentNode) {
          lastParent = self$$1.parentNode;
          newWrapper = wrapper.cloneNode(false);
          self$$1.parentNode.insertBefore(newWrapper, self$$1);
          newWrapper.appendChild(self$$1);
        } else {
          newWrapper.appendChild(self$$1);
        }
      });
      return elements;
    };
    var numericCssMap = Tools.makeMap('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', ' ');
    var booleanMap = Tools.makeMap('checked compact declare defer disabled ismap multiple nohref noshade nowrap readonly selected', ' ');
    var propFix = {
      for: 'htmlFor',
      class: 'className',
      readonly: 'readOnly'
    };
    var cssFix = { float: 'cssFloat' };
    var attrHooks = {}, cssHooks = {};
    var DomQuery = function (selector, context) {
      return new DomQuery.fn.init(selector, context);
    };
    var inArray = function (item, array) {
      var i;
      if (array.indexOf) {
        return array.indexOf(item);
      }
      i = array.length;
      while (i--) {
        if (array[i] === item) {
          return i;
        }
      }
      return -1;
    };
    var whiteSpaceRegExp$1 = /^\s*|\s*$/g;
    var trim$1 = function (str) {
      return str === null || str === undefined ? '' : ('' + str).replace(whiteSpaceRegExp$1, '');
    };
    var each$2 = function (obj, callback) {
      var length$$1, key, i, value;
      if (obj) {
        length$$1 = obj.length;
        if (length$$1 === undefined) {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              value = obj[key];
              if (callback.call(value, key, value) === false) {
                break;
              }
            }
          }
        } else {
          for (i = 0; i < length$$1; i++) {
            value = obj[i];
            if (callback.call(value, i, value) === false) {
              break;
            }
          }
        }
      }
      return obj;
    };
    var grep = function (array, callback) {
      var out = [];
      each$2(array, function (i, item) {
        if (callback(item, i)) {
          out.push(item);
        }
      });
      return out;
    };
    var getElementDocument = function (element) {
      if (!element) {
        return doc;
      }
      if (element.nodeType === 9) {
        return element;
      }
      return element.ownerDocument;
    };
    DomQuery.fn = DomQuery.prototype = {
      constructor: DomQuery,
      selector: '',
      context: null,
      length: 0,
      init: function (selector, context) {
        var self$$1 = this;
        var match, node;
        if (!selector) {
          return self$$1;
        }
        if (selector.nodeType) {
          self$$1.context = self$$1[0] = selector;
          self$$1.length = 1;
          return self$$1;
        }
        if (context && context.nodeType) {
          self$$1.context = context;
        } else {
          if (context) {
            return DomQuery(selector).attr(context);
          }
          self$$1.context = context = document;
        }
        if (isString$1(selector)) {
          self$$1.selector = selector;
          if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
            match = [
              null,
              selector,
              null
            ];
          } else {
            match = rquickExpr$1.exec(selector);
          }
          if (match) {
            if (match[1]) {
              node = createFragment(selector, getElementDocument(context)).firstChild;
              while (node) {
                push$2.call(self$$1, node);
                node = node.nextSibling;
              }
            } else {
              node = getElementDocument(context).getElementById(match[2]);
              if (!node) {
                return self$$1;
              }
              if (node.id !== match[2]) {
                return self$$1.find(selector);
              }
              self$$1.length = 1;
              self$$1[0] = node;
            }
          } else {
            return DomQuery(context).find(selector);
          }
        } else {
          this.add(selector, false);
        }
        return self$$1;
      },
      toArray: function () {
        return Tools.toArray(this);
      },
      add: function (items, sort) {
        var self$$1 = this;
        var nodes, i;
        if (isString$1(items)) {
          return self$$1.add(DomQuery(items));
        }
        if (sort !== false) {
          nodes = DomQuery.unique(self$$1.toArray().concat(DomQuery.makeArray(items)));
          self$$1.length = nodes.length;
          for (i = 0; i < nodes.length; i++) {
            self$$1[i] = nodes[i];
          }
        } else {
          push$2.apply(self$$1, DomQuery.makeArray(items));
        }
        return self$$1;
      },
      attr: function (name$$1, value) {
        var self$$1 = this;
        var hook;
        if (typeof name$$1 === 'object') {
          each$2(name$$1, function (name$$1, value) {
            self$$1.attr(name$$1, value);
          });
        } else if (isDefined(value)) {
          this.each(function () {
            var hook;
            if (this.nodeType === 1) {
              hook = attrHooks[name$$1];
              if (hook && hook.set) {
                hook.set(this, value);
                return;
              }
              if (value === null) {
                this.removeAttribute(name$$1, 2);
              } else {
                this.setAttribute(name$$1, value, 2);
              }
            }
          });
        } else {
          if (self$$1[0] && self$$1[0].nodeType === 1) {
            hook = attrHooks[name$$1];
            if (hook && hook.get) {
              return hook.get(self$$1[0], name$$1);
            }
            if (booleanMap[name$$1]) {
              return self$$1.prop(name$$1) ? name$$1 : undefined;
            }
            value = self$$1[0].getAttribute(name$$1, 2);
            if (value === null) {
              value = undefined;
            }
          }
          return value;
        }
        return self$$1;
      },
      removeAttr: function (name$$1) {
        return this.attr(name$$1, null);
      },
      prop: function (name$$1, value) {
        var self$$1 = this;
        name$$1 = propFix[name$$1] || name$$1;
        if (typeof name$$1 === 'object') {
          each$2(name$$1, function (name$$1, value) {
            self$$1.prop(name$$1, value);
          });
        } else if (isDefined(value)) {
          this.each(function () {
            if (this.nodeType === 1) {
              this[name$$1] = value;
            }
          });
        } else {
          if (self$$1[0] && self$$1[0].nodeType && name$$1 in self$$1[0]) {
            return self$$1[0][name$$1];
          }
          return value;
        }
        return self$$1;
      },
      css: function (name$$1, value) {
        var self$$1 = this;
        var elm, hook;
        var camel = function (name$$1) {
          return name$$1.replace(/-(\D)/g, function (a, b) {
            return b.toUpperCase();
          });
        };
        var dashed = function (name$$1) {
          return name$$1.replace(/[A-Z]/g, function (a) {
            return '-' + a;
          });
        };
        if (typeof name$$1 === 'object') {
          each$2(name$$1, function (name$$1, value) {
            self$$1.css(name$$1, value);
          });
        } else {
          if (isDefined(value)) {
            name$$1 = camel(name$$1);
            if (typeof value === 'number' && !numericCssMap[name$$1]) {
              value = value.toString() + 'px';
            }
            self$$1.each(function () {
              var style = this.style;
              hook = cssHooks[name$$1];
              if (hook && hook.set) {
                hook.set(this, value);
                return;
              }
              try {
                this.style[cssFix[name$$1] || name$$1] = value;
              } catch (ex) {
              }
              if (value === null || value === '') {
                if (style.removeProperty) {
                  style.removeProperty(dashed(name$$1));
                } else {
                  style.removeAttribute(name$$1);
                }
              }
            });
          } else {
            elm = self$$1[0];
            hook = cssHooks[name$$1];
            if (hook && hook.get) {
              return hook.get(elm);
            }
            if (elm.ownerDocument.defaultView) {
              try {
                return elm.ownerDocument.defaultView.getComputedStyle(elm, null).getPropertyValue(dashed(name$$1));
              } catch (ex) {
                return undefined;
              }
            } else if (elm.currentStyle) {
              return elm.currentStyle[camel(name$$1)];
            } else {
              return '';
            }
          }
        }
        return self$$1;
      },
      remove: function () {
        var self$$1 = this;
        var node, i = this.length;
        while (i--) {
          node = self$$1[i];
          Event$$1.clean(node);
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        }
        return this;
      },
      empty: function () {
        var self$$1 = this;
        var node, i = this.length;
        while (i--) {
          node = self$$1[i];
          while (node.firstChild) {
            node.removeChild(node.firstChild);
          }
        }
        return this;
      },
      html: function (value) {
        var self$$1 = this;
        var i;
        if (isDefined(value)) {
          i = self$$1.length;
          try {
            while (i--) {
              self$$1[i].innerHTML = value;
            }
          } catch (ex) {
            DomQuery(self$$1[i]).empty().append(value);
          }
          return self$$1;
        }
        return self$$1[0] ? self$$1[0].innerHTML : '';
      },
      text: function (value) {
        var self$$1 = this;
        var i;
        if (isDefined(value)) {
          i = self$$1.length;
          while (i--) {
            if ('innerText' in self$$1[i]) {
              self$$1[i].innerText = value;
            } else {
              self$$1[0].textContent = value;
            }
          }
          return self$$1;
        }
        return self$$1[0] ? self$$1[0].innerText || self$$1[0].textContent : '';
      },
      append: function () {
        return domManipulate(this, arguments, function (node) {
          if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
            this.appendChild(node);
          }
        });
      },
      prepend: function () {
        return domManipulate(this, arguments, function (node) {
          if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
            this.insertBefore(node, this.firstChild);
          }
        }, true);
      },
      before: function () {
        var self$$1 = this;
        if (self$$1[0] && self$$1[0].parentNode) {
          return domManipulate(self$$1, arguments, function (node) {
            this.parentNode.insertBefore(node, this);
          });
        }
        return self$$1;
      },
      after: function () {
        var self$$1 = this;
        if (self$$1[0] && self$$1[0].parentNode) {
          return domManipulate(self$$1, arguments, function (node) {
            this.parentNode.insertBefore(node, this.nextSibling);
          }, true);
        }
        return self$$1;
      },
      appendTo: function (val) {
        DomQuery(val).append(this);
        return this;
      },
      prependTo: function (val) {
        DomQuery(val).prepend(this);
        return this;
      },
      replaceWith: function (content) {
        return this.before(content).remove();
      },
      wrap: function (content) {
        return wrap(this, content);
      },
      wrapAll: function (content) {
        return wrap(this, content, true);
      },
      wrapInner: function (content) {
        this.each(function () {
          DomQuery(this).contents().wrapAll(content);
        });
        return this;
      },
      unwrap: function () {
        return this.parent().each(function () {
          DomQuery(this).replaceWith(this.childNodes);
        });
      },
      clone: function () {
        var result = [];
        this.each(function () {
          result.push(this.cloneNode(true));
        });
        return DomQuery(result);
      },
      addClass: function (className) {
        return this.toggleClass(className, true);
      },
      removeClass: function (className) {
        return this.toggleClass(className, false);
      },
      toggleClass: function (className, state) {
        var self$$1 = this;
        if (typeof className !== 'string') {
          return self$$1;
        }
        if (className.indexOf(' ') !== -1) {
          each$2(className.split(' '), function () {
            self$$1.toggleClass(this, state);
          });
        } else {
          self$$1.each(function (index, node) {
            var existingClassName, classState;
            classState = hasClass(node, className);
            if (classState !== state) {
              existingClassName = node.className;
              if (classState) {
                node.className = trim$1((' ' + existingClassName + ' ').replace(' ' + className + ' ', ' '));
              } else {
                node.className += existingClassName ? ' ' + className : className;
              }
            }
          });
        }
        return self$$1;
      },
      hasClass: function (className) {
        return hasClass(this[0], className);
      },
      each: function (callback) {
        return each$2(this, callback);
      },
      on: function (name$$1, callback) {
        return this.each(function () {
          Event$$1.bind(this, name$$1, callback);
        });
      },
      off: function (name$$1, callback) {
        return this.each(function () {
          Event$$1.unbind(this, name$$1, callback);
        });
      },
      trigger: function (name$$1) {
        return this.each(function () {
          if (typeof name$$1 === 'object') {
            Event$$1.fire(this, name$$1.type, name$$1);
          } else {
            Event$$1.fire(this, name$$1);
          }
        });
      },
      show: function () {
        return this.css('display', '');
      },
      hide: function () {
        return this.css('display', 'none');
      },
      slice: function () {
        return new DomQuery(slice$2.apply(this, arguments));
      },
      eq: function (index) {
        return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      find: function (selector) {
        var i, l;
        var ret = [];
        for (i = 0, l = this.length; i < l; i++) {
          DomQuery.find(selector, this[i], ret);
        }
        return DomQuery(ret);
      },
      filter: function (selector) {
        if (typeof selector === 'function') {
          return DomQuery(grep(this.toArray(), function (item, i) {
            return selector(i, item);
          }));
        }
        return DomQuery(DomQuery.filter(selector, this.toArray()));
      },
      closest: function (selector) {
        var result = [];
        if (selector instanceof DomQuery) {
          selector = selector[0];
        }
        this.each(function (i, node) {
          while (node) {
            if (typeof selector === 'string' && DomQuery(node).is(selector)) {
              result.push(node);
              break;
            } else if (node === selector) {
              result.push(node);
              break;
            }
            node = node.parentNode;
          }
        });
        return DomQuery(result);
      },
      offset: function (offset) {
        var elm, doc, docElm;
        var x = 0, y = 0, pos;
        if (!offset) {
          elm = this[0];
          if (elm) {
            doc = elm.ownerDocument;
            docElm = doc.documentElement;
            if (elm.getBoundingClientRect) {
              pos = elm.getBoundingClientRect();
              x = pos.left + (docElm.scrollLeft || doc.body.scrollLeft) - docElm.clientLeft;
              y = pos.top + (docElm.scrollTop || doc.body.scrollTop) - docElm.clientTop;
            }
          }
          return {
            left: x,
            top: y
          };
        }
        return this.css(offset);
      },
      push: push$2,
      sort: [].sort,
      splice: [].splice
    };
    Tools.extend(DomQuery, {
      extend: Tools.extend,
      makeArray: function (object) {
        if (isWindow(object) || object.nodeType) {
          return [object];
        }
        return Tools.toArray(object);
      },
      inArray: inArray,
      isArray: Tools.isArray,
      each: each$2,
      trim: trim$1,
      grep: grep,
      find: Sizzle,
      expr: Sizzle.selectors,
      unique: Sizzle.uniqueSort,
      text: Sizzle.getText,
      contains: Sizzle.contains,
      filter: function (expr, elems, not) {
        var i = elems.length;
        if (not) {
          expr = ':not(' + expr + ')';
        }
        while (i--) {
          if (elems[i].nodeType !== 1) {
            elems.splice(i, 1);
          }
        }
        if (elems.length === 1) {
          elems = DomQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [];
        } else {
          elems = DomQuery.find.matches(expr, elems);
        }
        return elems;
      }
    });
    var dir = function (el, prop, until) {
      var matched = [];
      var cur = el[prop];
      if (typeof until !== 'string' && until instanceof DomQuery) {
        until = until[0];
      }
      while (cur && cur.nodeType !== 9) {
        if (until !== undefined) {
          if (cur === until) {
            break;
          }
          if (typeof until === 'string' && DomQuery(cur).is(until)) {
            break;
          }
        }
        if (cur.nodeType === 1) {
          matched.push(cur);
        }
        cur = cur[prop];
      }
      return matched;
    };
    var sibling = function (node, siblingName, nodeType, until) {
      var result = [];
      if (until instanceof DomQuery) {
        until = until[0];
      }
      for (; node; node = node[siblingName]) {
        if (nodeType && node.nodeType !== nodeType) {
          continue;
        }
        if (until !== undefined) {
          if (node === until) {
            break;
          }
          if (typeof until === 'string' && DomQuery(node).is(until)) {
            break;
          }
        }
        result.push(node);
      }
      return result;
    };
    var firstSibling = function (node, siblingName, nodeType) {
      for (node = node[siblingName]; node; node = node[siblingName]) {
        if (node.nodeType === nodeType) {
          return node;
        }
      }
      return null;
    };
    each$2({
      parent: function (node) {
        var parent$$1 = node.parentNode;
        return parent$$1 && parent$$1.nodeType !== 11 ? parent$$1 : null;
      },
      parents: function (node) {
        return dir(node, 'parentNode');
      },
      next: function (node) {
        return firstSibling(node, 'nextSibling', 1);
      },
      prev: function (node) {
        return firstSibling(node, 'previousSibling', 1);
      },
      children: function (node) {
        return sibling(node.firstChild, 'nextSibling', 1);
      },
      contents: function (node) {
        return Tools.toArray((node.nodeName === 'iframe' ? node.contentDocument || node.contentWindow.document : node).childNodes);
      }
    }, function (name$$1, fn) {
      DomQuery.fn[name$$1] = function (selector) {
        var self$$1 = this;
        var result = [];
        self$$1.each(function () {
          var nodes = fn.call(result, this, selector, result);
          if (nodes) {
            if (DomQuery.isArray(nodes)) {
              result.push.apply(result, nodes);
            } else {
              result.push(nodes);
            }
          }
        });
        if (this.length > 1) {
          if (!skipUniques[name$$1]) {
            result = DomQuery.unique(result);
          }
          if (name$$1.indexOf('parents') === 0) {
            result = result.reverse();
          }
        }
        result = DomQuery(result);
        if (selector) {
          return result.filter(selector);
        }
        return result;
      };
    });
    each$2({
      parentsUntil: function (node, until) {
        return dir(node, 'parentNode', until);
      },
      nextUntil: function (node, until) {
        return sibling(node, 'nextSibling', 1, until).slice(1);
      },
      prevUntil: function (node, until) {
        return sibling(node, 'previousSibling', 1, until).slice(1);
      }
    }, function (name$$1, fn) {
      DomQuery.fn[name$$1] = function (selector, filter) {
        var self$$1 = this;
        var result = [];
        self$$1.each(function () {
          var nodes = fn.call(result, this, selector, result);
          if (nodes) {
            if (DomQuery.isArray(nodes)) {
              result.push.apply(result, nodes);
            } else {
              result.push(nodes);
            }
          }
        });
        if (this.length > 1) {
          result = DomQuery.unique(result);
          if (name$$1.indexOf('parents') === 0 || name$$1 === 'prevUntil') {
            result = result.reverse();
          }
        }
        result = DomQuery(result);
        if (filter) {
          return result.filter(filter);
        }
        return result;
      };
    });
    DomQuery.fn.is = function (selector) {
      return !!selector && this.filter(selector).length > 0;
    };
    DomQuery.fn.init.prototype = DomQuery.fn;
    DomQuery.overrideDefaults = function (callback) {
      var defaults;
      var sub = function (selector, context) {
        defaults = defaults || callback();
        if (arguments.length === 0) {
          selector = defaults.element;
        }
        if (!context) {
          context = defaults.context;
        }
        return new sub.fn.init(selector, context);
      };
      DomQuery.extend(sub, this);
      return sub;
    };
    var appendHooks = function (targetHooks, prop, hooks) {
      each$2(hooks, function (name$$1, func) {
        targetHooks[name$$1] = targetHooks[name$$1] || {};
        targetHooks[name$$1][prop] = func;
      });
    };
    if (Env.ie && Env.ie < 8) {
      appendHooks(attrHooks, 'get', {
        maxlength: function (elm) {
          var value = elm.maxLength;
          if (value === 2147483647) {
            return undefined;
          }
          return value;
        },
        size: function (elm) {
          var value = elm.size;
          if (value === 20) {
            return undefined;
          }
          return value;
        },
        class: function (elm) {
          return elm.className;
        },
        style: function (elm) {
          var value = elm.style.cssText;
          if (value.length === 0) {
            return undefined;
          }
          return value;
        }
      });
      appendHooks(attrHooks, 'set', {
        class: function (elm, value) {
          elm.className = value;
        },
        style: function (elm, value) {
          elm.style.cssText = value;
        }
      });
    }
    if (Env.ie && Env.ie < 9) {
      cssFix.float = 'styleFloat';
      appendHooks(cssHooks, 'set', {
        opacity: function (elm, value) {
          var style = elm.style;
          if (value === null || value === '') {
            style.removeAttribute('filter');
          } else {
            style.zoom = 1;
            style.filter = 'alpha(opacity=' + value * 100 + ')';
          }
        }
      });
    }
    DomQuery.attrHooks = attrHooks;
    DomQuery.cssHooks = cssHooks;

    var cached = function (f) {
      var called = false;
      var r;
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (!called) {
          called = true;
          r = f.apply(null, args);
        }
        return r;
      };
    };

    var firstMatch = function (regexes, s) {
      for (var i = 0; i < regexes.length; i++) {
        var x = regexes[i];
        if (x.test(s))
          return x;
      }
      return undefined;
    };
    var find$2 = function (regexes, agent) {
      var r = firstMatch(regexes, agent);
      if (!r)
        return {
          major: 0,
          minor: 0
        };
      var group = function (i) {
        return Number(agent.replace(r, '$' + i));
      };
      return nu(group(1), group(2));
    };
    var detect = function (versionRegexes, agent) {
      var cleanedAgent = String(agent).toLowerCase();
      if (versionRegexes.length === 0)
        return unknown();
      return find$2(versionRegexes, cleanedAgent);
    };
    var unknown = function () {
      return nu(0, 0);
    };
    var nu = function (major, minor) {
      return {
        major: major,
        minor: minor
      };
    };
    var Version = {
      nu: nu,
      detect: detect,
      unknown: unknown
    };

    var edge = 'Edge';
    var chrome = 'Chrome';
    var ie$1 = 'IE';
    var opera$1 = 'Opera';
    var firefox = 'Firefox';
    var safari = 'Safari';
    var isBrowser = function (name, current) {
      return function () {
        return current === name;
      };
    };
    var unknown$1 = function () {
      return nu$1({
        current: undefined,
        version: Version.unknown()
      });
    };
    var nu$1 = function (info) {
      var current = info.current;
      var version = info.version;
      return {
        current: current,
        version: version,
        isEdge: isBrowser(edge, current),
        isChrome: isBrowser(chrome, current),
        isIE: isBrowser(ie$1, current),
        isOpera: isBrowser(opera$1, current),
        isFirefox: isBrowser(firefox, current),
        isSafari: isBrowser(safari, current)
      };
    };
    var Browser = {
      unknown: unknown$1,
      nu: nu$1,
      edge: constant(edge),
      chrome: constant(chrome),
      ie: constant(ie$1),
      opera: constant(opera$1),
      firefox: constant(firefox),
      safari: constant(safari)
    };

    var windows = 'Windows';
    var ios = 'iOS';
    var android$1 = 'Android';
    var linux = 'Linux';
    var osx = 'OSX';
    var solaris = 'Solaris';
    var freebsd = 'FreeBSD';
    var isOS = function (name, current) {
      return function () {
        return current === name;
      };
    };
    var unknown$2 = function () {
      return nu$2({
        current: undefined,
        version: Version.unknown()
      });
    };
    var nu$2 = function (info) {
      var current = info.current;
      var version = info.version;
      return {
        current: current,
        version: version,
        isWindows: isOS(windows, current),
        isiOS: isOS(ios, current),
        isAndroid: isOS(android$1, current),
        isOSX: isOS(osx, current),
        isLinux: isOS(linux, current),
        isSolaris: isOS(solaris, current),
        isFreeBSD: isOS(freebsd, current)
      };
    };
    var OperatingSystem = {
      unknown: unknown$2,
      nu: nu$2,
      windows: constant(windows),
      ios: constant(ios),
      android: constant(android$1),
      linux: constant(linux),
      osx: constant(osx),
      solaris: constant(solaris),
      freebsd: constant(freebsd)
    };

    var DeviceType = function (os, browser, userAgent) {
      var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
      var isiPhone = os.isiOS() && !isiPad;
      var isAndroid3 = os.isAndroid() && os.version.major === 3;
      var isAndroid4 = os.isAndroid() && os.version.major === 4;
      var isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true;
      var isTouch = os.isiOS() || os.isAndroid();
      var isPhone = isTouch && !isTablet;
      var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
      return {
        isiPad: constant(isiPad),
        isiPhone: constant(isiPhone),
        isTablet: constant(isTablet),
        isPhone: constant(isPhone),
        isTouch: constant(isTouch),
        isAndroid: os.isAndroid,
        isiOS: os.isiOS,
        isWebView: constant(iOSwebview)
      };
    };

    var detect$1 = function (candidates, userAgent) {
      var agent = String(userAgent).toLowerCase();
      return find(candidates, function (candidate) {
        return candidate.search(agent);
      });
    };
    var detectBrowser = function (browsers, userAgent) {
      return detect$1(browsers, userAgent).map(function (browser) {
        var version = Version.detect(browser.versionRegexes, userAgent);
        return {
          current: browser.name,
          version: version
        };
      });
    };
    var detectOs = function (oses, userAgent) {
      return detect$1(oses, userAgent).map(function (os) {
        var version = Version.detect(os.versionRegexes, userAgent);
        return {
          current: os.name,
          version: version
        };
      });
    };
    var UaString = {
      detectBrowser: detectBrowser,
      detectOs: detectOs
    };

    var contains$2 = function (str, substr) {
      return str.indexOf(substr) !== -1;
    };
    var trim$2 = function (str) {
      return str.replace(/^\s+|\s+$/g, '');
    };
    var lTrim = function (str) {
      return str.replace(/^\s+/g, '');
    };
    var rTrim = function (str) {
      return str.replace(/\s+$/g, '');
    };

    var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    var checkContains = function (target) {
      return function (uastring) {
        return contains$2(uastring, target);
      };
    };
    var browsers = [
      {
        name: 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: function (uastring) {
          var monstrosity = contains$2(uastring, 'edge/') && contains$2(uastring, 'chrome') && contains$2(uastring, 'safari') && contains$2(uastring, 'applewebkit');
          return monstrosity;
        }
      },
      {
        name: 'Chrome',
        versionRegexes: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalVersionRegex
        ],
        search: function (uastring) {
          return contains$2(uastring, 'chrome') && !contains$2(uastring, 'chromeframe');
        }
      },
      {
        name: 'IE',
        versionRegexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/
        ],
        search: function (uastring) {
          return contains$2(uastring, 'msie') || contains$2(uastring, 'trident');
        }
      },
      {
        name: 'Opera',
        versionRegexes: [
          normalVersionRegex,
          /.*?opera\/([0-9]+)\.([0-9]+).*/
        ],
        search: checkContains('opera')
      },
      {
        name: 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkContains('firefox')
      },
      {
        name: 'Safari',
        versionRegexes: [
          normalVersionRegex,
          /.*?cpu os ([0-9]+)_([0-9]+).*/
        ],
        search: function (uastring) {
          return (contains$2(uastring, 'safari') || contains$2(uastring, 'mobile/')) && contains$2(uastring, 'applewebkit');
        }
      }
    ];
    var oses = [
      {
        name: 'Windows',
        search: checkContains('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'iOS',
        search: function (uastring) {
          return contains$2(uastring, 'iphone') || contains$2(uastring, 'ipad');
        },
        versionRegexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/
        ]
      },
      {
        name: 'Android',
        search: checkContains('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'OSX',
        search: checkContains('os x'),
        versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'Linux',
        search: checkContains('linux'),
        versionRegexes: []
      },
      {
        name: 'Solaris',
        search: checkContains('sunos'),
        versionRegexes: []
      },
      {
        name: 'FreeBSD',
        search: checkContains('freebsd'),
        versionRegexes: []
      }
    ];
    var PlatformInfo = {
      browsers: constant(browsers),
      oses: constant(oses)
    };

    var detect$2 = function (userAgent) {
      var browsers = PlatformInfo.browsers();
      var oses = PlatformInfo.oses();
      var browser = UaString.detectBrowser(browsers, userAgent).fold(Browser.unknown, Browser.nu);
      var os = UaString.detectOs(oses, userAgent).fold(OperatingSystem.unknown, OperatingSystem.nu);
      var deviceType = DeviceType(os, browser, userAgent);
      return {
        browser: browser,
        os: os,
        deviceType: deviceType
      };
    };
    var PlatformDetection = { detect: detect$2 };

    var detect$3 = cached(function () {
      var userAgent = navigator.userAgent;
      return PlatformDetection.detect(userAgent);
    });
    var PlatformDetection$1 = { detect: detect$3 };

    var fromHtml = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        console.error('HTML does not have a single root node', html);
        throw 'HTML must have a single root node';
      }
      return fromDom(div.childNodes[0]);
    };
    var fromTag = function (tag, scope) {
      var doc = scope || document;
      var node = doc.createElement(tag);
      return fromDom(node);
    };
    var fromText = function (text, scope) {
      var doc = scope || document;
      var node = doc.createTextNode(text);
      return fromDom(node);
    };
    var fromDom = function (node) {
      if (node === null || node === undefined)
        throw new Error('Node cannot be null or undefined');
      return { dom: constant(node) };
    };
    var fromPoint = function (docElm, x, y) {
      var doc = docElm.dom();
      return Option.from(doc.elementFromPoint(x, y)).map(fromDom);
    };
    var Element$$1 = {
      fromHtml: fromHtml,
      fromTag: fromTag,
      fromText: fromText,
      fromDom: fromDom,
      fromPoint: fromPoint
    };

    var ATTRIBUTE = Node.ATTRIBUTE_NODE;
    var CDATA_SECTION = Node.CDATA_SECTION_NODE;
    var COMMENT = Node.COMMENT_NODE;
    var DOCUMENT = Node.DOCUMENT_NODE;
    var DOCUMENT_TYPE = Node.DOCUMENT_TYPE_NODE;
    var DOCUMENT_FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE;
    var ELEMENT = Node.ELEMENT_NODE;
    var TEXT = Node.TEXT_NODE;
    var PROCESSING_INSTRUCTION = Node.PROCESSING_INSTRUCTION_NODE;
    var ENTITY_REFERENCE = Node.ENTITY_REFERENCE_NODE;
    var ENTITY = Node.ENTITY_NODE;
    var NOTATION = Node.NOTATION_NODE;

    var name = function (element) {
      var r = element.dom().nodeName;
      return r.toLowerCase();
    };
    var type = function (element) {
      return element.dom().nodeType;
    };
    var isType$1 = function (t) {
      return function (element) {
        return type(element) === t;
      };
    };
    var isElement = isType$1(ELEMENT);
    var isText = isType$1(TEXT);

    var keys = Object.keys;
    var hasOwnProperty$1 = Object.hasOwnProperty;
    var each$3 = function (obj, f) {
      var props = keys(obj);
      for (var k = 0, len = props.length; k < len; k++) {
        var i = props[k];
        var x = obj[i];
        f(x, i, obj);
      }
    };
    var map$2 = function (obj, f) {
      return tupleMap(obj, function (x, i, obj) {
        return {
          k: i,
          v: f(x, i, obj)
        };
      });
    };
    var tupleMap = function (obj, f) {
      var r = {};
      each$3(obj, function (x, i) {
        var tuple = f(x, i, obj);
        r[tuple.k] = tuple.v;
      });
      return r;
    };
    var bifilter = function (obj, pred) {
      var t = {};
      var f = {};
      each$3(obj, function (x, i) {
        var branch = pred(x, i) ? t : f;
        branch[i] = x;
      });
      return {
        t: t,
        f: f
      };
    };
    var has = function (obj, key) {
      return hasOwnProperty$1.call(obj, key);
    };

    var rawSet = function (dom, key, value$$1) {
      if (isString(value$$1) || isBoolean(value$$1) || isNumber(value$$1)) {
        dom.setAttribute(key, value$$1 + '');
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value$$1, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };
    var set = function (element, key, value$$1) {
      rawSet(element.dom(), key, value$$1);
    };
    var setAll = function (element, attrs) {
      var dom = element.dom();
      each$3(attrs, function (v, k) {
        rawSet(dom, k, v);
      });
    };
    var get$1 = function (element, key) {
      var v = element.dom().getAttribute(key);
      return v === null ? undefined : v;
    };
    var has$1 = function (element, key) {
      var dom = element.dom();
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };
    var remove = function (element, key) {
      element.dom().removeAttribute(key);
    };

    var inBody = function (element) {
      var dom = isText(element) ? element.dom().parentNode : element.dom();
      return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
    };

    var isSupported = function (dom) {
      return dom.style !== undefined;
    };

    var internalSet = function (dom, property, value$$1) {
      if (!isString(value$$1)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value$$1, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value$$1);
      }
      if (isSupported(dom))
        dom.style.setProperty(property, value$$1);
    };
    var setAll$1 = function (element, css) {
      var dom = element.dom();
      each$3(css, function (v, k) {
        internalSet(dom, k, v);
      });
    };
    var get$2 = function (element, property) {
      var dom = element.dom();
      var styles = window.getComputedStyle(dom);
      var r = styles.getPropertyValue(property);
      var v = r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r;
      return v === null ? undefined : v;
    };
    var getUnsafeProperty = function (dom, property) {
      return isSupported(dom) ? dom.style.getPropertyValue(property) : '';
    };
    var getRaw = function (element, property) {
      var dom = element.dom();
      var raw = getUnsafeProperty(dom, property);
      return Option.from(raw).filter(function (r) {
        return r.length > 0;
      });
    };

    var Immutable = function () {
      var fields = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i];
      }
      return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          values[_i] = arguments[_i];
        }
        if (fields.length !== values.length) {
          throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
        }
        var struct = {};
        each(fields, function (name, i) {
          struct[name] = constant(values[i]);
        });
        return struct;
      };
    };

    var toArray$1 = function (target, f) {
      var r = [];
      var recurse = function (e) {
        r.push(e);
        return f(e);
      };
      var cur = f(target);
      do {
        cur = cur.bind(recurse);
      } while (cur.isSome());
      return r;
    };
    var Recurse = { toArray: toArray$1 };

    var node = function () {
      var f = Global$1.getOrDie('Node');
      return f;
    };
    var compareDocumentPosition = function (a, b, match) {
      return (a.compareDocumentPosition(b) & match) !== 0;
    };
    var documentPositionPreceding = function (a, b) {
      return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
    };
    var documentPositionContainedBy = function (a, b) {
      return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
    };
    var Node$1 = {
      documentPositionPreceding: documentPositionPreceding,
      documentPositionContainedBy: documentPositionContainedBy
    };

    var ELEMENT$1 = ELEMENT;
    var DOCUMENT$1 = DOCUMENT;
    var is$1 = function (element, selector) {
      var elem = element.dom();
      if (elem.nodeType !== ELEMENT$1)
        return false;
      else if (elem.matches !== undefined)
        return elem.matches(selector);
      else if (elem.msMatchesSelector !== undefined)
        return elem.msMatchesSelector(selector);
      else if (elem.webkitMatchesSelector !== undefined)
        return elem.webkitMatchesSelector(selector);
      else if (elem.mozMatchesSelector !== undefined)
        return elem.mozMatchesSelector(selector);
      else
        throw new Error('Browser lacks native selectors');
    };
    var bypassSelector = function (dom) {
      return dom.nodeType !== ELEMENT$1 && dom.nodeType !== DOCUMENT$1 || dom.childElementCount === 0;
    };
    var all = function (selector, scope) {
      var base = scope === undefined ? document : scope.dom();
      return bypassSelector(base) ? [] : map(base.querySelectorAll(selector), Element$$1.fromDom);
    };
    var one = function (selector, scope) {
      var base = scope === undefined ? document : scope.dom();
      return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element$$1.fromDom);
    };

    var eq = function (e1, e2) {
      return e1.dom() === e2.dom();
    };
    var regularContains = function (e1, e2) {
      var d1 = e1.dom(), d2 = e2.dom();
      return d1 === d2 ? false : d1.contains(d2);
    };
    var ieContains = function (e1, e2) {
      return Node$1.documentPositionContainedBy(e1.dom(), e2.dom());
    };
    var browser = PlatformDetection$1.detect().browser;
    var contains$3 = browser.isIE() ? ieContains : regularContains;

    var owner = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument);
    };
    var documentElement = function (element) {
      return Element$$1.fromDom(element.dom().ownerDocument.documentElement);
    };
    var defaultView = function (element) {
      var el = element.dom();
      var defaultView = el.ownerDocument.defaultView;
      return Element$$1.fromDom(defaultView);
    };
    var parent = function (element) {
      var dom = element.dom();
      return Option.from(dom.parentNode).map(Element$$1.fromDom);
    };
    var parents = function (element, isRoot) {
      var stop = isFunction(isRoot) ? isRoot : constant(false);
      var dom = element.dom();
      var ret = [];
      while (dom.parentNode !== null && dom.parentNode !== undefined) {
        var rawParent = dom.parentNode;
        var parent = Element$$1.fromDom(rawParent);
        ret.push(parent);
        if (stop(parent) === true)
          break;
        else
          dom = rawParent;
      }
      return ret;
    };
    var prevSibling = function (element) {
      var dom = element.dom();
      return Option.from(dom.previousSibling).map(Element$$1.fromDom);
    };
    var nextSibling = function (element) {
      var dom = element.dom();
      return Option.from(dom.nextSibling).map(Element$$1.fromDom);
    };
    var prevSiblings = function (element) {
      return reverse(Recurse.toArray(element, prevSibling));
    };
    var nextSiblings = function (element) {
      return Recurse.toArray(element, nextSibling);
    };
    var children = function (element) {
      var dom = element.dom();
      return map(dom.childNodes, Element$$1.fromDom);
    };
    var child = function (element, index) {
      var children = element.dom().childNodes;
      return Option.from(children[index]).map(Element$$1.fromDom);
    };
    var firstChild = function (element) {
      return child(element, 0);
    };
    var lastChild = function (element) {
      return child(element, element.dom().childNodes.length - 1);
    };
    var childNodesCount = function (element) {
      return element.dom().childNodes.length;
    };
    var spot = Immutable('element', 'offset');

    var browser$1 = PlatformDetection$1.detect().browser;
    var firstElement = function (nodes) {
      return find(nodes, isElement);
    };
    var getTableCaptionDeltaY = function (elm) {
      if (browser$1.isFirefox() && name(elm) === 'table') {
        return firstElement(children(elm)).filter(function (elm) {
          return name(elm) === 'caption';
        }).bind(function (caption) {
          return firstElement(nextSiblings(caption)).map(function (body) {
            var bodyTop = body.dom().offsetTop;
            var captionTop = caption.dom().offsetTop;
            var captionHeight = caption.dom().offsetHeight;
            return bodyTop <= captionTop ? -captionHeight : 0;
          });
        }).getOr(0);
      } else {
        return 0;
      }
    };
    var getPos = function (body, elm, rootElm) {
      var x = 0, y = 0, offsetParent$$1;
      var doc = body.ownerDocument;
      var pos;
      rootElm = rootElm ? rootElm : body;
      if (elm) {
        if (rootElm === body && elm.getBoundingClientRect && get$2(Element$$1.fromDom(body), 'position') === 'static') {
          pos = elm.getBoundingClientRect();
          x = pos.left + (doc.documentElement.scrollLeft || body.scrollLeft) - doc.documentElement.clientLeft;
          y = pos.top + (doc.documentElement.scrollTop || body.scrollTop) - doc.documentElement.clientTop;
          return {
            x: x,
            y: y
          };
        }
        offsetParent$$1 = elm;
        while (offsetParent$$1 && offsetParent$$1 !== rootElm && offsetParent$$1.nodeType) {
          x += offsetParent$$1.offsetLeft || 0;
          y += offsetParent$$1.offsetTop || 0;
          offsetParent$$1 = offsetParent$$1.offsetParent;
        }
        offsetParent$$1 = elm.parentNode;
        while (offsetParent$$1 && offsetParent$$1 !== rootElm && offsetParent$$1.nodeType) {
          x -= offsetParent$$1.scrollLeft || 0;
          y -= offsetParent$$1.scrollTop || 0;
          offsetParent$$1 = offsetParent$$1.parentNode;
        }
        y += getTableCaptionDeltaY(Element$$1.fromDom(elm));
      }
      return {
        x: x,
        y: y
      };
    };
    var Position = { getPos: getPos };

    var nu$3 = function (baseFn) {
      var data = Option.none();
      var callbacks = [];
      var map$$1 = function (f) {
        return nu$3(function (nCallback) {
          get(function (data) {
            nCallback(f(data));
          });
        });
      };
      var get = function (nCallback) {
        if (isReady())
          call(nCallback);
        else
          callbacks.push(nCallback);
      };
      var set = function (x) {
        data = Option.some(x);
        run(callbacks);
        callbacks = [];
      };
      var isReady = function () {
        return data.isSome();
      };
      var run = function (cbs) {
        each(cbs, call);
      };
      var call = function (cb) {
        data.each(function (x) {
          setTimeout(function () {
            cb(x);
          }, 0);
        });
      };
      baseFn(set);
      return {
        get: get,
        map: map$$1,
        isReady: isReady
      };
    };
    var pure$1 = function (a) {
      return nu$3(function (callback) {
        callback(a);
      });
    };
    var LazyValue = {
      nu: nu$3,
      pure: pure$1
    };

    var bounce = function (f) {
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var me = this;
        setTimeout(function () {
          f.apply(me, args);
        }, 0);
      };
    };

    var nu$4 = function (baseFn) {
      var get = function (callback) {
        baseFn(bounce(callback));
      };
      var map = function (fab) {
        return nu$4(function (callback) {
          get(function (a) {
            var value = fab(a);
            callback(value);
          });
        });
      };
      var bind = function (aFutureB) {
        return nu$4(function (callback) {
          get(function (a) {
            aFutureB(a).get(callback);
          });
        });
      };
      var anonBind = function (futureB) {
        return nu$4(function (callback) {
          get(function (a) {
            futureB.get(callback);
          });
        });
      };
      var toLazy = function () {
        return LazyValue.nu(get);
      };
      var toCached = function () {
        var cache = null;
        return nu$4(function (callback) {
          if (cache === null) {
            cache = toLazy();
          }
          cache.get(callback);
        });
      };
      return {
        map: map,
        bind: bind,
        anonBind: anonBind,
        toLazy: toLazy,
        toCached: toCached,
        get: get
      };
    };
    var pure$2 = function (a) {
      return nu$4(function (callback) {
        callback(a);
      });
    };
    var Future = {
      nu: nu$4,
      pure: pure$2
    };

    var par = function (asyncValues, nu) {
      return nu(function (callback) {
        var r = [];
        var count = 0;
        var cb = function (i) {
          return function (value) {
            r[i] = value;
            count++;
            if (count >= asyncValues.length) {
              callback(r);
            }
          };
        };
        if (asyncValues.length === 0) {
          callback([]);
        } else {
          each(asyncValues, function (asyncValue, i) {
            asyncValue.get(cb(i));
          });
        }
      });
    };

    var par$1 = function (futures) {
      return par(futures, Future.nu);
    };

    var value$1 = function (o) {
      var is = function (v) {
        return o === v;
      };
      var or = function (opt) {
        return value$1(o);
      };
      var orThunk = function (f) {
        return value$1(o);
      };
      var map = function (f) {
        return value$1(f(o));
      };
      var each = function (f) {
        f(o);
      };
      var bind = function (f) {
        return f(o);
      };
      var fold = function (_, onValue) {
        return onValue(o);
      };
      var exists = function (f) {
        return f(o);
      };
      var forall = function (f) {
        return f(o);
      };
      var toOption = function () {
        return Option.some(o);
      };
      return {
        is: is,
        isValue: always,
        isError: never,
        getOr: constant(o),
        getOrThunk: constant(o),
        getOrDie: constant(o),
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: each,
        bind: bind,
        exists: exists,
        forall: forall,
        toOption: toOption
      };
    };
    var error = function (message) {
      var getOrThunk = function (f) {
        return f();
      };
      var getOrDie = function () {
        return die(String(message))();
      };
      var or = function (opt) {
        return opt;
      };
      var orThunk = function (f) {
        return f();
      };
      var map = function (f) {
        return error(message);
      };
      var bind = function (f) {
        return error(message);
      };
      var fold = function (onError, _) {
        return onError(message);
      };
      return {
        is: never,
        isValue: never,
        isError: always,
        getOr: identity,
        getOrThunk: getOrThunk,
        getOrDie: getOrDie,
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: noop,
        bind: bind,
        exists: never,
        forall: always,
        toOption: Option.none
      };
    };
    var Result = {
      value: value$1,
      error: error
    };

    function StyleSheetLoader(document$$1, settings) {
      if (settings === void 0) {
        settings = {};
      }
      var idCount = 0;
      var loadedStates = {};
      var maxLoadTime;
      maxLoadTime = settings.maxLoadTime || 5000;
      var appendToHead = function (node) {
        document$$1.getElementsByTagName('head')[0].appendChild(node);
      };
      var load = function (url, loadedCallback, errorCallback) {
        var link, style, startTime, state;
        var passed = function () {
          var callbacks = state.passed;
          var i = callbacks.length;
          while (i--) {
            callbacks[i]();
          }
          state.status = 2;
          state.passed = [];
          state.failed = [];
        };
        var failed = function () {
          var callbacks = state.failed;
          var i = callbacks.length;
          while (i--) {
            callbacks[i]();
          }
          state.status = 3;
          state.passed = [];
          state.failed = [];
        };
        var isOldWebKit = function () {
          var webKitChunks = navigator.userAgent.match(/WebKit\/(\d*)/);
          return !!(webKitChunks && parseInt(webKitChunks[1], 10) < 536);
        };
        var wait = function (testCallback, waitCallback) {
          if (!testCallback()) {
            if (new Date().getTime() - startTime < maxLoadTime) {
              Delay.setTimeout(waitCallback);
            } else {
              failed();
            }
          }
        };
        var waitForWebKitLinkLoaded = function () {
          wait(function () {
            var styleSheets = document$$1.styleSheets;
            var styleSheet, i = styleSheets.length, owner;
            while (i--) {
              styleSheet = styleSheets[i];
              owner = styleSheet.ownerNode ? styleSheet.ownerNode : styleSheet.owningElement;
              if (owner && owner.id === link.id) {
                passed();
                return true;
              }
            }
          }, waitForWebKitLinkLoaded);
        };
        var waitForGeckoLinkLoaded = function () {
          wait(function () {
            try {
              var cssRules = style.sheet.cssRules;
              passed();
              return !!cssRules;
            } catch (ex) {
            }
          }, waitForGeckoLinkLoaded);
        };
        url = Tools._addCacheSuffix(url);
        if (!loadedStates[url]) {
          state = {
            passed: [],
            failed: []
          };
          loadedStates[url] = state;
        } else {
          state = loadedStates[url];
        }
        if (loadedCallback) {
          state.passed.push(loadedCallback);
        }
        if (errorCallback) {
          state.failed.push(errorCallback);
        }
        if (state.status === 1) {
          return;
        }
        if (state.status === 2) {
          passed();
          return;
        }
        if (state.status === 3) {
          failed();
          return;
        }
        state.status = 1;
        link = document$$1.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.id = 'u' + idCount++;
        link.async = false;
        link.defer = false;
        startTime = new Date().getTime();
        if (settings.contentCssCors) {
          link.crossOrigin = 'anonymous';
        }
        if ('onload' in link && !isOldWebKit()) {
          link.onload = waitForWebKitLinkLoaded;
          link.onerror = failed;
        } else {
          if (navigator.userAgent.indexOf('Firefox') > 0) {
            style = document$$1.createElement('style');
            style.textContent = '@import "' + url + '"';
            waitForGeckoLinkLoaded();
            appendToHead(style);
            return;
          }
          waitForWebKitLinkLoaded();
        }
        appendToHead(link);
        link.href = url;
      };
      var loadF = function (url) {
        return Future.nu(function (resolve) {
          load(url, compose(resolve, constant(Result.value(url))), compose(resolve, constant(Result.error(url))));
        });
      };
      var unbox = function (result) {
        return result.fold(identity, identity);
      };
      var loadAll = function (urls, success, failure) {
        par$1(map(urls, loadF)).get(function (result) {
          var parts = partition(result, function (r) {
            return r.isValue();
          });
          if (parts.fail.length > 0) {
            failure(parts.fail.map(unbox));
          } else {
            success(parts.pass.map(unbox));
          }
        });
      };
      return {
        load: load,
        loadAll: loadAll
      };
    }

    function TreeWalker (startNode, rootNode) {
      var node = startNode;
      var findSibling = function (node, startName, siblingName, shallow) {
        var sibling, parent;
        if (node) {
          if (!shallow && node[startName]) {
            return node[startName];
          }
          if (node !== rootNode) {
            sibling = node[siblingName];
            if (sibling) {
              return sibling;
            }
            for (parent = node.parentNode; parent && parent !== rootNode; parent = parent.parentNode) {
              sibling = parent[siblingName];
              if (sibling) {
                return sibling;
              }
            }
          }
        }
      };
      var findPreviousNode = function (node, startName, siblingName, shallow) {
        var sibling, parent, child;
        if (node) {
          sibling = node[siblingName];
          if (rootNode && sibling === rootNode) {
            return;
          }
          if (sibling) {
            if (!shallow) {
              for (child = sibling[startName]; child; child = child[startName]) {
                if (!child[startName]) {
                  return child;
                }
              }
            }
            return sibling;
          }
          parent = node.parentNode;
          if (parent && parent !== rootNode) {
            return parent;
          }
        }
      };
      this.current = function () {
        return node;
      };
      this.next = function (shallow) {
        node = findSibling(node, 'firstChild', 'nextSibling', shallow);
        return node;
      };
      this.prev = function (shallow) {
        node = findSibling(node, 'lastChild', 'previousSibling', shallow);
        return node;
      };
      this.prev2 = function (shallow) {
        node = findPreviousNode(node, 'lastChild', 'previousSibling', shallow);
        return node;
      };
    }

    var blocks = [
      'article',
      'aside',
      'details',
      'div',
      'dt',
      'figcaption',
      'footer',
      'form',
      'fieldset',
      'header',
      'hgroup',
      'html',
      'main',
      'nav',
      'section',
      'summary',
      'body',
      'p',
      'dl',
      'multicol',
      'dd',
      'figure',
      'address',
      'center',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'listing',
      'xmp',
      'pre',
      'plaintext',
      'menu',
      'dir',
      'ul',
      'ol',
      'li',
      'hr',
      'table',
      'tbody',
      'thead',
      'tfoot',
      'th',
      'tr',
      'td',
      'caption'
    ];
    var voids = [
      'area',
      'base',
      'basefont',
      'br',
      'col',
      'frame',
      'hr',
      'img',
      'input',
      'isindex',
      'link',
      'meta',
      'param',
      'embed',
      'source',
      'wbr',
      'track'
    ];
    var tableCells = [
      'td',
      'th'
    ];
    var tableSections = [
      'thead',
      'tbody',
      'tfoot'
    ];
    var textBlocks = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'div',
      'address',
      'pre',
      'form',
      'blockquote',
      'center',
      'dir',
      'fieldset',
      'header',
      'footer',
      'article',
      'section',
      'hgroup',
      'aside',
      'nav',
      'figure'
    ];
    var headings = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ];
    var listItems = [
      'li',
      'dd',
      'dt'
    ];
    var lists = [
      'ul',
      'ol',
      'dl'
    ];
    var wsElements = [
      'pre',
      'script',
      'textarea',
      'style'
    ];
    var lazyLookup = function (items) {
      var lookup;
      return function (node) {
        lookup = lookup ? lookup : mapToObject(items, constant(true));
        return lookup.hasOwnProperty(name(node));
      };
    };
    var isHeading = lazyLookup(headings);
    var isBlock = lazyLookup(blocks);
    var isInline = function (node) {
      return isElement(node) && !isBlock(node);
    };
    var isBr = function (node) {
      return isElement(node) && name(node) === 'br';
    };
    var isTextBlock = lazyLookup(textBlocks);
    var isList = lazyLookup(lists);
    var isListItem = lazyLookup(listItems);
    var isVoid = lazyLookup(voids);
    var isTableSection = lazyLookup(tableSections);
    var isTableCell = lazyLookup(tableCells);
    var isWsPreserveElement = lazyLookup(wsElements);

    var isNodeType = function (type) {
      return function (node) {
        return !!node && node.nodeType === type;
      };
    };
    var isElement$1 = isNodeType(1);
    var matchNodeNames = function (names) {
      var items = names.toLowerCase().split(' ');
      return function (node) {
        var i, name;
        if (node && node.nodeType) {
          name = node.nodeName.toLowerCase();
          for (i = 0; i < items.length; i++) {
            if (name === items[i]) {
              return true;
            }
          }
        }
        return false;
      };
    };
    var matchStyleValues = function (name, values) {
      var items = values.toLowerCase().split(' ');
      return function (node) {
        var i, cssValue;
        if (isElement$1(node)) {
          for (i = 0; i < items.length; i++) {
            var computed = node.ownerDocument.defaultView.getComputedStyle(node, null);
            cssValue = computed ? computed.getPropertyValue(name) : null;
            if (cssValue === items[i]) {
              return true;
            }
          }
        }
        return false;
      };
    };
    var hasPropValue = function (propName, propValue) {
      return function (node) {
        return isElement$1(node) && node[propName] === propValue;
      };
    };
    var hasAttribute = function (attrName, attrValue) {
      return function (node) {
        return isElement$1(node) && node.hasAttribute(attrName);
      };
    };
    var hasAttributeValue = function (attrName, attrValue) {
      return function (node) {
        return isElement$1(node) && node.getAttribute(attrName) === attrValue;
      };
    };
    var isBogus = function (node) {
      return isElement$1(node) && node.hasAttribute('data-mce-bogus');
    };
    var isBogusAll = function (node) {
      return isElement$1(node) && node.getAttribute('data-mce-bogus') === 'all';
    };
    var isTable = function (node) {
      return isElement$1(node) && node.tagName === 'TABLE';
    };
    var hasContentEditableState = function (value) {
      return function (node) {
        if (isElement$1(node)) {
          if (node.contentEditable === value) {
            return true;
          }
          if (node.getAttribute('data-mce-contenteditable') === value) {
            return true;
          }
        }
        return false;
      };
    };
    var isText$1 = isNodeType(3);
    var isComment$1 = isNodeType(8);
    var isDocument$1 = isNodeType(9);
    var isBr$1 = matchNodeNames('br');
    var isContentEditableTrue = hasContentEditableState('true');
    var isContentEditableFalse = hasContentEditableState('false');
    var NodeType = {
      isText: isText$1,
      isElement: isElement$1,
      isComment: isComment$1,
      isDocument: isDocument$1,
      isBr: isBr$1,
      isContentEditableTrue: isContentEditableTrue,
      isContentEditableFalse: isContentEditableFalse,
      matchNodeNames: matchNodeNames,
      hasPropValue: hasPropValue,
      hasAttribute: hasAttribute,
      hasAttributeValue: hasAttributeValue,
      matchStyleValues: matchStyleValues,
      isBogus: isBogus,
      isBogusAll: isBogusAll,
      isTable: isTable
    };

    var surroundedBySpans = function (node) {
      var previousIsSpan = node.previousSibling && node.previousSibling.nodeName === 'SPAN';
      var nextIsSpan = node.nextSibling && node.nextSibling.nodeName === 'SPAN';
      return previousIsSpan && nextIsSpan;
    };
    var isBookmarkNode = function (node) {
      return node && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark';
    };
    var trimNode = function (dom, node) {
      var i, children = node.childNodes;
      if (NodeType.isElement(node) && isBookmarkNode(node)) {
        return;
      }
      for (i = children.length - 1; i >= 0; i--) {
        trimNode(dom, children[i]);
      }
      if (NodeType.isDocument(node) === false) {
        if (NodeType.isText(node) && node.nodeValue.length > 0) {
          var trimmedLength = Tools.trim(node.nodeValue).length;
          if (dom.isBlock(node.parentNode) || trimmedLength > 0) {
            return;
          }
          if (trimmedLength === 0 && surroundedBySpans(node)) {
            return;
          }
        } else if (NodeType.isElement(node)) {
          children = node.childNodes;
          if (children.length === 1 && isBookmarkNode(children[0])) {
            node.parentNode.insertBefore(children[0], node);
          }
          if (children.length || isVoid(Element$$1.fromDom(node))) {
            return;
          }
        }
        dom.remove(node);
      }
      return node;
    };
    var TrimNode = { trimNode: trimNode };

    var makeMap$1 = Tools.makeMap;
    var namedEntities, baseEntities, reverseEntities;
    var attrsCharsRegExp = /[&<>\"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var rawCharsRegExp = /[<>&\"\']/g;
    var entityRegExp = /&#([a-z0-9]+);?|&([a-z0-9]+);/gi;
    var asciiMap = {
      128: '\u20AC',
      130: '\u201A',
      131: '\u0192',
      132: '\u201E',
      133: '\u2026',
      134: '\u2020',
      135: '\u2021',
      136: '\u02c6',
      137: '\u2030',
      138: '\u0160',
      139: '\u2039',
      140: '\u0152',
      142: '\u017d',
      145: '\u2018',
      146: '\u2019',
      147: '\u201C',
      148: '\u201D',
      149: '\u2022',
      150: '\u2013',
      151: '\u2014',
      152: '\u02DC',
      153: '\u2122',
      154: '\u0161',
      155: '\u203A',
      156: '\u0153',
      158: '\u017e',
      159: '\u0178'
    };
    baseEntities = {
      '"': '&quot;',
      '\'': '&#39;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '`': '&#96;'
    };
    reverseEntities = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': '\''
    };
    var nativeDecode = function (text) {
      var elm;
      elm = Element$$1.fromTag('div').dom();
      elm.innerHTML = text;
      return elm.textContent || elm.innerText || text;
    };
    var buildEntitiesLookup = function (items, radix) {
      var i, chr, entity;
      var lookup = {};
      if (items) {
        items = items.split(',');
        radix = radix || 10;
        for (i = 0; i < items.length; i += 2) {
          chr = String.fromCharCode(parseInt(items[i], radix));
          if (!baseEntities[chr]) {
            entity = '&' + items[i + 1] + ';';
            lookup[chr] = entity;
            lookup[entity] = chr;
          }
        }
        return lookup;
      }
    };
    namedEntities = buildEntitiesLookup('50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' + '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' + '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' + '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' + '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' + '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' + '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' + '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' + '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' + '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' + 'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' + 'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' + 't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' + 'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' + 'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' + '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' + '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' + '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' + '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' + '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' + 'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' + 'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' + 'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' + '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' + '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32);
    var encodeRaw = function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        return baseEntities[chr] || chr;
      });
    };
    var encodeAllRaw = function (text) {
      return ('' + text).replace(rawCharsRegExp, function (chr) {
        return baseEntities[chr] || chr;
      });
    };
    var encodeNumeric = function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        if (chr.length > 1) {
          return '&#' + ((chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536) + ';';
        }
        return baseEntities[chr] || '&#' + chr.charCodeAt(0) + ';';
      });
    };
    var encodeNamed = function (text, attr, entities) {
      entities = entities || namedEntities;
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        return baseEntities[chr] || entities[chr] || chr;
      });
    };
    var getEncodeFunc = function (name, entities) {
      var entitiesMap = buildEntitiesLookup(entities) || namedEntities;
      var encodeNamedAndNumeric = function (text, attr) {
        return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
          if (baseEntities[chr] !== undefined) {
            return baseEntities[chr];
          }
          if (entitiesMap[chr] !== undefined) {
            return entitiesMap[chr];
          }
          if (chr.length > 1) {
            return '&#' + ((chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536) + ';';
          }
          return '&#' + chr.charCodeAt(0) + ';';
        });
      };
      var encodeCustomNamed = function (text, attr) {
        return encodeNamed(text, attr, entitiesMap);
      };
      var nameMap = makeMap$1(name.replace(/\+/g, ','));
      if (nameMap.named && nameMap.numeric) {
        return encodeNamedAndNumeric;
      }
      if (nameMap.named) {
        if (entities) {
          return encodeCustomNamed;
        }
        return encodeNamed;
      }
      if (nameMap.numeric) {
        return encodeNumeric;
      }
      return encodeRaw;
    };
    var decode = function (text) {
      return text.replace(entityRegExp, function (all, numeric) {
        if (numeric) {
          if (numeric.charAt(0).toLowerCase() === 'x') {
            numeric = parseInt(numeric.substr(1), 16);
          } else {
            numeric = parseInt(numeric, 10);
          }
          if (numeric > 65535) {
            numeric -= 65536;
            return String.fromCharCode(55296 + (numeric >> 10), 56320 + (numeric & 1023));
          }
          return asciiMap[numeric] || String.fromCharCode(numeric);
        }
        return reverseEntities[all] || namedEntities[all] || nativeDecode(all);
      });
    };
    var Entities = {
      encodeRaw: encodeRaw,
      encodeAllRaw: encodeAllRaw,
      encodeNumeric: encodeNumeric,
      encodeNamed: encodeNamed,
      getEncodeFunc: getEncodeFunc,
      decode: decode
    };

    var mapCache = {}, dummyObj = {};
    var makeMap$2 = Tools.makeMap, each$4 = Tools.each, extend$1 = Tools.extend, explode$1 = Tools.explode, inArray$1 = Tools.inArray;
    var split = function (items, delim) {
      items = Tools.trim(items);
      return items ? items.split(delim || ' ') : [];
    };
    var compileSchema = function (type) {
      var schema = {};
      var globalAttributes, blockContent;
      var phrasingContent, flowContent, html4BlockContent, html4PhrasingContent;
      var add = function (name, attributes, children) {
        var ni, attributesOrder, element;
        var arrayToMap = function (array, obj) {
          var map = {};
          var i, l;
          for (i = 0, l = array.length; i < l; i++) {
            map[array[i]] = obj || {};
          }
          return map;
        };
        children = children || [];
        attributes = attributes || '';
        if (typeof children === 'string') {
          children = split(children);
        }
        name = split(name);
        ni = name.length;
        while (ni--) {
          attributesOrder = split([
            globalAttributes,
            attributes
          ].join(' '));
          element = {
            attributes: arrayToMap(attributesOrder),
            attributesOrder: attributesOrder,
            children: arrayToMap(children, dummyObj)
          };
          schema[name[ni]] = element;
        }
      };
      var addAttrs = function (name, attributes) {
        var ni, schemaItem, i, l;
        name = split(name);
        ni = name.length;
        attributes = split(attributes);
        while (ni--) {
          schemaItem = schema[name[ni]];
          for (i = 0, l = attributes.length; i < l; i++) {
            schemaItem.attributes[attributes[i]] = {};
            schemaItem.attributesOrder.push(attributes[i]);
          }
        }
      };
      if (mapCache[type]) {
        return mapCache[type];
      }
      globalAttributes = 'id accesskey class dir lang style tabindex title role';
      blockContent = 'address blockquote div dl fieldset form h1 h2 h3 h4 h5 h6 hr menu ol p pre table ul';
      phrasingContent = 'a abbr b bdo br button cite code del dfn em embed i iframe img input ins kbd ' + 'label map noscript object q s samp script select small span strong sub sup ' + 'textarea u var #text #comment';
      if (type !== 'html4') {
        globalAttributes += ' contenteditable contextmenu draggable dropzone ' + 'hidden spellcheck translate';
        blockContent += ' article aside details dialog figure main header footer hgroup section nav';
        phrasingContent += ' audio canvas command datalist mark meter output picture ' + 'progress time wbr video ruby bdi keygen';
      }
      if (type !== 'html5-strict') {
        globalAttributes += ' xml:lang';
        html4PhrasingContent = 'acronym applet basefont big font strike tt';
        phrasingContent = [
          phrasingContent,
          html4PhrasingContent
        ].join(' ');
        each$4(split(html4PhrasingContent), function (name) {
          add(name, '', phrasingContent);
        });
        html4BlockContent = 'center dir isindex noframes';
        blockContent = [
          blockContent,
          html4BlockContent
        ].join(' ');
        flowContent = [
          blockContent,
          phrasingContent
        ].join(' ');
        each$4(split(html4BlockContent), function (name) {
          add(name, '', flowContent);
        });
      }
      flowContent = flowContent || [
        blockContent,
        phrasingContent
      ].join(' ');
      add('html', 'manifest', 'head body');
      add('head', '', 'base command link meta noscript script style title');
      add('title hr noscript br');
      add('base', 'href target');
      add('link', 'href rel media hreflang type sizes hreflang');
      add('meta', 'name http-equiv content charset');
      add('style', 'media type scoped');
      add('script', 'src async defer type charset');
      add('body', 'onafterprint onbeforeprint onbeforeunload onblur onerror onfocus ' + 'onhashchange onload onmessage onoffline ononline onpagehide onpageshow ' + 'onpopstate onresize onscroll onstorage onunload', flowContent);
      add('address dt dd div caption', '', flowContent);
      add('h1 h2 h3 h4 h5 h6 pre p abbr code var samp kbd sub sup i b u bdo span legend em strong small s cite dfn', '', phrasingContent);
      add('blockquote', 'cite', flowContent);
      add('ol', 'reversed start type', 'li');
      add('ul', '', 'li');
      add('li', 'value', flowContent);
      add('dl', '', 'dt dd');
      add('a', 'href target rel media hreflang type', phrasingContent);
      add('q', 'cite', phrasingContent);
      add('ins del', 'cite datetime', flowContent);
      add('img', 'src sizes srcset alt usemap ismap width height');
      add('iframe', 'src name width height', flowContent);
      add('embed', 'src type width height');
      add('object', 'data type typemustmatch name usemap form width height', [
        flowContent,
        'param'
      ].join(' '));
      add('param', 'name value');
      add('map', 'name', [
        flowContent,
        'area'
      ].join(' '));
      add('area', 'alt coords shape href target rel media hreflang type');
      add('table', 'border', 'caption colgroup thead tfoot tbody tr' + (type === 'html4' ? ' col' : ''));
      add('colgroup', 'span', 'col');
      add('col', 'span');
      add('tbody thead tfoot', '', 'tr');
      add('tr', '', 'td th');
      add('td', 'colspan rowspan headers', flowContent);
      add('th', 'colspan rowspan headers scope abbr', flowContent);
      add('form', 'accept-charset action autocomplete enctype method name novalidate target', flowContent);
      add('fieldset', 'disabled form name', [
        flowContent,
        'legend'
      ].join(' '));
      add('label', 'form for', phrasingContent);
      add('input', 'accept alt autocomplete checked dirname disabled form formaction formenctype formmethod formnovalidate ' + 'formtarget height list max maxlength min multiple name pattern readonly required size src step type value width');
      add('button', 'disabled form formaction formenctype formmethod formnovalidate formtarget name type value', type === 'html4' ? flowContent : phrasingContent);
      add('select', 'disabled form multiple name required size', 'option optgroup');
      add('optgroup', 'disabled label', 'option');
      add('option', 'disabled label selected value');
      add('textarea', 'cols dirname disabled form maxlength name readonly required rows wrap');
      add('menu', 'type label', [
        flowContent,
        'li'
      ].join(' '));
      add('noscript', '', flowContent);
      if (type !== 'html4') {
        add('wbr');
        add('ruby', '', [
          phrasingContent,
          'rt rp'
        ].join(' '));
        add('figcaption', '', flowContent);
        add('mark rt rp summary bdi', '', phrasingContent);
        add('canvas', 'width height', flowContent);
        add('video', 'src crossorigin poster preload autoplay mediagroup loop ' + 'muted controls width height buffered', [
          flowContent,
          'track source'
        ].join(' '));
        add('audio', 'src crossorigin preload autoplay mediagroup loop muted controls ' + 'buffered volume', [
          flowContent,
          'track source'
        ].join(' '));
        add('picture', '', 'img source');
        add('source', 'src srcset type media sizes');
        add('track', 'kind src srclang label default');
        add('datalist', '', [
          phrasingContent,
          'option'
        ].join(' '));
        add('article section nav aside main header footer', '', flowContent);
        add('hgroup', '', 'h1 h2 h3 h4 h5 h6');
        add('figure', '', [
          flowContent,
          'figcaption'
        ].join(' '));
        add('time', 'datetime', phrasingContent);
        add('dialog', 'open', flowContent);
        add('command', 'type label icon disabled checked radiogroup command');
        add('output', 'for form name', phrasingContent);
        add('progress', 'value max', phrasingContent);
        add('meter', 'value min max low high optimum', phrasingContent);
        add('details', 'open', [
          flowContent,
          'summary'
        ].join(' '));
        add('keygen', 'autofocus challenge disabled form keytype name');
      }
      if (type !== 'html5-strict') {
        addAttrs('script', 'language xml:space');
        addAttrs('style', 'xml:space');
        addAttrs('object', 'declare classid code codebase codetype archive standby align border hspace vspace');
        addAttrs('embed', 'align name hspace vspace');
        addAttrs('param', 'valuetype type');
        addAttrs('a', 'charset name rev shape coords');
        addAttrs('br', 'clear');
        addAttrs('applet', 'codebase archive code object alt name width height align hspace vspace');
        addAttrs('img', 'name longdesc align border hspace vspace');
        addAttrs('iframe', 'longdesc frameborder marginwidth marginheight scrolling align');
        addAttrs('font basefont', 'size color face');
        addAttrs('input', 'usemap align');
        addAttrs('select', 'onchange');
        addAttrs('textarea');
        addAttrs('h1 h2 h3 h4 h5 h6 div p legend caption', 'align');
        addAttrs('ul', 'type compact');
        addAttrs('li', 'type');
        addAttrs('ol dl menu dir', 'compact');
        addAttrs('pre', 'width xml:space');
        addAttrs('hr', 'align noshade size width');
        addAttrs('isindex', 'prompt');
        addAttrs('table', 'summary width frame rules cellspacing cellpadding align bgcolor');
        addAttrs('col', 'width align char charoff valign');
        addAttrs('colgroup', 'width align char charoff valign');
        addAttrs('thead', 'align char charoff valign');
        addAttrs('tr', 'align char charoff valign bgcolor');
        addAttrs('th', 'axis align char charoff valign nowrap bgcolor width height');
        addAttrs('form', 'accept');
        addAttrs('td', 'abbr axis scope align char charoff valign nowrap bgcolor width height');
        addAttrs('tfoot', 'align char charoff valign');
        addAttrs('tbody', 'align char charoff valign');
        addAttrs('area', 'nohref');
        addAttrs('body', 'background bgcolor text link vlink alink');
      }
      if (type !== 'html4') {
        addAttrs('input button select textarea', 'autofocus');
        addAttrs('input textarea', 'placeholder');
        addAttrs('a', 'download');
        addAttrs('link script img', 'crossorigin');
        addAttrs('iframe', 'sandbox seamless allowfullscreen');
      }
      each$4(split('a form meter progress dfn'), function (name) {
        if (schema[name]) {
          delete schema[name].children[name];
        }
      });
      delete schema.caption.children.table;
      delete schema.script;
      mapCache[type] = schema;
      return schema;
    };
    var compileElementMap = function (value, mode) {
      var styles;
      if (value) {
        styles = {};
        if (typeof value === 'string') {
          value = { '*': value };
        }
        each$4(value, function (value, key) {
          styles[key] = styles[key.toUpperCase()] = mode === 'map' ? makeMap$2(value, /[, ]/) : explode$1(value, /[, ]/);
        });
      }
      return styles;
    };
    function Schema(settings) {
      var elements = {};
      var children = {};
      var patternElements = [];
      var validStyles;
      var invalidStyles;
      var schemaItems;
      var whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, validClasses;
      var blockElementsMap, nonEmptyElementsMap, moveCaretBeforeOnEnterElementsMap, textBlockElementsMap, textInlineElementsMap;
      var customElementsMap = {}, specialElements = {};
      var createLookupTable = function (option, defaultValue, extendWith) {
        var value = settings[option];
        if (!value) {
          value = mapCache[option];
          if (!value) {
            value = makeMap$2(defaultValue, ' ', makeMap$2(defaultValue.toUpperCase(), ' '));
            value = extend$1(value, extendWith);
            mapCache[option] = value;
          }
        } else {
          value = makeMap$2(value, /[, ]/, makeMap$2(value.toUpperCase(), /[, ]/));
        }
        return value;
      };
      settings = settings || {};
      schemaItems = compileSchema(settings.schema);
      if (settings.verify_html === false) {
        settings.valid_elements = '*[*]';
      }
      validStyles = compileElementMap(settings.valid_styles);
      invalidStyles = compileElementMap(settings.invalid_styles, 'map');
      validClasses = compileElementMap(settings.valid_classes, 'map');
      whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea video audio iframe object code');
      selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr');
      shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link ' + 'meta param embed source wbr track');
      boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize ' + 'noshade nowrap readonly selected autoplay loop controls');
      nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object ' + 'script pre code', shortEndedElementsMap);
      moveCaretBeforeOnEnterElementsMap = createLookupTable('move_caret_before_on_enter_elements', 'table', nonEmptyElementsMap);
      textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' + 'blockquote center dir fieldset header footer article section hgroup aside main nav figure');
      blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' + 'th tr td li ol ul caption dl dt dd noscript menu isindex option ' + 'datalist select optgroup figcaption details summary', textBlockElementsMap);
      textInlineElementsMap = createLookupTable('text_inline_elements', 'span strong b em i font strike u var cite ' + 'dfn code mark q sup sub samp');
      each$4((settings.special || 'script noscript noframes noembed title style textarea xmp').split(' '), function (name) {
        specialElements[name] = new RegExp('</' + name + '[^>]*>', 'gi');
      });
      var patternToRegExp = function (str) {
        return new RegExp('^' + str.replace(/([?+*])/g, '.$1') + '$');
      };
      var addValidElements = function (validElements) {
        var ei, el, ai, al, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder, prefix, outputName, globalAttributes, globalAttributesOrder, key, value;
        var elementRuleRegExp = /^([#+\-])?([^\[!\/]+)(?:\/([^\[!]+))?(?:(!?)\[([^\]]+)\])?$/, attrRuleRegExp = /^([!\-])?(\w+[\\:]:\w+|[^=:<]+)?(?:([=:<])(.*))?$/, hasPatternsRegExp = /[*?+]/;
        if (validElements) {
          validElements = split(validElements, ',');
          if (elements['@']) {
            globalAttributes = elements['@'].attributes;
            globalAttributesOrder = elements['@'].attributesOrder;
          }
          for (ei = 0, el = validElements.length; ei < el; ei++) {
            matches = elementRuleRegExp.exec(validElements[ei]);
            if (matches) {
              prefix = matches[1];
              elementName = matches[2];
              outputName = matches[3];
              attrData = matches[5];
              attributes = {};
              attributesOrder = [];
              element = {
                attributes: attributes,
                attributesOrder: attributesOrder
              };
              if (prefix === '#') {
                element.paddEmpty = true;
              }
              if (prefix === '-') {
                element.removeEmpty = true;
              }
              if (matches[4] === '!') {
                element.removeEmptyAttrs = true;
              }
              if (globalAttributes) {
                for (key in globalAttributes) {
                  attributes[key] = globalAttributes[key];
                }
                attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
              }
              if (attrData) {
                attrData = split(attrData, '|');
                for (ai = 0, al = attrData.length; ai < al; ai++) {
                  matches = attrRuleRegExp.exec(attrData[ai]);
                  if (matches) {
                    attr = {};
                    attrType = matches[1];
                    attrName = matches[2].replace(/[\\:]:/g, ':');
                    prefix = matches[3];
                    value = matches[4];
                    if (attrType === '!') {
                      element.attributesRequired = element.attributesRequired || [];
                      element.attributesRequired.push(attrName);
                      attr.required = true;
                    }
                    if (attrType === '-') {
                      delete attributes[attrName];
                      attributesOrder.splice(inArray$1(attributesOrder, attrName), 1);
                      continue;
                    }
                    if (prefix) {
                      if (prefix === '=') {
                        element.attributesDefault = element.attributesDefault || [];
                        element.attributesDefault.push({
                          name: attrName,
                          value: value
                        });
                        attr.defaultValue = value;
                      }
                      if (prefix === ':') {
                        element.attributesForced = element.attributesForced || [];
                        element.attributesForced.push({
                          name: attrName,
                          value: value
                        });
                        attr.forcedValue = value;
                      }
                      if (prefix === '<') {
                        attr.validValues = makeMap$2(value, '?');
                      }
                    }
                    if (hasPatternsRegExp.test(attrName)) {
                      element.attributePatterns = element.attributePatterns || [];
                      attr.pattern = patternToRegExp(attrName);
                      element.attributePatterns.push(attr);
                    } else {
                      if (!attributes[attrName]) {
                        attributesOrder.push(attrName);
                      }
                      attributes[attrName] = attr;
                    }
                  }
                }
              }
              if (!globalAttributes && elementName === '@') {
                globalAttributes = attributes;
                globalAttributesOrder = attributesOrder;
              }
              if (outputName) {
                element.outputName = elementName;
                elements[outputName] = element;
              }
              if (hasPatternsRegExp.test(elementName)) {
                element.pattern = patternToRegExp(elementName);
                patternElements.push(element);
              } else {
                elements[elementName] = element;
              }
            }
          }
        }
      };
      var setValidElements = function (validElements) {
        elements = {};
        patternElements = [];
        addValidElements(validElements);
        each$4(schemaItems, function (element, name) {
          children[name] = element.children;
        });
      };
      var addCustomElements = function (customElements) {
        var customElementRegExp = /^(~)?(.+)$/;
        if (customElements) {
          mapCache.text_block_elements = mapCache.block_elements = null;
          each$4(split(customElements, ','), function (rule) {
            var matches = customElementRegExp.exec(rule), inline = matches[1] === '~', cloneName = inline ? 'span' : 'div', name = matches[2];
            children[name] = children[cloneName];
            customElementsMap[name] = cloneName;
            if (!inline) {
              blockElementsMap[name.toUpperCase()] = {};
              blockElementsMap[name] = {};
            }
            if (!elements[name]) {
              var customRule = elements[cloneName];
              customRule = extend$1({}, customRule);
              delete customRule.removeEmptyAttrs;
              delete customRule.removeEmpty;
              elements[name] = customRule;
            }
            each$4(children, function (element, elmName) {
              if (element[cloneName]) {
                children[elmName] = element = extend$1({}, children[elmName]);
                element[name] = element[cloneName];
              }
            });
          });
        }
      };
      var addValidChildren = function (validChildren) {
        var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/;
        mapCache[settings.schema] = null;
        if (validChildren) {
          each$4(split(validChildren, ','), function (rule) {
            var matches = childRuleRegExp.exec(rule);
            var parent, prefix;
            if (matches) {
              prefix = matches[1];
              if (prefix) {
                parent = children[matches[2]];
              } else {
                parent = children[matches[2]] = { '#comment': {} };
              }
              parent = children[matches[2]];
              each$4(split(matches[3], '|'), function (child) {
                if (prefix === '-') {
                  delete parent[child];
                } else {
                  parent[child] = {};
                }
              });
            }
          });
        }
      };
      var getElementRule = function (name) {
        var element = elements[name], i;
        if (element) {
          return element;
        }
        i = patternElements.length;
        while (i--) {
          element = patternElements[i];
          if (element.pattern.test(name)) {
            return element;
          }
        }
      };
      if (!settings.valid_elements) {
        each$4(schemaItems, function (element, name) {
          elements[name] = {
            attributes: element.attributes,
            attributesOrder: element.attributesOrder
          };
          children[name] = element.children;
        });
        if (settings.schema !== 'html5') {
          each$4(split('strong/b em/i'), function (item) {
            item = split(item, '/');
            elements[item[1]].outputName = item[0];
          });
        }
        each$4(split('ol ul sub sup blockquote span font a table tbody tr strong em b i'), function (name) {
          if (elements[name]) {
            elements[name].removeEmpty = true;
          }
        });
        each$4(split('p h1 h2 h3 h4 h5 h6 th td pre div address caption li'), function (name) {
          elements[name].paddEmpty = true;
        });
        each$4(split('span'), function (name) {
          elements[name].removeEmptyAttrs = true;
        });
      } else {
        setValidElements(settings.valid_elements);
      }
      addCustomElements(settings.custom_elements);
      addValidChildren(settings.valid_children);
      addValidElements(settings.extended_valid_elements);
      addValidChildren('+ol[ul|ol],+ul[ul|ol]');
      each$4({
        dd: 'dl',
        dt: 'dl',
        li: 'ul ol',
        td: 'tr',
        th: 'tr',
        tr: 'tbody thead tfoot',
        tbody: 'table',
        thead: 'table',
        tfoot: 'table',
        legend: 'fieldset',
        area: 'map',
        param: 'video audio object'
      }, function (parents, item) {
        if (elements[item]) {
          elements[item].parentsRequired = split(parents);
        }
      });
      if (settings.invalid_elements) {
        each$4(explode$1(settings.invalid_elements), function (item) {
          if (elements[item]) {
            delete elements[item];
          }
        });
      }
      if (!getElementRule('span')) {
        addValidElements('span[!data-mce-type|*]');
      }
      var getValidStyles = function () {
        return validStyles;
      };
      var getInvalidStyles = function () {
        return invalidStyles;
      };
      var getValidClasses = function () {
        return validClasses;
      };
      var getBoolAttrs = function () {
        return boolAttrMap;
      };
      var getBlockElements = function () {
        return blockElementsMap;
      };
      var getTextBlockElements = function () {
        return textBlockElementsMap;
      };
      var getTextInlineElements = function () {
        return textInlineElementsMap;
      };
      var getShortEndedElements = function () {
        return shortEndedElementsMap;
      };
      var getSelfClosingElements = function () {
        return selfClosingElementsMap;
      };
      var getNonEmptyElements = function () {
        return nonEmptyElementsMap;
      };
      var getMoveCaretBeforeOnEnterElements = function () {
        return moveCaretBeforeOnEnterElementsMap;
      };
      var getWhiteSpaceElements = function () {
        return whiteSpaceElementsMap;
      };
      var getSpecialElements = function () {
        return specialElements;
      };
      var isValidChild = function (name, child) {
        var parent = children[name.toLowerCase()];
        return !!(parent && parent[child.toLowerCase()]);
      };
      var isValid = function (name, attr) {
        var attrPatterns, i;
        var rule = getElementRule(name);
        if (rule) {
          if (attr) {
            if (rule.attributes[attr]) {
              return true;
            }
            attrPatterns = rule.attributePatterns;
            if (attrPatterns) {
              i = attrPatterns.length;
              while (i--) {
                if (attrPatterns[i].pattern.test(name)) {
                  return true;
                }
              }
            }
          } else {
            return true;
          }
        }
        return false;
      };
      var getCustomElements = function () {
        return customElementsMap;
      };
      return {
        children: children,
        elements: elements,
        getValidStyles: getValidStyles,
        getValidClasses: getValidClasses,
        getBlockElements: getBlockElements,
        getInvalidStyles: getInvalidStyles,
        getShortEndedElements: getShortEndedElements,
        getTextBlockElements: getTextBlockElements,
        getTextInlineElements: getTextInlineElements,
        getBoolAttrs: getBoolAttrs,
        getElementRule: getElementRule,
        getSelfClosingElements: getSelfClosingElements,
        getNonEmptyElements: getNonEmptyElements,
        getMoveCaretBeforeOnEnterElements: getMoveCaretBeforeOnEnterElements,
        getWhiteSpaceElements: getWhiteSpaceElements,
        getSpecialElements: getSpecialElements,
        isValidChild: isValidChild,
        isValid: isValid,
        getCustomElements: getCustomElements,
        addValidElements: addValidElements,
        setValidElements: setValidElements,
        addCustomElements: addCustomElements,
        addValidChildren: addValidChildren
      };
    }

    var toHex = function (match, r, g, b) {
      var hex = function (val) {
        val = parseInt(val, 10).toString(16);
        return val.length > 1 ? val : '0' + val;
      };
      return '#' + hex(r) + hex(g) + hex(b);
    };
    function Styles(settings, schema) {
      var rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi;
      var urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi;
      var styleRegExp = /\s*([^:]+):\s*([^;]+);?/g;
      var trimRightRegExp = /\s+$/;
      var i;
      var encodingLookup = {};
      var encodingItems;
      var validStyles;
      var invalidStyles;
      var invisibleChar = '\uFEFF';
      settings = settings || {};
      if (schema) {
        validStyles = schema.getValidStyles();
        invalidStyles = schema.getInvalidStyles();
      }
      encodingItems = ('\\" \\\' \\; \\: ; : ' + invisibleChar).split(' ');
      for (i = 0; i < encodingItems.length; i++) {
        encodingLookup[encodingItems[i]] = invisibleChar + i;
        encodingLookup[invisibleChar + i] = encodingItems[i];
      }
      return {
        toHex: function (color) {
          return color.replace(rgbRegExp, toHex);
        },
        parse: function (css) {
          var styles = {};
          var matches, name, value, isEncoded;
          var urlConverter = settings.url_converter;
          var urlConverterScope = settings.url_converter_scope || this;
          var compress = function (prefix, suffix, noJoin) {
            var top, right, bottom, left;
            top = styles[prefix + '-top' + suffix];
            if (!top) {
              return;
            }
            right = styles[prefix + '-right' + suffix];
            if (!right) {
              return;
            }
            bottom = styles[prefix + '-bottom' + suffix];
            if (!bottom) {
              return;
            }
            left = styles[prefix + '-left' + suffix];
            if (!left) {
              return;
            }
            var box = [
              top,
              right,
              bottom,
              left
            ];
            i = box.length - 1;
            while (i--) {
              if (box[i] !== box[i + 1]) {
                break;
              }
            }
            if (i > -1 && noJoin) {
              return;
            }
            styles[prefix + suffix] = i === -1 ? box[0] : box.join(' ');
            delete styles[prefix + '-top' + suffix];
            delete styles[prefix + '-right' + suffix];
            delete styles[prefix + '-bottom' + suffix];
            delete styles[prefix + '-left' + suffix];
          };
          var canCompress = function (key) {
            var value = styles[key], i;
            if (!value) {
              return;
            }
            value = value.split(' ');
            i = value.length;
            while (i--) {
              if (value[i] !== value[0]) {
                return false;
              }
            }
            styles[key] = value[0];
            return true;
          };
          var compress2 = function (target, a, b, c) {
            if (!canCompress(a)) {
              return;
            }
            if (!canCompress(b)) {
              return;
            }
            if (!canCompress(c)) {
              return;
            }
            styles[target] = styles[a] + ' ' + styles[b] + ' ' + styles[c];
            delete styles[a];
            delete styles[b];
            delete styles[c];
          };
          var encode = function (str) {
            isEncoded = true;
            return encodingLookup[str];
          };
          var decode = function (str, keepSlashes) {
            if (isEncoded) {
              str = str.replace(/\uFEFF[0-9]/g, function (str) {
                return encodingLookup[str];
              });
            }
            if (!keepSlashes) {
              str = str.replace(/\\([\'\";:])/g, '$1');
            }
            return str;
          };
          var decodeSingleHexSequence = function (escSeq) {
            return String.fromCharCode(parseInt(escSeq.slice(1), 16));
          };
          var decodeHexSequences = function (value) {
            return value.replace(/\\[0-9a-f]+/gi, decodeSingleHexSequence);
          };
          var processUrl = function (match, url, url2, url3, str, str2) {
            str = str || str2;
            if (str) {
              str = decode(str);
              return '\'' + str.replace(/\'/g, '\\\'') + '\'';
            }
            url = decode(url || url2 || url3);
            if (!settings.allow_script_urls) {
              var scriptUrl = url.replace(/[\s\r\n]+/g, '');
              if (/(java|vb)script:/i.test(scriptUrl)) {
                return '';
              }
              if (!settings.allow_svg_data_urls && /^data:image\/svg/i.test(scriptUrl)) {
                return '';
              }
            }
            if (urlConverter) {
              url = urlConverter.call(urlConverterScope, url, 'style');
            }
            return 'url(\'' + url.replace(/\'/g, '\\\'') + '\')';
          };
          if (css) {
            css = css.replace(/[\u0000-\u001F]/g, '');
            css = css.replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, function (str) {
              return str.replace(/[;:]/g, encode);
            });
            while (matches = styleRegExp.exec(css)) {
              styleRegExp.lastIndex = matches.index + matches[0].length;
              name = matches[1].replace(trimRightRegExp, '').toLowerCase();
              value = matches[2].replace(trimRightRegExp, '');
              if (name && value) {
                name = decodeHexSequences(name);
                value = decodeHexSequences(value);
                if (name.indexOf(invisibleChar) !== -1 || name.indexOf('"') !== -1) {
                  continue;
                }
                if (!settings.allow_script_urls && (name === 'behavior' || /expression\s*\(|\/\*|\*\//.test(value))) {
                  continue;
                }
                if (name === 'font-weight' && value === '700') {
                  value = 'bold';
                } else if (name === 'color' || name === 'background-color') {
                  value = value.toLowerCase();
                }
                value = value.replace(rgbRegExp, toHex);
                value = value.replace(urlOrStrRegExp, processUrl);
                styles[name] = isEncoded ? decode(value, true) : value;
              }
            }
            compress('border', '', true);
            compress('border', '-width');
            compress('border', '-color');
            compress('border', '-style');
            compress('padding', '');
            compress('margin', '');
            compress2('border', 'border-width', 'border-style', 'border-color');
            if (styles.border === 'medium none') {
              delete styles.border;
            }
            if (styles['border-image'] === 'none') {
              delete styles['border-image'];
            }
          }
          return styles;
        },
        serialize: function (styles, elementName) {
          var css = '', name, value;
          var serializeStyles = function (name) {
            var styleList, i, l, value;
            styleList = validStyles[name];
            if (styleList) {
              for (i = 0, l = styleList.length; i < l; i++) {
                name = styleList[i];
                value = styles[name];
                if (value) {
                  css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
                }
              }
            }
          };
          var isValid = function (name, elementName) {
            var styleMap;
            styleMap = invalidStyles['*'];
            if (styleMap && styleMap[name]) {
              return false;
            }
            styleMap = invalidStyles[elementName];
            if (styleMap && styleMap[name]) {
              return false;
            }
            return true;
          };
          if (elementName && validStyles) {
            serializeStyles('*');
            serializeStyles(elementName);
          } else {
            for (name in styles) {
              value = styles[name];
              if (value && (!invalidStyles || isValid(name, elementName))) {
                css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
              }
            }
          }
          return css;
        }
      };
    }

    var each$5 = Tools.each;
    var grep$1 = Tools.grep;
    var isIE = Env.ie;
    var simpleSelectorRe = /^([a-z0-9],?)+$/i;
    var whiteSpaceRegExp$2 = /^[ \t\r\n]*$/;
    var setupAttrHooks = function (styles, settings, getContext) {
      var attrHooks = {};
      var keepValues = settings.keep_values;
      var keepUrlHook = {
        set: function ($elm, value, name$$1) {
          if (settings.url_converter) {
            value = settings.url_converter.call(settings.url_converter_scope || getContext(), value, name$$1, $elm[0]);
          }
          $elm.attr('data-mce-' + name$$1, value).attr(name$$1, value);
        },
        get: function ($elm, name$$1) {
          return $elm.attr('data-mce-' + name$$1) || $elm.attr(name$$1);
        }
      };
      attrHooks = {
        style: {
          set: function ($elm, value) {
            if (value !== null && typeof value === 'object') {
              $elm.css(value);
              return;
            }
            if (keepValues) {
              $elm.attr('data-mce-style', value);
            }
            $elm.attr('style', value);
          },
          get: function ($elm) {
            var value = $elm.attr('data-mce-style') || $elm.attr('style');
            value = styles.serialize(styles.parse(value), $elm[0].nodeName);
            return value;
          }
        }
      };
      if (keepValues) {
        attrHooks.href = attrHooks.src = keepUrlHook;
      }
      return attrHooks;
    };
    var updateInternalStyleAttr = function (styles, $elm) {
      var rawValue = $elm.attr('style');
      var value = styles.serialize(styles.parse(rawValue), $elm[0].nodeName);
      if (!value) {
        value = null;
      }
      $elm.attr('data-mce-style', value);
    };
    var findNodeIndex = function (node, normalized) {
      var idx = 0, lastNodeType, nodeType;
      if (node) {
        for (lastNodeType = node.nodeType, node = node.previousSibling; node; node = node.previousSibling) {
          nodeType = node.nodeType;
          if (normalized && nodeType === 3) {
            if (nodeType === lastNodeType || !node.nodeValue.length) {
              continue;
            }
          }
          idx++;
          lastNodeType = nodeType;
        }
      }
      return idx;
    };
    function DOMUtils(doc, settings) {
      var _this = this;
      if (settings === void 0) {
        settings = {};
      }
      var attrHooks;
      var addedStyles = {};
      var win = window;
      var files = {};
      var counter = 0;
      var stdMode = true;
      var boxModel = true;
      var styleSheetLoader = StyleSheetLoader(doc, { contentCssCors: settings.contentCssCors });
      var boundEvents = [];
      var schema = settings.schema ? settings.schema : Schema({});
      var styles = Styles({
        url_converter: settings.url_converter,
        url_converter_scope: settings.url_converter_scope
      }, settings.schema);
      var events = settings.ownEvents ? new EventUtils(settings.proxy) : EventUtils.Event;
      var blockElementsMap = schema.getBlockElements();
      var $ = DomQuery.overrideDefaults(function () {
        return {
          context: doc,
          element: self$$1.getRoot()
        };
      });
      var isBlock = function (node) {
        if (typeof node === 'string') {
          return !!blockElementsMap[node];
        } else if (node) {
          var type = node.nodeType;
          if (type) {
            return !!(type === 1 && blockElementsMap[node.nodeName]);
          }
        }
        return false;
      };
      var get = function (elm) {
        if (elm && doc && typeof elm === 'string') {
          var node = doc.getElementById(elm);
          if (node && node.id !== elm) {
            return doc.getElementsByName(elm)[1];
          } else {
            return node;
          }
        }
        return elm;
      };
      var $$ = function (elm) {
        if (typeof elm === 'string') {
          elm = get(elm);
        }
        return $(elm);
      };
      var getAttrib = function (elm, name$$1, defaultVal) {
        var hook, value;
        var $elm = $$(elm);
        if ($elm.length) {
          hook = attrHooks[name$$1];
          if (hook && hook.get) {
            value = hook.get($elm, name$$1);
          } else {
            value = $elm.attr(name$$1);
          }
        }
        if (typeof value === 'undefined') {
          value = defaultVal || '';
        }
        return value;
      };
      var getAttribs = function (elm) {
        var node = get(elm);
        if (!node) {
          return [];
        }
        return node.attributes;
      };
      var setAttrib = function (elm, name$$1, value) {
        var originalValue, hook;
        if (value === '') {
          value = null;
        }
        var $elm = $$(elm);
        originalValue = $elm.attr(name$$1);
        if (!$elm.length) {
          return;
        }
        hook = attrHooks[name$$1];
        if (hook && hook.set) {
          hook.set($elm, value, name$$1);
        } else {
          $elm.attr(name$$1, value);
        }
        if (originalValue !== value && settings.onSetAttrib) {
          settings.onSetAttrib({
            attrElm: $elm,
            attrName: name$$1,
            attrValue: value
          });
        }
      };
      var clone = function (node, deep) {
        if (!isIE || node.nodeType !== 1 || deep) {
          return node.cloneNode(deep);
        }
        if (!deep) {
          var clone_1 = doc.createElement(node.nodeName);
          each$5(getAttribs(node), function (attr) {
            setAttrib(clone_1, attr.nodeName, getAttrib(node, attr.nodeName));
          });
          return clone_1;
        }
        return null;
      };
      var getRoot = function () {
        return settings.root_element || doc.body;
      };
      var getViewPort = function (argWin) {
        var actWin = !argWin ? win : argWin;
        var doc = actWin.document;
        var rootElm = boxModel ? doc.documentElement : doc.body;
        return {
          x: actWin.pageXOffset || rootElm.scrollLeft,
          y: actWin.pageYOffset || rootElm.scrollTop,
          w: actWin.innerWidth || rootElm.clientWidth,
          h: actWin.innerHeight || rootElm.clientHeight
        };
      };
      var getPos = function (elm, rootElm) {
        return Position.getPos(doc.body, get(elm), rootElm);
      };
      var setStyle = function (elm, name$$1, value) {
        var $elm = $$(elm).css(name$$1, value);
        if (settings.update_styles) {
          updateInternalStyleAttr(styles, $elm);
        }
      };
      var setStyles = function (elm, stylesArg) {
        var $elm = $$(elm).css(stylesArg);
        if (settings.update_styles) {
          updateInternalStyleAttr(styles, $elm);
        }
      };
      var getStyle = function (elm, name$$1, computed) {
        var $elm = $$(elm);
        if (computed) {
          return $elm.css(name$$1);
        }
        name$$1 = name$$1.replace(/-(\D)/g, function (a, b) {
          return b.toUpperCase();
        });
        if (name$$1 === 'float') {
          name$$1 = Env.ie && Env.ie < 12 ? 'styleFloat' : 'cssFloat';
        }
        return $elm[0] && $elm[0].style ? $elm[0].style[name$$1] : undefined;
      };
      var getSize = function (elm) {
        var w, h;
        elm = get(elm);
        w = getStyle(elm, 'width');
        h = getStyle(elm, 'height');
        if (w.indexOf('px') === -1) {
          w = 0;
        }
        if (h.indexOf('px') === -1) {
          h = 0;
        }
        return {
          w: parseInt(w, 10) || elm.offsetWidth || elm.clientWidth,
          h: parseInt(h, 10) || elm.offsetHeight || elm.clientHeight
        };
      };
      var getRect = function (elm) {
        var pos, size;
        elm = get(elm);
        pos = getPos(elm);
        size = getSize(elm);
        return {
          x: pos.x,
          y: pos.y,
          w: size.w,
          h: size.h
        };
      };
      var is = function (elm, selector) {
        var i;
        if (!elm) {
          return false;
        }
        if (!Array.isArray(elm)) {
          if (selector === '*') {
            return elm.nodeType === 1;
          }
          if (simpleSelectorRe.test(selector)) {
            var selectors = selector.toLowerCase().split(/,/);
            var elmName = elm.nodeName.toLowerCase();
            for (i = selectors.length - 1; i >= 0; i--) {
              if (selectors[i] === elmName) {
                return true;
              }
            }
            return false;
          }
          if (elm.nodeType && elm.nodeType !== 1) {
            return false;
          }
        }
        var elms = !Array.isArray(elm) ? [elm] : elm;
        return Sizzle(selector, elms[0].ownerDocument || elms[0], null, elms).length > 0;
      };
      var getParents = function (elm, selector, root, collect) {
        var result = [];
        var selectorVal;
        var node = get(elm);
        collect = collect === undefined;
        root = root || (getRoot().nodeName !== 'BODY' ? getRoot().parentNode : null);
        if (Tools.is(selector, 'string')) {
          selectorVal = selector;
          if (selector === '*') {
            selector = function (node) {
              return node.nodeType === 1;
            };
          } else {
            selector = function (node) {
              return is(node, selectorVal);
            };
          }
        }
        while (node) {
          if (node === root || !node.nodeType || node.nodeType === 9) {
            break;
          }
          if (!selector || typeof selector === 'function' && selector(node)) {
            if (collect) {
              result.push(node);
            } else {
              return [node];
            }
          }
          node = node.parentNode;
        }
        return collect ? result : null;
      };
      var getParent = function (node, selector, root) {
        var parents = getParents(node, selector, root, false);
        return parents && parents.length > 0 ? parents[0] : null;
      };
      var _findSib = function (node, selector, name$$1) {
        var func = selector;
        if (node) {
          if (typeof selector === 'string') {
            func = function (node) {
              return is(node, selector);
            };
          }
          for (node = node[name$$1]; node; node = node[name$$1]) {
            if (typeof func === 'function' && func(node)) {
              return node;
            }
          }
        }
        return null;
      };
      var getNext = function (node, selector) {
        return _findSib(node, selector, 'nextSibling');
      };
      var getPrev = function (node, selector) {
        return _findSib(node, selector, 'previousSibling');
      };
      var select = function (selector, scope) {
        return Sizzle(selector, get(scope) || settings.root_element || doc, []);
      };
      var run = function (elm, func, scope) {
        var result;
        var node = typeof elm === 'string' ? get(elm) : elm;
        if (!node) {
          return false;
        }
        if (Tools.isArray(node) && (node.length || node.length === 0)) {
          result = [];
          each$5(node, function (elm, i) {
            if (elm) {
              if (typeof elm === 'string') {
                elm = get(elm);
              }
              result.push(func.call(scope, elm, i));
            }
          });
          return result;
        }
        var context = scope ? scope : _this;
        return func.call(context, node);
      };
      var setAttribs = function (elm, attrs) {
        $$(elm).each(function (i, node) {
          each$5(attrs, function (value, name$$1) {
            setAttrib(node, name$$1, value);
          });
        });
      };
      var setHTML = function (elm, html) {
        var $elm = $$(elm);
        if (isIE) {
          $elm.each(function (i, target) {
            if (target.canHaveHTML === false) {
              return;
            }
            while (target.firstChild) {
              target.removeChild(target.firstChild);
            }
            try {
              target.innerHTML = '<br>' + html;
              target.removeChild(target.firstChild);
            } catch (ex) {
              DomQuery('<div></div>').html('<br>' + html).contents().slice(1).appendTo(target);
            }
            return html;
          });
        } else {
          $elm.html(html);
        }
      };
      var add = function (parentElm, name$$1, attrs, html, create) {
        return run(parentElm, function (parentElm) {
          var newElm = typeof name$$1 === 'string' ? doc.createElement(name$$1) : name$$1;
          setAttribs(newElm, attrs);
          if (html) {
            if (typeof html !== 'string' && html.nodeType) {
              newElm.appendChild(html);
            } else if (typeof html === 'string') {
              setHTML(newElm, html);
            }
          }
          return !create ? parentElm.appendChild(newElm) : newElm;
        });
      };
      var create = function (name$$1, attrs, html) {
        return add(doc.createElement(name$$1), name$$1, attrs, html, true);
      };
      var decode = Entities.decode;
      var encode = Entities.encodeAllRaw;
      var createHTML = function (name$$1, attrs, html) {
        var outHtml = '', key;
        outHtml += '<' + name$$1;
        for (key in attrs) {
          if (attrs.hasOwnProperty(key) && attrs[key] !== null && typeof attrs[key] !== 'undefined') {
            outHtml += ' ' + key + '="' + encode(attrs[key]) + '"';
          }
        }
        if (typeof html !== 'undefined') {
          return outHtml + '>' + html + '</' + name$$1 + '>';
        }
        return outHtml + ' />';
      };
      var createFragment = function (html) {
        var node;
        var container = doc.createElement('div');
        var frag = doc.createDocumentFragment();
        if (html) {
          container.innerHTML = html;
        }
        while (node = container.firstChild) {
          frag.appendChild(node);
        }
        return frag;
      };
      var remove = function (node, keepChildren) {
        var $node = $$(node);
        if (keepChildren) {
          $node.each(function () {
            var child;
            while (child = this.firstChild) {
              if (child.nodeType === 3 && child.data.length === 0) {
                this.removeChild(child);
              } else {
                this.parentNode.insertBefore(child, this);
              }
            }
          }).remove();
        } else {
          $node.remove();
        }
        return $node.length > 1 ? $node.toArray() : $node[0];
      };
      var removeAllAttribs = function (e) {
        return run(e, function (e) {
          var i;
          var attrs = e.attributes;
          for (i = attrs.length - 1; i >= 0; i--) {
            e.removeAttributeNode(attrs.item(i));
          }
        });
      };
      var parseStyle = function (cssText) {
        return styles.parse(cssText);
      };
      var serializeStyle = function (stylesArg, name$$1) {
        return styles.serialize(stylesArg, name$$1);
      };
      var addStyle = function (cssText) {
        var head, styleElm;
        if (self$$1 !== DOMUtils.DOM && doc === document) {
          if (addedStyles[cssText]) {
            return;
          }
          addedStyles[cssText] = true;
        }
        styleElm = doc.getElementById('mceDefaultStyles');
        if (!styleElm) {
          styleElm = doc.createElement('style');
          styleElm.id = 'mceDefaultStyles';
          styleElm.type = 'text/css';
          head = doc.getElementsByTagName('head')[0];
          if (head.firstChild) {
            head.insertBefore(styleElm, head.firstChild);
          } else {
            head.appendChild(styleElm);
          }
        }
        if (styleElm.styleSheet) {
          styleElm.styleSheet.cssText += cssText;
        } else {
          styleElm.appendChild(doc.createTextNode(cssText));
        }
      };
      var loadCSS = function (url) {
        var head;
        if (self$$1 !== DOMUtils.DOM && doc === document) {
          DOMUtils.DOM.loadCSS(url);
          return;
        }
        if (!url) {
          url = '';
        }
        head = doc.getElementsByTagName('head')[0];
        each$5(url.split(','), function (url) {
          var link;
          url = Tools._addCacheSuffix(url);
          if (files[url]) {
            return;
          }
          files[url] = true;
          link = create('link', {
            rel: 'stylesheet',
            href: url
          });
          head.appendChild(link);
        });
      };
      var toggleClass = function (elm, cls, state) {
        $$(elm).toggleClass(cls, state).each(function () {
          if (this.className === '') {
            DomQuery(this).attr('class', null);
          }
        });
      };
      var addClass = function (elm, cls) {
        $$(elm).addClass(cls);
      };
      var removeClass = function (elm, cls) {
        toggleClass(elm, cls, false);
      };
      var hasClass = function (elm, cls) {
        return $$(elm).hasClass(cls);
      };
      var show = function (elm) {
        $$(elm).show();
      };
      var hide = function (elm) {
        $$(elm).hide();
      };
      var isHidden = function (elm) {
        return $$(elm).css('display') === 'none';
      };
      var uniqueId = function (prefix) {
        return (!prefix ? 'mce_' : prefix) + counter++;
      };
      var getOuterHTML = function (elm) {
        var node = typeof elm === 'string' ? get(elm) : elm;
        return NodeType.isElement(node) ? node.outerHTML : DomQuery('<div></div>').append(DomQuery(node).clone()).html();
      };
      var setOuterHTML = function (elm, html) {
        $$(elm).each(function () {
          try {
            if ('outerHTML' in this) {
              this.outerHTML = html;
              return;
            }
          } catch (ex) {
          }
          remove(DomQuery(this).html(html), true);
        });
      };
      var insertAfter = function (node, reference) {
        var referenceNode = get(reference);
        return run(node, function (node) {
          var parent$$1, nextSibling;
          parent$$1 = referenceNode.parentNode;
          nextSibling = referenceNode.nextSibling;
          if (nextSibling) {
            parent$$1.insertBefore(node, nextSibling);
          } else {
            parent$$1.appendChild(node);
          }
          return node;
        });
      };
      var replace = function (newElm, oldElm, keepChildren) {
        return run(oldElm, function (oldElm) {
          if (Tools.is(oldElm, 'array')) {
            newElm = newElm.cloneNode(true);
          }
          if (keepChildren) {
            each$5(grep$1(oldElm.childNodes), function (node) {
              newElm.appendChild(node);
            });
          }
          return oldElm.parentNode.replaceChild(newElm, oldElm);
        });
      };
      var rename = function (elm, name$$1) {
        var newElm;
        if (elm.nodeName !== name$$1.toUpperCase()) {
          newElm = create(name$$1);
          each$5(getAttribs(elm), function (attrNode) {
            setAttrib(newElm, attrNode.nodeName, getAttrib(elm, attrNode.nodeName));
          });
          replace(newElm, elm, true);
        }
        return newElm || elm;
      };
      var findCommonAncestor = function (a, b) {
        var ps = a, pe;
        while (ps) {
          pe = b;
          while (pe && ps !== pe) {
            pe = pe.parentNode;
          }
          if (ps === pe) {
            break;
          }
          ps = ps.parentNode;
        }
        if (!ps && a.ownerDocument) {
          return a.ownerDocument.documentElement;
        }
        return ps;
      };
      var toHex = function (rgbVal) {
        return styles.toHex(Tools.trim(rgbVal));
      };
      var isEmpty = function (node, elements) {
        var i, attributes, type, whitespace, walker, name$$1, brCount = 0;
        node = node.firstChild;
        if (node) {
          walker = new TreeWalker(node, node.parentNode);
          elements = elements || (schema ? schema.getNonEmptyElements() : null);
          whitespace = schema ? schema.getWhiteSpaceElements() : {};
          do {
            type = node.nodeType;
            if (NodeType.isElement(node)) {
              var bogusVal = node.getAttribute('data-mce-bogus');
              if (bogusVal) {
                node = walker.next(bogusVal === 'all');
                continue;
              }
              name$$1 = node.nodeName.toLowerCase();
              if (elements && elements[name$$1]) {
                if (name$$1 === 'br') {
                  brCount++;
                  node = walker.next();
                  continue;
                }
                return false;
              }
              attributes = getAttribs(node);
              i = attributes.length;
              while (i--) {
                name$$1 = attributes[i].nodeName;
                if (name$$1 === 'name' || name$$1 === 'data-mce-bookmark') {
                  return false;
                }
              }
            }
            if (type === 8) {
              return false;
            }
            if (type === 3 && !whiteSpaceRegExp$2.test(node.nodeValue)) {
              return false;
            }
            if (type === 3 && node.parentNode && whitespace[node.parentNode.nodeName] && whiteSpaceRegExp$2.test(node.nodeValue)) {
              return false;
            }
            node = walker.next();
          } while (node);
        }
        return brCount <= 1;
      };
      var createRng = function () {
        return doc.createRange();
      };
      var split = function (parentElm, splitElm, replacementElm) {
        var r = createRng(), bef, aft, pa;
        if (parentElm && splitElm) {
          r.setStart(parentElm.parentNode, findNodeIndex(parentElm));
          r.setEnd(splitElm.parentNode, findNodeIndex(splitElm));
          bef = r.extractContents();
          r = createRng();
          r.setStart(splitElm.parentNode, findNodeIndex(splitElm) + 1);
          r.setEnd(parentElm.parentNode, findNodeIndex(parentElm) + 1);
          aft = r.extractContents();
          pa = parentElm.parentNode;
          pa.insertBefore(TrimNode.trimNode(self$$1, bef), parentElm);
          if (replacementElm) {
            pa.insertBefore(replacementElm, parentElm);
          } else {
            pa.insertBefore(splitElm, parentElm);
          }
          pa.insertBefore(TrimNode.trimNode(self$$1, aft), parentElm);
          remove(parentElm);
          return replacementElm || splitElm;
        }
      };
      var bind = function (target, name$$1, func, scope) {
        if (Tools.isArray(target)) {
          var i = target.length;
          while (i--) {
            target[i] = bind(target[i], name$$1, func, scope);
          }
          return target;
        }
        if (settings.collect && (target === doc || target === win)) {
          boundEvents.push([
            target,
            name$$1,
            func,
            scope
          ]);
        }
        return events.bind(target, name$$1, func, scope || self$$1);
      };
      var unbind = function (target, name$$1, func) {
        var i;
        if (Tools.isArray(target)) {
          i = target.length;
          while (i--) {
            target[i] = unbind(target[i], name$$1, func);
          }
          return target;
        }
        if (boundEvents && (target === doc || target === win)) {
          i = boundEvents.length;
          while (i--) {
            var item = boundEvents[i];
            if (target === item[0] && (!name$$1 || name$$1 === item[1]) && (!func || func === item[2])) {
              events.unbind(item[0], item[1], item[2]);
            }
          }
        }
        return events.unbind(target, name$$1, func);
      };
      var fire = function (target, name$$1, evt) {
        return events.fire(target, name$$1, evt);
      };
      var getContentEditable = function (node) {
        if (node && NodeType.isElement(node)) {
          var contentEditable = node.getAttribute('data-mce-contenteditable');
          if (contentEditable && contentEditable !== 'inherit') {
            return contentEditable;
          }
          return node.contentEditable !== 'inherit' ? node.contentEditable : null;
        } else {
          return null;
        }
      };
      var getContentEditableParent = function (node) {
        var root = getRoot();
        var state = null;
        for (; node && node !== root; node = node.parentNode) {
          state = getContentEditable(node);
          if (state !== null) {
            break;
          }
        }
        return state;
      };
      var destroy = function () {
        if (boundEvents) {
          var i = boundEvents.length;
          while (i--) {
            var item = boundEvents[i];
            events.unbind(item[0], item[1], item[2]);
          }
        }
        if (Sizzle.setDocument) {
          Sizzle.setDocument();
        }
      };
      var isChildOf = function (node, parent$$1) {
        while (node) {
          if (parent$$1 === node) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };
      var dumpRng = function (r) {
        return 'startContainer: ' + r.startContainer.nodeName + ', startOffset: ' + r.startOffset + ', endContainer: ' + r.endContainer.nodeName + ', endOffset: ' + r.endOffset;
      };
      var self$$1 = {
        doc: doc,
        settings: settings,
        win: win,
        files: files,
        stdMode: stdMode,
        boxModel: boxModel,
        styleSheetLoader: styleSheetLoader,
        boundEvents: boundEvents,
        styles: styles,
        schema: schema,
        events: events,
        isBlock: isBlock,
        $: $,
        $$: $$,
        root: null,
        clone: clone,
        getRoot: getRoot,
        getViewPort: getViewPort,
        getRect: getRect,
        getSize: getSize,
        getParent: getParent,
        getParents: getParents,
        get: get,
        getNext: getNext,
        getPrev: getPrev,
        select: select,
        is: is,
        add: add,
        create: create,
        createHTML: createHTML,
        createFragment: createFragment,
        remove: remove,
        setStyle: setStyle,
        getStyle: getStyle,
        setStyles: setStyles,
        removeAllAttribs: removeAllAttribs,
        setAttrib: setAttrib,
        setAttribs: setAttribs,
        getAttrib: getAttrib,
        getPos: getPos,
        parseStyle: parseStyle,
        serializeStyle: serializeStyle,
        addStyle: addStyle,
        loadCSS: loadCSS,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        toggleClass: toggleClass,
        show: show,
        hide: hide,
        isHidden: isHidden,
        uniqueId: uniqueId,
        setHTML: setHTML,
        getOuterHTML: getOuterHTML,
        setOuterHTML: setOuterHTML,
        decode: decode,
        encode: encode,
        insertAfter: insertAfter,
        replace: replace,
        rename: rename,
        findCommonAncestor: findCommonAncestor,
        toHex: toHex,
        run: run,
        getAttribs: getAttribs,
        isEmpty: isEmpty,
        createRng: createRng,
        nodeIndex: findNodeIndex,
        split: split,
        bind: bind,
        unbind: unbind,
        fire: fire,
        getContentEditable: getContentEditable,
        getContentEditableParent: getContentEditableParent,
        destroy: destroy,
        isChildOf: isChildOf,
        dumpRng: dumpRng
      };
      attrHooks = setupAttrHooks(styles, settings, function () {
        return self$$1;
      });
      return self$$1;
    }
    (function (DOMUtils) {
      DOMUtils.DOM = DOMUtils(document);
      DOMUtils.nodeIndex = findNodeIndex;
    }(DOMUtils || (DOMUtils = {})));
    var DOMUtils$1 = DOMUtils;

    var DOM = DOMUtils$1.DOM;
    var each$6 = Tools.each, grep$2 = Tools.grep;
    var isFunction$1 = function (f) {
      return typeof f === 'function';
    };
    var ScriptLoader = function () {
      var QUEUED = 0;
      var LOADING = 1;
      var LOADED = 2;
      var FAILED = 3;
      var states = {};
      var queue = [];
      var scriptLoadedCallbacks = {};
      var queueLoadedCallbacks = [];
      var loading = 0;
      var loadScript = function (url, success, failure) {
        var dom = DOM;
        var elm, id;
        var done = function () {
          dom.remove(id);
          if (elm) {
            elm.onreadystatechange = elm.onload = elm = null;
          }
          success();
        };
        var error = function () {
          if (isFunction$1(failure)) {
            failure();
          } else {
            if (typeof console !== 'undefined' && console.log) {
              console.log('Failed to load script: ' + url);
            }
          }
        };
        id = dom.uniqueId();
        elm = document.createElement('script');
        elm.id = id;
        elm.type = 'text/javascript';
        elm.src = Tools._addCacheSuffix(url);
        elm.onload = done;
        elm.onerror = error;
        (document.getElementsByTagName('head')[0] || document.body).appendChild(elm);
      };
      this.isDone = function (url) {
        return states[url] === LOADED;
      };
      this.markDone = function (url) {
        states[url] = LOADED;
      };
      this.add = this.load = function (url, success, scope, failure) {
        var state = states[url];
        if (state === undefined) {
          queue.push(url);
          states[url] = QUEUED;
        }
        if (success) {
          if (!scriptLoadedCallbacks[url]) {
            scriptLoadedCallbacks[url] = [];
          }
          scriptLoadedCallbacks[url].push({
            success: success,
            failure: failure,
            scope: scope || this
          });
        }
      };
      this.remove = function (url) {
        delete states[url];
        delete scriptLoadedCallbacks[url];
      };
      this.loadQueue = function (success, scope, failure) {
        this.loadScripts(queue, success, scope, failure);
      };
      this.loadScripts = function (scripts, success, scope, failure) {
        var loadScripts;
        var failures = [];
        var execCallbacks = function (name$$1, url) {
          each$6(scriptLoadedCallbacks[url], function (callback) {
            if (isFunction$1(callback[name$$1])) {
              callback[name$$1].call(callback.scope);
            }
          });
          scriptLoadedCallbacks[url] = undefined;
        };
        queueLoadedCallbacks.push({
          success: success,
          failure: failure,
          scope: scope || this
        });
        loadScripts = function () {
          var loadingScripts = grep$2(scripts);
          scripts.length = 0;
          each$6(loadingScripts, function (url) {
            if (states[url] === LOADED) {
              execCallbacks('success', url);
              return;
            }
            if (states[url] === FAILED) {
              execCallbacks('failure', url);
              return;
            }
            if (states[url] !== LOADING) {
              states[url] = LOADING;
              loading++;
              loadScript(url, function () {
                states[url] = LOADED;
                loading--;
                execCallbacks('success', url);
                loadScripts();
              }, function () {
                states[url] = FAILED;
                loading--;
                failures.push(url);
                execCallbacks('failure', url);
                loadScripts();
              });
            }
          });
          if (!loading) {
            var notifyCallbacks = queueLoadedCallbacks.slice(0);
            queueLoadedCallbacks.length = 0;
            each$6(notifyCallbacks, function (callback) {
              if (failures.length === 0) {
                if (isFunction$1(callback.success)) {
                  callback.success.call(callback.scope);
                }
              } else {
                if (isFunction$1(callback.failure)) {
                  callback.failure.call(callback.scope, failures);
                }
              }
            });
          }
        };
        loadScripts();
      };
    };
    ScriptLoader.ScriptLoader = new ScriptLoader();

    var each$7 = Tools.each;
    function AddOnManager() {
      var _this = this;
      var items = [];
      var urls = {};
      var lookup = {};
      var _listeners = [];
      var get = function (name) {
        if (lookup[name]) {
          return lookup[name].instance;
        }
        return undefined;
      };
      var dependencies = function (name) {
        var result;
        if (lookup[name]) {
          result = lookup[name].dependencies;
        }
        return result || [];
      };
      var requireLangPack = function (name, languages) {
        var language = AddOnManager.language;
        if (language && AddOnManager.languageLoad !== false) {
          if (languages) {
            languages = ',' + languages + ',';
            if (languages.indexOf(',' + language.substr(0, 2) + ',') !== -1) {
              language = language.substr(0, 2);
            } else if (languages.indexOf(',' + language + ',') === -1) {
              return;
            }
          }
          ScriptLoader.ScriptLoader.add(urls[name] + '/langs/' + language + '.js');
        }
      };
      var add = function (id, addOn, dependencies) {
        items.push(addOn);
        lookup[id] = {
          instance: addOn,
          dependencies: dependencies
        };
        var result = partition(_listeners, function (listener) {
          return listener.name === id;
        });
        _listeners = result.fail;
        each$7(result.pass, function (listener) {
          listener.callback();
        });
        return addOn;
      };
      var remove = function (name) {
        delete urls[name];
        delete lookup[name];
      };
      var createUrl = function (baseUrl, dep) {
        if (typeof dep === 'object') {
          return dep;
        }
        return typeof baseUrl === 'string' ? {
          prefix: '',
          resource: dep,
          suffix: ''
        } : {
          prefix: baseUrl.prefix,
          resource: dep,
          suffix: baseUrl.suffix
        };
      };
      var addComponents = function (pluginName, scripts) {
        var pluginUrl = _this.urls[pluginName];
        each$7(scripts, function (script) {
          ScriptLoader.ScriptLoader.add(pluginUrl + '/' + script);
        });
      };
      var loadDependencies = function (name, addOnUrl, success, scope) {
        var deps = dependencies(name);
        each$7(deps, function (dep) {
          var newUrl = createUrl(addOnUrl, dep);
          load(newUrl.resource, newUrl, undefined, undefined);
        });
        if (success) {
          if (scope) {
            success.call(scope);
          } else {
            success.call(ScriptLoader);
          }
        }
      };
      var load = function (name, addOnUrl, success, scope, failure) {
        if (urls[name]) {
          return;
        }
        var urlString = typeof addOnUrl === 'string' ? addOnUrl : addOnUrl.prefix + addOnUrl.resource + addOnUrl.suffix;
        if (urlString.indexOf('/') !== 0 && urlString.indexOf('://') === -1) {
          urlString = AddOnManager.baseURL + '/' + urlString;
        }
        urls[name] = urlString.substring(0, urlString.lastIndexOf('/'));
        if (lookup[name]) {
          loadDependencies(name, addOnUrl, success, scope);
        } else {
          ScriptLoader.ScriptLoader.add(urlString, function () {
            return loadDependencies(name, addOnUrl, success, scope);
          }, scope, failure);
        }
      };
      var waitFor = function (name, callback) {
        if (lookup.hasOwnProperty(name)) {
          callback();
        } else {
          _listeners.push({
            name: name,
            callback: callback
          });
        }
      };
      return {
        items: items,
        urls: urls,
        lookup: lookup,
        _listeners: _listeners,
        get: get,
        dependencies: dependencies,
        requireLangPack: requireLangPack,
        add: add,
        remove: remove,
        createUrl: createUrl,
        addComponents: addComponents,
        load: load,
        waitFor: waitFor
      };
    }
    (function (AddOnManager) {
      AddOnManager.PluginManager = AddOnManager();
      AddOnManager.ThemeManager = AddOnManager();
    }(AddOnManager || (AddOnManager = {})));

    var before = function (marker, element) {
      var parent$$1 = parent(marker);
      parent$$1.each(function (v) {
        v.dom().insertBefore(element.dom(), marker.dom());
      });
    };
    var after = function (marker, element) {
      var sibling = nextSibling(marker);
      sibling.fold(function () {
        var parent$$1 = parent(marker);
        parent$$1.each(function (v) {
          append(v, element);
        });
      }, function (v) {
        before(v, element);
      });
    };
    var append = function (parent$$1, element) {
      parent$$1.dom().appendChild(element.dom());
    };
    var wrap$1 = function (element, wrapper) {
      before(element, wrapper);
      append(wrapper, element);
    };

    var before$1 = function (marker, elements) {
      each(elements, function (x) {
        before(marker, x);
      });
    };
    var append$1 = function (parent, elements) {
      each(elements, function (x) {
        append(parent, x);
      });
    };

    var empty = function (element) {
      element.dom().textContent = '';
      each(children(element), function (rogue) {
        remove$2(rogue);
      });
    };
    var remove$2 = function (element) {
      var dom = element.dom();
      if (dom.parentNode !== null)
        dom.parentNode.removeChild(dom);
    };
    var unwrap = function (wrapper) {
      var children$$1 = children(wrapper);
      if (children$$1.length > 0)
        before$1(wrapper, children$$1);
      remove$2(wrapper);
    };

    var first$1 = function (fn, rate) {
      var timer = null;
      var cancel = function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
      };
      var throttle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (timer === null) {
          timer = setTimeout(function () {
            fn.apply(null, args);
            timer = null;
          }, rate);
        }
      };
      return {
        cancel: cancel,
        throttle: throttle
      };
    };
    var last$3 = function (fn, rate) {
      var timer = null;
      var cancel = function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
      };
      var throttle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (timer !== null)
          clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
        }, rate);
      };
      return {
        cancel: cancel,
        throttle: throttle
      };
    };

    var Cell = function (initial) {
      var value = initial;
      var get = function () {
        return value;
      };
      var set = function (v) {
        value = v;
      };
      var clone = function () {
        return Cell(get());
      };
      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    var read = function (element, attr) {
      var value = get$1(element, attr);
      return value === undefined || value === '' ? [] : value.split(' ');
    };
    var add = function (element, attr, id) {
      var old = read(element, attr);
      var nu = old.concat([id]);
      set(element, attr, nu.join(' '));
      return true;
    };
    var remove$3 = function (element, attr, id) {
      var nu = filter(read(element, attr), function (v) {
        return v !== id;
      });
      if (nu.length > 0)
        set(element, attr, nu.join(' '));
      else
        remove(element, attr);
      return false;
    };

    var supports = function (element) {
      return element.dom().classList !== undefined;
    };
    var get$3 = function (element) {
      return read(element, 'class');
    };
    var add$1 = function (element, clazz) {
      return add(element, 'class', clazz);
    };
    var remove$4 = function (element, clazz) {
      return remove$3(element, 'class', clazz);
    };

    var add$2 = function (element, clazz) {
      if (supports(element))
        element.dom().classList.add(clazz);
      else
        add$1(element, clazz);
    };
    var cleanClass = function (element) {
      var classList = supports(element) ? element.dom().classList : get$3(element);
      if (classList.length === 0) {
        remove(element, 'class');
      }
    };
    var remove$5 = function (element, clazz) {
      if (supports(element)) {
        var classList = element.dom().classList;
        classList.remove(clazz);
      } else
        remove$4(element, clazz);
      cleanClass(element);
    };
    var has$2 = function (element, clazz) {
      return supports(element) && element.dom().classList.contains(clazz);
    };

    var descendants$1 = function (scope, selector) {
      return all(selector, scope);
    };

    function ClosestOrAncestor (is, ancestor, scope, a, isRoot) {
      return is(scope, a) ? Option.some(scope) : isFunction(isRoot) && isRoot(scope) ? Option.none() : ancestor(scope, a, isRoot);
    }

    var ancestor = function (scope, predicate, isRoot) {
      var element = scope.dom();
      var stop = isFunction(isRoot) ? isRoot : constant(false);
      while (element.parentNode) {
        element = element.parentNode;
        var el = Element$$1.fromDom(element);
        if (predicate(el))
          return Option.some(el);
        else if (stop(el))
          break;
      }
      return Option.none();
    };
    var closest = function (scope, predicate, isRoot) {
      var is = function (scope) {
        return predicate(scope);
      };
      return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
    };

    var ancestor$1 = function (scope, selector, isRoot) {
      return ancestor(scope, function (e) {
        return is$1(e, selector);
      }, isRoot);
    };
    var descendant$1 = function (scope, selector) {
      return one(selector, scope);
    };
    var closest$1 = function (scope, selector, isRoot) {
      return ClosestOrAncestor(is$1, ancestor$1, scope, selector, isRoot);
    };

    var annotation = constant('mce-annotation');
    var dataAnnotation = constant('data-mce-annotation');
    var dataAnnotationId = constant('data-mce-annotation-uid');

    var identify = function (editor, annotationName) {
      var rng = editor.selection.getRng();
      var start = Element$$1.fromDom(rng.startContainer);
      var root = Element$$1.fromDom(editor.getBody());
      var selector = annotationName.fold(function () {
        return '.' + annotation();
      }, function (an) {
        return '[' + dataAnnotation() + '="' + an + '"]';
      });
      var newStart = child(start, rng.startOffset).getOr(start);
      var closest = closest$1(newStart, selector, function (n) {
        return eq(n, root);
      });
      var getAttr = function (c, property) {
        if (has$1(c, property)) {
          return Option.some(get$1(c, property));
        } else {
          return Option.none();
        }
      };
      return closest.bind(function (c) {
        return getAttr(c, '' + dataAnnotationId()).bind(function (uid) {
          return getAttr(c, '' + dataAnnotation()).map(function (name$$1) {
            var elements = findMarkers(editor, uid);
            return {
              uid: uid,
              name: name$$1,
              elements: elements
            };
          });
        });
      });
    };
    var isAnnotation = function (elem) {
      return isElement(elem) && has$2(elem, annotation());
    };
    var findMarkers = function (editor, uid) {
      var body = Element$$1.fromDom(editor.getBody());
      return descendants$1(body, '[' + dataAnnotationId() + '="' + uid + '"]');
    };
    var findAll = function (editor, name$$1) {
      var body = Element$$1.fromDom(editor.getBody());
      var markers = descendants$1(body, '[' + dataAnnotation() + '="' + name$$1 + '"]');
      var directory = {};
      each(markers, function (m) {
        var uid = get$1(m, dataAnnotationId());
        var nodesAlready = directory.hasOwnProperty(uid) ? directory[uid] : [];
        directory[uid] = nodesAlready.concat([m]);
      });
      return directory;
    };

    var setup = function (editor, registry) {
      var changeCallbacks = Cell({});
      var initData = function () {
        return {
          listeners: [],
          previous: Cell(Option.none())
        };
      };
      var withCallbacks = function (name, f) {
        updateCallbacks(name, function (data) {
          f(data);
          return data;
        });
      };
      var updateCallbacks = function (name, f) {
        var callbackMap = changeCallbacks.get();
        var data = callbackMap.hasOwnProperty(name) ? callbackMap[name] : initData();
        var outputData = f(data);
        callbackMap[name] = outputData;
        changeCallbacks.set(callbackMap);
      };
      var fireCallbacks = function (name, uid, elements) {
        withCallbacks(name, function (data) {
          each(data.listeners, function (f) {
            return f(true, name, {
              uid: uid,
              nodes: map(elements, function (elem) {
                return elem.dom();
              })
            });
          });
        });
      };
      var fireNoAnnotation = function (name) {
        withCallbacks(name, function (data) {
          each(data.listeners, function (f) {
            return f(false, name);
          });
        });
      };
      var onNodeChange = last$3(function () {
        var callbackMap = changeCallbacks.get();
        var annotations = sort(keys(callbackMap));
        each(annotations, function (name) {
          updateCallbacks(name, function (data) {
            var prev = data.previous.get();
            identify(editor, Option.some(name)).fold(function () {
              if (prev.isSome()) {
                fireNoAnnotation(name);
                data.previous.set(Option.none());
              }
            }, function (_a) {
              var uid = _a.uid, name = _a.name, elements = _a.elements;
              if (!prev.is(uid)) {
                fireCallbacks(name, uid, elements);
                data.previous.set(Option.some(uid));
              }
            });
            return {
              previous: data.previous,
              listeners: data.listeners
            };
          });
        });
      }, 30);
      editor.on('remove', function () {
        onNodeChange.cancel();
      });
      editor.on('nodeChange', function () {
        onNodeChange.throttle();
      });
      var addListener = function (name, f) {
        updateCallbacks(name, function (data) {
          return {
            previous: data.previous,
            listeners: data.listeners.concat([f])
          };
        });
      };
      return { addListener: addListener };
    };

    var setup$1 = function (editor, registry) {
      var identifyParserNode = function (span) {
        var optAnnotation = Option.from(span.attributes.map[dataAnnotation()]);
        return optAnnotation.bind(registry.lookup);
      };
      editor.on('init', function () {
        editor.serializer.addNodeFilter('span', function (spans) {
          each(spans, function (span) {
            identifyParserNode(span).each(function (settings) {
              if (settings.persistent === false) {
                span.unwrap();
              }
            });
          });
        });
      });
    };

    var create$1 = function () {
      var annotations = {};
      var register = function (name, settings) {
        annotations[name] = {
          name: name,
          settings: settings
        };
      };
      var lookup = function (name) {
        return annotations.hasOwnProperty(name) ? Option.from(annotations[name]).map(function (a) {
          return a.settings;
        }) : Option.none();
      };
      return {
        register: register,
        lookup: lookup
      };
    };

    var unique = 0;
    var generate = function (prefix) {
      var date = new Date();
      var time = date.getTime();
      var random = Math.floor(Math.random() * 1000000000);
      unique++;
      return prefix + '_' + random + unique + String(time);
    };

    var add$3 = function (element, classes) {
      each(classes, function (x) {
        add$2(element, x);
      });
    };

    var clone$1 = function (original, deep) {
      return Element$$1.fromDom(original.dom().cloneNode(deep));
    };
    var shallow = function (original) {
      return clone$1(original, false);
    };
    var deep = function (original) {
      return clone$1(original, true);
    };

    var fromHtml$1 = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      return children(Element$$1.fromDom(div));
    };

    var get$5 = function (element) {
      return element.dom().innerHTML;
    };
    var set$2 = function (element, content) {
      var owner$$1 = owner(element);
      var docDom = owner$$1.dom();
      var fragment = Element$$1.fromDom(docDom.createDocumentFragment());
      var contentElements = fromHtml$1(content, docDom);
      append$1(fragment, contentElements);
      empty(element);
      append(element, fragment);
    };

    var slice$3 = [].slice;
    var constant$1 = function (value) {
      return function () {
        return value;
      };
    };
    var negate = function (predicate) {
      return function (x) {
        return !predicate(x);
      };
    };
    var compose$2 = function (f, g) {
      return function (x) {
        return f(g(x));
      };
    };
    var or = function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      var args = slice$3.call(arguments);
      return function (x) {
        for (var i = 0; i < args.length; i++) {
          if (args[i](x)) {
            return true;
          }
        }
        return false;
      };
    };
    var and = function () {
      var x = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        x[_i] = arguments[_i];
      }
      var args = slice$3.call(arguments);
      return function (x) {
        for (var i = 0; i < args.length; i++) {
          if (!args[i](x)) {
            return false;
          }
        }
        return true;
      };
    };
    var curry$1 = function (fn) {
      var x = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
      }
      var args = slice$3.call(arguments);
      if (args.length - 1 >= fn.length) {
        return fn.apply(this, args.slice(1));
      }
      return function () {
        var tempArgs = args.concat([].slice.call(arguments));
        return curry$1.apply(this, tempArgs);
      };
    };
    var noop$1 = function () {
    };
    var Fun = {
      constant: constant$1,
      negate: negate,
      and: and,
      or: or,
      curry: curry$1,
      compose: compose$2,
      noop: noop$1
    };

    var ZWSP = '\uFEFF';
    var isZwsp = function (chr) {
      return chr === ZWSP;
    };
    var trim$3 = function (text) {
      return text.replace(new RegExp(ZWSP, 'g'), '');
    };
    var Zwsp = {
      isZwsp: isZwsp,
      ZWSP: ZWSP,
      trim: trim$3
    };

    var isElement$2 = NodeType.isElement;
    var isText$2 = NodeType.isText;
    var isCaretContainerBlock = function (node) {
      if (isText$2(node)) {
        node = node.parentNode;
      }
      return isElement$2(node) && node.hasAttribute('data-mce-caret');
    };
    var isCaretContainerInline = function (node) {
      return isText$2(node) && Zwsp.isZwsp(node.data);
    };
    var isCaretContainer = function (node) {
      return isCaretContainerBlock(node) || isCaretContainerInline(node);
    };
    var hasContent = function (node) {
      return node.firstChild !== node.lastChild || !NodeType.isBr(node.firstChild);
    };
    var insertInline = function (node, before) {
      var doc, sibling, textNode, parentNode;
      doc = node.ownerDocument;
      textNode = doc.createTextNode(Zwsp.ZWSP);
      parentNode = node.parentNode;
      if (!before) {
        sibling = node.nextSibling;
        if (isText$2(sibling)) {
          if (isCaretContainer(sibling)) {
            return sibling;
          }
          if (startsWithCaretContainer(sibling)) {
            sibling.splitText(1);
            return sibling;
          }
        }
        if (node.nextSibling) {
          parentNode.insertBefore(textNode, node.nextSibling);
        } else {
          parentNode.appendChild(textNode);
        }
      } else {
        sibling = node.previousSibling;
        if (isText$2(sibling)) {
          if (isCaretContainer(sibling)) {
            return sibling;
          }
          if (endsWithCaretContainer(sibling)) {
            return sibling.splitText(sibling.data.length - 1);
          }
        }
        parentNode.insertBefore(textNode, node);
      }
      return textNode;
    };
    var isBeforeInline = function (pos) {
      var container = pos.container();
      return pos && NodeType.isText(container) && container.data.charAt(pos.offset()) === Zwsp.ZWSP;
    };
    var isAfterInline = function (pos) {
      var container = pos.container();
      return pos && NodeType.isText(container) && container.data.charAt(pos.offset() - 1) === Zwsp.ZWSP;
    };
    var createBogusBr = function () {
      var br = document.createElement('br');
      br.setAttribute('data-mce-bogus', '1');
      return br;
    };
    var insertBlock = function (blockName, node, before) {
      var doc, blockNode, parentNode;
      doc = node.ownerDocument;
      blockNode = doc.createElement(blockName);
      blockNode.setAttribute('data-mce-caret', before ? 'before' : 'after');
      blockNode.setAttribute('data-mce-bogus', 'all');
      blockNode.appendChild(createBogusBr());
      parentNode = node.parentNode;
      if (!before) {
        if (node.nextSibling) {
          parentNode.insertBefore(blockNode, node.nextSibling);
        } else {
          parentNode.appendChild(blockNode);
        }
      } else {
        parentNode.insertBefore(blockNode, node);
      }
      return blockNode;
    };
    var startsWithCaretContainer = function (node) {
      return isText$2(node) && node.data[0] === Zwsp.ZWSP;
    };
    var endsWithCaretContainer = function (node) {
      return isText$2(node) && node.data[node.data.length - 1] === Zwsp.ZWSP;
    };
    var trimBogusBr = function (elm) {
      var brs = elm.getElementsByTagName('br');
      var lastBr = brs[brs.length - 1];
      if (NodeType.isBogus(lastBr)) {
        lastBr.parentNode.removeChild(lastBr);
      }
    };
    var showCaretContainerBlock = function (caretContainer) {
      if (caretContainer && caretContainer.hasAttribute('data-mce-caret')) {
        trimBogusBr(caretContainer);
        caretContainer.removeAttribute('data-mce-caret');
        caretContainer.removeAttribute('data-mce-bogus');
        caretContainer.removeAttribute('style');
        caretContainer.removeAttribute('_moz_abspos');
        return caretContainer;
      }
      return null;
    };
    var isRangeInCaretContainerBlock = function (range) {
      return isCaretContainerBlock(range.startContainer);
    };

    var isContentEditableTrue$1 = NodeType.isContentEditableTrue;
    var isContentEditableFalse$1 = NodeType.isContentEditableFalse;
    var isBr$2 = NodeType.isBr;
    var isText$3 = NodeType.isText;
    var isInvalidTextElement = NodeType.matchNodeNames('script style textarea');
    var isAtomicInline = NodeType.matchNodeNames('img input textarea hr iframe video audio object');
    var isTable$1 = NodeType.matchNodeNames('table');
    var isCaretContainer$1 = isCaretContainer;
    var isCaretCandidate = function (node) {
      if (isCaretContainer$1(node)) {
        return false;
      }
      if (isText$3(node)) {
        if (isInvalidTextElement(node.parentNode)) {
          return false;
        }
        return true;
      }
      return isAtomicInline(node) || isBr$2(node) || isTable$1(node) || isNonUiContentEditableFalse(node);
    };
    var isUnselectable = function (node) {
      return NodeType.isElement(node) && node.getAttribute('unselectable') === 'true';
    };
    var isNonUiContentEditableFalse = function (node) {
      return isUnselectable(node) === false && isContentEditableFalse$1(node);
    };
    var isInEditable = function (node, root) {
      for (node = node.parentNode; node && node !== root; node = node.parentNode) {
        if (isNonUiContentEditableFalse(node)) {
          return false;
        }
        if (isContentEditableTrue$1(node)) {
          return true;
        }
      }
      return true;
    };
    var isAtomicContentEditableFalse = function (node) {
      if (!isNonUiContentEditableFalse(node)) {
        return false;
      }
      return Arr.reduce(node.getElementsByTagName('*'), function (result, elm) {
        return result || isContentEditableTrue$1(elm);
      }, false) !== true;
    };
    var isAtomic = function (node) {
      return isAtomicInline(node) || isAtomicContentEditableFalse(node);
    };
    var isEditableCaretCandidate = function (node, root) {
      return isCaretCandidate(node) && isInEditable(node, root);
    };

    var round = Math.round;
    var clone$2 = function (rect) {
      if (!rect) {
        return {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          width: 0,
          height: 0
        };
      }
      return {
        left: round(rect.left),
        top: round(rect.top),
        bottom: round(rect.bottom),
        right: round(rect.right),
        width: round(rect.width),
        height: round(rect.height)
      };
    };
    var collapse = function (rect, toStart) {
      rect = clone$2(rect);
      if (toStart) {
        rect.right = rect.left;
      } else {
        rect.left = rect.left + rect.width;
        rect.right = rect.left;
      }
      rect.width = 0;
      return rect;
    };
    var isEqual = function (rect1, rect2) {
      return rect1.left === rect2.left && rect1.top === rect2.top && rect1.bottom === rect2.bottom && rect1.right === rect2.right;
    };
    var isValidOverflow = function (overflowY, rect1, rect2) {
      return overflowY >= 0 && overflowY <= Math.min(rect1.height, rect2.height) / 2;
    };
    var isAbove = function (rect1, rect2) {
      if (rect1.bottom - rect1.height / 2 < rect2.top) {
        return true;
      }
      if (rect1.top > rect2.bottom) {
        return false;
      }
      return isValidOverflow(rect2.top - rect1.bottom, rect1, rect2);
    };
    var isBelow = function (rect1, rect2) {
      if (rect1.top > rect2.bottom) {
        return true;
      }
      if (rect1.bottom < rect2.top) {
        return false;
      }
      return isValidOverflow(rect2.bottom - rect1.top, rect1, rect2);
    };
    var containsXY = function (rect, clientX, clientY) {
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    };
    var overflowX = function (outer, inner) {
      if (inner.left > outer.left && inner.right < outer.right) {
        return 0;
      } else {
        return inner.left < outer.left ? inner.left - outer.left : inner.right - outer.right;
      }
    };
    var overflowY = function (outer, inner) {
      if (inner.top > outer.top && inner.bottom < outer.bottom) {
        return 0;
      } else {
        return inner.top < outer.top ? inner.top - outer.top : inner.bottom - outer.bottom;
      }
    };
    var getOverflow = function (outer, inner) {
      return {
        x: overflowX(outer, inner),
        y: overflowY(outer, inner)
      };
    };

    var getSelectedNode = function (range) {
      var startContainer = range.startContainer, startOffset = range.startOffset;
      if (startContainer.hasChildNodes() && range.endOffset === startOffset + 1) {
        return startContainer.childNodes[startOffset];
      }
      return null;
    };
    var getNode = function (container, offset) {
      if (container.nodeType === 1 && container.hasChildNodes()) {
        if (offset >= container.childNodes.length) {
          offset = container.childNodes.length - 1;
        }
        container = container.childNodes[offset];
      }
      return container;
    };

    var extendingChars = new RegExp('[\u0300-\u036f\u0483-\u0487\u0488-\u0489\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a' + '\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0' + '\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08E3-\u0902\u093a\u093c' + '\u0941-\u0948\u094d\u0951-\u0957\u0962-\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2-\u09e3' + '\u0a01-\u0a02\u0a3c\u0a41-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a82\u0abc' + '\u0ac1-\u0ac5\u0ac7-\u0ac8\u0acd\u0ae2-\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57' + '\u0b62-\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c00\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56' + '\u0c62-\u0c63\u0c81\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc-\u0ccd\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d01\u0d3e\u0d41-\u0d44' + '\u0d4d\u0d57\u0d62-\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9' + '\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86-\u0f87\u0f8d-\u0f97' + '\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039-\u103a\u103d-\u103e\u1058-\u1059\u105e-\u1060\u1071-\u1074' + '\u1082\u1085-\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b4-\u17b5' + '\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193b\u1a17-\u1a18' + '\u1a1b\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1ab0-\u1abd\u1ABE\u1b00-\u1b03\u1b34' + '\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80-\u1b81\u1ba2-\u1ba5\u1ba8-\u1ba9\u1bab-\u1bad\u1be6\u1be8-\u1be9' + '\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1cf4\u1cf8-\u1cf9' + '\u1dc0-\u1df5\u1dfc-\u1dff\u200c-\u200d\u20d0-\u20dc\u20DD-\u20E0\u20e1\u20E2-\u20E4\u20e5-\u20f0\u2cef-\u2cf1' + '\u2d7f\u2de0-\u2dff\u302a-\u302d\u302e-\u302f\u3099-\u309a\ua66f\uA670-\uA672\ua674-\ua67d\uA69E-\ua69f\ua6f0-\ua6f1' + '\ua802\ua806\ua80b\ua825-\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc' + '\ua9e5\uaa29-\uaa2e\uaa31-\uaa32\uaa35-\uaa36\uaa43\uaa4c\uaa7c\uaab0\uaab2-\uaab4\uaab7-\uaab8\uaabe-\uaabf\uaac1' + '\uaaec-\uaaed\uaaf6\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\uFE2F\uff9e-\uff9f]');
    var isExtendingChar = function (ch) {
      return typeof ch === 'string' && ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
    };

    var liftN = function (arr, f) {
      var r = [];
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (x.isSome()) {
          r.push(x.getOrDie());
        } else {
          return Option.none();
        }
      }
      return Option.some(f.apply(null, r));
    };

    var isElement$3 = NodeType.isElement;
    var isCaretCandidate$1 = isCaretCandidate;
    var isBlock$1 = NodeType.matchStyleValues('display', 'block table');
    var isFloated = NodeType.matchStyleValues('float', 'left right');
    var isValidElementCaretCandidate = Fun.and(isElement$3, isCaretCandidate$1, Fun.negate(isFloated));
    var isNotPre = Fun.negate(NodeType.matchStyleValues('white-space', 'pre pre-line pre-wrap'));
    var isText$4 = NodeType.isText;
    var isBr$3 = NodeType.isBr;
    var nodeIndex = DOMUtils$1.nodeIndex;
    var resolveIndex = getNode;
    var createRange = function (doc) {
      return 'createRange' in doc ? doc.createRange() : DOMUtils$1.DOM.createRng();
    };
    var isWhiteSpace = function (chr) {
      return chr && /[\r\n\t ]/.test(chr);
    };
    var isRange = function (rng) {
      return !!rng.setStart && !!rng.setEnd;
    };
    var isHiddenWhiteSpaceRange = function (range$$1) {
      var container = range$$1.startContainer;
      var offset = range$$1.startOffset;
      var text;
      if (isWhiteSpace(range$$1.toString()) && isNotPre(container.parentNode) && NodeType.isText(container)) {
        text = container.data;
        if (isWhiteSpace(text[offset - 1]) || isWhiteSpace(text[offset + 1])) {
          return true;
        }
      }
      return false;
    };
    var getBrClientRect = function (brNode) {
      var doc = brNode.ownerDocument;
      var rng = createRange(doc);
      var nbsp = doc.createTextNode('\xA0');
      var parentNode = brNode.parentNode;
      var clientRect;
      parentNode.insertBefore(nbsp, brNode);
      rng.setStart(nbsp, 0);
      rng.setEnd(nbsp, 1);
      clientRect = clone$2(rng.getBoundingClientRect());
      parentNode.removeChild(nbsp);
      return clientRect;
    };
    var getBoundingClientRectWebKitText = function (rng) {
      var sc = rng.startContainer;
      var ec = rng.endContainer;
      var so = rng.startOffset;
      var eo = rng.endOffset;
      if (sc === ec && NodeType.isText(ec) && so === 0 && eo === 1) {
        var newRng = rng.cloneRange();
        newRng.setEndAfter(ec);
        return getBoundingClientRect(newRng);
      } else {
        return null;
      }
    };
    var isZeroRect = function (r) {
      return r.left === 0 && r.right === 0 && r.top === 0 && r.bottom === 0;
    };
    var getBoundingClientRect = function (item) {
      var clientRect, clientRects;
      clientRects = item.getClientRects();
      if (clientRects.length > 0) {
        clientRect = clone$2(clientRects[0]);
      } else {
        clientRect = clone$2(item.getBoundingClientRect());
      }
      if (!isRange(item) && isBr$3(item) && isZeroRect(clientRect)) {
        return getBrClientRect(item);
      }
      if (isZeroRect(clientRect) && isRange(item)) {
        return getBoundingClientRectWebKitText(item);
      }
      return clientRect;
    };
    var collapseAndInflateWidth = function (clientRect, toStart) {
      var newClientRect = collapse(clientRect, toStart);
      newClientRect.width = 1;
      newClientRect.right = newClientRect.left + 1;
      return newClientRect;
    };
    var getCaretPositionClientRects = function (caretPosition) {
      var clientRects = [];
      var beforeNode, node;
      var addUniqueAndValidRect = function (clientRect) {
        if (clientRect.height === 0) {
          return;
        }
        if (clientRects.length > 0) {
          if (isEqual(clientRect, clientRects[clientRects.length - 1])) {
            return;
          }
        }
        clientRects.push(clientRect);
      };
      var addCharacterOffset = function (container, offset) {
        var range$$1 = createRange(container.ownerDocument);
        if (offset < container.data.length) {
          if (isExtendingChar(container.data[offset])) {
            return clientRects;
          }
          if (isExtendingChar(container.data[offset - 1])) {
            range$$1.setStart(container, offset);
            range$$1.setEnd(container, offset + 1);
            if (!isHiddenWhiteSpaceRange(range$$1)) {
              addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), false));
              return clientRects;
            }
          }
        }
        if (offset > 0) {
          range$$1.setStart(container, offset - 1);
          range$$1.setEnd(container, offset);
          if (!isHiddenWhiteSpaceRange(range$$1)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), false));
          }
        }
        if (offset < container.data.length) {
          range$$1.setStart(container, offset);
          range$$1.setEnd(container, offset + 1);
          if (!isHiddenWhiteSpaceRange(range$$1)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range$$1), true));
          }
        }
      };
      if (isText$4(caretPosition.container())) {
        addCharacterOffset(caretPosition.container(), caretPosition.offset());
        return clientRects;
      }
      if (isElement$3(caretPosition.container())) {
        if (caretPosition.isAtEnd()) {
          node = resolveIndex(caretPosition.container(), caretPosition.offset());
          if (isText$4(node)) {
            addCharacterOffset(node, node.data.length);
          }
          if (isValidElementCaretCandidate(node) && !isBr$3(node)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false));
          }
        } else {
          node = resolveIndex(caretPosition.container(), caretPosition.offset());
          if (isText$4(node)) {
            addCharacterOffset(node, 0);
          }
          if (isValidElementCaretCandidate(node) && caretPosition.isAtEnd()) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false));
            return clientRects;
          }
          beforeNode = resolveIndex(caretPosition.container(), caretPosition.offset() - 1);
          if (isValidElementCaretCandidate(beforeNode) && !isBr$3(beforeNode)) {
            if (isBlock$1(beforeNode) || isBlock$1(node) || !isValidElementCaretCandidate(node)) {
              addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(beforeNode), false));
            }
          }
          if (isValidElementCaretCandidate(node)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), true));
          }
        }
      }
      return clientRects;
    };
    function CaretPosition(container, offset, clientRects) {
      var isAtStart = function () {
        if (isText$4(container)) {
          return offset === 0;
        }
        return offset === 0;
      };
      var isAtEnd = function () {
        if (isText$4(container)) {
          return offset >= container.data.length;
        }
        return offset >= container.childNodes.length;
      };
      var toRange = function () {
        var range$$1;
        range$$1 = createRange(container.ownerDocument);
        range$$1.setStart(container, offset);
        range$$1.setEnd(container, offset);
        return range$$1;
      };
      var getClientRects = function () {
        if (!clientRects) {
          clientRects = getCaretPositionClientRects(CaretPosition(container, offset));
        }
        return clientRects;
      };
      var isVisible = function () {
        return getClientRects().length > 0;
      };
      var isEqual$$1 = function (caretPosition) {
        return caretPosition && container === caretPosition.container() && offset === caretPosition.offset();
      };
      var getNode$$1 = function (before) {
        return resolveIndex(container, before ? offset - 1 : offset);
      };
      return {
        container: Fun.constant(container),
        offset: Fun.constant(offset),
        toRange: toRange,
        getClientRects: getClientRects,
        isVisible: isVisible,
        isAtStart: isAtStart,
        isAtEnd: isAtEnd,
        isEqual: isEqual$$1,
        getNode: getNode$$1
      };
    }
    (function (CaretPosition) {
      CaretPosition.fromRangeStart = function (range$$1) {
        return CaretPosition(range$$1.startContainer, range$$1.startOffset);
      };
      CaretPosition.fromRangeEnd = function (range$$1) {
        return CaretPosition(range$$1.endContainer, range$$1.endOffset);
      };
      CaretPosition.after = function (node) {
        return CaretPosition(node.parentNode, nodeIndex(node) + 1);
      };
      CaretPosition.before = function (node) {
        return CaretPosition(node.parentNode, nodeIndex(node));
      };
      CaretPosition.isAbove = function (pos1, pos2) {
        return liftN([
          head(pos2.getClientRects()),
          last(pos1.getClientRects())
        ], isAbove).getOr(false);
      };
      CaretPosition.isBelow = function (pos1, pos2) {
        return liftN([
          last(pos2.getClientRects()),
          head(pos1.getClientRects())
        ], isBelow).getOr(false);
      };
      CaretPosition.isAtStart = function (pos) {
        return pos ? pos.isAtStart() : false;
      };
      CaretPosition.isAtEnd = function (pos) {
        return pos ? pos.isAtEnd() : false;
      };
      CaretPosition.isTextPosition = function (pos) {
        return pos ? NodeType.isText(pos.container()) : false;
      };
      CaretPosition.isElementPosition = function (pos) {
        return CaretPosition.isTextPosition(pos) === false;
      };
    }(CaretPosition || (CaretPosition = {})));
    var CaretPosition$1 = CaretPosition;

    var isText$5 = NodeType.isText;
    var isBogus$1 = NodeType.isBogus;
    var nodeIndex$1 = DOMUtils$1.nodeIndex;
    var normalizedParent = function (node) {
      var parentNode = node.parentNode;
      if (isBogus$1(parentNode)) {
        return normalizedParent(parentNode);
      }
      return parentNode;
    };
    var getChildNodes = function (node) {
      if (!node) {
        return [];
      }
      return Arr.reduce(node.childNodes, function (result, node) {
        if (isBogus$1(node) && node.nodeName !== 'BR') {
          result = result.concat(getChildNodes(node));
        } else {
          result.push(node);
        }
        return result;
      }, []);
    };
    var normalizedTextOffset = function (node, offset) {
      while (node = node.previousSibling) {
        if (!isText$5(node)) {
          break;
        }
        offset += node.data.length;
      }
      return offset;
    };
    var equal$1 = function (a) {
      return function (b) {
        return a === b;
      };
    };
    var normalizedNodeIndex = function (node) {
      var nodes, index, numTextFragments;
      nodes = getChildNodes(normalizedParent(node));
      index = Arr.findIndex(nodes, equal$1(node), node);
      nodes = nodes.slice(0, index + 1);
      numTextFragments = Arr.reduce(nodes, function (result, node, i) {
        if (isText$5(node) && isText$5(nodes[i - 1])) {
          result++;
        }
        return result;
      }, 0);
      nodes = Arr.filter(nodes, NodeType.matchNodeNames(node.nodeName));
      index = Arr.findIndex(nodes, equal$1(node), node);
      return index - numTextFragments;
    };
    var createPathItem = function (node) {
      var name;
      if (isText$5(node)) {
        name = 'text()';
      } else {
        name = node.nodeName.toLowerCase();
      }
      return name + '[' + normalizedNodeIndex(node) + ']';
    };
    var parentsUntil = function (root, node, predicate) {
      var parents = [];
      for (node = node.parentNode; node !== root; node = node.parentNode) {
        if (predicate && predicate(node)) {
          break;
        }
        parents.push(node);
      }
      return parents;
    };
    var create$2 = function (root, caretPosition) {
      var container, offset, path = [], outputOffset, childNodes, parents;
      container = caretPosition.container();
      offset = caretPosition.offset();
      if (isText$5(container)) {
        outputOffset = normalizedTextOffset(container, offset);
      } else {
        childNodes = container.childNodes;
        if (offset >= childNodes.length) {
          outputOffset = 'after';
          offset = childNodes.length - 1;
        } else {
          outputOffset = 'before';
        }
        container = childNodes[offset];
      }
      path.push(createPathItem(container));
      parents = parentsUntil(root, container);
      parents = Arr.filter(parents, Fun.negate(NodeType.isBogus));
      path = path.concat(Arr.map(parents, function (node) {
        return createPathItem(node);
      }));
      return path.reverse().join('/') + ',' + outputOffset;
    };
    var resolvePathItem = function (node, name, index) {
      var nodes = getChildNodes(node);
      nodes = Arr.filter(nodes, function (node, index) {
        return !isText$5(node) || !isText$5(nodes[index - 1]);
      });
      nodes = Arr.filter(nodes, NodeType.matchNodeNames(name));
      return nodes[index];
    };
    var findTextPosition = function (container, offset) {
      var node = container, targetOffset = 0, dataLen;
      while (isText$5(node)) {
        dataLen = node.data.length;
        if (offset >= targetOffset && offset <= targetOffset + dataLen) {
          container = node;
          offset = offset - targetOffset;
          break;
        }
        if (!isText$5(node.nextSibling)) {
          container = node;
          offset = dataLen;
          break;
        }
        targetOffset += dataLen;
        node = node.nextSibling;
      }
      if (isText$5(container) && offset > container.data.length) {
        offset = container.data.length;
      }
      return CaretPosition$1(container, offset);
    };
    var resolve$2 = function (root, path) {
      var parts, container, offset;
      if (!path) {
        return null;
      }
      parts = path.split(',');
      path = parts[0].split('/');
      offset = parts.length > 1 ? parts[1] : 'before';
      container = Arr.reduce(path, function (result, value) {
        value = /([\w\-\(\)]+)\[([0-9]+)\]/.exec(value);
        if (!value) {
          return null;
        }
        if (value[1] === 'text()') {
          value[1] = '#text';
        }
        return resolvePathItem(result, value[1], parseInt(value[2], 10));
      }, root);
      if (!container) {
        return null;
      }
      if (!isText$5(container)) {
        if (offset === 'after') {
          offset = nodeIndex$1(container) + 1;
        } else {
          offset = nodeIndex$1(container);
        }
        return CaretPosition$1(container.parentNode, offset);
      }
      return findTextPosition(container, parseInt(offset, 10));
    };

    var isContentEditableFalse$2 = NodeType.isContentEditableFalse;
    var getNormalizedTextOffset = function (trim, container, offset) {
      var node, trimmedOffset;
      trimmedOffset = trim(container.data.slice(0, offset)).length;
      for (node = container.previousSibling; node && NodeType.isText(node); node = node.previousSibling) {
        trimmedOffset += trim(node.data).length;
      }
      return trimmedOffset;
    };
    var getPoint = function (dom, trim, normalized, rng, start) {
      var container = rng[start ? 'startContainer' : 'endContainer'];
      var offset = rng[start ? 'startOffset' : 'endOffset'];
      var point = [];
      var childNodes, after = 0;
      var root = dom.getRoot();
      if (NodeType.isText(container)) {
        point.push(normalized ? getNormalizedTextOffset(trim, container, offset) : offset);
      } else {
        childNodes = container.childNodes;
        if (offset >= childNodes.length && childNodes.length) {
          after = 1;
          offset = Math.max(0, childNodes.length - 1);
        }
        point.push(dom.nodeIndex(childNodes[offset], normalized) + after);
      }
      for (; container && container !== root; container = container.parentNode) {
        point.push(dom.nodeIndex(container, normalized));
      }
      return point;
    };
    var getLocation = function (trim, selection, normalized, rng) {
      var dom = selection.dom, bookmark = {};
      bookmark.start = getPoint(dom, trim, normalized, rng, true);
      if (!selection.isCollapsed()) {
        bookmark.end = getPoint(dom, trim, normalized, rng, false);
      }
      return bookmark;
    };
    var trimEmptyTextNode = function (node) {
      if (NodeType.isText(node) && node.data.length === 0) {
        node.parentNode.removeChild(node);
      }
    };
    var findIndex$3 = function (dom, name, element) {
      var count = 0;
      Tools.each(dom.select(name), function (node) {
        if (node.getAttribute('data-mce-bogus') === 'all') {
          return;
        }
        if (node === element) {
          return false;
        }
        count++;
      });
      return count;
    };
    var moveEndPoint = function (rng, start) {
      var container, offset, childNodes;
      var prefix = start ? 'start' : 'end';
      container = rng[prefix + 'Container'];
      offset = rng[prefix + 'Offset'];
      if (NodeType.isElement(container) && container.nodeName === 'TR') {
        childNodes = container.childNodes;
        container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];
        if (container) {
          offset = start ? 0 : container.childNodes.length;
          rng['set' + (start ? 'Start' : 'End')](container, offset);
        }
      }
    };
    var normalizeTableCellSelection = function (rng) {
      moveEndPoint(rng, true);
      moveEndPoint(rng, false);
      return rng;
    };
    var findSibling = function (node, offset) {
      var sibling;
      if (NodeType.isElement(node)) {
        node = getNode(node, offset);
        if (isContentEditableFalse$2(node)) {
          return node;
        }
      }
      if (isCaretContainer(node)) {
        if (NodeType.isText(node) && isCaretContainerBlock(node)) {
          node = node.parentNode;
        }
        sibling = node.previousSibling;
        if (isContentEditableFalse$2(sibling)) {
          return sibling;
        }
        sibling = node.nextSibling;
        if (isContentEditableFalse$2(sibling)) {
          return sibling;
        }
      }
    };
    var findAdjacentContentEditableFalseElm = function (rng) {
      return findSibling(rng.startContainer, rng.startOffset) || findSibling(rng.endContainer, rng.endOffset);
    };
    var getOffsetBookmark = function (trim, normalized, selection) {
      var element = selection.getNode();
      var name = element ? element.nodeName : null;
      var rng = selection.getRng();
      if (isContentEditableFalse$2(element) || name === 'IMG') {
        return {
          name: name,
          index: findIndex$3(selection.dom, name, element)
        };
      }
      var sibling = findAdjacentContentEditableFalseElm(rng);
      if (sibling) {
        name = sibling.tagName;
        return {
          name: name,
          index: findIndex$3(selection.dom, name, sibling)
        };
      }
      return getLocation(trim, selection, normalized, rng);
    };
    var getCaretBookmark = function (selection) {
      var rng = selection.getRng();
      return {
        start: create$2(selection.dom.getRoot(), CaretPosition$1.fromRangeStart(rng)),
        end: create$2(selection.dom.getRoot(), CaretPosition$1.fromRangeEnd(rng))
      };
    };
    var getRangeBookmark = function (selection) {
      return { rng: selection.getRng() };
    };
    var createBookmarkSpan = function (dom, id, filled) {
      var args = {
        'data-mce-type': 'bookmark',
        'id': id,
        'style': 'overflow:hidden;line-height:0px'
      };
      return filled ? dom.create('span', args, '&#xFEFF;') : dom.create('span', args);
    };
    var getPersistentBookmark = function (selection, filled) {
      var dom = selection.dom;
      var rng = selection.getRng();
      var id = dom.uniqueId();
      var collapsed = selection.isCollapsed();
      var element = selection.getNode();
      var name = element.nodeName;
      if (name === 'IMG') {
        return {
          name: name,
          index: findIndex$3(dom, name, element)
        };
      }
      var rng2 = normalizeTableCellSelection(rng.cloneRange());
      if (!collapsed) {
        rng2.collapse(false);
        var endBookmarkNode = createBookmarkSpan(dom, id + '_end', filled);
        rng2.insertNode(endBookmarkNode);
        trimEmptyTextNode(endBookmarkNode.nextSibling);
      }
      rng = normalizeTableCellSelection(rng);
      rng.collapse(true);
      var startBookmarkNode = createBookmarkSpan(dom, id + '_start', filled);
      rng.insertNode(startBookmarkNode);
      trimEmptyTextNode(startBookmarkNode.previousSibling);
      trimEmptyTextNode(startBookmarkNode.nextSibling);
      selection.moveToBookmark({
        id: id,
        keep: 1
      });
      return { id: id };
    };
    var getBookmark = function (selection, type, normalized) {
      if (type === 2) {
        return getOffsetBookmark(Zwsp.trim, normalized, selection);
      } else if (type === 3) {
        return getCaretBookmark(selection);
      } else if (type) {
        return getRangeBookmark(selection);
      } else {
        return getPersistentBookmark(selection, false);
      }
    };
    var GetBookmark = {
      getBookmark: getBookmark,
      getUndoBookmark: curry(getOffsetBookmark, identity, true),
      getPersistentBookmark: getPersistentBookmark
    };

    var CARET_ID = '_mce_caret';
    var isCaretNode = function (node) {
      return NodeType.isElement(node) && node.id === CARET_ID;
    };
    var getParentCaretContainer = function (body, node) {
      while (node && node !== body) {
        if (node.id === CARET_ID) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };

    var isElement$4 = NodeType.isElement;
    var isText$6 = NodeType.isText;
    var removeNode = function (node) {
      var parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
    };
    var getNodeValue = function (node) {
      try {
        return node.nodeValue;
      } catch (ex) {
        return '';
      }
    };
    var setNodeValue = function (node, text) {
      if (text.length === 0) {
        removeNode(node);
      } else {
        node.nodeValue = text;
      }
    };
    var trimCount = function (text) {
      var trimmedText = Zwsp.trim(text);
      return {
        count: text.length - trimmedText.length,
        text: trimmedText
      };
    };
    var removeUnchanged = function (caretContainer, pos) {
      remove$7(caretContainer);
      return pos;
    };
    var removeTextAndReposition = function (caretContainer, pos) {
      var before = trimCount(caretContainer.data.substr(0, pos.offset()));
      var after = trimCount(caretContainer.data.substr(pos.offset()));
      var text = before.text + after.text;
      if (text.length > 0) {
        setNodeValue(caretContainer, text);
        return CaretPosition$1(caretContainer, pos.offset() - before.count);
      } else {
        return pos;
      }
    };
    var removeElementAndReposition = function (caretContainer, pos) {
      var parentNode = pos.container();
      var newPosition = indexOf(from$1(parentNode.childNodes), caretContainer).map(function (index) {
        return index < pos.offset() ? CaretPosition$1(parentNode, pos.offset() - 1) : pos;
      }).getOr(pos);
      remove$7(caretContainer);
      return newPosition;
    };
    var removeTextCaretContainer = function (caretContainer, pos) {
      return isText$6(caretContainer) && pos.container() === caretContainer ? removeTextAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos);
    };
    var removeElementCaretContainer = function (caretContainer, pos) {
      return pos.container() === caretContainer.parentNode ? removeElementAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos);
    };
    var removeAndReposition = function (container, pos) {
      return CaretPosition$1.isTextPosition(pos) ? removeTextCaretContainer(container, pos) : removeElementCaretContainer(container, pos);
    };
    var remove$7 = function (caretContainerNode) {
      if (isElement$4(caretContainerNode) && isCaretContainer(caretContainerNode)) {
        if (hasContent(caretContainerNode)) {
          caretContainerNode.removeAttribute('data-mce-caret');
        } else {
          removeNode(caretContainerNode);
        }
      }
      if (isText$6(caretContainerNode)) {
        var text = Zwsp.trim(getNodeValue(caretContainerNode));
        setNodeValue(caretContainerNode, text);
      }
    };
    var CaretContainerRemove = {
      removeAndReposition: removeAndReposition,
      remove: remove$7
    };

    var isContentEditableTrue$2 = NodeType.isContentEditableTrue;
    var isContentEditableFalse$3 = NodeType.isContentEditableFalse;
    var showCaret = function (direction, editor, node, before, scrollIntoView) {
      return editor._selectionOverrides.showCaret(direction, node, before, scrollIntoView);
    };
    var getNodeRange = function (node) {
      var rng = node.ownerDocument.createRange();
      rng.selectNode(node);
      return rng;
    };
    var selectNode = function (editor, node) {
      var e = editor.fire('BeforeObjectSelected', { target: node });
      if (e.isDefaultPrevented()) {
        return null;
      }
      return getNodeRange(node);
    };
    var renderCaretAtRange = function (editor, range, scrollIntoView) {
      var normalizedRange = normalizeRange(1, editor.getBody(), range);
      var caretPosition = CaretPosition$1.fromRangeStart(normalizedRange);
      var caretPositionNode = caretPosition.getNode();
      if (isContentEditableFalse$3(caretPositionNode)) {
        return showCaret(1, editor, caretPositionNode, !caretPosition.isAtEnd(), false);
      }
      var caretPositionBeforeNode = caretPosition.getNode(true);
      if (isContentEditableFalse$3(caretPositionBeforeNode)) {
        return showCaret(1, editor, caretPositionBeforeNode, false, false);
      }
      var ceRoot = editor.dom.getParent(caretPosition.getNode(), function (node) {
        return isContentEditableFalse$3(node) || isContentEditableTrue$2(node);
      });
      if (isContentEditableFalse$3(ceRoot)) {
        return showCaret(1, editor, ceRoot, false, scrollIntoView);
      }
      return null;
    };
    var renderRangeCaret = function (editor, range, scrollIntoView) {
      if (!range || !range.collapsed) {
        return range;
      }
      var caretRange = renderCaretAtRange(editor, range, scrollIntoView);
      if (caretRange) {
        return caretRange;
      }
      return range;
    };

    var HDirection;
    (function (HDirection) {
      HDirection[HDirection['Backwards'] = -1] = 'Backwards';
      HDirection[HDirection['Forwards'] = 1] = 'Forwards';
    }(HDirection || (HDirection = {})));
    var isContentEditableFalse$4 = NodeType.isContentEditableFalse;
    var isText$7 = NodeType.isText;
    var isElement$5 = NodeType.isElement;
    var isBr$4 = NodeType.isBr;
    var isCaretCandidate$2 = isCaretCandidate;
    var isAtomic$1 = isAtomic;
    var isEditableCaretCandidate$1 = isEditableCaretCandidate;
    var getParents = function (node, root) {
      var parents = [];
      while (node && node !== root) {
        parents.push(node);
        node = node.parentNode;
      }
      return parents;
    };
    var nodeAtIndex = function (container, offset) {
      if (container.hasChildNodes() && offset < container.childNodes.length) {
        return container.childNodes[offset];
      }
      return null;
    };
    var getCaretCandidatePosition = function (direction, node) {
      if (isForwards(direction)) {
        if (isCaretCandidate$2(node.previousSibling) && !isText$7(node.previousSibling)) {
          return CaretPosition$1.before(node);
        }
        if (isText$7(node)) {
          return CaretPosition$1(node, 0);
        }
      }
      if (isBackwards(direction)) {
        if (isCaretCandidate$2(node.nextSibling) && !isText$7(node.nextSibling)) {
          return CaretPosition$1.after(node);
        }
        if (isText$7(node)) {
          return CaretPosition$1(node, node.data.length);
        }
      }
      if (isBackwards(direction)) {
        if (isBr$4(node)) {
          return CaretPosition$1.before(node);
        }
        return CaretPosition$1.after(node);
      }
      return CaretPosition$1.before(node);
    };
    var isBrBeforeBlock = function (node, root) {
      var next;
      if (!NodeType.isBr(node)) {
        return false;
      }
      if (isAtomic(node.nextSibling)) {
        return false;
      }
      next = findCaretPosition(HDirection.Forwards, CaretPosition$1.after(node), root);
      if (!next) {
        return false;
      }
      return !isInSameBlock(CaretPosition$1.before(node), CaretPosition$1.before(next), root);
    };
    var findCaretPosition = function (direction, startPos, root) {
      var node, nextNode, innerNode;
      var rootContentEditableFalseElm, caretPosition;
      if (!isElement$5(root) || !startPos) {
        return null;
      }
      if (startPos.isEqual(CaretPosition$1.after(root)) && root.lastChild) {
        caretPosition = CaretPosition$1.after(root.lastChild);
        if (isBackwards(direction) && isCaretCandidate$2(root.lastChild) && isElement$5(root.lastChild)) {
          return isBr$4(root.lastChild) ? CaretPosition$1.before(root.lastChild) : caretPosition;
        }
      } else {
        caretPosition = startPos;
      }
      var container = caretPosition.container();
      var offset = caretPosition.offset();
      if (isText$7(container)) {
        if (isBackwards(direction) && offset > 0) {
          return CaretPosition$1(container, --offset);
        }
        if (isForwards(direction) && offset < container.length) {
          return CaretPosition$1(container, ++offset);
        }
        node = container;
      } else {
        if (isBackwards(direction) && offset > 0) {
          nextNode = nodeAtIndex(container, offset - 1);
          if (isCaretCandidate$2(nextNode)) {
            if (!isAtomic$1(nextNode)) {
              innerNode = findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode);
              if (innerNode) {
                if (isText$7(innerNode)) {
                  return CaretPosition$1(innerNode, innerNode.data.length);
                }
                return CaretPosition$1.after(innerNode);
              }
            }
            if (isText$7(nextNode)) {
              return CaretPosition$1(nextNode, nextNode.data.length);
            }
            return CaretPosition$1.before(nextNode);
          }
        }
        if (isForwards(direction) && offset < container.childNodes.length) {
          nextNode = nodeAtIndex(container, offset);
          if (isCaretCandidate$2(nextNode)) {
            if (isBr$4(nextNode) && root.lastChild === nextNode) {
              return null;
            }
            if (isBrBeforeBlock(nextNode, root)) {
              return findCaretPosition(direction, CaretPosition$1.after(nextNode), root);
            }
            if (!isAtomic$1(nextNode)) {
              innerNode = findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode);
              if (innerNode) {
                if (isText$7(innerNode)) {
                  return CaretPosition$1(innerNode, 0);
                }
                return CaretPosition$1.before(innerNode);
              }
            }
            if (isText$7(nextNode)) {
              return CaretPosition$1(nextNode, 0);
            }
            return CaretPosition$1.after(nextNode);
          }
        }
        node = nextNode ? nextNode : caretPosition.getNode();
      }
      if (isForwards(direction) && caretPosition.isAtEnd() || isBackwards(direction) && caretPosition.isAtStart()) {
        node = findNode(node, direction, Fun.constant(true), root, true);
        if (isEditableCaretCandidate$1(node, root)) {
          return getCaretCandidatePosition(direction, node);
        }
      }
      nextNode = findNode(node, direction, isEditableCaretCandidate$1, root);
      rootContentEditableFalseElm = Arr.last(Arr.filter(getParents(container, root), isContentEditableFalse$4));
      if (rootContentEditableFalseElm && (!nextNode || !rootContentEditableFalseElm.contains(nextNode))) {
        if (isForwards(direction)) {
          caretPosition = CaretPosition$1.after(rootContentEditableFalseElm);
        } else {
          caretPosition = CaretPosition$1.before(rootContentEditableFalseElm);
        }
        return caretPosition;
      }
      if (nextNode) {
        return getCaretCandidatePosition(direction, nextNode);
      }
      return null;
    };
    var CaretWalker = function (root) {
      return {
        next: function (caretPosition) {
          return findCaretPosition(HDirection.Forwards, caretPosition, root);
        },
        prev: function (caretPosition) {
          return findCaretPosition(HDirection.Backwards, caretPosition, root);
        }
      };
    };

    var BreakType;
    (function (BreakType) {
      BreakType[BreakType['Br'] = 0] = 'Br';
      BreakType[BreakType['Block'] = 1] = 'Block';
      BreakType[BreakType['Wrap'] = 2] = 'Wrap';
      BreakType[BreakType['Eol'] = 3] = 'Eol';
    }(BreakType || (BreakType = {})));
    var flip = function (direction, positions) {
      return direction === HDirection.Backwards ? positions.reverse() : positions;
    };
    var walk$1 = function (direction, caretWalker, pos) {
      return direction === HDirection.Forwards ? caretWalker.next(pos) : caretWalker.prev(pos);
    };
    var getBreakType = function (scope, direction, currentPos, nextPos) {
      if (NodeType.isBr(nextPos.getNode(direction === HDirection.Forwards))) {
        return BreakType.Br;
      } else if (isInSameBlock(currentPos, nextPos) === false) {
        return BreakType.Block;
      } else {
        return BreakType.Wrap;
      }
    };
    var getPositionsUntil = function (predicate, direction, scope, start) {
      var caretWalker = CaretWalker(scope);
      var currentPos = start, nextPos;
      var positions = [];
      while (currentPos) {
        nextPos = walk$1(direction, caretWalker, currentPos);
        if (!nextPos) {
          break;
        }
        if (NodeType.isBr(nextPos.getNode(false))) {
          if (direction === HDirection.Forwards) {
            return {
              positions: flip(direction, positions).concat([nextPos]),
              breakType: BreakType.Br,
              breakAt: Option.some(nextPos)
            };
          } else {
            return {
              positions: flip(direction, positions),
              breakType: BreakType.Br,
              breakAt: Option.some(nextPos)
            };
          }
        }
        if (!nextPos.isVisible()) {
          currentPos = nextPos;
          continue;
        }
        if (predicate(currentPos, nextPos)) {
          var breakType = getBreakType(scope, direction, currentPos, nextPos);
          return {
            positions: flip(direction, positions),
            breakType: breakType,
            breakAt: Option.some(nextPos)
          };
        }
        positions.push(nextPos);
        currentPos = nextPos;
      }
      return {
        positions: flip(direction, positions),
        breakType: BreakType.Eol,
        breakAt: Option.none()
      };
    };
    var getAdjacentLinePositions = function (direction, getPositionsUntilBreak, scope, start) {
      return getPositionsUntilBreak(scope, start).breakAt.map(function (pos) {
        var positions = getPositionsUntilBreak(scope, pos).positions;
        return direction === HDirection.Backwards ? positions.concat(pos) : [pos].concat(positions);
      }).getOr([]);
    };
    var findClosestHorizontalPositionFromPoint = function (positions, x) {
      return foldl(positions, function (acc, newPos) {
        return acc.fold(function () {
          return Option.some(newPos);
        }, function (lastPos) {
          return liftN([
            head(lastPos.getClientRects()),
            head(newPos.getClientRects())
          ], function (lastRect, newRect) {
            var lastDist = Math.abs(x - lastRect.left);
            var newDist = Math.abs(x - newRect.left);
            return newDist <= lastDist ? newPos : lastPos;
          }).or(acc);
        });
      }, Option.none());
    };
    var findClosestHorizontalPosition = function (positions, pos) {
      return head(pos.getClientRects()).bind(function (targetRect) {
        return findClosestHorizontalPositionFromPoint(positions, targetRect.left);
      });
    };
    var getPositionsUntilPreviousLine = curry(getPositionsUntil, CaretPosition.isAbove, -1);
    var getPositionsUntilNextLine = curry(getPositionsUntil, CaretPosition.isBelow, 1);
    var getPositionsAbove = curry(getAdjacentLinePositions, -1, getPositionsUntilPreviousLine);
    var getPositionsBelow = curry(getAdjacentLinePositions, 1, getPositionsUntilNextLine);
    var getFirstLinePositions = function (scope) {
      return CaretFinder.firstPositionIn(scope).map(function (pos) {
        return [pos].concat(getPositionsUntilNextLine(scope, pos).positions);
      }).getOr([]);
    };
    var getLastLinePositions = function (scope) {
      return CaretFinder.lastPositionIn(scope).map(function (pos) {
        return getPositionsUntilPreviousLine(scope, pos).positions.concat(pos);
      }).getOr([]);
    };

    var deflate = function (rect, delta) {
      return {
        left: rect.left - delta,
        top: rect.top - delta,
        right: rect.right + delta * 2,
        bottom: rect.bottom + delta * 2,
        width: rect.width + delta,
        height: rect.height + delta
      };
    };
    var getCorners = function (getYAxisValue, tds) {
      return bind(tds, function (td) {
        var rect = deflate(clone$2(td.getBoundingClientRect()), -1);
        return [
          {
            x: rect.left,
            y: getYAxisValue(rect),
            cell: td
          },
          {
            x: rect.right,
            y: getYAxisValue(rect),
            cell: td
          }
        ];
      });
    };
    var findClosestCorner = function (corners, x, y) {
      return foldl(corners, function (acc, newCorner) {
        return acc.fold(function () {
          return Option.some(newCorner);
        }, function (oldCorner) {
          var oldDist = Math.sqrt(Math.abs(oldCorner.x - x) + Math.abs(oldCorner.y - y));
          var newDist = Math.sqrt(Math.abs(newCorner.x - x) + Math.abs(newCorner.y - y));
          return Option.some(newDist < oldDist ? newCorner : oldCorner);
        });
      }, Option.none());
    };
    var getClosestCell = function (getYAxisValue, isTargetCorner, table, x, y) {
      var cells = descendants$1(Element$$1.fromDom(table), 'td,th,caption').map(function (e) {
        return e.dom();
      });
      var corners = filter(getCorners(getYAxisValue, cells), function (corner) {
        return isTargetCorner(corner, y);
      });
      return findClosestCorner(corners, x, y).map(function (corner) {
        return corner.cell;
      });
    };
    var getBottomValue = function (rect) {
      return rect.bottom;
    };
    var getTopValue = function (rect) {
      return rect.top;
    };
    var isAbove$1 = function (corner, y) {
      return corner.y < y;
    };
    var isBelow$1 = function (corner, y) {
      return corner.y > y;
    };
    var getClosestCellAbove = curry(getClosestCell, getBottomValue, isAbove$1);
    var getClosestCellBelow = curry(getClosestCell, getTopValue, isBelow$1);
    var findClosestPositionInAboveCell = function (table, pos) {
      return head(pos.getClientRects()).bind(function (rect) {
        return getClosestCellAbove(table, rect.left, rect.top);
      }).bind(function (cell) {
        return findClosestHorizontalPosition(getLastLinePositions(cell), pos);
      });
    };
    var findClosestPositionInBelowCell = function (table, pos) {
      return last(pos.getClientRects()).bind(function (rect) {
        return getClosestCellBelow(table, rect.left, rect.top);
      }).bind(function (cell) {
        return findClosestHorizontalPosition(getFirstLinePositions(cell), pos);
      });
    };

    var getPos$1 = function (elm) {
      var x = 0, y = 0;
      var offsetParent = elm;
      while (offsetParent && offsetParent.nodeType) {
        x += offsetParent.offsetLeft || 0;
        y += offsetParent.offsetTop || 0;
        offsetParent = offsetParent.offsetParent;
      }
      return {
        x: x,
        y: y
      };
    };
    var fireScrollIntoViewEvent = function (editor, elm, alignToTop) {
      var scrollEvent = {
        elm: elm,
        alignToTop: alignToTop
      };
      editor.fire('scrollIntoView', scrollEvent);
      return scrollEvent.isDefaultPrevented();
    };
    var scrollElementIntoView = function (editor, elm, alignToTop) {
      var y, viewPort;
      var dom = editor.dom;
      var root = dom.getRoot();
      var viewPortY, viewPortH, offsetY = 0;
      if (fireScrollIntoViewEvent(editor, elm, alignToTop)) {
        return;
      }
      if (!NodeType.isElement(elm)) {
        return;
      }
      if (alignToTop === false) {
        offsetY = elm.offsetHeight;
      }
      if (root.nodeName !== 'BODY') {
        var scrollContainer = editor.selection.getScrollContainer();
        if (scrollContainer) {
          y = getPos$1(elm).y - getPos$1(scrollContainer).y + offsetY;
          viewPortH = scrollContainer.clientHeight;
          viewPortY = scrollContainer.scrollTop;
          if (y < viewPortY || y + 25 > viewPortY + viewPortH) {
            scrollContainer.scrollTop = y < viewPortY ? y : y - viewPortH + 25;
          }
          return;
        }
      }
      viewPort = dom.getViewPort(editor.getWin());
      y = dom.getPos(elm).y + offsetY;
      viewPortY = viewPort.y;
      viewPortH = viewPort.h;
      if (y < viewPort.y || y + 25 > viewPortY + viewPortH) {
        editor.getWin().scrollTo(0, y < viewPortY ? y : y - viewPortH + 25);
      }
    };
    var getViewPortRect = function (editor) {
      if (editor.inline) {
        return editor.getBody().getBoundingClientRect();
      } else {
        var win = editor.getWin();
        return {
          left: 0,
          right: win.innerWidth,
          top: 0,
          bottom: win.innerHeight,
          width: win.innerWidth,
          height: win.innerHeight
        };
      }
    };
    var scrollBy = function (editor, dx, dy) {
      if (editor.inline) {
        editor.getBody().scrollLeft += dx;
        editor.getBody().scrollTop += dy;
      } else {
        editor.getWin().scrollBy(dx, dy);
      }
    };
    var scrollRangeIntoView = function (editor, rng) {
      head(CaretPosition.fromRangeStart(rng).getClientRects()).each(function (rngRect) {
        var bodyRect = getViewPortRect(editor);
        var overflow = getOverflow(bodyRect, rngRect);
        var margin = 4;
        var dx = overflow.x > 0 ? overflow.x + margin : overflow.x - margin;
        var dy = overflow.y > 0 ? overflow.y + margin : overflow.y - margin;
        scrollBy(editor, overflow.x !== 0 ? dx : 0, overflow.y !== 0 ? dy : 0);
      });
    };
    var ScrollIntoView = {
      scrollElementIntoView: scrollElementIntoView,
      scrollRangeIntoView: scrollRangeIntoView
    };

    var getBodySetting = function (editor, name, defaultValue) {
      var value = editor.getParam(name, defaultValue);
      if (value.indexOf('=') !== -1) {
        var bodyObj = editor.getParam(name, '', 'hash');
        return bodyObj.hasOwnProperty(editor.id) ? bodyObj[editor.id] : defaultValue;
      } else {
        return value;
      }
    };
    var getIframeAttrs = function (editor) {
      return editor.getParam('iframe_attrs', {});
    };
    var getDocType = function (editor) {
      return editor.getParam('doctype', '<!DOCTYPE html>');
    };
    var getDocumentBaseUrl = function (editor) {
      return editor.getParam('document_base_url', '');
    };
    var getBodyId = function (editor) {
      return getBodySetting(editor, 'body_id', 'tinymce');
    };
    var getBodyClass = function (editor) {
      return getBodySetting(editor, 'body_class', '');
    };
    var getContentSecurityPolicy = function (editor) {
      return editor.getParam('content_security_policy', '');
    };
    var shouldPutBrInPre = function (editor) {
      return editor.getParam('br_in_pre', true);
    };
    var getForcedRootBlock = function (editor) {
      if (editor.getParam('force_p_newlines', false)) {
        return 'p';
      }
      var block = editor.getParam('forced_root_block', 'p');
      return block === false ? '' : block;
    };
    var getForcedRootBlockAttrs = function (editor) {
      return editor.getParam('forced_root_block_attrs', {});
    };
    var getBrNewLineSelector = function (editor) {
      return editor.getParam('br_newline_selector', '.mce-toc h2,figcaption,caption');
    };
    var getNoNewLineSelector = function (editor) {
      return editor.getParam('no_newline_selector', '');
    };
    var shouldKeepStyles = function (editor) {
      return editor.getParam('keep_styles', true);
    };
    var shouldEndContainerOnEmptyBlock = function (editor) {
      return editor.getParam('end_container_on_empty_block', false);
    };
    var getFontStyleValues = function (editor) {
      return Tools.explode(editor.getParam('font_size_style_values', ''));
    };
    var getFontSizeClasses = function (editor) {
      return Tools.explode(editor.getParam('font_size_classes', ''));
    };
    var getImagesDataImgFilter = function (editor) {
      return editor.getParam('images_dataimg_filter', constant(true), 'function');
    };
    var isAutomaticUploadsEnabled = function (editor) {
      return editor.getParam('automatic_uploads', true, 'boolean');
    };
    var shouldReuseFileName = function (editor) {
      return editor.getParam('images_reuse_filename', false, 'boolean');
    };
    var shouldReplaceBlobUris = function (editor) {
      return editor.getParam('images_replace_blob_uris', true, 'boolean');
    };
    var getImageUploadUrl = function (editor) {
      return editor.getParam('images_upload_url', '', 'string');
    };
    var getImageUploadBasePath = function (editor) {
      return editor.getParam('images_upload_base_path', '', 'string');
    };
    var getImagesUploadCredentials = function (editor) {
      return editor.getParam('images_upload_credentials', false, 'boolean');
    };
    var getImagesUploadHandler = function (editor) {
      return editor.getParam('images_upload_handler', null, 'function');
    };
    var shouldUseContentCssCors = function (editor) {
      return editor.getParam('content_css_cors', false, 'boolean');
    };
    var Settings = {
      getIframeAttrs: getIframeAttrs,
      getDocType: getDocType,
      getDocumentBaseUrl: getDocumentBaseUrl,
      getBodyId: getBodyId,
      getBodyClass: getBodyClass,
      getContentSecurityPolicy: getContentSecurityPolicy,
      shouldPutBrInPre: shouldPutBrInPre,
      getForcedRootBlock: getForcedRootBlock,
      getForcedRootBlockAttrs: getForcedRootBlockAttrs,
      getBrNewLineSelector: getBrNewLineSelector,
      getNoNewLineSelector: getNoNewLineSelector,
      shouldKeepStyles: shouldKeepStyles,
      shouldEndContainerOnEmptyBlock: shouldEndContainerOnEmptyBlock,
      getFontStyleValues: getFontStyleValues,
      getFontSizeClasses: getFontSizeClasses,
      getImagesDataImgFilter: getImagesDataImgFilter,
      isAutomaticUploadsEnabled: isAutomaticUploadsEnabled,
      shouldReuseFileName: shouldReuseFileName,
      shouldReplaceBlobUris: shouldReplaceBlobUris,
      getImageUploadUrl: getImageUploadUrl,
      getImageUploadBasePath: getImageUploadBasePath,
      getImagesUploadCredentials: getImagesUploadCredentials,
      getImagesUploadHandler: getImagesUploadHandler,
      shouldUseContentCssCors: shouldUseContentCssCors
    };

    var browser$2 = PlatformDetection$1.detect().browser;
    var isFakeCaretTableBrowser = function () {
      return browser$2.isIE() || browser$2.isEdge() || browser$2.isFirefox();
    };
    var moveToRange = function (editor, rng) {
      editor.selection.setRng(rng);
      ScrollIntoView.scrollRangeIntoView(editor, rng);
    };
    var hasNextBreak = function (getPositionsUntil, scope, lineInfo) {
      return lineInfo.breakAt.map(function (breakPos) {
        return getPositionsUntil(scope, breakPos).breakAt.isSome();
      }).getOr(false);
    };
    var startsWithWrapBreak = function (lineInfo) {
      return lineInfo.breakType === BreakType.Wrap && lineInfo.positions.length === 0;
    };
    var startsWithBrBreak = function (lineInfo) {
      return lineInfo.breakType === BreakType.Br && lineInfo.positions.length === 1;
    };
    var isAtTableCellLine = function (getPositionsUntil, scope, pos) {
      var lineInfo = getPositionsUntil(scope, pos);
      if (startsWithWrapBreak(lineInfo) || !NodeType.isBr(pos.getNode()) && startsWithBrBreak(lineInfo)) {
        return !hasNextBreak(getPositionsUntil, scope, lineInfo);
      } else {
        return lineInfo.breakAt.isNone();
      }
    };
    var isAtFirstTableCellLine = Fun.curry(isAtTableCellLine, getPositionsUntilPreviousLine);
    var isAtLastTableCellLine = Fun.curry(isAtTableCellLine, getPositionsUntilNextLine);
    var isCaretAtStartOrEndOfTable = function (forward, rng, table) {
      var caretPos = CaretPosition$1.fromRangeStart(rng);
      return CaretFinder.positionIn(!forward, table).map(function (pos) {
        return pos.isEqual(caretPos);
      }).getOr(false);
    };
    var navigateHorizontally = function (editor, forward, table, td) {
      var rng = editor.selection.getRng();
      var direction = forward ? 1 : -1;
      if (isFakeCaretTableBrowser() && isCaretAtStartOrEndOfTable(forward, rng, table)) {
        var newRng = showCaret(direction, editor, table, !forward, true);
        moveToRange(editor, newRng);
        return true;
      }
      return false;
    };
    var getClosestAbovePosition = function (root, table, start) {
      return findClosestPositionInAboveCell(table, start).orThunk(function () {
        return head(start.getClientRects()).bind(function (rect) {
          return findClosestHorizontalPositionFromPoint(getPositionsAbove(root, CaretPosition$1.before(table)), rect.left);
        });
      }).getOr(CaretPosition$1.before(table));
    };
    var getClosestBelowPosition = function (root, table, start) {
      return findClosestPositionInBelowCell(table, start).orThunk(function () {
        return head(start.getClientRects()).bind(function (rect) {
          return findClosestHorizontalPositionFromPoint(getPositionsBelow(root, CaretPosition$1.after(table)), rect.left);
        });
      }).getOr(CaretPosition$1.after(table));
    };
    var getTable = function (previous, pos) {
      var node = pos.getNode(previous);
      return NodeType.isElement(node) && node.nodeName === 'TABLE' ? Option.some(node) : Option.none();
    };
    var renderBlock = function (down, editor, table, pos) {
      var forcedRootBlock = Settings.getForcedRootBlock(editor);
      if (forcedRootBlock) {
        editor.undoManager.transact(function () {
          var element = Element$$1.fromTag(forcedRootBlock);
          setAll(element, Settings.getForcedRootBlockAttrs(editor));
          append(element, Element$$1.fromTag('br'));
          if (down) {
            after(Element$$1.fromDom(table), element);
          } else {
            before(Element$$1.fromDom(table), element);
          }
          var rng = editor.dom.createRng();
          rng.setStart(element.dom(), 0);
          rng.setEnd(element.dom(), 0);
          moveToRange(editor, rng);
        });
      } else {
        moveToRange(editor, pos.toRange());
      }
    };
    var moveCaret = function (editor, down, pos) {
      var table = down ? getTable(true, pos) : getTable(false, pos);
      var last$$1 = down === false;
      table.fold(function () {
        return moveToRange(editor, pos.toRange());
      }, function (table) {
        return CaretFinder.positionIn(last$$1, editor.getBody()).filter(function (lastPos) {
          return lastPos.isEqual(pos);
        }).fold(function () {
          return moveToRange(editor, pos.toRange());
        }, function (_) {
          return renderBlock(down, editor, table, pos);
        });
      });
    };
    var navigateVertically = function (editor, down, table, td) {
      var rng = editor.selection.getRng();
      var pos = CaretPosition$1.fromRangeStart(rng);
      var root = editor.getBody();
      if (!down && isAtFirstTableCellLine(td, pos)) {
        var newPos = getClosestAbovePosition(root, table, pos);
        moveCaret(editor, down, newPos);
        return true;
      } else if (down && isAtLastTableCellLine(td, pos)) {
        var newPos = getClosestBelowPosition(root, table, pos);
        moveCaret(editor, down, newPos);
        return true;
      } else {
        return false;
      }
    };
    var moveH = function (editor, forward) {
      return function () {
        return Option.from(editor.dom.getParent(editor.selection.getNode(), 'td,th')).bind(function (td) {
          return Option.from(editor.dom.getParent(td, 'table')).map(function (table) {
            return navigateHorizontally(editor, forward, table, td);
          });
        }).getOr(false);
      };
    };
    var moveV = function (editor, forward) {
      return function () {
        return Option.from(editor.dom.getParent(editor.selection.getNode(), 'td,th')).bind(function (td) {
          return Option.from(editor.dom.getParent(td, 'table')).map(function (table) {
            return navigateVertically(editor, forward, table, td);
          });
        }).getOr(false);
      };
    };

    var isContentEditableFalse$5 = NodeType.isContentEditableFalse;
    var isTableCell$1 = function (node) {
      return NodeType.isElement(node) && /^(TD|TH)$/i.test(node.tagName);
    };
    var getAbsoluteClientRect = function (root, element, before) {
      var clientRect = collapse(element.getBoundingClientRect(), before);
      var docElm, scrollX, scrollY, margin, rootRect;
      if (root.tagName === 'BODY') {
        docElm = root.ownerDocument.documentElement;
        scrollX = root.scrollLeft || docElm.scrollLeft;
        scrollY = root.scrollTop || docElm.scrollTop;
      } else {
        rootRect = root.getBoundingClientRect();
        scrollX = root.scrollLeft - rootRect.left;
        scrollY = root.scrollTop - rootRect.top;
      }
      clientRect.left += scrollX;
      clientRect.right += scrollX;
      clientRect.top += scrollY;
      clientRect.bottom += scrollY;
      clientRect.width = 1;
      margin = element.offsetWidth - element.clientWidth;
      if (margin > 0) {
        if (before) {
          margin *= -1;
        }
        clientRect.left += margin;
        clientRect.right += margin;
      }
      return clientRect;
    };
    var trimInlineCaretContainers = function (root) {
      var contentEditableFalseNodes, node, sibling, i, data;
      contentEditableFalseNodes = DomQuery('*[contentEditable=false]', root);
      for (i = 0; i < contentEditableFalseNodes.length; i++) {
        node = contentEditableFalseNodes[i];
        sibling = node.previousSibling;
        if (endsWithCaretContainer(sibling)) {
          data = sibling.data;
          if (data.length === 1) {
            sibling.parentNode.removeChild(sibling);
          } else {
            sibling.deleteData(data.length - 1, 1);
          }
        }
        sibling = node.nextSibling;
        if (startsWithCaretContainer(sibling)) {
          data = sibling.data;
          if (data.length === 1) {
            sibling.parentNode.removeChild(sibling);
          } else {
            sibling.deleteData(0, 1);
          }
        }
      }
    };
    var FakeCaret = function (root, isBlock, hasFocus) {
      var lastVisualCaret = Cell(Option.none());
      var cursorInterval, caretContainerNode;
      var show = function (before, element) {
        var clientRect, rng;
        hide();
        if (isTableCell$1(element)) {
          return null;
        }
        if (isBlock(element)) {
          caretContainerNode = insertBlock('p', element, before);
          clientRect = getAbsoluteClientRect(root, element, before);
          DomQuery(caretContainerNode).css('top', clientRect.top);
          var caret = DomQuery('<div class="mce-visual-caret" data-mce-bogus="all"></div>').css(clientRect).appendTo(root)[0];
          lastVisualCaret.set(Option.some({
            caret: caret,
            element: element,
            before: before
          }));
          lastVisualCaret.get().each(function (caretState) {
            if (before) {
              DomQuery(caretState.caret).addClass('mce-visual-caret-before');
            }
          });
          startBlink();
          rng = element.ownerDocument.createRange();
          rng.setStart(caretContainerNode, 0);
          rng.setEnd(caretContainerNode, 0);
        } else {
          caretContainerNode = insertInline(element, before);
          rng = element.ownerDocument.createRange();
          if (isContentEditableFalse$5(caretContainerNode.nextSibling)) {
            rng.setStart(caretContainerNode, 0);
            rng.setEnd(caretContainerNode, 0);
          } else {
            rng.setStart(caretContainerNode, 1);
            rng.setEnd(caretContainerNode, 1);
          }
          return rng;
        }
        return rng;
      };
      var hide = function () {
        trimInlineCaretContainers(root);
        if (caretContainerNode) {
          CaretContainerRemove.remove(caretContainerNode);
          caretContainerNode = null;
        }
        lastVisualCaret.get().each(function (caretState) {
          DomQuery(caretState.caret).remove();
          lastVisualCaret.set(Option.none());
        });
        clearInterval(cursorInterval);
      };
      var startBlink = function () {
        cursorInterval = Delay.setInterval(function () {
          if (hasFocus()) {
            DomQuery('div.mce-visual-caret', root).toggleClass('mce-visual-caret-hidden');
          } else {
            DomQuery('div.mce-visual-caret', root).addClass('mce-visual-caret-hidden');
          }
        }, 500);
      };
      var reposition = function () {
        lastVisualCaret.get().each(function (caretState) {
          var clientRect = getAbsoluteClientRect(root, caretState.element, caretState.before);
          DomQuery(caretState.caret).css(clientRect);
        });
      };
      var destroy = function () {
        return Delay.clearInterval(cursorInterval);
      };
      var getCss = function () {
        return '.mce-visual-caret {' + 'position: absolute;' + 'background-color: black;' + 'background-color: currentcolor;' + '}' + '.mce-visual-caret-hidden {' + 'display: none;' + '}' + '*[data-mce-caret] {' + 'position: absolute;' + 'left: -1000px;' + 'right: auto;' + 'top: 0;' + 'margin: 0;' + 'padding: 0;' + '}';
      };
      return {
        show: show,
        hide: hide,
        getCss: getCss,
        reposition: reposition,
        destroy: destroy
      };
    };
    var isFakeCaretTarget = function (node) {
      return isContentEditableFalse$5(node) || NodeType.isTable(node) && isFakeCaretTableBrowser();
    };

    var isContentEditableFalse$6 = NodeType.isContentEditableFalse;
    var isBlockLike = NodeType.matchStyleValues('display', 'block table table-cell table-caption list-item');
    var isCaretContainer$2 = isCaretContainer;
    var isCaretContainerBlock$1 = isCaretContainerBlock;
    var curry$2 = Fun.curry;
    var isElement$6 = NodeType.isElement;
    var isCaretCandidate$3 = isCaretCandidate;
    var isForwards = function (direction) {
      return direction > 0;
    };
    var isBackwards = function (direction) {
      return direction < 0;
    };
    var skipCaretContainers = function (walk, shallow) {
      var node;
      while (node = walk(shallow)) {
        if (!isCaretContainerBlock$1(node)) {
          return node;
        }
      }
      return null;
    };
    var findNode = function (node, direction, predicateFn, rootNode, shallow) {
      var walker = new TreeWalker(node, rootNode);
      if (isBackwards(direction)) {
        if (isContentEditableFalse$6(node) || isCaretContainerBlock$1(node)) {
          node = skipCaretContainers(walker.prev, true);
          if (predicateFn(node)) {
            return node;
          }
        }
        while (node = skipCaretContainers(walker.prev, shallow)) {
          if (predicateFn(node)) {
            return node;
          }
        }
      }
      if (isForwards(direction)) {
        if (isContentEditableFalse$6(node) || isCaretContainerBlock$1(node)) {
          node = skipCaretContainers(walker.next, true);
          if (predicateFn(node)) {
            return node;
          }
        }
        while (node = skipCaretContainers(walker.next, shallow)) {
          if (predicateFn(node)) {
            return node;
          }
        }
      }
      return null;
    };
    var getParentBlock = function (node, rootNode) {
      while (node && node !== rootNode) {
        if (isBlockLike(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var isInSameBlock = function (caretPosition1, caretPosition2, rootNode) {
      return getParentBlock(caretPosition1.container(), rootNode) === getParentBlock(caretPosition2.container(), rootNode);
    };
    var getChildNodeAtRelativeOffset = function (relativeOffset, caretPosition) {
      var container, offset;
      if (!caretPosition) {
        return null;
      }
      container = caretPosition.container();
      offset = caretPosition.offset();
      if (!isElement$6(container)) {
        return null;
      }
      return container.childNodes[offset + relativeOffset];
    };
    var beforeAfter = function (before, node) {
      var range = node.ownerDocument.createRange();
      if (before) {
        range.setStartBefore(node);
        range.setEndBefore(node);
      } else {
        range.setStartAfter(node);
        range.setEndAfter(node);
      }
      return range;
    };
    var isNodesInSameBlock = function (root, node1, node2) {
      return getParentBlock(node1, root) === getParentBlock(node2, root);
    };
    var lean = function (left, root, node) {
      var sibling, siblingName;
      if (left) {
        siblingName = 'previousSibling';
      } else {
        siblingName = 'nextSibling';
      }
      while (node && node !== root) {
        sibling = node[siblingName];
        if (isCaretContainer$2(sibling)) {
          sibling = sibling[siblingName];
        }
        if (isContentEditableFalse$6(sibling)) {
          if (isNodesInSameBlock(root, sibling, node)) {
            return sibling;
          }
          break;
        }
        if (isCaretCandidate$3(sibling)) {
          break;
        }
        node = node.parentNode;
      }
      return null;
    };
    var before$2 = curry$2(beforeAfter, true);
    var after$2 = curry$2(beforeAfter, false);
    var normalizeRange = function (direction, root, range) {
      var node, container, offset, location;
      var leanLeft = curry$2(lean, true, root);
      var leanRight = curry$2(lean, false, root);
      container = range.startContainer;
      offset = range.startOffset;
      if (isCaretContainerBlock(container)) {
        if (!isElement$6(container)) {
          container = container.parentNode;
        }
        location = container.getAttribute('data-mce-caret');
        if (location === 'before') {
          node = container.nextSibling;
          if (isFakeCaretTarget(node)) {
            return before$2(node);
          }
        }
        if (location === 'after') {
          node = container.previousSibling;
          if (isFakeCaretTarget(node)) {
            return after$2(node);
          }
        }
      }
      if (!range.collapsed) {
        return range;
      }
      if (NodeType.isText(container)) {
        if (isCaretContainer$2(container)) {
          if (direction === 1) {
            node = leanRight(container);
            if (node) {
              return before$2(node);
            }
            node = leanLeft(container);
            if (node) {
              return after$2(node);
            }
          }
          if (direction === -1) {
            node = leanLeft(container);
            if (node) {
              return after$2(node);
            }
            node = leanRight(container);
            if (node) {
              return before$2(node);
            }
          }
          return range;
        }
        if (endsWithCaretContainer(container) && offset >= container.data.length - 1) {
          if (direction === 1) {
            node = leanRight(container);
            if (node) {
              return before$2(node);
            }
          }
          return range;
        }
        if (startsWithCaretContainer(container) && offset <= 1) {
          if (direction === -1) {
            node = leanLeft(container);
            if (node) {
              return after$2(node);
            }
          }
          return range;
        }
        if (offset === container.data.length) {
          node = leanRight(container);
          if (node) {
            return before$2(node);
          }
          return range;
        }
        if (offset === 0) {
          node = leanLeft(container);
          if (node) {
            return after$2(node);
          }
          return range;
        }
      }
      return range;
    };
    var isNextToContentEditableFalse = function (relativeOffset, caretPosition) {
      var node = getChildNodeAtRelativeOffset(relativeOffset, caretPosition);
      return isContentEditableFalse$6(node) && !NodeType.isBogusAll(node);
    };
    var isNextToTable = function (relativeOffset, caretPosition) {
      return NodeType.isTable(getChildNodeAtRelativeOffset(relativeOffset, caretPosition));
    };
    var getRelativeCefElm = function (forward, caretPosition) {
      return Option.from(getChildNodeAtRelativeOffset(forward ? 0 : -1, caretPosition)).filter(isContentEditableFalse$6);
    };
    var getNormalizedRangeEndPoint = function (direction, root, range) {
      var normalizedRange = normalizeRange(direction, root, range);
      if (direction === -1) {
        return CaretPosition.fromRangeStart(normalizedRange);
      }
      return CaretPosition.fromRangeEnd(normalizedRange);
    };
    var isBeforeContentEditableFalse = curry$2(isNextToContentEditableFalse, 0);
    var isAfterContentEditableFalse = curry$2(isNextToContentEditableFalse, -1);
    var isBeforeTable = curry$2(isNextToTable, 0);
    var isAfterTable = curry$2(isNextToTable, -1);

    var walkToPositionIn = function (forward, root, start) {
      var position = forward ? CaretPosition$1.before(start) : CaretPosition$1.after(start);
      return fromPosition(forward, root, position);
    };
    var afterElement = function (node) {
      return NodeType.isBr(node) ? CaretPosition$1.before(node) : CaretPosition$1.after(node);
    };
    var isBeforeOrStart = function (position) {
      if (CaretPosition$1.isTextPosition(position)) {
        return position.offset() === 0;
      } else {
        return isCaretCandidate(position.getNode());
      }
    };
    var isAfterOrEnd = function (position) {
      if (CaretPosition$1.isTextPosition(position)) {
        var container = position.container();
        return position.offset() === container.data.length;
      } else {
        return isCaretCandidate(position.getNode(true));
      }
    };
    var isBeforeAfterSameElement = function (from, to) {
      return !CaretPosition$1.isTextPosition(from) && !CaretPosition$1.isTextPosition(to) && from.getNode() === to.getNode(true);
    };
    var isAtBr = function (position) {
      return !CaretPosition$1.isTextPosition(position) && NodeType.isBr(position.getNode());
    };
    var shouldSkipPosition = function (forward, from, to) {
      if (forward) {
        return !isBeforeAfterSameElement(from, to) && !isAtBr(from) && isAfterOrEnd(from) && isBeforeOrStart(to);
      } else {
        return !isBeforeAfterSameElement(to, from) && isBeforeOrStart(from) && isAfterOrEnd(to);
      }
    };
    var fromPosition = function (forward, root, pos) {
      var walker = CaretWalker(root);
      return Option.from(forward ? walker.next(pos) : walker.prev(pos));
    };
    var navigate = function (forward, root, from) {
      return fromPosition(forward, root, from).bind(function (to) {
        if (isInSameBlock(from, to, root) && shouldSkipPosition(forward, from, to)) {
          return fromPosition(forward, root, to);
        } else {
          return Option.some(to);
        }
      });
    };
    var positionIn = function (forward, element) {
      var startNode = forward ? element.firstChild : element.lastChild;
      if (NodeType.isText(startNode)) {
        return Option.some(CaretPosition$1(startNode, forward ? 0 : startNode.data.length));
      } else if (startNode) {
        if (isCaretCandidate(startNode)) {
          return Option.some(forward ? CaretPosition$1.before(startNode) : afterElement(startNode));
        } else {
          return walkToPositionIn(forward, element, startNode);
        }
      } else {
        return Option.none();
      }
    };
    var CaretFinder = {
      fromPosition: fromPosition,
      nextPosition: curry(fromPosition, true),
      prevPosition: curry(fromPosition, false),
      navigate: navigate,
      positionIn: positionIn,
      firstPositionIn: curry(positionIn, true),
      lastPositionIn: curry(positionIn, false)
    };

    var isStringPathBookmark = function (bookmark) {
      return typeof bookmark.start === 'string';
    };
    var isRangeBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('rng');
    };
    var isIdBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('id');
    };
    var isIndexBookmark = function (bookmark) {
      return bookmark.hasOwnProperty('name');
    };
    var isPathBookmark = function (bookmark) {
      return Tools.isArray(bookmark.start);
    };

    var addBogus = function (dom, node) {
      if (dom.isBlock(node) && !node.innerHTML && !Env.ie) {
        node.innerHTML = '<br data-mce-bogus="1" />';
      }
      return node;
    };
    var resolveCaretPositionBookmark = function (dom, bookmark) {
      var rng, pos;
      rng = dom.createRng();
      pos = resolve$2(dom.getRoot(), bookmark.start);
      rng.setStart(pos.container(), pos.offset());
      pos = resolve$2(dom.getRoot(), bookmark.end);
      rng.setEnd(pos.container(), pos.offset());
      return rng;
    };
    var insertZwsp = function (node, rng) {
      var textNode = node.ownerDocument.createTextNode(Zwsp.ZWSP);
      node.appendChild(textNode);
      rng.setStart(textNode, 0);
      rng.setEnd(textNode, 0);
    };
    var isEmpty = function (node) {
      return node.hasChildNodes() === false;
    };
    var tryFindRangePosition = function (node, rng) {
      return CaretFinder.lastPositionIn(node).fold(function () {
        return false;
      }, function (pos) {
        rng.setStart(pos.container(), pos.offset());
        rng.setEnd(pos.container(), pos.offset());
        return true;
      });
    };
    var padEmptyCaretContainer = function (root, node, rng) {
      if (isEmpty(node) && getParentCaretContainer(root, node)) {
        insertZwsp(node, rng);
        return true;
      } else {
        return false;
      }
    };
    var setEndPoint = function (dom, start, bookmark, rng) {
      var point = bookmark[start ? 'start' : 'end'];
      var i, node, offset, children;
      var root = dom.getRoot();
      if (point) {
        offset = point[0];
        for (node = root, i = point.length - 1; i >= 1; i--) {
          children = node.childNodes;
          if (padEmptyCaretContainer(root, node, rng)) {
            return true;
          }
          if (point[i] > children.length - 1) {
            if (padEmptyCaretContainer(root, node, rng)) {
              return true;
            }
            return tryFindRangePosition(node, rng);
          }
          node = children[point[i]];
        }
        if (node.nodeType === 3) {
          offset = Math.min(point[0], node.nodeValue.length);
        }
        if (node.nodeType === 1) {
          offset = Math.min(point[0], node.childNodes.length);
        }
        if (start) {
          rng.setStart(node, offset);
        } else {
          rng.setEnd(node, offset);
        }
      }
      return true;
    };
    var isValidTextNode = function (node) {
      return NodeType.isText(node) && node.data.length > 0;
    };
    var restoreEndPoint = function (dom, suffix, bookmark) {
      var marker = dom.get(bookmark.id + '_' + suffix), node, idx, next, prev;
      var keep = bookmark.keep;
      var container, offset;
      if (marker) {
        node = marker.parentNode;
        if (suffix === 'start') {
          if (!keep) {
            idx = dom.nodeIndex(marker);
          } else {
            if (marker.hasChildNodes()) {
              node = marker.firstChild;
              idx = 1;
            } else if (isValidTextNode(marker.nextSibling)) {
              node = marker.nextSibling;
              idx = 0;
            } else if (isValidTextNode(marker.previousSibling)) {
              node = marker.previousSibling;
              idx = marker.previousSibling.data.length;
            } else {
              node = marker.parentNode;
              idx = dom.nodeIndex(marker) + 1;
            }
          }
          container = node;
          offset = idx;
        } else {
          if (!keep) {
            idx = dom.nodeIndex(marker);
          } else {
            if (marker.hasChildNodes()) {
              node = marker.firstChild;
              idx = 1;
            } else if (isValidTextNode(marker.previousSibling)) {
              node = marker.previousSibling;
              idx = marker.previousSibling.data.length;
            } else {
              node = marker.parentNode;
              idx = dom.nodeIndex(marker);
            }
          }
          container = node;
          offset = idx;
        }
        if (!keep) {
          prev = marker.previousSibling;
          next = marker.nextSibling;
          Tools.each(Tools.grep(marker.childNodes), function (node) {
            if (NodeType.isText(node)) {
              node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '');
            }
          });
          while (marker = dom.get(bookmark.id + '_' + suffix)) {
            dom.remove(marker, true);
          }
          if (prev && next && prev.nodeType === next.nodeType && NodeType.isText(prev) && !Env.opera) {
            idx = prev.nodeValue.length;
            prev.appendData(next.nodeValue);
            dom.remove(next);
            if (suffix === 'start') {
              container = prev;
              offset = idx;
            } else {
              container = prev;
              offset = idx;
            }
          }
        }
        return Option.some(CaretPosition$1(container, offset));
      } else {
        return Option.none();
      }
    };
    var alt = function (o1, o2) {
      return o1.isSome() ? o1 : o2;
    };
    var resolvePaths = function (dom, bookmark) {
      var rng = dom.createRng();
      if (setEndPoint(dom, true, bookmark, rng) && setEndPoint(dom, false, bookmark, rng)) {
        return Option.some(rng);
      } else {
        return Option.none();
      }
    };
    var resolveId = function (dom, bookmark) {
      var startPos = restoreEndPoint(dom, 'start', bookmark);
      var endPos = restoreEndPoint(dom, 'end', bookmark);
      return liftN([
        startPos,
        alt(endPos, startPos)
      ], function (spos, epos) {
        var rng = dom.createRng();
        rng.setStart(addBogus(dom, spos.container()), spos.offset());
        rng.setEnd(addBogus(dom, epos.container()), epos.offset());
        return rng;
      });
    };
    var resolveIndex$1 = function (dom, bookmark) {
      return Option.from(dom.select(bookmark.name)[bookmark.index]).map(function (elm) {
        var rng = dom.createRng();
        rng.selectNode(elm);
        return rng;
      });
    };
    var resolve$3 = function (selection, bookmark) {
      var dom = selection.dom;
      if (bookmark) {
        if (isPathBookmark(bookmark)) {
          return resolvePaths(dom, bookmark);
        } else if (isStringPathBookmark(bookmark)) {
          return Option.some(resolveCaretPositionBookmark(dom, bookmark));
        } else if (isIdBookmark(bookmark)) {
          return resolveId(dom, bookmark);
        } else if (isIndexBookmark(bookmark)) {
          return resolveIndex$1(dom, bookmark);
        } else if (isRangeBookmark(bookmark)) {
          return Option.some(bookmark.rng);
        }
      }
      return Option.none();
    };
    var ResolveBookmark = { resolve: resolve$3 };

    var getBookmark$1 = function (selection, type, normalized) {
      return GetBookmark.getBookmark(selection, type, normalized);
    };
    var moveToBookmark = function (selection, bookmark) {
      ResolveBookmark.resolve(selection, bookmark).each(function (rng) {
        selection.setRng(rng);
      });
    };
    var isBookmarkNode$1 = function (node) {
      return NodeType.isElement(node) && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark';
    };
    var Bookmarks = {
      getBookmark: getBookmark$1,
      moveToBookmark: moveToBookmark,
      isBookmarkNode: isBookmarkNode$1
    };

    var isInlineBlock = function (node) {
      return node && /^(IMG)$/.test(node.nodeName);
    };
    var moveStart = function (dom, selection, rng) {
      var offset = rng.startOffset;
      var container = rng.startContainer, walker, node, nodes;
      if (rng.startContainer === rng.endContainer) {
        if (isInlineBlock(rng.startContainer.childNodes[rng.startOffset])) {
          return;
        }
      }
      if (container.nodeType === 1) {
        nodes = container.childNodes;
        if (offset < nodes.length) {
          container = nodes[offset];
          walker = new TreeWalker(container, dom.getParent(container, dom.isBlock));
        } else {
          container = nodes[nodes.length - 1];
          walker = new TreeWalker(container, dom.getParent(container, dom.isBlock));
          walker.next(true);
        }
        for (node = walker.current(); node; node = walker.next()) {
          if (node.nodeType === 3 && !isWhiteSpaceNode(node)) {
            rng.setStart(node, 0);
            selection.setRng(rng);
            return;
          }
        }
      }
    };
    var getNonWhiteSpaceSibling = function (node, next, inc) {
      if (node) {
        next = next ? 'nextSibling' : 'previousSibling';
        for (node = inc ? node : node[next]; node; node = node[next]) {
          if (node.nodeType === 1 || !isWhiteSpaceNode(node)) {
            return node;
          }
        }
      }
    };
    var isTextBlock$1 = function (editor, name) {
      if (name.nodeType) {
        name = name.nodeName;
      }
      return !!editor.schema.getTextBlockElements()[name.toLowerCase()];
    };
    var isValid = function (ed, parent, child) {
      return ed.schema.isValidChild(parent, child);
    };
    var isWhiteSpaceNode = function (node) {
      return node && node.nodeType === 3 && /^([\t \r\n]+|)$/.test(node.nodeValue);
    };
    var replaceVars = function (value, vars) {
      if (typeof value !== 'string') {
        value = value(vars);
      } else if (vars) {
        value = value.replace(/%(\w+)/g, function (str, name) {
          return vars[name] || str;
        });
      }
      return value;
    };
    var isEq = function (str1, str2) {
      str1 = str1 || '';
      str2 = str2 || '';
      str1 = '' + (str1.nodeName || str1);
      str2 = '' + (str2.nodeName || str2);
      return str1.toLowerCase() === str2.toLowerCase();
    };
    var normalizeStyleValue = function (dom, value, name) {
      if (name === 'color' || name === 'backgroundColor') {
        value = dom.toHex(value);
      }
      if (name === 'fontWeight' && value === 700) {
        value = 'bold';
      }
      if (name === 'fontFamily') {
        value = value.replace(/[\'\"]/g, '').replace(/,\s+/g, ',');
      }
      return '' + value;
    };
    var getStyle = function (dom, node, name) {
      return normalizeStyleValue(dom, dom.getStyle(node, name), name);
    };
    var getTextDecoration = function (dom, node) {
      var decoration;
      dom.getParent(node, function (n) {
        decoration = dom.getStyle(n, 'text-decoration');
        return decoration && decoration !== 'none';
      });
      return decoration;
    };
    var getParents$1 = function (dom, node, selector) {
      return dom.getParents(node, selector, dom.getRoot());
    };
    var FormatUtils = {
      isInlineBlock: isInlineBlock,
      moveStart: moveStart,
      getNonWhiteSpaceSibling: getNonWhiteSpaceSibling,
      isTextBlock: isTextBlock$1,
      isValid: isValid,
      isWhiteSpaceNode: isWhiteSpaceNode,
      replaceVars: replaceVars,
      isEq: isEq,
      normalizeStyleValue: normalizeStyleValue,
      getStyle: getStyle,
      getTextDecoration: getTextDecoration,
      getParents: getParents$1
    };

    var isBookmarkNode$2 = Bookmarks.isBookmarkNode;
    var getParents$2 = FormatUtils.getParents, isWhiteSpaceNode$1 = FormatUtils.isWhiteSpaceNode, isTextBlock$2 = FormatUtils.isTextBlock;
    var findLeaf = function (node, offset) {
      if (typeof offset === 'undefined') {
        offset = node.nodeType === 3 ? node.length : node.childNodes.length;
      }
      while (node && node.hasChildNodes()) {
        node = node.childNodes[offset];
        if (node) {
          offset = node.nodeType === 3 ? node.length : node.childNodes.length;
        }
      }
      return {
        node: node,
        offset: offset
      };
    };
    var excludeTrailingWhitespace = function (endContainer, endOffset) {
      var leaf = findLeaf(endContainer, endOffset);
      if (leaf.node) {
        while (leaf.node && leaf.offset === 0 && leaf.node.previousSibling) {
          leaf = findLeaf(leaf.node.previousSibling);
        }
        if (leaf.node && leaf.offset > 0 && leaf.node.nodeType === 3 && leaf.node.nodeValue.charAt(leaf.offset - 1) === ' ') {
          if (leaf.offset > 1) {
            endContainer = leaf.node;
            endContainer.splitText(leaf.offset - 1);
          }
        }
      }
      return endContainer;
    };
    var isBogusBr = function (node) {
      return node.nodeName === 'BR' && node.getAttribute('data-mce-bogus') && !node.nextSibling;
    };
    var findParentContentEditable = function (dom, node) {
      var parent = node;
      while (parent) {
        if (parent.nodeType === 1 && dom.getContentEditable(parent)) {
          return dom.getContentEditable(parent) === 'false' ? parent : node;
        }
        parent = parent.parentNode;
      }
      return node;
    };
    var findSpace = function (start, remove, node, offset) {
      var pos, pos2;
      var str = node.nodeValue;
      if (typeof offset === 'undefined') {
        offset = start ? str.length : 0;
      }
      if (start) {
        pos = str.lastIndexOf(' ', offset);
        pos2 = str.lastIndexOf('\xA0', offset);
        pos = pos > pos2 ? pos : pos2;
        if (pos !== -1 && !remove && (pos < offset || !start) && pos <= str.length) {
          pos++;
        }
      } else {
        pos = str.indexOf(' ', offset);
        pos2 = str.indexOf('\xA0', offset);
        pos = pos !== -1 && (pos2 === -1 || pos < pos2) ? pos : pos2;
      }
      return pos;
    };
    var findWordEndPoint = function (dom, body, container, offset, start, remove) {
      var walker, node, pos, lastTextNode;
      if (container.nodeType === 3) {
        pos = findSpace(start, remove, container, offset);
        if (pos !== -1) {
          return {
            container: container,
            offset: pos
          };
        }
        lastTextNode = container;
      }
      walker = new TreeWalker(container, dom.getParent(container, dom.isBlock) || body);
      while (node = walker[start ? 'prev' : 'next']()) {
        if (node.nodeType === 3 && !isBookmarkNode$2(node.parentNode)) {
          lastTextNode = node;
          pos = findSpace(start, remove, node);
          if (pos !== -1) {
            return {
              container: node,
              offset: pos
            };
          }
        } else if (dom.isBlock(node) || FormatUtils.isEq(node, 'BR')) {
          break;
        }
      }
      if (lastTextNode) {
        if (start) {
          offset = 0;
        } else {
          offset = lastTextNode.length;
        }
        return {
          container: lastTextNode,
          offset: offset
        };
      }
    };
    var findSelectorEndPoint = function (dom, format, rng, container, siblingName) {
      var parents, i, y, curFormat;
      if (container.nodeType === 3 && container.nodeValue.length === 0 && container[siblingName]) {
        container = container[siblingName];
      }
      parents = getParents$2(dom, container);
      for (i = 0; i < parents.length; i++) {
        for (y = 0; y < format.length; y++) {
          curFormat = format[y];
          if ('collapsed' in curFormat && curFormat.collapsed !== rng.collapsed) {
            continue;
          }
          if (dom.is(parents[i], curFormat.selector)) {
            return parents[i];
          }
        }
      }
      return container;
    };
    var findBlockEndPoint = function (editor, format, container, siblingName) {
      var node;
      var dom = editor.dom;
      var root = dom.getRoot();
      if (!format[0].wrapper) {
        node = dom.getParent(container, format[0].block, root);
      }
      if (!node) {
        var scopeRoot = dom.getParent(container, 'LI,TD,TH');
        node = dom.getParent(container.nodeType === 3 ? container.parentNode : container, function (node) {
          return node !== root && isTextBlock$2(editor, node);
        }, scopeRoot);
      }
      if (node && format[0].wrapper) {
        node = getParents$2(dom, node, 'ul,ol').reverse()[0] || node;
      }
      if (!node) {
        node = container;
        while (node[siblingName] && !dom.isBlock(node[siblingName])) {
          node = node[siblingName];
          if (FormatUtils.isEq(node, 'br')) {
            break;
          }
        }
      }
      return node || container;
    };
    var findParentContainer = function (dom, format, startContainer, startOffset, endContainer, endOffset, start) {
      var container, parent, sibling, siblingName, root;
      container = parent = start ? startContainer : endContainer;
      siblingName = start ? 'previousSibling' : 'nextSibling';
      root = dom.getRoot();
      if (container.nodeType === 3 && !isWhiteSpaceNode$1(container)) {
        if (start ? startOffset > 0 : endOffset < container.nodeValue.length) {
          return container;
        }
      }
      while (true) {
        if (!format[0].block_expand && dom.isBlock(parent)) {
          return parent;
        }
        for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) {
          if (!isBookmarkNode$2(sibling) && !isWhiteSpaceNode$1(sibling) && !isBogusBr(sibling)) {
            return parent;
          }
        }
        if (parent === root || parent.parentNode === root) {
          container = parent;
          break;
        }
        parent = parent.parentNode;
      }
      return container;
    };
    var expandRng = function (editor, rng, format, remove) {
      var endPoint, startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset;
      var dom = editor.dom;
      if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
        startContainer = getNode(startContainer, startOffset);
        if (startContainer.nodeType === 3) {
          startOffset = 0;
        }
      }
      if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
        endContainer = getNode(endContainer, rng.collapsed ? endOffset : endOffset - 1);
        if (endContainer.nodeType === 3) {
          endOffset = endContainer.nodeValue.length;
        }
      }
      startContainer = findParentContentEditable(dom, startContainer);
      endContainer = findParentContentEditable(dom, endContainer);
      if (isBookmarkNode$2(startContainer.parentNode) || isBookmarkNode$2(startContainer)) {
        startContainer = isBookmarkNode$2(startContainer) ? startContainer : startContainer.parentNode;
        if (rng.collapsed) {
          startContainer = startContainer.previousSibling || startContainer;
        } else {
          startContainer = startContainer.nextSibling || startContainer;
        }
        if (startContainer.nodeType === 3) {
          startOffset = rng.collapsed ? startContainer.length : 0;
        }
      }
      if (isBookmarkNode$2(endContainer.parentNode) || isBookmarkNode$2(endContainer)) {
        endContainer = isBookmarkNode$2(endContainer) ? endContainer : endContainer.parentNode;
        if (rng.collapsed) {
          endContainer = endContainer.nextSibling || endContainer;
        } else {
          endContainer = endContainer.previousSibling || endContainer;
        }
        if (endContainer.nodeType === 3) {
          endOffset = rng.collapsed ? 0 : endContainer.length;
        }
      }
      if (rng.collapsed) {
        endPoint = findWordEndPoint(dom, editor.getBody(), startContainer, startOffset, true, remove);
        if (endPoint) {
          startContainer = endPoint.container;
          startOffset = endPoint.offset;
        }
        endPoint = findWordEndPoint(dom, editor.getBody(), endContainer, endOffset, false, remove);
        if (endPoint) {
          endContainer = endPoint.container;
          endOffset = endPoint.offset;
        }
      }
      if (format[0].inline) {
        endContainer = remove ? endContainer : excludeTrailingWhitespace(endContainer, endOffset);
      }
      if (format[0].inline || format[0].block_expand) {
        if (!format[0].inline || (startContainer.nodeType !== 3 || startOffset === 0)) {
          startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true);
        }
        if (!format[0].inline || (endContainer.nodeType !== 3 || endOffset === endContainer.nodeValue.length)) {
          endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false);
        }
      }
      if (format[0].selector && format[0].expand !== false && !format[0].inline) {
        startContainer = findSelectorEndPoint(dom, format, rng, startContainer, 'previousSibling');
        endContainer = findSelectorEndPoint(dom, format, rng, endContainer, 'nextSibling');
      }
      if (format[0].block || format[0].selector) {
        startContainer = findBlockEndPoint(editor, format, startContainer, 'previousSibling');
        endContainer = findBlockEndPoint(editor, format, endContainer, 'nextSibling');
        if (format[0].block) {
          if (!dom.isBlock(startContainer)) {
            startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true);
          }
          if (!dom.isBlock(endContainer)) {
            endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false);
          }
        }
      }
      if (startContainer.nodeType === 1) {
        startOffset = dom.nodeIndex(startContainer);
        startContainer = startContainer.parentNode;
      }
      if (endContainer.nodeType === 1) {
        endOffset = dom.nodeIndex(endContainer) + 1;
        endContainer = endContainer.parentNode;
      }
      return {
        startContainer: startContainer,
        startOffset: startOffset,
        endContainer: endContainer,
        endOffset: endOffset
      };
    };
    var ExpandRange = { expandRng: expandRng };

    var each$8 = Tools.each;
    var getEndChild = function (container, index) {
      var childNodes = container.childNodes;
      index--;
      if (index > childNodes.length - 1) {
        index = childNodes.length - 1;
      } else if (index < 0) {
        index = 0;
      }
      return childNodes[index] || container;
    };
    var walk$2 = function (dom, rng, callback) {
      var startContainer = rng.startContainer;
      var startOffset = rng.startOffset;
      var endContainer = rng.endContainer;
      var endOffset = rng.endOffset;
      var ancestor;
      var startPoint;
      var endPoint;
      var node;
      var parent;
      var siblings;
      var nodes;
      nodes = dom.select('td[data-mce-selected],th[data-mce-selected]');
      if (nodes.length > 0) {
        each$8(nodes, function (node) {
          callback([node]);
        });
        return;
      }
      var exclude = function (nodes) {
        var node;
        node = nodes[0];
        if (node.nodeType === 3 && node === startContainer && startOffset >= node.nodeValue.length) {
          nodes.splice(0, 1);
        }
        node = nodes[nodes.length - 1];
        if (endOffset === 0 && nodes.length > 0 && node === endContainer && node.nodeType === 3) {
          nodes.splice(nodes.length - 1, 1);
        }
        return nodes;
      };
      var collectSiblings = function (node, name, endNode) {
        var siblings = [];
        for (; node && node !== endNode; node = node[name]) {
          siblings.push(node);
        }
        return siblings;
      };
      var findEndPoint = function (node, root) {
        do {
          if (node.parentNode === root) {
            return node;
          }
          node = node.parentNode;
        } while (node);
      };
      var walkBoundary = function (startNode, endNode, next) {
        var siblingName = next ? 'nextSibling' : 'previousSibling';
        for (node = startNode, parent = node.parentNode; node && node !== endNode; node = parent) {
          parent = node.parentNode;
          siblings = collectSiblings(node === startNode ? node : node[siblingName], siblingName);
          if (siblings.length) {
            if (!next) {
              siblings.reverse();
            }
            callback(exclude(siblings));
          }
        }
      };
      if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
        startContainer = startContainer.childNodes[startOffset];
      }
      if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
        endContainer = getEndChild(endContainer, endOffset);
      }
      if (startContainer === endContainer) {
        return callback(exclude([startContainer]));
      }
      ancestor = dom.findCommonAncestor(startContainer, endContainer);
      for (node = startContainer; node; node = node.parentNode) {
        if (node === endContainer) {
          return walkBoundary(startContainer, ancestor, true);
        }
        if (node === ancestor) {
          break;
        }
      }
      for (node = endContainer; node; node = node.parentNode) {
        if (node === startContainer) {
          return walkBoundary(endContainer, ancestor);
        }
        if (node === ancestor) {
          break;
        }
      }
      startPoint = findEndPoint(startContainer, ancestor) || startContainer;
      endPoint = findEndPoint(endContainer, ancestor) || endContainer;
      walkBoundary(startContainer, startPoint, true);
      siblings = collectSiblings(startPoint === startContainer ? startPoint : startPoint.nextSibling, 'nextSibling', endPoint === endContainer ? endPoint.nextSibling : endPoint);
      if (siblings.length) {
        callback(exclude(siblings));
      }
      walkBoundary(endContainer, endPoint);
    };
    var RangeWalk = { walk: walk$2 };

    var zeroWidth = function () {
      return '\uFEFF';
    };

    function NodeValue (is, name) {
      var get = function (element) {
        if (!is(element))
          throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        return getOption(element).getOr('');
      };
      var getOptionIE10 = function (element) {
        try {
          return getOptionSafe(element);
        } catch (e) {
          return Option.none();
        }
      };
      var getOptionSafe = function (element) {
        return is(element) ? Option.from(element.dom().nodeValue) : Option.none();
      };
      var browser = PlatformDetection$1.detect().browser;
      var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;
      var set = function (element, value) {
        if (!is(element))
          throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        element.dom().nodeValue = value;
      };
      return {
        get: get,
        getOption: getOption,
        set: set
      };
    }

    var api = NodeValue(isText, 'text');
    var get$6 = function (element) {
      return api.get(element);
    };

    var isZeroWidth = function (elem) {
      return isText(elem) && get$6(elem) === zeroWidth();
    };
    var context = function (editor, elem, wrapName, nodeName) {
      return parent(elem).fold(function () {
        return 'skipping';
      }, function (parent$$1) {
        if (nodeName === 'br' || isZeroWidth(elem)) {
          return 'valid';
        } else if (isAnnotation(elem)) {
          return 'existing';
        } else if (isCaretNode(elem)) {
          return 'caret';
        } else if (!FormatUtils.isValid(editor, wrapName, nodeName) || !FormatUtils.isValid(editor, name(parent$$1), wrapName)) {
          return 'invalid-child';
        } else {
          return 'valid';
        }
      });
    };

    var __rest = undefined && undefined.__rest || function (s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === 'function')
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
          if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
      return t;
    };
    var shouldApplyToTrailingSpaces = function (rng) {
      return rng.startContainer.nodeType === 3 && rng.startContainer.nodeValue.length >= rng.startOffset && rng.startContainer.nodeValue[rng.startOffset] === '\xA0';
    };
    var applyWordGrab = function (editor, rng) {
      var r = ExpandRange.expandRng(editor, rng, [{ inline: true }], shouldApplyToTrailingSpaces(rng));
      rng.setStart(r.startContainer, r.startOffset);
      rng.setEnd(r.endContainer, r.endOffset);
      editor.selection.setRng(rng);
    };
    var makeAnnotation = function (eDoc, _a, annotationName, decorate) {
      var _b = _a.uid, uid = _b === void 0 ? generate('mce-annotation') : _b, data = __rest(_a, ['uid']);
      var master = Element$$1.fromTag('span', eDoc);
      add$2(master, annotation());
      set(master, '' + dataAnnotationId(), uid);
      set(master, '' + dataAnnotation(), annotationName);
      var _c = decorate(uid, data), _d = _c.attributes, attributes = _d === void 0 ? {} : _d, _e = _c.classes, classes = _e === void 0 ? [] : _e;
      setAll(master, attributes);
      add$3(master, classes);
      return master;
    };
    var annotate = function (editor, rng, annotationName, decorate, data) {
      var newWrappers = [];
      var master = makeAnnotation(editor.getDoc(), data, annotationName, decorate);
      var wrapper = Cell(Option.none());
      var finishWrapper = function () {
        wrapper.set(Option.none());
      };
      var getOrOpenWrapper = function () {
        return wrapper.get().getOrThunk(function () {
          var nu = shallow(master);
          newWrappers.push(nu);
          wrapper.set(Option.some(nu));
          return nu;
        });
      };
      var processElements = function (elems) {
        each(elems, processElement);
      };
      var processElement = function (elem) {
        var ctx = context(editor, elem, 'span', name(elem));
        switch (ctx) {
        case 'invalid-child': {
            finishWrapper();
            var children$$1 = children(elem);
            processElements(children$$1);
            finishWrapper();
            break;
          }
        case 'valid': {
            var w = getOrOpenWrapper();
            wrap$1(elem, w);
            break;
          }
        case 'skipping':
        case 'existing':
        case 'caret':
        }
      };
      var processNodes = function (nodes) {
        var elems = map(nodes, Element$$1.fromDom);
        processElements(elems);
      };
      RangeWalk.walk(editor.dom, rng, function (nodes) {
        finishWrapper();
        processNodes(nodes);
      });
      return newWrappers;
    };
    var annotateWithBookmark = function (editor, name$$1, settings, data) {
      editor.undoManager.transact(function () {
        var initialRng = editor.selection.getRng();
        if (initialRng.collapsed) {
          applyWordGrab(editor, initialRng);
        }
        if (editor.selection.getRng().collapsed) {
          var wrapper = makeAnnotation(editor.getDoc(), data, name$$1, settings.decorate);
          set$2(wrapper, '\xA0');
          editor.selection.getRng().insertNode(wrapper.dom());
          editor.selection.select(wrapper.dom());
        } else {
          var bookmark = GetBookmark.getPersistentBookmark(editor.selection, false);
          var rng = editor.selection.getRng();
          annotate(editor, rng, name$$1, settings.decorate, data);
          editor.selection.moveToBookmark(bookmark);
        }
      });
    };

    function Annotator (editor) {
      var registry = create$1();
      setup$1(editor, registry);
      var changes = setup(editor, registry);
      return {
        register: function (name, settings) {
          registry.register(name, settings);
        },
        annotate: function (name, data) {
          registry.lookup(name).each(function (settings) {
            annotateWithBookmark(editor, name, settings, data);
          });
        },
        annotationChanged: function (name, callback) {
          changes.addListener(name, callback);
        },
        remove: function (name) {
          identify(editor, Option.some(name)).each(function (_a) {
            var elements = _a.elements;
            each(elements, unwrap);
          });
        },
        getAll: function (name) {
          var directory = findAll(editor, name);
          return map$2(directory, function (elems) {
            return map(elems, function (elem) {
              return elem.dom();
            });
          });
        }
      };
    }

    var hasOnlyOneChild = function (node) {
      return node.firstChild && node.firstChild === node.lastChild;
    };
    var isPaddingNode = function (node) {
      return node.name === 'br' || node.value === '\xA0';
    };
    var isPaddedEmptyBlock = function (schema, node) {
      var blockElements = schema.getBlockElements();
      return blockElements[node.name] && hasOnlyOneChild(node) && isPaddingNode(node.firstChild);
    };
    var isEmptyFragmentElement = function (schema, node) {
      var nonEmptyElements = schema.getNonEmptyElements();
      return node && (node.isEmpty(nonEmptyElements) || isPaddedEmptyBlock(schema, node));
    };
    var isListFragment = function (schema, fragment) {
      var firstChild = fragment.firstChild;
      var lastChild = fragment.lastChild;
      if (firstChild && firstChild.name === 'meta') {
        firstChild = firstChild.next;
      }
      if (lastChild && lastChild.attr('id') === 'mce_marker') {
        lastChild = lastChild.prev;
      }
      if (isEmptyFragmentElement(schema, lastChild)) {
        lastChild = lastChild.prev;
      }
      if (!firstChild || firstChild !== lastChild) {
        return false;
      }
      return firstChild.name === 'ul' || firstChild.name === 'ol';
    };
    var cleanupDomFragment = function (domFragment) {
      var firstChild = domFragment.firstChild;
      var lastChild = domFragment.lastChild;
      if (firstChild && firstChild.nodeName === 'META') {
        firstChild.parentNode.removeChild(firstChild);
      }
      if (lastChild && lastChild.id === 'mce_marker') {
        lastChild.parentNode.removeChild(lastChild);
      }
      return domFragment;
    };
    var toDomFragment = function (dom, serializer, fragment) {
      var html = serializer.serialize(fragment);
      var domFragment = dom.createFragment(html);
      return cleanupDomFragment(domFragment);
    };
    var listItems$1 = function (elm) {
      return Tools.grep(elm.childNodes, function (child) {
        return child.nodeName === 'LI';
      });
    };
    var isPadding = function (node) {
      return node.data === '\xA0' || NodeType.isBr(node);
    };
    var isListItemPadded = function (node) {
      return node && node.firstChild && node.firstChild === node.lastChild && isPadding(node.firstChild);
    };
    var isEmptyOrPadded = function (elm) {
      return !elm.firstChild || isListItemPadded(elm);
    };
    var trimListItems = function (elms) {
      return elms.length > 0 && isEmptyOrPadded(elms[elms.length - 1]) ? elms.slice(0, -1) : elms;
    };
    var getParentLi = function (dom, node) {
      var parentBlock = dom.getParent(node, dom.isBlock);
      return parentBlock && parentBlock.nodeName === 'LI' ? parentBlock : null;
    };
    var isParentBlockLi = function (dom, node) {
      return !!getParentLi(dom, node);
    };
    var getSplit = function (parentNode, rng) {
      var beforeRng = rng.cloneRange();
      var afterRng = rng.cloneRange();
      beforeRng.setStartBefore(parentNode);
      afterRng.setEndAfter(parentNode);
      return [
        beforeRng.cloneContents(),
        afterRng.cloneContents()
      ];
    };
    var findFirstIn = function (node, rootNode) {
      var caretPos = CaretPosition$1.before(node);
      var caretWalker = CaretWalker(rootNode);
      var newCaretPos = caretWalker.next(caretPos);
      return newCaretPos ? newCaretPos.toRange() : null;
    };
    var findLastOf = function (node, rootNode) {
      var caretPos = CaretPosition$1.after(node);
      var caretWalker = CaretWalker(rootNode);
      var newCaretPos = caretWalker.prev(caretPos);
      return newCaretPos ? newCaretPos.toRange() : null;
    };
    var insertMiddle = function (target, elms, rootNode, rng) {
      var parts = getSplit(target, rng);
      var parentElm = target.parentNode;
      parentElm.insertBefore(parts[0], target);
      Tools.each(elms, function (li) {
        parentElm.insertBefore(li, target);
      });
      parentElm.insertBefore(parts[1], target);
      parentElm.removeChild(target);
      return findLastOf(elms[elms.length - 1], rootNode);
    };
    var insertBefore = function (target, elms, rootNode) {
      var parentElm = target.parentNode;
      Tools.each(elms, function (elm) {
        parentElm.insertBefore(elm, target);
      });
      return findFirstIn(target, rootNode);
    };
    var insertAfter = function (target, elms, rootNode, dom) {
      dom.insertAfter(elms.reverse(), target);
      return findLastOf(elms[0], rootNode);
    };
    var insertAtCaret = function (serializer, dom, rng, fragment) {
      var domFragment = toDomFragment(dom, serializer, fragment);
      var liTarget = getParentLi(dom, rng.startContainer);
      var liElms = trimListItems(listItems$1(domFragment.firstChild));
      var BEGINNING = 1, END = 2;
      var rootNode = dom.getRoot();
      var isAt = function (location) {
        var caretPos = CaretPosition$1.fromRangeStart(rng);
        var caretWalker = CaretWalker(dom.getRoot());
        var newPos = location === BEGINNING ? caretWalker.prev(caretPos) : caretWalker.next(caretPos);
        return newPos ? getParentLi(dom, newPos.getNode()) !== liTarget : true;
      };
      if (isAt(BEGINNING)) {
        return insertBefore(liTarget, liElms, rootNode);
      } else if (isAt(END)) {
        return insertAfter(liTarget, liElms, rootNode, dom);
      }
      return insertMiddle(liTarget, liElms, rootNode, rng);
    };
    var InsertList = {
      isListFragment: isListFragment,
      insertAtCaret: insertAtCaret,
      isParentBlockLi: isParentBlockLi,
      trimListItems: trimListItems,
      listItems: listItems$1
    };

    var each$9 = Tools.each;
    var ElementUtils = function (dom) {
      this.compare = function (node1, node2) {
        if (node1.nodeName !== node2.nodeName) {
          return false;
        }
        var getAttribs = function (node) {
          var attribs = {};
          each$9(dom.getAttribs(node), function (attr) {
            var name = attr.nodeName.toLowerCase();
            if (name.indexOf('_') !== 0 && name !== 'style' && name.indexOf('data-') !== 0) {
              attribs[name] = dom.getAttrib(node, name);
            }
          });
          return attribs;
        };
        var compareObjects = function (obj1, obj2) {
          var value, name;
          for (name in obj1) {
            if (obj1.hasOwnProperty(name)) {
              value = obj2[name];
              if (typeof value === 'undefined') {
                return false;
              }
              if (obj1[name] !== value) {
                return false;
              }
              delete obj2[name];
            }
          }
          for (name in obj2) {
            if (obj2.hasOwnProperty(name)) {
              return false;
            }
          }
          return true;
        };
        if (!compareObjects(getAttribs(node1), getAttribs(node2))) {
          return false;
        }
        if (!compareObjects(dom.parseStyle(dom.getAttrib(node1, 'style')), dom.parseStyle(dom.getAttrib(node2, 'style')))) {
          return false;
        }
        return !Bookmarks.isBookmarkNode(node1) && !Bookmarks.isBookmarkNode(node2);
      };
    };

    var getLastChildren = function (elm) {
      var children$$1 = [];
      var rawNode = elm.dom();
      while (rawNode) {
        children$$1.push(Element$$1.fromDom(rawNode));
        rawNode = rawNode.lastChild;
      }
      return children$$1;
    };
    var removeTrailingBr = function (elm) {
      var allBrs = descendants$1(elm, 'br');
      var brs = filter(getLastChildren(elm).slice(-1), isBr);
      if (allBrs.length === brs.length) {
        each(brs, remove$2);
      }
    };
    var fillWithPaddingBr = function (elm) {
      empty(elm);
      append(elm, Element$$1.fromHtml('<br data-mce-bogus="1">'));
    };
    var isPaddingContents = function (elm) {
      return isText(elm) ? get$6(elm) === '\xA0' : isBr(elm);
    };
    var isPaddedElement = function (elm) {
      return filter(children(elm), isPaddingContents).length === 1;
    };
    var trimBlockTrailingBr = function (elm) {
      lastChild(elm).each(function (lastChild$$1) {
        prevSibling(lastChild$$1).each(function (lastChildPrevSibling) {
          if (isBlock(elm) && isBr(lastChild$$1) && isBlock(lastChildPrevSibling)) {
            remove$2(lastChild$$1);
          }
        });
      });
    };
    var PaddingBr = {
      removeTrailingBr: removeTrailingBr,
      fillWithPaddingBr: fillWithPaddingBr,
      isPaddedElement: isPaddedElement,
      trimBlockTrailingBr: trimBlockTrailingBr
    };

    var makeMap$3 = Tools.makeMap;
    function Writer (settings) {
      var html = [];
      var indent, indentBefore, indentAfter, encode, htmlOutput;
      settings = settings || {};
      indent = settings.indent;
      indentBefore = makeMap$3(settings.indent_before || '');
      indentAfter = makeMap$3(settings.indent_after || '');
      encode = Entities.getEncodeFunc(settings.entity_encoding || 'raw', settings.entities);
      htmlOutput = settings.element_format === 'html';
      return {
        start: function (name, attrs, empty) {
          var i, l, attr, value;
          if (indent && indentBefore[name] && html.length > 0) {
            value = html[html.length - 1];
            if (value.length > 0 && value !== '\n') {
              html.push('\n');
            }
          }
          html.push('<', name);
          if (attrs) {
            for (i = 0, l = attrs.length; i < l; i++) {
              attr = attrs[i];
              html.push(' ', attr.name, '="', encode(attr.value, true), '"');
            }
          }
          if (!empty || htmlOutput) {
            html[html.length] = '>';
          } else {
            html[html.length] = ' />';
          }
          if (empty && indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1];
            if (value.length > 0 && value !== '\n') {
              html.push('\n');
            }
          }
        },
        end: function (name) {
          var value;
          html.push('</', name, '>');
          if (indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1];
            if (value.length > 0 && value !== '\n') {
              html.push('\n');
            }
          }
        },
        text: function (text, raw) {
          if (text.length > 0) {
            html[html.length] = raw ? text : encode(text);
          }
        },
        cdata: function (text) {
          html.push('<![CDATA[', text, ']]>');
        },
        comment: function (text) {
          html.push('<!--', text, '-->');
        },
        pi: function (name, text) {
          if (text) {
            html.push('<?', name, ' ', encode(text), '?>');
          } else {
            html.push('<?', name, '?>');
          }
          if (indent) {
            html.push('\n');
          }
        },
        doctype: function (text) {
          html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
        },
        reset: function () {
          html.length = 0;
        },
        getContent: function () {
          return html.join('').replace(/\n$/, '');
        }
      };
    }

    function Serializer (settings, schema) {
      if (schema === void 0) {
        schema = Schema();
      }
      var writer = Writer(settings);
      settings = settings || {};
      settings.validate = 'validate' in settings ? settings.validate : true;
      var serialize = function (node) {
        var handlers, validate;
        validate = settings.validate;
        handlers = {
          3: function (node) {
            writer.text(node.value, node.raw);
          },
          8: function (node) {
            writer.comment(node.value);
          },
          7: function (node) {
            writer.pi(node.name, node.value);
          },
          10: function (node) {
            writer.doctype(node.value);
          },
          4: function (node) {
            writer.cdata(node.value);
          },
          11: function (node) {
            if (node = node.firstChild) {
              do {
                walk(node);
              } while (node = node.next);
            }
          }
        };
        writer.reset();
        var walk = function (node) {
          var handler = handlers[node.type];
          var name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule;
          if (!handler) {
            name = node.name;
            isEmpty = node.shortEnded;
            attrs = node.attributes;
            if (validate && attrs && attrs.length > 1) {
              sortedAttrs = [];
              sortedAttrs.map = {};
              elementRule = schema.getElementRule(node.name);
              if (elementRule) {
                for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) {
                  attrName = elementRule.attributesOrder[i];
                  if (attrName in attrs.map) {
                    attrValue = attrs.map[attrName];
                    sortedAttrs.map[attrName] = attrValue;
                    sortedAttrs.push({
                      name: attrName,
                      value: attrValue
                    });
                  }
                }
                for (i = 0, l = attrs.length; i < l; i++) {
                  attrName = attrs[i].name;
                  if (!(attrName in sortedAttrs.map)) {
                    attrValue = attrs.map[attrName];
                    sortedAttrs.map[attrName] = attrValue;
                    sortedAttrs.push({
                      name: attrName,
                      value: attrValue
                    });
                  }
                }
                attrs = sortedAttrs;
              }
            }
            writer.start(node.name, attrs, isEmpty);
            if (!isEmpty) {
              if (node = node.firstChild) {
                do {
                  walk(node);
                } while (node = node.next);
              }
              writer.end(name);
            }
          } else {
            handler(node);
          }
        };
        if (node.type === 1 && !settings.inner) {
          walk(node);
        } else {
          handlers[11](node);
        }
        return writer.getContent();
      };
      return { serialize: serialize };
    }

    var createRange$1 = function (sc, so, ec, eo) {
      var rng = document.createRange();
      rng.setStart(sc, so);
      rng.setEnd(ec, eo);
      return rng;
    };
    var normalizeBlockSelectionRange = function (rng) {
      var startPos = CaretPosition$1.fromRangeStart(rng);
      var endPos = CaretPosition$1.fromRangeEnd(rng);
      var rootNode = rng.commonAncestorContainer;
      return CaretFinder.fromPosition(false, rootNode, endPos).map(function (newEndPos) {
        if (!isInSameBlock(startPos, endPos, rootNode) && isInSameBlock(startPos, newEndPos, rootNode)) {
          return createRange$1(startPos.container(), startPos.offset(), newEndPos.container(), newEndPos.offset());
        } else {
          return rng;
        }
      }).getOr(rng);
    };
    var normalize = function (rng) {
      return rng.collapsed ? rng : normalizeBlockSelectionRange(rng);
    };
    var RangeNormalizer = { normalize: normalize };

    var isAfterNbsp = function (container, offset) {
      return NodeType.isText(container) && container.nodeValue[offset - 1] === '\xA0';
    };
    var trimOrPadLeftRight = function (rng, html) {
      var container, offset;
      container = rng.startContainer;
      offset = rng.startOffset;
      var hasSiblingText = function (siblingName) {
        return container[siblingName] && container[siblingName].nodeType === 3;
      };
      if (container.nodeType === 3) {
        if (offset > 0) {
          html = html.replace(/^&nbsp;/, ' ');
        } else if (!hasSiblingText('previousSibling')) {
          html = html.replace(/^ /, '&nbsp;');
        }
        if (offset < container.length) {
          html = html.replace(/&nbsp;(<br>|)$/, ' ');
        } else if (!hasSiblingText('nextSibling')) {
          html = html.replace(/(&nbsp;| )(<br>|)$/, '&nbsp;');
        }
      }
      return html;
    };
    var trimNbspAfterDeleteAndPadValue = function (rng, value) {
      var container, offset;
      container = rng.startContainer;
      offset = rng.startOffset;
      if (container.nodeType === 3 && rng.collapsed) {
        if (container.data[offset] === '\xA0') {
          container.deleteData(offset, 1);
          if (!/[\u00a0| ]$/.test(value)) {
            value += ' ';
          }
        } else if (container.data[offset - 1] === '\xA0') {
          container.deleteData(offset - 1, 1);
          if (!/[\u00a0| ]$/.test(value)) {
            value = ' ' + value;
          }
        }
      }
      return value;
    };

    var isTableCell$2 = NodeType.matchNodeNames('td th');
    var selectionSetContent = function (editor, content) {
      var rng = editor.selection.getRng();
      var container = rng.startContainer;
      var offset = rng.startOffset;
      if (rng.collapsed && isAfterNbsp(container, offset) && NodeType.isText(container)) {
        container.insertData(offset - 1, ' ');
        container.deleteData(offset, 1);
        rng.setStart(container, offset);
        rng.setEnd(container, offset);
        editor.selection.setRng(rng);
      }
      editor.selection.setContent(content);
    };
    var validInsertion = function (editor, value, parentNode) {
      if (parentNode.getAttribute('data-mce-bogus') === 'all') {
        parentNode.parentNode.insertBefore(editor.dom.createFragment(value), parentNode);
      } else {
        var node = parentNode.firstChild;
        var node2 = parentNode.lastChild;
        if (!node || node === node2 && node.nodeName === 'BR') {
          editor.dom.setHTML(parentNode, value);
        } else {
          selectionSetContent(editor, value);
        }
      }
    };
    var trimBrsFromTableCell = function (dom, elm) {
      Option.from(dom.getParent(elm, 'td,th')).map(Element$$1.fromDom).each(PaddingBr.trimBlockTrailingBr);
    };
    var reduceInlineTextElements = function (editor, merge) {
      var textInlineElements = editor.schema.getTextInlineElements();
      var dom = editor.dom;
      if (merge) {
        var root_1 = editor.getBody(), elementUtils_1 = new ElementUtils(dom);
        Tools.each(dom.select('*[data-mce-fragment]'), function (node) {
          for (var testNode = node.parentNode; testNode && testNode !== root_1; testNode = testNode.parentNode) {
            if (textInlineElements[node.nodeName.toLowerCase()] && elementUtils_1.compare(testNode, node)) {
              dom.remove(node, true);
            }
          }
        });
      }
    };
    var markFragmentElements = function (fragment) {
      var node = fragment;
      while (node = node.walk()) {
        if (node.type === 1) {
          node.attr('data-mce-fragment', '1');
        }
      }
    };
    var umarkFragmentElements = function (elm) {
      Tools.each(elm.getElementsByTagName('*'), function (elm) {
        elm.removeAttribute('data-mce-fragment');
      });
    };
    var isPartOfFragment = function (node) {
      return !!node.getAttribute('data-mce-fragment');
    };
    var canHaveChildren = function (editor, node) {
      return node && !editor.schema.getShortEndedElements()[node.nodeName];
    };
    var moveSelectionToMarker = function (editor, marker) {
      var parentEditableFalseElm, parentBlock, nextRng;
      var dom = editor.dom, selection = editor.selection;
      var node, node2;
      var getContentEditableFalseParent = function (node) {
        var root = editor.getBody();
        for (; node && node !== root; node = node.parentNode) {
          if (editor.dom.getContentEditable(node) === 'false') {
            return node;
          }
        }
        return null;
      };
      if (!marker) {
        return;
      }
      editor.selection.scrollIntoView(marker);
      parentEditableFalseElm = getContentEditableFalseParent(marker);
      if (parentEditableFalseElm) {
        dom.remove(marker);
        selection.select(parentEditableFalseElm);
        return;
      }
      var rng = dom.createRng();
      node = marker.previousSibling;
      if (node && node.nodeType === 3) {
        rng.setStart(node, node.nodeValue.length);
        if (!Env.ie) {
          node2 = marker.nextSibling;
          if (node2 && node2.nodeType === 3) {
            node.appendData(node2.data);
            node2.parentNode.removeChild(node2);
          }
        }
      } else {
        rng.setStartBefore(marker);
        rng.setEndBefore(marker);
      }
      var findNextCaretRng = function (rng) {
        var caretPos = CaretPosition$1.fromRangeStart(rng);
        var caretWalker = CaretWalker(editor.getBody());
        caretPos = caretWalker.next(caretPos);
        if (caretPos) {
          return caretPos.toRange();
        }
      };
      parentBlock = dom.getParent(marker, dom.isBlock);
      dom.remove(marker);
      if (parentBlock && dom.isEmpty(parentBlock)) {
        editor.$(parentBlock).empty();
        rng.setStart(parentBlock, 0);
        rng.setEnd(parentBlock, 0);
        if (!isTableCell$2(parentBlock) && !isPartOfFragment(parentBlock) && (nextRng = findNextCaretRng(rng))) {
          rng = nextRng;
          dom.remove(parentBlock);
        } else {
          dom.add(parentBlock, dom.create('br', { 'data-mce-bogus': '1' }));
        }
      }
      selection.setRng(rng);
    };
    var insertHtmlAtCaret = function (editor, value, details) {
      var parser, serializer, parentNode, rootNode, fragment, args;
      var marker, rng, node, bookmarkHtml, merge;
      var selection = editor.selection, dom = editor.dom;
      if (/^ | $/.test(value)) {
        value = trimOrPadLeftRight(selection.getRng(), value);
      }
      parser = editor.parser;
      merge = details.merge;
      serializer = Serializer({ validate: editor.settings.validate }, editor.schema);
      bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">&#xFEFF;&#x200B;</span>';
      args = {
        content: value,
        format: 'html',
        selection: true,
        paste: details.paste
      };
      args = editor.fire('BeforeSetContent', args);
      if (args.isDefaultPrevented()) {
        editor.fire('SetContent', {
          content: args.content,
          format: 'html',
          selection: true,
          paste: details.paste
        });
        return;
      }
      value = args.content;
      if (value.indexOf('{$caret}') === -1) {
        value += '{$caret}';
      }
      value = value.replace(/\{\$caret\}/, bookmarkHtml);
      rng = selection.getRng();
      var caretElement = rng.startContainer || (rng.parentElement ? rng.parentElement() : null);
      var body = editor.getBody();
      if (caretElement === body && selection.isCollapsed()) {
        if (dom.isBlock(body.firstChild) && canHaveChildren(editor, body.firstChild) && dom.isEmpty(body.firstChild)) {
          rng = dom.createRng();
          rng.setStart(body.firstChild, 0);
          rng.setEnd(body.firstChild, 0);
          selection.setRng(rng);
        }
      }
      if (!selection.isCollapsed()) {
        editor.selection.setRng(RangeNormalizer.normalize(editor.selection.getRng()));
        editor.getDoc().execCommand('Delete', false, null);
        value = trimNbspAfterDeleteAndPadValue(editor.selection.getRng(), value);
      }
      parentNode = selection.getNode();
      var parserArgs = {
        context: parentNode.nodeName.toLowerCase(),
        data: details.data,
        insert: true
      };
      fragment = parser.parse(value, parserArgs);
      if (details.paste === true && InsertList.isListFragment(editor.schema, fragment) && InsertList.isParentBlockLi(dom, parentNode)) {
        rng = InsertList.insertAtCaret(serializer, dom, editor.selection.getRng(), fragment);
        editor.selection.setRng(rng);
        editor.fire('SetContent', args);
        return;
      }
      markFragmentElements(fragment);
      node = fragment.lastChild;
      if (node.attr('id') === 'mce_marker') {
        marker = node;
        for (node = node.prev; node; node = node.walk(true)) {
          if (node.type === 3 || !dom.isBlock(node.name)) {
            if (editor.schema.isValidChild(node.parent.name, 'span')) {
              node.parent.insert(marker, node, node.name === 'br');
            }
            break;
          }
        }
      }
      editor._selectionOverrides.showBlockCaretContainer(parentNode);
      if (!parserArgs.invalid) {
        value = serializer.serialize(fragment);
        validInsertion(editor, value, parentNode);
      } else {
        selectionSetContent(editor, bookmarkHtml);
        parentNode = selection.getNode();
        rootNode = editor.getBody();
        if (parentNode.nodeType === 9) {
          parentNode = node = rootNode;
        } else {
          node = parentNode;
        }
        while (node !== rootNode) {
          parentNode = node;
          node = node.parentNode;
        }
        value = parentNode === rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode);
        value = serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, function () {
          return serializer.serialize(fragment);
        })));
        if (parentNode === rootNode) {
          dom.setHTML(rootNode, value);
        } else {
          dom.setOuterHTML(parentNode, value);
        }
      }
      reduceInlineTextElements(editor, merge);
      moveSelectionToMarker(editor, dom.get('mce_marker'));
      umarkFragmentElements(editor.getBody());
      trimBrsFromTableCell(editor.dom, editor.selection.getStart());
      editor.fire('SetContent', args);
      editor.addVisual();
    };
    var processValue = function (value) {
      var details;
      if (typeof value !== 'string') {
        details = Tools.extend({
          paste: value.paste,
          data: { paste: value.paste }
        }, value);
        return {
          content: value.content,
          details: details
        };
      }
      return {
        content: value,
        details: {}
      };
    };
    var insertAtCaret$1 = function (editor, value) {
      var result = processValue(value);
      insertHtmlAtCaret(editor, result.content, result.details);
    };
    var InsertContent = { insertAtCaret: insertAtCaret$1 };

    var sectionResult = Immutable('sections', 'settings');
    var detection = PlatformDetection$1.detect();
    var isTouch = detection.deviceType.isTouch();
    var mobilePlugins = [
      'lists',
      'autolink',
      'autosave'
    ];
    var defaultMobileSettings = { theme: 'mobile' };
    var normalizePlugins = function (plugins) {
      var pluginNames = isArray(plugins) ? plugins.join(' ') : plugins;
      var trimmedPlugins = map(isString(pluginNames) ? pluginNames.split(' ') : [], trim$2);
      return filter(trimmedPlugins, function (item) {
        return item.length > 0;
      });
    };
    var filterMobilePlugins = function (plugins) {
      return filter(plugins, curry(contains, mobilePlugins));
    };
    var extractSections = function (keys$$1, settings) {
      var result = bifilter(settings, function (value, key) {
        return contains(keys$$1, key);
      });
      return sectionResult(result.t, result.f);
    };
    var getSection = function (sectionResult, name, defaults) {
      var sections = sectionResult.sections();
      var sectionSettings = sections.hasOwnProperty(name) ? sections[name] : {};
      return Tools.extend({}, defaults, sectionSettings);
    };
    var hasSection = function (sectionResult, name) {
      return sectionResult.sections().hasOwnProperty(name);
    };
    var getDefaultSettings = function (id, documentBaseUrl, editor) {
      return {
        id: id,
        theme: 'modern',
        delta_width: 0,
        delta_height: 0,
        popup_css: '',
        plugins: '',
        document_base_url: documentBaseUrl,
        add_form_submit_trigger: true,
        submit_patch: true,
        add_unload_trigger: true,
        convert_urls: true,
        relative_urls: true,
        remove_script_host: true,
        object_resizing: true,
        doctype: '<!DOCTYPE html>',
        visual: true,
        font_size_style_values: 'xx-small,x-small,small,medium,large,x-large,xx-large',
        font_size_legacy_values: 'xx-small,small,medium,large,x-large,xx-large,300%',
        forced_root_block: 'p',
        hidden_input: true,
        render_ui: true,
        indentation: '30px',
        inline_styles: true,
        convert_fonts_to_spans: true,
        indent: 'simple',
        indent_before: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
        indent_after: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,summary,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
        entity_encoding: 'named',
        url_converter: editor.convertURL,
        url_converter_scope: editor,
        ie7_compat: true
      };
    };
    var getExternalPlugins = function (overrideSettings, settings) {
      var userDefinedExternalPlugins = settings.external_plugins ? settings.external_plugins : {};
      if (overrideSettings && overrideSettings.external_plugins) {
        return Tools.extend({}, overrideSettings.external_plugins, userDefinedExternalPlugins);
      } else {
        return userDefinedExternalPlugins;
      }
    };
    var combinePlugins = function (forcedPlugins, plugins) {
      return [].concat(normalizePlugins(forcedPlugins)).concat(normalizePlugins(plugins));
    };
    var processPlugins = function (isTouchDevice, sectionResult, defaultOverrideSettings, settings) {
      var forcedPlugins = normalizePlugins(defaultOverrideSettings.forced_plugins);
      var plugins = normalizePlugins(settings.plugins);
      var platformPlugins = isTouchDevice && hasSection(sectionResult, 'mobile') ? filterMobilePlugins(plugins) : plugins;
      var combinedPlugins = combinePlugins(forcedPlugins, platformPlugins);
      return Tools.extend(settings, { plugins: combinedPlugins.join(' ') });
    };
    var isOnMobile = function (isTouchDevice, sectionResult) {
      var isInline = sectionResult.settings().inline;
      return isTouchDevice && hasSection(sectionResult, 'mobile') && !isInline;
    };
    var combineSettings = function (isTouchDevice, defaultSettings, defaultOverrideSettings, settings) {
      var sectionResult = extractSections(['mobile'], settings);
      var extendedSettings = Tools.extend(defaultSettings, defaultOverrideSettings, sectionResult.settings(), isOnMobile(isTouchDevice, sectionResult) ? getSection(sectionResult, 'mobile', defaultMobileSettings) : {}, {
        validate: true,
        content_editable: sectionResult.settings().inline,
        external_plugins: getExternalPlugins(defaultOverrideSettings, sectionResult.settings())
      });
      return processPlugins(isTouchDevice, sectionResult, defaultOverrideSettings, extendedSettings);
    };
    var getEditorSettings = function (editor, id, documentBaseUrl, defaultOverrideSettings, settings) {
      var defaultSettings = getDefaultSettings(id, documentBaseUrl, editor);
      return combineSettings(isTouch, defaultSettings, defaultOverrideSettings, settings);
    };
    var getFiltered = function (predicate, editor, name) {
      return Option.from(editor.settings[name]).filter(predicate);
    };
    var getString = curry(getFiltered, isString);
    var getParamObject = function (value) {
      var output = {};
      if (typeof value === 'string') {
        each(value.indexOf('=') > 0 ? value.split(/[;,](?![^=;,]*(?:[;,]|$))/) : value.split(','), function (val) {
          var arr = val.split('=');
          if (arr.length > 1) {
            output[Tools.trim(arr[0])] = Tools.trim(arr[1]);
          } else {
            output[Tools.trim(arr[0])] = Tools.trim(arr);
          }
        });
      } else {
        output = value;
      }
      return output;
    };
    var isArrayOf = function (p) {
      return function (a) {
        return isArray(a) && forall(a, p);
      };
    };
    var getParam = function (editor, name, defaultVal, type) {
      var value = name in editor.settings ? editor.settings[name] : defaultVal;
      if (type === 'hash') {
        return getParamObject(value);
      } else if (type === 'string') {
        return getFiltered(isString, editor, name).getOr(defaultVal);
      } else if (type === 'number') {
        return getFiltered(isNumber, editor, name).getOr(defaultVal);
      } else if (type === 'boolean') {
        return getFiltered(isBoolean, editor, name).getOr(defaultVal);
      } else if (type === 'object') {
        return getFiltered(isObject, editor, name).getOr(defaultVal);
      } else if (type === 'array') {
        return getFiltered(isArray, editor, name).getOr(defaultVal);
      } else if (type === 'string[]') {
        return getFiltered(isArrayOf(isString), editor, name).getOr(defaultVal);
      } else if (type === 'function') {
        return getFiltered(isFunction, editor, name).getOr(defaultVal);
      } else {
        return value;
      }
    };

    var strongRtl = /[\u0591-\u07FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
    var hasStrongRtl = function (text) {
      return strongRtl.test(text);
    };

    var isInlineTarget = function (editor, elm) {
      var selector = getString(editor, 'inline_boundaries_selector').getOr('a[href],code');
      return is$1(Element$$1.fromDom(elm), selector);
    };
    var isRtl = function (element) {
      return DOMUtils$1.DOM.getStyle(element, 'direction', true) === 'rtl' || hasStrongRtl(element.textContent);
    };
    var findInlineParents = function (isInlineTarget, rootNode, pos) {
      return filter(DOMUtils$1.DOM.getParents(pos.container(), '*', rootNode), isInlineTarget);
    };
    var findRootInline = function (isInlineTarget, rootNode, pos) {
      var parents = findInlineParents(isInlineTarget, rootNode, pos);
      return Option.from(parents[parents.length - 1]);
    };
    var hasSameParentBlock = function (rootNode, node1, node2) {
      var block1 = getParentBlock(node1, rootNode);
      var block2 = getParentBlock(node2, rootNode);
      return block1 && block1 === block2;
    };
    var isAtZwsp = function (pos) {
      return isBeforeInline(pos) || isAfterInline(pos);
    };
    var normalizePosition = function (forward, pos) {
      var container = pos.container(), offset = pos.offset();
      if (forward) {
        if (isCaretContainerInline(container)) {
          if (NodeType.isText(container.nextSibling)) {
            return CaretPosition$1(container.nextSibling, 0);
          } else {
            return CaretPosition$1.after(container);
          }
        } else {
          return isBeforeInline(pos) ? CaretPosition$1(container, offset + 1) : pos;
        }
      } else {
        if (isCaretContainerInline(container)) {
          if (NodeType.isText(container.previousSibling)) {
            return CaretPosition$1(container.previousSibling, container.previousSibling.data.length);
          } else {
            return CaretPosition$1.before(container);
          }
        } else {
          return isAfterInline(pos) ? CaretPosition$1(container, offset - 1) : pos;
        }
      }
    };
    var normalizeForwards = curry(normalizePosition, true);
    var normalizeBackwards = curry(normalizePosition, false);
    var InlineUtils = {
      isInlineTarget: isInlineTarget,
      findRootInline: findRootInline,
      isRtl: isRtl,
      isAtZwsp: isAtZwsp,
      normalizePosition: normalizePosition,
      normalizeForwards: normalizeForwards,
      normalizeBackwards: normalizeBackwards,
      hasSameParentBlock: hasSameParentBlock
    };

    var isBeforeRoot = function (rootNode) {
      return function (elm) {
        return eq(rootNode, Element$$1.fromDom(elm.dom().parentNode));
      };
    };
    var getParentBlock$1 = function (rootNode, elm) {
      return contains$3(rootNode, elm) ? closest(elm, function (element) {
        return isTextBlock(element) || isListItem(element);
      }, isBeforeRoot(rootNode)) : Option.none();
    };
    var placeCaretInEmptyBody = function (editor) {
      var body = editor.getBody();
      var node = body.firstChild && editor.dom.isBlock(body.firstChild) ? body.firstChild : body;
      editor.selection.setCursorLocation(node, 0);
    };
    var paddEmptyBody = function (editor) {
      if (editor.dom.isEmpty(editor.getBody())) {
        editor.setContent('');
        placeCaretInEmptyBody(editor);
      }
    };
    var willDeleteLastPositionInElement = function (forward, fromPos, elm) {
      return liftN([
        CaretFinder.firstPositionIn(elm),
        CaretFinder.lastPositionIn(elm)
      ], function (firstPos, lastPos) {
        var normalizedFirstPos = InlineUtils.normalizePosition(true, firstPos);
        var normalizedLastPos = InlineUtils.normalizePosition(false, lastPos);
        var normalizedFromPos = InlineUtils.normalizePosition(false, fromPos);
        if (forward) {
          return CaretFinder.nextPosition(elm, normalizedFromPos).map(function (nextPos) {
            return nextPos.isEqual(normalizedLastPos) && fromPos.isEqual(normalizedFirstPos);
          }).getOr(false);
        } else {
          return CaretFinder.prevPosition(elm, normalizedFromPos).map(function (prevPos) {
            return prevPos.isEqual(normalizedFirstPos) && fromPos.isEqual(normalizedLastPos);
          }).getOr(false);
        }
      }).getOr(true);
    };
    var DeleteUtils = {
      getParentBlock: getParentBlock$1,
      paddEmptyBody: paddEmptyBody,
      willDeleteLastPositionInElement: willDeleteLastPositionInElement
    };

    var ancestor$2 = function (scope, selector, isRoot) {
      return ancestor$1(scope, selector, isRoot).isSome();
    };

    var hasWhitespacePreserveParent = function (rootNode, node) {
      var rootElement = Element$$1.fromDom(rootNode);
      var startNode = Element$$1.fromDom(node);
      return ancestor$2(startNode, 'pre,code', curry(eq, rootElement));
    };
    var isWhitespace = function (rootNode, node) {
      return NodeType.isText(node) && /^[ \t\r\n]*$/.test(node.data) && hasWhitespacePreserveParent(rootNode, node) === false;
    };
    var isNamedAnchor = function (node) {
      return NodeType.isElement(node) && node.nodeName === 'A' && node.hasAttribute('name');
    };
    var isContent = function (rootNode, node) {
      return isCaretCandidate(node) && isWhitespace(rootNode, node) === false || isNamedAnchor(node) || isBookmark(node);
    };
    var isBookmark = NodeType.hasAttribute('data-mce-bookmark');
    var isBogus$2 = NodeType.hasAttribute('data-mce-bogus');
    var isBogusAll$1 = NodeType.hasAttributeValue('data-mce-bogus', 'all');
    var isEmptyNode = function (targetNode) {
      var walker, node, brCount = 0;
      if (isContent(targetNode, targetNode)) {
        return false;
      } else {
        node = targetNode.firstChild;
        if (!node) {
          return true;
        }
        walker = new TreeWalker(node, targetNode);
        do {
          if (isBogusAll$1(node)) {
            node = walker.next(true);
            continue;
          }
          if (isBogus$2(node)) {
            node = walker.next();
            continue;
          }
          if (NodeType.isBr(node)) {
            brCount++;
            node = walker.next();
            continue;
          }
          if (isContent(targetNode, node)) {
            return false;
          }
          node = walker.next();
        } while (node);
        return brCount <= 1;
      }
    };
    var isEmpty$1 = function (elm) {
      return isEmptyNode(elm.dom());
    };
    var Empty = { isEmpty: isEmpty$1 };

    var BlockPosition = Immutable('block', 'position');
    var BlockBoundary = Immutable('from', 'to');
    var getBlockPosition = function (rootNode, pos) {
      var rootElm = Element$$1.fromDom(rootNode);
      var containerElm = Element$$1.fromDom(pos.container());
      return DeleteUtils.getParentBlock(rootElm, containerElm).map(function (block) {
        return BlockPosition(block, pos);
      });
    };
    var isDifferentBlocks = function (blockBoundary) {
      return eq(blockBoundary.from().block(), blockBoundary.to().block()) === false;
    };
    var hasSameParent = function (blockBoundary) {
      return parent(blockBoundary.from().block()).bind(function (parent1) {
        return parent(blockBoundary.to().block()).filter(function (parent2) {
          return eq(parent1, parent2);
        });
      }).isSome();
    };
    var isEditable = function (blockBoundary) {
      return NodeType.isContentEditableFalse(blockBoundary.from().block()) === false && NodeType.isContentEditableFalse(blockBoundary.to().block()) === false;
    };
    var skipLastBr = function (rootNode, forward, blockPosition) {
      if (NodeType.isBr(blockPosition.position().getNode()) && Empty.isEmpty(blockPosition.block()) === false) {
        return CaretFinder.positionIn(false, blockPosition.block().dom()).bind(function (lastPositionInBlock) {
          if (lastPositionInBlock.isEqual(blockPosition.position())) {
            return CaretFinder.fromPosition(forward, rootNode, lastPositionInBlock).bind(function (to) {
              return getBlockPosition(rootNode, to);
            });
          } else {
            return Option.some(blockPosition);
          }
        }).getOr(blockPosition);
      } else {
        return blockPosition;
      }
    };
    var readFromRange = function (rootNode, forward, rng) {
      var fromBlockPos = getBlockPosition(rootNode, CaretPosition$1.fromRangeStart(rng));
      var toBlockPos = fromBlockPos.bind(function (blockPos) {
        return CaretFinder.fromPosition(forward, rootNode, blockPos.position()).bind(function (to) {
          return getBlockPosition(rootNode, to).map(function (blockPos) {
            return skipLastBr(rootNode, forward, blockPos);
          });
        });
      });
      return liftN([
        fromBlockPos,
        toBlockPos
      ], BlockBoundary).filter(function (blockBoundary) {
        return isDifferentBlocks(blockBoundary) && hasSameParent(blockBoundary) && isEditable(blockBoundary);
      });
    };
    var read$1 = function (rootNode, forward, rng) {
      return rng.collapsed ? readFromRange(rootNode, forward, rng) : Option.none();
    };
    var BlockBoundary$1 = { read: read$1 };

    var dropLast = function (xs) {
      return xs.slice(0, -1);
    };
    var parentsUntil$1 = function (startNode, rootElm, predicate) {
      if (contains$3(rootElm, startNode)) {
        return dropLast(parents(startNode, function (elm) {
          return predicate(elm) || eq(elm, rootElm);
        }));
      } else {
        return [];
      }
    };
    var parents$1 = function (startNode, rootElm) {
      return parentsUntil$1(startNode, rootElm, constant(false));
    };
    var parentsAndSelf = function (startNode, rootElm) {
      return [startNode].concat(parents$1(startNode, rootElm));
    };
    var Parents = {
      parentsUntil: parentsUntil$1,
      parents: parents$1,
      parentsAndSelf: parentsAndSelf
    };

    var getChildrenUntilBlockBoundary = function (block) {
      var children$$1 = children(block);
      return findIndex(children$$1, isBlock).fold(function () {
        return children$$1;
      }, function (index) {
        return children$$1.slice(0, index);
      });
    };
    var extractChildren = function (block) {
      var children$$1 = getChildrenUntilBlockBoundary(block);
      each(children$$1, remove$2);
      return children$$1;
    };
    var removeEmptyRoot = function (rootNode, block) {
      var parents$$1 = Parents.parentsAndSelf(block, rootNode);
      return find(parents$$1.reverse(), Empty.isEmpty).each(remove$2);
    };
    var isEmptyBefore = function (el) {
      return filter(prevSiblings(el), function (el) {
        return !Empty.isEmpty(el);
      }).length === 0;
    };
    var nestedBlockMerge = function (rootNode, fromBlock, toBlock, insertionPoint) {
      if (Empty.isEmpty(toBlock)) {
        PaddingBr.fillWithPaddingBr(toBlock);
        return CaretFinder.firstPositionIn(toBlock.dom());
      }
      if (isEmptyBefore(insertionPoint) && Empty.isEmpty(fromBlock)) {
        before(insertionPoint, Element$$1.fromTag('br'));
      }
      var position = CaretFinder.prevPosition(toBlock.dom(), CaretPosition$1.before(insertionPoint.dom()));
      each(extractChildren(fromBlock), function (child$$1) {
        before(insertionPoint, child$$1);
      });
      removeEmptyRoot(rootNode, fromBlock);
      return position;
    };
    var sidelongBlockMerge = function (rootNode, fromBlock, toBlock) {
      if (Empty.isEmpty(toBlock)) {
        remove$2(toBlock);
        if (Empty.isEmpty(fromBlock)) {
          PaddingBr.fillWithPaddingBr(fromBlock);
        }
        return CaretFinder.firstPositionIn(fromBlock.dom());
      }
      var position = CaretFinder.lastPositionIn(toBlock.dom());
      each(extractChildren(fromBlock), function (child$$1) {
        append(toBlock, child$$1);
      });
      removeEmptyRoot(rootNode, fromBlock);
      return position;
    };
    var findInsertionPoint = function (toBlock, block) {
      var parentsAndSelf = Parents.parentsAndSelf(block, toBlock);
      return Option.from(parentsAndSelf[parentsAndSelf.length - 1]);
    };
    var getInsertionPoint = function (fromBlock, toBlock) {
      return contains$3(toBlock, fromBlock) ? findInsertionPoint(toBlock, fromBlock) : Option.none();
    };
    var trimBr = function (first, block) {
      CaretFinder.positionIn(first, block.dom()).map(function (position) {
        return position.getNode();
      }).map(Element$$1.fromDom).filter(isBr).each(remove$2);
    };
    var mergeBlockInto = function (rootNode, fromBlock, toBlock) {
      trimBr(true, fromBlock);
      trimBr(false, toBlock);
      return getInsertionPoint(fromBlock, toBlock).fold(curry(sidelongBlockMerge, rootNode, fromBlock, toBlock), curry(nestedBlockMerge, rootNode, fromBlock, toBlock));
    };
    var mergeBlocks = function (rootNode, forward, block1, block2) {
      return forward ? mergeBlockInto(rootNode, block2, block1) : mergeBlockInto(rootNode, block1, block2);
    };
    var MergeBlocks = { mergeBlocks: mergeBlocks };

    var backspaceDelete = function (editor, forward) {
      var position;
      var rootNode = Element$$1.fromDom(editor.getBody());
      position = BlockBoundary$1.read(rootNode.dom(), forward, editor.selection.getRng()).bind(function (blockBoundary) {
        return MergeBlocks.mergeBlocks(rootNode, forward, blockBoundary.from().block(), blockBoundary.to().block());
      });
      position.each(function (pos) {
        editor.selection.setRng(pos.toRange());
      });
      return position.isSome();
    };
    var BlockBoundaryDelete = { backspaceDelete: backspaceDelete };

    var deleteRangeMergeBlocks = function (rootNode, selection) {
      var rng = selection.getRng();
      return liftN([
        DeleteUtils.getParentBlock(rootNode, Element$$1.fromDom(rng.startContainer)),
        DeleteUtils.getParentBlock(rootNode, Element$$1.fromDom(rng.endContainer))
      ], function (block1, block2) {
        if (eq(block1, block2) === false) {
          rng.deleteContents();
          MergeBlocks.mergeBlocks(rootNode, true, block1, block2).each(function (pos) {
            selection.setRng(pos.toRange());
          });
          return true;
        } else {
          return false;
        }
      }).getOr(false);
    };
    var isRawNodeInTable = function (root, rawNode) {
      var node = Element$$1.fromDom(rawNode);
      var isRoot = curry(eq, root);
      return ancestor(node, isTableCell, isRoot).isSome();
    };
    var isSelectionInTable = function (root, rng) {
      return isRawNodeInTable(root, rng.startContainer) || isRawNodeInTable(root, rng.endContainer);
    };
    var isEverythingSelected = function (root, rng) {
      var noPrevious = CaretFinder.prevPosition(root.dom(), CaretPosition$1.fromRangeStart(rng)).isNone();
      var noNext = CaretFinder.nextPosition(root.dom(), CaretPosition$1.fromRangeEnd(rng)).isNone();
      return !isSelectionInTable(root, rng) && noPrevious && noNext;
    };
    var emptyEditor = function (editor) {
      editor.setContent('');
      editor.selection.setCursorLocation();
      return true;
    };
    var deleteRange = function (editor) {
      var rootNode = Element$$1.fromDom(editor.getBody());
      var rng = editor.selection.getRng();
      return isEverythingSelected(rootNode, rng) ? emptyEditor(editor) : deleteRangeMergeBlocks(rootNode, editor.selection);
    };
    var backspaceDelete$1 = function (editor, forward) {
      return editor.selection.isCollapsed() ? false : deleteRange(editor);
    };
    var BlockRangeDelete = { backspaceDelete: backspaceDelete$1 };

    var generate$1 = function (cases) {
      if (!isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }
      var constructors = [];
      var adt = {};
      each(cases, function (acase, count) {
        var keys$$1 = keys(acase);
        if (keys$$1.length !== 1) {
          throw new Error('one and only one name per case');
        }
        var key = keys$$1[0];
        var value = acase[key];
        if (adt[key] !== undefined) {
          throw new Error('duplicate key detected:' + key);
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)');
        } else if (!isArray(value)) {
          throw new Error('case arguments must be an array');
        }
        constructors.push(key);
        adt[key] = function () {
          var argLength = arguments.length;
          if (argLength !== value.length) {
            throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
          }
          var args = new Array(argLength);
          for (var i = 0; i < args.length; i++)
            args[i] = arguments[i];
          var match = function (branches) {
            var branchKeys = keys(branches);
            if (constructors.length !== branchKeys.length) {
              throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
            }
            var allReqd = forall(constructors, function (reqKey) {
              return contains(branchKeys, reqKey);
            });
            if (!allReqd)
              throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
            return branches[key].apply(null, args);
          };
          return {
            fold: function () {
              if (arguments.length !== cases.length) {
                throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
              }
              var target = arguments[count];
              return target.apply(null, args);
            },
            match: match,
            log: function (label) {
              console.log(label, {
                constructors: constructors,
                constructor: key,
                params: args
              });
            }
          };
        };
      });
      return adt;
    };
    var Adt = { generate: generate$1 };

    var isCompoundElement = function (node) {
      return isTableCell(Element$$1.fromDom(node)) || isListItem(Element$$1.fromDom(node));
    };
    var DeleteAction = Adt.generate([
      { remove: ['element'] },
      { moveToElement: ['element'] },
      { moveToPosition: ['position'] }
    ]);
    var isAtContentEditableBlockCaret = function (forward, from) {
      var elm = from.getNode(forward === false);
      var caretLocation = forward ? 'after' : 'before';
      return NodeType.isElement(elm) && elm.getAttribute('data-mce-caret') === caretLocation;
    };
    var isDeleteFromCefDifferentBlocks = function (root, forward, from, to) {
      var inSameBlock = function (elm) {
        return isInline(Element$$1.fromDom(elm)) && !isInSameBlock(from, to, root);
      };
      return getRelativeCefElm(!forward, from).fold(function () {
        return getRelativeCefElm(forward, to).fold(constant(false), inSameBlock);
      }, inSameBlock);
    };
    var deleteEmptyBlockOrMoveToCef = function (root, forward, from, to) {
      var toCefElm = to.getNode(forward === false);
      return DeleteUtils.getParentBlock(Element$$1.fromDom(root), Element$$1.fromDom(from.getNode())).map(function (blockElm) {
        return Empty.isEmpty(blockElm) ? DeleteAction.remove(blockElm.dom()) : DeleteAction.moveToElement(toCefElm);
      }).orThunk(function () {
        return Option.some(DeleteAction.moveToElement(toCefElm));
      });
    };
    var findCefPosition = function (root, forward, from) {
      return CaretFinder.fromPosition(forward, root, from).bind(function (to) {
        if (isCompoundElement(to.getNode())) {
          return Option.none();
        } else if (isDeleteFromCefDifferentBlocks(root, forward, from, to)) {
          return Option.none();
        } else if (forward && NodeType.isContentEditableFalse(to.getNode())) {
          return deleteEmptyBlockOrMoveToCef(root, forward, from, to);
        } else if (forward === false && NodeType.isContentEditableFalse(to.getNode(true))) {
          return deleteEmptyBlockOrMoveToCef(root, forward, from, to);
        } else if (forward && isAfterContentEditableFalse(from)) {
          return Option.some(DeleteAction.moveToPosition(to));
        } else if (forward === false && isBeforeContentEditableFalse(from)) {
          return Option.some(DeleteAction.moveToPosition(to));
        } else {
          return Option.none();
        }
      });
    };
    var getContentEditableBlockAction = function (forward, elm) {
      if (forward && NodeType.isContentEditableFalse(elm.nextSibling)) {
        return Option.some(DeleteAction.moveToElement(elm.nextSibling));
      } else if (forward === false && NodeType.isContentEditableFalse(elm.previousSibling)) {
        return Option.some(DeleteAction.moveToElement(elm.previousSibling));
      } else {
        return Option.none();
      }
    };
    var skipMoveToActionFromInlineCefToContent = function (root, from, deleteAction) {
      return deleteAction.fold(function (elm) {
        return Option.some(DeleteAction.remove(elm));
      }, function (elm) {
        return Option.some(DeleteAction.moveToElement(elm));
      }, function (to) {
        if (isInSameBlock(from, to, root)) {
          return Option.none();
        } else {
          return Option.some(DeleteAction.moveToPosition(to));
        }
      });
    };
    var getContentEditableAction = function (root, forward, from) {
      if (isAtContentEditableBlockCaret(forward, from)) {
        return getContentEditableBlockAction(forward, from.getNode(forward === false)).fold(function () {
          return findCefPosition(root, forward, from);
        }, Option.some);
      } else {
        return findCefPosition(root, forward, from).bind(function (deleteAction) {
          return skipMoveToActionFromInlineCefToContent(root, from, deleteAction);
        });
      }
    };
    var read$2 = function (root, forward, rng) {
      var normalizedRange = normalizeRange(forward ? 1 : -1, root, rng);
      var from = CaretPosition$1.fromRangeStart(normalizedRange);
      if (forward === false && isAfterContentEditableFalse(from)) {
        return Option.some(DeleteAction.remove(from.getNode(true)));
      } else if (forward && isBeforeContentEditableFalse(from)) {
        return Option.some(DeleteAction.remove(from.getNode()));
      } else {
        return getContentEditableAction(root, forward, from);
      }
    };

    var isCollapsibleWhitespace = function (c) {
      return ' \f\n\r\t\x0B'.indexOf(c) !== -1;
    };
    var normalizeContent = function (content, isStartOfContent, isEndOfContent) {
      var result = foldl(content.split(''), function (acc, c) {
        if (isCollapsibleWhitespace(c) || c === '\xA0') {
          if (acc.previousCharIsSpace || acc.str === '' && isStartOfContent || acc.str.length === content.length - 1 && isEndOfContent) {
            return {
              previousCharIsSpace: false,
              str: acc.str + '\xA0'
            };
          } else {
            return {
              previousCharIsSpace: true,
              str: acc.str + ' '
            };
          }
        } else {
          return {
            previousCharIsSpace: false,
            str: acc.str + c
          };
        }
      }, {
        previousCharIsSpace: false,
        str: ''
      });
      return result.str;
    };
    var normalize$1 = function (node, offset, count) {
      if (count === 0) {
        return;
      }
      var whitespace = node.data.slice(offset, offset + count);
      var isEndOfContent = offset + count >= node.data.length;
      var isStartOfContent = offset === 0;
      node.replaceData(offset, count, normalizeContent(whitespace, isStartOfContent, isEndOfContent));
    };
    var normalizeWhitespaceAfter = function (node, offset) {
      var content = node.data.slice(offset);
      var whitespaceCount = content.length - lTrim(content).length;
      return normalize$1(node, offset, whitespaceCount);
    };
    var normalizeWhitespaceBefore = function (node, offset) {
      var content = node.data.slice(0, offset);
      var whitespaceCount = content.length - rTrim(content).length;
      return normalize$1(node, offset - whitespaceCount, whitespaceCount);
    };
    var mergeTextNodes = function (prevNode, nextNode, normalizeWhitespace) {
      var whitespaceOffset = rTrim(prevNode.data).length;
      prevNode.appendData(nextNode.data);
      remove$2(Element$$1.fromDom(nextNode));
      if (normalizeWhitespace) {
        normalizeWhitespaceAfter(prevNode, whitespaceOffset);
      }
      return prevNode;
    };

    var needsReposition = function (pos, elm) {
      var container = pos.container();
      var offset = pos.offset();
      return CaretPosition$1.isTextPosition(pos) === false && container === elm.parentNode && offset > CaretPosition$1.before(elm).offset();
    };
    var reposition = function (elm, pos) {
      return needsReposition(pos, elm) ? CaretPosition$1(pos.container(), pos.offset() - 1) : pos;
    };
    var beforeOrStartOf = function (node) {
      return NodeType.isText(node) ? CaretPosition$1(node, 0) : CaretPosition$1.before(node);
    };
    var afterOrEndOf = function (node) {
      return NodeType.isText(node) ? CaretPosition$1(node, node.data.length) : CaretPosition$1.after(node);
    };
    var getPreviousSiblingCaretPosition = function (elm) {
      if (isCaretCandidate(elm.previousSibling)) {
        return Option.some(afterOrEndOf(elm.previousSibling));
      } else {
        return elm.previousSibling ? CaretFinder.lastPositionIn(elm.previousSibling) : Option.none();
      }
    };
    var getNextSiblingCaretPosition = function (elm) {
      if (isCaretCandidate(elm.nextSibling)) {
        return Option.some(beforeOrStartOf(elm.nextSibling));
      } else {
        return elm.nextSibling ? CaretFinder.firstPositionIn(elm.nextSibling) : Option.none();
      }
    };
    var findCaretPositionBackwardsFromElm = function (rootElement, elm) {
      var startPosition = CaretPosition$1.before(elm.previousSibling ? elm.previousSibling : elm.parentNode);
      return CaretFinder.prevPosition(rootElement, startPosition).fold(function () {
        return CaretFinder.nextPosition(rootElement, CaretPosition$1.after(elm));
      }, Option.some);
    };
    var findCaretPositionForwardsFromElm = function (rootElement, elm) {
      return CaretFinder.nextPosition(rootElement, CaretPosition$1.after(elm)).fold(function () {
        return CaretFinder.prevPosition(rootElement, CaretPosition$1.before(elm));
      }, Option.some);
    };
    var findCaretPositionBackwards = function (rootElement, elm) {
      return getPreviousSiblingCaretPosition(elm).orThunk(function () {
        return getNextSiblingCaretPosition(elm);
      }).orThunk(function () {
        return findCaretPositionBackwardsFromElm(rootElement, elm);
      });
    };
    var findCaretPositionForward = function (rootElement, elm) {
      return getNextSiblingCaretPosition(elm).orThunk(function () {
        return getPreviousSiblingCaretPosition(elm);
      }).orThunk(function () {
        return findCaretPositionForwardsFromElm(rootElement, elm);
      });
    };
    var findCaretPosition$1 = function (forward, rootElement, elm) {
      return forward ? findCaretPositionForward(rootElement, elm) : findCaretPositionBackwards(rootElement, elm);
    };
    var findCaretPosOutsideElmAfterDelete = function (forward, rootElement, elm) {
      return findCaretPosition$1(forward, rootElement, elm).map(curry(reposition, elm));
    };
    var setSelection = function (editor, forward, pos) {
      pos.fold(function () {
        editor.focus();
      }, function (pos) {
        editor.selection.setRng(pos.toRange(), forward);
      });
    };
    var eqRawNode = function (rawNode) {
      return function (elm) {
        return elm.dom() === rawNode;
      };
    };
    var isBlock$2 = function (editor, elm) {
      return elm && editor.schema.getBlockElements().hasOwnProperty(name(elm));
    };
    var paddEmptyBlock = function (elm) {
      if (Empty.isEmpty(elm)) {
        var br = Element$$1.fromHtml('<br data-mce-bogus="1">');
        empty(elm);
        append(elm, br);
        return Option.some(CaretPosition$1.before(br.dom()));
      } else {
        return Option.none();
      }
    };
    var deleteNormalized = function (elm, afterDeletePosOpt, normalizeWhitespace) {
      var prevTextOpt = prevSibling(elm).filter(function (e) {
        return NodeType.isText(e.dom());
      });
      var nextTextOpt = nextSibling(elm).filter(function (e) {
        return NodeType.isText(e.dom());
      });
      remove$2(elm);
      return liftN([
        prevTextOpt,
        nextTextOpt,
        afterDeletePosOpt
      ], function (prev, next, pos) {
        var prevNode = prev.dom(), nextNode = next.dom();
        var offset = prevNode.data.length;
        mergeTextNodes(prevNode, nextNode, normalizeWhitespace);
        return pos.container() === nextNode ? CaretPosition$1(prevNode, offset) : pos;
      }).orThunk(function () {
        if (normalizeWhitespace) {
          prevTextOpt.each(function (elm) {
            return normalizeWhitespaceBefore(elm.dom(), elm.dom().length);
          });
          nextTextOpt.each(function (elm) {
            return normalizeWhitespaceAfter(elm.dom(), 0);
          });
        }
        return afterDeletePosOpt;
      });
    };
    var isInlineElement = function (editor, element) {
      return has(editor.schema.getTextInlineElements(), name(element));
    };
    var deleteElement = function (editor, forward, elm, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true;
      }
      var afterDeletePos = findCaretPosOutsideElmAfterDelete(forward, editor.getBody(), elm.dom());
      var parentBlock = ancestor(elm, curry(isBlock$2, editor), eqRawNode(editor.getBody()));
      var normalizedAfterDeletePos = deleteNormalized(elm, afterDeletePos, isInlineElement(editor, elm));
      if (editor.dom.isEmpty(editor.getBody())) {
        editor.setContent('');
        editor.selection.setCursorLocation();
      } else {
        parentBlock.bind(paddEmptyBlock).fold(function () {
          if (moveCaret) {
            setSelection(editor, forward, normalizedAfterDeletePos);
          }
        }, function (paddPos) {
          if (moveCaret) {
            setSelection(editor, forward, Option.some(paddPos));
          }
        });
      }
    };
    var DeleteElement = { deleteElement: deleteElement };

    var deleteElement$1 = function (editor, forward) {
      return function (element) {
        editor._selectionOverrides.hideFakeCaret();
        DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(element));
        return true;
      };
    };
    var moveToElement = function (editor, forward) {
      return function (element) {
        var pos = forward ? CaretPosition$1.before(element) : CaretPosition$1.after(element);
        editor.selection.setRng(pos.toRange());
        return true;
      };
    };
    var moveToPosition = function (editor) {
      return function (pos) {
        editor.selection.setRng(pos.toRange());
        return true;
      };
    };
    var backspaceDeleteCaret = function (editor, forward) {
      var result = read$2(editor.getBody(), forward, editor.selection.getRng()).map(function (deleteAction) {
        return deleteAction.fold(deleteElement$1(editor, forward), moveToElement(editor, forward), moveToPosition(editor));
      });
      return result.getOr(false);
    };
    var deleteOffscreenSelection = function (rootElement) {
      each(descendants$1(rootElement, '.mce-offscreen-selection'), remove$2);
    };
    var backspaceDeleteRange = function (editor, forward) {
      var selectedElement = editor.selection.getNode();
      if (NodeType.isContentEditableFalse(selectedElement)) {
        deleteOffscreenSelection(Element$$1.fromDom(editor.getBody()));
        DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(editor.selection.getNode()));
        DeleteUtils.paddEmptyBody(editor);
        return true;
      } else {
        return false;
      }
    };
    var getContentEditableRoot = function (root, node) {
      while (node && node !== root) {
        if (NodeType.isContentEditableTrue(node) || NodeType.isContentEditableFalse(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var paddEmptyElement = function (editor) {
      var br;
      var ceRoot = getContentEditableRoot(editor.getBody(), editor.selection.getNode());
      if (NodeType.isContentEditableTrue(ceRoot) && editor.dom.isBlock(ceRoot) && editor.dom.isEmpty(ceRoot)) {
        br = editor.dom.create('br', { 'data-mce-bogus': '1' });
        editor.dom.setHTML(ceRoot, '');
        ceRoot.appendChild(br);
        editor.selection.setRng(CaretPosition$1.before(br).toRange());
      }
      return true;
    };
    var backspaceDelete$2 = function (editor, forward) {
      if (editor.selection.isCollapsed()) {
        return backspaceDeleteCaret(editor, forward);
      } else {
        return backspaceDeleteRange(editor, forward);
      }
    };
    var CefDelete = {
      backspaceDelete: backspaceDelete$2,
      paddEmptyElement: paddEmptyElement
    };

    var isText$8 = NodeType.isText;
    var startsWithCaretContainer$1 = function (node) {
      return isText$8(node) && node.data[0] === Zwsp.ZWSP;
    };
    var endsWithCaretContainer$1 = function (node) {
      return isText$8(node) && node.data[node.data.length - 1] === Zwsp.ZWSP;
    };
    var createZwsp = function (node) {
      return node.ownerDocument.createTextNode(Zwsp.ZWSP);
    };
    var insertBefore$1 = function (node) {
      if (isText$8(node.previousSibling)) {
        if (endsWithCaretContainer$1(node.previousSibling)) {
          return node.previousSibling;
        } else {
          node.previousSibling.appendData(Zwsp.ZWSP);
          return node.previousSibling;
        }
      } else if (isText$8(node)) {
        if (startsWithCaretContainer$1(node)) {
          return node;
        } else {
          node.insertData(0, Zwsp.ZWSP);
          return node;
        }
      } else {
        var newNode = createZwsp(node);
        node.parentNode.insertBefore(newNode, node);
        return newNode;
      }
    };
    var insertAfter$1 = function (node) {
      if (isText$8(node.nextSibling)) {
        if (startsWithCaretContainer$1(node.nextSibling)) {
          return node.nextSibling;
        } else {
          node.nextSibling.insertData(0, Zwsp.ZWSP);
          return node.nextSibling;
        }
      } else if (isText$8(node)) {
        if (endsWithCaretContainer$1(node)) {
          return node;
        } else {
          node.appendData(Zwsp.ZWSP);
          return node;
        }
      } else {
        var newNode = createZwsp(node);
        if (node.nextSibling) {
          node.parentNode.insertBefore(newNode, node.nextSibling);
        } else {
          node.parentNode.appendChild(newNode);
        }
        return newNode;
      }
    };
    var insertInline$1 = function (before, node) {
      return before ? insertBefore$1(node) : insertAfter$1(node);
    };
    var insertInlineBefore = curry(insertInline$1, true);
    var insertInlineAfter = curry(insertInline$1, false);

    var insertInlinePos = function (pos, before) {
      if (NodeType.isText(pos.container())) {
        return insertInline$1(before, pos.container());
      } else {
        return insertInline$1(before, pos.getNode());
      }
    };
    var isPosCaretContainer = function (pos, caret) {
      var caretNode = caret.get();
      return caretNode && pos.container() === caretNode && isCaretContainerInline(caretNode);
    };
    var renderCaret = function (caret, location) {
      return location.fold(function (element) {
        CaretContainerRemove.remove(caret.get());
        var text = insertInlineBefore(element);
        caret.set(text);
        return Option.some(CaretPosition$1(text, text.length - 1));
      }, function (element) {
        return CaretFinder.firstPositionIn(element).map(function (pos) {
          if (!isPosCaretContainer(pos, caret)) {
            CaretContainerRemove.remove(caret.get());
            var text = insertInlinePos(pos, true);
            caret.set(text);
            return CaretPosition$1(text, 1);
          } else {
            return CaretPosition$1(caret.get(), 1);
          }
        });
      }, function (element) {
        return CaretFinder.lastPositionIn(element).map(function (pos) {
          if (!isPosCaretContainer(pos, caret)) {
            CaretContainerRemove.remove(caret.get());
            var text = insertInlinePos(pos, false);
            caret.set(text);
            return CaretPosition$1(text, text.length - 1);
          } else {
            return CaretPosition$1(caret.get(), caret.get().length - 1);
          }
        });
      }, function (element) {
        CaretContainerRemove.remove(caret.get());
        var text = insertInlineAfter(element);
        caret.set(text);
        return Option.some(CaretPosition$1(text, 1));
      });
    };
    var BoundaryCaret = { renderCaret: renderCaret };

    var evaluateUntil = function (fns, args) {
      for (var i = 0; i < fns.length; i++) {
        var result = fns[i].apply(null, args);
        if (result.isSome()) {
          return result;
        }
      }
      return Option.none();
    };
    var LazyEvaluator = { evaluateUntil: evaluateUntil };

    var Location = Adt.generate([
      { before: ['element'] },
      { start: ['element'] },
      { end: ['element'] },
      { after: ['element'] }
    ]);
    var rescope = function (rootNode, node) {
      var parentBlock = getParentBlock(node, rootNode);
      return parentBlock ? parentBlock : rootNode;
    };
    var before$3 = function (isInlineTarget, rootNode, pos) {
      var nPos = InlineUtils.normalizeForwards(pos);
      var scope = rescope(rootNode, nPos.container());
      return InlineUtils.findRootInline(isInlineTarget, scope, nPos).fold(function () {
        return CaretFinder.nextPosition(scope, nPos).bind(curry(InlineUtils.findRootInline, isInlineTarget, scope)).map(function (inline) {
          return Location.before(inline);
        });
      }, Option.none);
    };
    var isNotInsideFormatCaretContainer = function (rootNode, elm) {
      return getParentCaretContainer(rootNode, elm) === null;
    };
    var findInsideRootInline = function (isInlineTarget, rootNode, pos) {
      return InlineUtils.findRootInline(isInlineTarget, rootNode, pos).filter(curry(isNotInsideFormatCaretContainer, rootNode));
    };
    var start = function (isInlineTarget, rootNode, pos) {
      var nPos = InlineUtils.normalizeBackwards(pos);
      return findInsideRootInline(isInlineTarget, rootNode, nPos).bind(function (inline) {
        var prevPos = CaretFinder.prevPosition(inline, nPos);
        return prevPos.isNone() ? Option.some(Location.start(inline)) : Option.none();
      });
    };
    var end = function (isInlineTarget, rootNode, pos) {
      var nPos = InlineUtils.normalizeForwards(pos);
      return findInsideRootInline(isInlineTarget, rootNode, nPos).bind(function (inline) {
        var nextPos = CaretFinder.nextPosition(inline, nPos);
        return nextPos.isNone() ? Option.some(Location.end(inline)) : Option.none();
      });
    };
    var after$3 = function (isInlineTarget, rootNode, pos) {
      var nPos = InlineUtils.normalizeBackwards(pos);
      var scope = rescope(rootNode, nPos.container());
      return InlineUtils.findRootInline(isInlineTarget, scope, nPos).fold(function () {
        return CaretFinder.prevPosition(scope, nPos).bind(curry(InlineUtils.findRootInline, isInlineTarget, scope)).map(function (inline) {
          return Location.after(inline);
        });
      }, Option.none);
    };
    var isValidLocation = function (location) {
      return InlineUtils.isRtl(getElement(location)) === false;
    };
    var readLocation = function (isInlineTarget, rootNode, pos) {
      var location = LazyEvaluator.evaluateUntil([
        before$3,
        start,
        end,
        after$3
      ], [
        isInlineTarget,
        rootNode,
        pos
      ]);
      return location.filter(isValidLocation);
    };
    var getElement = function (location) {
      return location.fold(identity, identity, identity, identity);
    };
    var getName = function (location) {
      return location.fold(constant('before'), constant('start'), constant('end'), constant('after'));
    };
    var outside = function (location) {
      return location.fold(Location.before, Location.before, Location.after, Location.after);
    };
    var inside = function (location) {
      return location.fold(Location.start, Location.start, Location.end, Location.end);
    };
    var isEq$1 = function (location1, location2) {
      return getName(location1) === getName(location2) && getElement(location1) === getElement(location2);
    };
    var betweenInlines = function (forward, isInlineTarget, rootNode, from, to, location) {
      return liftN([
        InlineUtils.findRootInline(isInlineTarget, rootNode, from),
        InlineUtils.findRootInline(isInlineTarget, rootNode, to)
      ], function (fromInline, toInline) {
        if (fromInline !== toInline && InlineUtils.hasSameParentBlock(rootNode, fromInline, toInline)) {
          return Location.after(forward ? fromInline : toInline);
        } else {
          return location;
        }
      }).getOr(location);
    };
    var skipNoMovement = function (fromLocation, toLocation) {
      return fromLocation.fold(constant(true), function (fromLocation) {
        return !isEq$1(fromLocation, toLocation);
      });
    };
    var findLocationTraverse = function (forward, isInlineTarget, rootNode, fromLocation, pos) {
      var from = InlineUtils.normalizePosition(forward, pos);
      var to = CaretFinder.fromPosition(forward, rootNode, from).map(curry(InlineUtils.normalizePosition, forward));
      var location = to.fold(function () {
        return fromLocation.map(outside);
      }, function (to) {
        return readLocation(isInlineTarget, rootNode, to).map(curry(betweenInlines, forward, isInlineTarget, rootNode, from, to)).filter(curry(skipNoMovement, fromLocation));
      });
      return location.filter(isValidLocation);
    };
    var findLocationSimple = function (forward, location) {
      if (forward) {
        return location.fold(compose(Option.some, Location.start), Option.none, compose(Option.some, Location.after), Option.none);
      } else {
        return location.fold(Option.none, compose(Option.some, Location.before), Option.none, compose(Option.some, Location.end));
      }
    };
    var findLocation = function (forward, isInlineTarget, rootNode, pos) {
      var from = InlineUtils.normalizePosition(forward, pos);
      var fromLocation = readLocation(isInlineTarget, rootNode, from);
      return readLocation(isInlineTarget, rootNode, from).bind(curry(findLocationSimple, forward)).orThunk(function () {
        return findLocationTraverse(forward, isInlineTarget, rootNode, fromLocation, pos);
      });
    };
    var BoundaryLocation = {
      readLocation: readLocation,
      findLocation: findLocation,
      prevLocation: curry(findLocation, false),
      nextLocation: curry(findLocation, true),
      getElement: getElement,
      outside: outside,
      inside: inside
    };

    var hasSelectionModifyApi = function (editor) {
      return isFunction(editor.selection.getSel().modify);
    };
    var moveRel = function (forward, selection, pos) {
      var delta = forward ? 1 : -1;
      selection.setRng(CaretPosition$1(pos.container(), pos.offset() + delta).toRange());
      selection.getSel().modify('move', forward ? 'forward' : 'backward', 'word');
      return true;
    };
    var moveByWord = function (forward, editor) {
      var rng = editor.selection.getRng();
      var pos = forward ? CaretPosition$1.fromRangeEnd(rng) : CaretPosition$1.fromRangeStart(rng);
      if (!hasSelectionModifyApi(editor)) {
        return false;
      } else if (forward && isBeforeInline(pos)) {
        return moveRel(true, editor.selection, pos);
      } else if (!forward && isAfterInline(pos)) {
        return moveRel(false, editor.selection, pos);
      } else {
        return false;
      }
    };
    var WordSelection = {
      hasSelectionModifyApi: hasSelectionModifyApi,
      moveByWord: moveByWord
    };

    var setCaretPosition = function (editor, pos) {
      var rng = editor.dom.createRng();
      rng.setStart(pos.container(), pos.offset());
      rng.setEnd(pos.container(), pos.offset());
      editor.selection.setRng(rng);
    };
    var isFeatureEnabled = function (editor) {
      return editor.settings.inline_boundaries !== false;
    };
    var setSelected = function (state, elm) {
      if (state) {
        elm.setAttribute('data-mce-selected', 'inline-boundary');
      } else {
        elm.removeAttribute('data-mce-selected');
      }
    };
    var renderCaretLocation = function (editor, caret, location) {
      return BoundaryCaret.renderCaret(caret, location).map(function (pos) {
        setCaretPosition(editor, pos);
        return location;
      });
    };
    var findLocation$1 = function (editor, caret, forward) {
      var rootNode = editor.getBody();
      var from = CaretPosition$1.fromRangeStart(editor.selection.getRng());
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      var location = BoundaryLocation.findLocation(forward, isInlineTarget, rootNode, from);
      return location.bind(function (location) {
        return renderCaretLocation(editor, caret, location);
      });
    };
    var toggleInlines = function (isInlineTarget, dom, elms) {
      var selectedInlines = filter(dom.select('*[data-mce-selected="inline-boundary"]'), isInlineTarget);
      var targetInlines = filter(elms, isInlineTarget);
      each(difference(selectedInlines, targetInlines), curry(setSelected, false));
      each(difference(targetInlines, selectedInlines), curry(setSelected, true));
    };
    var safeRemoveCaretContainer = function (editor, caret) {
      if (editor.selection.isCollapsed() && editor.composing !== true && caret.get()) {
        var pos = CaretPosition$1.fromRangeStart(editor.selection.getRng());
        if (CaretPosition$1.isTextPosition(pos) && InlineUtils.isAtZwsp(pos) === false) {
          setCaretPosition(editor, CaretContainerRemove.removeAndReposition(caret.get(), pos));
          caret.set(null);
        }
      }
    };
    var renderInsideInlineCaret = function (isInlineTarget, editor, caret, elms) {
      if (editor.selection.isCollapsed()) {
        var inlines = filter(elms, isInlineTarget);
        each(inlines, function (inline) {
          var pos = CaretPosition$1.fromRangeStart(editor.selection.getRng());
          BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), pos).bind(function (location) {
            return renderCaretLocation(editor, caret, location);
          });
        });
      }
    };
    var move = function (editor, caret, forward) {
      return function () {
        return isFeatureEnabled(editor) ? findLocation$1(editor, caret, forward).isSome() : false;
      };
    };
    var moveWord = function (forward, editor, caret) {
      return function () {
        return isFeatureEnabled(editor) ? WordSelection.moveByWord(forward, editor) : false;
      };
    };
    var setupSelectedState = function (editor) {
      var caret = Cell(null);
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      editor.on('NodeChange', function (e) {
        if (isFeatureEnabled(editor)) {
          toggleInlines(isInlineTarget, editor.dom, e.parents);
          safeRemoveCaretContainer(editor, caret);
          renderInsideInlineCaret(isInlineTarget, editor, caret, e.parents);
        }
      });
      return caret;
    };
    var moveNextWord = curry(moveWord, true);
    var movePrevWord = curry(moveWord, false);
    var BoundarySelection = {
      move: move,
      moveNextWord: moveNextWord,
      movePrevWord: movePrevWord,
      setupSelectedState: setupSelectedState,
      setCaretPosition: setCaretPosition
    };

    var isFeatureEnabled$1 = function (editor) {
      return editor.settings.inline_boundaries !== false;
    };
    var rangeFromPositions = function (from, to) {
      var range = document.createRange();
      range.setStart(from.container(), from.offset());
      range.setEnd(to.container(), to.offset());
      return range;
    };
    var hasOnlyTwoOrLessPositionsLeft = function (elm) {
      return liftN([
        CaretFinder.firstPositionIn(elm),
        CaretFinder.lastPositionIn(elm)
      ], function (firstPos, lastPos) {
        var normalizedFirstPos = InlineUtils.normalizePosition(true, firstPos);
        var normalizedLastPos = InlineUtils.normalizePosition(false, lastPos);
        return CaretFinder.nextPosition(elm, normalizedFirstPos).map(function (pos) {
          return pos.isEqual(normalizedLastPos);
        }).getOr(true);
      }).getOr(true);
    };
    var setCaretLocation = function (editor, caret) {
      return function (location$$1) {
        return BoundaryCaret.renderCaret(caret, location$$1).map(function (pos) {
          BoundarySelection.setCaretPosition(editor, pos);
          return true;
        }).getOr(false);
      };
    };
    var deleteFromTo = function (editor, caret, from, to) {
      var rootNode = editor.getBody();
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      editor.undoManager.ignore(function () {
        editor.selection.setRng(rangeFromPositions(from, to));
        editor.execCommand('Delete');
        BoundaryLocation.readLocation(isInlineTarget, rootNode, CaretPosition$1.fromRangeStart(editor.selection.getRng())).map(BoundaryLocation.inside).map(setCaretLocation(editor, caret));
      });
      editor.nodeChanged();
    };
    var rescope$1 = function (rootNode, node) {
      var parentBlock = getParentBlock(node, rootNode);
      return parentBlock ? parentBlock : rootNode;
    };
    var backspaceDeleteCollapsed = function (editor, caret, forward, from) {
      var rootNode = rescope$1(editor.getBody(), from.container());
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      var fromLocation = BoundaryLocation.readLocation(isInlineTarget, rootNode, from);
      return fromLocation.bind(function (location$$1) {
        if (forward) {
          return location$$1.fold(constant(Option.some(BoundaryLocation.inside(location$$1))), Option.none, constant(Option.some(BoundaryLocation.outside(location$$1))), Option.none);
        } else {
          return location$$1.fold(Option.none, constant(Option.some(BoundaryLocation.outside(location$$1))), Option.none, constant(Option.some(BoundaryLocation.inside(location$$1))));
        }
      }).map(setCaretLocation(editor, caret)).getOrThunk(function () {
        var toPosition = CaretFinder.navigate(forward, rootNode, from);
        var toLocation = toPosition.bind(function (pos) {
          return BoundaryLocation.readLocation(isInlineTarget, rootNode, pos);
        });
        if (fromLocation.isSome() && toLocation.isSome()) {
          return InlineUtils.findRootInline(isInlineTarget, rootNode, from).map(function (elm) {
            if (hasOnlyTwoOrLessPositionsLeft(elm)) {
              DeleteElement.deleteElement(editor, forward, Element$$1.fromDom(elm));
              return true;
            } else {
              return false;
            }
          }).getOr(false);
        } else {
          return toLocation.bind(function (_) {
            return toPosition.map(function (to) {
              if (forward) {
                deleteFromTo(editor, caret, from, to);
              } else {
                deleteFromTo(editor, caret, to, from);
              }
              return true;
            });
          }).getOr(false);
        }
      });
    };
    var backspaceDelete$3 = function (editor, caret, forward) {
      if (editor.selection.isCollapsed() && isFeatureEnabled$1(editor)) {
        var from = CaretPosition$1.fromRangeStart(editor.selection.getRng());
        return backspaceDeleteCollapsed(editor, caret, forward, from);
      }
      return false;
    };
    var InlineBoundaryDelete = { backspaceDelete: backspaceDelete$3 };

    var tableCellRng = Immutable('start', 'end');
    var tableSelection = Immutable('rng', 'table', 'cells');
    var deleteAction = Adt.generate([
      { removeTable: ['element'] },
      { emptyCells: ['cells'] }
    ]);
    var isRootFromElement = function (root) {
      return curry(eq, root);
    };
    var getClosestCell$1 = function (container, isRoot) {
      return closest$1(Element$$1.fromDom(container), 'td,th', isRoot);
    };
    var getClosestTable = function (cell, isRoot) {
      return ancestor$1(cell, 'table', isRoot);
    };
    var isExpandedCellRng = function (cellRng) {
      return eq(cellRng.start(), cellRng.end()) === false;
    };
    var getTableFromCellRng = function (cellRng, isRoot) {
      return getClosestTable(cellRng.start(), isRoot).bind(function (startParentTable) {
        return getClosestTable(cellRng.end(), isRoot).bind(function (endParentTable) {
          return eq(startParentTable, endParentTable) ? Option.some(startParentTable) : Option.none();
        });
      });
    };
    var getTableCells = function (table) {
      return descendants$1(table, 'td,th');
    };
    var getCellRangeFromStartTable = function (cellRng, isRoot) {
      return getClosestTable(cellRng.start(), isRoot).bind(function (table) {
        return last(getTableCells(table)).map(function (endCell) {
          return tableCellRng(cellRng.start(), endCell);
        });
      });
    };
    var partialSelection = function (isRoot, rng) {
      var startCell = getClosestCell$1(rng.startContainer, isRoot);
      var endCell = getClosestCell$1(rng.endContainer, isRoot);
      return rng.collapsed ? Option.none() : liftN([
        startCell,
        endCell
      ], tableCellRng).fold(function () {
        return startCell.fold(function () {
          return endCell.bind(function (endCell) {
            return getClosestTable(endCell, isRoot).bind(function (table) {
              return head(getTableCells(table)).map(function (startCell) {
                return tableCellRng(startCell, endCell);
              });
            });
          });
        }, function (startCell) {
          return getClosestTable(startCell, isRoot).bind(function (table) {
            return last(getTableCells(table)).map(function (endCell) {
              return tableCellRng(startCell, endCell);
            });
          });
        });
      }, function (cellRng) {
        return isWithinSameTable(isRoot, cellRng) ? Option.none() : getCellRangeFromStartTable(cellRng, isRoot);
      });
    };
    var isWithinSameTable = function (isRoot, cellRng) {
      return getTableFromCellRng(cellRng, isRoot).isSome();
    };
    var getCellRng = function (rng, isRoot) {
      var startCell = getClosestCell$1(rng.startContainer, isRoot);
      var endCell = getClosestCell$1(rng.endContainer, isRoot);
      return liftN([
        startCell,
        endCell
      ], tableCellRng).filter(isExpandedCellRng).filter(function (cellRng) {
        return isWithinSameTable(isRoot, cellRng);
      }).orThunk(function () {
        return partialSelection(isRoot, rng);
      });
    };
    var getTableSelectionFromCellRng = function (cellRng, isRoot) {
      return getTableFromCellRng(cellRng, isRoot).map(function (table) {
        return tableSelection(cellRng, table, getTableCells(table));
      });
    };
    var getTableSelectionFromRng = function (root, rng) {
      var isRoot = isRootFromElement(root);
      return getCellRng(rng, isRoot).bind(function (cellRng) {
        return getTableSelectionFromCellRng(cellRng, isRoot);
      });
    };
    var getCellIndex = function (cells, cell) {
      return findIndex(cells, function (x) {
        return eq(x, cell);
      });
    };
    var getSelectedCells = function (tableSelection) {
      return liftN([
        getCellIndex(tableSelection.cells(), tableSelection.rng().start()),
        getCellIndex(tableSelection.cells(), tableSelection.rng().end())
      ], function (startIndex, endIndex) {
        return tableSelection.cells().slice(startIndex, endIndex + 1);
      });
    };
    var getAction = function (tableSelection) {
      return getSelectedCells(tableSelection).map(function (selected) {
        var cells = tableSelection.cells();
        return selected.length === cells.length ? deleteAction.removeTable(tableSelection.table()) : deleteAction.emptyCells(selected);
      });
    };
    var getActionFromCells = function (cells) {
      return deleteAction.emptyCells(cells);
    };
    var getActionFromRange = function (root, rng) {
      return getTableSelectionFromRng(root, rng).bind(getAction);
    };
    var TableDeleteAction = {
      getActionFromRange: getActionFromRange,
      getActionFromCells: getActionFromCells
    };

    var getRanges = function (selection) {
      var ranges = [];
      if (selection) {
        for (var i = 0; i < selection.rangeCount; i++) {
          ranges.push(selection.getRangeAt(i));
        }
      }
      return ranges;
    };
    var getSelectedNodes = function (ranges) {
      return bind(ranges, function (range$$1) {
        var node = getSelectedNode(range$$1);
        return node ? [Element$$1.fromDom(node)] : [];
      });
    };
    var hasMultipleRanges = function (selection) {
      return getRanges(selection).length > 1;
    };
    var MultiRange = {
      getRanges: getRanges,
      getSelectedNodes: getSelectedNodes,
      hasMultipleRanges: hasMultipleRanges
    };

    var getCellsFromRanges = function (ranges) {
      return filter(MultiRange.getSelectedNodes(ranges), isTableCell);
    };
    var getCellsFromElement = function (elm) {
      var selectedCells = descendants$1(elm, 'td[data-mce-selected],th[data-mce-selected]');
      return selectedCells;
    };
    var getCellsFromElementOrRanges = function (ranges, element) {
      var selectedCells = getCellsFromElement(element);
      var rangeCells = getCellsFromRanges(ranges);
      return selectedCells.length > 0 ? selectedCells : rangeCells;
    };
    var getCellsFromEditor = function (editor) {
      return getCellsFromElementOrRanges(MultiRange.getRanges(editor.selection.getSel()), Element$$1.fromDom(editor.getBody()));
    };
    var TableCellSelection = {
      getCellsFromRanges: getCellsFromRanges,
      getCellsFromElement: getCellsFromElement,
      getCellsFromElementOrRanges: getCellsFromElementOrRanges,
      getCellsFromEditor: getCellsFromEditor
    };

    var emptyCells = function (editor, cells) {
      each(cells, PaddingBr.fillWithPaddingBr);
      editor.selection.setCursorLocation(cells[0].dom(), 0);
      return true;
    };
    var deleteTableElement = function (editor, table) {
      DeleteElement.deleteElement(editor, false, table);
      return true;
    };
    var deleteCellRange = function (editor, rootElm, rng) {
      return TableDeleteAction.getActionFromRange(rootElm, rng).map(function (action) {
        return action.fold(curry(deleteTableElement, editor), curry(emptyCells, editor));
      });
    };
    var deleteCaptionRange = function (editor, caption) {
      return emptyElement(editor, caption);
    };
    var deleteTableRange = function (editor, rootElm, rng, startElm) {
      return getParentCaption(rootElm, startElm).fold(function () {
        return deleteCellRange(editor, rootElm, rng);
      }, function (caption) {
        return deleteCaptionRange(editor, caption);
      }).getOr(false);
    };
    var deleteRange$1 = function (editor, startElm) {
      var rootNode = Element$$1.fromDom(editor.getBody());
      var rng = editor.selection.getRng();
      var selectedCells = TableCellSelection.getCellsFromEditor(editor);
      return selectedCells.length !== 0 ? emptyCells(editor, selectedCells) : deleteTableRange(editor, rootNode, rng, startElm);
    };
    var getParentCell = function (rootElm, elm) {
      return find(Parents.parentsAndSelf(elm, rootElm), isTableCell);
    };
    var getParentCaption = function (rootElm, elm) {
      return find(Parents.parentsAndSelf(elm, rootElm), function (elm) {
        return name(elm) === 'caption';
      });
    };
    var deleteBetweenCells = function (editor, rootElm, forward, fromCell, from) {
      return CaretFinder.navigate(forward, editor.getBody(), from).bind(function (to) {
        return getParentCell(rootElm, Element$$1.fromDom(to.getNode())).map(function (toCell) {
          return eq(toCell, fromCell) === false;
        });
      });
    };
    var emptyElement = function (editor, elm) {
      PaddingBr.fillWithPaddingBr(elm);
      editor.selection.setCursorLocation(elm.dom(), 0);
      return Option.some(true);
    };
    var isDeleteOfLastCharPos = function (fromCaption, forward, from, to) {
      return CaretFinder.firstPositionIn(fromCaption.dom()).bind(function (first) {
        return CaretFinder.lastPositionIn(fromCaption.dom()).map(function (last$$1) {
          return forward ? from.isEqual(first) && to.isEqual(last$$1) : from.isEqual(last$$1) && to.isEqual(first);
        });
      }).getOr(true);
    };
    var emptyCaretCaption = function (editor, elm) {
      return emptyElement(editor, elm);
    };
    var validateCaretCaption = function (rootElm, fromCaption, to) {
      return getParentCaption(rootElm, Element$$1.fromDom(to.getNode())).map(function (toCaption) {
        return eq(toCaption, fromCaption) === false;
      });
    };
    var deleteCaretInsideCaption = function (editor, rootElm, forward, fromCaption, from) {
      return CaretFinder.navigate(forward, editor.getBody(), from).bind(function (to) {
        return isDeleteOfLastCharPos(fromCaption, forward, from, to) ? emptyCaretCaption(editor, fromCaption) : validateCaretCaption(rootElm, fromCaption, to);
      }).or(Option.some(true));
    };
    var deleteCaretCells = function (editor, forward, rootElm, startElm) {
      var from = CaretPosition$1.fromRangeStart(editor.selection.getRng());
      return getParentCell(rootElm, startElm).bind(function (fromCell) {
        return Empty.isEmpty(fromCell) ? emptyElement(editor, fromCell) : deleteBetweenCells(editor, rootElm, forward, fromCell, from);
      });
    };
    var deleteCaretCaption = function (editor, forward, rootElm, fromCaption) {
      var from = CaretPosition$1.fromRangeStart(editor.selection.getRng());
      return Empty.isEmpty(fromCaption) ? emptyElement(editor, fromCaption) : deleteCaretInsideCaption(editor, rootElm, forward, fromCaption, from);
    };
    var deleteCaret = function (editor, forward, startElm) {
      var rootElm = Element$$1.fromDom(editor.getBody());
      return getParentCaption(rootElm, startElm).fold(function () {
        return deleteCaretCells(editor, forward, rootElm, startElm);
      }, function (fromCaption) {
        return deleteCaretCaption(editor, forward, rootElm, fromCaption);
      }).getOr(false);
    };
    var backspaceDelete$4 = function (editor, forward) {
      var startElm = Element$$1.fromDom(editor.selection.getStart(true));
      var cells = TableCellSelection.getCellsFromEditor(editor);
      return editor.selection.isCollapsed() && cells.length === 0 ? deleteCaret(editor, forward, startElm) : deleteRange$1(editor, startElm);
    };
    var TableDelete = { backspaceDelete: backspaceDelete$4 };

    var nativeCommand = function (editor, command) {
      editor.getDoc().execCommand(command, false, null);
    };
    var deleteCommand = function (editor) {
      if (CefDelete.backspaceDelete(editor, false)) {
        return;
      } else if (InlineBoundaryDelete.backspaceDelete(editor, false)) {
        return;
      } else if (BlockBoundaryDelete.backspaceDelete(editor, false)) {
        return;
      } else if (TableDelete.backspaceDelete(editor)) {
        return;
      } else if (BlockRangeDelete.backspaceDelete(editor, false)) {
        return;
      } else {
        nativeCommand(editor, 'Delete');
        DeleteUtils.paddEmptyBody(editor);
      }
    };
    var forwardDeleteCommand = function (editor) {
      if (CefDelete.backspaceDelete(editor, true)) {
        return;
      } else if (InlineBoundaryDelete.backspaceDelete(editor, true)) {
        return;
      } else if (BlockBoundaryDelete.backspaceDelete(editor, true)) {
        return;
      } else if (TableDelete.backspaceDelete(editor)) {
        return;
      } else if (BlockRangeDelete.backspaceDelete(editor, true)) {
        return;
      } else {
        nativeCommand(editor, 'ForwardDelete');
      }
    };
    var DeleteCommands = {
      deleteCommand: deleteCommand,
      forwardDeleteCommand: forwardDeleteCommand
    };

    var getSpecifiedFontProp = function (propName, rootElm, elm) {
      var getProperty = function (elm) {
        return getRaw(elm, propName);
      };
      var isRoot = function (elm) {
        return eq(Element$$1.fromDom(rootElm), elm);
      };
      return closest(Element$$1.fromDom(elm), function (elm) {
        return getProperty(elm).isSome();
      }, isRoot).bind(getProperty);
    };
    var round$1 = function (number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    };
    var toPt = function (fontSize, precision) {
      if (/[0-9.]+px$/.test(fontSize)) {
        return round$1(parseInt(fontSize, 10) * 72 / 96, precision || 0) + 'pt';
      }
      return fontSize;
    };
    var normalizeFontFamily = function (fontFamily) {
      return fontFamily.replace(/[\'\"\\]/g, '').replace(/,\s+/g, ',');
    };
    var getComputedFontProp = function (propName, elm) {
      return Option.from(DOMUtils$1.DOM.getStyle(elm, propName, true));
    };
    var getFontProp = function (propName) {
      return function (rootElm, elm) {
        return Option.from(elm).map(Element$$1.fromDom).filter(isElement).bind(function (element) {
          return getSpecifiedFontProp(propName, rootElm, element.dom()).or(getComputedFontProp(propName, element.dom()));
        }).getOr('');
      };
    };
    var FontInfo = {
      getFontSize: getFontProp('font-size'),
      getFontFamily: compose(normalizeFontFamily, getFontProp('font-family')),
      toPt: toPt
    };

    var findFirstCaretElement = function (editor) {
      return CaretFinder.firstPositionIn(editor.getBody()).map(function (caret) {
        var container = caret.container();
        return NodeType.isText(container) ? container.parentNode : container;
      });
    };
    var isRangeAtStartOfNode = function (rng, root) {
      return rng.startContainer === root && rng.startOffset === 0;
    };
    var getCaretElement = function (editor) {
      return Option.from(editor.selection.getRng()).bind(function (rng) {
        var root = editor.getBody();
        return isRangeAtStartOfNode(rng, root) ? Option.none() : Option.from(editor.selection.getStart(true));
      });
    };
    var fromFontSizeNumber = function (editor, value) {
      if (/^[0-9\.]+$/.test(value)) {
        var fontSizeNumber = parseInt(value, 10);
        if (fontSizeNumber >= 1 && fontSizeNumber <= 7) {
          var fontSizes = Settings.getFontStyleValues(editor);
          var fontClasses = Settings.getFontSizeClasses(editor);
          if (fontClasses) {
            return fontClasses[fontSizeNumber - 1] || value;
          } else {
            return fontSizes[fontSizeNumber - 1] || value;
          }
        } else {
          return value;
        }
      } else {
        return value;
      }
    };
    var fontNameAction = function (editor, value) {
      editor.formatter.toggle('fontname', { value: fromFontSizeNumber(editor, value) });
      editor.nodeChanged();
    };
    var fontNameQuery = function (editor) {
      return getCaretElement(editor).fold(function () {
        return findFirstCaretElement(editor).map(function (caretElement) {
          return FontInfo.getFontFamily(editor.getBody(), caretElement);
        }).getOr('');
      }, function (caretElement) {
        return FontInfo.getFontFamily(editor.getBody(), caretElement);
      });
    };
    var fontSizeAction = function (editor, value) {
      editor.formatter.toggle('fontsize', { value: fromFontSizeNumber(editor, value) });
      editor.nodeChanged();
    };
    var fontSizeQuery = function (editor) {
      return getCaretElement(editor).fold(function () {
        return findFirstCaretElement(editor).map(function (caretElement) {
          return FontInfo.getFontSize(editor.getBody(), caretElement);
        }).getOr('');
      }, function (caretElement) {
        return FontInfo.getFontSize(editor.getBody(), caretElement);
      });
    };

    var isEq$2 = function (rng1, rng2) {
      return rng1 && rng2 && (rng1.startContainer === rng2.startContainer && rng1.startOffset === rng2.startOffset) && (rng1.endContainer === rng2.endContainer && rng1.endOffset === rng2.endOffset);
    };
    var RangeCompare = { isEq: isEq$2 };

    var findParent = function (node, rootNode, predicate) {
      while (node && node !== rootNode) {
        if (predicate(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var hasParent = function (node, rootNode, predicate) {
      return findParent(node, rootNode, predicate) !== null;
    };
    var hasParentWithName = function (node, rootNode, name) {
      return hasParent(node, rootNode, function (node) {
        return node.nodeName === name;
      });
    };
    var isTable$2 = function (node) {
      return node && node.nodeName === 'TABLE';
    };
    var isTableCell$3 = function (node) {
      return node && /^(TD|TH|CAPTION)$/.test(node.nodeName);
    };
    var isCeFalseCaretContainer = function (node, rootNode) {
      return isCaretContainer(node) && hasParent(node, rootNode, isCaretNode) === false;
    };
    var hasBrBeforeAfter = function (dom, node, left) {
      var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || dom.getRoot());
      while (node = walker[left ? 'prev' : 'next']()) {
        if (NodeType.isBr(node)) {
          return true;
        }
      }
    };
    var isPrevNode = function (node, name) {
      return node.previousSibling && node.previousSibling.nodeName === name;
    };
    var hasContentEditableFalseParent = function (body, node) {
      while (node && node !== body) {
        if (NodeType.isContentEditableFalse(node)) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    };
    var findTextNodeRelative = function (dom, isAfterNode, collapsed, left, startNode) {
      var walker, lastInlineElement, parentBlockContainer;
      var body = dom.getRoot();
      var node;
      var nonEmptyElementsMap = dom.schema.getNonEmptyElements();
      parentBlockContainer = dom.getParent(startNode.parentNode, dom.isBlock) || body;
      if (left && NodeType.isBr(startNode) && isAfterNode && dom.isEmpty(parentBlockContainer)) {
        return Option.some(CaretPosition(startNode.parentNode, dom.nodeIndex(startNode)));
      }
      walker = new TreeWalker(startNode, parentBlockContainer);
      while (node = walker[left ? 'prev' : 'next']()) {
        if (dom.getContentEditableParent(node) === 'false' || isCeFalseCaretContainer(node, body)) {
          return Option.none();
        }
        if (NodeType.isText(node) && node.nodeValue.length > 0) {
          if (hasParentWithName(node, body, 'A') === false) {
            return Option.some(CaretPosition(node, left ? node.nodeValue.length : 0));
          }
          return Option.none();
        }
        if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
          return Option.none();
        }
        lastInlineElement = node;
      }
      if (collapsed && lastInlineElement) {
        return Option.some(CaretPosition(lastInlineElement, 0));
      }
      return Option.none();
    };
    var normalizeEndPoint = function (dom, collapsed, start, rng) {
      var container, offset, walker;
      var body = dom.getRoot();
      var node, nonEmptyElementsMap;
      var directionLeft, isAfterNode, normalized = false;
      container = rng[(start ? 'start' : 'end') + 'Container'];
      offset = rng[(start ? 'start' : 'end') + 'Offset'];
      isAfterNode = NodeType.isElement(container) && offset === container.childNodes.length;
      nonEmptyElementsMap = dom.schema.getNonEmptyElements();
      directionLeft = start;
      if (isCaretContainer(container)) {
        return Option.none();
      }
      if (NodeType.isElement(container) && offset > container.childNodes.length - 1) {
        directionLeft = false;
      }
      if (NodeType.isDocument(container)) {
        container = body;
        offset = 0;
      }
      if (container === body) {
        if (directionLeft) {
          node = container.childNodes[offset > 0 ? offset - 1 : 0];
          if (node) {
            if (isCaretContainer(node)) {
              return Option.none();
            }
            if (nonEmptyElementsMap[node.nodeName] || isTable$2(node)) {
              return Option.none();
            }
          }
        }
        if (container.hasChildNodes()) {
          offset = Math.min(!directionLeft && offset > 0 ? offset - 1 : offset, container.childNodes.length - 1);
          container = container.childNodes[offset];
          offset = NodeType.isText(container) && isAfterNode ? container.data.length : 0;
          if (!collapsed && container === body.lastChild && isTable$2(container)) {
            return Option.none();
          }
          if (hasContentEditableFalseParent(body, container) || isCaretContainer(container)) {
            return Option.none();
          }
          if (container.hasChildNodes() && isTable$2(container) === false) {
            node = container;
            walker = new TreeWalker(container, body);
            do {
              if (NodeType.isContentEditableFalse(node) || isCaretContainer(node)) {
                normalized = false;
                break;
              }
              if (NodeType.isText(node) && node.nodeValue.length > 0) {
                offset = directionLeft ? 0 : node.nodeValue.length;
                container = node;
                normalized = true;
                break;
              }
              if (nonEmptyElementsMap[node.nodeName.toLowerCase()] && !isTableCell$3(node)) {
                offset = dom.nodeIndex(node);
                container = node.parentNode;
                if (!directionLeft) {
                  offset++;
                }
                normalized = true;
                break;
              }
            } while (node = directionLeft ? walker.next() : walker.prev());
          }
        }
      }
      if (collapsed) {
        if (NodeType.isText(container) && offset === 0) {
          findTextNodeRelative(dom, isAfterNode, collapsed, true, container).each(function (pos) {
            container = pos.container();
            offset = pos.offset();
            normalized = true;
          });
        }
        if (NodeType.isElement(container)) {
          node = container.childNodes[offset];
          if (!node) {
            node = container.childNodes[offset - 1];
          }
          if (node && NodeType.isBr(node) && !isPrevNode(node, 'A') && !hasBrBeforeAfter(dom, node, false) && !hasBrBeforeAfter(dom, node, true)) {
            findTextNodeRelative(dom, isAfterNode, collapsed, true, node).each(function (pos) {
              container = pos.container();
              offset = pos.offset();
              normalized = true;
            });
          }
        }
      }
      if (directionLeft && !collapsed && NodeType.isText(container) && offset === container.nodeValue.length) {
        findTextNodeRelative(dom, isAfterNode, collapsed, false, container).each(function (pos) {
          container = pos.container();
          offset = pos.offset();
          normalized = true;
        });
      }
      return normalized ? Option.some(CaretPosition(container, offset)) : Option.none();
    };
    var normalize$2 = function (dom, rng) {
      var collapsed = rng.collapsed, normRng = rng.cloneRange();
      var startPos = CaretPosition.fromRangeStart(rng);
      normalizeEndPoint(dom, collapsed, true, normRng).each(function (pos) {
        if (!collapsed || !CaretPosition.isAbove(startPos, pos)) {
          normRng.setStart(pos.container(), pos.offset());
        }
      });
      if (!collapsed) {
        normalizeEndPoint(dom, collapsed, false, normRng).each(function (pos) {
          normRng.setEnd(pos.container(), pos.offset());
        });
      }
      if (collapsed) {
        normRng.collapse(true);
      }
      return RangeCompare.isEq(rng, normRng) ? Option.none() : Option.some(normRng);
    };
    var NormalizeRange = { normalize: normalize$2 };

    var hasRightSideContent = function (schema, container, parentBlock) {
      var walker = new TreeWalker(container, parentBlock);
      var node;
      var nonEmptyElementsMap = schema.getNonEmptyElements();
      while (node = walker.next()) {
        if (nonEmptyElementsMap[node.nodeName.toLowerCase()] || node.length > 0) {
          return true;
        }
      }
    };
    var scrollToBr = function (dom, selection, brElm) {
      var marker = dom.create('span', {}, '&nbsp;');
      brElm.parentNode.insertBefore(marker, brElm);
      selection.scrollIntoView(marker);
      dom.remove(marker);
    };
    var moveSelectionToBr = function (dom, selection, brElm, extraBr) {
      var rng = dom.createRng();
      if (!extraBr) {
        rng.setStartAfter(brElm);
        rng.setEndAfter(brElm);
      } else {
        rng.setStartBefore(brElm);
        rng.setEndBefore(brElm);
      }
      selection.setRng(rng);
    };
    var insertBrAtCaret = function (editor, evt) {
      var selection = editor.selection, dom = editor.dom;
      var brElm, extraBr;
      var rng = selection.getRng();
      NormalizeRange.normalize(dom, rng).each(function (normRng) {
        rng.setStart(normRng.startContainer, normRng.startOffset);
        rng.setEnd(normRng.endContainer, normRng.endOffset);
      });
      var offset = rng.startOffset;
      var container = rng.startContainer;
      if (container.nodeType === 1 && container.hasChildNodes()) {
        var isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;
        if (isAfterLastNodeInContainer && container.nodeType === 3) {
          offset = container.nodeValue.length;
        } else {
          offset = 0;
        }
      }
      var parentBlock = dom.getParent(container, dom.isBlock);
      var containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null;
      var containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : '';
      var isControlKey = evt && evt.ctrlKey;
      if (containerBlockName === 'LI' && !isControlKey) {
        parentBlock = containerBlock;
      }
      if (container && container.nodeType === 3 && offset >= container.nodeValue.length) {
        if (!hasRightSideContent(editor.schema, container, parentBlock)) {
          brElm = dom.create('br');
          rng.insertNode(brElm);
          rng.setStartAfter(brElm);
          rng.setEndAfter(brElm);
          extraBr = true;
        }
      }
      brElm = dom.create('br');
      rng.insertNode(brElm);
      scrollToBr(dom, selection, brElm);
      moveSelectionToBr(dom, selection, brElm, extraBr);
      editor.undoManager.add();
    };
    var insertBrBefore = function (editor, inline) {
      var br = Element$$1.fromTag('br');
      before(Element$$1.fromDom(inline), br);
      editor.undoManager.add();
    };
    var insertBrAfter = function (editor, inline) {
      if (!hasBrAfter(editor.getBody(), inline)) {
        after(Element$$1.fromDom(inline), Element$$1.fromTag('br'));
      }
      var br = Element$$1.fromTag('br');
      after(Element$$1.fromDom(inline), br);
      scrollToBr(editor.dom, editor.selection, br.dom());
      moveSelectionToBr(editor.dom, editor.selection, br.dom(), false);
      editor.undoManager.add();
    };
    var isBeforeBr = function (pos) {
      return NodeType.isBr(pos.getNode());
    };
    var hasBrAfter = function (rootNode, startNode) {
      if (isBeforeBr(CaretPosition$1.after(startNode))) {
        return true;
      } else {
        return CaretFinder.nextPosition(rootNode, CaretPosition$1.after(startNode)).map(function (pos) {
          return NodeType.isBr(pos.getNode());
        }).getOr(false);
      }
    };
    var isAnchorLink = function (elm) {
      return elm && elm.nodeName === 'A' && 'href' in elm;
    };
    var isInsideAnchor = function (location) {
      return location.fold(constant(false), isAnchorLink, isAnchorLink, constant(false));
    };
    var readInlineAnchorLocation = function (editor) {
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      var position = CaretPosition$1.fromRangeStart(editor.selection.getRng());
      return BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), position).filter(isInsideAnchor);
    };
    var insertBrOutsideAnchor = function (editor, location) {
      location.fold(noop, curry(insertBrBefore, editor), curry(insertBrAfter, editor), noop);
    };
    var insert = function (editor, evt) {
      var anchorLocation = readInlineAnchorLocation(editor);
      if (anchorLocation.isSome()) {
        anchorLocation.each(curry(insertBrOutsideAnchor, editor));
      } else {
        insertBrAtCaret(editor, evt);
      }
    };
    var InsertBr = { insert: insert };

    var adt = Adt.generate([
      { 'before': ['element'] },
      {
        'on': [
          'element',
          'offset'
        ]
      },
      { after: ['element'] }
    ]);

    var type$1 = Adt.generate([
      { domRange: ['rng'] },
      {
        relative: [
          'startSitu',
          'finishSitu'
        ]
      },
      {
        exact: [
          'start',
          'soffset',
          'finish',
          'foffset'
        ]
      }
    ]);
    var range$1 = Immutable('start', 'soffset', 'finish', 'foffset');

    var browser$3 = PlatformDetection$1.detect().browser;
    var clamp = function (offset, element) {
      var max = isText(element) ? get$6(element).length : children(element).length + 1;
      if (offset > max) {
        return max;
      } else if (offset < 0) {
        return 0;
      }
      return offset;
    };
    var normalizeRng = function (rng) {
      return range$1(rng.start(), clamp(rng.soffset(), rng.start()), rng.finish(), clamp(rng.foffset(), rng.finish()));
    };
    var isOrContains = function (root, elm) {
      return contains$3(root, elm) || eq(root, elm);
    };
    var isRngInRoot = function (root) {
      return function (rng) {
        return isOrContains(root, rng.start()) && isOrContains(root, rng.finish());
      };
    };
    var shouldStore = function (editor) {
      return editor.inline === true || browser$3.isIE();
    };
    var nativeRangeToSelectionRange = function (r) {
      return range$1(Element$$1.fromDom(r.startContainer), r.startOffset, Element$$1.fromDom(r.endContainer), r.endOffset);
    };
    var readRange = function (win) {
      var selection = win.getSelection();
      var rng = !selection || selection.rangeCount === 0 ? Option.none() : Option.from(selection.getRangeAt(0));
      return rng.map(nativeRangeToSelectionRange);
    };
    var getBookmark$2 = function (root) {
      var win = defaultView(root);
      return readRange(win.dom()).filter(isRngInRoot(root));
    };
    var validate = function (root, bookmark) {
      return Option.from(bookmark).filter(isRngInRoot(root)).map(normalizeRng);
    };
    var bookmarkToNativeRng = function (bookmark) {
      var rng = document.createRange();
      try {
        rng.setStart(bookmark.start().dom(), bookmark.soffset());
        rng.setEnd(bookmark.finish().dom(), bookmark.foffset());
        return Option.some(rng);
      } catch (_) {
        return Option.none();
      }
    };
    var store = function (editor) {
      var newBookmark = shouldStore(editor) ? getBookmark$2(Element$$1.fromDom(editor.getBody())) : Option.none();
      editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark;
    };
    var storeNative = function (editor, rng) {
      var root = Element$$1.fromDom(editor.getBody());
      var range = shouldStore(editor) ? Option.from(rng) : Option.none();
      var newBookmark = range.map(nativeRangeToSelectionRange).filter(isRngInRoot(root));
      editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark;
    };
    var getRng = function (editor) {
      var bookmark = editor.bookmark ? editor.bookmark : Option.none();
      return bookmark.bind(curry(validate, Element$$1.fromDom(editor.getBody()))).bind(bookmarkToNativeRng);
    };
    var restore = function (editor) {
      getRng(editor).each(function (rng) {
        editor.selection.setRng(rng);
      });
    };
    var SelectionBookmark = {
      store: store,
      storeNative: storeNative,
      readRange: readRange,
      restore: restore,
      getRng: getRng,
      getBookmark: getBookmark$2,
      validate: validate
    };

    var indentElement = function (dom, command, useMargin, value, unit, element) {
      if (dom.getContentEditable(element) === 'false') {
        return;
      }
      if (element.nodeName !== 'LI') {
        var indentStyleName = useMargin ? 'margin' : 'padding';
        indentStyleName = element.nodeName === 'TABLE' ? 'margin' : indentStyleName;
        indentStyleName += dom.getStyle(element, 'direction', true) === 'rtl' ? 'Right' : 'Left';
        if (command === 'outdent') {
          var styleValue = Math.max(0, parseInt(element.style[indentStyleName] || 0, 10) - value);
          dom.setStyle(element, indentStyleName, styleValue ? styleValue + unit : '');
        } else {
          var styleValue = parseInt(element.style[indentStyleName] || 0, 10) + value + unit;
          dom.setStyle(element, indentStyleName, styleValue);
        }
      }
    };
    var handle = function (editor, command) {
      var settings = editor.settings, dom = editor.dom, selection = editor.selection, formatter = editor.formatter;
      var indentUnit = /[a-z%]+$/i.exec(settings.indentation)[0];
      var indentValue = parseInt(settings.indentation, 10);
      var useMargin = editor.getParam('indent_use_margin', false);
      if (!editor.queryCommandState('InsertUnorderedList') && !editor.queryCommandState('InsertOrderedList')) {
        if (!settings.forced_root_block && !dom.getParent(selection.getNode(), dom.isBlock)) {
          formatter.apply('div');
        }
        each(selection.getSelectedBlocks(), function (element) {
          return indentElement(dom, command, useMargin, indentValue, indentUnit, element);
        });
      }
    };

    var each$a = Tools.each, extend$2 = Tools.extend;
    var map$3 = Tools.map, inArray$2 = Tools.inArray;
    function EditorCommands (editor) {
      var dom, selection, formatter;
      var commands = {
        state: {},
        exec: {},
        value: {}
      };
      var settings = editor.settings, bookmark;
      editor.on('PreInit', function () {
        dom = editor.dom;
        selection = editor.selection;
        settings = editor.settings;
        formatter = editor.formatter;
      });
      var execCommand = function (command, ui, value, args) {
        var func, customCommand, state = false;
        if (editor.removed) {
          return;
        }
        if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint)$/.test(command) && (!args || !args.skip_focus)) {
          editor.focus();
        } else {
          SelectionBookmark.restore(editor);
        }
        args = editor.fire('BeforeExecCommand', {
          command: command,
          ui: ui,
          value: value
        });
        if (args.isDefaultPrevented()) {
          return false;
        }
        customCommand = command.toLowerCase();
        if (func = commands.exec[customCommand]) {
          func(customCommand, ui, value);
          editor.fire('ExecCommand', {
            command: command,
            ui: ui,
            value: value
          });
          return true;
        }
        each$a(editor.plugins, function (p) {
          if (p.execCommand && p.execCommand(command, ui, value)) {
            editor.fire('ExecCommand', {
              command: command,
              ui: ui,
              value: value
            });
            state = true;
            return false;
          }
        });
        if (state) {
          return state;
        }
        if (editor.theme && editor.theme.execCommand && editor.theme.execCommand(command, ui, value)) {
          editor.fire('ExecCommand', {
            command: command,
            ui: ui,
            value: value
          });
          return true;
        }
        try {
          state = editor.getDoc().execCommand(command, ui, value);
        } catch (ex) {
        }
        if (state) {
          editor.fire('ExecCommand', {
            command: command,
            ui: ui,
            value: value
          });
          return true;
        }
        return false;
      };
      var queryCommandState = function (command) {
        var func;
        if (editor.quirks.isHidden() || editor.removed) {
          return;
        }
        command = command.toLowerCase();
        if (func = commands.state[command]) {
          return func(command);
        }
        try {
          return editor.getDoc().queryCommandState(command);
        } catch (ex) {
        }
        return false;
      };
      var queryCommandValue = function (command) {
        var func;
        if (editor.quirks.isHidden() || editor.removed) {
          return;
        }
        command = command.toLowerCase();
        if (func = commands.value[command]) {
          return func(command);
        }
        try {
          return editor.getDoc().queryCommandValue(command);
        } catch (ex) {
        }
      };
      var addCommands = function (commandList, type) {
        type = type || 'exec';
        each$a(commandList, function (callback, command) {
          each$a(command.toLowerCase().split(','), function (command) {
            commands[type][command] = callback;
          });
        });
      };
      var addCommand = function (command, callback, scope) {
        command = command.toLowerCase();
        commands.exec[command] = function (command, ui, value, args) {
          return callback.call(scope || editor, ui, value, args);
        };
      };
      var queryCommandSupported = function (command) {
        command = command.toLowerCase();
        if (commands.exec[command]) {
          return true;
        }
        try {
          return editor.getDoc().queryCommandSupported(command);
        } catch (ex) {
        }
        return false;
      };
      var addQueryStateHandler = function (command, callback, scope) {
        command = command.toLowerCase();
        commands.state[command] = function () {
          return callback.call(scope || editor);
        };
      };
      var addQueryValueHandler = function (command, callback, scope) {
        command = command.toLowerCase();
        commands.value[command] = function () {
          return callback.call(scope || editor);
        };
      };
      var hasCustomCommand = function (command) {
        command = command.toLowerCase();
        return !!commands.exec[command];
      };
      extend$2(this, {
        execCommand: execCommand,
        queryCommandState: queryCommandState,
        queryCommandValue: queryCommandValue,
        queryCommandSupported: queryCommandSupported,
        addCommands: addCommands,
        addCommand: addCommand,
        addQueryStateHandler: addQueryStateHandler,
        addQueryValueHandler: addQueryValueHandler,
        hasCustomCommand: hasCustomCommand
      });
      var execNativeCommand = function (command, ui, value) {
        if (ui === undefined) {
          ui = false;
        }
        if (value === undefined) {
          value = null;
        }
        return editor.getDoc().execCommand(command, ui, value);
      };
      var isFormatMatch = function (name) {
        return formatter.match(name);
      };
      var toggleFormat = function (name, value) {
        formatter.toggle(name, value ? { value: value } : undefined);
        editor.nodeChanged();
      };
      var storeSelection = function (type) {
        bookmark = selection.getBookmark(type);
      };
      var restoreSelection = function () {
        selection.moveToBookmark(bookmark);
      };
      addCommands({
        'mceResetDesignMode,mceBeginUndoLevel': function () {
        },
        'mceEndUndoLevel,mceAddUndoLevel': function () {
          editor.undoManager.add();
        },
        'Cut,Copy,Paste': function (command) {
          var doc = editor.getDoc();
          var failed;
          try {
            execNativeCommand(command);
          } catch (ex) {
            failed = true;
          }
          if (command === 'paste' && !doc.queryCommandEnabled(command)) {
            failed = true;
          }
          if (failed || !doc.queryCommandSupported(command)) {
            var msg = editor.translate('Your browser doesn\'t support direct access to the clipboard. ' + 'Please use the Ctrl+X/C/V keyboard shortcuts instead.');
            if (Env.mac) {
              msg = msg.replace(/Ctrl\+/g, '\u2318+');
            }
            editor.notificationManager.open({
              text: msg,
              type: 'error'
            });
          }
        },
        'unlink': function () {
          if (selection.isCollapsed()) {
            var elm = editor.dom.getParent(editor.selection.getStart(), 'a');
            if (elm) {
              editor.dom.remove(elm, true);
            }
            return;
          }
          formatter.remove('link');
        },
        'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull,JustifyNone': function (command) {
          var align = command.substring(7);
          if (align === 'full') {
            align = 'justify';
          }
          each$a('left,center,right,justify'.split(','), function (name) {
            if (align !== name) {
              formatter.remove('align' + name);
            }
          });
          if (align !== 'none') {
            toggleFormat('align' + align);
          }
        },
        'InsertUnorderedList,InsertOrderedList': function (command) {
          var listElm, listParent;
          execNativeCommand(command);
          listElm = dom.getParent(selection.getNode(), 'ol,ul');
          if (listElm) {
            listParent = listElm.parentNode;
            if (/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) {
              storeSelection();
              dom.split(listParent, listElm);
              restoreSelection();
            }
          }
        },
        'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
          toggleFormat(command);
        },
        'ForeColor,HiliteColor': function (command, ui, value) {
          toggleFormat(command, value);
        },
        'FontName': function (command, ui, value) {
          fontNameAction(editor, value);
        },
        'FontSize': function (command, ui, value) {
          fontSizeAction(editor, value);
        },
        'RemoveFormat': function (command) {
          formatter.remove(command);
        },
        'mceBlockQuote': function () {
          toggleFormat('blockquote');
        },
        'FormatBlock': function (command, ui, value) {
          return toggleFormat(value || 'p');
        },
        'mceCleanup': function () {
          var bookmark = selection.getBookmark();
          editor.setContent(editor.getContent());
          selection.moveToBookmark(bookmark);
        },
        'mceRemoveNode': function (command, ui, value) {
          var node = value || selection.getNode();
          if (node !== editor.getBody()) {
            storeSelection();
            editor.dom.remove(node, true);
            restoreSelection();
          }
        },
        'mceSelectNodeDepth': function (command, ui, value) {
          var counter = 0;
          dom.getParent(selection.getNode(), function (node) {
            if (node.nodeType === 1 && counter++ === value) {
              selection.select(node);
              return false;
            }
          }, editor.getBody());
        },
        'mceSelectNode': function (command, ui, value) {
          selection.select(value);
        },
        'mceInsertContent': function (command, ui, value) {
          InsertContent.insertAtCaret(editor, value);
        },
        'mceInsertRawHTML': function (command, ui, value) {
          selection.setContent('tiny_mce_marker');
          var content = editor.getContent();
          editor.setContent(content.replace(/tiny_mce_marker/g, function () {
            return value;
          }));
        },
        'mceToggleFormat': function (command, ui, value) {
          toggleFormat(value);
        },
        'mceSetContent': function (command, ui, value) {
          editor.setContent(value);
        },
        'Indent,Outdent': function (command) {
          handle(editor, command);
        },
        'mceRepaint': function () {
        },
        'InsertHorizontalRule': function () {
          editor.execCommand('mceInsertContent', false, '<hr />');
        },
        'mceToggleVisualAid': function () {
          editor.hasVisual = !editor.hasVisual;
          editor.addVisual();
        },
        'mceReplaceContent': function (command, ui, value) {
          editor.execCommand('mceInsertContent', false, value.replace(/\{\$selection\}/g, selection.getContent({ format: 'text' })));
        },
        'mceInsertLink': function (command, ui, value) {
          var anchor;
          if (typeof value === 'string') {
            value = { href: value };
          }
          anchor = dom.getParent(selection.getNode(), 'a');
          value.href = value.href.replace(' ', '%20');
          if (!anchor || !value.href) {
            formatter.remove('link');
          }
          if (value.href) {
            formatter.apply('link', value, anchor);
          }
        },
        'selectAll': function () {
          var editingHost = dom.getParent(selection.getStart(), NodeType.isContentEditableTrue);
          if (editingHost) {
            var rng = dom.createRng();
            rng.selectNodeContents(editingHost);
            selection.setRng(rng);
          }
        },
        'delete': function () {
          DeleteCommands.deleteCommand(editor);
        },
        'forwardDelete': function () {
          DeleteCommands.forwardDeleteCommand(editor);
        },
        'mceNewDocument': function () {
          editor.setContent('');
        },
        'InsertLineBreak': function (command, ui, value) {
          InsertBr.insert(editor, value);
          return true;
        }
      });
      var alignStates = function (name) {
        return function () {
          var nodes = selection.isCollapsed() ? [dom.getParent(selection.getNode(), dom.isBlock)] : selection.getSelectedBlocks();
          var matches = map$3(nodes, function (node) {
            return !!formatter.matchNode(node, name);
          });
          return inArray$2(matches, true) !== -1;
        };
      };
      addCommands({
        'JustifyLeft': alignStates('alignleft'),
        'JustifyCenter': alignStates('aligncenter'),
        'JustifyRight': alignStates('alignright'),
        'JustifyFull': alignStates('alignjustify'),
        'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
          return isFormatMatch(command);
        },
        'mceBlockQuote': function () {
          return isFormatMatch('blockquote');
        },
        'Outdent': function () {
          var node;
          if (settings.inline_styles) {
            if ((node = dom.getParent(selection.getStart(), dom.isBlock)) && parseInt(node.style.paddingLeft, 10) > 0) {
              return true;
            }
            if ((node = dom.getParent(selection.getEnd(), dom.isBlock)) && parseInt(node.style.paddingLeft, 10) > 0) {
              return true;
            }
          }
          return queryCommandState('InsertUnorderedList') || queryCommandState('InsertOrderedList') || !settings.inline_styles && !!dom.getParent(selection.getNode(), 'BLOCKQUOTE');
        },
        'InsertUnorderedList,InsertOrderedList': function (command) {
          var list = dom.getParent(selection.getNode(), 'ul,ol');
          return list && (command === 'insertunorderedlist' && list.tagName === 'UL' || command === 'insertorderedlist' && list.tagName === 'OL');
        }
      }, 'state');
      addCommands({
        Undo: function () {
          editor.undoManager.undo();
        },
        Redo: function () {
          editor.undoManager.redo();
        }
      });
      addQueryValueHandler('FontName', function () {
        return fontNameQuery(editor);
      }, this);
      addQueryValueHandler('FontSize', function () {
        return fontSizeQuery(editor);
      }, this);
    }

    var nativeEvents = Tools.makeMap('focus blur focusin focusout click dblclick mousedown mouseup mousemove mouseover beforepaste paste cut copy selectionchange ' + 'mouseout mouseenter mouseleave wheel keydown keypress keyup input contextmenu dragstart dragend dragover ' + 'draggesture dragdrop drop drag submit ' + 'compositionstart compositionend compositionupdate touchstart touchmove touchend', ' ');
    var Dispatcher = function (settings) {
      var self = this;
      var scope, bindings = {}, toggleEvent;
      var returnFalse = function () {
        return false;
      };
      var returnTrue = function () {
        return true;
      };
      settings = settings || {};
      scope = settings.scope || self;
      toggleEvent = settings.toggleEvent || returnFalse;
      var fire = function (name, args) {
        var handlers, i, l, callback;
        name = name.toLowerCase();
        args = args || {};
        args.type = name;
        if (!args.target) {
          args.target = scope;
        }
        if (!args.preventDefault) {
          args.preventDefault = function () {
            args.isDefaultPrevented = returnTrue;
          };
          args.stopPropagation = function () {
            args.isPropagationStopped = returnTrue;
          };
          args.stopImmediatePropagation = function () {
            args.isImmediatePropagationStopped = returnTrue;
          };
          args.isDefaultPrevented = returnFalse;
          args.isPropagationStopped = returnFalse;
          args.isImmediatePropagationStopped = returnFalse;
        }
        if (settings.beforeFire) {
          settings.beforeFire(args);
        }
        handlers = bindings[name];
        if (handlers) {
          for (i = 0, l = handlers.length; i < l; i++) {
            callback = handlers[i];
            if (callback.once) {
              off(name, callback.func);
            }
            if (args.isImmediatePropagationStopped()) {
              args.stopPropagation();
              return args;
            }
            if (callback.func.call(scope, args) === false) {
              args.preventDefault();
              return args;
            }
          }
        }
        return args;
      };
      var on = function (name, callback, prepend, extra) {
        var handlers, names, i;
        if (callback === false) {
          callback = returnFalse;
        }
        if (callback) {
          callback = { func: callback };
          if (extra) {
            Tools.extend(callback, extra);
          }
          names = name.toLowerCase().split(' ');
          i = names.length;
          while (i--) {
            name = names[i];
            handlers = bindings[name];
            if (!handlers) {
              handlers = bindings[name] = [];
              toggleEvent(name, true);
            }
            if (prepend) {
              handlers.unshift(callback);
            } else {
              handlers.push(callback);
            }
          }
        }
        return self;
      };
      var off = function (name, callback) {
        var i, handlers, bindingName, names, hi;
        if (name) {
          names = name.toLowerCase().split(' ');
          i = names.length;
          while (i--) {
            name = names[i];
            handlers = bindings[name];
            if (!name) {
              for (bindingName in bindings) {
                toggleEvent(bindingName, false);
                delete bindings[bindingName];
              }
              return self;
            }
            if (handlers) {
              if (!callback) {
                handlers.length = 0;
              } else {
                hi = handlers.length;
                while (hi--) {
                  if (handlers[hi].func === callback) {
                    handlers = handlers.slice(0, hi).concat(handlers.slice(hi + 1));
                    bindings[name] = handlers;
                  }
                }
              }
              if (!handlers.length) {
                toggleEvent(name, false);
                delete bindings[name];
              }
            }
          }
        } else {
          for (name in bindings) {
            toggleEvent(name, false);
          }
          bindings = {};
        }
        return self;
      };
      var once = function (name, callback, prepend) {
        return on(name, callback, prepend, { once: true });
      };
      var has = function (name) {
        name = name.toLowerCase();
        return !(!bindings[name] || bindings[name].length === 0);
      };
      self.fire = fire;
      self.on = on;
      self.off = off;
      self.once = once;
      self.has = has;
    };
    Dispatcher.isNative = function (name) {
      return !!nativeEvents[name.toLowerCase()];
    };

    var getEventDispatcher = function (obj) {
      if (!obj._eventDispatcher) {
        obj._eventDispatcher = new Dispatcher({
          scope: obj,
          toggleEvent: function (name, state) {
            if (Dispatcher.isNative(name) && obj.toggleNativeEvent) {
              obj.toggleNativeEvent(name, state);
            }
          }
        });
      }
      return obj._eventDispatcher;
    };
    var Observable = {
      fire: function (name, args, bubble) {
        var self = this;
        if (self.removed && name !== 'remove') {
          return args;
        }
        args = getEventDispatcher(self).fire(name, args, bubble);
        if (bubble !== false && self.parent) {
          var parent = self.parent();
          while (parent && !args.isPropagationStopped()) {
            parent.fire(name, args, false);
            parent = parent.parent();
          }
        }
        return args;
      },
      on: function (name, callback, prepend) {
        return getEventDispatcher(this).on(name, callback, prepend);
      },
      off: function (name, callback) {
        return getEventDispatcher(this).off(name, callback);
      },
      once: function (name, callback) {
        return getEventDispatcher(this).once(name, callback);
      },
      hasEventListeners: function (name) {
        return getEventDispatcher(this).has(name);
      }
    };

    var firePreProcess = function (editor, args) {
      return editor.fire('PreProcess', args);
    };
    var firePostProcess = function (editor, args) {
      return editor.fire('PostProcess', args);
    };
    var fireRemove = function (editor) {
      return editor.fire('remove');
    };
    var fireSwitchMode = function (editor, mode) {
      return editor.fire('SwitchMode', { mode: mode });
    };
    var fireObjectResizeStart = function (editor, target, width, height) {
      editor.fire('ObjectResizeStart', {
        target: target,
        width: width,
        height: height
      });
    };
    var fireObjectResized = function (editor, target, width, height) {
      editor.fire('ObjectResized', {
        target: target,
        width: width,
        height: height
      });
    };
    var Events = {
      firePreProcess: firePreProcess,
      firePostProcess: firePostProcess,
      fireRemove: fireRemove,
      fireSwitchMode: fireSwitchMode,
      fireObjectResizeStart: fireObjectResizeStart,
      fireObjectResized: fireObjectResized
    };

    var setEditorCommandState = function (editor, cmd, state) {
      try {
        editor.getDoc().execCommand(cmd, false, state);
      } catch (ex) {
      }
    };
    var toggleClass = function (elm, cls, state) {
      if (has$2(elm, cls) && state === false) {
        remove$5(elm, cls);
      } else if (state) {
        add$2(elm, cls);
      }
    };
    var toggleReadOnly = function (editor, state) {
      toggleClass(Element$$1.fromDom(editor.getBody()), 'mce-content-readonly', state);
      if (state) {
        editor.selection.controlSelection.hideResizeRect();
        editor.readonly = true;
        editor.getBody().contentEditable = 'false';
      } else {
        editor.readonly = false;
        editor.getBody().contentEditable = 'true';
        setEditorCommandState(editor, 'StyleWithCSS', false);
        setEditorCommandState(editor, 'enableInlineTableEditing', false);
        setEditorCommandState(editor, 'enableObjectResizing', false);
        editor.focus();
        editor.nodeChanged();
      }
    };
    var setMode = function (editor, mode) {
      if (mode === getMode(editor)) {
        return;
      }
      if (editor.initialized) {
        toggleReadOnly(editor, mode === 'readonly');
      } else {
        editor.on('init', function () {
          toggleReadOnly(editor, mode === 'readonly');
        });
      }
      Events.fireSwitchMode(editor, mode);
    };
    var getMode = function (editor) {
      return editor.readonly ? 'readonly' : 'design';
    };
    var isReadOnly = function (editor) {
      return editor.readonly === true;
    };

    var DOM$1 = DOMUtils$1.DOM;
    var customEventRootDelegates;
    var getEventTarget = function (editor, eventName) {
      if (eventName === 'selectionchange') {
        return editor.getDoc();
      }
      if (!editor.inline && /^mouse|touch|click|contextmenu|drop|dragover|dragend/.test(eventName)) {
        return editor.getDoc().documentElement;
      }
      if (editor.settings.event_root) {
        if (!editor.eventRoot) {
          editor.eventRoot = DOM$1.select(editor.settings.event_root)[0];
        }
        return editor.eventRoot;
      }
      return editor.getBody();
    };
    var isListening = function (editor) {
      return !editor.hidden && !editor.readonly;
    };
    var fireEvent = function (editor, eventName, e) {
      if (isListening(editor)) {
        editor.fire(eventName, e);
      } else if (isReadOnly(editor)) {
        e.preventDefault();
      }
    };
    var bindEventDelegate = function (editor, eventName) {
      var eventRootElm, delegate;
      if (!editor.delegates) {
        editor.delegates = {};
      }
      if (editor.delegates[eventName] || editor.removed) {
        return;
      }
      eventRootElm = getEventTarget(editor, eventName);
      if (editor.settings.event_root) {
        if (!customEventRootDelegates) {
          customEventRootDelegates = {};
          editor.editorManager.on('removeEditor', function () {
            var name;
            if (!editor.editorManager.activeEditor) {
              if (customEventRootDelegates) {
                for (name in customEventRootDelegates) {
                  editor.dom.unbind(getEventTarget(editor, name));
                }
                customEventRootDelegates = null;
              }
            }
          });
        }
        if (customEventRootDelegates[eventName]) {
          return;
        }
        delegate = function (e) {
          var target = e.target;
          var editors = editor.editorManager.get();
          var i = editors.length;
          while (i--) {
            var body = editors[i].getBody();
            if (body === target || DOM$1.isChildOf(target, body)) {
              fireEvent(editors[i], eventName, e);
            }
          }
        };
        customEventRootDelegates[eventName] = delegate;
        DOM$1.bind(eventRootElm, eventName, delegate);
      } else {
        delegate = function (e) {
          fireEvent(editor, eventName, e);
        };
        DOM$1.bind(eventRootElm, eventName, delegate);
        editor.delegates[eventName] = delegate;
      }
    };
    var EditorObservable = {
      bindPendingEventDelegates: function () {
        var self = this;
        Tools.each(self._pendingNativeEvents, function (name) {
          bindEventDelegate(self, name);
        });
      },
      toggleNativeEvent: function (name, state) {
        var self = this;
        if (name === 'focus' || name === 'blur') {
          return;
        }
        if (state) {
          if (self.initialized) {
            bindEventDelegate(self, name);
          } else {
            if (!self._pendingNativeEvents) {
              self._pendingNativeEvents = [name];
            } else {
              self._pendingNativeEvents.push(name);
            }
          }
        } else if (self.initialized) {
          self.dom.unbind(getEventTarget(self, name), name, self.delegates[name]);
          delete self.delegates[name];
        }
      },
      unbindAllNativeEvents: function () {
        var self = this;
        var body = self.getBody();
        var dom = self.dom;
        var name;
        if (self.delegates) {
          for (name in self.delegates) {
            self.dom.unbind(getEventTarget(self, name), name, self.delegates[name]);
          }
          delete self.delegates;
        }
        if (!self.inline && body && dom) {
          body.onload = null;
          dom.unbind(self.getWin());
          dom.unbind(self.getDoc());
        }
        if (dom) {
          dom.unbind(body);
          dom.unbind(self.getContainer());
        }
      }
    };
    EditorObservable = Tools.extend({}, Observable, EditorObservable);
    var EditorObservable$1 = EditorObservable;

    var each$b = Tools.each, explode$2 = Tools.explode;
    var keyCodeLookup = {
      f9: 120,
      f10: 121,
      f11: 122
    };
    var modifierNames = Tools.makeMap('alt,ctrl,shift,meta,access');
    function Shortcuts (editor) {
      var self = this;
      var shortcuts = {};
      var pendingPatterns = [];
      var parseShortcut = function (pattern) {
        var id, key;
        var shortcut = {};
        each$b(explode$2(pattern, '+'), function (value) {
          if (value in modifierNames) {
            shortcut[value] = true;
          } else {
            if (/^[0-9]{2,}$/.test(value)) {
              shortcut.keyCode = parseInt(value, 10);
            } else {
              shortcut.charCode = value.charCodeAt(0);
              shortcut.keyCode = keyCodeLookup[value] || value.toUpperCase().charCodeAt(0);
            }
          }
        });
        id = [shortcut.keyCode];
        for (key in modifierNames) {
          if (shortcut[key]) {
            id.push(key);
          } else {
            shortcut[key] = false;
          }
        }
        shortcut.id = id.join(',');
        if (shortcut.access) {
          shortcut.alt = true;
          if (Env.mac) {
            shortcut.ctrl = true;
          } else {
            shortcut.shift = true;
          }
        }
        if (shortcut.meta) {
          if (Env.mac) {
            shortcut.meta = true;
          } else {
            shortcut.ctrl = true;
            shortcut.meta = false;
          }
        }
        return shortcut;
      };
      var createShortcut = function (pattern, desc, cmdFunc, scope) {
        var shortcuts;
        shortcuts = Tools.map(explode$2(pattern, '>'), parseShortcut);
        shortcuts[shortcuts.length - 1] = Tools.extend(shortcuts[shortcuts.length - 1], {
          func: cmdFunc,
          scope: scope || editor
        });
        return Tools.extend(shortcuts[0], {
          desc: editor.translate(desc),
          subpatterns: shortcuts.slice(1)
        });
      };
      var hasModifier = function (e) {
        return e.altKey || e.ctrlKey || e.metaKey;
      };
      var isFunctionKey = function (e) {
        return e.type === 'keydown' && e.keyCode >= 112 && e.keyCode <= 123;
      };
      var matchShortcut = function (e, shortcut) {
        if (!shortcut) {
          return false;
        }
        if (shortcut.ctrl !== e.ctrlKey || shortcut.meta !== e.metaKey) {
          return false;
        }
        if (shortcut.alt !== e.altKey || shortcut.shift !== e.shiftKey) {
          return false;
        }
        if (e.keyCode === shortcut.keyCode || e.charCode && e.charCode === shortcut.charCode) {
          e.preventDefault();
          return true;
        }
        return false;
      };
      var executeShortcutAction = function (shortcut) {
        return shortcut.func ? shortcut.func.call(shortcut.scope) : null;
      };
      editor.on('keyup keypress keydown', function (e) {
        if ((hasModifier(e) || isFunctionKey(e)) && !e.isDefaultPrevented()) {
          each$b(shortcuts, function (shortcut) {
            if (matchShortcut(e, shortcut)) {
              pendingPatterns = shortcut.subpatterns.slice(0);
              if (e.type === 'keydown') {
                executeShortcutAction(shortcut);
              }
              return true;
            }
          });
          if (matchShortcut(e, pendingPatterns[0])) {
            if (pendingPatterns.length === 1) {
              if (e.type === 'keydown') {
                executeShortcutAction(pendingPatterns[0]);
              }
            }
            pendingPatterns.shift();
          }
        }
      });
      self.add = function (pattern, desc, cmdFunc, scope) {
        var cmd;
        cmd = cmdFunc;
        if (typeof cmdFunc === 'string') {
          cmdFunc = function () {
            editor.execCommand(cmd, false, null);
          };
        } else if (Tools.isArray(cmd)) {
          cmdFunc = function () {
            editor.execCommand(cmd[0], cmd[1], cmd[2]);
          };
        }
        each$b(explode$2(Tools.trim(pattern.toLowerCase())), function (pattern) {
          var shortcut = createShortcut(pattern, desc, cmdFunc, scope);
          shortcuts[shortcut.id] = shortcut;
        });
        return true;
      };
      self.remove = function (pattern) {
        var shortcut = createShortcut(pattern);
        if (shortcuts[shortcut.id]) {
          delete shortcuts[shortcut.id];
          return true;
        }
        return false;
      };
    }

    var hasFocus = function (element) {
      var doc = owner(element).dom();
      return element.dom() === doc.activeElement;
    };
    var active = function (_doc) {
      var doc = _doc !== undefined ? _doc.dom() : document;
      return Option.from(doc.activeElement).map(Element$$1.fromDom);
    };
    var search = function (element) {
      return active(owner(element)).filter(function (e) {
        return element.dom().contains(e.dom());
      });
    };

    var getContentEditableHost = function (editor, node) {
      return editor.dom.getParent(node, function (node) {
        return editor.dom.getContentEditable(node) === 'true';
      });
    };
    var getCollapsedNode = function (rng) {
      return rng.collapsed ? Option.from(getNode(rng.startContainer, rng.startOffset)).map(Element$$1.fromDom) : Option.none();
    };
    var getFocusInElement = function (root, rng) {
      return getCollapsedNode(rng).bind(function (node) {
        if (isTableSection(node)) {
          return Option.some(node);
        } else if (contains$3(root, node) === false) {
          return Option.some(root);
        } else {
          return Option.none();
        }
      });
    };
    var normalizeSelection = function (editor, rng) {
      getFocusInElement(Element$$1.fromDom(editor.getBody()), rng).bind(function (elm) {
        return CaretFinder.firstPositionIn(elm.dom());
      }).fold(function () {
        editor.selection.normalize();
        return;
      }, function (caretPos) {
        return editor.selection.setRng(caretPos.toRange());
      });
    };
    var focusBody = function (body) {
      if (body.setActive) {
        try {
          body.setActive();
        } catch (ex) {
          body.focus();
        }
      } else {
        body.focus();
      }
    };
    var hasElementFocus = function (elm) {
      return hasFocus(elm) || search(elm).isSome();
    };
    var hasIframeFocus = function (editor) {
      return editor.iframeElement && hasFocus(Element$$1.fromDom(editor.iframeElement));
    };
    var hasInlineFocus = function (editor) {
      var rawBody = editor.getBody();
      return rawBody && hasElementFocus(Element$$1.fromDom(rawBody));
    };
    var hasFocus$1 = function (editor) {
      return editor.inline ? hasInlineFocus(editor) : hasIframeFocus(editor);
    };
    var focusEditor = function (editor) {
      var selection = editor.selection, contentEditable = editor.settings.content_editable;
      var body = editor.getBody();
      var rng = selection.getRng();
      editor.quirks.refreshContentEditable();
      var contentEditableHost = getContentEditableHost(editor, selection.getNode());
      if (editor.$.contains(body, contentEditableHost)) {
        focusBody(contentEditableHost);
        normalizeSelection(editor, rng);
        activateEditor(editor);
        return;
      }
      if (editor.bookmark !== undefined && hasFocus$1(editor) === false) {
        SelectionBookmark.getRng(editor).each(function (bookmarkRng) {
          editor.selection.setRng(bookmarkRng);
          rng = bookmarkRng;
        });
      }
      if (!contentEditable) {
        if (!Env.opera) {
          focusBody(body);
        }
        editor.getWin().focus();
      }
      if (Env.gecko || contentEditable) {
        focusBody(body);
        normalizeSelection(editor, rng);
      }
      activateEditor(editor);
    };
    var activateEditor = function (editor) {
      return editor.editorManager.setActive(editor);
    };
    var focus$1 = function (editor, skipFocus) {
      if (editor.removed) {
        return;
      }
      skipFocus ? activateEditor(editor) : focusEditor(editor);
    };
    var EditorFocus = {
      focus: focus$1,
      hasFocus: hasFocus$1
    };

    var getProp = function (propName, elm) {
      var rawElm = elm.dom();
      return rawElm[propName];
    };
    var getComputedSizeProp = function (propName, elm) {
      return parseInt(get$2(elm, propName), 10);
    };
    var getClientWidth = curry(getProp, 'clientWidth');
    var getClientHeight = curry(getProp, 'clientHeight');
    var getMarginTop = curry(getComputedSizeProp, 'margin-top');
    var getMarginLeft = curry(getComputedSizeProp, 'margin-left');
    var getBoundingClientRect$1 = function (elm) {
      return elm.dom().getBoundingClientRect();
    };
    var isInsideElementContentArea = function (bodyElm, clientX, clientY) {
      var clientWidth = getClientWidth(bodyElm);
      var clientHeight = getClientHeight(bodyElm);
      return clientX >= 0 && clientY >= 0 && clientX <= clientWidth && clientY <= clientHeight;
    };
    var transpose = function (inline, elm, clientX, clientY) {
      var clientRect = getBoundingClientRect$1(elm);
      var deltaX = inline ? clientRect.left + elm.dom().clientLeft + getMarginLeft(elm) : 0;
      var deltaY = inline ? clientRect.top + elm.dom().clientTop + getMarginTop(elm) : 0;
      var x = clientX - deltaX;
      var y = clientY - deltaY;
      return {
        x: x,
        y: y
      };
    };
    var isXYInContentArea = function (editor, clientX, clientY) {
      var bodyElm = Element$$1.fromDom(editor.getBody());
      var targetElm = editor.inline ? bodyElm : documentElement(bodyElm);
      var transposedPoint = transpose(editor.inline, targetElm, clientX, clientY);
      return isInsideElementContentArea(targetElm, transposedPoint.x, transposedPoint.y);
    };
    var fromDomSafe = function (node) {
      return Option.from(node).map(Element$$1.fromDom);
    };
    var isEditorAttachedToDom = function (editor) {
      var rawContainer = editor.inline ? editor.getBody() : editor.getContentAreaContainer();
      return fromDomSafe(rawContainer).map(function (container) {
        return contains$3(owner(container), container);
      }).getOr(false);
    };
    var EditorView = {
      isXYInContentArea: isXYInContentArea,
      isEditorAttachedToDom: isEditorAttachedToDom
    };

    function NotificationManagerImpl () {
      var unimplemented = function () {
        throw new Error('Theme did not provide a NotificationManager implementation.');
      };
      return {
        open: unimplemented,
        close: unimplemented,
        reposition: unimplemented,
        getArgs: unimplemented
      };
    }

    function NotificationManager (editor) {
      var notifications = [];
      var getImplementation = function () {
        var theme = editor.theme;
        return theme && theme.getNotificationManagerImpl ? theme.getNotificationManagerImpl() : NotificationManagerImpl();
      };
      var getTopNotification = function () {
        return Option.from(notifications[0]);
      };
      var isEqual = function (a, b) {
        return a.type === b.type && a.text === b.text && !a.progressBar && !a.timeout && !b.progressBar && !b.timeout;
      };
      var reposition = function () {
        if (notifications.length > 0) {
          getImplementation().reposition(notifications);
        }
      };
      var addNotification = function (notification) {
        notifications.push(notification);
      };
      var closeNotification = function (notification) {
        findIndex(notifications, function (otherNotification) {
          return otherNotification === notification;
        }).each(function (index) {
          notifications.splice(index, 1);
        });
      };
      var open = function (args) {
        if (editor.removed || !EditorView.isEditorAttachedToDom(editor)) {
          return;
        }
        return find(notifications, function (notification) {
          return isEqual(getImplementation().getArgs(notification), args);
        }).getOrThunk(function () {
          editor.editorManager.setActive(editor);
          var notification = getImplementation().open(args, function () {
            closeNotification(notification);
            reposition();
          });
          addNotification(notification);
          reposition();
          return notification;
        });
      };
      var close = function () {
        getTopNotification().each(function (notification) {
          getImplementation().close(notification);
          closeNotification(notification);
          reposition();
        });
      };
      var getNotifications = function () {
        return notifications;
      };
      var registerEvents = function (editor) {
        editor.on('SkinLoaded', function () {
          var serviceMessage = editor.settings.service_message;
          if (serviceMessage) {
            open({
              text: serviceMessage,
              type: 'warning',
              timeout: 0,
              icon: ''
            });
          }
        });
        editor.on('ResizeEditor ResizeWindow', function () {
          Delay.requestAnimationFrame(reposition);
        });
        editor.on('remove', function () {
          each(notifications.slice(), function (notification) {
            getImplementation().close(notification);
          });
        });
      };
      registerEvents(editor);
      return {
        open: open,
        close: close,
        getNotifications: getNotifications
      };
    }

    function WindowManagerImpl () {
      var unimplemented = function () {
        throw new Error('Theme did not provide a WindowManager implementation.');
      };
      return {
        open: unimplemented,
        alert: unimplemented,
        confirm: unimplemented,
        close: unimplemented,
        getParams: unimplemented,
        setParams: unimplemented
      };
    }

    function WindowManager (editor) {
      var windows = [];
      var getImplementation = function () {
        var theme = editor.theme;
        return theme && theme.getWindowManagerImpl ? theme.getWindowManagerImpl() : WindowManagerImpl();
      };
      var funcBind = function (scope, f) {
        return function () {
          return f ? f.apply(scope, arguments) : undefined;
        };
      };
      var fireOpenEvent = function (win) {
        editor.fire('OpenWindow', { win: win });
      };
      var fireCloseEvent = function (win) {
        editor.fire('CloseWindow', { win: win });
      };
      var addWindow = function (win) {
        windows.push(win);
        fireOpenEvent(win);
      };
      var closeWindow = function (win) {
        findIndex(windows, function (otherWindow) {
          return otherWindow === win;
        }).each(function (index) {
          windows.splice(index, 1);
          fireCloseEvent(win);
          if (windows.length === 0) {
            editor.focus();
          }
        });
      };
      var getTopWindow = function () {
        return Option.from(windows[windows.length - 1]);
      };
      var open = function (args, params) {
        editor.editorManager.setActive(editor);
        SelectionBookmark.store(editor);
        var win = getImplementation().open(args, params, closeWindow);
        addWindow(win);
        return win;
      };
      var alert = function (message, callback, scope) {
        var win = getImplementation().alert(message, funcBind(scope ? scope : this, callback), closeWindow);
        addWindow(win);
      };
      var confirm = function (message, callback, scope) {
        var win = getImplementation().confirm(message, funcBind(scope ? scope : this, callback), closeWindow);
        addWindow(win);
      };
      var close = function () {
        getTopWindow().each(function (win) {
          getImplementation().close(win);
          closeWindow(win);
        });
      };
      var getParams = function () {
        return getTopWindow().map(getImplementation().getParams).getOr(null);
      };
      var setParams = function (params) {
        getTopWindow().each(function (win) {
          getImplementation().setParams(win, params);
        });
      };
      var getWindows = function () {
        return windows;
      };
      editor.on('remove', function () {
        each(windows.slice(0), function (win) {
          getImplementation().close(win);
        });
      });
      return {
        windows: windows,
        open: open,
        alert: alert,
        confirm: confirm,
        close: close,
        getParams: getParams,
        setParams: setParams,
        getWindows: getWindows
      };
    }

    var PluginManager = AddOnManager.PluginManager;
    var resolvePluginName = function (targetUrl, suffix) {
      for (var name$$1 in PluginManager.urls) {
        var matchUrl = PluginManager.urls[name$$1] + '/plugin' + suffix + '.js';
        if (matchUrl === targetUrl) {
          return name$$1;
        }
      }
      return null;
    };
    var pluginUrlToMessage = function (editor, url) {
      var plugin = resolvePluginName(url, editor.suffix);
      return plugin ? 'Failed to load plugin: ' + plugin + ' from url ' + url : 'Failed to load plugin url: ' + url;
    };
    var displayNotification = function (editor, message) {
      editor.notificationManager.open({
        type: 'error',
        text: message
      });
    };
    var displayError = function (editor, message) {
      if (editor._skinLoaded) {
        displayNotification(editor, message);
      } else {
        editor.on('SkinLoaded', function () {
          displayNotification(editor, message);
        });
      }
    };
    var uploadError = function (editor, message) {
      displayError(editor, 'Failed to upload image: ' + message);
    };
    var pluginLoadError = function (editor, url) {
      displayError(editor, pluginUrlToMessage(editor, url));
    };
    var initError = function (message) {
      var x = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
      }
      var console$$1 = window.console;
      if (console$$1) {
        if (console$$1.error) {
          console$$1.error.apply(console$$1, arguments);
        } else {
          console$$1.log.apply(console$$1, arguments);
        }
      }
    };
    var ErrorReporter = {
      pluginLoadError: pluginLoadError,
      uploadError: uploadError,
      displayError: displayError,
      initError: initError
    };

    var PluginManager$1 = AddOnManager.PluginManager;

    var ThemeManager = AddOnManager.ThemeManager;

    function XMLHttpRequest () {
      var f = Global$1.getOrDie('XMLHttpRequest');
      return new f();
    }

    function Uploader (uploadStatus, settings) {
      var pendingPromises = {};
      var pathJoin = function (path1, path2) {
        if (path1) {
          return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
        }
        return path2;
      };
      var defaultHandler = function (blobInfo, success, failure, progress) {
        var xhr, formData;
        xhr = XMLHttpRequest();
        xhr.open('POST', settings.url);
        xhr.withCredentials = settings.credentials;
        xhr.upload.onprogress = function (e) {
          progress(e.loaded / e.total * 100);
        };
        xhr.onerror = function () {
          failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };
        xhr.onload = function () {
          var json;
          if (xhr.status < 200 || xhr.status >= 300) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }
          json = JSON.parse(xhr.responseText);
          if (!json || typeof json.location !== 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }
          success(pathJoin(settings.basePath, json.location));
        };
        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      };
      var noUpload = function () {
        return new promiseObj(function (resolve) {
          resolve([]);
        });
      };
      var handlerSuccess = function (blobInfo, url) {
        return {
          url: url,
          blobInfo: blobInfo,
          status: true
        };
      };
      var handlerFailure = function (blobInfo, error) {
        return {
          url: '',
          blobInfo: blobInfo,
          status: false,
          error: error
        };
      };
      var resolvePending = function (blobUri, result) {
        Tools.each(pendingPromises[blobUri], function (resolve) {
          resolve(result);
        });
        delete pendingPromises[blobUri];
      };
      var uploadBlobInfo = function (blobInfo, handler, openNotification) {
        uploadStatus.markPending(blobInfo.blobUri());
        return new promiseObj(function (resolve) {
          var notification, progress;
          var noop = function () {
          };
          try {
            var closeNotification_1 = function () {
              if (notification) {
                notification.close();
                progress = noop;
              }
            };
            var success = function (url) {
              closeNotification_1();
              uploadStatus.markUploaded(blobInfo.blobUri(), url);
              resolvePending(blobInfo.blobUri(), handlerSuccess(blobInfo, url));
              resolve(handlerSuccess(blobInfo, url));
            };
            var failure = function (error) {
              closeNotification_1();
              uploadStatus.removeFailed(blobInfo.blobUri());
              resolvePending(blobInfo.blobUri(), handlerFailure(blobInfo, error));
              resolve(handlerFailure(blobInfo, error));
            };
            progress = function (percent) {
              if (percent < 0 || percent > 100) {
                return;
              }
              if (!notification) {
                notification = openNotification();
              }
              notification.progressBar.value(percent);
            };
            handler(blobInfo, success, failure, progress);
          } catch (ex) {
            resolve(handlerFailure(blobInfo, ex.message));
          }
        });
      };
      var isDefaultHandler = function (handler) {
        return handler === defaultHandler;
      };
      var pendingUploadBlobInfo = function (blobInfo) {
        var blobUri = blobInfo.blobUri();
        return new promiseObj(function (resolve) {
          pendingPromises[blobUri] = pendingPromises[blobUri] || [];
          pendingPromises[blobUri].push(resolve);
        });
      };
      var uploadBlobs = function (blobInfos, openNotification) {
        blobInfos = Tools.grep(blobInfos, function (blobInfo) {
          return !uploadStatus.isUploaded(blobInfo.blobUri());
        });
        return promiseObj.all(Tools.map(blobInfos, function (blobInfo) {
          return uploadStatus.isPending(blobInfo.blobUri()) ? pendingUploadBlobInfo(blobInfo) : uploadBlobInfo(blobInfo, settings.handler, openNotification);
        }));
      };
      var upload = function (blobInfos, openNotification) {
        return !settings.url && isDefaultHandler(settings.handler) ? noUpload() : uploadBlobs(blobInfos, openNotification);
      };
      if (isFunction(settings.handler) === false) {
        settings.handler = defaultHandler;
      }
      return { upload: upload };
    }

    function FileReader () {
      var f = Global$1.getOrDie('FileReader');
      return new f();
    }

    function Uint8Array (arr) {
      var f = Global$1.getOrDie('Uint8Array');
      return new f(arr);
    }

    var requestAnimationFrame$1 = function (callback) {
      var f = Global$1.getOrDie('requestAnimationFrame');
      f(callback);
    };
    var atob = function (base64) {
      var f = Global$1.getOrDie('atob');
      return f(base64);
    };
    var Window = {
      atob: atob,
      requestAnimationFrame: requestAnimationFrame$1
    };

    var blobUriToBlob = function (url) {
      return new promiseObj(function (resolve, reject) {
        var rejectWithError = function () {
          reject('Cannot convert ' + url + ' to Blob. Resource might not exist or is inaccessible.');
        };
        try {
          var xhr = XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'blob';
          xhr.onload = function () {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              rejectWithError();
            }
          };
          xhr.onerror = rejectWithError;
          xhr.send();
        } catch (ex) {
          rejectWithError();
        }
      });
    };
    var parseDataUri = function (uri) {
      var type, matches;
      var uriParts = decodeURIComponent(uri).split(',');
      matches = /data:([^;]+)/.exec(uriParts[0]);
      if (matches) {
        type = matches[1];
      }
      return {
        type: type,
        data: uriParts[1]
      };
    };
    var dataUriToBlob = function (uri) {
      return new promiseObj(function (resolve) {
        var str, arr, i;
        var uriParts = parseDataUri(uri);
        try {
          str = Window.atob(uriParts.data);
        } catch (e) {
          resolve(new Blob([]));
          return;
        }
        arr = Uint8Array(str.length);
        for (i = 0; i < arr.length; i++) {
          arr[i] = str.charCodeAt(i);
        }
        resolve(new Blob([arr], { type: uriParts.type }));
      });
    };
    var uriToBlob = function (url) {
      if (url.indexOf('blob:') === 0) {
        return blobUriToBlob(url);
      }
      if (url.indexOf('data:') === 0) {
        return dataUriToBlob(url);
      }
      return null;
    };
    var blobToDataUri = function (blob) {
      return new promiseObj(function (resolve) {
        var reader = FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    };
    var Conversions = {
      uriToBlob: uriToBlob,
      blobToDataUri: blobToDataUri,
      parseDataUri: parseDataUri
    };

    var count = 0;
    var uniqueId = function (prefix) {
      return (prefix || 'blobid') + count++;
    };
    var imageToBlobInfo = function (blobCache, img, resolve, reject) {
      var base64, blobInfo;
      if (img.src.indexOf('blob:') === 0) {
        blobInfo = blobCache.getByUri(img.src);
        if (blobInfo) {
          resolve({
            image: img,
            blobInfo: blobInfo
          });
        } else {
          Conversions.uriToBlob(img.src).then(function (blob) {
            Conversions.blobToDataUri(blob).then(function (dataUri) {
              base64 = Conversions.parseDataUri(dataUri).data;
              blobInfo = blobCache.create(uniqueId(), blob, base64);
              blobCache.add(blobInfo);
              resolve({
                image: img,
                blobInfo: blobInfo
              });
            });
          }, function (err) {
            reject(err);
          });
        }
        return;
      }
      base64 = Conversions.parseDataUri(img.src).data;
      blobInfo = blobCache.findFirst(function (cachedBlobInfo) {
        return cachedBlobInfo.base64() === base64;
      });
      if (blobInfo) {
        resolve({
          image: img,
          blobInfo: blobInfo
        });
      } else {
        Conversions.uriToBlob(img.src).then(function (blob) {
          blobInfo = blobCache.create(uniqueId(), blob, base64);
          blobCache.add(blobInfo);
          resolve({
            image: img,
            blobInfo: blobInfo
          });
        }, function (err) {
          reject(err);
        });
      }
    };
    var getAllImages = function (elm) {
      return elm ? elm.getElementsByTagName('img') : [];
    };
    function ImageScanner (uploadStatus, blobCache) {
      var cachedPromises = {};
      var findAll = function (elm, predicate) {
        var images;
        if (!predicate) {
          predicate = Fun.constant(true);
        }
        images = Arr.filter(getAllImages(elm), function (img) {
          var src = img.src;
          if (!Env.fileApi) {
            return false;
          }
          if (img.hasAttribute('data-mce-bogus')) {
            return false;
          }
          if (img.hasAttribute('data-mce-placeholder')) {
            return false;
          }
          if (!src || src === Env.transparentSrc) {
            return false;
          }
          if (src.indexOf('blob:') === 0) {
            return !uploadStatus.isUploaded(src) && predicate(img);
          }
          if (src.indexOf('data:') === 0) {
            return predicate(img);
          }
          return false;
        });
        var promises = Arr.map(images, function (img) {
          if (cachedPromises[img.src]) {
            return new promiseObj(function (resolve) {
              cachedPromises[img.src].then(function (imageInfo) {
                if (typeof imageInfo === 'string') {
                  return imageInfo;
                }
                resolve({
                  image: img,
                  blobInfo: imageInfo.blobInfo
                });
              });
            });
          }
          var newPromise = new promiseObj(function (resolve, reject) {
            imageToBlobInfo(blobCache, img, resolve, reject);
          }).then(function (result) {
            delete cachedPromises[result.image.src];
            return result;
          }).catch(function (error) {
            delete cachedPromises[img.src];
            return error;
          });
          cachedPromises[img.src] = newPromise;
          return newPromise;
        });
        return promiseObj.all(promises);
      };
      return { findAll: findAll };
    }

    var count$1 = 0;
    var seed = function () {
      var rnd = function () {
        return Math.round(Math.random() * 4294967295).toString(36);
      };
      var now = new Date().getTime();
      return 's' + now.toString(36) + rnd() + rnd() + rnd();
    };
    var uuid = function (prefix) {
      return prefix + count$1++ + seed();
    };
    var Uuid = { uuid: uuid };

    function BlobCache () {
      var cache = [];
      var constant = Fun.constant;
      var mimeToExt = function (mime) {
        var mimes = {
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/gif': 'gif',
          'image/png': 'png'
        };
        return mimes[mime.toLowerCase()] || 'dat';
      };
      var create = function (o, blob, base64, filename) {
        if (isString(o)) {
          var id = o;
          return toBlobInfo({
            id: id,
            name: filename,
            blob: blob,
            base64: base64
          });
        } else if (isObject(o)) {
          return toBlobInfo(o);
        } else {
          throw new Error('Unknown input type');
        }
      };
      var toBlobInfo = function (o) {
        var id, name;
        if (!o.blob || !o.base64) {
          throw new Error('blob and base64 representations of the image are required for BlobInfo to be created');
        }
        id = o.id || Uuid.uuid('blobid');
        name = o.name || id;
        return {
          id: constant(id),
          name: constant(name),
          filename: constant(name + '.' + mimeToExt(o.blob.type)),
          blob: constant(o.blob),
          base64: constant(o.base64),
          blobUri: constant(o.blobUri || URL.createObjectURL(o.blob)),
          uri: constant(o.uri)
        };
      };
      var add = function (blobInfo) {
        if (!get(blobInfo.id())) {
          cache.push(blobInfo);
        }
      };
      var get = function (id) {
        return findFirst(function (cachedBlobInfo) {
          return cachedBlobInfo.id() === id;
        });
      };
      var findFirst = function (predicate) {
        return Arr.filter(cache, predicate)[0];
      };
      var getByUri = function (blobUri) {
        return findFirst(function (blobInfo) {
          return blobInfo.blobUri() === blobUri;
        });
      };
      var removeByUri = function (blobUri) {
        cache = Arr.filter(cache, function (blobInfo) {
          if (blobInfo.blobUri() === blobUri) {
            URL.revokeObjectURL(blobInfo.blobUri());
            return false;
          }
          return true;
        });
      };
      var destroy = function () {
        Arr.each(cache, function (cachedBlobInfo) {
          URL.revokeObjectURL(cachedBlobInfo.blobUri());
        });
        cache = [];
      };
      return {
        create: create,
        add: add,
        get: get,
        getByUri: getByUri,
        findFirst: findFirst,
        removeByUri: removeByUri,
        destroy: destroy
      };
    }

    function UploadStatus () {
      var PENDING = 1, UPLOADED = 2;
      var blobUriStatuses = {};
      var createStatus = function (status, resultUri) {
        return {
          status: status,
          resultUri: resultUri
        };
      };
      var hasBlobUri = function (blobUri) {
        return blobUri in blobUriStatuses;
      };
      var getResultUri = function (blobUri) {
        var result = blobUriStatuses[blobUri];
        return result ? result.resultUri : null;
      };
      var isPending = function (blobUri) {
        return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === PENDING : false;
      };
      var isUploaded = function (blobUri) {
        return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === UPLOADED : false;
      };
      var markPending = function (blobUri) {
        blobUriStatuses[blobUri] = createStatus(PENDING, null);
      };
      var markUploaded = function (blobUri, resultUri) {
        blobUriStatuses[blobUri] = createStatus(UPLOADED, resultUri);
      };
      var removeFailed = function (blobUri) {
        delete blobUriStatuses[blobUri];
      };
      var destroy = function () {
        blobUriStatuses = {};
      };
      return {
        hasBlobUri: hasBlobUri,
        getResultUri: getResultUri,
        isPending: isPending,
        isUploaded: isUploaded,
        markPending: markPending,
        markUploaded: markUploaded,
        removeFailed: removeFailed,
        destroy: destroy
      };
    }

    function EditorUpload (editor) {
      var blobCache = BlobCache();
      var uploader, imageScanner;
      var uploadStatus = UploadStatus();
      var urlFilters = [];
      var aliveGuard = function (callback) {
        return function (result) {
          if (editor.selection) {
            return callback(result);
          }
          return [];
        };
      };
      var cacheInvalidator = function () {
        return '?' + new Date().getTime();
      };
      var replaceString = function (content, search, replace) {
        var index = 0;
        do {
          index = content.indexOf(search, index);
          if (index !== -1) {
            content = content.substring(0, index) + replace + content.substr(index + search.length);
            index += replace.length - search.length + 1;
          }
        } while (index !== -1);
        return content;
      };
      var replaceImageUrl = function (content, targetUrl, replacementUrl) {
        content = replaceString(content, 'src="' + targetUrl + '"', 'src="' + replacementUrl + '"');
        content = replaceString(content, 'data-mce-src="' + targetUrl + '"', 'data-mce-src="' + replacementUrl + '"');
        return content;
      };
      var replaceUrlInUndoStack = function (targetUrl, replacementUrl) {
        each(editor.undoManager.data, function (level) {
          if (level.type === 'fragmented') {
            level.fragments = map(level.fragments, function (fragment) {
              return replaceImageUrl(fragment, targetUrl, replacementUrl);
            });
          } else {
            level.content = replaceImageUrl(level.content, targetUrl, replacementUrl);
          }
        });
      };
      var openNotification = function () {
        return editor.notificationManager.open({
          text: editor.translate('Image uploading...'),
          type: 'info',
          timeout: -1,
          progressBar: true
        });
      };
      var replaceImageUri = function (image, resultUri) {
        blobCache.removeByUri(image.src);
        replaceUrlInUndoStack(image.src, resultUri);
        editor.$(image).attr({
          'src': Settings.shouldReuseFileName(editor) ? resultUri + cacheInvalidator() : resultUri,
          'data-mce-src': editor.convertURL(resultUri, 'src')
        });
      };
      var uploadImages = function (callback) {
        if (!uploader) {
          uploader = Uploader(uploadStatus, {
            url: Settings.getImageUploadUrl(editor),
            basePath: Settings.getImageUploadBasePath(editor),
            credentials: Settings.getImagesUploadCredentials(editor),
            handler: Settings.getImagesUploadHandler(editor)
          });
        }
        return scanForImages().then(aliveGuard(function (imageInfos) {
          var blobInfos;
          blobInfos = map(imageInfos, function (imageInfo) {
            return imageInfo.blobInfo;
          });
          return uploader.upload(blobInfos, openNotification).then(aliveGuard(function (result) {
            var filteredResult = map(result, function (uploadInfo, index) {
              var image = imageInfos[index].image;
              if (uploadInfo.status && Settings.shouldReplaceBlobUris(editor)) {
                replaceImageUri(image, uploadInfo.url);
              } else if (uploadInfo.error) {
                ErrorReporter.uploadError(editor, uploadInfo.error);
              }
              return {
                element: image,
                status: uploadInfo.status
              };
            });
            if (callback) {
              callback(filteredResult);
            }
            return filteredResult;
          }));
        }));
      };
      var uploadImagesAuto = function (callback) {
        if (Settings.isAutomaticUploadsEnabled(editor)) {
          return uploadImages(callback);
        }
      };
      var isValidDataUriImage = function (imgElm) {
        if (forall(urlFilters, function (filter$$1) {
            return filter$$1(imgElm);
          }) === false) {
          return false;
        }
        if (imgElm.getAttribute('src').indexOf('data:') === 0) {
          var dataImgFilter = Settings.getImagesDataImgFilter(editor);
          return dataImgFilter(imgElm);
        }
        return true;
      };
      var addFilter = function (filter$$1) {
        urlFilters.push(filter$$1);
      };
      var scanForImages = function () {
        if (!imageScanner) {
          imageScanner = ImageScanner(uploadStatus, blobCache);
        }
        return imageScanner.findAll(editor.getBody(), isValidDataUriImage).then(aliveGuard(function (result) {
          result = filter(result, function (resultItem) {
            if (typeof resultItem === 'string') {
              ErrorReporter.displayError(editor, resultItem);
              return false;
            }
            return true;
          });
          each(result, function (resultItem) {
            replaceUrlInUndoStack(resultItem.image.src, resultItem.blobInfo.blobUri());
            resultItem.image.src = resultItem.blobInfo.blobUri();
            resultItem.image.removeAttribute('data-mce-src');
          });
          return result;
        }));
      };
      var destroy = function () {
        blobCache.destroy();
        uploadStatus.destroy();
        imageScanner = uploader = null;
      };
      var replaceBlobUris = function (content) {
        return content.replace(/src="(blob:[^"]+)"/g, function (match, blobUri) {
          var resultUri = uploadStatus.getResultUri(blobUri);
          if (resultUri) {
            return 'src="' + resultUri + '"';
          }
          var blobInfo = blobCache.getByUri(blobUri);
          if (!blobInfo) {
            blobInfo = foldl(editor.editorManager.get(), function (result, editor) {
              return result || editor.editorUpload && editor.editorUpload.blobCache.getByUri(blobUri);
            }, null);
          }
          if (blobInfo) {
            var blob = blobInfo.blob();
            return 'src="data:' + blob.type + ';base64,' + blobInfo.base64() + '"';
          }
          return match;
        });
      };
      editor.on('setContent', function () {
        if (Settings.isAutomaticUploadsEnabled(editor)) {
          uploadImagesAuto();
        } else {
          scanForImages();
        }
      });
      editor.on('RawSaveContent', function (e) {
        e.content = replaceBlobUris(e.content);
      });
      editor.on('getContent', function (e) {
        if (e.source_view || e.format === 'raw') {
          return;
        }
        e.content = replaceBlobUris(e.content);
      });
      editor.on('PostRender', function () {
        editor.parser.addNodeFilter('img', function (images) {
          each(images, function (img) {
            var src = img.attr('src');
            if (blobCache.getByUri(src)) {
              return;
            }
            var resultUri = uploadStatus.getResultUri(src);
            if (resultUri) {
              img.attr('src', resultUri);
            }
          });
        });
      });
      return {
        blobCache: blobCache,
        addFilter: addFilter,
        uploadImages: uploadImages,
        uploadImagesAuto: uploadImagesAuto,
        scanForImages: scanForImages,
        destroy: destroy
      };
    }

    var isBlockElement = function (blockElements, node) {
      return blockElements.hasOwnProperty(node.nodeName);
    };
    var isValidTarget = function (blockElements, node) {
      if (NodeType.isText(node)) {
        return true;
      } else if (NodeType.isElement(node)) {
        return !isBlockElement(blockElements, node) && !Bookmarks.isBookmarkNode(node);
      } else {
        return false;
      }
    };
    var hasBlockParent = function (blockElements, root, node) {
      return exists(Parents.parents(Element$$1.fromDom(node), Element$$1.fromDom(root)), function (elm) {
        return isBlockElement(blockElements, elm.dom());
      });
    };
    var shouldRemoveTextNode = function (blockElements, node) {
      if (NodeType.isText(node)) {
        if (node.nodeValue.length === 0) {
          return true;
        } else if (/^\s+$/.test(node.nodeValue) && (!node.nextSibling || isBlockElement(blockElements, node.nextSibling))) {
          return true;
        }
      }
      return false;
    };
    var addRootBlocks = function (editor) {
      var settings = editor.settings, dom = editor.dom, selection = editor.selection;
      var schema = editor.schema, blockElements = schema.getBlockElements();
      var node = selection.getStart();
      var rootNode = editor.getBody();
      var rng;
      var startContainer, startOffset, endContainer, endOffset, rootBlockNode;
      var tempNode, wrapped, restoreSelection;
      var rootNodeName, forcedRootBlock;
      forcedRootBlock = settings.forced_root_block;
      if (!node || !NodeType.isElement(node) || !forcedRootBlock) {
        return;
      }
      rootNodeName = rootNode.nodeName.toLowerCase();
      if (!schema.isValidChild(rootNodeName, forcedRootBlock.toLowerCase()) || hasBlockParent(blockElements, rootNode, node)) {
        return;
      }
      rng = selection.getRng();
      startContainer = rng.startContainer;
      startOffset = rng.startOffset;
      endContainer = rng.endContainer;
      endOffset = rng.endOffset;
      restoreSelection = EditorFocus.hasFocus(editor);
      node = rootNode.firstChild;
      while (node) {
        if (isValidTarget(blockElements, node)) {
          if (shouldRemoveTextNode(blockElements, node)) {
            tempNode = node;
            node = node.nextSibling;
            dom.remove(tempNode);
            continue;
          }
          if (!rootBlockNode) {
            rootBlockNode = dom.create(forcedRootBlock, editor.settings.forced_root_block_attrs);
            node.parentNode.insertBefore(rootBlockNode, node);
            wrapped = true;
          }
          tempNode = node;
          node = node.nextSibling;
          rootBlockNode.appendChild(tempNode);
        } else {
          rootBlockNode = null;
          node = node.nextSibling;
        }
      }
      if (wrapped && restoreSelection) {
        rng.setStart(startContainer, startOffset);
        rng.setEnd(endContainer, endOffset);
        selection.setRng(rng);
        editor.nodeChanged();
      }
    };
    var setup$2 = function (editor) {
      if (editor.settings.forced_root_block) {
        editor.on('NodeChange', curry(addRootBlocks, editor));
      }
    };
    var ForceBlocks = { setup: setup$2 };

    var getStartNode = function (rng) {
      var sc = rng.startContainer, so = rng.startOffset;
      if (NodeType.isText(sc)) {
        return so === 0 ? Option.some(Element$$1.fromDom(sc)) : Option.none();
      } else {
        return Option.from(sc.childNodes[so]).map(Element$$1.fromDom);
      }
    };
    var getEndNode = function (rng) {
      var ec = rng.endContainer, eo = rng.endOffset;
      if (NodeType.isText(ec)) {
        return eo === ec.data.length ? Option.some(Element$$1.fromDom(ec)) : Option.none();
      } else {
        return Option.from(ec.childNodes[eo - 1]).map(Element$$1.fromDom);
      }
    };
    var getFirstChildren = function (node) {
      return firstChild(node).fold(constant([node]), function (child$$1) {
        return [node].concat(getFirstChildren(child$$1));
      });
    };
    var getLastChildren$1 = function (node) {
      return lastChild(node).fold(constant([node]), function (child$$1) {
        if (name(child$$1) === 'br') {
          return prevSibling(child$$1).map(function (sibling) {
            return [node].concat(getLastChildren$1(sibling));
          }).getOr([]);
        } else {
          return [node].concat(getLastChildren$1(child$$1));
        }
      });
    };
    var hasAllContentsSelected = function (elm, rng) {
      return liftN([
        getStartNode(rng),
        getEndNode(rng)
      ], function (startNode, endNode) {
        var start = find(getFirstChildren(elm), curry(eq, startNode));
        var end = find(getLastChildren$1(elm), curry(eq, endNode));
        return start.isSome() && end.isSome();
      }).getOr(false);
    };
    var moveEndPoint$1 = function (dom, rng, node, start) {
      var root = node, walker = new TreeWalker(node, root);
      var nonEmptyElementsMap = dom.schema.getNonEmptyElements();
      do {
        if (node.nodeType === 3 && Tools.trim(node.nodeValue).length !== 0) {
          if (start) {
            rng.setStart(node, 0);
          } else {
            rng.setEnd(node, node.nodeValue.length);
          }
          return;
        }
        if (nonEmptyElementsMap[node.nodeName] && !/^(TD|TH)$/.test(node.nodeName)) {
          if (start) {
            rng.setStartBefore(node);
          } else {
            if (node.nodeName === 'BR') {
              rng.setEndBefore(node);
            } else {
              rng.setEndAfter(node);
            }
          }
          return;
        }
        if (Env.ie && Env.ie < 11 && dom.isBlock(node) && dom.isEmpty(node)) {
          if (start) {
            rng.setStart(node, 0);
          } else {
            rng.setEnd(node, 0);
          }
          return;
        }
      } while (node = start ? walker.next() : walker.prev());
      if (root.nodeName === 'BODY') {
        if (start) {
          rng.setStart(root, 0);
        } else {
          rng.setEnd(root, root.childNodes.length);
        }
      }
    };
    var hasAnyRanges = function (editor) {
      var sel = editor.selection.getSel();
      return sel && sel.rangeCount > 0;
    };

    function NodeChange (editor) {
      var lastRng, lastPath = [];
      var isSameElementPath = function (startElm) {
        var i, currentPath;
        currentPath = editor.$(startElm).parentsUntil(editor.getBody()).add(startElm);
        if (currentPath.length === lastPath.length) {
          for (i = currentPath.length; i >= 0; i--) {
            if (currentPath[i] !== lastPath[i]) {
              break;
            }
          }
          if (i === -1) {
            lastPath = currentPath;
            return true;
          }
        }
        lastPath = currentPath;
        return false;
      };
      if (!('onselectionchange' in editor.getDoc())) {
        editor.on('NodeChange Click MouseUp KeyUp Focus', function (e) {
          var nativeRng, fakeRng;
          nativeRng = editor.selection.getRng();
          fakeRng = {
            startContainer: nativeRng.startContainer,
            startOffset: nativeRng.startOffset,
            endContainer: nativeRng.endContainer,
            endOffset: nativeRng.endOffset
          };
          if (e.type === 'nodechange' || !RangeCompare.isEq(fakeRng, lastRng)) {
            editor.fire('SelectionChange');
          }
          lastRng = fakeRng;
        });
      }
      editor.on('contextmenu', function () {
        editor.fire('SelectionChange');
      });
      editor.on('SelectionChange', function () {
        var startElm = editor.selection.getStart(true);
        if (!startElm || !Env.range && editor.selection.isCollapsed()) {
          return;
        }
        if (hasAnyRanges(editor) && !isSameElementPath(startElm) && editor.dom.isChildOf(startElm, editor.getBody())) {
          editor.nodeChanged({ selectionChange: true });
        }
      });
      editor.on('MouseUp', function (e) {
        if (!e.isDefaultPrevented() && hasAnyRanges(editor)) {
          if (editor.selection.getNode().nodeName === 'IMG') {
            Delay.setEditorTimeout(editor, function () {
              editor.nodeChanged();
            });
          } else {
            editor.nodeChanged();
          }
        }
      });
      this.nodeChanged = function (args) {
        var selection = editor.selection;
        var node, parents, root;
        if (editor.initialized && selection && !editor.settings.disable_nodechange && !editor.readonly) {
          root = editor.getBody();
          node = selection.getStart(true) || root;
          if (node.ownerDocument !== editor.getDoc() || !editor.dom.isChildOf(node, root)) {
            node = root;
          }
          parents = [];
          editor.dom.getParent(node, function (node) {
            if (node === root) {
              return true;
            }
            parents.push(node);
          });
          args = args || {};
          args.element = node;
          args.parents = parents;
          editor.fire('NodeChange', args);
        }
      };
    }

    var getAbsolutePosition = function (elm) {
      var doc, docElem, win, clientRect;
      clientRect = elm.getBoundingClientRect();
      doc = elm.ownerDocument;
      docElem = doc.documentElement;
      win = doc.defaultView;
      return {
        top: clientRect.top + win.pageYOffset - docElem.clientTop,
        left: clientRect.left + win.pageXOffset - docElem.clientLeft
      };
    };
    var getBodyPosition = function (editor) {
      return editor.inline ? getAbsolutePosition(editor.getBody()) : {
        left: 0,
        top: 0
      };
    };
    var getScrollPosition = function (editor) {
      var body = editor.getBody();
      return editor.inline ? {
        left: body.scrollLeft,
        top: body.scrollTop
      } : {
        left: 0,
        top: 0
      };
    };
    var getBodyScroll = function (editor) {
      var body = editor.getBody(), docElm = editor.getDoc().documentElement;
      var inlineScroll = {
        left: body.scrollLeft,
        top: body.scrollTop
      };
      var iframeScroll = {
        left: body.scrollLeft || docElm.scrollLeft,
        top: body.scrollTop || docElm.scrollTop
      };
      return editor.inline ? inlineScroll : iframeScroll;
    };
    var getMousePosition = function (editor, event) {
      if (event.target.ownerDocument !== editor.getDoc()) {
        var iframePosition = getAbsolutePosition(editor.getContentAreaContainer());
        var scrollPosition = getBodyScroll(editor);
        return {
          left: event.pageX - iframePosition.left + scrollPosition.left,
          top: event.pageY - iframePosition.top + scrollPosition.top
        };
      }
      return {
        left: event.pageX,
        top: event.pageY
      };
    };
    var calculatePosition = function (bodyPosition, scrollPosition, mousePosition) {
      return {
        pageX: mousePosition.left - bodyPosition.left + scrollPosition.left,
        pageY: mousePosition.top - bodyPosition.top + scrollPosition.top
      };
    };
    var calc = function (editor, event) {
      return calculatePosition(getBodyPosition(editor), getScrollPosition(editor), getMousePosition(editor, event));
    };
    var MousePosition = { calc: calc };

    var isContentEditableFalse$7 = NodeType.isContentEditableFalse, isContentEditableTrue$4 = NodeType.isContentEditableTrue;
    var isDraggable = function (rootElm, elm) {
      return isContentEditableFalse$7(elm) && elm !== rootElm;
    };
    var isValidDropTarget = function (editor, targetElement, dragElement) {
      if (targetElement === dragElement || editor.dom.isChildOf(targetElement, dragElement)) {
        return false;
      }
      if (isContentEditableFalse$7(targetElement)) {
        return false;
      }
      return true;
    };
    var cloneElement = function (elm) {
      var cloneElm = elm.cloneNode(true);
      cloneElm.removeAttribute('data-mce-selected');
      return cloneElm;
    };
    var createGhost = function (editor, elm, width, height) {
      var clonedElm = elm.cloneNode(true);
      editor.dom.setStyles(clonedElm, {
        width: width,
        height: height
      });
      editor.dom.setAttrib(clonedElm, 'data-mce-selected', null);
      var ghostElm = editor.dom.create('div', {
        'class': 'mce-drag-container',
        'data-mce-bogus': 'all',
        'unselectable': 'on',
        'contenteditable': 'false'
      });
      editor.dom.setStyles(ghostElm, {
        position: 'absolute',
        opacity: 0.5,
        overflow: 'hidden',
        border: 0,
        padding: 0,
        margin: 0,
        width: width,
        height: height
      });
      editor.dom.setStyles(clonedElm, {
        margin: 0,
        boxSizing: 'border-box'
      });
      ghostElm.appendChild(clonedElm);
      return ghostElm;
    };
    var appendGhostToBody = function (ghostElm, bodyElm) {
      if (ghostElm.parentNode !== bodyElm) {
        bodyElm.appendChild(ghostElm);
      }
    };
    var moveGhost = function (ghostElm, position, width, height, maxX, maxY) {
      var overflowX = 0, overflowY = 0;
      ghostElm.style.left = position.pageX + 'px';
      ghostElm.style.top = position.pageY + 'px';
      if (position.pageX + width > maxX) {
        overflowX = position.pageX + width - maxX;
      }
      if (position.pageY + height > maxY) {
        overflowY = position.pageY + height - maxY;
      }
      ghostElm.style.width = width - overflowX + 'px';
      ghostElm.style.height = height - overflowY + 'px';
    };
    var removeElement = function (elm) {
      if (elm && elm.parentNode) {
        elm.parentNode.removeChild(elm);
      }
    };
    var isLeftMouseButtonPressed = function (e) {
      return e.button === 0;
    };
    var hasDraggableElement = function (state) {
      return state.element;
    };
    var applyRelPos = function (state, position) {
      return {
        pageX: position.pageX - state.relX,
        pageY: position.pageY + 5
      };
    };
    var start$1 = function (state, editor) {
      return function (e) {
        if (isLeftMouseButtonPressed(e)) {
          var ceElm = Arr.find(editor.dom.getParents(e.target), Fun.or(isContentEditableFalse$7, isContentEditableTrue$4));
          if (isDraggable(editor.getBody(), ceElm)) {
            var elmPos = editor.dom.getPos(ceElm);
            var bodyElm = editor.getBody();
            var docElm = editor.getDoc().documentElement;
            state.element = ceElm;
            state.screenX = e.screenX;
            state.screenY = e.screenY;
            state.maxX = (editor.inline ? bodyElm.scrollWidth : docElm.offsetWidth) - 2;
            state.maxY = (editor.inline ? bodyElm.scrollHeight : docElm.offsetHeight) - 2;
            state.relX = e.pageX - elmPos.x;
            state.relY = e.pageY - elmPos.y;
            state.width = ceElm.offsetWidth;
            state.height = ceElm.offsetHeight;
            state.ghost = createGhost(editor, ceElm, state.width, state.height);
          }
        }
      };
    };
    var move$1 = function (state, editor) {
      var throttledPlaceCaretAt = Delay.throttle(function (clientX, clientY) {
        editor._selectionOverrides.hideFakeCaret();
        editor.selection.placeCaretAt(clientX, clientY);
      }, 0);
      return function (e) {
        var movement = Math.max(Math.abs(e.screenX - state.screenX), Math.abs(e.screenY - state.screenY));
        if (hasDraggableElement(state) && !state.dragging && movement > 10) {
          var args = editor.fire('dragstart', { target: state.element });
          if (args.isDefaultPrevented()) {
            return;
          }
          state.dragging = true;
          editor.focus();
        }
        if (state.dragging) {
          var targetPos = applyRelPos(state, MousePosition.calc(editor, e));
          appendGhostToBody(state.ghost, editor.getBody());
          moveGhost(state.ghost, targetPos, state.width, state.height, state.maxX, state.maxY);
          throttledPlaceCaretAt(e.clientX, e.clientY);
        }
      };
    };
    var getRawTarget = function (selection) {
      var rng = selection.getSel().getRangeAt(0);
      var startContainer = rng.startContainer;
      return startContainer.nodeType === 3 ? startContainer.parentNode : startContainer;
    };
    var drop = function (state, editor) {
      return function (e) {
        if (state.dragging) {
          if (isValidDropTarget(editor, getRawTarget(editor.selection), state.element)) {
            var targetClone_1 = cloneElement(state.element);
            var args = editor.fire('drop', {
              targetClone: targetClone_1,
              clientX: e.clientX,
              clientY: e.clientY
            });
            if (!args.isDefaultPrevented()) {
              targetClone_1 = args.targetClone;
              editor.undoManager.transact(function () {
                removeElement(state.element);
                editor.insertContent(editor.dom.getOuterHTML(targetClone_1));
                editor._selectionOverrides.hideFakeCaret();
              });
            }
          }
        }
        removeDragState(state);
      };
    };
    var stop$$1 = function (state, editor) {
      return function () {
        if (state.dragging) {
          editor.fire('dragend');
        }
        removeDragState(state);
      };
    };
    var removeDragState = function (state) {
      state.dragging = false;
      state.element = null;
      removeElement(state.ghost);
    };
    var bindFakeDragEvents = function (editor) {
      var state = {};
      var pageDom, dragStartHandler, dragHandler, dropHandler, dragEndHandler, rootDocument;
      pageDom = DOMUtils$1.DOM;
      rootDocument = document;
      dragStartHandler = start$1(state, editor);
      dragHandler = move$1(state, editor);
      dropHandler = drop(state, editor);
      dragEndHandler = stop$$1(state, editor);
      editor.on('mousedown', dragStartHandler);
      editor.on('mousemove', dragHandler);
      editor.on('mouseup', dropHandler);
      pageDom.bind(rootDocument, 'mousemove', dragHandler);
      pageDom.bind(rootDocument, 'mouseup', dragEndHandler);
      editor.on('remove', function () {
        pageDom.unbind(rootDocument, 'mousemove', dragHandler);
        pageDom.unbind(rootDocument, 'mouseup', dragEndHandler);
      });
    };
    var blockIeDrop = function (editor) {
      editor.on('drop', function (e) {
        var realTarget = typeof e.clientX !== 'undefined' ? editor.getDoc().elementFromPoint(e.clientX, e.clientY) : null;
        if (isContentEditableFalse$7(realTarget) || isContentEditableFalse$7(editor.dom.getContentEditableParent(realTarget))) {
          e.preventDefault();
        }
      });
    };
    var init = function (editor) {
      bindFakeDragEvents(editor);
      blockIeDrop(editor);
    };
    var DragDropOverrides = { init: init };

    var getNodeClientRects = function (node) {
      var toArrayWithNode = function (clientRects) {
        return Arr.map(clientRects, function (clientRect) {
          clientRect = clone$2(clientRect);
          clientRect.node = node;
          return clientRect;
        });
      };
      if (NodeType.isElement(node)) {
        return toArrayWithNode(node.getClientRects());
      }
      if (NodeType.isText(node)) {
        var rng = node.ownerDocument.createRange();
        rng.setStart(node, 0);
        rng.setEnd(node, node.data.length);
        return toArrayWithNode(rng.getClientRects());
      }
    };
    var getClientRects = function (node) {
      return Arr.reduce(node, function (result, node) {
        return result.concat(getNodeClientRects(node));
      }, []);
    };

    var VDirection;
    (function (VDirection) {
      VDirection[VDirection['Up'] = -1] = 'Up';
      VDirection[VDirection['Down'] = 1] = 'Down';
    }(VDirection || (VDirection = {})));
    var findUntil = function (direction, root, predicateFn, node) {
      while (node = findNode(node, direction, isEditableCaretCandidate, root)) {
        if (predicateFn(node)) {
          return;
        }
      }
    };
    var walkUntil = function (direction, isAboveFn, isBeflowFn, root, predicateFn, caretPosition) {
      var line = 0, node;
      var result = [];
      var targetClientRect;
      var add = function (node) {
        var i, clientRect, clientRects;
        clientRects = getClientRects([node]);
        if (direction === -1) {
          clientRects = clientRects.reverse();
        }
        for (i = 0; i < clientRects.length; i++) {
          clientRect = clientRects[i];
          if (isBeflowFn(clientRect, targetClientRect)) {
            continue;
          }
          if (result.length > 0 && isAboveFn(clientRect, Arr.last(result))) {
            line++;
          }
          clientRect.line = line;
          if (predicateFn(clientRect)) {
            return true;
          }
          result.push(clientRect);
        }
      };
      targetClientRect = Arr.last(caretPosition.getClientRects());
      if (!targetClientRect) {
        return result;
      }
      node = caretPosition.getNode();
      add(node);
      findUntil(direction, root, add, node);
      return result;
    };
    var aboveLineNumber = function (lineNumber, clientRect) {
      return clientRect.line > lineNumber;
    };
    var isLineNumber = function (lineNumber, clientRect) {
      return clientRect.line === lineNumber;
    };
    var upUntil = curry(walkUntil, VDirection.Up, isAbove, isBelow);
    var downUntil = curry(walkUntil, VDirection.Down, isBelow, isAbove);
    var positionsUntil = function (direction, root, predicateFn, node) {
      var caretWalker = CaretWalker(root);
      var walkFn, isBelowFn, isAboveFn, caretPosition;
      var result = [];
      var line = 0, clientRect, targetClientRect;
      var getClientRect = function (caretPosition) {
        if (direction === 1) {
          return Arr.last(caretPosition.getClientRects());
        }
        return Arr.last(caretPosition.getClientRects());
      };
      if (direction === 1) {
        walkFn = caretWalker.next;
        isBelowFn = isBelow;
        isAboveFn = isAbove;
        caretPosition = CaretPosition$1.after(node);
      } else {
        walkFn = caretWalker.prev;
        isBelowFn = isAbove;
        isAboveFn = isBelow;
        caretPosition = CaretPosition$1.before(node);
      }
      targetClientRect = getClientRect(caretPosition);
      do {
        if (!caretPosition.isVisible()) {
          continue;
        }
        clientRect = getClientRect(caretPosition);
        if (isAboveFn(clientRect, targetClientRect)) {
          continue;
        }
        if (result.length > 0 && isBelowFn(clientRect, Arr.last(result))) {
          line++;
        }
        clientRect = clone$2(clientRect);
        clientRect.position = caretPosition;
        clientRect.line = line;
        if (predicateFn(clientRect)) {
          return result;
        }
        result.push(clientRect);
      } while (caretPosition = walkFn(caretPosition));
      return result;
    };
    var isAboveLine = function (lineNumber) {
      return function (clientRect) {
        return aboveLineNumber(lineNumber, clientRect);
      };
    };
    var isLine = function (lineNumber) {
      return function (clientRect) {
        return isLineNumber(lineNumber, clientRect);
      };
    };

    var isContentEditableFalse$8 = NodeType.isContentEditableFalse;
    var findNode$1 = findNode;
    var distanceToRectLeft = function (clientRect, clientX) {
      return Math.abs(clientRect.left - clientX);
    };
    var distanceToRectRight = function (clientRect, clientX) {
      return Math.abs(clientRect.right - clientX);
    };
    var isInside = function (clientX, clientRect) {
      return clientX >= clientRect.left && clientX <= clientRect.right;
    };
    var findClosestClientRect = function (clientRects, clientX) {
      return Arr.reduce(clientRects, function (oldClientRect, clientRect) {
        var oldDistance, newDistance;
        oldDistance = Math.min(distanceToRectLeft(oldClientRect, clientX), distanceToRectRight(oldClientRect, clientX));
        newDistance = Math.min(distanceToRectLeft(clientRect, clientX), distanceToRectRight(clientRect, clientX));
        if (isInside(clientX, clientRect)) {
          return clientRect;
        }
        if (isInside(clientX, oldClientRect)) {
          return oldClientRect;
        }
        if (newDistance === oldDistance && isContentEditableFalse$8(clientRect.node)) {
          return clientRect;
        }
        if (newDistance < oldDistance) {
          return clientRect;
        }
        return oldClientRect;
      });
    };
    var walkUntil$1 = function (direction, root, predicateFn, node) {
      while (node = findNode$1(node, direction, isEditableCaretCandidate, root)) {
        if (predicateFn(node)) {
          return;
        }
      }
    };
    var findLineNodeRects = function (root, targetNodeRect) {
      var clientRects = [];
      var collect = function (checkPosFn, node) {
        var lineRects;
        lineRects = Arr.filter(getClientRects([node]), function (clientRect) {
          return !checkPosFn(clientRect, targetNodeRect);
        });
        clientRects = clientRects.concat(lineRects);
        return lineRects.length === 0;
      };
      clientRects.push(targetNodeRect);
      walkUntil$1(VDirection.Up, root, curry(collect, isAbove), targetNodeRect.node);
      walkUntil$1(VDirection.Down, root, curry(collect, isBelow), targetNodeRect.node);
      return clientRects;
    };
    var getFakeCaretTargets = function (root) {
      return Arr.filter(Arr.toArray(root.getElementsByTagName('*')), isFakeCaretTarget);
    };
    var caretInfo = function (clientRect, clientX) {
      return {
        node: clientRect.node,
        before: distanceToRectLeft(clientRect, clientX) < distanceToRectRight(clientRect, clientX)
      };
    };
    var closestCaret = function (root, clientX, clientY) {
      var closestNodeRect;
      var contentEditableFalseNodeRects = getClientRects(getFakeCaretTargets(root));
      var targetNodeRects = Arr.filter(contentEditableFalseNodeRects, function (rect) {
        return clientY >= rect.top && clientY <= rect.bottom;
      });
      closestNodeRect = findClosestClientRect(targetNodeRects, clientX);
      if (closestNodeRect) {
        closestNodeRect = findClosestClientRect(findLineNodeRects(root, closestNodeRect), clientX);
        if (closestNodeRect && isFakeCaretTarget(closestNodeRect.node)) {
          return caretInfo(closestNodeRect, clientX);
        }
      }
      return null;
    };

    var isXYWithinRange = function (clientX, clientY, range$$1) {
      if (range$$1.collapsed) {
        return false;
      }
      return foldl(range$$1.getClientRects(), function (state, rect) {
        return state || containsXY(rect, clientX, clientY);
      }, false);
    };
    var RangePoint = { isXYWithinRange: isXYWithinRange };

    var setup$3 = function (editor) {
      var renderFocusCaret = first$1(function () {
        if (!editor.removed) {
          var rng = editor.selection.getRng();
          if (rng.collapsed) {
            var caretRange = renderRangeCaret(editor, editor.selection.getRng(), false);
            editor.selection.setRng(caretRange);
          }
        }
      }, 0);
      editor.on('focus', function () {
        renderFocusCaret.throttle();
      });
      editor.on('blur', function () {
        renderFocusCaret.cancel();
      });
    };
    var CefFocus = { setup: setup$3 };

    var VK = {
      BACKSPACE: 8,
      DELETE: 46,
      DOWN: 40,
      ENTER: 13,
      LEFT: 37,
      RIGHT: 39,
      SPACEBAR: 32,
      TAB: 9,
      UP: 38,
      modifierPressed: function (e) {
        return e.shiftKey || e.ctrlKey || e.altKey || this.metaKeyPressed(e);
      },
      metaKeyPressed: function (e) {
        return Env.mac ? e.metaKey : e.ctrlKey && !e.altKey;
      }
    };

    var isContentEditableTrue$5 = NodeType.isContentEditableTrue;
    var isContentEditableFalse$9 = NodeType.isContentEditableFalse;
    var isAfterContentEditableFalse$1 = isAfterContentEditableFalse;
    var isBeforeContentEditableFalse$1 = isBeforeContentEditableFalse;
    var getContentEditableRoot$1 = function (editor, node) {
      var root = editor.getBody();
      while (node && node !== root) {
        if (isContentEditableTrue$5(node) || isContentEditableFalse$9(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var SelectionOverrides = function (editor) {
      var isBlock = function (node) {
        return editor.dom.isBlock(node);
      };
      var rootNode = editor.getBody();
      var fakeCaret = FakeCaret(editor.getBody(), isBlock, function () {
        return EditorFocus.hasFocus(editor);
      });
      var realSelectionId = 'sel-' + editor.dom.uniqueId();
      var selectedContentEditableNode;
      var isFakeSelectionElement = function (elm) {
        return editor.dom.hasClass(elm, 'mce-offscreen-selection');
      };
      var getRealSelectionElement = function () {
        var container = editor.dom.get(realSelectionId);
        return container ? container.getElementsByTagName('*')[0] : container;
      };
      var setRange = function (range$$1) {
        if (range$$1) {
          editor.selection.setRng(range$$1);
        }
      };
      var getRange = function () {
        return editor.selection.getRng();
      };
      var showCaret$$1 = function (direction, node, before, scrollIntoView) {
        if (scrollIntoView === void 0) {
          scrollIntoView = true;
        }
        var e;
        e = editor.fire('ShowCaret', {
          target: node,
          direction: direction,
          before: before
        });
        if (e.isDefaultPrevented()) {
          return null;
        }
        if (scrollIntoView) {
          editor.selection.scrollIntoView(node, direction === -1);
        }
        return fakeCaret.show(before, node);
      };
      var getNormalizedRangeEndPoint$$1 = function (direction, range$$1) {
        range$$1 = normalizeRange(direction, rootNode, range$$1);
        if (direction === -1) {
          return CaretPosition$1.fromRangeStart(range$$1);
        }
        return CaretPosition$1.fromRangeEnd(range$$1);
      };
      var showBlockCaretContainer = function (blockCaretContainer) {
        if (blockCaretContainer.hasAttribute('data-mce-caret')) {
          showCaretContainerBlock(blockCaretContainer);
          setRange(getRange());
          editor.selection.scrollIntoView(blockCaretContainer[0]);
        }
      };
      var registerEvents = function () {
        editor.on('mouseup', function (e) {
          var range$$1 = getRange();
          if (range$$1.collapsed && EditorView.isXYInContentArea(editor, e.clientX, e.clientY)) {
            setRange(renderCaretAtRange(editor, range$$1, false));
          }
        });
        editor.on('click', function (e) {
          var contentEditableRoot;
          contentEditableRoot = getContentEditableRoot$1(editor, e.target);
          if (contentEditableRoot) {
            if (isContentEditableFalse$9(contentEditableRoot)) {
              e.preventDefault();
              editor.focus();
            }
            if (isContentEditableTrue$5(contentEditableRoot)) {
              if (editor.dom.isChildOf(contentEditableRoot, editor.selection.getNode())) {
                removeContentEditableSelection();
              }
            }
          }
        });
        editor.on('blur NewBlock', function () {
          removeContentEditableSelection();
        });
        editor.on('ResizeWindow FullscreenStateChanged', function () {
          return fakeCaret.reposition();
        });
        var handleTouchSelect = function (editor) {
          var moved = false;
          editor.on('touchstart', function () {
            moved = false;
          });
          editor.on('touchmove', function () {
            moved = true;
          });
          editor.on('touchend', function (e) {
            var contentEditableRoot = getContentEditableRoot$1(editor, e.target);
            if (isContentEditableFalse$9(contentEditableRoot)) {
              if (!moved) {
                e.preventDefault();
                setContentEditableSelection(selectNode(editor, contentEditableRoot));
              }
            }
          });
        };
        var hasNormalCaretPosition = function (elm) {
          var caretWalker = CaretWalker(elm);
          if (!elm.firstChild) {
            return false;
          }
          var startPos = CaretPosition$1.before(elm.firstChild);
          var newPos = caretWalker.next(startPos);
          return newPos && !isBeforeContentEditableFalse$1(newPos) && !isAfterContentEditableFalse$1(newPos);
        };
        var isInSameBlock$$1 = function (node1, node2) {
          var block1 = editor.dom.getParent(node1, editor.dom.isBlock);
          var block2 = editor.dom.getParent(node2, editor.dom.isBlock);
          return block1 === block2;
        };
        var hasBetterMouseTarget = function (targetNode, caretNode) {
          var targetBlock = editor.dom.getParent(targetNode, editor.dom.isBlock);
          var caretBlock = editor.dom.getParent(caretNode, editor.dom.isBlock);
          if (targetBlock && editor.dom.isChildOf(targetBlock, caretBlock) && isContentEditableFalse$9(getContentEditableRoot$1(editor, targetBlock)) === false) {
            return true;
          }
          return targetBlock && !isInSameBlock$$1(targetBlock, caretBlock) && hasNormalCaretPosition(targetBlock);
        };
        handleTouchSelect(editor);
        editor.on('mousedown', function (e) {
          var contentEditableRoot;
          var targetElm = e.target;
          if (targetElm !== rootNode && targetElm.nodeName !== 'HTML' && !editor.dom.isChildOf(targetElm, rootNode)) {
            return;
          }
          if (EditorView.isXYInContentArea(editor, e.clientX, e.clientY) === false) {
            return;
          }
          contentEditableRoot = getContentEditableRoot$1(editor, targetElm);
          if (contentEditableRoot) {
            if (isContentEditableFalse$9(contentEditableRoot)) {
              e.preventDefault();
              setContentEditableSelection(selectNode(editor, contentEditableRoot));
            } else {
              removeContentEditableSelection();
              if (!(isContentEditableTrue$5(contentEditableRoot) && e.shiftKey) && !RangePoint.isXYWithinRange(e.clientX, e.clientY, editor.selection.getRng())) {
                hideFakeCaret();
                editor.selection.placeCaretAt(e.clientX, e.clientY);
              }
            }
          } else if (isFakeCaretTarget(targetElm) === false) {
            removeContentEditableSelection();
            hideFakeCaret();
            var caretInfo = closestCaret(rootNode, e.clientX, e.clientY);
            if (caretInfo) {
              if (!hasBetterMouseTarget(e.target, caretInfo.node)) {
                e.preventDefault();
                var range$$1 = showCaret$$1(1, caretInfo.node, caretInfo.before, false);
                editor.getBody().focus();
                setRange(range$$1);
              }
            }
          }
        });
        editor.on('keypress', function (e) {
          if (VK.modifierPressed(e)) {
            return;
          }
          switch (e.keyCode) {
          default:
            if (isContentEditableFalse$9(editor.selection.getNode())) {
              e.preventDefault();
            }
            break;
          }
        });
        editor.on('getSelectionRange', function (e) {
          var rng = e.range;
          if (selectedContentEditableNode) {
            if (!selectedContentEditableNode.parentNode) {
              selectedContentEditableNode = null;
              return;
            }
            rng = rng.cloneRange();
            rng.selectNode(selectedContentEditableNode);
            e.range = rng;
          }
        });
        editor.on('setSelectionRange', function (e) {
          var rng;
          rng = setContentEditableSelection(e.range, e.forward);
          if (rng) {
            e.range = rng;
          }
        });
        var isPasteBin = function (node) {
          return node.id === 'mcepastebin';
        };
        editor.on('AfterSetSelectionRange', function (e) {
          var rng = e.range;
          if (!isRangeInCaretContainer(rng) && !isPasteBin(rng.startContainer.parentNode)) {
            hideFakeCaret();
          }
          if (!isFakeSelectionElement(rng.startContainer.parentNode)) {
            removeContentEditableSelection();
          }
        });
        editor.on('copy', function (e) {
          var clipboardData = e.clipboardData;
          if (!e.isDefaultPrevented() && e.clipboardData && !Env.ie) {
            var realSelectionElement = getRealSelectionElement();
            if (realSelectionElement) {
              e.preventDefault();
              clipboardData.clearData();
              clipboardData.setData('text/html', realSelectionElement.outerHTML);
              clipboardData.setData('text/plain', realSelectionElement.outerText);
            }
          }
        });
        DragDropOverrides.init(editor);
        CefFocus.setup(editor);
      };
      var addCss = function () {
        var styles = editor.contentStyles, rootClass = '.mce-content-body';
        styles.push(fakeCaret.getCss());
        styles.push(rootClass + ' .mce-offscreen-selection {' + 'position: absolute;' + 'left: -9999999999px;' + 'max-width: 1000000px;' + '}' + rootClass + ' *[contentEditable=false] {' + 'cursor: default;' + '}' + rootClass + ' *[contentEditable=true] {' + 'cursor: text;' + '}');
      };
      var isWithinCaretContainer = function (node) {
        return isCaretContainer(node) || startsWithCaretContainer(node) || endsWithCaretContainer(node);
      };
      var isRangeInCaretContainer = function (rng) {
        return isWithinCaretContainer(rng.startContainer) || isWithinCaretContainer(rng.endContainer);
      };
      var setContentEditableSelection = function (range$$1, forward) {
        var node;
        var $ = editor.$;
        var dom = editor.dom;
        var $realSelectionContainer, sel, startContainer, startOffset, endOffset, e, caretPosition, targetClone, origTargetClone;
        if (!range$$1) {
          return null;
        }
        if (range$$1.collapsed) {
          if (!isRangeInCaretContainer(range$$1)) {
            if (forward === false) {
              caretPosition = getNormalizedRangeEndPoint$$1(-1, range$$1);
              if (isFakeCaretTarget(caretPosition.getNode(true))) {
                return showCaret$$1(-1, caretPosition.getNode(true), false, false);
              }
              if (isFakeCaretTarget(caretPosition.getNode())) {
                return showCaret$$1(-1, caretPosition.getNode(), !caretPosition.isAtEnd(), false);
              }
            } else {
              caretPosition = getNormalizedRangeEndPoint$$1(1, range$$1);
              if (isFakeCaretTarget(caretPosition.getNode())) {
                return showCaret$$1(1, caretPosition.getNode(), !caretPosition.isAtEnd(), false);
              }
              if (isFakeCaretTarget(caretPosition.getNode(true))) {
                return showCaret$$1(1, caretPosition.getNode(true), false, false);
              }
            }
          }
          return null;
        }
        startContainer = range$$1.startContainer;
        startOffset = range$$1.startOffset;
        endOffset = range$$1.endOffset;
        if (startContainer.nodeType === 3 && startOffset === 0 && isContentEditableFalse$9(startContainer.parentNode)) {
          startContainer = startContainer.parentNode;
          startOffset = dom.nodeIndex(startContainer);
          startContainer = startContainer.parentNode;
        }
        if (startContainer.nodeType !== 1) {
          return null;
        }
        if (endOffset === startOffset + 1) {
          node = startContainer.childNodes[startOffset];
        }
        if (!isContentEditableFalse$9(node)) {
          return null;
        }
        targetClone = origTargetClone = node.cloneNode(true);
        e = editor.fire('ObjectSelected', {
          target: node,
          targetClone: targetClone
        });
        if (e.isDefaultPrevented()) {
          return null;
        }
        $realSelectionContainer = descendant$1(Element$$1.fromDom(editor.getBody()), '#' + realSelectionId).fold(function () {
          return $([]);
        }, function (elm) {
          return $([elm.dom()]);
        });
        targetClone = e.targetClone;
        if ($realSelectionContainer.length === 0) {
          $realSelectionContainer = $('<div data-mce-bogus="all" class="mce-offscreen-selection"></div>').attr('id', realSelectionId);
          $realSelectionContainer.appendTo(editor.getBody());
        }
        range$$1 = editor.dom.createRng();
        if (targetClone === origTargetClone && Env.ie) {
          $realSelectionContainer.empty().append('<p style="font-size: 0" data-mce-bogus="all">\xA0</p>').append(targetClone);
          range$$1.setStartAfter($realSelectionContainer[0].firstChild.firstChild);
          range$$1.setEndAfter(targetClone);
        } else {
          $realSelectionContainer.empty().append('\xA0').append(targetClone).append('\xA0');
          range$$1.setStart($realSelectionContainer[0].firstChild, 1);
          range$$1.setEnd($realSelectionContainer[0].lastChild, 0);
        }
        $realSelectionContainer.css({ top: dom.getPos(node, editor.getBody()).y });
        $realSelectionContainer[0].focus();
        sel = editor.selection.getSel();
        sel.removeAllRanges();
        sel.addRange(range$$1);
        each(descendants$1(Element$$1.fromDom(editor.getBody()), '*[data-mce-selected]'), function (elm) {
          remove(elm, 'data-mce-selected');
        });
        node.setAttribute('data-mce-selected', '1');
        selectedContentEditableNode = node;
        hideFakeCaret();
        return range$$1;
      };
      var removeContentEditableSelection = function () {
        if (selectedContentEditableNode) {
          selectedContentEditableNode.removeAttribute('data-mce-selected');
          descendant$1(Element$$1.fromDom(editor.getBody()), '#' + realSelectionId).each(remove$2);
          selectedContentEditableNode = null;
        }
        descendant$1(Element$$1.fromDom(editor.getBody()), '#' + realSelectionId).each(remove$2);
        selectedContentEditableNode = null;
      };
      var destroy = function () {
        fakeCaret.destroy();
        selectedContentEditableNode = null;
      };
      var hideFakeCaret = function () {
        fakeCaret.hide();
      };
      if (Env.ceFalse) {
        registerEvents();
        addCss();
      }
      return {
        showCaret: showCaret$$1,
        showBlockCaretContainer: showBlockCaretContainer,
        hideFakeCaret: hideFakeCaret,
        destroy: destroy
      };
    };

    var isValidPrefixAttrName = function (name) {
      return name.indexOf('data-') === 0 || name.indexOf('aria-') === 0;
    };
    var trimComments = function (text) {
      return text.replace(/<!--|-->/g, '');
    };
    var isInvalidUri = function (settings, uri) {
      if (settings.allow_html_data_urls) {
        return false;
      } else if (/^data:image\//i.test(uri)) {
        return settings.allow_svg_data_urls === false && /^data:image\/svg\+xml/i.test(uri);
      } else {
        return /^data:/i.test(uri);
      }
    };
    var findEndTagIndex = function (schema, html, startIndex) {
      var count = 1, index, matches, tokenRegExp, shortEndedElements;
      shortEndedElements = schema.getShortEndedElements();
      tokenRegExp = /<([!?\/])?([A-Za-z0-9\-_\:\.]+)((?:\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\/|\s+)>/g;
      tokenRegExp.lastIndex = index = startIndex;
      while (matches = tokenRegExp.exec(html)) {
        index = tokenRegExp.lastIndex;
        if (matches[1] === '/') {
          count--;
        } else if (!matches[1]) {
          if (matches[2] in shortEndedElements) {
            continue;
          }
          count++;
        }
        if (count === 0) {
          break;
        }
      }
      return index;
    };
    function SaxParser(settings, schema) {
      if (schema === void 0) {
        schema = Schema();
      }
      var noop = function () {
      };
      settings = settings || {};
      if (settings.fix_self_closing !== false) {
        settings.fix_self_closing = true;
      }
      var comment = settings.comment ? settings.comment : noop;
      var cdata = settings.cdata ? settings.cdata : noop;
      var text = settings.text ? settings.text : noop;
      var start = settings.start ? settings.start : noop;
      var end = settings.end ? settings.end : noop;
      var pi = settings.pi ? settings.pi : noop;
      var doctype = settings.doctype ? settings.doctype : noop;
      var parse = function (html) {
        var matches, index = 0, value, endRegExp;
        var stack = [];
        var attrList, i, textData, name;
        var isInternalElement, removeInternalElements, shortEndedElements, fillAttrsMap, isShortEnded;
        var validate, elementRule, isValidElement, attr, attribsValue, validAttributesMap, validAttributePatterns;
        var attributesRequired, attributesDefault, attributesForced, processHtml;
        var anyAttributesRequired, selfClosing, tokenRegExp, attrRegExp, specialElements, attrValue, idCount = 0;
        var decode = Entities.decode;
        var fixSelfClosing;
        var filteredUrlAttrs = Tools.makeMap('src,href,data,background,formaction,poster,xlink:href');
        var scriptUriRegExp = /((java|vb)script|mhtml):/i;
        var processEndTag = function (name) {
          var pos, i;
          pos = stack.length;
          while (pos--) {
            if (stack[pos].name === name) {
              break;
            }
          }
          if (pos >= 0) {
            for (i = stack.length - 1; i >= pos; i--) {
              name = stack[i];
              if (name.valid) {
                end(name.name);
              }
            }
            stack.length = pos;
          }
        };
        var parseAttribute = function (match, name, value, val2, val3) {
          var attrRule, i;
          var trimRegExp = /[\s\u0000-\u001F]+/g;
          name = name.toLowerCase();
          value = name in fillAttrsMap ? name : decode(value || val2 || val3 || '');
          if (validate && !isInternalElement && isValidPrefixAttrName(name) === false) {
            attrRule = validAttributesMap[name];
            if (!attrRule && validAttributePatterns) {
              i = validAttributePatterns.length;
              while (i--) {
                attrRule = validAttributePatterns[i];
                if (attrRule.pattern.test(name)) {
                  break;
                }
              }
              if (i === -1) {
                attrRule = null;
              }
            }
            if (!attrRule) {
              return;
            }
            if (attrRule.validValues && !(value in attrRule.validValues)) {
              return;
            }
          }
          if (filteredUrlAttrs[name] && !settings.allow_script_urls) {
            var uri = value.replace(trimRegExp, '');
            try {
              uri = decodeURIComponent(uri);
            } catch (ex) {
              uri = unescape(uri);
            }
            if (scriptUriRegExp.test(uri)) {
              return;
            }
            if (isInvalidUri(settings, uri)) {
              return;
            }
          }
          if (isInternalElement && (name in filteredUrlAttrs || name.indexOf('on') === 0)) {
            return;
          }
          attrList.map[name] = value;
          attrList.push({
            name: name,
            value: value
          });
        };
        tokenRegExp = new RegExp('<(?:' + '(?:!--([\\w\\W]*?)-->)|' + '(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + '(?:!DOCTYPE([\\w\\W]*?)>)|' + '(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + '(?:\\/([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)>)|' + '(?:([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' + ')', 'g');
        attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g;
        shortEndedElements = schema.getShortEndedElements();
        selfClosing = settings.self_closing_elements || schema.getSelfClosingElements();
        fillAttrsMap = schema.getBoolAttrs();
        validate = settings.validate;
        removeInternalElements = settings.remove_internals;
        fixSelfClosing = settings.fix_self_closing;
        specialElements = schema.getSpecialElements();
        processHtml = html + '>';
        while (matches = tokenRegExp.exec(processHtml)) {
          if (index < matches.index) {
            text(decode(html.substr(index, matches.index - index)));
          }
          if (value = matches[6]) {
            value = value.toLowerCase();
            if (value.charAt(0) === ':') {
              value = value.substr(1);
            }
            processEndTag(value);
          } else if (value = matches[7]) {
            if (matches.index + matches[0].length > html.length) {
              text(decode(html.substr(matches.index)));
              index = matches.index + matches[0].length;
              continue;
            }
            value = value.toLowerCase();
            if (value.charAt(0) === ':') {
              value = value.substr(1);
            }
            isShortEnded = value in shortEndedElements;
            if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value) {
              processEndTag(value);
            }
            if (!validate || (elementRule = schema.getElementRule(value))) {
              isValidElement = true;
              if (validate) {
                validAttributesMap = elementRule.attributes;
                validAttributePatterns = elementRule.attributePatterns;
              }
              if (attribsValue = matches[8]) {
                isInternalElement = attribsValue.indexOf('data-mce-type') !== -1;
                if (isInternalElement && removeInternalElements) {
                  isValidElement = false;
                }
                attrList = [];
                attrList.map = {};
                attribsValue.replace(attrRegExp, parseAttribute);
              } else {
                attrList = [];
                attrList.map = {};
              }
              if (validate && !isInternalElement) {
                attributesRequired = elementRule.attributesRequired;
                attributesDefault = elementRule.attributesDefault;
                attributesForced = elementRule.attributesForced;
                anyAttributesRequired = elementRule.removeEmptyAttrs;
                if (anyAttributesRequired && !attrList.length) {
                  isValidElement = false;
                }
                if (attributesForced) {
                  i = attributesForced.length;
                  while (i--) {
                    attr = attributesForced[i];
                    name = attr.name;
                    attrValue = attr.value;
                    if (attrValue === '{$uid}') {
                      attrValue = 'mce_' + idCount++;
                    }
                    attrList.map[name] = attrValue;
                    attrList.push({
                      name: name,
                      value: attrValue
                    });
                  }
                }
                if (attributesDefault) {
                  i = attributesDefault.length;
                  while (i--) {
                    attr = attributesDefault[i];
                    name = attr.name;
                    if (!(name in attrList.map)) {
                      attrValue = attr.value;
                      if (attrValue === '{$uid}') {
                        attrValue = 'mce_' + idCount++;
                      }
                      attrList.map[name] = attrValue;
                      attrList.push({
                        name: name,
                        value: attrValue
                      });
                    }
                  }
                }
                if (attributesRequired) {
                  i = attributesRequired.length;
                  while (i--) {
                    if (attributesRequired[i] in attrList.map) {
                      break;
                    }
                  }
                  if (i === -1) {
                    isValidElement = false;
                  }
                }
                if (attr = attrList.map['data-mce-bogus']) {
                  if (attr === 'all') {
                    index = findEndTagIndex(schema, html, tokenRegExp.lastIndex);
                    tokenRegExp.lastIndex = index;
                    continue;
                  }
                  isValidElement = false;
                }
              }
              if (isValidElement) {
                start(value, attrList, isShortEnded);
              }
            } else {
              isValidElement = false;
            }
            if (endRegExp = specialElements[value]) {
              endRegExp.lastIndex = index = matches.index + matches[0].length;
              if (matches = endRegExp.exec(html)) {
                if (isValidElement) {
                  textData = html.substr(index, matches.index - index);
                }
                index = matches.index + matches[0].length;
              } else {
                textData = html.substr(index);
                index = html.length;
              }
              if (isValidElement) {
                if (textData.length > 0) {
                  text(textData, true);
                }
                end(value);
              }
              tokenRegExp.lastIndex = index;
              continue;
            }
            if (!isShortEnded) {
              if (!attribsValue || attribsValue.indexOf('/') !== attribsValue.length - 1) {
                stack.push({
                  name: value,
                  valid: isValidElement
                });
              } else if (isValidElement) {
                end(value);
              }
            }
          } else if (value = matches[1]) {
            if (value.charAt(0) === '>') {
              value = ' ' + value;
            }
            if (!settings.allow_conditional_comments && value.substr(0, 3).toLowerCase() === '[if') {
              value = ' ' + value;
            }
            comment(value);
          } else if (value = matches[2]) {
            cdata(trimComments(value));
          } else if (value = matches[3]) {
            doctype(value);
          } else if (value = matches[4]) {
            pi(value, matches[5]);
          }
          index = matches.index + matches[0].length;
        }
        if (index < html.length) {
          text(decode(html.substr(index)));
        }
        for (i = stack.length - 1; i >= 0; i--) {
          value = stack[i];
          if (value.valid) {
            end(value.name);
          }
        }
      };
      return { parse: parse };
    }
    (function (SaxParser) {
      SaxParser.findEndTag = findEndTagIndex;
    }(SaxParser || (SaxParser = {})));
    var SaxParser$1 = SaxParser;

    var trimHtml = function (tempAttrs, html) {
      var trimContentRegExp = new RegExp(['\\s?(' + tempAttrs.join('|') + ')="[^"]+"'].join('|'), 'gi');
      return html.replace(trimContentRegExp, '');
    };
    var trimInternal = function (serializer, html) {
      var content = html;
      var bogusAllRegExp = /<(\w+) [^>]*data-mce-bogus="all"[^>]*>/g;
      var endTagIndex, index, matchLength, matches, shortEndedElements;
      var schema = serializer.schema;
      content = trimHtml(serializer.getTempAttrs(), content);
      shortEndedElements = schema.getShortEndedElements();
      while (matches = bogusAllRegExp.exec(content)) {
        index = bogusAllRegExp.lastIndex;
        matchLength = matches[0].length;
        if (shortEndedElements[matches[1]]) {
          endTagIndex = index;
        } else {
          endTagIndex = SaxParser$1.findEndTag(schema, content, index);
        }
        content = content.substring(0, index - matchLength) + content.substring(endTagIndex);
        bogusAllRegExp.lastIndex = index - matchLength;
      }
      return Zwsp.trim(content);
    };
    var trimExternal = trimInternal;
    var TrimHtml = {
      trimExternal: trimExternal,
      trimInternal: trimInternal
    };

    var KEEP = 0, INSERT = 1, DELETE = 2;
    var diff = function (left, right) {
      var size = left.length + right.length + 2;
      var vDown = new Array(size);
      var vUp = new Array(size);
      var snake = function (start, end, diag) {
        return {
          start: start,
          end: end,
          diag: diag
        };
      };
      var buildScript = function (start1, end1, start2, end2, script) {
        var middle = getMiddleSnake(start1, end1, start2, end2);
        if (middle === null || middle.start === end1 && middle.diag === end1 - end2 || middle.end === start1 && middle.diag === start1 - start2) {
          var i = start1;
          var j = start2;
          while (i < end1 || j < end2) {
            if (i < end1 && j < end2 && left[i] === right[j]) {
              script.push([
                KEEP,
                left[i]
              ]);
              ++i;
              ++j;
            } else {
              if (end1 - start1 > end2 - start2) {
                script.push([
                  DELETE,
                  left[i]
                ]);
                ++i;
              } else {
                script.push([
                  INSERT,
                  right[j]
                ]);
                ++j;
              }
            }
          }
        } else {
          buildScript(start1, middle.start, start2, middle.start - middle.diag, script);
          for (var i2 = middle.start; i2 < middle.end; ++i2) {
            script.push([
              KEEP,
              left[i2]
            ]);
          }
          buildScript(middle.end, end1, middle.end - middle.diag, end2, script);
        }
      };
      var buildSnake = function (start, diag, end1, end2) {
        var end = start;
        while (end - diag < end2 && end < end1 && left[end] === right[end - diag]) {
          ++end;
        }
        return snake(start, end, diag);
      };
      var getMiddleSnake = function (start1, end1, start2, end2) {
        var m = end1 - start1;
        var n = end2 - start2;
        if (m === 0 || n === 0) {
          return null;
        }
        var delta = m - n;
        var sum = n + m;
        var offset = (sum % 2 === 0 ? sum : sum + 1) / 2;
        vDown[1 + offset] = start1;
        vUp[1 + offset] = end1 + 1;
        var d, k, i, x, y;
        for (d = 0; d <= offset; ++d) {
          for (k = -d; k <= d; k += 2) {
            i = k + offset;
            if (k === -d || k !== d && vDown[i - 1] < vDown[i + 1]) {
              vDown[i] = vDown[i + 1];
            } else {
              vDown[i] = vDown[i - 1] + 1;
            }
            x = vDown[i];
            y = x - start1 + start2 - k;
            while (x < end1 && y < end2 && left[x] === right[y]) {
              vDown[i] = ++x;
              ++y;
            }
            if (delta % 2 !== 0 && delta - d <= k && k <= delta + d) {
              if (vUp[i - delta] <= vDown[i]) {
                return buildSnake(vUp[i - delta], k + start1 - start2, end1, end2);
              }
            }
          }
          for (k = delta - d; k <= delta + d; k += 2) {
            i = k + offset - delta;
            if (k === delta - d || k !== delta + d && vUp[i + 1] <= vUp[i - 1]) {
              vUp[i] = vUp[i + 1] - 1;
            } else {
              vUp[i] = vUp[i - 1];
            }
            x = vUp[i] - 1;
            y = x - start1 + start2 - k;
            while (x >= start1 && y >= start2 && left[x] === right[y]) {
              vUp[i] = x--;
              y--;
            }
            if (delta % 2 === 0 && -d <= k && k <= d) {
              if (vUp[i] <= vDown[i + delta]) {
                return buildSnake(vUp[i], k + start1 - start2, end1, end2);
              }
            }
          }
        }
      };
      var script = [];
      buildScript(0, left.length, 0, right.length, script);
      return script;
    };
    var Diff = {
      KEEP: KEEP,
      DELETE: DELETE,
      INSERT: INSERT,
      diff: diff
    };

    var getOuterHtml = function (elm) {
      if (NodeType.isElement(elm)) {
        return elm.outerHTML;
      } else if (NodeType.isText(elm)) {
        return Entities.encodeRaw(elm.data, false);
      } else if (NodeType.isComment(elm)) {
        return '<!--' + elm.data + '-->';
      }
      return '';
    };
    var createFragment$1 = function (html) {
      var frag, node, container;
      container = document.createElement('div');
      frag = document.createDocumentFragment();
      if (html) {
        container.innerHTML = html;
      }
      while (node = container.firstChild) {
        frag.appendChild(node);
      }
      return frag;
    };
    var insertAt = function (elm, html, index) {
      var fragment = createFragment$1(html);
      if (elm.hasChildNodes() && index < elm.childNodes.length) {
        var target = elm.childNodes[index];
        target.parentNode.insertBefore(fragment, target);
      } else {
        elm.appendChild(fragment);
      }
    };
    var removeAt = function (elm, index) {
      if (elm.hasChildNodes() && index < elm.childNodes.length) {
        var target = elm.childNodes[index];
        target.parentNode.removeChild(target);
      }
    };
    var applyDiff = function (diff, elm) {
      var index = 0;
      Arr.each(diff, function (action) {
        if (action[0] === Diff.KEEP) {
          index++;
        } else if (action[0] === Diff.INSERT) {
          insertAt(elm, action[1], index);
          index++;
        } else if (action[0] === Diff.DELETE) {
          removeAt(elm, index);
        }
      });
    };
    var read$3 = function (elm) {
      return Arr.filter(Arr.map(elm.childNodes, getOuterHtml), function (item) {
        return item.length > 0;
      });
    };
    var write = function (fragments, elm) {
      var currentFragments = Arr.map(elm.childNodes, getOuterHtml);
      applyDiff(Diff.diff(currentFragments, fragments), elm);
      return elm;
    };
    var Fragments = {
      read: read$3,
      write: write
    };

    var undoLevelDocument = Cell(Option.none());
    var lazyTempDocument = function () {
      return undoLevelDocument.get().getOrThunk(function () {
        var doc = document.implementation.createHTMLDocument('undo');
        undoLevelDocument.set(Option.some(doc));
        return doc;
      });
    };
    var hasIframes = function (html) {
      return html.indexOf('</iframe>') !== -1;
    };
    var createFragmentedLevel = function (fragments) {
      return {
        type: 'fragmented',
        fragments: fragments,
        content: '',
        bookmark: null,
        beforeBookmark: null
      };
    };
    var createCompleteLevel = function (content) {
      return {
        type: 'complete',
        fragments: null,
        content: content,
        bookmark: null,
        beforeBookmark: null
      };
    };
    var createFromEditor = function (editor) {
      var fragments, content, trimmedFragments;
      fragments = Fragments.read(editor.getBody());
      trimmedFragments = bind(fragments, function (html) {
        var trimmed = TrimHtml.trimInternal(editor.serializer, html);
        return trimmed.length > 0 ? [trimmed] : [];
      });
      content = trimmedFragments.join('');
      return hasIframes(content) ? createFragmentedLevel(trimmedFragments) : createCompleteLevel(content);
    };
    var applyToEditor = function (editor, level, before) {
      if (level.type === 'fragmented') {
        Fragments.write(level.fragments, editor.getBody());
      } else {
        editor.setContent(level.content, { format: 'raw' });
      }
      editor.selection.moveToBookmark(before ? level.beforeBookmark : level.bookmark);
    };
    var getLevelContent = function (level) {
      return level.type === 'fragmented' ? level.fragments.join('') : level.content;
    };
    var getCleanLevelContent = function (level) {
      var elm = Element$$1.fromTag('body', lazyTempDocument());
      set$2(elm, getLevelContent(level));
      each(descendants$1(elm, '*[data-mce-bogus]'), unwrap);
      return get$5(elm);
    };
    var hasEqualContent = function (level1, level2) {
      return getLevelContent(level1) === getLevelContent(level2);
    };
    var hasEqualCleanedContent = function (level1, level2) {
      return getCleanLevelContent(level1) === getCleanLevelContent(level2);
    };
    var isEq$3 = function (level1, level2) {
      if (!level1 || !level2) {
        return false;
      } else if (hasEqualContent(level1, level2)) {
        return true;
      } else {
        return hasEqualCleanedContent(level1, level2);
      }
    };
    var Levels = {
      createFragmentedLevel: createFragmentedLevel,
      createCompleteLevel: createCompleteLevel,
      createFromEditor: createFromEditor,
      applyToEditor: applyToEditor,
      isEq: isEq$3
    };

    function UndoManager (editor) {
      var self = this, index = 0, data = [], beforeBookmark, isFirstTypedCharacter, locks = 0;
      var isUnlocked = function () {
        return locks === 0;
      };
      var setTyping = function (typing) {
        if (isUnlocked()) {
          self.typing = typing;
        }
      };
      var setDirty = function (state) {
        editor.setDirty(state);
      };
      var addNonTypingUndoLevel = function (e) {
        setTyping(false);
        self.add({}, e);
      };
      var endTyping = function () {
        if (self.typing) {
          setTyping(false);
          self.add();
        }
      };
      editor.on('init', function () {
        self.add();
      });
      editor.on('BeforeExecCommand', function (e) {
        var cmd = e.command;
        if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
          endTyping();
          self.beforeChange();
        }
      });
      editor.on('ExecCommand', function (e) {
        var cmd = e.command;
        if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
          addNonTypingUndoLevel(e);
        }
      });
      editor.on('ObjectResizeStart Cut', function () {
        self.beforeChange();
      });
      editor.on('SaveContent ObjectResized blur', addNonTypingUndoLevel);
      editor.on('DragEnd', addNonTypingUndoLevel);
      editor.on('KeyUp', function (e) {
        var keyCode = e.keyCode;
        if (e.isDefaultPrevented()) {
          return;
        }
        if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45 || e.ctrlKey) {
          addNonTypingUndoLevel();
          editor.nodeChanged();
        }
        if (keyCode === 46 || keyCode === 8) {
          editor.nodeChanged();
        }
        if (isFirstTypedCharacter && self.typing && Levels.isEq(Levels.createFromEditor(editor), data[0]) === false) {
          if (editor.isDirty() === false) {
            setDirty(true);
            editor.fire('change', {
              level: data[0],
              lastLevel: null
            });
          }
          editor.fire('TypingUndo');
          isFirstTypedCharacter = false;
          editor.nodeChanged();
        }
      });
      editor.on('KeyDown', function (e) {
        var keyCode = e.keyCode;
        if (e.isDefaultPrevented()) {
          return;
        }
        if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45) {
          if (self.typing) {
            addNonTypingUndoLevel(e);
          }
          return;
        }
        var modKey = e.ctrlKey && !e.altKey || e.metaKey;
        if ((keyCode < 16 || keyCode > 20) && keyCode !== 224 && keyCode !== 91 && !self.typing && !modKey) {
          self.beforeChange();
          setTyping(true);
          self.add({}, e);
          isFirstTypedCharacter = true;
        }
      });
      editor.on('MouseDown', function (e) {
        if (self.typing) {
          addNonTypingUndoLevel(e);
        }
      });
      var isInsertReplacementText = function (event) {
        return event.inputType === 'insertReplacementText';
      };
      var isInsertTextDataNull = function (event) {
        return event.inputType === 'insertText' && event.data === null;
      };
      editor.on('input', function (e) {
        if (e.inputType && (isInsertReplacementText(e) || isInsertTextDataNull(e))) {
          addNonTypingUndoLevel(e);
        }
      });
      editor.addShortcut('meta+z', '', 'Undo');
      editor.addShortcut('meta+y,meta+shift+z', '', 'Redo');
      editor.on('AddUndo Undo Redo ClearUndos', function (e) {
        if (!e.isDefaultPrevented()) {
          editor.nodeChanged();
        }
      });
      self = {
        data: data,
        typing: false,
        beforeChange: function () {
          if (isUnlocked()) {
            beforeBookmark = GetBookmark.getUndoBookmark(editor.selection);
          }
        },
        add: function (level, event) {
          var i;
          var settings = editor.settings;
          var lastLevel, currentLevel;
          currentLevel = Levels.createFromEditor(editor);
          level = level || {};
          level = Tools.extend(level, currentLevel);
          if (isUnlocked() === false || editor.removed) {
            return null;
          }
          lastLevel = data[index];
          if (editor.fire('BeforeAddUndo', {
              level: level,
              lastLevel: lastLevel,
              originalEvent: event
            }).isDefaultPrevented()) {
            return null;
          }
          if (lastLevel && Levels.isEq(lastLevel, level)) {
            return null;
          }
          if (data[index]) {
            data[index].beforeBookmark = beforeBookmark;
          }
          if (settings.custom_undo_redo_levels) {
            if (data.length > settings.custom_undo_redo_levels) {
              for (i = 0; i < data.length - 1; i++) {
                data[i] = data[i + 1];
              }
              data.length--;
              index = data.length;
            }
          }
          level.bookmark = GetBookmark.getUndoBookmark(editor.selection);
          if (index < data.length - 1) {
            data.length = index + 1;
          }
          data.push(level);
          index = data.length - 1;
          var args = {
            level: level,
            lastLevel: lastLevel,
            originalEvent: event
          };
          editor.fire('AddUndo', args);
          if (index > 0) {
            setDirty(true);
            editor.fire('change', args);
          }
          return level;
        },
        undo: function () {
          var level;
          if (self.typing) {
            self.add();
            self.typing = false;
            setTyping(false);
          }
          if (index > 0) {
            level = data[--index];
            Levels.applyToEditor(editor, level, true);
            setDirty(true);
            editor.fire('undo', { level: level });
          }
          return level;
        },
        redo: function () {
          var level;
          if (index < data.length - 1) {
            level = data[++index];
            Levels.applyToEditor(editor, level, false);
            setDirty(true);
            editor.fire('redo', { level: level });
          }
          return level;
        },
        clear: function () {
          data = [];
          index = 0;
          self.typing = false;
          self.data = data;
          editor.fire('ClearUndos');
        },
        hasUndo: function () {
          return index > 0 || self.typing && data[0] && !Levels.isEq(Levels.createFromEditor(editor), data[0]);
        },
        hasRedo: function () {
          return index < data.length - 1 && !self.typing;
        },
        transact: function (callback) {
          endTyping();
          self.beforeChange();
          self.ignore(callback);
          return self.add();
        },
        ignore: function (callback) {
          try {
            locks++;
            callback();
          } finally {
            locks--;
          }
        },
        extra: function (callback1, callback2) {
          var lastLevel, bookmark;
          if (self.transact(callback1)) {
            bookmark = data[index].bookmark;
            lastLevel = data[index - 1];
            Levels.applyToEditor(editor, lastLevel, true);
            if (self.transact(callback2)) {
              data[index - 1].beforeBookmark = bookmark;
            }
          }
        }
      };
      return self;
    }

    var isEq$4 = FormatUtils.isEq;
    var matchesUnInheritedFormatSelector = function (ed, node, name) {
      var formatList = ed.formatter.get(name);
      if (formatList) {
        for (var i = 0; i < formatList.length; i++) {
          if (formatList[i].inherit === false && ed.dom.is(node, formatList[i].selector)) {
            return true;
          }
        }
      }
      return false;
    };
    var matchParents = function (editor, node, name, vars) {
      var root = editor.dom.getRoot();
      if (node === root) {
        return false;
      }
      node = editor.dom.getParent(node, function (node) {
        if (matchesUnInheritedFormatSelector(editor, node, name)) {
          return true;
        }
        return node.parentNode === root || !!matchNode(editor, node, name, vars, true);
      });
      return matchNode(editor, node, name, vars);
    };
    var matchName = function (dom, node, format) {
      if (isEq$4(node, format.inline)) {
        return true;
      }
      if (isEq$4(node, format.block)) {
        return true;
      }
      if (format.selector) {
        return node.nodeType === 1 && dom.is(node, format.selector);
      }
    };
    var matchItems = function (dom, node, format, itemName, similar, vars) {
      var key, value;
      var items = format[itemName];
      var i;
      if (format.onmatch) {
        return format.onmatch(node, format, itemName);
      }
      if (items) {
        if (typeof items.length === 'undefined') {
          for (key in items) {
            if (items.hasOwnProperty(key)) {
              if (itemName === 'attributes') {
                value = dom.getAttrib(node, key);
              } else {
                value = FormatUtils.getStyle(dom, node, key);
              }
              if (similar && !value && !format.exact) {
                return;
              }
              if ((!similar || format.exact) && !isEq$4(value, FormatUtils.normalizeStyleValue(dom, FormatUtils.replaceVars(items[key], vars), key))) {
                return;
              }
            }
          }
        } else {
          for (i = 0; i < items.length; i++) {
            if (itemName === 'attributes' ? dom.getAttrib(node, items[i]) : FormatUtils.getStyle(dom, node, items[i])) {
              return format;
            }
          }
        }
      }
      return format;
    };
    var matchNode = function (ed, node, name, vars, similar) {
      var formatList = ed.formatter.get(name);
      var format, i, x, classes;
      var dom = ed.dom;
      if (formatList && node) {
        for (i = 0; i < formatList.length; i++) {
          format = formatList[i];
          if (matchName(ed.dom, node, format) && matchItems(dom, node, format, 'attributes', similar, vars) && matchItems(dom, node, format, 'styles', similar, vars)) {
            if (classes = format.classes) {
              for (x = 0; x < classes.length; x++) {
                if (!ed.dom.hasClass(node, classes[x])) {
                  return;
                }
              }
            }
            return format;
          }
        }
      }
    };
    var match = function (editor, name, vars, node) {
      var startNode;
      if (node) {
        return matchParents(editor, node, name, vars);
      }
      node = editor.selection.getNode();
      if (matchParents(editor, node, name, vars)) {
        return true;
      }
      startNode = editor.selection.getStart();
      if (startNode !== node) {
        if (matchParents(editor, startNode, name, vars)) {
          return true;
        }
      }
      return false;
    };
    var matchAll = function (editor, names, vars) {
      var startElement;
      var matchedFormatNames = [];
      var checkedMap = {};
      startElement = editor.selection.getStart();
      editor.dom.getParent(startElement, function (node) {
        var i, name;
        for (i = 0; i < names.length; i++) {
          name = names[i];
          if (!checkedMap[name] && matchNode(editor, node, name, vars)) {
            checkedMap[name] = true;
            matchedFormatNames.push(name);
          }
        }
      }, editor.dom.getRoot());
      return matchedFormatNames;
    };
    var canApply = function (editor, name) {
      var formatList = editor.formatter.get(name);
      var startNode, parents, i, x, selector;
      var dom = editor.dom;
      if (formatList) {
        startNode = editor.selection.getStart();
        parents = FormatUtils.getParents(dom, startNode);
        for (x = formatList.length - 1; x >= 0; x--) {
          selector = formatList[x].selector;
          if (!selector || formatList[x].defaultBlock) {
            return true;
          }
          for (i = parents.length - 1; i >= 0; i--) {
            if (dom.is(parents[i], selector)) {
              return true;
            }
          }
        }
      }
      return false;
    };
    var MatchFormat = {
      matchNode: matchNode,
      matchName: matchName,
      match: match,
      matchAll: matchAll,
      canApply: canApply,
      matchesUnInheritedFormatSelector: matchesUnInheritedFormatSelector
    };

    var splitText = function (node, offset) {
      return node.splitText(offset);
    };
    var split$1 = function (rng) {
      var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset;
      if (startContainer === endContainer && NodeType.isText(startContainer)) {
        if (startOffset > 0 && startOffset < startContainer.nodeValue.length) {
          endContainer = splitText(startContainer, startOffset);
          startContainer = endContainer.previousSibling;
          if (endOffset > startOffset) {
            endOffset = endOffset - startOffset;
            startContainer = endContainer = splitText(endContainer, endOffset).previousSibling;
            endOffset = endContainer.nodeValue.length;
            startOffset = 0;
          } else {
            endOffset = 0;
          }
        }
      } else {
        if (NodeType.isText(startContainer) && startOffset > 0 && startOffset < startContainer.nodeValue.length) {
          startContainer = splitText(startContainer, startOffset);
          startOffset = 0;
        }
        if (NodeType.isText(endContainer) && endOffset > 0 && endOffset < endContainer.nodeValue.length) {
          endContainer = splitText(endContainer, endOffset).previousSibling;
          endOffset = endContainer.nodeValue.length;
        }
      }
      return {
        startContainer: startContainer,
        startOffset: startOffset,
        endContainer: endContainer,
        endOffset: endOffset
      };
    };
    var SplitRange = { split: split$1 };

    var ZWSP$1 = Zwsp.ZWSP, CARET_ID$1 = '_mce_caret';
    var importNode = function (ownerDocument, node) {
      return ownerDocument.importNode(node, true);
    };
    var getEmptyCaretContainers = function (node) {
      var nodes = [];
      while (node) {
        if (node.nodeType === 3 && node.nodeValue !== ZWSP$1 || node.childNodes.length > 1) {
          return [];
        }
        if (node.nodeType === 1) {
          nodes.push(node);
        }
        node = node.firstChild;
      }
      return nodes;
    };
    var isCaretContainerEmpty = function (node) {
      return getEmptyCaretContainers(node).length > 0;
    };
    var findFirstTextNode = function (node) {
      var walker;
      if (node) {
        walker = new TreeWalker(node, node);
        for (node = walker.current(); node; node = walker.next()) {
          if (node.nodeType === 3) {
            return node;
          }
        }
      }
      return null;
    };
    var createCaretContainer = function (fill) {
      var caretContainer = Element$$1.fromTag('span');
      setAll(caretContainer, {
        'id': CARET_ID$1,
        'data-mce-bogus': '1',
        'data-mce-type': 'format-caret'
      });
      if (fill) {
        append(caretContainer, Element$$1.fromText(ZWSP$1));
      }
      return caretContainer;
    };
    var trimZwspFromCaretContainer = function (caretContainerNode) {
      var textNode = findFirstTextNode(caretContainerNode);
      if (textNode && textNode.nodeValue.charAt(0) === ZWSP$1) {
        textNode.deleteData(0, 1);
      }
      return textNode;
    };
    var removeCaretContainerNode = function (editor, node, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true;
      }
      var dom = editor.dom, selection = editor.selection;
      if (isCaretContainerEmpty(node)) {
        DeleteElement.deleteElement(editor, false, Element$$1.fromDom(node), moveCaret);
      } else {
        var rng = selection.getRng();
        var block = dom.getParent(node, dom.isBlock);
        var textNode = trimZwspFromCaretContainer(node);
        if (rng.startContainer === textNode && rng.startOffset > 0) {
          rng.setStart(textNode, rng.startOffset - 1);
        }
        if (rng.endContainer === textNode && rng.endOffset > 0) {
          rng.setEnd(textNode, rng.endOffset - 1);
        }
        dom.remove(node, true);
        if (block && dom.isEmpty(block)) {
          PaddingBr.fillWithPaddingBr(Element$$1.fromDom(block));
        }
        selection.setRng(rng);
      }
    };
    var removeCaretContainer = function (editor, node, moveCaret) {
      if (moveCaret === void 0) {
        moveCaret = true;
      }
      var dom = editor.dom, selection = editor.selection;
      if (!node) {
        node = getParentCaretContainer(editor.getBody(), selection.getStart());
        if (!node) {
          while (node = dom.get(CARET_ID$1)) {
            removeCaretContainerNode(editor, node, false);
          }
        }
      } else {
        removeCaretContainerNode(editor, node, moveCaret);
      }
    };
    var insertCaretContainerNode = function (editor, caretContainer, formatNode) {
      var dom = editor.dom, block = dom.getParent(formatNode, Fun.curry(FormatUtils.isTextBlock, editor));
      if (block && dom.isEmpty(block)) {
        formatNode.parentNode.replaceChild(caretContainer, formatNode);
      } else {
        PaddingBr.removeTrailingBr(Element$$1.fromDom(formatNode));
        if (dom.isEmpty(formatNode)) {
          formatNode.parentNode.replaceChild(caretContainer, formatNode);
        } else {
          dom.insertAfter(caretContainer, formatNode);
        }
      }
    };
    var appendNode = function (parentNode, node) {
      parentNode.appendChild(node);
      return node;
    };
    var insertFormatNodesIntoCaretContainer = function (formatNodes, caretContainer) {
      var innerMostFormatNode = foldr(formatNodes, function (parentNode, formatNode) {
        return appendNode(parentNode, formatNode.cloneNode(false));
      }, caretContainer);
      return appendNode(innerMostFormatNode, innerMostFormatNode.ownerDocument.createTextNode(ZWSP$1));
    };
    var applyCaretFormat = function (editor, name$$1, vars) {
      var rng, caretContainer, textNode, offset, bookmark, container, text;
      var selection = editor.selection;
      rng = selection.getRng(true);
      offset = rng.startOffset;
      container = rng.startContainer;
      text = container.nodeValue;
      caretContainer = getParentCaretContainer(editor.getBody(), selection.getStart());
      if (caretContainer) {
        textNode = findFirstTextNode(caretContainer);
      }
      var wordcharRegex = /[^\s\u00a0\u00ad\u200b\ufeff]/;
      if (text && offset > 0 && offset < text.length && wordcharRegex.test(text.charAt(offset)) && wordcharRegex.test(text.charAt(offset - 1))) {
        bookmark = selection.getBookmark();
        rng.collapse(true);
        rng = ExpandRange.expandRng(editor, rng, editor.formatter.get(name$$1));
        rng = SplitRange.split(rng);
        editor.formatter.apply(name$$1, vars, rng);
        selection.moveToBookmark(bookmark);
      } else {
        if (!caretContainer || textNode.nodeValue !== ZWSP$1) {
          caretContainer = importNode(editor.getDoc(), createCaretContainer(true).dom());
          textNode = caretContainer.firstChild;
          rng.insertNode(caretContainer);
          offset = 1;
          editor.formatter.apply(name$$1, vars, caretContainer);
        } else {
          editor.formatter.apply(name$$1, vars, caretContainer);
        }
        selection.setCursorLocation(textNode, offset);
      }
    };
    var removeCaretFormat = function (editor, name$$1, vars, similar) {
      var dom = editor.dom, selection = editor.selection;
      var container, offset, bookmark;
      var hasContentAfter, node, formatNode;
      var parents = [], rng = selection.getRng();
      var caretContainer;
      container = rng.startContainer;
      offset = rng.startOffset;
      node = container;
      if (container.nodeType === 3) {
        if (offset !== container.nodeValue.length) {
          hasContentAfter = true;
        }
        node = node.parentNode;
      }
      while (node) {
        if (MatchFormat.matchNode(editor, node, name$$1, vars, similar)) {
          formatNode = node;
          break;
        }
        if (node.nextSibling) {
          hasContentAfter = true;
        }
        parents.push(node);
        node = node.parentNode;
      }
      if (!formatNode) {
        return;
      }
      if (hasContentAfter) {
        bookmark = selection.getBookmark();
        rng.collapse(true);
        var expandedRng = ExpandRange.expandRng(editor, rng, editor.formatter.get(name$$1), true);
        expandedRng = SplitRange.split(expandedRng);
        editor.formatter.remove(name$$1, vars, expandedRng);
        selection.moveToBookmark(bookmark);
      } else {
        caretContainer = getParentCaretContainer(editor.getBody(), formatNode);
        var newCaretContainer = createCaretContainer(false).dom();
        var caretNode = insertFormatNodesIntoCaretContainer(parents, newCaretContainer);
        if (caretContainer) {
          insertCaretContainerNode(editor, newCaretContainer, caretContainer);
        } else {
          insertCaretContainerNode(editor, newCaretContainer, formatNode);
        }
        removeCaretContainerNode(editor, caretContainer, false);
        selection.setCursorLocation(caretNode, 1);
        if (dom.isEmpty(formatNode)) {
          dom.remove(formatNode);
        }
      }
    };
    var disableCaretContainer = function (editor, keyCode) {
      var selection = editor.selection, body = editor.getBody();
      removeCaretContainer(editor, null, false);
      if ((keyCode === 8 || keyCode === 46) && selection.isCollapsed() && selection.getStart().innerHTML === ZWSP$1) {
        removeCaretContainer(editor, getParentCaretContainer(body, selection.getStart()));
      }
      if (keyCode === 37 || keyCode === 39) {
        removeCaretContainer(editor, getParentCaretContainer(body, selection.getStart()));
      }
    };
    var setup$4 = function (editor) {
      editor.on('mouseup keydown', function (e) {
        disableCaretContainer(editor, e.keyCode);
      });
    };
    var replaceWithCaretFormat = function (targetNode, formatNodes) {
      var caretContainer = createCaretContainer(false);
      var innerMost = insertFormatNodesIntoCaretContainer(formatNodes, caretContainer.dom());
      before(Element$$1.fromDom(targetNode), caretContainer);
      remove$2(Element$$1.fromDom(targetNode));
      return CaretPosition$1(innerMost, 0);
    };
    var isFormatElement = function (editor, element) {
      var inlineElements = editor.schema.getTextInlineElements();
      return inlineElements.hasOwnProperty(name(element)) && !isCaretNode(element.dom()) && !NodeType.isBogus(element.dom());
    };
    var isEmptyCaretFormatElement = function (element) {
      return isCaretNode(element.dom()) && isCaretContainerEmpty(element.dom());
    };

    var postProcessHooks = {}, filter$2 = Arr.filter, each$c = Arr.each;
    var addPostProcessHook = function (name, hook) {
      var hooks = postProcessHooks[name];
      if (!hooks) {
        postProcessHooks[name] = hooks = [];
      }
      postProcessHooks[name].push(hook);
    };
    var postProcess = function (name, editor) {
      each$c(postProcessHooks[name], function (hook) {
        hook(editor);
      });
    };
    addPostProcessHook('pre', function (editor) {
      var rng = editor.selection.getRng();
      var isPre, blocks;
      var hasPreSibling = function (pre) {
        return isPre(pre.previousSibling) && Arr.indexOf(blocks, pre.previousSibling) !== -1;
      };
      var joinPre = function (pre1, pre2) {
        DomQuery(pre2).remove();
        DomQuery(pre1).append('<br><br>').append(pre2.childNodes);
      };
      isPre = NodeType.matchNodeNames('pre');
      if (!rng.collapsed) {
        blocks = editor.selection.getSelectedBlocks();
        each$c(filter$2(filter$2(blocks, isPre), hasPreSibling), function (pre) {
          joinPre(pre.previousSibling, pre);
        });
      }
    });
    var Hooks = { postProcess: postProcess };

    var MCE_ATTR_RE = /^(src|href|style)$/;
    var each$d = Tools.each;
    var isEq$5 = FormatUtils.isEq;
    var isTableCell$4 = function (node) {
      return /^(TH|TD)$/.test(node.nodeName);
    };
    var getContainer = function (ed, rng, start) {
      var container, offset, lastIdx;
      container = rng[start ? 'startContainer' : 'endContainer'];
      offset = rng[start ? 'startOffset' : 'endOffset'];
      if (NodeType.isElement(container)) {
        lastIdx = container.childNodes.length - 1;
        if (!start && offset) {
          offset--;
        }
        container = container.childNodes[offset > lastIdx ? lastIdx : offset];
      }
      if (NodeType.isText(container) && start && offset >= container.nodeValue.length) {
        container = new TreeWalker(container, ed.getBody()).next() || container;
      }
      if (NodeType.isText(container) && !start && offset === 0) {
        container = new TreeWalker(container, ed.getBody()).prev() || container;
      }
      return container;
    };
    var wrap$2 = function (dom, node, name, attrs) {
      var wrapper = dom.create(name, attrs);
      node.parentNode.insertBefore(wrapper, node);
      wrapper.appendChild(node);
      return wrapper;
    };
    var wrapWithSiblings = function (dom, startNode, name, next, attrs) {
      var direction = (next ? 'next' : 'previous') + 'Sibling';
      var wrapper = dom.create(name, attrs);
      startNode.parentNode.insertBefore(wrapper, startNode);
      var nodesToWrap = [startNode];
      var currNode = startNode;
      while (currNode = currNode[direction]) {
        nodesToWrap.push(currNode);
      }
      nodesToWrap.forEach(function (node) {
        return wrapper.appendChild(node);
      });
      return wrapper;
    };
    var matchName$1 = function (dom, node, format) {
      if (isEq$5(node, format.inline)) {
        return true;
      }
      if (isEq$5(node, format.block)) {
        return true;
      }
      if (format.selector) {
        return NodeType.isElement(node) && dom.is(node, format.selector);
      }
    };
    var isColorFormatAndAnchor = function (node, format) {
      return format.links && node.tagName === 'A';
    };
    var find$4 = function (dom, node, next, inc) {
      node = FormatUtils.getNonWhiteSpaceSibling(node, next, inc);
      return !node || (node.nodeName === 'BR' || dom.isBlock(node));
    };
    var removeNode$1 = function (ed, node, format) {
      var parentNode = node.parentNode;
      var rootBlockElm;
      var dom = ed.dom, forcedRootBlock = ed.settings.forced_root_block;
      if (format.block) {
        if (!forcedRootBlock) {
          if (dom.isBlock(node) && !dom.isBlock(parentNode)) {
            if (!find$4(dom, node, false) && !find$4(dom, node.firstChild, true, 1)) {
              node.insertBefore(dom.create('br'), node.firstChild);
            }
            if (!find$4(dom, node, true) && !find$4(dom, node.lastChild, false, 1)) {
              node.appendChild(dom.create('br'));
            }
          }
        } else {
          if (parentNode === dom.getRoot()) {
            if (!format.list_block || !isEq$5(node, format.list_block)) {
              each$d(Tools.grep(node.childNodes), function (node) {
                if (FormatUtils.isValid(ed, forcedRootBlock, node.nodeName.toLowerCase())) {
                  if (!rootBlockElm) {
                    rootBlockElm = wrap$2(dom, node, forcedRootBlock);
                    dom.setAttribs(rootBlockElm, ed.settings.forced_root_block_attrs);
                  } else {
                    rootBlockElm.appendChild(node);
                  }
                } else {
                  rootBlockElm = 0;
                }
              });
            }
          }
        }
      }
      if (format.selector && format.inline && !isEq$5(format.inline, node)) {
        return;
      }
      dom.remove(node, 1);
    };
    var removeFormat = function (ed, format, vars, node, compareNode) {
      var i, attrs, stylesModified;
      var dom = ed.dom;
      if (!matchName$1(dom, node, format) && !isColorFormatAndAnchor(node, format)) {
        return false;
      }
      if (format.remove !== 'all') {
        each$d(format.styles, function (value, name) {
          value = FormatUtils.normalizeStyleValue(dom, FormatUtils.replaceVars(value, vars), name);
          if (typeof name === 'number') {
            name = value;
            compareNode = 0;
          }
          if (format.remove_similar || (!compareNode || isEq$5(FormatUtils.getStyle(dom, compareNode, name), value))) {
            dom.setStyle(node, name, '');
          }
          stylesModified = 1;
        });
        if (stylesModified && dom.getAttrib(node, 'style') === '') {
          node.removeAttribute('style');
          node.removeAttribute('data-mce-style');
        }
        each$d(format.attributes, function (value, name) {
          var valueOut;
          value = FormatUtils.replaceVars(value, vars);
          if (typeof name === 'number') {
            name = value;
            compareNode = 0;
          }
          if (!compareNode || isEq$5(dom.getAttrib(compareNode, name), value)) {
            if (name === 'class') {
              value = dom.getAttrib(node, name);
              if (value) {
                valueOut = '';
                each$d(value.split(/\s+/), function (cls) {
                  if (/mce\-\w+/.test(cls)) {
                    valueOut += (valueOut ? ' ' : '') + cls;
                  }
                });
                if (valueOut) {
                  dom.setAttrib(node, name, valueOut);
                  return;
                }
              }
            }
            if (name === 'class') {
              node.removeAttribute('className');
            }
            if (MCE_ATTR_RE.test(name)) {
              node.removeAttribute('data-mce-' + name);
            }
            node.removeAttribute(name);
          }
        });
        each$d(format.classes, function (value) {
          value = FormatUtils.replaceVars(value, vars);
          if (!compareNode || dom.hasClass(compareNode, value)) {
            dom.removeClass(node, value);
          }
        });
        attrs = dom.getAttribs(node);
        for (i = 0; i < attrs.length; i++) {
          var attrName = attrs[i].nodeName;
          if (attrName.indexOf('_') !== 0 && attrName.indexOf('data-') !== 0) {
            return false;
          }
        }
      }
      if (format.remove !== 'none') {
        removeNode$1(ed, node, format);
        return true;
      }
    };
    var findFormatRoot = function (editor, container, name, vars, similar) {
      var formatRoot;
      each$d(FormatUtils.getParents(editor.dom, container.parentNode).reverse(), function (parent) {
        var format;
        if (!formatRoot && parent.id !== '_start' && parent.id !== '_end') {
          format = MatchFormat.matchNode(editor, parent, name, vars, similar);
          if (format && format.split !== false) {
            formatRoot = parent;
          }
        }
      });
      return formatRoot;
    };
    var wrapAndSplit = function (editor, formatList, formatRoot, container, target, split, format, vars) {
      var parent, clone, lastClone, firstClone, i, formatRootParent;
      var dom = editor.dom;
      if (formatRoot) {
        formatRootParent = formatRoot.parentNode;
        for (parent = container.parentNode; parent && parent !== formatRootParent; parent = parent.parentNode) {
          clone = dom.clone(parent, false);
          for (i = 0; i < formatList.length; i++) {
            if (removeFormat(editor, formatList[i], vars, clone, clone)) {
              clone = 0;
              break;
            }
          }
          if (clone) {
            if (lastClone) {
              clone.appendChild(lastClone);
            }
            if (!firstClone) {
              firstClone = clone;
            }
            lastClone = clone;
          }
        }
        if (split && (!format.mixed || !dom.isBlock(formatRoot))) {
          container = dom.split(formatRoot, container);
        }
        if (lastClone) {
          target.parentNode.insertBefore(lastClone, target);
          firstClone.appendChild(target);
        }
      }
      return container;
    };
    var remove$8 = function (ed, name, vars, node, similar) {
      var formatList = ed.formatter.get(name), format = formatList[0];
      var bookmark, rng, contentEditable = true;
      var dom = ed.dom;
      var selection = ed.selection;
      var splitToFormatRoot = function (container) {
        var formatRoot = findFormatRoot(ed, container, name, vars, similar);
        return wrapAndSplit(ed, formatList, formatRoot, container, container, true, format, vars);
      };
      var isRemoveBookmarkNode = function (node) {
        return Bookmarks.isBookmarkNode(node) && NodeType.isElement(node) && (node.id === '_start' || node.id === '_end');
      };
      var process = function (node) {
        var children, i, l, lastContentEditable, hasContentEditableState;
        if (NodeType.isElement(node) && dom.getContentEditable(node)) {
          lastContentEditable = contentEditable;
          contentEditable = dom.getContentEditable(node) === 'true';
          hasContentEditableState = true;
        }
        children = Tools.grep(node.childNodes);
        if (contentEditable && !hasContentEditableState) {
          for (i = 0, l = formatList.length; i < l; i++) {
            if (removeFormat(ed, formatList[i], vars, node, node)) {
              break;
            }
          }
        }
        if (format.deep) {
          if (children.length) {
            for (i = 0, l = children.length; i < l; i++) {
              process(children[i]);
            }
            if (hasContentEditableState) {
              contentEditable = lastContentEditable;
            }
          }
        }
      };
      var unwrap = function (start) {
        var node = dom.get(start ? '_start' : '_end');
        var out = node[start ? 'firstChild' : 'lastChild'];
        if (isRemoveBookmarkNode(out)) {
          out = out[start ? 'firstChild' : 'lastChild'];
        }
        if (NodeType.isText(out) && out.data.length === 0) {
          out = start ? node.previousSibling || node.nextSibling : node.nextSibling || node.previousSibling;
        }
        dom.remove(node, true);
        return out;
      };
      var removeRngStyle = function (rng) {
        var startContainer, endContainer;
        var commonAncestorContainer = rng.commonAncestorContainer;
        rng = ExpandRange.expandRng(ed, rng, formatList, true);
        if (format.split) {
          rng = SplitRange.split(rng);
          startContainer = getContainer(ed, rng, true);
          endContainer = getContainer(ed, rng);
          if (startContainer !== endContainer) {
            if (/^(TR|TH|TD)$/.test(startContainer.nodeName) && startContainer.firstChild) {
              if (startContainer.nodeName === 'TR') {
                startContainer = startContainer.firstChild.firstChild || startContainer;
              } else {
                startContainer = startContainer.firstChild || startContainer;
              }
            }
            if (commonAncestorContainer && /^T(HEAD|BODY|FOOT|R)$/.test(commonAncestorContainer.nodeName) && isTableCell$4(endContainer) && endContainer.firstChild) {
              endContainer = endContainer.firstChild || endContainer;
            }
            if (dom.isChildOf(startContainer, endContainer) && startContainer !== endContainer && !dom.isBlock(endContainer) && !isTableCell$4(startContainer) && !isTableCell$4(endContainer)) {
              var wrappedContent = wrapWithSiblings(dom, startContainer, 'span', true, {
                'id': '_start',
                'data-mce-type': 'bookmark'
              });
              splitToFormatRoot(wrappedContent);
              startContainer = unwrap(true);
              return;
            }
            startContainer = wrap$2(dom, startContainer, 'span', {
              'id': '_start',
              'data-mce-type': 'bookmark'
            });
            endContainer = wrap$2(dom, endContainer, 'span', {
              'id': '_end',
              'data-mce-type': 'bookmark'
            });
            splitToFormatRoot(startContainer);
            splitToFormatRoot(endContainer);
            startContainer = unwrap(true);
            endContainer = unwrap();
          } else {
            startContainer = endContainer = splitToFormatRoot(startContainer);
          }
          rng.startContainer = startContainer.parentNode ? startContainer.parentNode : startContainer;
          rng.startOffset = dom.nodeIndex(startContainer);
          rng.endContainer = endContainer.parentNode ? endContainer.parentNode : endContainer;
          rng.endOffset = dom.nodeIndex(endContainer) + 1;
        }
        RangeWalk.walk(dom, rng, function (nodes) {
          each$d(nodes, function (node) {
            process(node);
            if (NodeType.isElement(node) && ed.dom.getStyle(node, 'text-decoration') === 'underline' && node.parentNode && FormatUtils.getTextDecoration(dom, node.parentNode) === 'underline') {
              removeFormat(ed, {
                deep: false,
                exact: true,
                inline: 'span',
                styles: { textDecoration: 'underline' }
              }, null, node);
            }
          });
        });
      };
      if (node) {
        if (node.nodeType) {
          rng = dom.createRng();
          rng.setStartBefore(node);
          rng.setEndAfter(node);
          removeRngStyle(rng);
        } else {
          removeRngStyle(node);
        }
        return;
      }
      if (dom.getContentEditable(selection.getNode()) === 'false') {
        node = selection.getNode();
        for (var i = 0, l = formatList.length; i < l; i++) {
          if (formatList[i].ceFalseOverride) {
            if (removeFormat(ed, formatList[i], vars, node, node)) {
              break;
            }
          }
        }
        return;
      }
      if (!selection.isCollapsed() || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
        bookmark = GetBookmark.getPersistentBookmark(ed.selection, true);
        removeRngStyle(selection.getRng());
        selection.moveToBookmark(bookmark);
        if (format.inline && MatchFormat.match(ed, name, vars, selection.getStart())) {
          FormatUtils.moveStart(dom, selection, selection.getRng());
        }
        ed.nodeChanged();
      } else {
        removeCaretFormat(ed, name, vars, similar);
      }
    };
    var RemoveFormat = {
      removeFormat: removeFormat,
      remove: remove$8
    };

    var each$e = Tools.each;
    var isElementNode = function (node) {
      return node && node.nodeType === 1 && !Bookmarks.isBookmarkNode(node) && !isCaretNode(node) && !NodeType.isBogus(node);
    };
    var findElementSibling = function (node, siblingName) {
      var sibling;
      for (sibling = node; sibling; sibling = sibling[siblingName]) {
        if (sibling.nodeType === 3 && sibling.nodeValue.length !== 0) {
          return node;
        }
        if (sibling.nodeType === 1 && !Bookmarks.isBookmarkNode(sibling)) {
          return sibling;
        }
      }
      return node;
    };
    var mergeSiblingsNodes = function (dom, prev, next) {
      var sibling, tmpSibling;
      var elementUtils = new ElementUtils(dom);
      if (prev && next) {
        prev = findElementSibling(prev, 'previousSibling');
        next = findElementSibling(next, 'nextSibling');
        if (elementUtils.compare(prev, next)) {
          for (sibling = prev.nextSibling; sibling && sibling !== next;) {
            tmpSibling = sibling;
            sibling = sibling.nextSibling;
            prev.appendChild(tmpSibling);
          }
          dom.remove(next);
          Tools.each(Tools.grep(next.childNodes), function (node) {
            prev.appendChild(node);
          });
          return prev;
        }
      }
      return next;
    };
    var processChildElements = function (node, filter, process) {
      each$e(node.childNodes, function (node) {
        if (isElementNode(node)) {
          if (filter(node)) {
            process(node);
          }
          if (node.hasChildNodes()) {
            processChildElements(node, filter, process);
          }
        }
      });
    };
    var hasStyle = function (dom, name) {
      return curry(function (name, node) {
        return !!(node && FormatUtils.getStyle(dom, node, name));
      }, name);
    };
    var applyStyle = function (dom, name, value) {
      return curry(function (name, value, node) {
        dom.setStyle(node, name, value);
        if (node.getAttribute('style') === '') {
          node.removeAttribute('style');
        }
        unwrapEmptySpan(dom, node);
      }, name, value);
    };
    var unwrapEmptySpan = function (dom, node) {
      if (node.nodeName === 'SPAN' && dom.getAttribs(node).length === 0) {
        dom.remove(node, true);
      }
    };
    var processUnderlineAndColor = function (dom, node) {
      var textDecoration;
      if (node.nodeType === 1 && node.parentNode && node.parentNode.nodeType === 1) {
        textDecoration = FormatUtils.getTextDecoration(dom, node.parentNode);
        if (dom.getStyle(node, 'color') && textDecoration) {
          dom.setStyle(node, 'text-decoration', textDecoration);
        } else if (dom.getStyle(node, 'text-decoration') === textDecoration) {
          dom.setStyle(node, 'text-decoration', null);
        }
      }
    };
    var mergeUnderlineAndColor = function (dom, format, vars, node) {
      if (format.styles.color || format.styles.textDecoration) {
        Tools.walk(node, curry(processUnderlineAndColor, dom), 'childNodes');
        processUnderlineAndColor(dom, node);
      }
    };
    var mergeBackgroundColorAndFontSize = function (dom, format, vars, node) {
      if (format.styles && format.styles.backgroundColor) {
        processChildElements(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'backgroundColor', FormatUtils.replaceVars(format.styles.backgroundColor, vars)));
      }
    };
    var mergeSubSup = function (dom, format, vars, node) {
      if (format.inline === 'sub' || format.inline === 'sup') {
        processChildElements(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'fontSize', ''));
        dom.remove(dom.select(format.inline === 'sup' ? 'sub' : 'sup', node), true);
      }
    };
    var mergeSiblings = function (dom, format, vars, node) {
      if (node && format.merge_siblings !== false) {
        node = mergeSiblingsNodes(dom, FormatUtils.getNonWhiteSpaceSibling(node), node);
        node = mergeSiblingsNodes(dom, node, FormatUtils.getNonWhiteSpaceSibling(node, true));
      }
    };
    var clearChildStyles = function (dom, format, node) {
      if (format.clear_child_styles) {
        var selector = format.links ? '*:not(a)' : '*';
        each$e(dom.select(selector, node), function (node) {
          if (isElementNode(node)) {
            each$e(format.styles, function (value, name) {
              dom.setStyle(node, name, '');
            });
          }
        });
      }
    };
    var mergeWithChildren = function (editor, formatList, vars, node) {
      each$e(formatList, function (format) {
        each$e(editor.dom.select(format.inline, node), function (child) {
          if (!isElementNode(child)) {
            return;
          }
          RemoveFormat.removeFormat(editor, format, vars, child, format.exact ? child : null);
        });
        clearChildStyles(editor.dom, format, node);
      });
    };
    var mergeWithParents = function (editor, format, name, vars, node) {
      if (MatchFormat.matchNode(editor, node.parentNode, name, vars)) {
        if (RemoveFormat.removeFormat(editor, format, vars, node)) {
          return;
        }
      }
      if (format.merge_with_parents) {
        editor.dom.getParent(node.parentNode, function (parent) {
          if (MatchFormat.matchNode(editor, parent, name, vars)) {
            RemoveFormat.removeFormat(editor, format, vars, node);
            return true;
          }
        });
      }
    };
    var MergeFormats = {
      mergeWithChildren: mergeWithChildren,
      mergeUnderlineAndColor: mergeUnderlineAndColor,
      mergeBackgroundColorAndFontSize: mergeBackgroundColorAndFontSize,
      mergeSubSup: mergeSubSup,
      mergeSiblings: mergeSiblings,
      mergeWithParents: mergeWithParents
    };

    var each$f = Tools.each;
    var isElementNode$1 = function (node) {
      return node && node.nodeType === 1 && !Bookmarks.isBookmarkNode(node) && !isCaretNode(node) && !NodeType.isBogus(node);
    };
    var applyFormat = function (ed, name, vars, node) {
      var formatList = ed.formatter.get(name);
      var format = formatList[0];
      var bookmark, rng;
      var isCollapsed = !node && ed.selection.isCollapsed();
      var dom = ed.dom, selection = ed.selection;
      var setElementFormat = function (elm, fmt) {
        fmt = fmt || format;
        if (elm) {
          if (fmt.onformat) {
            fmt.onformat(elm, fmt, vars, node);
          }
          each$f(fmt.styles, function (value, name) {
            dom.setStyle(elm, name, FormatUtils.replaceVars(value, vars));
          });
          if (fmt.styles) {
            var styleVal = dom.getAttrib(elm, 'style');
            if (styleVal) {
              elm.setAttribute('data-mce-style', styleVal);
            }
          }
          each$f(fmt.attributes, function (value, name) {
            dom.setAttrib(elm, name, FormatUtils.replaceVars(value, vars));
          });
          each$f(fmt.classes, function (value) {
            value = FormatUtils.replaceVars(value, vars);
            if (!dom.hasClass(elm, value)) {
              dom.addClass(elm, value);
            }
          });
        }
      };
      var applyNodeStyle = function (formatList, node) {
        var found = false;
        if (!format.selector) {
          return false;
        }
        each$f(formatList, function (format) {
          if ('collapsed' in format && format.collapsed !== isCollapsed) {
            return;
          }
          if (dom.is(node, format.selector) && !isCaretNode(node)) {
            setElementFormat(node, format);
            found = true;
            return false;
          }
        });
        return found;
      };
      var applyRngStyle = function (dom, rng, bookmark, nodeSpecific) {
        var newWrappers = [];
        var wrapName, wrapElm, contentEditable = true;
        wrapName = format.inline || format.block;
        wrapElm = dom.create(wrapName);
        setElementFormat(wrapElm);
        RangeWalk.walk(dom, rng, function (nodes) {
          var currentWrapElm;
          var process = function (node) {
            var nodeName, parentName, hasContentEditableState, lastContentEditable;
            lastContentEditable = contentEditable;
            nodeName = node.nodeName.toLowerCase();
            parentName = node.parentNode.nodeName.toLowerCase();
            if (node.nodeType === 1 && dom.getContentEditable(node)) {
              lastContentEditable = contentEditable;
              contentEditable = dom.getContentEditable(node) === 'true';
              hasContentEditableState = true;
            }
            if (FormatUtils.isEq(nodeName, 'br')) {
              currentWrapElm = 0;
              if (format.block) {
                dom.remove(node);
              }
              return;
            }
            if (format.wrapper && MatchFormat.matchNode(ed, node, name, vars)) {
              currentWrapElm = 0;
              return;
            }
            if (contentEditable && !hasContentEditableState && format.block && !format.wrapper && FormatUtils.isTextBlock(ed, nodeName) && FormatUtils.isValid(ed, parentName, wrapName)) {
              node = dom.rename(node, wrapName);
              setElementFormat(node);
              newWrappers.push(node);
              currentWrapElm = 0;
              return;
            }
            if (format.selector) {
              var found = applyNodeStyle(formatList, node);
              if (!format.inline || found) {
                currentWrapElm = 0;
                return;
              }
            }
            if (contentEditable && !hasContentEditableState && FormatUtils.isValid(ed, wrapName, nodeName) && FormatUtils.isValid(ed, parentName, wrapName) && !(!nodeSpecific && node.nodeType === 3 && node.nodeValue.length === 1 && node.nodeValue.charCodeAt(0) === 65279) && !isCaretNode(node) && (!format.inline || !dom.isBlock(node))) {
              if (!currentWrapElm) {
                currentWrapElm = dom.clone(wrapElm, false);
                node.parentNode.insertBefore(currentWrapElm, node);
                newWrappers.push(currentWrapElm);
              }
              currentWrapElm.appendChild(node);
            } else {
              currentWrapElm = 0;
              each$f(Tools.grep(node.childNodes), process);
              if (hasContentEditableState) {
                contentEditable = lastContentEditable;
              }
              currentWrapElm = 0;
            }
          };
          each$f(nodes, process);
        });
        if (format.links === true) {
          each$f(newWrappers, function (node) {
            var process = function (node) {
              if (node.nodeName === 'A') {
                setElementFormat(node, format);
              }
              each$f(Tools.grep(node.childNodes), process);
            };
            process(node);
          });
        }
        each$f(newWrappers, function (node) {
          var childCount;
          var getChildCount = function (node) {
            var count = 0;
            each$f(node.childNodes, function (node) {
              if (!FormatUtils.isWhiteSpaceNode(node) && !Bookmarks.isBookmarkNode(node)) {
                count++;
              }
            });
            return count;
          };
          var getChildElementNode = function (root) {
            var child = false;
            each$f(root.childNodes, function (node) {
              if (isElementNode$1(node)) {
                child = node;
                return false;
              }
            });
            return child;
          };
          var mergeStyles = function (node) {
            var child, clone;
            child = getChildElementNode(node);
            if (child && !Bookmarks.isBookmarkNode(child) && MatchFormat.matchName(dom, child, format)) {
              clone = dom.clone(child, false);
              setElementFormat(clone);
              dom.replace(clone, node, true);
              dom.remove(child, 1);
            }
            return clone || node;
          };
          childCount = getChildCount(node);
          if ((newWrappers.length > 1 || !dom.isBlock(node)) && childCount === 0) {
            dom.remove(node, 1);
            return;
          }
          if (format.inline || format.wrapper) {
            if (!format.exact && childCount === 1) {
              node = mergeStyles(node);
            }
            MergeFormats.mergeWithChildren(ed, formatList, vars, node);
            MergeFormats.mergeWithParents(ed, format, name, vars, node);
            MergeFormats.mergeBackgroundColorAndFontSize(dom, format, vars, node);
            MergeFormats.mergeSubSup(dom, format, vars, node);
            MergeFormats.mergeSiblings(dom, format, vars, node);
          }
        });
      };
      if (dom.getContentEditable(selection.getNode()) === 'false') {
        node = selection.getNode();
        for (var i = 0, l = formatList.length; i < l; i++) {
          if (formatList[i].ceFalseOverride && dom.is(node, formatList[i].selector)) {
            setElementFormat(node, formatList[i]);
            return;
          }
        }
        return;
      }
      if (format) {
        if (node) {
          if (node.nodeType) {
            if (!applyNodeStyle(formatList, node)) {
              rng = dom.createRng();
              rng.setStartBefore(node);
              rng.setEndAfter(node);
              applyRngStyle(dom, ExpandRange.expandRng(ed, rng, formatList), null, true);
            }
          } else {
            applyRngStyle(dom, node, null, true);
          }
        } else {
          if (!isCollapsed || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
            var curSelNode = ed.selection.getNode();
            if (!ed.settings.forced_root_block && formatList[0].defaultBlock && !dom.getParent(curSelNode, dom.isBlock)) {
              applyFormat(ed, formatList[0].defaultBlock);
            }
            ed.selection.setRng(RangeNormalizer.normalize(ed.selection.getRng()));
            bookmark = GetBookmark.getPersistentBookmark(ed.selection, true);
            applyRngStyle(dom, ExpandRange.expandRng(ed, selection.getRng(), formatList), bookmark);
            if (format.styles) {
              MergeFormats.mergeUnderlineAndColor(dom, format, vars, curSelNode);
            }
            selection.moveToBookmark(bookmark);
            FormatUtils.moveStart(dom, selection, selection.getRng());
            ed.nodeChanged();
          } else {
            applyCaretFormat(ed, name, vars);
          }
        }
        Hooks.postProcess(name, ed);
      }
    };
    var ApplyFormat = { applyFormat: applyFormat };

    var each$g = Tools.each;
    var setup$5 = function (formatChangeData, editor) {
      var currentFormats = {};
      formatChangeData.set({});
      editor.on('NodeChange', function (e) {
        var parents = FormatUtils.getParents(editor.dom, e.element);
        var matchedFormats = {};
        parents = Tools.grep(parents, function (node) {
          return node.nodeType === 1 && !node.getAttribute('data-mce-bogus');
        });
        each$g(formatChangeData.get(), function (callbacks, format) {
          each$g(parents, function (node) {
            if (editor.formatter.matchNode(node, format, {}, callbacks.similar)) {
              if (!currentFormats[format]) {
                each$g(callbacks, function (callback) {
                  callback(true, {
                    node: node,
                    format: format,
                    parents: parents
                  });
                });
                currentFormats[format] = callbacks;
              }
              matchedFormats[format] = callbacks;
              return false;
            }
            if (MatchFormat.matchesUnInheritedFormatSelector(editor, node, format)) {
              return false;
            }
          });
        });
        each$g(currentFormats, function (callbacks, format) {
          if (!matchedFormats[format]) {
            delete currentFormats[format];
            each$g(callbacks, function (callback) {
              callback(false, {
                node: e.element,
                format: format,
                parents: parents
              });
            });
          }
        });
      });
    };
    var addListeners = function (formatChangeData, formats, callback, similar) {
      var formatChangeItems = formatChangeData.get();
      each$g(formats.split(','), function (format) {
        if (!formatChangeItems[format]) {
          formatChangeItems[format] = [];
          formatChangeItems[format].similar = similar;
        }
        formatChangeItems[format].push(callback);
      });
      formatChangeData.set(formatChangeItems);
    };
    var formatChanged = function (editor, formatChangeState, formats, callback, similar) {
      if (formatChangeState.get() === null) {
        setup$5(formatChangeState, editor);
      }
      addListeners(formatChangeState, formats, callback, similar);
    };
    var FormatChanged = { formatChanged: formatChanged };

    var get$8 = function (dom) {
      var formats = {
        valigntop: [{
            selector: 'td,th',
            styles: { verticalAlign: 'top' }
          }],
        valignmiddle: [{
            selector: 'td,th',
            styles: { verticalAlign: 'middle' }
          }],
        valignbottom: [{
            selector: 'td,th',
            styles: { verticalAlign: 'bottom' }
          }],
        alignleft: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-left',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'left' },
            inherit: false,
            preview: false,
            defaultBlock: 'div'
          },
          {
            selector: 'img,table',
            collapsed: false,
            styles: { float: 'left' },
            preview: 'font-family font-size'
          }
        ],
        aligncenter: [
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'center' },
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div'
          },
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-center',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'img',
            collapsed: false,
            styles: {
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            preview: false
          },
          {
            selector: 'table',
            collapsed: false,
            styles: {
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            preview: 'font-family font-size'
          }
        ],
        alignright: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'align-right',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'right' },
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div'
          },
          {
            selector: 'img,table',
            collapsed: false,
            styles: { float: 'right' },
            preview: 'font-family font-size'
          }
        ],
        alignjustify: [{
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'justify' },
            inherit: false,
            defaultBlock: 'div',
            preview: 'font-family font-size'
          }],
        bold: [
          {
            inline: 'strong',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { fontWeight: 'bold' }
          },
          {
            inline: 'b',
            remove: 'all'
          }
        ],
        italic: [
          {
            inline: 'em',
            remove: 'all'
          },
          {
            inline: 'span',
            styles: { fontStyle: 'italic' }
          },
          {
            inline: 'i',
            remove: 'all'
          }
        ],
        underline: [
          {
            inline: 'span',
            styles: { textDecoration: 'underline' },
            exact: true
          },
          {
            inline: 'u',
            remove: 'all'
          }
        ],
        strikethrough: [
          {
            inline: 'span',
            styles: { textDecoration: 'line-through' },
            exact: true
          },
          {
            inline: 'strike',
            remove: 'all'
          }
        ],
        forecolor: {
          inline: 'span',
          styles: { color: '%value' },
          links: true,
          remove_similar: true,
          clear_child_styles: true
        },
        hilitecolor: {
          inline: 'span',
          styles: { backgroundColor: '%value' },
          links: true,
          remove_similar: true,
          clear_child_styles: true
        },
        fontname: {
          inline: 'span',
          toggle: false,
          styles: { fontFamily: '%value' },
          clear_child_styles: true
        },
        fontsize: {
          inline: 'span',
          toggle: false,
          styles: { fontSize: '%value' },
          clear_child_styles: true
        },
        fontsize_class: {
          inline: 'span',
          attributes: { class: '%value' }
        },
        blockquote: {
          block: 'blockquote',
          wrapper: 1,
          remove: 'all'
        },
        subscript: { inline: 'sub' },
        superscript: { inline: 'sup' },
        code: { inline: 'code' },
        link: {
          inline: 'a',
          selector: 'a',
          remove: 'all',
          split: true,
          deep: true,
          onmatch: function () {
            return true;
          },
          onformat: function (elm, fmt, vars) {
            Tools.each(vars, function (value, key) {
              dom.setAttrib(elm, key, value);
            });
          }
        },
        removeformat: [
          {
            selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
            remove: 'all',
            split: true,
            expand: false,
            block_expand: true,
            deep: true
          },
          {
            selector: 'span',
            attributes: [
              'style',
              'class'
            ],
            remove: 'empty',
            split: true,
            expand: false,
            deep: true
          },
          {
            selector: '*',
            attributes: [
              'style',
              'class'
            ],
            split: false,
            expand: false,
            deep: true
          }
        ]
      };
      Tools.each('p h1 h2 h3 h4 h5 h6 div address pre div dt dd samp'.split(/\s/), function (name) {
        formats[name] = {
          block: name,
          remove: 'all'
        };
      });
      return formats;
    };
    var DefaultFormats = { get: get$8 };

    function FormatRegistry (editor) {
      var formats = {};
      var get = function (name) {
        return name ? formats[name] : formats;
      };
      var register = function (name, format) {
        if (name) {
          if (typeof name !== 'string') {
            Tools.each(name, function (format, name) {
              register(name, format);
            });
          } else {
            format = format.length ? format : [format];
            Tools.each(format, function (format) {
              if (typeof format.deep === 'undefined') {
                format.deep = !format.selector;
              }
              if (typeof format.split === 'undefined') {
                format.split = !format.selector || format.inline;
              }
              if (typeof format.remove === 'undefined' && format.selector && !format.inline) {
                format.remove = 'none';
              }
              if (format.selector && format.inline) {
                format.mixed = true;
                format.block_expand = true;
              }
              if (typeof format.classes === 'string') {
                format.classes = format.classes.split(/\s+/);
              }
            });
            formats[name] = format;
          }
        }
      };
      var unregister = function (name) {
        if (name && formats[name]) {
          delete formats[name];
        }
        return formats;
      };
      register(DefaultFormats.get(editor.dom));
      register(editor.settings.formats);
      return {
        get: get,
        register: register,
        unregister: unregister
      };
    }

    var each$h = Tools.each;
    var dom = DOMUtils$1.DOM;
    var parsedSelectorToHtml = function (ancestry, editor) {
      var elm, item, fragment;
      var schema = editor && editor.schema || Schema({});
      var decorate = function (elm, item) {
        if (item.classes.length) {
          dom.addClass(elm, item.classes.join(' '));
        }
        dom.setAttribs(elm, item.attrs);
      };
      var createElement = function (sItem) {
        var elm;
        item = typeof sItem === 'string' ? {
          name: sItem,
          classes: [],
          attrs: {}
        } : sItem;
        elm = dom.create(item.name);
        decorate(elm, item);
        return elm;
      };
      var getRequiredParent = function (elm, candidate) {
        var name = typeof elm !== 'string' ? elm.nodeName.toLowerCase() : elm;
        var elmRule = schema.getElementRule(name);
        var parentsRequired = elmRule && elmRule.parentsRequired;
        if (parentsRequired && parentsRequired.length) {
          return candidate && Tools.inArray(parentsRequired, candidate) !== -1 ? candidate : parentsRequired[0];
        } else {
          return false;
        }
      };
      var wrapInHtml = function (elm, ancestry, siblings) {
        var parent, parentCandidate, parentRequired;
        var ancestor = ancestry.length > 0 && ancestry[0];
        var ancestorName = ancestor && ancestor.name;
        parentRequired = getRequiredParent(elm, ancestorName);
        if (parentRequired) {
          if (ancestorName === parentRequired) {
            parentCandidate = ancestry[0];
            ancestry = ancestry.slice(1);
          } else {
            parentCandidate = parentRequired;
          }
        } else if (ancestor) {
          parentCandidate = ancestry[0];
          ancestry = ancestry.slice(1);
        } else if (!siblings) {
          return elm;
        }
        if (parentCandidate) {
          parent = createElement(parentCandidate);
          parent.appendChild(elm);
        }
        if (siblings) {
          if (!parent) {
            parent = dom.create('div');
            parent.appendChild(elm);
          }
          Tools.each(siblings, function (sibling) {
            var siblingElm = createElement(sibling);
            parent.insertBefore(siblingElm, elm);
          });
        }
        return wrapInHtml(parent, ancestry, parentCandidate && parentCandidate.siblings);
      };
      if (ancestry && ancestry.length) {
        item = ancestry[0];
        elm = createElement(item);
        fragment = dom.create('div');
        fragment.appendChild(wrapInHtml(elm, ancestry.slice(1), item.siblings));
        return fragment;
      } else {
        return '';
      }
    };
    var selectorToHtml = function (selector, editor) {
      return parsedSelectorToHtml(parseSelector(selector), editor);
    };
    var parseSelectorItem = function (item) {
      var tagName;
      var obj = {
        classes: [],
        attrs: {}
      };
      item = obj.selector = Tools.trim(item);
      if (item !== '*') {
        tagName = item.replace(/(?:([#\.]|::?)([\w\-]+)|(\[)([^\]]+)\]?)/g, function ($0, $1, $2, $3, $4) {
          switch ($1) {
          case '#':
            obj.attrs.id = $2;
            break;
          case '.':
            obj.classes.push($2);
            break;
          case ':':
            if (Tools.inArray('checked disabled enabled read-only required'.split(' '), $2) !== -1) {
              obj.attrs[$2] = $2;
            }
            break;
          }
          if ($3 === '[') {
            var m = $4.match(/([\w\-]+)(?:\=\"([^\"]+))?/);
            if (m) {
              obj.attrs[m[1]] = m[2];
            }
          }
          return '';
        });
      }
      obj.name = tagName || 'div';
      return obj;
    };
    var parseSelector = function (selector) {
      if (!selector || typeof selector !== 'string') {
        return [];
      }
      selector = selector.split(/\s*,\s*/)[0];
      selector = selector.replace(/\s*(~\+|~|\+|>)\s*/g, '$1');
      return Tools.map(selector.split(/(?:>|\s+(?![^\[\]]+\]))/), function (item) {
        var siblings = Tools.map(item.split(/(?:~\+|~|\+)/), parseSelectorItem);
        var obj = siblings.pop();
        if (siblings.length) {
          obj.siblings = siblings;
        }
        return obj;
      }).reverse();
    };
    var getCssText = function (editor, format) {
      var name, previewFrag, previewElm, items;
      var previewCss = '', parentFontSize, previewStyles;
      previewStyles = editor.settings.preview_styles;
      if (previewStyles === false) {
        return '';
      }
      if (typeof previewStyles !== 'string') {
        previewStyles = 'font-family font-size font-weight font-style text-decoration ' + 'text-transform color background-color border border-radius outline text-shadow';
      }
      var removeVars = function (val) {
        return val.replace(/%(\w+)/g, '');
      };
      if (typeof format === 'string') {
        format = editor.formatter.get(format);
        if (!format) {
          return;
        }
        format = format[0];
      }
      if ('preview' in format) {
        previewStyles = format.preview;
        if (previewStyles === false) {
          return '';
        }
      }
      name = format.block || format.inline || 'span';
      items = parseSelector(format.selector);
      if (items.length) {
        if (!items[0].name) {
          items[0].name = name;
        }
        name = format.selector;
        previewFrag = parsedSelectorToHtml(items, editor);
      } else {
        previewFrag = parsedSelectorToHtml([name], editor);
      }
      previewElm = dom.select(name, previewFrag)[0] || previewFrag.firstChild;
      each$h(format.styles, function (value, name) {
        value = removeVars(value);
        if (value) {
          dom.setStyle(previewElm, name, value);
        }
      });
      each$h(format.attributes, function (value, name) {
        value = removeVars(value);
        if (value) {
          dom.setAttrib(previewElm, name, value);
        }
      });
      each$h(format.classes, function (value) {
        value = removeVars(value);
        if (!dom.hasClass(previewElm, value)) {
          dom.addClass(previewElm, value);
        }
      });
      editor.fire('PreviewFormats');
      dom.setStyles(previewFrag, {
        position: 'absolute',
        left: -65535
      });
      editor.getBody().appendChild(previewFrag);
      parentFontSize = dom.getStyle(editor.getBody(), 'fontSize', true);
      parentFontSize = /px$/.test(parentFontSize) ? parseInt(parentFontSize, 10) : 0;
      each$h(previewStyles.split(' '), function (name) {
        var value = dom.getStyle(previewElm, name, true);
        if (name === 'background-color' && /transparent|rgba\s*\([^)]+,\s*0\)/.test(value)) {
          value = dom.getStyle(editor.getBody(), name, true);
          if (dom.toHex(value).toLowerCase() === '#ffffff') {
            return;
          }
        }
        if (name === 'color') {
          if (dom.toHex(value).toLowerCase() === '#000000') {
            return;
          }
        }
        if (name === 'font-size') {
          if (/em|%$/.test(value)) {
            if (parentFontSize === 0) {
              return;
            }
            var numValue = parseFloat(value) / (/%$/.test(value) ? 100 : 1);
            value = numValue * parentFontSize + 'px';
          }
        }
        if (name === 'border' && value) {
          previewCss += 'padding:0 2px;';
        }
        previewCss += name + ':' + value + ';';
      });
      editor.fire('AfterPreviewFormats');
      dom.remove(previewFrag);
      return previewCss;
    };
    var Preview = {
      getCssText: getCssText,
      parseSelector: parseSelector,
      selectorToHtml: selectorToHtml
    };

    var toggle$3 = function (editor, formats, name, vars, node) {
      var fmt = formats.get(name);
      if (MatchFormat.match(editor, name, vars, node) && (!('toggle' in fmt[0]) || fmt[0].toggle)) {
        RemoveFormat.remove(editor, name, vars, node);
      } else {
        ApplyFormat.applyFormat(editor, name, vars, node);
      }
    };
    var ToggleFormat = { toggle: toggle$3 };

    var setup$6 = function (editor) {
      editor.addShortcut('meta+b', '', 'Bold');
      editor.addShortcut('meta+i', '', 'Italic');
      editor.addShortcut('meta+u', '', 'Underline');
      for (var i = 1; i <= 6; i++) {
        editor.addShortcut('access+' + i, '', [
          'FormatBlock',
          false,
          'h' + i
        ]);
      }
      editor.addShortcut('access+7', '', [
        'FormatBlock',
        false,
        'p'
      ]);
      editor.addShortcut('access+8', '', [
        'FormatBlock',
        false,
        'div'
      ]);
      editor.addShortcut('access+9', '', [
        'FormatBlock',
        false,
        'address'
      ]);
    };
    var FormatShortcuts = { setup: setup$6 };

    function Formatter (editor) {
      var formats = FormatRegistry(editor);
      var formatChangeState = Cell(null);
      FormatShortcuts.setup(editor);
      setup$4(editor);
      return {
        get: formats.get,
        register: formats.register,
        unregister: formats.unregister,
        apply: curry(ApplyFormat.applyFormat, editor),
        remove: curry(RemoveFormat.remove, editor),
        toggle: curry(ToggleFormat.toggle, editor, formats),
        match: curry(MatchFormat.match, editor),
        matchAll: curry(MatchFormat.matchAll, editor),
        matchNode: curry(MatchFormat.matchNode, editor),
        canApply: curry(MatchFormat.canApply, editor),
        formatChanged: curry(FormatChanged.formatChanged, editor, formatChangeState),
        getCssText: curry(Preview.getCssText, editor)
      };
    }

    var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    var shallow$1 = function (old, nu) {
      return nu;
    };
    var baseMerge = function (merger) {
      return function () {
        var objects = new Array(arguments.length);
        for (var i = 0; i < objects.length; i++)
          objects[i] = arguments[i];
        if (objects.length === 0)
          throw new Error('Can\'t merge zero objects');
        var ret = {};
        for (var j = 0; j < objects.length; j++) {
          var curObject = objects[j];
          for (var key in curObject)
            if (hasOwnProperty$2.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key]);
            }
        }
        return ret;
      };
    };
    var merge = baseMerge(shallow$1);

    var register = function (htmlParser, settings, dom) {
      htmlParser.addAttributeFilter('data-mce-tabindex', function (nodes, name) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          node.attr('tabindex', node.attributes.map['data-mce-tabindex']);
          node.attr(name, null);
        }
      });
      htmlParser.addAttributeFilter('src,href,style', function (nodes, name) {
        var i = nodes.length, node, value;
        var internalName = 'data-mce-' + name;
        var urlConverter = settings.url_converter;
        var urlConverterScope = settings.url_converter_scope;
        while (i--) {
          node = nodes[i];
          value = node.attributes.map[internalName];
          if (value !== undefined) {
            node.attr(name, value.length > 0 ? value : null);
            node.attr(internalName, null);
          } else {
            value = node.attributes.map[name];
            if (name === 'style') {
              value = dom.serializeStyle(dom.parseStyle(value), node.name);
            } else if (urlConverter) {
              value = urlConverter.call(urlConverterScope, value, name, node.name);
            }
            node.attr(name, value.length > 0 ? value : null);
          }
        }
      });
      htmlParser.addAttributeFilter('class', function (nodes) {
        var i = nodes.length, node, value;
        while (i--) {
          node = nodes[i];
          value = node.attr('class');
          if (value) {
            value = node.attr('class').replace(/(?:^|\s)mce-item-\w+(?!\S)/g, '');
            node.attr('class', value.length > 0 ? value : null);
          }
        }
      });
      htmlParser.addAttributeFilter('data-mce-type', function (nodes, name, args) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          if (node.attributes.map['data-mce-type'] === 'bookmark' && !args.cleanup) {
            node.remove();
          }
        }
      });
      htmlParser.addNodeFilter('noscript', function (nodes) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i].firstChild;
          if (node) {
            node.value = Entities.decode(node.value);
          }
        }
      });
      htmlParser.addNodeFilter('script,style', function (nodes, name) {
        var i = nodes.length, node, value, type;
        var trim = function (value) {
          return value.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n').replace(/^[\r\n]*|[\r\n]*$/g, '').replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, '').replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, '');
        };
        while (i--) {
          node = nodes[i];
          value = node.firstChild ? node.firstChild.value : '';
          if (name === 'script') {
            type = node.attr('type');
            if (type) {
              node.attr('type', type === 'mce-no/type' ? null : type.replace(/^mce\-/, ''));
            }
            if (settings.element_format === 'xhtml' && value.length > 0) {
              node.firstChild.value = '// <![CDATA[\n' + trim(value) + '\n// ]]>';
            }
          } else {
            if (settings.element_format === 'xhtml' && value.length > 0) {
              node.firstChild.value = '<!--\n' + trim(value) + '\n-->';
            }
          }
        }
      });
      htmlParser.addNodeFilter('#comment', function (nodes) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          if (node.value.indexOf('[CDATA[') === 0) {
            node.name = '#cdata';
            node.type = 4;
            node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, '');
          } else if (node.value.indexOf('mce:protected ') === 0) {
            node.name = '#text';
            node.type = 3;
            node.raw = true;
            node.value = unescape(node.value).substr(14);
          }
        }
      });
      htmlParser.addNodeFilter('xml:namespace,input', function (nodes, name) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          if (node.type === 7) {
            node.remove();
          } else if (node.type === 1) {
            if (name === 'input' && !('type' in node.attributes.map)) {
              node.attr('type', 'text');
            }
          }
        }
      });
      htmlParser.addAttributeFilter('data-mce-type', function (nodes) {
        each(nodes, function (node) {
          if (node.attr('data-mce-type') === 'format-caret') {
            if (node.isEmpty(htmlParser.schema.getNonEmptyElements())) {
              node.remove();
            } else {
              node.unwrap();
            }
          }
        });
      });
      htmlParser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style,' + 'data-mce-selected,data-mce-expando,' + 'data-mce-type,data-mce-resize', function (nodes, name) {
        var i = nodes.length;
        while (i--) {
          nodes[i].attr(name, null);
        }
      });
    };
    var trimTrailingBr = function (rootNode) {
      var brNode1, brNode2;
      var isBr = function (node) {
        return node && node.name === 'br';
      };
      brNode1 = rootNode.lastChild;
      if (isBr(brNode1)) {
        brNode2 = brNode1.prev;
        if (isBr(brNode2)) {
          brNode1.remove();
          brNode2.remove();
        }
      }
    };
    var DomSerializerFilters = {
      register: register,
      trimTrailingBr: trimTrailingBr
    };

    var preProcess = function (editor, node, args) {
      var impl, doc, oldDoc;
      var dom = editor.dom;
      node = node.cloneNode(true);
      impl = document.implementation;
      if (impl.createHTMLDocument) {
        doc = impl.createHTMLDocument('');
        Tools.each(node.nodeName === 'BODY' ? node.childNodes : [node], function (node) {
          doc.body.appendChild(doc.importNode(node, true));
        });
        if (node.nodeName !== 'BODY') {
          node = doc.body.firstChild;
        } else {
          node = doc.body;
        }
        oldDoc = dom.doc;
        dom.doc = doc;
      }
      Events.firePreProcess(editor, merge(args, { node: node }));
      if (oldDoc) {
        dom.doc = oldDoc;
      }
      return node;
    };
    var shouldFireEvent = function (editor, args) {
      return editor && editor.hasEventListeners('PreProcess') && !args.no_events;
    };
    var process = function (editor, node, args) {
      return shouldFireEvent(editor, args) ? preProcess(editor, node, args) : node;
    };
    var DomSerializerPreProcess = { process: process };

    var removeAttrs = function (node, names) {
      each(names, function (name) {
        node.attr(name, null);
      });
    };
    var addFontToSpansFilter = function (domParser, styles, fontSizes) {
      domParser.addNodeFilter('font', function (nodes) {
        each(nodes, function (node) {
          var props = styles.parse(node.attr('style'));
          var color = node.attr('color');
          var face = node.attr('face');
          var size = node.attr('size');
          if (color) {
            props.color = color;
          }
          if (face) {
            props['font-family'] = face;
          }
          if (size) {
            props['font-size'] = fontSizes[parseInt(node.attr('size'), 10) - 1];
          }
          node.name = 'span';
          node.attr('style', styles.serialize(props));
          removeAttrs(node, [
            'color',
            'face',
            'size'
          ]);
        });
      });
    };
    var addStrikeToSpanFilter = function (domParser, styles) {
      domParser.addNodeFilter('strike', function (nodes) {
        each(nodes, function (node) {
          var props = styles.parse(node.attr('style'));
          props['text-decoration'] = 'line-through';
          node.name = 'span';
          node.attr('style', styles.serialize(props));
        });
      });
    };
    var addFilters = function (domParser, settings) {
      var styles = Styles();
      if (settings.convert_fonts_to_spans) {
        addFontToSpansFilter(domParser, styles, Tools.explode(settings.font_size_legacy_values));
      }
      addStrikeToSpanFilter(domParser, styles);
    };
    var register$1 = function (domParser, settings) {
      if (settings.inline_styles) {
        addFilters(domParser, settings);
      }
    };
    var LegacyFilter = { register: register$1 };

    var whiteSpaceRegExp$3 = /^[ \t\r\n]*$/;
    var typeLookup = {
      '#text': 3,
      '#comment': 8,
      '#cdata': 4,
      '#pi': 7,
      '#doctype': 10,
      '#document-fragment': 11
    };
    var walk$3 = function (node, root, prev) {
      var sibling;
      var parent;
      var startName = prev ? 'lastChild' : 'firstChild';
      var siblingName = prev ? 'prev' : 'next';
      if (node[startName]) {
        return node[startName];
      }
      if (node !== root) {
        sibling = node[siblingName];
        if (sibling) {
          return sibling;
        }
        for (parent = node.parent; parent && parent !== root; parent = parent.parent) {
          sibling = parent[siblingName];
          if (sibling) {
            return sibling;
          }
        }
      }
    };
    var Node$2 = function () {
      function Node(name, type) {
        this.name = name;
        this.type = type;
        if (type === 1) {
          this.attributes = [];
          this.attributes.map = {};
        }
      }
      Node.create = function (name, attrs) {
        var node, attrName;
        node = new Node(name, typeLookup[name] || 1);
        if (attrs) {
          for (attrName in attrs) {
            node.attr(attrName, attrs[attrName]);
          }
        }
        return node;
      };
      Node.prototype.replace = function (node) {
        var self = this;
        if (node.parent) {
          node.remove();
        }
        self.insert(node, self);
        self.remove();
        return self;
      };
      Node.prototype.attr = function (name, value) {
        var self = this;
        var attrs, i;
        if (typeof name !== 'string') {
          for (i in name) {
            self.attr(i, name[i]);
          }
          return self;
        }
        if (attrs = self.attributes) {
          if (value !== undefined) {
            if (value === null) {
              if (name in attrs.map) {
                delete attrs.map[name];
                i = attrs.length;
                while (i--) {
                  if (attrs[i].name === name) {
                    attrs = attrs.splice(i, 1);
                    return self;
                  }
                }
              }
              return self;
            }
            if (name in attrs.map) {
              i = attrs.length;
              while (i--) {
                if (attrs[i].name === name) {
                  attrs[i].value = value;
                  break;
                }
              }
            } else {
              attrs.push({
                name: name,
                value: value
              });
            }
            attrs.map[name] = value;
            return self;
          }
          return attrs.map[name];
        }
      };
      Node.prototype.clone = function () {
        var self = this;
        var clone = new Node(self.name, self.type);
        var i, l, selfAttrs, selfAttr, cloneAttrs;
        if (selfAttrs = self.attributes) {
          cloneAttrs = [];
          cloneAttrs.map = {};
          for (i = 0, l = selfAttrs.length; i < l; i++) {
            selfAttr = selfAttrs[i];
            if (selfAttr.name !== 'id') {
              cloneAttrs[cloneAttrs.length] = {
                name: selfAttr.name,
                value: selfAttr.value
              };
              cloneAttrs.map[selfAttr.name] = selfAttr.value;
            }
          }
          clone.attributes = cloneAttrs;
        }
        clone.value = self.value;
        clone.shortEnded = self.shortEnded;
        return clone;
      };
      Node.prototype.wrap = function (wrapper) {
        var self = this;
        self.parent.insert(wrapper, self);
        wrapper.append(self);
        return self;
      };
      Node.prototype.unwrap = function () {
        var self = this;
        var node, next;
        for (node = self.firstChild; node;) {
          next = node.next;
          self.insert(node, self, true);
          node = next;
        }
        self.remove();
      };
      Node.prototype.remove = function () {
        var self = this, parent = self.parent, next = self.next, prev = self.prev;
        if (parent) {
          if (parent.firstChild === self) {
            parent.firstChild = next;
            if (next) {
              next.prev = null;
            }
          } else {
            prev.next = next;
          }
          if (parent.lastChild === self) {
            parent.lastChild = prev;
            if (prev) {
              prev.next = null;
            }
          } else {
            next.prev = prev;
          }
          self.parent = self.next = self.prev = null;
        }
        return self;
      };
      Node.prototype.append = function (node) {
        var self = this;
        var last;
        if (node.parent) {
          node.remove();
        }
        last = self.lastChild;
        if (last) {
          last.next = node;
          node.prev = last;
          self.lastChild = node;
        } else {
          self.lastChild = self.firstChild = node;
        }
        node.parent = self;
        return node;
      };
      Node.prototype.insert = function (node, refNode, before) {
        var parent;
        if (node.parent) {
          node.remove();
        }
        parent = refNode.parent || this;
        if (before) {
          if (refNode === parent.firstChild) {
            parent.firstChild = node;
          } else {
            refNode.prev.next = node;
          }
          node.prev = refNode.prev;
          node.next = refNode;
          refNode.prev = node;
        } else {
          if (refNode === parent.lastChild) {
            parent.lastChild = node;
          } else {
            refNode.next.prev = node;
          }
          node.next = refNode.next;
          node.prev = refNode;
          refNode.next = node;
        }
        node.parent = parent;
        return node;
      };
      Node.prototype.getAll = function (name) {
        var self = this;
        var node;
        var collection = [];
        for (node = self.firstChild; node; node = walk$3(node, self)) {
          if (node.name === name) {
            collection.push(node);
          }
        }
        return collection;
      };
      Node.prototype.empty = function () {
        var self = this;
        var nodes, i, node;
        if (self.firstChild) {
          nodes = [];
          for (node = self.firstChild; node; node = walk$3(node, self)) {
            nodes.push(node);
          }
          i = nodes.length;
          while (i--) {
            node = nodes[i];
            node.parent = node.firstChild = node.lastChild = node.next = node.prev = null;
          }
        }
        self.firstChild = self.lastChild = null;
        return self;
      };
      Node.prototype.isEmpty = function (elements, whitespace, predicate) {
        var self = this;
        var node = self.firstChild, i, name;
        whitespace = whitespace || {};
        if (node) {
          do {
            if (node.type === 1) {
              if (node.attributes.map['data-mce-bogus']) {
                continue;
              }
              if (elements[node.name]) {
                return false;
              }
              i = node.attributes.length;
              while (i--) {
                name = node.attributes[i].name;
                if (name === 'name' || name.indexOf('data-mce-bookmark') === 0) {
                  return false;
                }
              }
            }
            if (node.type === 8) {
              return false;
            }
            if (node.type === 3 && !whiteSpaceRegExp$3.test(node.value)) {
              return false;
            }
            if (node.type === 3 && node.parent && whitespace[node.parent.name] && whiteSpaceRegExp$3.test(node.value)) {
              return false;
            }
            if (predicate && predicate(node)) {
              return false;
            }
          } while (node = walk$3(node, self));
        }
        return true;
      };
      Node.prototype.walk = function (prev) {
        return walk$3(this, null, prev);
      };
      return Node;
    }();

    var paddEmptyNode = function (settings, args, blockElements, node) {
      var brPreferred = settings.padd_empty_with_br || args.insert;
      if (brPreferred && blockElements[node.name]) {
        node.empty().append(new Node$2('br', 1)).shortEnded = true;
      } else {
        node.empty().append(new Node$2('#text', 3)).value = '\xA0';
      }
    };
    var isPaddedWithNbsp = function (node) {
      return hasOnlyChild(node, '#text') && node.firstChild.value === '\xA0';
    };
    var hasOnlyChild = function (node, name) {
      return node && node.firstChild && node.firstChild === node.lastChild && node.firstChild.name === name;
    };
    var isPadded = function (schema, node) {
      var rule = schema.getElementRule(node.name);
      return rule && rule.paddEmpty;
    };
    var isEmpty$2 = function (schema, nonEmptyElements, whitespaceElements, node) {
      return node.isEmpty(nonEmptyElements, whitespaceElements, function (node) {
        return isPadded(schema, node);
      });
    };
    var isLineBreakNode = function (node, blockElements) {
      return node && (blockElements[node.name] || node.name === 'br');
    };

    var register$2 = function (parser, settings) {
      var schema = parser.schema;
      if (settings.remove_trailing_brs) {
        parser.addNodeFilter('br', function (nodes, _, args) {
          var i;
          var l = nodes.length;
          var node;
          var blockElements = Tools.extend({}, schema.getBlockElements());
          var nonEmptyElements = schema.getNonEmptyElements();
          var parent, lastParent, prev, prevName;
          var whiteSpaceElements = schema.getNonEmptyElements();
          var elementRule, textNode;
          blockElements.body = 1;
          for (i = 0; i < l; i++) {
            node = nodes[i];
            parent = node.parent;
            if (blockElements[node.parent.name] && node === parent.lastChild) {
              prev = node.prev;
              while (prev) {
                prevName = prev.name;
                if (prevName !== 'span' || prev.attr('data-mce-type') !== 'bookmark') {
                  if (prevName !== 'br') {
                    break;
                  }
                  if (prevName === 'br') {
                    node = null;
                    break;
                  }
                }
                prev = prev.prev;
              }
              if (node) {
                node.remove();
                if (isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, parent)) {
                  elementRule = schema.getElementRule(parent.name);
                  if (elementRule) {
                    if (elementRule.removeEmpty) {
                      parent.remove();
                    } else if (elementRule.paddEmpty) {
                      paddEmptyNode(settings, args, blockElements, parent);
                    }
                  }
                }
              }
            } else {
              lastParent = node;
              while (parent && parent.firstChild === lastParent && parent.lastChild === lastParent) {
                lastParent = parent;
                if (blockElements[parent.name]) {
                  break;
                }
                parent = parent.parent;
              }
              if (lastParent === parent && settings.padd_empty_with_br !== true) {
                textNode = new Node$2('#text', 3);
                textNode.value = '\xA0';
                node.replace(textNode);
              }
            }
          }
        });
      }
      parser.addAttributeFilter('href', function (nodes) {
        var i = nodes.length, node;
        var appendRel = function (rel) {
          var parts = rel.split(' ').filter(function (p) {
            return p.length > 0;
          });
          return parts.concat(['noopener']).sort().join(' ');
        };
        var addNoOpener = function (rel) {
          var newRel = rel ? Tools.trim(rel) : '';
          if (!/\b(noopener)\b/g.test(newRel)) {
            return appendRel(newRel);
          } else {
            return newRel;
          }
        };
        if (!settings.allow_unsafe_link_target) {
          while (i--) {
            node = nodes[i];
            if (node.name === 'a' && node.attr('target') === '_blank') {
              node.attr('rel', addNoOpener(node.attr('rel')));
            }
          }
        }
      });
      if (!settings.allow_html_in_named_anchor) {
        parser.addAttributeFilter('id,name', function (nodes) {
          var i = nodes.length, sibling, prevSibling, parent, node;
          while (i--) {
            node = nodes[i];
            if (node.name === 'a' && node.firstChild && !node.attr('href')) {
              parent = node.parent;
              sibling = node.lastChild;
              do {
                prevSibling = sibling.prev;
                parent.insert(sibling, node);
                sibling = prevSibling;
              } while (sibling);
            }
          }
        });
      }
      if (settings.fix_list_elements) {
        parser.addNodeFilter('ul,ol', function (nodes) {
          var i = nodes.length, node, parentNode;
          while (i--) {
            node = nodes[i];
            parentNode = node.parent;
            if (parentNode.name === 'ul' || parentNode.name === 'ol') {
              if (node.prev && node.prev.name === 'li') {
                node.prev.append(node);
              } else {
                var li = new Node$2('li', 1);
                li.attr('style', 'list-style-type: none');
                node.wrap(li);
              }
            }
          }
        });
      }
      if (settings.validate && schema.getValidClasses()) {
        parser.addAttributeFilter('class', function (nodes) {
          var i = nodes.length, node, classList, ci, className, classValue;
          var validClasses = schema.getValidClasses();
          var validClassesMap, valid;
          while (i--) {
            node = nodes[i];
            classList = node.attr('class').split(' ');
            classValue = '';
            for (ci = 0; ci < classList.length; ci++) {
              className = classList[ci];
              valid = false;
              validClassesMap = validClasses['*'];
              if (validClassesMap && validClassesMap[className]) {
                valid = true;
              }
              validClassesMap = validClasses[node.name];
              if (!valid && validClassesMap && validClassesMap[className]) {
                valid = true;
              }
              if (valid) {
                if (classValue) {
                  classValue += ' ';
                }
                classValue += className;
              }
            }
            if (!classValue.length) {
              classValue = null;
            }
            node.attr('class', classValue);
          }
        });
      }
    };

    var makeMap$4 = Tools.makeMap, each$i = Tools.each, explode$3 = Tools.explode, extend$3 = Tools.extend;
    function DomParser (settings, schema) {
      if (schema === void 0) {
        schema = Schema();
      }
      var nodeFilters = {};
      var attributeFilters = [];
      var matchedNodes = {};
      var matchedAttributes = {};
      settings = settings || {};
      settings.validate = 'validate' in settings ? settings.validate : true;
      settings.root_name = settings.root_name || 'body';
      var fixInvalidChildren = function (nodes) {
        var ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i;
        var nonEmptyElements, whitespaceElements, nonSplitableElements, textBlockElements, specialElements, sibling, nextNode;
        nonSplitableElements = makeMap$4('tr,td,th,tbody,thead,tfoot,table');
        nonEmptyElements = schema.getNonEmptyElements();
        whitespaceElements = schema.getWhiteSpaceElements();
        textBlockElements = schema.getTextBlockElements();
        specialElements = schema.getSpecialElements();
        for (ni = 0; ni < nodes.length; ni++) {
          node = nodes[ni];
          if (!node.parent || node.fixed) {
            continue;
          }
          if (textBlockElements[node.name] && node.parent.name === 'li') {
            sibling = node.next;
            while (sibling) {
              if (textBlockElements[sibling.name]) {
                sibling.name = 'li';
                sibling.fixed = true;
                node.parent.insert(sibling, node.parent);
              } else {
                break;
              }
              sibling = sibling.next;
            }
            node.unwrap(node);
            continue;
          }
          parents = [node];
          for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent) {
            parents.push(parent);
          }
          if (parent && parents.length > 1) {
            parents.reverse();
            newParent = currentNode = filterNode(parents[0].clone());
            for (i = 0; i < parents.length - 1; i++) {
              if (schema.isValidChild(currentNode.name, parents[i].name)) {
                tempNode = filterNode(parents[i].clone());
                currentNode.append(tempNode);
              } else {
                tempNode = currentNode;
              }
              for (childNode = parents[i].firstChild; childNode && childNode !== parents[i + 1];) {
                nextNode = childNode.next;
                tempNode.append(childNode);
                childNode = nextNode;
              }
              currentNode = tempNode;
            }
            if (!isEmpty$2(schema, nonEmptyElements, whitespaceElements, newParent)) {
              parent.insert(newParent, parents[0], true);
              parent.insert(node, newParent);
            } else {
              parent.insert(node, parents[0], true);
            }
            parent = parents[0];
            if (isEmpty$2(schema, nonEmptyElements, whitespaceElements, parent) || hasOnlyChild(parent, 'br')) {
              parent.empty().remove();
            }
          } else if (node.parent) {
            if (node.name === 'li') {
              sibling = node.prev;
              if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                sibling.append(node);
                continue;
              }
              sibling = node.next;
              if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
                sibling.insert(node, sibling.firstChild, true);
                continue;
              }
              node.wrap(filterNode(new Node$2('ul', 1)));
              continue;
            }
            if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) {
              node.wrap(filterNode(new Node$2('div', 1)));
            } else {
              if (specialElements[node.name]) {
                node.empty().remove();
              } else {
                node.unwrap();
              }
            }
          }
        }
      };
      var filterNode = function (node) {
        var i, name, list;
        if (name in nodeFilters) {
          list = matchedNodes[name];
          if (list) {
            list.push(node);
          } else {
            matchedNodes[name] = [node];
          }
        }
        i = attributeFilters.length;
        while (i--) {
          name = attributeFilters[i].name;
          if (name in node.attributes.map) {
            list = matchedAttributes[name];
            if (list) {
              list.push(node);
            } else {
              matchedAttributes[name] = [node];
            }
          }
        }
        return node;
      };
      var addNodeFilter = function (name, callback) {
        each$i(explode$3(name), function (name) {
          var list = nodeFilters[name];
          if (!list) {
            nodeFilters[name] = list = [];
          }
          list.push(callback);
        });
      };
      var getNodeFilters = function () {
        var out = [];
        for (var name in nodeFilters) {
          if (nodeFilters.hasOwnProperty(name)) {
            out.push({
              name: name,
              callbacks: nodeFilters[name]
            });
          }
        }
        return out;
      };
      var addAttributeFilter = function (name, callback) {
        each$i(explode$3(name), function (name) {
          var i;
          for (i = 0; i < attributeFilters.length; i++) {
            if (attributeFilters[i].name === name) {
              attributeFilters[i].callbacks.push(callback);
              return;
            }
          }
          attributeFilters.push({
            name: name,
            callbacks: [callback]
          });
        });
      };
      var getAttributeFilters = function () {
        return [].concat(attributeFilters);
      };
      var parse = function (html, args) {
        var parser, nodes, i, l, fi, fl, list, name;
        var blockElements;
        var invalidChildren = [];
        var isInWhiteSpacePreservedElement;
        var node;
        args = args || {};
        matchedNodes = {};
        matchedAttributes = {};
        blockElements = extend$3(makeMap$4('script,style,head,html,body,title,meta,param'), schema.getBlockElements());
        var nonEmptyElements = schema.getNonEmptyElements();
        var children = schema.children;
        var validate = settings.validate;
        var rootBlockName = 'forced_root_block' in args ? args.forced_root_block : settings.forced_root_block;
        var whiteSpaceElements = schema.getWhiteSpaceElements();
        var startWhiteSpaceRegExp = /^[ \t\r\n]+/;
        var endWhiteSpaceRegExp = /[ \t\r\n]+$/;
        var allWhiteSpaceRegExp = /[ \t\r\n]+/g;
        var isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/;
        isInWhiteSpacePreservedElement = whiteSpaceElements.hasOwnProperty(args.context) || whiteSpaceElements.hasOwnProperty(settings.root_name);
        var addRootBlocks = function () {
          var node = rootNode.firstChild, next, rootBlockNode;
          var trim = function (rootBlockNode) {
            if (rootBlockNode) {
              node = rootBlockNode.firstChild;
              if (node && node.type === 3) {
                node.value = node.value.replace(startWhiteSpaceRegExp, '');
              }
              node = rootBlockNode.lastChild;
              if (node && node.type === 3) {
                node.value = node.value.replace(endWhiteSpaceRegExp, '');
              }
            }
          };
          if (!schema.isValidChild(rootNode.name, rootBlockName.toLowerCase())) {
            return;
          }
          while (node) {
            next = node.next;
            if (node.type === 3 || node.type === 1 && node.name !== 'p' && !blockElements[node.name] && !node.attr('data-mce-type')) {
              if (!rootBlockNode) {
                rootBlockNode = createNode(rootBlockName, 1);
                rootBlockNode.attr(settings.forced_root_block_attrs);
                rootNode.insert(rootBlockNode, node);
                rootBlockNode.append(node);
              } else {
                rootBlockNode.append(node);
              }
            } else {
              trim(rootBlockNode);
              rootBlockNode = null;
            }
            node = next;
          }
          trim(rootBlockNode);
        };
        var createNode = function (name, type) {
          var node = new Node$2(name, type);
          var list;
          if (name in nodeFilters) {
            list = matchedNodes[name];
            if (list) {
              list.push(node);
            } else {
              matchedNodes[name] = [node];
            }
          }
          return node;
        };
        var removeWhitespaceBefore = function (node) {
          var textNode, textNodeNext, textVal, sibling;
          var blockElements = schema.getBlockElements();
          for (textNode = node.prev; textNode && textNode.type === 3;) {
            textVal = textNode.value.replace(endWhiteSpaceRegExp, '');
            if (textVal.length > 0) {
              textNode.value = textVal;
              return;
            }
            textNodeNext = textNode.next;
            if (textNodeNext) {
              if (textNodeNext.type === 3 && textNodeNext.value.length) {
                textNode = textNode.prev;
                continue;
              }
              if (!blockElements[textNodeNext.name] && textNodeNext.name !== 'script' && textNodeNext.name !== 'style') {
                textNode = textNode.prev;
                continue;
              }
            }
            sibling = textNode.prev;
            textNode.remove();
            textNode = sibling;
          }
        };
        var cloneAndExcludeBlocks = function (input) {
          var name;
          var output = {};
          for (name in input) {
            if (name !== 'li' && name !== 'p') {
              output[name] = input[name];
            }
          }
          return output;
        };
        parser = SaxParser$1({
          validate: validate,
          allow_script_urls: settings.allow_script_urls,
          allow_conditional_comments: settings.allow_conditional_comments,
          self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()),
          cdata: function (text) {
            node.append(createNode('#cdata', 4)).value = text;
          },
          text: function (text, raw) {
            var textNode;
            if (!isInWhiteSpacePreservedElement) {
              text = text.replace(allWhiteSpaceRegExp, ' ');
              if (isLineBreakNode(node.lastChild, blockElements)) {
                text = text.replace(startWhiteSpaceRegExp, '');
              }
            }
            if (text.length !== 0) {
              textNode = createNode('#text', 3);
              textNode.raw = !!raw;
              node.append(textNode).value = text;
            }
          },
          comment: function (text) {
            node.append(createNode('#comment', 8)).value = text;
          },
          pi: function (name, text) {
            node.append(createNode(name, 7)).value = text;
            removeWhitespaceBefore(node);
          },
          doctype: function (text) {
            var newNode;
            newNode = node.append(createNode('#doctype', 10));
            newNode.value = text;
            removeWhitespaceBefore(node);
          },
          start: function (name, attrs, empty) {
            var newNode, attrFiltersLen, elementRule, attrName, parent;
            elementRule = validate ? schema.getElementRule(name) : {};
            if (elementRule) {
              newNode = createNode(elementRule.outputName || name, 1);
              newNode.attributes = attrs;
              newNode.shortEnded = empty;
              node.append(newNode);
              parent = children[node.name];
              if (parent && children[newNode.name] && !parent[newNode.name]) {
                invalidChildren.push(newNode);
              }
              attrFiltersLen = attributeFilters.length;
              while (attrFiltersLen--) {
                attrName = attributeFilters[attrFiltersLen].name;
                if (attrName in attrs.map) {
                  list = matchedAttributes[attrName];
                  if (list) {
                    list.push(newNode);
                  } else {
                    matchedAttributes[attrName] = [newNode];
                  }
                }
              }
              if (blockElements[name]) {
                removeWhitespaceBefore(newNode);
              }
              if (!empty) {
                node = newNode;
              }
              if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                isInWhiteSpacePreservedElement = true;
              }
            }
          },
          end: function (name) {
            var textNode, elementRule, text, sibling, tempNode;
            elementRule = validate ? schema.getElementRule(name) : {};
            if (elementRule) {
              if (blockElements[name]) {
                if (!isInWhiteSpacePreservedElement) {
                  textNode = node.firstChild;
                  if (textNode && textNode.type === 3) {
                    text = textNode.value.replace(startWhiteSpaceRegExp, '');
                    if (text.length > 0) {
                      textNode.value = text;
                      textNode = textNode.next;
                    } else {
                      sibling = textNode.next;
                      textNode.remove();
                      textNode = sibling;
                      while (textNode && textNode.type === 3) {
                        text = textNode.value;
                        sibling = textNode.next;
                        if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                          textNode.remove();
                          textNode = sibling;
                        }
                        textNode = sibling;
                      }
                    }
                  }
                  textNode = node.lastChild;
                  if (textNode && textNode.type === 3) {
                    text = textNode.value.replace(endWhiteSpaceRegExp, '');
                    if (text.length > 0) {
                      textNode.value = text;
                      textNode = textNode.prev;
                    } else {
                      sibling = textNode.prev;
                      textNode.remove();
                      textNode = sibling;
                      while (textNode && textNode.type === 3) {
                        text = textNode.value;
                        sibling = textNode.prev;
                        if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                          textNode.remove();
                          textNode = sibling;
                        }
                        textNode = sibling;
                      }
                    }
                  }
                }
              }
              if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
                isInWhiteSpacePreservedElement = false;
              }
              if (elementRule.removeEmpty && isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, node)) {
                if (!node.attributes.map.name && !node.attr('id')) {
                  tempNode = node.parent;
                  if (blockElements[node.name]) {
                    node.empty().remove();
                  } else {
                    node.unwrap();
                  }
                  node = tempNode;
                  return;
                }
              }
              if (elementRule.paddEmpty && (isPaddedWithNbsp(node) || isEmpty$2(schema, nonEmptyElements, whiteSpaceElements, node))) {
                paddEmptyNode(settings, args, blockElements, node);
              }
              node = node.parent;
            }
          }
        }, schema);
        var rootNode = node = new Node$2(args.context || settings.root_name, 11);
        parser.parse(html);
        if (validate && invalidChildren.length) {
          if (!args.context) {
            fixInvalidChildren(invalidChildren);
          } else {
            args.invalid = true;
          }
        }
        if (rootBlockName && (rootNode.name === 'body' || args.isRootContent)) {
          addRootBlocks();
        }
        if (!args.invalid) {
          for (name in matchedNodes) {
            list = nodeFilters[name];
            nodes = matchedNodes[name];
            fi = nodes.length;
            while (fi--) {
              if (!nodes[fi].parent) {
                nodes.splice(fi, 1);
              }
            }
            for (i = 0, l = list.length; i < l; i++) {
              list[i](nodes, name, args);
            }
          }
          for (i = 0, l = attributeFilters.length; i < l; i++) {
            list = attributeFilters[i];
            if (list.name in matchedAttributes) {
              nodes = matchedAttributes[list.name];
              fi = nodes.length;
              while (fi--) {
                if (!nodes[fi].parent) {
                  nodes.splice(fi, 1);
                }
              }
              for (fi = 0, fl = list.callbacks.length; fi < fl; fi++) {
                list.callbacks[fi](nodes, list.name, args);
              }
            }
          }
        }
        return rootNode;
      };
      var exports = {
        schema: schema,
        addAttributeFilter: addAttributeFilter,
        getAttributeFilters: getAttributeFilters,
        addNodeFilter: addNodeFilter,
        getNodeFilters: getNodeFilters,
        filterNode: filterNode,
        parse: parse
      };
      register$2(exports, settings);
      LegacyFilter.register(exports, settings);
      return exports;
    }

    var addTempAttr = function (htmlParser, tempAttrs, name) {
      if (Tools.inArray(tempAttrs, name) === -1) {
        htmlParser.addAttributeFilter(name, function (nodes, name) {
          var i = nodes.length;
          while (i--) {
            nodes[i].attr(name, null);
          }
        });
        tempAttrs.push(name);
      }
    };
    var postProcess$1 = function (editor, args, content) {
      if (!args.no_events && editor) {
        var outArgs = Events.firePostProcess(editor, merge(args, { content: content }));
        return outArgs.content;
      } else {
        return content;
      }
    };
    var getHtmlFromNode = function (dom, node, args) {
      var html = Zwsp.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node));
      return args.selection || isWsPreserveElement(Element$$1.fromDom(node)) ? html : Tools.trim(html);
    };
    var parseHtml = function (htmlParser, html, args) {
      var parserArgs = args.selection ? merge({ forced_root_block: false }, args) : args;
      var rootNode = htmlParser.parse(html, parserArgs);
      DomSerializerFilters.trimTrailingBr(rootNode);
      return rootNode;
    };
    var serializeNode = function (settings, schema, node) {
      var htmlSerializer = Serializer(settings, schema);
      return htmlSerializer.serialize(node);
    };
    var toHtml = function (editor, settings, schema, rootNode, args) {
      var content = serializeNode(settings, schema, rootNode);
      return postProcess$1(editor, args, content);
    };
    function DomSerializer (settings, editor) {
      var dom, schema, htmlParser;
      var tempAttrs = ['data-mce-selected'];
      dom = editor && editor.dom ? editor.dom : DOMUtils$1.DOM;
      schema = editor && editor.schema ? editor.schema : Schema(settings);
      settings.entity_encoding = settings.entity_encoding || 'named';
      settings.remove_trailing_brs = 'remove_trailing_brs' in settings ? settings.remove_trailing_brs : true;
      htmlParser = DomParser(settings, schema);
      DomSerializerFilters.register(htmlParser, settings, dom);
      var serialize = function (node, parserArgs) {
        var args = merge({ format: 'html' }, parserArgs ? parserArgs : {});
        var targetNode = DomSerializerPreProcess.process(editor, node, args);
        var html = getHtmlFromNode(dom, targetNode, args);
        var rootNode = parseHtml(htmlParser, html, args);
        return args.format === 'tree' ? rootNode : toHtml(editor, settings, schema, rootNode, args);
      };
      return {
        schema: schema,
        addNodeFilter: htmlParser.addNodeFilter,
        addAttributeFilter: htmlParser.addAttributeFilter,
        serialize: serialize,
        addRules: function (rules) {
          schema.addValidElements(rules);
        },
        setRules: function (rules) {
          schema.setValidElements(rules);
        },
        addTempAttr: curry(addTempAttr, htmlParser, tempAttrs),
        getTempAttrs: function () {
          return tempAttrs;
        }
      };
    }

    function Serializer$1 (settings, editor) {
      var domSerializer = DomSerializer(settings, editor);
      return {
        schema: domSerializer.schema,
        addNodeFilter: domSerializer.addNodeFilter,
        addAttributeFilter: domSerializer.addAttributeFilter,
        serialize: domSerializer.serialize,
        addRules: domSerializer.addRules,
        setRules: domSerializer.setRules,
        addTempAttr: domSerializer.addTempAttr,
        getTempAttrs: domSerializer.getTempAttrs
      };
    }

    function BookmarkManager(selection) {
      return {
        getBookmark: curry(Bookmarks.getBookmark, selection),
        moveToBookmark: curry(Bookmarks.moveToBookmark, selection)
      };
    }
    (function (BookmarkManager) {
      BookmarkManager.isBookmarkNode = Bookmarks.isBookmarkNode;
    }(BookmarkManager || (BookmarkManager = {})));
    var BookmarkManager$1 = BookmarkManager;

    var isContentEditableFalse$a = NodeType.isContentEditableFalse;
    var isContentEditableTrue$6 = NodeType.isContentEditableTrue;
    var getContentEditableRoot$2 = function (root, node) {
      while (node && node !== root) {
        if (isContentEditableTrue$6(node) || isContentEditableFalse$a(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var ControlSelection = function (selection, editor) {
      var dom = editor.dom, each = Tools.each;
      var selectedElm, selectedElmGhost, resizeHelper, resizeHandles, selectedHandle;
      var startX, startY, selectedElmX, selectedElmY, startW, startH, ratio, resizeStarted;
      var width, height;
      var editableDoc = editor.getDoc(), rootDocument = document;
      var abs = Math.abs, round = Math.round, rootElement = editor.getBody();
      var startScrollWidth, startScrollHeight;
      resizeHandles = {
        nw: [
          0,
          0,
          -1,
          -1
        ],
        ne: [
          1,
          0,
          1,
          -1
        ],
        se: [
          1,
          1,
          1,
          1
        ],
        sw: [
          0,
          1,
          -1,
          1
        ]
      };
      var rootClass = '.mce-content-body';
      editor.contentStyles.push(rootClass + ' div.mce-resizehandle {' + 'position: absolute;' + 'border: 1px solid black;' + 'box-sizing: content-box;' + 'background: #FFF;' + 'width: 7px;' + 'height: 7px;' + 'z-index: 10000' + '}' + rootClass + ' .mce-resizehandle:hover {' + 'background: #000' + '}' + rootClass + ' img[data-mce-selected],' + rootClass + ' hr[data-mce-selected] {' + 'outline: 1px solid black;' + 'resize: none' + '}' + rootClass + ' .mce-clonedresizable {' + 'position: absolute;' + (Env.gecko ? '' : 'outline: 1px dashed black;') + 'opacity: .5;' + 'filter: alpha(opacity=50);' + 'z-index: 10000' + '}' + rootClass + ' .mce-resize-helper {' + 'background: #555;' + 'background: rgba(0,0,0,0.75);' + 'border-radius: 3px;' + 'border: 1px;' + 'color: white;' + 'display: none;' + 'font-family: sans-serif;' + 'font-size: 12px;' + 'white-space: nowrap;' + 'line-height: 14px;' + 'margin: 5px 10px;' + 'padding: 5px;' + 'position: absolute;' + 'z-index: 10001' + '}');
      var isImage = function (elm) {
        return elm && (elm.nodeName === 'IMG' || editor.dom.is(elm, 'figure.image'));
      };
      var isEventOnImageOutsideRange = function (evt, range) {
        return isImage(evt.target) && !RangePoint.isXYWithinRange(evt.clientX, evt.clientY, range);
      };
      var contextMenuSelectImage = function (evt) {
        var target = evt.target;
        if (isEventOnImageOutsideRange(evt, editor.selection.getRng()) && !evt.isDefaultPrevented()) {
          evt.preventDefault();
          editor.selection.select(target);
        }
      };
      var getResizeTarget = function (elm) {
        return editor.dom.is(elm, 'figure.image') ? elm.querySelector('img') : elm;
      };
      var isResizable = function (elm) {
        var selector = editor.settings.object_resizing;
        if (selector === false || Env.iOS) {
          return false;
        }
        if (typeof selector !== 'string') {
          selector = 'table,img,figure.image,div';
        }
        if (elm.getAttribute('data-mce-resize') === 'false') {
          return false;
        }
        if (elm === editor.getBody()) {
          return false;
        }
        return is$1(Element$$1.fromDom(elm), selector);
      };
      var resizeGhostElement = function (e) {
        var deltaX, deltaY, proportional;
        var resizeHelperX, resizeHelperY;
        deltaX = e.screenX - startX;
        deltaY = e.screenY - startY;
        width = deltaX * selectedHandle[2] + startW;
        height = deltaY * selectedHandle[3] + startH;
        width = width < 5 ? 5 : width;
        height = height < 5 ? 5 : height;
        if (isImage(selectedElm) && editor.settings.resize_img_proportional !== false) {
          proportional = !VK.modifierPressed(e);
        } else {
          proportional = VK.modifierPressed(e) || isImage(selectedElm) && selectedHandle[2] * selectedHandle[3] !== 0;
        }
        if (proportional) {
          if (abs(deltaX) > abs(deltaY)) {
            height = round(width * ratio);
            width = round(height / ratio);
          } else {
            width = round(height / ratio);
            height = round(width * ratio);
          }
        }
        dom.setStyles(getResizeTarget(selectedElmGhost), {
          width: width,
          height: height
        });
        resizeHelperX = selectedHandle.startPos.x + deltaX;
        resizeHelperY = selectedHandle.startPos.y + deltaY;
        resizeHelperX = resizeHelperX > 0 ? resizeHelperX : 0;
        resizeHelperY = resizeHelperY > 0 ? resizeHelperY : 0;
        dom.setStyles(resizeHelper, {
          left: resizeHelperX,
          top: resizeHelperY,
          display: 'block'
        });
        resizeHelper.innerHTML = width + ' &times; ' + height;
        if (selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width) {
          dom.setStyle(selectedElmGhost, 'left', selectedElmX + (startW - width));
        }
        if (selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height) {
          dom.setStyle(selectedElmGhost, 'top', selectedElmY + (startH - height));
        }
        deltaX = rootElement.scrollWidth - startScrollWidth;
        deltaY = rootElement.scrollHeight - startScrollHeight;
        if (deltaX + deltaY !== 0) {
          dom.setStyles(resizeHelper, {
            left: resizeHelperX - deltaX,
            top: resizeHelperY - deltaY
          });
        }
        if (!resizeStarted) {
          Events.fireObjectResizeStart(editor, selectedElm, startW, startH);
          resizeStarted = true;
        }
      };
      var endGhostResize = function () {
        resizeStarted = false;
        var setSizeProp = function (name$$1, value) {
          if (value) {
            if (selectedElm.style[name$$1] || !editor.schema.isValid(selectedElm.nodeName.toLowerCase(), name$$1)) {
              dom.setStyle(getResizeTarget(selectedElm), name$$1, value);
            } else {
              dom.setAttrib(getResizeTarget(selectedElm), name$$1, value);
            }
          }
        };
        setSizeProp('width', width);
        setSizeProp('height', height);
        dom.unbind(editableDoc, 'mousemove', resizeGhostElement);
        dom.unbind(editableDoc, 'mouseup', endGhostResize);
        if (rootDocument !== editableDoc) {
          dom.unbind(rootDocument, 'mousemove', resizeGhostElement);
          dom.unbind(rootDocument, 'mouseup', endGhostResize);
        }
        dom.remove(selectedElmGhost);
        dom.remove(resizeHelper);
        showResizeRect(selectedElm);
        Events.fireObjectResized(editor, selectedElm, width, height);
        dom.setAttrib(selectedElm, 'style', dom.getAttrib(selectedElm, 'style'));
        editor.nodeChanged();
      };
      var showResizeRect = function (targetElm) {
        var position, targetWidth, targetHeight, e, rect;
        hideResizeRect();
        unbindResizeHandleEvents();
        position = dom.getPos(targetElm, rootElement);
        selectedElmX = position.x;
        selectedElmY = position.y;
        rect = targetElm.getBoundingClientRect();
        targetWidth = rect.width || rect.right - rect.left;
        targetHeight = rect.height || rect.bottom - rect.top;
        if (selectedElm !== targetElm) {
          selectedElm = targetElm;
          width = height = 0;
        }
        e = editor.fire('ObjectSelected', { target: targetElm });
        if (isResizable(targetElm) && !e.isDefaultPrevented()) {
          each(resizeHandles, function (handle, name$$1) {
            var handleElm;
            var startDrag = function (e) {
              startX = e.screenX;
              startY = e.screenY;
              startW = getResizeTarget(selectedElm).clientWidth;
              startH = getResizeTarget(selectedElm).clientHeight;
              ratio = startH / startW;
              selectedHandle = handle;
              handle.startPos = {
                x: targetWidth * handle[0] + selectedElmX,
                y: targetHeight * handle[1] + selectedElmY
              };
              startScrollWidth = rootElement.scrollWidth;
              startScrollHeight = rootElement.scrollHeight;
              selectedElmGhost = selectedElm.cloneNode(true);
              dom.addClass(selectedElmGhost, 'mce-clonedresizable');
              dom.setAttrib(selectedElmGhost, 'data-mce-bogus', 'all');
              selectedElmGhost.contentEditable = false;
              selectedElmGhost.unSelectabe = true;
              dom.setStyles(selectedElmGhost, {
                left: selectedElmX,
                top: selectedElmY,
                margin: 0
              });
              selectedElmGhost.removeAttribute('data-mce-selected');
              rootElement.appendChild(selectedElmGhost);
              dom.bind(editableDoc, 'mousemove', resizeGhostElement);
              dom.bind(editableDoc, 'mouseup', endGhostResize);
              if (rootDocument !== editableDoc) {
                dom.bind(rootDocument, 'mousemove', resizeGhostElement);
                dom.bind(rootDocument, 'mouseup', endGhostResize);
              }
              resizeHelper = dom.add(rootElement, 'div', {
                'class': 'mce-resize-helper',
                'data-mce-bogus': 'all'
              }, startW + ' &times; ' + startH);
            };
            handleElm = dom.get('mceResizeHandle' + name$$1);
            if (handleElm) {
              dom.remove(handleElm);
            }
            handleElm = dom.add(rootElement, 'div', {
              'id': 'mceResizeHandle' + name$$1,
              'data-mce-bogus': 'all',
              'class': 'mce-resizehandle',
              'unselectable': true,
              'style': 'cursor:' + name$$1 + '-resize; margin:0; padding:0'
            });
            if (Env.ie === 11) {
              handleElm.contentEditable = false;
            }
            dom.bind(handleElm, 'mousedown', function (e) {
              e.stopImmediatePropagation();
              e.preventDefault();
              startDrag(e);
            });
            handle.elm = handleElm;
            dom.setStyles(handleElm, {
              left: targetWidth * handle[0] + selectedElmX - handleElm.offsetWidth / 2,
              top: targetHeight * handle[1] + selectedElmY - handleElm.offsetHeight / 2
            });
          });
        } else {
          hideResizeRect();
        }
        selectedElm.setAttribute('data-mce-selected', '1');
      };
      var hideResizeRect = function () {
        var name$$1, handleElm;
        unbindResizeHandleEvents();
        if (selectedElm) {
          selectedElm.removeAttribute('data-mce-selected');
        }
        for (name$$1 in resizeHandles) {
          handleElm = dom.get('mceResizeHandle' + name$$1);
          if (handleElm) {
            dom.unbind(handleElm);
            dom.remove(handleElm);
          }
        }
      };
      var updateResizeRect = function (e) {
        var startElm, controlElm;
        var isChildOrEqual = function (node, parent$$1) {
          if (node) {
            do {
              if (node === parent$$1) {
                return true;
              }
            } while (node = node.parentNode);
          }
        };
        if (resizeStarted || editor.removed) {
          return;
        }
        each(dom.select('img[data-mce-selected],hr[data-mce-selected]'), function (img) {
          img.removeAttribute('data-mce-selected');
        });
        controlElm = e.type === 'mousedown' ? e.target : selection.getNode();
        controlElm = dom.$(controlElm).closest('table,img,figure.image,hr')[0];
        if (isChildOrEqual(controlElm, rootElement)) {
          disableGeckoResize();
          startElm = selection.getStart(true);
          if (isChildOrEqual(startElm, controlElm) && isChildOrEqual(selection.getEnd(true), controlElm)) {
            showResizeRect(controlElm);
            return;
          }
        }
        hideResizeRect();
      };
      var isWithinContentEditableFalse = function (elm) {
        return isContentEditableFalse$a(getContentEditableRoot$2(editor.getBody(), elm));
      };
      var unbindResizeHandleEvents = function () {
        for (var name$$1 in resizeHandles) {
          var handle = resizeHandles[name$$1];
          if (handle.elm) {
            dom.unbind(handle.elm);
            delete handle.elm;
          }
        }
      };
      var disableGeckoResize = function () {
        try {
          editor.getDoc().execCommand('enableObjectResizing', false, false);
        } catch (ex) {
        }
      };
      editor.on('init', function () {
        disableGeckoResize();
        if (Env.ie && Env.ie >= 11) {
          editor.on('mousedown click', function (e) {
            var target = e.target, nodeName = target.nodeName;
            if (!resizeStarted && /^(TABLE|IMG|HR)$/.test(nodeName) && !isWithinContentEditableFalse(target)) {
              if (e.button !== 2) {
                editor.selection.select(target, nodeName === 'TABLE');
              }
              if (e.type === 'mousedown') {
                editor.nodeChanged();
              }
            }
          });
          editor.dom.bind(rootElement, 'mscontrolselect', function (e) {
            var delayedSelect = function (node) {
              Delay.setEditorTimeout(editor, function () {
                editor.selection.select(node);
              });
            };
            if (isWithinContentEditableFalse(e.target)) {
              e.preventDefault();
              delayedSelect(e.target);
              return;
            }
            if (/^(TABLE|IMG|HR)$/.test(e.target.nodeName)) {
              e.preventDefault();
              if (e.target.tagName === 'IMG') {
                delayedSelect(e.target);
              }
            }
          });
        }
        var throttledUpdateResizeRect = Delay.throttle(function (e) {
          if (!editor.composing) {
            updateResizeRect(e);
          }
        });
        editor.on('nodechange ResizeEditor ResizeWindow drop FullscreenStateChanged', throttledUpdateResizeRect);
        editor.on('keyup compositionend', function (e) {
          if (selectedElm && selectedElm.nodeName === 'TABLE') {
            throttledUpdateResizeRect(e);
          }
        });
        editor.on('hide blur', hideResizeRect);
        editor.on('contextmenu', contextMenuSelectImage);
      });
      editor.on('remove', unbindResizeHandleEvents);
      var destroy = function () {
        selectedElm = selectedElmGhost = null;
      };
      return {
        isResizable: isResizable,
        showResizeRect: showResizeRect,
        hideResizeRect: hideResizeRect,
        updateResizeRect: updateResizeRect,
        destroy: destroy
      };
    };

    var hasCeProperty = function (node) {
      return NodeType.isContentEditableTrue(node) || NodeType.isContentEditableFalse(node);
    };
    var findParent$1 = function (node, rootNode, predicate) {
      while (node && node !== rootNode) {
        if (predicate(node)) {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    var findClosestIeRange = function (clientX, clientY, doc) {
      var element, rng, rects;
      element = doc.elementFromPoint(clientX, clientY);
      rng = doc.body.createTextRange();
      if (!element || element.tagName === 'HTML') {
        element = doc.body;
      }
      rng.moveToElementText(element);
      rects = Tools.toArray(rng.getClientRects());
      rects = rects.sort(function (a, b) {
        a = Math.abs(Math.max(a.top - clientY, a.bottom - clientY));
        b = Math.abs(Math.max(b.top - clientY, b.bottom - clientY));
        return a - b;
      });
      if (rects.length > 0) {
        clientY = (rects[0].bottom + rects[0].top) / 2;
        try {
          rng.moveToPoint(clientX, clientY);
          rng.collapse(true);
          return rng;
        } catch (ex) {
        }
      }
      return null;
    };
    var moveOutOfContentEditableFalse = function (rng, rootNode) {
      var parentElement = rng && rng.parentElement ? rng.parentElement() : null;
      return NodeType.isContentEditableFalse(findParent$1(parentElement, rootNode, hasCeProperty)) ? null : rng;
    };
    var fromPoint$1 = function (clientX, clientY, doc) {
      var rng, point;
      var pointDoc = doc;
      if (pointDoc.caretPositionFromPoint) {
        point = pointDoc.caretPositionFromPoint(clientX, clientY);
        if (point) {
          rng = doc.createRange();
          rng.setStart(point.offsetNode, point.offset);
          rng.collapse(true);
        }
      } else if (doc.caretRangeFromPoint) {
        rng = doc.caretRangeFromPoint(clientX, clientY);
      } else if (pointDoc.body.createTextRange) {
        rng = pointDoc.body.createTextRange();
        try {
          rng.moveToPoint(clientX, clientY);
          rng.collapse(true);
        } catch (ex) {
          rng = findClosestIeRange(clientX, clientY, doc);
        }
        return moveOutOfContentEditableFalse(rng, doc.body);
      }
      return rng;
    };
    var CaretRangeFromPoint = { fromPoint: fromPoint$1 };

    var processRanges = function (editor, ranges) {
      return map(ranges, function (range$$1) {
        var evt = editor.fire('GetSelectionRange', { range: range$$1 });
        return evt.range !== range$$1 ? evt.range : range$$1;
      });
    };
    var EventProcessRanges = { processRanges: processRanges };

    var fromElements = function (elements, scope) {
      var doc = scope || document;
      var fragment = doc.createDocumentFragment();
      each(elements, function (element) {
        fragment.appendChild(element.dom());
      });
      return Element$$1.fromDom(fragment);
    };

    var tableModel = Immutable('element', 'width', 'rows');
    var tableRow = Immutable('element', 'cells');
    var cellPosition = Immutable('x', 'y');
    var getSpan = function (td, key) {
      var value = parseInt(get$1(td, key), 10);
      return isNaN(value) ? 1 : value;
    };
    var fillout = function (table, x, y, tr, td) {
      var rowspan = getSpan(td, 'rowspan');
      var colspan = getSpan(td, 'colspan');
      var rows = table.rows();
      for (var y2 = y; y2 < y + rowspan; y2++) {
        if (!rows[y2]) {
          rows[y2] = tableRow(deep(tr), []);
        }
        for (var x2 = x; x2 < x + colspan; x2++) {
          var cells = rows[y2].cells();
          cells[x2] = y2 === y && x2 === x ? td : shallow(td);
        }
      }
    };
    var cellExists = function (table, x, y) {
      var rows = table.rows();
      var cells = rows[y] ? rows[y].cells() : [];
      return !!cells[x];
    };
    var skipCellsX = function (table, x, y) {
      while (cellExists(table, x, y)) {
        x++;
      }
      return x;
    };
    var getWidth = function (rows) {
      return foldl(rows, function (acc, row) {
        return row.cells().length > acc ? row.cells().length : acc;
      }, 0);
    };
    var findElementPos = function (table, element) {
      var rows = table.rows();
      for (var y = 0; y < rows.length; y++) {
        var cells = rows[y].cells();
        for (var x = 0; x < cells.length; x++) {
          if (eq(cells[x], element)) {
            return Option.some(cellPosition(x, y));
          }
        }
      }
      return Option.none();
    };
    var extractRows = function (table, sx, sy, ex, ey) {
      var newRows = [];
      var rows = table.rows();
      for (var y = sy; y <= ey; y++) {
        var cells = rows[y].cells();
        var slice = sx < ex ? cells.slice(sx, ex + 1) : cells.slice(ex, sx + 1);
        newRows.push(tableRow(rows[y].element(), slice));
      }
      return newRows;
    };
    var subTable = function (table, startPos, endPos) {
      var sx = startPos.x(), sy = startPos.y();
      var ex = endPos.x(), ey = endPos.y();
      var newRows = sy < ey ? extractRows(table, sx, sy, ex, ey) : extractRows(table, sx, ey, ex, sy);
      return tableModel(table.element(), getWidth(newRows), newRows);
    };
    var createDomTable = function (table, rows) {
      var tableElement = shallow(table.element());
      var tableBody = Element$$1.fromTag('tbody');
      append$1(tableBody, rows);
      append(tableElement, tableBody);
      return tableElement;
    };
    var modelRowsToDomRows = function (table) {
      return map(table.rows(), function (row) {
        var cells = map(row.cells(), function (cell) {
          var td = deep(cell);
          remove(td, 'colspan');
          remove(td, 'rowspan');
          return td;
        });
        var tr = shallow(row.element());
        append$1(tr, cells);
        return tr;
      });
    };
    var fromDom$2 = function (tableElm) {
      var table = tableModel(shallow(tableElm), 0, []);
      each(descendants$1(tableElm, 'tr'), function (tr, y) {
        each(descendants$1(tr, 'td,th'), function (td, x) {
          fillout(table, skipCellsX(table, x, y), y, tr, td);
        });
      });
      return tableModel(table.element(), getWidth(table.rows()), table.rows());
    };
    var toDom = function (table) {
      return createDomTable(table, modelRowsToDomRows(table));
    };
    var subsection = function (table, startElement, endElement) {
      return findElementPos(table, startElement).bind(function (startPos) {
        return findElementPos(table, endElement).map(function (endPos) {
          return subTable(table, startPos, endPos);
        });
      });
    };
    var SimpleTableModel = {
      fromDom: fromDom$2,
      toDom: toDom,
      subsection: subsection
    };

    var findParentListContainer = function (parents$$1) {
      return find(parents$$1, function (elm) {
        return name(elm) === 'ul' || name(elm) === 'ol';
      });
    };
    var getFullySelectedListWrappers = function (parents$$1, rng) {
      return find(parents$$1, function (elm) {
        return name(elm) === 'li' && hasAllContentsSelected(elm, rng);
      }).fold(constant([]), function (li) {
        return findParentListContainer(parents$$1).map(function (listCont) {
          return [
            Element$$1.fromTag('li'),
            Element$$1.fromTag(name(listCont))
          ];
        }).getOr([]);
      });
    };
    var wrap$3 = function (innerElm, elms) {
      var wrapped = foldl(elms, function (acc, elm) {
        append(elm, acc);
        return elm;
      }, innerElm);
      return elms.length > 0 ? fromElements([wrapped]) : wrapped;
    };
    var directListWrappers = function (commonAnchorContainer) {
      if (isListItem(commonAnchorContainer)) {
        return parent(commonAnchorContainer).filter(isList).fold(constant([]), function (listElm) {
          return [
            commonAnchorContainer,
            listElm
          ];
        });
      } else {
        return isList(commonAnchorContainer) ? [commonAnchorContainer] : [];
      }
    };
    var getWrapElements = function (rootNode, rng) {
      var commonAnchorContainer = Element$$1.fromDom(rng.commonAncestorContainer);
      var parents$$1 = Parents.parentsAndSelf(commonAnchorContainer, rootNode);
      var wrapElements = filter(parents$$1, function (elm) {
        return isInline(elm) || isHeading(elm);
      });
      var listWrappers = getFullySelectedListWrappers(parents$$1, rng);
      var allWrappers = wrapElements.concat(listWrappers.length ? listWrappers : directListWrappers(commonAnchorContainer));
      return map(allWrappers, shallow);
    };
    var emptyFragment = function () {
      return fromElements([]);
    };
    var getFragmentFromRange = function (rootNode, rng) {
      return wrap$3(Element$$1.fromDom(rng.cloneContents()), getWrapElements(rootNode, rng));
    };
    var getParentTable = function (rootElm, cell) {
      return ancestor$1(cell, 'table', curry(eq, rootElm));
    };
    var getTableFragment = function (rootNode, selectedTableCells) {
      return getParentTable(rootNode, selectedTableCells[0]).bind(function (tableElm) {
        var firstCell = selectedTableCells[0];
        var lastCell = selectedTableCells[selectedTableCells.length - 1];
        var fullTableModel = SimpleTableModel.fromDom(tableElm);
        return SimpleTableModel.subsection(fullTableModel, firstCell, lastCell).map(function (sectionedTableModel) {
          return fromElements([SimpleTableModel.toDom(sectionedTableModel)]);
        });
      }).getOrThunk(emptyFragment);
    };
    var getSelectionFragment = function (rootNode, ranges) {
      return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(rootNode, ranges[0]);
    };
    var read$4 = function (rootNode, ranges) {
      var selectedCells = TableCellSelection.getCellsFromElementOrRanges(ranges, rootNode);
      return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(rootNode, ranges);
    };
    var FragmentReader = { read: read$4 };

    var getContent = function (editor, args) {
      var rng = editor.selection.getRng(), tmpElm = editor.dom.create('body');
      var sel = editor.selection.getSel();
      var fragment;
      var ranges = EventProcessRanges.processRanges(editor, MultiRange.getRanges(sel));
      args = args || {};
      args.get = true;
      args.format = args.format || 'html';
      args.selection = true;
      args = editor.fire('BeforeGetContent', args);
      if (args.isDefaultPrevented()) {
        editor.fire('GetContent', args);
        return args.content;
      }
      if (args.format === 'text') {
        return editor.selection.isCollapsed() ? '' : Zwsp.trim(rng.text || (sel.toString ? sel.toString() : ''));
      }
      if (rng.cloneContents) {
        fragment = args.contextual ? FragmentReader.read(Element$$1.fromDom(editor.getBody()), ranges).dom() : rng.cloneContents();
        if (fragment) {
          tmpElm.appendChild(fragment);
        }
      } else if (rng.item !== undefined || rng.htmlText !== undefined) {
        tmpElm.innerHTML = '<br>' + (rng.item ? rng.item(0).outerHTML : rng.htmlText);
        tmpElm.removeChild(tmpElm.firstChild);
      } else {
        tmpElm.innerHTML = rng.toString();
      }
      args.getInner = true;
      var content = editor.selection.serializer.serialize(tmpElm, args);
      if (args.format === 'tree') {
        return content;
      }
      args.content = editor.selection.isCollapsed() ? '' : content;
      editor.fire('GetContent', args);
      return args.content;
    };
    var GetSelectionContent = { getContent: getContent };

    var setContent = function (editor, content, args) {
      var rng = editor.selection.getRng(), caretNode;
      var doc = editor.getDoc();
      var frag, temp;
      args = args || { format: 'html' };
      args.set = true;
      args.selection = true;
      args.content = content;
      if (!args.no_events) {
        args = editor.fire('BeforeSetContent', args);
        if (args.isDefaultPrevented()) {
          editor.fire('SetContent', args);
          return;
        }
      }
      content = args.content;
      if (rng.insertNode) {
        content += '<span id="__caret">_</span>';
        if (rng.startContainer === doc && rng.endContainer === doc) {
          doc.body.innerHTML = content;
        } else {
          rng.deleteContents();
          if (doc.body.childNodes.length === 0) {
            doc.body.innerHTML = content;
          } else {
            if (rng.createContextualFragment) {
              rng.insertNode(rng.createContextualFragment(content));
            } else {
              frag = doc.createDocumentFragment();
              temp = doc.createElement('div');
              frag.appendChild(temp);
              temp.outerHTML = content;
              rng.insertNode(frag);
            }
          }
        }
        caretNode = editor.dom.get('__caret');
        rng = doc.createRange();
        rng.setStartBefore(caretNode);
        rng.setEndBefore(caretNode);
        editor.selection.setRng(rng);
        editor.dom.remove('__caret');
        try {
          editor.selection.setRng(rng);
        } catch (ex) {
        }
      } else {
        if (rng.item) {
          doc.execCommand('Delete', false, null);
          rng = editor.getRng();
        }
        if (/^\s+/.test(content)) {
          rng.pasteHTML('<span id="__mce_tmp">_</span>' + content);
          editor.dom.remove('__mce_tmp');
        } else {
          rng.pasteHTML(content);
        }
      }
      if (!args.no_events) {
        editor.fire('SetContent', args);
      }
    };
    var SetSelectionContent = { setContent: setContent };

    var getEndpointElement = function (root, rng, start, real, resolve) {
      var container = start ? rng.startContainer : rng.endContainer;
      var offset = start ? rng.startOffset : rng.endOffset;
      return Option.from(container).map(Element$$1.fromDom).map(function (elm) {
        return !real || !rng.collapsed ? child(elm, resolve(elm, offset)).getOr(elm) : elm;
      }).bind(function (elm) {
        return isElement(elm) ? Option.some(elm) : parent(elm);
      }).map(function (elm) {
        return elm.dom();
      }).getOr(root);
    };
    var getStart$2 = function (root, rng, real) {
      return getEndpointElement(root, rng, true, real, function (elm, offset) {
        return Math.min(childNodesCount(elm), offset);
      });
    };
    var getEnd = function (root, rng, real) {
      return getEndpointElement(root, rng, false, real, function (elm, offset) {
        return offset > 0 ? offset - 1 : offset;
      });
    };
    var skipEmptyTextNodes = function (node, forwards) {
      var orig = node;
      while (node && NodeType.isText(node) && node.length === 0) {
        node = forwards ? node.nextSibling : node.previousSibling;
      }
      return node || orig;
    };
    var getNode$1 = function (root, rng) {
      var elm, startContainer, endContainer, startOffset, endOffset;
      if (!rng) {
        return root;
      }
      startContainer = rng.startContainer;
      endContainer = rng.endContainer;
      startOffset = rng.startOffset;
      endOffset = rng.endOffset;
      elm = rng.commonAncestorContainer;
      if (!rng.collapsed) {
        if (startContainer === endContainer) {
          if (endOffset - startOffset < 2) {
            if (startContainer.hasChildNodes()) {
              elm = startContainer.childNodes[startOffset];
            }
          }
        }
        if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
          if (startContainer.length === startOffset) {
            startContainer = skipEmptyTextNodes(startContainer.nextSibling, true);
          } else {
            startContainer = startContainer.parentNode;
          }
          if (endOffset === 0) {
            endContainer = skipEmptyTextNodes(endContainer.previousSibling, false);
          } else {
            endContainer = endContainer.parentNode;
          }
          if (startContainer && startContainer === endContainer) {
            return startContainer;
          }
        }
      }
      if (elm && elm.nodeType === 3) {
        return elm.parentNode;
      }
      return elm;
    };
    var getSelectedBlocks = function (dom, rng, startElm, endElm) {
      var node, root;
      var selectedBlocks = [];
      root = dom.getRoot();
      startElm = dom.getParent(startElm || getStart$2(root, rng, rng.collapsed), dom.isBlock);
      endElm = dom.getParent(endElm || getEnd(root, rng, rng.collapsed), dom.isBlock);
      if (startElm && startElm !== root) {
        selectedBlocks.push(startElm);
      }
      if (startElm && endElm && startElm !== endElm) {
        node = startElm;
        var walker = new TreeWalker(startElm, root);
        while ((node = walker.next()) && node !== endElm) {
          if (dom.isBlock(node)) {
            selectedBlocks.push(node);
          }
        }
      }
      if (endElm && startElm !== endElm && endElm !== root) {
        selectedBlocks.push(endElm);
      }
      return selectedBlocks;
    };
    var select$1 = function (dom, node, content) {
      return Option.from(node).map(function (node) {
        var idx = dom.nodeIndex(node);
        var rng = dom.createRng();
        rng.setStart(node.parentNode, idx);
        rng.setEnd(node.parentNode, idx + 1);
        if (content) {
          moveEndPoint$1(dom, rng, node, true);
          moveEndPoint$1(dom, rng, node, false);
        }
        return rng;
      });
    };

    var each$j = Tools.each;
    var isNativeIeSelection = function (rng) {
      return !!rng.select;
    };
    var isAttachedToDom = function (node) {
      return !!(node && node.ownerDocument) && contains$3(Element$$1.fromDom(node.ownerDocument), Element$$1.fromDom(node));
    };
    var isValidRange = function (rng) {
      if (!rng) {
        return false;
      } else if (isNativeIeSelection(rng)) {
        return true;
      } else {
        return isAttachedToDom(rng.startContainer) && isAttachedToDom(rng.endContainer);
      }
    };
    var Selection = function (dom, win, serializer, editor) {
      var bookmarkManager, controlSelection;
      var selectedRange, explicitRange, selectorChangedData;
      var setCursorLocation = function (node, offset) {
        var rng = dom.createRng();
        if (!node) {
          moveEndPoint$1(dom, rng, editor.getBody(), true);
          setRng(rng);
        } else {
          rng.setStart(node, offset);
          rng.setEnd(node, offset);
          setRng(rng);
          collapse(false);
        }
      };
      var getContent = function (args) {
        return GetSelectionContent.getContent(editor, args);
      };
      var setContent = function (content, args) {
        return SetSelectionContent.setContent(editor, content, args);
      };
      var getStart = function (real) {
        return getStart$2(editor.getBody(), getRng(), real);
      };
      var getEnd$$1 = function (real) {
        return getEnd(editor.getBody(), getRng(), real);
      };
      var getBookmark = function (type, normalized) {
        return bookmarkManager.getBookmark(type, normalized);
      };
      var moveToBookmark = function (bookmark) {
        return bookmarkManager.moveToBookmark(bookmark);
      };
      var select = function (node, content) {
        select$1(dom, node, content).each(setRng);
        return node;
      };
      var isCollapsed = function () {
        var rng = getRng(), sel = getSel();
        if (!rng || rng.item) {
          return false;
        }
        if (rng.compareEndPoints) {
          return rng.compareEndPoints('StartToEnd', rng) === 0;
        }
        return !sel || rng.collapsed;
      };
      var collapse = function (toStart) {
        var rng = getRng();
        rng.collapse(!!toStart);
        setRng(rng);
      };
      var getSel = function () {
        return win.getSelection ? win.getSelection() : win.document.selection;
      };
      var getRng = function () {
        var selection, rng, elm, doc;
        var tryCompareBoundaryPoints = function (how, sourceRange, destinationRange) {
          try {
            return sourceRange.compareBoundaryPoints(how, destinationRange);
          } catch (ex) {
            return -1;
          }
        };
        if (!win) {
          return null;
        }
        doc = win.document;
        if (typeof doc === 'undefined' || doc === null) {
          return null;
        }
        if (editor.bookmark !== undefined && EditorFocus.hasFocus(editor) === false) {
          var bookmark = SelectionBookmark.getRng(editor);
          if (bookmark.isSome()) {
            return bookmark.map(function (r) {
              return EventProcessRanges.processRanges(editor, [r])[0];
            }).getOr(doc.createRange());
          }
        }
        try {
          if (selection = getSel()) {
            if (selection.rangeCount > 0) {
              rng = selection.getRangeAt(0);
            } else {
              rng = selection.createRange ? selection.createRange() : doc.createRange();
            }
          }
        } catch (ex) {
        }
        rng = EventProcessRanges.processRanges(editor, [rng])[0];
        if (!rng) {
          rng = doc.createRange ? doc.createRange() : doc.body.createTextRange();
        }
        if (rng.setStart && rng.startContainer.nodeType === 9 && rng.collapsed) {
          elm = dom.getRoot();
          rng.setStart(elm, 0);
          rng.setEnd(elm, 0);
        }
        if (selectedRange && explicitRange) {
          if (tryCompareBoundaryPoints(rng.START_TO_START, rng, selectedRange) === 0 && tryCompareBoundaryPoints(rng.END_TO_END, rng, selectedRange) === 0) {
            rng = explicitRange;
          } else {
            selectedRange = null;
            explicitRange = null;
          }
        }
        return rng;
      };
      var setRng = function (rng, forward) {
        var sel, node, evt;
        if (!isValidRange(rng)) {
          return;
        }
        var ieRange = isNativeIeSelection(rng) ? rng : null;
        if (ieRange) {
          explicitRange = null;
          try {
            ieRange.select();
          } catch (ex) {
          }
          return;
        }
        sel = getSel();
        evt = editor.fire('SetSelectionRange', {
          range: rng,
          forward: forward
        });
        rng = evt.range;
        if (sel) {
          explicitRange = rng;
          try {
            sel.removeAllRanges();
            sel.addRange(rng);
          } catch (ex) {
          }
          if (forward === false && sel.extend) {
            sel.collapse(rng.endContainer, rng.endOffset);
            sel.extend(rng.startContainer, rng.startOffset);
          }
          selectedRange = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
        }
        if (!rng.collapsed && rng.startContainer === rng.endContainer && sel.setBaseAndExtent && !Env.ie) {
          if (rng.endOffset - rng.startOffset < 2) {
            if (rng.startContainer.hasChildNodes()) {
              node = rng.startContainer.childNodes[rng.startOffset];
              if (node && node.tagName === 'IMG') {
                sel.setBaseAndExtent(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset);
                if (sel.anchorNode !== rng.startContainer || sel.focusNode !== rng.endContainer) {
                  sel.setBaseAndExtent(node, 0, node, 1);
                }
              }
            }
          }
        }
        editor.fire('AfterSetSelectionRange', {
          range: rng,
          forward: forward
        });
      };
      var setNode = function (elm) {
        setContent(dom.getOuterHTML(elm));
        return elm;
      };
      var getNode = function () {
        return getNode$1(editor.getBody(), getRng());
      };
      var getSelectedBlocks$$1 = function (startElm, endElm) {
        return getSelectedBlocks(dom, getRng(), startElm, endElm);
      };
      var isForward = function () {
        var sel = getSel();
        var anchorRange, focusRange;
        if (!sel || !sel.anchorNode || !sel.focusNode) {
          return true;
        }
        anchorRange = dom.createRng();
        anchorRange.setStart(sel.anchorNode, sel.anchorOffset);
        anchorRange.collapse(true);
        focusRange = dom.createRng();
        focusRange.setStart(sel.focusNode, sel.focusOffset);
        focusRange.collapse(true);
        return anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, focusRange) <= 0;
      };
      var normalize = function () {
        var rng = getRng();
        var sel = getSel();
        if (!MultiRange.hasMultipleRanges(sel) && hasAnyRanges(editor)) {
          var normRng = NormalizeRange.normalize(dom, rng);
          normRng.each(function (normRng) {
            setRng(normRng, isForward());
          });
          return normRng.getOr(rng);
        }
        return rng;
      };
      var selectorChanged = function (selector, callback) {
        var currentSelectors;
        if (!selectorChangedData) {
          selectorChangedData = {};
          currentSelectors = {};
          editor.on('NodeChange', function (e) {
            var node = e.element, parents = dom.getParents(node, null, dom.getRoot()), matchedSelectors = {};
            each$j(selectorChangedData, function (callbacks, selector) {
              each$j(parents, function (node) {
                if (dom.is(node, selector)) {
                  if (!currentSelectors[selector]) {
                    each$j(callbacks, function (callback) {
                      callback(true, {
                        node: node,
                        selector: selector,
                        parents: parents
                      });
                    });
                    currentSelectors[selector] = callbacks;
                  }
                  matchedSelectors[selector] = callbacks;
                  return false;
                }
              });
            });
            each$j(currentSelectors, function (callbacks, selector) {
              if (!matchedSelectors[selector]) {
                delete currentSelectors[selector];
                each$j(callbacks, function (callback) {
                  callback(false, {
                    node: node,
                    selector: selector,
                    parents: parents
                  });
                });
              }
            });
          });
        }
        if (!selectorChangedData[selector]) {
          selectorChangedData[selector] = [];
        }
        selectorChangedData[selector].push(callback);
        return exports;
      };
      var getScrollContainer = function () {
        var scrollContainer;
        var node = dom.getRoot();
        while (node && node.nodeName !== 'BODY') {
          if (node.scrollHeight > node.clientHeight) {
            scrollContainer = node;
            break;
          }
          node = node.parentNode;
        }
        return scrollContainer;
      };
      var scrollIntoView = function (elm, alignToTop) {
        return ScrollIntoView.scrollElementIntoView(editor, elm, alignToTop);
      };
      var placeCaretAt = function (clientX, clientY) {
        return setRng(CaretRangeFromPoint.fromPoint(clientX, clientY, editor.getDoc()));
      };
      var getBoundingClientRect = function () {
        var rng = getRng();
        return rng.collapsed ? CaretPosition$1.fromRangeStart(rng).getClientRects()[0] : rng.getBoundingClientRect();
      };
      var destroy = function () {
        win = selectedRange = explicitRange = null;
        controlSelection.destroy();
      };
      var exports = {
        bookmarkManager: null,
        controlSelection: null,
        dom: dom,
        win: win,
        serializer: serializer,
        editor: editor,
        collapse: collapse,
        setCursorLocation: setCursorLocation,
        getContent: getContent,
        setContent: setContent,
        getBookmark: getBookmark,
        moveToBookmark: moveToBookmark,
        select: select,
        isCollapsed: isCollapsed,
        isForward: isForward,
        setNode: setNode,
        getNode: getNode,
        getSel: getSel,
        setRng: setRng,
        getRng: getRng,
        getStart: getStart,
        getEnd: getEnd$$1,
        getSelectedBlocks: getSelectedBlocks$$1,
        normalize: normalize,
        selectorChanged: selectorChanged,
        getScrollContainer: getScrollContainer,
        scrollIntoView: scrollIntoView,
        placeCaretAt: placeCaretAt,
        getBoundingClientRect: getBoundingClientRect,
        destroy: destroy
      };
      bookmarkManager = BookmarkManager$1(exports);
      controlSelection = ControlSelection(exports, editor);
      exports.bookmarkManager = bookmarkManager;
      exports.controlSelection = controlSelection;
      return exports;
    };

    var isContentEditableFalse$b = NodeType.isContentEditableFalse;
    var getSelectedNode$1 = getSelectedNode;
    var isAfterContentEditableFalse$2 = isAfterContentEditableFalse;
    var isBeforeContentEditableFalse$2 = isBeforeContentEditableFalse;
    var getVisualCaretPosition = function (walkFn, caretPosition) {
      while (caretPosition = walkFn(caretPosition)) {
        if (caretPosition.isVisible()) {
          return caretPosition;
        }
      }
      return caretPosition;
    };
    var isMoveInsideSameBlock = function (from, to) {
      var inSameBlock = isInSameBlock(from, to);
      if (!inSameBlock && NodeType.isBr(from.getNode())) {
        return true;
      }
      return inSameBlock;
    };
    var moveToCeFalseHorizontally = function (direction, editor, getNextPosFn, range) {
      var node, caretPosition, peekCaretPosition, rangeIsInContainerBlock;
      var forwards = direction === HDirection.Forwards;
      var isBeforeContentEditableFalseFn = forwards ? isBeforeContentEditableFalse$2 : isAfterContentEditableFalse$2;
      if (!range.collapsed) {
        node = getSelectedNode$1(range);
        if (isContentEditableFalse$b(node)) {
          return showCaret(direction, editor, node, direction === HDirection.Backwards, true);
        }
      }
      rangeIsInContainerBlock = isRangeInCaretContainerBlock(range);
      caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range);
      if (isBeforeContentEditableFalseFn(caretPosition)) {
        return selectNode(editor, caretPosition.getNode(!forwards));
      }
      caretPosition = getNextPosFn(caretPosition);
      if (!caretPosition) {
        if (rangeIsInContainerBlock) {
          return range;
        }
        return null;
      }
      if (isBeforeContentEditableFalseFn(caretPosition)) {
        return showCaret(direction, editor, caretPosition.getNode(!forwards), forwards, true);
      }
      peekCaretPosition = getNextPosFn(caretPosition);
      if (isBeforeContentEditableFalseFn(peekCaretPosition)) {
        if (isMoveInsideSameBlock(caretPosition, peekCaretPosition)) {
          return showCaret(direction, editor, peekCaretPosition.getNode(!forwards), forwards, true);
        }
      }
      if (rangeIsInContainerBlock) {
        return renderRangeCaret(editor, caretPosition.toRange(), true);
      }
      return null;
    };
    var moveToCeFalseVertically = function (direction, editor, walkerFn, range) {
      var caretPosition, linePositions, nextLinePositions;
      var closestNextLineRect, caretClientRect, clientX;
      var dist1, dist2, contentEditableFalseNode;
      contentEditableFalseNode = getSelectedNode$1(range);
      caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range);
      linePositions = walkerFn(editor.getBody(), isAboveLine(1), caretPosition);
      nextLinePositions = Arr.filter(linePositions, isLine(1));
      caretClientRect = Arr.last(caretPosition.getClientRects());
      if (isBeforeContentEditableFalse$2(caretPosition) || isBeforeTable(caretPosition)) {
        contentEditableFalseNode = caretPosition.getNode();
      }
      if (isAfterContentEditableFalse$2(caretPosition) || isAfterTable(caretPosition)) {
        contentEditableFalseNode = caretPosition.getNode(true);
      }
      if (!caretClientRect) {
        return null;
      }
      clientX = caretClientRect.left;
      closestNextLineRect = findClosestClientRect(nextLinePositions, clientX);
      if (closestNextLineRect) {
        if (isContentEditableFalse$b(closestNextLineRect.node)) {
          dist1 = Math.abs(clientX - closestNextLineRect.left);
          dist2 = Math.abs(clientX - closestNextLineRect.right);
          return showCaret(direction, editor, closestNextLineRect.node, dist1 < dist2, true);
        }
      }
      if (contentEditableFalseNode) {
        var caretPositions = positionsUntil(direction, editor.getBody(), isAboveLine(1), contentEditableFalseNode);
        closestNextLineRect = findClosestClientRect(Arr.filter(caretPositions, isLine(1)), clientX);
        if (closestNextLineRect) {
          return renderRangeCaret(editor, closestNextLineRect.position.toRange(), true);
        }
        closestNextLineRect = Arr.last(Arr.filter(caretPositions, isLine(0)));
        if (closestNextLineRect) {
          return renderRangeCaret(editor, closestNextLineRect.position.toRange(), true);
        }
      }
    };
    var createTextBlock = function (editor) {
      var textBlock = editor.dom.create(editor.settings.forced_root_block);
      if (!Env.ie || Env.ie >= 11) {
        textBlock.innerHTML = '<br data-mce-bogus="1">';
      }
      return textBlock;
    };
    var exitPreBlock = function (editor, direction, range) {
      var pre, caretPos, newBlock;
      var caretWalker = CaretWalker(editor.getBody());
      var getNextVisualCaretPosition = Fun.curry(getVisualCaretPosition, caretWalker.next);
      var getPrevVisualCaretPosition = Fun.curry(getVisualCaretPosition, caretWalker.prev);
      if (range.collapsed && editor.settings.forced_root_block) {
        pre = editor.dom.getParent(range.startContainer, 'PRE');
        if (!pre) {
          return;
        }
        if (direction === 1) {
          caretPos = getNextVisualCaretPosition(CaretPosition$1.fromRangeStart(range));
        } else {
          caretPos = getPrevVisualCaretPosition(CaretPosition$1.fromRangeStart(range));
        }
        if (!caretPos) {
          newBlock = createTextBlock(editor);
          if (direction === 1) {
            editor.$(pre).after(newBlock);
          } else {
            editor.$(pre).before(newBlock);
          }
          editor.selection.select(newBlock, true);
          editor.selection.collapse();
        }
      }
    };
    var getHorizontalRange = function (editor, forward) {
      var caretWalker = CaretWalker(editor.getBody());
      var getNextVisualCaretPosition = Fun.curry(getVisualCaretPosition, caretWalker.next);
      var getPrevVisualCaretPosition = Fun.curry(getVisualCaretPosition, caretWalker.prev);
      var newRange;
      var direction = forward ? HDirection.Forwards : HDirection.Backwards;
      var getNextPosFn = forward ? getNextVisualCaretPosition : getPrevVisualCaretPosition;
      var range = editor.selection.getRng();
      newRange = moveToCeFalseHorizontally(direction, editor, getNextPosFn, range);
      if (newRange) {
        return newRange;
      }
      newRange = exitPreBlock(editor, direction, range);
      if (newRange) {
        return newRange;
      }
      return null;
    };
    var getVerticalRange = function (editor, down) {
      var newRange;
      var direction = down ? 1 : -1;
      var walkerFn = down ? downUntil : upUntil;
      var range = editor.selection.getRng();
      newRange = moveToCeFalseVertically(direction, editor, walkerFn, range);
      if (newRange) {
        return newRange;
      }
      newRange = exitPreBlock(editor, direction, range);
      if (newRange) {
        return newRange;
      }
      return null;
    };
    var moveH$1 = function (editor, forward) {
      return function () {
        var newRng = getHorizontalRange(editor, forward);
        if (newRng) {
          editor.selection.setRng(newRng);
          return true;
        } else {
          return false;
        }
      };
    };
    var moveV$1 = function (editor, down) {
      return function () {
        var newRng = getVerticalRange(editor, down);
        if (newRng) {
          editor.selection.setRng(newRng);
          return true;
        } else {
          return false;
        }
      };
    };

    var defaultPatterns = function (patterns) {
      return map(patterns, function (pattern) {
        return merge({
          shiftKey: false,
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          keyCode: 0,
          action: noop
        }, pattern);
      });
    };
    var matchesEvent = function (pattern, evt) {
      return evt.keyCode === pattern.keyCode && evt.shiftKey === pattern.shiftKey && evt.altKey === pattern.altKey && evt.ctrlKey === pattern.ctrlKey && evt.metaKey === pattern.metaKey;
    };
    var match$1 = function (patterns, evt) {
      return bind(defaultPatterns(patterns), function (pattern) {
        return matchesEvent(pattern, evt) ? [pattern] : [];
      });
    };
    var action = function (f) {
      var x = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        x[_i - 1] = arguments[_i];
      }
      var args = Array.prototype.slice.call(arguments, 1);
      return function () {
        return f.apply(null, args);
      };
    };
    var execute = function (patterns, evt) {
      return find(match$1(patterns, evt), function (pattern) {
        return pattern.action();
      });
    };
    var MatchKeys = {
      match: match$1,
      action: action,
      execute: execute
    };

    var executeKeydownOverride = function (editor, caret, evt) {
      var os = PlatformDetection$1.detect().os;
      MatchKeys.execute([
        {
          keyCode: VK.RIGHT,
          action: moveH$1(editor, true)
        },
        {
          keyCode: VK.LEFT,
          action: moveH$1(editor, false)
        },
        {
          keyCode: VK.UP,
          action: moveV$1(editor, false)
        },
        {
          keyCode: VK.DOWN,
          action: moveV$1(editor, true)
        },
        {
          keyCode: VK.RIGHT,
          action: moveH(editor, true)
        },
        {
          keyCode: VK.LEFT,
          action: moveH(editor, false)
        },
        {
          keyCode: VK.UP,
          action: moveV(editor, false)
        },
        {
          keyCode: VK.DOWN,
          action: moveV(editor, true)
        },
        {
          keyCode: VK.RIGHT,
          action: BoundarySelection.move(editor, caret, true)
        },
        {
          keyCode: VK.LEFT,
          action: BoundarySelection.move(editor, caret, false)
        },
        {
          keyCode: VK.RIGHT,
          ctrlKey: !os.isOSX(),
          altKey: os.isOSX(),
          action: BoundarySelection.moveNextWord(editor, caret)
        },
        {
          keyCode: VK.LEFT,
          ctrlKey: !os.isOSX(),
          altKey: os.isOSX(),
          action: BoundarySelection.movePrevWord(editor, caret)
        }
      ], evt).each(function (_) {
        evt.preventDefault();
      });
    };
    var setup$7 = function (editor, caret) {
      editor.on('keydown', function (evt) {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride(editor, caret, evt);
        }
      });
    };
    var ArrowKeys = { setup: setup$7 };

    var getParentInlines = function (rootElm, startElm) {
      var parents$$1 = Parents.parentsAndSelf(startElm, rootElm);
      return findIndex(parents$$1, isBlock).fold(constant(parents$$1), function (index) {
        return parents$$1.slice(0, index);
      });
    };
    var hasOnlyOneChild$1 = function (elm) {
      return children(elm).length === 1;
    };
    var deleteLastPosition = function (forward, editor, target, parentInlines) {
      var isFormatElement$$1 = curry(isFormatElement, editor);
      var formatNodes = map(filter(parentInlines, isFormatElement$$1), function (elm) {
        return elm.dom();
      });
      if (formatNodes.length === 0) {
        DeleteElement.deleteElement(editor, forward, target);
      } else {
        var pos = replaceWithCaretFormat(target.dom(), formatNodes);
        editor.selection.setRng(pos.toRange());
      }
    };
    var deleteCaret$1 = function (editor, forward) {
      var rootElm = Element$$1.fromDom(editor.getBody());
      var startElm = Element$$1.fromDom(editor.selection.getStart());
      var parentInlines = filter(getParentInlines(rootElm, startElm), hasOnlyOneChild$1);
      return last(parentInlines).map(function (target) {
        var fromPos = CaretPosition$1.fromRangeStart(editor.selection.getRng());
        if (DeleteUtils.willDeleteLastPositionInElement(forward, fromPos, target.dom()) && !isEmptyCaretFormatElement(target)) {
          deleteLastPosition(forward, editor, target, parentInlines);
          return true;
        } else {
          return false;
        }
      }).getOr(false);
    };
    var backspaceDelete$5 = function (editor, forward) {
      return editor.selection.isCollapsed() ? deleteCaret$1(editor, forward) : false;
    };
    var InlineFormatDelete = { backspaceDelete: backspaceDelete$5 };

    var executeKeydownOverride$1 = function (editor, caret, evt) {
      MatchKeys.execute([
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(CefDelete.backspaceDelete, editor, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(CefDelete.backspaceDelete, editor, true)
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(InlineBoundaryDelete.backspaceDelete, editor, caret, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(InlineBoundaryDelete.backspaceDelete, editor, caret, true)
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(TableDelete.backspaceDelete, editor, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(TableDelete.backspaceDelete, editor, true)
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(BlockRangeDelete.backspaceDelete, editor, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(BlockRangeDelete.backspaceDelete, editor, true)
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(BlockBoundaryDelete.backspaceDelete, editor, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(BlockBoundaryDelete.backspaceDelete, editor, true)
        },
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(InlineFormatDelete.backspaceDelete, editor, false)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(InlineFormatDelete.backspaceDelete, editor, true)
        }
      ], evt).each(function (_) {
        evt.preventDefault();
      });
    };
    var executeKeyupOverride = function (editor, evt) {
      MatchKeys.execute([
        {
          keyCode: VK.BACKSPACE,
          action: MatchKeys.action(CefDelete.paddEmptyElement, editor)
        },
        {
          keyCode: VK.DELETE,
          action: MatchKeys.action(CefDelete.paddEmptyElement, editor)
        }
      ], evt);
    };
    var setup$8 = function (editor, caret) {
      editor.on('keydown', function (evt) {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride$1(editor, caret, evt);
        }
      });
      editor.on('keyup', function (evt) {
        if (evt.isDefaultPrevented() === false) {
          executeKeyupOverride(editor, evt);
        }
      });
    };
    var DeleteBackspaceKeys = { setup: setup$8 };

    var firstNonWhiteSpaceNodeSibling = function (node) {
      while (node) {
        if (node.nodeType === 1 || node.nodeType === 3 && node.data && /[\r\n\s]/.test(node.data)) {
          return node;
        }
        node = node.nextSibling;
      }
    };
    var moveToCaretPosition = function (editor, root) {
      var walker, node, rng, lastNode = root, tempElm;
      var dom = editor.dom;
      var moveCaretBeforeOnEnterElementsMap = editor.schema.getMoveCaretBeforeOnEnterElements();
      if (!root) {
        return;
      }
      if (/^(LI|DT|DD)$/.test(root.nodeName)) {
        var firstChild = firstNonWhiteSpaceNodeSibling(root.firstChild);
        if (firstChild && /^(UL|OL|DL)$/.test(firstChild.nodeName)) {
          root.insertBefore(dom.doc.createTextNode('\xA0'), root.firstChild);
        }
      }
      rng = dom.createRng();
      root.normalize();
      if (root.hasChildNodes()) {
        walker = new TreeWalker(root, root);
        while (node = walker.current()) {
          if (NodeType.isText(node)) {
            rng.setStart(node, 0);
            rng.setEnd(node, 0);
            break;
          }
          if (moveCaretBeforeOnEnterElementsMap[node.nodeName.toLowerCase()]) {
            rng.setStartBefore(node);
            rng.setEndBefore(node);
            break;
          }
          lastNode = node;
          node = walker.next();
        }
        if (!node) {
          rng.setStart(lastNode, 0);
          rng.setEnd(lastNode, 0);
        }
      } else {
        if (NodeType.isBr(root)) {
          if (root.nextSibling && dom.isBlock(root.nextSibling)) {
            rng.setStartBefore(root);
            rng.setEndBefore(root);
          } else {
            rng.setStartAfter(root);
            rng.setEndAfter(root);
          }
        } else {
          rng.setStart(root, 0);
          rng.setEnd(root, 0);
        }
      }
      editor.selection.setRng(rng);
      dom.remove(tempElm);
      editor.selection.scrollIntoView(root);
    };
    var getEditableRoot = function (dom, node) {
      var root = dom.getRoot();
      var parent, editableRoot;
      parent = node;
      while (parent !== root && dom.getContentEditable(parent) !== 'false') {
        if (dom.getContentEditable(parent) === 'true') {
          editableRoot = parent;
        }
        parent = parent.parentNode;
      }
      return parent !== root ? editableRoot : root;
    };
    var getParentBlock$2 = function (editor) {
      return Option.from(editor.dom.getParent(editor.selection.getStart(true), editor.dom.isBlock));
    };
    var getParentBlockName = function (editor) {
      return getParentBlock$2(editor).fold(constant(''), function (parentBlock) {
        return parentBlock.nodeName.toUpperCase();
      });
    };
    var isListItemParentBlock = function (editor) {
      return getParentBlock$2(editor).filter(function (elm) {
        return isListItem(Element$$1.fromDom(elm));
      }).isSome();
    };
    var NewLineUtils = {
      moveToCaretPosition: moveToCaretPosition,
      getEditableRoot: getEditableRoot,
      getParentBlock: getParentBlock$2,
      getParentBlockName: getParentBlockName,
      isListItemParentBlock: isListItemParentBlock
    };

    var hasFirstChild = function (elm, name) {
      return elm.firstChild && elm.firstChild.nodeName === name;
    };
    var hasParent$1 = function (elm, parentName) {
      return elm && elm.parentNode && elm.parentNode.nodeName === parentName;
    };
    var isListBlock = function (elm) {
      return elm && /^(OL|UL|LI)$/.test(elm.nodeName);
    };
    var isNestedList = function (elm) {
      return isListBlock(elm) && isListBlock(elm.parentNode);
    };
    var getContainerBlock = function (containerBlock) {
      var containerBlockParent = containerBlock.parentNode;
      if (/^(LI|DT|DD)$/.test(containerBlockParent.nodeName)) {
        return containerBlockParent;
      }
      return containerBlock;
    };
    var isFirstOrLastLi = function (containerBlock, parentBlock, first) {
      var node = containerBlock[first ? 'firstChild' : 'lastChild'];
      while (node) {
        if (NodeType.isElement(node)) {
          break;
        }
        node = node[first ? 'nextSibling' : 'previousSibling'];
      }
      return node === parentBlock;
    };
    var insert$1 = function (editor, createNewBlock, containerBlock, parentBlock, newBlockName) {
      var dom = editor.dom;
      var rng = editor.selection.getRng();
      if (containerBlock === editor.getBody()) {
        return;
      }
      if (isNestedList(containerBlock)) {
        newBlockName = 'LI';
      }
      var newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create('BR');
      if (isFirstOrLastLi(containerBlock, parentBlock, true) && isFirstOrLastLi(containerBlock, parentBlock, false)) {
        if (hasParent$1(containerBlock, 'LI')) {
          dom.insertAfter(newBlock, getContainerBlock(containerBlock));
        } else {
          dom.replace(newBlock, containerBlock);
        }
      } else if (isFirstOrLastLi(containerBlock, parentBlock, true)) {
        if (hasParent$1(containerBlock, 'LI')) {
          dom.insertAfter(newBlock, getContainerBlock(containerBlock));
          newBlock.appendChild(dom.doc.createTextNode(' '));
          newBlock.appendChild(containerBlock);
        } else {
          containerBlock.parentNode.insertBefore(newBlock, containerBlock);
        }
      } else if (isFirstOrLastLi(containerBlock, parentBlock, false)) {
        dom.insertAfter(newBlock, getContainerBlock(containerBlock));
      } else {
        containerBlock = getContainerBlock(containerBlock);
        var tmpRng = rng.cloneRange();
        tmpRng.setStartAfter(parentBlock);
        tmpRng.setEndAfter(containerBlock);
        var fragment = tmpRng.extractContents();
        if (newBlockName === 'LI' && hasFirstChild(fragment, 'LI')) {
          newBlock = fragment.firstChild;
          dom.insertAfter(fragment, containerBlock);
        } else {
          dom.insertAfter(fragment, containerBlock);
          dom.insertAfter(newBlock, containerBlock);
        }
      }
      dom.remove(parentBlock);
      NewLineUtils.moveToCaretPosition(editor, newBlock);
    };
    var InsertLi = { insert: insert$1 };

    var isEmptyAnchor = function (elm) {
      return elm && elm.nodeName === 'A' && Tools.trim(Zwsp.trim(elm.innerText || elm.textContent)).length === 0;
    };
    var isTableCell$5 = function (node) {
      return node && /^(TD|TH|CAPTION)$/.test(node.nodeName);
    };
    var emptyBlock = function (elm) {
      elm.innerHTML = '<br data-mce-bogus="1">';
    };
    var containerAndSiblingName = function (container, nodeName) {
      return container.nodeName === nodeName || container.previousSibling && container.previousSibling.nodeName === nodeName;
    };
    var canSplitBlock = function (dom, node) {
      return node && dom.isBlock(node) && !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) && !/^(fixed|absolute)/i.test(node.style.position) && dom.getContentEditable(node) !== 'true';
    };
    var trimInlineElementsOnLeftSideOfBlock = function (dom, nonEmptyElementsMap, block) {
      var node = block;
      var firstChilds = [];
      var i;
      if (!node) {
        return;
      }
      while (node = node.firstChild) {
        if (dom.isBlock(node)) {
          return;
        }
        if (NodeType.isElement(node) && !nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
          firstChilds.push(node);
        }
      }
      i = firstChilds.length;
      while (i--) {
        node = firstChilds[i];
        if (!node.hasChildNodes() || node.firstChild === node.lastChild && node.firstChild.nodeValue === '') {
          dom.remove(node);
        } else {
          if (isEmptyAnchor(node)) {
            dom.remove(node);
          }
        }
      }
    };
    var normalizeZwspOffset = function (start, container, offset) {
      if (NodeType.isText(container) === false) {
        return offset;
      } else if (start) {
        return offset === 1 && container.data.charAt(offset - 1) === Zwsp.ZWSP ? 0 : offset;
      } else {
        return offset === container.data.length - 1 && container.data.charAt(offset) === Zwsp.ZWSP ? container.data.length : offset;
      }
    };
    var includeZwspInRange = function (rng) {
      var newRng = rng.cloneRange();
      newRng.setStart(rng.startContainer, normalizeZwspOffset(true, rng.startContainer, rng.startOffset));
      newRng.setEnd(rng.endContainer, normalizeZwspOffset(false, rng.endContainer, rng.endOffset));
      return newRng;
    };
    var trimLeadingLineBreaks = function (node) {
      do {
        if (NodeType.isText(node)) {
          node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, '');
        }
        node = node.firstChild;
      } while (node);
    };
    var getEditableRoot$1 = function (dom, node) {
      var root = dom.getRoot();
      var parent, editableRoot;
      parent = node;
      while (parent !== root && dom.getContentEditable(parent) !== 'false') {
        if (dom.getContentEditable(parent) === 'true') {
          editableRoot = parent;
        }
        parent = parent.parentNode;
      }
      return parent !== root ? editableRoot : root;
    };
    var setForcedBlockAttrs = function (editor, node) {
      var forcedRootBlockName = Settings.getForcedRootBlock(editor);
      if (forcedRootBlockName && forcedRootBlockName.toLowerCase() === node.tagName.toLowerCase()) {
        editor.dom.setAttribs(node, Settings.getForcedRootBlockAttrs(editor));
      }
    };
    var wrapSelfAndSiblingsInDefaultBlock = function (editor, newBlockName, rng, container, offset) {
      var newBlock, parentBlock, startNode, node, next, rootBlockName;
      var blockName = newBlockName || 'P';
      var dom = editor.dom, editableRoot = getEditableRoot$1(dom, container);
      parentBlock = dom.getParent(container, dom.isBlock);
      if (!parentBlock || !canSplitBlock(dom, parentBlock)) {
        parentBlock = parentBlock || editableRoot;
        if (parentBlock === editor.getBody() || isTableCell$5(parentBlock)) {
          rootBlockName = parentBlock.nodeName.toLowerCase();
        } else {
          rootBlockName = parentBlock.parentNode.nodeName.toLowerCase();
        }
        if (!parentBlock.hasChildNodes()) {
          newBlock = dom.create(blockName);
          setForcedBlockAttrs(editor, newBlock);
          parentBlock.appendChild(newBlock);
          rng.setStart(newBlock, 0);
          rng.setEnd(newBlock, 0);
          return newBlock;
        }
        node = container;
        while (node.parentNode !== parentBlock) {
          node = node.parentNode;
        }
        while (node && !dom.isBlock(node)) {
          startNode = node;
          node = node.previousSibling;
        }
        if (startNode && editor.schema.isValidChild(rootBlockName, blockName.toLowerCase())) {
          newBlock = dom.create(blockName);
          setForcedBlockAttrs(editor, newBlock);
          startNode.parentNode.insertBefore(newBlock, startNode);
          node = startNode;
          while (node && !dom.isBlock(node)) {
            next = node.nextSibling;
            newBlock.appendChild(node);
            node = next;
          }
          rng.setStart(container, offset);
          rng.setEnd(container, offset);
        }
      }
      return container;
    };
    var addBrToBlockIfNeeded = function (dom, block) {
      var lastChild;
      block.normalize();
      lastChild = block.lastChild;
      if (!lastChild || /^(left|right)$/gi.test(dom.getStyle(lastChild, 'float', true))) {
        dom.add(block, 'br');
      }
    };
    var insert$2 = function (editor, evt) {
      var tmpRng, editableRoot, container, offset, parentBlock, shiftKey;
      var newBlock, fragment, containerBlock, parentBlockName, containerBlockName, newBlockName, isAfterLastNodeInContainer;
      var dom = editor.dom;
      var schema = editor.schema, nonEmptyElementsMap = schema.getNonEmptyElements();
      var rng = editor.selection.getRng();
      var createNewBlock = function (name) {
        var node = container, block, clonedNode, caretNode;
        var textInlineElements = schema.getTextInlineElements();
        if (name || parentBlockName === 'TABLE' || parentBlockName === 'HR') {
          block = dom.create(name || newBlockName);
          setForcedBlockAttrs(editor, block);
        } else {
          block = parentBlock.cloneNode(false);
        }
        caretNode = block;
        if (Settings.shouldKeepStyles(editor) === false) {
          dom.setAttrib(block, 'style', null);
          dom.setAttrib(block, 'class', null);
        } else {
          do {
            if (textInlineElements[node.nodeName]) {
              if (isCaretNode(node)) {
                continue;
              }
              clonedNode = node.cloneNode(false);
              dom.setAttrib(clonedNode, 'id', '');
              if (block.hasChildNodes()) {
                clonedNode.appendChild(block.firstChild);
                block.appendChild(clonedNode);
              } else {
                caretNode = clonedNode;
                block.appendChild(clonedNode);
              }
            }
          } while ((node = node.parentNode) && node !== editableRoot);
        }
        emptyBlock(caretNode);
        return block;
      };
      var isCaretAtStartOrEndOfBlock = function (start) {
        var walker, node, name, normalizedOffset;
        normalizedOffset = normalizeZwspOffset(start, container, offset);
        if (NodeType.isText(container) && (start ? normalizedOffset > 0 : normalizedOffset < container.nodeValue.length)) {
          return false;
        }
        if (container.parentNode === parentBlock && isAfterLastNodeInContainer && !start) {
          return true;
        }
        if (start && NodeType.isElement(container) && container === parentBlock.firstChild) {
          return true;
        }
        if (containerAndSiblingName(container, 'TABLE') || containerAndSiblingName(container, 'HR')) {
          return isAfterLastNodeInContainer && !start || !isAfterLastNodeInContainer && start;
        }
        walker = new TreeWalker(container, parentBlock);
        if (NodeType.isText(container)) {
          if (start && normalizedOffset === 0) {
            walker.prev();
          } else if (!start && normalizedOffset === container.nodeValue.length) {
            walker.next();
          }
        }
        while (node = walker.current()) {
          if (NodeType.isElement(node)) {
            if (!node.getAttribute('data-mce-bogus')) {
              name = node.nodeName.toLowerCase();
              if (nonEmptyElementsMap[name] && name !== 'br') {
                return false;
              }
            }
          } else if (NodeType.isText(node) && !/^[ \t\r\n]*$/.test(node.nodeValue)) {
            return false;
          }
          if (start) {
            walker.prev();
          } else {
            walker.next();
          }
        }
        return true;
      };
      var insertNewBlockAfter = function () {
        if (/^(H[1-6]|PRE|FIGURE)$/.test(parentBlockName) && containerBlockName !== 'HGROUP') {
          newBlock = createNewBlock(newBlockName);
        } else {
          newBlock = createNewBlock();
        }
        if (Settings.shouldEndContainerOnEmptyBlock(editor) && canSplitBlock(dom, containerBlock) && dom.isEmpty(parentBlock)) {
          newBlock = dom.split(containerBlock, parentBlock);
        } else {
          dom.insertAfter(newBlock, parentBlock);
        }
        NewLineUtils.moveToCaretPosition(editor, newBlock);
      };
      NormalizeRange.normalize(dom, rng).each(function (normRng) {
        rng.setStart(normRng.startContainer, normRng.startOffset);
        rng.setEnd(normRng.endContainer, normRng.endOffset);
      });
      container = rng.startContainer;
      offset = rng.startOffset;
      newBlockName = Settings.getForcedRootBlock(editor);
      shiftKey = evt.shiftKey;
      if (NodeType.isElement(container) && container.hasChildNodes()) {
        isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
        container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;
        if (isAfterLastNodeInContainer && NodeType.isText(container)) {
          offset = container.nodeValue.length;
        } else {
          offset = 0;
        }
      }
      editableRoot = getEditableRoot$1(dom, container);
      if (!editableRoot) {
        return;
      }
      if (newBlockName && !shiftKey || !newBlockName && shiftKey) {
        container = wrapSelfAndSiblingsInDefaultBlock(editor, newBlockName, rng, container, offset);
      }
      parentBlock = dom.getParent(container, dom.isBlock);
      containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null;
      parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : '';
      containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : '';
      if (containerBlockName === 'LI' && !evt.ctrlKey) {
        parentBlock = containerBlock;
        containerBlock = containerBlock.parentNode;
        parentBlockName = containerBlockName;
      }
      if (/^(LI|DT|DD)$/.test(parentBlockName)) {
        if (dom.isEmpty(parentBlock)) {
          InsertLi.insert(editor, createNewBlock, containerBlock, parentBlock, newBlockName);
          return;
        }
      }
      if (newBlockName && parentBlock === editor.getBody()) {
        return;
      }
      newBlockName = newBlockName || 'P';
      if (isCaretContainerBlock(parentBlock)) {
        newBlock = showCaretContainerBlock(parentBlock);
        if (dom.isEmpty(parentBlock)) {
          emptyBlock(parentBlock);
        }
        NewLineUtils.moveToCaretPosition(editor, newBlock);
      } else if (isCaretAtStartOrEndOfBlock()) {
        insertNewBlockAfter();
      } else if (isCaretAtStartOrEndOfBlock(true)) {
        newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock);
        NewLineUtils.moveToCaretPosition(editor, containerAndSiblingName(parentBlock, 'HR') ? newBlock : parentBlock);
      } else {
        tmpRng = includeZwspInRange(rng).cloneRange();
        tmpRng.setEndAfter(parentBlock);
        fragment = tmpRng.extractContents();
        trimLeadingLineBreaks(fragment);
        newBlock = fragment.firstChild;
        dom.insertAfter(fragment, parentBlock);
        trimInlineElementsOnLeftSideOfBlock(dom, nonEmptyElementsMap, newBlock);
        addBrToBlockIfNeeded(dom, parentBlock);
        if (dom.isEmpty(parentBlock)) {
          emptyBlock(parentBlock);
        }
        newBlock.normalize();
        if (dom.isEmpty(newBlock)) {
          dom.remove(newBlock);
          insertNewBlockAfter();
        } else {
          NewLineUtils.moveToCaretPosition(editor, newBlock);
        }
      }
      dom.setAttrib(newBlock, 'id', '');
      editor.fire('NewBlock', { newBlock: newBlock });
    };
    var InsertBlock = { insert: insert$2 };

    var matchesSelector = function (editor, selector) {
      return NewLineUtils.getParentBlock(editor).filter(function (parentBlock) {
        return selector.length > 0 && is$1(Element$$1.fromDom(parentBlock), selector);
      }).isSome();
    };
    var shouldInsertBr = function (editor) {
      return matchesSelector(editor, Settings.getBrNewLineSelector(editor));
    };
    var shouldBlockNewLine = function (editor) {
      return matchesSelector(editor, Settings.getNoNewLineSelector(editor));
    };
    var ContextSelectors = {
      shouldInsertBr: shouldInsertBr,
      shouldBlockNewLine: shouldBlockNewLine
    };

    var newLineAction = Adt.generate([
      { br: [] },
      { block: [] },
      { none: [] }
    ]);
    var shouldBlockNewLine$1 = function (editor, shiftKey) {
      return ContextSelectors.shouldBlockNewLine(editor);
    };
    var isBrMode = function (requiredState) {
      return function (editor, shiftKey) {
        var brMode = Settings.getForcedRootBlock(editor) === '';
        return brMode === requiredState;
      };
    };
    var inListBlock = function (requiredState) {
      return function (editor, shiftKey) {
        return NewLineUtils.isListItemParentBlock(editor) === requiredState;
      };
    };
    var inBlock = function (blockName, requiredState) {
      return function (editor, shiftKey) {
        var state = NewLineUtils.getParentBlockName(editor) === blockName.toUpperCase();
        return state === requiredState;
      };
    };
    var inPreBlock = function (requiredState) {
      return inBlock('pre', requiredState);
    };
    var inSummaryBlock = function () {
      return inBlock('summary', true);
    };
    var shouldPutBrInPre$1 = function (requiredState) {
      return function (editor, shiftKey) {
        return Settings.shouldPutBrInPre(editor) === requiredState;
      };
    };
    var inBrContext = function (editor, shiftKey) {
      return ContextSelectors.shouldInsertBr(editor);
    };
    var hasShiftKey = function (editor, shiftKey) {
      return shiftKey;
    };
    var canInsertIntoEditableRoot = function (editor) {
      var forcedRootBlock = Settings.getForcedRootBlock(editor);
      var rootEditable = NewLineUtils.getEditableRoot(editor.dom, editor.selection.getStart());
      return rootEditable && editor.schema.isValidChild(rootEditable.nodeName, forcedRootBlock ? forcedRootBlock : 'P');
    };
    var match$2 = function (predicates, action) {
      return function (editor, shiftKey) {
        var isMatch = foldl(predicates, function (res, p) {
          return res && p(editor, shiftKey);
        }, true);
        return isMatch ? Option.some(action) : Option.none();
      };
    };
    var getAction$1 = function (editor, evt) {
      return LazyEvaluator.evaluateUntil([
        match$2([shouldBlockNewLine$1], newLineAction.none()),
        match$2([inSummaryBlock()], newLineAction.br()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(false),
          hasShiftKey
        ], newLineAction.br()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(false)
        ], newLineAction.block()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(true),
          hasShiftKey
        ], newLineAction.block()),
        match$2([
          inPreBlock(true),
          shouldPutBrInPre$1(true)
        ], newLineAction.br()),
        match$2([
          inListBlock(true),
          hasShiftKey
        ], newLineAction.br()),
        match$2([inListBlock(true)], newLineAction.block()),
        match$2([
          isBrMode(true),
          hasShiftKey,
          canInsertIntoEditableRoot
        ], newLineAction.block()),
        match$2([isBrMode(true)], newLineAction.br()),
        match$2([inBrContext], newLineAction.br()),
        match$2([
          isBrMode(false),
          hasShiftKey
        ], newLineAction.br()),
        match$2([canInsertIntoEditableRoot], newLineAction.block())
      ], [
        editor,
        evt.shiftKey
      ]).getOr(newLineAction.none());
    };
    var NewLineAction = { getAction: getAction$1 };

    var insert$3 = function (editor, evt) {
      NewLineAction.getAction(editor, evt).fold(function () {
        InsertBr.insert(editor, evt);
      }, function () {
        InsertBlock.insert(editor, evt);
      }, noop);
    };
    var InsertNewLine = { insert: insert$3 };

    var endTypingLevel = function (undoManager) {
      if (undoManager.typing) {
        undoManager.typing = false;
        undoManager.add();
      }
    };
    var handleEnterKeyEvent = function (editor, event) {
      if (event.isDefaultPrevented()) {
        return;
      }
      event.preventDefault();
      endTypingLevel(editor.undoManager);
      editor.undoManager.transact(function () {
        if (editor.selection.isCollapsed() === false) {
          editor.execCommand('Delete');
        }
        InsertNewLine.insert(editor, event);
      });
    };
    var setup$9 = function (editor) {
      editor.on('keydown', function (event) {
        if (event.keyCode === VK.ENTER) {
          handleEnterKeyEvent(editor, event);
        }
      });
    };
    var EnterKey = { setup: setup$9 };

    var isValidInsertPoint = function (location, caretPosition) {
      return isAtStartOrEnd(location) && NodeType.isText(caretPosition.container());
    };
    var insertNbspAtPosition = function (editor, caretPosition) {
      var container = caretPosition.container();
      var offset = caretPosition.offset();
      container.insertData(offset, '\xA0');
      editor.selection.setCursorLocation(container, offset + 1);
    };
    var insertAtLocation = function (editor, caretPosition, location) {
      if (isValidInsertPoint(location, caretPosition)) {
        insertNbspAtPosition(editor, caretPosition);
        return true;
      } else {
        return false;
      }
    };
    var insertAtCaret$2 = function (editor) {
      var isInlineTarget = curry(InlineUtils.isInlineTarget, editor);
      var caretPosition = CaretPosition$1.fromRangeStart(editor.selection.getRng());
      var boundaryLocation = BoundaryLocation.readLocation(isInlineTarget, editor.getBody(), caretPosition);
      return boundaryLocation.map(curry(insertAtLocation, editor, caretPosition)).getOr(false);
    };
    var isAtStartOrEnd = function (location) {
      return location.fold(constant(false), constant(true), constant(true), constant(false));
    };
    var insertAtSelection = function (editor) {
      return editor.selection.isCollapsed() ? insertAtCaret$2(editor) : false;
    };
    var InsertSpace = { insertAtSelection: insertAtSelection };

    var executeKeydownOverride$2 = function (editor, evt) {
      MatchKeys.execute([{
          keyCode: VK.SPACEBAR,
          action: MatchKeys.action(InsertSpace.insertAtSelection, editor)
        }], evt).each(function (_) {
        evt.preventDefault();
      });
    };
    var setup$a = function (editor) {
      editor.on('keydown', function (evt) {
        if (evt.isDefaultPrevented() === false) {
          executeKeydownOverride$2(editor, evt);
        }
      });
    };
    var SpaceKey = { setup: setup$a };

    var findBlockCaretContainer = function (editor) {
      return descendant$1(Element$$1.fromDom(editor.getBody()), '*[data-mce-caret]').fold(constant(null), function (elm) {
        return elm.dom();
      });
    };
    var removeIeControlRect = function (editor) {
      editor.selection.setRng(editor.selection.getRng());
    };
    var showBlockCaretContainer = function (editor, blockCaretContainer) {
      if (blockCaretContainer.hasAttribute('data-mce-caret')) {
        showCaretContainerBlock(blockCaretContainer);
        removeIeControlRect(editor);
        editor.selection.scrollIntoView(blockCaretContainer);
      }
    };
    var handleBlockContainer = function (editor, e) {
      var blockCaretContainer = findBlockCaretContainer(editor);
      if (!blockCaretContainer) {
        return;
      }
      if (e.type === 'compositionstart') {
        e.preventDefault();
        e.stopPropagation();
        showBlockCaretContainer(editor, blockCaretContainer);
        return;
      }
      if (hasContent(blockCaretContainer)) {
        showBlockCaretContainer(editor, blockCaretContainer);
        editor.undoManager.add();
      }
    };
    var setup$b = function (editor) {
      editor.on('keyup compositionstart', curry(handleBlockContainer, editor));
    };
    var CaretContainerInput = { setup: setup$b };

    var setup$c = function (editor) {
      var caret = BoundarySelection.setupSelectedState(editor);
      CaretContainerInput.setup(editor);
      ArrowKeys.setup(editor, caret);
      DeleteBackspaceKeys.setup(editor, caret);
      EnterKey.setup(editor);
      SpaceKey.setup(editor);
    };
    var KeyboardOverrides = { setup: setup$c };

    function Quirks (editor) {
      var each = Tools.each;
      var BACKSPACE = VK.BACKSPACE, DELETE = VK.DELETE, dom = editor.dom, selection = editor.selection, settings = editor.settings, parser = editor.parser;
      var isGecko = Env.gecko, isIE = Env.ie, isWebKit = Env.webkit;
      var mceInternalUrlPrefix = 'data:text/mce-internal,';
      var mceInternalDataType = isIE ? 'Text' : 'URL';
      var setEditorCommandState = function (cmd, state) {
        try {
          editor.getDoc().execCommand(cmd, false, state);
        } catch (ex) {
        }
      };
      var isDefaultPrevented = function (e) {
        return e.isDefaultPrevented();
      };
      var setMceInternalContent = function (e) {
        var selectionHtml, internalContent;
        if (e.dataTransfer) {
          if (editor.selection.isCollapsed() && e.target.tagName === 'IMG') {
            selection.select(e.target);
          }
          selectionHtml = editor.selection.getContent();
          if (selectionHtml.length > 0) {
            internalContent = mceInternalUrlPrefix + escape(editor.id) + ',' + escape(selectionHtml);
            e.dataTransfer.setData(mceInternalDataType, internalContent);
          }
        }
      };
      var getMceInternalContent = function (e) {
        var internalContent;
        if (e.dataTransfer) {
          internalContent = e.dataTransfer.getData(mceInternalDataType);
          if (internalContent && internalContent.indexOf(mceInternalUrlPrefix) >= 0) {
            internalContent = internalContent.substr(mceInternalUrlPrefix.length).split(',');
            return {
              id: unescape(internalContent[0]),
              html: unescape(internalContent[1])
            };
          }
        }
        return null;
      };
      var insertClipboardContents = function (content, internal) {
        if (editor.queryCommandSupported('mceInsertClipboardContent')) {
          editor.execCommand('mceInsertClipboardContent', false, {
            content: content,
            internal: internal
          });
        } else {
          editor.execCommand('mceInsertContent', false, content);
        }
      };
      var emptyEditorWhenDeleting = function () {
        var serializeRng = function (rng) {
          var body = dom.create('body');
          var contents = rng.cloneContents();
          body.appendChild(contents);
          return selection.serializer.serialize(body, { format: 'html' });
        };
        var allContentsSelected = function (rng) {
          var selection = serializeRng(rng);
          var allRng = dom.createRng();
          allRng.selectNode(editor.getBody());
          var allSelection = serializeRng(allRng);
          return selection === allSelection;
        };
        editor.on('keydown', function (e) {
          var keyCode = e.keyCode;
          var isCollapsed, body;
          if (!isDefaultPrevented(e) && (keyCode === DELETE || keyCode === BACKSPACE)) {
            isCollapsed = editor.selection.isCollapsed();
            body = editor.getBody();
            if (isCollapsed && !dom.isEmpty(body)) {
              return;
            }
            if (!isCollapsed && !allContentsSelected(editor.selection.getRng())) {
              return;
            }
            e.preventDefault();
            editor.setContent('');
            if (body.firstChild && dom.isBlock(body.firstChild)) {
              editor.selection.setCursorLocation(body.firstChild, 0);
            } else {
              editor.selection.setCursorLocation(body, 0);
            }
            editor.nodeChanged();
          }
        });
      };
      var selectAll = function () {
        editor.shortcuts.add('meta+a', null, 'SelectAll');
      };
      var inputMethodFocus = function () {
        if (!editor.settings.content_editable) {
          dom.bind(editor.getDoc(), 'mousedown mouseup', function (e) {
            var rng;
            if (e.target === editor.getDoc().documentElement) {
              rng = selection.getRng();
              editor.getBody().focus();
              if (e.type === 'mousedown') {
                if (isCaretContainer(rng.startContainer)) {
                  return;
                }
                selection.placeCaretAt(e.clientX, e.clientY);
              } else {
                selection.setRng(rng);
              }
            }
          });
        }
      };
      var removeHrOnBackspace = function () {
        editor.on('keydown', function (e) {
          if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
            if (!editor.getBody().getElementsByTagName('hr').length) {
              return;
            }
            if (selection.isCollapsed() && selection.getRng().startOffset === 0) {
              var node = selection.getNode();
              var previousSibling = node.previousSibling;
              if (node.nodeName === 'HR') {
                dom.remove(node);
                e.preventDefault();
                return;
              }
              if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'hr') {
                dom.remove(previousSibling);
                e.preventDefault();
              }
            }
          }
        });
      };
      var focusBody = function () {
        if (!Range.prototype.getClientRects) {
          editor.on('mousedown', function (e) {
            if (!isDefaultPrevented(e) && e.target.nodeName === 'HTML') {
              var body_1 = editor.getBody();
              body_1.blur();
              Delay.setEditorTimeout(editor, function () {
                body_1.focus();
              });
            }
          });
        }
      };
      var selectControlElements = function () {
        editor.on('click', function (e) {
          var target = e.target;
          if (/^(IMG|HR)$/.test(target.nodeName) && dom.getContentEditableParent(target) !== 'false') {
            e.preventDefault();
            editor.selection.select(target);
            editor.nodeChanged();
          }
          if (target.nodeName === 'A' && dom.hasClass(target, 'mce-item-anchor')) {
            e.preventDefault();
            selection.select(target);
          }
        });
      };
      var removeStylesWhenDeletingAcrossBlockElements = function () {
        var getAttributeApplyFunction = function () {
          var template = dom.getAttribs(selection.getStart().cloneNode(false));
          return function () {
            var target = selection.getStart();
            if (target !== editor.getBody()) {
              dom.setAttrib(target, 'style', null);
              each(template, function (attr) {
                target.setAttributeNode(attr.cloneNode(true));
              });
            }
          };
        };
        var isSelectionAcrossElements = function () {
          return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) !== dom.getParent(selection.getEnd(), dom.isBlock);
        };
        editor.on('keypress', function (e) {
          var applyAttributes;
          if (!isDefaultPrevented(e) && (e.keyCode === 8 || e.keyCode === 46) && isSelectionAcrossElements()) {
            applyAttributes = getAttributeApplyFunction();
            editor.getDoc().execCommand('delete', false, null);
            applyAttributes();
            e.preventDefault();
            return false;
          }
        });
        dom.bind(editor.getDoc(), 'cut', function (e) {
          var applyAttributes;
          if (!isDefaultPrevented(e) && isSelectionAcrossElements()) {
            applyAttributes = getAttributeApplyFunction();
            Delay.setEditorTimeout(editor, function () {
              applyAttributes();
            });
          }
        });
      };
      var disableBackspaceIntoATable = function () {
        editor.on('keydown', function (e) {
          if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
            if (selection.isCollapsed() && selection.getRng().startOffset === 0) {
              var previousSibling = selection.getNode().previousSibling;
              if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'table') {
                e.preventDefault();
                return false;
              }
            }
          }
        });
      };
      var removeBlockQuoteOnBackSpace = function () {
        editor.on('keydown', function (e) {
          var rng, container, offset, root, parent$$1;
          if (isDefaultPrevented(e) || e.keyCode !== VK.BACKSPACE) {
            return;
          }
          rng = selection.getRng();
          container = rng.startContainer;
          offset = rng.startOffset;
          root = dom.getRoot();
          parent$$1 = container;
          if (!rng.collapsed || offset !== 0) {
            return;
          }
          while (parent$$1 && parent$$1.parentNode && parent$$1.parentNode.firstChild === parent$$1 && parent$$1.parentNode !== root) {
            parent$$1 = parent$$1.parentNode;
          }
          if (parent$$1.tagName === 'BLOCKQUOTE') {
            editor.formatter.toggle('blockquote', null, parent$$1);
            rng = dom.createRng();
            rng.setStart(container, 0);
            rng.setEnd(container, 0);
            selection.setRng(rng);
          }
        });
      };
      var setGeckoEditingOptions = function () {
        var setOpts = function () {
          setEditorCommandState('StyleWithCSS', false);
          setEditorCommandState('enableInlineTableEditing', false);
          if (!settings.object_resizing) {
            setEditorCommandState('enableObjectResizing', false);
          }
        };
        if (!settings.readonly) {
          editor.on('BeforeExecCommand MouseDown', setOpts);
        }
      };
      var addBrAfterLastLinks = function () {
        var fixLinks = function () {
          each(dom.select('a'), function (node) {
            var parentNode = node.parentNode;
            var root = dom.getRoot();
            if (parentNode.lastChild === node) {
              while (parentNode && !dom.isBlock(parentNode)) {
                if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) {
                  return;
                }
                parentNode = parentNode.parentNode;
              }
              dom.add(parentNode, 'br', { 'data-mce-bogus': 1 });
            }
          });
        };
        editor.on('SetContent ExecCommand', function (e) {
          if (e.type === 'setcontent' || e.command === 'mceInsertLink') {
            fixLinks();
          }
        });
      };
      var setDefaultBlockType = function () {
        if (settings.forced_root_block) {
          editor.on('init', function () {
            setEditorCommandState('DefaultParagraphSeparator', settings.forced_root_block);
          });
        }
      };
      var normalizeSelection = function () {
        editor.on('keyup focusin mouseup', function (e) {
          if (!VK.modifierPressed(e)) {
            selection.normalize();
          }
        }, true);
      };
      var showBrokenImageIcon = function () {
        editor.contentStyles.push('img:-moz-broken {' + '-moz-force-broken-image-icon:1;' + 'min-width:24px;' + 'min-height:24px' + '}');
      };
      var restoreFocusOnKeyDown = function () {
        if (!editor.inline) {
          editor.on('keydown', function () {
            if (document.activeElement === document.body) {
              editor.getWin().focus();
            }
          });
        }
      };
      var bodyHeight = function () {
        if (!editor.inline) {
          editor.contentStyles.push('body {min-height: 150px}');
          editor.on('click', function (e) {
            var rng;
            if (e.target.nodeName === 'HTML') {
              if (Env.ie > 11) {
                editor.getBody().focus();
                return;
              }
              rng = editor.selection.getRng();
              editor.getBody().focus();
              editor.selection.setRng(rng);
              editor.selection.normalize();
              editor.nodeChanged();
            }
          });
        }
      };
      var blockCmdArrowNavigation = function () {
        if (Env.mac) {
          editor.on('keydown', function (e) {
            if (VK.metaKeyPressed(e) && !e.shiftKey && (e.keyCode === 37 || e.keyCode === 39)) {
              e.preventDefault();
              editor.selection.getSel().modify('move', e.keyCode === 37 ? 'backward' : 'forward', 'lineboundary');
            }
          });
        }
      };
      var disableAutoUrlDetect = function () {
        setEditorCommandState('AutoUrlDetect', false);
      };
      var tapLinksAndImages = function () {
        editor.on('click', function (e) {
          var elm = e.target;
          do {
            if (elm.tagName === 'A') {
              e.preventDefault();
              return;
            }
          } while (elm = elm.parentNode);
        });
        editor.contentStyles.push('.mce-content-body {-webkit-touch-callout: none}');
      };
      var blockFormSubmitInsideEditor = function () {
        editor.on('init', function () {
          editor.dom.bind(editor.getBody(), 'submit', function (e) {
            e.preventDefault();
          });
        });
      };
      var removeAppleInterchangeBrs = function () {
        parser.addNodeFilter('br', function (nodes) {
          var i = nodes.length;
          while (i--) {
            if (nodes[i].attr('class') === 'Apple-interchange-newline') {
              nodes[i].remove();
            }
          }
        });
      };
      var ieInternalDragAndDrop = function () {
        editor.on('dragstart', function (e) {
          setMceInternalContent(e);
        });
        editor.on('drop', function (e) {
          if (!isDefaultPrevented(e)) {
            var internalContent = getMceInternalContent(e);
            if (internalContent && internalContent.id !== editor.id) {
              e.preventDefault();
              var rng = CaretRangeFromPoint.fromPoint(e.x, e.y, editor.getDoc());
              selection.setRng(rng);
              insertClipboardContents(internalContent.html, true);
            }
          }
        });
      };
      var refreshContentEditable = function () {
      };
      var isHidden = function () {
        var sel;
        if (!isGecko || editor.removed) {
          return 0;
        }
        sel = editor.selection.getSel();
        return !sel || !sel.rangeCount || sel.rangeCount === 0;
      };
      removeBlockQuoteOnBackSpace();
      emptyEditorWhenDeleting();
      if (!Env.windowsPhone) {
        normalizeSelection();
      }
      if (isWebKit) {
        inputMethodFocus();
        selectControlElements();
        setDefaultBlockType();
        blockFormSubmitInsideEditor();
        disableBackspaceIntoATable();
        removeAppleInterchangeBrs();
        if (Env.iOS) {
          restoreFocusOnKeyDown();
          bodyHeight();
          tapLinksAndImages();
        } else {
          selectAll();
        }
      }
      if (Env.ie >= 11) {
        bodyHeight();
        disableBackspaceIntoATable();
      }
      if (Env.ie) {
        selectAll();
        disableAutoUrlDetect();
        ieInternalDragAndDrop();
      }
      if (isGecko) {
        removeHrOnBackspace();
        focusBody();
        removeStylesWhenDeletingAcrossBlockElements();
        setGeckoEditingOptions();
        addBrAfterLastLinks();
        showBrokenImageIcon();
        blockCmdArrowNavigation();
        disableBackspaceIntoATable();
      }
      return {
        refreshContentEditable: refreshContentEditable,
        isHidden: isHidden
      };
    }

    var isTextBlockNode = function (node) {
      return NodeType.isElement(node) && isTextBlock(Element$$1.fromDom(node));
    };
    var normalizeSelection$1 = function (editor) {
      var rng = editor.selection.getRng();
      var startPos = CaretPosition.fromRangeStart(rng);
      var endPos = CaretPosition.fromRangeEnd(rng);
      if (CaretPosition.isElementPosition(startPos)) {
        var container = startPos.container();
        if (isTextBlockNode(container)) {
          CaretFinder.firstPositionIn(container).each(function (pos) {
            return rng.setStart(pos.container(), pos.offset());
          });
        }
      }
      if (CaretPosition.isElementPosition(endPos)) {
        var container = startPos.container();
        if (isTextBlockNode(container)) {
          CaretFinder.lastPositionIn(container).each(function (pos) {
            return rng.setEnd(pos.container(), pos.offset());
          });
        }
      }
      editor.selection.setRng(RangeNormalizer.normalize(rng));
    };
    var setup$d = function (editor) {
      editor.on('click', function (e) {
        if (e.detail >= 3) {
          normalizeSelection$1(editor);
        }
      });
    };

    var preventSummaryToggle = function (editor) {
      editor.on('click', function (e) {
        if (editor.dom.getParent(e.target, 'details')) {
          e.preventDefault();
        }
      });
    };
    var filterDetails = function (editor) {
      editor.parser.addNodeFilter('details', function (elms) {
        each(elms, function (details) {
          details.attr('data-mce-open', details.attr('open'));
          details.attr('open', 'open');
        });
      });
      editor.serializer.addNodeFilter('details', function (elms) {
        each(elms, function (details) {
          var open = details.attr('data-mce-open');
          details.attr('open', isString(open) ? open : null);
          details.attr('data-mce-open', null);
        });
      });
    };
    var setup$e = function (editor) {
      preventSummaryToggle(editor);
      filterDetails(editor);
    };

    var DOM$2 = DOMUtils$1.DOM;
    var appendStyle = function (editor, text) {
      var head = Element$$1.fromDom(editor.getDoc().head);
      var tag = Element$$1.fromTag('style');
      set(tag, 'type', 'text/css');
      append(tag, Element$$1.fromText(text));
      append(head, tag);
    };
    var createParser = function (editor) {
      var parser = DomParser(editor.settings, editor.schema);
      parser.addAttributeFilter('src,href,style,tabindex', function (nodes, name$$1) {
        var i = nodes.length, node;
        var dom = editor.dom;
        var value, internalName;
        while (i--) {
          node = nodes[i];
          value = node.attr(name$$1);
          internalName = 'data-mce-' + name$$1;
          if (!node.attributes.map[internalName]) {
            if (value.indexOf('data:') === 0 || value.indexOf('blob:') === 0) {
              continue;
            }
            if (name$$1 === 'style') {
              value = dom.serializeStyle(dom.parseStyle(value), node.name);
              if (!value.length) {
                value = null;
              }
              node.attr(internalName, value);
              node.attr(name$$1, value);
            } else if (name$$1 === 'tabindex') {
              node.attr(internalName, value);
              node.attr(name$$1, null);
            } else {
              node.attr(internalName, editor.convertURL(value, name$$1, node.name));
            }
          }
        }
      });
      parser.addNodeFilter('script', function (nodes) {
        var i = nodes.length, node, type;
        while (i--) {
          node = nodes[i];
          type = node.attr('type') || 'no/type';
          if (type.indexOf('mce-') !== 0) {
            node.attr('type', 'mce-' + type);
          }
        }
      });
      parser.addNodeFilter('#cdata', function (nodes) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          node.type = 8;
          node.name = '#comment';
          node.value = '[CDATA[' + node.value + ']]';
        }
      });
      parser.addNodeFilter('p,h1,h2,h3,h4,h5,h6,div', function (nodes) {
        var i = nodes.length, node;
        var nonEmptyElements = editor.schema.getNonEmptyElements();
        while (i--) {
          node = nodes[i];
          if (node.isEmpty(nonEmptyElements) && node.getAll('br').length === 0) {
            node.append(new Node$2('br', 1)).shortEnded = true;
          }
        }
      });
      return parser;
    };
    var autoFocus = function (editor) {
      if (editor.settings.auto_focus) {
        Delay.setEditorTimeout(editor, function () {
          var focusEditor;
          if (editor.settings.auto_focus === true) {
            focusEditor = editor;
          } else {
            focusEditor = editor.editorManager.get(editor.settings.auto_focus);
          }
          if (!focusEditor.destroyed) {
            focusEditor.focus();
          }
        }, 100);
      }
    };
    var initEditor = function (editor) {
      editor.bindPendingEventDelegates();
      editor.initialized = true;
      editor.fire('init');
      editor.focus(true);
      editor.nodeChanged({ initial: true });
      editor.execCallback('init_instance_callback', editor);
      autoFocus(editor);
    };
    var getStyleSheetLoader = function (editor) {
      return editor.inline ? DOM$2.styleSheetLoader : editor.dom.styleSheetLoader;
    };
    var initContentBody = function (editor, skipWrite) {
      var settings = editor.settings;
      var targetElm = editor.getElement();
      var doc = editor.getDoc(), body, contentCssText;
      if (!settings.inline) {
        editor.getElement().style.visibility = editor.orgVisibility;
      }
      if (!skipWrite && !settings.content_editable) {
        doc.open();
        doc.write(editor.iframeHTML);
        doc.close();
      }
      if (settings.content_editable) {
        editor.on('remove', function () {
          var bodyEl = this.getBody();
          DOM$2.removeClass(bodyEl, 'mce-content-body');
          DOM$2.removeClass(bodyEl, 'mce-edit-focus');
          DOM$2.setAttrib(bodyEl, 'contentEditable', null);
        });
        DOM$2.addClass(targetElm, 'mce-content-body');
        editor.contentDocument = doc = settings.content_document || document;
        editor.contentWindow = settings.content_window || window;
        editor.bodyElement = targetElm;
        settings.content_document = settings.content_window = null;
        settings.root_name = targetElm.nodeName.toLowerCase();
      }
      body = editor.getBody();
      body.disabled = true;
      editor.readonly = settings.readonly;
      if (!editor.readonly) {
        if (editor.inline && DOM$2.getStyle(body, 'position', true) === 'static') {
          body.style.position = 'relative';
        }
        body.contentEditable = editor.getParam('content_editable_state', true);
      }
      body.disabled = false;
      editor.editorUpload = EditorUpload(editor);
      editor.schema = Schema(settings);
      editor.dom = DOMUtils$1(doc, {
        keep_values: true,
        url_converter: editor.convertURL,
        url_converter_scope: editor,
        hex_colors: settings.force_hex_style_colors,
        class_filter: settings.class_filter,
        update_styles: true,
        root_element: editor.inline ? editor.getBody() : null,
        collect: settings.content_editable,
        schema: editor.schema,
        contentCssCors: Settings.shouldUseContentCssCors(editor),
        onSetAttrib: function (e) {
          editor.fire('SetAttrib', e);
        }
      });
      editor.parser = createParser(editor);
      editor.serializer = Serializer$1(settings, editor);
      editor.selection = Selection(editor.dom, editor.getWin(), editor.serializer, editor);
      editor.annotator = Annotator(editor);
      editor.formatter = Formatter(editor);
      editor.undoManager = UndoManager(editor);
      editor._nodeChangeDispatcher = new NodeChange(editor);
      editor._selectionOverrides = SelectionOverrides(editor);
      setup$e(editor);
      setup$d(editor);
      KeyboardOverrides.setup(editor);
      ForceBlocks.setup(editor);
      editor.fire('PreInit');
      if (!settings.browser_spellcheck && !settings.gecko_spellcheck) {
        doc.body.spellcheck = false;
        DOM$2.setAttrib(body, 'spellcheck', 'false');
      }
      editor.quirks = Quirks(editor);
      editor.fire('PostRender');
      if (settings.directionality) {
        body.dir = settings.directionality;
      }
      if (settings.nowrap) {
        body.style.whiteSpace = 'nowrap';
      }
      if (settings.protect) {
        editor.on('BeforeSetContent', function (e) {
          Tools.each(settings.protect, function (pattern) {
            e.content = e.content.replace(pattern, function (str) {
              return '<!--mce:protected ' + escape(str) + '-->';
            });
          });
        });
      }
      editor.on('SetContent', function () {
        editor.addVisual(editor.getBody());
      });
      editor.load({
        initial: true,
        format: 'html'
      });
      editor.startContent = editor.getContent({ format: 'raw' });
      editor.on('compositionstart compositionend', function (e) {
        editor.composing = e.type === 'compositionstart';
      });
      if (editor.contentStyles.length > 0) {
        contentCssText = '';
        Tools.each(editor.contentStyles, function (style) {
          contentCssText += style + '\r\n';
        });
        editor.dom.addStyle(contentCssText);
      }
      getStyleSheetLoader(editor).loadAll(editor.contentCSS, function (_) {
        initEditor(editor);
      }, function (urls) {
        initEditor(editor);
      });
      if (settings.content_style) {
        appendStyle(editor, settings.content_style);
      }
    };
    var InitContentBody = { initContentBody: initContentBody };

    var DOM$3 = DOMUtils$1.DOM;
    var relaxDomain = function (editor, ifr) {
      if (document.domain !== window.location.hostname && Env.ie && Env.ie < 12) {
        var bodyUuid = Uuid.uuid('mce');
        editor[bodyUuid] = function () {
          InitContentBody.initContentBody(editor);
        };
        var domainRelaxUrl = 'javascript:(function(){' + 'document.open();document.domain="' + document.domain + '";' + 'var ed = window.parent.tinymce.get("' + editor.id + '");document.write(ed.iframeHTML);' + 'document.close();ed.' + bodyUuid + '(true);})()';
        DOM$3.setAttrib(ifr, 'src', domainRelaxUrl);
        return true;
      }
      return false;
    };
    var normalizeHeight = function (height) {
      var normalizedHeight = typeof height === 'number' ? height + 'px' : height;
      return normalizedHeight ? normalizedHeight : '';
    };
    var createIframeElement = function (id, title, height, customAttrs) {
      var iframe = Element$$1.fromTag('iframe');
      setAll(iframe, customAttrs);
      setAll(iframe, {
        id: id + '_ifr',
        frameBorder: '0',
        allowTransparency: 'true',
        title: title
      });
      setAll$1(iframe, {
        width: '100%',
        height: normalizeHeight(height),
        display: 'block'
      });
      return iframe;
    };
    var getIframeHtml = function (editor) {
      var bodyId, bodyClass, iframeHTML;
      iframeHTML = Settings.getDocType(editor) + '<html><head>';
      if (Settings.getDocumentBaseUrl(editor) !== editor.documentBaseUrl) {
        iframeHTML += '<base href="' + editor.documentBaseURI.getURI() + '" />';
      }
      iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
      bodyId = Settings.getBodyId(editor);
      bodyClass = Settings.getBodyClass(editor);
      if (Settings.getContentSecurityPolicy(editor)) {
        iframeHTML += '<meta http-equiv="Content-Security-Policy" content="' + Settings.getContentSecurityPolicy(editor) + '" />';
      }
      iframeHTML += '</head><body id="' + bodyId + '" class="mce-content-body ' + bodyClass + '" data-id="' + editor.id + '"><br></body></html>';
      return iframeHTML;
    };
    var createIframe = function (editor, o) {
      var title = editor.editorManager.translate('Rich Text Area. Press ALT-F9 for menu. ' + 'Press ALT-F10 for toolbar. Press ALT-0 for help');
      var ifr = createIframeElement(editor.id, title, o.height, Settings.getIframeAttrs(editor)).dom();
      ifr.onload = function () {
        ifr.onload = null;
        editor.fire('load');
      };
      var isDomainRelaxed = relaxDomain(editor, ifr);
      editor.contentAreaContainer = o.iframeContainer;
      editor.iframeElement = ifr;
      editor.iframeHTML = getIframeHtml(editor);
      DOM$3.add(o.iframeContainer, ifr);
      return isDomainRelaxed;
    };
    var init$1 = function (editor, boxInfo) {
      var isDomainRelaxed = createIframe(editor, boxInfo);
      if (boxInfo.editorContainer) {
        DOM$3.get(boxInfo.editorContainer).style.display = editor.orgDisplay;
        editor.hidden = DOM$3.isHidden(boxInfo.editorContainer);
      }
      editor.getElement().style.display = 'none';
      DOM$3.setAttrib(editor.id, 'aria-hidden', 'true');
      if (!isDomainRelaxed) {
        InitContentBody.initContentBody(editor);
      }
    };
    var InitIframe = { init: init$1 };

    var DOM$4 = DOMUtils$1.DOM;
    var initPlugin = function (editor, initializedPlugins, plugin) {
      var Plugin = PluginManager$1.get(plugin);
      var pluginUrl, pluginInstance;
      pluginUrl = PluginManager$1.urls[plugin] || editor.documentBaseUrl.replace(/\/$/, '');
      plugin = Tools.trim(plugin);
      if (Plugin && Tools.inArray(initializedPlugins, plugin) === -1) {
        Tools.each(PluginManager$1.dependencies(plugin), function (dep) {
          initPlugin(editor, initializedPlugins, dep);
        });
        if (editor.plugins[plugin]) {
          return;
        }
        pluginInstance = new Plugin(editor, pluginUrl, editor.$);
        editor.plugins[plugin] = pluginInstance;
        if (pluginInstance.init) {
          pluginInstance.init(editor, pluginUrl);
          initializedPlugins.push(plugin);
        }
      }
    };
    var trimLegacyPrefix = function (name) {
      return name.replace(/^\-/, '');
    };
    var initPlugins = function (editor) {
      var initializedPlugins = [];
      Tools.each(editor.settings.plugins.split(/[ ,]/), function (name) {
        initPlugin(editor, initializedPlugins, trimLegacyPrefix(name));
      });
    };
    var initTheme = function (editor) {
      var Theme;
      var theme = editor.settings.theme;
      if (isString(theme)) {
        editor.settings.theme = trimLegacyPrefix(theme);
        Theme = ThemeManager.get(theme);
        editor.theme = new Theme(editor, ThemeManager.urls[theme]);
        if (editor.theme.init) {
          editor.theme.init(editor, ThemeManager.urls[theme] || editor.documentBaseUrl.replace(/\/$/, ''), editor.$);
        }
      } else {
        editor.theme = {};
      }
    };
    var renderFromLoadedTheme = function (editor) {
      var w, h, minHeight, re, info;
      var settings = editor.settings;
      var elm = editor.getElement();
      w = settings.width || DOM$4.getStyle(elm, 'width') || '100%';
      h = settings.height || DOM$4.getStyle(elm, 'height') || elm.offsetHeight;
      minHeight = settings.min_height || 100;
      re = /^[0-9\.]+(|px)$/i;
      if (re.test('' + w)) {
        w = Math.max(parseInt(w, 10), 100);
      }
      if (re.test('' + h)) {
        h = Math.max(parseInt(h, 10), minHeight);
      }
      info = editor.theme.renderUI({
        targetNode: elm,
        width: w,
        height: h,
        deltaWidth: settings.delta_width,
        deltaHeight: settings.delta_height
      });
      if (!settings.content_editable) {
        h = (info.iframeHeight || h) + (typeof h === 'number' ? info.deltaHeight || 0 : '');
        if (h < minHeight) {
          h = minHeight;
        }
      }
      info.height = h;
      return info;
    };
    var renderFromThemeFunc = function (editor) {
      var info;
      var elm = editor.getElement();
      info = editor.settings.theme(editor, elm);
      if (info.editorContainer.nodeType) {
        info.editorContainer.id = info.editorContainer.id || editor.id + '_parent';
      }
      if (info.iframeContainer && info.iframeContainer.nodeType) {
        info.iframeContainer.id = info.iframeContainer.id || editor.id + '_iframecontainer';
      }
      info.height = info.iframeHeight ? info.iframeHeight : elm.offsetHeight;
      return info;
    };
    var createThemeFalseResult = function (element) {
      return {
        editorContainer: element,
        iframeContainer: element
      };
    };
    var renderThemeFalseIframe = function (targetElement) {
      var iframeContainer = DOM$4.create('div');
      DOM$4.insertAfter(iframeContainer, targetElement);
      return createThemeFalseResult(iframeContainer);
    };
    var renderThemeFalse = function (editor) {
      var targetElement = editor.getElement();
      return editor.inline ? createThemeFalseResult(null) : renderThemeFalseIframe(targetElement);
    };
    var renderThemeUi = function (editor) {
      var settings = editor.settings, elm = editor.getElement();
      editor.orgDisplay = elm.style.display;
      if (isString(settings.theme)) {
        return renderFromLoadedTheme(editor);
      } else if (isFunction(settings.theme)) {
        return renderFromThemeFunc(editor);
      } else {
        return renderThemeFalse(editor);
      }
    };
    var init$2 = function (editor) {
      var settings = editor.settings;
      var elm = editor.getElement();
      var boxInfo;
      editor.rtl = settings.rtl_ui || editor.editorManager.i18n.rtl;
      editor.editorManager.i18n.setCode(settings.language);
      settings.aria_label = settings.aria_label || DOM$4.getAttrib(elm, 'aria-label', editor.getLang('aria.rich_text_area'));
      editor.fire('ScriptsLoaded');
      initTheme(editor);
      initPlugins(editor);
      boxInfo = renderThemeUi(editor);
      editor.editorContainer = boxInfo.editorContainer ? boxInfo.editorContainer : null;
      if (settings.content_css) {
        Tools.each(Tools.explode(settings.content_css), function (u) {
          editor.contentCSS.push(editor.documentBaseURI.toAbsolute(u));
        });
      }
      if (settings.content_editable) {
        return InitContentBody.initContentBody(editor);
      } else {
        return InitIframe.init(editor, boxInfo);
      }
    };
    var Init = { init: init$2 };

    var DOM$5 = DOMUtils$1.DOM;
    var hasSkipLoadPrefix = function (name$$1) {
      return name$$1.charAt(0) === '-';
    };
    var loadLanguage = function (scriptLoader, editor) {
      var settings = editor.settings;
      if (settings.language && settings.language !== 'en' && !settings.language_url) {
        settings.language_url = editor.editorManager.baseURL + '/langs/' + settings.language + '.js';
      }
      if (settings.language_url && !editor.editorManager.i18n.data[settings.language]) {
        scriptLoader.add(settings.language_url);
      }
    };
    var loadTheme = function (scriptLoader, editor, suffix, callback) {
      var settings = editor.settings, theme = settings.theme;
      if (isString(theme)) {
        if (!hasSkipLoadPrefix(theme) && !ThemeManager.urls.hasOwnProperty(theme)) {
          var themeUrl = settings.theme_url;
          if (themeUrl) {
            ThemeManager.load(theme, editor.documentBaseURI.toAbsolute(themeUrl));
          } else {
            ThemeManager.load(theme, 'themes/' + theme + '/theme' + suffix + '.js');
          }
        }
        scriptLoader.loadQueue(function () {
          ThemeManager.waitFor(theme, callback);
        });
      } else {
        callback();
      }
    };
    var loadPlugins = function (settings, suffix) {
      if (Tools.isArray(settings.plugins)) {
        settings.plugins = settings.plugins.join(' ');
      }
      Tools.each(settings.external_plugins, function (url, name$$1) {
        PluginManager$1.load(name$$1, url);
        settings.plugins += ' ' + name$$1;
      });
      Tools.each(settings.plugins.split(/[ ,]/), function (plugin) {
        plugin = Tools.trim(plugin);
        if (plugin && !PluginManager$1.urls[plugin]) {
          if (hasSkipLoadPrefix(plugin)) {
            plugin = plugin.substr(1, plugin.length);
            var dependencies = PluginManager$1.dependencies(plugin);
            Tools.each(dependencies, function (dep) {
              var defaultSettings = {
                prefix: 'plugins/',
                resource: dep,
                suffix: '/plugin' + suffix + '.js'
              };
              dep = PluginManager$1.createUrl(defaultSettings, dep);
              PluginManager$1.load(dep.resource, dep);
            });
          } else {
            PluginManager$1.load(plugin, {
              prefix: 'plugins/',
              resource: plugin,
              suffix: '/plugin' + suffix + '.js'
            });
          }
        }
      });
    };
    var loadScripts = function (editor, suffix) {
      var scriptLoader = ScriptLoader.ScriptLoader;
      loadTheme(scriptLoader, editor, suffix, function () {
        loadLanguage(scriptLoader, editor);
        loadPlugins(editor.settings, suffix);
        scriptLoader.loadQueue(function () {
          if (!editor.removed) {
            Init.init(editor);
          }
        }, editor, function (urls) {
          ErrorReporter.pluginLoadError(editor, urls[0]);
          if (!editor.removed) {
            Init.init(editor);
          }
        });
      });
    };
    var render = function (editor) {
      var settings = editor.settings, id = editor.id;
      var readyHandler = function () {
        DOM$5.unbind(window, 'ready', readyHandler);
        editor.render();
      };
      if (!EventUtils.Event.domLoaded) {
        DOM$5.bind(window, 'ready', readyHandler);
        return;
      }
      if (!editor.getElement()) {
        return;
      }
      if (!Env.contentEditable) {
        return;
      }
      if (!settings.inline) {
        editor.orgVisibility = editor.getElement().style.visibility;
        editor.getElement().style.visibility = 'hidden';
      } else {
        editor.inline = true;
      }
      var form = editor.getElement().form || DOM$5.getParent(id, 'form');
      if (form) {
        editor.formElement = form;
        if (settings.hidden_input && !/TEXTAREA|INPUT/i.test(editor.getElement().nodeName)) {
          DOM$5.insertAfter(DOM$5.create('input', {
            type: 'hidden',
            name: id
          }), id);
          editor.hasHiddenInput = true;
        }
        editor.formEventDelegate = function (e) {
          editor.fire(e.type, e);
        };
        DOM$5.bind(form, 'submit reset', editor.formEventDelegate);
        editor.on('reset', function () {
          editor.setContent(editor.startContent, { format: 'raw' });
        });
        if (settings.submit_patch && !form.submit.nodeType && !form.submit.length && !form._mceOldSubmit) {
          form._mceOldSubmit = form.submit;
          form.submit = function () {
            editor.editorManager.triggerSave();
            editor.setDirty(false);
            return form._mceOldSubmit(form);
          };
        }
      }
      editor.windowManager = WindowManager(editor);
      editor.notificationManager = NotificationManager(editor);
      if (settings.encoding === 'xml') {
        editor.on('GetContent', function (e) {
          if (e.save) {
            e.content = DOM$5.encode(e.content);
          }
        });
      }
      if (settings.add_form_submit_trigger) {
        editor.on('submit', function () {
          if (editor.initialized) {
            editor.save();
          }
        });
      }
      if (settings.add_unload_trigger) {
        editor._beforeUnload = function () {
          if (editor.initialized && !editor.destroyed && !editor.isHidden()) {
            editor.save({
              format: 'raw',
              no_events: true,
              set_dirty: false
            });
          }
        };
        editor.editorManager.on('BeforeUnload', editor._beforeUnload);
      }
      editor.editorManager.add(editor);
      loadScripts(editor, editor.suffix);
    };
    var Render = { render: render };

    var add$4 = function (editor, name, settings) {
      var sidebars = editor.sidebars ? editor.sidebars : [];
      sidebars.push({
        name: name,
        settings: settings
      });
      editor.sidebars = sidebars;
    };
    var Sidebar = { add: add$4 };

    var each$k = Tools.each, trim$4 = Tools.trim;
    var queryParts = 'source protocol authority userInfo user password host port relative path directory file query anchor'.split(' ');
    var DEFAULT_PORTS = {
      ftp: 21,
      http: 80,
      https: 443,
      mailto: 25
    };
    var URI = function (url, settings) {
      var self$$1 = this;
      var baseUri, baseUrl;
      url = trim$4(url);
      settings = self$$1.settings = settings || {};
      baseUri = settings.base_uri;
      if (/^([\w\-]+):([^\/]{2})/i.test(url) || /^\s*#/.test(url)) {
        self$$1.source = url;
        return;
      }
      var isProtocolRelative = url.indexOf('//') === 0;
      if (url.indexOf('/') === 0 && !isProtocolRelative) {
        url = (baseUri ? baseUri.protocol || 'http' : 'http') + '://mce_host' + url;
      }
      if (!/^[\w\-]*:?\/\//.test(url)) {
        baseUrl = settings.base_uri ? settings.base_uri.path : new URI(document.location.href).directory;
        if (settings.base_uri.protocol == '') {
          url = '//mce_host' + self$$1.toAbsPath(baseUrl, url);
        } else {
          url = /([^#?]*)([#?]?.*)/.exec(url);
          url = (baseUri && baseUri.protocol || 'http') + '://mce_host' + self$$1.toAbsPath(baseUrl, url[1]) + url[2];
        }
      }
      url = url.replace(/@@/g, '(mce_at)');
      url = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url);
      each$k(queryParts, function (v, i) {
        var part = url[i];
        if (part) {
          part = part.replace(/\(mce_at\)/g, '@@');
        }
        self$$1[v] = part;
      });
      if (baseUri) {
        if (!self$$1.protocol) {
          self$$1.protocol = baseUri.protocol;
        }
        if (!self$$1.userInfo) {
          self$$1.userInfo = baseUri.userInfo;
        }
        if (!self$$1.port && self$$1.host === 'mce_host') {
          self$$1.port = baseUri.port;
        }
        if (!self$$1.host || self$$1.host === 'mce_host') {
          self$$1.host = baseUri.host;
        }
        self$$1.source = '';
      }
      if (isProtocolRelative) {
        self$$1.protocol = '';
      }
    };
    URI.prototype = {
      setPath: function (path) {
        var self$$1 = this;
        path = /^(.*?)\/?(\w+)?$/.exec(path);
        self$$1.path = path[0];
        self$$1.directory = path[1];
        self$$1.file = path[2];
        self$$1.source = '';
        self$$1.getURI();
      },
      toRelative: function (uri) {
        var self$$1 = this;
        var output;
        if (uri === './') {
          return uri;
        }
        uri = new URI(uri, { base_uri: self$$1 });
        if (uri.host !== 'mce_host' && self$$1.host !== uri.host && uri.host || self$$1.port !== uri.port || self$$1.protocol !== uri.protocol && uri.protocol !== '') {
          return uri.getURI();
        }
        var tu = self$$1.getURI(), uu = uri.getURI();
        if (tu === uu || tu.charAt(tu.length - 1) === '/' && tu.substr(0, tu.length - 1) === uu) {
          return tu;
        }
        output = self$$1.toRelPath(self$$1.path, uri.path);
        if (uri.query) {
          output += '?' + uri.query;
        }
        if (uri.anchor) {
          output += '#' + uri.anchor;
        }
        return output;
      },
      toAbsolute: function (uri, noHost) {
        uri = new URI(uri, { base_uri: this });
        return uri.getURI(noHost && this.isSameOrigin(uri));
      },
      isSameOrigin: function (uri) {
        if (this.host == uri.host && this.protocol == uri.protocol) {
          if (this.port == uri.port) {
            return true;
          }
          var defaultPort = DEFAULT_PORTS[this.protocol];
          if (defaultPort && (this.port || defaultPort) == (uri.port || defaultPort)) {
            return true;
          }
        }
        return false;
      },
      toRelPath: function (base, path) {
        var items, breakPoint = 0, out = '', i, l;
        base = base.substring(0, base.lastIndexOf('/'));
        base = base.split('/');
        items = path.split('/');
        if (base.length >= items.length) {
          for (i = 0, l = base.length; i < l; i++) {
            if (i >= items.length || base[i] !== items[i]) {
              breakPoint = i + 1;
              break;
            }
          }
        }
        if (base.length < items.length) {
          for (i = 0, l = items.length; i < l; i++) {
            if (i >= base.length || base[i] !== items[i]) {
              breakPoint = i + 1;
              break;
            }
          }
        }
        if (breakPoint === 1) {
          return path;
        }
        for (i = 0, l = base.length - (breakPoint - 1); i < l; i++) {
          out += '../';
        }
        for (i = breakPoint - 1, l = items.length; i < l; i++) {
          if (i !== breakPoint - 1) {
            out += '/' + items[i];
          } else {
            out += items[i];
          }
        }
        return out;
      },
      toAbsPath: function (base, path) {
        var i, nb = 0, o = [], tr, outPath;
        tr = /\/$/.test(path) ? '/' : '';
        base = base.split('/');
        path = path.split('/');
        each$k(base, function (k) {
          if (k) {
            o.push(k);
          }
        });
        base = o;
        for (i = path.length - 1, o = []; i >= 0; i--) {
          if (path[i].length === 0 || path[i] === '.') {
            continue;
          }
          if (path[i] === '..') {
            nb++;
            continue;
          }
          if (nb > 0) {
            nb--;
            continue;
          }
          o.push(path[i]);
        }
        i = base.length - nb;
        if (i <= 0) {
          outPath = o.reverse().join('/');
        } else {
          outPath = base.slice(0, i).join('/') + '/' + o.reverse().join('/');
        }
        if (outPath.indexOf('/') !== 0) {
          outPath = '/' + outPath;
        }
        if (tr && outPath.lastIndexOf('/') !== outPath.length - 1) {
          outPath += tr;
        }
        return outPath;
      },
      getURI: function (noProtoHost) {
        var s;
        var self$$1 = this;
        if (!self$$1.source || noProtoHost) {
          s = '';
          if (!noProtoHost) {
            if (self$$1.protocol) {
              s += self$$1.protocol + '://';
            } else {
              s += '//';
            }
            if (self$$1.userInfo) {
              s += self$$1.userInfo + '@';
            }
            if (self$$1.host) {
              s += self$$1.host;
            }
            if (self$$1.port) {
              s += ':' + self$$1.port;
            }
          }
          if (self$$1.path) {
            s += self$$1.path;
          }
          if (self$$1.query) {
            s += '?' + self$$1.query;
          }
          if (self$$1.anchor) {
            s += '#' + self$$1.anchor;
          }
          self$$1.source = s;
        }
        return self$$1.source;
      }
    };
    URI.parseDataUri = function (uri) {
      var type, matches;
      uri = decodeURIComponent(uri).split(',');
      matches = /data:([^;]+)/.exec(uri[0]);
      if (matches) {
        type = matches[1];
      }
      return {
        type: type,
        data: uri[1]
      };
    };
    URI.getDocumentBaseUrl = function (loc) {
      var baseUrl;
      if (loc.protocol.indexOf('http') !== 0 && loc.protocol !== 'file:') {
        baseUrl = loc.href;
      } else {
        baseUrl = loc.protocol + '//' + loc.host + loc.pathname;
      }
      if (/^[^:]+:\/\/\/?[^\/]+\//.test(baseUrl)) {
        baseUrl = baseUrl.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
        if (!/[\/\\]$/.test(baseUrl)) {
          baseUrl += '/';
        }
      }
      return baseUrl;
    };

    var defaultFormat = 'html';
    var trimEmptyContents = function (editor, html) {
      var blockName = Settings.getForcedRootBlock(editor);
      var emptyRegExp = new RegExp('^(<' + blockName + '[^>]*>(&nbsp;|&#160;|\\s|\xA0|<br \\/>|)<\\/' + blockName + '>[\r\n]*|<br \\/>[\r\n]*)$');
      return html.replace(emptyRegExp, '');
    };
    var getContentFromBody = function (editor, args, body) {
      var content;
      args.format = args.format ? args.format : defaultFormat;
      args.get = true;
      args.getInner = true;
      if (!args.no_events) {
        editor.fire('BeforeGetContent', args);
      }
      if (args.format === 'raw') {
        content = Tools.trim(TrimHtml.trimExternal(editor.serializer, body.innerHTML));
      } else if (args.format === 'text') {
        content = Zwsp.trim(body.innerText || body.textContent);
      } else if (args.format === 'tree') {
        return editor.serializer.serialize(body, args);
      } else {
        content = trimEmptyContents(editor, editor.serializer.serialize(body, args));
      }
      if (args.format !== 'text' && !isWsPreserveElement(Element$$1.fromDom(body))) {
        args.content = Tools.trim(content);
      } else {
        args.content = content;
      }
      if (!args.no_events) {
        editor.fire('GetContent', args);
      }
      return args.content;
    };
    var getContent$1 = function (editor, args) {
      if (args === void 0) {
        args = {};
      }
      return Option.from(editor.getBody()).fold(constant(args.format === 'tree' ? new Node$2('body', 11) : ''), function (body) {
        return getContentFromBody(editor, args, body);
      });
    };

    var traverse = function (node, fn) {
      fn(node);
      if (node.firstChild) {
        traverse(node.firstChild, fn);
      }
      if (node.next) {
        traverse(node.next, fn);
      }
    };
    var findMatchingNodes = function (nodeFilters, attributeFilters, node) {
      var nodeMatches = {};
      var attrMatches = {};
      var matches = [];
      if (node.firstChild) {
        traverse(node.firstChild, function (node) {
          each(nodeFilters, function (filter$$1) {
            if (filter$$1.name === node.name) {
              if (nodeMatches[filter$$1.name]) {
                nodeMatches[filter$$1.name].nodes.push(node);
              } else {
                nodeMatches[filter$$1.name] = {
                  filter: filter$$1,
                  nodes: [node]
                };
              }
            }
          });
          each(attributeFilters, function (filter$$1) {
            if (typeof node.attr(filter$$1.name) === 'string') {
              if (attrMatches[filter$$1.name]) {
                attrMatches[filter$$1.name].nodes.push(node);
              } else {
                attrMatches[filter$$1.name] = {
                  filter: filter$$1,
                  nodes: [node]
                };
              }
            }
          });
        });
      }
      for (var name in nodeMatches) {
        if (nodeMatches.hasOwnProperty(name)) {
          matches.push(nodeMatches[name]);
        }
      }
      for (var name in attrMatches) {
        if (attrMatches.hasOwnProperty(name)) {
          matches.push(attrMatches[name]);
        }
      }
      return matches;
    };
    var filter$3 = function (nodeFilters, attributeFilters, node) {
      var matches = findMatchingNodes(nodeFilters, attributeFilters, node);
      each(matches, function (match) {
        each(match.filter.callbacks, function (callback) {
          callback(match.nodes, match.filter.name, {});
        });
      });
    };

    var defaultFormat$1 = 'html';
    var isTreeNode = function (content) {
      return content instanceof Node$2;
    };
    var moveSelection = function (editor) {
      if (EditorFocus.hasFocus(editor)) {
        CaretFinder.firstPositionIn(editor.getBody()).each(function (pos) {
          var node = pos.getNode();
          var caretPos = NodeType.isTable(node) ? CaretFinder.firstPositionIn(node).getOr(pos) : pos;
          editor.selection.setRng(caretPos.toRange());
        });
      }
    };
    var setEditorHtml = function (editor, html) {
      editor.dom.setHTML(editor.getBody(), html);
      moveSelection(editor);
    };
    var setContentString = function (editor, body, content, args) {
      var forcedRootBlockName, padd;
      if (content.length === 0 || /^\s+$/.test(content)) {
        padd = '<br data-mce-bogus="1">';
        if (body.nodeName === 'TABLE') {
          content = '<tr><td>' + padd + '</td></tr>';
        } else if (/^(UL|OL)$/.test(body.nodeName)) {
          content = '<li>' + padd + '</li>';
        }
        forcedRootBlockName = Settings.getForcedRootBlock(editor);
        if (forcedRootBlockName && editor.schema.isValidChild(body.nodeName.toLowerCase(), forcedRootBlockName.toLowerCase())) {
          content = padd;
          content = editor.dom.createHTML(forcedRootBlockName, editor.settings.forced_root_block_attrs, content);
        } else if (!content) {
          content = '<br data-mce-bogus="1">';
        }
        setEditorHtml(editor, content);
        editor.fire('SetContent', args);
      } else {
        if (args.format !== 'raw') {
          content = Serializer({ validate: editor.validate }, editor.schema).serialize(editor.parser.parse(content, {
            isRootContent: true,
            insert: true
          }));
        }
        args.content = isWsPreserveElement(Element$$1.fromDom(body)) ? content : Tools.trim(content);
        setEditorHtml(editor, args.content);
        if (!args.no_events) {
          editor.fire('SetContent', args);
        }
      }
      return args.content;
    };
    var setContentTree = function (editor, body, content, args) {
      filter$3(editor.parser.getNodeFilters(), editor.parser.getAttributeFilters(), content);
      var html = Serializer({ validate: editor.validate }, editor.schema).serialize(content);
      args.content = isWsPreserveElement(Element$$1.fromDom(body)) ? html : Tools.trim(html);
      setEditorHtml(editor, args.content);
      if (!args.no_events) {
        editor.fire('SetContent', args);
      }
      return content;
    };
    var setContent$1 = function (editor, content, args) {
      if (args === void 0) {
        args = {};
      }
      args.format = args.format ? args.format : defaultFormat$1;
      args.set = true;
      args.content = isTreeNode(content) ? '' : content;
      if (!isTreeNode(content) && !args.no_events) {
        editor.fire('BeforeSetContent', args);
        content = args.content;
      }
      return Option.from(editor.getBody()).fold(constant(content), function (body) {
        return isTreeNode(content) ? setContentTree(editor, body, content, args) : setContentString(editor, body, content, args);
      });
    };

    var DOM$6 = DOMUtils$1.DOM;
    var restoreOriginalStyles = function (editor) {
      DOM$6.setStyle(editor.id, 'display', editor.orgDisplay);
    };
    var safeDestroy = function (x) {
      return Option.from(x).each(function (x) {
        return x.destroy();
      });
    };
    var clearDomReferences = function (editor) {
      editor.contentAreaContainer = editor.formElement = editor.container = editor.editorContainer = null;
      editor.bodyElement = editor.contentDocument = editor.contentWindow = null;
      editor.iframeElement = editor.targetElm = null;
      if (editor.selection) {
        editor.selection = editor.selection.win = editor.selection.dom = editor.selection.dom.doc = null;
      }
    };
    var restoreForm = function (editor) {
      var form = editor.formElement;
      if (form) {
        if (form._mceOldSubmit) {
          form.submit = form._mceOldSubmit;
          form._mceOldSubmit = null;
        }
        DOM$6.unbind(form, 'submit reset', editor.formEventDelegate);
      }
    };
    var remove$9 = function (editor) {
      if (!editor.removed) {
        var _selectionOverrides = editor._selectionOverrides, editorUpload = editor.editorUpload;
        var body = editor.getBody();
        var element = editor.getElement();
        if (body) {
          editor.save({ is_removing: true });
        }
        editor.removed = true;
        editor.unbindAllNativeEvents();
        if (editor.hasHiddenInput && element) {
          DOM$6.remove(element.nextSibling);
        }
        if (!editor.inline && body) {
          restoreOriginalStyles(editor);
        }
        Events.fireRemove(editor);
        editor.editorManager.remove(editor);
        DOM$6.remove(editor.getContainer());
        safeDestroy(_selectionOverrides);
        safeDestroy(editorUpload);
        editor.destroy();
      }
    };
    var destroy = function (editor, automatic) {
      var selection = editor.selection, dom = editor.dom;
      if (editor.destroyed) {
        return;
      }
      if (!automatic && !editor.removed) {
        editor.remove();
        return;
      }
      if (!automatic) {
        editor.editorManager.off('beforeunload', editor._beforeUnload);
        if (editor.theme && editor.theme.destroy) {
          editor.theme.destroy();
        }
        safeDestroy(selection);
        safeDestroy(dom);
      }
      restoreForm(editor);
      clearDomReferences(editor);
      editor.destroyed = true;
    };

    var DOM$7 = DOMUtils$1.DOM;
    var extend$4 = Tools.extend, each$l = Tools.each;
    var resolve$4 = Tools.resolve;
    var ie$2 = Env.ie;
    var Editor = function (id, settings, editorManager) {
      var self = this;
      var documentBaseUrl = self.documentBaseUrl = editorManager.documentBaseURL;
      var baseUri = editorManager.baseURI;
      settings = getEditorSettings(self, id, documentBaseUrl, editorManager.defaultSettings, settings);
      self.settings = settings;
      AddOnManager.language = settings.language || 'en';
      AddOnManager.languageLoad = settings.language_load;
      AddOnManager.baseURL = editorManager.baseURL;
      self.id = id;
      self.setDirty(false);
      self.plugins = {};
      self.documentBaseURI = new URI(settings.document_base_url, { base_uri: baseUri });
      self.baseURI = baseUri;
      self.contentCSS = [];
      self.contentStyles = [];
      self.shortcuts = new Shortcuts(self);
      self.loadedCSS = {};
      self.editorCommands = new EditorCommands(self);
      self.suffix = editorManager.suffix;
      self.editorManager = editorManager;
      self.inline = settings.inline;
      self.buttons = {};
      self.menuItems = {};
      if (settings.cache_suffix) {
        Env.cacheSuffix = settings.cache_suffix.replace(/^[\?\&]+/, '');
      }
      if (settings.override_viewport === false) {
        Env.overrideViewPort = false;
      }
      editorManager.fire('SetupEditor', { editor: self });
      self.execCallback('setup', self);
      self.$ = DomQuery.overrideDefaults(function () {
        return {
          context: self.inline ? self.getBody() : self.getDoc(),
          element: self.getBody()
        };
      });
    };
    Editor.prototype = {
      render: function () {
        Render.render(this);
      },
      focus: function (skipFocus) {
        EditorFocus.focus(this, skipFocus);
      },
      hasFocus: function () {
        return EditorFocus.hasFocus(this);
      },
      execCallback: function (name) {
        var x = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          x[_i - 1] = arguments[_i];
        }
        var self = this;
        var callback = self.settings[name], scope;
        if (!callback) {
          return;
        }
        if (self.callbackLookup && (scope = self.callbackLookup[name])) {
          callback = scope.func;
          scope = scope.scope;
        }
        if (typeof callback === 'string') {
          scope = callback.replace(/\.\w+$/, '');
          scope = scope ? resolve$4(scope) : 0;
          callback = resolve$4(callback);
          self.callbackLookup = self.callbackLookup || {};
          self.callbackLookup[name] = {
            func: callback,
            scope: scope
          };
        }
        return callback.apply(scope || self, Array.prototype.slice.call(arguments, 1));
      },
      translate: function (text) {
        if (text && Tools.is(text, 'string')) {
          var lang_1 = this.settings.language || 'en', i18n_1 = this.editorManager.i18n;
          text = i18n_1.data[lang_1 + '.' + text] || text.replace(/\{\#([^\}]+)\}/g, function (a, b) {
            return i18n_1.data[lang_1 + '.' + b] || '{#' + b + '}';
          });
        }
        return this.editorManager.translate(text);
      },
      getLang: function (name, defaultVal) {
        return this.editorManager.i18n.data[(this.settings.language || 'en') + '.' + name] || (defaultVal !== undefined ? defaultVal : '{#' + name + '}');
      },
      getParam: function (name, defaultVal, type) {
        return getParam(this, name, defaultVal, type);
      },
      nodeChanged: function (args) {
        this._nodeChangeDispatcher.nodeChanged(args);
      },
      addButton: function (name, settings) {
        var self = this;
        if (settings.cmd) {
          settings.onclick = function () {
            self.execCommand(settings.cmd);
          };
        }
        if (settings.stateSelector && typeof settings.active === 'undefined') {
          settings.active = false;
        }
        if (!settings.text && !settings.icon) {
          settings.icon = name;
        }
        settings.tooltip = settings.tooltip || settings.title;
        self.buttons[name] = settings;
      },
      addSidebar: function (name, settings) {
        return Sidebar.add(this, name, settings);
      },
      addMenuItem: function (name, settings) {
        var self = this;
        if (settings.cmd) {
          settings.onclick = function () {
            self.execCommand(settings.cmd);
          };
        }
        self.menuItems[name] = settings;
      },
      addContextToolbar: function (predicate, items) {
        var self = this;
        var selector;
        self.contextToolbars = self.contextToolbars || [];
        if (typeof predicate === 'string') {
          selector = predicate;
          predicate = function (elm) {
            return self.dom.is(elm, selector);
          };
        }
        self.contextToolbars.push({
          id: Uuid.uuid('mcet'),
          predicate: predicate,
          items: items
        });
      },
      addCommand: function (name, callback, scope) {
        this.editorCommands.addCommand(name, callback, scope);
      },
      addQueryStateHandler: function (name, callback, scope) {
        this.editorCommands.addQueryStateHandler(name, callback, scope);
      },
      addQueryValueHandler: function (name, callback, scope) {
        this.editorCommands.addQueryValueHandler(name, callback, scope);
      },
      addShortcut: function (pattern, desc, cmdFunc, scope) {
        this.shortcuts.add(pattern, desc, cmdFunc, scope);
      },
      execCommand: function (cmd, ui, value, args) {
        return this.editorCommands.execCommand(cmd, ui, value, args);
      },
      queryCommandState: function (cmd) {
        return this.editorCommands.queryCommandState(cmd);
      },
      queryCommandValue: function (cmd) {
        return this.editorCommands.queryCommandValue(cmd);
      },
      queryCommandSupported: function (cmd) {
        return this.editorCommands.queryCommandSupported(cmd);
      },
      show: function () {
        var self = this;
        if (self.hidden) {
          self.hidden = false;
          if (self.inline) {
            self.getBody().contentEditable = true;
          } else {
            DOM$7.show(self.getContainer());
            DOM$7.hide(self.id);
          }
          self.load();
          self.fire('show');
        }
      },
      hide: function () {
        var self = this, doc = self.getDoc();
        if (!self.hidden) {
          if (ie$2 && doc && !self.inline) {
            doc.execCommand('SelectAll');
          }
          self.save();
          if (self.inline) {
            self.getBody().contentEditable = false;
            if (self === self.editorManager.focusedEditor) {
              self.editorManager.focusedEditor = null;
            }
          } else {
            DOM$7.hide(self.getContainer());
            DOM$7.setStyle(self.id, 'display', self.orgDisplay);
          }
          self.hidden = true;
          self.fire('hide');
        }
      },
      isHidden: function () {
        return !!this.hidden;
      },
      setProgressState: function (state, time) {
        this.fire('ProgressState', {
          state: state,
          time: time
        });
      },
      load: function (args) {
        var self = this;
        var elm = self.getElement(), html;
        if (self.removed) {
          return '';
        }
        if (elm) {
          args = args || {};
          args.load = true;
          html = self.setContent(elm.value !== undefined ? elm.value : elm.innerHTML, args);
          args.element = elm;
          if (!args.no_events) {
            self.fire('LoadContent', args);
          }
          args.element = elm = null;
          return html;
        }
      },
      save: function (args) {
        var self = this;
        var elm = self.getElement(), html, form;
        if (!elm || !self.initialized || self.removed) {
          return;
        }
        args = args || {};
        args.save = true;
        args.element = elm;
        html = args.content = self.getContent(args);
        if (!args.no_events) {
          self.fire('SaveContent', args);
        }
        if (args.format === 'raw') {
          self.fire('RawSaveContent', args);
        }
        html = args.content;
        if (!/TEXTAREA|INPUT/i.test(elm.nodeName)) {
          if (args.is_removing || !self.inline) {
            elm.innerHTML = html;
          }
          if (form = DOM$7.getParent(self.id, 'form')) {
            each$l(form.elements, function (elm) {
              if (elm.name === self.id) {
                elm.value = html;
                return false;
              }
            });
          }
        } else {
          elm.value = html;
        }
        args.element = elm = null;
        if (args.set_dirty !== false) {
          self.setDirty(false);
        }
        return html;
      },
      setContent: function (content, args) {
        return setContent$1(this, content, args);
      },
      getContent: function (args) {
        return getContent$1(this, args);
      },
      insertContent: function (content, args) {
        if (args) {
          content = extend$4({ content: content }, args);
        }
        this.execCommand('mceInsertContent', false, content);
      },
      isDirty: function () {
        return !this.isNotDirty;
      },
      setDirty: function (state) {
        var oldState = !this.isNotDirty;
        this.isNotDirty = !state;
        if (state && state !== oldState) {
          this.fire('dirty');
        }
      },
      setMode: function (mode) {
        setMode(this, mode);
      },
      getContainer: function () {
        var self = this;
        if (!self.container) {
          self.container = DOM$7.get(self.editorContainer || self.id + '_parent');
        }
        return self.container;
      },
      getContentAreaContainer: function () {
        return this.contentAreaContainer;
      },
      getElement: function () {
        if (!this.targetElm) {
          this.targetElm = DOM$7.get(this.id);
        }
        return this.targetElm;
      },
      getWin: function () {
        var self = this;
        var elm;
        if (!self.contentWindow) {
          elm = self.iframeElement;
          if (elm) {
            self.contentWindow = elm.contentWindow;
          }
        }
        return self.contentWindow;
      },
      getDoc: function () {
        var self = this;
        var win;
        if (!self.contentDocument) {
          win = self.getWin();
          if (win) {
            self.contentDocument = win.document;
          }
        }
        return self.contentDocument;
      },
      getBody: function () {
        var doc = this.getDoc();
        return this.bodyElement || (doc ? doc.body : null);
      },
      convertURL: function (url, name, elm) {
        var self = this, settings = self.settings;
        if (settings.urlconverter_callback) {
          return self.execCallback('urlconverter_callback', url, elm, true, name);
        }
        if (!settings.convert_urls || elm && elm.nodeName === 'LINK' || url.indexOf('file:') === 0 || url.length === 0) {
          return url;
        }
        if (settings.relative_urls) {
          return self.documentBaseURI.toRelative(url);
        }
        url = self.documentBaseURI.toAbsolute(url, settings.remove_script_host);
        return url;
      },
      addVisual: function (elm) {
        var self = this;
        var settings = self.settings;
        var dom = self.dom;
        var cls;
        elm = elm || self.getBody();
        if (self.hasVisual === undefined) {
          self.hasVisual = settings.visual;
        }
        each$l(dom.select('table,a', elm), function (elm) {
          var value;
          switch (elm.nodeName) {
          case 'TABLE':
            cls = settings.visual_table_class || 'mce-item-table';
            value = dom.getAttrib(elm, 'border');
            if ((!value || value === '0') && self.hasVisual) {
              dom.addClass(elm, cls);
            } else {
              dom.removeClass(elm, cls);
            }
            return;
          case 'A':
            if (!dom.getAttrib(elm, 'href')) {
              value = dom.getAttrib(elm, 'name') || elm.id;
              cls = settings.visual_anchor_class || 'mce-item-anchor';
              if (value && self.hasVisual) {
                dom.addClass(elm, cls);
              } else {
                dom.removeClass(elm, cls);
              }
            }
            return;
          }
        });
        self.fire('VisualAid', {
          element: elm,
          hasVisual: self.hasVisual
        });
      },
      remove: function () {
        remove$9(this);
      },
      destroy: function (automatic) {
        destroy(this, automatic);
      },
      uploadImages: function (callback) {
        return this.editorUpload.uploadImages(callback);
      },
      _scanForImages: function () {
        return this.editorUpload.scanForImages();
      }
    };
    extend$4(Editor.prototype, EditorObservable$1);

    var isEditorUIElement = function (elm) {
      return elm.className.toString().indexOf('mce-') !== -1;
    };
    var FocusManager = { isEditorUIElement: isEditorUIElement };

    var isManualNodeChange = function (e) {
      return e.type === 'nodechange' && e.selectionChange;
    };
    var registerPageMouseUp = function (editor, throttledStore) {
      var mouseUpPage = function () {
        throttledStore.throttle();
      };
      DOMUtils$1.DOM.bind(document, 'mouseup', mouseUpPage);
      editor.on('remove', function () {
        DOMUtils$1.DOM.unbind(document, 'mouseup', mouseUpPage);
      });
    };
    var registerFocusOut = function (editor) {
      editor.on('focusout', function () {
        SelectionBookmark.store(editor);
      });
    };
    var registerMouseUp = function (editor, throttledStore) {
      editor.on('mouseup touchend', function (e) {
        throttledStore.throttle();
      });
    };
    var registerEditorEvents = function (editor, throttledStore) {
      var browser = PlatformDetection$1.detect().browser;
      if (browser.isIE()) {
        registerFocusOut(editor);
      } else {
        registerMouseUp(editor, throttledStore);
      }
      editor.on('keyup nodechange', function (e) {
        if (!isManualNodeChange(e)) {
          SelectionBookmark.store(editor);
        }
      });
    };
    var register$3 = function (editor) {
      var throttledStore = first$1(function () {
        SelectionBookmark.store(editor);
      }, 0);
      if (editor.inline) {
        registerPageMouseUp(editor, throttledStore);
      }
      editor.on('init', function () {
        registerEditorEvents(editor, throttledStore);
      });
      editor.on('remove', function () {
        throttledStore.cancel();
      });
    };
    var SelectionRestore = { register: register$3 };

    var documentFocusInHandler;
    var DOM$8 = DOMUtils$1.DOM;
    var isEditorUIElement$1 = function (elm) {
      return FocusManager.isEditorUIElement(elm);
    };
    var isUIElement = function (editor, elm) {
      var customSelector = editor ? editor.settings.custom_ui_selector : '';
      var parent$$1 = DOM$8.getParent(elm, function (elm) {
        return isEditorUIElement$1(elm) || (customSelector ? editor.dom.is(elm, customSelector) : false);
      });
      return parent$$1 !== null;
    };
    var getActiveElement = function () {
      try {
        return document.activeElement;
      } catch (ex) {
        return document.body;
      }
    };
    var registerEvents = function (editorManager, e) {
      var editor = e.editor;
      SelectionRestore.register(editor);
      editor.on('focusin', function () {
        var self$$1 = this;
        var focusedEditor = editorManager.focusedEditor;
        if (focusedEditor !== self$$1) {
          if (focusedEditor) {
            focusedEditor.fire('blur', { focusedEditor: self$$1 });
          }
          editorManager.setActive(self$$1);
          editorManager.focusedEditor = self$$1;
          self$$1.fire('focus', { blurredEditor: focusedEditor });
          self$$1.focus(true);
        }
      });
      editor.on('focusout', function () {
        var self$$1 = this;
        Delay.setEditorTimeout(self$$1, function () {
          var focusedEditor = editorManager.focusedEditor;
          if (!isUIElement(self$$1, getActiveElement()) && focusedEditor === self$$1) {
            self$$1.fire('blur', { focusedEditor: null });
            editorManager.focusedEditor = null;
          }
        });
      });
      if (!documentFocusInHandler) {
        documentFocusInHandler = function (e) {
          var activeEditor = editorManager.activeEditor;
          var target;
          target = e.target;
          if (activeEditor && target.ownerDocument === document) {
            if (target !== document.body && !isUIElement(activeEditor, target) && editorManager.focusedEditor === activeEditor) {
              activeEditor.fire('blur', { focusedEditor: null });
              editorManager.focusedEditor = null;
            }
          }
        };
        DOM$8.bind(document, 'focusin', documentFocusInHandler);
      }
    };
    var unregisterDocumentEvents = function (editorManager, e) {
      if (editorManager.focusedEditor === e.editor) {
        editorManager.focusedEditor = null;
      }
      if (!editorManager.activeEditor) {
        DOM$8.unbind(document, 'focusin', documentFocusInHandler);
        documentFocusInHandler = null;
      }
    };
    var setup$f = function (editorManager) {
      editorManager.on('AddEditor', curry(registerEvents, editorManager));
      editorManager.on('RemoveEditor', curry(unregisterDocumentEvents, editorManager));
    };
    var FocusController = {
      setup: setup$f,
      isEditorUIElement: isEditorUIElement$1,
      isUIElement: isUIElement
    };

    var data = {};
    var code = 'en';
    var I18n = {
      setCode: function (newCode) {
        if (newCode) {
          code = newCode;
          this.rtl = this.data[newCode] ? this.data[newCode]._dir === 'rtl' : false;
        }
      },
      getCode: function () {
        return code;
      },
      rtl: false,
      add: function (code, items) {
        var langData = data[code];
        if (!langData) {
          data[code] = langData = {};
        }
        for (var name in items) {
          langData[name] = items[name];
        }
        this.setCode(code);
      },
      translate: function (text) {
        var langData = data[code] || {};
        var toString = function (obj) {
          if (Tools.is(obj, 'function')) {
            return Object.prototype.toString.call(obj);
          }
          return !isEmpty(obj) ? '' + obj : '';
        };
        var isEmpty = function (text) {
          return text === '' || text === null || Tools.is(text, 'undefined');
        };
        var getLangData = function (text) {
          text = toString(text);
          return Tools.hasOwn(langData, text) ? toString(langData[text]) : text;
        };
        if (isEmpty(text)) {
          return '';
        }
        if (Tools.is(text, 'object') && Tools.hasOwn(text, 'raw')) {
          return toString(text.raw);
        }
        if (Tools.is(text, 'array')) {
          var values_1 = text.slice(1);
          text = getLangData(text[0]).replace(/\{([0-9]+)\}/g, function ($1, $2) {
            return Tools.hasOwn(values_1, $2) ? toString(values_1[$2]) : $1;
          });
        }
        return getLangData(text).replace(/{context:\w+}$/, '');
      },
      data: data
    };

    var DOM$9 = DOMUtils$1.DOM;
    var explode$4 = Tools.explode, each$m = Tools.each, extend$5 = Tools.extend;
    var instanceCounter = 0, beforeUnloadDelegate, EditorManager, boundGlobalEvents = false;
    var legacyEditors = [];
    var editors = [];
    var isValidLegacyKey = function (id) {
      return id !== 'length';
    };
    var globalEventDelegate = function (e) {
      each$m(EditorManager.get(), function (editor) {
        if (e.type === 'scroll') {
          editor.fire('ScrollWindow', e);
        } else {
          editor.fire('ResizeWindow', e);
        }
      });
    };
    var toggleGlobalEvents = function (state) {
      if (state !== boundGlobalEvents) {
        if (state) {
          DomQuery(window).on('resize scroll', globalEventDelegate);
        } else {
          DomQuery(window).off('resize scroll', globalEventDelegate);
        }
        boundGlobalEvents = state;
      }
    };
    var removeEditorFromList = function (targetEditor) {
      var oldEditors = editors;
      delete legacyEditors[targetEditor.id];
      for (var i = 0; i < legacyEditors.length; i++) {
        if (legacyEditors[i] === targetEditor) {
          legacyEditors.splice(i, 1);
          break;
        }
      }
      editors = filter(editors, function (editor) {
        return targetEditor !== editor;
      });
      if (EditorManager.activeEditor === targetEditor) {
        EditorManager.activeEditor = editors.length > 0 ? editors[0] : null;
      }
      if (EditorManager.focusedEditor === targetEditor) {
        EditorManager.focusedEditor = null;
      }
      return oldEditors.length !== editors.length;
    };
    var purgeDestroyedEditor = function (editor) {
      if (editor && editor.initialized && !(editor.getContainer() || editor.getBody()).parentNode) {
        removeEditorFromList(editor);
        editor.unbindAllNativeEvents();
        editor.destroy(true);
        editor.removed = true;
        editor = null;
      }
      return editor;
    };
    EditorManager = {
      defaultSettings: {},
      $: DomQuery,
      majorVersion: '4',
      minorVersion: '8.5',
      releaseDate: '2018-10-30',
      editors: legacyEditors,
      i18n: I18n,
      activeEditor: null,
      settings: {},
      setup: function () {
        var self$$1 = this;
        var baseURL, documentBaseURL, suffix = '', preInit, src;
        documentBaseURL = URI.getDocumentBaseUrl(document.location);
        if (/^[^:]+:\/\/\/?[^\/]+\//.test(documentBaseURL)) {
          documentBaseURL = documentBaseURL.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
          if (!/[\/\\]$/.test(documentBaseURL)) {
            documentBaseURL += '/';
          }
        }
        preInit = window.tinymce || window.tinyMCEPreInit;
        if (preInit) {
          baseURL = preInit.base || preInit.baseURL;
          suffix = preInit.suffix;
        } else {
          var scripts = document.getElementsByTagName('script');
          for (var i = 0; i < scripts.length; i++) {
            src = scripts[i].src;
            var srcScript = src.substring(src.lastIndexOf('/'));
            if (/tinymce(\.full|\.jquery|)(\.min|\.dev|)\.js/.test(src)) {
              if (srcScript.indexOf('.min') !== -1) {
                suffix = '.min';
              }
              baseURL = src.substring(0, src.lastIndexOf('/'));
              break;
            }
          }
          if (!baseURL && document.currentScript) {
            src = document.currentScript.src;
            if (src.indexOf('.min') !== -1) {
              suffix = '.min';
            }
            baseURL = src.substring(0, src.lastIndexOf('/'));
          }
        }
        self$$1.baseURL = new URI(documentBaseURL).toAbsolute(baseURL);
        self$$1.documentBaseURL = documentBaseURL;
        self$$1.baseURI = new URI(self$$1.baseURL);
        self$$1.suffix = suffix;
        FocusController.setup(self$$1);
      },
      overrideDefaults: function (defaultSettings) {
        var baseUrl, suffix;
        baseUrl = defaultSettings.base_url;
        if (baseUrl) {
          this.baseURL = new URI(this.documentBaseURL).toAbsolute(baseUrl.replace(/\/+$/, ''));
          this.baseURI = new URI(this.baseURL);
        }
        suffix = defaultSettings.suffix;
        if (defaultSettings.suffix) {
          this.suffix = suffix;
        }
        this.defaultSettings = defaultSettings;
        var pluginBaseUrls = defaultSettings.plugin_base_urls;
        for (var name$$1 in pluginBaseUrls) {
          AddOnManager.PluginManager.urls[name$$1] = pluginBaseUrls[name$$1];
        }
      },
      init: function (settings) {
        var self$$1 = this;
        var result, invalidInlineTargets;
        invalidInlineTargets = Tools.makeMap('area base basefont br col frame hr img input isindex link meta param embed source wbr track ' + 'colgroup option tbody tfoot thead tr script noscript style textarea video audio iframe object menu', ' ');
        var isInvalidInlineTarget = function (settings, elm) {
          return settings.inline && elm.tagName.toLowerCase() in invalidInlineTargets;
        };
        var createId = function (elm) {
          var id = elm.id;
          if (!id) {
            id = elm.name;
            if (id && !DOM$9.get(id)) {
              id = elm.name;
            } else {
              id = DOM$9.uniqueId();
            }
            elm.setAttribute('id', id);
          }
          return id;
        };
        var execCallback = function (name$$1) {
          var callback = settings[name$$1];
          if (!callback) {
            return;
          }
          return callback.apply(self$$1, Array.prototype.slice.call(arguments, 2));
        };
        var hasClass = function (elm, className) {
          return className.constructor === RegExp ? className.test(elm.className) : DOM$9.hasClass(elm, className);
        };
        var findTargets = function (settings) {
          var l, targets = [];
          if (Env.ie && Env.ie < 11) {
            ErrorReporter.initError('TinyMCE does not support the browser you are using. For a list of supported' + ' browsers please see: https://www.tinymce.com/docs/get-started/system-requirements/');
            return [];
          }
          if (settings.types) {
            each$m(settings.types, function (type) {
              targets = targets.concat(DOM$9.select(type.selector));
            });
            return targets;
          } else if (settings.selector) {
            return DOM$9.select(settings.selector);
          } else if (settings.target) {
            return [settings.target];
          }
          switch (settings.mode) {
          case 'exact':
            l = settings.elements || '';
            if (l.length > 0) {
              each$m(explode$4(l), function (id) {
                var elm;
                if (elm = DOM$9.get(id)) {
                  targets.push(elm);
                } else {
                  each$m(document.forms, function (f) {
                    each$m(f.elements, function (e) {
                      if (e.name === id) {
                        id = 'mce_editor_' + instanceCounter++;
                        DOM$9.setAttrib(e, 'id', id);
                        targets.push(e);
                      }
                    });
                  });
                }
              });
            }
            break;
          case 'textareas':
          case 'specific_textareas':
            each$m(DOM$9.select('textarea'), function (elm) {
              if (settings.editor_deselector && hasClass(elm, settings.editor_deselector)) {
                return;
              }
              if (!settings.editor_selector || hasClass(elm, settings.editor_selector)) {
                targets.push(elm);
              }
            });
            break;
          }
          return targets;
        };
        var provideResults = function (editors) {
          result = editors;
        };
        var initEditors = function () {
          var initCount = 0;
          var editors = [];
          var targets;
          var createEditor = function (id, settings, targetElm) {
            var editor = new Editor(id, settings, self$$1);
            editors.push(editor);
            editor.on('init', function () {
              if (++initCount === targets.length) {
                provideResults(editors);
              }
            });
            editor.targetElm = editor.targetElm || targetElm;
            editor.render();
          };
          DOM$9.unbind(window, 'ready', initEditors);
          execCallback('onpageload');
          targets = DomQuery.unique(findTargets(settings));
          if (settings.types) {
            each$m(settings.types, function (type) {
              Tools.each(targets, function (elm) {
                if (DOM$9.is(elm, type.selector)) {
                  createEditor(createId(elm), extend$5({}, settings, type), elm);
                  return false;
                }
                return true;
              });
            });
            return;
          }
          Tools.each(targets, function (elm) {
            purgeDestroyedEditor(self$$1.get(elm.id));
          });
          targets = Tools.grep(targets, function (elm) {
            return !self$$1.get(elm.id);
          });
          if (targets.length === 0) {
            provideResults([]);
          } else {
            each$m(targets, function (elm) {
              if (isInvalidInlineTarget(settings, elm)) {
                ErrorReporter.initError('Could not initialize inline editor on invalid inline target element', elm);
              } else {
                createEditor(createId(elm), settings, elm);
              }
            });
          }
        };
        self$$1.settings = settings;
        DOM$9.bind(window, 'ready', initEditors);
        return new promiseObj(function (resolve) {
          if (result) {
            resolve(result);
          } else {
            provideResults = function (editors) {
              resolve(editors);
            };
          }
        });
      },
      get: function (id) {
        if (arguments.length === 0) {
          return editors.slice(0);
        } else if (isString(id)) {
          return find(editors, function (editor) {
            return editor.id === id;
          }).getOr(null);
        } else if (isNumber(id)) {
          return editors[id] ? editors[id] : null;
        } else {
          return null;
        }
      },
      add: function (editor) {
        var self$$1 = this;
        var existingEditor;
        existingEditor = legacyEditors[editor.id];
        if (existingEditor === editor) {
          return editor;
        }
        if (self$$1.get(editor.id) === null) {
          if (isValidLegacyKey(editor.id)) {
            legacyEditors[editor.id] = editor;
          }
          legacyEditors.push(editor);
          editors.push(editor);
        }
        toggleGlobalEvents(true);
        self$$1.activeEditor = editor;
        self$$1.fire('AddEditor', { editor: editor });
        if (!beforeUnloadDelegate) {
          beforeUnloadDelegate = function () {
            self$$1.fire('BeforeUnload');
          };
          DOM$9.bind(window, 'beforeunload', beforeUnloadDelegate);
        }
        return editor;
      },
      createEditor: function (id, settings) {
        return this.add(new Editor(id, settings, this));
      },
      remove: function (selector) {
        var self$$1 = this;
        var i, editor;
        if (!selector) {
          for (i = editors.length - 1; i >= 0; i--) {
            self$$1.remove(editors[i]);
          }
          return;
        }
        if (isString(selector)) {
          each$m(DOM$9.select(selector), function (elm) {
            editor = self$$1.get(elm.id);
            if (editor) {
              self$$1.remove(editor);
            }
          });
          return;
        }
        editor = selector;
        if (isNull(self$$1.get(editor.id))) {
          return null;
        }
        if (removeEditorFromList(editor)) {
          self$$1.fire('RemoveEditor', { editor: editor });
        }
        if (editors.length === 0) {
          DOM$9.unbind(window, 'beforeunload', beforeUnloadDelegate);
        }
        editor.remove();
        toggleGlobalEvents(editors.length > 0);
        return editor;
      },
      execCommand: function (cmd, ui, value) {
        var self$$1 = this, editor = self$$1.get(value);
        switch (cmd) {
        case 'mceAddEditor':
          if (!self$$1.get(value)) {
            new Editor(value, self$$1.settings, self$$1).render();
          }
          return true;
        case 'mceRemoveEditor':
          if (editor) {
            editor.remove();
          }
          return true;
        case 'mceToggleEditor':
          if (!editor) {
            self$$1.execCommand('mceAddEditor', 0, value);
            return true;
          }
          if (editor.isHidden()) {
            editor.show();
          } else {
            editor.hide();
          }
          return true;
        }
        if (self$$1.activeEditor) {
          return self$$1.activeEditor.execCommand(cmd, ui, value);
        }
        return false;
      },
      triggerSave: function () {
        each$m(editors, function (editor) {
          editor.save();
        });
      },
      addI18n: function (code, items) {
        I18n.add(code, items);
      },
      translate: function (text) {
        return I18n.translate(text);
      },
      setActive: function (editor) {
        var activeEditor = this.activeEditor;
        if (this.activeEditor !== editor) {
          if (activeEditor) {
            activeEditor.fire('deactivate', { relatedTarget: editor });
          }
          editor.fire('activate', { relatedTarget: activeEditor });
        }
        this.activeEditor = editor;
      }
    };
    extend$5(EditorManager, Observable);
    EditorManager.setup();
    var EditorManager$1 = EditorManager;

    function RangeUtils(dom) {
      var walk = function (rng, callback) {
        return RangeWalk.walk(dom, rng, callback);
      };
      var split = SplitRange.split;
      var normalize = function (rng) {
        return NormalizeRange.normalize(dom, rng).fold(constant(false), function (normalizedRng) {
          rng.setStart(normalizedRng.startContainer, normalizedRng.startOffset);
          rng.setEnd(normalizedRng.endContainer, normalizedRng.endOffset);
          return true;
        });
      };
      return {
        walk: walk,
        split: split,
        normalize: normalize
      };
    }
    (function (RangeUtils) {
      RangeUtils.compareRanges = RangeCompare.isEq;
      RangeUtils.getCaretRangeFromPoint = CaretRangeFromPoint.fromPoint;
      RangeUtils.getSelectedNode = getSelectedNode;
      RangeUtils.getNode = getNode;
    }(RangeUtils || (RangeUtils = {})));
    var RangeUtils$1 = RangeUtils;

    var min = Math.min, max = Math.max, round$2 = Math.round;
    var relativePosition = function (rect, targetRect, rel) {
      var x, y, w, h, targetW, targetH;
      x = targetRect.x;
      y = targetRect.y;
      w = rect.w;
      h = rect.h;
      targetW = targetRect.w;
      targetH = targetRect.h;
      rel = (rel || '').split('');
      if (rel[0] === 'b') {
        y += targetH;
      }
      if (rel[1] === 'r') {
        x += targetW;
      }
      if (rel[0] === 'c') {
        y += round$2(targetH / 2);
      }
      if (rel[1] === 'c') {
        x += round$2(targetW / 2);
      }
      if (rel[3] === 'b') {
        y -= h;
      }
      if (rel[4] === 'r') {
        x -= w;
      }
      if (rel[3] === 'c') {
        y -= round$2(h / 2);
      }
      if (rel[4] === 'c') {
        x -= round$2(w / 2);
      }
      return create$3(x, y, w, h);
    };
    var findBestRelativePosition = function (rect, targetRect, constrainRect, rels) {
      var pos, i;
      for (i = 0; i < rels.length; i++) {
        pos = relativePosition(rect, targetRect, rels[i]);
        if (pos.x >= constrainRect.x && pos.x + pos.w <= constrainRect.w + constrainRect.x && pos.y >= constrainRect.y && pos.y + pos.h <= constrainRect.h + constrainRect.y) {
          return rels[i];
        }
      }
      return null;
    };
    var inflate = function (rect, w, h) {
      return create$3(rect.x - w, rect.y - h, rect.w + w * 2, rect.h + h * 2);
    };
    var intersect = function (rect, cropRect) {
      var x1, y1, x2, y2;
      x1 = max(rect.x, cropRect.x);
      y1 = max(rect.y, cropRect.y);
      x2 = min(rect.x + rect.w, cropRect.x + cropRect.w);
      y2 = min(rect.y + rect.h, cropRect.y + cropRect.h);
      if (x2 - x1 < 0 || y2 - y1 < 0) {
        return null;
      }
      return create$3(x1, y1, x2 - x1, y2 - y1);
    };
    var clamp$1 = function (rect, clampRect, fixedSize) {
      var underflowX1, underflowY1, overflowX2, overflowY2, x1, y1, x2, y2, cx2, cy2;
      x1 = rect.x;
      y1 = rect.y;
      x2 = rect.x + rect.w;
      y2 = rect.y + rect.h;
      cx2 = clampRect.x + clampRect.w;
      cy2 = clampRect.y + clampRect.h;
      underflowX1 = max(0, clampRect.x - x1);
      underflowY1 = max(0, clampRect.y - y1);
      overflowX2 = max(0, x2 - cx2);
      overflowY2 = max(0, y2 - cy2);
      x1 += underflowX1;
      y1 += underflowY1;
      if (fixedSize) {
        x2 += underflowX1;
        y2 += underflowY1;
        x1 -= overflowX2;
        y1 -= overflowY2;
      }
      x2 -= overflowX2;
      y2 -= overflowY2;
      return create$3(x1, y1, x2 - x1, y2 - y1);
    };
    var create$3 = function (x, y, w, h) {
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    };
    var fromClientRect = function (clientRect) {
      return create$3(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    };
    var Rect = {
      inflate: inflate,
      relativePosition: relativePosition,
      findBestRelativePosition: findBestRelativePosition,
      intersect: intersect,
      clamp: clamp$1,
      create: create$3,
      fromClientRect: fromClientRect
    };

    var types = {};
    var Factory = {
      add: function (type, typeClass) {
        types[type.toLowerCase()] = typeClass;
      },
      has: function (type) {
        return !!types[type.toLowerCase()];
      },
      get: function (type) {
        var lctype = type.toLowerCase();
        var controlType = types.hasOwnProperty(lctype) ? types[lctype] : null;
        if (controlType === null) {
          throw new Error('Could not find module for type: ' + type);
        }
        return controlType;
      },
      create: function (type, settings) {
        var ControlType;
        if (typeof type === 'string') {
          settings = settings || {};
          settings.type = type;
        } else {
          settings = type;
          type = settings.type;
        }
        type = type.toLowerCase();
        ControlType = types[type];
        if (!ControlType) {
          throw new Error('Could not find control by type: ' + type);
        }
        ControlType = new ControlType(settings);
        ControlType.type = type;
        return ControlType;
      }
    };

    var each$n = Tools.each, extend$6 = Tools.extend;
    var extendClass, initializing;
    var Class = function () {
    };
    Class.extend = extendClass = function (prop) {
      var self = this;
      var _super = self.prototype;
      var prototype, name, member;
      var Class = function () {
        var i, mixins, mixin;
        var self = this;
        if (!initializing) {
          if (self.init) {
            self.init.apply(self, arguments);
          }
          mixins = self.Mixins;
          if (mixins) {
            i = mixins.length;
            while (i--) {
              mixin = mixins[i];
              if (mixin.init) {
                mixin.init.apply(self, arguments);
              }
            }
          }
        }
      };
      var dummy = function () {
        return this;
      };
      var createMethod = function (name, fn) {
        return function () {
          var self = this;
          var tmp = self._super;
          var ret;
          self._super = _super[name];
          ret = fn.apply(self, arguments);
          self._super = tmp;
          return ret;
        };
      };
      initializing = true;
      prototype = new self();
      initializing = false;
      if (prop.Mixins) {
        each$n(prop.Mixins, function (mixin) {
          for (var name_1 in mixin) {
            if (name_1 !== 'init') {
              prop[name_1] = mixin[name_1];
            }
          }
        });
        if (_super.Mixins) {
          prop.Mixins = _super.Mixins.concat(prop.Mixins);
        }
      }
      if (prop.Methods) {
        each$n(prop.Methods.split(','), function (name) {
          prop[name] = dummy;
        });
      }
      if (prop.Properties) {
        each$n(prop.Properties.split(','), function (name) {
          var fieldName = '_' + name;
          prop[name] = function (value) {
            var self = this;
            if (value !== undefined) {
              self[fieldName] = value;
              return self;
            }
            return self[fieldName];
          };
        });
      }
      if (prop.Statics) {
        each$n(prop.Statics, function (func, name) {
          Class[name] = func;
        });
      }
      if (prop.Defaults && _super.Defaults) {
        prop.Defaults = extend$6({}, _super.Defaults, prop.Defaults);
      }
      for (name in prop) {
        member = prop[name];
        if (typeof member === 'function' && _super[name]) {
          prototype[name] = createMethod(name, member);
        } else {
          prototype[name] = member;
        }
      }
      Class.prototype = prototype;
      Class.constructor = Class;
      Class.extend = extendClass;
      return Class;
    };

    var min$1 = Math.min, max$1 = Math.max, round$3 = Math.round;
    var Color = function (value) {
      var self = {};
      var r = 0, g = 0, b = 0;
      var rgb2hsv = function (r, g, b) {
        var h, s, v, d, minRGB, maxRGB;
        h = 0;
        s = 0;
        v = 0;
        r = r / 255;
        g = g / 255;
        b = b / 255;
        minRGB = min$1(r, min$1(g, b));
        maxRGB = max$1(r, max$1(g, b));
        if (minRGB === maxRGB) {
          v = minRGB;
          return {
            h: 0,
            s: 0,
            v: v * 100
          };
        }
        d = r === minRGB ? g - b : b === minRGB ? r - g : b - r;
        h = r === minRGB ? 3 : b === minRGB ? 1 : 5;
        h = 60 * (h - d / (maxRGB - minRGB));
        s = (maxRGB - minRGB) / maxRGB;
        v = maxRGB;
        return {
          h: round$3(h),
          s: round$3(s * 100),
          v: round$3(v * 100)
        };
      };
      var hsvToRgb = function (hue, saturation, brightness) {
        var side, chroma, x, match;
        hue = (parseInt(hue, 10) || 0) % 360;
        saturation = parseInt(saturation, 10) / 100;
        brightness = parseInt(brightness, 10) / 100;
        saturation = max$1(0, min$1(saturation, 1));
        brightness = max$1(0, min$1(brightness, 1));
        if (saturation === 0) {
          r = g = b = round$3(255 * brightness);
          return;
        }
        side = hue / 60;
        chroma = brightness * saturation;
        x = chroma * (1 - Math.abs(side % 2 - 1));
        match = brightness - chroma;
        switch (Math.floor(side)) {
        case 0:
          r = chroma;
          g = x;
          b = 0;
          break;
        case 1:
          r = x;
          g = chroma;
          b = 0;
          break;
        case 2:
          r = 0;
          g = chroma;
          b = x;
          break;
        case 3:
          r = 0;
          g = x;
          b = chroma;
          break;
        case 4:
          r = x;
          g = 0;
          b = chroma;
          break;
        case 5:
          r = chroma;
          g = 0;
          b = x;
          break;
        default:
          r = g = b = 0;
        }
        r = round$3(255 * (r + match));
        g = round$3(255 * (g + match));
        b = round$3(255 * (b + match));
      };
      var toHex = function () {
        var hex = function (val) {
          val = parseInt(val, 10).toString(16);
          return val.length > 1 ? val : '0' + val;
        };
        return '#' + hex(r) + hex(g) + hex(b);
      };
      var toRgb = function () {
        return {
          r: r,
          g: g,
          b: b
        };
      };
      var toHsv = function () {
        return rgb2hsv(r, g, b);
      };
      var parse = function (value) {
        var matches;
        if (typeof value === 'object') {
          if ('r' in value) {
            r = value.r;
            g = value.g;
            b = value.b;
          } else if ('v' in value) {
            hsvToRgb(value.h, value.s, value.v);
          }
        } else {
          if (matches = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)[^\)]*\)/gi.exec(value)) {
            r = parseInt(matches[1], 10);
            g = parseInt(matches[2], 10);
            b = parseInt(matches[3], 10);
          } else if (matches = /#([0-F]{2})([0-F]{2})([0-F]{2})/gi.exec(value)) {
            r = parseInt(matches[1], 16);
            g = parseInt(matches[2], 16);
            b = parseInt(matches[3], 16);
          } else if (matches = /#([0-F])([0-F])([0-F])/gi.exec(value)) {
            r = parseInt(matches[1] + matches[1], 16);
            g = parseInt(matches[2] + matches[2], 16);
            b = parseInt(matches[3] + matches[3], 16);
          }
        }
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;
        return self;
      };
      if (value) {
        parse(value);
      }
      self.toRgb = toRgb;
      self.toHsv = toHsv;
      self.toHex = toHex;
      self.parse = parse;
      return self;
    };

    var serialize = function (o, quote) {
      var i, v, t, name;
      quote = quote || '"';
      if (o === null) {
        return 'null';
      }
      t = typeof o;
      if (t === 'string') {
        v = '\bb\tt\nn\ff\rr""\'\'\\\\';
        return quote + o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g, function (a, b) {
          if (quote === '"' && a === '\'') {
            return a;
          }
          i = v.indexOf(b);
          if (i + 1) {
            return '\\' + v.charAt(i + 1);
          }
          a = b.charCodeAt().toString(16);
          return '\\u' + '0000'.substring(a.length) + a;
        }) + quote;
      }
      if (t === 'object') {
        if (o.hasOwnProperty && Object.prototype.toString.call(o) === '[object Array]') {
          for (i = 0, v = '['; i < o.length; i++) {
            v += (i > 0 ? ',' : '') + serialize(o[i], quote);
          }
          return v + ']';
        }
        v = '{';
        for (name in o) {
          if (o.hasOwnProperty(name)) {
            v += typeof o[name] !== 'function' ? (v.length > 1 ? ',' + quote : quote) + name + quote + ':' + serialize(o[name], quote) : '';
          }
        }
        return v + '}';
      }
      return '' + o;
    };
    var JSON$1 = {
      serialize: serialize,
      parse: function (text) {
        try {
          return JSON.parse(text);
        } catch (ex) {
        }
      }
    };

    var JSONP = {
      callbacks: {},
      count: 0,
      send: function (settings) {
        var self = this, dom = DOMUtils$1.DOM, count = settings.count !== undefined ? settings.count : self.count;
        var id = 'tinymce_jsonp_' + count;
        self.callbacks[count] = function (json) {
          dom.remove(id);
          delete self.callbacks[count];
          settings.callback(json);
        };
        dom.add(dom.doc.body, 'script', {
          id: id,
          src: settings.url,
          type: 'text/javascript'
        });
        self.count++;
      }
    };

    var XHR = {
      send: function (settings) {
        var xhr, count = 0;
        var ready = function () {
          if (!settings.async || xhr.readyState === 4 || count++ > 10000) {
            if (settings.success && count < 10000 && xhr.status === 200) {
              settings.success.call(settings.success_scope, '' + xhr.responseText, xhr, settings);
            } else if (settings.error) {
              settings.error.call(settings.error_scope, count > 10000 ? 'TIMED_OUT' : 'GENERAL', xhr, settings);
            }
            xhr = null;
          } else {
            setTimeout(ready, 10);
          }
        };
        settings.scope = settings.scope || this;
        settings.success_scope = settings.success_scope || settings.scope;
        settings.error_scope = settings.error_scope || settings.scope;
        settings.async = settings.async === false ? false : true;
        settings.data = settings.data || '';
        XHR.fire('beforeInitialize', { settings: settings });
        xhr = XMLHttpRequest();
        if (xhr) {
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType(settings.content_type);
          }
          xhr.open(settings.type || (settings.data ? 'POST' : 'GET'), settings.url, settings.async);
          if (settings.crossDomain) {
            xhr.withCredentials = true;
          }
          if (settings.content_type) {
            xhr.setRequestHeader('Content-Type', settings.content_type);
          }
          if (settings.requestheaders) {
            Tools.each(settings.requestheaders, function (header) {
              xhr.setRequestHeader(header.key, header.value);
            });
          }
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr = XHR.fire('beforeSend', {
            xhr: xhr,
            settings: settings
          }).xhr;
          xhr.send(settings.data);
          if (!settings.async) {
            return ready();
          }
          setTimeout(ready, 10);
        }
      }
    };
    Tools.extend(XHR, Observable);

    var extend$7 = Tools.extend;
    var JSONRequest = function (settings) {
      this.settings = extend$7({}, settings);
      this.count = 0;
    };
    JSONRequest.sendRPC = function (o) {
      return new JSONRequest().send(o);
    };
    JSONRequest.prototype = {
      send: function (args) {
        var ecb = args.error, scb = args.success;
        args = extend$7(this.settings, args);
        args.success = function (c, x) {
          c = JSON$1.parse(c);
          if (typeof c === 'undefined') {
            c = { error: 'JSON Parse error.' };
          }
          if (c.error) {
            ecb.call(args.error_scope || args.scope, c.error, x);
          } else {
            scb.call(args.success_scope || args.scope, c.result);
          }
        };
        args.error = function (ty, x) {
          if (ecb) {
            ecb.call(args.error_scope || args.scope, ty, x);
          }
        };
        args.data = JSON$1.serialize({
          id: args.id || 'c' + this.count++,
          method: args.method,
          params: args.params
        });
        args.content_type = 'application/json';
        XHR.send(args);
      }
    };

    var create$4 = function () {
      return function () {
        var data = {};
        var keys = [];
        var storage = {
          getItem: function (key) {
            var item = data[key];
            return item ? item : null;
          },
          setItem: function (key, value) {
            keys.push(key);
            data[key] = String(value);
          },
          key: function (index) {
            return keys[index];
          },
          removeItem: function (key) {
            keys = keys.filter(function (k) {
              return k === key;
            });
            delete data[key];
          },
          clear: function () {
            keys = [];
            data = {};
          },
          length: 0
        };
        Object.defineProperty(storage, 'length', {
          get: function () {
            return keys.length;
          },
          configurable: false,
          enumerable: false
        });
        return storage;
      }();
    };

    var localStorage$$1;
    try {
      localStorage$$1 = window.localStorage;
    } catch (e) {
      localStorage$$1 = create$4();
    }
    var LocalStorage = localStorage$$1;

    var tinymce = EditorManager$1;
    var publicApi = {
      geom: { Rect: Rect },
      util: {
        Promise: promiseObj,
        Delay: Delay,
        Tools: Tools,
        VK: VK,
        URI: URI,
        Class: Class,
        EventDispatcher: Dispatcher,
        Observable: Observable,
        I18n: I18n,
        XHR: XHR,
        JSON: JSON$1,
        JSONRequest: JSONRequest,
        JSONP: JSONP,
        LocalStorage: LocalStorage,
        Color: Color
      },
      dom: {
        EventUtils: EventUtils,
        Sizzle: Sizzle,
        DomQuery: DomQuery,
        TreeWalker: TreeWalker,
        DOMUtils: DOMUtils$1,
        ScriptLoader: ScriptLoader,
        RangeUtils: RangeUtils$1,
        Serializer: Serializer$1,
        ControlSelection: ControlSelection,
        BookmarkManager: BookmarkManager$1,
        Selection: Selection,
        Event: EventUtils.Event
      },
      html: {
        Styles: Styles,
        Entities: Entities,
        Node: Node$2,
        Schema: Schema,
        SaxParser: SaxParser$1,
        DomParser: DomParser,
        Writer: Writer,
        Serializer: Serializer
      },
      ui: { Factory: Factory },
      Env: Env,
      AddOnManager: AddOnManager,
      Annotator: Annotator,
      Formatter: Formatter,
      UndoManager: UndoManager,
      EditorCommands: EditorCommands,
      WindowManager: WindowManager,
      NotificationManager: NotificationManager,
      EditorObservable: EditorObservable$1,
      Shortcuts: Shortcuts,
      Editor: Editor,
      FocusManager: FocusManager,
      EditorManager: EditorManager$1,
      DOM: DOMUtils$1.DOM,
      ScriptLoader: ScriptLoader.ScriptLoader,
      PluginManager: AddOnManager.PluginManager,
      ThemeManager: AddOnManager.ThemeManager,
      trim: Tools.trim,
      isArray: Tools.isArray,
      is: Tools.is,
      toArray: Tools.toArray,
      makeMap: Tools.makeMap,
      each: Tools.each,
      map: Tools.map,
      grep: Tools.grep,
      inArray: Tools.inArray,
      extend: Tools.extend,
      create: Tools.create,
      walk: Tools.walk,
      createNS: Tools.createNS,
      resolve: Tools.resolve,
      explode: Tools.explode,
      _addCacheSuffix: Tools._addCacheSuffix,
      isOpera: Env.opera,
      isWebKit: Env.webkit,
      isIE: Env.ie,
      isGecko: Env.gecko,
      isMac: Env.mac
    };
    tinymce = Tools.extend(tinymce, publicApi);
    var Tinymce = tinymce;

    var exportToModuleLoaders = function (tinymce) {
      if (typeof module === 'object') {
        try {
          module.exports = tinymce;
        } catch (_) {
        }
      }
    };
    var exportToWindowGlobal = function (tinymce) {
      window.tinymce = tinymce;
      window.tinyMCE = tinymce;
    };
    exportToWindowGlobal(Tinymce);
    exportToModuleLoaders(Tinymce);

}());
})();
