/*!
 * Module dependencies.
 */
var _ = require('underscore');
var di = require('asyncdi');
var marked = require('marked');
var Path = require('../../lib/path');
var utils = require('keystone-utils');

var DEFAULT_OPTION_KEYS = [
	'path',
	'paths',
	'type',
	'label',
	'note',
	'size',
	'initial',
	'required',
	'col',
	'noedit',
	'nocol',
	'nosort',
	'nofilter',
	'indent',
	'hidden',
	'collapse',
	'dependsOn'
];

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

	// Add pre-save handler to the list if this field watches others
	if (this.options.watch) {
		this.list.schema.pre('save', this.getPreSaveWatcher());
	}

	// Convert notes from markdown to html
	var note = null;
	Object.defineProperty(this, 'note', {
		get: function() {
			return (note === null) ? (note = (this.options.note) ? marked(this.options.note) : '') : note;
		}
	});

}

/**
 * Gets the options for the Field, as used by the React components
 */
Field.prototype.getOptions = function() {
	if (!this.__options) {
		this.__options = {};
		var optionKeys = DEFAULT_OPTION_KEYS;
		if (_.isArray(this._properties)) {
			optionKeys = optionKeys.concat(this._properties);
		}
		optionKeys.forEach(function(key) {
			if (this[key]) {
				this.__options[key] = this[key];
			} else if (this.options[key]){
				this.__options[key] = this.options[key];
			}
		}, this);
		if (this.getProperties) {
			_.extend(this.__options, this.getProperties());
		}
		this.__options.hasFilterMethod = this.addFilterToQuery ? true : false;
		this.__options.defaultValue = this.getDefaultValue();
	}
	return this.__options;
};

/**
 * Validates and returns the size of the field.
 * Defaults to deprecated 'width' option.
 */
Field.prototype.getSize = function() {
	if (!this.__size) {
		var size = this._fixedSize || this.options.size || this.options.width;
		if (size !== 'small' && size !== 'medium' && size !== 'large' && size !== 'full') {
			size = this._defaultSize || 'large';
		}
		this.__size = size;
	}
	return this.__size;
};

/**
 * Gets default value for the field, based on the option or default for the type
 */
Field.prototype.getDefaultValue = function() {
	return this.options.default || '';
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
Field.prototype.getData = function(item) {
	return item.get(this.path);
};

/**
 * Field watching implementation
 */
Field.prototype.getPreSaveWatcher = function() {
	var field = this;
	var applyValue;

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
					if (item.isModified(path)) pass = true;
				});
				return pass;
			};
		} else if (_.isObject(this.options.watch)) {
			applyValue = function(item) {
				var pass = false;
				_.each(field.options.watch, function(value, path) {
					if (item.isModified(path) && item.get(path) === value) pass = true;
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
		di(field.options.value).call(this, function(err, val){
			if(err){
				console.error('\nError: ' +
				'Watch set with value method for ' + field.list.key + '.' + field.path + ' (' + field.type + ') throws error:' + err);
			}else{
				this.set(field.path, val);
			}
			next();
		}.bind(this));
	};

};
exports = module.exports = Field;

/** Getter properties for the Field prototype */
Object.defineProperty(Field.prototype, 'size', { get: function() { return this.getSize(); } });
Object.defineProperty(Field.prototype, 'initial', { get: function() { return this.options.initial || false; } });
Object.defineProperty(Field.prototype, 'required', { get: function() { return this.options.required || false; } });
Object.defineProperty(Field.prototype, 'note', { get: function() { return this.options.note || ''; } });
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
	var value = this.getValueFromData(data);
	if (value === undefined && item && item.get(this.path)) return true;
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
	if (value !== undefined && value != item.get(this.path)) { // eslint-disable-line eqeqeq
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