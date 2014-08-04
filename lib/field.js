/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	marked = require('marked'),
	Path = require('./path'),
	fspath = require('path'),
	jade = require('jade'),
	fs = require('fs'),
	keystone = require('../'),
	utils = require('keystone-utils'),
	compiledTemplates = {};


/**
 * Field Constructor
 * =================
 *
 * Extended by fieldType Classes, should not be used directly.
 *
 * @api public
 */

function Field(list, path, options) {

	// Set field properties and options
	this.list = list;
	this._path = new Path(path);
	this.path = path;

	this.type = this.constructor.name;
	this.options = utils.options(this.defaults, options);
	this.label = options.label || utils.keyToLabel(this.path);
	this.typeDescription = options.typeDescription || this.typeDescription || this.type;

	// Add the field to the schema
	this.list.automap(this);
	this.addToSchema();

	// Warn on required fields that aren't initial
	if (this.options.required &&
        this.options.initial === undefined &&
        this.options.default === undefined &&
        !this.options.value &&
        !this.list.get('nocreate') &&
        this.path !== this.list.mappings.name
	) {
		console.error('\nError: Invalid Configuration\n\n' +
			'Field (' + list.key + '.' + path + ') is required but not initial, and has no default or generated value.\n' +
			'Please provide a default, remove the required setting, or set initial: false to override this error.\n');
		process.exit(1);
	}

	// Set up templates
	this.templateDir = fspath.normalize(options.templateDir || (__dirname + '../../templates/fields/' + this.type));

	var defaultTemplates = {
		form: this.templateDir + '/' + 'form.jade',
		initial: this.templateDir + '/' + 'initial.jade'
	};

	this.templates = utils.options(defaultTemplates, this.options.templates);

	// Add pre-save handler to the list if this field watches others
	if (this.options.watch) {
		this.list.schema.pre('save', this.getPreSaveWatcher());
	}

	// Convert notes from markdown to html
	var note = null;
	Object.defineProperty(this, 'note', { get: function() {
		return (note === null) ? (note = (this.options.note) ? marked(this.options.note) : '') : note;
	} });

}

Field.prototype.getPreSaveWatcher = function() {

	var field = this,
		applyValue;

	if (this.options.watch === true) {
		// watch == true means always apply the value method
		applyValue = function() { return true; };
	} else {
		// if watch is a string, convert it to a list of paths to watch
		if (_.isString(this.options.watch)) {
			this.options.watch = this.options.watch.split(' ');
		}
		if (_.isFunction(this.options.watch)) {
			applyValue = this.options.watch;
		} else if (_.isArray(this.options.watch)) {
			applyValue = function(item) {
				var pass = false;
				field.options.watch.forEach(function(path) {
					if (!item.isModified(path)) pass = true;
				});
				return pass;
			};
		} else if (_.isObject(this.options.watch)) {
			applyValue = function(item) {
				var pass = false;
				_.each(field.options.watch, function(value, path) {
					if (item.isModified(path) && item.get('path') === value) pass = true;
				});
				return pass;
			};
		}
	}

	if (!applyValue) {
		console.error('\nError: Invalid Configuration\n\n' +
			'Invalid watch value (' + this.options.watch + ') provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	if (!_.isFunction(this.options.value)) {
		console.error('\nError: Invalid Configuration\n\n' +
			'Watch set with no value method provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	return function(next) {
		if (!applyValue(this)) {
			return next();
		}
		this.set(field.path, field.options.value.call(this));
		next();
	};

};

exports = module.exports = Field;


/** Getter properties for the Field prototype */

Object.defineProperty(Field.prototype, 'width', { get: function() { return this.options.width || 'full'; } }); // !! field width is, for certain types, overridden by css
Object.defineProperty(Field.prototype, 'initial', { get: function() { return this.options.initial || false; } });
Object.defineProperty(Field.prototype, 'required', { get: function() { return this.options.required || false; } });
Object.defineProperty(Field.prototype, 'col', { get: function() { return this.options.col || false; } });
Object.defineProperty(Field.prototype, 'noedit', { get: function() { return this.options.noedit || false; } });
Object.defineProperty(Field.prototype, 'nocol', { get: function() { return this.options.nocol || false; } });
Object.defineProperty(Field.prototype, 'nosort', { get: function() { return this.options.nosort || false; } });
Object.defineProperty(Field.prototype, 'nofilter', { get: function() { return this.options.nofilter || false; } });
Object.defineProperty(Field.prototype, 'collapse', { get: function() { return this.options.collapse || false; } });
Object.defineProperty(Field.prototype, 'hidden', { get: function() { return this.options.hidden || false; } });
Object.defineProperty(Field.prototype, 'dependsOn', { get: function() { return this.options.dependsOn || false; } });



/**
 * Default method to register the field on the List's Mongoose Schema.
 * Overridden by some fieldType Classes
 *
 * @api public
 */

Field.prototype.addToSchema = function() {

	var ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.options) : this.options;

	this.list.schema.path(this.path, ops);

	this.bindUnderscoreMethods();

};

Field.prototype.bindUnderscoreMethods = function(methods) {

	var field = this;

	// automatically bind underscore methods specified by the _underscoreMethods property
	// always include the 'update' method

	(this._underscoreMethods || []).concat({ fn: 'updateItem', as: 'update' }, (methods || [])).forEach(function(method) {
		if ('string' === typeof method) {
			method = { fn: method, as: method };
		}
		if ('function' !== typeof field[method.fn]) {
			throw new Error('Invalid underscore method (' + method.fn + ') applied to ' + field.list.key + '.' + field.path + ' (' + field.type + ')');
		}
		field.underscoreMethod(method.as, function() {
			var args = [this].concat(Array.prototype.slice.call(arguments));
			return field[method.fn].apply(field, args);
		});
	});

};


/**
 * Adds a method to the underscoreMethods collection on the field's list,
 * with a path prefix to match this field's path and bound to the document
 *
 * @api public
 */

Field.prototype.underscoreMethod = function(path, fn) {
	this.list.underscoreMethod(this.path + '.' + path, function() {
		return fn.apply(this, arguments);
	});
};


/**
 * Default method to format the field value for display
 * Overridden by some fieldType Classes
 *
 * @api public
 */

Field.prototype.format = function(item) {
	return item.get(this.path);
};


/**
 * Default method to detect whether the field has been modified in an item
 * Overridden by some fieldType Classes
 *
 * @api public
 */

Field.prototype.isModified = function(item) {
	return item.isModified(this.path);
};


/**
 * Validates that a value for this field has been provided in a data object
 * Overridden by some fieldType Classes
 *
 * @api public
 */

Field.prototype.validateInput = function(data, required, item) {
	if (!required) return true;
	if (!(this.path in data) && item && item.get(this.path)) return true;
	if ('string' === typeof data[this.path]) {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}
};


/**
 * Updates the value for this field in the item from a data object
 * Overridden by some fieldType Classes
 *
 * @api public
 */

Field.prototype.updateItem = function(item, data) {
	
	var value = this.getValueFromData(data);
	
	// This is a deliberate type coercion so that numbers from forms play nice
	if (value !== undefined && value != item.get(this.path)) {
		item.set(this.path, value);
	}
	
};

/**
 * Retrieves the value from an object, whether the path is nested or flattened
 * 
 * @api public
 */

Field.prototype.getValueFromData = function(data) {
	return this.path in data ? data[this.path] : this._path.get(data);
};

/**
 * Compiles a field template and caches it
 *
 * @api public
 */

Field.prototype.compile = function(type, callback) {

	var templatePath = this.templates[type];

	if (!compiledTemplates[templatePath]) {
		fs.readFile(templatePath, 'utf8', function(err, file) {
			if (!err){
				compiledTemplates[templatePath] = jade.compile(file, {
					filename: templatePath,
					pretty: keystone.get('env') !== 'production'
				});
			}
			if (callback) return callback();
		});
	} else if (callback) {
		return callback();
	}

};

/**
 * Compiles a field template and caches it
 *
 * @api public
 */

Field.prototype.render = function(type, item, locals) {

	var templatePath = this.templates[type];

	// Compile the template synchronously if it hasn't already been compiled
	if (!compiledTemplates[templatePath]) {

		var file = fs.readFileSync(templatePath, 'utf8');

		compiledTemplates[templatePath] = jade.compile(file, {
			filename: templatePath,
			pretty: keystone.get('env') !== 'production'
		});

	}

	return compiledTemplates[templatePath](_.extend(locals || {}, {
		field: this,
		item: item
	}));

};
