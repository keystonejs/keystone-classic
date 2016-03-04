var demand = require('must');
var CodeType = require('../CodeType');

exports.initList = function (List) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType },
		},
		lang: {
			type: CodeType,
			lang: 'c',
		},
		language: {
			type: CodeType,
			lang: 'js',
		},
		codemirror: {
			type: CodeType,
			lang: 'html',
			codemirror: {
				value: 'codemirror value',
			},
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.code.updateItem(testItem, {
			code: 'foo(bar);',
		}, function () {
			demand(testItem.code).be('foo(bar);');
			testItem.code = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.code'].updateItem(testItem, {
			nested: {
				code: 'foo(bar);',
			},
		}, function () {
			demand(testItem.nested.code).be('foo(bar);');
			testItem.nested.code = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.code'].updateItem(testItem, {
			'nested.code': 'foo(bar);',
		}, function () {
			demand(testItem.nested.code).be('foo(bar);');
			testItem.nested.code = undefined;
			done();
		});
	});

	it('should handle a `lang` config property', function () {
		demand(List.fields.lang.lang).be('c');
	});

	it('should handle a `language` config property', function () {
		demand(List.fields.language.lang).be('js');
	});

	it('should support a `codemirror` config property', function () {
		demand(List.fields.codemirror.codemirror).be.object();
		demand(List.fields.codemirror.codemirror.value).be('codemirror value');
	});

	it('should merge the `lang` and `codemirror` config properties', function () {
		demand(List.fields.codemirror.editor).be.object();
		demand(List.fields.codemirror.editor.mode).be('html');
		demand(List.fields.codemirror.editor.value).be('codemirror value');
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.code.validateInput({ code: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.code.validateRequiredInput(this, { code: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.code.validateRequiredInput(this, { code: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};
