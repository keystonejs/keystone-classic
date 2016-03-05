var demand = require('must');
var ColorType = require('../ColorType');
var validators = require('../../validators');

exports.initList = function (List) {
	List.add({
		color: { type: ColorType },
		nested: {
			color: { type: ColorType },
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
		List.fields.color.updateItem(testItem, {
			color: '#ffffff',
		}, function () {
			demand(testItem.color).be('#ffffff');
			testItem.color = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.color'].updateItem(testItem, {
			nested: {
				color: '#ffffff',
			},
		}, function () {
			demand(testItem.nested.color).be('#ffffff');
			testItem.nested.color = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.color'].updateItem(testItem, {
			'nested.color': '#ffffff',
		}, function () {
			demand(testItem.nested.color).be('#ffffff');
			testItem.nested.color = undefined;
			done();
		});
	});

	it('should use the common color input validator', function () {
		demand(List.fields.color.validateInput === validators.text.input);
	});

	it('should use the common color required validator', function () {
		demand(List.fields.color.validateRequiredInput === validators.text.required);
	});
};
