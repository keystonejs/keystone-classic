
/*!
 * move
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

;(function(exports){

  /**
   * Computed style.
   */

  var current = window.getComputedStyle || window.currentStyle;

  /**
   * Map of prop -> type for numeric values.
   */

  var map = {
      'top': 'px'
    , 'bottom': 'px'
    , 'left': 'px'
    , 'right': 'px'
    , 'width': 'px'
    , 'height': 'px'
    , 'font-size': 'px'
    , 'margin': 'px'
    , 'margin-top': 'px'
    , 'margin-bottom': 'px'
    , 'margin-left': 'px'
    , 'margin-right': 'px'
    , 'padding': 'px'
    , 'padding-top': 'px'
    , 'padding-bottom': 'px'
    , 'padding-left': 'px'
    , 'padding-right': 'px'
  };

  /**
   * Initialize a `Move` instance with the given `selector`.
   *
   * @param {String} selector
   * @return {Move}
   * @api public
   */

  exports.move = function(selector) {
    return new Move(move.select(selector));
  };

  /**
   * Library version.
   */

  exports.move.version = '0.0.3';

  /**
   * Defaults.
   * 
   *   `duration` - default duration of 500ms
   * 
   */

  move.defaults = {
    duration: 500
  };

  /**
   * Easing functions.
   */

  move.ease = {
      'in':                'ease-in'
    , 'out':               'ease-out'
    , 'in-out':            'ease-in-out'
    , 'snap':              'cubic-bezier(0,1,.5,1)'
    , 'linear':            'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
    , 'ease-in-quad':      'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
    , 'ease-in-cubic':     'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
    , 'ease-in-quart':     'cubic-bezier(0.895, 0.030, 0.685, 0.220)'
    , 'ease-in-quint':     'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
    , 'ease-in-sine':      'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
    , 'ease-in-expo':      'cubic-bezier(0.950, 0.050, 0.795, 0.035)'
    , 'ease-in-circ':      'cubic-bezier(0.600, 0.040, 0.980, 0.335)'
    , 'ease-in-back':      'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
    , 'ease-out-quad':     'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
    , 'ease-out-cubic':    'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    , 'ease-out-quart':    'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
    , 'ease-out-quint':    'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
    , 'ease-out-sine':     'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
    , 'ease-out-expo':     'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
    , 'ease-out-circ':     'cubic-bezier(0.075, 0.820, 0.165, 1.000)'
    , 'ease-out-back':     'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
    , 'ease-out-quad':     'cubic-bezier(0.455, 0.030, 0.515, 0.955)'
    , 'ease-out-cubic':    'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
    , 'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
    , 'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
    , 'ease-in-out-sine':  'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    , 'ease-in-out-expo':  'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
    , 'ease-in-out-circ':  'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
    , 'ease-in-out-back':  'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
  };

  /**
   * Default element selection utilized by `move(selector)`.
   *
   * Override to implement your own selection, for example
   * with jQuery one might write:
   *
   *     move.select = function(selector) {
   *       return jQuery(selector).get(0);
   *     };
   *
   * @param {Object|String} selector
   * @return {Element}
   * @api public
   */

  move.select = function(selector){
    if ('string' != typeof selector) return selector;
    return document.getElementById(selector)
      || document.querySelectorAll(selector)[0];
  };

  /**
   * EventEmitter.
   */

  function EventEmitter() {
    this.callbacks = {};
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  EventEmitter.prototype.on = function(event, fn){
    (this.callbacks[event] = this.callbacks[event] || [])
      .push(fn);
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   */

  EventEmitter.prototype.emit = function(event){
    var args = Array.prototype.slice.call(arguments, 1)
      , callbacks = this.callbacks[event]
      , len;

    if (callbacks) {
      len = callbacks.length;
      for (var i = 0; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }

    return this;
  };

  /**
   * Initialize a new `Move` with the given `el`.
   *
   * @param {Element} el
   * @api public
   */

  exports.Move = function Move(el) {
    if (!(this instanceof Move)) return new Move(el);
    EventEmitter.call(this);
    this.el = el;
    this._props = {};
    this._rotate = 0;
    this._transitionProps = [];
    this._transforms = [];
    this.duration(move.defaults.duration)
  };

  /**
   * Inherit from `EventEmitter.prototype`.
   */

  Move.prototype = new EventEmitter;
  Move.prototype.constructor = Move;

  /**
   * Buffer `transform`.
   *
   * @param {String} transform
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transform = function(transform){
    this._transforms.push(transform);
    return this;
  };

  /**
   * Skew `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skew = function(x, y){
    y = y || 0;
    return this.transform('skew('
      + x + 'deg, '
      + y + 'deg)');
  };

  /**
   * Skew x by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewX = function(n){
    return this.transform('skewX(' + n + 'deg)');
  };

  /**
   * Skew y by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.skewY = function(n){
    return this.transform('skewY(' + n + 'deg)');
  };

  /**
   * Translate `x` and `y` axis.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translate = 
  Move.prototype.to = function(x, y){
    y = y || 0;
    return this.transform('translate('
      + x + 'px, '
      + y + 'px)');
  };

  /**
   * Translate on the x axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateX =
  Move.prototype.x = function(n){
    return this.transform('translateX(' + n + 'px)');
  };

  /**
   * Translate on the y axis to `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.translateY =
  Move.prototype.y = function(n){
    return this.transform('translateY(' + n + 'px)');
  };

  /**
   * Scale the x and y axis by `x`, or 
   * individually scale `x` and `y`.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scale = function(x, y){
    y = null == y ? x : y;
    return this.transform('scale('
      + x + ', '
      + y + ')');
  };

  /**
   * Scale x axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleX = function(n){
    return this.transform('scaleX(' + n + ')')
  };

  /**
   * Scale y axis by `n`.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.scaleY = function(n){
    return this.transform('scaleY(' + n + ')')
  };

  /**
   * Rotate `n` degrees.
   *
   * @param {Number} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.rotate = function(n){
    return this.transform('rotate(' + n + 'deg)');
  };

  /**
   * Set transition easing function to to `fn` string.
   *
   * When:
   *
   *   - null "ease" is used
   *   - "in" "ease-in" is used
   *   - "out" "ease-out" is used
   *   - "in-out" "ease-in-out" is used
   *
   * @param {String} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.ease = function(fn){
    fn = move.ease[fn] || fn || 'ease';
    return this.setVendorProperty('transition-timing-function', fn);
  };

  /**
   * Set animation properties
   *
   * @param {String} name
   * @param {Object} props
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.animate = function(name, props){
    for (var i in props){
      if (props.hasOwnProperty(i)){
        this.setVendorProperty('animation-' + i, props[i])
      }
    }
    return this.setVendorProperty('animation-name', name);
  }

  /**
   * Set duration to `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.duration = function(n){
    n = this._duration = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setVendorProperty('transition-duration', n + 'ms');
  };

  /**
   * Delay the animation by `n`.
   *
   * @param {Number|String} n
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.delay = function(n){
    n = 'string' == typeof n
      ? parseFloat(n) * 1000
      : n;
    return this.setVendorProperty('transition-delay', n + 'ms');
  };

  /**
   * Set `prop` to `val`, deferred until `.end()` is invoked.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.setProperty = function(prop, val){
    this._props[prop] = val;
    return this;
  };

  /**
   * Set a vendor prefixed `prop` with the given `val`.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.setVendorProperty = function(prop, val){
    this.setProperty('-webkit-' + prop, val);
    this.setProperty('-moz-' + prop, val);
    this.setProperty('-ms-' + prop, val);
    this.setProperty('-o-' + prop, val);
    return this;
  };

  /**
   * Set `prop` to `value`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {String} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.set = function(prop, val){
    this.transition(prop);
    if ('number' == typeof val && map[prop]) val += map[prop]; 
    this._props[prop] = val;
    return this;
  };

  /**
   * Increment `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.add = function(prop, val){
    if (!current) return;
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr + val + 'px');
    });
  };

  /**
   * Decrement `prop` by `val`, deferred until `.end()` is invoked
   * and adds the property to the list of transition props.
   *
   * @param {String} prop
   * @param {Number} val
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.sub = function(prop, val){
    if (!current) return;
    var self = this;
    return this.on('start', function(){
      var curr = parseInt(self.current(prop), 10);
      self.set(prop, curr - val + 'px');
    });
  };

  /**
   * Get computed or "current" value of `prop`.
   *
   * @param {String} prop
   * @return {String}
   * @api public
   */

  Move.prototype.current = function(prop){
    return current(this.el).getPropertyValue(prop);
  };

  /**
   * Add `prop` to the list of internal transition properties.
   *
   * @param {String} prop
   * @return {Move} for chaining
   * @api private
   */

  Move.prototype.transition = function(prop){
    if (!this._transitionProps.indexOf(prop)) return this;
    this._transitionProps.push(prop);
    return this;
  };

  /**
   * Commit style properties, aka apply them to `el.style`.
   *
   * @return {Move} for chaining
   * @see Move#end()
   * @api private
   */

  Move.prototype.applyProperties = function(){
    var props = this._props
      , el = this.el;

    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        el.style.setProperty(prop, props[prop], '');
      }
    }

    return this;
  };

  /**
   * Re-select element via `selector`, replacing
   * the current element.
   *
   * @param {String} selector
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.move =
  Move.prototype.select = function(selector){
    this.el = move.select(selector);
    return this;
  };

  /**
   * Defer the given `fn` until the animation
   * is complete. `fn` may be one of the following:
   *
   *   - a function to invoke
   *   - an instanceof `Move` to call `.end()`
   *   - nothing, to return a clone of this `Move` instance for chaining
   *
   * @param {Function|Move} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.then = function(fn){
    // invoke .end()
    if (fn instanceof Move) {
      this.on('end', function(){
        fn.end();
      });
    // callback
    } else if ('function' == typeof fn) {
      this.on('end', fn);
    // chain
    } else {
      var clone = new Move(this.el);
      clone._transforms = this._transforms.slice(0);
      this.then(clone);
      clone.parent = this;
      return clone;
    }

    return this;
  };

  /**
   * Pop the move context.
   *
   * @return {Move} parent Move
   * @api public
   */

  Move.prototype.pop = function(){
    return this.parent;
  };

  /**
   * Start animation, optionally calling `fn` when complete.
   *
   * @param {Function} fn
   * @return {Move} for chaining
   * @api public
   */

  Move.prototype.end = function(fn){
    var self = this;

    // emit "start" event
    this.emit('start');

    // transforms
    if (this._transforms.length) {
      this.setVendorProperty('transform', this._transforms.join(' '));
    }

    // transition properties
    this.setVendorProperty('transition-properties', this._transitionProps.join(', '));
    this.applyProperties();

    // callback given
    if (fn) this.then(fn);

    // emit "end" when complete
    setTimeout(function(){
      self.emit('end');
    }, this._duration);

    return this;
  };

})(this);
