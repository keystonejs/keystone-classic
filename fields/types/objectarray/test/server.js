var demand = require('must'),
	ObjectArrayType = require('../ObjectArrayType');

exports.initList = function(List) {
	List.add({
		people: {
			type: ObjectArrayType,
			parts: {
				name: { label: 'Name' },
				favouriteNumber: { label: 'Favourite Number' }
			}
		}
	});
};

exports.testFieldType = function(List) {
	var testItem = new List.model();

	it('should default to an empty array', function() {
		demand(testItem.get('people')).eql([]);
	});

	it('should validate input', function() {
		demand(List.fields.people.validateInput({
			people: [{ name: 'batman' }]
		})).be(true);
		demand(List.fields.people.validateInput({
			people: [{ name: 'batman' }, { name: 'ironman' }]
		})).be(true);
	});

	it('should validate no input', function() {
		demand(List.fields.people.validateInput({})).be(true);
		demand(List.fields.people.validateInput({}, true)).be(false);
		testItem.people = [{ name: 'batman' }];
		demand(List.fields.people.validateInput({}, true, testItem)).be(true);
		testItem.people = undefined;
	});

	it('should validate length when required', function() {
		demand(List.fields.people.validateInput({
			people: []
		}, true)).be(false);
	});

	it('should update fields', function() {
		List.fields.people.updateItem(testItem, {
			people: [
				{ name: 'Bruce Wayne', favouriteNumber: '13' }
			]
		});
		demand(testItem.people).eql([{ name: 'Bruce Wayne', favouriteNumber: '13' }]);
		testItem.people = undefined;
	});

	it('should update empty arrays', function() {
		List.fields.people.updateItem(testItem, {
			people: []
		});
		demand(testItem.people).eql([]);
		testItem.people = undefined;
	});

	it('should default on null', function() {
		List.fields.people.updateItem(testItem, {
			people: null
		});
		demand(testItem.people).eql([]);
		testItem.people = undefined;
	});

	it('should not allow a single string value (fallback to empty array)', function() {
		List.fields.people.updateItem(testItem, {
			people: 'a'
		});

		demand(testItem.people).eql([]);
		testItem.people = undefined;
	});

	it('should allow whatever passed inside array', function() {
		List.fields.people.updateItem(testItem, {
			people: [[], {}]
		});
		demand(testItem.people).eql([[], {}]);
		testItem.people = undefined;
	});
};
