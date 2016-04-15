var demand = require('must');
var EmailType = require('../EmailType');
var TextType = require('../../text/TextType');

exports.initList = function (List) {
	List.add({
		email: { type: EmailType },
		nested: {
			email: { type: EmailType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.email.updateItem(testItem, {
				email: 'sebastian@thinkmill.com.au',
			}, function () {
				demand(testItem.email).be('sebastian@thinkmill.com.au');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.email'].updateItem(testItem, {
				nested: {
					email: 'sebastian@thinkmill.com.au',
				},
			}, function () {
				demand(testItem.nested.email).be('sebastian@thinkmill.com.au');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.email'].updateItem(testItem, {
				'nested.email': 'sebastian@thinkmill.com.au',
			}, function () {
				demand(testItem.nested.email).be('sebastian@thinkmill.com.au');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate a common email', function (done) {
			List.fields.email.validateInput({ email: 'hello@gmail.com' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an email with a longer TLD', function (done) {
			List.fields.email.validateInput({ email: 'hello@mydomain.solutions' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate emtpy string input', function (done) {
			List.fields.email.validateInput({ email: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.email.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.email.validateInput({ email: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate random string input', function (done) {
			List.fields.email.validateInput({ email: 'asdf123' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate emails without a domain', function (done) {
			List.fields.email.validateInput({ email: 'hello@' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate emails without an identifier', function (done) {
			List.fields.email.validateInput({ email: '@gmail.com' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate emails without a TLD', function (done) {
			List.fields.email.validateInput({ email: 'hello@gmail' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.email.validateInput({ email: 1 }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.email.validateInput({ email: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.email.validateInput({ email: [1, 2, 3] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.email.validateInput({ email: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.email.validateInput({ email: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.email.validateInput({ email: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.email.validateInput({ email: Date.now() }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	it('should use the common text required validator', function () {
		demand(List.fields.email.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.email.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('gravatarUrl', function () {
		var testItem;

		beforeEach(function () {
			testItem = new List.model();
			testItem.email = 'sebastian@thinkmill.com.au';
		});

		it('should return an empty string if no email is specified', function () {
			var testItem2 = new List.model();
			demand(testItem2._.email.gravatarUrl()).be('');
		});

		it('should return the correct url when an email is specified', function () {
			demand(testItem._.email.gravatarUrl()).be('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=identicon&r=g');
		});

		it('should handle the size option', function () {
			demand(testItem._.email.gravatarUrl(50)).be('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=50&d=identicon&r=g');
		});

		it('should handle the defaultImg option', function () {
			demand(testItem._.email.gravatarUrl(null, 'https://avatars1.githubusercontent.com/u/853712')).be('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=https%3A%2F%2Favatars1.githubusercontent.com%2Fu%2F853712&r=g');
		});

		it('should handle the rating option', function () {
			demand(testItem._.email.gravatarUrl(null, null, 'pg')).be('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=identicon&r=pg');
		});
	});

	/* Deprecated inputIsValid method tests */

	it('should properly validate invalid emails', function () {
		demand(List.fields.email.inputIsValid({ email: false }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: null }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: undefined }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: '' }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: 'false' }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: true }, true)).be.false();
		demand(List.fields.email.inputIsValid({ email: 'true' }, true)).be.false();
	});

	it('should properly validate valid emails', function () {
		demand(List.fields.email.inputIsValid({ email: 'example@example.com' })).be.true();
	});
};
