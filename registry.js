var moduleRoot = require('./lib/core/getModulePath')(module.parent || module);
var Keystone = require('./prototype');

var registry = {};
registry._instances = {};

registry.create = function(name, explicitModuleRoot) {
	if (!name) {
		name = Date.now() + '-' + (Math.random() * 10);
	}
	var instance = new Keystone(explicitModuleRoot || moduleRoot);
	registry._instances[name] = instance;
	return instance;
};

registry.getInstance = function(name) {
	return registry._instances[name];
};

module.exports = registry;
