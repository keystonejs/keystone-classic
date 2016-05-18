var _ = require('lodash');
var keystone = require('../../');
var Types = require('../fieldTypes');

/**
 * Soft-delete option
 *
 * When enabled, it tracks when a document is soft-deleted or restored,
 * as well as the user who deleted/restored it.
 * Enabled by default.
 */

module.exports = function softDelete () {
	var list = this;
	var options = (list.get('softDelete') === undefined || list.get('softDelete') === null) ? true : list.get('softDelete');
	var userModel = keystone.get('user model');
	var defaultOptions = {
		deletedBy: true,
		deletedAt: true,
		restoredBy: true,
		restoredAt: true,
	};
	var fields = {};

	// ensure softDelete is a boolean
	if (!_.isBoolean(options)) {
		throw new Error('Invalid List "softDelete" option for ' + list.key + '\n'
			+ '"track" must be a boolean.\n\n');
	}

	else {
		if (options) {
			options = {
				deletedBy: true,
				deletedAt: true,
				restoredBy: true,
				restoredAt: true,
			};
		} else {
			return;
		}
	}

	// merge user options with default options
	options = _.extend({}, defaultOptions, options);

	// validate option fields
	_.forEach(options, function (value, key) {

		var fieldName;
		if (value) {

			fieldName = value === true ? key : value;
			options[key] = fieldName;
			list.map(key, fieldName);

			switch (key) {
				case 'deletedAt':
				case 'restoredAt':
					fields[fieldName] = { type: Date, hidden: true, index: true };
					break;

				case 'deletedBy':
				case 'restoredBy':
					fields[fieldName] = { type: Types.Relationship, ref: userModel, hidden: true, index: true };
					break;
			}
		}
	});

	// add soft-delete fields to schema
	list.add(fields);

	// add the pre-save schema plugin
	list.schema.pre('save', function (next) {

		if (!this.deletedBy) {
			this.set(options.deletedBy, null);
		}

		if (!this.deletedAt) {
			this.set(options.deletedAt, null);
		}

		if (!this.restoredBy) {
			this.set(options.restoredBy, null);
		}

		if (!this.restoredAt) {
			this.set(options.restoredAt, null);
		}

		next();
	});
};

