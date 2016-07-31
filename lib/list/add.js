var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 */
function add () {
	var add = (obj, prefix) => {
		prefix = prefix || '';
		for (var key in obj) {
			if (!obj[key]) {
				throw new Error(
					'Invalid value for schema path `' + prefix + key + '` in `' + this.key + '`.\n'
					+ 'Did you misspell the field type?\n'
				);
			}
			if (utils.isObject(obj[key])
				&& (!obj[key].constructor || obj[key].constructor.name === 'Object')
				&& (!obj[key].type || obj[key].type.type)
			) {
				if (Object.keys(obj[key]).length) {
					// nested object, e.g. { last: { name: String }}
					// matches logic in mongoose/Schema:add
					this.schema.nested[prefix + key] = true;
					add(obj[key], prefix + key + '.');
				} else {
					addField(prefix + key, obj[key]); // mixed type field
				}
			} else {
				addField(prefix + key, obj[key]);
			}
		}
	};

	var addField = (path, options) => {
		var idx;
		if (this.isReserved(path)) {
			throw new Error(`Path ${path} on list ${this.key} is a reserved path`);
		}
		idx = _.findIndex(this.uiElements, ['field.path', path]);
		idx = idx !== -1 ? idx : this.uiElements.length;
		this.uiElements[idx] = {
			type: 'field',
			field: this.field(path, options),
		};
	};

	_.forEach([...arguments], (def) => {
		this.schemaFields.push(def);
		if (typeof def === 'string') {
			if (def === '>>>') {
				this.uiElements.push({
					type: 'indent',
				});
			} else if (def === '<<<') {
				this.uiElements.push({
					type: 'outdent',
				});
			} else {
				this.uiElements.push({
					type: 'heading',
					heading: def,
					options: {},
				});
			}
		} else {
			if (def.heading && typeof def.heading === 'string') {
				this.uiElements.push({
					type: 'heading',
					heading: def.heading,
					options: def,
				});
			} else {
				add(def);
			}
		}
	});

	return this;
}

module.exports = add;
