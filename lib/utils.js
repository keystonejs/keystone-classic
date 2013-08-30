// Some utils borrowed from / inspired by mongoose/utils.js (thanks!)

var inflect = require('i')();


/**
 * Determines if `arg` is a function.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isFunction = exports.isFunction = function(arg) {
	return ('function' == typeof arg);
}


/**
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isObject = exports.isObject = function(arg) {
	return '[object Object]' == Object.prototype.toString.call(arg);
}


/**
 * Determines if `arg` is an array.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isArray = exports.isArray = function(arg) {
	return Array.isArray(arg);
}


/**
 * Determines if `arg` is a date.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isDate = exports.isDate = function(arg) {
	return '[object Date]' == Object.prototype.toString.call(arg);
}


/**
 * Determines if `arg` is a string.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isString = exports.isString = function(arg) {
	return 'string' == typeof arg;
}


/**
 * Determines if `arg` is a number.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isNumber = exports.isNumber = function(arg) {
	return 'number' == typeof arg;
}


/**
 * Make sure an email address looks valid.
 * May cause false-negatives in extremely rare cases, see
 * http://www.regular-expressions.info/email.html
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var isEmail = exports.isEmail = function(str) {
	return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.['a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(str);
} // ' // syntax hilighter fix


/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} options
 * @return {Object} the options argument merged with defaults
 * @api public
 */

var options = exports.options = function(defaults, options) {
	
	options = options || {};
	
	if (!defaults)
		return options;
	
	var keys = Object.keys(defaults), i = keys.length, k;

	while (i--) {
		k = keys[i];
		if (!(k in options)) {
			options[k] = defaults[k];
		}
	}

	return options;
	
}


/**
 * Creates a map of options
 *
 * @param {Array} options
 * @return {Object} the map object
 * @api public
 */

var optionsMap = exports.optionsMap = function(arr, property) {
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i].value] = (property) ? arr[i][property] : arr[i];
	}
	return obj;
}


/**
 * Recursively binds method properties of an object to a scope
 * and returns a new object containing the bound methods
 *
 * @param {Object} object with method properties, can be nested in other objects
 * @param {Object} scope to bind as `this`
 * @return {Object} a new object containing the bound methods
 * @api public
 */

var bindMethods = exports.bindMethods = function(obj, scope) {
			
	var bound = {};
	
	for (var prop in obj) {
		if ('function' == typeof obj[prop]) {
			bound[prop] = obj[prop].bind(scope);
		} else if (isObject(obj[prop])) {
			bound[prop] = bindMethods(obj[prop], scope);
		}
	}
	
	return bound;
	
}


/**
 * Generates a slug from a string. Word breaks are hyphenated.
 * 
 * You can optionally provide a custom separator.
 *
 * @param {String} str
 * @param {String} sep (defaults to '-')
 * @return {String} slug
 * @api public
 */

var slug = exports.slug = function(str, sep) {
	return str.replace(/['"()\.]/g, '').replace(/[^a-z0-9_\-]+/gi, sep || '-').replace(/^\-+|\-$/, '').toLowerCase();
}


/**
 * Converts a string to its singular form
 *
 * @param {String} str
 * @return {String} singular form of str
 * @api public
 */

var singular = exports.singular = function(str) {
	return inflect.singularize(str);
}


/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 * 
 * If arity is 1, returns the plural form of the word.
 *
 * @param {String} count
 * @param {String} singular string
 * @param {String} plural string
 * @return {String} singular or plural, * is replaced with count
 * @api public
 */

var plural = exports.plural = function(count, sn, pl) {
	
	if (arguments.length == 1) {
		return inflect.pluralize(count);
	}
	
	if (!pl) {
		pl = inflect.pluralize(sn);
	}
	
	if ('string' == typeof count) {
		count = Number(count);
	} else if ('number' != typeof count) {
		count = _.size(count);
	}
	
	return (count == 1 ? sn : pl).replace('*', count);
	
}


/**
 * Converts the first letter in a string to uppercase
 *
 * @param {String} str
 * @return {String} Str
 * @api public
 */

var upcase = exports.upcase = function(str) {
	return (str.substr(0,1).toUpperCase() + str.substr(1));
}


/**
 * Converts the first letter in a string to lowercase
 *
 * @param {String} Str
 * @return {String} str
 * @api public
 */

var downcase = exports.downcase = function(str) {
	return (str.substr(0,1).toLowerCase() + str.substr(1));
}


/**
 * Converts a string to title case
 *
 * @param {String} str
 * @return {String} title-case form of str
 * @api public
 */

var titlecase = exports.titlecase = function(str) {
	if (/^[A-Z]+$/.test(str)) return str;
	return inflect.titleize(str);
}


/**
 * Converts a string to camel case
 *
 * @param {String} str
 * @param {Boolean} lowercaseFirstWord
 * @return {String} camel-case form of str
 * @api public
 */

var camelcase = exports.camelcase = function(str, lc) {
	return inflect.camelize(str, !(lc));
}


/**
 * Converts text to HTML (line breaks to <br> etc)
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var textToHTML = exports.textToHTML = function(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}


/**
 * Converts a key to a label
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToLabel = exports.keyToLabel = function(key) {
	
	key = key.split('.');
	
	for (var i = 0; i < key.length; i++) {
		// clean underscores at the start and end of the string;
		// they wreak havoc with inflect
		key[i] = key[i].replace(/^_|_$/g, '');
		key[i] = inflect.underscore(key[i]);
	}
	
	return inflect.titleize(key.join('_'));
	
}


/**
 * Converts a key to a path
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToPath = exports.keyToPath = function(key) {
	return inflect.dasherize(inflect.underscore(inflect.pluralize(key))).toLowerCase();
}


/**
 * Converts a key to a property
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToProperty = exports.keyToProperty = function(key) {
	return camelcase(inflect.underscore(inflect.pluralize(key)), true);
}


/**
 * Path Class
 * 
 * @api public
 */

var Path = exports.Path = function(str) {
	
	if (!(this instanceof Path))
		return new Path(options);
	
	this.original = str;
	
	var parts = this.parts = str.split('.');
	var last = this.last = this.parts[this.parts.length-1];
	var exceptLast = [];
	
	for (var i = 0; i < parts.length-1; i++) {
		exceptLast.push(parts[i]);
	}
	
	this.exceptLast = exceptLast.join('.');
	
	this.addTo = function(obj, val) {
		var o = obj;
		for (var i = 0; i < parts.length - 1; i++) {
			if (!isObject(o[parts[i]]))
				o[parts[i]] = {};
			o = o[parts[i]];
		}
		o[last] = val;
		return obj;
	}
	
	this.get = function(obj) {
		var o = obj;
		for (var i = 0; i < parts.length; i++) {
			o = o[parts[i]];
		}
		return o;
	}
	
	this.prependToLast = function(prepend, titlecase) {
		var rtn = '';
		for (var i = 0; i < parts.length - 1; i++) {
			rtn += parts[i] + '.';
		}
		return rtn + (prepend || '') + (titlecase ? last.substr(0,1).toUpperCase() + last.substr(1) : last);
	}
	
	this.append = function(append) {
		return str + append;
	}
	
	this.flatten = function(titlecase) {
		return camelcase(parts.join('_'), titlecase ? true : false);
	}
	
	this.flattenplural = function(titlecase) {
		return camelcase([].concat(exceptLast).concat(plural(last)).join('_'), titlecase ? true : false);
	}
	
	this.flattensingular = function(titlecase) {
		return camelcase([].concat(exceptLast).concat(singular(last)).join('_'), titlecase ? true : false);
	}
	
	return this;
	
}
