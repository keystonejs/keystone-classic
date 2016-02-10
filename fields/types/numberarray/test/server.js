var demand = require('must');
var NumberArrayType = require('../NumberArrayType');

exports.initList = function (List) {
	List.add({
		numarr: { type: NumberArrayType },
		nested: {
			numarr: { type: NumberArrayType },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should default to an empty array', function () {
		demand(testItem.get('numarr')).eql([]);
	});

	it('should validate input', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [1],
		})).be(true);
		demand(List.fields.numarr.inputIsValid({
			numarr: [1, 2],
		})).be(true);
	});

	it('should validate no input', function () {
		demand(List.fields.numarr.inputIsValid({})).be(true);
		demand(List.fields.numarr.inputIsValid({}, true)).be(false);
		testItem.numarr = [1];
		demand(List.fields.numarr.inputIsValid({}, true, testItem)).be(true);
		testItem.numarr = undefined;
	});

	it('should validate length when required', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [],
		}, true)).be(false);
	});

	it('should validate arrays with numeric string values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: ['1'],
		})).be(true);
	});

	it('should invalidate arrays with non-numeric string values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: ['a'],
		})).be(false);
	});

	it('should invalidate arrays with complex values', function () {
		demand(List.fields.numarr.inputIsValid({
			numarr: [[]],
		}, true)).be(false);
	});

	it('should update top level fields', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: [1, 2, 3, 42],
		}, function () {
			demand(testItem.numarr).eql([1, 2, 3, 42]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.numarr'].updateItem(testItem, {
			nested: {
				numarr: [1, 2, 3, 42],
			},
		}, function () {
			demand(testItem.nested.numarr).eql([1, 2, 3, 42]);
			testItem.nested.numarr = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.numarr'].updateItem(testItem, {
			'nested.numarr': [1, 2, 3, 42],
		}, function () {
			demand(testItem.nested.numarr).eql([1, 2, 3, 42]);
			testItem.nested.numarr = undefined;
			done();
		});
	});

	it('should update empty arrays', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: [],
		}, function () {
			demand(testItem.numarr).eql([]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should default on null', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: null,
		}, function () {
			demand(testItem.numarr).eql([]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should allow a single numeric value', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: 1,
		}, function () {
			demand(testItem.numarr).eql([1]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should convert strings to numbers', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: '1',
		}, function () {
			demand(testItem.numarr).eql([1]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should allow decimals', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: [0.1, '0.2'],
		}, function () {
			demand(testItem.numarr).eql([0.1, 0.2]);
			testItem.numarr = undefined;
			done();
		});
	});

	it('should ignore non-numeric strings and complex values', function (done) {
		List.fields.numarr.updateItem(testItem, {
			numarr: ['1', 'two', {}, 42],
		}, function () {
			demand(testItem.numarr).eql([1, 42]);
			testItem.numarr = undefined;
			done();
		});
	});
};
