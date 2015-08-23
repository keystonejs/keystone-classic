var keystone = require('../../');
var utils = require('keystone-utils');

/**
 * Registers relationships to this list defined on others
 */
function relationship (def) {
	if (arguments.length > 1) {
		for (var i = 0; i < arguments.length; i++) {
			this.relationship(arguments[i]);
		}
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
}

module.exports = relationship;
