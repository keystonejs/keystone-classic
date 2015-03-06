var demand = require('must'),
	CodeType = require('../CodeType');

exports.initList = function(List) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType }
		},
		cCode: { type: CodeType, editor: { mode : 'c' } },
		cPlusPlusCode: { type: CodeType, editor: { mode : 'c++' } },
		objectivecCode: { type: CodeType, editor: { mode : 'objectivec' } },
		cssCode: { type: CodeType, editor: { mode : 'css' } },
		aspCode: { type: CodeType, editor: { mode : 'asp' } },
		cSharpCode: { type: CodeType, editor: { mode : 'c#' } },
		vbCode: { type: CodeType, editor: { mode : 'vb' } },
		xmlCode: { type: CodeType, editor: { mode : 'xml' } },
		phpCode: { type: CodeType, editor: { mode : 'php' } },
		htmlCode: { type: CodeType, editor: { mode : 'html' } },
		iniCode: { type: CodeType, editor: { mode : 'ini' } },
		jsCode: { type: CodeType, editor: { mode : 'js' } },
		javaCode: { type: CodeType, editor: { mode : 'java' } },
		coffeeCode: { type: CodeType, editor: { mode : 'coffee' } },
		lispCode: { type: CodeType, editor: { mode : 'lisp' } },
		perlCode: { type: CodeType, editor: { mode : 'perl' } },
		pythonCode: { type: CodeType, editor: { mode : 'python' } },
		sqlCode: { type: CodeType, editor: { mode : 'sql' } },
		jsonCode: { type: CodeType, editor: { mode : 'json' } },
		lessCode: { type: CodeType, editor: { mode : 'less' } },
		sassCode: { type: CodeType, editor: { mode : 'sass' } },
		shCode: { type: CodeType, editor: { mode : 'sh' } },
		rubyCode: { type: CodeType, editor: { mode : 'ruby' } },
		jspCode: { type: CodeType, editor: { mode : 'jsp' } },
		tplCode: { type: CodeType, editor: { mode : 'tpl' } },
		jadeCode: { type: CodeType, editor: { mode : 'jade' } },
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
