var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Color field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		fieldName: 'Color',
		inputs: {
			'name': {value: 'Color Field Test 1'},
			'fieldA': {value: '#002147'},
		}
	}),
	'Color field can be filled via the edit form': fieldTests.assertEditFormUX({
		fieldName: 'Color',
		inputs: {
			'fieldB': {value: '#f8e71c'},
		}
	}),
};
