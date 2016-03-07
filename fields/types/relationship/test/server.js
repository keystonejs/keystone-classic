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

	var testItem = new List.model();

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

		it('should invalidate object input', function (done) {
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
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).equal(true);
				done();
			});
		});

		it('should invalidate required not present input', function (done) {
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).equal(false);
				done();
			});
		});

		it('should validate required input with existing value', function (done) {
			testItem.single = relatedItem.id;
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).equal(true);
				testItem.single = undefined;
				done();
			});
		});
	});

};
