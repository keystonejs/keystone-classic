var demand = require('must');
var RelationshipType = require('../RelationshipType');

exports.initList = function (List) {
	// We can use relationships that refer to the same List to test
	List.add({
		single: { type: RelationshipType, ref: List.key },
		many: { type: RelationshipType, ref: List.key, many: true },
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
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.single.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty input', function (done) {
			List.fields.single.validateInput({ single: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.single.validateInput({ single: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate boolean input', function (done) {
			List.fields.single.validateInput({ single: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate item objects (object with id property)', function (done) {
			List.fields.single.validateInput({ single: relatedItem }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate object input without id', function (done) {
			List.fields.single.validateInput({ single: {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.single.validateInput({ single: [] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate required present input', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate required present input with item', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate required present input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate required not present input', function (done) {
			var testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate required input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate required blank input with existing value', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: '' }, function (result) {
				demand(result).be.false();
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
							demand(persistedData.single).be.null();
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
							demand(persistedData.single).be.null();
							done();
						});
					});
				});
			});
		});

		it('should clear the current value when data object does not contain the field', function (done) {
			var testItem = new List.model({
				single: relatedItem.id,
			});
			testItem.save(function (err) {
				List.fields.single.updateItem(testItem, {}, function () {
					testItem.save(function (err, updatedItem) {
						List.model.findById(updatedItem.id, function (err, persistedData) {
							demand(persistedData.single).be.null();
							done();
						});
					});
				});
			});
		});
	});

	describe('many', function () {
		it('should validate id input', function (done) {
			List.fields.many.validateInput({ many: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty array input', function (done) {
			List.fields.many.validateInput({ many: [] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.many.validateInput({ many: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate array input with ids', function (done) {
			List.fields.many.validateInput({ many: [relatedItem.id] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate arrays of item objects (object with id property)', function (done) {
			List.fields.many.validateInput({ many: [relatedItem] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.many.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should clear the current values when data object does not contain the field', function (done) {
			var testItem = new List.model({
				many: [relatedItem.id, relatedItem.id],
			});
			testItem.save(function (err) {
				List.fields.many.updateItem(testItem, {}, function () {
					testItem.save(function (err, updatedItem) {
						List.model.findById(updatedItem.id, function (err, persistedData) {
							demand(persistedData.many).to.eql([]);
							done();
						});
					});
				});
			});
		});

		it('should update the current values with the new values from the data object', function (done) {
			var testItem = new List.model({
				many: [relatedItem.id, relatedItem.id, relatedItem.id],
			});
			testItem.save(function (err) {
				List.fields.many.updateItem(testItem, { many: [relatedItem.id, relatedItem.id] }, function () {
					testItem.save(function (err, updatedItem) {
						List.model.findById(updatedItem.id, function (err, persistedData) {
							demand(String(persistedData.many)).to.eql(String([relatedItem.id, relatedItem.id]));
							done();
						});
					});
				});
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter arrays', function () {
			var result = List.fields.single.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			demand(result.single).eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should convert a single string to an array and filter that', function () {
			var result = List.fields.single.addFilterToQuery({
				value: 'a string',
			});
			demand(result.single).eql({
				$in: ['a string'],
			});
		});

		it('should support inverted filtering with an array', function () {
			var result = List.fields.single.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			demand(result.single).eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by existance if no value is specified', function () {
			var result = List.fields.single.addFilterToQuery({});
			demand(result.single).be.null();
		});

		it('should filter by non-existance if no value is specified', function () {
			var result = List.fields.single.addFilterToQuery({
				inverted: true,
			});
			demand(result.single).eql({
				$ne: null,
			});
		});

		it('should filter by emptiness if many is true and no value is specified', function () {
			var result = List.fields.many.addFilterToQuery({});
			demand(result.many).eql({
				$size: 0,
			});
		});

		it('should filter by non-emptiness if many is true and no value is specified', function () {
			var result = List.fields.many.addFilterToQuery({
				inverted: true,
			});
			demand(result.many).eql({
				$not: {
					$size: 0,
				},
			});
		});
	});
};
