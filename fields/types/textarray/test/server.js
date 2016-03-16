var demand = require('must');
var TextArrayType = require('../TextArrayType');

exports.initList = function (List) {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType,
		},
		customSeparator: { type: TextArrayType, separator: ' * ' },
	});
};

exports.testFieldType = function (List) {
	it('should default to an empty array', function () {
		var testItem = new List.model();
		demand(testItem.get('textarr')).eql([]);
	});

	it('should validate empty arrays as input', function (done) {
		List.fields.textarr.validateInput({ textarr: [] }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate a blank string as input', function (done) {
		List.fields.textarr.validateInput({ textarr: '' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate null input', function (done) {
		List.fields.textarr.validateInput({ textarr: null }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		List.fields.textarr.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate top level fields', function (done) {
		List.fields.textarr.validateInput({
			textarr: ['a', 'b'],
		}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate nested fields', function (done) {
		List.fields.textarr.validateInput({
			nested: {
				textarr: ['a', 'b'],
			},
		}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate nested fields with flat paths', function (done) {
		List.fields.textarr.validateInput({
			'nested.textarr': ['a', 'b'],
		}, function (result) {
			demand(result).eql(true);
			done();
		});
	});

	it('should validate a single string value', function (done) {
		List.fields.textarr.validateInput({
			textarr: 'a',
		}, function (result) {
			demand(result).eql(true);
			done();
		});
	});

	it('should validate truthy values', function (done) {
		var time = new Date();
		List.fields.textarr.validateInput({
			textarr: [1, 'a', true, false, null, undefined, [], {}, time],
		}, function (result) {
			demand(result).eql(true);
			done();
		});
	});

	it('should update top level fields', function (done) {
		var testItem = new List.model();
		List.fields.textarr.updateItem(testItem, {
			textarr: ['a', 'b'],
		}, function () {
			demand(testItem.textarr).eql(['a', 'b']);
			done();
		});
	});

	it('should update nested fields', function (done) {
		var testItem = new List.model();
		List.fields['nested.textarr'].updateItem(testItem, {
			nested: {
				textarr: ['a', 'b'],
			},
		}, function () {
			demand(testItem.nested.textarr).eql(['a', 'b']);
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		var testItem = new List.model();
		List.fields['nested.textarr'].updateItem(testItem, {
			'nested.textarr': ['a', 'b'],
		}, function () {
			demand(testItem.nested.textarr).eql(['a', 'b']);
			done();
		});
	});

	it('should update empty arrays', function (done) {
		var testItem = new List.model();
		List.fields.textarr.updateItem(testItem, {
			textarr: [],
		}, function () {
			demand(testItem.textarr).eql([]);
			done();
		});
	});

	it('should default on null', function (done) {
		var testItem = new List.model();
		List.fields.textarr.updateItem(testItem, {
			textarr: null,
		}, function () {
			demand(testItem.textarr).eql([]);
			done();
		});
	});

	it('should allow a single string value', function (done) {
		var testItem = new List.model();
		List.fields.textarr.updateItem(testItem, {
			textarr: 'a',
		}, function () {
			demand(testItem.textarr).eql(['a']);
			done();
		});
	});

	it('should convert truthy values with toString methods to strings', function (done) {
		var testItem = new List.model();
		var time = new Date();
		List.fields.textarr.updateItem(testItem, {
			textarr: [1, 'a', true, false, null, undefined, [], {}, time],
		}, function () {
			demand(testItem.textarr).eql(['1', 'a', 'true', '[object Object]', String(time)]);
			done();
		});
	});

	it('should use the default separator for formatting', function () {
		var testItem = new List.model({
			textarr: ['one', 'two', 'three'],
		});
		demand(testItem._.textarr.format()).be('one | two | three');
	});

	it('should use the provided separator for formatting', function () {
		var testItem = new List.model({
			textarr: ['one', 'two', 'three'],
		});
		demand(testItem._.textarr.format(', ')).be('one, two, three');
	});

	it('should use the specified separator for formatting', function () {
		var testItem = new List.model({
			customSeparator: ['one', 'two', 'three'],
		});
		demand(testItem._.customSeparator.format()).be('one * two * three');
	});

	/* Deprecated inputIsValid Tests */

	it('should validate input', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a'],
		})).be(true);
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a', 'b'],
		})).be(true);
	});

	it('should validate no input', function () {
		var testItem = new List.model();
		demand(List.fields.textarr.inputIsValid({})).be(true);
		demand(List.fields.textarr.inputIsValid({}, true)).be(false);
		testItem.textarr = ['a'];
		demand(List.fields.textarr.inputIsValid({}, true, testItem)).be(true);
	});

	it('should validate length when required', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: [],
		}, true)).be(false);
	});

	it('should invalidate arrays with complex values', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: [[]],
		}, true)).be(false);
	});
};
