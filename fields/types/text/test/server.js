var demand = require('must');

exports.initList = function (List) {
	List.add({
		text: String,
		nested: {
			text: String,
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
};
