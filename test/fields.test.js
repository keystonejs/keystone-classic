var fs = require('fs');
var keystone = require('../index');
var path = require('path');

keystone.init();

var typesLoc = path.resolve('fields/types');
var types = fs.readdirSync(typesLoc);

types.forEach(function(name) {
	var serverTestLoc = typesLoc + '/' + name + '/test/server.js';
	if (!fs.existsSync(serverTestLoc)) return;

	// nocreate option prevents warnings for required / not initial fields
	var List = keystone.List(name + 'Test', { nocreate: true });
	var test = require(serverTestLoc);

	if (test.initList) {
		test.initList(List);
	}

	List.register();

	if (test.testFieldType) {
		describe(name, function () {
			test.testFieldType(List);
		});
	}
});
