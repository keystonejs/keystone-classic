var _ = require('underscore'),
	async = require('async'),
	moment = require('moment'),
	keystone = require('../'),
	schemaPlugins = require('./schemaPlugins'),
	utils = require('keystone-utils'),
	Field = require('./field'),
	UpdateHandler = require('./updateHandler'),
	queryfilterlib = require('queryfilter');


/**
 * List Class
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */

function List(key, options) {
	if (!(this instanceof List)) return new List(key, options);

	this.options = utils.options({
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
		searchFields: '__name__',
		defaultSort: '__default__',
		defaultColumns: '__name__'
	}, options);

	this.key = key;
	this.path = this.get('path') || utils.keyToPath(key, true);
	this.schema = new keystone.mongoose.Schema({}, this.options.schema);
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

	// set mappings
	_.each(this.options.map, function(val, key) { this.map(key, val); }, this);

	Object.defineProperty(this, 'label', { get: function() {
		return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(key)));
	}});

	Object.defineProperty(this, 'singular', { get: function() {
		return this.get('singular') || this.set('singular', utils.singular(this.label));
	}});

	Object.defineProperty(this, 'plural', { get: function() {
		return this.get('plural') || this.set('plural', utils.plural(this.singular));
	}});

	Object.defineProperty(this, 'namePath', { get: function() {
		return this.mappings.name || '_id';
	}});

	Object.defineProperty(this, 'nameField', { get: function() {
		return this.fields[this.mappings.name];
	}});

	Object.defineProperty(this, 'nameIsVirtual', { get: function() {
		return this.model.schema.virtuals[this.mappings.name] ? true : false;
	}});

	Object.defineProperty(this, 'nameIsEditable', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type === 'text') ? !this.fields[this.mappings.name].noedit : false;
	}});

	Object.defineProperty(this, 'nameIsInitial', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].options.initial === undefined);
	}});

	var initialFields; // initialFields values are initialised once, on demand
	Object.defineProperty(this, 'initialFields', { get: function() {
		return initialFields || (initialFields = _.filter(this.fields, function(i) { return i.initial; }));
	}});

}


/**
 * Sets list options
 *
 * ####Example:
 *
 *     list.set('test', value) // sets the 'test' option to `value`
 *
 * @param {String} key
 * @param {String} value
 * @api public
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
 * ####Example:
 *
 *     list.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

List.prototype.get = List.prototype.set;


/**
 * Maps a built-in field (e.g. name) to a specific path
 *
 * @api public
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
 *
 * @api private
 */

List.prototype.automap = function(field) {
	if (_.has(this.mappings, field.path) && !this.mappings[field.path]) {
		this.map(field.path, field.path);
	}
};


/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 *
 * @api public
 */

List.prototype.add = function() {

	var add = function(obj, prefix) {

		prefix = prefix || '';
		var keys = Object.keys(obj);

		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];

			if (null === obj[key]) {
				throw new Error('Invalid value for schema path `'+ prefix + key +'`');
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
		this.uiElements.push({
			type: 'field',
			field: this.field(path, options)
		});
	}.bind(this);

	_.each(arguments, function(def) {

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
 * Adds preset patterns of fields and behaviours to the Schema
 *
 * @api public
 */

List.prototype.addPattern = function(pattern) {
	var warningMsg = 
		'Use of List.addPattern("standard meta") is now deprecated and will be removed\n' +
		'in future versions of KeystoneJS. It has been replaced with the List "track" option.\n\n' +
		'See http://keystonejs.com/docs/database/#lists-options for more information.';

	switch (pattern) {

		case 'standard meta':
			// enable track options if it's not already enabled
			if (!this.get('track')) {
				this.set('track', true);
			}
			// tell track to simulate standard meta for backwards compatiblity
			this.set('track simulate standard meta', true);
			keystone.console.err('Deprecation Warning', warningMsg);
		break;

	}

	return this;

};


/**
 * Creates a new field at the specified path, with the provided options.
 * If no options are provides, returns the field at the specified path.
 *
 * @api public
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

		if (options.type === String)
			options.type = Field.Types.Text;
		else if (options.type === Number)
			options.type = Field.Types.Number;
		else if (options.type === Boolean)
			options.type = Field.Types.Boolean;
		else if (options.type === Date)
			options.type = Field.Types.Datetime;
		else
			throw new Error('Unrecognised field constructor: ' + options.type);

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
 *
 * @api public
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
 *
 * @api public
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
 *
 * @api private
 */

List.prototype.expandColumns = function(cols) {

	if (typeof cols === 'string') {
		cols = cols.split(',');
	}

	if (!Array.isArray(cols)) {
		throw new Error('List.expandColumns: cols must be an array.');
	}

	var list = this,
		expanded = [],
		nameCol = false;

	var getCol = function(def) {

		if (def.path === '__name__') {
			def.path = list.namePath;
		}

		var field = list.fields[def.path],
			col = null;

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
 * @api private
 */

List.prototype.selectColumns = function(q, cols) {

	// Populate relationship columns

	var select = [],
		populate = {},
		path;

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
 *
 * @api public
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
 *
 * @api public
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
 *
 * @api public
 */

List.prototype.register = function() {

	var list = this;

	this.schema.virtual('list').get(function () {
		return list;
	});

	if (this.get('sortable')) {
		schemaPlugins.sortable.apply(this);
	}

	if (this.get('autokey')) {
		schemaPlugins.autokey.apply(this);
	}

	if (this.get('track')) {
		schemaPlugins.track.apply(this);
	}

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

	this.model = keystone.mongoose.model(this.key, this.schema);

	require('../').list(this);

	return this;
};


/**
 * Gets the name of the provided document from the correct path
 *
 * ####Example:
 *
 *     var name = list.getDocumentName(item)
 *
 * @param {Object} item
 * @param {Boolean} escape - causes HTML entities to be encoded
 * @api public
 */

List.prototype.getDocumentName = function(doc, escape) {
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	return (escape) ? utils.encodeHTMLEntities(name) : name;
};


/**
 * Processes a filter string into a filters object
 *
 * @param {String} filters
 * @api private
 */

List.prototype.processFilters = function(q) {
	var me = this;
	var filters = {};
	queryfilterlib.QueryFilters.create(q).getFilters().forEach(function(filter){
		filter.path = filter.key; // alias for b/c
		filter.field = me.fields[filter.key];
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
 * ####Example:
 *
 *     list.getSearchFilters('jed') // returns { name: /jed/i }
 *
 * @param {String} query
 * @param {Object} additional filters
 * @api public
 */

List.prototype.getSearchFilters = function(search, add) {
	var filters = {},
		list = this;

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
					if (value) {
						filters[path] = true;
					} else {
						filters[path] = { $ne: true };
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
					_.each({address:'street1', suburb:'suburb', state:'state', postcode:'postcode', country:'country'}, function(pathKey, valueKey){
						var value = filter[valueKey];
						if ( value ) {
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
					// TODO: Searching on "not linked to" (null) values seems to return all results.
					// console.log(filter.field.path + ':');
					// console.log(filters[filter.field.path]);
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
					}
					else {
						value = utils.number(value);
						if ( !isNaN(value) ) {
							if (filter.operator === 'gt') {
								filters[path] = { $gt: value};
							}
							else if (filter.operator === 'lt') {
								filters[path] = { $lt: value};
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
					}
					else {
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

	// console.log(util.inspect(filters, { depth: null, colors: true }));

	return filters;

};


/**
 * Updates every document in a List,
 * setting the provided data on each.
 *
 * @param {Object} data
 * @param {Function} callback (optional)
 * @api public
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


/**
 * Gets a unique value from a generator method by checking for documents with the same value.
 *
 * To avoid infinite loops when a unique value cannot be found, it will bail and pass back an
 * undefined value after 10 attemptes.
 *
 * WARNING: Because there will always be a small amount of time between checking for an
 * existing value and saving a document, race conditions can occur and it is possible that
 * another document has the 'unique' value assigned at the same time.
 *
 * Because of this, if true uniqueness is required, you should also create a unique index on
 * the database path, and handle duplicate errors thrown on save.
 *
 * @param {String} path to check for uniqueness
 * @param {Function} generator method to call to generate a new value
 * @param {Number} the maximum number of attempts (optional, defaults to 10)
 * @param {Function} callback(err, uniqueValue)
 * @api public
 */

List.prototype.getUniqueValue = function(path, generator, limit, callback) {

	var model = this.model,
		count = 0,
		value;

	if (utils.isFunction(limit)) {
		callback = limit;
		limit = 10;
	}

	if (utils.isArray(generator)) {

		var fn = generator[0],
			args = generator.slice(1);

		generator = function() {
			return fn.apply(this, args);
		};

	}

	var check = function() {

		if (count++ > 10) {
			return callback(undefined, undefined);
		}

		value = generator();

		model.count().where(path, value).exec(function(err, matches) {
			if (err) return callback(err);
			if (matches) return check();
			callback(undefined, value);
		});

	};

	check();

};

/**
 * Generate page array for pagination
 *
 * @param {Number} the maximum number pages to display in the pagination
 * @param {Object} page options
 * @api public
 */
List.prototype.getPages = function(options, maxPages) {
		var surround = Math.floor(maxPages / 2),
			firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1,
			padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0),
			lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages,
			padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);

		options.pages = [];

		firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);

		for (var i = firstPage; i <= lastPage; i++) {
			options.pages.push(i);
		}

		if (firstPage !== 1) {
			options.pages.shift();
			options.pages.unshift('...');
		}

		if (lastPage !== Number(options.totalPages)) {
			options.pages.pop();
			options.pages.push('...');
		}
};

/**
 * Gets a special Query object that will paginate documents in the list
 *
 * ####Example:
 *
 *     list.paginate({
 *         page: 1,
 *         perPage: 100,
 *         maxPages: 10
 *     }).exec(function(err, results) {
 *         // do something
 *     });
 *
 * @param {Object} options
 * @param {Function} callback (optional)
 * @api public
 */

List.prototype.paginate = function(options, callback) {

	var list = this, model = this.model;

	options = options || {};

	var query = model.find(options.filters);

	query._original_exec = query.exec;
	query._original_sort = query.sort;
	query._original_select = query.select;

	var currentPage = Number(options.page) || 1,
		resultsPerPage = Number(options.perPage) || 50,
		maxPages = Number(options.maxPages) || 10,
		skip = (currentPage - 1) * resultsPerPage;

	list.pagination = { maxPages: maxPages };

	// as of mongoose 3.7.x, we need to defer sorting and field selection
	// until after the count has been executed

	query.select = function() {
		options.select = arguments[0];
		return query;
	};

	query.sort = function() {
		options.sort = arguments[0];
		return query;
	};

	query.exec = function(callback) {

		query.count(function(err, count) {

			if (err) return callback(err);

			query.find().limit(resultsPerPage).skip(skip);

			// apply the select and sort options before calling exec
			if (options.select) {
				query._original_select(options.select);
			}

			if (options.sort) {
				query._original_sort(options.sort);
			}

			query._original_exec(function(err, results) {

				if (err) return callback(err);

				var totalPages = Math.ceil(count / resultsPerPage);

				var rtn = {
					total: count,
					results: results,
					currentPage: currentPage,
					totalPages: totalPages,
					pages: [],
					previous: (currentPage > 1) ? (currentPage - 1) : false,
					next: (currentPage < totalPages) ? (currentPage + 1) : false,
					first: skip + 1,
					last: skip + results.length
				};

				list.getPages(rtn, maxPages);

				callback(err, rtn);

			});
		});

	};

	if (callback) {
		return query(callback);
	} else {
		return query;
	}
};


/*!
 * Export class
 */

exports = module.exports = List;
