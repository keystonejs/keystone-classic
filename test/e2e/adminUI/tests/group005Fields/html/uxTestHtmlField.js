var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		fieldName: 'Html',
		inputs: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
		}
	}),
	'Html field can be filled via the edit form': fieldTests.assertEditFormUX({
		fieldName: 'Html',
		inputs: {
			'fieldB': {value: 'Some html code for field B'},
		}
	}),
};
