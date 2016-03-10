var demand = require('must');
var SelectType = require('../SelectType');

exports.initList = function (List) {
	List.add({
		select: { type: SelectType, options: 'one, two, three' },
		nested: {
			select: { type: SelectType, options: 'one, two, three' },
		},
		extraProps: { type: SelectType, options: [
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		] },
		numeric: { type: SelectType, numeric: true, options: [
			{ value: 1, label: 'one' },
			{ value: 2, label: 'two' },
			{ value: 3, label: 'three' },
		] },
	});
};

exports.testFieldType = function (List) {
	it('should update top level fields', function (done) {
		var testItem = new List.model();
		List.fields.select.updateItem(testItem, {
			select: 'one',
		}, function () {
			demand(testItem.select).be('one');
			done();
		});
	});

	it('should update nested fields', function (done) {
		var testItem = new List.model();
		List.fields['nested.select'].updateItem(testItem, {
			nested: {
				select: 'one',
			},
		}, function () {
			demand(testItem.nested.select).be('one');
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		var testItem = new List.model();
		List.fields['nested.select'].updateItem(testItem, {
			'nested.select': 'one',
		}, function () {
			demand(testItem.nested.select).be('one');
			done();
		});
	});

	it('should format values with the label of the option', function () {
		var testItem = new List.model({
			select: 'one',
		});
		demand(List.fields.select.format(testItem)).be('One');
	});

	it('should pluck custom properties from the selected option', function () {
		var testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem._.extraProps.pluck('custom')).be('2');
	});

	it('should return a blank string when formatting an undefined value', function () {
		var testItem = new List.model();
		demand(List.fields.select.format(testItem)).be('');
	});

	it('should return a shallow clone of the options', function () {
		var clonedOps = List.fields.select.cloneOps();
		demand(clonedOps).eql(List.fields.select.ops);
		demand(clonedOps).not.equal(List.fields.select.ops);
	});
};
