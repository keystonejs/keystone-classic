// var debug = require('debug')('keystone:core:addCustomFieldType');

// `typeSpec` must have `name` and `path` properties
module.exports = function addFieldType (typeSpec) {
	this.Field = this.Field || {};
	this.Field.Types = this.Field.Types || {};
	if (this.Field.Types[typeSpec.name]) {
		throw new Error('FieldType "' + typeSpec.name + '" already exists');
	}

	Object.defineProperty(this.Field.Types, typeSpec.name, {
		get: function () { return require(typeSpec.path); },
	});

	return this;
};
