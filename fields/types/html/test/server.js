var demand = require('must');
var HtmlType = require('../HtmlType');

exports.initList = function (List) {
	List.add({
		html: { type: HtmlType },
		nested: {
			html: { type: HtmlType },
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
		List.fields.html.updateItem(testItem, {
			html: 'foobar',
		}, function () {
			demand(testItem.html).be('foobar');
			testItem.html = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.html'].updateItem(testItem, {
			nested: {
				html: 'foobar',
			},
		}, function () {
			demand(testItem.nested.html).be('foobar');
			testItem.nested.html = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.html'].updateItem(testItem, {
			'nested.html': 'foobar',
		}, function () {
			demand(testItem.nested.html).be('foobar');
			testItem.nested.html = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.html.validateInput({ html: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.html.validateRequiredInput(this, { html: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.html.validateRequiredInput(this, { html: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
