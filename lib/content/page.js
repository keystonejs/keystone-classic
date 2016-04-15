var _ = require('lodash');
var assign = require('object-assign');
var keystone = require('../../');
var utils = keystone.utils;
var Type = require('./type');

/**
 * Page Class
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */

function Page (key, options) {

	if (!(this instanceof Page)) {
		return new Page(key, options);
	}

	this.options = assign({}, options);
	this.key = key;
	this.fields = {};

}

Object.defineProperty(Page.prototype, 'name', {
	get: function () {
		return this.get('name') || this.set('name', utils.keyToLabel(this.key));
	},
});

/**
 * Sets page option
 *
 * ####Example:
 *
 *     page.set('test', value) // sets the 'test' option to `value`
 *
 * @param {String} key
 * @param {String} value
 * @return value
 * @api public
 */

Page.prototype.set = function (key, value) {

	if (!key) {
		throw new Error('keystone.content.Page.set() Error: must be provided with a key to set a value.');
	}

	value = value || null;
	this.options[key] = value;
	return value;

};


/**
 * Gets page option
 *
 * ####Example:
 *
 *     page.get('test') // returns the value of 'test' key
 *
 * @param {String} key
 * @return any
 * @method get
 * @api public
 */

Page.prototype.get = function (key) {
	if (!key) {
		throw new Error('keystone.content.Paget.get() Error: must be provided with a key to get a value.');
	}

	if (!this.options.hasOwnProperty(key)) {
		return null;
	}

	return this.options[key];
};

/**
 * Adds one or more fields to the page
 *
 * @api public
 */

Page.prototype.add = function (fields) {

	// TODO: nested paths
	if (!utils.isObject(fields)) {
		throw new Error('keystone.content.Page.add() Error: fields must be an object.');
	}

	var self = this;

	_.forEach(fields, function (options, path) {

		if (typeof options === 'function') {
			options = { type: options };
		}

		if (typeof options.type !== 'function') {
			throw new Error('keystone.content.page.add() Error: Page fields must be specified with a type function');
		}

		if (options.type.prototype.__proto__ !== Type.prototype) { // eslint-disable-line no-proto

			// Convert native field types to their default Keystone counterpart

			if (options.type === String) {
				options.type = keystone.content.Types.Text;
			}

			// TODO: More types
			// else if (options.type == Number)
			// 	options.type = Field.Types.Number;
			// else if (options.type == Boolean)
			// 	options.type = Field.Types.Boolean;
			// else if (options.type == Date)
			// 	options.type = Field.Types.Datetime;

			else {
				throw new Error('keystone.content.page.add() Error: Unrecognised field constructor: ' + options.type);
			}

		}

		self.fields[path] = new options.type(path, options);

	});

	return this;

};

/**
 * Registers the page with Keystone.
 *
 * ####Example:
 *
 * 		var homePage = new keystone.content.Page('home');
 * 		// ...
 * 		homePage.register();
 *
 * 		// later...
 * 		var homePage = keystone.content.page('home');
 *
 * @api public
 */

Page.prototype.register = function () {
	return keystone.content.page(this.key, this);
};

/**
 * Populates a data structure based on defined fields
 *
 * @api public
 */

Page.prototype.populate = function (data) {

	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: implement schema

	return data;

};

/**
 * Validates a data structure based on defined fields
 *
 * @api public
 */

Page.prototype.validate = function (data) {

	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: implement schema

	return data;

};

/**
 * Cleans a data structure so only the defined fields are present
 *
 * @api public
 */

Page.prototype.clean = function (data) {

	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: implement schema

	return data;

};


/*!
 * Export class
 */

module.exports = Page;
