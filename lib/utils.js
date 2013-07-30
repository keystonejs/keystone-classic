// Some utils borrowed from / inspired by mongoose/utils.js (thanks!)

var inflect = require('i')();


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

var optionsMap = exports.optionsMap = function(arr) {
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i].value] = arr[i].label;
	}
	return obj;
}


/**
 * Converts a string to its singular form
 *
 * @param {String} str
 * @return {String} singular form of str
 * @api public
 */

var toSingular = exports.toSingular = function(str) {
	return inflect.singularize(str);
}


/**
 * Converts a string to its plural form
 *
 * @param {String} str
 * @return {String} plural form of str
 * @api public
 */

var toPlural = exports.toPlural = function(str) {
	return inflect.pluralize(str);
}


/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 *
 * @param {String} count
 * @param {String} singular string
 * @param {String} plural string
 * @return {String} singular or plural, * is replaced with count
 * @api public
 */

var plural = exports.plural = function(count, sn, pl) {
	
	if (!pl)
		pl = toPlural(sn);
	
	if (Array.isArray(count) || 'object' == typeof count && 'Array' == count.constructor.name)
		count = count.length;
	
	return (count == 1 ? sn : pl).replace('*', count);
	
}


/**
 * Converts a string to title case
 *
 * @param {String} str
 * @return {String} title-case form of str
 * @api public
 */

var toTitleCase = exports.toTitleCase = function(str) {
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

var toCamelCase = exports.toCamelCase = function(str, lc) {
	return inflect.camelize(str, lc);
}

/*!
 * toString helper
 */

var toString = Object.prototype.toString;

/**
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */
var isObject = exports.isObject = function(arg) {
	return '[object Object]' == toString.call(arg);
}

/**
 * Converts text to HTML (line breaks to <br> etc)
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
var textToHTML = exports.textToHTML = function(str) {
	return String(str).replace(/\n/g, '<br>');
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
		return toCamelCase(parts.join('_'), titlecase ? true : false);
	}
	
	this.flattenToPlural = function(titlecase) {
		return toCamelCase([].concat(exceptLast).concat(toPlural(last)).join('_'), titlecase ? true : false);
	}
	
	this.flattenToSingular = function(titlecase) {
		return toCamelCase([].concat(exceptLast).concat(toSingular(last)).join('_'), titlecase ? true : false);
	}
	
	return this;
	
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
exports.isEmail = function(str) {
	return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(str);
}