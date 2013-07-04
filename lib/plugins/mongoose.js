var _ = require('underscore'),
	mongoose = require('mongoose');

/**
 * Mongoose Plugins
 * Adds Prospekt-specific functionality to Mongoose Classes
 */

mongoose.Schema.prototype.field = function(path, def) {
	if (!this.prospektFieldDefs) {
		this.prospektFieldDefs = {};
	}
	if ('string' == typeof def)
		def = { type: def };
	this.prospektFieldDefs[path] = def;
}