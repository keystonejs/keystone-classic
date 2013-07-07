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

function Field(list, path, options) {
	
	this.list = list;
	this.path = new utils.Path(path);
	this.options = options;
	
	this.list.automap(this);
	
	this.addToSchema();
	
	//list.schema.path(this.path, this.options);
	//this.addToSchema(list.schema);
	
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

exports = module.exports = Field;

Field.prototype.addToSchema = function() {
	var ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.options) : this.options;
	this.list.schema.path(this.path.original, ops);
}
/*
Field.prototype.getRefList = function() {
	//return require('../').list(this.ref); // prospekt class has not be instantiated when this file is first required, so we need to require it on demand
}
*/