// Some utils borrowed from / inspired by mongoose/utils.js (thanks!)

var inflect = require('i')();


/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} options
 * @return {Object} the merged object
 * @api private
 */

exports.options = function(defaults, options) {
	
	var keys = Object.keys(defaults), i = keys.length, k;

	options = options || {};

	while (i--) {
		k = keys[i];
		if (!(k in options)) {
			options[k] = defaults[k];
		}
	}

	return options;
	
};

/*!
 * toString helper
 */

var toString = Object.prototype.toString;

/**
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 */
exports.isObject = function(arg) {
	return '[object Object]' == toString.call(arg);
}

/**
 * Converts text to HTML (line breaks to <br> etc)
 *
 * @param {String} str
 * @return {String}
 */
exports.textToHTML = function(str) {
	return String(str).replace(/\n/g, '<br>');
}

/**
 * Converts a key to a label
 *
 * @param {String} key
 * @return {String}
 */
exports.keyToLabel = function(key) {
	
	key = key.split('.');
	
	for (var i = 0; i < key.length; i++) {
		key[i] = inflect.underscore(key[i]);
	}
	
	return inflect.titleize(key.join('_'));
	
}

/**
 * Converts a key to a path
 *
 * @param {String} key
 * @return {String}
 */
exports.keyToPath = function(key) {
	return inflect.dasherize(inflect.underscore(inflect.pluralize(key))).toLowerCase();
}

/**
 * Converts a word to the singular form
 *
 * @param {String} str
 * @return {String}
 */
exports.singular = function(str) {
	return inflect.singularize(str);
}

/**
 * Converts a word to the plural form
 *
 * @param {String} str
 * @return {String}
 */
exports.plural = function(str) {
	return inflect.pluralize(str);
}