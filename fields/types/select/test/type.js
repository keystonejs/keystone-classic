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
		emptyStringSelect: { type: SelectType, options: [
			{ value: '', label: '' },
			{ value: 'two', label: 'Two' },
		] },
	});
};

exports.testFieldType = function (List) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noOptions: { type: SelectType },
				});
			} catch (err) {
				demand(err.message).eql('Select fields require an options array.');
				done();
			}
		});
	});

	describe('validateInput', function () {
		it('should validate top level selects', function (done) {
			List.fields.select.validateInput({
				select: 'one',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested selects', function (done) {
			List.fields['nested.select'].validateInput({
				nested: {
					select: 'one',
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.select.validateInput({
				select: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.select.validateInput({
				select: null,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an empty string', function (done) {
			List.fields.select.validateInput({
				select: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an empty string if specified as an option', function (done) {
			List.fields.emptyStringSelect.validateInput({
				emptyStringSelect: '',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numbers', function (done) {
			List.fields.select.validateInput({
				select: 1,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate numbers when numeric is set to true', function (done) {
			List.fields.numeric.validateInput({
				numeric: 1,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate number strings when numeric is set to true', function (done) {
			List.fields.numeric.validateInput({
				numeric: '1',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate non existing options', function (done) {
			List.fields.select.validateInput({
				select: 'four',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate two selected options', function (done) {
			List.fields.select.validateInput({
				select: 'one, two',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.select.validateInput({
				select: true,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.select.validateInput({
				select: false,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate a selected option', function (done) {
			var testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: 'one',
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested select', function (done) {
			var testItem = new List.model();
			List.fields['nested.select'].validateRequiredInput(testItem, {
				nested: {
					select: 'one',
				},
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested select with a flat path', function (done) {
			List.fields.select.validateInput({
				'nested.select': ['a', 'b'],
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			var testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: undefined,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			var testItem = new List.model({
				select: 'one',
			});
			List.fields.select.validateRequiredInput(testItem, {
				select: undefined,
			}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: null,
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty string even if specified as an option', function (done) {
			var testItem = new List.model();
			List.fields.emptyStringSelect.validateRequiredInput(testItem, {
				emptyStringSelect: '',
			}, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', function () {
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
	});

	describe('addFilterToQuery', function () {
		it('should filter by an array', function () {
			var result = List.fields.select.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			demand(result.select).eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should support inverted mode for an array', function () {
			var result = List.fields.select.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			demand(result.select).eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by a string', function () {
			var result = List.fields.select.addFilterToQuery({
				value: 'a string',
			});
			demand(result.select).eql('a string');
		});

		it('should support inverted mode for a string', function () {
			var result = List.fields.select.addFilterToQuery({
				value: 'a string',
				inverted: true,
			});
			demand(result.select).eql({
				$ne: 'a string',
			});
		});

		it('should filter by existance if no value exists', function () {
			var result = List.fields.select.addFilterToQuery({});
			demand(result.select).eql({
				$in: ['', null],
			});
		});

		it('should filter by non-existance if no value exists', function () {
			var result = List.fields.select.addFilterToQuery({
				inverted: true,
			});
			demand(result.select).eql({
				$nin: ['', null],
			});
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

	it('should have the label in nameLabel', function () {
		var testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsLabel).be('Two');
	});

	it('should have the current data in nameData', function () {
		var testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsData).eql({
			value: 'two', label: 'Two', custom: '2',
		});
	});

	it('should have the options in nameOption', function () {
		var testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsOptions).eql([
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		]);
	});

	it('should have the options map in nameOptionsMap', function () {
		var testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsOptionsMap).eql({
			one: {
				value: 'one', label: 'One', custom: '1',
			},
			two: {
				value: 'two', label: 'Two', custom: '2',
			},
		});
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
