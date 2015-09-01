var _ = require('underscore');
var keystone = require('../');
var schemaPlugins = require('./schemaPlugins');
var utils = require('keystone-utils');
var random = require('mongoose-simple-random');
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
	this.schema.plugin(random);
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

// Search Fields
Object.defineProperty(List.prototype, 'searchFields', {
	get: function() {
		if (!this._searchFields) {
			this._searchFields = this.expandPaths(this.get('searchFields'));
		}
		return this._searchFields;
	}, set: function(value) {
		this.set('searchFields', value);
		delete this._searchFields;
	}
});

// Default Sort Field
Object.defineProperty(List.prototype, 'defaultSort', {
	get: function() {
		var ds = this.get('defaultSort');
		return (ds === '__default__') ? (this.get('sortable') ? 'sortOrder' : this.namePath) : ds;
	}, set: function(value) {
		this.set('defaultSort', value);
	}
});

// Default Column Fields
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

<<<<<<< HEAD

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
 * ####Example:
 *
 *     list.getSearchFilters('jed') // returns { name: /jed/i }
 *
 * @param {String} query
 * @param {Object} additional filters
 * @api public
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
	var model = this.model;
	var count = 0;
	var value;

	if (utils.isFunction(limit)) {
		callback = limit;
		limit = 10;
	}

	if (utils.isArray(generator)) {
		var fn = generator[0];
		var args = generator.slice(1);
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
	var surround = Math.floor(maxPages / 2);
	var firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1;
	var padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0);
	var lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages;
	var padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);

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
	var list = this;
	var model = this.model;

	options = options || {};

	var query = model.find(options.filters);

	query._original_exec = query.exec;
	query._original_sort = query.sort;
	query._original_select = query.select;

	var currentPage = Number(options.page) || 1;
	var resultsPerPage = Number(options.perPage) || 50;
	var maxPages = Number(options.maxPages) || 10;
	var skip = (currentPage - 1) * resultsPerPage;

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

=======
// Add prototype methods
List.prototype.set = require('./list/set');
List.prototype.get = List.prototype.set;
List.prototype.add = require('./list/add');
List.prototype.map = require('./list/map');
List.prototype.automap = require('./list/automap');
List.prototype.field = require('./list/field');
List.prototype.relationship = require('./list/relationship');
List.prototype.underscoreMethod = require('./list/underscoreMethod');
List.prototype.register = require('./list/register');
List.prototype.getData = require('./list/getData');
List.prototype.getOptions = require('./list/getOptions');
List.prototype.getAdminURL = require('./list/getAdminURL');
List.prototype.getDocumentName = require('./list/getDocumentName');
List.prototype.addSearchToQuery = require('./list/addSearchToQuery');
List.prototype.addFiltersToQuery = require('./list/addFiltersToQuery');
List.prototype.isReserved = require('./list/isReserved');
List.prototype.expandColumns = require('./list/expandColumns');
List.prototype.expandPaths = require('./list/expandPaths');
List.prototype.selectColumns = require('./list/selectColumns');
List.prototype.processFilters = require('./list/processFilters');
List.prototype.getSearchFilters = require('./list/getSearchFilters');
List.prototype.updateAll = require('./list/updateAll');
List.prototype.getUniqueValue = require('./list/getUniqueValue');
List.prototype.getPages = require('./list/getPages');
List.prototype.paginate = require('./list/paginate');
>>>>>>> keystonejs/master

/*!
 * Export class
 */
exports = module.exports = List;
