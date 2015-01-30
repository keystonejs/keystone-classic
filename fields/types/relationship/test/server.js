var assert = require('assert'),
	keystone = require('../../../..'),
	demand = require('must'),
	UpdateHandler = require('../../../../lib/updateHandler');

exports.initList = function(List) {
	List.add({
		text: keystone.Field.Types.Text,
		testRelationship: { type: keystone.Field.Types.Relationship, ref: 'Test', required: true, unique: true }
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should throw error if required field missing', function (done) {
		new List.model({
			text: 'value'
		}).save(function(err, data) {
			err.errors.testRelationship.message.must.equal('Path `testRelationship` is required.');
			done();
		});
	});

	it('should save without error if required field exists', function (done) {
		new List.model({
			text: 'value',
			testRelationship: testItem._id
		}).save(function(err, data) {
			if (err)
				throw new err;
			demand(data.testRelationship).equal(testItem._id);
			demand(data.text).equal('value');
			done();
		});
	});

	it('should throw error if unique field gets non-unique data', function (done) {
		new List.model({
			text: 'value',
			testRelationship: testItem._id
		}).save(function(err, data) {
			err.err.must.match(/insertDocument :: caused by :: 11000 E11000 duplicate key error.*testRelationship_1/);
			done();
		});
	});
};
