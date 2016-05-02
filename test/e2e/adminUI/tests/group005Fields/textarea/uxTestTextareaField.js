var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Textarea',
		inputs: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some text for field A'},
		}
	}),
	'Textarea field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Textarea',
		inputs: {
			'fieldB': {value: 'Some text for field B'},
		}
	}),
};
