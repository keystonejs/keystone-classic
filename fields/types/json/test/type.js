const demand = require('must');
const JsonType = require('../JsonType');

exports.initList = function (List) {
	List.add({
		json: { type: JsonType },
		nested: {
			json: { type: JsonType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};


exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();

			List.fields.json.updateItem(testItem, {
				json: '{foo:bar}',
			},
			function () {
				demand(testItem.json).be('{foo:bar}');
				done();
			});
		});


		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.json'].updateItem(testItem, {
				nested: {
					json: '{foo:bar}',
				},
			},
			function () {
				demand(testItem.nested.json).be('{foo:bar}');
				done();
			});
		});


		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.json'].updateItem(testItem, {
				'nested.json': '{foo:bar}',
			},
			function () {
				demand(testItem.nested.json).be('{foo:bar}');
				done();
			});
		});


	});


};
