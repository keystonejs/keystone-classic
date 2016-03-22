var demand = require('must');
var PasswordType = require('../PasswordType');

exports.initList = function (List) {
	List.add({
		password: PasswordType,
	});
};

exports.testFieldType = function (List) {
	describe('addFilterToQuery', function () {
		it('should filter for existing values', function () {
			var result = List.fields.password.addFilterToQuery({
				exists: true,
			});
			demand(result.password).eql({
				$ne: null,
			});
		});

		it('should filter for non-existing values', function () {
			var result = List.fields.password.addFilterToQuery({
				exists: false,
			});
			demand(result.password).eql(null);
		});
	});
};
