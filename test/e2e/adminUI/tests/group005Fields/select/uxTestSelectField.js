var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Select field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Select',
	}),
	'Select field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'},
		}
	}),
	'Select field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'},
		}
	}),
	'Select field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Select field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Select Select Field Test 1 created.'
	}),
	'Select field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'}
		}
	}),
	/* TODO pending select's fillInput function actually filling the correct field
	'Select field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Select',
		inputs: {
			'fieldB': {value: 'Two'}
		}
	}),
	'Select field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Select field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Select field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Select',
		inputs: {
			'name': {value: 'Select Field Test 1'},
			'fieldA': {value: 'One'},
			'fieldB': {value: 'Two'}
		}
	})
	*/
};
