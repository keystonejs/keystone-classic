var fs = require('fs'),
	keystone = require('../index');

exports.init = function (shouldRunTests) {
	keystone.init();

	var typesLoc = __dirname + '/../fields/types';
	var types = fs.readdirSync(typesLoc);

	types.forEach(function(name) {
		var serverTestLoc = typesLoc + '/' + name + '/test/server.js';
		if (!fs.existsSync(serverTestLoc)) return;

		var List = keystone.List(name + "Test", { nocreate: true });
		var test = require(serverTestLoc);

		if (test.initList) {
			test.initList(List);
		}

		List.register();

		if (shouldRunTests && test.testFieldType) {
			describe(name, function () {
				test.testFieldType(List);
			});
		}
	});
};
