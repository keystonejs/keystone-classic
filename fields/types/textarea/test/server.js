var demand = require('must');
var TextareaType = require('../TextareaType');

exports.initList = function (List) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
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

	it('should format to HTML', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foo\nbar',
		}, function () {
			demand(testItem._.text.format()).be('foo<br>bar');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with a length', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5)).be('fooba');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with a length and custom append string', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5, '...')).be('fooba...');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with and preserve words with a length, custom append string', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foo bar lol',
		}, function () {
			demand(testItem._.text.crop(5, '...', true)).be('foo bar...');
			testItem.text = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.text.validateInput({ text: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
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
