var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Html',
	}),
	'Html field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Html',
		inputs: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
		}
	}),
	'Html field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Html',
		inputs: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
		}
	}),
	'Html field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Html field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Html Html Field Test 1 created.'
	}),
	'Html field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Html',
		inputs: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'}
		}
	}),
	'Html field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Html',
		inputs: {
			'fieldB': {value: 'Some html code for field B'}
		}
	}),
	'Html field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Html field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Html field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Html',
		inputs: {
			'name': {value: 'Html Field Test 1'},
			'fieldA': {value: 'Some html code for field A'},
			'fieldB': {value: 'Some html code for field B'}
		}
	})
};
