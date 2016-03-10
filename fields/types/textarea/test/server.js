var demand = require('must');
var TextareaType = require('../TextareaType');
var validators = require('../../validators');
exports.initList = function (List) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
		},
	});
};

exports.testFieldType = function (List) {
	it('should update top level fields', function (done) {
		var testItem = new List.model();
		List.fields.text.updateItem(testItem, {
			text: 'value',
		}, function () {
			demand(testItem.text).be('value');
			done();
		});
	});

	it('should update nested fields', function (done) {
		var testItem = new List.model();
		List.fields['nested.text'].updateItem(testItem, {
			nested: {
				text: 'value',
			},
		}, function () {
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		var testItem = new List.model();
		List.fields['nested.text'].updateItem(testItem, {
			'nested.text': 'value',
		}, function () {
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
			done();
		});
	});

	it('should format to HTML', function (done) {
		var testItem = new List.model();
		List.fields.text.updateItem(testItem, {
			text: 'foo\nbar',
		}, function () {
			demand(testItem._.text.format()).be('foo<br>bar');
			done();
		});
	});

	it('should truncate text with a length', function (done) {
		var testItem = new List.model();
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5)).be('fooba');
			done();
		});
	});

	it('should truncate text with a length and custom append string', function (done) {
		var testItem = new List.model();
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5, '...')).be('fooba...');
			done();
		});
	});

	it('should truncate text with and preserve words with a length, custom append string', function (done) {
		var testItem = new List.model();
		List.fields.text.updateItem(testItem, {
			text: 'foo bar lol',
		}, function () {
			demand(testItem._.text.crop(5, '...', true)).be('foo bar...');
			done();
		});
	});

	it('should use the common text input validator', function () {
		demand(List.fields.text.validateInput === validators.text.input);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.text.validateRequiredInput === validators.text.required);
	});
};
