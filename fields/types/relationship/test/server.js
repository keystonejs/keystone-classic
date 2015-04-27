var demand = require('must'),
	RelationshipType = require('../RelationshipType');

exports.initList = function(List) {
	List.add({
		text: String,
		testRelationship: { type: RelationshipType, ref: 'Test', required: true, unique: true }
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should throw error if required field missing', function (done) {
		new List.model({
			text: 'value'
		}).save(function(err, data) {// eslint-disable-line no-unused-vars
			err.errors.testRelationship.message.must.equal('Path `testRelationship` is required.');
			done();
		});
	});

	it('should save without error if required field exists', function (done) {
		new List.model({
			text: 'value',
			testRelationship: testItem._id
		}).save(function(err, data) {
			if (err) {
				throw err;
			}
			
			demand(data.testRelationship).equal(testItem._id);
			demand(data.text).equal('value');
			done();
		});
	});

	it('should throw error if unique field gets non-unique data', function (done) {
		new List.model({
			text: 'value',
			testRelationship: testItem._id
		}).save(function(err, data) {// eslint-disable-line no-unused-vars
			demand(err.code).equal(11000);
			done();
		});
	});
};
