var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Text',
	}),
	'Text field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Text',
		fields: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Text field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Text',
		fields: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Text field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Text field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Text Text Field Test 1 created.'
	}),
	'Text field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Text',
		fields: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'}
		}
	}),
	'Text field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Text',
		fields: {
			'fieldB': {value: 'Some test text for field B'}
		}
	}),
	'Text field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Text field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Text field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Text',
		fields: {
			'name': {value: 'Text Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
			'fieldB': {value: 'Some test text for field B'}
		}
	})
};
