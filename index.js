var moduleRoot = require('./lib/core/getModulePath')(module.parent || module);
var registry = require('./registry');
var singleton = registry.create('exposed', moduleRoot);
module.exports = exports = singleton;
