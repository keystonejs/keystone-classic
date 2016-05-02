var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Name',
		inputs: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
		}
	}),
	'Name field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Name',
		inputs: {
			'fieldB': {firstName: 'First 2', lastName: 'Last 2'},
		}
	}),
};
