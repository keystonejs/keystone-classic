var demand = require('must'),
	CodeType = require('../CodeType');

exports.initList = function(List) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType }
		},
		lang: {
			type: CodeType,
			lang: 'c'
		},
		language: {
			type: CodeType,
			lang: 'js'
		},
		codemirror: {
			type: CodeType,
			lang: 'html',
			codemirror: {
				value: 'fooga'
			}
		}
	});
};

exports.createData = function(List) {

};

exports.testFilters = function(List) {

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
	
	it('should support a `codemirror` config property', function() {
		demand(List.fields.codemirror.codemirror).be.object();
		demand(List.fields.codemirror.codemirror.value).be('fooga');
	});
	
	it('should merge the `lang` and `codemirror` config properties', function() {
		demand(List.fields.codemirror.editor).be.object();
		demand(List.fields.codemirror.editor.mode).be('html');
		demand(List.fields.codemirror.editor.value).be('fooga');
	});
};
