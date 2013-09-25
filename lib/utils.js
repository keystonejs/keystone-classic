// Some utils borrowed from / inspired by mongoose/utils.js (thanks!)

var _ = require('underscore'),
	inflect = require('i')();


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
 * Determines if `arg` looks like a valid mongo ObjectId
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isValidObjectId = exports.isValidObjectId = function(arg) {
	var len = arg.length;
	if (len == 12 || len == 24) {
		return /^[0-9a-fA-F]+$/.test(arg);
	} else {
		return false;
	}
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
	return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.['a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(str);
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
 * @param {String} property to map
 * @param {Boolean} clone the options?
 * @return {Object} the map object
 * @api public
 */

var optionsMap = exports.optionsMap = function(arr, property, clone) {
	if (arguments.length == 2 && 'boolean' == typeof property) {
		clone = property;
		property = undefined;
	}
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		var prop = (property) ? arr[i][property] : arr[i];
		if (clone) {
			prop = _.clone(prop);
		}
		obj[arr[i].value] = prop;
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
 * Converts a string to a number, accepting human-friendly input, e.g.
 * - 1,432
 * - $1432
 * - 2.5
 *
 * @param {String} input
 * @return {Number} number
 * @api public
 */

var number = exports.number = function(str) {
	return parseFloat(String(str).replace(/[^\-0-9\.]/g, ''));
}


/**
 * Escapes a string to be safely converted to a regular expression
 *
 * @param {String} string
 * @return {String} escaped string
 * @api public
 */

var escapeRegExp = exports.escapeRegExp = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
	sep = sep || '-';
	var esc = escapeRegExp(sep);
	return str.replace(/['"()\.]/g, '').replace(/[^a-z0-9_\-]+/gi, sep).replace(new RegExp(esc + '+', 'g'), sep).replace(new RegExp('^' + esc + '+|' + esc + '+$'), '').toLowerCase();
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
 * @return {String} Title Case form of str
 * @api public
 */

var titlecase = exports.titlecase = function(str) {
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	var parts = str.split(/\s|_|\-/);
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
			parts[i] = upcase(parts[i]);
		}
	}
	return _.compact(parts).join(' ');
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
	return (str) ? String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : '';
}


/**
 * Converts a key to a label.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToLabel = exports.keyToLabel = function(str) {
	
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	str = str.replace(/([0-9])([a-zA-Z])/g, '$1 $2');
	str = str.replace(/([a-zA-Z])([0-9])/g, '$1 $2');
	var parts = str.split(/\s|\.|_|-|:|;|\b/);
	
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
			parts[i] = upcase(parts[i]);
		}
	}
	
	return _.compact(parts).join(' ');
	
}


/**
 * Converts a key to a path. Like slug(keyToLabel(str)) but
 * optionally converts the last word to a plural.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToPath = exports.keyToPath = function(str, plural) {
	parts = slug(keyToLabel(str)).split('-');
	if (parts.length && plural) {
		parts[parts.length-1] = inflect.pluralize(parts[parts.length-1])
	}
	return parts.join('-');
}


/**
 * Converts a key to a property. Like keyToPath but converts
 * to headlessCamelCase instead of dash-separated
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToProperty = exports.keyToProperty = function(str, plural) {
	parts = slug(keyToLabel(str)).split('-');
	if (parts.length && plural) {
		parts[parts.length-1] = inflect.pluralize(parts[parts.length-1])
	}
	for (var i = 1; i < parts.length; i++) {
		parts[i] = upcase(parts[i]);
	}
	return parts.join('');
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
		return rtn + (prepend || '') + (titlecase ? upcase(last) : last);
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
