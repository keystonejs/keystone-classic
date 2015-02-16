var assert = require('assert'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler'),
	CodeType = require('../CodeType');

exports.initList = function(List) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType }
		},
		cCode: { type: CodeType, lang: 'c' },
		cPlusPlusCode: { type: CodeType, lang: 'c++' },
		objectivecCode: { type: CodeType, lang: 'objectivec' },
		cssCode: { type: CodeType, lang: 'css' },
		aspCode: { type: CodeType, lang: 'asp' },
		cSharpCode: { type: CodeType, lang: 'c#' },
		vbCode: { type: CodeType, lang: 'vb' },
		xmlCode: { type: CodeType, lang: 'xml' },
		phpCode: { type: CodeType, lang: 'php' },
		htmlCode: { type: CodeType, lang: 'html' },
		iniCode: { type: CodeType, lang: 'ini' },
		jsCode: { type: CodeType, lang: 'js' },
		javaCode: { type: CodeType, lang: 'java' },
		coffeeCode: { type: CodeType, lang: 'coffee' },
		lispCode: { type: CodeType, lang: 'lisp' },
		perlCode: { type: CodeType, lang: 'perl' },
		pythonCode: { type: CodeType, lang: 'python' },
		sqlCode: { type: CodeType, lang: 'sql' },
		jsonCode: { type: CodeType, lang: 'json' },
		lessCode: { type: CodeType, lang: 'less' },
		sassCode: { type: CodeType, lang: 'sass' },
		shCode: { type: CodeType, lang: 'sh' },
		rubyCode: { type: CodeType, lang: 'ruby' },
		jspCode: { type: CodeType, lang: 'jsp' },
		tplCode: { type: CodeType, lang: 'tpl' },
		jadeCode: { type: CodeType, lang: 'jade' },
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
	
	it('should properly infer mime type', function() {
		demand(List.fields.cCode.mime).be('text/x-csrc');
		demand(List.fields.cPlusPlusCode.mime).be('text/x-c++src');
		demand(List.fields.objectivecCode.mime).be('text/x-c++src');
		demand(List.fields.cssCode.mime).be('text/css');
		demand(List.fields.aspCode.mime).be('application/x-aspx');
		demand(List.fields.cSharpCode.mime).be('text/x-csharp');
		demand(List.fields.vbCode.mime).be('text/x-vb');
		demand(List.fields.xmlCode.mime).be('text/xml');
		demand(List.fields.phpCode.mime).be('application/x-httpd-php');
		demand(List.fields.htmlCode.mime).be('text/html');
		demand(List.fields.iniCode.mime).be('text/x-properties');
		demand(List.fields.jsCode.mime).be('text/javascript');
		demand(List.fields.javaCode.mime).be('text/x-java');
		demand(List.fields.coffeeCode.mime).be('text/x-coffeescript');
		demand(List.fields.lispCode.mime).be('text/x-common-lisp');
		demand(List.fields.perlCode.mime).be('text/x-perl');
		demand(List.fields.pythonCode.mime).be('text/x-python');
		demand(List.fields.sqlCode.mime).be('text/x-sql');
		demand(List.fields.jsonCode.mime).be('application/json');
		demand(List.fields.lessCode.mime).be('text/x-less');
		demand(List.fields.sassCode.mime).be('text/x-sass');
		demand(List.fields.shCode.mime).be('text/x-sh');
		demand(List.fields.rubyCode.mime).be('text/x-ruby');
		demand(List.fields.jspCode.mime).be('application/x-jsp');
		demand(List.fields.tplCode.mime).be('text/x-smarty');
		demand(List.fields.jadeCode.mime).be('text/x-jade');
	});
};
