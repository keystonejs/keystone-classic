var demand = require('must'),
	CodeMirrorType = require('../CodeMirrorType');

exports.initList = function(List) {
	List.add({
		code: { type: CodeMirrorType },
		nested: {
			code: { type: CodeMirrorType }
		},
		lang: {
			type: CodeMirrorType,
			lang: 'c'
		},
		language: {
			type: CodeMirrorType,
			lang: 'js'
		},
		config: {
			type: CodeMirrorType,
			lang: 'html',
			config: {
				value: 'fooga'
			}
		}
	});
};

exports.createData = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFilters = function(List) {//eslint-disable-line no-unused-vars

};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should update top level fields', function() {
		List.fields.code.updateItem(testItem, {
			code: 'foo(bar);'
		});
		demand(testItem.code).be('foo(bar);');
		testItem.code = undefined;
	});

	it('should update nested fields', function() {
		List.fields['nested.code'].updateItem(testItem, {
			nested: {
				code: 'foo(bar);'
			}
		});
		demand(testItem.nested.code).be('foo(bar);');
		testItem.nested.code = undefined;
	});

	it('should update nested fields with flat paths', function() {
		List.fields['nested.code'].updateItem(testItem, {
			'nested.code': 'foo(bar);'
		});
		demand(testItem.nested.code).be('foo(bar);');
		testItem.nested.code = undefined;
	});

	it('should handle a `lang` config property', function() {
		demand(List.fields.lang.lang).be('c');
	});

	it('should handle a `language` config property', function() {
		demand(List.fields.language.lang).be('js');
	});

	it('should support a config property', function() {
		demand(List.fields.config.config).be.object();
		demand(List.fields.config.config.value).be('fooga');
	});

	it('should merge the `lang` and `codemirror` config properties', function() {
		demand(List.fields.config.editor).be.object();
		demand(List.fields.config.editor.mode).be('html');
		demand(List.fields.config.editor.value).be('fooga');
	});
};
