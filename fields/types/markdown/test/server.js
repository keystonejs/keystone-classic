var demand = require('must');
var MarkdownType = require('../MarkdownType');

exports.initList = function (List) {
	List.add({
		markdown: { type: MarkdownType },
		nested: {
			markdown: { type: MarkdownType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.markdown.updateItem(testItem, {
			markdown: 'foobar',
		}, function () {
			demand(testItem.markdown.html).be('<p>foobar</p>\n');
			testItem.markdown = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.markdown'].updateItem(testItem, {
			nested: {
				markdown: 'foobar',
			},
		}, function () {
			demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
			testItem.nested.markdown = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.markdown'].updateItem(testItem, {
			'nested.markdown': 'foobar',
		}, function () {
			demand(testItem.nested.markdown.html).be('<p>foobar</p>\n');
			testItem.nested.markdown = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.markdown.validateInput({ markdown: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.markdown.validateRequiredInput(this, { markdown: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.markdown.validateRequiredInput(this, { markdown: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
