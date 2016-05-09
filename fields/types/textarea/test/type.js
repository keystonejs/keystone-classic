var demand = require('must');
var TextareaType = require('../TextareaType');
var TextType = require('../../text/TextType');

exports.initList = function (List) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
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
	});

	it('should use the common text input validator', function () {
		demand(List.fields.text.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', function () {
		demand(List.fields.text.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', function () {
		demand(List.fields.text.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', function () {
		it('should format to HTML', function () {
			var testItem = new List.model({
				text: 'hello\nworld',
			});
			demand(testItem._.text.format()).be('hello<br>world');
		});
	});

	describe('crop', function () {
		it('should truncate text with a length', function () {
			var testItem = new List.model({
				text: 'helloworld',
			});
			demand(testItem._.text.crop(7)).be('hellowo');
		});

		it('should truncate text with a length and custom append string', function () {
			var testItem = new List.model({
				text: 'helloworld',
			});
			demand(testItem._.text.crop(7, '$')).be('hellowo$');
		});

		it('should truncate text with and preserve words with a length, custom append string', function () {
			var testItem = new List.model({
				text: 'hello world something',
			});
			demand(testItem._.text.crop(7, '...', true)).be('hello world...');
		});
	});
};
