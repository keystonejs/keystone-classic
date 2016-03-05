var demand = require('must');

exports.initList = function (List) {
	List.add({
		text: String,
		nested: {
			text: String,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'value',
		}, function () {
			demand(testItem.text).be('value');
			testItem.text = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.text'].updateItem(testItem, {
			nested: {
				text: 'value',
			},
		}, function () {
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.text'].updateItem(testItem, {
			'nested.text': 'value',
		}, function () {
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		List.fields.text.validateInput({ text: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		List.fields.text.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		List.fields.text.validateInput({ text: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		List.fields.text.validateInput({ text: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		List.fields.text.validateInput({ text: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		List.fields.text.validateInput({ text: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		List.fields.text.validateInput({ text: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		List.fields.text.validateInput({ text: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		List.fields.text.validateInput({ text: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		List.fields.text.validateInput({ text: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.text.validateRequiredInput(this, { text: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.text.validateRequiredInput(this, { text: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
