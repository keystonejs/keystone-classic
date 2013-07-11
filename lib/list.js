var _ = require('underscore'),
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
	this.schema = new this.mongoose.Schema();
	
	this.options = utils.options({
		noedit: false,
		nocreate: false,
		nodelete: false,
		searchFields: '__name',
		defaultSort: '__name'
	}, options);
	
	this.fields = {};
	this.columns = {};
	
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
		return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(key)));
	}});
	
	Object.defineProperty(this, 'singular', { get: function() {
		return this.get('singular') || this.set('singular', utils.singular(this.label));
	}});
	
	Object.defineProperty(this, 'plural', { get: function() {
		return this.get('plural') || this.set('plural', this.label);
	}});
	
	Object.defineProperty(this, 'namePath', { get: function() {
		return this.map('name') || 'id';
	}});
	
	Object.defineProperty(this, 'nameIsVirtual', { get: function() {
		return this.model.schema.virtuals[this.mappings.name] ? true : false;
	}});
	
	Object.defineProperty(this, 'nameIsEditable', { get: function() {
		if (this.nameIsVirtual)
			return false;
		var nameField = this.fields[this.map('name')];
		return (nameField) ? !nameField.noedit : false;
	}});
	
	Object.defineProperty(this, 'nameIsInitial', { get: function() {
		
		if (!this.map('name'))
			return false;
		
		if (this.fields[this.map('name')] && this.fields[this.map('name')].initial === false)
			return false;
		
		if (this.nameIsVirtual && this.defs[this.map('name')] && this.defs[this.map('name')].initial === false)
			return false;
		
		return true;
	
	}});
	
	// the formFields and initialFields values are initialised once, on demand
	
	var formFields;
	Object.defineProperty(this, 'formFields', { get: function() {
		return formFields || (formFields = _.omit(this.fields, 
			_.uniq(['id', 'createdOn', 'createdBy', 'changedOn', 'changedBy']).concat(_.compact([list.namePath]))
		));
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
				// nested object { last: { name: String }}
				this.add(obj[key], prefix + key + '.');
			} else {
				this.field(prefix + key, obj[key]); // mixed type
			}
		} else {
			this.field(prefix + key, obj[key]);
		}
	}
	
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
	
	if (options.type.prototype.__proto__ == Field.prototype) {
		// Prospekt field type
		var field = new options.type(this, path, options);
	} else {
		// Native field type
		var field = new Field(this, path, options);
	}
	
	return this.fields[path] = field;
	
}

/**
 * Checks to see if a field path matches a currently unmapped path, and
 * if so, adds a mapping for it.
 * 
 * @api private
 */

List.prototype.automap = function(field) {
	if (_.has(this.mappings, field.path.original) && !this.mappings[field.path.original])
		this.map(field.path.original, field.path.original);
}


/**
 * Default Sort Field
 * 
 * @api private
 */
Object.defineProperty(List.prototype, 'defaultSort', {
	
	get: function() {
		
		var ds = this.get('defaultSort');
		
		if (ds.slice(0,2) == '__' && this.map(ds.slice(2))) {
			return this.map(ds.slice(2));
		} else {
			return this.get('defaultSort');
		}
		
		
		
	}, set: function(value) {
		
		this.set('defaultSort', value);
		
	}
	
});


/**
 * Default Column Fields
 * 
 * @api public
 */
Object.defineProperty(List.prototype, 'defaultColumns', {
	
	get: function() {
	
		if (!this._defaultColumns) {
			
			var dc = this.get('defaultColumns').split(','),
				columns = [];
			
			for (var i = 0; i <= dc.length; i++) {
				
				var parts = dc[i].trim().split('|'),
					width = parts[1] || false;
				
				parts = parts[0].split(':');
				
				var field = this.fields[parts[0]],
					col = null;
				
				if (field) {
					col = field.getColumnDef(parts[1]);
				}
				
				if (col) {
					columns.push(col);
				}
				
				/*
				
				OLD COLUMNS PROCESSING::
				
				var path = col[0],
					subPath = col[1],
					field = this.fields[path];
					
				if (!field) {
					if (this.model.schema.virtuals[path]) {
						field = {
							type: 'virtual',
							path: path
						};
					} else {
						throw new Error("Columns must be defined as a field before they can be added. Invalid: " + path);
					}
				}
				
				col = {
					field: field,
					width: width
				};
				
				// specifically identify the name column; it gets special treatment
				if (field.path == this.namePath) {
					col.isName = true;
					
					// provide a title if it is a virtual field
					if (field.type == 'virtual') {
						col.field.label = 'Name';
					}
				}
				
				if (field.fieldType == 'object') {
					col.subPath = subPath;
					this.populate.push(path);
				}
				
				this.columns.push(col);
				
				*/
				
			}
			
			console.log('Columns::');
			console.log(columns);
			this._defaultColumns = columns;
			
		}
		
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
	this.model = this.mongoose.model(this.key, this.schema);
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
		if (this.map('name'))
			filters[this.map('name')] = qr;
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


