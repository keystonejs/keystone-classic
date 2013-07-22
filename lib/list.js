var _ = require('underscore'),
	prospekt = require('../'),
	utils = require('./utils'),
	Field = require('./field');


/**
 * List Class
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */

function List(key, options) {
	
	if (!(this instanceof List))
		return new List(key, options);
	
	var list = this;
	
	this.key = key;
	this.path = utils.keyToPath(key);
	this.schema = new prospekt.mongoose.Schema();
	
	this.options = utils.options({
		noedit: false,
		nocreate: false,
		nodelete: false,
		searchFields: '__name__',
		defaultSort: '__name__',
		defaultColumns: '__name__'
	}, options);
	
	this.fields = {};
	
	// TEMP
	this.populate = [];
	
	this.mappings = {
		name: null,
		createdBy: null,
		createdOn: null,
		modifiedBy: null,
		modifiedOn: null
	};
	
	// set mappings
	_.each(this.options.map, function(val, key) { this.map(key, val) }, this);
	
	Object.defineProperty(this, 'label', { get: function() {
		return this.get('label') || this.set('label', utils.toPlural(utils.keyToLabel(key)));
	}});
	
	Object.defineProperty(this, 'singular', { get: function() {
		return this.get('singular') || this.set('singular', utils.toSingular(this.label));
	}});
	
	Object.defineProperty(this, 'plural', { get: function() {
		return this.get('plural') || this.set('plural', this.label);
	}});
	
	Object.defineProperty(this, 'namePath', { get: function() {
		return this.mappings.name || 'id';
	}});
	
	Object.defineProperty(this, 'nameField', { get: function() {
		return this.fields[this.mappings.name];
	}});
	
	Object.defineProperty(this, 'nameIsVirtual', { get: function() {
		return this.model.schema.virtuals[this.mappings.name] ? true : false;
	}});
	
	Object.defineProperty(this, 'nameIsEditable', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type == 'text') ? !this.fields[this.mappings.name].noedit : false;
	}});
	
	Object.defineProperty(this, 'nameIsInitial', { get: function() {
		return (this.fields[this.mappings.name] && this.fields[this.mappings.name].initial === undefined);
	}});
	
	// the formFields and initialFields values are initialised once, on demand
	
	var formFields;
	Object.defineProperty(this, 'formFields', { get: function() {
		if (formFields)
			return formFields;
		var exceptFields = ['id', 'createdOn', 'createdBy', 'changedOn', 'changedBy'];
		if (this.nameIsEditable)
			exceptFields.push(this.namePath);
		return (formFields = _.omit(this.fields, exceptFields));
	}});
	
	var initialFields;
	Object.defineProperty(this, 'initialFields', { get: function() {
		return initialFields || (initialFields = _.filter(this.fields, function(i) { return i.initial }));
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
	if (arguments.length == 1)
		return this.options[key];
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
	if (path)
		this.mappings[field] = path;
	return this.mappings[field];
}


/**
 * Checks to see if a field path matches a currently unmapped path, and
 * if so, adds a mapping for it.
 * 
 * @api private
 */

List.prototype.automap = function(field) {
	if (_.has(this.mappings, field.path) && !this.mappings[field.path])
		this.map(field.path, field.path);
}


/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 * 
 * @api public
 */

List.prototype.add = function(obj, prefix) {
	
	prefix = prefix || '';
	var keys = Object.keys(obj);
	
	for (var i = 0; i < keys.length; ++i) {
		var key = keys[i];
		
		if (null == obj[key]) {
			throw new Error('Invalid value for schema path `'+ prefix + key +'`');
		}
		
		if (utils.isObject(obj[key]) && (!obj[key].constructor || 'Object' == obj[key].constructor.name) && (!obj[key].type || obj[key].type.type)) {
			if (Object.keys(obj[key]).length) {
				// nested object, e.g. { last: { name: String }}
				// matches logic in mongoose/Schema:add
				this.schema.nested[this.path] = true;
				this.add(obj[key], prefix + key + '.');
			} else {
				this.field(prefix + key, obj[key]); // mixed type field
			}
		} else {
			this.field(prefix + key, obj[key]);
		}
	}
	
	return this;
	
}


/**
 * Adds preset patterns of fields and behaviours to the Schema
 * 
 * @api public
 */

List.prototype.addPattern = function(pattern) {
	
	switch (pattern) {
		
		case 'standard meta':
			this.schema.add({
				createdOn: { type: Date, default: Date.now },
				updatedOn: { type: Date, default: Date.now }
			});
			this.schema.pre('save', function (next) {
				this.changedOn = new Date();
				next();
			});
		break;
		
	}
	
	return this;
	
}


/**
 * Creates a new field at the specified path, with the provided options.
 * If no options are provides, returns the field at the specified path.
 * 
 * @api public
 */

List.prototype.field = function(path, options) {
	
	if (arguments.length == 1)
		return this.fields[path];
	
	if ('function' == typeof options)
		options = { type: options };
	
	if ('function' != typeof options.type)
		throw new Error('fields must be specified with a type function');
	
	if (options.type.prototype.__proto__ != Field.prototype) {
		
		// Convert native field types to their default Prospekt counterpart
		
		if (options.type == String)
			options.type = Field.Types.Text;
		else if (options.type == Number)
			options.type = Field.Types.Number;
		else if (options.type == Boolean)
			options.type = Field.Types.Boolean;
		else if (options.type == Date)
			options.type = Field.Types.Datetime;
		else
			throw new Error('Unrecognised field constructor: ' + options.type);
		
	}
	
	var field = new options.type(this, path, options);
	
	return this.fields[path] = field;
	
}


/**
 * Default Sort Field
 * 
 * @api private
 */

Object.defineProperty(List.prototype, 'defaultSort', {
	
	get: function() {
		
		var ds = this.get('defaultSort');
		
		return (ds == '__name__') ? this.namePath : ds;
		
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
	
	if (typeof cols == 'string')
		cols = cols.split(',');
	
	if (!Array.isArray(cols))
		throw new Error("List.expandColumns: cols must be an array.");
	
	var list = this,
		expanded = [],
		nameCol = false;
	
	var getCol = function(def) {
		
		if (def.path == '__name__')
			def.path = list.namePath;
		
		var field = list.fields[def.path],
			col = null;
		
		if (field) {
			col = {
				field: field,
				path: field.path,
				type: field.type,
				label: def.label || field.label
			};
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
			
			if (col.path == list.namePath) {
				col.isName = true;
				nameCol = col;
			}
			
		}
		
		return col;
	}
	
	for (var i = 0; i < cols.length; i++) {
		
		if (typeof cols[i] == 'string') {
			
			var def = {},
				parts = cols[i].trim().split('|');
			
			def.width = parts[1] || false;
			
			parts = parts[0].split(':');
			
			def.path = parts[0];
			def.subpath = parts[1];
			
		}
		
		if (!utils.isObject(def) || !def.path)
			throw new Error('List.expandColumns: column definition must contain a path.');
		
		var col = getCol(def);
		
		if (col)
			expanded.push(col);
	
	}
	
	if (!nameCol) {
		nameCol = getCol({ path: list.namePath });
		if (nameCol)
			expanded.unshift(nameCol);
	}
	
	return expanded;
	
}


/**
 * Default Column Fields
 * 
 * @api public
 */

Object.defineProperty(List.prototype, 'defaultColumns', {
	
	get: function() {
	
		if (!this._defaultColumns)
			this._defaultColumns = this.expandColumns(this.get('defaultColumns'));
		
		return this._defaultColumns;
		
	}, set: function(value) {
		
		this.set('defaultColumns', value);
		delete this._defaultColumns;
		
	}
	
});


/**
 * Registers the Schema with Mongoose, and the List with Prospekt
 * 
 * @api public
 */

List.prototype.register = function() {
	this.model = prospekt.mongoose.model(this.key, this.schema);
	require('../').list(this);
	return this;
}


/**
 * Gets the name of the provided document from the correct path
 *
 * ####Example:
 *
 *     var name = list.getDocumentName(item)
 *
 * @param {Object} item
 * @api public
 */

List.prototype.getDocumentName = function(doc) {
	return doc.get(this.namePath);
}


/**
 * Gets filters for a Mongoose query that will search for the provided string,
 * based on the searchFields List option
 *
 * ####Example:
 *
 *     list.getSearchFilters('jed') // returns { name: /jed/i }
 *
 * @param {String} query
 * @api public
 */

List.prototype.getSearchFilters = function(q) {
	var filters = {};
	
	if (!q || !q.length)
		return filters;
	
	var qr = new RegExp(q, 'i');
	
	if (this.get('searchFields') == '__name') {
		if (this.mappings.name)
			filters[this.mappings.name] = qr;
	} else {
		var searchFields = this.get('searchFields').split(',');
		filters['$or'] = [];
		_.each(searchFields, function(field) {
			rq = new RegExp(q.replace(/\W+/,'|'), 'i');
			var f = {};
			f[field.trim()] = qr;
			filters['$or'].push(f);
		});
	}
	
	return filters;
}


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

List.prototype.paginate = function(options, cb) {
	
	var model = this.model,
		query = model.find();
	
	options = options || {};
	query._original_exec = query.exec;
	
	var currentPage = Number(options.page) || 1,
		resultsPerPage = Number(options.perPage) || 100,
		maxPages = Number(options.maxPages) || 10,
		skip = (currentPage - 1) * resultsPerPage;
	
	query.limit(resultsPerPage).skip(skip);
	
	query.exec = function(callback) {
		query._original_exec(function(err, results) {
			
			if (err)
				return calback(err);
			
			query.count(function(err, count) {
				
				if (err)
					return calback(err);
				
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
				
				var surround = Math.floor(maxPages / 2);
				var firstPage = maxPages ? Math.max(1, currentPage - surround) : 1;
				var padRight = Math.max(((currentPage - surround) - 1) * -1, 0);
				
				var lastPage = maxPages ? Math.min(totalPages, currentPage + surround + padRight) : totalPages;
				
				var padLeft = Math.max(((currentPage + surround) - lastPage), 0);
				firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);
				
				for (var i = firstPage; i <= lastPage; i++) {
					rtn.pages.push(i);
				}
				
				if (firstPage != 1) {
					rtn.pages.shift();
					rtn.pages.unshift('...');
				}
				
				if (lastPage != totalPages) {
					rtn.pages.pop();
					rtn.pages.push('...');
				}

				callback(err, rtn);
				
			});
		});
	}
	
	if (cb) {
		query(cb);
	} else {
		return query;
	}
}

exports = module.exports = List;


