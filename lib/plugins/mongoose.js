var _ = require('underscore'),
	mongoose = require('mongoose');

/**
 * Mongoose Plugins
 * Adds Keystone-specific functionality to Mongoose Classes
 */

mongoose.Schema.prototype.field = function(path, def) {
	if (!this.keystoneFieldDefs) {
		this.keystoneFieldDefs = {};
	}
	if ('string' == typeof def)
		def = { type: def };
	this.keystoneFieldDefs[path] = def;
}