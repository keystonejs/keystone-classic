var fs = require('fs');
var keystone = require('../../index.js');
var path = require('path');

keystone.init();

var typesLoc = path.resolve('fields/types');
var types = fs.readdirSync(typesLoc);

types.forEach(function (name) {
	var typeTestPath = typesLoc + '/' + name + '/test/type.js';
	if (!fs.existsSync(typeTestPath)) return;

	// nocreate option prevents warnings for required / not initial fields
	var List = keystone.List(name + 'Test', { nocreate: true });
	var test = require(typeTestPath);

	test.initList(List);
	List.register();
	describe('FieldType: ' + name.substr(0,1).toUpperCase() + name.substr(1), function () {
		before(function (done) {
			List.model.remove().exec(done);
		});
		test.testFieldType(List);
	});
});
