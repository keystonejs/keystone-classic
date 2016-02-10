var demand = require('must');
var TextareaType = require('../TextareaType');

exports.initList = function (List) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'value',
		}, function () {
			demand(testItem.text).be('value');
			testItem.text = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
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
		List.fields['nested.text'].updateItem(testItem, {
			'nested.text': 'value',
		}, function () {
			demand(testItem.nested.text).be('value');
			testItem.nested.text = undefined;
			done();
		});
	});

	it('should format to HTML', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foo\nbar',
		}, function () {
			demand(testItem._.text.format()).be('foo<br>bar');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with a length', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5)).be('fooba');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with a length and custom append string', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foobar',
		}, function () {
			demand(testItem._.text.crop(5, '...')).be('fooba...');
			testItem.text = undefined;
			done();
		});
	});

	it('should truncate text with and preserve words with a length, custom append string', function (done) {
		List.fields.text.updateItem(testItem, {
			text: 'foo bar lol',
		}, function () {
			demand(testItem._.text.crop(5, '...', true)).be('foo bar...');
			testItem.text = undefined;
			done();
		});
	});
};
