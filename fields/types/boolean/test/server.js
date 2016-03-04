var demand = require('must');

exports.initList = function (List) {
	List.add({
		bool: { type: Boolean, note: 'This is a boolean field' },
		indented: { type: Boolean, indent: true },
		nested: {
			bool: { type: Boolean },
		},
		defaultFalse: { type: Boolean, default: false },
		defaultTrue: { type: Boolean, default: true },
		required: { type: Boolean, required: true },
		initial: { type: Boolean, initial: true },
		requiredInitial: { type: Boolean, required: true, initial: true },
		initialDefaultTrue: { type: Boolean, initial: true, default: true },
		collapse: { type: Boolean, collapse: true },
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should be true when passed the boolean true', function (done) {
		List.fields.bool.updateItem(testItem, {
			bool: true,
		}, function () {
			demand(testItem.bool).be.true();
			testItem.bool = undefined;
			done();
		});
	});

	it('should be true when passed the string "true"', function (done) {
		List.fields.bool.updateItem(testItem, {
			bool: 'true',
		}, function () {
			demand(testItem.bool).be.true();
			testItem.bool = undefined;
			done();
		});
	});

	it('should be false when passed the boolean false', function (done) {
		List.fields.bool.updateItem(testItem, {
			bool: false,
		}, function () {
			demand(testItem.bool).be.false();
			testItem.bool = undefined;
			done();
		});
	});

	it('should be false when passed the string "false"', function (done) {
		List.fields.bool.updateItem(testItem, {
			bool: 'false',
		}, function () {
			demand(testItem.bool).be.false();
			testItem.bool = undefined;
			done();
		});
	});

	it('should be false when passed undefined', function (done) {
		List.fields.bool.updateItem(testItem, {}, function () {
			demand(testItem.bool).be.false();
			testItem.bool = undefined;
			done();
		});
	});

	it('should be false when passed an empty string', function (done) {
		List.fields.bool.updateItem(testItem, {
			bool: '',
		}, function () {
			demand(testItem.bool).be.false();
			testItem.bool = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.bool'].updateItem(testItem, {
			nested: {
				bool: true,
			},
		}, function () {
			demand(testItem.nested.bool).be.true();
			testItem.nested.bool = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.bool'].updateItem(testItem, {
			'nested.bool': true,
		}, function () {
			demand(testItem.nested.bool).be.true();
			testItem.nested.bool = undefined;
			done();
		});
	});

	// TODO: these should be updated to test the new validateInput() and
	// validateRequiredInput() methods

	it('should always validate when not required', function () {
		demand(List.fields.bool.inputIsValid({ bool: 'true' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: true }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: 'false' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: false }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: '' }, false)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: undefined }, false)).be(true);
	});

	it('should validate input properly when required', function () {
		demand(List.fields.bool.inputIsValid({ bool: 'true' }, true)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: true }, true)).be(true);
		demand(List.fields.bool.inputIsValid({ bool: 'false' }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: false }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: '' }, true)).be(false);
		demand(List.fields.bool.inputIsValid({ bool: undefined }, true)).be(false);
	});


	// So is this duplicating the above now deprecated function?
	// it('should validate boolean input', function () {
	// 	List.fields.text.validateInput({ bool: true }, function (result) {
	// 		demand(result).be(true);
	// 	});
	// });
};
