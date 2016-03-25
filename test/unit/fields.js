var fs = require('fs');
var keystone = require('../../index.js');
var path = require('path');

keystone.init();

var typesLoc = path.resolve('fields/types');
var types = fs.readdirSync(typesLoc);

types.forEach(function (name) {
	var typeTestLoc = typesLoc + '/' + name + '/test/type.js';
	if (!fs.existsSync(typeTestLoc)) return;

	// nocreate option prevents warnings for required / not initial fields
	var List = keystone.List(name + 'Test', { nocreate: true });
	var test = require(typeTestLoc);

	if (test.initList) {
		test.initList(List);
	}

	List.register();

	if (test.testFieldType) {
		describe('FieldType ' + name, function () {
			before(function (done) {
				List.model.remove().exec(done);
			});
			test.testFieldType(List);
		});
	}
});
