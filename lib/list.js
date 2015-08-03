var _ = require('underscore');
var Field = require('../fields/types/Type');
var keystone = require('../');
var moment = require('moment');
var queryfilterlib = require('queryfilter');
var schemaPlugins = require('./schemaPlugins');
var UpdateHandler = require('./updateHandler');
var utils = require('keystone-utils');

/**
 * List Class
 *
 * @param {String} key
 * @param {Object} options
 */

function List(key, options) {
	if (!(this instanceof List)) return new List(key, options);

	var defaultOptions = {
		schema: {
			collection: keystone.prefixModel(key)
		},
		noedit: false,
		nocreate: false,
		nodelete: false,
		autocreate: false,
		sortable: false,
		hidden: false,
		track: false,
		inherits: false,
		searchFields: '__name__',
		defaultSort: '__default__',
		defaultColumns: '__name__'
	};

	// initialFields values are initialised on demand by the getter
	var initialFields;

	// Inherit default options from parent list if it exists
	if (options && options.inherits) {
		if (options.inherits.options && options.inherits.options.inherits) {
			throw new Error('Inherited Lists may not contain any inheritance');
		}
		defaultOptions = utils.options(defaultOptions, options.inherits.options);
	}

	this.options = utils.options(defaultOptions, options);

	// init properties
	this.key = key;
	this.path = this.get('path') || utils.keyToPath(key, true);
	this.schema = new keystone.mongoose.Schema({}, this.options.schema);
	this.schemaFields = [];
	this.uiElements = [];
	this.underscoreMethods = {};
	this.fields = {};
	this.fieldTypes = {};
	this.relationships = {};
	this.mappings = {
		name: null,
		createdBy: null,
		createdOn: null,
		modifiedBy: null,
		modifiedOn: null
	};

	// init mappings
	_.each(this.options.map, function(val, key) { this.map(key, val); }, this);

	// define property getters
	Object.defineProperty(this, 'label', { get: function() {
		return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(key)));
	} });
	Object.defineProperty(this, 'singular', { get: function() {
		return this.get('singular') || this.set('singular', utils.singular(this.label));
	} });
	Object.defineProperty(this, 'plural', { get: function() {
		return this.get('plural') || this.set('plural', utils.plural(this.singular));
	} });
	Object.defineProperty(this, 'namePath', { get: function() {
		return this.mappings.name || '_id';
	} });
	Object.defineProperty(this, 'nameField', { get: function() {
		return this.fields[this.mappings.name];
	} });
	Object.defineProperty(this, 'nameIsVirtual', { get: function() {
		return this.model.schema.virtuals[this.mappings.name] ? true : false;
	} });
	Object.defineProperty(this, 'nameIsEditable', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type === 'text') ? !this.fields[this.mappings.name].noedit : false;
	} });
	Object.defineProperty(this, 'nameIsInitial', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].options.initial === undefined);
	} });
	Object.defineProperty(this, 'initialFields', { get: function() {
		return initialFields || (initialFields = _.filter(this.fields, function(i) { return i.initial; }));
	} });
	if (this.get('sortable')) {
		schemaPlugins.sortable.apply(this);
	}
	if (this.get('autokey')) {
		schemaPlugins.autokey.apply(this);
	}
	if (this.get('track')) {
		schemaPlugins.track.apply(this);
	}
	if (this.get('history')) {
		schemaPlugins.history.apply(this);
	}
	if (this.get('inherits')) {
		var parentFields = this.get('inherits').schemaFields;
		this.add.apply(this, parentFields);
	}
}

// Add prototype methods
List.prototype.getData = require('./list/getData');
List.prototype.getOptions = require('./list/getOptions');
List.prototype.addFiltersToQuery = require('./list/addFiltersToQuery');
List.prototype.isReserved = require('./list/isReserved');
List.prototype.expandColumns = require('./list/expandColumns');
List.prototype.selectColumns = require('./list/selectColumns');

/**
 * Sets list options
 *
 * Example:
 *     list.set('test', value) // sets the 'test' option to `value`
 */
List.prototype.set = function(key, value) {
	if (arguments.length === 1) {
		return this.options[key];
	}
	this.options[key] = value;
	return value;
};


/**
 * Gets list options
 *
 * Example:
 *     list.get('test') // returns the 'test' value
 */
List.prototype.get = List.prototype.set;


/**
 * Maps a built-in field (e.g. name) to a specific path
 */
List.prototype.map = function(field, path) {
	if (path) {
		this.mappings[field] = path;
	}
	return this.mappings[field];
};


/**
 * Checks to see if a field path matches a currently unmapped path, and
 * if so, adds a mapping for it.
 */
List.prototype.automap = function(field) {
	if (_.has(this.mappings, field.path) && !this.mappings[field.path]) {
		this.map(field.path, field.path);
	}
	return this;
};


/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 */
List.prototype.add = function() {
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
};


/**
 * Creates a new field at the specified path, with the provided options.
 * If no options are provides, returns the field at the specified path.
 */
List.prototype.field = function(path, options) {
	if (arguments.length === 1) {
		return this.fields[path];
	}
	if ('function' === typeof options) {
		options = { type: options };
	}
	if (this.get('noedit')) {
		options.noedit = true;
	}
	if (!options.note && this.get('notes')) {
		options.note = this.get('notes')[path];
	}
	if ('function' !== typeof options.type) {
		throw new Error('Fields must be specified with a type function');
	}
	if (options.type.prototype.__proto__ !== Field.prototype) {
		// Convert native field types to their default Keystone counterpart
		if (options.type === String) {
			options.type = Field.Types.Text;
		} else if (options.type === Number) {
			options.type = Field.Types.Number;
		} else if (options.type === Boolean) {
			options.type = Field.Types.Boolean;
		} else if (options.type === Date) {
			options.type = Field.Types.Datetime;
		} else {
			throw new Error('Unrecognised field constructor: ' + options.type);
		}
	}

	// Note the presence of this field type for client-side script optimisation
	this.fieldTypes[options.type.name] = true;

	// Wysiwyg HTML fields are handled as a special case so we can include TinyMCE as required
	if (options.type.name === 'html' && options.wysiwyg) {
		this.fieldTypes.wysiwyg = true;
	}

	var field = new options.type(this, path, options);
	this.fields[path] = field;
	return field;
};


/**
 * Adds a method to the underscoreMethods collection on the list, which is then
 * added to the schema before the list is registered with mongoose.
 */
List.prototype.underscoreMethod = function(path, fn) {
	var target = this.underscoreMethods;
	path = path.split('.');
	var last = path.pop();
	path.forEach(function(part) {
		if (!target[part]) target[part] = {};
		target = target[part];
	});
	target[last] = fn;
	return this;
};


/**
 * Default Sort Field
 */
Object.defineProperty(List.prototype, 'defaultSort', {
	get: function() {
		var ds = this.get('defaultSort');
		return (ds === '__default__') ? (this.get('sortable') ? 'sortOrder' : this.namePath) : ds;
	}, set: function(value) {
		this.set('defaultSort', value);
	}
});


/**
 * Default Column Fields
 */

Object.defineProperty(List.prototype, 'defaultColumns', {
	get: function() {
		if (!this._defaultColumns) {
			this._defaultColumns = this.expandColumns(this.get('defaultColumns'));
		}
		return this._defaultColumns;
	}, set: function(value) {
		this.set('defaultColumns', value);
		delete this._defaultColumns;
	}
});

/**
 * Registers relationships to this list defined on others
 */
List.prototype.relationship = function(def) {
	if (arguments.length > 1) {
		_.map(arguments, function(def) { this.relationship(def); }, this);
		return this;
	}
	if ('string' === typeof def) {
		def = { ref: def };
	}
	if (!def.ref) {
		throw new Error('List Relationships must be specified with an object containing ref (' + this.key + ')');
	}
	if (!def.refPath) {
		def.refPath = utils.downcase(this.key);
	}
	if (!def.path) {
		def.path = utils.keyToProperty(def.ref, true);
	}
	Object.defineProperty(def, 'refList', {
		get: function() {
			return keystone.list(def.ref);
		}
	});
	Object.defineProperty(def, 'isValid', {
		get: function() {
			return keystone.list(def.ref) ? true : false;
		}
	});
	this.relationships[def.path] = def;
	return this;
};


/**
 * Registers the Schema with Mongoose, and the List with Keystone
 *
 * Also adds default fields and virtuals to the schema for the list
 */
List.prototype.register = function() {
	var list = this;
	this.schema.virtual('list').get(function () {
		return list;
	});
	if (!_.isEmpty(this.relationships)) {
		this.schema.methods.getRelated = schemaPlugins.methods.getRelated;
		this.schema.methods.populateRelated = schemaPlugins.methods.populateRelated;
		if (!this.schema.options.toObject) this.schema.options.toObject = {};
		this.schema.options.toObject.transform = schemaPlugins.options.transform;
	}
	this.schema.virtual('_').get(function() {
		if (!this.__methods) {
			this.__methods = utils.bindMethods(list.underscoreMethods, this);
		}
		return this.__methods;
	});
	this.schema.method('getUpdateHandler', function(req, res, ops) {
		return new UpdateHandler(list, this, req, res, ops);
	});
	if (this.get('inherits')) {
		this.model = this.get('inherits').model.discriminator(this.key, this.schema);
	} else {
		this.model = keystone.mongoose.model(this.key, this.schema);
	}
	require('../').list(this);
	return this;
};


/**
 * Gets the name of the provided document from the correct path
 *
 * Example:
 *     var name = list.getDocumentName(item)
 *
 * @param {Object} item
 * @param {Boolean} escape - causes HTML entities to be encoded
 */
List.prototype.getDocumentName = function(doc, escape) {
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	return (escape) ? utils.encodeHTMLEntities(name) : name;
};


/**
 * Processes a filter string into a filters object
 *
 * @param {String} filters
 */
List.prototype.processFilters = function(q) {
	var list = this;
	var filters = {};
	queryfilterlib.QueryFilters.create(q).getFilters().forEach(function(filter){
		filter.path = filter.key; // alias for b/c
		filter.field = list.fields[filter.key];
		filters[filter.path] = filter;
	});
	return filters;
};


/**
 * Gets filters for a Mongoose query that will search for the provided string,
 * based on the searchFields List option.
 *
 * Also accepts a filters object from `processFilters()`, any of which may
 * override the search string.
 *
 * Example:
 *     list.getSearchFilters('jed') // returns { name: /jed/i }
 *
 * @param {String} query
 * @param {Object} additional filters
 */
List.prototype.getSearchFilters = function(search, add) {
	var filters = {};
	var list = this;

	search = String(search || '').trim();

	if (search.length) {
		var searchFilter,
			searchParts = search.split(' '),
			searchRx = new RegExp(utils.escapeRegExp(search), 'i'),
			splitSearchRx = new RegExp((searchParts.length > 1) ? _.map(searchParts, utils.escapeRegExp).join('|') : search, 'i'),
			searchFields = this.get('searchFields'),
			searchFilters = [],
			searchIdField = utils.isValidObjectId(search);

		if ('string' === typeof searchFields) {
			searchFields = searchFields.split(',');
		}

		searchFields.forEach(function(path) {
			path = path.trim();

			if (path === '__name__') {
				path = list.mappings.name;
			}

			var field = list.fields[path];

			if (field && field.type === 'name') {
				var first = {};
				first[field.paths.first] = splitSearchRx;
				var last = {};
				last[field.paths.last] = splitSearchRx;
				searchFilter = {};
				searchFilter.$or = [first, last];
				searchFilters.push(searchFilter);
			} else {
				searchFilter = {};
				searchFilter[path] = searchRx;
				searchFilters.push(searchFilter);
			}
		});

		if (list.autokey) {
			searchFilter = {};
			searchFilter[list.autokey.path] = searchRx;
			searchFilters.push(searchFilter);
		}

		if (searchIdField) {
			searchFilter = {};
			searchFilter._id = search;
			searchFilters.push(searchFilter);
		}

		if (searchFilters.length > 1) {
			filters.$or = searchFilters;
		} else if (searchFilters.length) {
			filters = searchFilters[0];
		}

	}

	if (add) {
		_.each(add, function(filter) {
			var cond, path = filter.key, value = filter.value;

			switch (filter.field.type) {
				case 'boolean':
					if (!value || value === 'false') {
						filters[path] = { $ne: true };
					} else {
						filters[path] = true;
					}
					break;

				case 'localfile':
				case 'cloudinaryimage':
				case 'cloudinaryimages':
				case 's3file':
				case 'name':
				case 'password':
					// TODO
					break;

				case 'location':
					_.each(['street1', 'suburb', 'state', 'postcode', 'country'], function(pathKey, i) {
						var value = filter.value[i];
						if (value) {
							filters[filter.field.paths[pathKey]] = new RegExp(utils.escapeRegExp(value), 'i');
						}
					});
					break;

				case 'relationship':
					if (value) {
						if (filter.field.many) {
							filters[path] = (filter.inverse) ? { $nin: [value] } : { $in: [value] };
						} else {
							filters[path] = (filter.inverse) ? { $ne: value } : value;
						}
					} else {
						if (filter.field.many) {
							filters[path] = (filter.inverse) ? { $not: { $size: 0 } } : { $size: 0 };
						} else {
							filters[path] = (filter.inverse) ? { $ne: null } : null;
						}
					}
					break;

				case 'select':
					if (filter.value) {
						filters[path] = (filter.inverse) ? { $ne: value } : value;
					} else {
						filters[path] = (filter.inverse) ? { $nin: ['', null] } : { $in: ['', null] };
					}
					break;

				case 'number':
				case 'money':
					if (filter.operator === 'bt') {
						value = [
							utils.number(value[0]),
							utils.number(value[1])
						];
						if ( !isNaN(value[0]) && !isNaN(value[1]) ) {
							filters[path] = {
								$gte: value[0],
								$lte: value[1]
							};
						}
						else {
							filters[path] = null;
						}
					} else {
						value = utils.number(value);
						if ( !isNaN(value) ) {
							if (filter.operator === 'gt') {
								filters[path] = { $gt: value };
							}
							else if (filter.operator === 'lt') {
								filters[path] = { $lt: value };
							}
							else {
								filters[path] = value;
							}
						}
						else {
							filters[path] = null;
						}
					}
				break;

				case 'date':
				case 'datetime':
					if (filter.operator === 'bt') {
						value = [
							moment(value[0]),
							moment(value[1])
						];
						if ( (value[0] && value[0].isValid()) && (value[1] && value[0].isValid()) ) {
							filters[path] = {
								$gte: moment(value[0]).startOf('day').toDate(),
								$lte: moment(value[1]).endOf('day').toDate()
							};
						}
					} else {
						value = moment(value);
						if (value && value.isValid()) {
							var start = moment(value).startOf('day').toDate();
							var end = moment(value).endOf('day').toDate();
							if (filter.operator === 'gt') {
								filters[path] = { $gt: end };
							} else if (filter.operator === 'lt') {
								filters[path] = { $lt: start };
							} else {
								filters[path] = { $lte: end, $gte: start };
							}
						}
					}
					break;

				case 'text':
				case 'textarea':
				case 'html':
				case 'email':
				case 'url':
				case 'key':
					if (filter.exact) {
						if (value) {
							cond = new RegExp('^' + utils.escapeRegExp(value) + '$', 'i');
							filters[path] = filter.inverse ? { $not: cond } : cond;
						} else {
							if (filter.inverse) {
								filters[path] = { $nin: ['', null] };
							} else {
								filters[path] = { $in: ['', null] };
							}
						}
					} else if (value) {
						cond = new RegExp(utils.escapeRegExp(value), 'i');
						filters[path] = filter.inverse ? { $not: cond } : cond;
					}
					break;

			}
		});
	}
	return filters;
};


List.prototype.updateAll = require('./list/updateAll');
List.prototype.getUniqueValue = require('./list/getUniqueValue');
List.prototype.getPages = require('./list/getPages');
List.prototype.paginate = require('./list/paginate');

/*!
 * Export class
 */
exports = module.exports = List;
