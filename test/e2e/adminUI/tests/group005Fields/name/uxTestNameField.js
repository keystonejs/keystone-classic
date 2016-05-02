var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Name field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Name',
	}),
	'Name field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Name',
		inputs: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
		}
	}),
	'Name field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Name',
		inputs: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
		}
	}),
	'Name field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Name field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Name Name Field Test 1 created.'
	}),
	'Name field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Name',
		inputs: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'}
		}
	}),
	'Name field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Name',
		inputs: {
			'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
		}
	}),
	'Name field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Name field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Name field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Name',
		inputs: {
			'name': {value: 'Name Field Test 1'},
			'fieldA': {firstName: 'First 1', lastName: 'Last 1'},
			'fieldB': {firstName: 'First 2', lastName: 'Last 2'}
		}
	})
};
