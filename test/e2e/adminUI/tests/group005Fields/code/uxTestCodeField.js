var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Code',
		inputs: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'Some test code for field A'},
		}
	}),
	'Code field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Code',
		inputs: {
			'fieldB': {value: 'Some test code for field B'},
		}
	}),
};
