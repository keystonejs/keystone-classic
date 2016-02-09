var demand = require('must');
var DateArrayType = require('../DateArrayType');

exports.initList = function (List) {
	List.add({
		datearr: { type: DateArrayType },
		nested: {
			datearr: { type: DateArrayType },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should default to an empty array', function () {
		demand(testItem.get('datearr')).eql([]);
	});

	it('should validate input', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: '2015-03-03',
		})).be(true);
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2015-03-03'],
		})).be(true);
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2015-03-03', '2015-03-04'],
		})).be(true);
	});

	it('should validate no input', function () {
		demand(List.fields.datearr.inputIsValid({})).be(true);
		demand(List.fields.datearr.inputIsValid({}, true)).be(false);
		testItem.datearr = ['2015-03-03'];
		demand(List.fields.datearr.inputIsValid({}, true, testItem)).be(true);
		testItem.datearr = undefined;
	});

	it('should validate length when required', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: [],
		}, true)).be(false);
	});

	it('should invalidate arrays with invalid dates', function () {
		demand(List.fields.datearr.inputIsValid({
			datearr: 'not a real date',
		})).be(false);
		demand(List.fields.datearr.inputIsValid({
			datearr: ['2001-01-35'],
		})).be(false);
		demand(List.fields.datearr.inputIsValid({
			datearr: ['35-34-3210', '2001-01-01'],
		})).be(false);
	});

	it('should update top level fields', function (done) {
		List.fields.datearr.updateItem(testItem, {
			datearr: ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
		}, function () {
			demand(testItem.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
			testItem.datearr = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.datearr'].updateItem(testItem, {
			nested: {
				datearr: ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
			},
		}, function () {
			demand(testItem.nested.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
			testItem.nested.datearr = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.datearr'].updateItem(testItem, {
			'nested.datearr': ['2015-01-01', '2015-01-02', '2015-01-03', '2015-01-04'],
		}, function () {
			demand(testItem.nested.datearr).eql([new Date('2015-01-01'), new Date('2015-01-02'), new Date('2015-01-03'), new Date('2015-01-04')]);
			testItem.nested.datearr = undefined;
			done();
		});
	});

	it('should update empty arrays', function (done) {
		List.fields.datearr.updateItem(testItem, {
			datearr: [],
		}, function () {
			demand(testItem.datearr).eql([]);
			testItem.datearr = undefined;
			done();
		});
	});

	it('should default on null', function (done) {
		List.fields.datearr.updateItem(testItem, {
			datearr: null,
		}, function () {
			demand(testItem.datearr).eql([]);
			testItem.datearr = undefined;
			done();
		});
	});

	it('should allow a single date value', function (done) {
		List.fields.datearr.updateItem(testItem, {
			datearr: '2015-01-01',
		}, function () {
			demand(testItem.datearr).eql([new Date('2015-01-01')]);
			testItem.datearr = undefined;
			done();
		});
	});
};
