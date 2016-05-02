var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		fieldName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'},
		}
	}),
	'Select field can be filled via the edit form': fieldTests.assertEditFormUX({
		fieldName: 'Select',
		inputs: {
			'fieldB': {value: 'Two'},
		}
	}),
};
