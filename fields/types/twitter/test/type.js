var demand = require('must');
var TwitterType = require('../TwitterType');
var TextType = require('../../text/TextType');

// function customFormat (url) {
// 	return url.toUpperCase();
// }

exports.initList = function (List) {
	List.add({
		twitter: TwitterType,
		nested: {
			twitter: TwitterType,
		},
		// customFormat: { type: UrlType, format: customFormat },
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.twitter.updateItem(testItem, {
				twitter: 'value',
			}, function () {
				demand(testItem.twitter).be('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.twitter'].updateItem(testItem, {
				nested: {
					twitter: 'value',
				},
			}, function () {
				demand(testItem.nested.twitter).be('value');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.twitter'].updateItem(testItem, {
				'nested.twitter': 'value',
			}, function () {
				demand(testItem.nested.twitter).be('value');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.twitter.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.twitter.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.twitter.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', function () {
		it('should strip the protocol when formatting', function (done) {
			var testItem = new List.model();
			List.fields.twitter.updateItem(testItem, {
				twitter: 'http://www.keystonejs.com',
			}, function () {
				demand(testItem._.twitter.format()).be('www.keystonejs.com');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate bare username without \'@\'', function (done) {
			List.fields.twitter.validateInput({ twitter: 'username' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate twitter username with \'@\'', function (done) {
			List.fields.twitter.validateInput({ twitter: '@username' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.twitter.validateInput({ twitter: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.twitter.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.twitter.validateInput({ twitter: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate full twitter URL', function (done) {
			List.fields.twitter.validateInput({ twitter: 'https://twitter.com/xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate full twitter URL including \'@\'', function (done) {
			List.fields.twitter.validateInput({ twitter: 'https://twitter.com/@xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate twitter URL without protocol', function (done) {
			List.fields.twitter.validateInput({ twitter: 'twitter.com/xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate twitter URL without protocol including \'@\'', function (done) {
			List.fields.twitter.validateInput({ twitter: 'twitter.com/@xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate twitter URL with \'www\'', function (done) {
			List.fields.twitter.validateInput({ twitter: 'https://www.twitter.com/xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate twitter URL with http protocol', function (done) {
			List.fields.twitter.validateInput({ twitter: 'http://twitter.com/xyzcoode' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.twitter.validateInput({ twitter: 1 }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.twitter.validateInput({ twitter: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.twitter.validateInput({ twitter: [1, 2, 3] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.twitter.validateInput({ twitter: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.twitter.validateInput({ twitter: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.twitter.validateInput({ twitter: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.twitter.validateInput({ twitter: Date.now() }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate URL to other domain than twitter', function (done) {
			List.fields.twitter.validateInput({ twitter: 'http://www.google.com' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate twitter homepage URL without username', function (done) {
			List.fields.twitter.validateInput({ twitter: 'http://www.twitter.com' }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});
};
