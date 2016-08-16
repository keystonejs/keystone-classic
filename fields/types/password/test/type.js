var demand = require('must');
var PasswordType = require('../PasswordType');

exports.initList = function (List) {
	List.add({
		password: PasswordType,
		minChar: {
			type: PasswordType,
			min: 6,
		},

		maxFalse: {
			type: PasswordType,
			max: false,
		},

		digitChar: {
			type: PasswordType,
			complexity: {
				digitChar: true,
			},
		},

		spChar: {
			type: PasswordType,
			complexity: {
				spChar: true,
			},
		},

		asciiChar: {
			type: PasswordType,
			complexity: {
				asciiChar: true,
			},
		},

		lowChar: {
			type: PasswordType,
			complexity: {
				lowChar: true,
			},
		},

		upperChar: {
			type: PasswordType,
			complexity: {
				upperChar: true,
			},
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update password if specified', function (done) {
			var testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password: 'asdf',
			}, function () {
				demand(testItem.password).be('asdf');
				done();
			});
		});

		it('should update password with hash if specified', function (done) {
			var testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password_hash: '12asdf34',
			}, function () {
				demand(testItem.password).be('12asdf34');
				done();
			});
		});

		it('should update password if both password and hash specified', function (done) {
			var testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, function () {
				demand(testItem.password).be('asdf');
				done();
			});
		});

		it('should clear password if passed password is null', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password: null,
			}, function () {
				demand(testItem.password).be.null();
				done();
			});
		});

		it('should clear password if passed hash is null', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password_hash: null,
			}, function () {
				demand(testItem.password).be.null();
				done();
			});
		});

		it('should clear password if passed password is empty string', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password: '',
			}, function () {
				demand(testItem.password).be('');
				done();
			});
		});

		it('should clear password if passed hash is empty string', function (done) {
			var testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password_hash: '',
			}, function () {
				demand(testItem.password).be('');
				done();
			});
		});

		it('should not update if neither password nor hash specified', function (done) {
			var testItem = new List.model();
			List.fields.password.updateItem(testItem, {}, function () {
				demand(testItem.password).be.undefined();
				done();
			});
		});
	});

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
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.password.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.password.validateInput({
				password: null,
				password_confirm: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty string confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate null confirmation value', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate password longer than 72 characters when max is set to false', function (done) {
			List.fields.maxFalse.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one digit when digits are required', function (done) {
			List.fields.digitChar.validateInput({
				digitChar: 'digits123',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one special char when spchars are required', function (done) {
			List.fields.spChar.validateInput({
				spChar: 'specialchars!&',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with ASCII chars only when ASCII only is required', function (done) {
			List.fields.asciiChar.validateInput({
				asciiChar: 'asciionly',
			}, function (result, detail) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one lowercase char when lowercase is required', function (done) {
			List.fields.lowChar.validateInput({
				lowChar: 'lowercase123',
			}, function (result, detail) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one uppercase char when uppercase is required', function (done) {
			List.fields.upperChar.validateInput({
				upperChar: 'UpperCase',
			}, function (result, detail) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate mismatching values', function (done) {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: 'notsomething',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate empty string password value', function (done) {
			List.fields.password.validateInput({
				password: '',
				password_confirm: 'something',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password value', function (done) {
			List.fields.password.validateInput({
				password: null,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined password value', function (done) {
			List.fields.password.validateInput({
				password: undefined,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true password value', function (done) {
			List.fields.password.validateInput({
				password: true,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate false password value', function (done) {
			List.fields.password.validateInput({
				password: false,
				password_confirm: 'something',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password shorter than min characters', function (done) {
			List.fields.minChar.validateInput({
				minChar: '1234',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password longer than 72 characters', function (done) {
			List.fields.password.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password with no digits when digits are required', function (done) {
			List.fields.digitChar.validateInput({
				digitChar: 'nodigits',
			}, function (result, detail) {
				demand(result).be.false();
				demand(detail).be('enter at least one digit\n');
				done();
			});
		});

		it('should invalidate password with no special characters when spchars are required', function (done) {
			List.fields.spChar.validateInput({
				spChar: 'nospecialchars',
			}, function (result, detail) {
				demand(result).be.false();
				demand(detail).be('enter at least one special character\n');
				done();
			});
		});

		it('should invalidate password with non-ASCII chars when ASCII is required', function (done) {
			List.fields.asciiChar.validateInput({
				asciiChar: 'םגפשבך',
			}, function (result, detail) {
				demand(result).be.false();
				demand(detail).be('only ASCII characters are allowed\n');
				done();
			});
		});

		it('should invalidate password with no lowercase chars when lowercase is required', function (done) {
			List.fields.lowChar.validateInput({
				lowChar: 'NOLOWERCASE',
			}, function (result, detail) {
				demand(result).be.false();
				demand(detail).be('use at least one lower case character\n');
				done();
			});
		});

		it('should invalidate password with no uppercase chars when uppercase is required', function (done) {
			List.fields.upperChar.validateInput({
				upperChar: 'nouppercase',
			}, function (result, detail) {
				demand(result).be.false();
				demand(detail).be('use at least one upper case character\n');
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
			demand(result.password).be.null();
		});
	});

	describe('invalid complexity options', function () {
		it('should throw an error when non-existing complexity options are passed', function (done) {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							doesntExist: true,
						},
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options.complexity - option does not exist.');
				done();
			}
		});
		it('should throw an error when a non-boolean value is passed for complexity options', function (done) {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							spChar: 'squirrel',
						},
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options.complexity - Value must be boolean.');
				done();
			}
		});
	});

	describe('max less than min', function () {
		it('should throw an error when max value is set lower than min', function (done) {
			try {
				List.add({
					minmax: {
						type: PasswordType,
						min: 20,
						max: 12,
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options - min must be set at a lower value than max.');
				done();
			}
		});
	});
};
