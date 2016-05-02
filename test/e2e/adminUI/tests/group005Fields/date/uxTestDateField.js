var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Date field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Date',
		inputs: {
			'name': {value: 'Date Field Test 1'},
			'fieldA': {value: '2016-01-01'},
		}
	}),
	'Date field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Date',
		inputs: {
			'fieldB': {value: '2016-01-02'},
		}
	}),
};
