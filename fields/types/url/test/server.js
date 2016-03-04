var demand = require('must');
var UrlType = require('../UrlType');

exports.initList = function (List) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.url.updateItem(testItem, {
			url: 'value',
		}, function () {
			demand(testItem.url).be('value');
			testItem.url = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.url'].updateItem(testItem, {
			nested: {
				url: 'value',
			},
		}, function () {
			demand(testItem.nested.url).be('value');
			testItem.nested.url = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.url'].updateItem(testItem, {
			'nested.url': 'value',
		}, function () {
			demand(testItem.nested.url).be('value');
			testItem.nested.url = undefined;
			done();
		});
	});

	it('should strip the protocol when formatting', function (done) {
		List.fields.url.updateItem(testItem, {
			url: 'http://www.keystonejs.com',
		}, function () {
			demand(testItem._.url.format()).be('www.keystonejs.com');
			testItem.url = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.url.validateInput({ url: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.url.validateRequiredInput(this, { url: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.url.validateRequiredInput(this, { url: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
