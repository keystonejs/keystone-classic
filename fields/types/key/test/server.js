var demand = require('must');
var KeyType = require('../KeyType');

exports.initList = function (List) {
	List.add({
		key: { type: KeyType },
		customSeparator: { type: KeyType, separator: '$' },
		nested: {
			key: { type: KeyType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.key.updateItem(testItem, {
			key: 'foobar',
		}, function () {
			demand(testItem.key).be('foobar');
			testItem.key = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.key'].updateItem(testItem, {
			nested: {
				key: 'foobar',
			},
		}, function () {
			demand(testItem.nested.key).be('foobar');
			testItem.nested.key = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.key'].updateItem(testItem, {
			'nested.key': 'foobar',
		}, function () {
			demand(testItem.nested.key).be('foobar');
			testItem.nested.key = undefined;
			done();
		});
	});

	it('generateKey should return a slug of the provided string', function () {
		List.fields.key.generateKey('A b ç').must.be('a-b-c');
	});

	it('should invalidate input with stripped characters', function () {
		List.fields.key.inputIsValid({
			key: '()',
		}, true, testItem).must.be.false();
	});

	it('should invalidate input with just whitespace', function () {
		List.fields.key.inputIsValid({
			key: ' ',
		}, true, testItem).must.be.false();
	});

	it('should validate input with non-key characters', function () {
		List.fields.key.inputIsValid({
			key: 'A b',
		}, true, testItem).must.be.true();
	});

	it('should update the item with a slugified value', function (done) {
		List.fields.key.updateItem(testItem, {
			key: 'A b ç',
		}, function () {
			demand(testItem.key).be('a-b-c');
			testItem.key = undefined;
			done();
		});
	});

	it('should use the separator option for the slugified value', function (done) {
		List.fields.customSeparator.updateItem(testItem, {
			customSeparator: 'A b ç',
		}, function () {
			demand(testItem.customSeparator).be('a$b$c');
			testItem.customSeparator = undefined;
			done();
		});
	});

};
