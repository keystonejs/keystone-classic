var demand = require('must'),
	CodeMirrorType = require('../CodeMirrorType');

exports.initList = function(List) {
	List.add({
		nested: {
			codemirror: { type: CodeMirrorType }
		},
		lang: {
			type: CodeMirrorType,
			lang: 'c'
		},
		language: {
			type: CodeMirrorType,
			lang: 'js'
		},
		codemirror: {
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
		List.fields.codemirror.updateItem(testItem, {
			codemirror: 'foo(bar);'
		});
		demand(testItem.codemirror).be('foo(bar);');
		testItem.codemirror = undefined;
	});

	it('should update nested fields', function() {
		List.fields['nested.codemirror'].updateItem(testItem, {
			nested: {
				codemirror: 'foo(bar);'
			}
		});
		demand(testItem.nested.codemirror).be('foo(bar);');
		testItem.nested.codemirror = undefined;
	});

	it('should update nested fields with flat paths', function() {
		List.fields['nested.codemirror'].updateItem(testItem, {
			'nested.codemirror': 'foo(bar);'
		});
		demand(testItem.nested.codemirror).be('foo(bar);');
		testItem.nested.codemirror = undefined;
	});

	it('should handle a `lang` config property', function() {
		demand(List.fields.lang.lang).be('c');
	});

	it('should handle a `language` config property', function() {
		demand(List.fields.language.lang).be('js');
	});

	it('should support a `codemirror` config property', function() {
		demand(List.fields.codemirror.config).be.object();
		demand(List.fields.codemirror.config.value).be('fooga');
	});

	it('should merge the `lang` and `codemirror` config properties', function() {
		demand(List.fields.codemirror.editor).be.object();
		demand(List.fields.codemirror.editor.mode).be('html');
		demand(List.fields.codemirror.editor.value).be('fooga');
	});
};
