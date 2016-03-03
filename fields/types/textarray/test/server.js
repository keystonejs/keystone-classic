var demand = require('must');
var TextArrayType = require('../TextArrayType');

exports.initList = function (List) {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should default to an empty array', function () {
		demand(testItem.get('textarr')).eql([]);
	});

	it('should validate input', function () {
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a'],
		})).be(true);
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a', 'b'],
		})).be(true);
	});

	it('should validate no input', function () {
		demand(List.fields.textarr.inputIsValid({})).be(true);
		demand(List.fields.textarr.inputIsValid({}, true)).be(false);
		testItem.textarr = ['a'];
		demand(List.fields.textarr.inputIsValid({}, true, testItem)).be(true);
		testItem.textarr = undefined;
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

	it('should update top level fields', function (done) {
		List.fields.textarr.updateItem(testItem, {
			textarr: ['a', 'b'],
		}, function () {
			demand(testItem.textarr).eql(['a', 'b']);
			testItem.textarr = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.textarr'].updateItem(testItem, {
			nested: {
				textarr: ['a', 'b'],
			},
		}, function () {
			demand(testItem.nested.textarr).eql(['a', 'b']);
			testItem.nested.textarr = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.textarr'].updateItem(testItem, {
			'nested.textarr': ['a', 'b'],
		}, function () {
			demand(testItem.nested.textarr).eql(['a', 'b']);
			testItem.nested.textarr = undefined;
			done();
		});
	});

	it('should update empty arrays', function (done) {
		List.fields.textarr.updateItem(testItem, {
			textarr: [],
		}, function () {
			demand(testItem.textarr).eql([]);
			testItem.textarr = undefined;
			done();
		});
	});

	it('should default on null', function (done) {
		List.fields.textarr.updateItem(testItem, {
			textarr: null,
		}, function () {
			demand(testItem.textarr).eql([]);
			testItem.textarr = undefined;
			done();
		});
	});

	it('should allow a single string value', function (done) {
		List.fields.textarr.updateItem(testItem, {
			textarr: 'a',
		}, function () {
			demand(testItem.textarr).eql(['a']);
			testItem.textarr = undefined;
			done();
		});
	});

	it('should convert truthy values with toString methods to strings', function (done) {
		var time = new Date();
		List.fields.textarr.updateItem(testItem, {
			textarr: [1, 'a', true, false, null, undefined, [], {}, time],
		}, function () {
			demand(testItem.textarr).eql(['1', 'a', 'true', '[object Object]', String(time)]);
			testItem.textarr = undefined;
			done();
		});
	});
};
