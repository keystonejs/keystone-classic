var demand = require('must');
var CodeType = require('../CodeType');
var TextType = require('../../text/TextType');

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
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.code.updateItem(testItem, {
				code: 'foo(bar);',
			}, function () {
				demand(testItem.code).be('foo(bar);');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.code'].updateItem(testItem, {
				nested: {
					code: 'foo(bar);',
				},
			}, function () {
				demand(testItem.nested.code).be('foo(bar);');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.code'].updateItem(testItem, {
				'nested.code': 'foo(bar);',
			}, function () {
				demand(testItem.nested.code).be('foo(bar);');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.code.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.code.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery', function () {
		demand(List.fields.code.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('properties', function () {
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
	});
};
