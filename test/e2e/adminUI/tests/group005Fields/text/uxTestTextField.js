var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field initial modal can be opened': fieldTests.openInitialFormUX({
		listName: 'Text',
	}),
	'Text field can be filled via the initial modal': fieldTests.fillInitialFormUX({
		listName: 'Text',
		inputs: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Text field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Text',
		inputs: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Text field can be created via the initial modal': fieldTests.saveInitialFormUX(),
	'New Text field flash message is visible': fieldTests.assertFlashMessage({
		message: 'New Text Text Field Test 1 created.'
	}),
	'Text field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Text',
		inputs: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'}
		}
	}),
	'Text field can be filled via the edit form': fieldTests.fillEditFormUX({
		listName: 'Text',
		inputs: {
			'fieldB': {value: 'Some test text for field B'}
		}
	}),
	'Text field changes can be saved via the edit form': fieldTests.saveEditFormUX(),
	'Updated Text field flash message is visible': fieldTests.assertFlashMessage({
		message: 'Your changes have been saved.'
	}),
	'Text field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Text',
		inputs: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
			'fieldB': {value: 'Some test text for field B'}
		}
	})
};
