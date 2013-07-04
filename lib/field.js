var _ = require('underscore'),
	utils = require('./utils');

// The data type map is used to lookup native types (including those detected by relationships)
// and map them to the expected fieldType value. Any Prospekt-specific types supported by the
// fieldType option don't need to be included.
/*
var dataTypeMap = {
	'string': 'textfield',
	'boolean': 'checkbox',
	'date': 'datetime',
	'object': 'object',
	'objects': 'objects',
	'number': 'number',
	'list': 'list',
	'latlng': 'latlng',
	'image': 'image',
	'location': 'location'
};
*/

function Field(path, options) {
	
	if (!(this instanceof Field))
		return new Field(options);
	
	// TODO: Proper type inference and option defaulting
	
	if ('string' == typeof options || 'function' == typeof options)
		options = { type: options };
	
	if (!options || !options.type)
		throw new Error('field options and type required');
	
	this.path = path;
	this.options = options;
	
	//if (!dataTypeMap[options.type]) {
	//	throw new Error('invalid field type ' + options.type);
	//}
	
	/*
	this.path = path;
	this.label = options.label || utils.keyToLabel(path);
	this.dataType = options.type;
	this.fieldType = options.fieldType || dataTypeMap[options.type];
	this.width = options.width || 'full'; // field width is, for certain types, overridden by css
	this.note = options.note || '';
	this.noedit = options.noedit;
	this.initial = options.initial;
	this.options = options.options;
	this.ref = options.ref;
	*/
	
}

Field.prototype.addToSchema = function(schema) {
	schema.path(this.path, this.options);
}

Field.prototype.getRefList = function() {
	return require('../').list(this.ref); // prospekt class has not be instantiated when this file is first required, so we need to require it on demand
}

exports = module.exports = Field;
