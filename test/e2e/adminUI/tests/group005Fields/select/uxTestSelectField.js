var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'},
		}
	}),
	'Select field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Select',
		inputs: {
			'fieldB': {value: 'Two'},
		}
	}),
};
