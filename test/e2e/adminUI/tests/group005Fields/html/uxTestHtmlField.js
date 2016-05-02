var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Html',
	}),
	'Html field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Html',
		fields: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
		}
	}),
	'Html field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Html',
		fields: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
		}
	}),
	'Html field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Html field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Html Html Field Test 1 created.'
	}),
	'Html field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Html',
		fields: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'}
		}
	}),
	'Html field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Html',
		fields: {
			'fieldB': {value: 'Some html code for field B'}
		}
	}),
	'Html field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Html field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Html field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Html',
		fields: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
			'fieldB': {value: 'Some html code for field B'}
		}
	})
};
