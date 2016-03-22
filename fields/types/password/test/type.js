var demand = require('must');
var PasswordType = require('../PasswordType');

exports.initList = function (List) {
	List.add({
		password: PasswordType,
	});
};

exports.testFieldType = function (List) {
	describe('validateInput', function () {
		it('should validate a matching password- and confirm value', function (done) {
			List.fields.password.validateInput({
				password: 'asdf',
				password_confirm: 'asdf',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate emtpy string input', function (done) {
			List.fields.password.validateInput({
				password: '',
				password_confirm: '',
			}, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.password.validateInput({}, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.password.validateInput({
				password: null,
				password_confirm: null,
			}, function (result) {
				demand(result).be(true);
				done();
			});
		});

		it('should invalidate mismatching values', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: 'notsomething',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate empty string confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: '',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate null confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: null,
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate undefined confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: undefined,
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate true confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: true,
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate true confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: false,
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate empty string password value', function (done) {
			List.fields.password.validateInput({
				password: '',
				password_confirm: 'something',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate null password value', function (done) {
			List.fields.password.validateInput({
				password: null,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate undefined password value', function (done) {
			List.fields.password.validateInput({
				password: undefined,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate true password value', function (done) {
			List.fields.password.validateInput({
				password: true,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});

		it('should invalidate true password value', function (done) {
			List.fields.password.validateInput({
				password: false,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be(false);
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate a hash value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: '12asdf34',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a password value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: 'asdf',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a password and hash value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined password and hash values if a value exists already', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined password and hash values', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty password value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash and password value', function (done) {
			var testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash and password value even if a value exists', function (done) {
			var testItem = new List.model({
				password: 'blabla',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password value even if a value exists', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null hash value even if a value exists', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password and hash value even if a value exists', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: null,
				password_hash: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

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
