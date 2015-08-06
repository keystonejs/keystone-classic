var _ = require('underscore');
var utils = require('keystone-utils');

/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 */
function add () {
	var add = function(obj, prefix) {
		prefix = prefix || '';
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (!obj[key]) {
				throw new Error(
					'Invalid value for schema path `' + prefix + key + '` in `' + this.key + '`.\n' +
					'Did you misspell the field type?\n'
				);
			}
			if (utils.isObject(obj[key]) && (!obj[key].constructor || 'Object' === obj[key].constructor.name) && (!obj[key].type || obj[key].type.type)) {
				if (Object.keys(obj[key]).length) {
					// nested object, e.g. { last: { name: String }}
					// matches logic in mongoose/Schema:add
					this.schema.nested[this.path] = true;
					add(obj[key], prefix + key + '.');
				} else {
					addField(prefix + key, obj[key]); // mixed type field
				}
			} else {
				addField(prefix + key, obj[key]);
			}
		}
	}.bind(this);

	var addField = function(path, options) {
		if (this.isReserved(path)) {
			throw new Error('Path ' + path + ' on list ' + this.key + ' is a reserved path');
		}
		this.uiElements.push({
			type: 'field',
			field: this.field(path, options)
		});
	}.bind(this);

	_.each(arguments, function(def) {
		this.schemaFields.push(def);
		if ('string' === typeof def) {
			if (def === '>>>') {
				this.uiElements.push({
					type: 'indent'
				});
			} else if (def === '<<<') {
				this.uiElements.push({
					type: 'outdent'
				});
			} else {
				this.uiElements.push({
					type: 'heading',
					heading: def,
					options: {}
				});
			}
		} else {
			if (def.heading && 'string' === typeof def.heading) {
				this.uiElements.push({
					type: 'heading',
					heading: def.heading,
					options: def
				});
			} else {
				add(def);
			}
		}
	}, this);

	return this;
}

module.exports = add;
