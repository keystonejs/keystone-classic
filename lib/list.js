var _ = require('underscore');
var async = require('async');
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
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
 */
List.prototype.isReserved = function(path) {
	return List.reservedPaths.indexOf(path) >= 0;
};

List.reservedPaths = [
	'id',
	'_id',
	'_',
	'prototype',
	'__proto__',
	'hasOwnProperty',
	'toString',
	'__defineGetter__',
	'__defineSetter__',
	'__lookupGetter__',
	'__lookupSetter__',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'toLocaleString',
	'valueOf'
];


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
 * Expands a comma-separated string or array of columns into valid column objects.
 *
 * Columns can be:
 *    - A Field, in the format "field|width"
 *    - A Field in a single related List, in the format "list:field|width"
 *    - Any valid path in the Schema, in the format "path|width"
 *
 * The width part is optional, and can be in the format "n%" or "npx".
 *
 * The path __name__ is automatically mapped to the namePath of the List.
 *
 * The field or path for the name of the item (defaults to ID if not set or detected)
 * is automatically prepended if not explicitly included.
 */
List.prototype.expandColumns = function(cols) {
	if (typeof cols === 'string') {
		cols = cols.split(',');
	}
	if (!Array.isArray(cols)) {
		throw new Error('List.expandColumns: cols must be an array.');
	}
	var list = this;
	var expanded = [];
	var nameCol = false;
	var getCol = function(def) {
		if (def.path === '__name__') {
			def.path = list.namePath;
		}
		var field = list.fields[def.path];
		var col = null;
		if (field) {
			col = {
				field: field,
				path: field.path,
				type: field.type,
				label: def.label || field.label
			};
			if (col.type === 'relationship') {
				col.refList = col.field.refList;
				if (col.refList) {
					col.refPath = def.subpath || col.refList.namePath;
					col.subField = col.refList.fields[col.refPath];
					col.populate = { path: col.field.path, subpath: col.refPath };
				}
				if (!def.label && def.subpath) {
					col.label = field.label + ': ' + (col.subField ? col.subField.label : utils.keyToLabel(def.subpath));
				}
			}
		} else if (list.model.schema.paths[def.path] || list.model.schema.virtuals[def.path]) {
			// column refers to a path in the schema
			// TODO: this needs to handle sophisticated types, including arrays, nested Schemas, and mixed types
			col = {
				path: def.path,
				label: def.label || utils.keyToLabel(def.path)
			};
		}
		if (col) {
			col.width = def.width;
			if (col.path === list.namePath) {
				col.isName = true;
				nameCol = col;
			}
			if (field && field.col) {
				_.extend(col, field.col);
			}
		}
		return col;
	};
	for (var i = 0; i < cols.length; i++) {
		var def = {};
		if (typeof cols[i] === 'string') {
			var parts = cols[i].trim().split('|');
			def.width = parts[1] || false;
			parts = parts[0].split(':');
			def.path = parts[0];
			def.subpath = parts[1];
		}
		if (!utils.isObject(def) || !def.path) {
			throw new Error('List.expandColumns: column definition must contain a path.');
		}
		var col = getCol(def);
		if (col) {
			expanded.push(col);
		}
	}
	if (!nameCol) {
		nameCol = getCol({ path: list.namePath });
		if (nameCol) {
			expanded.unshift(nameCol);
		}
	}
	return expanded;
};


/**
 * Specified select and populate options for a query based the provided columns.
 *
 * @param {Query} query
 * @param {Array} columns
 */
List.prototype.selectColumns = function(q, cols) {
	// Populate relationship columns
	var select = [];
	var populate = {};
	var path;
	cols.forEach(function(col) {
		select.push(col.path);
		if (col.populate) {
			if (!populate[col.populate.path]) {
				populate[col.populate.path] = [];
			}
			populate[col.populate.path].push(col.populate.subpath);
		}
	});
	q.select(select.join(' '));
	for (path in populate) {
		if ( populate.hasOwnProperty(path) ) {
			q.populate(path, populate[path].join(' '));
		}
	}
};


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


/**
 * Updates every document in a List,
 * setting the provided data on each.
 *
 * @param {Object} data
 * @param {Function} callback (optional)
 */
List.prototype.updateAll = function(data, callback) {
	if ('function' === typeof data) {
		callback = data;
		data = null;
	}
	callback = callback || function() {};
	this.model.find(function(err, results) {
		if (err) return callback(err);
		async.eachSeries(results, function(doc, next) {
			if (data) {
				doc.set(data);
			}
			doc.save(next);
		}, function(err) {
			callback(err);
		});
	});
};


List.prototype.getUniqueValue = require('./list/getUniqueValue');
List.prototype.getPages = require('./list/getPages');
List.prototype.paginate = require('./list/paginate');

/*!
 * Export class
 */
exports = module.exports = List;
