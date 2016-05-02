var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Url field can be filled via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Url',
		inputs: {
			'name': {value: 'Url Field Test 1'},
			'fieldA': {value: 'www.example1.com'},
		}
	}),
	'Url field can be filled via the edit form': fieldTests.assertEditFormUX({
		listName: 'Url',
		inputs: {
			'fieldB': {value: 'www.example2.com'}
		}
	}),
};
