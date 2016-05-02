var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Code field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Code',
	}),
	'Code field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Code',
		fields: {
			'name': {value: 'Code Field Test 1'},
			'fieldA': {value: 'Some test code for field A'},
		}
	}),
	'Code field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Code',
		fields: {
			'name': {value: 'Code Field Test 1'},
			'fieldA': {value: 'Some test code for field A'},
		}
	}),
	'Code field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Code field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Code Code Field Test 1 created.'
	}),
	'Code field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Code',
		fields: {
			'name': {value: 'Code Field Test 1'},
			'fieldA': {value: 'Some test code for field A'}
		}
	}),
	/* TODO Removed pending code's fillInput function filling the correct field.
	'Code field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Code',
		fields: {
			'fieldB': {value: 'Some test code for field B'}
		}
	}),
	'Code field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Code field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Code field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Code',
		fields: {
			'name': {value: 'Code Field Test 1'},
			'fieldA': {value: 'Some test code for field A'},
			'fieldB': {value: 'Some test code for field B'}
		}
	})
	*/
};
