var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Name',
	}),
	'Name field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Name',
		fields: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
		}
	}),
	'Name field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Name',
		fields: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
		}
	}),
	'Name field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Name field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Name Name Field Test 1 created.'
	}),
	'Name field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Name',
		fields: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'}
		}
	}),
	'Name field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Name',
		fields: {
			'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
		}
	}),
	'Name field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Name field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Name field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Name',
		fields: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
		}
	})
};
