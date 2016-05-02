var fieldTests = require('../commonFieldTestUtils.js');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Textarea field initial modal can be opened': fieldTests.openInitialForm({
		listName: 'Textarea',
	}),
	'Textarea field can be filled via the initial modal': fieldTests.fillInitialForm({
		listName: 'Textarea',
		fields: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Textarea field filled correctly via the initial modal': fieldTests.assertInitialFormUX({
		listName: 'Textarea',
		fields: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
		}
	}),
	'Textarea field can be created via the initial modal': fieldTests.saveInitialForm(),
	'New Textarea field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'New Textarea Textarea Field Test 1 created.'
	}),
	'Textarea field has been created correctly': fieldTests.assertEditFormUX({
		listName: 'Textarea',
		fields: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'}
		}
	}),
	'Textarea field can be filled via the edit form': fieldTests.fillEditForm({
		listName: 'Textarea',
		fields: {
			'fieldB': {value: 'Some test text for field B'}
		}
	}),
	'Textarea field changes can be saved via the edit form': fieldTests.saveEditForm(),
	'Updated Textarea field flash message is visible': fieldTests.assertFlashMessageUX({
		message: 'Your changes have been saved.'
	}),
	'Textarea field has been filled correctly': fieldTests.assertEditFormUX({
		listName: 'Textarea',
		fields: {
			'name': {value: 'Textarea Field Test 1'},
			'fieldA': {value: 'Some test text for field A'},
			'fieldB': {value: 'Some test text for field B'}
		}
	})
};
