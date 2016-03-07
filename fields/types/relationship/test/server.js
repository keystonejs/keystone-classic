var demand = require('must');
var RelationshipType = require('../RelationshipType');

exports.initList = function (List) {
	// We can use relationships that refer to the same List to test
	List.add({
		single: { type: RelationshipType, ref: List.key },
	});
};

exports.testFieldType = function (List) {

	var relatedItem = new List.model();
	before(function (done) {
		relatedItem.save(done);
	});

	describe('single', function () {
		it('should validate id input', function (done) {
			List.fields.single.validateInput({ single: relatedItem.id }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.single.validateInput({}, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should invalidate empty input', function (done) {
			List.fields.single.validateInput({ single: '' }, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should invalidate boolean input', function (done) {
			List.fields.single.validateInput({ single: true }, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should validate item objects (object with id property)', function (done) {
			List.fields.single.validateInput({ single: relatedItem }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should invalidate object input without id', function (done) {
			List.fields.single.validateInput({ single: {} }, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.single.validateInput({ single: [] }, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should validate required present input', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should validate required present input with item', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should validate required present input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should invalidate required not present input', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should validate required input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should invalidate required blank input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: '' }, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should save the provided value', function (done) {
			var testItem = new List.model();
			List.fields.single.updateItem(testItem, { single: relatedItem.id }, function () {
				// TODO: We should be testing for errors here
				testItem.save(function (err, updatedItem) {
					List.model.findById(updatedItem.id, function (err, persistedData) {
						demand(String(persistedData.single)).equal(String(relatedItem.id));
						done();
					});
				});
			});
		});

		it('should save the provided value with an item object', function (done) {
			var testItem = new List.model();
			List.fields.single.updateItem(testItem, { single: relatedItem }, function () {
				// TODO: We should be testing for errors here
				testItem.save(function (err, updatedItem) {
					List.model.findById(updatedItem.id, function (err, persistedData) {
						demand(String(persistedData.single)).equal(String(relatedItem.id));
						done();
					});
				});
			});
		});

		it('should clear the current value when provided null', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			testItem.save(function (err) {
				List.fields.single.updateItem(testItem, { single: null }, function () {
					// TODO: We should be testing for errors here
					testItem.save(function (err, updatedItem) {
						List.model.findById(updatedItem.id, function (err, persistedData) {
							demand(persistedData.single).equal(null);
							done();
						});
					});
				});
			});
		});

		it('should clear the current value when provided ""', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			testItem.save(function (err) {
				List.fields.single.updateItem(testItem, { single: '' }, function () {
					// TODO: We should be testing for errors here
					testItem.save(function (err, updatedItem) {
						List.model.findById(updatedItem.id, function (err, persistedData) {
							demand(persistedData.single).equal(null);
							done();
						});
					});
				});
			});
		});
	});

};
